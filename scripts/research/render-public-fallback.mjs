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
const receipts = JSON.parse(
  readFileSync(resolve(root, "research/corpus/strategy-research-receipts.json"), "utf8"),
)
const synthesis = readFileSync(synthesisPath, "utf8")

const description =
  "Evidence-linked research atlas of AI training data, RL environments, evaluations, agent experience, market structure, company dossiers, and newcomer strategy."
const structuredData = JSON.stringify({
  "@context": "https://schema.org",
  "@type": "Dataset",
  name: "RL Economy Atlas research corpus",
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
  ],
})
const fallback = `<!-- GENERATED:NO_JS_FALLBACK --><noscript><article aria-label="RL Economy Atlas text fallback"><h1>RL Economy Atlas</h1><p>${description}</p><p>Evidence cutoff: 2026-07-11. Canonical corpus: ${sources.length} sources, ${claims.length} atomic claims, ${companies.length} named dossiers, ${adjacent.length} adjacent records, and ${receipts.length} symmetric strategy-search receipts.</p><h2>Named dossiers</h2><p>${companies.map((company) => company.name).join(" · ")}</p><p><a href="/research-synthesis.txt">Open the complete generated research synthesis</a></p></article></noscript>`
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
  if (readFileSync(publicSynthesisPath, "utf8") !== synthesis) {
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
  writeFileSync(publicSynthesisPath, synthesis)
  console.log("PUBLIC_FALLBACK_RENDERED")
}
