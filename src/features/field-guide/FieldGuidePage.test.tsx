import { render, screen, within } from "@testing-library/react"
import { axe } from "jest-axe"
import { FieldGuidePage } from "./FieldGuidePage"

describe("FieldGuidePage", () => {
  it("renders the complete newcomer guide with its required structure", () => {
    const { container } = render(<FieldGuidePage />)

    expect(
      screen.getByRole("heading", { level: 2, name: "The post-training economy, explained" }),
    ).toBeVisible()
    expect(screen.queryByRole("heading", { level: 1 })).not.toBeInTheDocument()
    expect(container.querySelectorAll("section[id^='guide-part-']")).toHaveLength(9)
    expect(container.querySelectorAll(".guide-tldr")).toHaveLength(0)
    expect(container.querySelectorAll(".guide-contents a")).toHaveLength(9)
    expect(container.querySelectorAll(".table-scroll-region")).toHaveLength(3)
    expect(container.querySelectorAll(".guide-dossier")).toHaveLength(0)
    expect(container.querySelectorAll(".guide-segments > li")).toHaveLength(7)
    expect(screen.getByRole("heading", { name: "Who sells RL environments today" })).toBeVisible()
    expect(
      screen.getByRole("heading", { name: "Data-and-talent platforms with environment offers" }),
    ).toBeVisible()
    expect(screen.getByRole("heading", { name: "Environment specialists" })).toBeVisible()
    expect(container).toHaveTextContent(
      "Scale AI — managed data, model evaluation, and RL environment services",
    )
    expect(screen.queryByRole("heading", { name: /room for/i })).not.toBeInTheDocument()
    expect(container).toHaveTextContent("before any larger commitment")
    expect(container).not.toHaveTextContent("The metric trap.")
  })

  it("links every contents entry to the specified destination", () => {
    const { container } = render(<FieldGuidePage />)
    const contents = container.querySelector<HTMLElement>(".guide-contents")
    expect(contents).not.toBeNull()
    if (contents === null) return

    for (let part = 1; part <= 9; part += 1) {
      expect(within(contents).getByRole("link", { name: new RegExp(`^${part} `) })).toHaveAttribute(
        "href",
        `#guide-part-${part}`,
      )
    }
  })

  it("renders evidence-reading guidance and no methodology vocabulary", () => {
    const { container } = render(<FieldGuidePage />)

    expect(container).not.toHaveTextContent(
      /receipts|countersearch|\bExa\b|claim ids|migration ledgers/i,
    )
  })

  it("keeps removed sections out of guide links", () => {
    const { container } = render(<FieldGuidePage />)
    const routeLinks = new Set(
      [...container.querySelectorAll<HTMLAnchorElement>('a[href^="#/"]')].map((link) =>
        link.getAttribute("href"),
      ),
    )

    expect(routeLinks).toEqual(new Set(["#/companies"]))
    expect(screen.getByText("Managed data / BPO")).toBeVisible()
    expect(screen.getByRole("link", { name: "Companies" })).toBeVisible()
    expect(screen.queryByRole("link", { name: "Market map" })).not.toBeInTheDocument()
    expect(screen.queryByRole("link", { name: "Industries" })).not.toBeInTheDocument()
  })

  it("links the Deeptune Part 5 entry to its website", () => {
    const { container } = render(<FieldGuidePage />)

    expect(within(container).getByRole("link", { name: "Deeptune" })).toHaveAttribute(
      "href",
      "https://deeptune.com",
    )
  })

  it("has no automated accessibility violations", async () => {
    const { container } = render(<FieldGuidePage />)
    expect((await axe(container)).violations).toEqual([])
  })
})
