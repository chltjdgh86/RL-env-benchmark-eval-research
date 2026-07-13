import { z } from "zod"

export const SEGMENTS = [
  "training_data_workforce",
  "expert_talent_network",
  "environment_computer_use_runtime",
  "eval_observability_assurance",
  "post_training_rl_infrastructure",
  "agent_ax_services",
  "incumbent_bpo_consulting",
] as const
export const BUSINESS_MODELS = [
  "managed_data_bpo",
  "expert_marketplace",
  "employee_bpo",
  "expert_environment_services",
  "eval_observability_saas",
  "runtime_infrastructure",
  "proprietary_data_acquisition",
] as const
export const ENTITY_STATUSES = [
  "active",
  "acquisition_announced",
  "acquired_closed",
  "inactive",
  "unknown",
] as const
export const INDUSTRY_KINDS = [
  "reward_regime",
  "optimization_method",
  "commercial_layer",
  "service_model",
  "ambiguous_term",
] as const
export const VALUE_CHAIN_STAGES = [
  "signal_data",
  "environment",
  "post_training",
  "evaluation_assurance",
  "deployment",
  "transformation",
] as const
export const ADJACENT_INCLUSION_KINDS = [
  "direct_supplier",
  "substitute",
  "partner",
  "acquirer",
  "procurement_competitor",
] as const
export const BUYER_TYPES = [
  "frontier_lab",
  "enterprise_ai_team",
  "regulated_enterprise",
  "public_sector",
  "consultancy",
  "undisclosed",
  "other",
] as const
export const BUYER_MOTIONS = [
  "research_relationship",
  "sample",
  "paid_pilot",
  "procurement",
  "expansion",
  "marketplace",
  "partnership",
  "unknown",
] as const
export const BUYER_EVIDENCE_STATES = [
  "buyer_confirmed",
  "procurement_confirmed",
  "vendor_reported_only",
  "not_publicly_verified",
] as const

export const SegmentIdSchema = z.enum(SEGMENTS)
export const BusinessModelIdSchema = z.enum(BUSINESS_MODELS)
export const EntityStatusSchema = z.enum(ENTITY_STATUSES)
export const IndustryKindSchema = z.enum(INDUSTRY_KINDS)
export const ValueChainStageSchema = z.enum(VALUE_CHAIN_STAGES)
export const AdjacentInclusionKindSchema = z.enum(ADJACENT_INCLUSION_KINDS)
export const BuyerTypeSchema = z.enum(BUYER_TYPES)
export const BuyerMotionSchema = z.enum(BUYER_MOTIONS)
export const BuyerEvidenceStateSchema = z.enum(BUYER_EVIDENCE_STATES)

export type SegmentId = z.infer<typeof SegmentIdSchema>
export type BusinessModelId = z.infer<typeof BusinessModelIdSchema>
export type EntityStatus = z.infer<typeof EntityStatusSchema>
export type IndustryKind = z.infer<typeof IndustryKindSchema>
export type ValueChainStage = z.infer<typeof ValueChainStageSchema>
export type AdjacentInclusionKind = z.infer<typeof AdjacentInclusionKindSchema>
export type BuyerType = z.infer<typeof BuyerTypeSchema>
export type BuyerMotion = z.infer<typeof BuyerMotionSchema>
export type BuyerEvidenceState = z.infer<typeof BuyerEvidenceStateSchema>
