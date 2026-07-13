import type { Company } from "./entity-schema"
import {
  COMPETITOR_ARCHETYPES,
  STRATEGIC_MODELS,
  VERTICAL_CANDIDATES,
  type VerticalCandidateId,
} from "./enums"
import type { Claim, Observation, Source } from "./evidence-schema"
import type { ObservationId } from "./ids"
import { auditReceiptIntegrity } from "./strategy-integrity-receipts"
import type { StrategyIntegrityIssue } from "./strategy-integrity-types"
import type {
  Strategy,
  StrategyResearchReceipt,
  VerticalCandidateStrategy,
} from "./strategy-schema"
import { evaluateCandidate, selectVerticalDecision } from "./strategy-score"

export type StrategyIntegrityInput = {
  readonly strategies: readonly Strategy[]
  readonly receipts: readonly StrategyResearchReceipt[]
  readonly sources: readonly Source[]
  readonly observations: readonly Observation[]
  readonly claims: readonly Claim[]
  readonly companies: readonly Company[]
  readonly buyerOrProcurementObservationIdsByCandidate?: ReadonlyMap<
    VerticalCandidateId,
    readonly ObservationId[]
  >
}
type Candidates = readonly VerticalCandidateStrategy[]

const claimIdsFor = (strategy: Strategy): readonly Strategy["inferenceClaimIds"][number][] => {
  switch (strategy.strategyType) {
    case "vertical_candidate":
      return strategy.inferenceClaimIds
    case "strategic_model":
      return [
        ...strategy.inferenceClaimIds,
        ...strategy.modelClaimIds,
        ...strategy.prerequisiteClaimIds,
        ...strategy.killClaimIds,
      ]
    case "competitor_response":
      return [
        ...strategy.inferenceClaimIds,
        ...strategy.incumbentStrengthClaimIds,
        ...strategy.vulnerableWedgeClaimIds,
        ...strategy.buyerClaimIds,
        ...strategy.entryProofClaimIds,
        ...strategy.likelyCounterMoveClaimIds,
        ...strategy.prerequisiteClaimIds,
        ...strategy.noGoTriggerClaimIds,
      ]
    case "roadmap":
      return [...strategy.inferenceClaimIds, ...strategy.actionClaimIds, ...strategy.gateClaimIds]
    case "pricing_experiment":
      return [
        ...strategy.inferenceClaimIds,
        ...strategy.hypothesisClaimIds,
        ...strategy.successClaimIds,
        ...strategy.killClaimIds,
      ]
  }
}

const auditForeignKeys = (
  input: StrategyIntegrityInput,
  issues: StrategyIntegrityIssue[],
): void => {
  const claimIds = new Set(input.claims.map((claim) => claim.claimId))
  const observationIds = new Set(input.observations.map((observation) => observation.observationId))
  for (const strategy of input.strategies) {
    for (const claimId of claimIdsFor(strategy)) {
      if (!claimIds.has(claimId)) {
        issues.push({
          code: "UNKNOWN_CLAIM_ID",
          path: strategy.strategyId,
          message: `Unknown claim ${claimId}`,
        })
      }
    }
    for (const observationId of strategy.observationIds) {
      if (!observationIds.has(observationId)) {
        issues.push({
          code: "UNKNOWN_OBSERVATION_ID",
          path: strategy.strategyId,
          message: `Unknown observation ${observationId}`,
        })
      }
    }
  }
}

const auditCandidateCoverage = (candidates: Candidates, issues: StrategyIntegrityIssue[]): void => {
  if (candidates.length !== 5) {
    issues.push({
      code: "VERTICAL_CANDIDATE_COVERAGE",
      path: "strategies",
      message: "Expected five vertical candidates and 35 score cells",
    })
  }
  for (const candidateId of VERTICAL_CANDIDATES) {
    const count = candidates.filter(
      (candidate) => candidate.verticalCandidateId === candidateId,
    ).length
    if (count !== 1) {
      issues.push({
        code: "VERTICAL_CANDIDATE_COVERAGE",
        path: "strategies",
        message: `Expected one ${candidateId}; found ${count}`,
      })
    }
  }
}

const auditModelCoverage = (
  input: StrategyIntegrityInput,
  issues: StrategyIntegrityIssue[],
): void => {
  const models = input.strategies.filter((strategy) => strategy.strategyType === "strategic_model")
  if (models.length !== 4) {
    issues.push({
      code: "STRATEGIC_MODEL_COVERAGE",
      path: "strategies",
      message: "Expected exactly four strategic models",
    })
  }
  for (const modelId of STRATEGIC_MODELS) {
    const matches = models.filter((strategy) => strategy.modelId === modelId)
    const expectedEligibility =
      modelId === "vertical_domain_assurance_pack" ? "eligible_hypothesis" : "countersearched_out"
    if (matches.length !== 1 || matches[0]?.eligibility !== expectedEligibility) {
      issues.push({
        code: "STRATEGIC_MODEL_ELIGIBILITY",
        path: "strategies",
        message: `${modelId} must appear once as ${expectedEligibility}`,
      })
    }
  }
}

const auditResponseCoverage = (
  input: StrategyIntegrityInput,
  issues: StrategyIntegrityIssue[],
): void => {
  const responses = input.strategies.filter(
    (strategy) => strategy.strategyType === "competitor_response",
  )
  if (responses.length !== 17 || input.companies.length !== 10) {
    issues.push({
      code: "COMPETITOR_RESPONSE_COVERAGE",
      path: "strategies",
      message: "Expected ten company and seven archetype responses",
    })
  }
  for (const company of input.companies) {
    const count = responses.filter(
      (response) => "companyId" in response && response.companyId === company.companyId,
    ).length
    if (count !== 1) {
      issues.push({
        code: "COMPETITOR_RESPONSE_COVERAGE",
        path: "strategies",
        message: `Expected one response for ${company.companyId}; found ${count}`,
      })
    }
  }
  for (const archetypeId of COMPETITOR_ARCHETYPES) {
    const count = responses.filter(
      (response) => "archetypeId" in response && response.archetypeId === archetypeId,
    ).length
    if (count !== 1) {
      issues.push({
        code: "COMPETITOR_RESPONSE_COVERAGE",
        path: "strategies",
        message: `Expected one response for ${archetypeId}; found ${count}`,
      })
    }
  }
}

const auditDecision = (
  input: StrategyIntegrityInput,
  candidates: readonly VerticalCandidateStrategy[],
  issues: StrategyIntegrityIssue[],
): void => {
  const evaluations = candidates.map((strategy) =>
    evaluateCandidate({
      strategy,
      receipts: input.receipts,
      buyerOrProcurementObservationIds:
        input.buyerOrProcurementObservationIdsByCandidate?.get(strategy.verticalCandidateId) ??
        strategy.observationIds,
    }),
  )
  for (const evaluation of evaluations) {
    for (const failure of evaluation.qualificationFailures) {
      if (!evaluation.strategy.qualificationFailures.includes(failure)) {
        issues.push({
          code: "VERTICAL_QUALIFICATION_MISMATCH",
          path: evaluation.strategy.strategyId,
          message: `Missing derived failure ${failure}`,
        })
      }
    }
  }
  const decision = selectVerticalDecision(evaluations)
  for (const candidate of candidates) {
    const expectedStatus =
      decision.kind === "winner" && candidate.strategyId === decision.winnerStrategyId
        ? "winner"
        : decision.kind === "winner" && candidate.strategyId === decision.runnerUpStrategyId
          ? "runner_up"
          : "no_go"
    if (candidate.decisionStatus !== expectedStatus) {
      issues.push({
        code: "VERTICAL_DECISION_MISMATCH",
        path: candidate.strategyId,
        message: `Expected decision status ${expectedStatus}`,
      })
    }
  }
}

export const auditStrategyIntegrity = (
  input: StrategyIntegrityInput,
): readonly StrategyIntegrityIssue[] => {
  const candidates = input.strategies.filter(
    (strategy) => strategy.strategyType === "vertical_candidate",
  )
  const issues = [
    ...auditReceiptIntegrity({
      candidates,
      receipts: input.receipts,
      sources: input.sources,
      observations: input.observations,
      claims: input.claims,
    }),
  ]
  auditForeignKeys(input, issues)
  auditCandidateCoverage(candidates, issues)
  auditModelCoverage(input, issues)
  auditResponseCoverage(input, issues)
  auditDecision(input, candidates, issues)
  return issues
}

export type { StrategyIntegrityIssue } from "./strategy-integrity-types"
