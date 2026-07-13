import { readFileSync } from "node:fs"
import { dirname, posix, relative, resolve, sep } from "node:path"

const scopePattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/
const claimPattern = /^clm_[a-z0-9]+(?:-[a-z0-9]+)*$/
const expectedKeys = new Set(["scope", "modulePaths", "expectedClaimIds"])

function toPosixPath(path) {
  return path.split(sep).join(posix.sep)
}

export function parseClaimScope(manifestPath, options = { allowFixtureLocation: false }) {
  const absoluteManifestPath = resolve(manifestPath)
  const parsed = JSON.parse(readFileSync(absoluteManifestPath, "utf8"))
  const errors = []

  if (typeof parsed !== "object" || parsed === null || Array.isArray(parsed)) {
    return { errors: ["CLAIM_SCOPE_NOT_OBJECT"], manifest: null }
  }

  const keys = Object.keys(parsed)
  const unknownKeys = keys.filter((key) => !expectedKeys.has(key))
  if (unknownKeys.length > 0) {
    errors.push(`CLAIM_SCOPE_UNKNOWN_KEYS:${unknownKeys.join(",")}`)
  }

  const scope = parsed.scope
  const modulePaths = parsed.modulePaths
  const expectedClaimIds = parsed.expectedClaimIds

  if (typeof scope !== "string" || !scopePattern.test(scope)) {
    errors.push("CLAIM_SCOPE_INVALID_NAME")
  }
  if (!Array.isArray(modulePaths) || !modulePaths.every((path) => typeof path === "string")) {
    errors.push("CLAIM_SCOPE_INVALID_MODULE_PATHS")
  } else if (modulePaths.length === 0) {
    errors.push("CLAIM_SCOPE_EMPTY_MODULE_PATHS")
  }
  if (
    !Array.isArray(expectedClaimIds) ||
    !expectedClaimIds.every((claimId) => typeof claimId === "string" && claimPattern.test(claimId))
  ) {
    errors.push("CLAIM_SCOPE_INVALID_CLAIM_IDS")
  } else if (expectedClaimIds.length === 0) {
    errors.push("CLAIM_SCOPE_EMPTY_CLAIM_IDS")
  }

  if (
    errors.length > 0 ||
    typeof scope !== "string" ||
    !Array.isArray(modulePaths) ||
    !Array.isArray(expectedClaimIds)
  ) {
    return { errors, manifest: null }
  }

  const expectedPrefix = `src/features/${scope}/`
  const foreignPaths = modulePaths.filter((modulePath) => {
    const normalized = posix.normalize(toPosixPath(modulePath))
    return !normalized.startsWith(expectedPrefix) || normalized.includes("../")
  })
  if (foreignPaths.length > 0) {
    errors.push(`CLAIM_SCOPE_FOREIGN_PATH:${foreignPaths.join(",")}`)
  }

  const relativeManifestPath = toPosixPath(relative(process.cwd(), absoluteManifestPath))
  const isFixture =
    options.allowFixtureLocation || relativeManifestPath.startsWith("scripts/qa/fixtures/")
  const expectedManifestPath = `src/features/${scope}/claim-scope.json`
  if (!isFixture && relativeManifestPath !== expectedManifestPath) {
    errors.push(`CLAIM_SCOPE_WRONG_LOCATION:${relativeManifestPath}`)
  }

  const duplicateModules = modulePaths.filter((path, index) => modulePaths.indexOf(path) !== index)
  const duplicateClaims = expectedClaimIds.filter(
    (claimId, index) => expectedClaimIds.indexOf(claimId) !== index,
  )
  if (duplicateModules.length > 0 || duplicateClaims.length > 0) {
    errors.push("CLAIM_SCOPE_DUPLICATE_VALUES")
  }

  return {
    errors,
    manifest: {
      scope,
      modulePaths,
      expectedClaimIds,
      directory: dirname(absoluteManifestPath),
    },
  }
}
