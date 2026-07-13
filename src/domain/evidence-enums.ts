import { z } from "zod"

export const SOURCE_TYPES = [
  "regulatory_record",
  "procurement_record",
  "buyer_first_party",
  "company_first_party",
  "technical_artifact",
  "academic_primary",
  "repository_primary",
  "independent_reporting",
  "investor_first_party",
  "partner_first_party",
  "secondary_aggregator",
  "other",
] as const
export const CONTROLS = [
  "subject_controlled",
  "commercially_affiliated",
  "independent",
  "unclear",
] as const
export const ACCESS_STATES = [
  "open",
  "paywalled",
  "login_gated",
  "archived",
  "unavailable",
  "secondary_only",
] as const
export const AFFILIATION_RELATIONSHIPS = [
  "subject",
  "buyer",
  "investor",
  "acquirer",
  "transaction_counterparty",
  "commercial_partner",
  "parent",
  "syndicator",
] as const
export const LOCATOR_KINDS = [
  "html_heading",
  "paragraph",
  "page",
  "section",
  "filing_field",
  "commit",
] as const
export const SUPPORT_RELATIONS = [
  "supports",
  "partially_supports",
  "contests",
  "contradicts",
  "context_only",
] as const
export const SUPPORT_SUMMARIES = [
  "supported",
  "partially_supported",
  "contested",
  "contradicted",
  "not_publicly_verified",
] as const
export const CLAIM_ALIGNMENTS = [
  "subject_controlled",
  "buyer_controlled",
  "regulator_authoritative",
  "academic_independent",
  "editorial_independent",
  "investor_aligned",
  "acquirer_aligned",
  "transaction_counterparty_aligned",
  "commercial_partner_aligned",
  "republication_same_chain",
  "unknown",
] as const
export const THEMES = [
  "taxonomy",
  "company",
  "gtm",
  "economics",
  "buyer",
  "risk",
  "history",
  "strategy",
] as const
export const CLAIM_KINDS = [
  "observation",
  "reported_claim",
  "calculation",
  "inference",
  "recommendation",
  "forecast",
] as const
export const CONFIDENCE_STATES = ["high", "medium", "low", "unscored"] as const
export const TEMPORAL_STATES = [
  "current",
  "historical",
  "announced",
  "superseded",
  "unknown",
] as const
export const RISK_STATES = ["routine", "material", "high_risk", "unknown"] as const
export const INDEPENDENCE_BANDS = [
  "no_eligible_group",
  "one_group",
  "two_plus_groups",
  "single_source_exception",
] as const
export const SINGLE_SOURCE_EXCEPTIONS = ["registry_field", "current_advertised_offer"] as const

export const SourceTypeSchema = z.enum(SOURCE_TYPES)
export const ControlSchema = z.enum(CONTROLS)
export const AccessSchema = z.enum(ACCESS_STATES)
export const AffiliationRelationshipSchema = z.enum(AFFILIATION_RELATIONSHIPS)
export const LocatorKindSchema = z.enum(LOCATOR_KINDS)
export const SupportRelationSchema = z.enum(SUPPORT_RELATIONS)
export const SupportSummarySchema = z.enum(SUPPORT_SUMMARIES)
export const ClaimAlignmentSchema = z.enum(CLAIM_ALIGNMENTS)
export const ThemeSchema = z.enum(THEMES)
export const ClaimKindSchema = z.enum(CLAIM_KINDS)
export const ConfidenceSchema = z.enum(CONFIDENCE_STATES)
export const TemporalSchema = z.enum(TEMPORAL_STATES)
export const RiskSchema = z.enum(RISK_STATES)
export const IndependenceBandSchema = z.enum(INDEPENDENCE_BANDS)
export const SingleSourceExceptionKindSchema = z.enum(SINGLE_SOURCE_EXCEPTIONS)

export type SourceType = z.infer<typeof SourceTypeSchema>
export type Control = z.infer<typeof ControlSchema>
export type Access = z.infer<typeof AccessSchema>
export type AffiliationRelationship = z.infer<typeof AffiliationRelationshipSchema>
export type LocatorKind = z.infer<typeof LocatorKindSchema>
export type SupportRelation = z.infer<typeof SupportRelationSchema>
export type SupportSummary = z.infer<typeof SupportSummarySchema>
export type ClaimAlignment = z.infer<typeof ClaimAlignmentSchema>
export type Theme = z.infer<typeof ThemeSchema>
export type ClaimKind = z.infer<typeof ClaimKindSchema>
export type Confidence = z.infer<typeof ConfidenceSchema>
export type Temporal = z.infer<typeof TemporalSchema>
export type Risk = z.infer<typeof RiskSchema>
export type IndependenceBand = z.infer<typeof IndependenceBandSchema>
