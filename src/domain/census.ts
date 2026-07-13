import type { Adjacent } from "./entity-schema"
import type { BusinessModelId, EntityStatus, SegmentId } from "./enums"

export type CorpusCounts = {
  readonly sources: number
  readonly observations: number
  readonly claims: number
  readonly companies: number
  readonly industries: number
  readonly adjacent: number
  readonly buyerEvidence: number
  readonly marketAnalysis: number
  readonly strategies: number
  readonly receipts: number
  readonly totalRecords: number
}

export type CountableCorpus = {
  readonly sources: readonly object[]
  readonly observations: readonly object[]
  readonly claims: readonly object[]
  readonly companies: readonly object[]
  readonly industries: readonly object[]
  readonly adjacent: readonly object[]
  readonly buyerEvidence: readonly object[]
  readonly marketAnalysis: readonly object[]
  readonly strategies: readonly object[]
  readonly receipts: readonly object[]
}

export function deriveCorpusCounts(corpus: CountableCorpus): CorpusCounts {
  const counts = {
    sources: corpus.sources.length,
    observations: corpus.observations.length,
    claims: corpus.claims.length,
    companies: corpus.companies.length,
    industries: corpus.industries.length,
    adjacent: corpus.adjacent.length,
    buyerEvidence: corpus.buyerEvidence.length,
    marketAnalysis: corpus.marketAnalysis.length,
    strategies: corpus.strategies.length,
    receipts: corpus.receipts.length,
  }
  return {
    ...counts,
    totalRecords: Object.values(counts).reduce((total, count) => total + count, 0),
  }
}

export type AdjacentCensus = {
  readonly total: number
  readonly bySegment: Readonly<Record<SegmentId, number>>
  readonly byBusinessModel: Readonly<Record<BusinessModelId, number>>
  readonly byEntityStatus: Readonly<Record<EntityStatus, number>>
}

export function deriveAdjacentCensus(adjacent: readonly Adjacent[]): AdjacentCensus {
  const bySegment: Record<SegmentId, number> = {
    training_data_workforce: 0,
    expert_talent_network: 0,
    environment_computer_use_runtime: 0,
    eval_observability_assurance: 0,
    post_training_rl_infrastructure: 0,
    agent_ax_services: 0,
    incumbent_bpo_consulting: 0,
  }
  const byBusinessModel: Record<BusinessModelId, number> = {
    managed_data_bpo: 0,
    expert_marketplace: 0,
    employee_bpo: 0,
    expert_environment_services: 0,
    eval_observability_saas: 0,
    runtime_infrastructure: 0,
    proprietary_data_acquisition: 0,
  }
  const byEntityStatus: Record<EntityStatus, number> = {
    active: 0,
    acquisition_announced: 0,
    acquired_closed: 0,
    inactive: 0,
    unknown: 0,
  }
  for (const record of adjacent) {
    bySegment[record.primarySegment] += 1
    byEntityStatus[record.entityStatus] += 1
    for (const model of record.businessModelIds) byBusinessModel[model] += 1
  }
  return {
    total: adjacent.length,
    bySegment,
    byBusinessModel,
    byEntityStatus,
  }
}
