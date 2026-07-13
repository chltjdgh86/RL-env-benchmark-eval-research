import type { ReactNode } from "react"
import type { ResearchIndex } from "../data/research"
import { BUSINESS_MODEL_LABELS, BUSINESS_MODELS, SEGMENTS, type SegmentId } from "../domain/enums"
import { type HashState, serializeHash } from "../domain/hash-state"

const segmentLabels: Readonly<Record<SegmentId, string>> = {
  training_data_workforce: "TRAINING DATA + WORKFORCE",
  expert_talent_network: "EXPERT TALENT NETWORK",
  environment_computer_use_runtime: "ENVIRONMENT + COMPUTER USE",
  eval_observability_assurance: "EVAL + ASSURANCE",
  post_training_rl_infrastructure: "POST-TRAINING INFRASTRUCTURE",
  agent_ax_services: "AGENT / AX SERVICES",
  incumbent_bpo_consulting: "INCUMBENT BPO + CONSULTING",
}

function toggle<T extends string>(selected: readonly T[], value: T): readonly T[] {
  return selected.includes(value) ? selected.filter((item) => item !== value) : [...selected, value]
}

type FacetProps<T extends string> = {
  readonly hrefFor: (value: T) => string
  readonly label: string
  readonly labelFor: (value: T) => ReactNode
  readonly selected: readonly T[]
  readonly values: readonly T[]
}

function Facet<T extends string>({ hrefFor, label, labelFor, selected, values }: FacetProps<T>) {
  return (
    <fieldset className="filter-link-group">
      <legend>{label}</legend>
      <div>
        {values.map((value) => {
          const active = selected.includes(value)
          return (
            <a
              aria-current={active ? "true" : undefined}
              data-active={active}
              href={hrefFor(value)}
              key={value}
            >
              {labelFor(value)}
            </a>
          )
        })}
      </div>
    </fieldset>
  )
}

type GlobalFiltersProps = {
  readonly index: ResearchIndex
  readonly state: HashState
}

export function GlobalFilters({ index, state }: GlobalFiltersProps) {
  const clearState: HashState = {
    ...state,
    company: [],
    segment: [],
    buyer: [],
    model: [],
    theme: [],
    kind: [],
    sourceType: [],
    control: [],
    independence: [],
    support: [],
    confidence: [],
    temporal: [],
    risk: [],
    access: [],
  }
  return (
    <details className="global-filters">
      <summary>Filter by segment, business model, or company</summary>
      <div className="global-filters__actions">
        <a className="button button--quiet" href={serializeHash(clearState)}>
          Clear all facets
        </a>
        <span className="evidence-text">OR within a facet · AND across facets</span>
      </div>
      <div className="global-filters__grid">
        <Facet
          hrefFor={(value) => serializeHash({ ...state, segment: toggle(state.segment, value) })}
          label="Segment"
          labelFor={(value) => segmentLabels[value]}
          selected={state.segment}
          values={SEGMENTS}
        />
        <Facet
          hrefFor={(value) => serializeHash({ ...state, model: toggle(state.model, value) })}
          label="Business model"
          labelFor={(value) => BUSINESS_MODEL_LABELS[value]}
          selected={state.model}
          values={BUSINESS_MODELS}
        />
        <Facet
          hrefFor={(value) => serializeHash({ ...state, company: toggle(state.company, value) })}
          label="Company"
          labelFor={(value) => index.companiesById.get(value)?.name ?? value}
          selected={state.company}
          values={index.corpus.companies.map((company) => company.companyId)}
        />
      </div>
    </details>
  )
}
