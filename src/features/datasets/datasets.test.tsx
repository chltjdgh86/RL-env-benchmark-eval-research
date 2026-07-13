import { render, screen, within } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { axe } from "jest-axe"
import { DatasetsPage } from "./DatasetsPage"
import type { DatasetCompanyCoverage, DatasetFamily } from "./dataset-schema"

const families = [
  {
    familyId: "ds_weblinx",
    name: "WebLINX",
    publisher: "McGill NLP",
    description: "Browser demonstrations with task and environment releases.",
    category: "browser_web",
    tags: ["browser_web", "tasks", "trajectories"],
    verifiedAt: "2026-07-12",
    primarySurfaceId: "surface_weblinx",
    surfaces: [
      {
        surfaceId: "surface_weblinx",
        label: "WebLINX dataset",
        url: "https://huggingface.co/datasets/McGill-NLP/WebLINX",
        kind: "dataset",
        artifacts: ["tasks", "trajectories"],
        access: "open",
        provenance: "first_party",
        notes: "Open demonstrations.",
      },
      {
        surfaceId: "surface_weblinx_repo",
        label: "WebLINX repository",
        url: "https://github.com/McGill-NLP/weblinx",
        kind: "repository",
        artifacts: ["tasks", "environment"],
        access: "open",
        provenance: "first_party",
        notes: "Open task environment.",
      },
    ],
  },
  {
    familyId: "ds_gdpval",
    name: "GDPval",
    publisher: "OpenAI",
    description: "Professional knowledge-work tasks with downloadable reference files.",
    category: "office_professional",
    tags: ["office_professional", "tasks", "references"],
    verifiedAt: "2026-07-12",
    primarySurfaceId: "surface_gdpval",
    surfaces: [
      {
        surfaceId: "surface_gdpval",
        label: "GDPval train viewer",
        url: "https://huggingface.co/datasets/openai/gdpval/viewer/default/train",
        kind: "sample_viewer",
        artifacts: ["tasks", "references", "viewer_sample"],
        access: "open",
        provenance: "first_party",
        notes: "Open train viewer.",
      },
    ],
  },
  {
    familyId: "ds_aviro_c4",
    name: "Aviro C4 Samples",
    publisher: "Aviro",
    description: "A public sample gallery for long-running agent benchmark tasks.",
    category: "company_sample_catalogs",
    tags: ["company_sample_catalogs", "viewer_sample"],
    verifiedAt: "2026-07-12",
    primarySurfaceId: "surface_aviro",
    surfaces: [
      {
        surfaceId: "surface_aviro",
        label: "Aviro C4 samples",
        url: "https://www.aviro.ai/benchmarks/c4/samples",
        kind: "sample_viewer",
        artifacts: ["viewer_sample"],
        access: "sample_demo",
        provenance: "first_party",
        notes: "Public benchmark samples.",
      },
    ],
  },
] as const satisfies readonly DatasetFamily[]

const coverage = [
  { companyId: "adj_browserbase", name: "Browserbase", status: "attributed", familyCount: 1 },
  { companyId: "adj_openpipe", name: "OpenPipe", status: "attributed", familyCount: 1 },
  { companyId: "adj_predibase", name: "Predibase", status: "attributed", familyCount: 1 },
  {
    companyId: "adj_trainloop",
    name: "TrainLoop",
    status: "no_attributable_public_dataset",
    familyCount: 0,
  },
] as const satisfies readonly DatasetCompanyCoverage[]

describe("dataset registry page", () => {
  it("renders grouped descriptions, exact source links, and registry totals", () => {
    const { container } = render(<DatasetsPage companyCoverage={coverage} families={families} />)

    expect(screen.getByRole("heading", { level: 2, name: "The dataset registry" })).toBeVisible()
    expect(screen.getByRole("status")).toHaveTextContent("3 families · 4 public surfaces")
    expect(
      screen.getByRole("heading", { name: "3 families · 4 public surfaces" }),
    ).not.toHaveAttribute("aria-live")
    expect(
      screen.getByText("Browser demonstrations with task and environment releases."),
    ).toBeVisible()
    expect(
      screen.getByRole("link", { name: /GDPval train viewer.*opens in a new tab/ }),
    ).toHaveAttribute("href", "https://huggingface.co/datasets/openai/gdpval/viewer/default/train")
    expect(
      screen.getByRole("link", { name: /Aviro C4 samples.*opens in a new tab/ }),
    ).toHaveAttribute("href", "https://www.aviro.ai/benchmarks/c4/samples")
    expect(screen.getByText("Source links open in a new tab.")).toBeVisible()
    expect(
      screen.getByText(/Sample viewer · Open · First party · Tasks · References/),
    ).toBeVisible()
    expect(
      screen.getByText("Dataset discovery verified 12 July 2026.", { exact: false }),
    ).toBeVisible()
    expect(
      screen.getByText("4 companies checked · 3 with attributable public data · 1 no-hit"),
    ).toBeVisible()
    expect(screen.getByText("TrainLoop")).toBeInTheDocument()
    expect(container.querySelectorAll(".dataset-family-record")).toHaveLength(3)
  })

  it("applies an initial route query across family metadata", () => {
    render(
      <DatasetsPage
        companyCoverage={coverage}
        families={families}
        initialQuery="professional knowledge"
      />,
    )

    expect(screen.getByRole("searchbox", { name: "Search datasets" })).toHaveValue(
      "professional knowledge",
    )
    expect(screen.getByRole("heading", { name: "GDPval" })).toBeVisible()
    expect(screen.queryByRole("heading", { name: "WebLINX" })).not.toBeInTheDocument()
    expect(screen.getByRole("heading", { name: "1 family · 1 public surface" })).toBeVisible()
  })

  it("supports OR within facets, AND across facets, empty results, and reset", async () => {
    const user = userEvent.setup()
    const queryChanges: string[] = []
    render(
      <DatasetsPage
        companyCoverage={coverage}
        families={families}
        onQueryChange={(query) => queryChanges.push(query)}
      />,
    )

    const filters = screen.getByRole("region", { name: "Dataset filters" })
    await user.click(within(filters).getByText("Show filters"))
    expect(within(filters).getByText("Hide filters")).toBeInTheDocument()
    expect(within(filters).getByText("Hide filters").closest("details")).toHaveAttribute("open")
    await user.click(within(filters).getByRole("checkbox", { name: /Browser & web/ }))
    await user.click(within(filters).getByRole("checkbox", { name: /Office & professional/ }))
    expect(screen.getByRole("heading", { name: "WebLINX" })).toBeVisible()
    expect(screen.getByRole("heading", { name: "GDPval" })).toBeVisible()
    expect(screen.queryByRole("heading", { name: "Aviro C4 Samples" })).not.toBeInTheDocument()

    await user.click(within(filters).getByRole("checkbox", { name: /Sample viewers/ }))
    expect(screen.getByRole("heading", { name: "GDPval" })).toBeVisible()
    expect(screen.queryByRole("heading", { name: "WebLINX" })).not.toBeInTheDocument()

    await user.type(screen.getByRole("searchbox", { name: "Search datasets" }), "no match")
    expect(screen.getAllByRole("status")).toHaveLength(1)
    expect(screen.getByRole("status")).toHaveTextContent("No datasets match")
    const reset = screen.getByRole("button", { name: "Reset dataset filters" })
    await user.click(reset)
    expect(reset).toHaveFocus()
    expect(reset).toBeEnabled()
    expect(queryChanges.at(-1)).toBe("")
    expect(screen.getByRole("heading", { name: "3 families · 4 public surfaces" })).toBeVisible()
  })

  it("has no automated accessibility violations", async () => {
    const { container } = render(<DatasetsPage companyCoverage={coverage} families={families} />)
    expect((await axe(container)).violations).toEqual([])
  })
})
