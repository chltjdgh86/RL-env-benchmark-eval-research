import { z } from "zod"

export const VERTICAL_CANDIDATES = [
  "regulated_financial_operations",
  "insurance_operations",
  "healthcare_administration",
  "enterprise_software_support",
  "public_sector_administration",
] as const
export const SCORE_DIMENSIONS = [
  "pain",
  "willingnessToPay",
  "rightsAccess",
  "verifierFeasibility",
  "expertSupply",
  "freshnessBurden",
  "incumbentPressure",
] as const
export const STRATEGIC_MODELS = [
  "vertical_domain_assurance_pack",
  "specialist_independent_eval_lab",
  "environment_foundry",
  "ax_transformation_studio",
] as const
export const COMPETITOR_ARCHETYPES = [
  "managed_data_bpo",
  "expert_workforce_marketplace",
  "environment_foundry_gym",
  "eval_observability_saas",
  "independent_assurance_lab",
  "post_training_runtime_infrastructure",
  "ax_transformation_consultancy",
] as const
export const SEARCH_DOMAIN_CLASSES = [
  "buyer_procurement",
  "regulatory_registry",
  "company_first_party",
  "technical_repository",
  "academic_primary",
  "independent_reporting",
  "investor_partner",
  "secondary_discovery",
] as const
export const RECEIPT_KINDS = ["positive", "negative"] as const
export const RECEIPT_CLOSURES = [
  "evidence_found",
  "no_public_evidence",
  "rights_blocker",
  "duplicate",
  "dead",
] as const
export const IMPUTATIONS = ["conservative_missing"] as const
export const DECISION_STATUSES = ["winner", "runner_up", "no_go", "unscored"] as const
export const MODEL_ELIGIBILITIES = ["eligible_hypothesis", "countersearched_out"] as const
export const ANALYSIS_TYPES = [
  "history_event",
  "gtm_motion",
  "economic_model",
  "risk",
  "metric",
  "value_chain_edge",
] as const
export const STRATEGY_TYPES = [
  "vertical_candidate",
  "strategic_model",
  "competitor_response",
  "roadmap",
  "pricing_experiment",
] as const

export const VerticalCandidateIdSchema = z.enum(VERTICAL_CANDIDATES)
export const ScoreDimensionIdSchema = z.enum(SCORE_DIMENSIONS)
export const StrategicModelIdSchema = z.enum(STRATEGIC_MODELS)
export const CompetitorArchetypeIdSchema = z.enum(COMPETITOR_ARCHETYPES)
export const SearchDomainClassSchema = z.enum(SEARCH_DOMAIN_CLASSES)
export const ReceiptKindSchema = z.enum(RECEIPT_KINDS)
export const ReceiptClosureSchema = z.enum(RECEIPT_CLOSURES)
export const ImputationSchema = z.enum(IMPUTATIONS)
export const DecisionStatusSchema = z.enum(DECISION_STATUSES)
export const ModelEligibilitySchema = z.enum(MODEL_ELIGIBILITIES)
export const AnalysisTypeSchema = z.enum(ANALYSIS_TYPES)
export const StrategyTypeSchema = z.enum(STRATEGY_TYPES)

export type VerticalCandidateId = z.infer<typeof VerticalCandidateIdSchema>
export type ScoreDimensionId = z.infer<typeof ScoreDimensionIdSchema>
export type StrategicModelId = z.infer<typeof StrategicModelIdSchema>
export type CompetitorArchetypeId = z.infer<typeof CompetitorArchetypeIdSchema>
export type SearchDomainClass = z.infer<typeof SearchDomainClassSchema>
export type ReceiptKind = z.infer<typeof ReceiptKindSchema>
export type ReceiptClosure = z.infer<typeof ReceiptClosureSchema>
export type Imputation = z.infer<typeof ImputationSchema>
export type DecisionStatus = z.infer<typeof DecisionStatusSchema>
export type ModelEligibility = z.infer<typeof ModelEligibilitySchema>
export type AnalysisType = z.infer<typeof AnalysisTypeSchema>
export type StrategyType = z.infer<typeof StrategyTypeSchema>
