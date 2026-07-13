#!/usr/bin/env node

import { readFileSync } from "node:fs";
import { join } from "node:path";

import {
  DEFAULT_ROOT,
  loadCorpus,
  SUPPLEMENTAL_REGISTERS,
  summarizeCorpus,
  validateCorpus,
  validateMigration,
  validateSupplementalRegisters,
} from "./corpus-validator.mjs";

const args = new Set(process.argv.slice(2));
const corpus = loadCorpus(DEFAULT_ROOT);
const migration = JSON.parse(
  readFileSync(join(DEFAULT_ROOT, "research/migrations/root-synthesis-seed.json"), "utf8"),
);
const supplementalRegisters = SUPPLEMENTAL_REGISTERS.map(({ file, lock }) => ({
  value: JSON.parse(readFileSync(join(DEFAULT_ROOT, file), "utf8")),
  lock,
}));
const corpusErrors = validateCorpus(corpus);
const migrationErrors = validateMigration(migration, corpus, DEFAULT_ROOT);
const supplementalErrors = validateSupplementalRegisters(supplementalRegisters, corpus);
const errors = args.has("--check-seed-migration")
  ? migrationErrors
  : [...corpusErrors, ...migrationErrors, ...supplementalErrors];

if (args.has("--report")) {
  process.stdout.write(
    `${JSON.stringify(
      {
        status: errors.length === 0 ? "PASS" : "FAIL",
        errors,
        report: summarizeCorpus(corpus, migration),
      },
      null,
      2,
    )}\n`,
  );
} else if (errors.length === 0) {
  const summary = summarizeCorpus(corpus, migration);
  console.log(
    `CORPUS_OK sources=${summary.counts.sources} observations=${summary.counts.observations} claims=${summary.counts.claims} companies=${summary.counts.companies} adjacent=${summary.counts.adjacent} receipts=${summary.counts.receipts} responses=${summary.responseTargets} open_leads=${summary.openLeads} open_receipt_lanes=${summary.openReceiptLanes}`,
  );
} else {
  console.error(`CORPUS_INVALID errors=${errors.length}`);
  for (const error of errors) console.error(`${error.code}\t${error.path}\t${error.message}`);
}

if (errors.length > 0) process.exitCode = 1;
