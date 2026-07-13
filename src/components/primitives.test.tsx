import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { axe } from "jest-axe"
import * as components from "./index"
import {
  Accordion,
  ComparisonRow,
  ContextRail,
  DataTable,
  DossierHeader,
  Drawer,
  EmptyState,
  ErrorNotice,
  FilterControl,
  FilterTray,
  MarketMap,
  Masthead,
  Metric,
  SearchField,
  SectionRail,
  SectionRibbon,
  SkipLink,
  TimelineItem,
  UtilityNav,
} from "./index"

describe("component primitive exports", () => {
  it("exposes the domain-independent primitive surface", () => {
    // Given: the component package used by the showcase and product features.
    const expectedExports = [
      "Accordion",
      "DataTable",
      "ComparisonRow",
      "ClaimText",
      "ContextRail",
      "DossierHeader",
      "Drawer",
      "EmptyState",
      "ErrorNotice",
      "FilterControl",
      "FilterTray",
      "Masthead",
      "MarketMap",
      "Metric",
      "PrimitiveShowcase",
      "SearchField",
      "SectionRail",
      "SectionRibbon",
      "SkipLink",
      "SourceLink",
      "TimelineItem",
      "UtilityNav",
    ]

    // When: consumers inspect the public primitive surface.
    const availableExports = Object.keys(components)

    // Then: every reusable domain-independent primitive is available.
    expect(availableExports).toEqual(expect.arrayContaining(expectedExports))
  })
})

describe("editorial primitives", () => {
  it("links the skip control to the main landmark", () => {
    // Given: the first focusable control on an atlas page.
    render(<SkipLink />)

    // When: the skip control is located by its accessible name.
    const skipLink = screen.getByRole("link", { name: "Skip to main content" })

    // Then: it targets the canonical main-content landmark.
    expect(skipLink).toHaveAttribute("href", "#main-content")
  })

  it("focuses the skip target without replacing the application route", async () => {
    const user = userEvent.setup()
    window.history.replaceState({}, "", "#/datasets")
    render(
      <>
        <SkipLink />
        <main id="main-content" tabIndex={-1}>
          Registry
        </main>
      </>,
    )

    await user.click(screen.getByRole("link", { name: "Skip to main content" }))

    expect(screen.getByRole("main")).toHaveFocus()
    expect(window.location.hash).toBe("#/datasets")
  })

  it("renders a numbered section ribbon as a real heading", () => {
    // Given: a ruled atlas section with a supporting action.
    render(
      <SectionRibbon
        action={<a href="#methodology">Read methodology</a>}
        headingLevel={2}
        number="03"
        title="Market structure"
      />,
    )

    // When: the section is read through heading semantics.
    const heading = screen.getByRole("heading", { level: 2, name: "Market structure" })

    // Then: numbering remains visible and the action remains a link.
    expect(heading).toHaveTextContent("03")
    expect(screen.getByRole("link", { name: "Read methodology" })).toHaveAttribute(
      "href",
      "#methodology",
    )
  })

  it("expands accordion evidence with its labeled control", async () => {
    // Given: collapsed methodology evidence.
    const user = userEvent.setup()
    render(
      <Accordion id="method-note" title="Method note">
        Evidence remains in the document.
      </Accordion>,
    )
    const trigger = screen.getByRole("button", { name: "Method note" })

    // When: the reader activates the disclosure.
    await user.click(trigger)

    // Then: the state and ruled evidence panel are exposed together.
    expect(trigger).toHaveAttribute("aria-expanded", "true")
    expect(screen.getByText("Evidence remains in the document.")).toBeVisible()
  })

  it("opens a named drawer and makes the page behind it inert", async () => {
    // Given: navigation content launched from the application root.
    const user = userEvent.setup()
    const appRoot = document.createElement("div")
    appRoot.id = "root"
    document.body.append(appRoot)
    render(
      <Drawer description="Atlas sections and evidence views" title="Atlas navigation">
        <a href="#/companies">Companies</a>
      </Drawer>,
      { container: appRoot },
    )

    // When: the reader opens the navigation drawer.
    await user.click(screen.getByRole("button", { name: "Open Atlas navigation" }))

    // Then: the modal is named and the underlying application is inert.
    expect(screen.getByRole("dialog", { name: "Atlas navigation" })).toBeVisible()
    expect(appRoot).toHaveAttribute("inert")
  })

  it("closes a drawer with Escape and restores trigger focus", async () => {
    // Given: an open navigation drawer.
    const user = userEvent.setup()
    const appRoot = document.createElement("div")
    appRoot.id = "root"
    document.body.append(appRoot)
    render(
      <Drawer description="Atlas sections and evidence views" title="Evidence navigation">
        <a href="#companies">Companies</a>
      </Drawer>,
      { container: appRoot },
    )
    const trigger = screen.getByRole("button", { name: "Open Evidence navigation" })
    await user.click(trigger)

    // When: the reader presses Escape.
    await user.keyboard("{Escape}")

    // Then: the dialog closes, the page is active, and focus returns to its trigger.
    expect(screen.queryByRole("dialog", { name: "Evidence navigation" })).not.toBeInTheDocument()
    expect(appRoot).not.toHaveAttribute("inert")
    expect(trigger).toHaveFocus()
  })

  it("submits a settled search query", async () => {
    // Given: a labeled atlas search and an observable query sink.
    const user = userEvent.setup()
    const submittedQueries: string[] = []
    render(
      <SearchField
        label="Search the research corpus"
        onSubmit={(query: string) => submittedQueries.push(query)}
        resultStatus="133 sources indexed"
      />,
    )
    const input = screen.getByRole("searchbox", { name: "Search the research corpus" })

    // When: the reader types a query and submits it with Enter.
    await user.type(input, "browser environments{Enter}")

    // Then: the normalized visible query is submitted once.
    expect(submittedQueries).toEqual(["browser environments"])
  })

  it("clears a populated search with Escape without moving focus", async () => {
    // Given: a search field containing a query.
    const user = userEvent.setup()
    render(<SearchField initialValue="Mercor" label="Search companies" onSubmit={() => {}} />)
    const input = screen.getByRole("searchbox", { name: "Search companies" })
    await user.click(input)

    // When: the reader presses Escape.
    await user.keyboard("{Escape}")

    // Then: the query clears and keyboard focus stays in the search field.
    expect(input).toHaveValue("")
    expect(input).toHaveFocus()
  })

  it("renders a captioned data table inside its named comparison region", () => {
    // Given: a small source-comparison table.
    render(
      <DataTable caption="Source comparison" scrollInstruction="Scroll table horizontally">
        <thead>
          <tr>
            <th scope="col">Source</th>
            <th scope="col">Access</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <th scope="row">Procurement notice</th>
            <td>Open</td>
          </tr>
        </tbody>
      </DataTable>,
    )

    // When: the comparison is located by region and table semantics.
    const region = screen.getByRole("region", { name: "Source comparison table" })

    // Then: the caption and explicit overflow instruction are available in the same region.
    expect(region).toContainElement(screen.getByRole("table", { name: "Source comparison" }))
    expect(region).toHaveTextContent("Scroll table horizontally")
  })

  it("clears an active filter tray through a visible control", async () => {
    // Given: two active evidence filters.
    const user = userEvent.setup()
    const clearEvents: string[] = []
    render(
      <FilterTray activeCount={2} onClear={() => clearEvents.push("cleared")}>
        <label>
          Kind
          <select defaultValue="inference">
            <option value="inference">Inference</option>
          </select>
        </label>
      </FilterTray>,
    )

    // When: the reader clears every active filter.
    await user.click(screen.getByRole("button", { name: "Clear all filters" }))

    // Then: one clear request is emitted without replacing the filter control.
    expect(clearEvents).toEqual(["cleared"])
    expect(screen.getByRole("combobox", { name: "Kind" })).toBeVisible()
  })

  it("keeps metric time basis and evidence adjacent", () => {
    // Given: a reported run-rate metric.
    render(
      <Metric
        evidence={<a href="#src-s06">Source S06</a>}
        label="Reported gross run rate"
        qualifier="Annualized at July 2026; not audited revenue"
        value="$2B+"
      />,
    )

    // When: the metric is read as a grouped figure.
    const metric = screen.getByRole("figure", { name: "Reported gross run rate" })

    // Then: its value, qualification, and source remain in that group.
    expect(metric).toHaveTextContent("$2B+")
    expect(metric).toHaveTextContent("Annualized at July 2026; not audited revenue")
    expect(metric).toContainElement(screen.getByRole("link", { name: "Source S06" }))
  })

  it("marks the active utility destination without hiding unavailable routes", () => {
    // Given: current, available, and unavailable atlas destinations.
    render(
      <UtilityNav
        ariaLabel="Atlas utilities"
        items={[
          { href: "#/guide", label: "Field guide", current: true },
          { href: "#/companies", label: "Companies" },
          { href: "#/export", label: "Export", disabled: true },
        ]}
      />,
    )

    // When: the utility navigation is inspected.
    const guide = screen.getByRole("link", { name: "Field guide" })

    // Then: current and unavailable states are explicit in text and attributes.
    expect(guide).toHaveAttribute("aria-current", "page")
    expect(screen.getByText("Export")).toHaveAttribute("aria-disabled", "true")
  })

  it("renders masthead state and recovery notices without accessibility violations", async () => {
    // Given: the atlas title, corpus status, empty state, and interaction error.
    const { container } = render(
      <>
        <Masthead
          corpusStatus="133 sources indexed through 11 July 2026"
          edition="Research edition 01"
          strapline="Source-linked market intelligence"
          title="The RL Economy Atlas"
        />
        <EmptyState action={<a href="#/companies">Back to companies</a>} title="No matching claims">
          Clear one or more evidence filters.
        </EmptyState>
        <ErrorNotice action={<button type="button">Retry</button>} title="Corpus unavailable">
          The local research files could not be parsed.
        </ErrorNotice>
      </>,
    )

    // When: the combined primitive surface is audited.
    const results = await axe(container)

    // Then: the page has one H1, an alert, recovery actions, and no automated violations.
    expect(screen.getByRole("heading", { level: 1, name: "The RL Economy Atlas" })).toBeVisible()
    expect(screen.getByRole("alert")).toHaveTextContent("Corpus unavailable")
    expect(screen.getByRole("link", { name: "Back to companies" })).toBeVisible()
    expect(results.violations).toEqual([])
  })

  it("keeps section location and active-filter context in a named rail", () => {
    // Given: the ordered atlas sections and current evidence scope.
    render(
      <SectionRail
        filterSummary="2 active filters"
        items={[
          { href: "#/guide", label: "Field guide" },
          { href: "#/companies", label: "Companies", current: true },
        ]}
        legend="Orange rules mark the current section."
        number="INDEX"
        title="Atlas sections"
      />,
    )

    // When: the section rail is inspected as navigation.
    const rail = screen.getByRole("navigation", { name: "Atlas sections" })

    // Then: document order, current location, legend, and filter scope remain visible.
    expect(rail).toContainElement(screen.getByRole("link", { name: "Field guide" }))
    expect(screen.getByRole("link", { name: "Companies" })).toHaveAttribute("aria-current", "page")
    expect(rail).toHaveTextContent("Orange rules mark the current section.")
    expect(rail).toHaveTextContent("2 active filters")
  })

  it("renders context instructions and native filter groups", () => {
    // Given: explicit reading guidance and a canonical filter group.
    render(
      <ContextRail title="How to read this view">
        <p>Every diagram has the same evidence in text.</p>
        <FilterControl legend="Claim kind">
          <label>
            <input defaultChecked type="checkbox" /> Inference
          </label>
        </FilterControl>
      </ContextRail>,
    )

    // When: complementary guidance and filters are located semantically.
    const context = screen.getByRole("complementary", { name: "How to read this view" })

    // Then: instructions are text and the native group retains its legend.
    expect(context).toHaveTextContent("Every diagram has the same evidence in text.")
    expect(screen.getByRole("group", { name: "Claim kind" })).toBeVisible()
    expect(screen.getByRole("checkbox", { name: "Inference" })).toBeChecked()
  })

  it("presents dossier identity, thesis, status, and cutoff without a logo", () => {
    // Given: a current company dossier header.
    render(
      <DossierHeader
        cutoff="Evidence cutoff 11 July 2026"
        identity="Cronus Technologies, Inc. · afterquery.com"
        name="AfterQuery"
        status="Active · current public offer"
        thesis="Expert data operations extending into reinforcement-learning environments."
      >
        <a href="#business-model">Expert + environment services</a>
      </DossierHeader>,
    )

    // When: the dossier heading is read.
    const heading = screen.getByRole("heading", { level: 2, name: "AfterQuery" })

    // Then: identity, status, thesis, cutoff, and model link remain adjacent.
    expect(heading.closest("header")).toHaveTextContent("Cronus Technologies, Inc.")
    expect(heading.closest("header")).toHaveTextContent("Active · current public offer")
    expect(heading.closest("header")).toHaveTextContent("Evidence cutoff 11 July 2026")
    expect(screen.getByRole("link", { name: "Expert + environment services" })).toBeVisible()
  })

  it("renders comparison values as repeated labeled groups", () => {
    // Given: two partly comparable company values.
    render(
      <ComparisonRow
        label="Reported scale"
        values={[
          {
            entity: "Mercor",
            value: "$2B+ gross run rate",
            evidence: <a href="#src-mercor">Source Mercor</a>,
          },
          {
            entity: "AfterQuery",
            value: "$100M reported run rate",
            evidence: <a href="#src-afterquery">Source AfterQuery</a>,
          },
        ]}
        warning="Company-reported figures are not audited or directly comparable."
      />,
    )

    // When: the attribute comparison is located.
    const comparison = screen.getByRole("region", { name: "Reported scale comparison" })

    // Then: each entity keeps its value and evidence while the warning stays visible.
    expect(comparison).toHaveTextContent("Mercor$2B+ gross run rateSource Mercor")
    expect(comparison).toHaveTextContent("AfterQuery$100M reported run rateSource AfterQuery")
    expect(comparison).toHaveTextContent("not audited or directly comparable")
  })

  it("keeps timeline dates and evidence in ordered-list semantics", () => {
    // Given: a company milestone inside a chronological list.
    render(
      <ol aria-label="Company timeline">
        <TimelineItem
          date="2026-04-09"
          evidence={<a href="#src-series-a">Financing announcement</a>}
          title="Series A announced"
        >
          Company-issued terms reported a $30 million round.
        </TimelineItem>
      </ol>,
    )

    // When: the milestone is located as a list item.
    const milestone = screen.getByRole("listitem")

    // Then: machine-readable date, narrative, and evidence remain together.
    expect(milestone.querySelector("time")).toHaveAttribute("datetime", "2026-04-09")
    expect(milestone).toHaveTextContent("Series A announced")
    expect(milestone).toContainElement(screen.getByRole("link", { name: "Financing announcement" }))
  })

  it("pairs every market-map visual with a visible semantic fallback", () => {
    // Given: an evidence-circuit visual and an equivalent source list.
    render(
      <MarketMap
        fallback={
          <ul>
            <li>Expert supply connects to accepted environments.</li>
          </ul>
        }
        summary="Orange edges show evidence relationships, not investment flows."
        title="RL value chain"
        visual={<svg aria-label="RL value-chain diagram" role="img" viewBox="0 0 10 10" />}
      />,
    )

    // When: the figure is located by its title.
    const figure = screen.getByRole("figure", { name: "RL value chain" })

    // Then: visual, written summary, and equivalent list are all present.
    expect(figure).toContainElement(screen.getByRole("img", { name: "RL value-chain diagram" }))
    expect(figure).toHaveTextContent("Orange edges show evidence relationships")
    expect(figure).toHaveTextContent("Expert supply connects to accepted environments.")
  })
})
