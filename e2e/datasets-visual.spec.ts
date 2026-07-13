import { expect, type Page, test } from "@playwright/test"

const evidencePath = ".omo/visual-qa/datasets/current"
const widths = [320, 375, 768, 1280] as const

async function expectNoDocumentOverflow(page: Page) {
  const dimensions = await page.evaluate(() => ({
    clientWidth: document.documentElement.clientWidth,
    scrollWidth: document.documentElement.scrollWidth,
  }))
  expect(dimensions.scrollWidth).toBeLessThanOrEqual(dimensions.clientWidth)
}

for (const width of widths) {
  test(`dataset registry reflows at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ height: 900, width })
    await page.goto("/#/datasets")
    await expect(
      page.getByRole("heading", { level: 2, name: "The dataset registry" }),
    ).toBeVisible()
    const fontState = await page.evaluate(async () => {
      const [bodyFaces, displayFaces, evidenceFaces] = await Promise.all([
        document.fonts.load('400 16px "Newsreader Variable"', "Atlas"),
        document.fonts.load('800 16px "Barlow Condensed"', "Atlas"),
        document.fonts.load('400 16px "IBM Plex Mono"', "Atlas"),
      ])
      const displayElement = document.querySelector<HTMLElement>(".atlas-type")
      const evidenceElement = document.querySelector<HTMLElement>(".evidence-text")
      return {
        body: bodyFaces.length > 0 && bodyFaces.every((face) => face.status === "loaded"),
        bodyStack: getComputedStyle(document.body).fontFamily,
        display: displayFaces.length > 0 && displayFaces.every((face) => face.status === "loaded"),
        displayStack: displayElement === null ? "" : getComputedStyle(displayElement).fontFamily,
        evidence:
          evidenceFaces.length > 0 && evidenceFaces.every((face) => face.status === "loaded"),
        evidenceStack: evidenceElement === null ? "" : getComputedStyle(evidenceElement).fontFamily,
      }
    })
    expect(fontState).toMatchObject({ body: true, display: true, evidence: true })
    expect(fontState.bodyStack).toContain("Newsreader Variable")
    expect(fontState.displayStack).toContain("Barlow Condensed")
    expect(fontState.evidenceStack).toContain("IBM Plex Mono")

    await expectNoDocumentOverflow(page)
    await page.screenshot({ path: `${evidencePath}/default-top-${width}x900.png` })
    const firstFamily = page.locator(".dataset-family-record").first()
    await firstFamily.scrollIntoViewIfNeeded()
    await expect(firstFamily).toBeVisible()
    await page.screenshot({ path: `${evidencePath}/default-results-${width}x900.png` })
  })
}

for (const width of [320, 1280] as const) {
  test(`dataset facet disclosure remains usable at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ height: 900, width })
    await page.goto("/#/datasets")
    const disclosure = page
      .locator("summary")
      .filter({ hasText: "Refine by category, artifact, access, or provenance" })

    await disclosure.focus()
    await page.keyboard.press("Enter")
    const browserCategory = page.getByRole("checkbox", { name: /Browser & web/ })
    await expect(browserCategory).toBeVisible()
    await browserCategory.focus()
    await page.keyboard.press("Space")
    await expect(browserCategory).toBeChecked()
    await expectNoDocumentOverflow(page)
    await page.screenshot({ path: `${evidencePath}/filters-open-${width}x900.png` })
  })
}

test("dataset query and empty states retain the editorial hierarchy", async ({ page }) => {
  await page.setViewportSize({ height: 900, width: 768 })
  await page.goto("/#/datasets?q=GDPval%20train%20viewer")
  await page.getByRole("heading", { exact: true, name: "GDPval" }).scrollIntoViewIfNeeded()
  await page.screenshot({ path: `${evidencePath}/query-gdpval-768x900.png` })

  await page.setViewportSize({ height: 900, width: 375 })
  await page.getByRole("searchbox", { name: "Search datasets" }).fill("no matching dataset")
  await expect(page.getByRole("status")).toContainText("No datasets match")
  await expectNoDocumentOverflow(page)
  await page.screenshot({ path: `${evidencePath}/empty-375x900.png` })
})

test("dataset registry survives custom text spacing", async ({ page }) => {
  await page.setViewportSize({ height: 900, width: 320 })
  await page.goto("/#/datasets?q=GDPval%20train%20viewer")
  await expect(page.getByRole("heading", { level: 2, name: "The dataset registry" })).toBeVisible()
  await expect(page.getByRole("heading", { exact: true, name: "GDPval" })).toBeVisible()
  await page.addStyleTag({
    content: `
      * { line-height: 1.5 !important; letter-spacing: 0.12em !important; word-spacing: 0.16em !important; }
      p { margin-block-end: 2em !important; }
    `,
  })
  await page.evaluate(() => window.scrollTo(0, 0))
  await expect(page.getByRole("heading", { level: 1, name: "RL Economy Atlas" })).toBeVisible()
  await expect(page.getByRole("searchbox", { name: "Search datasets" })).toBeVisible()
  await expectNoDocumentOverflow(page)
  await page.screenshot({ path: `${evidencePath}/text-spacing-320x900.png` })
})

for (const { label, width } of [
  { label: "200", width: 640 },
  { label: "400", width: 320 },
] as const) {
  test(`dataset registry reflows at the ${label}% effective layout width`, async ({ page }) => {
    await page.setViewportSize({ height: 900, width })
    await page.goto("/#/datasets?q=GDPval%20train%20viewer")

    await expect(page.getByRole("searchbox", { name: "Search datasets" })).toBeVisible()
    await expect(page.getByRole("heading", { exact: true, name: "GDPval" })).toBeVisible()
    await expectNoDocumentOverflow(page)
    await page.screenshot({
      path: `${evidencePath}/zoom-${label}-percent-1280-equivalent-${width}x900.png`,
    })
  })
}

test("primary dataset controls meet the minimum touch target", async ({ page }) => {
  await page.setViewportSize({ height: 900, width: 320 })
  await page.goto("/#/datasets")

  const controls = [
    page.getByRole("searchbox", { name: "Search datasets" }),
    page.getByRole("button", { name: "Reset dataset filters" }),
    page.locator("summary").filter({
      hasText: "Refine by category, artifact, access, or provenance",
    }),
  ]

  for (const control of controls) {
    const box = await control.boundingBox()
    expect(box).not.toBeNull()
    expect(box?.height).toBeGreaterThanOrEqual(44)
  }
})

test("dataset registry remains legible in forced colors and reduced motion", async ({ page }) => {
  await page.emulateMedia({
    colorScheme: "light",
    contrast: "more",
    forcedColors: "active",
    reducedMotion: "reduce",
  })
  await page.setViewportSize({ height: 900, width: 375 })
  await page.goto("/#/datasets?q=GDPval%20train%20viewer")

  await expect(page.getByRole("searchbox", { name: "Search datasets" })).toBeVisible()
  await expect(
    page.getByRole("link", { name: /GDPval train viewer.*opens in a new tab/ }),
  ).toBeVisible()
  await expectNoDocumentOverflow(page)
  await page.screenshot({ path: `${evidencePath}/forced-colors-reduced-motion-375x900.png` })
})
