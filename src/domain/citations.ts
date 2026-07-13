import type { Claim, EvidenceLink, Observation, Source } from "./evidence-schema"
import { decodeWireValue } from "./hash-codec"
import { HASH_QUERY_KEYS, HashQueryKeySchema } from "./hash-state"
import type { ClaimId, ObservationId, SourceId } from "./ids"

const CANONICAL_SECTIONS = new Set([
  "overview",
  "market-map",
  "industries",
  "companies",
  "gtm",
  "economics",
  "playbook",
  "sources",
  "methodology",
  "showcase",
])
const INVALID_PERCENT_ESCAPE = /%(?![0-9a-f]{2})/iu

export type EvidenceIndex = {
  readonly claimsById: ReadonlyMap<ClaimId, Claim>
  readonly sourcesById: ReadonlyMap<SourceId, Source>
  readonly observationsById: ReadonlyMap<ObservationId, Observation>
}

export type CitationReceipt = {
  readonly claim: Claim
  readonly observation: Observation
  readonly source: Source
  readonly link: EvidenceLink
}

export const citationTupleKey = (claimId: ClaimId, link: EvidenceLink): string =>
  [claimId, link.observationId, link.sourceId, link.supportRelation].join("|")

export const CITATION_ISSUE_CODES = [
  "UNKNOWN_CLAIM",
  "UNKNOWN_SOURCE",
  "UNLINKED_CLAIM_SOURCE",
  "UNKNOWN_OBSERVATION",
  "OBSERVATION_SOURCE_MISMATCH",
  "DUPLICATE_EVIDENCE_TUPLE",
] as const
export type CitationIssueCode = (typeof CITATION_ISSUE_CODES)[number]
export type CitationIssue = {
  readonly code: CitationIssueCode
  readonly detail: string
}
export type CitationResolution =
  | { readonly kind: "resolved"; readonly receipts: readonly CitationReceipt[] }
  | { readonly kind: "invalid"; readonly issues: readonly CitationIssue[] }

export type ClaimBacklink =
  | { readonly kind: "valid"; readonly href: string; readonly anchorId: string }
  | { readonly kind: "invalid"; readonly detail: string }

export const resolveCitation = (
  index: EvidenceIndex,
  claimId: ClaimId,
  sourceId: SourceId,
): CitationResolution => {
  const claim = index.claimsById.get(claimId)
  const source = index.sourcesById.get(sourceId)
  const issues: CitationIssue[] = []
  if (claim === undefined) {
    issues.push({ code: "UNKNOWN_CLAIM", detail: `Unknown claim ${claimId}` })
  }
  if (source === undefined) {
    issues.push({ code: "UNKNOWN_SOURCE", detail: `Unknown source ${sourceId}` })
  }
  if (claim === undefined || source === undefined) return { kind: "invalid", issues }

  const links = claim.evidenceLinks.filter((link) => link.sourceId === sourceId)
  if (links.length === 0) {
    return {
      kind: "invalid",
      issues: [
        {
          code: "UNLINKED_CLAIM_SOURCE",
          detail: `${sourceId} is not linked to ${claimId}`,
        },
      ],
    }
  }

  const receipts: CitationReceipt[] = []
  const seen = new Set<string>()
  for (const link of links) {
    const observation = index.observationsById.get(link.observationId)
    if (observation === undefined) {
      issues.push({
        code: "UNKNOWN_OBSERVATION",
        detail: `Unknown observation ${link.observationId}`,
      })
      continue
    }
    if (observation.sourceId !== link.sourceId) {
      issues.push({
        code: "OBSERVATION_SOURCE_MISMATCH",
        detail: `${observation.observationId} belongs to ${observation.sourceId}, not ${link.sourceId}`,
      })
      continue
    }
    const tupleKey = citationTupleKey(claimId, link)
    if (seen.has(tupleKey)) {
      issues.push({
        code: "DUPLICATE_EVIDENCE_TUPLE",
        detail: tupleKey,
      })
      continue
    }
    seen.add(tupleKey)
    receipts.push({ claim, observation, source, link })
  }
  return issues.length === 0 ? { kind: "resolved", receipts } : { kind: "invalid", issues }
}

const invalidBacklink = (detail: string): ClaimBacklink => ({ kind: "invalid", detail })

const encodeWireValue = (value: string): string =>
  encodeURIComponent(value).replace(
    /[!'()*]/gu,
    (character) => `%${character.charCodeAt(0).toString(16).toUpperCase()}`,
  )

const canonicalValue = (key: string, rawValue: string): boolean => {
  const decodedValues: string[] = []
  for (const value of rawValue.split(",")) {
    const decoded = decodeWireValue(value)
    if (decoded.kind === "malformed") return false
    decodedValues.push(decoded.value)
  }
  if (key === "q") return encodeWireValue(decodedValues[0] ?? "") === rawValue
  const canonical = [...new Set(decodedValues)].sort().map(encodeWireValue).join(",")
  return canonical === rawValue
}

const canonicalQuery = (query: string): boolean => {
  const seen = new Set<string>()
  let previousIndex = -1
  for (const part of query.split("&")) {
    const separator = part.indexOf("=")
    if (separator <= 0) return false
    const decodedKey = decodeWireValue(part.slice(0, separator))
    if (decodedKey.kind === "malformed") return false
    const key = decodedKey.value
    const value = part.slice(separator + 1)
    const parsedKey = HashQueryKeySchema.safeParse(key)
    if (!parsedKey.success) return false
    const keyIndex = HASH_QUERY_KEYS.indexOf(parsedKey.data)
    if (
      keyIndex < 0 ||
      keyIndex <= previousIndex ||
      seen.has(key) ||
      value.length === 0 ||
      !canonicalValue(key, value)
    ) {
      return false
    }
    seen.add(key)
    previousIndex = keyIndex
  }
  return true
}

export const claimBacklink = (claim: Claim): ClaimBacklink => {
  const href = claim.canonicalHash
  if (!href.startsWith("#/") || INVALID_PERCENT_ESCAPE.test(href)) {
    return invalidBacklink("Canonical hash is malformed")
  }
  const queryIndex = href.indexOf("?")
  if (queryIndex < 3) return invalidBacklink("Canonical hash has no claim query")
  const section = href.slice(2, queryIndex)
  if (!CANONICAL_SECTIONS.has(section)) return invalidBacklink(`Unknown section ${section}`)
  const query = href.slice(queryIndex + 1)
  if (!canonicalQuery(query)) {
    return invalidBacklink("Canonical query is not serializer-produced")
  }
  const params = new URLSearchParams(query)
  const claimValues = params.getAll("claim")
  if (claimValues.length !== 1 || claimValues[0] !== claim.claimId) {
    return invalidBacklink(`Canonical hash does not select ${claim.claimId}`)
  }
  if (params.has("source")) return invalidBacklink("Canonical claim hash cannot select a source")
  return { kind: "valid", href, anchorId: `claim-${claim.claimId}` }
}
