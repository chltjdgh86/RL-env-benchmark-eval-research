import { describe, expect, it } from "vitest"
import {
  countDatasetFilterOptions,
  filterDatasetFamilies,
  groupDatasetFamilies,
  selectDatasetRegistry,
} from "./dataset-filters"
import type { DatasetFamily } from "./dataset-schema"

const families = [
  {
    familyId: "browser_zeta",
    name: "Zeta Browse",
    publisher: "Alpha Labs",
    description: "Browser navigation tasks.",
    category: "browser_web",
    tags: ["browser"],
    verifiedAt: "2026-07-13",
    primarySurfaceId: "browser_zeta_tasks",
    surfaces: [
      {
        surfaceId: "browser_zeta_tasks",
        label: "Task set",
        url: "https://example.com/zeta/tasks",
        kind: "dataset",
        artifacts: ["tasks", "inputs"],
        access: "open",
        provenance: "first_party",
        notes: "Open task set.",
      },
      {
        surfaceId: "browser_zeta_environment",
        label: "Environment",
        url: "https://example.com/zeta/environment",
        kind: "environment",
        artifacts: ["tasks", "environment"],
        access: "open",
        provenance: "first_party",
        notes: "Open environment.",
      },
    ],
  },
  {
    familyId: "gui_eclair",
    name: "Éclair Desk",
    publisher: "Aperture",
    description: "Desktop agent tasks.",
    category: "computer_use_gui",
    tags: ["gui"],
    verifiedAt: "2026-07-13",
    primarySurfaceId: "gui_eclair_tasks",
    surfaces: [
      {
        surfaceId: "gui_eclair_tasks",
        label: "Primary tasks",
        url: "https://example.com/eclair",
        kind: "dataset",
        artifacts: ["tasks"],
        access: "open",
        provenance: "first_party",
        notes: "Open desktop tasks.",
      },
    ],
  },
  {
    familyId: "browser_alpha",
    name: "Alpha Browse",
    publisher: "München Labs",
    description: "Runs CASE-SENSITIVE journeys.",
    category: "browser_web",
    tags: ["résumé", "browser"],
    verifiedAt: "2026-07-13",
    primarySurfaceId: "browser_alpha_inputs",
    surfaces: [
      {
        surfaceId: "browser_alpha_inputs",
        label: "ΔΟΚΙΜΉ Viewer",
        url: "https://example.com/alpha",
        kind: "sample_viewer",
        artifacts: ["inputs"],
        access: "gated",
        provenance: "official_companion",
        notes: "Gated inputs.",
      },
    ],
  },
  {
    familyId: "coding_runner",
    name: "Code Runner",
    publisher: "Beta Works",
    description: "Terminal coding tasks.",
    category: "coding_terminal",
    tags: ["coding"],
    verifiedAt: "2026-07-13",
    primarySurfaceId: "coding_runner_tasks",
    surfaces: [
      {
        surfaceId: "coding_runner_tasks",
        label: "Terminal tasks",
        url: "https://example.com/coding",
        kind: "dataset",
        artifacts: ["tasks"],
        access: "open",
        provenance: "official_companion",
        notes: "Open terminal tasks.",
      },
    ],
  },
] satisfies readonly DatasetFamily[]

const emptyFilters = {
  query: "",
  categories: [],
  artifacts: [],
  access: [],
  provenance: [],
} as const

describe("dataset filters", () => {
  it("searches every specified field with Unicode-aware case folding", () => {
    const cases = [
      ["ECLAIR", "gui_eclair"],
      ["MUNCHEN LABS", "browser_alpha"],
      ["case-sensitive journeys", "browser_alpha"],
      ["RESUME", "browser_alpha"],
      ["δοκιμη viewer", "browser_alpha"],
    ] as const

    for (const [query, expectedFamilyId] of cases) {
      const result = filterDatasetFamilies(families, { ...emptyFilters, query })
      expect(result.map((family) => family.familyId)).toEqual([expectedFamilyId])
    }
  })

  it("uses OR within a facet and AND across category, artifact, access, and provenance", () => {
    const result = filterDatasetFamilies(families, {
      ...emptyFilters,
      categories: ["browser_web", "coding_terminal"],
      artifacts: ["tasks", "training"],
      access: ["open", "rolling"],
      provenance: ["official_companion", "anonymous_release"],
    })

    expect(result.map((family) => family.familyId)).toEqual(["coding_runner"])
  })

  it("requires one surface to satisfy every active surface-scoped facet", () => {
    const mixedCompanion: DatasetFamily = {
      familyId: "mixed_companion",
      name: "Mixed Companion",
      publisher: "Alpha Labs",
      description: "A mixed companion fixture with deliberately disjoint surface metadata.",
      category: "browser_web",
      tags: ["browser"],
      verifiedAt: "2026-07-13",
      primarySurfaceId: "mixed_tasks",
      surfaces: [
        {
          surfaceId: "mixed_tasks",
          label: "Task set",
          url: "https://example.com/mixed/tasks",
          kind: "dataset",
          artifacts: ["tasks"],
          access: "gated",
          provenance: "first_party",
          notes: "Gated first-party tasks.",
        },
        {
          surfaceId: "mixed_results",
          label: "Results",
          url: "https://example.com/mixed/results",
          kind: "leaderboard",
          artifacts: ["results"],
          access: "open",
          provenance: "official_companion",
          notes: "Open official results.",
        },
      ],
    }

    expect(
      filterDatasetFamilies([mixedCompanion], {
        ...emptyFilters,
        artifacts: ["tasks"],
        access: ["open"],
      }),
    ).toEqual([])
    expect(
      filterDatasetFamilies([mixedCompanion], {
        ...emptyFilters,
        artifacts: ["results"],
        access: ["open"],
        provenance: ["official_companion"],
      }).map((family) => family.familyId),
    ).toEqual(["mixed_companion"])
  })

  it("returns empty results without mutating the caller's order", () => {
    const frozenFamilies = Object.freeze([...families])
    const before = JSON.stringify(frozenFamilies)

    expect(
      filterDatasetFamilies(frozenFamilies, { ...emptyFilters, query: "no such dataset" }),
    ).toEqual([])
    groupDatasetFamilies(frozenFamilies)
    expect(JSON.stringify(frozenFamilies)).toBe(before)
    expect(frozenFamilies.map((family) => family.familyId)).toEqual(
      families.map((family) => family.familyId),
    )
  })

  it("groups in canonical category order and sorts each group by publisher then name", () => {
    const groups = groupDatasetFamilies(families)

    expect(groups.map((group) => group.category)).toEqual([
      "computer_use_gui",
      "browser_web",
      "coding_terminal",
    ])
    expect(groups[1]?.families.map((family) => family.familyId)).toEqual([
      "browser_zeta",
      "browser_alpha",
    ])
  })

  it("counts each matching family once per canonical filter option", () => {
    const options = countDatasetFilterOptions(families)

    expect(options.categories).toContainEqual({ value: "browser_web", count: 2 })
    expect(options.artifacts).toContainEqual({ value: "tasks", count: 3 })
    expect(options.access).toContainEqual({ value: "open", count: 3 })
    expect(options.provenance).toContainEqual({ value: "first_party", count: 2 })
    expect(options.access).toContainEqual({ value: "provisional", count: 0 })
  })

  it("returns grouped families, filtered totals, and corpus-wide option counts", () => {
    const selection = selectDatasetRegistry(families, {
      ...emptyFilters,
      categories: ["browser_web"],
    })

    expect(selection.familyCount).toBe(2)
    expect(selection.surfaceCount).toBe(3)
    expect(selection.groups).toHaveLength(1)
    expect(selection.filterOptions.categories).toContainEqual({ value: "browser_web", count: 2 })
  })
})
