import {
  AccessSchema,
  BusinessModelIdSchema,
  ClaimKindSchema,
  ConfidenceSchema,
  ControlSchema,
  IndependenceBandSchema,
  RiskSchema,
  SegmentIdSchema,
  SourceTypeSchema,
  SupportSummarySchema,
  TemporalSchema,
  ThemeSchema,
} from "./enums"
import {
  type HashQueryKey,
  HashQueryKeySchema,
  type HashReferenceIndex,
  HashSectionSchema,
  type HashState,
  type HashWarning,
  normalizeSearch,
  type ParseHashResult,
} from "./hash-types"
import { BuyerEvidenceIdSchema, ClaimIdSchema, CompanyIdSchema, SourceIdSchema } from "./ids"

type DecodeResult =
  | { readonly kind: "decoded"; readonly value: string }
  | { readonly kind: "malformed" }
type SafeParser<T> = {
  readonly safeParse: (
    value: unknown,
  ) => { readonly success: true; readonly data: T } | { readonly success: false }
}
type ValueContext = {
  readonly raw: string | null
  readonly key: HashQueryKey
  readonly warnings: HashWarning[]
}

const UTF8_DECODER = new TextDecoder("utf-8", { ignoreBOM: true })
const UTF8_ENCODER = new TextEncoder()

const decodePercentBytes = (bytes: readonly number[]): DecodeResult => {
  const value = UTF8_DECODER.decode(Uint8Array.from(bytes))
  const encoded = UTF8_ENCODER.encode(value)
  if (encoded.length !== bytes.length || encoded.some((byte, index) => byte !== bytes[index])) {
    return { kind: "malformed" }
  }
  return { kind: "decoded", value }
}

export const decodeWireValue = (raw: string): DecodeResult => {
  const parts: string[] = []
  let index = 0
  while (index < raw.length) {
    const character = raw[index]
    if (character === undefined) return { kind: "malformed" }
    if (character !== "%") {
      parts.push(character)
      index += 1
      continue
    }
    const bytes: number[] = []
    while (raw[index] === "%") {
      const encodedByte = raw.slice(index, index + 3)
      if (!/^%[0-9a-f]{2}$/iu.test(encodedByte)) return { kind: "malformed" }
      bytes.push(Number.parseInt(encodedByte.slice(1), 16))
      index += 3
    }
    const decoded = decodePercentBytes(bytes)
    if (decoded.kind === "malformed") return decoded
    parts.push(decoded.value)
  }
  return { kind: "decoded", value: parts.join("") }
}

const encodeWireValue = (value: string): string =>
  encodeURIComponent(value).replace(
    /[!'()*]/gu,
    (character) => `%${character.charCodeAt(0).toString(16).toUpperCase()}`,
  )

const parseValues = <T extends string>(
  context: ValueContext,
  schema: SafeParser<T>,
  allowed: ReadonlySet<string> | null,
): readonly T[] => {
  if (context.raw === null) return []
  const found = new Map<string, T>()
  for (const rawValue of context.raw.split(",")) {
    const decoded = decodeWireValue(rawValue)
    if (decoded.kind === "malformed") {
      context.warnings.push({ code: "malformed_encoding", key: context.key })
      continue
    }
    const parsed = schema.safeParse(decoded.value)
    if (!parsed.success || (allowed !== null && !allowed.has(decoded.value))) {
      context.warnings.push({ code: "invalid_value", key: context.key })
      continue
    }
    found.set(parsed.data, parsed.data)
  }
  return [...found.values()].sort((left, right) => left.localeCompare(right))
}

const parseSingle = <T extends string>(
  context: ValueContext,
  schema: SafeParser<T>,
  allowed: ReadonlySet<string>,
): T | null => {
  if (context.raw === null) return null
  const decoded = decodeWireValue(context.raw)
  if (decoded.kind === "malformed") {
    context.warnings.push({ code: "malformed_encoding", key: context.key })
    return null
  }
  const parsed = schema.safeParse(decoded.value)
  if (!parsed.success || !allowed.has(decoded.value)) {
    context.warnings.push({ code: "invalid_value", key: context.key })
    return null
  }
  return parsed.data
}

const canonicalValues = <T extends string>(values: readonly T[]): readonly T[] => {
  const unique = new Map<string, T>()
  for (const value of values) unique.set(value, value)
  return [...unique.values()].sort((left, right) => left.localeCompare(right))
}

export const parseHash = (rawHash: string, references: HashReferenceIndex): ParseHashResult => {
  const warnings: HashWarning[] = []
  const fragment = rawHash.startsWith("#") ? rawHash.slice(1) : rawHash
  const queryIndex = fragment.indexOf("?")
  const path = queryIndex < 0 ? fragment : fragment.slice(0, queryIndex)
  const rawQuery = queryIndex < 0 ? "" : fragment.slice(queryIndex + 1)
  const sectionResult = path.startsWith("/")
    ? HashSectionSchema.safeParse(path.slice(1))
    : { success: false as const }
  const section = sectionResult.success ? sectionResult.data : "guide"
  if (!sectionResult.success && path !== "") {
    warnings.push({ code: "invalid_section", key: null })
  }

  const valuesByKey = new Map<HashQueryKey, string[]>()
  const repeated = new Set<HashQueryKey>()
  for (const pair of rawQuery.split("&")) {
    if (pair === "") continue
    const equalsIndex = pair.indexOf("=")
    const rawKey = equalsIndex < 0 ? pair : pair.slice(0, equalsIndex)
    const rawValue = equalsIndex < 0 ? "" : pair.slice(equalsIndex + 1)
    const decodedKey = decodeWireValue(rawKey)
    if (decodedKey.kind === "malformed") {
      warnings.push({ code: "malformed_encoding", key: null })
      continue
    }
    const keyResult = HashQueryKeySchema.safeParse(decodedKey.value)
    if (!keyResult.success) {
      warnings.push({ code: "unknown_key", key: decodedKey.value })
      continue
    }
    const previous = valuesByKey.get(keyResult.data)
    valuesByKey.set(keyResult.data, previous === undefined ? [rawValue] : [...previous, rawValue])
    if (previous !== undefined && !repeated.has(keyResult.data)) {
      repeated.add(keyResult.data)
      warnings.push({ code: "repeated_key", key: keyResult.data })
    }
  }
  const context = (key: HashQueryKey): ValueContext => ({
    raw: repeated.has(key) ? null : (valuesByKey.get(key)?.join("") ?? null),
    key,
    warnings,
  })
  const rawQ = context("q").raw
  const qDecoded = rawQ === null ? null : decodeWireValue(rawQ)
  const q = qDecoded?.kind === "decoded" ? normalizeSearch(qDecoded.value) : normalizeSearch("")
  if (qDecoded?.kind === "malformed") warnings.push({ code: "malformed_encoding", key: "q" })

  const companyValues = parseValues(
    context("company"),
    CompanyIdSchema,
    new Set<string>(references.companyIds),
  )
  const company = companyValues.slice(0, 3)
  if (companyValues.length > 3) warnings.push({ code: "company_limit", key: "company" })
  parseSingle(context("source"), SourceIdSchema, new Set<string>(references.sourceIds))
  if (valuesByKey.has("source")) {
    warnings.push({ code: "source_outside_sources", key: "source" })
  }
  const claim = parseSingle(context("claim"), ClaimIdSchema, new Set<string>(references.claimIds))

  return {
    state: {
      section,
      q,
      company,
      segment: parseValues(context("segment"), SegmentIdSchema, null),
      buyer: parseValues(
        context("buyer"),
        BuyerEvidenceIdSchema,
        new Set<string>(references.buyerEvidenceIds),
      ),
      model: parseValues(context("model"), BusinessModelIdSchema, null),
      theme: parseValues(context("theme"), ThemeSchema, null),
      kind: parseValues(context("kind"), ClaimKindSchema, null),
      sourceType: parseValues(context("source-type"), SourceTypeSchema, null),
      control: parseValues(context("control"), ControlSchema, null),
      independence: parseValues(context("independence"), IndependenceBandSchema, null),
      support: parseValues(context("support"), SupportSummarySchema, null),
      confidence: parseValues(context("confidence"), ConfidenceSchema, null),
      temporal: parseValues(context("temporal"), TemporalSchema, null),
      risk: parseValues(context("risk"), RiskSchema, null),
      access: parseValues(context("access"), AccessSchema, null),
      claim,
      source: null,
    },
    warnings,
  }
}

export const serializeHash = (state: HashState): string => {
  const query: string[] = []
  const pushValues = (key: HashQueryKey, values: readonly string[]) => {
    const encoded = canonicalValues(values).map(encodeWireValue)
    if (encoded.length > 0) query.push(`${key}=${encoded.join(",")}`)
  }
  const q = normalizeSearch(state.q)
  if (q !== "") query.push(`q=${encodeWireValue(q)}`)
  pushValues("company", canonicalValues(state.company).slice(0, 3))
  pushValues("segment", state.segment)
  pushValues("buyer", state.buyer)
  pushValues("model", state.model)
  pushValues("theme", state.theme)
  pushValues("kind", state.kind)
  pushValues("source-type", state.sourceType)
  pushValues("control", state.control)
  pushValues("independence", state.independence)
  pushValues("support", state.support)
  pushValues("confidence", state.confidence)
  pushValues("temporal", state.temporal)
  pushValues("risk", state.risk)
  pushValues("access", state.access)
  if (state.claim !== null) query.push(`claim=${encodeWireValue(state.claim)}`)
  return `#/${state.section}${query.length === 0 ? "" : `?${query.join("&")}`}`
}
