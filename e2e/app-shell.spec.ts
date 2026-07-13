import AxeBuilder from "@axe-core/playwright"
import { expect, test } from "@playwright/test"

test("app shell smoke exposes the application landmark", async ({ page }) => {
  // Given: the production preview URL.
  const consoleErrors: string[] = []
  page.on("console", (message) => {
    if (message.type() === "error") {
      consoleErrors.push(message.text())
    }
  })
  // When: a reader opens the atlas scaffold.
  await page.goto("/")

  // Then: the client mount exposes the named main landmark.
  await expect(page.getByRole("main", { name: "RL Economy Atlas" })).toBeVisible()
  await expect(page.getByRole("heading", { level: 1 })).toBeVisible()
  expect(consoleErrors).toEqual([])
})

test("app shell has no automated accessibility violations", async ({ page }) => {
  // Given: the production scaffold rendered in Chromium.
  await page.goto("/")
  // When: the browser surface is audited against axe rules.
  const results = await new AxeBuilder({ page }).analyze()
  // Then: the scaffold introduces no accessibility violation.
  expect(results.violations).toEqual([])
})
