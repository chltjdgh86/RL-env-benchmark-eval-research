import { Fragment } from "react"
import type { ResearchIndex } from "../../data/research"
import type { ClaimId } from "../../domain/ids"

type CorpusClaimProps = {
  readonly claimId: ClaimId
  readonly index: ResearchIndex
}

export function CorpusClaim({ claimId, index }: CorpusClaimProps) {
  const claim = index.claimsById.get(claimId)
  if (claim === undefined) {
    return (
      <p className="error-notice" data-claim-id={claimId}>
        Missing claim · {claimId}
      </p>
    )
  }
  const relationships = index.relationshipsByClaimId.get(claimId) ?? []
  const sources = [
    ...new Map(relationships.map(({ source }) => [source.sourceId, source])).values(),
  ]

  return (
    <article className="corpus-claim" data-claim-id={claim.claimId} id={`claim-${claim.claimId}`}>
      <p>{claim.statement}</p>
      {sources.length === 0 ? null : (
        <p className="claim-sources">
          {sources.map((source, sourceIndex) => (
            <Fragment key={source.sourceId}>
              {sourceIndex === 0 ? null : " · "}
              <a href={source.canonicalUrl} rel="noreferrer" target="_blank">
                {source.title}
              </a>
            </Fragment>
          ))}
        </p>
      )}
    </article>
  )
}
