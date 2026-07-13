#!/usr/bin/env node

import { readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

import { DEFAULT_ROOT } from "./corpus-validator.mjs";

const manifestPath = join(DEFAULT_ROOT, "research/migrations/supplemental-census-input-2.json");
const registerPath = join(DEFAULT_ROOT, "research/corpus/supplemental-adjacent-2.json");
const manifest = JSON.parse(readFileSync(manifestPath, "utf8"));

const recordId = (record) => `adj_${String(record.canonicalName)
  .toLowerCase()
  .normalize("NFKD")
  .replace(/[^a-z0-9]+/g, "-")
  .replace(/^-|-$/g, "")}`;
const sourceDates = (record) =>
  (record.sources ?? [{ sourceDate: record.sourceDate }]).map((source) => source.sourceDate).filter(Boolean);
const cutoffTreatment = (record) => {
  if (record.entityStatus === "acquired_closed") return "acquired_historical";
  if (sourceDates(record).length > 0) return "historical_offer_only";
  return "time_unknown";
};

for (const record of manifest.records) {
  for (const date of sourceDates(record)) {
    if (date > manifest.evidenceCutoff) {
      throw new Error(
        `${record.canonicalName}: sourceDate ${date} is after the ${manifest.evidenceCutoff} cutoff; null the date and note publication in the caveat`,
      );
    }
  }
}

const addRecords = manifest.records
  .filter((record) => record.recordKind === "net_new")
  .map((record) => ({
    adjacentId: recordId(record),
    inputRefs: [record.canonicalName],
    entityKind: record.entityKind ?? "company",
    name: record.canonicalName,
    aliases: record.aliases ?? [],
    canonicalDomain: record.originDomain,
    primarySegment: record.primarySegment,
    businessModelIds: record.businessModelIds,
    entityStatus: record.entityStatus === "acquired_closed" ? "acquired_closed" : "unknown",
    sourceReportedStatus: record.entityStatus ?? "unknown",
    inclusionKind: record.inclusionKind ?? "direct_supplier",
    cutoffTreatment: cutoffTreatment(record),
    sourceCandidates: record.sources
      ? record.sources.map((source) => ({
          canonicalUrl: source.canonicalUrl,
          title: source.title,
          sourceDate: source.sourceDate ?? null,
          accessedAt: manifest.discoveredAt,
        }))
      : [...new Set([record.officialOfferUrl, record.officialStatusUrl].filter(Boolean))].map((canonicalUrl) => ({
          canonicalUrl,
          title: record.sourceTitle ?? `${record.canonicalName} official surface`,
          sourceDate: record.sourceDate ?? null,
          accessedAt: manifest.discoveredAt,
        })),
    observationCandidates: [{
      excerpt: record.observedExcerpt,
      locator: null,
      observedAt: manifest.discoveredAt,
      canonicalReady: false,
      note: "Candidate remains non-canonical until an exact locator is captured.",
    }],
    caveat: record.caveat ?? null,
    confidence: record.confidence ?? "medium",
    relationshipIds: [],
  }));
const duplicateInputs = manifest.records
  .filter((record) => record.recordKind === "canonical_duplicate")
  .map((record) => ({ input: record.canonicalName, mergeInto: record.duplicateOf, observedAt: manifest.discoveredAt }));
const unresolved = manifest.records
  .filter((record) => record.recordKind === "unresolved")
  .map((record) => ({
    adjacentId: recordId(record),
    input: record.canonicalName,
    candidateIdentity: record.candidateIdentity,
    evidenceUrls: record.officialEvidenceUrls,
    reason: record.reason,
    cutoffTreatment: "unresolved_identity",
  }));

writeFileSync(
  registerPath,
  `${JSON.stringify({
    schemaVersion: 1,
    evidenceCutoff: manifest.evidenceCutoff,
    observedAt: manifest.discoveredAt,
    records: addRecords,
    duplicateInputs,
    relationships: [],
    unresolved,
    reconciliation: {
      inputCount: manifest.records.length,
      addCount: addRecords.length,
      mergeCount: duplicateInputs.length,
      unresolvedCount: unresolved.length,
      unknownStatusCount: addRecords.filter((record) => record.entityStatus === "unknown").length,
      acquiredClosedCount: addRecords.filter((record) => record.entityStatus === "acquired_closed").length,
      coreCensusAffected: false,
    },
  }, null, 2)}\n`,
  "utf8",
);
console.log(`SWEEP_INPUTS_IMPORTED inputs=${manifest.records.length} additions=${addRecords.length}`);
