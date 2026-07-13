import { chromium } from "playwright"

const assert = (condition, message) => {
  if (!condition) throw new Error(message)
}

const browser = await chromium.launch({ headless: true })
const page = await browser.newPage({ viewport: { width: 320, height: 900 } })
const browserErrors = []
page.on("pageerror", (error) => browserErrors.push(error.message))
page.on("console", (message) => {
  if (message.type() === "error") browserErrors.push(message.text())
})

await page.goto("http://127.0.0.1:4174/#/showcase", { waitUntil: "networkidle" })
const state = await page.evaluate(() => ({
  documentWidth: {
    client: document.documentElement.clientWidth,
    scroll: document.documentElement.scrollWidth,
  },
  h1: Array.from(document.querySelectorAll("h1")).map((heading) => heading.textContent?.trim()),
  h2: Array.from(document.querySelectorAll("h2")).map((heading) => heading.textContent?.trim()),
  nav: Array.from(document.querySelectorAll('nav[aria-label="Atlas sections"] a')).map((anchor) => anchor.textContent?.trim()),
}))

assert(state.documentWidth.scroll <= state.documentWidth.client, `horizontal overflow: ${JSON.stringify(state.documentWidth)}`)
assert(state.h1.length === 1 && state.h1[0] === "RL Economy Atlas", `unexpected h1: ${JSON.stringify(state.h1)}`)
assert(state.h2.includes("Primitive showcase"), `missing showcase h2: ${JSON.stringify(state.h2)}`)
assert(browserErrors.length === 0, `browser errors: ${browserErrors.join(" | ")}`)
await page.screenshot({ path: ".omo/evidence/spec-final-trim-rereview/showcase-320-viewport.png", fullPage: false })
console.log(JSON.stringify({ browserErrors, state, verdict: "PASS" }, null, 2))
await browser.close()
