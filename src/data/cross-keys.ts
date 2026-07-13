import type { Claim } from "../domain/evidence-schema"
import type { ClaimId } from "../domain/ids"
import { assertBuyerCrossKeys } from "./buyer-cross-keys"
import { CorpusIntegrityError, type ResearchCorpus } from "./corpus-schema"

function fail(code: string, path: string, detail: string): never {
  throw new CorpusIntegrityError(code, path, detail)
}

function indexUnique<T, K extends string>(
  values: readonly T[],
  readId: (value: T) => K,
  path: string,
): ReadonlyMap<K, T> {
  const result = new Map<K, T>()
  for (const value of values) {
    const id = readId(value)
    if (result.has(id)) fail("DUPLICATE_ID", path, `Duplicate ${id}`)
    result.set(id, value)
  }
  return result
}

function assertArrayUniqueness(value: unknown, path: string): void {
  if (Array.isArray(value)) {
    const serialized = value.map((item) => JSON.stringify(item))
    if (new Set(serialized).size !== serialized.length) {
      fail("DUPLICATE_ARRAY_VALUE", path, "Array values must be unique")
    }
    for (const [index, item] of value.entries()) {
      assertArrayUniqueness(item, `${path}[${index}]`)
    }
    return
  }
  if (value !== null && typeof value === "object") {
    for (const [key, entry] of Object.entries(value)) {
      assertArrayUniqueness(entry, `${path}.${key}`)
    }
  }
}

function buildMaps(corpus: ResearchCorpus) {
  return {
    sources: indexUnique(corpus.sources, (value) => value.sourceId, "sources"),
    observations: indexUnique(corpus.observations, (value) => value.observationId, "observations"),
    claims: indexUnique(corpus.claims, (value) => value.claimId, "claims"),
    companies: indexUnique(corpus.companies, (value) => value.companyId, "companies"),
    industries: indexUnique(corpus.industries, (value) => value.industryId, "industries"),
    adjacent: indexUnique(corpus.adjacent, (value) => value.adjacentId, "adjacent"),
    buyers: indexUnique(corpus.buyerEvidence, (value) => value.buyerEvidenceId, "buyerEvidence"),
    analyses: indexUnique(corpus.marketAnalysis, (value) => value.analysisId, "marketAnalysis"),
    strategies: indexUnique(corpus.strategies, (value) => value.strategyId, "strategies"),
    receipts: indexUnique(corpus.receipts, (value) => value.id, "receipts"),
  }
}

type CorpusMaps = ReturnType<typeof buildMaps>

function assertClaims(
  claimIds: readonly ClaimId[],
  claims: ReadonlyMap<ClaimId, Claim>,
  path: string,
): void {
  for (const claimId of claimIds) {
    if (!claims.has(claimId)) fail("UNKNOWN_CLAIM_ID", path, `Unknown claim ${claimId}`)
  }
}

function validateEvidence(corpus: ResearchCorpus, maps: CorpusMaps): void {
  const subjectIds = new Set<string>([
    ...maps.sources.keys(),
    ...maps.observations.keys(),
    ...maps.claims.keys(),
    ...maps.companies.keys(),
    ...maps.industries.keys(),
    ...maps.adjacent.keys(),
    ...maps.buyers.keys(),
    ...maps.analyses.keys(),
    ...maps.strategies.keys(),
  ])
  const affiliationIds = new Set<string>([
    ...maps.companies.keys(),
    ...maps.adjacent.keys(),
    ...maps.buyers.keys(),
    ...maps.sources.keys(),
  ])
  for (const source of corpus.sources) {
    for (const affiliation of source.publisherAffiliations) {
      if (!affiliationIds.has(affiliation.entityRef)) {
        fail("UNKNOWN_AFFILIATION_ID", `sources.${source.sourceId}`, `${affiliation.entityRef}`)
      }
    }
  }
  for (const observation of corpus.observations) {
    if (!maps.sources.has(observation.sourceId)) {
      fail(
        "UNKNOWN_SOURCE_ID",
        `observations.${observation.observationId}`,
        `${observation.sourceId}`,
      )
    }
  }
  for (const claim of corpus.claims) {
    for (const subjectId of claim.subjectIds) {
      if (!subjectIds.has(subjectId))
        fail("UNKNOWN_SUBJECT_ID", `claims.${claim.claimId}`, `${subjectId}`)
    }
    const evidencePairs = new Set<string>()
    for (const link of claim.evidenceLinks) {
      const observation = maps.observations.get(link.observationId)
      if (!maps.sources.has(link.sourceId))
        fail("UNKNOWN_SOURCE_ID", `claims.${claim.claimId}`, `${link.sourceId}`)
      if (observation === undefined) {
        fail("UNKNOWN_OBSERVATION_ID", `claims.${claim.claimId}`, `${link.observationId}`)
      }
      if (observation.sourceId !== link.sourceId)
        fail("OBSERVATION_SOURCE_MISMATCH", `claims.${claim.claimId}`, `${link.observationId}`)
      const pair = `${link.observationId}|${link.sourceId}`
      if (evidencePairs.has(pair))
        fail("DUPLICATE_CLAIM_EVIDENCE_PAIR", `claims.${claim.claimId}`, pair)
      evidencePairs.add(pair)
    }
    assertClaims(claim.contradictionClaimIds, maps.claims, `claims.${claim.claimId}.contradictions`)
    const exception = claim.singleSourceException
    if (
      exception !== null &&
      !claim.evidenceLinks.some((link) => link.observationId === exception.observationId)
    ) {
      fail(
        "INVALID_SINGLE_SOURCE_EXCEPTION",
        `claims.${claim.claimId}`,
        `${exception.observationId}`,
      )
    }
  }
}

function validateCompanies(corpus: ResearchCorpus, maps: CorpusMaps): void {
  for (const company of corpus.companies) {
    assertClaims(
      [company.identityClaimId, ...company.comparisonMetricClaimIds],
      maps.claims,
      `companies.${company.companyId}`,
    )
    for (const groupedIds of Object.values(company.claimGroups)) {
      assertClaims(groupedIds, maps.claims, `companies.${company.companyId}.claimGroups`)
      for (const claimId of groupedIds) {
        if (!maps.claims.get(claimId)?.subjectIds.includes(company.companyId)) {
          fail("CLAIM_SUBJECT_MISMATCH", `companies.${company.companyId}`, `${claimId}`)
        }
      }
    }
    for (const industryId of company.industryIds) {
      const industry = maps.industries.get(industryId)
      if (industry === undefined) {
        fail("UNKNOWN_INDUSTRY_ID", `companies.${company.companyId}`, `${industryId}`)
      }
      if (!industry.companyIds.includes(company.companyId))
        fail("RECIPROCAL_LINK_MISMATCH", `companies.${company.companyId}`, `${industryId}`)
    }
    for (const buyerId of company.buyerEvidenceIds) {
      const buyer = maps.buyers.get(buyerId)
      if (buyer === undefined) {
        fail("UNKNOWN_BUYER_EVIDENCE_ID", `companies.${company.companyId}`, `${buyerId}`)
      }
      if (!("companyId" in buyer) || buyer.companyId !== company.companyId)
        fail("RECIPROCAL_LINK_MISMATCH", `companies.${company.companyId}`, `${buyerId}`)
    }
  }
}

function validateIndustriesAndAdjacent(corpus: ResearchCorpus, maps: CorpusMaps): void {
  for (const industry of corpus.industries) {
    assertClaims(
      [industry.definitionClaimId, ...industry.boundaryClaimIds, ...industry.buyerClaimIds],
      maps.claims,
      `industries.${industry.industryId}`,
    )
    for (const companyId of industry.companyIds) {
      if (!maps.companies.get(companyId)?.industryIds.includes(industry.industryId))
        fail("RECIPROCAL_LINK_MISMATCH", `industries.${industry.industryId}`, `${companyId}`)
    }
    for (const adjacentId of industry.adjacentIds) {
      if (!maps.adjacent.get(adjacentId)?.secondaryIndustryIds.includes(industry.industryId))
        fail("RECIPROCAL_LINK_MISMATCH", `industries.${industry.industryId}`, `${adjacentId}`)
    }
  }
  for (const adjacent of corpus.adjacent) {
    const claimIds = [
      adjacent.inclusionClaimId,
      adjacent.currentOfferClaimId,
      adjacent.currentStatusClaimId,
    ]
    assertClaims(claimIds, maps.claims, `adjacent.${adjacent.adjacentId}`)
    for (const claimId of claimIds) {
      if (!maps.claims.get(claimId)?.subjectIds.includes(adjacent.adjacentId))
        fail("CLAIM_SUBJECT_MISMATCH", `adjacent.${adjacent.adjacentId}`, claimId)
    }
    for (const industryId of adjacent.secondaryIndustryIds) {
      if (!maps.industries.get(industryId)?.adjacentIds.includes(adjacent.adjacentId))
        fail("RECIPROCAL_LINK_MISMATCH", `adjacent.${adjacent.adjacentId}`, `${industryId}`)
    }
    const observationGroups = [
      [adjacent.currentOfferClaimId, adjacent.currentOfferObservationIds],
      [adjacent.currentStatusClaimId, adjacent.currentStatusObservationIds],
    ] as const
    for (const [claimId, observationIds] of observationGroups) {
      const linked = new Set(
        maps.claims.get(claimId)?.evidenceLinks.map((link) => link.observationId),
      )
      for (const observationId of observationIds) {
        if (!maps.observations.has(observationId))
          fail("UNKNOWN_OBSERVATION_ID", `adjacent.${adjacent.adjacentId}`, `${observationId}`)
        if (!linked.has(observationId))
          fail("CLAIM_OBSERVATION_MISMATCH", `adjacent.${adjacent.adjacentId}`, `${observationId}`)
      }
    }
  }
}

export function assertCorpusCrossKeys(corpus: ResearchCorpus): void {
  const maps = buildMaps(corpus)
  assertArrayUniqueness(corpus, "corpus")
  validateEvidence(corpus, maps)
  validateCompanies(corpus, maps)
  validateIndustriesAndAdjacent(corpus, maps)
  assertBuyerCrossKeys(corpus)
}
