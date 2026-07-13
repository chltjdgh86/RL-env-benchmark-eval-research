import { render, screen, within } from "@testing-library/react"
import { researchIndex } from "../data/research"
import { AtlasShell } from "./AtlasShell"

describe("AtlasShell hash restoration", () => {
  it("restores canonical route and query state before rendering", () => {
    window.history.replaceState({}, "", "#/companies?q=mercor&kind=inference")
    render(
      <AtlasShell
        index={researchIndex}
        renderSection={(state) => (
          <p>
            {state.section} · {state.q}
          </p>
        )}
      />,
    )

    expect(screen.getByRole("link", { name: "Companies" })).toHaveAttribute("aria-current", "page")
    expect(screen.getByRole("main", { name: "RL Economy Atlas" })).toHaveTextContent(
      "companies · mercor",
    )
  })

  it("recovers malformed routes to the field guide with an explicit warning", () => {
    window.history.replaceState({}, "", "#/not-a-route?unknown=1")
    render(<AtlasShell index={researchIndex} renderSection={(state) => <p>{state.section}</p>} />)

    expect(screen.getByRole("alert")).toHaveTextContent("invalid_section")
    expect(screen.getByRole("main", { name: "RL Economy Atlas" })).toHaveTextContent("guide")
  })

  it("keeps section navigation but hides filters on the field guide", () => {
    window.history.replaceState({}, "", "#/guide")
    render(<AtlasShell index={researchIndex} renderSection={(state) => <p>{state.section}</p>} />)

    expect(screen.getByRole("link", { name: "Field guide" })).toHaveAttribute(
      "aria-current",
      "page",
    )
    expect(
      screen.queryByText("Filter by segment, business model, or company"),
    ).not.toBeInTheDocument()
    expect(
      screen.getByText(
        "A field guide to training data, RL environments, evaluations, and the companies assembling the stack.",
      ),
    ).toBeVisible()
    expect(screen.getByText("Market fact-sheet · evidence as of 11 July 2026")).toBeVisible()
  })

  it("exposes exactly the retained atlas sections in navigation", () => {
    window.history.replaceState({}, "", "#/guide")
    render(<AtlasShell index={researchIndex} renderSection={(state) => <p>{state.section}</p>} />)

    const navigation = screen.getByRole("navigation", { name: "Atlas sections" })
    expect(within(navigation).getAllByRole("link")).toHaveLength(2)
    expect(
      within(navigation)
        .getAllByRole("link")
        .map((link) => link.textContent),
    ).toEqual(["Field guide", "Companies"])
  })
})
