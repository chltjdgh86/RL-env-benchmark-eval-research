import assert from "node:assert/strict"
import { spawnSync } from "node:child_process"
import { mkdtempSync, rmSync, writeFileSync } from "node:fs"
import { tmpdir } from "node:os"
import { join } from "node:path"
import test from "node:test"

test("rejects structural no-excuse violations", () => {
  // Given: TypeScript containing structural and directive violations.
  const temporaryDirectory = mkdtempSync(join(tmpdir(), "atlas-no-excuses-"))
  const fixturePath = join(temporaryDirectory, "violations.ts")
  writeFileSync(
    fixturePath,
    [
      "declare const optionalValue: string | undefined",
      "// @ts-nocheck",
      "export let mutableValue = 1",
      "const assertedValue = optionalValue!",
      "const typedAssertion = optionalValue as string",
      'if (assertedValue.length === 0) throw "empty"',
      "try { mutableValue += 1 } catch (error) { console.error(error) }",
      "try { console.log(typedAssertion) } catch { console.error('swallowed') }",
    ].join("\n"),
  )

  try {
    // When: the no-excuses checker inspects the isolated fixture.
    const result = spawnSync(process.execPath, ["scripts/qa/check-no-excuses.mjs", fixturePath], {
      encoding: "utf8",
    })
    // Then: every structural violation is named and the command fails.
    assert.equal(result.status, 1, "NO_NON_NULL_ASSERTION fixture should fail")
    assert.match(result.stderr, /NO_NON_NULL_ASSERTION/)
    assert.match(result.stderr, /NO_LITERAL_THROW/)
    assert.match(result.stderr, /NO_MUTABLE_EXPORT/)
    assert.match(result.stderr, /NO_TYPE_ASSERTION/)
    assert.match(result.stderr, /NO_TS_NOCHECK/)
    assert.match(result.stderr, /CATCH_WITHOUT_NARROWING/)
  } finally {
    rmSync(temporaryDirectory, { recursive: true })
  }
})

test("ignores CSS important in templates while retaining real non-null assertions", () => {
  const temporaryDirectory = mkdtempSync(join(tmpdir(), "atlas-no-excuses-template-"))
  const safeFixture = join(temporaryDirectory, "safe.ts")
  const unsafeFixture = join(temporaryDirectory, "unsafe.ts")
  const cssTemplate = [
    "const width = 320",
    "const screenshot = `" + "$" + "{width}px.png`",
    "const styles = `* { line-height: 1.5 !important; }`",
    "console.log(screenshot, styles)",
  ]
  writeFileSync(safeFixture, cssTemplate.join("\n"))
  writeFileSync(
    unsafeFixture,
    [...cssTemplate, "declare const value: string | undefined", "console.log(value!)"].join("\n"),
  )

  try {
    const safeResult = spawnSync(
      process.execPath,
      ["scripts/qa/check-no-excuses.mjs", safeFixture],
      {
        encoding: "utf8",
      },
    )
    const unsafeResult = spawnSync(
      process.execPath,
      ["scripts/qa/check-no-excuses.mjs", unsafeFixture],
      { encoding: "utf8" },
    )

    assert.equal(safeResult.status, 0, safeResult.stderr)
    assert.equal(unsafeResult.status, 1)
    assert.match(unsafeResult.stderr, /NO_NON_NULL_ASSERTION/)
    assert.equal(unsafeResult.stderr.match(/NO_NON_NULL_ASSERTION/g)?.length, 1)
  } finally {
    rmSync(temporaryDirectory, { recursive: true })
  }
})
