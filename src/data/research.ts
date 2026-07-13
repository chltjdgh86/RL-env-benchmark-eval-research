import adjacentJson from "../../research/corpus/adjacent.json"
import buyerEvidenceJson from "../../research/corpus/buyer-evidence.json"
import claimsJson from "../../research/corpus/claims.json"
import companiesJson from "../../research/corpus/companies.json"
import industriesJson from "../../research/corpus/industries.json"
import marketAnalysisJson from "../../research/corpus/market-analysis.json"
import observationsJson from "../../research/corpus/observations.json"
import sourcesJson from "../../research/corpus/sources.json"
import strategiesJson from "../../research/corpus/strategies.json"
import receiptsJson from "../../research/corpus/strategy-research-receipts.json"
import { deriveClaimIndependence } from "../domain/evidence"
import { auditStrategyIntegrity } from "../domain/strategy-integrity"
import {
  assertAnalysisCrossKeys,
  CorpusIntegrityError,
  type ResearchCorpus,
  ResearchCorpusSchema,
} from "./corpus-schema"
import { assertCorpusCrossKeys } from "./cross-keys"
import { assertCanonicalClaimHashes } from "./hash-cross-keys"
import { buildResearchIndex } from "./research-index"

export type { ResearchIndex } from "./research-index"
export { buildResearchIndex } from "./research-index"

export function parseResearchCorpus(input: unknown): ResearchCorpus {
  const corpus = ResearchCorpusSchema.parse(input)
  assertCorpusCrossKeys(corpus)
  assertAnalysisCrossKeys(corpus)
  assertCanonicalClaimHashes(corpus)
  assertClaimIndependence(corpus)
  const [strategyIssue] = auditStrategyIntegrity(corpus)
  if (strategyIssue !== undefined) {
    throw new CorpusIntegrityError(strategyIssue.code, strategyIssue.path, strategyIssue.message)
  }
  return corpus
}

export const researchCorpus = parseResearchCorpus({
  sources: sourcesJson,
  observations: observationsJson,
  claims: claimsJson,
  companies: companiesJson,
  industries: industriesJson,
  adjacent: adjacentJson,
  buyerEvidence: buyerEvidenceJson,
  marketAnalysis: marketAnalysisJson,
  strategies: strategiesJson,
  receipts: receiptsJson,
})

function indexBy<T, K extends string>(
  values: readonly T[],
  readId: (value: T) => K,
): ReadonlyMap<K, T> {
  const result = new Map<K, T>()
  for (const value of values) result.set(readId(value), value)
  return result
}

function assertClaimIndependence(corpus: ResearchCorpus): void {
  const sources = indexBy(corpus.sources, (source) => source.sourceId)
  const subjectOrigins = new Map<string, string>()
  for (const company of corpus.companies) {
    subjectOrigins.set(company.companyId, new URL(company.canonicalDomain).origin)
  }
  for (const adjacent of corpus.adjacent) {
    subjectOrigins.set(adjacent.adjacentId, new URL(adjacent.canonicalDomain).origin)
  }
  for (const claim of corpus.claims) {
    const [issue] = deriveClaimIndependence(claim, sources, subjectOrigins).issues
    if (issue !== undefined) {
      throw new CorpusIntegrityError(issue.code, `claims.${claim.claimId}`, issue.detail)
    }
  }
}

export const researchIndex = buildResearchIndex(researchCorpus)
