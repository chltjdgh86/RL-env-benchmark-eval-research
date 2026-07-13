import datasetsJson from "../../../research/corpus/datasets.json"
import { DATASET_CATEGORIES, type DatasetCorpus, DatasetCorpusSchema } from "./dataset-schema"

export class DatasetCorpusIntegrityError extends Error {
  readonly name = "DatasetCorpusIntegrityError"

  constructor(
    readonly code: string,
    readonly detail: string,
  ) {
    super(`${code}: ${detail}`)
  }
}

const fail = (code: string, detail: string): never => {
  throw new DatasetCorpusIntegrityError(code, detail)
}

function assertDatasetCorpusIntegrity(corpus: DatasetCorpus): void {
  const familyIds = new Set<string>()
  const familyNames = new Set<string>()
  const descriptions = new Set<string>()
  const surfaceIds = new Set<string>()
  const urls = new Set<string>()
  const categoryCounts = new Map(DATASET_CATEGORIES.map((category) => [category, 0]))
  let surfaceCount = 0

  for (const family of corpus.families) {
    if (familyIds.has(family.familyId)) fail("DATASET_DUPLICATE_FAMILY", family.familyId)
    familyIds.add(family.familyId)
    const familyName = family.name.normalize("NFKC").toLowerCase().replace(/\s+/gu, " ").trim()
    if (familyNames.has(familyName)) fail("DATASET_DUPLICATE_FAMILY_NAME", family.name)
    familyNames.add(familyName)
    if (/https?:\/\/|verified required surface|HF\/Exa/iu.test(family.description)) {
      fail("DATASET_DESCRIPTION_EVIDENCE_FRAGMENT", family.familyId)
    }
    if (descriptions.has(family.description)) fail("DATASET_DUPLICATE_DESCRIPTION", family.familyId)
    descriptions.add(family.description)
    if (family.verifiedAt !== corpus.generatedAt) {
      fail("DATASET_VERIFICATION_DATE", family.familyId)
    }
    categoryCounts.set(family.category, (categoryCounts.get(family.category) ?? 0) + 1)
    let primaryFound = false
    for (const surface of family.surfaces) {
      surfaceCount += 1
      if (surfaceIds.has(surface.surfaceId)) fail("DATASET_DUPLICATE_SURFACE", surface.surfaceId)
      if (urls.has(surface.url)) fail("DATASET_DUPLICATE_URL", surface.url)
      surfaceIds.add(surface.surfaceId)
      urls.add(surface.url)
      if (surface.surfaceId === family.primarySurfaceId) primaryFound = true
    }
    if (!primaryFound) fail("DATASET_PRIMARY_SURFACE", family.familyId)
  }

  if (
    corpus.metadata.familyCount !== corpus.families.length ||
    corpus.metadata.surfaceCount !== surfaceCount ||
    corpus.metadata.retainedCandidateCount !== surfaceCount
  ) {
    fail("DATASET_METADATA_COUNT", "Generated metadata does not match nested records")
  }
  const companyIds = new Set<string>()
  let attributedCompanyCount = 0
  for (const company of corpus.companyCoverage) {
    if (companyIds.has(company.companyId)) fail("DATASET_DUPLICATE_COMPANY", company.companyId)
    companyIds.add(company.companyId)
    if (company.status === "attributed") attributedCompanyCount += 1
  }
  if (
    corpus.metadata.companyCount !== corpus.companyCoverage.length ||
    corpus.metadata.attributedCompanyCount !== attributedCompanyCount ||
    corpus.metadata.noAttributableCompanyCount !==
      corpus.companyCoverage.length - attributedCompanyCount
  ) {
    fail("DATASET_COMPANY_COUNT", "Generated company metadata does not match the coverage ledger")
  }
  if (
    corpus.metadata.manifestCandidateCount !==
    corpus.metadata.retainedCandidateCount +
      corpus.metadata.aliasCandidateCount +
      corpus.metadata.excludedCandidateCount
  ) {
    fail("DATASET_MANIFEST_ACCOUNTING", "Decision counts do not reconcile")
  }
  for (const category of DATASET_CATEGORIES) {
    if (corpus.metadata.categoryCounts[category] !== categoryCounts.get(category)) {
      fail("DATASET_CATEGORY_COUNT", category)
    }
  }
}

export function parseDatasetCorpus(input: unknown): DatasetCorpus {
  const corpus = DatasetCorpusSchema.parse(input)
  assertDatasetCorpusIntegrity(corpus)
  return corpus
}

export const datasetCorpus = parseDatasetCorpus(datasetsJson)
