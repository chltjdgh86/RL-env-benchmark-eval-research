import { render, screen } from "@testing-library/react"
import { researchIndex } from "../data/research"
import { parseHash } from "../domain/hash-state"
import { GlobalFilters } from "./GlobalFilters"
import { buildHashReferences } from "./hash-references"

describe("GlobalFilters", () => {
  it("shows only entity facets and keeps the hash grammar available", () => {
    const state = parseHash("#/companies?theme=market", buildHashReferences(researchIndex)).state
    render(<GlobalFilters index={researchIndex} state={state} />)

    expect(screen.getByText("Filter by segment, business model, or company")).toBeVisible()
    expect(screen.getByRole("link", { name: "Clear all facets" })).toBeInTheDocument()
    for (const label of ["Segment", "Business model", "Company"]) {
      expect(screen.getByRole("group", { name: label })).toBeInTheDocument()
    }
    for (const label of [
      "Theme",
      "Claim kind",
      "Source type",
      "Control",
      "Independence",
      "Derived support",
      "Confidence",
      "Temporal state",
      "Risk",
      "Access",
    ]) {
      expect(screen.queryByRole("group", { name: label })).not.toBeInTheDocument()
    }
  })
})
