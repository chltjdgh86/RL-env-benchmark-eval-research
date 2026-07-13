import { chromium } from "@playwright/test"
import { mkdir, writeFile } from "node:fs/promises"

const baseUrl = process.env.PLAYWRIGHT_BASE_URL
if (baseUrl === undefined) throw new Error("PLAYWRIGHT_BASE_URL is required")

const evidenceDir = ".omo/evidence/final-trim-current/browser-semantic"
await mkdir(evidenceDir, { recursive: true })

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

const browser = await chromium.launch({ headless: true })
const page = await browser.newPage({ viewport: { width: 1280, height: 900 } })
const failures = []

async function visit(route) {
  await page.goto(`${baseUrl}/?manualQa=final-trim#/${route}`, { waitUntil: "networkidle" })
}

try {
  await visit("guide")
  const guideAudit = await page.evaluate((links) => {
    const anchors = [...document.querySelectorAll("a")].map((anchor) => ({
      href: anchor.getAttribute("href"),
      name: anchor.textContent?.trim(),
      rel: anchor.getAttribute("rel"),
      target: anchor.getAttribute("target"),
    }))
    const normalized = (href) => href?.replace(/\/$/u, "")
    const partFive = links.map(([name, href]) => {
      const matches = anchors.filter((anchor) => anchor.name === name && normalized(anchor.href) === href)
      return { href, matches, name }
    })
    return {
      disallowedRoutes: anchors.filter((anchor) => /#\/(?:overview|market-map|industries)(?:$|[?#/])/u.test(anchor.href ?? "")),
      partFive,
      searchboxCount: document.querySelectorAll("input[type=search]").length,
      qStillParsed: new URLSearchParams(window.location.search).get("q") === null,
    }
  }, expectedPartFiveLinks)
  const qProbe = await page.evaluate(() => {
    window.location.hash = "#/guide?q=retained"
    return new Promise((resolve) => window.setTimeout(() => resolve(window.location.hash), 50))
  })
  guideAudit.qHashProbe = qProbe
  guideAudit.qStillParsed = qProbe === "#/guide?q=retained"
  if (guideAudit.disallowedRoutes.length > 0) failures.push("removed route links remain on guide")
  if (guideAudit.searchboxCount !== 0) failures.push("guide shell exposes a removed toolbar search box")
  if (!guideAudit.qStillParsed) failures.push("q hash grammar is not retained")
  for (const item of guideAudit.partFive) {
    if (item.matches.length !== 1) failures.push(`Part 5 link count/url mismatch: ${item.name}`)
    const anchor = item.matches[0]
    if (anchor?.target !== "_blank" || anchor.rel !== "noreferrer") failures.push(`Part 5 link attributes mismatch: ${item.name}`)
  }
  await page.screenshot({ path: `${evidenceDir}/guide-part-five-1280.png`, fullPage: true })

  await visit("companies")
  const companiesAudit = await page.evaluate(() => ({
    eyebrowTexts: [...document.querySelectorAll("p, span, div")]
      .map((element) => element.textContent?.trim())
      .filter((text) => text === "Companies"),
    disallowedRoutes: [...document.querySelectorAll("a")]
      .map((anchor) => anchor.getAttribute("href"))
      .filter((href) => /#\/(?:overview|market-map|industries)(?:$|[?#/])/u.test(href ?? "")),
    searchboxCount: document.querySelectorAll("input[type=search]").length,
  }))
  if (companiesAudit.eyebrowTexts.length === 0) failures.push("Companies eyebrow text missing")
  if (companiesAudit.disallowedRoutes.length > 0) failures.push("removed route links remain on companies")
  if (companiesAudit.searchboxCount !== 0) failures.push("companies shell exposes a removed toolbar search box")
  await page.screenshot({ path: `${evidenceDir}/companies-1280.png`, fullPage: true })

  await visit("showcase")
  const showcaseAudit = await page.evaluate(() => ({
    searchboxCount: document.querySelectorAll("input[type=search]").length,
    disallowedRoutes: [...document.querySelectorAll("a")]
      .map((anchor) => anchor.getAttribute("href"))
      .filter((href) => /#\/(?:overview|market-map|industries)(?:$|[?#/])/u.test(href ?? "")),
  }))
  const showcaseSearchboxCount = await page.getByRole("searchbox", { name: "Search fixture records" }).count()
  showcaseAudit.accessibleSearchboxCount = showcaseSearchboxCount
  if (showcaseSearchboxCount !== 1) failures.push("showcase SearchField primitive missing")
  if (showcaseAudit.disallowedRoutes.length > 0) failures.push("removed route links remain on showcase")
  await page.screenshot({ path: `${evidenceDir}/showcase-1280.png`, fullPage: true })

  const report = { baseUrl, companiesAudit, failures, guideAudit, showcaseAudit, verdict: failures.length === 0 ? "PASS" : "FAIL" }
  await writeFile(`${evidenceDir}/report.json`, `${JSON.stringify(report, null, 2)}\n`)
  console.log(JSON.stringify(report, null, 2))
  if (failures.length > 0) process.exitCode = 1
} finally {
  await browser.close()
}
