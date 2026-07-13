# RL Economy Atlas visual gate review

recommendation: REJECT

## blockers

1. **HIGH — The market-map diagram hides required stages at 375px and 768px.** In `.omo/evidence/visual-qa-prod-mobile-market-map.png`, only the first stage and part of the second are visible; in `.omo/evidence/visual-qa-prod-tablet-market-map.png`, only four of six stages are visible. `src/styles/app.css:198-205` forces the SVG to a 60rem minimum width inside an overflow scroller, but the rendered state has no visible continuation cue or scroll instruction. This is actionable missing-content/interaction-state presentation under review charter A.
2. **HIGH — The supplied guide evidence does not certify clean mobile and desktop routes.** `.omo/evidence/visual-qa-prod-mobile-guide.png` and `.omo/evidence/visual-qa-prod-desktop-guide.png` visibly show `Recovered URL state · invalid_section`; the tablet guide does not. The mobile capture also stops during the External reading list and never reaches the footer. These are invalid/corrupt gate artifacts for the requested `#/guide` route.
3. **HIGH — The mobile Companies capture is incomplete.** `.omo/evidence/visual-qa-prod-mobile-companies.png` ends the card content far above the image bottom, followed by a very large blank region, and never shows the footer. It cannot prove complete 375px rendering, ordering, or absence of clipped tail content.
4. **HIGH — Supplemental descriptions miss exact requested typography.** `SPEC-unified-cards.md:53-55` requires supplemental excerpts inside typographic quotes. `src/features/companies/CompanyCard.tsx:31-52` renders each excerpt as bare text. The missing quotes are visible on supplemental cards in the supplied company captures.
5. **HIGH — Production fallback/SEO content contradicts the unified 120-company result.** The served `dist/index.html` meta description and JSON-LD still say `73 companies`; the no-JavaScript fallback still says `73 companies, 47 recently surfaced records` and describes a separate recently surfaced register. This conflicts with `SPEC-unified-cards.md:8-16,57-74` and the visible unified 120-card page.
6. **HIGH — The only open-filter screenshot is stale.** `.omo/evidence/visual-qa-prod-desktop-companies-filters-open.png` is timestamped 17:15:14, before the final `src/styles/app.css` edit at 17:16:36 and production build at 17:16:42. It cannot certify the final interaction state.
7. **HIGH — Required final-gate artifacts are missing.** This workspace has no Git metadata or before/after diff, no final-revision changed-file manifest, no current manual QA matrix, and no notepad path. Existing code-review reports cover earlier revisions/specs; no current code-review report explicitly supports the final unified-card/simplification revision with the required programming and remove-ai-slops/overfit criteria. Scope preservation and final report coverage therefore cannot be independently approved.
8. **MEDIUM — Unresolved test slop creates false confidence.** Current tests contain deletion-only assertions such as `src/features/companies/companies.test.tsx:45-48,86-87,97`, `src/app/AtlasShell.test.tsx:82-85`, `src/app/GlobalFilters.test.tsx:17-29`, and `src/features/overview-industries/overview-industries.test.tsx:20,31-32`. They mainly verify requested removals while missing the failed observable contracts: quoted supplemental excerpts, current fallback/SEO framing, valid-route screenshot state, and responsive presentation of all six market stages.

## originalIntent

Ship a clean, responsive RL Economy Atlas fact sheet at 375px, 768px, and 1280px with five coherent reader routes, exact approved copy, one unified 120-company card system, usable entity filters, nine industry dossiers, and no clipping, stale state, or development overlays.

## desiredOutcome

Readers should receive complete, legible pages at every requested breakpoint. Company cards should share one anatomy and exact description treatment; filters should present the final state; the six-stage value chain should be discoverable at every width; and production HTML, SEO, no-JavaScript fallback, and screenshots should all describe the same final product.

## userOutcomeReview

The desktop visual system is coherent and strong: cream/ink/orange tokens, condensed headings, editorial body type, hard rules, active navigation, nine industry dossiers, and uniform company-card anatomy are consistent. The screenshots visibly support 120 company cards, and `node scripts/qa/check-devtools.mjs` returned `DEVTOOLS_PRODUCTION_CLEAN`; no inspector overlay appears in the supplied production captures.

The shipped artifact does not satisfy the complete user-visible outcome. The responsive market-map visual hides stages, two guide captures show an invalid-route warning, two mobile full-page artifacts are incomplete, supplemental copy misses required quotation marks, production fallback/SEO retains obsolete tiering/counts, and the filter-state capture is stale.

The shortened footer is **not** treated as a blocker here: although `SPEC-trim-sections.md:50` specified a longer line, the later `SPEC-unified-cards.md` requires removal of reader-facing `Recently surfaced` tier language. The current `Public evidence as of 11 July 2026` footer is consistent with that later direction.

## responsive review

| Surface | 375px | 768px | 1280px |
|---|---|---|---|
| Field guide | FAIL: invalid-route warning; capture truncates before footer | PASS visually | FAIL evidence: invalid-route warning |
| Overview | PASS | PASS | PASS |
| Market map | FAIL: diagram exposes about 1.5/6 stages | FAIL: diagram exposes 4/6 stages | PASS |
| Industries | PASS: nine readable dossiers | PASS | PASS |
| Companies | FAIL evidence: blank tail/no footer; quote contract missed | PASS layout; quote contract missed | PASS layout; quote contract missed |
| Filters open | not supplied | not supplied | FAIL freshness |

## direct remove-ai-slops and programming pass

- Final production TypeScript inspected here is strictly typed, uses named exports and exhaustive card-kind dispatch, and contains no `any`, non-null assertions, broad catches, debug logging, needless parsing/normalization, or speculative production abstraction.
- `CompanyCard` is a justified reusable component for the repeated card contract; it is not needless extraction.
- `FieldGuidePage.tsx` is 713 pure LOC and `app.css` is 449 pure LOC. Without a final diff, this gate cannot establish whether these oversized files are pre-existing/approved exceptions or final-scope maintenance defects.
- The direct overfit pass found the deletion-only tests listed above. No excessive new production normalization or implementation-mirroring helper was found, but the tests omit the user-visible contracts that actually fail.
- The available earlier code-review reports mention programming/remove-ai-slops, but they do not cover the final revision and therefore do not satisfy final report coverage.

## checked artifact paths

- All 16 `.omo/evidence/visual-qa-prod-*.png` files named in the review request, opened directly.
- `SPEC-unified-cards.md`, `SPEC-simplify-sweep.md`, `SPEC-trim-sections.md`, `DESIGN.md`.
- `src/app/AtlasShell.tsx`, `src/app/GlobalFilters.tsx`.
- `src/features/companies/CompaniesPage.tsx`, `src/features/companies/CompanyCard.tsx`, `src/features/companies/company-descriptions.ts`.
- `src/features/overview-industries/OverviewPage.tsx`, `MarketMapPage.tsx`, `IndustriesPage.tsx`.
- `src/features/field-guide/FieldGuidePage.tsx`.
- `src/styles/app.css`, `src/styles/primitives.css`, `src/styles/tokens.css`.
- `src/features/companies/companies.test.tsx`, `src/app/AtlasShell.test.tsx`, `src/app/GlobalFilters.test.tsx`, `src/features/overview-industries/overview-industries.test.tsx`.
- Served `http://127.0.0.1:4173/`, `dist/index.html`, final production asset timestamps, and `scripts/qa/check-devtools.mjs` output.
- `.omo/evidence/SPEC-trim-sections-code-review.md`, `.omo/evidence/SPEC-trim-sections-qa.md`, `.omo/evidence/company-cards-code-review.md`, `.omo/evidence/company-cards-gate-review.md`, `.omo/evidence/fact-sheet-gate-review.md`, `.omo/evidence/rl-economy-atlas-final-visual-gate-review.md`, `.omo/final-review/local-root-review.md`.

## exact evidence gaps

- Final changed-file manifest and full before/after diff.
- Current code-review report covering the final source/tests with programming, remove-ai-slops, deletion-only, tautological, implementation-mirroring, needless-abstraction, maintenance-burden, and scope-drift criteria.
- Current manual QA matrix for all requested routes/states at 375/768/1280.
- Notepad path and contents.
- Fresh clean `#/guide` captures at 375 and 1280.
- Complete 375px guide and company captures through the real footer.
- Fresh post-build open-filter capture.
- Responsive evidence making all six market-map stages visibly discoverable.
- Regression coverage for supplemental quotation marks and unified 120-company fallback/SEO framing.
