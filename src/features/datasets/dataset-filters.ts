import {
  DATASET_ACCESS_LEVELS,
  DATASET_ARTIFACTS,
  DATASET_CATEGORIES,
  DATASET_PROVENANCE_KINDS,
  type DatasetFamily,
} from "./dataset-schema"

export type DatasetCategory = DatasetFamily["category"]
export type DatasetArtifact = DatasetFamily["surfaces"][number]["artifacts"][number]
export type DatasetAccess = DatasetFamily["surfaces"][number]["access"]
export type DatasetProvenance = DatasetFamily["surfaces"][number]["provenance"]

export type DatasetFilters = {
  readonly query: string
  readonly categories: readonly DatasetCategory[]
  readonly artifacts: readonly DatasetArtifact[]
  readonly access: readonly DatasetAccess[]
  readonly provenance: readonly DatasetProvenance[]
}

export type DatasetCategoryGroup = {
  readonly category: DatasetCategory
  readonly families: readonly DatasetFamily[]
}

export type DatasetFilterOption<Value extends string> = {
  readonly value: Value
  readonly count: number
}

export type DatasetFilterOptions = {
  readonly categories: readonly DatasetFilterOption<DatasetCategory>[]
  readonly artifacts: readonly DatasetFilterOption<DatasetArtifact>[]
  readonly access: readonly DatasetFilterOption<DatasetAccess>[]
  readonly provenance: readonly DatasetFilterOption<DatasetProvenance>[]
}

export type DatasetRegistrySelection = {
  readonly groups: readonly DatasetCategoryGroup[]
  readonly familyCount: number
  readonly surfaceCount: number
  readonly filterOptions: DatasetFilterOptions
}

export const EMPTY_DATASET_FILTERS = {
  query: "",
  categories: [],
  artifacts: [],
  access: [],
  provenance: [],
} as const satisfies DatasetFilters

function normalizeSearchText(value: string): string {
  return value
    .normalize("NFKD")
    .toLocaleLowerCase("en-US")
    .replace(/\p{Mark}+/gu, "")
    .replace(/ß/gu, "ss")
    .replace(/ς/gu, "σ")
    .replace(/\s+/gu, " ")
    .trim()
}

function includesSelection<Value extends string>(
  selected: readonly Value[],
  matches: (value: Value) => boolean,
): boolean {
  return selected.length === 0 || selected.some(matches)
}

function matchesQuery(family: DatasetFamily, query: string): boolean {
  const needle = normalizeSearchText(query)
  if (needle.length === 0) return true

  const fields = [
    family.name,
    family.publisher,
    family.description,
    ...family.tags,
    ...family.surfaces.map((surface) => surface.label),
  ]
  return fields.some((field) => normalizeSearchText(field).includes(needle))
}

function compareText(left: string, right: string): number {
  const normalizedLeft = normalizeSearchText(left)
  const normalizedRight = normalizeSearchText(right)
  if (normalizedLeft < normalizedRight) return -1
  if (normalizedLeft > normalizedRight) return 1
  return left < right ? -1 : left > right ? 1 : 0
}

function compareFamilies(left: DatasetFamily, right: DatasetFamily): number {
  const publisherOrder = compareText(left.publisher, right.publisher)
  if (publisherOrder !== 0) return publisherOrder
  const nameOrder = compareText(left.name, right.name)
  return nameOrder !== 0 ? nameOrder : compareText(left.familyId, right.familyId)
}

export function filterDatasetFamilies(
  families: readonly DatasetFamily[],
  filters: DatasetFilters,
): readonly DatasetFamily[] {
  return families.filter(
    (family) =>
      matchesQuery(family, filters.query) &&
      includesSelection(filters.categories, (category) => family.category === category) &&
      family.surfaces.some(
        (surface) =>
          includesSelection(filters.artifacts, (artifact) =>
            surface.artifacts.includes(artifact),
          ) &&
          includesSelection(filters.access, (access) => surface.access === access) &&
          includesSelection(filters.provenance, (provenance) => surface.provenance === provenance),
      ),
  )
}

export function groupDatasetFamilies(
  families: readonly DatasetFamily[],
): readonly DatasetCategoryGroup[] {
  return DATASET_CATEGORIES.flatMap((category) => {
    const categoryFamilies = families
      .filter((family) => family.category === category)
      .sort(compareFamilies)
    return categoryFamilies.length === 0 ? [] : [{ category, families: categoryFamilies }]
  })
}

export function countDatasetFilterOptions(
  families: readonly DatasetFamily[],
): DatasetFilterOptions {
  return {
    categories: DATASET_CATEGORIES.map((value) => ({
      value,
      count: families.filter((family) => family.category === value).length,
    })),
    artifacts: DATASET_ARTIFACTS.map((value) => ({
      value,
      count: families.filter((family) =>
        family.surfaces.some((surface) => surface.artifacts.includes(value)),
      ).length,
    })),
    access: DATASET_ACCESS_LEVELS.map((value) => ({
      value,
      count: families.filter((family) =>
        family.surfaces.some((surface) => surface.access === value),
      ).length,
    })),
    provenance: DATASET_PROVENANCE_KINDS.map((value) => ({
      value,
      count: families.filter((family) =>
        family.surfaces.some((surface) => surface.provenance === value),
      ).length,
    })),
  }
}

export function selectDatasetRegistry(
  families: readonly DatasetFamily[],
  filters: DatasetFilters,
): DatasetRegistrySelection {
  const filteredFamilies = filterDatasetFamilies(families, filters)
  return {
    groups: groupDatasetFamilies(filteredFamilies),
    familyCount: filteredFamilies.length,
    surfaceCount: filteredFamilies.reduce((count, family) => count + family.surfaces.length, 0),
    filterOptions: countDatasetFilterOptions(families),
  }
}
