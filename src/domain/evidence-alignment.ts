import type { ClaimAlignment, SourceType } from "./enums"
import type { Affiliation, Claim, Source } from "./evidence-schema"

const AFFILIATION_PRIORITY = [
  "subject",
  "buyer",
  "acquirer",
  "transaction_counterparty",
  "investor",
  "commercial_partner",
  "parent",
] as const

const AFFILIATION_ALIGNMENT = {
  subject: "subject_controlled",
  buyer: "buyer_controlled",
  investor: "investor_aligned",
  acquirer: "acquirer_aligned",
  transaction_counterparty: "transaction_counterparty_aligned",
  commercial_partner: "commercial_partner_aligned",
  parent: "acquirer_aligned",
  syndicator: "republication_same_chain",
} satisfies Readonly<Record<Affiliation["relationship"], ClaimAlignment>>

export type SubjectOriginMap = ReadonlyMap<string, string>

class UnexpectedSourceTypeError extends Error {
  constructor(value: never) {
    super(`Unexpected source type: ${String(value)}`)
  }
}

const sourceTypeAlignment = (source: Source): ClaimAlignment => {
  const independentlyControlled = source.control === "independent"
  switch (source.sourceType) {
    case "regulatory_record":
    case "procurement_record":
      return independentlyControlled ? "regulator_authoritative" : "unknown"
    case "academic_primary":
      return independentlyControlled ? "academic_independent" : "unknown"
    case "independent_reporting":
      return independentlyControlled ? "editorial_independent" : "unknown"
    case "buyer_first_party":
    case "technical_artifact":
      return "buyer_controlled"
    case "investor_first_party":
      return "investor_aligned"
    case "partner_first_party":
      return "commercial_partner_aligned"
    case "company_first_party":
    case "repository_primary":
    case "secondary_aggregator":
    case "other":
      return "subject_controlled"
    default:
      throw new UnexpectedSourceTypeError(source.sourceType)
  }
}

const controlledBySubjectOrigin = (
  source: Source,
  subjectIds: Claim["subjectIds"],
  origins: SubjectOriginMap,
): boolean => {
  const sourceOrigin = new URL(source.canonicalUrl).origin
  return subjectIds.some((subjectId) => origins.get(subjectId) === sourceOrigin)
}

export const deriveClaimAlignment = (
  source: Source,
  subjectIds: Claim["subjectIds"],
  subjectOrigins: SubjectOriginMap = new Map(),
): ClaimAlignment => {
  if (source.publisherAffiliations.some(({ relationship }) => relationship === "syndicator")) {
    return "republication_same_chain"
  }
  if (controlledBySubjectOrigin(source, subjectIds, subjectOrigins)) return "subject_controlled"
  const subjects = new Set<string>(subjectIds)
  for (const relationship of AFFILIATION_PRIORITY) {
    const matches = source.publisherAffiliations.some(
      (affiliation) =>
        affiliation.relationship === relationship && subjects.has(affiliation.entityRef),
    )
    if (matches) return AFFILIATION_ALIGNMENT[relationship]
  }
  return sourceTypeAlignment(source)
}

const publisherSlug = (publisher: string): string =>
  publisher
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[^a-z0-9]+/gu, "-")
    .replace(/^-|-$/gu, "")

export const independenceGroupFor = (source: Source): string =>
  source.sourceType === "academic_primary"
    ? `academic-work:${source.canonicalUrl}`
    : `source-chain:${publisherSlug(source.publisher)}`

export const PRIMARY_SOURCE_TYPES: ReadonlySet<SourceType> = new Set([
  "regulatory_record",
  "procurement_record",
  "buyer_first_party",
  "company_first_party",
  "technical_artifact",
  "academic_primary",
  "repository_primary",
])
