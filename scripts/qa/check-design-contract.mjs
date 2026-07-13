import { readFileSync } from "node:fs"
import { resolve } from "node:path"
import { validateDesignContract } from "./design-contract.mjs"

const fixtureFlagIndex = process.argv.indexOf("--fixture")
const fixturePath = fixtureFlagIndex === -1 ? undefined : process.argv[fixtureFlagIndex + 1]
const designPath = fixturePath ?? "DESIGN.md"
const design = readFileSync(resolve(designPath), "utf8")
const state = readFileSync(resolve(".omo/frontend-design/state.md"), "utf8")
const plan = readFileSync(resolve(".omo/plans/rl-market-intelligence-site.md"), "utf8")
const errors = validateDesignContract({ design, state, plan })

if (errors.length > 0) {
  for (const error of errors) {
    console.error(error)
  }
  process.exitCode = 1
} else {
  console.log("DESIGN_CONTRACT_OK")
}
