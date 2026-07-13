import { createHash } from "node:crypto"
import { readFileSync, writeFileSync } from "node:fs"
import { dirname, resolve } from "node:path"
import { fileURLToPath, pathToFileURL } from "node:url"

import { z } from "zod"

const SCRIPT_DIR = dirname(fileURLToPath(import.meta.url))
const DEFAULT_ROOT = resolve(SCRIPT_DIR, "../..")
const DEFAULT_MANIFEST = resolve(DEFAULT_ROOT, "research/seeds/datasets/decision-manifest.json")
const DEFAULT_OUTPUT = resolve(DEFAULT_ROOT, "research/corpus/datasets.json")
const CANONICAL_COMPANY_COVERAGE_DIGEST =
  "15c25f9bd24440b01b2e9ce35dd546614b76c5a74018734322227c60842bc317"

const CATEGORIES = [
  "computer_use_gui",
  "browser_web",
  "mcp_tool_use",
  "coding_terminal",
  "office_professional",
  "enterprise_customer_service",
  "finance_legal_compliance",
  "science_data_research",
  "safety_cybersecurity",
  "multiagent_memory_planning_games",
  "robotics_physical_ai",
  "general_agent_suites_trajectories",
  "company_sample_catalogs",
]
const DECISIONS = [
  "retained",
  "alias",
  "mirror",
  "paper_only",
  "result_only",
  "unreleased",
  "broken_unverifiable",
  "monitoring",
]
const ARTIFACTS = ["tasks", "environment", "inputs", "references", "trajectories", "results", "training", "viewer_sample", "commercial_catalog"]
const ACCESS_LEVELS = ["open", "gated", "public_subset", "sample_demo", "commercial", "credential_dependent", "rolling", "provisional"]
const PROVENANCE_KINDS = ["first_party", "official_companion", "community_derivative", "anonymous_release"]
const SURFACE_KINDS = ["benchmark_page", "dataset", "repository", "sample_viewer", "leaderboard", "environment", "catalog", "download"]
const KIND_PRIORITY = new Map([
  ["dataset", 0],
  ["repository", 1],
  ["environment", 2],
  ["sample_viewer", 3],
  ["benchmark_page", 4],
  ["download", 5],
  ["catalog", 6],
  ["leaderboard", 7],
])

const NonblankSchema = z.string().trim().min(1)
const DateSchema = z.string().date()
const StableIdSchema = z.string().regex(/^[a-z][a-z0-9_-]*$/u)
const HttpsUrlSchema = z.url().refine((value) => {
  const url = new URL(value)
  return url.protocol === "https:" && url.username === "" && url.password === ""
}, "Expected an HTTPS URL without credentials")
const uniqueArray = (schema, minimum = 0) => z.array(schema).min(minimum).refine((values) => new Set(values.map((value) => JSON.stringify(value))).size === values.length, "Values must be unique")
const deterministicCompare = (left, right) => (left === right ? 0 : left < right ? -1 : 1)
const SurfaceSchema = z.object({ surfaceId: StableIdSchema, label: NonblankSchema, url: HttpsUrlSchema, kind: z.enum(SURFACE_KINDS), artifacts: uniqueArray(z.enum(ARTIFACTS), 1), access: z.enum(ACCESS_LEVELS), provenance: z.enum(PROVENANCE_KINDS), notes: NonblankSchema }).strict()
const FamilySeedSchema = z.object({ name: NonblankSchema, publisher: NonblankSchema, description: NonblankSchema, category: z.enum(CATEGORIES), tags: uniqueArray(NonblankSchema, 1), versionNote: NonblankSchema.nullable() }).strict()
const CandidateBase = { candidateId: StableIdSchema, sourceReport: NonblankSchema, section: NonblankSchema, rowExcerpt: NonblankSchema, publisher: NonblankSchema, label: NonblankSchema, url: HttpsUrlSchema, category: z.enum(CATEGORIES), companyIds: uniqueArray(StableIdSchema) }
const CandidateSchema = z.discriminatedUnion("decision", [
  z.object({ ...CandidateBase, decision: z.literal("retained"), familyId: StableIdSchema, family: FamilySeedSchema, surface: SurfaceSchema }).strict(),
  z.object({ ...CandidateBase, decision: z.literal("alias"), familyId: StableIdSchema, aliasOf: StableIdSchema }).strict(),
  z.object({ ...CandidateBase, decision: z.enum(DECISIONS.filter((decision) => decision !== "retained" && decision !== "alias")), exclusionReason: NonblankSchema }).strict(),
])
const CompanyCoverageSchema = z.union([
  z.object({ companyId: StableIdSchema, name: NonblankSchema, candidateIds: uniqueArray(StableIdSchema, 1) }).strict(),
  z.object({ companyId: StableIdSchema, name: NonblankSchema, status: z.literal("no_attributable_public_dataset") }).strict(),
])
const CompanyCoverageListSchema = z.array(CompanyCoverageSchema).length(132).refine((values) => new Set(values.map(({ companyId }) => companyId)).size === values.length, "Company IDs must be unique")
const companyCoverageDigest = (values) => createHash("sha256").update(JSON.stringify(values.map(({ companyId, name }) => [companyId, name]).sort(([left], [right]) => deterministicCompare(left, right)))).digest("hex")
const hasExactCandidateCoverage = (manifest) => {
  const expected = new Map(manifest.companyCoverage.map(({ companyId }) => [companyId, []]))
  for (const candidate of manifest.candidates) {
    if (candidate.decision !== "retained" && candidate.decision !== "alias") continue
    for (const companyId of candidate.companyIds) {
      const candidateIds = expected.get(companyId)
      if (candidateIds === undefined) return false
      candidateIds.push(candidate.candidateId)
    }
  }
  return manifest.companyCoverage.every((entry) => {
    const candidateIds = [...(expected.get(entry.companyId) ?? [])].sort()
    return "candidateIds" in entry
      ? JSON.stringify([...entry.candidateIds].sort()) === JSON.stringify(candidateIds)
      : candidateIds.length === 0
  })
}
const ManifestSchema = z.object({ schemaVersion: z.literal(1), verifiedAt: DateSchema, sourceRoot: NonblankSchema, candidates: uniqueArray(CandidateSchema, 1), companyCoverage: CompanyCoverageListSchema }).strict().refine((manifest) => companyCoverageDigest(manifest.companyCoverage) === CANONICAL_COMPANY_COVERAGE_DIGEST, { path: ["companyCoverage"], message: "Company IDs and names must match the four canonical registers" }).refine(hasExactCandidateCoverage, { path: ["companyCoverage"], message: "Company coverage must exactly match candidate company attribution" })
const FamilySchema = z.object({ familyId: StableIdSchema, name: NonblankSchema, publisher: NonblankSchema, description: NonblankSchema, category: z.enum(CATEGORIES), tags: uniqueArray(NonblankSchema, 1), verifiedAt: DateSchema, versionNote: NonblankSchema.nullable().optional(), primarySurfaceId: StableIdSchema, surfaces: uniqueArray(SurfaceSchema, 1) }).strict()
const RegistryCompanyCoverageSchema = z.object({ companyId: StableIdSchema, name: NonblankSchema, status: z.enum(["attributed", "no_attributable_public_dataset"]), familyCount: z.number().int().nonnegative() }).strict()
const RegistrySchema = z.object({ schemaVersion: z.literal(1), generatedAt: DateSchema, metadata: z.object({ familyCount: z.number().int().nonnegative(), surfaceCount: z.number().int().nonnegative(), manifestCandidateCount: z.number().int().nonnegative(), retainedCandidateCount: z.number().int().nonnegative(), aliasCandidateCount: z.number().int().nonnegative(), excludedCandidateCount: z.number().int().nonnegative(), companyCount: z.number().int().nonnegative(), attributedCompanyCount: z.number().int().nonnegative(), noAttributableCompanyCount: z.number().int().nonnegative(), categoryCounts: z.record(z.enum(CATEGORIES), z.number().int().nonnegative()) }).strict(), companyCoverage: z.array(RegistryCompanyCoverageSchema).length(132), families: uniqueArray(FamilySchema) }).strict()

const fail = (code, detail) => {
  const error = new Error(`${code}: ${detail}`)
  error.code = code
  throw error
}

const parseSchema = (schema, value, code) => {
  const result = schema.safeParse(value)
  if (!result.success) fail(code, result.error.issues.map((issue) => `${issue.path.join(".")}: ${issue.message}`).join("; "))
  return result.data
}

function validateManifest(input) {
  const manifest = parseSchema(ManifestSchema, input, "DATASET_MANIFEST_SCHEMA")
  const ids = new Set()
  const includedIds = new Set()
  const retainedById = new Map()
  const retainedUrls = new Set()
  const surfaceIds = new Set()
  for (const candidate of manifest.candidates) {
    if (ids.has(candidate.candidateId)) fail("DATASET_CANDIDATE_ID", candidate.candidateId)
    ids.add(candidate.candidateId)
    if (candidate.decision === "retained") {
      if (candidate.surface.url !== candidate.url || retainedUrls.has(candidate.url)) fail("DATASET_RETAINED_URL", candidate.url)
      if (surfaceIds.has(candidate.surface.surfaceId)) fail("DATASET_SURFACE_ID", candidate.surface.surfaceId)
      if (candidate.family.category !== candidate.category) fail("DATASET_FAMILY_CATEGORY", candidate.candidateId)
      retainedUrls.add(candidate.url)
      surfaceIds.add(candidate.surface.surfaceId)
      retainedById.set(candidate.candidateId, candidate)
    }
    if (candidate.decision === "retained" || candidate.decision === "alias") includedIds.add(candidate.candidateId)
  }
  for (const candidate of manifest.candidates) {
    if (candidate.decision !== "alias") continue
    const target = retainedById.get(candidate.aliasOf)
    if (target === undefined || target.familyId !== candidate.familyId) {
      fail("DATASET_ALIAS_UNRESOLVED", candidate.candidateId)
    }
  }
  const companyIds = new Set()
  for (const entry of manifest.companyCoverage) {
    if (companyIds.has(entry.companyId)) fail("DATASET_COMPANY_DUPLICATE", entry.companyId)
    companyIds.add(entry.companyId)
    if ("candidateIds" in entry && entry.candidateIds.some((id) => !includedIds.has(id))) fail("DATASET_COMPANY_CANDIDATE", entry.companyId)
  }
  return manifest
}

const compareSurface = (left, right) =>
  (KIND_PRIORITY.get(left.kind) ?? 99) - (KIND_PRIORITY.get(right.kind) ?? 99) ||
  deterministicCompare(left.url, right.url) ||
  deterministicCompare(left.surfaceId, right.surfaceId)

export function buildDatasetRegistry(input) {
  const manifest = validateManifest(input)
  const retained = manifest.candidates.filter((candidate) => candidate.decision === "retained")
  const aliases = manifest.candidates.filter((candidate) => candidate.decision === "alias")
  const familyGroups = new Map()
  for (const candidate of retained) {
    const group = familyGroups.get(candidate.familyId) ?? []
    group.push(candidate)
    familyGroups.set(candidate.familyId, group)
  }
  const families = [...familyGroups.entries()].map(([familyId, candidates]) => {
    const ordered = [...candidates].sort((left, right) => compareSurface(left.surface, right.surface))
    const canonical = ordered[0]
    if (canonical === undefined) fail("DATASET_FAMILY_EMPTY", familyId)
    for (const candidate of ordered) {
      if (
        candidate.family.name !== canonical.family.name ||
        candidate.family.publisher !== canonical.family.publisher ||
        candidate.family.category !== canonical.family.category
      ) {
        fail("DATASET_FAMILY_CONFLICT", familyId)
      }
    }
    return {
      familyId,
      name: canonical.family.name,
      publisher: canonical.family.publisher,
      description: canonical.family.description,
      category: canonical.family.category,
      tags: [...new Set(ordered.flatMap((candidate) => candidate.family.tags))].sort(deterministicCompare),
      verifiedAt: manifest.verifiedAt,
      versionNote: canonical.family.versionNote,
      primarySurfaceId: canonical.surface.surfaceId,
      surfaces: ordered.map((candidate) => candidate.surface),
    }
  })
  families.sort(
    (left, right) =>
      CATEGORIES.indexOf(left.category) - CATEGORIES.indexOf(right.category) ||
      deterministicCompare(left.name, right.name) ||
      deterministicCompare(left.familyId, right.familyId),
  )
  const familyNames = new Set()
  for (const family of families) {
    const normalizedName = family.name.normalize("NFKC").toLowerCase().replace(/\s+/gu, " ").trim()
    if (familyNames.has(normalizedName)) fail("DATASET_DUPLICATE_FAMILY_NAME", family.name)
    familyNames.add(normalizedName)
  }
  const categoryCounts = Object.fromEntries(CATEGORIES.map((category) => [category, 0]))
  for (const family of families) categoryCounts[family.category] += 1
  const includedById = new Map(manifest.candidates.filter((candidate) => candidate.decision === "retained" || candidate.decision === "alias").map((candidate) => [candidate.candidateId, candidate]))
  const companyCoverage = manifest.companyCoverage.map((entry) => {
    if (!("candidateIds" in entry)) return { companyId: entry.companyId, name: entry.name, status: "no_attributable_public_dataset", familyCount: 0 }
    const familyIds = new Set(entry.candidateIds.map((candidateId) => includedById.get(candidateId)?.familyId).filter((familyId) => familyId !== undefined))
    if (familyIds.size === 0) fail("DATASET_COMPANY_FAMILY", entry.companyId)
    return { companyId: entry.companyId, name: entry.name, status: "attributed", familyCount: familyIds.size }
  })
  const attributedCompanyCount = companyCoverage.filter(({ status }) => status === "attributed").length
  return parseSchema(RegistrySchema, {
    schemaVersion: 1,
    generatedAt: manifest.verifiedAt,
    metadata: {
      familyCount: families.length,
      surfaceCount: retained.length,
      manifestCandidateCount: manifest.candidates.length,
      retainedCandidateCount: retained.length,
      aliasCandidateCount: aliases.length,
      excludedCandidateCount: manifest.candidates.length - retained.length - aliases.length,
      companyCount: companyCoverage.length,
      attributedCompanyCount,
      noAttributableCompanyCount: companyCoverage.length - attributedCompanyCount,
      categoryCounts,
    },
    companyCoverage,
    families,
  }, "DATASET_REGISTRY_SCHEMA")
}

export const serializeDatasetRegistry = (manifest) =>
  `${JSON.stringify(buildDatasetRegistry(manifest), null, 2)}\n`

const parseArguments = (arguments_) => {
  const result = { manifestPath: DEFAULT_MANIFEST, outputPath: DEFAULT_OUTPUT, check: false }
  for (let index = 0; index < arguments_.length; index += 1) {
    const argument = arguments_[index]
    if (argument === "--check") result.check = true
    else if (argument === "--manifest") result.manifestPath = resolve(arguments_[index += 1] ?? "")
    else if (argument === "--output") result.outputPath = resolve(arguments_[index += 1] ?? "")
    else fail("DATASET_BUILD_ARGUMENT", argument)
  }
  return result
}

export function runDatasetRegistryBuild(options) {
  const manifest = JSON.parse(readFileSync(options.manifestPath, "utf8"))
  const rendered = serializeDatasetRegistry(manifest)
  if (options.check) {
    const existing = readFileSync(options.outputPath, "utf8")
    if (existing !== rendered) fail("DATASET_REGISTRY_STALE", options.outputPath)
    return "DATASET_REGISTRY_OK"
  }
  writeFileSync(options.outputPath, rendered)
  return "DATASET_REGISTRY_BUILT"
}

function main() {
  try {
    process.stdout.write(`${runDatasetRegistryBuild(parseArguments(process.argv.slice(2)))}\n`)
  } catch (error) {
    if (error instanceof Error) {
      process.stderr.write(`${error.message}\n`)
      process.exitCode = 1
      return
    }
    throw error
  }
}

if (import.meta.url === pathToFileURL(process.argv[1] ?? "").href) main()
