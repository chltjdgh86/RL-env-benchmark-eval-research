import AxeBuilder from "@axe-core/playwright"
import { expect, test } from "@playwright/test"

test("dataset route exposes the exhaustive registry and required sample surfaces", async ({
  page,
}) => {
  await page.goto("/#/datasets")

  await expect(page.getByRole("heading", { level: 2, name: "The dataset registry" })).toBeVisible()
  const resultCount = page.getByRole("heading", {
    level: 3,
    name: /925 families · 1,083 public surfaces/,
  })
  await expect(resultCount).toBeVisible()
  await expect(resultCount).not.toHaveAttribute("aria-live")
  await expect(page.getByRole("status")).toContainText("925 families · 1,083 public surfaces")
  await expect(
    page.getByText(/132 companies checked · 58 with attributable public data · 74 no-hit/),
  ).toBeVisible()
  await expect(
    page.getByRole("link", { name: /Mercor APEX-Agents leaderboard.*opens in a new tab/ }),
  ).toHaveAttribute("href", "https://www.mercor.com/apex/apex-agents-leaderboard/")
  await expect(
    page.getByRole("link", { name: /^APEX-Agents.*opens in a new tab/u }),
  ).toHaveAttribute("href", "https://huggingface.co/datasets/mercor/apex-agents")
  await expect(
    page.getByRole("link", { name: /GDPval train viewer.*opens in a new tab/ }),
  ).toHaveAttribute("href", "https://huggingface.co/datasets/openai/gdpval/viewer/default/train")
  await expect(
    page.getByRole("link", { name: /Aviro C4 Samples.*opens in a new tab/ }),
  ).toHaveAttribute("href", "https://www.aviro.ai/benchmarks/c4/samples")
  await expect(
    page.getByRole("link", { name: /Stagehand Evals — Evaluation datasets.*opens in a new tab/ }),
  ).toHaveAttribute(
    "href",
    "https://github.com/browserbase/stagehand/tree/main/packages/evals/datasets",
  )
  await expect(page.getByText("Filter by segment, business model, or company")).toHaveCount(0)
})

test("dataset filters produce searchable, resettable, empty-result states", async ({ page }) => {
  await page.goto("/#/datasets?q=GDPval%20train%20viewer")

  const search = page.getByRole("searchbox", { name: "Search datasets" })
  await expect(search).toHaveValue("GDPval train viewer")
  await expect(page.getByRole("heading", { exact: true, name: "GDPval" })).toBeVisible()
  await expect(page.getByRole("heading", { name: /1 family · 2 public surfaces/ })).toBeVisible()

  await search.fill("Browserbase Stagehand")
  await expect.poll(() => new URL(page.url()).hash).toBe("#/datasets?q=Browserbase%20Stagehand")
  await expect(page.getByRole("link", { name: "Companies" })).toHaveAttribute(
    "href",
    "#/companies?q=Browserbase%20Stagehand",
  )

  await search.fill("no public dataset has this name")
  await expect(page.getByRole("status")).toHaveCount(1)
  await expect(page.getByRole("status")).toContainText("No datasets match")
  const reset = page.getByRole("button", { name: "Reset dataset filters" })
  await reset.click()
  await expect(reset).toBeFocused()
  await expect.poll(() => new URL(page.url()).hash).toBe("#/datasets")
  await expect(
    page.getByRole("heading", { name: /925 families · 1,083 public surfaces/ }),
  ).toBeVisible()
})

for (const state of ["default", "filtered", "empty"] as const) {
  test(`dataset registry has no automated accessibility violations in the ${state} state`, async ({
    page,
  }) => {
    const suffix =
      state === "default"
        ? ""
        : state === "filtered"
          ? "?q=GDPval%20train%20viewer"
          : "?q=no%20matching%20dataset"
    await page.goto(`/#/datasets${suffix}`)
    await expect(
      page.getByRole("heading", { level: 2, name: "The dataset registry" }),
    ).toBeVisible()
    if (state === "filtered") {
      await expect(page.getByRole("heading", { exact: true, name: "GDPval" })).toBeVisible()
    }
    if (state === "empty") {
      await expect(page.getByRole("heading", { name: "No datasets match" })).toBeVisible()
    }

    const results = await new AxeBuilder({ page }).analyze()
    expect(results.violations).toEqual([])
  })
}

test("dataset surface links expose their new-tab behavior and open a nested browsing context", async ({
  context,
  page,
}) => {
  await context.route("https://huggingface.co/**", (route) => route.abort())
  await page.goto("/#/datasets?q=GDPval%20train%20viewer")
  const link = page.getByRole("link", { name: /GDPval train viewer.*opens in a new tab/ })
  await expect(link).toHaveAttribute("target", "_blank")
  await expect(link).toHaveAttribute("rel", "noreferrer")

  const popupPromise = page.waitForEvent("popup")
  await link.click()
  const popup = await popupPromise
  await popup.close()
})

test("section navigation moves focus to the atlas heading", async ({ page }) => {
  await page.goto("/#/guide")
  await page.getByRole("link", { name: "Datasets" }).click()
  await expect(page.getByRole("heading", { level: 2, name: "The dataset registry" })).toBeVisible()
  await expect(page.getByRole("heading", { level: 1, name: "RL Economy Atlas" })).toBeFocused()
})

test("skip link focuses main without leaving the dataset route", async ({ page }) => {
  await page.goto("/#/datasets")
  await expect(page.getByRole("heading", { level: 2, name: "The dataset registry" })).toBeVisible()

  await page.keyboard.press("Tab")
  const skipLink = page.getByRole("link", { name: "Skip to main content" })
  await expect(skipLink).toBeFocused()
  await page.keyboard.press("Enter")

  await expect(page.getByRole("main", { name: "RL Economy Atlas" })).toBeFocused()
  await expect.poll(() => new URL(page.url()).hash).toBe("#/datasets")
})
