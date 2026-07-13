import { parseClaimScope } from "./claim-scope.mjs"

const manifestFlagIndex = process.argv.indexOf("--manifest")
const manifestPath = manifestFlagIndex === -1 ? undefined : process.argv[manifestFlagIndex + 1]

if (manifestPath === undefined) {
  console.error("usage: check-claim-scope.mjs --manifest <claim-scope.json>")
  process.exitCode = 2
} else {
  const result = parseClaimScope(manifestPath)
  if (result.errors.length > 0) {
    for (const error of result.errors) {
      console.error(error)
    }
    process.exitCode = 1
  } else {
    console.log(`CLAIM_SCOPE_OK:${result.manifest?.scope ?? "unknown"}`)
  }
}
