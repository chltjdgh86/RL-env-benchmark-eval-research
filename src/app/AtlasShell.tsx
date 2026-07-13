import type { ReactNode } from "react"
import { useEffect, useMemo, useState } from "react"
import { Masthead, SkipLink, UtilityNav } from "../components"
import type { ResearchIndex } from "../data/research"
import {
  HASH_SECTIONS,
  type HashSection,
  type HashState,
  parseHash,
  serializeHash,
} from "../domain/hash-state"
import { GlobalFilters } from "./GlobalFilters"
import { buildHashReferences } from "./hash-references"

const sectionLabels: Readonly<Record<HashSection, string>> = {
  guide: "Field guide",
  companies: "Companies",
  showcase: "Showcase",
}

type AtlasShellProps = {
  readonly index: ResearchIndex
  readonly renderSection: (state: HashState) => ReactNode
}

function readHash(index: ResearchIndex) {
  return parseHash(window.location.hash, buildHashReferences(index))
}

export function AtlasShell({ index, renderSection }: AtlasShellProps) {
  const references = useMemo(() => buildHashReferences(index), [index])
  const [parsed, setParsed] = useState(() => readHash(index))

  useEffect(() => {
    const update = () => setParsed(parseHash(window.location.hash, references))
    window.addEventListener("hashchange", update)
    const canonical = serializeHash(parsed.state)
    if (window.location.hash !== canonical) window.history.replaceState({}, "", canonical)
    return () => window.removeEventListener("hashchange", update)
  }, [parsed.state, references])

  const { state, warnings } = parsed
  const section = state.section
  // biome-ignore lint/correctness/useExhaustiveDependencies: reset scroll whenever the section route changes
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [section])
  const navItems = HASH_SECTIONS.filter((item) => item !== "showcase").map((item) => ({
    current: state.section === item,
    href: serializeHash({
      ...state,
      section: item,
      source: null,
    }),
    label: sectionLabels[item],
  }))

  return (
    <div className="atlas-app">
      <SkipLink />
      <div className="atlas-sheet">
        <Masthead
          edition="Market fact-sheet · evidence as of 11 July 2026"
          strapline="A field guide to training data, RL environments, evaluations, and the companies assembling the stack."
          title="RL Economy Atlas"
        />
        <div className="shell-toolbar">
          <UtilityNav ariaLabel="Atlas sections" items={navItems} />
        </div>
        {state.section === "guide" ? null : <GlobalFilters index={index} state={state} />}
        {warnings.length === 0 ? null : (
          <aside className="error-notice" role="alert">
            Recovered URL state · {warnings.map((warning) => warning.code).join(" · ")}
          </aside>
        )}
        <main aria-label="RL Economy Atlas" id="main-content">
          {renderSection(state)}
        </main>
        <footer className="atlas-footer">
          <p>{"Public evidence as of 11 July 2026"}</p>
        </footer>
      </div>
    </div>
  )
}
