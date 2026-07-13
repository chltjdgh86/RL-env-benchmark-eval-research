import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { mkdirSync, mkdtempSync, readFileSync, rmSync, symlinkSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import test from "node:test";

import {
  DEFAULT_ROOT,
  loadCorpus,
  validateCorpus,
  validateMigration,
} from "./corpus-validator.mjs";
import { decodeHtmlEntities, escapeMarkdownText, markdownUrl, renderSourceRegistryEvidence } from "./render-utils.mjs";
import { classifyAccessBoundary, classifyNetworkTarget, classifyRedirect, resolveRedirectLocation } from "./link-audit-policy.mjs";
import { createPinnedLookup } from "./safe-http.mjs";

const clone = (value) => structuredClone(value);
const baseCorpus = loadCorpus(DEFAULT_ROOT);
const baseMigration = JSON.parse(
  readFileSync(join(DEFAULT_ROOT, "research/migrations/root-synthesis-seed.json"), "utf8"),
);
const codes = (errors) => new Set(errors.map((error) => error.code));
const hash = (value) => createHash("sha256").update(value).digest("hex");
const normalizedReceiptHash = (receipt) => {
  const candidate = receipt.candidateId.replaceAll("_", " ");
  const queryTemplates = receipt.queries.map((query) =>
    query
      .trim()
      .replaceAll(candidate, "{candidate}")
      .replaceAll(receipt.dimensionId, "{dimension}")
      .replace(/\s+/g, " ")
      .toLowerCase(),
  );
  return hash(JSON.stringify({
    kind: receipt.kind,
    queryTemplates,
    searchedDomainClasses: [...receipt.searchedDomainClasses].sort(),
  }));
};
const recalculateStrategyScore = (strategy) => {
  const weights = { pain: 20, willingnessToPay: 20, rightsAccess: 15, verifierFeasibility: 15, expertSupply: 10, freshnessBurden: 10, incumbentPressure: 10 };
  strategy.rawWeightedScore = Object.entries(strategy.dimensionCells).reduce(
    (total, [dimensionId, cell]) => total + cell.convertedScore * weights[dimensionId],
    0,
  ) / 5;
  strategy.roundedScore = Math.round((strategy.rawWeightedScore + Number.EPSILON) * 10) / 10;
};
const synthesizeMeasuredCell = (corpus, strategy, dimensionId, level = 2) => {
  const cell = strategy.dimensionCells[dimensionId];
  const claim = corpus.claims.find((item) => item.claimId === "clm_score-regulated-financial-operations-pain");
  const links = claim.evidenceLinks.filter((link) => ["supports", "partially_supports"].includes(link.supportRelation));
  cell.measuredLevel = level;
  cell.imputation = null;
  cell.effectiveRawLevel = level;
  cell.convertedScore = ["freshnessBurden", "incumbentPressure"].includes(dimensionId) ? 5 - level : level;
  cell.claimIds = [claim.claimId];
  cell.observationIds = links.map((link) => link.observationId);
  cell.missingReason = null;
  const positive = corpus.receipts.find((receipt) => receipt.id === cell.positiveSearchReceiptId);
  positive.sourceIds = links.map((link) => link.sourceId);
  positive.observationIds = links.map((link) => link.observationId);
  positive.closure = "evidence_found";
  positive.searchedAt = "2026-07-11";
  positive.findings = "Fixture retains an auditable supporting source.";
  recalculateStrategyScore(strategy);
  return { cell, positive };
};
const setCandidateLevels = (corpus, strategy, levels, { preserve = [] } = {}) => {
  for (const [dimensionId, level] of Object.entries(levels)) {
    if (preserve.includes(dimensionId)) continue;
    synthesizeMeasuredCell(corpus, strategy, dimensionId, level);
  }
  strategy.rightsBlocker = false;
  recalculateStrategyScore(strategy);
};

test("the canonical corpus fixture is valid", () => {
  assert.deepEqual(validateCorpus(baseCorpus), []);
  assert.deepEqual(validateMigration(baseMigration, baseCorpus, DEFAULT_ROOT), []);
});

test("only positively supported score cells are measured", () => {
  const claims = new Map(baseCorpus.claims.map((claim) => [claim.claimId, claim]));
  const unsupportedMeasured = baseCorpus.strategies
    .filter((strategy) => strategy.strategyType === "vertical_candidate")
    .flatMap((strategy) =>
      Object.entries(strategy.dimensionCells).filter(([, cell]) =>
        cell.measuredLevel !== null && !cell.claimIds.some((claimId) =>
          claims.get(claimId)?.evidenceLinks.some((link) =>
            ["supports", "partially_supports"].includes(link.supportRelation),
          ),
        ),
      ),
    );
  assert.deepEqual(unsupportedMeasured, []);
});

test("canonical positive links are claim-specific Exa observations with no cross-claim reuse", () => {
  const positiveLinks = baseCorpus.claims.flatMap((claim) => claim.evidenceLinks
    .filter((link) => ["supports", "partially_supports"].includes(link.supportRelation))
    .map((link) => ({ claimId: claim.claimId, ...link })));
  assert.equal(positiveLinks.length, 64);
  assert.ok(positiveLinks.every((link) => link.observationId.startsWith("obs_exa-")));
  assert.equal(new Set(positiveLinks.map((link) => link.observationId)).size, positiveLinks.length);
});

test("Exa paragraph locators are exact captured excerpts, not locally authored ledger labels", () => {
  const snapshot = JSON.parse(readFileSync(join(DEFAULT_ROOT, "research/migrations/source-locator-snapshots.json"), "utf8"));
  const exaParagraphs = snapshot.entries.filter((entry) => entry.captureMethod === "exa-fetched-exact-excerpt" && entry.locator.kind === "paragraph");
  assert.ok(exaParagraphs.length > 0);
  assert.ok(exaParagraphs.every((entry) => entry.locator.value === entry.excerpt));
});

test("the canonical scorecard has 32 measured and three conservatively missing cells with auditable search provenance", () => {
  const cells = baseCorpus.strategies
    .filter((strategy) => strategy.strategyType === "vertical_candidate")
    .flatMap((strategy) => Object.values(strategy.dimensionCells));
  const measured = cells.filter((cell) => cell.measuredLevel !== null);
  const missing = cells.filter((cell) => cell.measuredLevel === null);
  assert.equal(measured.length, 32);
  assert.equal(missing.length, 3);
  for (const cell of cells) {
    const positive = baseCorpus.receipts.find((receipt) => receipt.id === cell.positiveSearchReceiptId);
    const negative = baseCorpus.receipts.find((receipt) => receipt.id === cell.negativeSearchReceiptId);
    assert.equal(positive.searchedAt, "2026-07-12");
    assert.equal(negative.searchedAt, "2026-07-12");
    assert.notEqual(positive.closure, "open_unverified");
    assert.notEqual(negative.closure, "open_unverified");
  }
});

test("a measured cell loses validity when its positive support is downgraded", () => {
  const corpus = clone(baseCorpus);
  const strategy = corpus.strategies.find((item) =>
    item.strategyType === "vertical_candidate",
  );
  const { cell } = synthesizeMeasuredCell(corpus, strategy, "pain");
  const claim = corpus.claims.find((item) => item.claimId === cell.claimIds[0]);
  for (const link of claim.evidenceLinks) link.supportRelation = "context_only";
  assert.ok(codes(validateCorpus(corpus)).has("MEASURED_CELL_LACKS_POSITIVE_SUPPORT"));
});

test("measured cells require dated terminal receipts and retained score evidence", async (t) => {
  await t.test("open receipt", () => {
    const corpus = clone(baseCorpus);
    const strategy = corpus.strategies.find((item) => item.strategyType === "vertical_candidate");
    const { positive } = synthesizeMeasuredCell(corpus, strategy, "pain");
    positive.closure = "open_unverified";
    positive.searchedAt = null;
    assert.ok(codes(validateCorpus(corpus)).has("MEASURED_CELL_RECEIPT_CLOSURE"));
  });
  await t.test("source mismatch", () => {
    const corpus = clone(baseCorpus);
    const strategy = corpus.strategies.find((item) => item.strategyType === "vertical_candidate");
    const cell = strategy.dimensionCells.pain;
    const positive = corpus.receipts.find((receipt) => receipt.id === cell.positiveSearchReceiptId);
    positive.sourceIds = positive.sourceIds.slice(1);
    positive.observationIds = positive.observationIds.slice(1);
    assert.ok(codes(validateCorpus(corpus)).has("MEASURED_CELL_RECEIPT_EVIDENCE_MISMATCH"));
  });
});

test("a synthetic high score cannot win while receipt lanes remain open", () => {
  const corpus = clone(baseCorpus);
  const strategy = corpus.strategies.find((item) => item.strategyType === "vertical_candidate");
  for (const dimensionId of Object.keys(strategy.dimensionCells)) {
    synthesizeMeasuredCell(corpus, strategy, dimensionId, ["freshnessBurden", "incumbentPressure"].includes(dimensionId) ? 0 : 5);
  }
  const openReceipt = corpus.receipts.find((receipt) => receipt.id === strategy.dimensionCells.pain.negativeSearchReceiptId);
  openReceipt.closure = "open_unverified";
  openReceipt.searchedAt = null;
  strategy.rightsBlocker = false;
  strategy.qualificationFailures = [];
  strategy.decisionStatus = "winner";
  recalculateStrategyScore(strategy);
  assert.ok(codes(validateCorpus(corpus)).has("VERTICAL_RECEIPT_GATE_NOT_ENFORCED"));
});

test("terminal negative receipt lanes require an execution date before a candidate can win", () => {
  const corpus = clone(baseCorpus);
  const strategy = corpus.strategies.find((item) => item.strategyType === "vertical_candidate");
  for (const dimensionId of Object.keys(strategy.dimensionCells)) {
    const { cell } = synthesizeMeasuredCell(corpus, strategy, dimensionId, ["freshnessBurden", "incumbentPressure"].includes(dimensionId) ? 0 : 5);
    const negative = corpus.receipts.find((receipt) => receipt.id === cell.negativeSearchReceiptId);
    negative.closure = "no_public_evidence";
    negative.sourceIds = ["src_s39"];
    negative.observationIds = ["obs_s39"];
    negative.searchedAt = null;
  }
  strategy.rightsBlocker = false;
  strategy.qualificationFailures = [];
  strategy.decisionStatus = "winner";
  recalculateStrategyScore(strategy);
  const result = codes(validateCorpus(corpus));
  assert.ok(result.has("UNDATED_SEARCH_CLOSURE"));
  assert.ok(result.has("VERTICAL_RECEIPT_GATE_NOT_ENFORCED"));
});

test("open receipt lanes must remain an explicit qualification failure", () => {
  const corpus = clone(baseCorpus);
  const strategy = corpus.strategies.find((item) => item.strategyType === "vertical_candidate");
  const openReceipt = corpus.receipts.find((receipt) => receipt.id === strategy.dimensionCells.pain.positiveSearchReceiptId);
  openReceipt.closure = "open_unverified";
  openReceipt.searchedAt = null;
  strategy.qualificationFailures = strategy.qualificationFailures.filter((failure) => failure !== "auditable_receipt_closure_gate");
  assert.ok(codes(validateCorpus(corpus)).has("VERTICAL_RECEIPT_GATE_NOT_ENFORCED"));
});

test("a 74-point candidate cannot win when it lacks two buyer or procurement observations", () => {
  const corpus = clone(baseCorpus);
  const strategy = corpus.strategies.find((item) =>
    item.strategyType === "vertical_candidate" && item.verticalCandidateId === "regulated_financial_operations",
  );
  setCandidateLevels(corpus, strategy, {
    pain: 4,
    willingnessToPay: 5,
    rightsAccess: 3,
    verifierFeasibility: 3,
    expertSupply: 4,
    freshnessBurden: 2,
    incumbentPressure: 2,
  });
  assert.equal(strategy.rawWeightedScore, 74);
  strategy.qualificationFailures = [];
  strategy.decisionStatus = "winner";
  const result = codes(validateCorpus(corpus));
  assert.ok(result.has("VERTICAL_BUYER_GATE_NOT_ENFORCED"));
  assert.ok(result.has("VERTICAL_QUALIFICATION_FAILURE_MISMATCH"));
  assert.ok(result.has("VERTICAL_DECISION_MISMATCH"));
});

test("a 70-point candidate cannot win with only an eight-point lead", () => {
  const corpus = clone(baseCorpus);
  const strategy = corpus.strategies.find((item) =>
    item.strategyType === "vertical_candidate" && item.verticalCandidateId === "healthcare_administration",
  );
  setCandidateLevels(corpus, strategy, {
    pain: 4,
    willingnessToPay: 4,
    rightsAccess: 3,
    verifierFeasibility: 3,
    expertSupply: 4,
    freshnessBurden: 2,
    incumbentPressure: 2,
  }, { preserve: ["willingnessToPay"] });
  const publicCandidate = corpus.strategies.find((item) =>
    item.strategyType === "vertical_candidate" && item.verticalCandidateId === "public_sector_administration",
  );
  synthesizeMeasuredCell(corpus, publicCandidate, "expertSupply", 2);
  recalculateStrategyScore(publicCandidate);
  assert.equal(strategy.rawWeightedScore, 70);
  assert.equal(Math.max(...corpus.strategies.filter((item) => item.strategyType === "vertical_candidate" && item !== strategy).map((item) => item.rawWeightedScore)), 62);
  strategy.qualificationFailures = [];
  strategy.decisionStatus = "winner";
  const result = codes(validateCorpus(corpus));
  assert.ok(result.has("VERTICAL_WINNER_LEAD_NOT_ENFORCED"));
  assert.ok(result.has("VERTICAL_DECISION_MISMATCH"));
});

test("the exact tie order prefers willingness to pay before later dimensions and lexical ID", () => {
  const corpus = clone(baseCorpus);
  const healthcare = corpus.strategies.find((item) =>
    item.strategyType === "vertical_candidate" && item.verticalCandidateId === "healthcare_administration",
  );
  const enterprise = corpus.strategies.find((item) =>
    item.strategyType === "vertical_candidate" && item.verticalCandidateId === "enterprise_software_support",
  );
  setCandidateLevels(corpus, healthcare, {
    pain: 4,
    willingnessToPay: 4,
    rightsAccess: 3,
    verifierFeasibility: 3,
    expertSupply: 4,
    freshnessBurden: 2,
    incumbentPressure: 2,
  }, { preserve: ["willingnessToPay"] });
  setCandidateLevels(corpus, enterprise, {
    pain: 3,
    willingnessToPay: 5,
    rightsAccess: 3,
    verifierFeasibility: 3,
    expertSupply: 4,
    freshnessBurden: 2,
    incumbentPressure: 2,
  }, { preserve: ["willingnessToPay"] });
  assert.equal(healthcare.rawWeightedScore, 70);
  assert.equal(enterprise.rawWeightedScore, 70);
  healthcare.qualificationFailures = [];
  healthcare.decisionStatus = "winner";
  enterprise.qualificationFailures = [];
  enterprise.decisionStatus = "no_go";
  assert.ok(codes(validateCorpus(corpus)).has("VERTICAL_DECISION_MISMATCH"));
});

test("schema preflight turns null corpus items into errors instead of exceptions", async (t) => {
  const mutations = [
    ["source", (corpus) => { corpus.sources[0] = null; }],
    ["observation", (corpus) => { corpus.observations[0] = null; }],
    ["company", (corpus) => { corpus.companies[0] = null; }],
    ["strategy", (corpus) => { corpus.strategies[0] = null; }],
    ["receipt", (corpus) => { corpus.receipts[0] = null; }],
    ["evidence link", (corpus) => { corpus.claims[0].evidenceLinks[0] = null; }],
  ];
  for (const [name, mutate] of mutations) {
    await t.test(name, () => {
      const corpus = clone(baseCorpus);
      mutate(corpus);
      let errors;
      assert.doesNotThrow(() => { errors = validateCorpus(corpus); });
      assert.ok(codes(errors).has("JSON_SCHEMA_VALIDATION"));
    });
  }
});

test("runtime validation rejects schema-level type and format mutations", async (t) => {
  const cases = [
    ["blank observer group", (corpus) => { corpus.observations[0].observerGroup = " "; }],
    ["non-HTTPS final URL", (corpus) => { corpus.sources[0].lastLinkCheck.finalUrl = "javascript:alert(1)"; }],
    ["ill-formed source URL", (corpus) => { corpus.sources[0].canonicalUrl = "https://example.com/\ud800"; }],
    ["malformed company domain", (corpus) => { corpus.companies[0].canonicalDomain = "https://scale.com/path"; }],
    ["malformed adjacent domain", (corpus) => { corpus.adjacent[0].canonicalDomain = "https://example.com/) <img>"; }],
    ["non-array affiliations", (corpus) => { corpus.sources[0].publisherAffiliations = {}; }],
    ["malformed strategy ID", (corpus) => { corpus.strategies[0].strategyId = "strategy invalid"; }],
    ["schema-only blank company name", (corpus) => { corpus.companies[0].name = ""; }],
  ];
  for (const [name, mutate] of cases) {
    await t.test(name, () => {
      const corpus = clone(baseCorpus);
      mutate(corpus);
      const errors = validateCorpus(corpus);
      assert.ok(errors.length > 0);
      if (name.startsWith("schema-only")) {
        assert.ok(codes(errors).has("JSON_SCHEMA_VALIDATION"));
      }
    });
  }
});

test("the generated observation schema requires a non-null excerpt", () => {
  const schema = JSON.parse(
    readFileSync(join(DEFAULT_ROOT, "research/schemas/corpus.schema.json"), "utf8"),
  );
  assert.equal(schema.$defs.observation.properties.excerpt.type, "string");
  assert.equal(schema.$defs.observation.properties.excerpt.minLength, 1);
});

test("strategy research receipts are derived and auditable", () => {
  const cells = new Map();
  for (const strategy of baseCorpus.strategies.filter((item) => item.strategyType === "vertical_candidate")) {
    for (const [dimensionId, cell] of Object.entries(strategy.dimensionCells)) {
      cells.set(`${strategy.verticalCandidateId}|${dimensionId}`, cell);
    }
  }
  const claims = new Map(baseCorpus.claims.map((claim) => [claim.claimId, claim]));
  const terminalClosures = new Set(["evidence_found", "no_public_evidence", "rights_blocker", "duplicate", "dead"]);
  for (const receipt of baseCorpus.receipts) {
    assert.equal(receipt.searchedAt, "2026-07-12");
    assert.equal(receipt.cutoffAt, "2026-07-11");
    assert.ok(receipt.queries.every((query) => query.trim() !== ""));
    assert.ok(receipt.findings.trim() !== "");
    assert.equal(receipt.templateHash, normalizedReceiptHash(receipt));
    assert.ok(receipt.searchedDomainClasses.length > 0);
    assert.ok(terminalClosures.has(receipt.closure));
    if (["evidence_found", "rights_blocker"].includes(receipt.closure)) assert.ok(receipt.sourceIds.length > 0);
    if (receipt.sourceIds.length === 0) {
      assert.equal(receipt.closure, "no_public_evidence");
    }
  }
  for (const cell of cells.values()) {
    const positive = baseCorpus.receipts.find((receipt) => receipt.id === cell.positiveSearchReceiptId);
    const negative = baseCorpus.receipts.find((receipt) => receipt.id === cell.negativeSearchReceiptId);
    assert.deepEqual(positive.observationIds.filter((observationId) => negative.observationIds.includes(observationId)), []);
    if (cell.measuredLevel !== null) {
      const retained = new Set([...positive.sourceIds, ...negative.sourceIds]);
      const claimSources = cell.claimIds.flatMap((claimId) => (claims.get(claimId)?.evidenceLinks ?? []).filter((link) => ["supports", "partially_supports"].includes(link.supportRelation)).map((link) => link.sourceId));
      assert.ok(claimSources.every((sourceId) => retained.has(sourceId)));
    }
  }
});

test("receipt validator rejects forged audit fields", async (t) => {
  const mutations = [
    ["template hash", "SEARCH_TEMPLATE_HASH_MISMATCH", (receipt) => { receipt.templateHash = "0".repeat(64); }],
    ["blank query", "BLANK_SEARCH_QUERY", (receipt) => { receipt.queries = [""]; }],
    ["blank finding", "BLANK_SEARCH_FINDING", (receipt) => { receipt.findings = " "; }],
    ["invalid domain class", "INVALID_ENUM", (receipt) => { receipt.searchedDomainClasses = ["not_a_domain_class"]; }],
  ];
  for (const [name, expectedCode, mutate] of mutations) {
    await t.test(name, () => {
      const corpus = clone(baseCorpus);
      mutate(corpus.receipts[0]);
      assert.ok(codes(validateCorpus(corpus)).has(expectedCode));
    });
  }
});

test("receipt sources and observations must form an exact bijection", () => {
  const corpus = clone(baseCorpus);
  const receipt = corpus.receipts[0];
  receipt.sourceIds = ["src_s58", "src_s59"];
  receipt.observationIds = ["obs_s58", "obs_s58"];
  assert.ok(codes(validateCorpus(corpus)).has("RECEIPT_SOURCE_OBSERVATION_MISMATCH"));
});

test("unknown source IDs are rejected", () => {
  const corpus = clone(baseCorpus);
  corpus.claims[0].evidenceLinks[0].sourceId = "src_missing";
  assert.ok(codes(validateCorpus(corpus)).has("UNKNOWN_SOURCE_ID"));
});

test("unmapped seed sources and claims are rejected", () => {
  const migration = clone(baseMigration);
  migration.sourceMappings[0].canonicalSourceId = null;
  migration.sourceMappings[0].disposition = null;
  migration.claimMappings[0].canonicalClaimIds = [];
  migration.claimMappings[0].disposition = null;
  const result = codes(validateMigration(migration, baseCorpus, DEFAULT_ROOT));
  assert.ok(result.has("UNMAPPED_SEED_SOURCE"));
  assert.ok(result.has("UNMAPPED_SEED_CLAIM"));
});

test("migration validation reports malformed shapes instead of throwing", () => {
  let errors;
  assert.doesNotThrow(() => { errors = validateMigration(null, baseCorpus, DEFAULT_ROOT); });
  assert.ok(codes(errors).has("INVALID_MIGRATION_SHAPE"));
  const migration = clone(baseMigration);
  migration.claimMappings[0].canonicalClaimIds = null;
  assert.ok(codes(validateMigration(migration, baseCorpus, DEFAULT_ROOT)).has("INVALID_MIGRATION_SHAPE"));
  const corpus = clone(baseCorpus);
  corpus.observations[0] = null;
  assert.doesNotThrow(() => { errors = validateMigration(baseMigration, corpus, DEFAULT_ROOT); });
  assert.ok(codes(errors).has("INVALID_MIGRATION_SHAPE"));
  const linkedCorpus = clone(baseCorpus);
  linkedCorpus.claims[0].evidenceLinks[0] = null;
  assert.doesNotThrow(() => { errors = validateMigration(baseMigration, linkedCorpus, DEFAULT_ROOT); });
  assert.ok(codes(errors).has("INVALID_MIGRATION_SHAPE"));
});

test("migration manifest paths cannot escape the workspace root", () => {
  const migration = clone(baseMigration);
  migration.inputManifests[0].path = "../outside-research.txt";
  assert.ok(codes(validateMigration(migration, baseCorpus, DEFAULT_ROOT)).has("MIGRATION_PATH_OUTSIDE_ROOT"));
  const sandbox = mkdtempSync(join(tmpdir(), "corpus-migration-root-"));
  try {
    const isolatedRoot = join(sandbox, "root");
    const outsideRoot = join(sandbox, "outside");
    mkdirSync(isolatedRoot);
    mkdirSync(outsideRoot);
    symlinkSync(outsideRoot, join(isolatedRoot, "escape"));
    const symlinkParent = clone(baseMigration);
    symlinkParent.inputManifests[0].path = "escape/definitely-missing-probe";
    assert.ok(codes(validateMigration(symlinkParent, baseCorpus, isolatedRoot)).has("MIGRATION_PATH_OUTSIDE_ROOT"));
  } finally {
    rmSync(sandbox, { recursive: true, force: true });
  }
  const directoryPath = clone(baseMigration);
  directoryPath.inputManifests[0].path = ".";
  assert.doesNotThrow(() => validateMigration(directoryPath, baseCorpus, DEFAULT_ROOT));
  assert.ok(codes(validateMigration(directoryPath, baseCorpus, DEFAULT_ROOT)).has("MIGRATION_INPUT_NOT_FILE"));
});

test("an adjacent current offer cannot rely on an unavailable source without degradation", () => {
  const corpus = clone(baseCorpus);
  const record = corpus.adjacent[0];
  const claim = corpus.claims.find((candidate) => candidate.claimId === record.currentOfferClaimId);
  const source = corpus.sources.find((candidate) => candidate.sourceId === claim.evidenceLinks[0].sourceId);
  source.access = "unavailable";
  assert.ok(codes(validateCorpus(corpus)).has("MISSING_ADJACENT_CURRENT_SOURCE"));
});

test("missing, duplicate, mismatched, and orphan search receipts are rejected", async (t) => {
  await t.test("missing", () => {
    const corpus = clone(baseCorpus);
    corpus.receipts.shift();
    assert.ok(codes(validateCorpus(corpus)).has("MISSING_SEARCH_RECEIPT"));
  });
  await t.test("duplicate", () => {
    const corpus = clone(baseCorpus);
    corpus.receipts.push(clone(corpus.receipts[0]));
    assert.ok(codes(validateCorpus(corpus)).has("DUPLICATE_SEARCH_RECEIPT"));
  });
  await t.test("mismatched", () => {
    const corpus = clone(baseCorpus);
    corpus.receipts[0].candidateId = "insurance_operations";
    assert.ok(codes(validateCorpus(corpus)).has("MISMATCHED_SEARCH_RECEIPT"));
  });
  await t.test("orphan", () => {
    const corpus = clone(baseCorpus);
    corpus.receipts[0].id = "rr-orphan-fixture";
    assert.ok(codes(validateCorpus(corpus)).has("ORPHAN_SEARCH_RECEIPT"));
  });
});

test("nonconservative missing imputation is rejected", () => {
  const corpus = clone(baseCorpus);
  const candidate = corpus.strategies.find(
    (strategy) =>
      strategy.strategyType === "vertical_candidate" &&
      strategy.verticalCandidateId === "insurance_operations",
  );
  assert.equal(candidate.dimensionCells.rightsAccess.measuredLevel, null);
  candidate.dimensionCells.rightsAccess.effectiveRawLevel = 1;
  assert.ok(codes(validateCorpus(corpus)).has("NONCONSERVATIVE_MISSING_IMPUTATION"));
});

test("a missing archetype response is rejected", () => {
  const corpus = clone(baseCorpus);
  const index = corpus.strategies.findIndex(
    (strategy) =>
      strategy.strategyType === "competitor_response" &&
      strategy.archetypeId === "ax_transformation_consultancy",
  );
  corpus.strategies.splice(index, 1);
  assert.ok(codes(validateCorpus(corpus)).has("MISSING_COMPETITOR_RESPONSE_TARGET"));
});

test("aligned and republication evidence cannot be counted as independent", () => {
  const corpus = clone(baseCorpus);
  const claim = corpus.claims.find(
    (candidate) => candidate.evidenceLinks[0]?.claimAlignment === "subject_controlled",
  );
  claim.evidenceLinks[0].claimAlignment = "republication_same_chain";
  claim.independentGroupCount = 1;
  const result = codes(validateCorpus(corpus));
  assert.ok(result.has("INDEPENDENCE_COUNT_MISMATCH"));
  assert.ok(result.has("ALIGNED_SOURCE_COUNTED_INDEPENDENT"));
});

test("claim alignment and independence groups must be derived from the linked source", () => {
  const corpus = clone(baseCorpus);
  const claim = corpus.claims.find((candidate) => candidate.claimId === "clm_scale-ai-current-offer");
  claim.evidenceLinks[0].claimAlignment = "editorial_independent";
  claim.evidenceLinks[0].independenceGroup = "editorial_independent:forged.example";
  claim.independentGroupCount = 1;
  const result = codes(validateCorpus(corpus));
  assert.ok(result.has("CLAIM_ALIGNMENT_SOURCE_MISMATCH"));
  assert.ok(result.has("INDEPENDENCE_GROUP_SOURCE_MISMATCH"));
});

test("one observation-source pair cannot be duplicated into independent evidence", () => {
  const corpus = clone(baseCorpus);
  const claim = corpus.claims.find((candidate) => candidate.claimId === "clm_scale-ai-risk");
  const duplicate = clone(claim.evidenceLinks[0]);
  duplicate.independenceGroup = "editorial_independent:forged-second-group.example";
  claim.evidenceLinks.push(duplicate);
  claim.independentGroupCount += 1;
  const result = codes(validateCorpus(corpus));
  assert.ok(result.has("DUPLICATE_CLAIM_EVIDENCE_PAIR"));
  assert.ok(result.has("INDEPENDENCE_GROUP_SOURCE_MISMATCH"));
});

test("one publisher chain cannot split independence across subdomains", () => {
  const corpus = clone(baseCorpus);
  const source = corpus.sources.find((candidate) => candidate.sourceId === "src_s07");
  source.publisher = "Bloomberg Law";
  source.canonicalUrl = "https://opinion.bloomberglaw.com/scale";
  source.lastLinkCheck.finalUrl = source.canonicalUrl;
  for (const claim of corpus.claims) {
    for (const link of claim.evidenceLinks.filter((candidate) => candidate.sourceId === source.sourceId)) {
      link.independenceGroup = "editorial_independent:opinion.bloomberglaw.com";
    }
  }
  assert.ok(codes(validateCorpus(corpus)).has("INDEPENDENCE_GROUP_SOURCE_MISMATCH"));
  const academic = clone(baseCorpus);
  const sourceClone = { ...clone(academic.sources.find((source) => source.sourceId === "src_s38")), sourceId: "src_academic-duplicate" };
  academic.sources.push(sourceClone);
  assert.ok(codes(validateCorpus(academic)).has("DUPLICATE_SOURCE_URL"));
});

test("locally authored titles and null excerpts cannot masquerade as exact locators", () => {
  const corpus = clone(baseCorpus);
  const observation = corpus.observations[0];
  const source = corpus.sources.find((candidate) => candidate.sourceId === observation.sourceId);
  observation.locator = { kind: "html_heading", value: source.title };
  observation.excerpt = null;
  const result = codes(validateCorpus(corpus));
  assert.ok(result.has("PSEUDO_LOCATOR_SOURCE_TITLE"));
  assert.ok(result.has("NULL_OR_EMPTY_LOCATOR_EVIDENCE"));
});

test("interstitial locator text is rejected", () => {
  // Given an otherwise valid observation whose locator is an anti-bot page.
  const corpus = clone(baseCorpus);
  corpus.observations[0].locator = {
    kind: "html_heading",
    value: "H1 — Pardon Our Interruption",
  };

  // When the canonical corpus is validated.
  const result = codes(validateCorpus(corpus));

  // Then the locator cannot be treated as evidence.
  assert.ok(result.has("INTERSTITIAL_LOCATOR_TEXT"));
});

test("interstitial excerpt text is rejected", () => {
  // Given an otherwise valid observation whose excerpt is an access-denial page.
  const corpus = clone(baseCorpus);
  corpus.observations[0].excerpt = "Access Denied";

  // When the canonical corpus is validated.
  const result = codes(validateCorpus(corpus));

  // Then the excerpt cannot be treated as evidence.
  assert.ok(result.has("INTERSTITIAL_EXCERPT_TEXT"));
});

test("open access is rejected for a transport-only capture", () => {
  // Given a source whose snapshot contains transport metadata rather than page content.
  const corpus = clone(baseCorpus);
  const source = corpus.sources.find((candidate) => candidate.sourceId === "src_s46");
  source.access = "open";

  // When snapshot migration integrity is validated.
  const result = codes(validateMigration(baseMigration, corpus, DEFAULT_ROOT));

  // Then transport-only capture cannot satisfy open access.
  assert.ok(result.has("OPEN_ACCESS_FOR_TRANSPORT_CAPTURE"));
});

test("transport-only captures cannot positively support claims", () => {
  // Given a positive relationship to a transport-only snapshot.
  const corpus = clone(baseCorpus);
  const claim = corpus.claims.find((candidate) =>
    candidate.evidenceLinks.some((link) => link.sourceId === "src_s46"),
  );
  const link = claim.evidenceLinks.find((candidate) => candidate.sourceId === "src_s46");
  link.supportRelation = "supports";

  // When snapshot migration integrity is validated.
  const result = codes(validateMigration(baseMigration, corpus, DEFAULT_ROOT));

  // Then transport metadata cannot entail the claim.
  assert.ok(result.has("TRANSPORT_CAPTURE_USED_AS_SUPPORT"));
});

test("publisher affiliations reject industry, analysis, and strategy entity types", () => {
  const corpus = clone(baseCorpus);
  corpus.sources[0].publisherAffiliations.push({
    entityRef: "ind_rlhf",
    relationship: "commercial_partner",
    validFrom: null,
    validTo: null,
  });
  assert.ok(codes(validateCorpus(corpus)).has("INVALID_AFFILIATION_ENTITY_TYPE"));
});

test("migration rejects a factual root file in place of the claim-free pointer", () => {
  const migration = clone(baseMigration);
  migration.rootPointer.sha256 = "0".repeat(64);
  assert.ok(
    codes(validateMigration(migration, baseCorpus, DEFAULT_ROOT)).has("ROOT_POINTER_INVALID"),
  );
});

test("seed migration does not map a line merely because it names a company", () => {
  const mercorFinanceLine = baseMigration.claimMappings.find((mapping) => mapping.lineNumber === 123);
  assert.ok(mercorFinanceLine);
  assert.deepEqual(mercorFinanceLine.canonicalClaimIds, []);
  assert.notEqual(mercorFinanceLine.disposition, null);
});

test("seed migration validates line hashes and its derived summary", async (t) => {
  await t.test("line hash", () => {
    const migration = clone(baseMigration);
    migration.claimMappings[0].contentHash = "0".repeat(64);
    assert.ok(codes(validateMigration(migration, baseCorpus, DEFAULT_ROOT)).has("SEED_LINE_HASH_MISMATCH"));
  });
  await t.test("summary", () => {
    const migration = clone(baseMigration);
    migration.summary.openLeadCount += 1;
    assert.ok(codes(validateMigration(migration, baseCorpus, DEFAULT_ROOT)).has("MIGRATION_SUMMARY_MISMATCH"));
  });
});

test("seed source mappings require unique URL-matched canonical targets", async (t) => {
  await t.test("swapped targets", () => {
    const migration = clone(baseMigration);
    [migration.sourceMappings[0].canonicalSourceId, migration.sourceMappings[1].canonicalSourceId] =
      [migration.sourceMappings[1].canonicalSourceId, migration.sourceMappings[0].canonicalSourceId];
    assert.ok(codes(validateMigration(migration, baseCorpus, DEFAULT_ROOT)).has("SEED_SOURCE_TARGET_URL_MISMATCH"));
  });
  await t.test("duplicate target", () => {
    const migration = clone(baseMigration);
    migration.sourceMappings[1].canonicalSourceId = migration.sourceMappings[0].canonicalSourceId;
    assert.ok(codes(validateMigration(migration, baseCorpus, DEFAULT_ROOT)).has("DUPLICATE_SEED_SOURCE_TARGET"));
  });
  await t.test("duplicate seed row", () => {
    const migration = clone(baseMigration);
    migration.sourceMappings.push({
      ...clone(migration.sourceMappings[0]),
      canonicalSourceId: null,
      disposition: "duplicate",
    });
    migration.summary.seedSourceCount += 1;
    migration.summary.rejectedSeedClaimAnchorCount = migration.claimMappings.filter((mapping) => mapping.disposition !== null).length;
    assert.ok(codes(validateMigration(migration, baseCorpus, DEFAULT_ROOT)).has("DUPLICATE_SEED_SOURCE_MAPPING"));
  });
});

test("unrelated current-offer redirects are degraded", () => {
  const source = baseCorpus.sources.find((item) => item.sourceId === "src_adj-predibase");
  const record = baseCorpus.adjacent.find((item) => item.adjacentId === "adj_predibase");
  const claim = baseCorpus.claims.find((item) => item.claimId === record.currentOfferClaimId);
  assert.notEqual(source.access, "open");
  assert.equal(claim.temporal, "unknown");
  assert.ok(claim.evidenceLinks.every((link) => link.supportRelation === "context_only"));
  const inclusion = baseCorpus.claims.find((item) => item.claimId === record.inclusionClaimId);
  assert.equal(inclusion.temporal, "unknown");
  assert.ok(inclusion.evidenceLinks.every((link) => link.supportRelation === "context_only"));
  const snapshot = JSON.parse(readFileSync(join(DEFAULT_ROOT, "research/migrations/source-locator-snapshots.json"), "utf8"));
  const entry = snapshot.entries.find((item) => item.sourceId === "src_adj-predibase");
  assert.match(entry.captureMethod, /^transport-/);
  assert.doesNotMatch(entry.excerpt, /Unleash Agents/i);
});

test("title-only Epoch observation cannot positively support claims", () => {
  const positive = baseCorpus.claims.filter((claim) => claim.evidenceLinks.some((link) =>
    link.sourceId === "src_s47" && ["supports", "partially_supports"].includes(link.supportRelation),
  ));
  assert.deepEqual(positive, []);
});

test("inaccessible search-index-only captures remain discovery context rather than positive support", () => {
  const snapshot = JSON.parse(readFileSync(join(DEFAULT_ROOT, "research/migrations/source-locator-snapshots.json"), "utf8"));
  const searchIndexedSourceIds = new Set(snapshot.entries
    .filter((entry) => entry.status >= 400 && entry.captureMethod.startsWith("search-indexed-"))
    .map((entry) => entry.sourceId));
  const positive = baseCorpus.claims.flatMap((claim) => claim.evidenceLinks.filter((link) =>
    searchIndexedSourceIds.has(link.sourceId) && ["supports", "partially_supports"].includes(link.supportRelation),
  ));
  assert.deepEqual(positive, []);

  const corpus = clone(baseCorpus);
  const claim = corpus.claims.find((candidate) =>
    candidate.evidenceLinks.some((link) => searchIndexedSourceIds.has(link.sourceId)),
  );
  const link = claim.evidenceLinks.find((candidate) => searchIndexedSourceIds.has(candidate.sourceId));
  link.supportRelation = "supports";
  assert.ok(codes(validateMigration(baseMigration, corpus, DEFAULT_ROOT)).has("SEARCH_INDEX_CAPTURE_USED_AS_SUPPORT"));
});

test("subject affiliations and reporting subdomains preserve source-control semantics", () => {
  const taskUs = baseCorpus.sources.find((source) => source.sourceId === "src_s53");
  const bloombergLaw = baseCorpus.sources.find((source) => source.sourceId === "src_s06");
  assert.equal(taskUs.control, "subject_controlled");
  assert.equal(taskUs.sourceType, "company_first_party");
  assert.equal(bloombergLaw.control, "independent");
  assert.equal(bloombergLaw.sourceType, "independent_reporting");
  assert.equal(bloombergLaw.publisher, "Bloomberg Law");
  for (const source of baseCorpus.sources) {
    if (source.publisherAffiliations.some((affiliation) => affiliation.relationship === "subject")) {
      assert.equal(source.control, "subject_controlled");
    }
  }
  const corpus = clone(baseCorpus);
  const forged = corpus.sources.find((source) => source.sourceId === "src_s03");
  forged.sourceType = "independent_reporting";
  assert.ok(codes(validateCorpus(corpus)).has("SOURCE_TYPE_CONTROL_MISMATCH"));
  const affiliated = clone(baseCorpus);
  affiliated.sources.find((source) => source.sourceId === "src_s06").publisherAffiliations.push({
    entityRef: "co_scale-ai",
    relationship: "investor",
    validFrom: null,
    validTo: null,
  });
  const affiliationErrors = codes(validateCorpus(affiliated));
  assert.ok(affiliationErrors.has("AFFILIATION_CONTROL_MISMATCH"));
  assert.ok(affiliationErrors.has("CLAIM_ALIGNMENT_SOURCE_MISMATCH"));
  const syndicated = clone(baseCorpus);
  syndicated.sources.find((source) => source.sourceId === "src_s07").publisherAffiliations.push({
    entityRef: "src_s06",
    relationship: "syndicator",
    validFrom: null,
    validTo: null,
  });
  assert.ok(codes(validateCorpus(syndicated)).has("CLAIM_ALIGNMENT_SOURCE_MISMATCH"));
  const stripped = clone(baseCorpus);
  const strippedScale = stripped.sources.find((source) => source.sourceId === "src_s03");
  strippedScale.publisherAffiliations = [];
  strippedScale.sourceType = "independent_reporting";
  strippedScale.control = "independent";
  assert.ok(codes(validateCorpus(stripped)).has("MISSING_SUBJECT_AFFILIATION"));
});

test("rendered source registry attributes at most one 25-word excerpt per source", () => {
  const synthesis = readFileSync(join(DEFAULT_ROOT, "research/synthesis/SYNTHESIS.md"), "utf8");
  const lines = synthesis.split("\n");
  for (const source of baseCorpus.sources) {
    const observations = baseCorpus.observations.filter((observation) => observation.sourceId === source.sourceId);
    const rendered = renderSourceRegistryEvidence(observations);
    assert.ok(rendered.attributedWordCount <= 25, `${source.sourceId} exceeds its source quote budget`);
  }
  for (const sourceId of ["src_s02", "src_s31", "src_s76", "src_adj-prime-intellect", "src_adj-anyscale", "src_adj-teleperformance"]) {
    const observation = baseCorpus.observations.find((item) => item.sourceId === sourceId);
    const rendered = renderSourceRegistryEvidence([observation]);
    assert.equal(rendered.attributedWordCount, observation.excerpt.trim().split(/\s+/).length);
    assert.equal(rendered.markdown.split(observation.excerpt).length - 1, 1);
    assert.match(rendered.markdown, /html heading H[1-6]:/);
    const line = lines.find((candidate) => candidate.startsWith(`| ${sourceId} |`));
    assert.ok(line, `missing registry row for ${sourceId}`);
    assert.equal(line.split(escapeMarkdownText(observation.excerpt)).length - 1, 1);
    assert.ok(!line.includes(observation.locator.value));
  }
  const hostile = renderSourceRegistryEvidence([{
    locator: { kind: "paragraph", value: "<img src=x onerror=alert(1)>" },
    excerpt: "<script>alert(1)</script>",
  }], escapeMarkdownText);
  assert.doesNotMatch(hostile.markdown, /<script|<img/i);
  assert.match(hostile.markdown, /&lt;script&gt;/);
  assert.doesNotThrow(() => decodeHtmlEntities("invalid &#999999999999; and &#xD800; entities"));
  assert.equal(decodeHtmlEntities("invalid &#999999999999; and &#xD800; entities"), "invalid � and � entities");
  assert.doesNotThrow(() => markdownUrl("https://example.com/\ud800"));
  const renderer = readFileSync(join(DEFAULT_ROOT, "scripts/research/render-synthesis.mjs"), "utf8");
  assert.match(renderer, /escape\(company\.name\)/);
  assert.match(renderer, /markdownUrl\(record\.canonicalDomain\)/);
});

test("link audit separates live runtime time from the corpus cutoff", () => {
  const script = readFileSync(join(DEFAULT_ROOT, "scripts/research/check-links.mjs"), "utf8");
  assert.match(script, /runAt:\s*new Date\(\)\.toISOString\(\)/);
  assert.match(script, /cutoffAt:\s*"2026-07-11"/);
  assert.doesNotMatch(script, /checkedAt:\s*"2026-07-11"/);
});

test("link audit detects unrelated cross-origin product redirects", async () => {
  assert.equal(classifyAccessBoundary(200, "<nav>Sign in</nav><main>Public product documentation</main>", "https://example.com"), "open");
  assert.equal(classifyAccessBoundary(200, "<title>Sign in</title><input type=\"password\">", "https://example.com"), "login_gated");
  assert.equal(classifyAccessBoundary(200, "Subscribe to continue reading", "https://example.com"), "paywalled");
  assert.equal(resolveRedirectLocation("https://[::invalid", "https://example.com").error, "invalid-redirect-location");
  assert.equal(classifyRedirect("https://predibase.com", "https://www.rubrik.com/products/rubrik-agent-cloud").unrelatedCrossOrigin, true);
  assert.equal(classifyRedirect("https://imerit.net", "https://imerit.ai/").unrelatedCrossOrigin, true);
  assert.equal(classifyRedirect("https://imerit.net", "https://imerit.ai/", { approvedFinalOrigins: ["https://imerit.ai"] }).unrelatedCrossOrigin, false);
  assert.equal(classifyRedirect("https://news.bloomberglaw.com/story", "https://news.bloomberglaw.com/story").unrelatedCrossOrigin, false);
  assert.equal(classifyRedirect("https://scale.com", "https://scale.evil.example/").unrelatedCrossOrigin, true);
  assert.equal(classifyRedirect("https://scale.com", "https://scale-com.evil.example/").unrelatedCrossOrigin, true);
  assert.equal(classifyRedirect("https://scale.com", "https://scale.com:8443/admin").unrelatedCrossOrigin, true);
  assert.equal(classifyRedirect("https://www.github.io/", "https://attacker.github.io/").unrelatedCrossOrigin, true);
  assert.equal(classifyRedirect("https://scale.com", "http://127.0.0.1/internal").unsafeTarget, true);
  assert.equal(classifyRedirect("https://[::1]/", "https://[::1]/").unsafeTarget, true);
  assert.equal(classifyRedirect("https://[::ffff:127.0.0.1]/", "https://[::ffff:127.0.0.1]/").unsafeTarget, true);
  assert.equal((await classifyNetworkTarget("https://public.example/", async () => [{ address: "127.0.0.1", family: 4 }])).unsafeTarget, true);
  assert.equal((await classifyNetworkTarget("https://public.example/", async () => [{ address: "100.64.0.1", family: 4 }])).unsafeTarget, true);
  assert.equal((await classifyNetworkTarget("https://public.example/", async () => [{ address: "198.18.0.1", family: 4 }])).unsafeTarget, true);
  assert.equal((await classifyNetworkTarget("https://public.example/", async () => [{ address: "5f00::1", family: 6 }])).unsafeTarget, true);
  assert.equal((await classifyNetworkTarget("https://public.example/", async () => [{ address: "2001::1", family: 6 }])).unsafeTarget, true);
  assert.equal((await classifyNetworkTarget("https://public.example/", async () => [{ address: "93.184.216.34", family: 4 }])).unsafeTarget, false);
  assert.equal((await classifyNetworkTarget("https://public.example/", async () => [{ address: "2606:4700:4700::1111", family: 6 }])).unsafeTarget, false);
  let resolverCalls = 0;
  const rebindingTarget = await classifyNetworkTarget("https://rebind.example/", async () => {
    resolverCalls += 1;
    return [{ address: resolverCalls === 1 ? "93.184.216.34" : "127.0.0.1", family: 4 }];
  });
  const pinnedLookup = createPinnedLookup(rebindingTarget);
  const pinnedAddress = await new Promise((resolve, reject) => pinnedLookup("rebind.example", {}, (error, address) => error ? reject(error) : resolve(address)));
  assert.equal(pinnedAddress, "93.184.216.34");
  assert.equal(resolverCalls, 1, "the connection lookup must not re-resolve a validated hostname");
  const checkLinks = readFileSync(join(DEFAULT_ROOT, "scripts/research/check-links.mjs"), "utf8");
  const snapshotLocators = readFileSync(join(DEFAULT_ROOT, "scripts/research/snapshot-locators.mjs"), "utf8");
  const safeHttp = readFileSync(join(DEFAULT_ROOT, "scripts/research/safe-http.mjs"), "utf8");
  assert.match(checkLinks, /await requestPinnedHttps\(url/);
  assert.match(snapshotLocators, /await requestPinnedHttps\(url/);
  assert.match(safeHttp, /lookup:\s*createPinnedLookup\(networkTarget\)/);
  assert.doesNotMatch(snapshotLocators, /pypdf|PdfReader|python3/);
});
