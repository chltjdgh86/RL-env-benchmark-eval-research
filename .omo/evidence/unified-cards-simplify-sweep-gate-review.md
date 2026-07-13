# Unified cards and simplification sweep gate review

recommendation: REJECT

## blockers

1. **HIGH — Production fallback and SEO copy contradict the shipped 120-card result.** `index.html:7-8` and the rebuilt `dist/index.html:7-8` still describe 73 companies. `index.html:12` / `dist/index.html:15` still expose “Canonical corpus”, “561 atomic claims”, “73 companies, 47 recently surfaced records”, and “a labeled recently surfaced register”. This directly violates the one-list/no-sub-tier outcome in `SPEC-unified-cards.md` and the reader-facing `corpus` / `canonical` / `atomic` / `cutoff` sweep in `SPEC-simplify-sweep.md`. Update the metadata and no-JavaScript fallback to the unified 120-company fact-sheet framing and add a production-HTML regression check; the current `bun run check:seo` incorrectly passes this stale output.

2. **HIGH — The supplied 375px Field guide full-page capture is not complete evidence of a clean route.** `.omo/evidence/visual-qa-prod-mobile-guide.png` does not paint the final external-reading items and footer in its full-page result. A separate unlisted bottom-viewport artifact (`visual-qa-prod-mobile-guide-bottom.png`) shows that the live scrolled footer can render cleanly, so this may be a full-page capture/compositor limit rather than a layout defect. The requested screenshot packet nevertheless does not itself prove an unclipped complete 375px route. Replace the full-page artifact with segmented 375px captures, including the footer, or document the capture limit in a manual-QA matrix.

3. **MEDIUM — Direct remove-ai-slops review finds deletion-only/removal-mirroring tests that create false confidence.** Examples: `src/features/companies/companies.test.tsx:45-48,89-90,100`, `src/app/GlobalFilters.test.tsx:17-29`, `src/app/AtlasShell.test.tsx:78-85`, and `src/features/overview-industries/overview-industries.test.tsx:20-21,31-32`. These assertions mostly inventory removed labels, groups, routes, or classes. Meanwhile all 149 unit tests and `check:seo` pass despite the stale 73+47 production fallback. Replace redundant absence inventories with compact positive user-outcome contracts and add coverage for production fallback/SEO framing and complete 375px guide capture behavior.

4. **HIGH — Required final-review provenance is missing.** This workspace has no Git metadata, final changed-file manifest, or before/after diff; no current code-review report covers the unified-card/simplification revision; and no supplied manual-QA matrix or notepad path exists. Earlier code-review reports cover earlier specs/revisions. They do not establish final scope control or current supported coverage of the required programming and remove-ai-slops/overfit criteria.

5. **MEDIUM — The programming size criterion is unresolved for a touched in-scope source file.** `src/features/field-guide/FieldGuidePage.tsx` measures 713 pure LOC and carries no documented `SIZE_OK`/static-editorial exception. Because the checkout has no diff, the gate cannot determine whether this maintenance burden predates the two-spec revision. The current code-review evidence does not address it for the final revision.

## originalIntent

Implement only `SPEC-unified-cards.md` and `SPEC-simplify-sweep.md`: ship five clean responsive fact-sheet routes at 375px, 768px, and 1280px; merge all 120 companies into one uniform card system; simplify the overview, market map, industries, filters, masthead, and one Field guide callout; preserve exact in-scope copy; and remove stale tier/corpus language without clipping, recovery states, or development overlays.

## desiredOutcome

Readers should receive five complete, legible routes at all three breakpoints. Companies should present 120 identically structured cards with one domain link and correct description treatment, including typographic quotes for supplemental excerpts. The Market map should expose all six stages at narrow widths. Filters should expose only Segment, Business model, and Company. JavaScript, no-JavaScript, SEO, and screenshot surfaces should all describe the same unified fact sheet.

## userOutcomeReview

The primary JavaScript application is visually coherent and substantially meets the requested result. Every supplied screenshot was opened. Fresh live probes at 375/768/1280 found `scrollWidth === clientWidth` on all five routes, zero console/page errors, zero recovery notices, six visible Market map stages, nine industry dossiers, and no reader-facing forbidden terms in the mounted application. The Companies DOM contains 120 cards at every width; all 120 share one shape (`3 p + 1 h4 + 1 a`), every card has exactly one link, and all 47 supplemental cards contain typographic quotation marks. The filter tray exposes exactly Segment, Business model, and Company; segment filtering retained supplemental records, and keyboard-submitted query filtering reduced “Aviro” to one card. No devtool overlay appears in the captures, and `check:devtools` reports `DEVTOOLS_PRODUCTION_CLEAN`.

The shipped artifact is still not complete from the reader’s perspective because the no-JavaScript/SEO surface advertises the obsolete split and forbidden terminology. The requested 375px full-page guide artifact is also incomplete, and final revision provenance/QA evidence is absent.

## responsive review

| Route/state | 375px | 768px | 1280px |
|---|---|---|---|
| Guide | REVISE: supplied full-page capture does not include a clean final footer; live bottom viewport is clean | PASS | PASS |
| Overview | PASS | PASS | PASS |
| Market map | PASS: six stages visible | PASS: six stages visible | PASS: six-stage diagram visible |
| Industries | PASS: nine dossiers | PASS: nine dossiers | PASS: nine dossiers |
| Companies | PASS: 120 uniform cards; no horizontal overflow | PASS: 120 uniform cards | PASS: 120 uniform cards |
| Filters open | live DOM confirms three groups | live DOM confirms three groups | PASS: supplied open-state capture shows three groups |

## direct remove-ai-slops and programming pass

- `CompanyCard` is a justified repeated-card primitive; `CompaniesPage` owns filtering/sorting/composition. No needless production extraction, parsing/normalization layer, broad catch, debug logging, or implementation-mirroring helper was found in these final surfaces.
- `CompanyCard.tsx` uses a strict discriminated union and exhaustive switch; no `any`, non-null assertion, suppression directive, or mutable export was found.
- Deletion-only/removal-mirroring tests remain at the blocker-3 locations. They are not sufficient behavior locks and demonstrably allow stale production framing through a green suite.
- `FieldGuidePage.tsx` remains 713 pure LOC without a current supported exception.
- A true diff-scoped slop/scope-drift pass is impossible without Git metadata or a supplied before/after diff.
- Existing code-review reports do not cover this final revision with explicit supported programming, remove-ai-slops, overfit, deletion-only, tautological, implementation-mirroring, needless-abstraction, maintenance-burden, and scope-drift coverage.

## verification evidence

- Supplied screenshots: all 16 opened directly.
- Fresh live matrix: five routes at 375/768/1280; no horizontal overflow, console errors, page errors, or recovery notices.
- Live Companies checks: 120 cards; one shared anatomy; 120/120 cards with one link; 47 quoted supplemental cards.
- Live filters: exactly three groups; environment segment returned 27 cards including 14 supplemental cards; Enter-submitted `Aviro` query returned one card.
- `bun run typecheck`: PASS.
- `bun run lint`: PASS, 129 files.
- `bun run check:no-excuses`: PASS, `NO_EXCUSES_OK:88`.
- `bun run test:unit`: PASS, 19 files / 149 tests; jsdom emitted eight `scrollTo()` not-implemented notices.
- `bun run check:rendered-claims`: PASS, `RENDERED_CLAIMS_OK:companies`.
- `bun run check:semantic-audit`: PASS, 10 relationships / 70 receipts.
- `bun run build`: PASS with a large-chunk warning; produced the same stale fallback/SEO content.
- `bun run check:devtools`: PASS, `DEVTOOLS_PRODUCTION_CLEAN`.
- `bun run check:seo`: PASS but unsupported for the stale 73+47 semantic failure.

## checked artifact paths

### Specifications

- `SPEC-unified-cards.md`
- `SPEC-simplify-sweep.md`

### Supplied screenshots

- `.omo/evidence/visual-qa-prod-mobile-{guide,overview,market-map,industries,companies}.png`
- `.omo/evidence/visual-qa-prod-tablet-{guide,overview,market-map,industries,companies}.png`
- `.omo/evidence/visual-qa-prod-desktop-{guide,overview,market-map,industries,companies}.png`
- `.omo/evidence/visual-qa-prod-desktop-companies-filters-open.png`

### Source, tests, output, and reports

- `src/features/companies/{CompaniesPage.tsx,CompanyCard.tsx,company-descriptions.ts,companies.test.tsx}`
- `src/app/{AtlasShell.tsx,AtlasShell.test.tsx,GlobalFilters.tsx,GlobalFilters.test.tsx}`
- `src/features/overview-industries/{OverviewPage.tsx,MarketMapPage.tsx,IndustriesPage.tsx,overview-industries.test.tsx}`
- `src/features/field-guide/FieldGuidePage.tsx`
- `src/styles/app.css`
- `index.html`
- `dist/index.html`
- `.omo/evidence/{company-cards-code-review.md,SPEC-trim-sections-code-review.md,SPEC-trim-sections-qa.md,rl-economy-atlas-final-visual-gate-review.md}`
- `.omo/final-review/local-root-review.md`

## exact evidence gaps

- Final changed-file manifest and full before/after diff for this two-spec revision.
- Current code-review report explicitly covering this final revision through programming and remove-ai-slops, including overfit/deletion-only, tautological, implementation-mirroring, needless-abstraction, oversized-module, false-confidence, and scope-drift criteria.
- Final manual-QA matrix for all requested routes/states at 375/768/1280.
- Supplied notepad path and contents.
- Updated metadata/no-JavaScript fallback proving unified 120-company framing and absence of forbidden reader-facing tier/corpus wording.
- A complete, segmented 375px guide capture through the footer, or a documented capture-limit receipt paired with clean viewport captures.
- Regression checks that fail on stale production fallback/SEO counts and incomplete 375px guide evidence.
