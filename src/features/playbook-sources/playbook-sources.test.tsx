import { render, screen } from "@testing-library/react"
import { ShowcasePage } from "./ShowcasePage"

describe("showcase", () => {
  it("keeps the evidence-only primitive showcase available", () => {
    render(<ShowcasePage />)

    expect(screen.getByRole("heading", { name: "Primitive showcase" })).toBeVisible()
    expect(screen.getByRole("heading", { name: "Navigation and orientation" })).toBeVisible()
    expect(screen.getByRole("heading", { name: "Controls and disclosure" })).toBeVisible()
    expect(screen.getByRole("heading", { name: "Evidence and data" })).toBeVisible()
    expect(screen.getByRole("heading", { name: "Empty and error states" })).toBeVisible()
  })
})
