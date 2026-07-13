import type { EvidenceIndex } from "../domain/citations"
import type { Access, Control, SourceType } from "../domain/enums"
import {
  ClaimSchema,
  ObservationSchema,
  type Source,
  SourceSchema,
} from "../domain/evidence-schema"

type SourceFixtureInput = {
  readonly access: Access
  readonly control: Control
  readonly id: string
  readonly sourceType: SourceType
  readonly title: string
}

function sourceFixture(input: SourceFixtureInput): Source {
  return SourceSchema.parse({
    sourceId: input.id,
    title: input.title,
    publisher: "Atlas fixture publisher",
    canonicalUrl: `https://example.com/${input.id}`,
    archivedUrl: null,
    sourceType: input.sourceType,
    control: input.control,
    publisherAffiliations:
      input.control === "subject_controlled"
        ? [
            {
              entityRef: "co_showcase-subject",
              relationship: "subject",
              validFrom: "2026-01-01",
              validTo: null,
            },
          ]
        : [],
    publishedAt: "2026-07-01",
    accessedAt: "2026-07-11",
    access: input.access,
    lastLinkCheck: {
      checkedAt: "2026-07-11",
      rawResult: "Fixture link state",
      finalUrl: `https://example.com/${input.id}`,
    },
    accessNotes: input.access === "open" ? null : "Fixture degraded-access state",
  })
}

const regulatorySource = sourceFixture({
  access: "open",
  control: "subject_controlled",
  id: "src_showcase-regulatory",
  sourceType: "regulatory_record",
  title: "Subject-controlled regulatory fixture",
})
const reportingSource = sourceFixture({
  access: "paywalled",
  control: "independent",
  id: "src_showcase-reporting",
  sourceType: "independent_reporting",
  title: "Independent reporting fixture",
})
const technicalSource = sourceFixture({
  access: "open",
  control: "independent",
  id: "src_showcase-technical",
  sourceType: "academic_primary",
  title: "Technical evidence fixture",
})
const unavailableSource = sourceFixture({
  access: "unavailable",
  control: "unclear",
  id: "src_showcase-unavailable",
  sourceType: "other",
  title: "Unavailable source fixture",
})

function observationFixture(source: Source, suffix: string) {
  return ObservationSchema.parse({
    observationId: `obs_showcase-${suffix}`,
    sourceId: source.sourceId,
    locator: { kind: "section", value: `Fixture section ${suffix}` },
    excerpt: `Fixture evidence excerpt for ${suffix}.`,
    observedAt: "2026-07-11",
    validAt: "2026-07-01",
    observerGroup: "showcase-fixture",
    independenceBasis: "Synthetic showcase state; not a market claim.",
  })
}

const regulatoryObservation = observationFixture(regulatorySource, "regulatory")
const reportingObservation = observationFixture(reportingSource, "reporting")
const technicalObservation = observationFixture(technicalSource, "technical")
const unavailableObservation = observationFixture(unavailableSource, "unavailable")

const contestedClaim = ClaimSchema.parse({
  claimId: "clm_showcase-contested",
  statement: "Fixture claim demonstrating co-occurring support, contest, and high risk.",
  subjectIds: ["co_showcase-subject"],
  themes: ["strategy"],
  kind: "inference",
  confidence: "high",
  temporal: "current",
  risk: "high_risk",
  evidenceLinks: [
    {
      observationId: regulatoryObservation.observationId,
      sourceId: regulatorySource.sourceId,
      supportRelation: "supports",
      claimAlignment: "subject_controlled",
      independenceGroup: "source-chain:atlas-fixture-publisher",
    },
    {
      observationId: reportingObservation.observationId,
      sourceId: reportingSource.sourceId,
      supportRelation: "contests",
      claimAlignment: "editorial_independent",
      independenceGroup: "source-chain:atlas-fixture-publisher",
    },
  ],
  contradictionClaimIds: [],
  independentGroupCount: 0,
  singleSourceException: null,
  canonicalHash: "#/showcase?claim=clm_showcase-contested",
})

const supportedClaim = ClaimSchema.parse({
  claimId: "clm_showcase-supported",
  statement: "Fixture inference demonstrating a supported, medium-confidence state.",
  subjectIds: ["co_showcase-subject"],
  themes: ["strategy"],
  kind: "inference",
  confidence: "medium",
  temporal: "current",
  risk: "routine",
  evidenceLinks: [
    {
      observationId: technicalObservation.observationId,
      sourceId: technicalSource.sourceId,
      supportRelation: "supports",
      claimAlignment: "academic_independent",
      independenceGroup: "academic-work:https://example.com/src_showcase-technical",
    },
  ],
  contradictionClaimIds: [],
  independentGroupCount: 1,
  singleSourceException: null,
  canonicalHash: "#/showcase?claim=clm_showcase-supported",
})

const degradedClaim = ClaimSchema.parse({
  claimId: "clm_showcase-degraded",
  statement: "Fixture claim demonstrating unscored, time-unknown, unavailable evidence.",
  subjectIds: ["co_showcase-subject"],
  themes: ["risk"],
  kind: "reported_claim",
  confidence: "unscored",
  temporal: "unknown",
  risk: "unknown",
  evidenceLinks: [
    {
      observationId: unavailableObservation.observationId,
      sourceId: unavailableSource.sourceId,
      supportRelation: "context_only",
      claimAlignment: "subject_controlled",
      independenceGroup: "source-chain:atlas-fixture-publisher",
    },
  ],
  contradictionClaimIds: [],
  independentGroupCount: 0,
  singleSourceException: null,
  canonicalHash: "#/showcase?claim=clm_showcase-degraded",
})

const fixtureSources = [
  regulatorySource,
  reportingSource,
  technicalSource,
  unavailableSource,
] as const
const fixtureObservations = [
  regulatoryObservation,
  reportingObservation,
  technicalObservation,
  unavailableObservation,
] as const

export const SHOWCASE_EVIDENCE_CLAIMS = {
  contested: contestedClaim,
  degraded: degradedClaim,
  supported: supportedClaim,
} as const

export const SHOWCASE_EVIDENCE_INDEX = {
  claimsById: new Map(
    Object.values(SHOWCASE_EVIDENCE_CLAIMS).map((claim) => [claim.claimId, claim]),
  ),
  sourcesById: new Map(fixtureSources.map((source) => [source.sourceId, source])),
  observationsById: new Map(
    fixtureObservations.map((observation) => [observation.observationId, observation]),
  ),
} satisfies EvidenceIndex
