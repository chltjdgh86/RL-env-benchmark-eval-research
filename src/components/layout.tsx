import type { ReactNode } from "react"

type ComparisonValue = {
  readonly entity: string
  readonly evidence: ReactNode
  readonly value: ReactNode
}

type ComparisonRowProps = {
  readonly label: string
  readonly values: readonly ComparisonValue[]
  readonly warning?: string
}

export function ComparisonRow({ label, values, warning }: ComparisonRowProps) {
  return (
    <section aria-label={`${label} comparison`} className="comparison-row">
      <h3>{label}</h3>
      <dl className="comparison-row__values">
        {values.map((item) => (
          <div className="comparison-row__value" key={item.entity}>
            <dt>{item.entity}</dt>
            <dd>{item.value}</dd>
            <dd className="evidence-text">{item.evidence}</dd>
          </div>
        ))}
      </dl>
      {warning === undefined ? null : <p className="evidence-text">{warning}</p>}
    </section>
  )
}

type ContextRailProps = {
  readonly children: ReactNode
  readonly title: string
  readonly variant?: "complementary" | "inline"
}

export function ContextRail({ children, title, variant = "complementary" }: ContextRailProps) {
  if (variant === "inline") {
    return (
      <section aria-label={title} className="context-rail context-rail--inline">
        <h2>{title}</h2>
        {children}
      </section>
    )
  }

  return (
    <aside aria-label={title} className="context-rail">
      <h2>{title}</h2>
      {children}
    </aside>
  )
}

type DossierHeaderProps = {
  readonly children?: ReactNode
  readonly cutoff: string
  readonly identity: string
  readonly name: string
  readonly status: string
  readonly thesis: string
}

export function DossierHeader({
  children,
  cutoff,
  identity,
  name,
  status,
  thesis,
}: DossierHeaderProps) {
  return (
    <header className="dossier-header">
      <p className="kicker">{identity}</p>
      <h2>{name}</h2>
      <p className="deck">{thesis}</p>
      <p className="ui-label">{status}</p>
      <p className="evidence-text">{cutoff}</p>
      {children}
    </header>
  )
}

type FilterControlProps = {
  readonly children: ReactNode
  readonly legend: string
}

export function FilterControl({ children, legend }: FilterControlProps) {
  return (
    <fieldset className="filter-control">
      <legend>{legend}</legend>
      {children}
    </fieldset>
  )
}

type MarketMapProps = {
  readonly fallback: ReactNode
  readonly summary: string
  readonly title: string
  readonly visual: ReactNode
}

export function MarketMap({ fallback, summary, title, visual }: MarketMapProps) {
  return (
    <figure aria-label={title} className="market-map">
      <figcaption>
        <h3>{title}</h3>
        <p>{summary}</p>
      </figcaption>
      <div className="market-map__visual">{visual}</div>
      <div className="market-map__fallback">{fallback}</div>
    </figure>
  )
}

type SectionRailItem = {
  readonly current?: boolean
  readonly href: string
  readonly label: string
}

type SectionRailProps = {
  readonly filterSummary: string
  readonly items: readonly SectionRailItem[]
  readonly legend: string
  readonly number: string
  readonly title: string
}

export function SectionRail({ filterSummary, items, legend, number, title }: SectionRailProps) {
  return (
    <nav aria-label={title} className="section-rail">
      <p className="kicker">{number}</p>
      <h2>{title}</h2>
      <ol>
        {items.map((item) => (
          <li key={item.href}>
            <a aria-current={item.current === true ? "page" : undefined} href={item.href}>
              {item.label}
            </a>
          </li>
        ))}
      </ol>
      <p className="evidence-text">{legend}</p>
      <p className="ui-label">{filterSummary}</p>
    </nav>
  )
}

type TimelineItemProps = {
  readonly children: ReactNode
  readonly date: string
  readonly evidence: ReactNode
  readonly title: string
}

export function TimelineItem({ children, date, evidence, title }: TimelineItemProps) {
  return (
    <li className="timeline-item">
      <time dateTime={date}>{date}</time>
      <h3>{title}</h3>
      <p>{children}</p>
      <div className="evidence-text">{evidence}</div>
    </li>
  )
}
