import type { CitationReceipt } from "../domain/citations"

type SourceLinkProps = {
  readonly receipt: CitationReceipt
}

export function SourceLink({ receipt }: SourceLinkProps) {
  const { source } = receipt

  return (
    <a href={source.canonicalUrl} rel="noreferrer" target="_blank">
      {source.title} <span>(opens in new tab)</span>
    </a>
  )
}
