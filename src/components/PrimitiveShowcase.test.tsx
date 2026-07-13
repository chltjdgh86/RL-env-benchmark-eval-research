import { render, screen } from "@testing-library/react"
import { axe } from "jest-axe"
import { PrimitiveShowcase } from "./PrimitiveShowcase"

describe("PrimitiveShowcase", () => {
  it("organizes every primitive family with real atlas copy", () => {
    // Given: an injected evidence specimen.
    render(
      <PrimitiveShowcase
        evidenceSpecimen={<section aria-label="Evidence specimen">Eight evidence axes</section>}
      />,
    )

    // When: the showcase is read through its document outline.
    const showcaseTitle = screen.getByRole("heading", { level: 1, name: "Primitive showcase" })

    // Then: every primitive family and injected canonical specimen is present.
    expect(showcaseTitle).toBeVisible()
    expect(screen.getByRole("heading", { name: "Navigation and orientation" })).toBeVisible()
    expect(screen.getByRole("heading", { name: "Controls and disclosure" })).toBeVisible()
    expect(screen.getByRole("heading", { name: "Evidence and data" })).toBeVisible()
    expect(screen.getByRole("heading", { name: "Empty and error states" })).toBeVisible()
    expect(screen.getByRole("region", { name: "Evidence specimen" })).toBeVisible()
    expect(screen.queryByText("Strategy and scoring")).not.toBeInTheDocument()
  })

  it("has no automated accessibility violations", async () => {
    // Given: the complete showcase with a semantic placeholder specimen.
    const { container } = render(
      <PrimitiveShowcase
        evidenceSpecimen={<section aria-label="Evidence specimen">Eight evidence axes</section>}
      />,
    )

    // When: the rendered showcase is audited.
    const results = await axe(container)

    // Then: its baseline introduces no automated accessibility violations.
    expect(results.violations).toEqual([])
  })
})
