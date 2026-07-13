import type { SupplementalRecord } from "../../data/supplemental"
import { BUSINESS_MODEL_LABELS } from "../../domain/display-labels"
import type { Adjacent, Company } from "../../domain/entity-schema"
import { companyDescriptions } from "./company-descriptions"

export type CompanyCardRecord =
  | { readonly kind: "company"; readonly value: Company }
  | { readonly kind: "adjacent"; readonly value: Adjacent }
  | { readonly kind: "supplemental"; readonly value: SupplementalRecord }

type CompanyCardProps = {
  readonly record: CompanyCardRecord
}

function assertNever(value: never): never {
  throw new Error(`Unexpected company card kind: ${String(value)}`)
}

function recordId(record: CompanyCardRecord): string {
  switch (record.kind) {
    case "company":
      return record.value.companyId
    case "adjacent":
    case "supplemental":
      return record.value.adjacentId
    default:
      return assertNever(record)
  }
}

function descriptionFor(record: CompanyCardRecord): string | undefined {
  if (record.kind === "supplemental") {
    const excerpt = record.value.observationCandidates[0]?.excerpt
    return excerpt === undefined ? companyDescriptions[record.value.name] : `“${excerpt}”`
  }
  return companyDescriptions[record.value.name]
}

export function CompanyCard({ record }: CompanyCardProps) {
  const company = record.value
  const description = descriptionFor(record)

  return (
    <article className="landscape-record" id={`company-${recordId(record)}`}>
      <p className="kicker">{company.primarySegment.replaceAll("_", " ")}</p>
      <h4>{company.name}</h4>
      <p className="evidence-text">
        {company.businessModelIds.map((model) => BUSINESS_MODEL_LABELS[model]).join(" · ")}
      </p>
      <a href={company.canonicalDomain} rel="noreferrer" target="_blank">
        {new URL(company.canonicalDomain).hostname}
      </a>
      {description === undefined ? null : <p>{description}</p>}
    </article>
  )
}
