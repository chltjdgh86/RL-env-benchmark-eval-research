import type { ClaimAlignment } from "../domain/enums"
import type { ResearchCorpus } from "./corpus-schema"
import { CorpusIntegrityError } from "./corpus-schema"

const fail = (code: string, path: string, detail: string): never => {
  throw new CorpusIntegrityError(code, path, detail)
}

const confirmationAlignment = (
  state: ResearchCorpus["buyerEvidence"][number]["evidenceState"],
): ClaimAlignment | null => {
  if (state === "buyer_confirmed") return "buyer_controlled"
  if (state === "procurement_confirmed") return "regulator_authoritative"
  return null
}

export function assertBuyerCrossKeys(corpus: ResearchCorpus): void {
  const claims = new Map(corpus.claims.map((claim) => [claim.claimId, claim]))
  const observations = new Set(corpus.observations.map((observation) => observation.observationId))
  const companies = new Map(corpus.companies.map((company) => [company.companyId, company]))
  const adjacent = new Set(corpus.adjacent.map((record) => record.adjacentId))
  for (const buyer of corpus.buyerEvidence) {
    const path = `buyerEvidence.${buyer.buyerEvidenceId}`
    const claimIds =
      buyer.buyerNameClaimId === null
        ? [...buyer.claimIds, ...buyer.outcomeClaimIds]
        : [buyer.buyerNameClaimId, ...buyer.claimIds, ...buyer.outcomeClaimIds]
    for (const claimId of claimIds) {
      if (!claims.has(claimId)) fail("UNKNOWN_CLAIM_ID", path, claimId)
    }
    for (const observationId of buyer.observationIds) {
      if (!observations.has(observationId)) fail("UNKNOWN_OBSERVATION_ID", path, observationId)
    }
    if ("companyId" in buyer) {
      const company = companies.get(buyer.companyId)
      if (company === undefined) {
        fail("UNKNOWN_COMPANY_ID", path, buyer.companyId)
      } else if (!company.buyerEvidenceIds.includes(buyer.buyerEvidenceId)) {
        fail("RECIPROCAL_LINK_MISMATCH", path, buyer.companyId)
      }
    } else if (!adjacent.has(buyer.adjacentId)) {
      fail("UNKNOWN_ADJACENT_ID", path, buyer.adjacentId)
    }
    const requiredAlignment = confirmationAlignment(buyer.evidenceState)
    if (requiredAlignment === null) continue
    const observationIds = new Set(buyer.observationIds)
    const aligned = buyer.claimIds.some((claimId) =>
      claims
        .get(claimId)
        ?.evidenceLinks.some(
          (link) =>
            observationIds.has(link.observationId) && link.claimAlignment === requiredAlignment,
        ),
    )
    if (!aligned) fail("BUYER_CONFIRMATION_ALIGNMENT_MISMATCH", path, requiredAlignment)
  }
}
