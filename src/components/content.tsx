import type { ReactNode } from "react"

type DataTableProps = {
  readonly caption: string
  readonly children: ReactNode
  readonly scrollInstruction?: string
}

export function DataTable({ caption, children, scrollInstruction }: DataTableProps) {
  return (
    <section
      aria-label={`${caption} table`}
      className="table-scroll-region"
      // biome-ignore lint/a11y/noNoninteractiveTabindex: Wide comparison tables require keyboard scrolling.
      tabIndex={0}
    >
      {scrollInstruction === undefined ? null : (
        <p className="evidence-text">{scrollInstruction}</p>
      )}
      <table className="data-table">
        <caption>{caption}</caption>
        {children}
      </table>
    </section>
  )
}

type MetricProps = {
  readonly evidence: ReactNode
  readonly label: string
  readonly qualifier: string
  readonly value: ReactNode
}

export function Metric({ evidence, label, qualifier, value }: MetricProps) {
  return (
    <figure aria-label={label} className="metric">
      <span className="ui-label">{label}</span>
      <span className="metric__value">{value}</span>
      <span className="body-small">{qualifier}</span>
      <span className="evidence-text">{evidence}</span>
    </figure>
  )
}

type NoticeProps = {
  readonly action?: ReactNode
  readonly children: ReactNode
  readonly title: string
}

export function EmptyState({ action, children, title }: NoticeProps) {
  return (
    <section className="empty-state">
      <h2>{title}</h2>
      <p>{children}</p>
      {action}
    </section>
  )
}

export function ErrorNotice({ action, children, title }: NoticeProps) {
  return (
    <section className="error-notice" role="alert">
      <h2>{title}</h2>
      <p>{children}</p>
      {action}
    </section>
  )
}
