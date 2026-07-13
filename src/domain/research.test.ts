import { describe, expect, it } from "vitest"
import { parseResearchCorpus, researchCorpus, researchIndex } from "../data/research"

describe("canonical research corpus", () => {
  it("rejects an observation when its source reference is unknown", () => {
    const givenInputWithUnknownSource = {
      ...researchCorpus,
      observations: researchCorpus.observations.map((observation, index) =>
        index === 0 ? { ...observation, sourceId: "src_unknown-source" } : observation,
      ),
    }

    const whenParsed = () => parseResearchCorpus(givenInputWithUnknownSource)

    expect(whenParsed, "UNKNOWN_SOURCE_ID").toThrow()
  })

  it("parses every cutoff-locked collection into matching readonly indexes", () => {
    const givenCollectionCounts = [235, 235, 561, 10, 9, 63, 10, 25, 31, 70]
    const whenCorpusIsLoaded = [
      researchCorpus.sources.length,
      researchCorpus.observations.length,
      researchCorpus.claims.length,
      researchCorpus.companies.length,
      researchCorpus.industries.length,
      researchCorpus.adjacent.length,
      researchCorpus.buyerEvidence.length,
      researchCorpus.marketAnalysis.length,
      researchCorpus.strategies.length,
      researchCorpus.receipts.length,
    ]
    const indexedCoreCounts = [
      researchIndex.sourcesById.size,
      researchIndex.observationsById.size,
      researchIndex.claimsById.size,
      researchIndex.companiesById.size,
      researchIndex.industriesById.size,
      researchIndex.adjacentById.size,
      researchIndex.buyerEvidenceById.size,
      researchIndex.marketAnalysisById.size,
      researchIndex.strategiesById.size,
      researchIndex.receiptsById.size,
    ]

    expect(whenCorpusIsLoaded).toEqual(givenCollectionCounts)
    expect(indexedCoreCounts).toEqual(givenCollectionCounts)
    expect(researchIndex.relationshipsByClaimId.size).toBe(researchCorpus.claims.length)
    const linkedSourceCount = new Set(
      researchCorpus.claims.flatMap((claim) => claim.evidenceLinks.map((link) => link.sourceId)),
    ).size
    expect(researchIndex.relationshipsBySourceId.size).toBe(linkedSourceCount)
    expect(researchIndex.corpus).toBe(researchCorpus)
  })
})
