import assert from "node:assert/strict"
import { spawnSync } from "node:child_process"
import test from "node:test"

function runLeakCheck(directory) {
  return spawnSync(process.execPath, ["scripts/qa/check-devtools.mjs", "--dir", directory], {
    encoding: "utf8",
  })
}

test("rejects a dev-tool import stored only in a production source map", () => {
  // Given: a clean JavaScript asset whose source map embeds a dev-tool import.
  const fixtureDirectory = "scripts/qa/fixtures/dist-with-devtools-map"
  // When: the production leakage gate scans the fixture build.
  const result = runLeakCheck(fixtureDirectory)
  // Then: the hidden source-map import fails the gate.
  assert.equal(result.status, 1, "DEVTOOLS_PRODUCTION_LEAK source map should fail")
  assert.match(result.stderr, /DEVTOOLS_PRODUCTION_LEAK/)
})

test("rejects a dev-tool import in executable production JavaScript", () => {
  // Given: a JavaScript asset with a runtime dev-tool import.
  const fixtureDirectory = "scripts/qa/fixtures/dist-with-devtools"
  // When: the production leakage gate scans the fixture build.
  const result = runLeakCheck(fixtureDirectory)
  // Then: the runtime import fails the gate.
  assert.equal(result.status, 1)
  assert.match(result.stderr, /DEVTOOLS_PRODUCTION_LEAK/)
})
