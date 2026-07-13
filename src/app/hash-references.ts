import type { ResearchIndex } from "../data/research"
import type { HashReferenceIndex } from "../domain/hash-state"

export function buildHashReferences(index: ResearchIndex): HashReferenceIndex {
  return {
    companyIds: index.corpus.companies.map((company) => company.companyId),
    buyerEvidenceIds: index.corpus.buyerEvidence.map((buyer) => buyer.buyerEvidenceId),
    claimIds: index.corpus.claims.map((claim) => claim.claimId),
    sourceIds: index.corpus.sources.map((source) => source.sourceId),
  }
}
