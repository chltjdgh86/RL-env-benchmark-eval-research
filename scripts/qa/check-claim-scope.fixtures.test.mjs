import assert from "node:assert/strict"
import test from "node:test"
import { parseClaimScope } from "./claim-scope.mjs"

test("allows a feature scope manifest before its modules are integrated", () => {
  // Given: a manifest that owns only paths inside its feature directory.
  const manifestPath = "scripts/qa/fixtures/claim-scope-valid.json"
  // When: the scope boundary is parsed before implementation files exist.
  const result = parseClaimScope(manifestPath)
  // Then: the manifest is accepted without requiring the future module files.
  assert.deepEqual(result.errors, [])
})

test("rejects a feature scope manifest that claims a foreign path", () => {
  // Given: a manifest that reaches into another feature directory.
  const manifestPath = "scripts/qa/fixtures/claim-scope-foreign.json"
  // When: the scope boundary is parsed.
  const result = parseClaimScope(manifestPath)
  // Then: the foreign path is rejected explicitly.
  assert.ok(result.errors.some((error) => error.startsWith("CLAIM_SCOPE_FOREIGN_PATH:")))
})

test("rejects an empty feature scope manifest", () => {
  // Given: a scope manifest with no modules and no expected claims.
  const manifestPath = "scripts/qa/fixtures/claim-scope-empty.json"
  // When: the scope boundary is parsed.
  const result = parseClaimScope(manifestPath)
  // Then: both empty ownership sets fail explicitly.
  assert.ok(result.errors.includes("CLAIM_SCOPE_EMPTY_MODULE_PATHS"))
  assert.ok(result.errors.includes("CLAIM_SCOPE_EMPTY_CLAIM_IDS"))
})
