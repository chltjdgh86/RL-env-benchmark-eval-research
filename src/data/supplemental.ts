import { z } from "zod"
import supplementalJson from "../../research/corpus/supplemental-adjacent.json"
import supplemental2Json from "../../research/corpus/supplemental-adjacent-2.json"
import {
  AdjacentInclusionKindSchema,
  BusinessModelIdSchema,
  SegmentIdSchema,
} from "../domain/enums"
import { DateSchema, HttpsUrlSchema } from "../domain/evidence-schema"
import { AdjacentIdSchema, CompanyIdSchema } from "../domain/ids"
import { CorpusIntegrityError } from "./corpus-schema"
import { researchCorpus } from "./research"

const NonblankSchema = z.string().trim().min(1)
const RelationshipIdSchema = z.string().regex(/^rel_[a-z0-9]+(?:-[a-z0-9]+)*$/u)
const uniqueArray = <T extends z.ZodType>(schema: T, minimum = 0) =>
  z
    .array(schema)
    .min(minimum)
    .refine(
      (values) => new Set(values.map((value) => JSON.stringify(value))).size === values.length,
      "Values must be unique",
    )
    .readonly()
const SourceCandidateSchema = z
  .object({
    canonicalUrl: HttpsUrlSchema,
    title: NonblankSchema,
    sourceDate: DateSchema.nullable(),
    accessedAt: DateSchema,
  })
  .strict()
  .readonly()

const ObservationCandidateSchema = z
  .object({
    excerpt: NonblankSchema.refine(
      (value) => value.split(/\s+/u).length <= 25,
      "Excerpt exceeds 25 words",
    ),
    locator: z.null(),
    observedAt: DateSchema,
    canonicalReady: z
      .boolean()
      .refine((value) => value === false, "SUPPLEMENTAL_PREMATURE_PROMOTION"),
    note: NonblankSchema,
  })
  .strict()
  .readonly()

export const SupplementalRecordSchema = z
  .object({
    adjacentId: AdjacentIdSchema,
    inputRefs: uniqueArray(NonblankSchema, 1),
    entityKind: z.enum(["company", "brand", "product", "business_unit"]),
    name: NonblankSchema,
    aliases: uniqueArray(NonblankSchema),
    canonicalDomain: HttpsUrlSchema,
    primarySegment: SegmentIdSchema,
    businessModelIds: uniqueArray(BusinessModelIdSchema, 1),
    entityStatus: z.enum(["unknown", "acquired_closed"]),
    sourceReportedStatus: z.enum(["active", "unknown", "acquired_closed"]),
    inclusionKind: AdjacentInclusionKindSchema,
    cutoffTreatment: z.enum(["time_unknown", "historical_offer_only", "acquired_historical"]),
    sourceCandidates: uniqueArray(SourceCandidateSchema, 1),
    observationCandidates: uniqueArray(ObservationCandidateSchema, 1),
    caveat: NonblankSchema.nullable(),
    confidence: z.enum(["high", "medium"]),
    relationshipIds: uniqueArray(RelationshipIdSchema),
  })
  .strict()
  .readonly()

const RelationshipBase = {
  relationshipId: RelationshipIdSchema,
  fromId: AdjacentIdSchema,
  relation: z.enum(["product_of", "acquired_by"]),
}
const SupplementalRelationshipSchema = z.union([
  z
    .object({ ...RelationshipBase, toId: z.union([AdjacentIdSchema, CompanyIdSchema]) })
    .strict()
    .readonly(),
  z
    .object({ ...RelationshipBase, toName: NonblankSchema })
    .strict()
    .readonly(),
])

const SupplementalDuplicateSchema = z
  .object({ input: NonblankSchema, mergeInto: CompanyIdSchema, observedAt: DateSchema })
  .strict()
  .readonly()
const SupplementalUnresolvedSchema = z
  .object({
    adjacentId: AdjacentIdSchema,
    input: NonblankSchema,
    candidateIdentity: NonblankSchema,
    evidenceUrls: uniqueArray(HttpsUrlSchema, 1),
    reason: NonblankSchema,
    cutoffTreatment: z.literal("unresolved_identity"),
  })
  .strict()
  .readonly()
const ReconciliationSchema = z
  .object({
    inputCount: z.number().int(),
    addCount: z.number().int(),
    mergeCount: z.number().int(),
    unresolvedCount: z.number().int(),
    unknownStatusCount: z.number().int(),
    acquiredClosedCount: z.number().int(),
    coreCensusAffected: z.boolean(),
  })
  .strict()
  .readonly()

export const SupplementalAdjacentSchema = z
  .object({
    schemaVersion: z.literal(1),
    evidenceCutoff: DateSchema,
    observedAt: DateSchema,
    records: uniqueArray(SupplementalRecordSchema),
    duplicateInputs: uniqueArray(SupplementalDuplicateSchema),
    relationships: uniqueArray(SupplementalRelationshipSchema),
    unresolved: uniqueArray(SupplementalUnresolvedSchema),
    reconciliation: ReconciliationSchema,
  })
  .strict()
  .readonly()

const supplementalFail = (code: string, detail: string): never => {
  throw new CorpusIntegrityError(code, "supplemental", detail)
}

export type SupplementalRegisterLock = {
  readonly evidenceCutoff: string
  readonly observedAt: string
  readonly reconciliation: {
    readonly inputCount: number
    readonly addCount: number
    readonly mergeCount: number
    readonly unresolvedCount: number
    readonly unknownStatusCount: number
    readonly acquiredClosedCount: number
  }
}

const REGISTER_ONE_LOCK: SupplementalRegisterLock = {
  evidenceCutoff: "2026-07-11",
  observedAt: "2026-07-12",
  reconciliation: {
    inputCount: 50,
    addCount: 47,
    mergeCount: 2,
    unresolvedCount: 1,
    unknownStatusCount: 45,
    acquiredClosedCount: 2,
  },
}

const REGISTER_TWO_LOCK: SupplementalRegisterLock = {
  evidenceCutoff: "2026-07-11",
  observedAt: "2026-07-12",
  reconciliation: {
    inputCount: 12,
    addCount: 12,
    mergeCount: 0,
    unresolvedCount: 0,
    unknownStatusCount: 11,
    acquiredClosedCount: 1,
  },
}

export const SUPPLEMENTAL_REGISTER_LOCKS: readonly SupplementalRegisterLock[] = [
  REGISTER_ONE_LOCK,
  REGISTER_TWO_LOCK,
]

function assertSupplementalIntegrity(
  value: SupplementalAdjacent,
  lock: SupplementalRegisterLock,
): void {
  if (value.evidenceCutoff !== lock.evidenceCutoff || value.observedAt !== lock.observedAt) {
    supplementalFail("SUPPLEMENTAL_TEMPORAL_BOUNDARY", "Expected cutoff and discovery dates")
  }
  if (
    value.records.length !== lock.reconciliation.addCount ||
    value.duplicateInputs.length !== lock.reconciliation.mergeCount ||
    value.unresolved.length !== lock.reconciliation.unresolvedCount
  ) {
    supplementalFail(
      "SUPPLEMENTAL_RECONCILIATION",
      "Register counts do not match its audited integration manifest",
    )
  }
  const recordIds = new Set<string>()
  const coreIds = new Set<string>([
    ...researchCorpus.companies.map((record) => record.companyId),
    ...researchCorpus.adjacent.map((record) => record.adjacentId),
  ])
  for (const record of value.records) {
    if (recordIds.has(record.adjacentId))
      supplementalFail("SUPPLEMENTAL_DUPLICATE_ID", record.adjacentId)
    if (coreIds.has(record.adjacentId))
      supplementalFail("SUPPLEMENTAL_CORE_COLLISION", record.adjacentId)
    recordIds.add(record.adjacentId)
    for (const source of record.sourceCandidates) {
      if (
        source.accessedAt !== value.observedAt ||
        (source.sourceDate !== null && source.sourceDate > value.evidenceCutoff)
      ) {
        supplementalFail("SUPPLEMENTAL_TEMPORAL_BOUNDARY", record.adjacentId)
      }
    }
    for (const observation of record.observationCandidates) {
      if (observation.observedAt !== value.observedAt || observation.canonicalReady) {
        supplementalFail("SUPPLEMENTAL_PREMATURE_PROMOTION", record.adjacentId)
      }
    }
    const datedSources = record.sourceCandidates.filter(
      (source) => source.sourceDate !== null,
    ).length
    if (record.cutoffTreatment === "time_unknown" && datedSources !== 0)
      supplementalFail("SUPPLEMENTAL_CUTOFF_TREATMENT", record.adjacentId)
    if (record.cutoffTreatment === "historical_offer_only" && datedSources === 0)
      supplementalFail("SUPPLEMENTAL_CUTOFF_TREATMENT", record.adjacentId)
    if (
      (record.entityStatus === "acquired_closed") !==
      (record.cutoffTreatment === "acquired_historical")
    )
      supplementalFail("SUPPLEMENTAL_CUTOFF_TREATMENT", record.adjacentId)
  }
  const relationships = new Map(
    value.relationships.map((relationship) => [relationship.relationshipId, relationship]),
  )
  if (relationships.size !== value.relationships.length)
    supplementalFail("SUPPLEMENTAL_DUPLICATE_ID", "relationships")
  for (const record of value.records) {
    for (const relationshipId of record.relationshipIds) {
      if (relationships.get(relationshipId)?.fromId !== record.adjacentId)
        supplementalFail("SUPPLEMENTAL_RELATIONSHIP_MISMATCH", relationshipId)
    }
  }
  for (const relationship of value.relationships) {
    if (!recordIds.has(relationship.fromId))
      supplementalFail("SUPPLEMENTAL_RELATIONSHIP_MISMATCH", relationship.relationshipId)
    if (
      "toId" in relationship &&
      !recordIds.has(relationship.toId) &&
      !coreIds.has(relationship.toId)
    )
      supplementalFail("SUPPLEMENTAL_RELATIONSHIP_MISMATCH", relationship.relationshipId)
  }
  for (const duplicate of value.duplicateInputs) {
    if (
      !researchCorpus.companies.some((company) => company.companyId === duplicate.mergeInto) ||
      duplicate.observedAt !== value.observedAt
    )
      supplementalFail("SUPPLEMENTAL_DUPLICATE_TARGET", duplicate.input)
  }
  const unknownCount = value.records.filter((record) => record.entityStatus === "unknown").length
  const acquiredCount = value.records.filter(
    (record) => record.entityStatus === "acquired_closed",
  ).length
  const manifest = lock.reconciliation
  const expected = [
    manifest.inputCount,
    manifest.addCount,
    manifest.mergeCount,
    manifest.unresolvedCount,
    unknownCount,
    acquiredCount,
    false,
  ] as const
  const actual = [
    value.reconciliation.inputCount,
    value.reconciliation.addCount,
    value.reconciliation.mergeCount,
    value.reconciliation.unresolvedCount,
    value.reconciliation.unknownStatusCount,
    value.reconciliation.acquiredClosedCount,
    value.reconciliation.coreCensusAffected,
  ] as const
  if (
    JSON.stringify(actual) !== JSON.stringify(expected) ||
    unknownCount !== manifest.unknownStatusCount ||
    acquiredCount !== manifest.acquiredClosedCount
  )
    supplementalFail("SUPPLEMENTAL_RECONCILIATION", "Derived summary mismatch")
  if (
    researchCorpus.adjacent.length !== 63 ||
    researchCorpus.companies.length !== 10 ||
    researchCorpus.receipts.length !== 70
  )
    supplementalFail("SUPPLEMENTAL_CORE_IMPACT", "Core corpus changed")
}

export function parseSupplementalAdjacent(
  input: unknown,
  lock: SupplementalRegisterLock = REGISTER_ONE_LOCK,
): SupplementalAdjacent {
  const parsed = SupplementalAdjacentSchema.parse(input)
  assertSupplementalIntegrity(parsed, lock)
  return parsed
}

function collectSupplementalRecords(
  registers: readonly SupplementalAdjacent[],
): readonly SupplementalRecord[] {
  const seen = new Set<string>()
  const records: SupplementalRecord[] = []
  for (const register of registers) {
    for (const record of register.records) {
      if (seen.has(record.adjacentId))
        supplementalFail("SUPPLEMENTAL_DUPLICATE_ID", record.adjacentId)
      seen.add(record.adjacentId)
      records.push(record)
    }
  }
  return records
}

export type SupplementalRecord = z.infer<typeof SupplementalRecordSchema>
export type SupplementalAdjacent = z.infer<typeof SupplementalAdjacentSchema>
export const supplementalAdjacent = parseSupplementalAdjacent(supplementalJson)
export const supplementalAdjacent2 = parseSupplementalAdjacent(supplemental2Json, REGISTER_TWO_LOCK)
export const supplementalRegisters: readonly SupplementalAdjacent[] = [
  supplementalAdjacent,
  supplementalAdjacent2,
]
export const supplementalRecords = collectSupplementalRecords(supplementalRegisters)
