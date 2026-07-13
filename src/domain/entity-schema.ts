import { z } from "zod"
import {
  AdjacentInclusionKindSchema,
  BusinessModelIdSchema,
  BuyerEvidenceStateSchema,
  BuyerMotionSchema,
  BuyerTypeSchema,
  EntityStatusSchema,
  IndustryKindSchema,
  SegmentIdSchema,
  ValueChainStageSchema,
} from "./enums"
import { DateSchema, HttpsOriginSchema } from "./evidence-schema"
import {
  AdjacentIdSchema,
  BuyerEvidenceIdSchema,
  ClaimIdSchema,
  CompanyIdSchema,
  IndustryIdSchema,
  ObservationIdSchema,
} from "./ids"

const uniqueArray = <T extends z.ZodType>(schema: T, minimum = 0) =>
  z
    .array(schema)
    .min(minimum)
    .refine(
      (values) => new Set(values.map((value) => JSON.stringify(value))).size === values.length,
      "Values must be unique",
    )
    .readonly()
const claimIds = uniqueArray(ClaimIdSchema)
const requiredClaimIds = uniqueArray(ClaimIdSchema, 1)
const requiredObservationIds = uniqueArray(ObservationIdSchema, 1)
const names = uniqueArray(z.string().trim().min(1))

export const ClaimGroupsSchema = z
  .object({
    origin: requiredClaimIds,
    initialWedge: requiredClaimIds,
    evolution: requiredClaimIds,
    currentOffer: requiredClaimIds,
    buyers: requiredClaimIds,
    gtm: requiredClaimIds,
    operatingModel: requiredClaimIds,
    economics: requiredClaimIds,
    milestones: requiredClaimIds,
    risks: requiredClaimIds,
    currentStatus: requiredClaimIds,
    contradictions: claimIds,
    unknowns: claimIds,
  })
  .strict()
  .readonly()

export const CompanySchema = z
  .object({
    companyId: CompanyIdSchema,
    name: z.string().trim().min(1),
    aliases: names,
    canonicalDomain: HttpsOriginSchema,
    identityClaimId: ClaimIdSchema,
    entityStatus: EntityStatusSchema,
    industryIds: uniqueArray(IndustryIdSchema, 1),
    primarySegment: SegmentIdSchema,
    businessModelIds: uniqueArray(BusinessModelIdSchema, 1),
    claimGroups: ClaimGroupsSchema,
    buyerEvidenceIds: uniqueArray(BuyerEvidenceIdSchema),
    comparisonMetricClaimIds: claimIds,
  })
  .strict()
  .readonly()

export const IndustrySchema = z
  .object({
    industryId: IndustryIdSchema,
    name: z.string().trim().min(1),
    aliases: names,
    kind: IndustryKindSchema,
    valueChainStage: ValueChainStageSchema,
    definitionClaimId: ClaimIdSchema,
    boundaryClaimIds: requiredClaimIds,
    buyerClaimIds: claimIds,
    companyIds: uniqueArray(CompanyIdSchema),
    adjacentIds: uniqueArray(AdjacentIdSchema),
  })
  .strict()
  .readonly()

export const AdjacentSchema = z
  .object({
    adjacentId: AdjacentIdSchema,
    name: z.string().trim().min(1),
    aliases: names,
    canonicalDomain: HttpsOriginSchema,
    primarySegment: SegmentIdSchema,
    secondaryIndustryIds: uniqueArray(IndustryIdSchema, 1),
    businessModelIds: uniqueArray(BusinessModelIdSchema, 1),
    entityStatus: EntityStatusSchema,
    inclusionKind: AdjacentInclusionKindSchema,
    inclusionClaimId: ClaimIdSchema,
    currentOfferClaimId: ClaimIdSchema,
    currentStatusClaimId: ClaimIdSchema,
    currentOfferObservationIds: requiredObservationIds,
    currentStatusObservationIds: requiredObservationIds,
  })
  .strict()
  .readonly()

const BuyerEvidenceBase = {
  buyerEvidenceId: BuyerEvidenceIdSchema,
  buyerName: z.string().trim().min(1).nullable(),
  buyerNameClaimId: ClaimIdSchema.nullable(),
  buyerType: BuyerTypeSchema,
  motion: BuyerMotionSchema,
  evidenceState: BuyerEvidenceStateSchema,
  claimIds: requiredClaimIds,
  observationIds: requiredObservationIds,
  outcomeClaimIds: claimIds,
  validAt: DateSchema.nullable(),
}

const CompanyBuyerEvidenceSchema = z
  .object({ ...BuyerEvidenceBase, companyId: CompanyIdSchema })
  .strict()
  .readonly()
const AdjacentBuyerEvidenceSchema = z
  .object({ ...BuyerEvidenceBase, adjacentId: AdjacentIdSchema })
  .strict()
  .readonly()

export const BuyerEvidenceSchema = z
  .union([CompanyBuyerEvidenceSchema, AdjacentBuyerEvidenceSchema])
  .superRefine((value, context) => {
    if ((value.buyerName === null) !== (value.buyerNameClaimId === null)) {
      context.addIssue({ code: "custom", message: "buyerName and buyerNameClaimId must pair" })
    }
  })
  .readonly()

export type ClaimGroups = z.infer<typeof ClaimGroupsSchema>
export type Company = z.infer<typeof CompanySchema>
export type Industry = z.infer<typeof IndustrySchema>
export type Adjacent = z.infer<typeof AdjacentSchema>
export type BuyerEvidence = z.infer<typeof BuyerEvidenceSchema>
