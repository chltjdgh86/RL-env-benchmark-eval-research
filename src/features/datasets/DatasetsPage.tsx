import { useEffect, useMemo, useState } from "react"
import { DatasetFamilyRecord } from "./DatasetFamilyRecord"
import { datasetCorpus } from "./dataset-corpus"
import {
  type DatasetFilterOption,
  type DatasetFilters,
  EMPTY_DATASET_FILTERS,
  selectDatasetRegistry,
} from "./dataset-filters"
import {
  DATASET_ACCESS_LABELS,
  DATASET_ARTIFACT_LABELS,
  DATASET_CATEGORY_LABELS,
  DATASET_PROVENANCE_LABELS,
} from "./dataset-labels"
import type { DatasetCompanyCoverage, DatasetFamily } from "./dataset-schema"

type DatasetsPageProps = {
  readonly companyCoverage?: readonly DatasetCompanyCoverage[]
  readonly families?: readonly DatasetFamily[]
  readonly initialQuery?: string
  readonly onQueryChange?: (query: string) => void
}

type FacetGroupProps<Value extends string> = {
  readonly label: string
  readonly labels: Readonly<Record<Value, string>>
  readonly options: readonly DatasetFilterOption<Value>[]
  readonly selected: readonly Value[]
  readonly onToggle: (value: Value) => void
}

function FacetGroup<Value extends string>({
  label,
  labels,
  onToggle,
  options,
  selected,
}: FacetGroupProps<Value>) {
  return (
    <fieldset className="dataset-facet">
      <legend>{label}</legend>
      <div className="dataset-facet__options">
        {options.map(({ count, value }) => (
          <label key={value}>
            <input
              checked={selected.includes(value)}
              disabled={count === 0}
              onChange={() => onToggle(value)}
              type="checkbox"
            />
            <span>{labels[value]}</span>
            <span className="tabular-figure">{count}</span>
          </label>
        ))}
      </div>
    </fieldset>
  )
}

function toggle<Value extends string>(selected: readonly Value[], value: Value): readonly Value[] {
  return selected.includes(value)
    ? selected.filter((selectedValue) => selectedValue !== value)
    : [...selected, value]
}

function resultSummary(familyCount: number, surfaceCount: number): string {
  return `${familyCount.toLocaleString("en-US")} ${familyCount === 1 ? "family" : "families"} · ${surfaceCount.toLocaleString("en-US")} public ${surfaceCount === 1 ? "surface" : "surfaces"}`
}

export function DatasetsPage({
  companyCoverage = datasetCorpus.companyCoverage,
  families = datasetCorpus.families,
  initialQuery = "",
  onQueryChange,
}: DatasetsPageProps) {
  const [filters, setFilters] = useState<DatasetFilters>({
    ...EMPTY_DATASET_FILTERS,
    query: initialQuery,
  })

  useEffect(() => {
    setFilters((current) => ({ ...current, query: initialQuery }))
  }, [initialQuery])

  const selection = useMemo(() => selectDatasetRegistry(families, filters), [families, filters])
  const activeFacetCount =
    filters.categories.length +
    filters.artifacts.length +
    filters.access.length +
    filters.provenance.length
  const attributedCompanies = companyCoverage.filter((entry) => entry.status === "attributed")
  const noHitCompanies = companyCoverage.filter(
    (entry) => entry.status === "no_attributable_public_dataset",
  )
  const summary = resultSummary(selection.familyCount, selection.surfaceCount)
  const reset = () => {
    setFilters({ ...EMPTY_DATASET_FILTERS })
    onQueryChange?.("")
  }

  return (
    <section aria-labelledby="datasets-title" className="datasets-page feature-page">
      <header className="feature-intro">
        <p className="kicker">Datasets</p>
        <h2 className="display-type" id="datasets-title">
          The dataset registry
        </h2>
        <div className="deck">
          <p>
            Public task sets, environments, trajectories, samples, and commercial catalogs found
            across every tracked company and adjacent agent-benchmark ecosystem.
          </p>
        </div>
      </header>

      <section className="dataset-methodology">
        <p>
          Dataset discovery verified 12 July 2026. This rolling open-web inventory is separate from
          the atlas&apos;s 11 July canonical company-claim cutoff; access and availability can
          change, and private or unattributable data may not be visible publicly.
        </p>
        <details className="dataset-company-coverage">
          <summary>
            {companyCoverage.length.toLocaleString("en-US")} companies checked ·{" "}
            {attributedCompanies.length.toLocaleString("en-US")} with attributable public data ·{" "}
            {noHitCompanies.length.toLocaleString("en-US")} no-hit
          </summary>
          <div className="dataset-company-coverage__groups">
            <section aria-labelledby="dataset-attributed-companies">
              <h3 id="dataset-attributed-companies">Companies with attributable public data</h3>
              <p>{attributedCompanies.map((entry) => entry.name).join(" · ")}</p>
            </section>
            <section aria-labelledby="dataset-no-hit-companies">
              <h3 id="dataset-no-hit-companies">No attributable public dataset found</h3>
              <p>{noHitCompanies.map((entry) => entry.name).join(" · ")}</p>
            </section>
          </div>
        </details>
      </section>

      <section aria-label="Dataset filters" className="dataset-filter-panel">
        <div className="dataset-filter-panel__lead">
          <label className="search-field__label ui-label" htmlFor="dataset-search">
            Search datasets
          </label>
          <input
            autoComplete="off"
            id="dataset-search"
            onChange={(event) => {
              const query = event.currentTarget.value
              setFilters((current) => ({ ...current, query }))
              onQueryChange?.(query)
            }}
            placeholder="Name, publisher, description, tag, or surface"
            type="search"
            value={filters.query}
          />
          <button onClick={reset} type="button">
            Reset dataset filters
          </button>
          <p className="evidence-text">OR within a facet · AND across facets</p>
        </div>
        <details className="dataset-filter-panel__disclosure">
          <summary>
            <span>
              <strong aria-hidden="true">
                <span className="dataset-filter-panel__show-label">Show filters</span>
                <span className="dataset-filter-panel__hide-label">Hide filters</span>
              </strong>
              <span className="visually-hidden">Toggle filters.</span> · Refine by category,
              artifact, access, or provenance
            </span>
            <span className="tabular-figure">{activeFacetCount} selected</span>
          </summary>
          <div className="dataset-filter-panel__facets">
            <FacetGroup
              label="Category"
              labels={DATASET_CATEGORY_LABELS}
              onToggle={(value) =>
                setFilters((current) => ({
                  ...current,
                  categories: toggle(current.categories, value),
                }))
              }
              options={selection.filterOptions.categories}
              selected={filters.categories}
            />
            <FacetGroup
              label="Artifact"
              labels={DATASET_ARTIFACT_LABELS}
              onToggle={(value) =>
                setFilters((current) => ({
                  ...current,
                  artifacts: toggle(current.artifacts, value),
                }))
              }
              options={selection.filterOptions.artifacts}
              selected={filters.artifacts}
            />
            <FacetGroup
              label="Access"
              labels={DATASET_ACCESS_LABELS}
              onToggle={(value) =>
                setFilters((current) => ({
                  ...current,
                  access: toggle(current.access, value),
                }))
              }
              options={selection.filterOptions.access}
              selected={filters.access}
            />
            <FacetGroup
              label="Provenance"
              labels={DATASET_PROVENANCE_LABELS}
              onToggle={(value) =>
                setFilters((current) => ({
                  ...current,
                  provenance: toggle(current.provenance, value),
                }))
              }
              options={selection.filterOptions.provenance}
              selected={filters.provenance}
            />
          </div>
        </details>
      </section>

      <section aria-labelledby="dataset-results-title" className="dataset-results">
        <p aria-atomic="true" aria-live="polite" className="visually-hidden" role="status">
          {selection.familyCount === 0 ? `${summary}. No datasets match.` : summary}
        </p>
        <header className="section-heading-row">
          <div>
            <p className="kicker">Registry index</p>
            <h3 className="dataset-results__count" id="dataset-results-title">
              {summary}
            </h3>
          </div>
          <div>
            <p>
              Each family is listed once; related repositories, viewers, downloads, and leaderboards
              remain separate source links.
            </p>
            <p className="evidence-text">Source links open in a new tab.</p>
          </div>
        </header>
        {selection.familyCount === 0 ? (
          <div className="dataset-empty-state">
            <h4>No datasets match</h4>
            <p>Try a broader search, remove a facet, or reset the registry.</p>
          </div>
        ) : (
          <div className="dataset-category-index">
            {selection.groups.map((group) => (
              <section
                aria-labelledby={`dataset-category-${group.category}`}
                className="dataset-category-group"
                key={group.category}
              >
                <header>
                  <p className="dataset-category-group__kicker kicker">Category</p>
                  <h3 id={`dataset-category-${group.category}`}>
                    {DATASET_CATEGORY_LABELS[group.category]}
                  </h3>
                  <p className="evidence-text">
                    {group.families.length} {group.families.length === 1 ? "family" : "families"}
                  </p>
                </header>
                <div className="dataset-family-list">
                  {group.families.map((family) => (
                    <DatasetFamilyRecord family={family} key={family.familyId} />
                  ))}
                </div>
              </section>
            ))}
          </div>
        )}
      </section>
    </section>
  )
}
