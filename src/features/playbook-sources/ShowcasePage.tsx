import { ClaimText, PrimitiveShowcase } from "../../components"
import { researchIndex } from "../../data/research"

export function ShowcasePage() {
  const claim = researchIndex.corpus.claims[0]
  return (
    <PrimitiveShowcase
      evidenceSpecimen={
        claim === undefined ? (
          <p>No claim fixture.</p>
        ) : (
          <ClaimText claim={claim} index={researchIndex} />
        )
      }
      headingLevel={2}
    />
  )
}
