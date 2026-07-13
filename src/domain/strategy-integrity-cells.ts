import { SCORE_DIMENSIONS, type ScoreDimensionId } from "./enums"
import { deriveSupportSummary } from "./evidence"
import type { Claim, Source } from "./evidence-schema"
import type { StrategyIntegrityIssue } from "./strategy-integrity-types"
import type {
  ScoreCell,
  StrategyResearchReceipt,
  VerticalCandidateStrategy,
} from "./strategy-schema"
import { computeCandidateScore, deriveBenefitQualityCap } from "./strategy-score"

const POSITIVE_RELATIONS = new Set(["supports", "partially_supports"])

const sameSet = (left: readonly string[], right: readonly string[]): boolean => {
  const leftSet = new Set(left)
  const rightSet = new Set(right)
  return leftSet.size === rightSet.size && [...leftSet].every((value) => rightSet.has(value))
}

type CellAuditContext = {
  readonly candidate: VerticalCandidateStrategy
  readonly dimensionId: ScoreDimensionId
  readonly cell: ScoreCell
  readonly receiptMap: ReadonlyMap<StrategyResearchReceipt["id"], StrategyResearchReceipt>
  readonly claimMap: ReadonlyMap<Claim["claimId"], Claim>
  readonly sourceMap: ReadonlyMap<Source["sourceId"], Source>
  readonly references: Map<StrategyResearchReceipt["id"], number>
  readonly issues: StrategyIntegrityIssue[]
}

const auditCellEvidence = (context: CellAuditContext, path: string): void => {
  const claims = context.cell.claimIds.flatMap((claimId) => {
    const claim = context.claimMap.get(claimId)
    if (claim !== undefined) return [claim]
    context.issues.push({ code: "UNKNOWN_CLAIM_ID", path, message: `Unknown claim ${claimId}` })
    return []
  })
  const positiveLinks = claims.flatMap((claim) =>
    claim.evidenceLinks.filter((link) => POSITIVE_RELATIONS.has(link.supportRelation)),
  )
  if (positiveLinks.length === 0) {
    context.issues.push({
      code: "MEASURED_CELL_LACKS_POSITIVE_SUPPORT",
      path,
      message: "Measured cells require positive claim support",
    })
  }
  const positiveReceipt = context.receiptMap.get(context.cell.positiveSearchReceiptId)
  const negativeReceipt = context.receiptMap.get(context.cell.negativeSearchReceiptId)
  const retainedSourceIds = [
    ...(positiveReceipt?.sourceIds ?? []),
    ...(negativeReceipt?.sourceIds ?? []),
  ]
  const retainedObservationIds = [
    ...(positiveReceipt?.observationIds ?? []),
    ...(negativeReceipt?.observationIds ?? []),
  ]
  if (
    !sameSet(
      context.cell.observationIds,
      positiveLinks.map((link) => link.observationId),
    ) ||
    positiveLinks.some(
      (link) =>
        !retainedSourceIds.includes(link.sourceId) ||
        !retainedObservationIds.includes(link.observationId),
    )
  ) {
    context.issues.push({
      code: "MEASURED_CELL_RECEIPT_EVIDENCE_MISMATCH",
      path,
      message: "Measured evidence must be retained by its receipt pair",
    })
  }
  if (context.dimensionId === "freshnessBurden" || context.dimensionId === "incumbentPressure") {
    return
  }
  const quality = claims.flatMap((claim) =>
    claim.evidenceLinks
      .filter((link) => POSITIVE_RELATIONS.has(link.supportRelation))
      .flatMap((link) => {
        const source = context.sourceMap.get(link.sourceId)
        return source === undefined
          ? []
          : [
              {
                control: source.control,
                confidence: claim.confidence,
                supportSummary: deriveSupportSummary(claim),
                temporal: claim.temporal,
                independentGroupCount: claim.independentGroupCount,
              },
            ]
      }),
  )
  const measuredLevel = context.cell.measuredLevel
  if (measuredLevel !== null && measuredLevel > deriveBenefitQualityCap(quality)) {
    context.issues.push({
      code: "SCORE_QUALITY_CAP_VIOLATION",
      path,
      message: `${measuredLevel} exceeds its evidence-quality cap`,
    })
  }
}

const auditScoreCell = (context: CellAuditContext): void => {
  const path = `${context.candidate.strategyId}.${context.dimensionId}`
  const isBurden =
    context.dimensionId === "freshnessBurden" || context.dimensionId === "incumbentPressure"
  for (const [kind, receiptId] of [
    ["positive", context.cell.positiveSearchReceiptId],
    ["negative", context.cell.negativeSearchReceiptId],
  ] as const) {
    const receipt = context.receiptMap.get(receiptId)
    if (receipt === undefined) {
      context.issues.push({ code: "MISSING_SEARCH_RECEIPT", path, message: `Missing ${receiptId}` })
      continue
    }
    if (
      receipt.candidateId !== context.candidate.verticalCandidateId ||
      receipt.dimensionId !== context.dimensionId ||
      receipt.kind !== kind
    ) {
      context.issues.push({
        code: "MISMATCHED_SEARCH_RECEIPT",
        path,
        message: `${receiptId} does not match its score cell`,
      })
    }
    context.references.set(receiptId, (context.references.get(receiptId) ?? 0) + 1)
  }
  if (context.cell.measuredLevel === null) {
    const conservative =
      context.cell.imputation === "conservative_missing" &&
      context.cell.effectiveRawLevel === (isBurden ? 5 : 0) &&
      context.cell.convertedScore === 0 &&
      context.cell.claimIds.length === 0 &&
      context.cell.observationIds.length === 0 &&
      context.cell.missingReason !== null
    if (!conservative) {
      context.issues.push({
        code: "NONCONSERVATIVE_MISSING_IMPUTATION",
        path,
        message: "Missing scores must use conservative imputation",
      })
    }
    return
  }
  const measured =
    context.cell.imputation === null &&
    context.cell.effectiveRawLevel === context.cell.measuredLevel &&
    context.cell.missingReason === null &&
    context.cell.claimIds.length > 0 &&
    context.cell.observationIds.length > 0
  if (!measured) {
    context.issues.push({
      code: "INVALID_MEASURED_SCORE_CELL",
      path,
      message: "Measured scores require evidence and no imputation",
    })
  }
  const converted = isBurden ? 5 - context.cell.measuredLevel : context.cell.measuredLevel
  if (context.cell.convertedScore !== converted) {
    context.issues.push({
      code: "SCORE_CONVERSION_MISMATCH",
      path,
      message: `Expected converted score ${converted}`,
    })
  }
  auditCellEvidence(context, path)
}

export type CandidateCellIntegrityInput = {
  readonly candidates: readonly VerticalCandidateStrategy[]
  readonly receipts: readonly StrategyResearchReceipt[]
  readonly sources: readonly Source[]
  readonly claims: readonly Claim[]
}

export type CandidateCellAudit = {
  readonly issues: readonly StrategyIntegrityIssue[]
  readonly references: ReadonlyMap<StrategyResearchReceipt["id"], number>
}

export const auditCandidateCells = (input: CandidateCellIntegrityInput): CandidateCellAudit => {
  const issues: StrategyIntegrityIssue[] = []
  const receiptMap = new Map(input.receipts.map((receipt) => [receipt.id, receipt]))
  const claimMap = new Map(input.claims.map((claim) => [claim.claimId, claim]))
  const sourceMap = new Map(input.sources.map((source) => [source.sourceId, source]))
  const references = new Map<StrategyResearchReceipt["id"], number>()
  for (const candidate of input.candidates) {
    for (const dimensionId of SCORE_DIMENSIONS) {
      auditScoreCell({
        candidate,
        dimensionId,
        cell: candidate.dimensionCells[dimensionId],
        receiptMap,
        claimMap,
        sourceMap,
        references,
        issues,
      })
    }
    const computed = computeCandidateScore(candidate)
    if (
      Math.abs(candidate.rawWeightedScore - computed.rawWeightedScore) > 1e-9 ||
      candidate.roundedScore !== computed.roundedScore
    ) {
      issues.push({
        code: "STRATEGY_SCORE_MISMATCH",
        path: candidate.strategyId,
        message: `Expected ${computed.rawWeightedScore}/${computed.roundedScore}`,
      })
    }
  }
  return { issues, references }
}
