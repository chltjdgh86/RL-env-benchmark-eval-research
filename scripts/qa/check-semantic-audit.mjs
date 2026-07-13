import { existsSync, readFileSync } from "node:fs"

const fixtureFlagIndex = process.argv.indexOf("--fixture")
const auditPath =
  fixtureFlagIndex === -1 ? ".omo/evidence/semantic-audit.json" : process.argv[fixtureFlagIndex + 1]

if (auditPath === undefined || !existsSync(auditPath)) {
  console.error("SEMANTIC_AUDIT_ARTIFACT_MISSING")
  process.exitCode = 1
} else {
  const audit = JSON.parse(readFileSync(auditPath, "utf8"))
  const rejectedEntailments =
    typeof audit === "object" && audit !== null && Array.isArray(audit.rejectedEntailments)
      ? audit.rejectedEntailments
      : null

  if (rejectedEntailments === null) {
    console.error("SEMANTIC_AUDIT_INVALID")
    process.exitCode = 1
  } else if (rejectedEntailments.length > 0) {
    console.error(`REJECTED_ENTAILMENT_PRESENT:${rejectedEntailments.length}`)
    process.exitCode = 1
  } else {
    console.log("SEMANTIC_AUDIT_OK")
  }
}
