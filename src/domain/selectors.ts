import type { EvidenceRelationship, ResearchIndex, SearchRecordId } from "../data/research-index"
import type { Adjacent, Company } from "./entity-schema"
import type {
  Access,
  BusinessModelId,
  ClaimKind,
  Confidence,
  Control,
  IndependenceBand,
  Risk,
  SegmentId,
  SourceType,
  SupportSummary,
  Temporal,
  Theme,
} from "./enums"
import { deriveIndependenceBand, deriveSupportSummary } from "./evidence"
import type { Claim, Source } from "./evidence-schema"
import {
  AdjacentIdSchema,
  type BuyerEvidenceId,
  type CompanyId,
  CompanyIdSchema,
  type SubjectId,
} from "./ids"
import { matchesSearch, normalizeSearchTerms } from "./search"

export type ResearchFilters = {
  readonly q?: string
  readonly company?: readonly CompanyId[]
  readonly segment?: readonly SegmentId[]
  readonly buyer?: readonly BuyerEvidenceId[]
  readonly model?: readonly BusinessModelId[]
  readonly theme?: readonly Theme[]
  readonly kind?: readonly ClaimKind[]
  readonly sourceType?: readonly SourceType[]
  readonly control?: readonly Control[]
  readonly independence?: readonly IndependenceBand[]
  readonly support?: readonly SupportSummary[]
  readonly confidence?: readonly Confidence[]
  readonly temporal?: readonly Temporal[]
  readonly risk?: readonly Risk[]
  readonly access?: readonly Access[]
}

function active<T>(values: readonly T[] | undefined): values is readonly T[] {
  return values !== undefined && values.length > 0
}
function matchesValue<T>(selected: readonly T[] | undefined, value: T): boolean {
  return !active(selected) || selected.includes(value)
}
function matchesAny<T>(selected: readonly T[] | undefined, values: readonly T[]): boolean {
  return !active(selected) || values.some((value) => selected.includes(value))
}
function hasClaimFacets(filters: ResearchFilters): boolean {
  return (
    active(filters.theme) ||
    active(filters.kind) ||
    active(filters.independence) ||
    active(filters.support) ||
    active(filters.confidence) ||
    active(filters.temporal) ||
    active(filters.risk)
  )
}
function hasSourceFacets(filters: ResearchFilters): boolean {
  return active(filters.sourceType) || active(filters.control) || active(filters.access)
}

function matchesSourceFacets(source: Source, filters: ResearchFilters): boolean {
  return (
    matchesValue(filters.sourceType, source.sourceType) &&
    matchesValue(filters.control, source.control) &&
    matchesValue(filters.access, source.access)
  )
}

function matchesClaimFacets(index: ResearchIndex, claim: Claim, filters: ResearchFilters): boolean {
  return (
    matchesAny(filters.theme, claim.themes) &&
    matchesValue(filters.kind, claim.kind) &&
    matchesValue(filters.support, deriveSupportSummary(claim)) &&
    matchesValue(filters.confidence, claim.confidence) &&
    matchesValue(filters.temporal, claim.temporal) &&
    matchesValue(filters.risk, claim.risk) &&
    matchesValue(
      filters.independence,
      deriveIndependenceBand(claim, index.sourcesById, index.subjectOriginsById),
    )
  )
}

function matchesEntitySubject(
  index: ResearchIndex,
  subjectId: string,
  filters: ResearchFilters,
): boolean {
  const companyId = CompanyIdSchema.safeParse(subjectId)
  if (companyId.success) {
    const company = index.companiesById.get(companyId.data)
    return (
      company !== undefined &&
      matchesValue(filters.company, company.companyId) &&
      matchesValue(filters.segment, company.primarySegment) &&
      matchesAny(filters.model, company.businessModelIds)
    )
  }
  const adjacentId = AdjacentIdSchema.safeParse(subjectId)
  if (!adjacentId.success) return false
  const record = index.adjacentById.get(adjacentId.data)
  return (
    record !== undefined &&
    !active(filters.company) &&
    matchesValue(filters.segment, record.primarySegment) &&
    matchesAny(filters.model, record.businessModelIds)
  )
}

function matchesClaimRecordFacets(
  index: ResearchIndex,
  claim: Claim,
  filters: ResearchFilters,
): boolean {
  const hasEntityFacet = active(filters.company) || active(filters.segment) || active(filters.model)
  if (hasEntityFacet && !claim.subjectIds.some((id) => matchesEntitySubject(index, id, filters))) {
    return false
  }
  if (!active(filters.buyer)) return true
  return filters.buyer.some((buyerId) => {
    const buyer = index.buyerEvidenceById.get(buyerId)
    return (
      buyer !== undefined &&
      (buyer.claimIds.includes(claim.claimId) || buyer.outcomeClaimIds.includes(claim.claimId))
    )
  })
}

function matchesRelationship(
  index: ResearchIndex,
  relationship: EvidenceRelationship,
  filters: ResearchFilters,
): boolean {
  return (
    matchesClaimFacets(index, relationship.claim, filters) &&
    matchesSourceFacets(relationship.source, filters)
  )
}

function matchesSubjectEvidence(
  index: ResearchIndex,
  subjectId: SubjectId,
  filters: ResearchFilters,
): boolean {
  if (!hasClaimFacets(filters) && !hasSourceFacets(filters)) return true
  const claims = index.claimsBySubjectId.get(subjectId) ?? []
  return claims.some((claim) => {
    if (!matchesClaimFacets(index, claim, filters)) return false
    if (!hasSourceFacets(filters)) return true
    const relationships = index.relationshipsByClaimId.get(claim.claimId) ?? []
    return relationships.some((relationship) => matchesRelationship(index, relationship, filters))
  })
}

function matchesDocument(
  index: ResearchIndex,
  id: SearchRecordId,
  rawQuery: string | undefined,
): boolean {
  const query = normalizeSearchTerms(rawQuery ?? "")
  return matchesSearch(index.searchDocuments.get(id) ?? "", query)
}

export function selectCompanies(
  index: ResearchIndex,
  filters: ResearchFilters = {},
): readonly Company[] {
  return index.corpus.companies.filter(
    (company) =>
      matchesValue(filters.company, company.companyId) &&
      matchesValue(filters.segment, company.primarySegment) &&
      matchesAny(filters.model, company.businessModelIds) &&
      (!active(filters.buyer) ||
        filters.buyer.some((id) => company.buyerEvidenceIds.includes(id))) &&
      matchesSubjectEvidence(index, company.companyId, filters) &&
      matchesDocument(index, company.companyId, filters.q),
  )
}

export function selectAdjacent(
  index: ResearchIndex,
  filters: ResearchFilters = {},
): readonly Adjacent[] {
  return index.corpus.adjacent.filter((record) => {
    const buyers = index.buyerEvidenceByOwnerId.get(record.adjacentId) ?? []
    return (
      !active(filters.company) &&
      matchesValue(filters.segment, record.primarySegment) &&
      matchesAny(filters.model, record.businessModelIds) &&
      (!active(filters.buyer) ||
        buyers.some((buyer) => filters.buyer?.includes(buyer.buyerEvidenceId) === true)) &&
      matchesSubjectEvidence(index, record.adjacentId, filters) &&
      matchesDocument(index, record.adjacentId, filters.q)
    )
  })
}

export function selectClaims(
  index: ResearchIndex,
  filters: ResearchFilters = {},
): readonly Claim[] {
  return index.corpus.claims.filter((claim) => {
    if (!matchesClaimRecordFacets(index, claim, filters)) return false
    if (!matchesClaimFacets(index, claim, filters)) return false
    if (hasSourceFacets(filters)) {
      const relationships = index.relationshipsByClaimId.get(claim.claimId) ?? []
      if (
        !relationships.some((relationship) => matchesRelationship(index, relationship, filters))
      ) {
        return false
      }
    }
    return matchesDocument(index, claim.claimId, filters.q)
  })
}

export function selectSources(
  index: ResearchIndex,
  filters: ResearchFilters = {},
): readonly Source[] {
  const needsClaim =
    hasClaimFacets(filters) ||
    active(filters.company) ||
    active(filters.segment) ||
    active(filters.buyer) ||
    active(filters.model)
  return index.corpus.sources.filter((source) => {
    if (!matchesSourceFacets(source, filters)) return false
    if (needsClaim) {
      const relationships = index.relationshipsBySourceId.get(source.sourceId) ?? []
      const linkedMatch = relationships.some(
        ({ claim }) =>
          matchesClaimRecordFacets(index, claim, filters) &&
          matchesClaimFacets(index, claim, filters),
      )
      if (!linkedMatch) return false
    }
    return matchesDocument(index, source.sourceId, filters.q)
  })
}
