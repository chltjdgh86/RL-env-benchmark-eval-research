import { describe, expect, it } from "vitest"
import { citationTupleKey, claimBacklink, type EvidenceIndex, resolveCitation } from "./citations"
import type { Access, ClaimAlignment, Control, Risk, SourceType, SupportRelation } from "./enums"
import { deriveClaimIndependence, deriveIndependenceBand, deriveSupportSummary } from "./evidence"
import {
  type Affiliation,
  AffiliationSchema,
  type Claim,
  ClaimSchema,
  type EvidenceLink,
  EvidenceLinkSchema,
  type Observation,
  ObservationSchema,
  type Source,
  SourceSchema,
} from "./evidence-schema"

type SourceFixture = {
  readonly id: string
  readonly publisher?: string
  readonly sourceType?: SourceType
  readonly affiliations?: readonly Affiliation[]
  readonly canonicalUrl?: string
  readonly control?: Control
  readonly access?: Access
}

type LinkFixture = {
  readonly source: Source
  readonly observation: Observation
  readonly supportRelation?: SupportRelation
  readonly claimAlignment?: ClaimAlignment
  readonly independenceGroup?: string
}

type ClaimFixture = {
  readonly links: readonly EvidenceLink[]
  readonly independentGroupCount?: number
  readonly canonicalHash?: string
  readonly exceptionObservation?: Observation
  readonly risk?: Risk
}

const makeAffiliation = (entityRef: string, relationship: string): Affiliation =>
  AffiliationSchema.parse({ entityRef, relationship, validFrom: null, validTo: null })

const makeSource = ({
  id,
  publisher = "Independent Journal",
  sourceType = "independent_reporting",
  affiliations = [],
  canonicalUrl = `https://example.com/${id}`,
  control = affiliations.length === 0 ? "independent" : "commercially_affiliated",
  access = "open",
}: SourceFixture): Source =>
  SourceSchema.parse({
    sourceId: id,
    title: `${publisher} evidence`,
    publisher,
    canonicalUrl,
    archivedUrl: null,
    sourceType,
    control,
    publisherAffiliations: affiliations,
    publishedAt: null,
    accessedAt: "2026-07-11",
    access,
    lastLinkCheck: {
      checkedAt: "2026-07-11",
      rawResult: "Accessible",
      finalUrl: `https://example.com/${id}`,
    },
    accessNotes: null,
  })

const makeObservation = (source: Source, id: string): Observation =>
  ObservationSchema.parse({
    observationId: id,
    sourceId: source.sourceId,
    locator: { kind: "paragraph", value: "Evidence paragraph" },
    excerpt: "Exact evidence",
    observedAt: "2026-07-11",
    validAt: null,
    observerGroup: "test",
    independenceBasis: "Fixture provenance",
  })

const makeLink = ({
  source,
  observation,
  supportRelation = "supports",
  claimAlignment = "editorial_independent",
  independenceGroup = `source-chain:${source.publisher.toLowerCase().replaceAll(" ", "-")}`,
}: LinkFixture): EvidenceLink =>
  EvidenceLinkSchema.parse({
    observationId: observation.observationId,
    sourceId: source.sourceId,
    supportRelation,
    claimAlignment,
    independenceGroup,
  })

const makeClaim = ({
  links,
  independentGroupCount = 0,
  canonicalHash = "#/companies?claim=clm_test-claim",
  exceptionObservation,
  risk = "routine",
}: ClaimFixture): Claim =>
  ClaimSchema.parse({
    claimId: "clm_test-claim",
    statement: "A single atomic test claim.",
    subjectIds: ["co_test-subject"],
    themes: ["company"],
    kind: "observation",
    confidence: "high",
    temporal: "current",
    risk,
    evidenceLinks: links,
    contradictionClaimIds: [],
    independentGroupCount,
    singleSourceException:
      exceptionObservation === undefined
        ? null
        : {
            kind: "current_advertised_offer",
            reason: "Only the advertised offer is established.",
            observationId: exceptionObservation.observationId,
          },
    canonicalHash,
  })

const sourceMap = (sources: readonly Source[]) =>
  new Map(sources.map((source) => [source.sourceId, source]))

describe("deriveSupportSummary", () => {
  const linkedClaim = (relations: readonly SupportRelation[]) => {
    const source = makeSource({ id: "src_support" })
    const observation = makeObservation(source, "obs_support")
    return makeClaim({
      links: relations.map((supportRelation) => makeLink({ source, observation, supportRelation })),
    })
  }

  it.each([
    [["supports", "contests"], "contested"],
    [["supports", "contradicts"], "contested"],
    [["contradicts"], "contradicted"],
    [["supports", "partially_supports"], "supported"],
    [["partially_supports"], "partially_supported"],
    [["context_only"], "not_publicly_verified"],
  ] satisfies readonly (readonly [
    readonly SupportRelation[],
    string,
  ])[])("derives %s as %s using relationship precedence", (relations, expected) => {
    const givenClaim = linkedClaim(relations)
    const whenDerived = deriveSupportSummary(givenClaim)
    expect(whenDerived).toBe(expected)
  })
})

describe("claim-specific independence", () => {
  it("counts a positive editorial link as one eligible group", () => {
    const source = makeSource({ id: "src_daily", publisher: "Daily Journal" })
    const observation = makeObservation(source, "obs_daily")
    const claim = makeClaim({
      links: [makeLink({ source, observation })],
      independentGroupCount: 1,
    })

    const result = deriveClaimIndependence(claim, sourceMap([source]))

    expect(result).toMatchObject({
      band: "one_group",
      eligibleGroups: ["source-chain:daily-journal"],
      issues: [],
    })
  })

  it("flags aligned evidence forged as editorial independence", () => {
    const affiliation = makeAffiliation("co_test-subject", "investor")
    const source = makeSource({ id: "src_investor", affiliations: [affiliation] })
    const observation = makeObservation(source, "obs_investor")
    const claim = makeClaim({
      links: [makeLink({ source, observation })],
      independentGroupCount: 1,
    })

    const result = deriveClaimIndependence(claim, sourceMap([source]))

    expect(result.eligibleGroups).toEqual([])
    expect(result.issues.map((issue) => issue.code)).toEqual([
      "CLAIM_ALIGNMENT_MISMATCH",
      "INDEPENDENCE_COUNT_MISMATCH",
    ])
  })

  it("collapses a republication through its declared syndicator and never counts it", () => {
    const root = makeSource({ id: "src_wire-root", publisher: "Wire Service" })
    const syndicator = makeAffiliation(root.sourceId, "syndicator")
    const copy = makeSource({
      id: "src_wire-copy",
      publisher: "Local Outlet",
      affiliations: [syndicator],
    })
    const observation = makeObservation(copy, "obs_wire-copy")
    const claim = makeClaim({
      links: [
        makeLink({
          source: copy,
          observation,
          claimAlignment: "republication_same_chain",
          independenceGroup: "source-chain:wire-service",
        }),
      ],
    })

    const result = deriveClaimIndependence(claim, sourceMap([root, copy]))

    expect(result).toMatchObject({ band: "no_eligible_group", eligibleGroups: [], issues: [] })
  })

  it("lets an allowed single-source exception override the numerical band", () => {
    const subject = makeAffiliation("co_test-subject", "subject")
    const source = makeSource({
      id: "src_exception",
      sourceType: "company_first_party",
      affiliations: [subject],
      control: "subject_controlled",
    })
    const observation = makeObservation(source, "obs_exception")
    const claim = makeClaim({
      links: [
        makeLink({
          source,
          observation,
          claimAlignment: "subject_controlled",
          independenceGroup: "source-chain:independent-journal",
        }),
      ],
      exceptionObservation: observation,
    })

    expect(deriveIndependenceBand(claim, sourceMap([source]))).toBe("single_source_exception")
  })

  it("rejects an advertised-offer exception backed by an academic source", () => {
    const source = makeSource({ id: "src_exception-fraud", sourceType: "academic_primary" })
    const observation = makeObservation(source, "obs_exception-fraud")
    const claim = makeClaim({
      links: [makeLink({ source, observation, claimAlignment: "academic_independent" })],
      independentGroupCount: 1,
      exceptionObservation: observation,
    })

    const result = deriveClaimIndependence(claim, sourceMap([source]))

    expect(result.band).toBe("one_group")
    expect(result.issues.map((issue) => issue.code)).toContain("INVALID_SINGLE_SOURCE_EXCEPTION")
  })

  it("cannot relabel a subject origin as independent reporting", () => {
    const source = makeSource({
      id: "src_subject-fraud",
      canonicalUrl: "https://subject.example/report",
    })
    const observation = makeObservation(source, "obs_subject-fraud")
    const claim = makeClaim({
      links: [makeLink({ source, observation })],
      independentGroupCount: 1,
    })
    const origins = new Map([["co_test-subject", "https://subject.example"]])

    const result = deriveClaimIndependence(claim, sourceMap([source]), origins)

    expect(result.eligibleGroups).toEqual([])
    expect(result.issues.map((issue) => issue.code)).toContain("CLAIM_ALIGNMENT_MISMATCH")
  })

  it("flags a high-risk claim with only one editorial group and no primary source", () => {
    const source = makeSource({ id: "src_high-risk" })
    const observation = makeObservation(source, "obs_high-risk")
    const claim = makeClaim({
      links: [makeLink({ source, observation })],
      independentGroupCount: 1,
      risk: "high_risk",
    })

    const result = deriveClaimIndependence(claim, sourceMap([source]))

    expect(result.issues.map((issue) => issue.code)).toContain(
      "INSUFFICIENT_HIGH_RISK_INDEPENDENCE",
    )
  })
})

describe("citation integrity", () => {
  const makeIndex = (
    claim: Claim,
    sources: readonly Source[],
    observations: readonly Observation[],
  ): EvidenceIndex => ({
    claimsById: new Map([[claim.claimId, claim]]),
    sourcesById: sourceMap(sources),
    observationsById: new Map(
      observations.map((observation) => [observation.observationId, observation]),
    ),
  })

  it("resolves the exact claim, observation, source, and relationship tuple", () => {
    const source = makeSource({ id: "src_citation" })
    const observation = makeObservation(source, "obs_citation")
    const link = makeLink({ source, observation })
    const claim = makeClaim({ links: [link], independentGroupCount: 1 })

    const result = resolveCitation(
      makeIndex(claim, [source], [observation]),
      claim.claimId,
      source.sourceId,
    )

    expect(result).toEqual({ kind: "resolved", receipts: [{ claim, observation, source, link }] })
    expect(citationTupleKey(claim.claimId, link)).toBe(
      "clm_test-claim|obs_citation|src_citation|supports",
    )
  })

  it("rejects a link whose observation belongs to another source", () => {
    const linkedSource = makeSource({ id: "src_linked" })
    const actualSource = makeSource({ id: "src_actual" })
    const observation = makeObservation(actualSource, "obs_mismatch")
    const link = makeLink({ source: linkedSource, observation })
    const claim = makeClaim({ links: [link], independentGroupCount: 1 })

    const result = resolveCitation(
      makeIndex(claim, [linkedSource, actualSource], [observation]),
      claim.claimId,
      linkedSource.sourceId,
    )

    expect(result).toMatchObject({ kind: "invalid" })
    if (result.kind === "invalid") {
      expect(result.issues.map((issue) => issue.code)).toEqual(["OBSERVATION_SOURCE_MISMATCH"])
    }
  })

  it("serializes citation pairs and validates the claim backlink", () => {
    const source = makeSource({ id: "src_hash" })
    const observation = makeObservation(source, "obs_hash")
    const claim = makeClaim({ links: [makeLink({ source, observation })] })

    expect(claimBacklink(claim)).toEqual({
      kind: "valid",
      href: "#/companies?claim=clm_test-claim",
      anchorId: "claim-clm_test-claim",
    })
    expect(
      claimBacklink(
        makeClaim({ links: claim.evidenceLinks, canonicalHash: "#/companies?claim=clm_wrong" }),
      ),
    ).toMatchObject({ kind: "invalid" })
    expect(
      claimBacklink(
        makeClaim({
          links: claim.evidenceLinks,
          canonicalHash: "#/companies?claim=clm_test-claim&source=src_hash",
        }),
      ),
    ).toEqual({ kind: "invalid", detail: "Canonical claim hash cannot select a source" })
    for (const canonicalHash of [
      "#/companies?junk=x&claim=clm_test-claim",
      "#/companies?q=a&q=b&claim=clm_test-claim",
      "#/companies?claim=clm_test-claim&q=late",
    ]) {
      expect(claimBacklink(makeClaim({ links: claim.evidenceLinks, canonicalHash }))).toMatchObject(
        {
          kind: "invalid",
        },
      )
    }
  })
})
