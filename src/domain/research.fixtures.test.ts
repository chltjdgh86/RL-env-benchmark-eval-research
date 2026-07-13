import { describe, expect, it } from "vitest"
import { parseResearchCorpus, researchCorpus } from "../data/research"
import { parseSupplementalAdjacent, supplementalAdjacent } from "../data/supplemental"

describe("research corpus integrity fixtures", () => {
  it("rejects duplicate collection IDs", () => {
    const givenDuplicateSource = {
      ...researchCorpus,
      sources: researchCorpus.sources.map((source, index) =>
        index === 1 ? { ...source, sourceId: researchCorpus.sources[0]?.sourceId } : source,
      ),
    }

    const whenParsed = () => parseResearchCorpus(givenDuplicateSource)

    expect(whenParsed).toThrow("DUPLICATE_ID")
  })

  it("rejects an evidence link whose observation belongs to another source", () => {
    const replacementSourceId = researchCorpus.sources[1]?.sourceId
    const givenMismatchedEvidence = {
      ...researchCorpus,
      claims: researchCorpus.claims.map((claim, claimIndex) => ({
        ...claim,
        evidenceLinks: claim.evidenceLinks.map((link, linkIndex) =>
          claimIndex === 0 && linkIndex === 0 && replacementSourceId !== undefined
            ? { ...link, sourceId: replacementSourceId }
            : link,
        ),
      })),
    }

    const whenParsed = () => parseResearchCorpus(givenMismatchedEvidence)

    expect(whenParsed).toThrow("OBSERVATION_SOURCE_MISMATCH")
  })

  it("rejects a forged independent alignment on subject-controlled evidence", () => {
    const givenForgedAlignment = {
      ...researchCorpus,
      claims: researchCorpus.claims.map((claim, claimIndex) => ({
        ...claim,
        evidenceLinks: claim.evidenceLinks.map((link, linkIndex) =>
          claimIndex === 0 && linkIndex === 0
            ? { ...link, claimAlignment: "editorial_independent" }
            : link,
        ),
      })),
    }

    const whenParsed = () => parseResearchCorpus(givenForgedAlignment)

    expect(whenParsed).toThrow("CLAIM_ALIGNMENT_MISMATCH")
  })

  it("rejects a noncanonical claim backlink", () => {
    const givenUnknownHashKey = {
      ...researchCorpus,
      claims: researchCorpus.claims.map((claim, index) =>
        index === 0 ? { ...claim, canonicalHash: `${claim.canonicalHash}&unknown=value` } : claim,
      ),
    }

    const whenParsed = () => parseResearchCorpus(givenUnknownHashKey)

    expect(whenParsed).toThrow("NONCANONICAL_CLAIM_HASH")
  })

  it("rejects a one-sided company-to-industry relationship", () => {
    const removedCompanyId = researchCorpus.companies[0]?.companyId
    const givenOneSidedRelationship = {
      ...researchCorpus,
      industries: researchCorpus.industries.map((industry) => ({
        ...industry,
        companyIds: industry.companyIds.filter((companyId) => companyId !== removedCompanyId),
      })),
    }

    const whenParsed = () => parseResearchCorpus(givenOneSidedRelationship)

    expect(whenParsed).toThrow("RECIPROCAL_LINK_MISMATCH")
  })

  it("rejects unknown object keys at the parse boundary", () => {
    const givenLegacyKey = {
      ...researchCorpus,
      sources: researchCorpus.sources.map((source, index) =>
        index === 0 ? { ...source, legacyType: "primary" } : source,
      ),
    }

    const whenParsed = () => parseResearchCorpus(givenLegacyKey)

    expect(whenParsed).toThrow(/unrecognized key/iu)
  })

  it("rejects a legacy source-type enum value", () => {
    const givenLegacyEnum = {
      ...researchCorpus,
      sources: researchCorpus.sources.map((source, index) =>
        index === 0 ? { ...source, sourceType: "press_release" } : source,
      ),
    }

    const whenParsed = () => parseResearchCorpus(givenLegacyEnum)

    expect(whenParsed).toThrow()
  })

  it("rejects an analysis that references an unknown claim", () => {
    const givenUnknownAnalysisClaim = {
      ...researchCorpus,
      marketAnalysis: researchCorpus.marketAnalysis.map((analysis) =>
        analysis.analysisType === "history_event"
          ? { ...analysis, claimIds: ["clm_unknown-analysis"] }
          : analysis,
      ),
    }

    const whenParsed = () => parseResearchCorpus(givenUnknownAnalysisClaim)

    expect(whenParsed).toThrow("UNKNOWN_CLAIM_ID")
  })

  it("rejects a confirmation state without the required evidence alignment", () => {
    const confirmed = researchCorpus.buyerEvidence.find(
      (buyer) => buyer.evidenceState === "buyer_confirmed",
    )
    const givenForgedConfirmation = {
      ...researchCorpus,
      buyerEvidence: researchCorpus.buyerEvidence.map((buyer) =>
        buyer.buyerEvidenceId === confirmed?.buyerEvidenceId
          ? { ...buyer, evidenceState: "procurement_confirmed" }
          : buyer,
      ),
    }

    const whenParsed = () => parseResearchCorpus(givenForgedConfirmation)

    expect(whenParsed).toThrow("BUYER_CONFIRMATION_ALIGNMENT_MISMATCH")
  })

  it("rejects an unconfirmed buyer from a canonical GTM motion", () => {
    const gtmBuyerId = researchCorpus.marketAnalysis.find(
      (analysis) => analysis.analysisType === "gtm_motion",
    )?.buyerEvidenceIds[0]
    const givenUnconfirmedMotion = {
      ...researchCorpus,
      buyerEvidence: researchCorpus.buyerEvidence.map((buyer) =>
        buyer.buyerEvidenceId === gtmBuyerId
          ? { ...buyer, evidenceState: "vendor_reported_only" }
          : buyer,
      ),
    }

    const whenParsed = () => parseResearchCorpus(givenUnconfirmedMotion)

    expect(whenParsed).toThrow("UNCONFIRMED_GTM_BUYER")
  })

  it("keeps the post-cutoff census outside core counts", () => {
    const givenCoreAdjacentCount = researchCorpus.adjacent.length
    const whenSupplementalIsRead = supplementalAdjacent.records.length

    expect({ givenCoreAdjacentCount, whenSupplementalIsRead }).toEqual({
      givenCoreAdjacentCount: 63,
      whenSupplementalIsRead: 47,
    })
  })

  it("rejects premature promotion of a supplemental observation", () => {
    const givenPrematurePromotion = {
      ...supplementalAdjacent,
      records: supplementalAdjacent.records.map((record, recordIndex) => ({
        ...record,
        observationCandidates: record.observationCandidates.map((observation, observationIndex) =>
          recordIndex === 0 && observationIndex === 0
            ? { ...observation, canonicalReady: true }
            : observation,
        ),
      })),
    }

    const whenParsed = () => parseSupplementalAdjacent(givenPrematurePromotion)

    expect(whenParsed).toThrow("SUPPLEMENTAL_PREMATURE_PROMOTION")
  })

  it("rejects a supplemental relationship with an unknown origin", () => {
    const givenDanglingRelationship = {
      ...supplementalAdjacent,
      relationships: supplementalAdjacent.relationships.map((relationship, index) =>
        index === 0 ? { ...relationship, fromId: "adj_unknown-record" } : relationship,
      ),
    }

    const whenParsed = () => parseSupplementalAdjacent(givenDanglingRelationship)

    expect(whenParsed).toThrow("SUPPLEMENTAL_RELATIONSHIP_MISMATCH")
  })
})
