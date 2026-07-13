import { spawnSync } from "node:child_process"
import { existsSync, mkdirSync, writeFileSync } from "node:fs"
import { dirname } from "node:path"
import { chromium } from "@playwright/test"

const receiptPath = process.argv[2]
const selectionPath = "scripts/qa/browser-selection.json"
const systemChromePath = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"

if (receiptPath === undefined) {
  console.error("usage: provision-browser.mjs <receipt-path>")
  process.exitCode = 2
} else {
  const install = spawnSync("bunx", ["playwright", "install", "chromium"], {
    encoding: "utf8",
  })
  const installExit = install.status ?? 1
  const candidates = [
    { kind: "playwright-chromium", executablePath: chromium.executablePath() },
    { kind: "system-chrome", executablePath: systemChromePath },
  ]

  let selection = null
  const attempts = []
  for (const candidate of candidates) {
    if (selection !== null) {
      break
    }
    if (!existsSync(candidate.executablePath)) {
      attempts.push(`${candidate.kind}:missing:${candidate.executablePath}`)
      continue
    }

    try {
      const browser = await chromium.launch({
        executablePath: candidate.executablePath,
        headless: true,
      })
      const page = await browser.newPage()
      await page.setContent("<main>browser provisioning smoke</main>")
      const smokeText = await page.locator("main").textContent()
      const version = browser.version()
      await browser.close()

      if (smokeText !== "browser provisioning smoke") {
        attempts.push(`${candidate.kind}:smoke-content-mismatch:${candidate.executablePath}`)
      } else {
        selection = { ...candidate, version }
        attempts.push(`${candidate.kind}:launched:${candidate.executablePath}`)
      }
    } catch (error) {
      const message = error instanceof Error ? error.message.split("\n")[0] : "unknown launch error"
      attempts.push(`${candidate.kind}:launch-failed:${candidate.executablePath}:${message}`)
    }
  }

  mkdirSync(dirname(receiptPath), { recursive: true })
  const receiptLines = [
    `PLAYWRIGHT_INSTALL_EXIT:${installExit}`,
    `PLAYWRIGHT_INSTALL_STDOUT:${install.stdout.trim()}`,
    `PLAYWRIGHT_INSTALL_STDERR:${install.stderr.trim()}`,
    ...attempts.map((attempt) => `BROWSER_ATTEMPT:${attempt}`),
  ]

  if (selection === null) {
    receiptLines.push("BROWSER_LAUNCH_OUTCOME:failed")
    writeFileSync(receiptPath, `${receiptLines.join("\n")}\n`)
    console.error("BROWSER_PROVISIONING_FAILED")
    process.exitCode = 1
  } else {
    writeFileSync(selectionPath, `${JSON.stringify(selection, null, 2)}\n`)
    receiptLines.push(
      `BROWSER_KIND:${selection.kind}`,
      `BROWSER_PATH:${selection.executablePath}`,
      `BROWSER_VERSION:${selection.version}`,
      "BROWSER_LAUNCH_OUTCOME:success",
    )
    writeFileSync(receiptPath, `${receiptLines.join("\n")}\n`)
    console.log(receiptLines.slice(-4).join("\n"))
  }
}
