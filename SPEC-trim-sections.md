# SPEC: Remove the GTM, Economics, Sources, and Methodology sections

## Standing approval

You have standing approval for this entire task including hash-grammar surgery,
scripts/qa wiring, and test updates. Never pause for approval or review; implement,
verify, report.

## Objective

The product owner has cut four sections. The atlas keeps exactly these routes:
`guide` (default), `overview`, `market-map`, `industries`, `companies`, and the
nav-hidden `showcase`. The routes `gtm`, `economics`, `sources`, `methodology` are
removed entirely, along with every link to them. The field guide's factual Parts
("How the money works", "How deals happen", "Where to go deeper") stay — only their
links into removed routes change.

## Acceptance criteria (all must pass)

```sh
bun run typecheck
bun run lint
bun run check:no-excuses
bun run test:unit
bun run check:rendered-claims
bun run check:semantic-audit
bun run build
```

`research/` and `scripts/research/` must not change. `scripts/qa/` only as directed.

## Directives

1. **Routing** — `src/domain/hash-types.ts`: `HASH_SECTIONS` becomes
   `["guide", "overview", "market-map", "industries", "companies", "showcase"]`.
   Update `src/domain/hash-state.test.ts` exact-array assertion and every test that
   navigates to a removed section.

2. **Hash codec** — `src/domain/hash-codec.ts` special-cases the `sources` section for
   the `source` focus param and claim/source citation pairs. With `sources` gone:
   - parsing: `source` resolves to `null` always; keep emitting the existing
     `source_outside_sources` warning when a `source` param is present (any section).
   - serializing: drop the `sources` branch.
   - Remove now-impossible comparisons so TypeScript stays happy. Keep the `HashState`
     shape (the `source`/`claim` fields stay, values just stay null/pass-through) to
     minimize ripple. Update hash tests accordingly.

3. **Shell** — `src/app/AtlasShell.tsx`: remove the four entries from
   `sectionLabels`; replace the footer (it links `#/methodology`) with a single line:
   `<p>Public evidence as of 11 July 2026 · recently surfaced companies observed 12 July 2026</p>`
   (no links). `src/App.tsx`: remove the four cases and now-unused imports.

4. **Delete features**:
   - `src/features/market-operations/` — entire directory (GtmPage, EconomicsPage,
     tests, `claim-scope.json`).
   - `src/features/playbook-sources/SourcesPage.tsx` and `MethodologyPage.tsx`;
     `ShowcasePage.tsx` stays. Update the feature `index.ts` and its test file to
     showcase-only (consider renaming nothing — keep the directory name to limit
     churn).
   - Remove now-dead components/domain helpers ONLY if they become unused (e.g.
     citation-hash helpers that emitted `#/sources?...` links) — verify with grep
     before deleting; leave shared domain logic that still has consumers.

5. **Overview** — `src/features/overview-industries/OverviewPage.tsx`: the seven
   business-model list items currently link "Inspect model" → `#/economics?model=…`.
   Remove the links; keep the numbered model-name list. Update its test if coupled.

6. **Field guide** — `src/features/field-guide/FieldGuidePage.tsx`:
   - Part 7: model names in the table currently link to `#/economics?model=…` and the
     lead has "Inspect the economics →" — make model names plain text and remove that
     link line.
   - Part 8: remove the "See the GTM evidence →" link line.
   - Part 11 "Where to go deeper": keep only the Companies, Market map, and
     Industries internal links; delete the Economics, GTM, and Sources items (the
     Playbook item is already gone). Keep the "External reading" list.
   - Update `FieldGuidePage.test.tsx` for removed links.

7. **QA wiring** — delete `src/features/market-operations/claim-scope.json`. In
   `scripts/qa/render-semantic-audit.mjs`, remove that entry from `scopeFiles`,
   recompute the rendered-relationship count and `EXPECTED_RELATIONSHIP_HASH` (same
   procedure as the playbook removal), regenerate the `.omo/evidence/` artifacts by
   running the script in write mode, and confirm `bun run check:semantic-audit`
   passes. `EXPECTED_STRATEGY_HASH` and strategy-receipt logic unchanged.

8. **e2e** — `e2e/routes.spec.ts`: `atlasRoutes` becomes the six remaining routes;
   remove tests that visit removed routes. `e2e/app-shell.spec.ts` and
   `e2e/showcase.spec.ts`: update any assertions on removed nav items or the old
   footer.

9. **Sweeps** — after the change these greps must return nothing in `src/`:
   `#/gtm`, `#/economics`, `#/sources`, `#/methodology`, `"Method, receipts"`.
   `GlobalFilters` keeps working (its facet links are section-generic); if any filter
   group links or copy reference removed sections, update them.

10. Biome style, no try/catch, heading outline sane, no horizontal overflow.
