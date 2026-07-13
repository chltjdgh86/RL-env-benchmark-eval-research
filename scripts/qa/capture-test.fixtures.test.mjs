import assert from "node:assert/strict"
import { spawnSync } from "node:child_process"
import { mkdtempSync, rmSync } from "node:fs"
import { tmpdir } from "node:os"
import { join } from "node:path"
import test from "node:test"

function runRedCapture(directory, childSource) {
  return spawnSync(
    process.execPath,
    [
      "scripts/qa/capture-test.mjs",
      "red",
      join(directory, "receipt.txt"),
      "BEHAVIOR_MARKER",
      "--",
      process.execPath,
      "-e",
      childSource,
    ],
    { encoding: "utf8" },
  )
}

test("rejects an expected marker that appears only in an echoed source line", () => {
  // Given: an unrelated exception whose eval source happens to contain the expected marker.
  const temporaryDirectory = mkdtempSync(join(tmpdir(), "atlas-capture-test-"))
  try {
    // When: RED capture evaluates the child's failure output.
    const result = runRedCapture(
      temporaryDirectory,
      'throw new Error("unrelated failure"); void "BEHAVIOR_MARKER"',
    )
    // Then: echoed source is not accepted as behavior-specific failure evidence.
    assert.equal(result.status, 1)
    assert.match(result.stderr, /RED_EXPECTED_SUBSTRING_MISSING:BEHAVIOR_MARKER/)
  } finally {
    rmSync(temporaryDirectory, { recursive: true })
  }
})

test("accepts an expected marker emitted by the failing behavior", () => {
  // Given: a child that emits the expected marker and fails.
  const temporaryDirectory = mkdtempSync(join(tmpdir(), "atlas-capture-test-"))
  try {
    // When: RED capture evaluates the child's failure output.
    const result = runRedCapture(
      temporaryDirectory,
      'process.stderr.write("BEHAVIOR_MARKER\\n"); process.exit(2)',
    )
    // Then: behavior-specific output is accepted.
    assert.equal(result.status, 0, result.stderr)
    assert.match(result.stdout, /RED_CAPTURED:BEHAVIOR_MARKER/)
  } finally {
    rmSync(temporaryDirectory, { recursive: true })
  }
})
