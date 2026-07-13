import { expect, test } from "@playwright/test"

const showcaseWidths = [320, 375, 768, 1280] as const
const evidencePath = ".omo/evidence/task-5-rl-market-intelligence-site"

for (const width of showcaseWidths) {
  test(`showcase reflows without page overflow at ${width}px`, async ({ page }) => {
    // Given: the canonical showcase route at the target CSS-pixel width.
    await page.setViewportSize({ height: 900, width })
    await page.goto("/#/showcase")

    // When: the complete primitive surface settles.
    await expect(page.getByRole("heading", { level: 2, name: "Primitive showcase" })).toBeVisible()
    const dimensions = await page.evaluate(() => ({
      clientWidth: document.documentElement.clientWidth,
      scrollWidth: document.documentElement.scrollWidth,
    }))

    // Then: all content stays inside the document width and fresh evidence is captured.
    expect(dimensions.scrollWidth).toBeLessThanOrEqual(dimensions.clientWidth)
    await page.screenshot({
      fullPage: true,
      path: `${evidencePath}/showcase-${width}px.png`,
    })
  })
}

test("showcase survives the exact WCAG text-spacing override", async ({ page }) => {
  // Given: a 320px effective viewport and the canonical showcase route.
  await page.setViewportSize({ height: 900, width: 320 })
  await page.goto("/#/showcase")

  // When: WCAG 1.4.12 spacing is injected across the document.
  await page.addStyleTag({
    content: `
      * { line-height: 1.5 !important; letter-spacing: 0.12em !important; word-spacing: 0.16em !important; }
      p { margin-block-end: 2em !important; }
    `,
  })
  const dimensions = await page.evaluate(() => ({
    clientWidth: document.documentElement.clientWidth,
    scrollWidth: document.documentElement.scrollWidth,
  }))

  // Then: content remains visible and the page does not gain horizontal overflow.
  await expect(page.getByText("Evidence and data", { exact: true })).toBeVisible()
  expect(dimensions.scrollWidth).toBeLessThanOrEqual(dimensions.clientWidth)
  await page.screenshot({ fullPage: true, path: `${evidencePath}/showcase-text-spacing.png` })
})

test("showcase survives four-times page scale at its effective 320px viewport", async ({
  page,
}) => {
  // Given: the effective viewport used by a four-times page-scale stress test.
  await page.setViewportSize({ height: 900, width: 320 })
  await page.goto("/#/showcase")
  const session = await page.context().newCDPSession(page)

  // When: Chromium applies a four-times page scale factor.
  await session.send("Emulation.setPageScaleFactor", { pageScaleFactor: 4 })

  // Then: the primary title and compact controls remain reachable.
  await expect(page.getByRole("heading", { level: 2, name: "Primitive showcase" })).toBeVisible()
  await expect(page.getByRole("searchbox", { name: "Search fixture records" })).toBeVisible()
  await page.screenshot({ fullPage: true, path: `${evidencePath}/showcase-400-percent.png` })
})

test("drawer closes with Escape and restores trigger focus", async ({ page }) => {
  // Given: the canonical route and its evidence-drawer trigger.
  await page.goto("/#/showcase")
  const trigger = page.getByRole("button", { name: "Open Evidence drawer" })

  // When: the drawer opens and the reader presses Escape.
  await trigger.click()
  await expect(page.getByRole("dialog", { name: "Evidence drawer" })).toBeVisible()
  await page.keyboard.press("Escape")

  // Then: the modal closes and focus returns to the trigger.
  await expect(page.getByRole("dialog", { name: "Evidence drawer" })).toHaveCount(0)
  await expect(trigger).toBeFocused()
})

test("showcase remains operable under reduced motion and forced colors", async ({ page }) => {
  // Given: system-level reduced-motion, increased-contrast, and forced-color preferences.
  await page.emulateMedia({
    colorScheme: "light",
    contrast: "more",
    forcedColors: "active",
    reducedMotion: "reduce",
  })

  // When: the canonical showcase route renders.
  await page.goto("/#/showcase")

  // Then: navigation and disclosure controls remain visible and operable.
  await expect(page.getByRole("navigation", { name: "Showcase utility navigation" })).toBeVisible()
  await page.getByRole("button", { name: "Methodology disclosure" }).click()
  await expect(
    page.getByText("Evidence dimensions remain separate when details expand."),
  ).toBeVisible()
})
