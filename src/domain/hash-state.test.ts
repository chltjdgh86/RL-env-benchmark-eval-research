import { describe, expect, it } from "vitest"
import {
  decodeWireValue,
  HASH_QUERY_KEYS,
  HASH_SECTIONS,
  type HashReferenceIndex,
  normalizeSearch,
  parseHash,
  serializeHash,
} from "./hash-state"
import { BuyerEvidenceIdSchema, ClaimIdSchema, CompanyIdSchema, SourceIdSchema } from "./ids"

const companyAlpha = CompanyIdSchema.parse("co_alpha")
const companyBeta = CompanyIdSchema.parse("co_beta")
const companyGamma = CompanyIdSchema.parse("co_gamma")
const companyZulu = CompanyIdSchema.parse("co_zulu")
const buyerAlpha = BuyerEvidenceIdSchema.parse("buy_alpha")
const claimAlpha = ClaimIdSchema.parse("clm_alpha")
const claimBeta = ClaimIdSchema.parse("clm_beta")
const sourceAlpha = SourceIdSchema.parse("src_alpha")
const sourceBeta = SourceIdSchema.parse("src_beta")

const references = {
  companyIds: [companyAlpha, companyBeta, companyGamma, companyZulu],
  buyerEvidenceIds: [buyerAlpha],
  claimIds: [claimAlpha, claimBeta],
  sourceIds: [sourceAlpha, sourceBeta],
} satisfies HashReferenceIndex

describe("canonical hash grammar", () => {
  it("declares the exact sections and all 17 query keys in wire order", () => {
    // Given the public hash constants
    // When their values are read
    // Then they match the complete route contract
    expect(HASH_SECTIONS).toEqual(["guide", "companies", "datasets", "showcase"])
    expect(HASH_QUERY_KEYS).toEqual([
      "q",
      "company",
      "segment",
      "buyer",
      "model",
      "theme",
      "kind",
      "source-type",
      "control",
      "independence",
      "support",
      "confidence",
      "temporal",
      "risk",
      "access",
      "claim",
      "source",
    ])
  })

  it("normalizes search to NFC, collapsed whitespace, and 120 Unicode codepoints", () => {
    // Given decomposed text, mixed whitespace, and astral codepoints over the limit
    const raw = `  Cafe\u0301\n${"😀".repeat(121)}  `

    // When search is normalized
    const normalized = normalizeSearch(raw)

    // Then normalization is codepoint-safe and deterministic
    expect(normalized.startsWith("Café ")).toBe(true)
    expect(Array.from(normalized)).toHaveLength(120)
    expect(normalized.endsWith("😀")).toBe(true)
  })

  it("percent-encodes every non-unreserved query character", () => {
    // Given punctuation with special meaning in URLs
    const result = parseHash("#/companies?q=R%26D%20%2F%20(pilot)!", references)

    // When the state is serialized
    const serialized = serializeHash(result.state)

    // Then values use strict percent encoding rather than form or fragment syntax
    expect(serialized).toBe("#/companies?q=R%26D%20%2F%20%28pilot%29%21")
  })

  it("round-trips the dataset route with its initial search query", () => {
    const result = parseHash("#/datasets?q=browser%20tasks", references)

    expect(result.warnings).toEqual([])
    expect(result.state.section).toBe("datasets")
    expect(serializeHash(result.state)).toBe("#/datasets?q=browser%20tasks")
  })

  it("preserves a valid encoded UTF-8 BOM inside a query value", () => {
    const result = decodeWireValue("c%EF%BB%BFl")

    expect(result).toEqual({ kind: "decoded", value: "c\uFEFFl" })
  })

  it("does not decode a plus sign with form-encoding semantics", () => {
    const result = parseHash("#/companies?q=buyer+signal", references)

    expect(result.state.q).toBe("buyer+signal")
    expect(serializeHash(result.state)).toBe("#/companies?q=buyer%2Bsignal")
  })

  it.each([
    ["q", "hello%20world", "q=hello%20world"],
    ["company", "co_beta", "company=co_beta"],
    ["segment", "expert_talent_network", "segment=expert_talent_network"],
    ["buyer", "buy_alpha", "buyer=buy_alpha"],
    ["model", "runtime_infrastructure", "model=runtime_infrastructure"],
    ["theme", "economics", "theme=economics"],
    ["kind", "reported_claim", "kind=reported_claim"],
    ["source-type", "academic_primary", "source-type=academic_primary"],
    ["control", "independent", "control=independent"],
    ["independence", "two_plus_groups", "independence=two_plus_groups"],
    ["support", "partially_supported", "support=partially_supported"],
    ["confidence", "medium", "confidence=medium"],
    ["temporal", "historical", "temporal=historical"],
    ["risk", "high_risk", "risk=high_risk"],
    ["access", "secondary_only", "access=secondary_only"],
    ["claim", "clm_alpha", "claim=clm_alpha"],
  ])("round-trips the %s key independently", (key, value, query) => {
    // Given exactly one canonical query key
    const section = "companies"

    // When it crosses the parser and serializer
    const result = parseHash(`#/${section}?${key}=${value}`, references)

    // Then its canonical wire representation is preserved
    expect(result.warnings).toEqual([])
    expect(serializeHash(result.state)).toBe(`#/${section}?${query}`)
  })

  it("round-trips the full state byte-for-byte in fixed key order", () => {
    // Given every key in canonical order and a valid claim focus
    const hash =
      "#/companies?q=caf%C3%A9%20market&company=co_alpha,co_beta,co_gamma&segment=expert_talent_network,training_data_workforce&buyer=buy_alpha&model=expert_marketplace,runtime_infrastructure&theme=economics,risk&kind=inference,reported_claim&source-type=academic_primary,independent_reporting&control=independent&independence=one_group,two_plus_groups&support=partially_supported,supported&confidence=high,medium&temporal=current,historical&risk=high_risk,material&access=open,secondary_only&claim=clm_alpha"

    // When parsed and reserialized
    const result = parseHash(hash, references)

    // Then no byte or key moves
    expect(result.warnings).toEqual([])
    expect(serializeHash(result.state)).toBe(hash)
  })

  it("deduplicates, sorts, and caps company comparisons at three", () => {
    // Given four valid companies with duplicates and noncanonical ordering
    const hash = "#/companies?company=co_zulu,co_beta,co_alpha,co_gamma,co_beta"

    // When the hash is parsed
    const result = parseHash(hash, references)

    // Then only the first three lexical companies survive with a recoverable warning
    expect(result.state.company).toEqual([companyAlpha, companyBeta, companyGamma])
    expect(result.warnings).toContainEqual({ code: "company_limit", key: "company" })
    expect(serializeHash(result.state)).toBe("#/companies?company=co_alpha,co_beta,co_gamma")
  })

  it("isolates malformed, repeated, unknown, and invalid values", () => {
    // Given independent failures beside valid state
    const hash =
      "#/not-real?q=%E0%A4&q=discarded&bogus=x&theme=risk,legacy&access=open&company=co_missing"

    // When the hash is parsed
    const result = parseHash(hash, references)

    // Then each bad input is dropped without erasing valid keys or enum members
    expect(serializeHash(result.state)).toBe("#/guide?theme=risk&access=open")
    expect(result.warnings.map(({ code }) => code)).toEqual([
      "invalid_section",
      "repeated_key",
      "unknown_key",
      "invalid_value",
      "invalid_value",
    ])
  })

  it("recovers from one malformed percent-encoded multi-value member", () => {
    // Given a malformed item between valid enum values
    const hash = "#/companies?theme=risk,%E0%A4,economics&confidence=high"

    // When the hash is parsed
    const result = parseHash(hash, references)

    // Then the malformed member warns while valid state survives
    expect(serializeHash(result.state)).toBe("#/companies?theme=economics,risk&confidence=high")
    expect(result.warnings).toEqual([{ code: "malformed_encoding", key: "theme" }])
  })

  it("drops source focus on every route", () => {
    // Given a valid source on a remaining route
    const hash = "#/companies?claim=clm_alpha&source=src_alpha"

    // When the hash is parsed
    const result = parseHash(hash, references)

    // Then claim focus survives and source focus is recoverably removed
    expect(serializeHash(result.state)).toBe("#/companies?claim=clm_alpha")
    expect(result.warnings).toEqual([{ code: "source_outside_sources", key: "source" }])
  })

  it("warns for any source parameter while keeping claim focus", () => {
    // Given a valid claim and invalid source on a remaining route
    const hash = "#/companies?claim=clm_beta&source=src_missing"

    // When the hash is parsed
    const result = parseHash(hash, references)

    // Then claim focus survives, source focus is always null, and the source warning is retained
    expect(result.state.claim).toBe(claimBeta)
    expect(result.state.source).toBeNull()
    expect(serializeHash(result.state)).toBe("#/companies?claim=clm_beta")
    expect(result.warnings).toEqual([
      { code: "invalid_value", key: "source" },
      { code: "source_outside_sources", key: "source" },
    ])
  })

  it.each([
    ["source=src_missing", ["invalid_value", "source_outside_sources"]],
    ["source=%E0%A4", ["malformed_encoding", "source_outside_sources"]],
    ["source=src_alpha&source=src_beta", ["repeated_key", "source_outside_sources"]],
  ])("warns for invalid source syntax: %s", (query, warningCodes) => {
    const result = parseHash(`#/companies?${query}`, references)

    expect(result.state.source).toBeNull()
    expect(result.warnings.map(({ code }) => code)).toEqual(warningCodes)
  })

  it("warns and falls back when a slash route omits its section", () => {
    // Given the noncanonical empty slash route
    const hash = "#/?theme=risk"

    // When the hash is parsed
    const result = parseHash(hash, references)

    // Then the valid query survives the recoverable section fallback
    expect(serializeHash(result.state)).toBe("#/guide?theme=risk")
    expect(result.warnings).toContainEqual({ code: "invalid_section", key: null })
  })
})
