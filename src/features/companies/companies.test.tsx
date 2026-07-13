import { render, screen } from "@testing-library/react"
import { CompaniesPage } from "./CompaniesPage"

const requestedSupplementalNames = [
  "Kled AI",
  "Luel",
  "Chakra Labs",
  "Habitat Inc",
  "Cua",
  "Dojo",
  "Proximal",
  "Idler",
  "Calaveras AI",
  "BenchFlow",
  "Vmax",
  "Andromede",
  "Aviro",
  "AIChamp",
  "General Reasoning",
  "Champ AI",
  "Haladir",
  "hillclimb",
  "Gray Swan",
  "Theta",
  "Preference Model",
  "Vals AI",
  "Andon Labs",
  "Verita AI",
  "Good Start Labs",
  "Quesma",
  "Phinity Labs",
  "Rise Data Labs",
  "Kairos",
  "TrainLoop",
  "Huzzle Labs",
] as const

const sweepSupplementalNames = [
  "Vetto",
  "Traverse",
  "Cartpole",
  "Markov",
  "Osmosis",
  "RunRL",
  "Applied Compute",
  "Adaptive ML",
  "Veris AI",
  "Aboda AI",
  "The LLM Data Company",
  "Origin Lab",
] as const

describe("company intelligence", () => {
  it("renders one ordered 132-company landscape", () => {
    const { container } = render(<CompaniesPage />)
    const landscape = container.querySelector('[aria-labelledby="company-landscape-title"]')
    expect(landscape).not.toBeNull()
    expect(landscape?.querySelectorAll(".landscape-grid .landscape-record")).toHaveLength(132)
    expect(screen.getByRole("heading", { name: "132 of 132 companies" })).toBeVisible()
    expect(screen.queryByRole("heading", { name: /Recently surfaced/i })).not.toBeInTheDocument()
    expect(
      screen.queryByText(/named dossier|named-company|user-supplied roster/i),
    ).not.toBeInTheDocument()
  })

  it("renders every record through the same simple card contract", () => {
    const { container } = render(<CompaniesPage />)
    const landscape = container.querySelector('[aria-labelledby="company-landscape-title"]')
    const scaleCard = container.querySelector("#company-co_scale-ai")
    const browserUseCard = container.querySelector("#company-adj_browser-use")
    const kledCard = container.querySelector("#company-adj_kled-ai")

    expect(landscape?.querySelector(".landscape-grid")?.firstElementChild).toHaveTextContent(
      "Aviro",
    )
    expect(scaleCard).toHaveClass("landscape-record")
    expect(browserUseCard).toHaveClass("landscape-record")
    expect(kledCard).toHaveClass("landscape-record")
    expect(scaleCard?.querySelector(".kicker")).toHaveTextContent("training data workforce")
    expect(browserUseCard?.querySelector(".kicker")).toHaveTextContent(
      "environment computer use runtime",
    )
    expect(kledCard).toHaveTextContent(
      "“Kled V2 is now fully out of beta with no waitlist. Anyone can sign up instantly and begin earning by uploading their data.”",
    )
    for (const card of [scaleCard, browserUseCard, kledCard]) {
      expect(card?.querySelectorAll("a")).toHaveLength(1)
      expect(card?.querySelector(".evidence-text")).toBeInTheDocument()
    }
  })

  it("renders authored descriptions without corpus claims or dossier headings", () => {
    render(<CompaniesPage />)

    expect(
      screen.getByRole("heading", { level: 2, name: "The company landscape" }),
    ).toHaveAttribute("id", "companies-title")
    expect(screen.getByRole("heading", { level: 4, name: "Scale AI" })).toBeVisible()
    expect(
      screen.getByText(
        "Managed data, model evaluation, and RL environment services for labs, government, and enterprise; Meta holds a reported $13.8B minority stake.",
      ),
    ).toBeVisible()
    expect(screen.queryByRole("heading", { name: "Origin" })).not.toBeInTheDocument()
    expect(screen.queryByRole("heading", { name: "Current offer" })).not.toBeInTheDocument()
  })

  it("includes every requested lead without supplemental status language", () => {
    render(<CompaniesPage />)
    for (const name of [...requestedSupplementalNames, ...sweepSupplementalNames]) {
      expect(screen.getByRole("heading", { name })).toBeVisible()
    }
    expect(screen.getAllByText("Refresh", { exact: false }).length).toBeGreaterThan(0)
    expect(screen.getAllByText("Halluminate", { exact: false }).length).toBeGreaterThan(0)
    expect(screen.queryByText(/Observed 12 July 2026\./)).not.toBeInTheDocument()
  })

  it("applies query filtering to supplemental records", () => {
    render(<CompaniesPage filters={{ q: "Kled AI" }} />)

    expect(screen.getByRole("heading", { name: "Kled AI" })).toBeVisible()
    expect(screen.queryByRole("heading", { name: "Luel" })).not.toBeInTheDocument()
  })
})
