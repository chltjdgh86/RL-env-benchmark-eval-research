import { z } from "zod"
import {
  AdjacentSchema,
  BuyerEvidenceSchema,
  CompanySchema,
  IndustrySchema,
} from "../domain/entity-schema"
import { BUSINESS_MODELS, BusinessModelIdSchema, ThemeSchema } from "../domain/enums"
import { ClaimSchema, DateSchema, ObservationSchema, SourceSchema } from "../domain/evidence-schema"
import {
  AnalysisIdSchema,
  BuyerEvidenceIdSchema,
  ClaimIdSchema,
  CompanyIdSchema,
  IndustryIdSchema,
} from "../domain/ids"
import {
  StrategyCollectionSchema,
  StrategyResearchReceiptCollectionSchema,
} from "../domain/strategy-schema"

const NonblankSchema = z.string().trim().min(1)
const uniqueArray = <T extends z.ZodType>(schema: T, minimum = 0) =>
  z
    .array(schema)
    .min(minimum)
    .refine(
      (values) => new Set(values.map((value) => JSON.stringify(value))).size === values.length,
      "Values must be unique",
    )
    .readonly()

const CommonAnalysisFields = {
  analysisId: AnalysisIdSchema,
  themes: uniqueArray(ThemeSchema, 1),
}

export const HistoryEventSchema = z
  .object({
    ...CommonAnalysisFields,
    analysisType: z.literal("history_event"),
    date: DateSchema,
    claimIds: uniqueArray(ClaimIdSchema, 1),
    companyIds: uniqueArray(CompanyIdSchema),
    industryIds: uniqueArray(IndustryIdSchema),
  })
  .strict()
  .readonly()

export const GtmMotionSchema = z
  .object({
    ...CommonAnalysisFields,
    analysisType: z.literal("gtm_motion"),
    name: NonblankSchema,
    stageOrder: z.number().int().min(1),
    claimIds: uniqueArray(ClaimIdSchema, 1),
    buyerEvidenceIds: uniqueArray(BuyerEvidenceIdSchema),
  })
  .strict()
  .readonly()

export const EconomicModelSchema = z
  .object({
    ...CommonAnalysisFields,
    analysisType: z.literal("economic_model"),
    businessModelId: BusinessModelIdSchema,
    name: NonblankSchema,
    formula: NonblankSchema.nullable(),
    inputClaimIds: uniqueArray(ClaimIdSchema, 1),
    comparabilityClass: NonblankSchema,
  })
  .strict()
  .readonly()

export const RiskAnalysisSchema = z
  .object({
    ...CommonAnalysisFields,
    analysisType: z.literal("risk"),
    name: NonblankSchema,
    allegationClaimIds: uniqueArray(ClaimIdSchema),
    incidentClaimIds: uniqueArray(ClaimIdSchema),
    counterevidenceClaimIds: uniqueArray(ClaimIdSchema),
    unknownClaimIds: uniqueArray(ClaimIdSchema),
  })
  .strict()
  .refine(
    (risk) =>
      risk.allegationClaimIds.length +
        risk.incidentClaimIds.length +
        risk.counterevidenceClaimIds.length +
        risk.unknownClaimIds.length >
      0,
    "Risk analysis requires claim support",
  )
  .readonly()

export const MetricAnalysisSchema = z
  .object({
    ...CommonAnalysisFields,
    analysisType: z.literal("metric"),
    name: NonblankSchema,
    valueClaimId: ClaimIdSchema,
    unit: NonblankSchema,
    period: NonblankSchema.nullable(),
    denominator: NonblankSchema.nullable(),
    comparabilityClass: NonblankSchema,
  })
  .strict()
  .readonly()

export const ValueChainEdgeSchema = z
  .object({
    ...CommonAnalysisFields,
    analysisType: z.literal("value_chain_edge"),
    fromIndustryId: IndustryIdSchema,
    toIndustryId: IndustryIdSchema,
    claimIds: uniqueArray(ClaimIdSchema, 1),
  })
  .strict()
  .readonly()

export const MarketAnalysisSchema = z.discriminatedUnion("analysisType", [
  HistoryEventSchema,
  GtmMotionSchema,
  EconomicModelSchema,
  RiskAnalysisSchema,
  MetricAnalysisSchema,
  ValueChainEdgeSchema,
])

export const ResearchCorpusSchema = z
  .object({
    sources: z.array(SourceSchema.readonly()).readonly(),
    observations: z.array(ObservationSchema.readonly()).readonly(),
    claims: z.array(ClaimSchema.readonly()).readonly(),
    companies: z.array(CompanySchema.readonly()).readonly(),
    industries: z.array(IndustrySchema.readonly()).readonly(),
    adjacent: z.array(AdjacentSchema.readonly()).readonly(),
    buyerEvidence: z.array(BuyerEvidenceSchema.readonly()).readonly(),
    marketAnalysis: z.array(MarketAnalysisSchema).readonly(),
    strategies: StrategyCollectionSchema,
    receipts: StrategyResearchReceiptCollectionSchema,
  })
  .strict()
  .readonly()

export type MarketAnalysis = z.infer<typeof MarketAnalysisSchema>
export type ResearchCorpus = z.infer<typeof ResearchCorpusSchema>

export class CorpusIntegrityError extends Error {
  readonly name = "CorpusIntegrityError"

  constructor(
    readonly code: string,
    readonly path: string,
    detail: string,
  ) {
    super(`${code}:${path}:${detail}`)
  }
}

const analysisFail = (code: string, path: string, detail: string): never => {
  throw new CorpusIntegrityError(code, path, detail)
}

export function assertAnalysisCrossKeys(corpus: ResearchCorpus): void {
  const claimIds = new Set<string>(corpus.claims.map((claim) => claim.claimId))
  const companyIds = new Set<string>(corpus.companies.map((company) => company.companyId))
  const industryIds = new Set<string>(corpus.industries.map((industry) => industry.industryId))
  const buyers = new Map(corpus.buyerEvidence.map((buyer) => [buyer.buyerEvidenceId, buyer]))
  const economicModels: string[] = []
  const requireClaims = (ids: readonly string[], path: string): void => {
    for (const claimId of ids) {
      if (!claimIds.has(claimId)) analysisFail("UNKNOWN_CLAIM_ID", path, claimId)
    }
  }
  for (const analysis of corpus.marketAnalysis) {
    const path = `marketAnalysis.${analysis.analysisId}`
    switch (analysis.analysisType) {
      case "history_event":
        requireClaims(analysis.claimIds, path)
        for (const companyId of analysis.companyIds) {
          if (!companyIds.has(companyId)) analysisFail("UNKNOWN_COMPANY_ID", path, companyId)
        }
        for (const industryId of analysis.industryIds) {
          if (!industryIds.has(industryId)) analysisFail("UNKNOWN_INDUSTRY_ID", path, industryId)
        }
        break
      case "gtm_motion":
        requireClaims(analysis.claimIds, path)
        for (const buyerId of analysis.buyerEvidenceIds) {
          const buyer = buyers.get(buyerId)
          if (buyer === undefined) {
            analysisFail("UNKNOWN_BUYER_EVIDENCE_ID", path, buyerId)
          } else if (
            buyer.evidenceState !== "buyer_confirmed" &&
            buyer.evidenceState !== "procurement_confirmed"
          ) {
            analysisFail("UNCONFIRMED_GTM_BUYER", path, buyerId)
          }
        }
        break
      case "economic_model":
        requireClaims(analysis.inputClaimIds, path)
        economicModels.push(analysis.businessModelId)
        break
      case "risk":
        requireClaims(
          [
            ...analysis.allegationClaimIds,
            ...analysis.incidentClaimIds,
            ...analysis.counterevidenceClaimIds,
            ...analysis.unknownClaimIds,
          ],
          path,
        )
        break
      case "metric":
        requireClaims([analysis.valueClaimId], path)
        break
      case "value_chain_edge":
        requireClaims(analysis.claimIds, path)
        if (!industryIds.has(analysis.fromIndustryId) || !industryIds.has(analysis.toIndustryId)) {
          analysisFail("UNKNOWN_INDUSTRY_ID", path, "Unknown edge endpoint")
        }
        break
      default:
        analysis satisfies never
    }
  }
  for (const model of BUSINESS_MODELS) {
    if (economicModels.filter((candidate) => candidate === model).length !== 1) {
      analysisFail("ECONOMIC_MODEL_COVERAGE", "marketAnalysis", model)
    }
  }
}
