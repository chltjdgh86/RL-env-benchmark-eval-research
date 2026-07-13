import { describe, expect, it } from "vitest"

import { matchesSearch, normalizeSearchTerms } from "./search"

describe("normalizeSearchTerms", () => {
  it("matches every normalized token when accents use different Unicode forms", () => {
    const givenQuery = "  A\u0301TLAS   runtime  "

    const whenNormalized = normalizeSearchTerms(givenQuery)

    expect(whenNormalized.text).toBe("átlas runtime")
    expect(matchesSearch("Runtime evidence from Átlas Research", whenNormalized)).toBe(true)
    expect(matchesSearch("Átlas Research", whenNormalized)).toBe(false)
  })

  it("caps normalized search at 120 Unicode code points", () => {
    const givenLongQuery = `${"😀".repeat(120)}extra`

    const whenNormalized = normalizeSearchTerms(givenLongQuery)

    expect(Array.from(whenNormalized.text)).toHaveLength(120)
    expect(whenNormalized.text.endsWith("😀")).toBe(true)
  })
})
