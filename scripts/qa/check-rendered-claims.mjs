import { spawnSync } from "node:child_process"
import { existsSync, readdirSync } from "node:fs"
import { resolve } from "node:path"
import { JSDOM } from "jsdom"
import { parseClaimScope } from "./claim-scope.mjs"

const scopeFlagIndex = process.argv.indexOf("--scope")
const scope = scopeFlagIndex === -1 ? undefined : process.argv[scopeFlagIndex + 1]
const fixtureFlagIndex = process.argv.indexOf("--fixture")
const fixturePath = fixtureFlagIndex === -1 ? undefined : process.argv[fixtureFlagIndex + 1]
const fixtureModuleFlagIndex = process.argv.indexOf("--fixture-module")
const fixtureModulePath =
  fixtureModuleFlagIndex === -1 ? undefined : process.argv[fixtureModuleFlagIndex + 1]
const featureRoot = resolve("src/features")
const manifestPaths =
  fixturePath !== undefined
    ? [resolve(fixturePath)]
    : scope === undefined
      ? existsSync(featureRoot)
        ? readdirSync(featureRoot, { withFileTypes: true })
            .filter((entry) => entry.isDirectory())
            .map((entry) => resolve(featureRoot, entry.name, "claim-scope.json"))
            .filter((path) => existsSync(path))
        : []
      : [resolve(`src/features/${scope}/claim-scope.json`)]

if (manifestPaths.length === 0 || manifestPaths.some((path) => !existsSync(path))) {
  console.error("CLAIM_SCOPE_MANIFESTS_MISSING")
  process.exitCode = 1
} else {
  const errors = []
  const checkedScopes = []
  for (const manifestPath of manifestPaths) {
    const result = parseClaimScope(manifestPath, {
      allowFixtureLocation: fixturePath !== undefined,
    })
    errors.push(...result.errors)
    if (result.manifest === null) {
      continue
    }
    checkedScopes.push(result.manifest.scope)

    const modules = result.manifest.modulePaths.filter((path) => existsSync(path))
    if (fixturePath === undefined && modules.length !== result.manifest.modulePaths.length) {
      errors.push(`CLAIM_SCOPE_MODULES_MISSING:${result.manifest.scope}`)
      continue
    }

    const renderModulePaths =
      fixturePath === undefined
        ? result.manifest.modulePaths
        : fixtureModulePath === undefined
          ? []
          : [fixtureModulePath]
    if (renderModulePaths.length === 0 || renderModulePaths.some((path) => !existsSync(path))) {
      errors.push(`RENDER_SCOPE_MODULE_MISSING:${result.manifest.scope}`)
      continue
    }
    const renderResult = spawnSync(
      "bun",
      ["scripts/qa/render-claim-scope.mjs", result.manifest.scope, ...renderModulePaths],
      { encoding: "utf8" },
    )
    if (renderResult.status !== 0) {
      errors.push(`RENDER_SCOPE_FAILED:${result.manifest.scope}:${renderResult.stderr.trim()}`)
      continue
    }
    const renderedMarkup = renderResult.stdout
    const scopePattern = new RegExp(`\\bdata-claim-scope=["']${result.manifest.scope}["']`)
    if (!scopePattern.test(renderedMarkup)) {
      errors.push(`RENDERED_CLAIM_SCOPE_MISSING:${result.manifest.scope}`)
      continue
    }
    const document = new JSDOM(renderedMarkup).window.document
    const claimElements = [...document.querySelectorAll("[data-claim-id]")]
    const renderedClaimIds = claimElements.flatMap((element) => {
      const claimId = element.getAttribute("data-claim-id")
      return claimId === null ? [] : [claimId]
    })
    if (renderedClaimIds.length === 0) {
      errors.push(`RENDERED_CLAIM_OUTPUT_EMPTY:${result.manifest.scope}`)
    }
    for (const element of claimElements) {
      const claimId = element.getAttribute("data-claim-id") ?? "unknown"
      if (element.textContent?.trim().length === 0) {
        errors.push(`RENDERED_CLAIM_TEXT_EMPTY:${claimId}`)
      }
    }
    const expectedClaims = new Set(result.manifest.expectedClaimIds)
    const renderedClaims = new Set(renderedClaimIds)
    for (const claimId of expectedClaims) {
      if (!renderedClaims.has(claimId)) {
        errors.push(`EXPECTED_CLAIM_NOT_RENDERED:${claimId}`)
      }
    }
    for (const claimId of renderedClaims) {
      if (!expectedClaims.has(claimId)) {
        errors.push(`UNSCOPED_CLAIM_RENDERED:${claimId}`)
      }
    }
  }

  if (errors.length > 0) {
    for (const error of errors) {
      console.error(error)
    }
    process.exitCode = 1
  } else {
    console.log(`RENDERED_CLAIMS_OK:${checkedScopes.join(",")}`)
  }
}
