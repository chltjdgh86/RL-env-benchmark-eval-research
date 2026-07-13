import { SCORE_DIMENSIONS } from "./enums"
import type { Claim, Observation, Source } from "./evidence-schema"
import { deriveReceiptTemplateHash } from "./strategy-hash"
import { auditCandidateCells } from "./strategy-integrity-cells"
import type { StrategyIntegrityIssue } from "./strategy-integrity-types"
import type { StrategyResearchReceipt, VerticalCandidateStrategy } from "./strategy-schema"

export type ReceiptIntegrityInput = {
  readonly candidates: readonly VerticalCandidateStrategy[]
  readonly receipts: readonly StrategyResearchReceipt[]
  readonly sources: readonly Source[]
  readonly observations: readonly Observation[]
  readonly claims: readonly Claim[]
}

const TERMINAL_CLOSURES = new Set([
  "evidence_found",
  "no_public_evidence",
  "rights_blocker",
  "duplicate",
  "dead",
])

const sameSet = (left: readonly string[], right: readonly string[]): boolean => {
  const leftSet = new Set(left)
  const rightSet = new Set(right)
  return leftSet.size === rightSet.size && [...leftSet].every((value) => rightSet.has(value))
}

type ReceiptAuditContext = {
  readonly input: ReceiptIntegrityInput
  readonly sourceIds: ReadonlySet<Source["sourceId"]>
  readonly observationMap: ReadonlyMap<Observation["observationId"], Observation>
  readonly issues: StrategyIntegrityIssue[]
}

const auditReceipt = (
  receipt: StrategyResearchReceipt,
  index: number,
  context: ReceiptAuditContext,
): void => {
  const path = `receipts[${index}]`
  if (deriveReceiptTemplateHash(receipt) !== receipt.templateHash) {
    context.issues.push({
      code: "SEARCH_TEMPLATE_HASH_MISMATCH",
      path,
      message: "Template hash drift",
    })
  }
  if (!TERMINAL_CLOSURES.has(receipt.closure) || receipt.searchedAt === null) {
    context.issues.push({
      code: "SEARCH_RECEIPT_NOT_TERMINAL",
      path,
      message: "Receipt lane is open",
    })
  }
  if (
    (receipt.closure === "evidence_found" || receipt.closure === "rights_blocker") &&
    receipt.sourceIds.length === 0
  ) {
    context.issues.push({
      code: "UNSUPPORTED_SEARCH_CLOSURE",
      path,
      message: "Closure lacks provenance",
    })
  }
  for (const sourceId of receipt.sourceIds) {
    if (!context.sourceIds.has(sourceId)) {
      context.issues.push({
        code: "UNKNOWN_SOURCE_ID",
        path,
        message: `Unknown source ${sourceId}`,
      })
    }
  }
  const observedSources = receipt.observationIds.flatMap((observationId) => {
    const observation = context.observationMap.get(observationId)
    if (observation !== undefined) return [observation.sourceId]
    context.issues.push({
      code: "UNKNOWN_OBSERVATION_ID",
      path,
      message: `Unknown observation ${observationId}`,
    })
    return []
  })
  if (
    !sameSet(receipt.sourceIds, observedSources) ||
    receipt.sourceIds.length !== observedSources.length
  ) {
    context.issues.push({
      code: "RECEIPT_SOURCE_OBSERVATION_MISMATCH",
      path,
      message: "Receipt sources and observations must form a bijection",
    })
  }
}

const auditCounterevidenceReuse = (
  input: ReceiptIntegrityInput,
  receiptMap: ReadonlyMap<StrategyResearchReceipt["id"], StrategyResearchReceipt>,
  issues: StrategyIntegrityIssue[],
): void => {
  for (const candidate of input.candidates) {
    for (const dimensionId of SCORE_DIMENSIONS) {
      const cell = candidate.dimensionCells[dimensionId]
      const positive = receiptMap.get(cell.positiveSearchReceiptId)
      const negative = receiptMap.get(cell.negativeSearchReceiptId)
      if (
        negative?.observationIds.some((observationId) =>
          positive?.observationIds.includes(observationId),
        )
      ) {
        issues.push({
          code: "REUSED_POSITIVE_AS_COUNTEREVIDENCE",
          path: `${candidate.strategyId}.${dimensionId}`,
          message: "Positive evidence was reused as counterevidence",
        })
      }
    }
  }
}

export const auditReceiptIntegrity = (
  input: ReceiptIntegrityInput,
): readonly StrategyIntegrityIssue[] => {
  const cellAudit = auditCandidateCells({
    candidates: input.candidates,
    receipts: input.receipts,
    sources: input.sources,
    claims: input.claims,
  })
  const issues = [...cellAudit.issues]
  if (input.receipts.length !== 70) {
    issues.push({ code: "SEARCH_RECEIPT_COUNT", path: "receipts", message: "Expected 70 receipts" })
  }
  const receiptMap = new Map(input.receipts.map((receipt) => [receipt.id, receipt]))
  const context: ReceiptAuditContext = {
    input,
    sourceIds: new Set(input.sources.map((source) => source.sourceId)),
    observationMap: new Map(
      input.observations.map((observation) => [observation.observationId, observation]),
    ),
    issues,
  }
  const triples = new Set<string>()
  for (const [index, receipt] of input.receipts.entries()) {
    const triple = `${receipt.candidateId}|${receipt.dimensionId}|${receipt.kind}`
    if (triples.has(triple)) {
      issues.push({
        code: "DUPLICATE_SEARCH_RECEIPT_CELL",
        path: `receipts[${index}]`,
        message: `Duplicate ${triple}`,
      })
    }
    triples.add(triple)
    auditReceipt(receipt, index, context)
    const count = cellAudit.references.get(receipt.id) ?? 0
    if (count === 0) {
      issues.push({ code: "ORPHAN_SEARCH_RECEIPT", path: receipt.id, message: "Orphan receipt" })
    }
    if (count > 1) {
      issues.push({ code: "REUSED_SEARCH_RECEIPT", path: receipt.id, message: "Reused receipt" })
    }
  }
  auditCounterevidenceReuse(input, receiptMap, issues)
  return issues
}
