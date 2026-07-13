import { describe, expect, it } from "vitest"
import { z } from "zod"

import adjacentJson from "../../../research/corpus/adjacent.json"
import companiesJson from "../../../research/corpus/companies.json"
import supplementalJson from "../../../research/corpus/supplemental-adjacent.json"
import supplementalTwoJson from "../../../research/corpus/supplemental-adjacent-2.json"
import manifestJson from "../../../research/seeds/datasets/decision-manifest.json"
import { datasetCorpus } from "./dataset-corpus"
import {
  DATASET_ACCESS_LEVELS,
  DATASET_ARTIFACTS,
  DATASET_CATEGORIES,
  DATASET_PROVENANCE_KINDS,
  DATASET_SURFACE_KINDS,
  DatasetCorpusSchema,
  DatasetDecisionManifestSchema,
  DatasetSurfaceSchema,
} from "./dataset-schema"

const manifest = DatasetDecisionManifestSchema.parse(manifestJson)
const surfaces = datasetCorpus.families.flatMap((family) => family.surfaces)
const retained = manifest.candidates.filter((candidate) => candidate.decision === "retained")
const aliases = manifest.candidates.filter((candidate) => candidate.decision === "alias")
const excluded = manifest.candidates.filter(
  (candidate) => candidate.decision !== "retained" && candidate.decision !== "alias",
)
const CoreCompanyListSchema = z.array(z.object({ companyId: z.string(), name: z.string() }))
const AdjacentCompanyListSchema = z.array(z.object({ adjacentId: z.string(), name: z.string() }))
const SupplementalCompanyListSchema = z.object({
  records: z.array(z.object({ adjacentId: z.string(), name: z.string() })),
})

describe("dataset schema", () => {
  it("rejects malformed corpus and surface input at the boundary", () => {
    // Given: malformed external values with blank fields and an insecure URL.
    const badSurface = {
      surfaceId: "surface_bad",
      label: " ",
      url: "http://example.com/data",
      kind: "dataset",
      artifacts: [],
      access: "open",
      provenance: "first_party",
      notes: "",
    }

    // When: both values cross their schemas.
    const corpusResult = DatasetCorpusSchema.safeParse({})
    const surfaceResult = DatasetSurfaceSchema.safeParse(badSurface)

    // Then: neither malformed value is accepted.
    expect(corpusResult.success).toBe(false)
    expect(surfaceResult.success).toBe(false)
  })

  it("exports the exact canonical enum values", () => {
    // Given: the product contract's fixed enum sets.
    const expectedCategories = [
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

    // When: exported enum constants are collected.
    const actual = {
      categories: DATASET_CATEGORIES,
      artifacts: DATASET_ARTIFACTS,
      access: DATASET_ACCESS_LEVELS,
      provenance: DATASET_PROVENANCE_KINDS,
      surfaceKinds: DATASET_SURFACE_KINDS,
    }

    // Then: no category is missing or invented and companion enums stay exact.
    expect(actual.categories).toEqual(expectedCategories)
    expect(actual.artifacts).toEqual([
      "tasks",
      "environment",
      "inputs",
      "references",
      "trajectories",
      "results",
      "training",
      "viewer_sample",
      "commercial_catalog",
    ])
    expect(actual.access).toEqual([
      "open",
      "gated",
      "public_subset",
      "sample_demo",
      "commercial",
      "credential_dependent",
      "rolling",
      "provisional",
    ])
    expect(actual.provenance).toEqual([
      "first_party",
      "official_companion",
      "community_derivative",
      "anonymous_release",
    ])
    expect(actual.surfaceKinds).toEqual([
      "benchmark_page",
      "dataset",
      "repository",
      "sample_viewer",
      "leaderboard",
      "environment",
      "catalog",
      "download",
    ])
  })
})

describe("checked-in dataset corpus", () => {
  it("covers all categories with at least 400 families and 500 surfaces", () => {
    // Given: the generated, schema-parsed registry.
    const categories = new Set(datasetCorpus.families.map((family) => family.category))

    // When: family and surface coverage is counted.
    const counts = { families: datasetCorpus.families.length, surfaces: surfaces.length }

    // Then: the exhaustive corpus thresholds and category coverage hold.
    expect(categories).toEqual(new Set(DATASET_CATEGORIES))
    expect(counts.families).toBeGreaterThanOrEqual(400)
    expect(counts.surfaces).toBeGreaterThanOrEqual(500)
    expect(datasetCorpus.metadata.familyCount).toBe(counts.families)
    expect(datasetCorpus.metadata.surfaceCount).toBe(counts.surfaces)
  })

  it("uses unique IDs, unique URLs, HTTPS, and nonblank surface-level labels", () => {
    // Given: every retained family and nested surface.
    const familyIds = datasetCorpus.families.map((family) => family.familyId)
    const familyNames = datasetCorpus.families.map((family) =>
      family.name.normalize("NFKC").toLowerCase().replace(/\s+/gu, " ").trim(),
    )
    const surfaceIds = surfaces.map((surface) => surface.surfaceId)
    const urls = surfaces.map((surface) => surface.url)

    // When: identity and field invariants are inspected.
    const textValues = datasetCorpus.families.flatMap((family) => [
      family.name,
      family.publisher,
      family.description,
      ...family.tags,
      ...family.surfaces.flatMap((surface) => [surface.label, surface.notes]),
    ])

    // Then: every identity and user-visible field is deterministic and usable.
    expect(new Set(familyIds).size).toBe(familyIds.length)
    expect(new Set(familyNames).size).toBe(familyNames.length)
    expect(new Set(surfaceIds).size).toBe(surfaceIds.length)
    expect(new Set(urls).size).toBe(urls.length)
    expect(urls.every((url) => url.startsWith("https://"))).toBe(true)
    expect(textValues.every((value) => value.trim().length > 0)).toBe(true)
    expect(surfaces.every((surface) => surface.artifacts.length > 0)).toBe(true)
    expect(datasetCorpus.families.every((family) => !("label" in family))).toBe(true)
    expect(
      datasetCorpus.families.every((family) =>
        family.surfaces.some((surface) => surface.surfaceId === family.primarySurfaceId),
      ),
    ).toBe(true)
  })

  it("ships concise family-specific descriptions instead of evidence-row fragments", () => {
    const descriptions = datasetCorpus.families.map((family) => family.description)
    const byId = new Map(datasetCorpus.families.map((family) => [family.familyId, family]))

    expect(descriptions.every((description) => !/https?:\/\//iu.test(description))).toBe(true)
    expect(
      descriptions.every(
        (description) =>
          !/verified required surface|HF\/Exa|High-confidence accessible datasets/iu.test(
            description,
          ),
      ),
    ).toBe(true)
    expect(new Set(descriptions).size).toBe(descriptions.length)
    expect(byId.get("ds_gdpval")?.description).toContain("professional knowledge-work")
    expect(byId.get("ds_aviro_c4")?.description).toContain("long-running agent tasks")
  })

  it("publishes an auditable 132-company coverage ledger with visible no-hit statuses", () => {
    const attributed = datasetCorpus.companyCoverage.filter(
      (entry) => entry.status === "attributed",
    )
    const noHits = datasetCorpus.companyCoverage.filter(
      (entry) => entry.status === "no_attributable_public_dataset",
    )

    expect(datasetCorpus.companyCoverage).toHaveLength(132)
    expect(new Set(datasetCorpus.companyCoverage.map((entry) => entry.companyId)).size).toBe(132)
    expect(attributed.every((entry) => entry.familyCount > 0)).toBe(true)
    expect(noHits.every((entry) => entry.familyCount === 0)).toBe(true)
    expect(attributed.map((entry) => entry.name)).toEqual(
      expect.arrayContaining(["Browserbase", "OpenPipe", "Predibase"]),
    )
    expect(noHits.map((entry) => entry.name)).toEqual(
      expect.arrayContaining(["Andromede", "Anyscale", "hillclimb", "Steel", "TrainLoop"]),
    )
  })

  it("classifies trajectory- and log-labeled surfaces with matching artifacts", () => {
    const trajectorySurfaces = surfaces.filter((surface) =>
      /trajector(?:y|ies)/iu.test(`${surface.label} ${surface.url}`),
    )
    const logSurfaces = surfaces.filter((surface) =>
      /(?:^|[-_/\s])logs?(?:$|[-_/\s])/iu.test(`${surface.label} ${surface.url}`),
    )

    expect(trajectorySurfaces.length).toBeGreaterThan(0)
    expect(trajectorySurfaces.every((surface) => surface.artifacts.includes("trajectories"))).toBe(
      true,
    )
    expect(logSurfaces.length).toBeGreaterThan(0)
    expect(logSurfaces.every((surface) => surface.artifacts.includes("results"))).toBe(true)
  })

  it("preserves explicit-open access and single-row artifact evidence in production cases", () => {
    const byUrl = new Map(surfaces.map((surface) => [surface.url, surface]))
    const explicitlyOpen = [
      "https://huggingface.co/datasets/microsoft/delegate52",
      "https://huggingface.co/datasets/McGill-NLP/weblinx-browsergym",
      "https://github.com/RUCKBReasoning/SpreadsheetBench",
      "https://huggingface.co/datasets/chenyifan0929/LexRubric",
      "https://libero-project.github.io/datasets",
      "https://huggingface.co/datasets/nvidia/LIBERO_LeRobot_v3",
    ]
    const trajectoryRows = [
      "https://huggingface.co/datasets/xlangai/AgentNet",
      "https://huggingface.co/datasets/vyokky/GUI-360",
      "https://github.com/google-research/google-research/tree/master/android_control",
    ]

    expect(explicitlyOpen.map((url) => byUrl.get(url)?.access)).toEqual([
      "open",
      "open",
      "open",
      "open",
      "open",
      "open",
    ])
    expect(trajectoryRows.map((url) => byUrl.get(url)?.artifacts.includes("trajectories"))).toEqual(
      [true, true, true],
    )
    expect(
      byUrl.get("https://huggingface.co/datasets/BAAI-Agents/SWITCH-Basic-v1-open")?.access,
    ).toBe("public_subset")
    expect(byUrl.get("https://github.com/kalescale/SHADE-Arena")?.access).toBe("public_subset")
    expect(byUrl.get("https://waymo.com/open/")?.access).toBe("credential_dependent")
    expect(byUrl.get("https://waymo.com/open/")?.artifacts.includes("results")).toBe(false)
    expect(byUrl.get("https://argoverse.org/")?.access).toBe("credential_dependent")
    expect(byUrl.get("https://holoassist.github.io/")?.access).toBe("credential_dependent")
    expect(
      byUrl.get("https://huggingface.co/datasets/TuringEnterprises/Turing-Open-Reasoning")?.access,
    ).toBe("open")
    expect(
      byUrl.get("https://huggingface.co/datasets/micro1-inc/longextract-bench-50")?.access,
    ).toBe("open")
    expect(byUrl.get("https://huggingface.co/datasets/toloka/beemo")?.access).toBe("open")
    expect(byUrl.get("https://toloka.ai/datasets/")?.access).toBe("commercial")
    const falseOrgCatalogs = [
      "https://doi.org/10.5281/zenodo.17696742",
      "https://miniwob.farama.org/index.html",
      "https://allenai.org/blog/molmoweb",
      "https://doi.org/10.5281/zenodo.19348888",
      "https://zenodo.org/records/18929841",
      "https://zenodo.org/records/10254697",
      "https://ai2thor.allenai.org/robothor/",
      "https://argoverse.org/",
      "https://zenodo.org/records/19742725",
      "https://ego-exo4d-data.org/",
      "https://ego4d-data.org/",
      "https://www.robot-manipulation.org/nist-moad",
      "https://www.nuscenes.org/nuscenes",
      "https://bringmeaspoon.org/",
    ]
    expect(
      falseOrgCatalogs.map((url) => byUrl.get(url)?.artifacts.includes("commercial_catalog")),
    ).toEqual(Array.from({ length: 14 }, () => false))
    const explicitCatalogEvidence =
      /\bcatalogs?\b|\boff-the-shelf\b|\b(?:data|datasets?) marketplaces?\b|\bmarketplaces? (?:for|of) (?:data|datasets?)\b|\bmulti[- ]dataset offerings?\b|\bcommercial (?:benchmark-specific )?datasets\b/iu
    const commercialCatalogSurfaces = surfaces.filter((surface) =>
      surface.artifacts.includes("commercial_catalog"),
    )
    expect(
      commercialCatalogSurfaces.every((surface) =>
        explicitCatalogEvidence.test(`${surface.label} ${surface.notes}`),
      ),
    ).toBe(true)
    const knownCommercialCatalogs = [
      "https://dashboard.withdavid.ai/",
      "https://toloka.ai/datasets/",
      "https://www.appen.com/ots-datasets",
      "https://www.kled.ai/datasets",
      "https://www.withprotege.ai/news/introducing-protege-evaluation-datasets-and-benchmarks-for-healthcare-ai",
    ]
    expect(
      knownCommercialCatalogs.map((url) =>
        byUrl.get(url)?.artifacts.includes("commercial_catalog"),
      ),
    ).toEqual([true, true, true, true, true])
    const ordinaryCollectionUrls = [
      "https://huggingface.co/datasets/OpenGVLab/ScaleCUA-Data",
      "https://huggingface.co/datasets/NAIL-Group/ClawBench",
      "https://github.com/ACEBench/ACEBench",
      "https://huggingface.co/datasets/MCPToolBench/MCPToolBenchPP",
      "https://github.com/mcp-tool-bench/MCPToolBenchPP",
      "https://github.com/OpenBMB/ToolBench",
      "https://huggingface.co/datasets/nebius/SWE-rebench",
      "https://nebius.com/blog/posts/swe-rebench-dataset",
      "https://github.com/deepsense-ai/business-utility-evaluation",
      "https://huggingface.co/datasets/jhu-clsp/CLERC",
      "https://github.com/harveyai/harvey-labs",
      "https://huggingface.co/datasets/ATH-MaaS/DeepWideSearch",
      "https://huggingface.co/datasets/idacy/control-arena-persistent-state-eval-full-public-2026-05-28",
      "https://huggingface.co/datasets/xlangai/CUA-Gym",
      "https://huggingface.co/datasets/neulab/agent-data-collection",
      "https://huggingface.co/datasets/benchflow/benchmarks",
      "https://huggingface.co/chakra-labs/datasets",
      "https://huggingface.co/collections/argilla/preference-datasets-for-dpo",
      "https://huggingface.co/datasets/snorkelai/Multi-Turn-Insurance-Underwriting/viewer/default/train",
      "https://huggingface.co/datasets/contra-labs/creative-design-trajectories",
      "https://terac.com/datasets/computer-use-workflows",
      "https://huggingface.co/datasets/webagentlab/WebChain",
      "https://docs.eigenai.com/products/eigendata-cli/datasets/enterprise-bench/overview",
      "https://huggingface.co/datasets/AnodeAI/Agent-Trace-Cyber-v1",
    ]
    expect(
      ordinaryCollectionUrls.map((url) => byUrl.get(url)?.artifacts.includes("commercial_catalog")),
    ).toEqual(Array.from({ length: ordinaryCollectionUrls.length }, () => false))
  })

  it("requires artifact token boundaries in exact production counterexamples", () => {
    const byUrl = new Map(surfaces.map((surface) => [surface.url, surface]))
    const referenceFalsePositives = [
      "https://huggingface.co/datasets/lmarena-ai/arena-human-preference-140k",
      "https://huggingface.co/datasets/lmarena-ai/webdev-arena-preference-10k",
      "https://huggingface.co/datasets/lmarena-ai/repochat-arena-preference-4k",
      "https://huggingface.co/datasets/argilla/llama-2-banking-preference",
      "https://huggingface.co/collections/argilla/preference-datasets-for-dpo",
      "https://github.com/juhyunohh/flextravelbench",
      "https://github.com/X-PLUG/SocialBench",
      "https://huggingface.co/datasets/Longitude-Labs/spreadsheet-arena-release",
      "https://huggingface.co/datasets/ZYao720/WEBPRMBENCH",
      "https://huggingface.co/datasets/RioLee/ToolPref-Pairwise-30K",
      "https://github.com/peng-weihan/SWE-QA-Bench",
      "https://huggingface.co/datasets/Hubble42/ResolveBench",
      "https://github.com/CMarsRover/SciAgentGYM",
      "https://huggingface.co/datasets/osunlp/ScienceAgentBench",
      "https://www.telusdigital.com/insights/data-and-ai/article/visual-question-answering-dataset",
    ]
    const inputFalsePositives = [
      "https://github.com/amazon-agi/tau2-bench-verified",
      "https://huggingface.co/datasets/CooperBench/cooperbench-trajectories",
      "https://huggingface.co/datasets/CooperBench/cooperator-sft-data",
    ]
    const trajectoryFalsePositives = [
      "https://huggingface.co/datasets/AgentCollabBench/AgentCollabBench",
      "https://huggingface.co/datasets/rachpradhan/EDGAR-FinTrace",
    ]
    const viewerFalsePositives = [
      "https://huggingface.co/datasets/SWE-Gym/OpenHands-Sampled-Trajectories",
    ]

    expect(
      referenceFalsePositives.map((url) => byUrl.get(url)?.artifacts.includes("references")),
    ).toEqual(Array.from({ length: referenceFalsePositives.length }, () => false))
    expect(inputFalsePositives.map((url) => byUrl.get(url)?.artifacts.includes("inputs"))).toEqual([
      false,
      false,
      false,
    ])
    expect(
      trajectoryFalsePositives.map((url) => byUrl.get(url)?.artifacts.includes("trajectories")),
    ).toEqual([false, false])
    expect(
      viewerFalsePositives.map((url) => byUrl.get(url)?.artifacts.includes("viewer_sample")),
    ).toEqual([false])
  })

  it("uses explicit access and license evidence before descriptive mixed or sample words", () => {
    const byUrl = new Map(surfaces.map((surface) => [surface.url, surface]))
    const openUrls = [
      "https://huggingface.co/datasets/microsoft/OfficeComprehensionBenchmark",
      "https://huggingface.co/datasets/lgy0404/MemGUI-Bench",
      "https://huggingface.co/datasets/matthewschramm/engram-v3",
      "https://huggingface.co/datasets/kingofspace0wzz/AgentSocialBench",
      "https://huggingface.co/datasets/Qwen/AgentWorldBench",
      "https://huggingface.co/datasets/negotiation-games/c2c-ai-vs-ai",
      "https://huggingface.co/datasets/CharlieDreemur/OpenManus-RL",
      "https://huggingface.co/datasets/fredericowieser/arc-agi-3-wm-traces",
    ]
    const publicSubsetUrls = [
      "https://huggingface.co/datasets/alibabagroup/terminal-bench-pro",
      "https://huggingface.co/datasets/lainmn/AgentDS",
      "https://huggingface.co/datasets/FDAbench2026/FDAbench-Full",
      "https://huggingface.co/datasets/futurehouse/lab-bench",
      "https://huggingface.co/datasets/birdsql/bird-interact-lite",
      "https://huggingface.co/datasets/birdsql/bird-interact-full",
      "https://huggingface.co/datasets/birdsql/livesqlbench-base-lite",
      "https://huggingface.co/datasets/birdsql/livesqlbench-base-full-v1",
      "https://huggingface.co/datasets/microsoft/LiveDRBench",
      "https://huggingface.co/datasets/DeepSynthesisTeam/deepsynth-bench",
    ]

    expect(openUrls.map((url) => byUrl.get(url)?.access)).toEqual(
      Array.from({ length: openUrls.length }, () => "open"),
    )
    expect(publicSubsetUrls.map((url) => byUrl.get(url)?.access)).toEqual(
      Array.from({ length: publicSubsetUrls.length }, () => "public_subset"),
    )
    expect(byUrl.get("https://huggingface.co/datasets/miromind-ai/MiroVerse-v0.1")?.access).toBe(
      "gated",
    )
    expect(byUrl.get("https://behavior.stanford.edu/challenge/dataset.html")?.access).toBe("gated")
  })

  it("keeps sample, negation, provenance, and surface-kind semantics in production rows", () => {
    const byUrl = new Map(surfaces.map((surface) => [surface.url, surface]))

    expect(
      byUrl.get("https://huggingface.co/datasets/Datoric/computer-use-agent-traces-250k")?.access,
    ).toBe("sample_demo")
    expect(byUrl.get("https://huggingface.co/datasets/micro1-inc/Prospera_Benchmark")?.access).toBe(
      "sample_demo",
    )
    expect(byUrl.get("https://github.com/os-tack/find-the-needle")?.access).toBe("open")
    expect(byUrl.get("https://huggingface.co/datasets/CooperBench/trajectories")?.access).toBe(
      "open",
    )
    expect(byUrl.get("https://huggingface.co/datasets/kzhou35/SafePro")?.access).toBe("open")
    expect(
      byUrl
        .get("https://huggingface.co/datasets/NAIL-Group/ClawBench")
        ?.artifacts.includes("trajectories"),
    ).toBe(false)
    expect(byUrl.get("https://huggingface.co/datasets/NAIL-Group/ClawBench")?.provenance).toBe(
      "first_party",
    )
    expect(byUrl.get("https://aiming-lab.github.io/webharbor.github.io/")?.provenance).toBe(
      "first_party",
    )
    expect(byUrl.get("https://github.com/benchflow-ai/skillsbench")?.provenance).toBe("first_party")
    expect(byUrl.get("https://nebius.com/blog/posts/swe-rebench-dataset")?.kind).toBe(
      "benchmark_page",
    )
    expect(
      byUrl
        .get("https://nebius.com/blog/posts/swe-rebench-dataset")
        ?.artifacts.includes("environment"),
    ).toBe(false)
    expect(byUrl.get("https://github.com/ServiceNow/BrowserGym")?.artifacts).toEqual([
      "environment",
    ])
    expect(byUrl.get("https://github.com/carlosferrazza/humanoid-bench")?.artifacts).toEqual([
      "environment",
      "tasks",
    ])
    expect(
      byUrl.get("https://huggingface.co/datasets/KAKA22/SpreadsheetBench-v2")?.artifacts,
    ).toEqual(["tasks"])
    expect(
      byUrl.get("https://huggingface.co/datasets/Salesforce/xlam-function-calling-60k")?.artifacts,
    ).toEqual(["training"])
    expect(byUrl.get("https://huggingface.co/datasets/cmu-lti/tau-usi")?.artifacts).toEqual([
      "trajectories",
      "tasks",
    ])
    expect(byUrl.get("https://huggingface.co/datasets/mheisler/DeckBench")?.artifacts).toEqual([
      "inputs",
    ])
    expect(
      byUrl.get("https://huggingface.co/datasets/negotiation-games/c2c-ai-vs-ai")?.artifacts,
    ).toEqual(["results"])
    expect(
      byUrl.get("https://huggingface.co/datasets/giskardai/do-not-answer-scenarios")?.artifacts,
    ).toEqual(["tasks"])
    expect(
      byUrl.get("https://huggingface.co/datasets/CooperBench/trajectories")?.artifacts,
    ).toEqual(["trajectories"])
  })

  it("contains every required seed URL exactly", () => {
    // Given: the four required canonical surfaces.
    const requiredUrls = [
      "https://www.mercor.com/apex/apex-agents-leaderboard/",
      "https://huggingface.co/datasets/mercor/apex-agents",
      "https://huggingface.co/datasets/openai/gdpval/viewer/default/train",
      "https://www.aviro.ai/benchmarks/c4/samples",
    ]

    // When: generated surface URLs are indexed.
    const corpusUrls = new Set(surfaces.map((surface) => surface.url))

    // Then: every required seed is present at the exact URL.
    expect(requiredUrls.every((url) => corpusUrls.has(url))).toBe(true)
  })
})

describe("manifest accounting", () => {
  it("maps every retained candidate once and keeps excluded decisions absent", () => {
    // Given: explicit manifest decisions and generated surface URLs.
    const surfaceUrls = new Set(surfaces.map((surface) => surface.url))
    const decisionTotal = retained.length + aliases.length + excluded.length

    // When: accounting is reconciled from source decisions to output surfaces.
    const retainedUrls = retained.map((candidate) => candidate.url)

    // Then: accounting is exact and only retained URLs enter the corpus.
    expect(decisionTotal).toBe(manifest.candidates.length)
    expect(retained.length).toBe(surfaces.length)
    expect(retainedUrls.every((url) => surfaceUrls.has(url))).toBe(true)
    expect(excluded.every((candidate) => !surfaceUrls.has(candidate.url))).toBe(true)
    expect(datasetCorpus.metadata.manifestCandidateCount).toBe(manifest.candidates.length)
  })

  it("resolves every alias to a retained candidate and explicit family", () => {
    // Given: retained candidates indexed by candidate ID.
    const retainedById = new Map(retained.map((candidate) => [candidate.candidateId, candidate]))

    // When: aliases are resolved through their explicit target.
    const resolutions = aliases.map((candidate) => retainedById.get(candidate.aliasOf))

    // Then: every alias resolves and agrees on family identity.
    expect(resolutions.every((candidate) => candidate !== undefined)).toBe(true)
    expect(
      aliases.every((candidate, index) => candidate.familyId === resolutions[index]?.familyId),
    ).toBe(true)
  })

  it("excludes paper and code-only surfaces without excluding released data", () => {
    const byUrl = new Map(manifest.candidates.map((candidate) => [candidate.url, candidate]))

    expect(byUrl.get("https://icml.cc/virtual/2026/poster/62856")?.decision).toBe("paper_only")
    expect(
      byUrl.get("https://github.com/microsoft/Phi-Ground/tree/main/benchmark/CUActSpot")?.decision,
    ).toBe("result_only")
    expect(byUrl.get("https://github.com/os-tack/find-the-needle")?.decision).toBe("retained")
    expect(byUrl.get("https://huggingface.co/datasets/CooperBench/trajectories")?.decision).toBe(
      "retained",
    )
    expect(byUrl.get("https://huggingface.co/datasets/kzhou35/SafePro")?.decision).toBe("retained")
    expect(byUrl.get("https://github.com/Computer-use-agents/CUA-Trace-Viewer")?.decision).toBe(
      "result_only",
    )
  })

  it("records all 132 site companies exactly once", () => {
    // Given: the site's four canonical company registers.
    const core = CoreCompanyListSchema.parse(companiesJson)
    const adjacent = AdjacentCompanyListSchema.parse(adjacentJson)
    const supplementalOne = SupplementalCompanyListSchema.parse(supplementalJson)
    const supplementalTwo = SupplementalCompanyListSchema.parse(supplementalTwoJson)

    // When: canonical identities and manifest coverage are compared.
    const canonicalCompanies = [
      ...core.map((entry) => [entry.companyId, entry.name] as const),
      ...adjacent.map((entry) => [entry.adjacentId, entry.name] as const),
      ...supplementalOne.records.map((entry) => [entry.adjacentId, entry.name] as const),
      ...supplementalTwo.records.map((entry) => [entry.adjacentId, entry.name] as const),
    ].sort(([leftId], [rightId]) => leftId.localeCompare(rightId))
    const canonicalIds = canonicalCompanies.map(([companyId]) => companyId)
    const coverageIds = manifest.companyCoverage.map((entry) => entry.companyId).sort()
    const coverageCompanies = manifest.companyCoverage
      .map((entry) => [entry.companyId, entry.name] as const)
      .sort(([leftId], [rightId]) => leftId.localeCompare(rightId))
    const expectedCandidates = new Map<string, string[]>()
    for (const companyId of canonicalIds) expectedCandidates.set(companyId, [])
    for (const candidate of manifest.candidates) {
      if (candidate.decision !== "retained" && candidate.decision !== "alias") continue
      for (const companyId of candidate.companyIds) {
        expectedCandidates.get(companyId)?.push(candidate.candidateId)
      }
    }

    // Then: the ledger is exact, unique, and has one status or candidate mapping each.
    expect(canonicalIds).toHaveLength(132)
    expect(manifest.companyCoverage).toHaveLength(132)
    expect(new Set(coverageIds).size).toBe(132)
    expect(coverageIds).toEqual(canonicalIds)
    expect(coverageCompanies).toEqual(canonicalCompanies)
    expect(
      manifest.companyCoverage.every((entry) => {
        const expected = [...(expectedCandidates.get(entry.companyId) ?? [])].sort()
        return "candidateIds" in entry
          ? JSON.stringify([...entry.candidateIds].sort()) === JSON.stringify(expected)
          : expected.length === 0 && entry.status === "no_attributable_public_dataset"
      }),
    ).toBe(true)
  })
})
