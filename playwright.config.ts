import { existsSync, readFileSync } from "node:fs"
import { defineConfig, devices } from "@playwright/test"
import { z } from "zod"

const browserSelectionPath = "scripts/qa/browser-selection.json"
const browserSelectionSchema = z.object({
  executablePath: z.string().min(1),
  kind: z.enum(["playwright-chromium", "system-chrome"]),
  version: z.string().min(1),
})

const selectedExecutable = existsSync(browserSelectionPath)
  ? browserSelectionSchema.parse(JSON.parse(readFileSync(browserSelectionPath, "utf8")))
      .executablePath
  : undefined

// biome-ignore lint/style/noDefaultExport: Playwright requires a default configuration export.
export default defineConfig({
  testDir: "./e2e",
  fullyParallel: false,
  retries: 0,
  reporter: "line",
  use: {
    baseURL: process.env["PLAYWRIGHT_BASE_URL"] ?? "http://127.0.0.1:4173",
    launchOptions: selectedExecutable === undefined ? {} : { executablePath: selectedExecutable },
    screenshot: "only-on-failure",
    trace: "retain-on-failure",
  },
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
  ],
})
