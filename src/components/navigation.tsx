import type { ReactNode } from "react"

type SkipLinkProps = {
  readonly children?: ReactNode
  readonly targetId?: string
}

export function SkipLink({
  children = "Skip to main content",
  targetId = "main-content",
}: SkipLinkProps) {
  return (
    <a className="skip-link" href={`#${targetId}`}>
      {children}
    </a>
  )
}

type SectionRibbonProps = {
  readonly action?: ReactNode
  readonly headingLevel?: 2 | 3
  readonly number: string
  readonly title: string
  readonly variant?: "primary" | "outline"
}

export function SectionRibbon({
  action,
  headingLevel = 2,
  number,
  title,
  variant = "primary",
}: SectionRibbonProps) {
  const Heading = headingLevel === 2 ? "h2" : "h3"
  const className =
    variant === "outline" ? "section-ribbon section-ribbon--outline" : "section-ribbon"

  return (
    <div className={className}>
      <Heading>
        <span aria-hidden="true" className="kicker">
          {number}
        </span>{" "}
        <span>{title}</span>
      </Heading>
      {action}
    </div>
  )
}

export type UtilityNavItem = {
  readonly current?: boolean
  readonly disabled?: boolean
  readonly href: string
  readonly label: string
}

type UtilityNavProps = {
  readonly ariaLabel: string
  readonly items: readonly UtilityNavItem[]
}

export function UtilityNav({ ariaLabel, items }: UtilityNavProps) {
  return (
    <nav aria-label={ariaLabel} className="utility-nav">
      <ul className="utility-nav__list">
        {items.map((item) => (
          <li key={item.href}>
            {item.disabled === true ? (
              <span aria-disabled="true" className="ui-label">
                {item.label}
              </span>
            ) : (
              <a aria-current={item.current === true ? "page" : undefined} href={item.href}>
                {item.label}
              </a>
            )}
          </li>
        ))}
      </ul>
    </nav>
  )
}

type MastheadProps = {
  readonly corpusStatus?: string
  readonly edition: string
  readonly headingLevel?: 1 | 2
  readonly strapline: string
  readonly title: string
}

export function Masthead({
  corpusStatus,
  edition,
  headingLevel = 1,
  strapline,
  title,
}: MastheadProps) {
  const Heading = headingLevel === 1 ? "h1" : "h2"
  return (
    <header className="dossier-header">
      <p className="kicker">{edition}</p>
      <Heading className="atlas-type">{title}</Heading>
      <p className="deck">{strapline}</p>
      {corpusStatus === undefined ? null : (
        <p aria-live="polite" className="evidence-text" role="status">
          {corpusStatus}
        </p>
      )}
    </header>
  )
}
