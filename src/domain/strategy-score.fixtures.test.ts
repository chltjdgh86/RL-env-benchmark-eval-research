import { researchCorpus } from "../data/research"
import { SCORE_DIMENSIONS, type ScoreDimensionId } from "./enums"
import { deriveReceiptTemplateHash } from "./strategy-hash"
import { auditStrategyIntegrity } from "./strategy-integrity"
import {
  ScoreCellSchema,
  type Strategy,
  type StrategyResearchReceipt,
  StrategyResearchReceiptCollectionSchema,
  StrategyResearchReceiptSchema,
  type VerticalCandidateStrategy,
  VerticalCandidateStrategySchema,
} from "./strategy-schema"
import {
  computeCandidateScore,
  convertDimensionScore,
  evaluateCandidate,
  selectVerticalDecision,
} from "./strategy-score"

const { strategies, receipts, sources, observations, claims, companies } = researchCorpus

const requireValue = <T>(value: T | undefined, label: string): T => {
  if (value === undefined) throw new RangeError(`Missing fixture: ${label}`)
  return value
}

const firstReceipt = requireValue(receipts.at(0), "first receipt")
const receiptsWithFirst = (
  patch: Partial<StrategyResearchReceipt>,
): readonly StrategyResearchReceipt[] => [
  StrategyResearchReceiptSchema.parse({ ...firstReceipt, ...patch }),
  ...receipts.slice(1),
]

const candidateById = (
  candidateId: VerticalCandidateStrategy["verticalCandidateId"],
): VerticalCandidateStrategy =>
  requireValue(
    strategies.find(
      (strategy): strategy is VerticalCandidateStrategy =>
        strategy.strategyType === "vertical_candidate" &&
        strategy.verticalCandidateId === candidateId,
    ),
    candidateId,
  )

const integrityInput = (candidateStrategies: readonly Strategy[] = strategies) => ({
  strategies: candidateStrategies,
  receipts,
  sources,
  observations,
  claims,
  companies,
})

const scoreCellAt = (
  strategy: VerticalCandidateStrategy,
  dimensionId: ScoreDimensionId,
  rawLevel: number,
) =>
  ScoreCellSchema.parse({
    ...strategy.dimensionCells[dimensionId],
    measuredLevel: rawLevel,
    imputation: null,
    effectiveRawLevel: rawLevel,
    convertedScore: convertDimensionScore({ dimensionId, effectiveRawLevel: rawLevel }),
    missingReason: null,
  })

type ScoreVector = Readonly<Record<ScoreDimensionId, number>>

const withScoreVector = (
  strategy: VerticalCandidateStrategy,
  vector: ScoreVector,
): VerticalCandidateStrategy =>
  VerticalCandidateStrategySchema.parse({
    ...strategy,
    dimensionCells: {
      pain: scoreCellAt(strategy, "pain", vector.pain),
      willingnessToPay: scoreCellAt(strategy, "willingnessToPay", vector.willingnessToPay),
      rightsAccess: scoreCellAt(strategy, "rightsAccess", vector.rightsAccess),
      verifierFeasibility: scoreCellAt(strategy, "verifierFeasibility", vector.verifierFeasibility),
      expertSupply: scoreCellAt(strategy, "expertSupply", vector.expertSupply),
      freshnessBurden: scoreCellAt(strategy, "freshnessBurden", vector.freshnessBurden),
      incumbentPressure: scoreCellAt(strategy, "incumbentPressure", vector.incumbentPressure),
    },
    rightsBlocker: false,
    qualificationFailures: [],
    decisionStatus: "unscored",
  })

describe("canonical strategy corpus integrity", () => {
  it("parses and closes all score, receipt, model, and response invariants", () => {
    // Given: the canonical strategy corpus parsed once at the test boundary.
    // When: strategy integrity is audited as a connected graph.
    const issues = auditStrategyIntegrity(integrityInput())

    // Then: all 35 cells, 70 receipts, four models, and 17 responses reconcile.
    expect(issues).toEqual([])
    expect(
      strategies.filter((strategy) => strategy.strategyType === "vertical_candidate"),
    ).toHaveLength(5)
    expect(
      strategies
        .filter((strategy) => strategy.strategyType === "vertical_candidate")
        .flatMap((strategy) =>
          SCORE_DIMENSIONS.map((dimension) => strategy.dimensionCells[dimension]),
        ),
    ).toHaveLength(35)
    expect(receipts).toHaveLength(70)
  })

  it("rejects unknown receipt fields and legacy closure values at the boundary", () => {
    // Given: shapes outside the closed receipt contract.
    const unknownField = { ...firstReceipt, legacyStatus: "closed" }
    const legacyClosure = { ...firstReceipt, closure: "open_unverified" }

    // When: both values cross the Zod boundary.
    const results = [
      StrategyResearchReceiptSchema.safeParse(unknownField),
      StrategyResearchReceiptSchema.safeParse(legacyClosure),
    ]

    // Then: neither legacy shape enters the domain.
    expect(results.every((result) => !result.success)).toBe(true)
  })

  it("derives the canonical normalized receipt template hash", () => {
    // Given: the first canonical executed search receipt.
    const receipt = requireValue(receipts.at(0), "first receipt")

    // When: its normalized query template is hashed synchronously.
    const hash = deriveReceiptTemplateHash(receipt)

    // Then: the persisted audit hash is reproduced exactly.
    expect(hash).toBe(receipt.templateHash)
  })

  it("rejects a forged receipt template hash", () => {
    // Given: one canonical receipt with a structurally valid but forged hash.
    const receipt = requireValue(receipts.at(0), "first receipt")
    const forged = StrategyResearchReceiptCollectionSchema.parse([
      { ...receipt, templateHash: "0".repeat(64) },
      ...receipts.slice(1),
    ])

    // When: receipt integrity is audited.
    const issues = auditStrategyIntegrity({ ...integrityInput(), receipts: forged })

    // Then: hash drift is named rather than silently accepted.
    expect(issues.map((issue) => issue.code)).toContain("SEARCH_TEMPLATE_HASH_MISMATCH")
  })

  it("rejects nonconservative missing burden imputation", () => {
    // Given: a burden cell missing evidence but using favorable effective raw zero.
    const original = candidateById("insurance_operations")
    const corrupted = VerticalCandidateStrategySchema.parse({
      ...original,
      dimensionCells: {
        ...original.dimensionCells,
        freshnessBurden: {
          ...original.dimensionCells.freshnessBurden,
          measuredLevel: null,
          imputation: "conservative_missing",
          effectiveRawLevel: 0,
          convertedScore: 0,
          claimIds: [],
          observationIds: [],
          missingReason: "No qualifying public evidence.",
        },
      },
    })
    const mutated = strategies.map((strategy) =>
      strategy.strategyId === original.strategyId ? corrupted : strategy,
    )

    // When: the score-cell graph is audited.
    const issues = auditStrategyIntegrity(integrityInput(mutated))

    // Then: unknown burden never masquerades as favorable.
    expect(issues.map((issue) => issue.code)).toContain("NONCONSERVATIVE_MISSING_IMPUTATION")
  })

  it.each([
    [
      "undated terminal receipt",
      receiptsWithFirst({ closure: "dead", searchedAt: null }),
      "SEARCH_RECEIPT_NOT_TERMINAL",
    ],
    [
      "candidate mismatch",
      receiptsWithFirst({ candidateId: "insurance_operations" }),
      "MISMATCHED_SEARCH_RECEIPT",
    ],
    [
      "source-observation mismatch",
      receiptsWithFirst({ sourceIds: [] }),
      "RECEIPT_SOURCE_OBSERVATION_MISMATCH",
    ],
  ])("rejects %s", (_label, mutatedReceipts, expectedCode) => {
    // Given: one receipt graph invariant has been mutated.
    // When: the connected strategy graph is audited.
    const issues = auditStrategyIntegrity({ ...integrityInput(), receipts: mutatedReceipts })

    // Then: the precise integrity failure is reported.
    expect(issues.map((issue) => issue.code)).toContain(expectedCode)
  })

  it("rejects reused and orphaned receipt references", () => {
    // Given: one cell uses its positive receipt for both lanes.
    const original = candidateById("regulated_financial_operations")
    const corrupted = VerticalCandidateStrategySchema.parse({
      ...original,
      dimensionCells: {
        ...original.dimensionCells,
        pain: {
          ...original.dimensionCells.pain,
          negativeSearchReceiptId: original.dimensionCells.pain.positiveSearchReceiptId,
        },
      },
    })
    const mutated = strategies.map((strategy) =>
      strategy.strategyId === original.strategyId ? corrupted : strategy,
    )

    // When: receipt ownership is audited.
    const codes = auditStrategyIntegrity(integrityInput(mutated)).map((issue) => issue.code)

    // Then: both sides of the ownership violation are explicit.
    expect(codes).toEqual(
      expect.arrayContaining(["REUSED_SEARCH_RECEIPT", "ORPHAN_SEARCH_RECEIPT"]),
    )
  })

  it.each([
    ["strategic model", "strategic_model", "STRATEGIC_MODEL_COVERAGE"],
    ["competitor response", "competitor_response", "COMPETITOR_RESPONSE_COVERAGE"],
  ])("rejects missing %s coverage", (_label, strategyType, expectedCode) => {
    // Given: one required strategy class is absent.
    const index = strategies.findIndex((strategy) => strategy.strategyType === strategyType)
    const mutated = strategies.filter((_strategy, strategyIndex) => strategyIndex !== index)

    // When: complete strategy coverage is audited.
    const issues = auditStrategyIntegrity(integrityInput(mutated))

    // Then: the missing qualitative or response coverage is named.
    expect(issues.map((issue) => issue.code)).toContain(expectedCode)
  })
})

describe("finance-loses strategy fixture", () => {
  it("qualifies finance at 80 but awards a 100-point challenger", () => {
    // Given: two fully closed candidate vectors with finance twenty points behind.
    const finance = withScoreVector(candidateById("regulated_financial_operations"), {
      pain: 4,
      willingnessToPay: 4,
      rightsAccess: 4,
      verifierFeasibility: 4,
      expertSupply: 4,
      freshnessBurden: 1,
      incumbentPressure: 1,
    })
    const challenger = withScoreVector(candidateById("public_sector_administration"), {
      pain: 5,
      willingnessToPay: 5,
      rightsAccess: 5,
      verifierFeasibility: 5,
      expertSupply: 5,
      freshnessBurden: 0,
      incumbentPressure: 0,
    })
    const evaluations = [finance, challenger].map((strategy) =>
      evaluateCandidate({
        strategy,
        receipts: receipts.filter(
          (receipt) => receipt.candidateId === strategy.verticalCandidateId,
        ),
        buyerOrProcurementObservationIds: ["buyer-one", "buyer-two"],
      }),
    )

    // When: full-precision qualification and lead gates run.
    const decision = selectVerticalDecision(evaluations)

    // Then: finance qualifies but the higher-scoring challenger wins.
    expect(computeCandidateScore(finance).rawWeightedScore).toBe(80)
    expect(evaluations.every((evaluation) => evaluation.qualified)).toBe(true)
    expect(decision).toMatchObject({
      kind: "winner",
      winnerStrategyId: challenger.strategyId,
      runnerUpStrategyId: finance.strategyId,
      lead: 20,
    })
    expect(SCORE_DIMENSIONS).toHaveLength(7)
  })
})
