import assert from "node:assert/strict";
import test from "node:test";

import { DEFAULT_ROOT, loadCorpus, validateCorpus } from "./corpus-validator.mjs";

test("a claim cannot cite an unknown source", () => {
  const corpus = structuredClone(loadCorpus(DEFAULT_ROOT));
  corpus.claims[0].evidenceLinks[0].sourceId = "src_missing";

  const codes = validateCorpus(corpus).map((error) => error.code);
  assert.ok(
    codes.includes("UNKNOWN_SOURCE_ID"),
    "MISSING_UNKNOWN_SOURCE_REJECTION: a dangling source must be rejected",
  );
});
