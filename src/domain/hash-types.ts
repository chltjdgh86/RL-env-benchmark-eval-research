import { z } from "zod"
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
import type { BuyerEvidenceId, ClaimId, CompanyId, SourceId } from "./ids"

export const HASH_SECTIONS = ["guide", "companies", "showcase"] as const
export const HASH_QUERY_KEYS = [
  "q",
  "company",
  "segment",
  "buyer",
  "model",
  "theme",
  "kind",
  "source-type",
  "control",
  "independence",
  "support",
  "confidence",
  "temporal",
  "risk",
  "access",
  "claim",
  "source",
] as const

export const HashSectionSchema = z.enum(HASH_SECTIONS)
export const HashQueryKeySchema = z.enum(HASH_QUERY_KEYS)
export const SearchQuerySchema = z
  .string()
  .transform((value) =>
    Array.from(value.normalize("NFC").trim().replace(/\s+/gu, " ")).slice(0, 120).join("").trim(),
  )
  .brand<"SearchQuery">()

export type HashSection = z.infer<typeof HashSectionSchema>
export type HashQueryKey = z.infer<typeof HashQueryKeySchema>
export type SearchQuery = z.infer<typeof SearchQuerySchema>
export type HashState = {
  readonly section: HashSection
  readonly q: SearchQuery
  readonly company: readonly CompanyId[]
  readonly segment: readonly SegmentId[]
  readonly buyer: readonly BuyerEvidenceId[]
  readonly model: readonly BusinessModelId[]
  readonly theme: readonly Theme[]
  readonly kind: readonly ClaimKind[]
  readonly sourceType: readonly SourceType[]
  readonly control: readonly Control[]
  readonly independence: readonly IndependenceBand[]
  readonly support: readonly SupportSummary[]
  readonly confidence: readonly Confidence[]
  readonly temporal: readonly Temporal[]
  readonly risk: readonly Risk[]
  readonly access: readonly Access[]
  readonly claim: ClaimId | null
  readonly source: SourceId | null
}
export type HashReferenceIndex = {
  readonly companyIds: readonly CompanyId[]
  readonly buyerEvidenceIds: readonly BuyerEvidenceId[]
  readonly claimIds: readonly ClaimId[]
  readonly sourceIds: readonly SourceId[]
}
export type HashWarning = {
  readonly code:
    | "invalid_section"
    | "unknown_key"
    | "repeated_key"
    | "malformed_encoding"
    | "invalid_value"
    | "company_limit"
    | "source_outside_sources"
  readonly key: string | null
}
export type ParseHashResult = {
  readonly state: HashState
  readonly warnings: readonly HashWarning[]
}

export const normalizeSearch = (raw: string): SearchQuery => SearchQuerySchema.parse(raw)
