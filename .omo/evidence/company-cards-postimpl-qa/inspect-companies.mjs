import { writeFile } from "node:fs/promises"
import { chromium } from "playwright"

const evidenceDirectory = ".omo/evidence/company-cards-postimpl-qa"
const browser = await chromium.launch({ headless: true })
const page = await browser.newPage()
const consoleMessages = []
const pageErrors = []
page.on("console", (message) => consoleMessages.push({ type: message.type(), text: message.text() }))
page.on("pageerror", (error) => pageErrors.push(error.message))

async function inspect(name, width, height, url = "http://127.0.0.1:4173/#/companies") {
  await page.setViewportSize({ width, height })
  await page.goto(url, { waitUntil: "networkidle" })
  await page.locator("#named-company-title").waitFor()
  await page.screenshot({ path: `${evidenceDirectory}/companies-${name}.png`, fullPage: true })
  const firstCard = page.locator('[aria-labelledby="named-company-title"] .landscape-record').first()
  if ((await firstCard.count()) > 0) {
    await firstCard.screenshot({ path: `${evidenceDirectory}/company-scale-ai-${name}.png` })
  }
  return page.evaluate(() => {
    const named = document.querySelector('[aria-labelledby="named-company-title"]')
    const cards = [...named.querySelectorAll(":scope .landscape-grid > .landscape-record")]
    const first = cards[0]
    const claim = first.querySelector(".corpus-claim")
    const claimStyle = getComputedStyle(claim)
    const statement = claim.querySelector("p")
    const headings = [...document.querySelectorAll("h1,h2,h3,h4,h5,h6")]
    return {
      viewport: { width: innerWidth, height: innerHeight },
      introText: document.querySelector(".feature-intro")?.textContent.trim(),
      namedHeaderText: named.querySelector(".section-heading-row > p")?.textContent.trim(),
      namedCardCount: cards.length,
      totalLandscapeRecords: document.querySelectorAll(".landscape-record").length,
      originHeadingCount: headings.filter((heading) => heading.textContent.trim() === "Origin").length,
      currentOfferHeadingCount: headings.filter((heading) => heading.textContent.trim() === "Current offer")
        .length,
      headingOutline: cards.map((card) =>
        [...card.children]
          .filter((element) => /^H[1-6]$/.test(element.tagName))
          .map((element) => ({ tag: element.tagName, text: element.textContent.trim() })),
      ),
      cardShapes: cards.map((card) => ({
        id: card.id,
        childTags: [...card.children].map((element) => element.tagName),
        nestedSections: card.querySelectorAll("section").length,
        nestedDetails: card.querySelectorAll("details").length,
      })),
      firstCard: {
        name: first.querySelector("h4")?.textContent.trim(),
        children: [...first.children].map((element) => ({
          tag: element.tagName,
          className: element.className,
          claimId: element.getAttribute("data-claim-id") ?? null,
        })),
        sections: first.querySelectorAll("section").length,
        details: first.querySelectorAll("details").length,
      },
      claimStyle: {
        paddingTop: claimStyle.paddingTop,
        borderTopWidth: claimStyle.borderTopWidth,
        backgroundColor: claimStyle.backgroundColor,
        statementMarginBottom: getComputedStyle(statement).marginBottom,
        sourceExists: Boolean(claim.querySelector(".claim-sources")),
      },
      horizontalOverflow: document.documentElement.scrollWidth > innerWidth,
      documentWidth: document.documentElement.scrollWidth,
    }
  })
}

const desktop = await inspect("desktop-1440", 1440, 900)
const mobile = await inspect("mobile-390", 390, 844)
const emptyFilter = await inspect(
  "empty-filter-390",
  390,
  844,
  "http://127.0.0.1:4173/#/companies?q=nonexistentcompanyqa",
)
await writeFile(
  `${evidenceDirectory}/browser-inspection.json`,
  JSON.stringify(
    {
      url: "http://127.0.0.1:4173/#/companies",
      desktop,
      mobile,
      emptyFilter,
      consoleMessages,
      pageErrors,
    },
    null,
    2,
  ),
)
await browser.close()
