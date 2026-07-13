import type { BusinessModelId } from "./entity-enums"
import type {
  Access,
  ClaimKind,
  Confidence,
  Control,
  IndependenceBand,
  Risk,
  SourceType,
  SupportRelation,
  SupportSummary,
  Temporal,
} from "./evidence-enums"
import type {
  CompetitorArchetypeId,
  DecisionStatus,
  ModelEligibility,
  ReceiptClosure,
  ReceiptKind,
  ScoreDimensionId,
  StrategicModelId,
  VerticalCandidateId,
} from "./strategy-enums"

export const SOURCE_TYPE_LABELS: Readonly<Record<SourceType, string>> = Object.freeze({
  regulatory_record: "PRIMARY · REGULATORY",
  procurement_record: "PRIMARY · PROCUREMENT",
  buyer_first_party: "PRIMARY · BUYER",
  company_first_party: "VENDOR · COMPANY",
  technical_artifact: "PRIMARY · TECHNICAL",
  academic_primary: "PRIMARY · ACADEMIC",
  repository_primary: "PRIMARY · REPOSITORY",
  independent_reporting: "INDEPENDENT · REPORTING",
  investor_first_party: "VENDOR · INVESTOR",
  partner_first_party: "VENDOR · PARTNER",
  secondary_aggregator: "UNVERIFIED · SECONDARY",
  other: "UNVERIFIED · OTHER",
})
export const CONTROL_LABELS: Readonly<Record<Control, string>> = Object.freeze({
  subject_controlled: "VENDOR",
  commercially_affiliated: "AFFILIATED",
  independent: "INDEPENDENT",
  unclear: "UNVERIFIED",
})
export const SUPPORT_RELATION_LABELS: Readonly<Record<SupportRelation, string>> = Object.freeze({
  supports: "SUPPORTS",
  partially_supports: "PARTIAL SUPPORT",
  contests: "CONTESTS",
  contradicts: "CONTRADICTS",
  context_only: "CONTEXT ONLY",
})
export const SUPPORT_SUMMARY_LABELS: Readonly<Record<SupportSummary, string>> = Object.freeze({
  supported: "SUPPORTED",
  partially_supported: "PARTIAL",
  contested: "DISPUTED",
  contradicted: "CONTRADICTED",
  not_publicly_verified: "UNVERIFIED",
})
export const CONFIDENCE_LABELS: Readonly<Record<Confidence, string>> = Object.freeze({
  high: "HIGH CONFIDENCE",
  medium: "MEDIUM CONFIDENCE",
  low: "LOW CONFIDENCE",
  unscored: "UNSCORED",
})
export const TEMPORAL_LABELS: Readonly<Record<Temporal, string>> = Object.freeze({
  current: "CURRENT",
  historical: "HISTORICAL",
  announced: "ANNOUNCED",
  superseded: "SUPERSEDED",
  unknown: "TIME UNKNOWN",
})
export const RISK_LABELS: Readonly<Record<Risk, string>> = Object.freeze({
  routine: "ROUTINE",
  material: "MATERIAL",
  high_risk: "HIGH RISK",
  unknown: "RISK UNKNOWN",
})
export const ACCESS_LABELS: Readonly<Record<Access, string>> = Object.freeze({
  open: "OPEN",
  paywalled: "PAYWALLED",
  login_gated: "LOGIN GATED",
  archived: "ARCHIVED",
  unavailable: "UNAVAILABLE",
  secondary_only: "SECONDARY ONLY",
})
export const CLAIM_KIND_LABELS: Readonly<Record<ClaimKind, string>> = Object.freeze({
  observation: "OBSERVATION",
  reported_claim: "REPORTED CLAIM",
  calculation: "CALCULATION",
  inference: "INFERENCE",
  recommendation: "RECOMMENDATION",
  forecast: "FORECAST",
})
export const INDEPENDENCE_LABELS: Readonly<Record<IndependenceBand, string>> = Object.freeze({
  no_eligible_group: "NO ELIGIBLE GROUP",
  one_group: "ONE ELIGIBLE GROUP",
  two_plus_groups: "2+ ELIGIBLE GROUPS",
  single_source_exception: "SINGLE-SOURCE EXCEPTION",
})
export const BUSINESS_MODEL_LABELS: Readonly<Record<BusinessModelId, string>> = Object.freeze({
  managed_data_bpo: "MANAGED DATA / BPO",
  expert_marketplace: "EXPERT MARKETPLACE",
  employee_bpo: "EMPLOYEE BPO",
  expert_environment_services: "EXPERT + ENVIRONMENT SERVICES",
  eval_observability_saas: "EVAL / OBSERVABILITY SAAS",
  runtime_infrastructure: "RUNTIME INFRASTRUCTURE",
  proprietary_data_acquisition: "PROPRIETARY DATA ACQUISITION",
})
export const STRATEGIC_MODEL_LABELS: Readonly<Record<StrategicModelId, string>> = Object.freeze({
  vertical_domain_assurance_pack: "VERTICAL DOMAIN ASSURANCE PACK",
  specialist_independent_eval_lab: "SPECIALIST INDEPENDENT EVAL LAB",
  environment_foundry: "ENVIRONMENT FOUNDRY",
  ax_transformation_studio: "AX TRANSFORMATION STUDIO",
})
export const VERTICAL_CANDIDATE_LABELS: Readonly<Record<VerticalCandidateId, string>> =
  Object.freeze({
    regulated_financial_operations: "REGULATED FINANCIAL OPERATIONS",
    insurance_operations: "INSURANCE OPERATIONS",
    healthcare_administration: "HEALTHCARE ADMINISTRATION",
    enterprise_software_support: "ENTERPRISE SOFTWARE / SUPPORT",
    public_sector_administration: "PUBLIC-SECTOR ADMINISTRATION",
  })
export const COMPETITOR_ARCHETYPE_LABELS: Readonly<Record<CompetitorArchetypeId, string>> =
  Object.freeze({
    managed_data_bpo: "MANAGED DATA / BPO",
    expert_workforce_marketplace: "EXPERT WORKFORCE MARKETPLACE",
    environment_foundry_gym: "ENVIRONMENT FOUNDRY / GYM",
    eval_observability_saas: "EVAL / OBSERVABILITY SAAS",
    independent_assurance_lab: "INDEPENDENT ASSURANCE LAB",
    post_training_runtime_infrastructure: "POST-TRAINING RUNTIME INFRASTRUCTURE",
    ax_transformation_consultancy: "AX TRANSFORMATION CONSULTANCY",
  })
export const IMPUTATION_LABELS = Object.freeze({
  conservative_missing: "IMPUTED · CONSERVATIVE MISSING",
})
export const SCORE_DIMENSION_LABELS: Readonly<Record<ScoreDimensionId, string>> = Object.freeze({
  pain: "PAIN",
  willingnessToPay: "WILLINGNESS TO PAY",
  rightsAccess: "RIGHTS ACCESS",
  verifierFeasibility: "VERIFIER FEASIBILITY",
  expertSupply: "EXPERT SUPPLY",
  freshnessBurden: "FRESHNESS BURDEN · INVERTED",
  incumbentPressure: "INCUMBENT PRESSURE · INVERTED",
})
export const MODEL_ELIGIBILITY_LABELS: Readonly<Record<ModelEligibility, string>> = Object.freeze({
  eligible_hypothesis: "ELIGIBLE HYPOTHESIS",
  countersearched_out: "COUNTERSEARCHED OUT",
})
export const DECISION_STATUS_LABELS: Readonly<Record<DecisionStatus, string>> = Object.freeze({
  winner: "CONDITIONAL GO",
  runner_up: "RUNNER-UP",
  no_go: "NO-GO · DISCOVERY REQUIRED",
  unscored: "UNSCORED",
})
export const RECEIPT_KIND_LABELS: Readonly<Record<ReceiptKind, string>> = Object.freeze({
  positive: "EVIDENCE SEARCH",
  negative: "COUNTERSEARCH",
})
export const RECEIPT_CLOSURE_LABELS: Readonly<Record<ReceiptClosure, string>> = Object.freeze({
  evidence_found: "EVIDENCE FOUND",
  no_public_evidence: "NO PUBLIC EVIDENCE",
  rights_blocker: "RIGHTS BLOCKER",
  duplicate: "DUPLICATE",
  dead: "DEAD END",
})

export const DISPLAY_LABELS = Object.freeze({
  sourceType: SOURCE_TYPE_LABELS,
  control: CONTROL_LABELS,
  supportRelation: SUPPORT_RELATION_LABELS,
  supportSummary: SUPPORT_SUMMARY_LABELS,
  confidence: CONFIDENCE_LABELS,
  temporal: TEMPORAL_LABELS,
  risk: RISK_LABELS,
  access: ACCESS_LABELS,
  kind: CLAIM_KIND_LABELS,
  independence: INDEPENDENCE_LABELS,
  businessModel: BUSINESS_MODEL_LABELS,
  strategicModel: STRATEGIC_MODEL_LABELS,
  verticalCandidate: VERTICAL_CANDIDATE_LABELS,
  competitorArchetype: COMPETITOR_ARCHETYPE_LABELS,
  imputation: IMPUTATION_LABELS,
  scoreDimension: SCORE_DIMENSION_LABELS,
  modelEligibility: MODEL_ELIGIBILITY_LABELS,
  decisionStatus: DECISION_STATUS_LABELS,
  receiptKind: RECEIPT_KIND_LABELS,
  receiptClosure: RECEIPT_CLOSURE_LABELS,
})
