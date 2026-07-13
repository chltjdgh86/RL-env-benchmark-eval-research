const requiredDesignSections = [
  ["## 0. Research Log", "Research Log"],
  ["## 1. Atmosphere & Identity", "Atmosphere/Identity"],
  ["## 2. Color", "Color"],
  ["## 3. Typography", "Typography"],
  ["## 4. Spacing & Layout", "Spacing/Layout"],
  ["## 5. Components", "Components"],
  ["## 6. Motion & Interaction", "Motion/Interaction"],
  ["## 7. Depth & Surface", "Depth/Surface"],
  ["## 8. Accessibility Constraints & Accepted Debt", "Accessibility/Debt"],
]

const requiredStateSections = [
  "## Current Objective",
  "## Locked Decisions",
  "## Primitive State Ledger",
  "## Primitive Showcase Contract",
  "## Verification Matrix",
  "## Design Debt Register",
  "## Handoff Notes",
]

const requiredTokens = [
  "--paper",
  "--ink",
  "--accent",
  "--type-atlas",
  "--space-4",
  "--control-min",
  "--motion-micro",
]

const requiredPrimitives = ["EvidenceTagSet", "StrategyHypothesis", "Scorecard"]
const requiredStates = ["loading", "empty", "error", "focus"]

function extractCanonicalTable(markdown) {
  const headingIndex = markdown.indexOf("Canonical enum-to-display contract")
  if (headingIndex === -1) {
    return null
  }

  const afterHeading = markdown.slice(headingIndex)
  const lines = afterHeading.split("\n").slice(1)
  const firstRowIndex = lines.findIndex((line) => line.startsWith("|"))
  if (firstRowIndex === -1) {
    return null
  }

  const rows = []
  for (const line of lines.slice(firstRowIndex)) {
    if (!line.startsWith("|")) {
      break
    }
    rows.push(line)
  }
  return rows.length === 0 ? null : rows.join("\n")
}

function undeclaredTokenErrors(design) {
  const declarations = new Set(
    [...design.matchAll(/^\|\s*`(--[a-z0-9-]+)`\s*\|/gim)].map((match) => match[1]),
  )
  const usages = [...design.matchAll(/var\((--[a-z0-9-]+)\)/gi)].map((match) => match[1])
  return [...new Set(usages)]
    .filter((token) => token !== undefined && !declarations.has(token))
    .map((token) => `UNDECLARED_TOKEN:${token}`)
}

export function validateDesignContract({ design, state, plan }) {
  const errors = []

  for (const [heading, label] of requiredDesignSections) {
    if (!design.includes(heading)) {
      errors.push(`MISSING_SECTION:${label}`)
    }
  }

  for (const heading of requiredStateSections) {
    if (!state.includes(heading)) {
      errors.push(`MISSING_STATE_SECTION:${heading.slice(3)}`)
    }
  }

  const designTable = extractCanonicalTable(design)
  const planTable = extractCanonicalTable(plan)
  if (designTable === null || planTable === null || designTable !== planTable) {
    errors.push("ENUM_DISPLAY_TABLE_DRIFT")
  }

  for (const token of requiredTokens) {
    if (!design.includes(`\`${token}\``)) {
      errors.push(`MISSING_TOKEN:${token}`)
    }
  }

  for (const primitive of requiredPrimitives) {
    if (!design.includes(primitive) || !state.includes(primitive)) {
      errors.push(`MISSING_PRIMITIVE:${primitive}`)
    }
  }

  for (const requiredState of requiredStates) {
    if (!design.toLowerCase().includes(requiredState)) {
      errors.push(`MISSING_STATE:${requiredState}`)
    }
  }

  if (!design.includes("#/showcase") || !state.includes("#/showcase")) {
    errors.push("MISSING_ROUTE:#/showcase")
  }

  const requiredPhrases = [
    "320px",
    "actual 400%",
    "WCAG text-spacing",
    "No design or accessibility debt is accepted",
    "There is no weight-editing",
    "There is no scoring, weighting, ranking, winner, selected, or user-editable state",
  ]
  for (const phrase of requiredPhrases) {
    if (!design.includes(phrase)) {
      errors.push(`MISSING_CONTRACT:${phrase}`)
    }
  }

  errors.push(...undeclaredTokenErrors(design))
  return errors
}
