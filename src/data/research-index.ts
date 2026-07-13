import type { Adjacent, BuyerEvidence, Company, Industry } from "../domain/entity-schema"
import type { Claim, EvidenceLink, Observation, Source } from "../domain/evidence-schema"
import type {
  AdjacentId,
  AnalysisId,
  BuyerEvidenceId,
  ClaimId,
  CompanyId,
  IndustryId,
  ObservationId,
  SearchReceiptId,
  SourceId,
  StrategyId,
  SubjectId,
} from "../domain/ids"
import type { Strategy, StrategyResearchReceipt } from "../domain/strategy-schema"
import type { MarketAnalysis } from "./corpus-schema"

export type ResearchIndexInput = {
  readonly sources: readonly Source[]
  readonly observations: readonly Observation[]
  readonly claims: readonly Claim[]
  readonly companies: readonly Company[]
  readonly industries: readonly Industry[]
  readonly adjacent: readonly Adjacent[]
  readonly buyerEvidence: readonly BuyerEvidence[]
  readonly marketAnalysis: readonly MarketAnalysis[]
  readonly strategies: readonly Strategy[]
  readonly receipts: readonly StrategyResearchReceipt[]
}

export type EvidenceRelationship = {
  readonly claim: Claim
  readonly link: EvidenceLink
  readonly observation: Observation
  readonly source: Source
}

export type SearchRecordId = SourceId | ClaimId | SubjectId

export type ResearchIndex = {
  readonly corpus: ResearchIndexInput
  readonly sourcesById: ReadonlyMap<SourceId, Source>
  readonly observationsById: ReadonlyMap<ObservationId, Observation>
  readonly claimsById: ReadonlyMap<ClaimId, Claim>
  readonly companiesById: ReadonlyMap<CompanyId, Company>
  readonly industriesById: ReadonlyMap<IndustryId, Industry>
  readonly adjacentById: ReadonlyMap<AdjacentId, Adjacent>
  readonly buyerEvidenceById: ReadonlyMap<BuyerEvidenceId, BuyerEvidence>
  readonly marketAnalysisById: ReadonlyMap<AnalysisId, MarketAnalysis>
  readonly strategiesById: ReadonlyMap<StrategyId, Strategy>
  readonly receiptsById: ReadonlyMap<SearchReceiptId, StrategyResearchReceipt>
  readonly claimsBySubjectId: ReadonlyMap<SubjectId, readonly Claim[]>
  readonly relationshipsByClaimId: ReadonlyMap<ClaimId, readonly EvidenceRelationship[]>
  readonly relationshipsBySourceId: ReadonlyMap<SourceId, readonly EvidenceRelationship[]>
  readonly buyerEvidenceByOwnerId: ReadonlyMap<CompanyId | AdjacentId, readonly BuyerEvidence[]>
  readonly subjectOriginsById: ReadonlyMap<SubjectId, string>
  readonly searchDocuments: ReadonlyMap<SearchRecordId, string>
}

export class ResearchIndexError extends Error {
  readonly referenceId: string

  constructor(referenceId: string) {
    super(`Unresolved or mismatched research reference: ${referenceId}`)
    this.name = "ResearchIndexError"
    this.referenceId = referenceId
  }
}

function append<K, V>(map: Map<K, V[]>, key: K, value: V): void {
  const current = map.get(key)
  if (current === undefined) map.set(key, [value])
  else current.push(value)
}

function relationshipText(relationship: EvidenceRelationship): readonly string[] {
  const { claim, observation, source } = relationship
  return [
    claim.claimId,
    claim.statement,
    observation.observationId,
    observation.locator.kind,
    observation.locator.value,
    observation.excerpt ?? "",
    source.sourceId,
    source.title,
    source.publisher,
    source.canonicalUrl,
    new URL(source.canonicalUrl).hostname,
  ]
}

function joined(parts: readonly string[]): string {
  return parts.filter((part) => part.length > 0).join(" ")
}

export function buildResearchIndex(corpus: ResearchIndexInput): ResearchIndex {
  const sourcesById = new Map(corpus.sources.map((source) => [source.sourceId, source]))
  const observationsById = new Map(
    corpus.observations.map((observation) => [observation.observationId, observation]),
  )
  const claimsById = new Map(corpus.claims.map((claim) => [claim.claimId, claim]))
  const companiesById = new Map(corpus.companies.map((company) => [company.companyId, company]))
  const industriesById = new Map(
    corpus.industries.map((industry) => [industry.industryId, industry]),
  )
  const adjacentById = new Map(corpus.adjacent.map((record) => [record.adjacentId, record]))
  const buyerEvidenceById = new Map(
    corpus.buyerEvidence.map((buyer) => [buyer.buyerEvidenceId, buyer]),
  )
  const marketAnalysisById = new Map(
    corpus.marketAnalysis.map((analysis) => [analysis.analysisId, analysis]),
  )
  const strategiesById = new Map(
    corpus.strategies.map((strategy) => [strategy.strategyId, strategy]),
  )
  const receiptsById = new Map(corpus.receipts.map((receipt) => [receipt.id, receipt]))
  const claimsBySubjectId = new Map<SubjectId, Claim[]>()
  const relationshipsByClaimId = new Map<ClaimId, EvidenceRelationship[]>()
  const relationshipsBySourceId = new Map<SourceId, EvidenceRelationship[]>()
  const buyerEvidenceByOwnerId = new Map<CompanyId | AdjacentId, BuyerEvidence[]>()

  for (const buyer of corpus.buyerEvidence) {
    const id = "companyId" in buyer ? buyer.companyId : buyer.adjacentId
    append(buyerEvidenceByOwnerId, id, buyer)
  }
  for (const claim of corpus.claims) {
    for (const subjectId of claim.subjectIds) append(claimsBySubjectId, subjectId, claim)
    for (const link of claim.evidenceLinks) {
      const observation = observationsById.get(link.observationId)
      const source = sourcesById.get(link.sourceId)
      if (
        observation === undefined ||
        source === undefined ||
        observation.sourceId !== source.sourceId
      ) {
        throw new ResearchIndexError(`${claim.claimId}/${link.observationId}/${link.sourceId}`)
      }
      const relationship = { claim, link, observation, source }
      append(relationshipsByClaimId, claim.claimId, relationship)
      append(relationshipsBySourceId, source.sourceId, relationship)
    }
  }

  const subjectIdentity = new Map<SubjectId, readonly string[]>()
  const subjectOriginsById = new Map<SubjectId, string>()
  for (const company of corpus.companies) {
    subjectOriginsById.set(company.companyId, new URL(company.canonicalDomain).origin)
    subjectIdentity.set(company.companyId, [
      company.companyId,
      company.name,
      ...company.aliases,
      company.canonicalDomain,
      new URL(company.canonicalDomain).hostname,
    ])
  }
  for (const record of corpus.adjacent) {
    subjectOriginsById.set(record.adjacentId, new URL(record.canonicalDomain).origin)
    subjectIdentity.set(record.adjacentId, [
      record.adjacentId,
      record.name,
      ...record.aliases,
      record.canonicalDomain,
      new URL(record.canonicalDomain).hostname,
    ])
  }
  for (const industry of corpus.industries) {
    subjectIdentity.set(industry.industryId, [
      industry.industryId,
      industry.name,
      ...industry.aliases,
    ])
  }
  for (const buyer of corpus.buyerEvidence) {
    subjectIdentity.set(buyer.buyerEvidenceId, [buyer.buyerEvidenceId, buyer.buyerName ?? ""])
  }

  const searchDocuments = new Map<SearchRecordId, string>()
  for (const claim of corpus.claims) {
    const subjectText = claim.subjectIds.flatMap((id) => subjectIdentity.get(id) ?? [])
    const evidenceText = (relationshipsByClaimId.get(claim.claimId) ?? []).flatMap(relationshipText)
    searchDocuments.set(
      claim.claimId,
      joined([claim.claimId, claim.statement, ...subjectText, ...evidenceText]),
    )
  }
  for (const source of corpus.sources) {
    const evidenceText = (relationshipsBySourceId.get(source.sourceId) ?? []).flatMap(
      relationshipText,
    )
    searchDocuments.set(
      source.sourceId,
      joined([
        source.sourceId,
        source.title,
        source.publisher,
        source.canonicalUrl,
        new URL(source.canonicalUrl).hostname,
        ...evidenceText,
      ]),
    )
  }
  for (const [subjectId, identity] of subjectIdentity) {
    const claimText = (claimsBySubjectId.get(subjectId) ?? []).map(
      (claim) => searchDocuments.get(claim.claimId) ?? "",
    )
    searchDocuments.set(subjectId, joined([...identity, ...claimText]))
  }

  return {
    corpus,
    sourcesById,
    observationsById,
    claimsById,
    companiesById,
    industriesById,
    adjacentById,
    buyerEvidenceById,
    marketAnalysisById,
    strategiesById,
    receiptsById,
    claimsBySubjectId,
    relationshipsByClaimId,
    relationshipsBySourceId,
    buyerEvidenceByOwnerId,
    subjectOriginsById,
    searchDocuments,
  }
}
