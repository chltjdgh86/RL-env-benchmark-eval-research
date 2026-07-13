import { z } from "zod"

const slug = "[a-z0-9]+(?:-[a-z0-9]+)*"

const brandedId = <T extends string>(prefix: string, _brand: T) =>
  z
    .string()
    .regex(new RegExp(`^${prefix}_${slug}$`))
    .brand<T>()

export const SourceIdSchema = brandedId("src", "SourceId")
export const ObservationIdSchema = brandedId("obs", "ObservationId")
export const ClaimIdSchema = brandedId("clm", "ClaimId")
export const CompanyIdSchema = brandedId("co", "CompanyId")
export const IndustryIdSchema = brandedId("ind", "IndustryId")
export const AdjacentIdSchema = brandedId("adj", "AdjacentId")
export const BuyerEvidenceIdSchema = brandedId("buy", "BuyerEvidenceId")
export const AnalysisIdSchema = brandedId("ana", "AnalysisId")
export const StrategyIdSchema = brandedId("str", "StrategyId")
export const SearchReceiptIdSchema = z
  .string()
  .regex(new RegExp(`^rr-${slug}$`))
  .brand<"SearchReceiptId">()

export const SubjectIdSchema = z.union([
  SourceIdSchema,
  ObservationIdSchema,
  ClaimIdSchema,
  CompanyIdSchema,
  IndustryIdSchema,
  AdjacentIdSchema,
  BuyerEvidenceIdSchema,
  AnalysisIdSchema,
  StrategyIdSchema,
])
export const AffiliationEntityIdSchema = z.union([
  CompanyIdSchema,
  AdjacentIdSchema,
  BuyerEvidenceIdSchema,
  SourceIdSchema,
])

export type SourceId = z.infer<typeof SourceIdSchema>
export type ObservationId = z.infer<typeof ObservationIdSchema>
export type ClaimId = z.infer<typeof ClaimIdSchema>
export type CompanyId = z.infer<typeof CompanyIdSchema>
export type IndustryId = z.infer<typeof IndustryIdSchema>
export type AdjacentId = z.infer<typeof AdjacentIdSchema>
export type BuyerEvidenceId = z.infer<typeof BuyerEvidenceIdSchema>
export type AnalysisId = z.infer<typeof AnalysisIdSchema>
export type StrategyId = z.infer<typeof StrategyIdSchema>
export type SearchReceiptId = z.infer<typeof SearchReceiptIdSchema>
export type SubjectId = z.infer<typeof SubjectIdSchema>
export type AffiliationEntityId = z.infer<typeof AffiliationEntityIdSchema>
