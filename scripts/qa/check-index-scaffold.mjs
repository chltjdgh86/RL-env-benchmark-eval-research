import { readFileSync } from "node:fs"

const html = readFileSync("index.html", "utf8")
const fallbackMarker = "<!-- GENERATED:NO_JS_FALLBACK -->"
const metadataMarker = "<!-- GENERATED:SEO_METADATA -->"
const fallbackCount = html.split(fallbackMarker).length - 1
const metadataCount = html.split(metadataMarker).length - 1
const rootMatch = html.match(/<div id="root">([\s\S]*?)<\/div>/)
const rootBody = rootMatch?.[1]?.trim()
const errors = []

if (fallbackCount !== 1) {
  errors.push(`NO_JS_FALLBACK_MARKER_COUNT:${fallbackCount}`)
}
if (metadataCount !== 1) {
  errors.push(`SEO_METADATA_MARKER_COUNT:${metadataCount}`)
}
if (rootBody !== fallbackMarker && !rootBody?.startsWith(`${fallbackMarker}<noscript>`)) {
  errors.push("INDEX_FALLBACK_SLOT_INVALID")
}
if (!/<meta name="description" content="[^"]*"\s*\/>/u.test(html)) {
  errors.push("INDEX_METADATA_SLOT_MISSING")
}

if (errors.length > 0) {
  for (const error of errors) {
    console.error(error)
  }
  process.exitCode = 1
} else {
  console.log("INDEX_SCAFFOLD_OK")
}
