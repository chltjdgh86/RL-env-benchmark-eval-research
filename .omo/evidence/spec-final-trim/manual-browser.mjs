import { mkdir } from "node:fs/promises"
import { chromium } from "playwright"

const evidenceDir = ".omo/evidence/spec-final-trim"
const expectedPartFiveLinks = [
  ["Scale AI", "https://scale.com"],
  ["Turing", "https://www.turing.com"],
  ["Micro1", "https://www.micro1.ai"],
  ["Mercor", "https://www.mercor.com"],
  ["AfterQuery", "https://www.afterquery.com"],
  ["Snorkel AI", "https://snorkel.ai"],
  ["Deeptune", "https://deeptune.com"],
  ["Fleet AI", "https://www.fleetai.com"],
  ["Refresh", "https://refresh.dev"],
  ["Halluminate", "https://www.halluminate.ai"],
  ["Vibrant Labs", "https://vibrantlabs.com"],
  ["Prime Intellect", "https://www.primeintellect.ai"],
  ["Chakra Labs", "https://chakra.dev"],
  ["HUD", "https://hud.ai"],
  ["Plato", "https://plato.so"],
  ["Mechanize", "https://mechanize.work"],
  ["Bespoke Labs", "https://bespokelabs.ai"],
  ["Habitat", "https://habitat.inc"],
  ["Cua", "https://cua.ai"],
  ["BenchFlow", "https://www.benchflow.ai"],
  ["Aviro", "https://aviro.ai"],
  ["Theta", "https://thetasoftware.com"],
  ["Quesma", "https://quesma.com"],
  ["Huzzle Labs", "https://labs.huzzle.com"],
  ["Matrices", "https://matrices.ai"],
  ["hillclimb", "https://www.hillclimb.com"],
  ["Andromede", "https://andromede.ai"],
  ["Calaveras AI", "https://calaveras.ai"],
  ["Idler", "https://idler.ai"],
  ["AIChamp", "https://aichamp.com"],
  ["General Reasoning", "https://gr.inc"],
  ["Preference Model", "https://www.preferencemodel.com"],
  ["Good Start Labs", "https://goodstartlabs.com"],
  ["Vmax", "https://vmax.ai"],
  ["TrainLoop", "https://www.trainloop.ai"],
]

const assert = (condition, message) => {
  if (!condition) throw new Error(message)
}

await mkdir(evidenceDir, { recursive: true })
const browser = await chromium.launch({ headless: true })
const page = await browser.newPage({ viewport: { width: 1280, height: 900 } })
const browserErrors = []
page.on("pageerror", (error) => browserErrors.push(error.message))
page.on("console", (message) => {
  if (message.type() === "error") browserErrors.push(message.text())
})

await page.goto("http://127.0.0.1:4173/#/guide?q=Scale", { waitUntil: "networkidle" })
const guide = await page.evaluate((expected) => {
  const nav = Array.from(document.querySelectorAll('nav[aria-label="Atlas sections"] a')).map(
    (anchor) => ({ current: anchor.getAttribute("aria-current"), href: anchor.getAttribute("href"), text: anchor.textContent?.trim() }),
  )
  const anchors = Array.from(document.querySelectorAll("a"))
  const external = anchors
    .filter((anchor) => expected.some(([name]) => anchor.textContent?.trim() === name))
    .map((anchor) => ({ href: anchor.getAttribute("href"), name: anchor.textContent?.trim(), rel: anchor.getAttribute("rel"), target: anchor.getAttribute("target") }))
  return {
    documentWidth: { client: document.documentElement.clientWidth, scroll: document.documentElement.scrollWidth },
    external,
    h1Count: document.querySelectorAll("h1").length,
    inputs: Array.from(document.querySelectorAll("input")).map((input) => ({ name: input.getAttribute("name"), type: input.getAttribute("type") })),
    internalHrefs: anchors.map((anchor) => anchor.getAttribute("href")).filter((href) => href?.startsWith("#/")),
    locationHash: window.location.hash,
    nav,
    partElevenCompanies: anchors.filter((anchor) => anchor.textContent?.trim() === "Companies").map((anchor) => anchor.getAttribute("href")),
  }
}, expectedPartFiveLinks)

assert(guide.locationHash === "#/guide?q=Scale", `q was not preserved: ${guide.locationHash}`)
assert(guide.nav.map((item) => item.text).join("|") === "Field guide|Companies", `unexpected shell nav: ${JSON.stringify(guide.nav)}`)
assert(guide.inputs.every((input) => input.type !== "search"), `search field rendered: ${JSON.stringify(guide.inputs)}`)
assert(guide.internalHrefs.every((href) => !["#/overview", "#/market-map", "#/industries"].includes(href)), `removed route link rendered: ${JSON.stringify(guide.internalHrefs)}`)
assert(guide.partElevenCompanies.includes("#/companies?q=Scale"), `Part 11 Companies link lost q: ${JSON.stringify(guide.partElevenCompanies)}`)
assert(guide.external.length === expectedPartFiveLinks.length, `Part 5 link count mismatch: ${guide.external.length}`)
for (const [name, href] of expectedPartFiveLinks) {
  const actual = guide.external.find((link) => link.name === name)
  assert(actual?.href === href, `${name} href: ${actual?.href}`)
  assert(actual?.target === "_blank" && actual.rel === "noreferrer", `${name} target/rel: ${JSON.stringify(actual)}`)
}
await page.screenshot({ fullPage: true, path: `${evidenceDir}/guide-shell-1280.png` })
await page.screenshot({ fullPage: false, path: `${evidenceDir}/guide-shell-1280-viewport.png` })

await page.getByRole("link", { name: "Companies", exact: true }).first().click()
await page.waitForLoadState("networkidle")
const companies = await page.evaluate(() => ({
  documentWidth: { client: document.documentElement.clientWidth, scroll: document.documentElement.scrollWidth },
  eyebrow: document.querySelector('section[aria-labelledby="companies-title"] > header .kicker')?.textContent?.trim(),
  h1Count: document.querySelectorAll("h1").length,
  locationHash: window.location.hash,
}))
assert(companies.locationHash === "#/companies?q=Scale", `Companies navigation lost q: ${companies.locationHash}`)
assert(companies.eyebrow === "Companies", `Companies eyebrow: ${companies.eyebrow}`)
await page.screenshot({ fullPage: true, path: `${evidenceDir}/companies-1280.png` })
await page.screenshot({ fullPage: false, path: `${evidenceDir}/companies-1280-viewport.png` })

await page.setViewportSize({ width: 320, height: 900 })
await page.goto("http://127.0.0.1:4173/#/guide?q=Scale", { waitUntil: "networkidle" })
const mobile = await page.evaluate(() => ({ client: document.documentElement.clientWidth, scroll: document.documentElement.scrollWidth }))
assert(mobile.scroll <= mobile.client, `guide mobile overflow: ${JSON.stringify(mobile)}`)
await page.screenshot({ fullPage: true, path: `${evidenceDir}/guide-shell-320.png` })
await page.screenshot({ fullPage: false, path: `${evidenceDir}/guide-shell-320-viewport.png` })
assert(browserErrors.length === 0, `browser errors: ${browserErrors.join(" | ")}`)

console.log(JSON.stringify({ browserErrors, companies, guide, mobile, verdict: "PASS" }, null, 2))
await browser.close()
