import { chromium } from "playwright"

const assert = (condition, message) => {
  if (!condition) throw new Error(message)
}

const browser = await chromium.launch({ headless: true })
const page = await browser.newPage({ viewport: { width: 1280, height: 900 } })
const browserErrors = []
page.on("pageerror", (error) => browserErrors.push(error.message))

await page.goto("http://127.0.0.1:4173/#/overview?q=Scale", { waitUntil: "networkidle" })
await page.waitForTimeout(100)
const retiredRoute = await page.evaluate(() => ({
  alert: document.querySelector('[role="alert"]')?.textContent?.trim(),
  hash: window.location.hash,
  heading: document.querySelector("h2")?.textContent?.trim(),
}))
assert(retiredRoute.hash === "#/guide?q=Scale", `retired route did not recover: ${retiredRoute.hash}`)
assert(retiredRoute.heading === "The post-training economy, explained", `retired route rendered wrong page: ${retiredRoute.heading}`)

await page.goto("http://127.0.0.1:4173/#/companies?q=%20Scale%20%20AI%20", { waitUntil: "networkidle" })
await page.waitForTimeout(100)
const normalizedQuery = await page.evaluate(() => ({
  hash: window.location.hash,
  scaleCardVisible: Array.from(document.querySelectorAll("article.landscape-record h4")).some((element) => element.textContent?.trim() === "Scale AI"),
}))
assert(normalizedQuery.hash === "#/companies?q=Scale%20AI", `q did not normalize/canonicalize: ${normalizedQuery.hash}`)
assert(normalizedQuery.scaleCardVisible, "normalized q did not retain the Scale AI result")
assert(browserErrors.length === 0, `browser errors: ${browserErrors.join(" | ")}`)
console.log(JSON.stringify({ browserErrors, normalizedQuery, retiredRoute, verdict: "PASS" }, null, 2))
await browser.close()
