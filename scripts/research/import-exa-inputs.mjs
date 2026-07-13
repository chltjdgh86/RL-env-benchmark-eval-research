#!/usr/bin/env node

import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { basename, join } from "node:path";

import { DEFAULT_ROOT } from "./corpus-validator.mjs";

const inputPaths = [
  "/tmp/exa-receipts-finance.md",
  "/tmp/exa-receipts-insurance.md",
  "/tmp/exa-receipts-health.md",
  "/tmp/exa-receipts-enterprise.md",
  "/tmp/exa-receipts-public.md",
  "/tmp/exa-competitor-research.md",
  "/tmp/exa-argilla-research.md",
  "/tmp/exa-supplement-a.md",
  "/tmp/exa-supplement-b.md",
  "/tmp/exa-supplement-c.md",
  "/tmp/exa-supplemental-integration-manifest.md",
];
const outputDirectory = join(DEFAULT_ROOT, "research/seeds/exa");
mkdirSync(outputDirectory, { recursive: true });

for (const path of inputPaths) {
  if (!existsSync(path)) continue;
  writeFileSync(join(outputDirectory, basename(path)), readFileSync(path));
}

const parseFirstJsonBlock = (path) => {
  const text = readFileSync(path, "utf8");
  const match = text.match(/```json\s*([\s\S]*?)```/);
  if (!match) throw new Error(`No JSON block in ${path}`);
  return JSON.parse(match[1]);
};

const supplementA = parseFirstJsonBlock("/tmp/exa-supplement-a.md");
const supplementB = parseFirstJsonBlock("/tmp/exa-supplement-b.md");
const supplementC = parseFirstJsonBlock("/tmp/exa-supplement-c.md");
const argilla = JSON.parse(readFileSync("/tmp/exa-argilla-research.md", "utf8"));
const competitorText = readFileSync("/tmp/exa-competitor-research.md", "utf8");
const competitorMatch = competitorText.match(/### JSON\s*```json\s*([\s\S]*?)```/);
if (!competitorMatch) throw new Error("No competitor JSON block");
const competitors = JSON.parse(competitorMatch[1]);
const competitorTaxonomy = new Map([
  ["Bespoke Labs", ["environment_computer_use_runtime", ["expert_environment_services", "runtime_infrastructure"]]],
  ["Mechanize", ["environment_computer_use_runtime", ["expert_environment_services"]]],
  ["Sepal AI", ["training_data_workforce", ["managed_data_bpo"]]],
  ["HUD", ["environment_computer_use_runtime", ["runtime_infrastructure", "expert_marketplace", "expert_environment_services"]]],
  ["Plato", ["environment_computer_use_runtime", ["runtime_infrastructure", "expert_environment_services"]]],
  ["Matrices", ["environment_computer_use_runtime", ["expert_environment_services"]]],
  ["Encord", ["training_data_workforce", ["managed_data_bpo", "eval_observability_saas"]]],
  ["Cortex AI", ["training_data_workforce", ["proprietary_data_acquisition", "managed_data_bpo"]]],
  ["Praxis AI", ["training_data_workforce", ["proprietary_data_acquisition", "managed_data_bpo"]]],
  ["Arena", ["eval_observability_assurance", ["eval_observability_saas", "expert_environment_services"]]],
  ["David AI", ["training_data_workforce", ["proprietary_data_acquisition", "managed_data_bpo"]]],
  ["Protege", ["training_data_workforce", ["proprietary_data_acquisition", "expert_marketplace"]]],
  ["Datacurve", ["training_data_workforce", ["proprietary_data_acquisition", "managed_data_bpo", "expert_environment_services"]]],
  ["Truveta", ["training_data_workforce", ["proprietary_data_acquisition"]]],
  ["Snorkel AI", ["training_data_workforce", ["managed_data_bpo", "eval_observability_saas", "expert_environment_services"]]],
]);
const userProvidedAliases = new Map([["Cortex AI", ["Cortex"]]]);
const competitorRecords = competitors.map((record) => {
  const taxonomy = competitorTaxonomy.get(record.canonicalName);
  if (!taxonomy) throw new Error(`No taxonomy mapping for ${record.canonicalName}`);
  return {
    canonicalName: record.canonicalName,
    originDomain: `https://${record.originDomain}`,
    aliases: [...new Set([...(userProvidedAliases.get(record.canonicalName) ?? []), ...record.aliases])],
    officialOfferUrl: record.officialOfferUrl,
    officialStatusUrl: record.officialStatusUrl,
    sourceTitle: record.sourceTitle,
    sourceDate: record.sourceDate,
    observedExcerpt: record.excerpt,
    primarySegment: taxonomy[0],
    businessModelIds: taxonomy[1],
    entityStatus: record.canonicalName === "Sepal AI" ? "acquired_closed" : "unknown",
    caveat: record.caveat,
    confidence: record.confidence,
    duplicateOf: null,
    recordKind: "net_new",
  };
});
const normalized = [
  ...(supplementA.records ?? []),
  ...(supplementA.unresolved ?? []).map((record) => ({ ...record, recordKind: "unresolved" })),
  ...(supplementB.resolved ?? []),
  ...(supplementC.resolved ?? []),
  {
    canonicalName: argilla.canonicalName,
    originDomain: argilla.originDomain,
    aliases: argilla.aliases,
    officialOfferUrl: argilla.officialOfferUrl,
    officialStatusUrl: argilla.officialStatusUrl,
    sourceTitle: argilla.sourceTitle,
    sourceDate: argilla.sourceDate,
    observedExcerpt: argilla.observedOfficialPageExcerpt,
    primarySegment: "eval_observability_assurance",
    businessModelIds: ["eval_observability_saas", "managed_data_bpo"],
    entityStatus: "acquired_closed",
    caveat: argilla.acquisitionMaintenanceCaveat,
    confidence: "high",
    duplicateOf: null,
    recordKind: "net_new",
  },
  ...competitorRecords,
].map((record) => {
  const canonicalName = record.canonicalName ?? record.lead;
  const isDojo = canonicalName === "Dojo";
  const duplicateOf = record.duplicateOf ?? null;
  const recordKind = record.recordKind ?? (
    isDojo
      ? "product_alias"
      : duplicateOf
        ? "canonical_duplicate"
        : "net_new"
  );
  return {
    ...record,
    canonicalName,
    originDomain: record.originDomain?.startsWith("http")
      ? record.originDomain
      : record.originDomain
        ? `https://${record.originDomain}`
        : null,
    duplicateOf: isDojo ? "adj_chakra-labs" : duplicateOf,
    recordKind,
  };
});

const recordId = (record) => `adj_${String(record.canonicalName)
  .toLowerCase()
  .normalize("NFKD")
  .replace(/[^a-z0-9]+/g, "-")
  .replace(/^-|-$/g, "")}`;
const cutoffTreatment = (record) => {
  if (record.entityStatus === "acquired_closed") return "acquired_historical";
  if (record.sourceDate) return "historical_offer_only";
  return "time_unknown";
};
const addRecords = normalized
  .filter((record) => ["net_new", "product_alias"].includes(record.recordKind))
  .map((record) => ({
    adjacentId: recordId(record),
    inputRefs: [record.canonicalName],
    entityKind: record.recordKind === "product_alias"
      ? "product"
      : record.canonicalName === "Huzzle Labs"
        ? "business_unit"
        : "company",
    name: record.canonicalName,
    aliases: record.aliases ?? [],
    canonicalDomain: record.originDomain,
    primarySegment: record.primarySegment,
    businessModelIds: record.businessModelIds,
    entityStatus: record.entityStatus === "acquired_closed" ? "acquired_closed" : "unknown",
    sourceReportedStatus: record.entityStatus ?? "unknown",
    inclusionKind: record.inclusionKind ?? (record.canonicalName === "Argilla" ? "substitute" : "direct_supplier"),
    cutoffTreatment: cutoffTreatment(record),
    sourceCandidates: [...new Set([record.officialOfferUrl, record.officialStatusUrl].filter(Boolean))].map((canonicalUrl) => ({
      canonicalUrl,
      title: record.sourceTitle ?? `${record.canonicalName} official surface`,
      sourceDate: record.sourceDate ?? null,
      accessedAt: "2026-07-12",
    })),
    observationCandidates: [{
      excerpt: record.observedExcerpt,
      locator: null,
      observedAt: "2026-07-12",
      canonicalReady: false,
      note: "Candidate remains non-canonical until an exact locator is captured.",
    }],
    caveat: record.caveat ?? null,
    confidence: record.confidence ?? "low",
    relationshipIds: [],
  }));
const duplicateInputs = normalized
  .filter((record) => record.recordKind === "canonical_duplicate")
  .map((record) => ({ input: record.canonicalName, mergeInto: record.duplicateOf, observedAt: "2026-07-12" }));
const unresolved = normalized
  .filter((record) => record.recordKind === "unresolved")
  .map((record) => ({
    adjacentId: "adj_originator",
    input: record.canonicalName,
    candidateIdentity: record.candidateIdentity,
    evidenceUrls: record.officialEvidenceUrls,
    reason: record.reason,
    cutoffTreatment: "unresolved_identity",
  }));
const relationships = [
  { relationshipId: "rel_dojo-chakra", fromId: "adj_dojo", relation: "product_of", toId: "adj_chakra-labs" },
  { relationshipId: "rel_sepal-mercor", fromId: "adj_sepal-ai", relation: "acquired_by", toId: "co_mercor" },
  { relationshipId: "rel_argilla-hugging-face", fromId: "adj_argilla", relation: "acquired_by", toName: "Hugging Face" },
];
for (const relationship of relationships) {
  const record = addRecords.find((candidate) => candidate.adjacentId === relationship.fromId);
  if (record) record.relationshipIds.push(relationship.relationshipId);
}

writeFileSync(
  join(DEFAULT_ROOT, "research/migrations/supplemental-census-input.json"),
  `${JSON.stringify({
    version: 1,
    discoveredAt: "2026-07-12",
    evidenceCutoff: "2026-07-11",
    records: normalized,
  }, null, 2)}\n`,
  "utf8",
);
writeFileSync(
  join(DEFAULT_ROOT, "research/corpus/supplemental-adjacent.json"),
  `${JSON.stringify({
    schemaVersion: 1,
    evidenceCutoff: "2026-07-11",
    observedAt: "2026-07-12",
    records: addRecords,
    duplicateInputs,
    relationships,
    unresolved,
    reconciliation: {
      inputCount: normalized.length,
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
console.log(`EXA_INPUTS_IMPORTED files=${inputPaths.filter(existsSync).length} supplemental_records=${normalized.length}`);
