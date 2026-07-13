import { claimBacklink } from "../domain/citations"
import type { ResearchCorpus } from "./corpus-schema"
import { CorpusIntegrityError } from "./corpus-schema"

export function assertCanonicalClaimHashes(corpus: ResearchCorpus): void {
  for (const claim of corpus.claims) {
    const backlink = claimBacklink(claim)
    if (
      backlink.kind !== "valid" ||
      backlink.href !== claim.canonicalHash ||
      backlink.anchorId !== `claim-${claim.claimId}`
    ) {
      throw new CorpusIntegrityError(
        "NONCANONICAL_CLAIM_HASH",
        `claims.${claim.claimId}.canonicalHash`,
        claim.canonicalHash,
      )
    }
  }
}
