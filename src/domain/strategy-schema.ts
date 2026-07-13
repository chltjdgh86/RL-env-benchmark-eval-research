import { z } from "zod"
import {
  CompetitorArchetypeIdSchema,
  DecisionStatusSchema,
  ImputationSchema,
  ModelEligibilitySchema,
  ReceiptClosureSchema,
  ReceiptKindSchema,
  ScoreDimensionIdSchema,
  SearchDomainClassSchema,
  StrategicModelIdSchema,
  VerticalCandidateIdSchema,
} from "./enums"
import { DateSchema } from "./evidence-schema"
import {
  ClaimIdSchema,
  CompanyIdSchema,
  ObservationIdSchema,
  SearchReceiptIdSchema,
  SourceIdSchema,
  StrategyIdSchema,
} from "./ids"

const NonblankSchema = z
  .string()
  .min(1)
  .refine((value) => value.trim().length > 0)
const LevelSchema = z.number().int().min(0).max(5)
const UniqueStringsSchema = <T extends z.ZodString>(schema: T, minimum = 0) =>
  z
    .array(schema)
    .min(minimum)
    .refine((values) => new Set(values).size === values.length, "Values must be unique")
    .readonly()

export const StrategyResearchReceiptSchema = z
  .object({
    id: SearchReceiptIdSchema,
    candidateId: VerticalCandidateIdSchema,
    dimensionId: ScoreDimensionIdSchema,
    kind: ReceiptKindSchema,
    queries: UniqueStringsSchema(NonblankSchema, 1),
    searchedDomainClasses: z
      .array(SearchDomainClassSchema)
      .min(1)
      .refine((values) => new Set(values).size === values.length, "Values must be unique")
      .readonly(),
    searchedAt: DateSchema.nullable(),
    cutoffAt: DateSchema,
    sourceIds: UniqueStringsSchema(SourceIdSchema),
    observationIds: UniqueStringsSchema(ObservationIdSchema),
    findings: NonblankSchema,
    closure: ReceiptClosureSchema,
    templateHash: z.string().regex(/^[a-f0-9]{64}$/u),
  })
  .strict()
  .readonly()

export const ScoreCellSchema = z
  .object({
    measuredLevel: LevelSchema.nullable(),
    imputation: ImputationSchema.nullable(),
    effectiveRawLevel: LevelSchema,
    convertedScore: LevelSchema,
    claimIds: UniqueStringsSchema(ClaimIdSchema),
    observationIds: UniqueStringsSchema(ObservationIdSchema),
    missingReason: NonblankSchema.nullable(),
    positiveSearchReceiptId: SearchReceiptIdSchema,
    negativeSearchReceiptId: SearchReceiptIdSchema,
  })
  .strict()
  .readonly()

const CommonStrategyFields = {
  strategyId: StrategyIdSchema,
  name: NonblankSchema,
  inferenceClaimIds: UniqueStringsSchema(ClaimIdSchema, 1),
  observationIds: UniqueStringsSchema(ObservationIdSchema, 1),
}

export const VerticalCandidateStrategySchema = z
  .object({
    ...CommonStrategyFields,
    strategyType: z.literal("vertical_candidate"),
    verticalCandidateId: VerticalCandidateIdSchema,
    dimensionCells: z
      .object({
        pain: ScoreCellSchema,
        willingnessToPay: ScoreCellSchema,
        rightsAccess: ScoreCellSchema,
        verifierFeasibility: ScoreCellSchema,
        expertSupply: ScoreCellSchema,
        freshnessBurden: ScoreCellSchema,
        incumbentPressure: ScoreCellSchema,
      })
      .strict()
      .readonly(),
    rawWeightedScore: z.number().min(0).max(100),
    roundedScore: z.number().min(0).max(100),
    caps: UniqueStringsSchema(NonblankSchema),
    rightsBlocker: z.boolean(),
    qualificationFailures: UniqueStringsSchema(NonblankSchema),
    decisionStatus: DecisionStatusSchema,
  })
  .strict()
  .readonly()

export const StrategicModelStrategySchema = z
  .object({
    ...CommonStrategyFields,
    strategyType: z.literal("strategic_model"),
    modelId: StrategicModelIdSchema,
    eligibility: ModelEligibilitySchema,
    modelClaimIds: UniqueStringsSchema(ClaimIdSchema, 1),
    prerequisiteClaimIds: UniqueStringsSchema(ClaimIdSchema, 1),
    killClaimIds: UniqueStringsSchema(ClaimIdSchema, 1),
  })
  .strict()
  .readonly()

const CompetitorResponseFields = {
  ...CommonStrategyFields,
  strategyType: z.literal("competitor_response"),
  incumbentStrengthClaimIds: UniqueStringsSchema(ClaimIdSchema, 1),
  vulnerableWedgeClaimIds: UniqueStringsSchema(ClaimIdSchema, 1),
  buyerClaimIds: UniqueStringsSchema(ClaimIdSchema, 1),
  entryProofClaimIds: UniqueStringsSchema(ClaimIdSchema, 1),
  likelyCounterMoveClaimIds: UniqueStringsSchema(ClaimIdSchema, 1),
  prerequisiteClaimIds: UniqueStringsSchema(ClaimIdSchema, 1),
  noGoTriggerClaimIds: UniqueStringsSchema(ClaimIdSchema, 1),
}

export const CompanyResponseStrategySchema = z
  .object({ ...CompetitorResponseFields, companyId: CompanyIdSchema })
  .strict()
  .readonly()
export const ArchetypeResponseStrategySchema = z
  .object({ ...CompetitorResponseFields, archetypeId: CompetitorArchetypeIdSchema })
  .strict()
  .readonly()

export const RoadmapStrategySchema = z
  .object({
    ...CommonStrategyFields,
    strategyType: z.literal("roadmap"),
    horizon: NonblankSchema,
    order: z.number().int().min(1),
    actionClaimIds: UniqueStringsSchema(ClaimIdSchema, 1),
    gateClaimIds: UniqueStringsSchema(ClaimIdSchema, 1),
  })
  .strict()
  .readonly()

export const PricingExperimentStrategySchema = z
  .object({
    ...CommonStrategyFields,
    strategyType: z.literal("pricing_experiment"),
    amount: z.number().min(0).nullable(),
    currency: NonblankSchema.nullable(),
    unit: NonblankSchema.nullable(),
    hypothesisClaimIds: UniqueStringsSchema(ClaimIdSchema, 1),
    successClaimIds: UniqueStringsSchema(ClaimIdSchema, 1),
    killClaimIds: UniqueStringsSchema(ClaimIdSchema, 1),
  })
  .strict()
  .readonly()

export const StrategySchema = z.union([
  VerticalCandidateStrategySchema,
  StrategicModelStrategySchema,
  CompanyResponseStrategySchema,
  ArchetypeResponseStrategySchema,
  RoadmapStrategySchema,
  PricingExperimentStrategySchema,
])

export const StrategyCollectionSchema = z
  .array(StrategySchema)
  .refine(
    (values) => new Set(values.map((strategy) => strategy.strategyId)).size === values.length,
    "Strategy IDs must be unique",
  )
  .readonly()
export const StrategyResearchReceiptCollectionSchema = z
  .array(StrategyResearchReceiptSchema)
  .refine(
    (values) => new Set(values.map((receipt) => receipt.id)).size === values.length,
    "Receipt IDs must be unique",
  )
  .readonly()

export type StrategyResearchReceipt = z.infer<typeof StrategyResearchReceiptSchema>
export type ScoreCell = z.infer<typeof ScoreCellSchema>
export type VerticalCandidateStrategy = z.infer<typeof VerticalCandidateStrategySchema>
export type StrategicModelStrategy = z.infer<typeof StrategicModelStrategySchema>
export type CompanyResponseStrategy = z.infer<typeof CompanyResponseStrategySchema>
export type ArchetypeResponseStrategy = z.infer<typeof ArchetypeResponseStrategySchema>
export type Strategy = z.infer<typeof StrategySchema>
