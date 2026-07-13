import type { ReactNode } from "react"

type SectionIntroProps = {
  readonly children: ReactNode
  readonly eyebrow: string
  readonly title: string
  readonly titleId?: string
}

export function SectionIntro({ children, eyebrow, title, titleId }: SectionIntroProps) {
  return (
    <header className="feature-intro">
      <p className="kicker">{eyebrow}</p>
      <h2 className="display-type" id={titleId}>
        {title}
      </h2>
      <div className="deck">{children}</div>
    </header>
  )
}
