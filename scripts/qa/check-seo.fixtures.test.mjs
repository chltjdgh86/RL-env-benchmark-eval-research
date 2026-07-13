import assert from "node:assert/strict"
import { spawnSync } from "node:child_process"
import { mkdtempSync, rmSync, writeFileSync } from "node:fs"
import { tmpdir } from "node:os"
import { join } from "node:path"
import test from "node:test"

function runSeoFixture(html) {
  const directory = mkdtempSync(join(tmpdir(), "atlas-seo-"))
  const fixturePath = join(directory, "index.html")
  writeFileSync(fixturePath, html)
  const result = spawnSync(
    process.execPath,
    ["scripts/qa/check-seo.mjs", "--fixture", fixturePath],
    { encoding: "utf8" },
  )
  rmSync(directory, { recursive: true })
  return result
}

const metadata = [
  "<title>RL Economy Atlas</title>",
  '<meta name="description" content="Research collection">',
  '<script type="application/ld+json">{"@type":"Dataset"}</script>',
].join("")

test("accepts generic collection metadata without inventing a deployment canonical", () => {
  // Given: a static hash SPA with generic dataset metadata and no deployment URL.
  // When: the SEO contract checks the generated document.
  const result = runSeoFixture(metadata)
  // Then: honest generic metadata passes.
  assert.equal(result.status, 0, result.stderr)
  assert.match(result.stdout, /SEO_OK/)
})

test("rejects an unverified deployment canonical", () => {
  // Given: otherwise valid metadata with a made-up deployment URL.
  const html = `${metadata}<link rel="canonical" href="https://example.invalid/#/companies">`
  // When: the SEO contract checks the generated document.
  const result = runSeoFixture(html)
  // Then: fake and hash-fragment canonical claims fail explicitly.
  assert.equal(result.status, 1)
  assert.match(result.stderr, /SEO_UNVERIFIED_CANONICAL/)
  assert.match(result.stderr, /SEO_HASH_CANONICAL_FORBIDDEN/)
})

test("rejects metadata that omits the dataset or collection type", () => {
  // Given: a title and description without generic collection structured data.
  // When: the SEO contract checks the generated document.
  const result = runSeoFixture(
    '<title>RL Economy Atlas</title><meta name="description" content="Research collection">',
  )
  // Then: the missing collection schema fails explicitly.
  assert.equal(result.status, 1)
  assert.match(result.stderr, /SEO_DATASET_COLLECTION_METADATA_MISSING/)
})
