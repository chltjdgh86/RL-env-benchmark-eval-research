import { existsSync, readFileSync } from "node:fs"

const fixtureFlagIndex = process.argv.indexOf("--fixture")
const fixturePath = fixtureFlagIndex === -1 ? undefined : process.argv[fixtureFlagIndex + 1]
const htmlPath = fixturePath ?? "dist/index.html"

if (!existsSync(htmlPath)) {
  console.error("SEO_BUILD_ARTIFACT_MISSING")
  process.exitCode = 1
} else {
  const html = readFileSync(htmlPath, "utf8")
  const errors = []
  if (!/<title>\s*[^<\s][^<]*<\/title>/i.test(html)) {
    errors.push("SEO_TITLE_MISSING")
  }
  if (!/<meta\s+name=["']description["']\s+content=["'][^"']+[^"'\s]["']/i.test(html)) {
    errors.push("SEO_DESCRIPTION_MISSING")
  }

  const canonicalMatch = html.match(/<link\s+rel=["']canonical["']\s+href=["']([^"']+)["']/i)
  if (canonicalMatch !== null) {
    errors.push("SEO_UNVERIFIED_CANONICAL")
    if (canonicalMatch[1]?.includes("#")) {
      errors.push("SEO_HASH_CANONICAL_FORBIDDEN")
    }
  }

  const structuredDataBlocks = [
    ...html.matchAll(/<script\s+type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi),
  ]
  const hasGenericCollectionMetadata = structuredDataBlocks.some((match) => {
    const json = match[1]
    return json !== undefined && /"@type"\s*:\s*"(?:Dataset|CollectionPage)"/.test(json)
  })
  if (!hasGenericCollectionMetadata) {
    errors.push("SEO_DATASET_COLLECTION_METADATA_MISSING")
  }

  if (errors.length > 0) {
    for (const error of errors) {
      console.error(error)
    }
    process.exitCode = 1
  } else {
    console.log("SEO_OK")
  }
}
