import { z } from "zod"

export const DATASET_CATEGORIES = [
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
] as const

export const DATASET_ARTIFACTS = [
  "tasks",
  "environment",
  "inputs",
  "references",
  "trajectories",
  "results",
  "training",
  "viewer_sample",
  "commercial_catalog",
] as const

export const DATASET_ACCESS_LEVELS = [
  "open",
  "gated",
  "public_subset",
  "sample_demo",
  "commercial",
  "credential_dependent",
  "rolling",
  "provisional",
] as const

export const DATASET_PROVENANCE_KINDS = [
  "first_party",
  "official_companion",
  "community_derivative",
  "anonymous_release",
] as const

export const DATASET_SURFACE_KINDS = [
  "benchmark_page",
  "dataset",
  "repository",
  "sample_viewer",
  "leaderboard",
  "environment",
  "catalog",
  "download",
] as const

export const DATASET_CANDIDATE_DECISIONS = [
  "retained",
  "alias",
  "mirror",
  "paper_only",
  "result_only",
  "unreleased",
  "broken_unverifiable",
  "monitoring",
] as const

const NonblankSchema = z.string().trim().min(1)
const DateSchema = z.string().date()
const StableIdSchema = z.string().regex(/^[a-z][a-z0-9_-]*$/u)
const HttpsUrlSchema = z
  .url()
  .refine((value) => value.startsWith("https://"), "URL must use HTTPS")
  .refine((value) => {
    const url = new URL(value)
    return url.username === "" && url.password === ""
  }, "URL must not contain credentials")
const uniqueArray = <T extends z.ZodType>(schema: T, minimum = 0) =>
  z
    .array(schema)
    .min(minimum)
    .refine(
      (values) => new Set(values.map((value) => JSON.stringify(value))).size === values.length,
      "Values must be unique",
    )
    .readonly()

export const DatasetCategorySchema = z.enum(DATASET_CATEGORIES)
export const DatasetArtifactSchema = z.enum(DATASET_ARTIFACTS)
export const DatasetAccessSchema = z.enum(DATASET_ACCESS_LEVELS)
export const DatasetProvenanceSchema = z.enum(DATASET_PROVENANCE_KINDS)
export const DatasetSurfaceKindSchema = z.enum(DATASET_SURFACE_KINDS)
export const DatasetCandidateDecisionSchema = z.enum(DATASET_CANDIDATE_DECISIONS)

export const DatasetSurfaceSchema = z
  .object({
    surfaceId: StableIdSchema,
    label: NonblankSchema,
    url: HttpsUrlSchema,
    kind: DatasetSurfaceKindSchema,
    artifacts: uniqueArray(DatasetArtifactSchema, 1),
    access: DatasetAccessSchema,
    provenance: DatasetProvenanceSchema,
    notes: NonblankSchema,
  })
  .strict()
  .readonly()

export const DatasetFamilySchema = z
  .object({
    familyId: StableIdSchema,
    name: NonblankSchema,
    publisher: NonblankSchema,
    description: NonblankSchema,
    category: DatasetCategorySchema,
    tags: uniqueArray(NonblankSchema, 1),
    verifiedAt: DateSchema,
    versionNote: NonblankSchema.nullable().optional(),
    primarySurfaceId: StableIdSchema,
    surfaces: uniqueArray(DatasetSurfaceSchema, 1),
  })
  .strict()
  .readonly()

const CorpusMetadataSchema = z
  .object({
    familyCount: z.number().int().nonnegative(),
    surfaceCount: z.number().int().nonnegative(),
    manifestCandidateCount: z.number().int().nonnegative(),
    retainedCandidateCount: z.number().int().nonnegative(),
    aliasCandidateCount: z.number().int().nonnegative(),
    excludedCandidateCount: z.number().int().nonnegative(),
    companyCount: z.number().int().nonnegative(),
    attributedCompanyCount: z.number().int().nonnegative(),
    noAttributableCompanyCount: z.number().int().nonnegative(),
    categoryCounts: z.record(DatasetCategorySchema, z.number().int().nonnegative()),
  })
  .strict()
  .readonly()

export const DatasetCompanyCoverageSchema = z
  .object({
    companyId: StableIdSchema,
    name: NonblankSchema,
    status: z.enum(["attributed", "no_attributable_public_dataset"]),
    familyCount: z.number().int().nonnegative(),
  })
  .strict()
  .superRefine((entry, context) => {
    if (entry.status === "attributed" && entry.familyCount === 0) {
      context.addIssue({
        code: "custom",
        path: ["familyCount"],
        message: "Attributed companies require at least one family",
      })
    }
    if (entry.status === "no_attributable_public_dataset" && entry.familyCount !== 0) {
      context.addIssue({
        code: "custom",
        path: ["familyCount"],
        message: "No-hit companies cannot reference a family",
      })
    }
  })
  .readonly()

export const DatasetCorpusSchema = z
  .object({
    schemaVersion: z.literal(1),
    generatedAt: DateSchema,
    metadata: CorpusMetadataSchema,
    companyCoverage: uniqueArray(DatasetCompanyCoverageSchema, 132).refine(
      (values) => values.length === 132,
      "Exactly 132 company coverage rows are required",
    ),
    families: uniqueArray(DatasetFamilySchema),
  })
  .strict()
  .readonly()

const CandidateBase = {
  candidateId: StableIdSchema,
  sourceReport: NonblankSchema,
  section: NonblankSchema,
  rowExcerpt: NonblankSchema,
  publisher: NonblankSchema,
  label: NonblankSchema,
  url: HttpsUrlSchema,
  category: DatasetCategorySchema,
  companyIds: uniqueArray(StableIdSchema),
}

const FamilySeedSchema = z
  .object({
    name: NonblankSchema,
    publisher: NonblankSchema,
    description: NonblankSchema,
    category: DatasetCategorySchema,
    tags: uniqueArray(NonblankSchema, 1),
    versionNote: NonblankSchema.nullable(),
  })
  .strict()
  .readonly()

const RetainedCandidateSchema = z
  .object({
    ...CandidateBase,
    decision: z.literal("retained"),
    familyId: StableIdSchema,
    family: FamilySeedSchema,
    surface: DatasetSurfaceSchema,
  })
  .strict()
  .readonly()

const AliasCandidateSchema = z
  .object({
    ...CandidateBase,
    decision: z.literal("alias"),
    familyId: StableIdSchema,
    aliasOf: StableIdSchema,
  })
  .strict()
  .readonly()

const ExcludedCandidateSchema = z
  .object({
    ...CandidateBase,
    decision: z.enum([
      "mirror",
      "paper_only",
      "result_only",
      "unreleased",
      "broken_unverifiable",
      "monitoring",
    ]),
    exclusionReason: NonblankSchema,
  })
  .strict()
  .readonly()

const CompanyCoverageSchema = z.union([
  z
    .object({
      companyId: StableIdSchema,
      name: NonblankSchema,
      candidateIds: uniqueArray(StableIdSchema, 1),
    })
    .strict()
    .readonly(),
  z
    .object({
      companyId: StableIdSchema,
      name: NonblankSchema,
      status: z.literal("no_attributable_public_dataset"),
    })
    .strict()
    .readonly(),
])
const CompanyCoverageListSchema = uniqueArray(CompanyCoverageSchema, 132).refine(
  (values) => values.length === 132,
  "Exactly 132 company coverage rows are required",
)

export const DatasetDecisionManifestSchema = z
  .object({
    schemaVersion: z.literal(1),
    verifiedAt: DateSchema,
    sourceRoot: NonblankSchema,
    candidates: uniqueArray(
      z.union([RetainedCandidateSchema, AliasCandidateSchema, ExcludedCandidateSchema]),
      1,
    ),
    companyCoverage: CompanyCoverageListSchema,
  })
  .strict()
  .superRefine((manifest, context) => {
    const expected = new Map<string, string[]>()
    for (const { companyId } of manifest.companyCoverage) expected.set(companyId, [])
    for (const [index, candidate] of manifest.candidates.entries()) {
      if (candidate.decision !== "retained" && candidate.decision !== "alias") continue
      for (const companyId of candidate.companyIds) {
        const candidateIds = expected.get(companyId)
        if (candidateIds === undefined) {
          context.addIssue({
            code: "custom",
            path: ["candidates", index, "companyIds"],
            message: "Candidate company must exist in company coverage",
          })
        } else {
          candidateIds.push(candidate.candidateId)
        }
      }
    }
    for (const [index, entry] of manifest.companyCoverage.entries()) {
      const candidateIds = [...(expected.get(entry.companyId) ?? [])].sort()
      const exact =
        "candidateIds" in entry
          ? JSON.stringify([...entry.candidateIds].sort()) === JSON.stringify(candidateIds)
          : candidateIds.length === 0
      if (!exact) {
        context.addIssue({
          code: "custom",
          path: ["companyCoverage", index],
          message: "Company coverage must exactly match candidate company attribution",
        })
      }
    }
  })
  .readonly()

export type DatasetSurface = z.infer<typeof DatasetSurfaceSchema>
export type DatasetFamily = z.infer<typeof DatasetFamilySchema>
export type DatasetCorpus = z.infer<typeof DatasetCorpusSchema>
export type DatasetCompanyCoverage = z.infer<typeof DatasetCompanyCoverageSchema>
export type DatasetDecisionManifest = z.infer<typeof DatasetDecisionManifestSchema>
