import { type CitationResolution, type EvidenceIndex, resolveCitation } from "../domain/citations"
import type { Claim } from "../domain/evidence-schema"
import type { SourceId } from "../domain/ids"
import { SourceLink } from "./SourceLink"

function CitationItem({ resolution }: { readonly resolution: CitationResolution }) {
  switch (resolution.kind) {
    case "resolved":
      return resolution.receipts.map((receipt) => (
        <li key={`${receipt.link.observationId}-${receipt.link.sourceId}`}>
          <SourceLink receipt={receipt} />
        </li>
      ))
    case "invalid":
      return (
        <li className="error-notice">
          Missing citation · {resolution.issues.map((issue) => issue.code).join(", ")}
        </li>
      )
    default:
      return resolution satisfies never
  }
}

type ClaimTextProps = {
  readonly claim: Claim
  readonly index: EvidenceIndex
}

export function ClaimText({ claim, index }: ClaimTextProps) {
  const sourceIds = [...new Set(claim.evidenceLinks.map((link) => link.sourceId))]

  return (
    <article className="claim-text" data-claim-id={claim.claimId} id={`claim-${claim.claimId}`}>
      <p>{claim.statement}</p>
      <ul>
        {sourceIds.map((sourceId: SourceId) => (
          <CitationItem
            key={sourceId}
            resolution={resolveCitation(index, claim.claimId, sourceId)}
          />
        ))}
      </ul>
    </article>
  )
}
