import type { ReactNode } from "react"
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
} from "./foundation"

type PrimitiveShowcaseProps = {
  readonly evidenceSpecimen: ReactNode
  readonly headingLevel?: 1 | 2
}

export function PrimitiveShowcase({ evidenceSpecimen, headingLevel = 1 }: PrimitiveShowcaseProps) {
  return (
    <article aria-label="RL Economy Atlas component showcase" className="atlas-sheet">
      <SkipLink />
      <Masthead
        corpusStatus="Fixture state · verified local copy"
        edition="Component proof · July 2026"
        headingLevel={headingLevel}
        strapline="Semantic states before product screens"
        title="Primitive showcase"
      />

      <section aria-label="Navigation and orientation specimen">
        <SectionRibbon headingLevel={2} number="01" title="Navigation and orientation" />
        <UtilityNav
          ariaLabel="Showcase utility navigation"
          items={[
            { current: true, href: "#/showcase", label: "Showcase" },
            { href: "#/companies", label: "Companies" },
            { disabled: true, href: "#/export", label: "Export unavailable" },
          ]}
        />
        <div className="atlas-grid">
          <div className="atlas-grid__left">
            <SectionRail
              filterSummary="No active filters"
              items={[
                { current: true, href: "#showcase-navigation", label: "Navigation" },
                { href: "#showcase-controls", label: "Controls" },
                { href: "#showcase-evidence", label: "Evidence" },
              ]}
              legend="Orange leading rules mark the current section."
              number="INDEX"
              title="Showcase sections"
            />
          </div>
          <div className="atlas-grid__main">
            <DossierHeader
              cutoff="State fixture · not a market claim"
              identity="Component anatomy · editorial header"
              name="Dossier identity"
              status="CURRENT · FIXTURE"
              thesis="Verified identity, plain-language status, and evidence cutoff remain adjacent."
            >
              <a href="#showcase-evidence">Inspect evidence treatment</a>
            </DossierHeader>
          </div>
          <div className="atlas-grid__right">
            <ContextRail title="How to read this view" variant="inline">
              <p>Each visual state has a visible text equivalent and keyboard path.</p>
            </ContextRail>
          </div>
        </div>
      </section>

      <section aria-label="Controls and disclosure specimen" id="showcase-controls">
        <SectionRibbon headingLevel={2} number="02" title="Controls and disclosure" />
        <SearchField
          label="Search fixture records"
          onSubmit={() => undefined}
          resultStatus="No query submitted"
        />
        <FilterTray activeCount={1} onClear={() => undefined}>
          <FilterControl legend="Claim kind">
            <label>
              <input defaultChecked type="checkbox" /> Inference
            </label>
          </FilterControl>
        </FilterTray>
        <Accordion id="showcase-method" title="Methodology disclosure">
          <p>Evidence dimensions remain separate when details expand.</p>
        </Accordion>
        <Drawer description="Keyboard-trapped modal specimen" title="Evidence drawer">
          <a href="#showcase-evidence">Go to evidence specimen</a>
        </Drawer>
      </section>

      <section aria-label="Evidence and data specimen" id="showcase-evidence">
        <SectionRibbon headingLevel={2} number="03" title="Evidence and data" />
        {evidenceSpecimen}
        <Metric
          evidence={<a href="#fixture-source">Source fixture</a>}
          label="Observed source count"
          qualifier="Fixture value · not a corpus total"
          value="133"
        />
        <DataTable caption="Evidence state comparison">
          <thead>
            <tr>
              <th scope="col">Axis</th>
              <th scope="col">Visible state</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <th scope="row">Access</th>
              <td>OPEN</td>
            </tr>
            <tr>
              <th scope="row">Support</th>
              <td>DISPUTED</td>
            </tr>
          </tbody>
        </DataTable>
        <ol aria-label="Evidence fixture timeline" className="timeline">
          <TimelineItem
            date="2026-07-11"
            evidence={<a href="#fixture-source">Source fixture</a>}
            title="Evidence cutoff"
          >
            The fixture demonstrates chronological evidence anatomy.
          </TimelineItem>
        </ol>
        <MarketMap
          fallback={
            <ul>
              <li>Source fixture connects to one synthesized claim.</li>
            </ul>
          }
          summary="Orange lines demonstrate relationships; the adjacent list carries the meaning."
          title="Evidence circuit specimen"
          visual={
            <svg aria-label="Evidence circuit diagram" role="img" viewBox="0 0 100 40">
              <title>Evidence circuit diagram</title>
              <line data-diagram-edge="true" x1="10" x2="90" y1="20" y2="20" />
              <circle cx="10" cy="20" data-diagram-node="true" r="5" />
              <circle cx="90" cy="20" data-diagram-node="true" r="8" />
            </svg>
          }
        />
        <ComparisonRow
          label="Comparability warning"
          values={[
            { entity: "Reported run rate", evidence: "SOURCE A", value: "$100M" },
            { entity: "Audited revenue", evidence: "SOURCE B", value: "Unavailable" },
          ]}
          warning="These values are not equivalent and must not be ranked together."
        />
      </section>

      <section aria-label="Empty and error state specimen">
        <SectionRibbon headingLevel={2} number="04" title="Empty and error states" />
        <EmptyState
          action={<a href="#showcase-controls">Clear fixture filters</a>}
          title="No matches"
        >
          No claims match the selected evidence dimensions.
        </EmptyState>
        <ErrorNotice
          action={<button type="button">Retry fixture</button>}
          title="Fixture unavailable"
        >
          The local fixture could not be parsed. Retry or inspect methodology.
        </ErrorNotice>
      </section>
    </article>
  )
}
