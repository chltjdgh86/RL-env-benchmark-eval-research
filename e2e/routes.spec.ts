import { expect, type Page, test } from "@playwright/test"

const atlasRoutes = ["guide", "companies", "showcase"] as const
const routeHeadings = {
  guide: "The post-training economy, explained",
  companies: "The company landscape",
  showcase: "Primitive showcase",
} satisfies Record<(typeof atlasRoutes)[number], string>
const visualEvidencePath = ".omo/visual-qa/current"

const captureViewportEvidence = async (page: Page, path: string) => {
  const viewportHeight = page.viewportSize()?.height ?? 900
  const documentHeight = await page.evaluate(() => document.documentElement.scrollHeight)
  const offsets = [
    ...new Set(
      Array.from({ length: Math.max(1, Math.ceil(documentHeight / viewportHeight)) }, (_, index) =>
        Math.min(index * viewportHeight, Math.max(0, documentHeight - viewportHeight)),
      ),
    ),
  ]

  await page.evaluate(() => window.scrollTo(0, 0))
  await page.screenshot({ path, fullPage: false })
  for (const offset of offsets.slice(1)) {
    await page.evaluate((scrollOffset) => window.scrollTo(0, scrollOffset), offset)
    await page.screenshot({
      path: path.replace(/\.png$/u, `-segment-${offset}.png`),
      fullPage: false,
    })
  }
}

test("Showcase keeps the atlas title as the only level-one heading", async ({ page }) => {
  // Given: the component showcase embedded inside the atlas shell.
  await page.goto("/#/showcase")

  // When: the route outline is exposed to assistive technology.
  const levelOneHeadings = page.getByRole("heading", { level: 1 })

  // Then: the shell owns H1 and the embedded showcase starts at H2.
  await expect(levelOneHeadings).toHaveCount(1)
  await expect(levelOneHeadings).toHaveText("RL Economy Atlas")
  await expect(page.getByRole("heading", { level: 2, name: "Primitive showcase" })).toBeVisible()
})

for (const route of atlasRoutes) {
  test(`${route} stays within the 1280px document width`, async ({ page }) => {
    // Given: the complete route at the canonical desktop viewport.
    await page.setViewportSize({ height: 900, width: 1280 })

    // When: the production route finishes rendering.
    await page.goto(`/?visualQa=20260712b#/${route}`)
    const dimensions = await page.evaluate(() => ({
      clientWidth: document.documentElement.clientWidth,
      scrollWidth: document.documentElement.scrollWidth,
    }))

    // Then: content stays within the document and the shell retains one H1.
    expect(dimensions.scrollWidth).toBeLessThanOrEqual(dimensions.clientWidth)
    await expect(page.getByRole("heading", { level: 1, name: "RL Economy Atlas" })).toHaveCount(1)
    await expect(page.getByRole("heading", { level: 2, name: routeHeadings[route] })).toBeVisible()
    await captureViewportEvidence(page, `${visualEvidencePath}/desktop-${route}-1280x900.png`)
  })

  test(`${route} reflows without document overflow at 320px`, async ({ page }) => {
    // Given: the complete route at the minimum supported viewport width.
    await page.setViewportSize({ height: 900, width: 320 })

    // When: the production route finishes rendering.
    await page.goto(`/?visualQa=20260712b#/${route}`)
    const dimensions = await page.evaluate(() => ({
      clientWidth: document.documentElement.clientWidth,
      scrollWidth: document.documentElement.scrollWidth,
    }))

    // Then: content reflows within the page and the shell retains one H1.
    expect(dimensions.scrollWidth).toBeLessThanOrEqual(dimensions.clientWidth)
    await expect(page.getByRole("heading", { level: 1, name: "RL Economy Atlas" })).toHaveCount(1)
    await expect(page.getByRole("heading", { level: 2, name: routeHeadings[route] })).toBeVisible()
    await captureViewportEvidence(page, `${visualEvidencePath}/mobile-${route}-320x900.png`)
  })
}
