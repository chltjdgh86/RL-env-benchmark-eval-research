#!/usr/bin/env node

import { readFileSync, writeFileSync } from "node:fs"
import { resolve } from "node:path"

const root = resolve(import.meta.dirname, "../..")
const indexPath = resolve(root, "index.html")
const synthesisPath = resolve(root, "research/synthesis/SYNTHESIS.md")
const publicSynthesisPath = resolve(root, "public/research-synthesis.txt")
const companies = JSON.parse(readFileSync(resolve(root, "research/corpus/companies.json"), "utf8"))
const adjacent = JSON.parse(readFileSync(resolve(root, "research/corpus/adjacent.json"), "utf8"))
const claims = JSON.parse(readFileSync(resolve(root, "research/corpus/claims.json"), "utf8"))
const sources = JSON.parse(readFileSync(resolve(root, "research/corpus/sources.json"), "utf8"))
const supplemental = JSON.parse(
  readFileSync(resolve(root, "research/corpus/supplemental-adjacent.json"), "utf8"),
)
const supplementalTwo = JSON.parse(
  readFileSync(resolve(root, "research/corpus/supplemental-adjacent-2.json"), "utf8"),
)
const datasets = JSON.parse(readFileSync(resolve(root, "research/corpus/datasets.json"), "utf8"))
const receipts = JSON.parse(
  readFileSync(resolve(root, "research/corpus/strategy-research-receipts.json"), "utf8"),
)
const synthesis = readFileSync(synthesisPath, "utf8")
const publicSynthesis = synthesis.replace(/[\t ]+$/gmu, "")

const canonicalCompanyCount = companies.length + adjacent.length
const supplementalCompanyCount = supplemental.records.length + supplementalTwo.records.length
const description = `Evidence-linked atlas of AI training data, RL environments, evaluations, ${datasets.metadata.companyCount} researched companies, and ${datasets.metadata.familyCount} public dataset families.`
const structuredData = JSON.stringify({
  "@context": "https://schema.org",
  "@type": "Dataset",
  name: "RL Economy Atlas research and public-dataset index",
  description,
  dateModified: "2026-07-12",
  temporalCoverage: "..2026-07-11",
  isAccessibleForFree: true,
  keywords: [
    "AI training data",
    "RL environments",
    "model evaluations",
    "agent experience",
    "post-training",
    "public datasets",
    "company landscape",
  ],
})
const fallback = `<!-- GENERATED:NO_JS_FALLBACK --><noscript><article aria-label="RL Economy Atlas text fallback"><h1>RL Economy Atlas</h1><p>${description}</p><p>Market evidence cutoff: 2026-07-11. Canonical corpus: ${sources.length} sources, ${claims.length} atomic claims, ${canonicalCompanyCount} companies, and ${receipts.length} symmetric strategy-search receipts. Post-cutoff discovery adds ${supplementalCompanyCount} labeled company records without changing canonical claims or scores.</p><p>Dataset discovery verified 2026-07-12: ${datasets.metadata.familyCount} families, ${datasets.metadata.surfaceCount} public surfaces, and coverage outcomes for ${datasets.metadata.companyCount} companies.</p><h2>Research and dataset coverage</h2><p>Browse the interactive company landscape and dedicated dataset registry, or open the complete generated research synthesis.</p><p><a href="./research-synthesis.txt">Open the complete generated research synthesis</a></p></article></noscript>`
const metadata = `<!-- GENERATED:SEO_METADATA --><script type="application/ld+json">${structuredData}</script>`

const originalIndex = readFileSync(indexPath, "utf8")
const renderedIndex = originalIndex
  .replace(
    /<meta name="description" content="[^"]*"\s*\/>/u,
    `<meta name="description" content="${description}" />`,
  )
  .replace(
    /<!-- GENERATED:SEO_METADATA -->(?:<script type="application\/ld\+json">[\s\S]*?<\/script>)?/u,
    metadata,
  )
  .replace(/<!-- GENERATED:NO_JS_FALLBACK -->(?:<noscript>[\s\S]*?<\/noscript>)?/u, fallback)

if (process.argv.includes("--check")) {
  const errors = []
  if (originalIndex !== renderedIndex) errors.push("PUBLIC_FALLBACK_DRIFT:index.html")
  if (readFileSync(publicSynthesisPath, "utf8") !== publicSynthesis) {
    errors.push("PUBLIC_FALLBACK_DRIFT:public/research-synthesis.txt")
  }
  if (errors.length > 0) {
    for (const error of errors) console.error(error)
    process.exitCode = 1
  } else {
    console.log("PUBLIC_FALLBACK_OK")
  }
} else {
  writeFileSync(indexPath, renderedIndex)
  writeFileSync(publicSynthesisPath, publicSynthesis)
  console.log("PUBLIC_FALLBACK_RENDERED")
}
