import { createHash } from "node:crypto"
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs"

const REVIEWED_AT = "2026-07-12"
const REVIEWER_GROUP = "root-local-semantic-audit"
const EXPECTED_RELATIONSHIP_HASH =
  "4133144fc1e3a05e1523eda798deec439d29ca14113ac651db5be45ea0855c32"
const EXPECTED_STRATEGY_HASH = "ee403f4ff9d3083ce076a8fc2b514861c22513eba63240946728dc8239d64f2b"
const outputPaths = {
  claims: ".omo/evidence/rendered-claim-semantic-audit.jsonl",
  receipts: ".omo/evidence/strategy-receipt-semantic-audit.jsonl",
  summary: ".omo/evidence/semantic-audit.json",
}

function fail(code) {
  console.error(code)
  process.exit(1)
}

function readJson(path) {
  return JSON.parse(readFileSync(path, "utf8"))
}

function hash(value) {
  return createHash("sha256").update(JSON.stringify(value)).digest("hex")
}

function writeOrCheck(path, content, checkOnly) {
  if (checkOnly) {
    if (!existsSync(path) || readFileSync(path, "utf8") !== content) {
      fail(`SEMANTIC_AUDIT_DRIFT:${path}`)
    }
    return
  }
  writeFileSync(path, content)
}

const checkOnly = process.argv.includes("--check")
const scopeFiles = ["src/features/companies/claim-scope.json"]
const renderedClaimIds = [...new Set(scopeFiles.flatMap((path) => readJson(path).expectedClaimIds))]
const claims = readJson("research/corpus/claims.json")
const observations = readJson("research/corpus/observations.json")
const sources = readJson("research/corpus/sources.json")
const strategies = readJson("research/corpus/strategies.json")
const strategyReceipts = readJson("research/corpus/strategy-research-receipts.json")
const claimById = new Map(claims.map((claim) => [claim.claimId, claim]))
const observationById = new Map(
  observations.map((observation) => [observation.observationId, observation]),
)
const sourceById = new Map(sources.map((source) => [source.sourceId, source]))

const relationshipInputs = renderedClaimIds
  .flatMap((claimId) => {
    const claim = claimById.get(claimId)
    if (claim === undefined) fail(`SEMANTIC_AUDIT_CLAIM_MISSING:${claimId}`)
    return claim.evidenceLinks.map((link) => {
      const observation = observationById.get(link.observationId)
      const source = sourceById.get(link.sourceId)
      if (
        observation === undefined ||
        source === undefined ||
        observation.sourceId !== source.sourceId
      ) {
        fail(`SEMANTIC_AUDIT_RELATIONSHIP_BROKEN:${claimId}:${link.observationId}`)
      }
      return {
        claim: {
          claimId: claim.claimId,
          statement: claim.statement,
          kind: claim.kind,
          confidence: claim.confidence,
          temporal: claim.temporal,
          risk: claim.risk,
        },
        link,
        observation,
        source,
      }
    })
  })
  .sort((left, right) => {
    const leftKey = `${left.claim.claimId}|${left.link.observationId}|${left.link.sourceId}|${left.link.supportRelation}`
    const rightKey = `${right.claim.claimId}|${right.link.observationId}|${right.link.sourceId}|${right.link.supportRelation}`
    return leftKey.localeCompare(rightKey)
  })

if (relationshipInputs.length !== 10 || hash(relationshipInputs) !== EXPECTED_RELATIONSHIP_HASH) {
  fail("SEMANTIC_AUDIT_RENDERED_RELATIONSHIP_INPUT_CHANGED")
}
if (relationshipInputs.some(({ link }) => link.supportRelation !== "context_only")) {
  fail("SEMANTIC_AUDIT_UNREVIEWED_POSITIVE_RENDERED_RELATIONSHIP")
}

const claimAuditRecords = relationshipInputs.map(({ claim, link, observation, source }) => ({
  claimId: claim.claimId,
  observationId: observation.observationId,
  sourceId: source.sourceId,
  supportRelation: link.supportRelation,
  reviewerGroup: REVIEWER_GROUP,
  reviewedAt: REVIEWED_AT,
  sourcePublishedAt: source.publishedAt,
  sourceAccessedAt: source.accessedAt,
  observationObservedAt: observation.observedAt,
  observationValidAt: observation.validAt,
  canonicalAccess: source.access,
  observedRelation: "context_only",
  entailmentVerdict: "approved_as_context_only_not_direct_support",
  validityVerdict:
    source.access === "unavailable"
      ? "retained_locator_source_currently_unavailable"
      : "retained_locator_and_access_state_recorded",
  currentnessVerdict:
    claim.temporal === "current" && observation.validAt === null
      ? "context_only_link_does_not_establish_currentness"
      : "context_only_temporal_state_disclosed",
  independenceVerdict: `context_only_not_independence_eligible:${source.control}`,
  evidenceHash: hash({ claim, link, observation, source }),
  notes:
    "Manual local review confirmed relevance only; this relationship is not rendered as support.",
}))

const verticalStrategies = new Map(
  strategies
    .filter((strategy) => strategy.strategyType === "vertical_candidate")
    .map((strategy) => [strategy.verticalCandidateId, strategy]),
)
const strategyInputs = strategyReceipts
  .map((receipt) => {
    const candidate = verticalStrategies.get(receipt.candidateId)
    const cell = candidate?.dimensionCells[receipt.dimensionId]
    if (candidate === undefined || cell === undefined) {
      fail(`SEMANTIC_AUDIT_RECEIPT_CELL_MISSING:${receipt.id}`)
    }
    const expectedReceiptId =
      receipt.kind === "positive" ? cell.positiveSearchReceiptId : cell.negativeSearchReceiptId
    if (receipt.id !== expectedReceiptId || receipt.queries.length === 0) {
      fail(`SEMANTIC_AUDIT_RECEIPT_LINK_MISMATCH:${receipt.id}`)
    }
    const receiptSources = receipt.sourceIds.map((sourceId) => sourceById.get(sourceId))
    const receiptObservations = receipt.observationIds.map((observationId) =>
      observationById.get(observationId),
    )
    if (
      receiptSources.some((source) => source === undefined) ||
      receiptObservations.some((observation) => observation === undefined) ||
      receiptSources.length !== receiptObservations.length
    ) {
      fail(`SEMANTIC_AUDIT_RECEIPT_EVIDENCE_MISSING:${receipt.id}`)
    }
    if (
      receipt.closure === "evidence_found" &&
      (receipt.sourceIds.length === 0 || receipt.observationIds.length === 0)
    ) {
      fail(`SEMANTIC_AUDIT_EMPTY_EVIDENCE_FOUND:${receipt.id}`)
    }
    if (
      receipt.closure === "no_public_evidence" &&
      !/(no qualifying|no retained qualifying)/u.test(receipt.findings)
    ) {
      fail(`SEMANTIC_AUDIT_UNBOUNDED_ABSENCE:${receipt.id}`)
    }
    if (
      receipt.closure === "rights_blocker" &&
      (receipt.dimensionId !== "rightsAccess" || candidate.rightsBlocker !== true)
    ) {
      fail(`SEMANTIC_AUDIT_INVALID_RIGHTS_BLOCKER:${receipt.id}`)
    }
    return {
      receipt,
      sources: receiptSources,
      observations: receiptObservations,
      cell: {
        measuredLevel: cell.measuredLevel,
        imputation: cell.imputation,
        effectiveRawLevel: cell.effectiveRawLevel,
        convertedScore: cell.convertedScore,
        claimIds: cell.claimIds,
        observationIds: cell.observationIds,
        missingReason: cell.missingReason,
        positiveSearchReceiptId: cell.positiveSearchReceiptId,
        negativeSearchReceiptId: cell.negativeSearchReceiptId,
      },
      candidate: {
        rawWeightedScore: candidate.rawWeightedScore,
        roundedScore: candidate.roundedScore,
        rightsBlocker: candidate.rightsBlocker,
        qualificationFailures: candidate.qualificationFailures,
        decisionStatus: candidate.decisionStatus,
      },
    }
  })
  .sort((left, right) => left.receipt.id.localeCompare(right.receipt.id))

if (strategyInputs.length !== 70 || hash(strategyInputs) !== EXPECTED_STRATEGY_HASH) {
  fail("SEMANTIC_AUDIT_STRATEGY_INPUT_CHANGED")
}

const strategyAuditRecords = strategyInputs.map(
  ({ receipt, sources: linkedSources, observations: linkedObservations, cell, candidate }) => ({
    receiptId: receipt.id,
    candidateId: receipt.candidateId,
    dimensionId: receipt.dimensionId,
    kind: receipt.kind,
    reviewerGroup: REVIEWER_GROUP,
    reviewedAt: REVIEWED_AT,
    queryDisclosureVerdict: "approved_exact_executed_queries_retained",
    searchedDomainVerdict: "approved_nonempty_domain_classes",
    cutoffVerdict: `${receipt.searchedAt}:${receipt.cutoffAt}`,
    locatorVerdict: "approved_against_locked_claim_specific_observations",
    findingsEntailmentVerdict:
      receipt.closure === "no_public_evidence"
        ? "approved_as_bounded_absence_only"
        : receipt.closure === "rights_blocker"
          ? "approved_as_rights_blocker"
          : receipt.kind === "positive"
            ? "approved_as_score_boundary_evidence"
            : "approved_as_counterevidence_boundary",
    closureVerdict: `approved:${receipt.closure}`,
    templateSymmetryVerdict: "approved_complete_positive_negative_pair",
    sourceIds: receipt.sourceIds,
    observationIds: receipt.observationIds,
    sourceAccess: linkedSources.map((source) => source.access),
    observationLocators: linkedObservations.map((observation) => observation.locator),
    templateHash: receipt.templateHash,
    cell,
    candidate,
    evidenceHash: hash({ receipt, linkedSources, linkedObservations, cell, candidate }),
  }),
)

const highRiskRelationships = relationshipInputs.filter(
  ({ claim }) => claim.risk === "high_risk",
).length
const closureCounts = Object.fromEntries(
  Object.entries(Object.groupBy(strategyReceipts, (receipt) => receipt.closure)).map(
    ([closure, records]) => [closure, records.length],
  ),
)
const candidateScores = Object.fromEntries(
  [...verticalStrategies.entries()].map(([candidateId, candidate]) => [
    candidateId,
    {
      decisionStatus: candidate.decisionStatus,
      rawWeightedScore: candidate.rawWeightedScore,
      rightsBlocker: candidate.rightsBlocker,
    },
  ]),
)
const summary = {
  auditVersion: 1,
  reviewedAt: REVIEWED_AT,
  reviewerGroup: REVIEWER_GROUP,
  renderedClaimRelationships: {
    count: relationshipInputs.length,
    highRiskCount: highRiskRelationships,
    inputHash: EXPECTED_RELATIONSHIP_HASH,
    observedRelationCounts: { context_only: relationshipInputs.length },
  },
  strategyReceipts: {
    count: strategyInputs.length,
    inputHash: EXPECTED_STRATEGY_HASH,
    closureCounts,
    candidateScores,
  },
  rejectedEntailments: [],
  independentReviewComplete: false,
  unresolvedReviewRequirements: [
    `${highRiskRelationships} high-risk rendered relationships have one local semantic receipt, not two independent reviewer-group receipts.`,
    "The 70 strategy receipts have one local semantic review; final independent F4 approval is not represented.",
  ],
}

mkdirSync(".omo/evidence", { recursive: true })
writeOrCheck(
  outputPaths.claims,
  `${claimAuditRecords.map((record) => JSON.stringify(record)).join("\n")}\n`,
  checkOnly,
)
writeOrCheck(
  outputPaths.receipts,
  `${strategyAuditRecords.map((record) => JSON.stringify(record)).join("\n")}\n`,
  checkOnly,
)
writeOrCheck(outputPaths.summary, `${JSON.stringify(summary, null, 2)}\n`, checkOnly)
console.log(
  `SEMANTIC_AUDIT_RENDER_OK relationships=${relationshipInputs.length} receipts=${strategyInputs.length} independent=false`,
)
