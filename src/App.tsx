import { AtlasShell } from "./app/AtlasShell"
import { researchIndex } from "./data/research"
import type { HashState } from "./domain/hash-state"
import type { ResearchFilters } from "./domain/selectors"
import { CompaniesPage } from "./features/companies"
import { FieldGuidePage } from "./features/field-guide"
import { ShowcasePage } from "./features/playbook-sources"

const assertNever = (value: never): never => {
  throw new Error(`Unexpected hash section: ${value}`)
}

function filtersFromState(state: HashState): ResearchFilters {
  return {
    q: state.q,
    company: state.company,
    segment: state.segment,
    buyer: state.buyer,
    model: state.model,
    theme: state.theme,
    kind: state.kind,
    sourceType: state.sourceType,
    control: state.control,
    independence: state.independence,
    support: state.support,
    confidence: state.confidence,
    temporal: state.temporal,
    risk: state.risk,
    access: state.access,
  }
}

function renderSection(state: HashState) {
  const filters = filtersFromState(state)
  switch (state.section) {
    case "guide":
      return <FieldGuidePage />
    case "companies":
      return <CompaniesPage filters={filters} />
    case "showcase":
      return <ShowcasePage />
    default:
      return assertNever(state.section)
  }
}

export function App() {
  return <AtlasShell index={researchIndex} renderSection={renderSection} />
}
