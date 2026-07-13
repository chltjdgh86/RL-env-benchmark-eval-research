import {
  type Confidence,
  type Control,
  SCORE_DIMENSIONS,
  type ScoreDimensionId,
  type SupportSummary,
  type Temporal,
} from "./enums"
import type { StrategyResearchReceipt, VerticalCandidateStrategy } from "./strategy-schema"

export const STRATEGY_WEIGHTS = {
  pain: 20,
  willingnessToPay: 20,
  rightsAccess: 15,
  verifierFeasibility: 15,
  expertSupply: 10,
  freshnessBurden: 10,
  incumbentPressure: 10,
} as const satisfies Readonly<Record<ScoreDimensionId, number>>

const TERMINAL_RECEIPT_CLOSURES = new Set([
  "evidence_found",
  "no_public_evidence",
  "rights_blocker",
  "duplicate",
  "dead",
])

export type CandidateScore = {
  readonly rawWeightedScore: number
  readonly roundedScore: number
}

export type EvidenceQuality = {
  readonly control: Control
  readonly confidence: Confidence
  readonly supportSummary: SupportSummary
  readonly temporal: Temporal
  readonly independentGroupCount: number
}

export type RightsGateInput = {
  readonly rightsAccessScore: number
  readonly hasLawfulRightsObservation: boolean
  readonly currentHighRiskRightsEvidence: readonly {
    readonly supportSummary: SupportSummary
  }[]
}

export type CandidateEvaluationInput = {
  readonly strategy: VerticalCandidateStrategy
  readonly receipts: readonly StrategyResearchReceipt[]
  readonly buyerOrProcurementObservationIds: readonly string[]
}

export type QualificationFailure =
  | "full_precision_score_below_70"
  | "one_or_more_dimensions_below_3"
  | "fewer_than_two_separate_buyer_or_procurement_observations"
  | "rights_blocker"
  | "auditable_receipt_closure_gate"

export type CandidateEvaluation = {
  readonly strategy: VerticalCandidateStrategy
  readonly score: CandidateScore
  readonly convertedScores: Readonly<Record<ScoreDimensionId, number>>
  readonly qualificationFailures: readonly QualificationFailure[]
  readonly qualified: boolean
}

export type VerticalDecision =
  | {
      readonly kind: "winner"
      readonly winnerStrategyId: VerticalCandidateStrategy["strategyId"]
      readonly runnerUpStrategyId: VerticalCandidateStrategy["strategyId"]
      readonly lead: number
    }
  | {
      readonly kind: "no_go"
      readonly reason:
        | "no_qualifying_candidate"
        | "winner_lead_below_10"
        | "insufficient_candidates"
    }

export const convertDimensionScore = (input: {
  readonly dimensionId: ScoreDimensionId
  readonly effectiveRawLevel: number
}): number =>
  input.dimensionId === "freshnessBurden" || input.dimensionId === "incumbentPressure"
    ? 5 - input.effectiveRawLevel
    : input.effectiveRawLevel

const convertedScoresFor = (
  strategy: VerticalCandidateStrategy,
): Readonly<Record<ScoreDimensionId, number>> => ({
  pain: convertDimensionScore({
    dimensionId: "pain",
    effectiveRawLevel: strategy.dimensionCells.pain.effectiveRawLevel,
  }),
  willingnessToPay: convertDimensionScore({
    dimensionId: "willingnessToPay",
    effectiveRawLevel: strategy.dimensionCells.willingnessToPay.effectiveRawLevel,
  }),
  rightsAccess: convertDimensionScore({
    dimensionId: "rightsAccess",
    effectiveRawLevel: strategy.dimensionCells.rightsAccess.effectiveRawLevel,
  }),
  verifierFeasibility: convertDimensionScore({
    dimensionId: "verifierFeasibility",
    effectiveRawLevel: strategy.dimensionCells.verifierFeasibility.effectiveRawLevel,
  }),
  expertSupply: convertDimensionScore({
    dimensionId: "expertSupply",
    effectiveRawLevel: strategy.dimensionCells.expertSupply.effectiveRawLevel,
  }),
  freshnessBurden: convertDimensionScore({
    dimensionId: "freshnessBurden",
    effectiveRawLevel: strategy.dimensionCells.freshnessBurden.effectiveRawLevel,
  }),
  incumbentPressure: convertDimensionScore({
    dimensionId: "incumbentPressure",
    effectiveRawLevel: strategy.dimensionCells.incumbentPressure.effectiveRawLevel,
  }),
})

export const computeCandidateScore = (strategy: VerticalCandidateStrategy): CandidateScore => {
  const scores = convertedScoresFor(strategy)
  const weightedTotal = SCORE_DIMENSIONS.reduce(
    (total, dimensionId) => total + scores[dimensionId] * STRATEGY_WEIGHTS[dimensionId],
    0,
  )
  const rawWeightedScore = weightedTotal / 5
  return {
    rawWeightedScore,
    roundedScore: Math.round((rawWeightedScore + Number.EPSILON) * 10) / 10,
  }
}

export const deriveBenefitQualityCap = (evidence: readonly EvidenceQuality[]): number => {
  if (evidence.length === 0) return 0
  const hasDegradedEvidence = evidence.some(
    (item) =>
      item.control === "subject_controlled" ||
      item.control === "commercially_affiliated" ||
      item.confidence === "low" ||
      item.confidence === "unscored" ||
      item.supportSummary === "contested" ||
      item.supportSummary === "contradicted" ||
      item.supportSummary === "not_publicly_verified" ||
      item.temporal === "superseded" ||
      item.temporal === "unknown",
  )
  if (hasDegradedEvidence) return 2
  return evidence.some((item) => item.independentGroupCount === 1) ? 3 : 5
}

export const applyBenefitQualityCap = (
  measuredLevel: number,
  evidence: readonly EvidenceQuality[],
): number => Math.min(measuredLevel, deriveBenefitQualityCap(evidence))

export const deriveRightsBlocker = (input: RightsGateInput): boolean => {
  const degraded = input.currentHighRiskRightsEvidence.some((evidence) =>
    ["contested", "contradicted", "not_publicly_verified"].includes(evidence.supportSummary),
  )
  return input.rightsAccessScore < 3 || !input.hasLawfulRightsObservation || degraded
}

const hasAuditableReceipts = (input: CandidateEvaluationInput): boolean =>
  SCORE_DIMENSIONS.every((dimensionId) => {
    const cell = input.strategy.dimensionCells[dimensionId]
    return (["positive", "negative"] as const).every((kind) => {
      const expectedId =
        kind === "positive" ? cell.positiveSearchReceiptId : cell.negativeSearchReceiptId
      const receipt = input.receipts.find((item) => item.id === expectedId)
      return (
        receipt?.candidateId === input.strategy.verticalCandidateId &&
        receipt.dimensionId === dimensionId &&
        receipt.kind === kind &&
        receipt.searchedAt !== null &&
        TERMINAL_RECEIPT_CLOSURES.has(receipt.closure)
      )
    })
  })

export const evaluateCandidate = (input: CandidateEvaluationInput): CandidateEvaluation => {
  const score = computeCandidateScore(input.strategy)
  const convertedScores = convertedScoresFor(input.strategy)
  const failures: QualificationFailure[] = []
  if (score.rawWeightedScore < 70) failures.push("full_precision_score_below_70")
  if (SCORE_DIMENSIONS.some((dimensionId) => convertedScores[dimensionId] < 3)) {
    failures.push("one_or_more_dimensions_below_3")
  }
  if (new Set(input.buyerOrProcurementObservationIds).size < 2) {
    failures.push("fewer_than_two_separate_buyer_or_procurement_observations")
  }
  if (input.strategy.rightsBlocker) failures.push("rights_blocker")
  if (!hasAuditableReceipts(input)) failures.push("auditable_receipt_closure_gate")
  return {
    strategy: input.strategy,
    score,
    convertedScores,
    qualificationFailures: failures,
    qualified: failures.length === 0,
  }
}

const compareEvaluations = (left: CandidateEvaluation, right: CandidateEvaluation): number =>
  right.score.rawWeightedScore - left.score.rawWeightedScore ||
  right.convertedScores.willingnessToPay - left.convertedScores.willingnessToPay ||
  right.convertedScores.rightsAccess - left.convertedScores.rightsAccess ||
  right.convertedScores.verifierFeasibility - left.convertedScores.verifierFeasibility ||
  right.convertedScores.freshnessBurden - left.convertedScores.freshnessBurden ||
  right.convertedScores.incumbentPressure - left.convertedScores.incumbentPressure ||
  left.strategy.strategyId.localeCompare(right.strategy.strategyId)

export const selectVerticalDecision = (
  evaluations: readonly CandidateEvaluation[],
): VerticalDecision => {
  const ranked = [...evaluations].sort(compareEvaluations)
  const winner = ranked.find((evaluation) => evaluation.qualified)
  if (winner === undefined) return { kind: "no_go", reason: "no_qualifying_candidate" }
  const runnerUp = ranked.find(
    (evaluation) => evaluation.strategy.strategyId !== winner.strategy.strategyId,
  )
  if (runnerUp === undefined) return { kind: "no_go", reason: "insufficient_candidates" }
  const lead = winner.score.rawWeightedScore - runnerUp.score.rawWeightedScore
  if (lead < 10) return { kind: "no_go", reason: "winner_lead_below_10" }
  return {
    kind: "winner",
    winnerStrategyId: winner.strategy.strategyId,
    runnerUpStrategyId: runnerUp.strategy.strategyId,
    lead,
  }
}
