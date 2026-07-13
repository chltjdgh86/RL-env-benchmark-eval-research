import type { ClaimAlignment, IndependenceBand, SupportSummary } from "./enums"
import {
  deriveClaimAlignment,
  independenceGroupFor,
  PRIMARY_SOURCE_TYPES,
  type SubjectOriginMap,
} from "./evidence-alignment"
import type { Claim, EvidenceLink, Source } from "./evidence-schema"
import { type SourceId, SourceIdSchema } from "./ids"

export { deriveClaimAlignment } from "./evidence-alignment"

const POSITIVE_RELATIONS = new Set(["supports", "partially_supports"])
const ELIGIBLE_ALIGNMENTS = new Set<ClaimAlignment>([
  "regulator_authoritative",
  "academic_independent",
  "editorial_independent",
])
export type IndependenceIssueCode =
  | "UNKNOWN_SOURCE"
  | "UNKNOWN_SYNDICATOR_SOURCE"
  | "SYNDICATION_CYCLE"
  | "CLAIM_ALIGNMENT_MISMATCH"
  | "INDEPENDENCE_GROUP_MISMATCH"
  | "INDEPENDENCE_COUNT_MISMATCH"
  | "INVALID_SINGLE_SOURCE_EXCEPTION"
  | "INSUFFICIENT_HIGH_RISK_INDEPENDENCE"
export type IndependenceIssue = {
  readonly code: IndependenceIssueCode
  readonly detail: string
}
export type ClaimIndependence = {
  readonly band: IndependenceBand
  readonly eligibleGroups: readonly string[]
  readonly issues: readonly IndependenceIssue[]
}
export type SourceMap = ReadonlyMap<SourceId, Source>

export const deriveSupportSummary = (claim: Pick<Claim, "evidenceLinks">): SupportSummary => {
  const relations = new Set(claim.evidenceLinks.map((link) => link.supportRelation))
  const hasSupports = relations.has("supports")
  const hasPartial = relations.has("partially_supports")
  const hasPositive = hasSupports || hasPartial
  const hasContradiction = relations.has("contradicts")

  if (relations.has("contests") || (hasPositive && hasContradiction)) return "contested"
  if (hasContradiction) return "contradicted"
  if (hasSupports) return "supported"
  if (hasPartial) return "partially_supported"
  return "not_publicly_verified"
}

type ChainResolution = {
  readonly root: Source
  readonly issues: readonly IndependenceIssue[]
}

const resolvePublisherRoot = (start: Source, sources: SourceMap): ChainResolution => {
  let current = start
  const visited = new Set<SourceId>()
  while (true) {
    if (visited.has(current.sourceId)) {
      return {
        root: current,
        issues: [{ code: "SYNDICATION_CYCLE", detail: `Cycle at ${current.sourceId}` }],
      }
    }
    visited.add(current.sourceId)
    const syndicator = current.publisherAffiliations.find(
      ({ relationship }) => relationship === "syndicator",
    )
    if (syndicator === undefined) return { root: current, issues: [] }
    const parsedId = SourceIdSchema.safeParse(syndicator.entityRef)
    if (!parsedId.success) {
      return {
        root: current,
        issues: [
          {
            code: "UNKNOWN_SYNDICATOR_SOURCE",
            detail: `${current.sourceId} points to ${syndicator.entityRef}`,
          },
        ],
      }
    }
    const parent = sources.get(parsedId.data)
    if (parent === undefined) {
      return {
        root: current,
        issues: [
          {
            code: "UNKNOWN_SYNDICATOR_SOURCE",
            detail: `${current.sourceId} points to ${syndicator.entityRef}`,
          },
        ],
      }
    }
    current = parent
  }
}

const issueForLink = (
  link: EvidenceLink,
  expectedAlignment: ClaimAlignment,
  expectedGroup: string,
): readonly IndependenceIssue[] => {
  const issues: IndependenceIssue[] = []
  if (link.claimAlignment !== expectedAlignment) {
    issues.push({
      code: "CLAIM_ALIGNMENT_MISMATCH",
      detail: `Stored ${link.claimAlignment}; derived ${expectedAlignment} for ${link.sourceId}`,
    })
  }
  if (link.independenceGroup !== expectedGroup) {
    issues.push({
      code: "INDEPENDENCE_GROUP_MISMATCH",
      detail: `Stored ${link.independenceGroup}; derived ${expectedGroup} for ${link.sourceId}`,
    })
  }
  return issues
}

const hasValidException = (
  claim: Claim,
  sources: SourceMap,
  subjectOrigins: SubjectOriginMap,
): boolean => {
  if (claim.singleSourceException === null) return false
  const link = claim.evidenceLinks.find(
    ({ observationId }) => observationId === claim.singleSourceException?.observationId,
  )
  if (link === undefined) return false
  const source = sources.get(link.sourceId)
  if (source === undefined || source.access === "unavailable") return false
  const alignment = deriveClaimAlignment(source, claim.subjectIds, subjectOrigins)
  if (claim.singleSourceException.kind === "registry_field") {
    return source.sourceType === "regulatory_record" && alignment === "regulator_authoritative"
  }
  return (
    claim.temporal === "current" &&
    (source.sourceType === "company_first_party" || source.sourceType === "partner_first_party") &&
    source.control === "subject_controlled" &&
    source.publisherAffiliations.some(({ relationship }) => relationship === "subject") &&
    alignment === "subject_controlled"
  )
}

const independenceBand = (groupCount: number, validException: boolean): IndependenceBand => {
  if (validException) return "single_source_exception"
  if (groupCount === 0) return "no_eligible_group"
  if (groupCount === 1) return "one_group"
  return "two_plus_groups"
}

export const deriveClaimIndependence = (
  claim: Claim,
  sources: SourceMap,
  subjectOrigins: SubjectOriginMap = new Map(),
): ClaimIndependence => {
  const eligibleGroups = new Set<string>()
  const primaryGroups = new Set<string>()
  const issues: IndependenceIssue[] = []
  for (const link of claim.evidenceLinks) {
    const source = sources.get(link.sourceId)
    if (source === undefined) {
      issues.push({ code: "UNKNOWN_SOURCE", detail: `Unknown source ${link.sourceId}` })
      continue
    }
    const expectedAlignment = deriveClaimAlignment(source, claim.subjectIds, subjectOrigins)
    const chain = resolvePublisherRoot(source, sources)
    issues.push(...chain.issues)
    const expectedGroup = independenceGroupFor(chain.root)
    issues.push(...issueForLink(link, expectedAlignment, expectedGroup))
    if (
      POSITIVE_RELATIONS.has(link.supportRelation) &&
      ELIGIBLE_ALIGNMENTS.has(expectedAlignment)
    ) {
      eligibleGroups.add(expectedGroup)
    }
    if (
      POSITIVE_RELATIONS.has(link.supportRelation) &&
      PRIMARY_SOURCE_TYPES.has(source.sourceType)
    ) {
      primaryGroups.add(expectedGroup)
    }
  }
  const groups = [...eligibleGroups].sort()
  if (claim.independentGroupCount !== groups.length) {
    issues.push({
      code: "INDEPENDENCE_COUNT_MISMATCH",
      detail: `Stored ${claim.independentGroupCount}; derived ${groups.length}`,
    })
  }
  const validException = hasValidException(claim, sources, subjectOrigins)
  if (claim.singleSourceException !== null && !validException) {
    issues.push({
      code: "INVALID_SINGLE_SOURCE_EXCEPTION",
      detail: `Exception ${claim.singleSourceException.kind} lacks an eligible linked observation`,
    })
  }
  const hasPrimaryPlusIndependent = [...primaryGroups].some((primaryGroup) =>
    groups.some((eligibleGroup) => eligibleGroup !== primaryGroup),
  )
  const hasPositiveEvidence = claim.evidenceLinks.some((link) =>
    POSITIVE_RELATIONS.has(link.supportRelation),
  )
  if (
    claim.risk === "high_risk" &&
    hasPositiveEvidence &&
    !validException &&
    groups.length < 2 &&
    !hasPrimaryPlusIndependent
  ) {
    issues.push({
      code: "INSUFFICIENT_HIGH_RISK_INDEPENDENCE",
      detail: `${claim.claimId} lacks primary-plus-independent or two independent groups`,
    })
  }
  return { band: independenceBand(groups.length, validException), eligibleGroups: groups, issues }
}

export const deriveIndependenceBand = (
  claim: Claim,
  sources: SourceMap,
  subjectOrigins: SubjectOriginMap = new Map(),
): IndependenceBand => deriveClaimIndependence(claim, sources, subjectOrigins).band
