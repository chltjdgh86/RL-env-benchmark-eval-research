import { render, screen } from "@testing-library/react"
import { axe } from "jest-axe"
import { App } from "./App"

describe("App scaffold", () => {
  it("mounts the application main landmark when the scaffold starts", () => {
    // Given: the initial application component.
    // When: the scaffold renders into the test document.
    render(<App />)

    // Then: a named main landmark is available to users and future sections.
    expect(screen.getByRole("main", { name: "RL Economy Atlas" })).toBeInTheDocument()
  })

  it("lands on the field guide for an empty hash", () => {
    window.history.replaceState({}, "", "#/")
    render(<App />)

    expect(
      screen.getByRole("heading", { level: 2, name: "The post-training economy, explained" }),
    ).toBeVisible()
    expect(screen.getByRole("link", { name: "Field guide" })).toHaveAttribute(
      "aria-current",
      "page",
    )
  })

  it("has no automated accessibility violations at scaffold baseline", async () => {
    // Given: the mounted application scaffold.
    const { container } = render(<App />)
    // When: the rendered markup is audited against axe rules.
    const results = await axe(container)
    // Then: the baseline introduces no accessibility violation.
    expect(results.violations).toEqual([])
  })
})
