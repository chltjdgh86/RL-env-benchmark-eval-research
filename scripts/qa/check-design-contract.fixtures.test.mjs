import assert from "node:assert/strict"
import { readFileSync } from "node:fs"
import test from "node:test"
import { validateDesignContract } from "./design-contract.mjs"

const design = readFileSync("DESIGN.md", "utf8")
const state = readFileSync(".omo/frontend-design/state.md", "utf8")
const plan = readFileSync(".omo/plans/rl-market-intelligence-site.md", "utf8")

test("rejects an undeclared token when a fixture uses one", () => {
  // Given: a canonical contract with one undeclared CSS token use.
  const fixture = `${design}\nvar(--fixture-rogue)`
  // When: the contract validator inspects the fixture.
  const errors = validateDesignContract({ design: fixture, state, plan })
  // Then: it reports the exact undeclared token.
  assert.ok(errors.includes("UNDECLARED_TOKEN:--fixture-rogue"))
})

test("rejects a contract fixture without the loading state", () => {
  // Given: a design contract whose loading state vocabulary was removed.
  const fixture = design.replace(/loading/gi, "pending-fixture")
  // When: the contract validator inspects the fixture.
  const errors = validateDesignContract({ design: fixture, state, plan })
  // Then: it reports the absent state.
  assert.ok(errors.includes("MISSING_STATE:loading"))
})

test("rejects a contract fixture without the canonical showcase route", () => {
  // Given: a design and operating state that both use a foreign route.
  const fixtureDesign = design.replaceAll("#/showcase", "#/examples")
  const fixtureState = state.replaceAll("#/showcase", "#/examples")
  // When: the contract validator inspects the fixture.
  const errors = validateDesignContract({ design: fixtureDesign, state: fixtureState, plan })
  // Then: it reports the required route.
  assert.ok(errors.includes("MISSING_ROUTE:#/showcase"))
})
