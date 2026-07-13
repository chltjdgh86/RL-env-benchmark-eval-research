import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import test from "node:test";

import { DEFAULT_ROOT, loadCorpus, SUPPLEMENTAL_REGISTERS, validateSupplementalAdjacent, validateSupplementalRegisters } from "./corpus-validator.mjs";

const loadSupplemental = () => JSON.parse(readFileSync(join(DEFAULT_ROOT, "research/corpus/supplemental-adjacent.json"), "utf8"));
const loadSupplemental2 = () => JSON.parse(readFileSync(join(DEFAULT_ROOT, "research/corpus/supplemental-adjacent-2.json"), "utf8"));

test("supplemental census reconciles 50 post-cutoff inputs without changing the core census", () => {
  const corpus = loadCorpus(DEFAULT_ROOT);
  const supplemental = loadSupplemental();

  assert.deepEqual(validateSupplementalAdjacent(supplemental, corpus), []);
  assert.deepEqual(supplemental.reconciliation, {
    inputCount: 50,
    addCount: 47,
    mergeCount: 2,
    unresolvedCount: 1,
    unknownStatusCount: 45,
    acquiredClosedCount: 2,
    coreCensusAffected: false,
  });
  assert.equal(new Set(supplemental.records.map((record) => record.adjacentId)).size, 47);
  assert.equal(corpus.adjacent.length, 63);
  assert.equal(corpus.receipts.length, 70);
});

test("sweep register 2 reconciles 12 verified inputs without changing the core census", () => {
  const corpus = loadCorpus(DEFAULT_ROOT);
  const supplemental2 = loadSupplemental2();
  const lock = SUPPLEMENTAL_REGISTERS[1].lock;

  assert.deepEqual(validateSupplementalAdjacent(supplemental2, corpus, lock), []);
  assert.deepEqual(supplemental2.reconciliation, {
    inputCount: 12,
    addCount: 12,
    mergeCount: 0,
    unresolvedCount: 0,
    unknownStatusCount: 11,
    acquiredClosedCount: 1,
    coreCensusAffected: false,
  });
  assert.equal(new Set(supplemental2.records.map((record) => record.adjacentId)).size, 12);
  assert.equal(corpus.adjacent.length, 63);
  assert.equal(corpus.companies.length, 10);
});

test("register IDs stay unique across both discovery registers", () => {
  const corpus = loadCorpus(DEFAULT_ROOT);
  const registers = [
    { value: loadSupplemental(), lock: SUPPLEMENTAL_REGISTERS[0].lock },
    { value: loadSupplemental2(), lock: SUPPLEMENTAL_REGISTERS[1].lock },
  ];

  assert.deepEqual(validateSupplementalRegisters(registers, corpus), []);

  const collided = {
    ...registers[1],
    value: {
      ...registers[1].value,
      records: registers[1].value.records.map((record, index) =>
        index === 0 ? { ...record, adjacentId: registers[0].value.records[0].adjacentId } : record,
      ),
    },
  };
  const codes = validateSupplementalRegisters([registers[0], collided], corpus).map((error) => error.code);
  assert.ok(codes.includes("SUPPLEMENTAL_DUPLICATE_ID"));
});

test("sweep register 2 contains the user-flagged Vetto lead", () => {
  const supplemental2 = loadSupplemental2();
  const vetto = supplemental2.records.find((record) => record.adjacentId === "adj_vetto");

  assert.equal(vetto?.name, "Vetto");
  assert.equal(vetto?.canonicalDomain, "https://vetto.ai");
  assert.ok(vetto?.aliases.includes("Start Carreiras"));
});

test("supplemental candidates cannot masquerade as cutoff-current canonical observations", () => {
  const corpus = loadCorpus(DEFAULT_ROOT);
  const supplemental = loadSupplemental();
  supplemental.records[0].observationCandidates[0].canonicalReady = true;

  const codes = validateSupplementalAdjacent(supplemental, corpus).map((error) => error.code);
  assert.ok(codes.includes("SUPPLEMENTAL_PREMATURE_PROMOTION"));
});

test("requested and screenshot competitor names reconcile without omissions", () => {
  const corpus = loadCorpus(DEFAULT_ROOT);
  const supplemental = loadSupplemental();
  const normalize = (value) => value.normalize("NFKD").replace(/[^a-z0-9]/giu, "").toLowerCase();
  const indexedNames = new Map();
  const indexEntity = (bucket, id, names) => {
    for (const name of names) indexedNames.set(normalize(name), { bucket, id });
  };

  for (const company of corpus.companies) {
    indexEntity("core", company.companyId, [company.name, ...company.aliases]);
  }
  for (const adjacent of corpus.adjacent) {
    indexEntity("adjacent", adjacent.adjacentId, [adjacent.name, ...adjacent.aliases]);
  }
  for (const record of supplemental.records) {
    indexEntity("supplemental", record.adjacentId, [record.name, ...record.aliases]);
  }
  for (const merge of supplemental.duplicateInputs) {
    indexEntity("core_merge", merge.mergeInto, [merge.input]);
  }
  for (const unresolved of supplemental.unresolved) {
    indexEntity("unresolved", unresolved.adjacentId, [unresolved.input]);
  }

  const requestedNames = [
    "Kled", "Luel", "Chakra Labs", "Habitat", "Refresh", "Cua", "Originator", "Dojo",
    "Proximal", "Idler", "Calaveras", "BenchFlow", "Vmax", "Andromede", "Aviro",
    "AIChamp", "General Reasoning", "Champ", "Haladir", "Hillclimb", "Gray Swan", "Theta",
    "Preference Model", "Vals AI", "Andon Labs", "Verita", "Good Start Labs", "Halluminate",
    "Quesma", "Phinity", "Rise Data Labs", "Kairos", "TrainLoop", "Huzzle Labs",
  ];
  const screenshotNames = [
    "Scale AI", "Surge AI", "Mercor", "Handshake", "micro1", "Turing", "AfterQuery", "Fleet",
    "Deeptune", "Bespoke Labs", "Mechanize", "Sepal AI", "HUD", "Plato", "Matrices",
    "Halluminate", "Toloka", "Encord", "Cortex", "Praxis", "Arena", "David AI", "Protege",
    "DataCurve", "Truveta", "Snorkel AI", "Labelbox", "Argilla",
  ];
  const missing = [...requestedNames, ...screenshotNames].filter(
    (name) => !indexedNames.has(normalize(name)),
  );

  assert.deepEqual(missing, []);
  assert.deepEqual(indexedNames.get(normalize("Originator")), {
    bucket: "unresolved",
    id: "adj_originator",
  });
});
