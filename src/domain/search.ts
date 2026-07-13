import { normalizeSearch } from "./hash-types"

export type NormalizedSearchQuery = {
  readonly text: string
  readonly tokens: readonly string[]
}

export function normalizeSearchTerms(raw: string): NormalizedSearchQuery {
  const text = normalizeSearch(raw).toLowerCase()
  return { text, tokens: text.length === 0 ? [] : text.split(" ") }
}

export function matchesSearch(document: string, query: NormalizedSearchQuery): boolean {
  const haystack = document.normalize("NFC").trim().replace(/\s+/gu, " ").toLowerCase()
  return query.tokens.every((token) => haystack.includes(token))
}
