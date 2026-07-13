import { readFileSync } from "node:fs"
import { resolve } from "node:path"
import { transform } from "lightningcss"

const root = resolve(import.meta.dirname, "../../..")
const files = ["src/styles/tokens.css", "src/styles/primitives.css"]
const styles = Object.fromEntries(
  files.map((file) => [file, readFileSync(resolve(root, file), "utf8")]),
)
const combined = files.map((file) => styles[file]).join("\n")

for (const file of files) {
  transform({
    filename: file,
    code: Buffer.from(styles[file]),
    minify: false,
  })
}

const requiredDeclarations = new Map([
  ["--paper", "#f4f0e6"],
  ["--paper-raised", "#fbf8f0"],
  ["--paper-subdued", "#e6dfd0"],
  ["--ink", "#181713"],
  ["--ink-hard", "#0b0b09"],
  ["--ink-muted", "#5a554c"],
  ["--rule-strong", "#181713"],
  ["--rule-quiet", "#a79f90"],
  ["--accent", "#f04b16"],
  ["--accent-ink", "#a92d00"],
  ["--accent-wash", "#f8d4c5"],
  ["--status-success", "#235e3b"],
  ["--status-warning", "#7a4e00"],
  ["--status-error", "#8f1d16"],
  ["--paper-inverse", "#fbf8f0"],
  ["--font-display", '"Barlow Condensed", "Arial Narrow", sans-serif'],
  ["--font-body", '"Newsreader", Georgia, serif'],
  [
    "--font-evidence",
    '"IBM Plex Mono", "SFMono-Regular", Consolas, monospace',
  ],
  ["--type-atlas", "clamp(3.25rem, 7vw, 7.5rem)"],
  ["--type-display", "clamp(2.75rem, 5.2vw, 5.5rem)"],
  ["--type-h1", "clamp(2.25rem, 4vw, 4rem)"],
  ["--type-h2", "clamp(1.75rem, 2.8vw, 2.5rem)"],
  ["--type-h3", "1.5rem"],
  ["--type-deck", "1.25rem"],
  ["--type-body", "1.0625rem"],
  ["--type-body-sm", "0.9375rem"],
  ["--type-ui", "0.9375rem"],
  ["--type-evidence", "0.8125rem"],
  ["--type-kicker", "0.75rem"],
  ["--space-0", "0"],
  ["--space-1", "4px"],
  ["--space-2", "8px"],
  ["--space-3", "12px"],
  ["--space-4", "16px"],
  ["--space-5", "20px"],
  ["--space-6", "24px"],
  ["--space-8", "32px"],
  ["--space-10", "40px"],
  ["--space-12", "48px"],
  ["--space-16", "64px"],
  ["--space-20", "80px"],
  ["--space-24", "96px"],
  ["--rule-hairline", "1px"],
  ["--rule-default", "2px"],
  ["--rule-emphasis", "4px"],
  ["--control-min", "44px"],
  ["--focus-width", "3px"],
  ["--page-max", "1600px"],
  ["--reading-max", "70ch"],
  ["--motion-micro", "120ms"],
  ["--motion-standard", "180ms"],
  ["--motion-emphasis", "240ms"],
  ["--motion-micro-easing", "ease-out"],
  ["--motion-standard-easing", "cubic-bezier(0.2, 0, 0, 1)"],
  ["--motion-emphasis-easing", "cubic-bezier(0.16, 1, 0.3, 1)"],
  ["--depth-0-rule", "0"],
  ["--depth-1-rule", "var(--rule-hairline)"],
  ["--depth-2-rule", "var(--rule-hairline)"],
  ["--depth-3-rule", "var(--rule-default)"],
  ["--depth-4-rule", "var(--rule-emphasis)"],
  ["--depth-5-background", "var(--ink-hard)"],
  ["--depth-5-color", "var(--paper-inverse)"],
])

for (const [property, value] of requiredDeclarations) {
  const declaration = `${property}: ${value};`
  if (!styles["src/styles/tokens.css"].includes(declaration)) {
    throw new Error(`Missing declaration: ${declaration}`)
  }
}

const requiredFragments = [
  "color-scheme: light",
  "body::before",
  "mix-blend-mode: multiply",
  ".skip-link",
  ":focus-visible",
  ".atlas-grid",
  ".section-ribbon",
  ".data-table",
  ".evidence-tag",
  ".accordion__trigger",
  ".drawer-backdrop",
  "[data-text-spacing=\"wcag\"]",
  "line-height: 1.5",
  "letter-spacing: 0.12em",
  "word-spacing: 0.16em",
  "margin-block-end: 2em",
  "@media (max-width: 375px)",
  "@media (max-width: 639px)",
  "@media (min-width: 640px)",
  "@media (min-width: 960px)",
  "@media (min-width: 1280px)",
  "@media (pointer: coarse)",
  "@media (prefers-contrast: more)",
  "@media (prefers-reduced-motion: reduce)",
  "@media (forced-colors: active)",
  "@media print",
  "a[data-source-url][href]::after",
]

for (const fragment of requiredFragments) {
  if (!combined.includes(fragment)) {
    throw new Error(`Missing CSS contract fragment: ${fragment}`)
  }
}

const forbiddenPatterns = new Map([
  ["gradient", /gradient\s*\(/iu],
  ["box shadow", /box-shadow\s*:/iu],
  ["drop shadow", /drop-shadow\s*\(/iu],
  ["backdrop blur", /backdrop-filter\s*:/iu],
  ["blur filter", /filter\s*:\s*blur\s*\(/iu],
  ["purple", /\bpurple\b/iu],
  [
    "external font or CSS URL",
    /(?:@import\s+|url\(\s*["']?\s*(?:https?:)?\/\/)/iu,
  ],
  ["fixed text height", /(^|[;{\s])height\s*:/imu],
  ["important override", /!important/iu],
])

for (const [name, pattern] of forbiddenPatterns) {
  if (pattern.test(combined)) {
    throw new Error(`Forbidden ${name} pattern found`)
  }
}

const hexColors = [...combined.matchAll(/#[0-9a-f]{3,8}\b/giu)].map(
  (match) => match[0].toLowerCase(),
)
const allowedHexColors = new Set(
  [...requiredDeclarations.entries()]
    .filter(([, value]) => value.startsWith("#"))
    .map(([, value]) => value),
)
const orphanHexColors = [...new Set(hexColors)].filter(
  (value) => !allowedHexColors.has(value),
)

if (orphanHexColors.length > 0) {
  throw new Error(`Undeclared colors: ${orphanHexColors.join(", ")}`)
}

const cssBytes = files.reduce(
  (total, file) => total + Buffer.byteLength(styles[file]),
  0,
)

console.log(
  `CSS_FOUNDATION_OK declarations=${requiredDeclarations.size} fragments=${requiredFragments.length} forbidden=0 orphanColors=0 cssBytes=${cssBytes}`,
)
