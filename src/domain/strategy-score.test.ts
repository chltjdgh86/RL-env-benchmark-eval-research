import { SCORE_DIMENSIONS, type ScoreDimensionId, type VerticalCandidateId } from "./enums"
import {
  ScoreCellSchema,
  type StrategyResearchReceipt,
  StrategyResearchReceiptSchema,
  type VerticalCandidateStrategy,
  VerticalCandidateStrategySchema,
} from "./strategy-schema"
import {
  computeCandidateScore,
  convertDimensionScore,
  deriveBenefitQualityCap,
  deriveRightsBlocker,
  evaluateCandidate,
  selectVerticalDecision,
} from "./strategy-score"

const terminalReceipt = (
  candidateId: VerticalCandidateId,
  dimensionId: ScoreDimensionId,
  kind: "positive" | "negative",
): StrategyResearchReceipt =>
  StrategyResearchReceiptSchema.parse({
    id: `rr-${candidateId.replaceAll("_", "-")}-${dimensionId.toLowerCase()}-${kind}`,
    candidateId,
    dimensionId,
    kind,
    queries: [`${candidateId} ${dimensionId} ${kind}`],
    searchedDomainClasses: ["buyer_procurement"],
    searchedAt: "2026-07-12",
    cutoffAt: "2026-07-11",
    sourceIds: [],
    observationIds: [],
    findings: "Bounded search completed.",
    closure: "no_public_evidence",
    templateHash: "0".repeat(64),
  })

const scoreCell = (
  candidateId: VerticalCandidateId,
  dimensionId: ScoreDimensionId,
  rawLevel: number,
) =>
  ScoreCellSchema.parse({
    measuredLevel: rawLevel,
    imputation: null,
    effectiveRawLevel: rawLevel,
    convertedScore:
      dimensionId === "freshnessBurden" || dimensionId === "incumbentPressure"
        ? 5 - rawLevel
        : rawLevel,
    claimIds: [`clm_fixture-${dimensionId.toLowerCase()}`],
    observationIds: [`obs_fixture-${dimensionId.toLowerCase()}`],
    missingReason: null,
    positiveSearchReceiptId: terminalReceipt(candidateId, dimensionId, "positive").id,
    negativeSearchReceiptId: terminalReceipt(candidateId, dimensionId, "negative").id,
  })

type CandidateLevels = Readonly<Record<ScoreDimensionId, number>>

const candidate = (
  candidateId: VerticalCandidateId,
  levels: CandidateLevels,
): VerticalCandidateStrategy =>
  VerticalCandidateStrategySchema.parse({
    strategyId: `str_vertical-${candidateId.replaceAll("_", "-")}`,
    strategyType: "vertical_candidate",
    name: candidateId,
    inferenceClaimIds: ["clm_fixture-decision"],
    observationIds: ["obs_fixture-buyer-one", "obs_fixture-buyer-two"],
    verticalCandidateId: candidateId,
    dimensionCells: {
      pain: scoreCell(candidateId, "pain", levels.pain),
      willingnessToPay: scoreCell(candidateId, "willingnessToPay", levels.willingnessToPay),
      rightsAccess: scoreCell(candidateId, "rightsAccess", levels.rightsAccess),
      verifierFeasibility: scoreCell(
        candidateId,
        "verifierFeasibility",
        levels.verifierFeasibility,
      ),
      expertSupply: scoreCell(candidateId, "expertSupply", levels.expertSupply),
      freshnessBurden: scoreCell(candidateId, "freshnessBurden", levels.freshnessBurden),
      incumbentPressure: scoreCell(candidateId, "incumbentPressure", levels.incumbentPressure),
    },
    rawWeightedScore: 0,
    roundedScore: 0,
    caps: ["benefit_cells_use_evidence_quality_caps"],
    rightsBlocker: false,
    qualificationFailures: [],
    decisionStatus: "unscored",
  })

const candidateReceipts = (strategy: VerticalCandidateStrategy) =>
  SCORE_DIMENSIONS.flatMap((dimensionId) => {
    const cell = strategy.dimensionCells[dimensionId]
    return [
      StrategyResearchReceiptSchema.parse({
        ...terminalReceipt(strategy.verticalCandidateId, dimensionId, "positive"),
        id: cell.positiveSearchReceiptId,
      }),
      StrategyResearchReceiptSchema.parse({
        ...terminalReceipt(strategy.verticalCandidateId, dimensionId, "negative"),
        id: cell.negativeSearchReceiptId,
      }),
    ]
  })

const eightyPointLevels = {
  pain: 4,
  willingnessToPay: 4,
  rightsAccess: 4,
  verifierFeasibility: 4,
  expertSupply: 4,
  freshnessBurden: 1,
  incumbentPressure: 1,
} as const

describe("strategy score conversion", () => {
  it("inverts burden dimensions before applying the fixed weights", () => {
    // Given: equal raw levels for a benefit and a burden dimension.
    // When: both levels are converted for scoring.
    const benefit = convertDimensionScore({ dimensionId: "pain", effectiveRawLevel: 4 })
    const burden = convertDimensionScore({
      dimensionId: "freshnessBurden",
      effectiveRawLevel: 4,
    })

    // Then: benefit remains four while burden becomes one.
    expect({ benefit, burden }).toEqual({ benefit: 4, burden: 1 })
  })

  it("keeps full precision and rounds display scores to one decimal", () => {
    // Given: a parsed candidate whose converted weighted total is 77.
    const strategy = candidate("regulated_financial_operations", {
      ...eightyPointLevels,
      expertSupply: 3,
      freshnessBurden: 2,
    })

    // When: the fixed scorer derives its score.
    const result = computeCandidateScore(strategy)

    // Then: full precision and display rounding are both explicit.
    expect(result).toEqual({ rawWeightedScore: 76, roundedScore: 76 })
  })
})

describe("strategy evidence gates", () => {
  it("caps affiliated or degraded benefit evidence at two", () => {
    // Given: one subject-controlled, low-confidence benefit claim.
    const evidence = [
      {
        control: "subject_controlled",
        confidence: "low",
        supportSummary: "supported",
        temporal: "current",
        independentGroupCount: 2,
      },
    ] as const

    // When: evidence quality is converted to a score ceiling.
    const cap = deriveBenefitQualityCap(evidence)

    // Then: the benefit cannot score above two.
    expect(cap).toBe(2)
  })

  it("caps a single eligible independence group at three", () => {
    // Given: otherwise strong evidence from one eligible group.
    const evidence = [
      {
        control: "independent",
        confidence: "high",
        supportSummary: "supported",
        temporal: "current",
        independentGroupCount: 1,
      },
    ] as const

    // When: evidence quality is converted to a score ceiling.
    const cap = deriveBenefitQualityCap(evidence)

    // Then: one independent group cannot support a four or five.
    expect(cap).toBe(3)
  })

  it("derives a rights blocker from degraded high-risk evidence", () => {
    // Given: a lawful observation but a current contradicted high-risk rights claim.
    const input = {
      rightsAccessScore: 4,
      hasLawfulRightsObservation: true,
      currentHighRiskRightsEvidence: [{ supportSummary: "contradicted" }],
    } as const

    // When: the rights gate is derived.
    const blocked = deriveRightsBlocker(input)

    // Then: degraded current high-risk evidence blocks qualification.
    expect(blocked).toBe(true)
  })
})

describe("vertical decision gate", () => {
  it("lets finance qualify but selects a ten-point-higher challenger", () => {
    // Given: finance scores 80 and a challenger scores 100 with every gate closed.
    const finance = candidate("regulated_financial_operations", eightyPointLevels)
    const challenger = candidate("public_sector_administration", {
      pain: 5,
      willingnessToPay: 5,
      rightsAccess: 5,
      verifierFeasibility: 5,
      expertSupply: 5,
      freshnessBurden: 0,
      incumbentPressure: 0,
    })
    const inputs = [finance, challenger].map((strategy) =>
      evaluateCandidate({
        strategy,
        receipts: candidateReceipts(strategy),
        buyerOrProcurementObservationIds: ["obs_fixture-buyer-one", "obs_fixture-buyer-two"],
      }),
    )

    // When: the deterministic winner gate compares all candidates.
    const decision = selectVerticalDecision(inputs)

    // Then: finance qualifies but loses by the required lead.
    expect(inputs.map((input) => input.qualified)).toEqual([true, true])
    expect(decision).toMatchObject({
      kind: "winner",
      winnerStrategyId: challenger.strategyId,
      runnerUpStrategyId: finance.strategyId,
      lead: 20,
    })
  })

  it("returns no-go when the best qualifying candidate leads by less than ten", () => {
    // Given: two qualifying candidates separated by only two points.
    const leader = candidate("public_sector_administration", eightyPointLevels)
    const follower = candidate("healthcare_administration", {
      ...eightyPointLevels,
      expertSupply: 3,
    })
    const evaluations = [leader, follower].map((strategy) =>
      evaluateCandidate({
        strategy,
        receipts: candidateReceipts(strategy),
        buyerOrProcurementObservationIds: ["obs_fixture-buyer-one", "obs_fixture-buyer-two"],
      }),
    )

    // When: the lead threshold is evaluated.
    const decision = selectVerticalDecision(evaluations)

    // Then: no candidate is declared a winner.
    expect(decision).toMatchObject({ kind: "no_go", reason: "winner_lead_below_10" })
  })
})
