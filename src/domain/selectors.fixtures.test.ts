import { describe, expect, it } from "vitest"
import { researchCorpus, researchIndex } from "../data/research"
import { deriveAdjacentCensus, deriveCorpusCounts } from "./census"
import { BUSINESS_MODELS, ENTITY_STATUSES, SEGMENTS } from "./enums"
import { BuyerEvidenceIdSchema, ClaimIdSchema, CompanyIdSchema, SourceIdSchema } from "./ids"
import { selectAdjacent, selectClaims, selectCompanies, selectSources } from "./selectors"

const index = researchIndex
const scaleId = CompanyIdSchema.parse("co_scale-ai")
const scaleBuyerId = BuyerEvidenceIdSchema.parse("buy_scale-ai")
const scaleOfficialSourceId = SourceIdSchema.parse("src_s03")
const scaleOriginSourceId = SourceIdSchema.parse("src_s01")
const scaleIdentityClaimId = ClaimIdSchema.parse("clm_scale-ai-identity")

describe("canonical research selectors", () => {
  it("searches IDs, names, aliases, publishers, domains, claims, and observation text", () => {
    const givenPublisherAndObservationQuery = "Y Combinator human labor"

    const whenSelected = selectCompanies(index, { q: givenPublisherAndObservationQuery })

    expect(whenSelected.map((company) => company.companyId)).toContain(scaleId)
  })

  it("searches the structured observation locator kind", () => {
    const givenLocatorQuery = "html_heading human labor"

    const whenSelected = selectCompanies(index, { q: givenLocatorQuery })

    expect(whenSelected.map((company) => company.companyId)).toContain(scaleId)
  })

  it("applies OR within record facets and AND across them", () => {
    const givenFilters = {
      company: [scaleId],
      segment: ["training_data_workforce"],
      model: ["employee_bpo", "proprietary_data_acquisition"],
    } as const

    const whenSelected = selectCompanies(index, givenFilters)

    expect(whenSelected.map((company) => company.companyId)).toEqual([scaleId])
  })

  it("requires claim facets to co-occur on one linked claim", () => {
    const givenSplitClaimFacets = {
      company: [scaleId],
      theme: ["economics"],
      kind: ["reported_claim"],
    } as const

    const whenSelected = selectCompanies(index, givenSplitClaimFacets)

    expect(whenSelected).toEqual([])
  })

  it("requires source facets to co-occur on one evidence-link source", () => {
    const givenSplitSourceFacets = {
      company: [scaleId],
      sourceType: ["company_first_party"],
      access: ["login_gated"],
    } as const

    const whenSelected = selectCompanies(index, givenSplitSourceFacets)

    expect(whenSelected).toEqual([])
  })

  it("keeps source-view claim matches linked through the displayed source", () => {
    const givenClaimFacets = {
      company: [scaleId],
      theme: ["economics"],
      kind: ["inference"],
    } as const

    const whenSelected = selectSources(index, givenClaimFacets)

    expect(whenSelected.map((source) => source.sourceId)).toContain(scaleOfficialSourceId)
    expect(whenSelected.map((source) => source.sourceId)).not.toContain(scaleOriginSourceId)
  })

  it("applies every evidence facet with OR values on one coherent relationship", () => {
    const givenAllEvidenceFacets = {
      company: [scaleId],
      theme: ["economics", "company"],
      kind: ["forecast", "observation"],
      sourceType: ["regulatory_record", "company_first_party"],
      control: ["independent", "subject_controlled"],
      independence: ["no_eligible_group", "single_source_exception"],
      support: ["contested", "not_publicly_verified"],
      confidence: ["low", "medium"],
      temporal: ["historical", "current"],
      risk: ["high_risk", "routine"],
      access: ["unavailable", "open"],
    } as const

    const whenSelected = selectClaims(index, givenAllEvidenceFacets)

    expect(whenSelected.map((claim) => claim.claimId)).toContain(scaleIdentityClaimId)
  })

  it("filters claims, adjacent records, and buyer-linked companies", () => {
    const givenClaimFilters = {
      company: [scaleId],
      theme: ["economics"],
      kind: ["inference"],
    } as const

    const whenClaims = selectClaims(index, givenClaimFilters)
    const whenAdjacent = selectAdjacent(index, { model: ["runtime_infrastructure"] })
    const whenCompanies = selectCompanies(index, { buyer: [scaleBuyerId] })

    expect(whenClaims.length).toBeGreaterThan(0)
    expect(whenAdjacent.length).toBeGreaterThan(0)
    expect(whenCompanies.map((company) => company.companyId)).toEqual([scaleId])
  })

  it.each(BUSINESS_MODELS)("filters linked records for business model %s", (model) => {
    const givenModel = { model: [model] }

    const whenSelected = [
      ...selectCompanies(index, givenModel),
      ...selectAdjacent(index, givenModel),
    ]

    expect(whenSelected.length).toBeGreaterThan(0)
    expect(whenSelected.every((record) => record.businessModelIds.includes(model))).toBe(true)
  })
})

describe("core corpus census", () => {
  it("reports the bounded 63-record census with nine records in every segment", () => {
    const givenCoreAdjacent = researchCorpus.adjacent

    const whenDerived = deriveAdjacentCensus(givenCoreAdjacent)

    expect(whenDerived.total).toBe(63)
    expect(Object.values(whenDerived.bySegment)).toEqual(SEGMENTS.map(() => 9))
  })

  it("zero-fills every segment, model, and entity status without supplemental records", () => {
    const givenCoreAdjacent = researchCorpus.adjacent.slice(0, 1)

    const whenDerived = deriveAdjacentCensus(givenCoreAdjacent)

    expect(Object.keys(whenDerived.bySegment).sort()).toEqual([...SEGMENTS].sort())
    expect(Object.keys(whenDerived.byBusinessModel).sort()).toEqual([...BUSINESS_MODELS].sort())
    expect(Object.keys(whenDerived.byEntityStatus).sort()).toEqual([...ENTITY_STATUSES].sort())
    expect(whenDerived.total).toBe(1)
  })

  it("counts only canonical corpus collections", () => {
    const givenCoreWithSupplement = {
      sources: [{}],
      observations: [{}, {}],
      claims: [{}, {}, {}],
      companies: [{}],
      industries: [{}],
      adjacent: [{}],
      buyerEvidence: [{}],
      marketAnalysis: [{}],
      strategies: [{}],
      receipts: [{}],
      supplementalAdjacent: [{}, {}],
    }

    const whenDerived = deriveCorpusCounts(givenCoreWithSupplement)

    expect(whenDerived.adjacent).toBe(1)
    expect(whenDerived.totalRecords).toBe(13)
    expect("supplementalAdjacent" in whenDerived).toBe(false)
  })
})
