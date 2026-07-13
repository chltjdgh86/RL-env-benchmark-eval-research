import assert from "node:assert/strict"
import { spawnSync } from "node:child_process"
import { mkdtempSync, rmSync, writeFileSync } from "node:fs"
import { tmpdir } from "node:os"
import { join } from "node:path"
import test from "node:test"

function writeScopeManifest(directory) {
  writeFileSync(
    join(directory, "claim-scope.json"),
    `${JSON.stringify(
      {
        scope: "qa-scope",
        modulePaths: ["src/features/qa-scope/claim-scope.fixture.tsx"],
        expectedClaimIds: ["clm_fixture-claim"],
      },
      null,
      2,
    )}\n`,
  )
}

function runRenderedClaimCheck(directory, modulePath) {
  return spawnSync(
    process.execPath,
    [
      "scripts/qa/check-rendered-claims.mjs",
      "--fixture",
      join(directory, "claim-scope.json"),
      "--fixture-module",
      modulePath,
    ],
    { encoding: "utf8" },
  )
}

test("does not count a claim marker without rendered assertion text", () => {
  // Given: an executable scope module that renders an empty claim marker.
  const featureDirectory = mkdtempSync(join(tmpdir(), "atlas-rendered-claims-"))
  const renderModulePath = join(featureDirectory, "Companies.tsx")
  writeScopeManifest(featureDirectory)
  writeFileSync(
    renderModulePath,
    [
      'import { createElement } from "react"',
      "export function renderClaimScope() {",
      '  return createElement("article", { "data-claim-id": "clm_fixture-claim" })',
      "}",
    ].join("\n"),
  )

  try {
    // When: rendered-claim coverage executes and server-renders the fixture.
    const result = runRenderedClaimCheck(featureDirectory, renderModulePath)
    // Then: an ID-only stub does not satisfy rendered-claim coverage.
    assert.equal(result.status, 1, "EXPECTED_CLAIM_NOT_RENDERED should fail")
    assert.match(result.stderr, /RENDERED_CLAIM_TEXT_EMPTY:clm_fixture-claim/)
  } finally {
    rmSync(featureDirectory, { recursive: true })
  }
})

test("accepts exact claim IDs from executable rendered markup", () => {
  // Given: an executable scope fixture that renders its expected claim ID.
  const featureDirectory = mkdtempSync(join(tmpdir(), "atlas-rendered-claims-"))
  const renderModulePath = join(featureDirectory, "Companies.tsx")
  writeScopeManifest(featureDirectory)
  writeFileSync(
    renderModulePath,
    [
      'import { createElement } from "react"',
      "export function renderClaimScope() {",
      '  return createElement("article", { "data-claim-id": "clm_fixture-claim" }, "Rendered factual claim")',
      "}",
    ].join("\n"),
  )

  try {
    // When: rendered-claim coverage executes and server-renders the fixture.
    const result = runRenderedClaimCheck(featureDirectory, renderModulePath)
    // Then: the observed markup covers the manifest exactly.
    assert.equal(result.status, 0, result.stderr)
    assert.match(result.stdout, /RENDERED_CLAIMS_OK:qa-scope/)
  } finally {
    rmSync(featureDirectory, { recursive: true })
  }
})
