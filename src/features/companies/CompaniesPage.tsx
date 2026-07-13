import { researchIndex } from "../../data/research"
import { type SupplementalRecord, supplementalRecords } from "../../data/supplemental"
import { matchesSearch, normalizeSearchTerms } from "../../domain/search"
import type { ResearchFilters } from "../../domain/selectors"
import { selectAdjacent, selectCompanies } from "../../domain/selectors"
import { CorpusClaim } from "../shared/CorpusClaim"
import { SectionIntro } from "../shared/SectionIntro"
import { CompanyCard, type CompanyCardRecord } from "./CompanyCard"

function compareCompanyCards(left: CompanyCardRecord, right: CompanyCardRecord): number {
  const leftSegment = left.value.primarySegment
  const rightSegment = right.value.primarySegment
  const leftPriority = leftSegment === "environment_computer_use_runtime" ? 0 : 1
  const rightPriority = rightSegment === "environment_computer_use_runtime" ? 0 : 1
  return (
    leftPriority - rightPriority ||
    leftSegment.localeCompare(rightSegment) ||
    left.value.name.localeCompare(right.value.name)
  )
}

function companyCardKey(record: CompanyCardRecord): string {
  return record.kind === "company" ? record.value.companyId : record.value.adjacentId
}

function isActive<T>(values: readonly T[] | undefined): boolean {
  return values !== undefined && values.length > 0
}

function supplementalMatches(record: SupplementalRecord, filters: ResearchFilters): boolean {
  const selectedSegments = filters.segment ?? []
  const selectedModels = filters.model ?? []
  const query = normalizeSearchTerms(filters.q ?? "")
  const searchableText = [
    record.adjacentId,
    record.name,
    ...record.aliases,
    record.primarySegment,
    ...record.businessModelIds,
  ].join(" ")
  return (
    !isActive(filters.company) &&
    matchesSearch(searchableText, query) &&
    (selectedSegments.length === 0 || selectedSegments.includes(record.primarySegment)) &&
    (selectedModels.length === 0 ||
      record.businessModelIds.some((model) => selectedModels.includes(model)))
  )
}

export function CompaniesPage({ filters = {} }: { readonly filters?: ResearchFilters }) {
  const companies = selectCompanies(researchIndex, filters)
  const adjacent = selectAdjacent(researchIndex, filters)
  const supplemental = supplementalRecords.filter((record) => supplementalMatches(record, filters))
  const trackedTotal =
    researchIndex.corpus.companies.length +
    researchIndex.corpus.adjacent.length +
    supplementalRecords.length
  const landscape: CompanyCardRecord[] = [
    ...companies.map((record) => ({ kind: "company", value: record }) as const),
    ...adjacent.map((record) => ({ kind: "adjacent", value: record }) as const),
    ...supplemental.map((record) => ({ kind: "supplemental", value: record }) as const),
  ].sort(compareCompanyCards)
  return (
    <section aria-labelledby="companies-title" className="feature-page">
      <SectionIntro eyebrow="Companies" title="The company landscape" titleId="companies-title">
        <p>
          Every tracked company, one card each — sector, business models, site, and what it does.
          Companies operating RL environments and agent runtimes lead the list.
        </p>
      </SectionIntro>
      <section aria-labelledby="company-landscape-title">
        <header className="section-heading-row">
          <div>
            <p className="kicker">Company landscape</p>
            <h3 id="company-landscape-title">
              {landscape.length} of {trackedTotal} companies
            </h3>
          </div>
          <p>One card per company: sector, business models, site, and what it does.</p>
        </header>
        <div className="landscape-grid">
          {landscape.map((record) => (
            <CompanyCard key={companyCardKey(record)} record={record} />
          ))}
        </div>
      </section>
    </section>
  )
}

export function renderClaimScope() {
  return (
    <div data-claim-scope="companies">
      {researchIndex.corpus.companies.map((company) => (
        <CorpusClaim
          claimId={company.identityClaimId}
          index={researchIndex}
          key={company.companyId}
        />
      ))}
    </div>
  )
}
