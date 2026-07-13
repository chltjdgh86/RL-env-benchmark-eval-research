import { z } from "zod"
import {
  AccessSchema,
  AffiliationRelationshipSchema,
  ClaimAlignmentSchema,
  ClaimKindSchema,
  ConfidenceSchema,
  ControlSchema,
  LocatorKindSchema,
  RiskSchema,
  SingleSourceExceptionKindSchema,
  SourceTypeSchema,
  SupportRelationSchema,
  TemporalSchema,
  ThemeSchema,
} from "./enums"
import {
  AffiliationEntityIdSchema,
  ClaimIdSchema,
  ObservationIdSchema,
  SourceIdSchema,
  SubjectIdSchema,
} from "./ids"

export const DateSchema = z.string().date()
export const HttpsUrlSchema = z
  .url()
  .refine((value) => value.startsWith("https://"), "URL must use HTTPS")
  .refine((value) => {
    const url = new URL(value)
    return url.username === "" && url.password === ""
  }, "URL must not contain credentials")
export const HttpsOriginSchema = HttpsUrlSchema.refine(
  (value) => new URL(value).origin === value,
  "URL must be an HTTPS origin",
)
const NonblankSchema = z.string().trim().min(1)
const uniqueArray = <T extends z.ZodType>(schema: T, minimum = 0) =>
  z
    .array(schema)
    .min(minimum)
    .refine(
      (values) => new Set(values.map((value) => JSON.stringify(value))).size === values.length,
      "Values must be unique",
    )
    .readonly()

export const AffiliationSchema = z
  .object({
    entityRef: AffiliationEntityIdSchema,
    relationship: AffiliationRelationshipSchema,
    validFrom: DateSchema.nullable(),
    validTo: DateSchema.nullable(),
  })
  .strict()
  .readonly()

export const LinkCheckSchema = z
  .object({
    checkedAt: DateSchema,
    rawResult: NonblankSchema,
    finalUrl: HttpsUrlSchema.nullable(),
  })
  .strict()
  .readonly()

export const SourceSchema = z
  .object({
    sourceId: SourceIdSchema,
    title: NonblankSchema,
    publisher: NonblankSchema,
    canonicalUrl: HttpsUrlSchema,
    archivedUrl: HttpsUrlSchema.nullable(),
    sourceType: SourceTypeSchema,
    control: ControlSchema,
    publisherAffiliations: uniqueArray(AffiliationSchema),
    publishedAt: DateSchema.nullable(),
    accessedAt: DateSchema,
    access: AccessSchema,
    lastLinkCheck: LinkCheckSchema,
    accessNotes: NonblankSchema.nullable(),
  })
  .strict()
  .readonly()

const ExcerptSchema = z
  .string()
  .trim()
  .min(1)
  .max(240)
  .refine((value) => value.split(/\s+/u).length <= 25, "Excerpt exceeds 25 words")

export const ObservationSchema = z
  .object({
    observationId: ObservationIdSchema,
    sourceId: SourceIdSchema,
    locator: z.object({ kind: LocatorKindSchema, value: NonblankSchema }).strict().readonly(),
    excerpt: ExcerptSchema.nullable(),
    observedAt: DateSchema,
    validAt: DateSchema.nullable(),
    observerGroup: NonblankSchema,
    independenceBasis: NonblankSchema,
  })
  .strict()
  .readonly()

export const EvidenceLinkSchema = z
  .object({
    observationId: ObservationIdSchema,
    sourceId: SourceIdSchema,
    supportRelation: SupportRelationSchema,
    claimAlignment: ClaimAlignmentSchema,
    independenceGroup: NonblankSchema,
  })
  .strict()
  .readonly()

export const SingleSourceExceptionSchema = z
  .object({
    kind: SingleSourceExceptionKindSchema,
    reason: NonblankSchema,
    observationId: ObservationIdSchema,
  })
  .strict()
  .readonly()

export const ClaimSchema = z
  .object({
    claimId: ClaimIdSchema,
    statement: NonblankSchema,
    subjectIds: uniqueArray(SubjectIdSchema, 1),
    themes: uniqueArray(ThemeSchema, 1),
    kind: ClaimKindSchema,
    confidence: ConfidenceSchema,
    temporal: TemporalSchema,
    risk: RiskSchema,
    evidenceLinks: uniqueArray(EvidenceLinkSchema, 1),
    contradictionClaimIds: uniqueArray(ClaimIdSchema),
    independentGroupCount: z.number().int().nonnegative(),
    singleSourceException: SingleSourceExceptionSchema.nullable(),
    canonicalHash: z.string().startsWith("#/"),
  })
  .strict()
  .readonly()

export type Affiliation = z.infer<typeof AffiliationSchema>
export type Source = z.infer<typeof SourceSchema>
export type Observation = z.infer<typeof ObservationSchema>
export type EvidenceLink = z.infer<typeof EvidenceLinkSchema>
export type Claim = z.infer<typeof ClaimSchema>
