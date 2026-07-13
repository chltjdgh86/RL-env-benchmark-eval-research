# RL Economy Atlas final visual gate review

recommendation: REJECT

## blockers

1. **HIGH — The required footer copy is wrong on every captured route.** `SPEC-trim-sections.md:50` requires `Public evidence as of 11 July 2026 · recently surfaced companies observed 12 July 2026`, but `src/app/AtlasShell.tsx:97` renders only `Public evidence as of 11 July 2026`. The shortened footer is visible in every screenshot that reaches the footer; the mobile guide and mobile companies captures fail to reach a valid footer at all.
2. **HIGH — The 375px and 768px market-map visuals do not present all six stages.** `.omo/evidence/visual-qa-prod-mobile-market-map.png` exposes roughly the first two stages, and `.omo/evidence/visual-qa-prod-tablet-market-map.png` exposes only the first four. `src/styles/app.css:198-205` forces a 60rem-wide SVG inside a horizontal scroller without a visible scroll instruction or continuation cue. The fallback list preserves the words, but the primary diagram is visibly clipped at both requested responsive widths.
3. **HIGH — Two guide screenshots are captures of an error-recovery state, not the valid guide route.** `.omo/evidence/visual-qa-prod-mobile-guide.png` and `.omo/evidence/visual-qa-prod-desktop-guide.png` visibly include `Recovered URL state · invalid_section`. The tablet guide capture does not. These artifacts therefore do not certify the clean `#/guide` surface at 375px or 1280px.
4. **HIGH — The mobile full-page evidence is incomplete/corrupt.** `.omo/evidence/visual-qa-prod-mobile-guide.png` stops partway through the External reading list and omits the footer. `.omo/evidence/visual-qa-prod-mobile-companies.png` ends the rendered card content with a very large blank region and no footer. These captures cannot prove absence of clipping or complete section ordering at 375px.
5. **HIGH — Supplemental company descriptions violate the requested exact card copy.** `SPEC-unified-cards.md:42-45` requires supplemental excerpts to render inside typographic quotes (`“…”`). `src/features/companies/CompanyCard.tsx:30-48` returns and renders the excerpt as bare text. The missing quotation marks are visible on supplemental cards such as Aviro, BenchFlow, and Kled AI in the company screenshots.
6. **HIGH — Production fallback and SEO copy contradict the unified 120-card outcome and retain forbidden reader-facing tier language.** `dist/index.html` still states `73 companies, 47 recently surfaced records` and describes `a labeled recently surfaced register`; its meta/JSON-LD description also says 73 companies. That conflicts with `SPEC-unified-cards.md` and the live 120-card page, and reintroduces the removed sub-tier outside the JavaScript-rendered screenshot path.
7. **HIGH — The filter-open evidence is stale.** `.omo/evidence/visual-qa-prod-desktop-companies-filters-open.png` was captured at 17:15:14, before the final `src/styles/app.css` edit at 17:16:36 and before the production assets were rebuilt at 17:16:42. It cannot certify the final build's filter state.
8. **HIGH — Required gate artifacts are missing or do not cover the final revision.** The workspace has no Git metadata, changed-file diff, current unified-card code-review report, manual QA matrix, or notepad path. Existing code-review reports cover earlier specs and both recommend changes; `.omo/evidence/fact-sheet-gate-review.md` describes the obsolete 73+47 layout. No report explicitly supports the final unified-card/simplification revision with current `programming` and `remove-ai-slops` coverage.
9. **MEDIUM — Direct overfit/slop review finds unresolved deletion-only tests.** Examples include `companies.test.tsx:45-48,86-87,97`, `AtlasShell.test.tsx:82-85`, `GlobalFilters.test.tsx:29`, and `overview-industries.test.tsx:20,32`. Several merely assert removal of requested labels/routes or old implementation text. They add maintenance burden and false confidence while missing the footer contract, supplemental quotation contract, valid-route screenshot state, and responsive six-stage diagram behavior.

## originalIntent

Ship the final RL Economy Atlas as a clean responsive fact sheet at 375px, 768px, and 1280px. Preserve exact masthead, overview, market-map, industries, filter, and company copy; merge all 120 companies into one uniform card system; remove reader-facing tier/corpus language and retired routes; and provide clean production screenshots with no clipping, overflow, error/debug overlays, or stale state.

## desiredOutcome

Readers should see five clean routes with one coherent hierarchy and exact approved copy. Companies should show 120 identically structured cards with sector, business models, one domain link, and an accurate description; supplemental excerpts should be quoted. Filters should expose only Segment, Business model, and Company. The market map should communicate all six stages at every breakpoint, and the footer/fallback/SEO surfaces should agree with the final product.

## userOutcomeReview

The visual system is strong and consistent at desktop: typography, cream/ink/orange tokens, rules, navigation, section intros, industry dossiers, and four-column company density form a coherent fact-sheet hierarchy. The 120 company cards visibly share one anatomy, the 9 industry dossiers are present, the requested route titles and most body copy match, and no component-inspector/devtool overlay is visible in the supplied production screenshots.

The shipped artifact nevertheless misses the requested outcome. Exact footer and supplemental-card copy are wrong; the no-JavaScript/SEO surface still exposes the retired 73+47 tiering; the market map loses stages at mobile/tablet widths; two guide captures show an invalid-route alert; two mobile captures do not prove complete-page rendering; and the only filter-open capture predates the final build. These are user-visible and evidence-integrity failures, not cosmetic preferences.

## responsive and route review

| Surface | 375px | 768px | 1280px |
|---|---|---|---|
| Guide | FAIL: `invalid_section` alert; truncated External reading/footer | PASS visually, except wrong footer | FAIL evidence: `invalid_section` alert; wrong footer |
| Overview | PASS layout/hierarchy; wrong footer | PASS layout/hierarchy; wrong footer | PASS layout/hierarchy; wrong footer |
| Market map | FAIL: primary diagram exposes only initial stages; wrong footer | FAIL: primary diagram exposes 4/6 stages; wrong footer | PASS diagram/hierarchy; wrong footer |
| Industries | PASS: 9 readable dossiers; wrong footer | PASS: 9 readable dossiers; wrong footer | PASS: 9 readable dossiers; wrong footer |
| Companies | FAIL evidence: large blank tail/no footer; quote contract missed | PASS grid/card anatomy; quote contract and footer missed | PASS grid/card anatomy; quote contract and footer missed |
| Filters open | not supplied | not supplied | FAIL freshness: capture predates final CSS/build |

## direct remove-ai-slops and programming pass

- Production TypeScript in the current company and overview paths is strictly typed, uses exhaustive switching for card kinds, keeps modules below 250 pure LOC, and does not add `any`, broad catches, debug logging, or needless parsing/normalization.
- `FieldGuidePage.tsx` is 713 pure LOC. An older report treats this as intentional static editorial content, but there is no current scoped diff or supported exception marker establishing that determination for this gate.
- The card helper split is reasonable and not needless abstraction: `CompanyCard` owns one repeated UI contract and `CompaniesPage` owns filtering/sorting/composition.
- Unresolved test slop remains: deletion-only assertions dominate multiple final-change tests, while observable contracts that actually failed here are untested.
- Because no diff exists, scope drift, forbidden-path preservation, and whether oversized/static code was introduced or merely pre-existing cannot be independently established.

## checked artifact paths

### Screenshots opened directly

- `.omo/evidence/visual-qa-prod-mobile-guide.png`
- `.omo/evidence/visual-qa-prod-mobile-overview.png`
- `.omo/evidence/visual-qa-prod-mobile-market-map.png`
- `.omo/evidence/visual-qa-prod-mobile-industries.png`
- `.omo/evidence/visual-qa-prod-mobile-companies.png`
- `.omo/evidence/visual-qa-prod-tablet-guide.png`
- `.omo/evidence/visual-qa-prod-tablet-overview.png`
- `.omo/evidence/visual-qa-prod-tablet-market-map.png`
- `.omo/evidence/visual-qa-prod-tablet-industries.png`
- `.omo/evidence/visual-qa-prod-tablet-companies.png`
- `.omo/evidence/visual-qa-prod-desktop-guide.png`
- `.omo/evidence/visual-qa-prod-desktop-overview.png`
- `.omo/evidence/visual-qa-prod-desktop-market-map.png`
- `.omo/evidence/visual-qa-prod-desktop-industries.png`
- `.omo/evidence/visual-qa-prod-desktop-companies.png`
- `.omo/evidence/visual-qa-prod-desktop-companies-filters-open.png`

### Specs, source, tests, and reports

- `SPEC-unified-cards.md`
- `SPEC-trim-sections.md`
- `SPEC-simplify-sweep.md`
- `DESIGN.md`
- `.omo/drafts/rl-market-intelligence-site.md`
- `.omo/plans/rl-market-intelligence-site.md`
- `src/app/AtlasShell.tsx`
- `src/app/GlobalFilters.tsx`
- `src/features/companies/CompaniesPage.tsx`
- `src/features/companies/CompanyCard.tsx`
- `src/features/companies/company-descriptions.ts`
- `src/features/overview-industries/{OverviewPage.tsx,MarketMapPage.tsx,IndustriesPage.tsx}`
- `src/features/field-guide/FieldGuidePage.tsx`
- `src/styles/{app.css,primitives.css,tokens.css}`
- `src/app/{AtlasShell.test.tsx,GlobalFilters.test.tsx}`
- `src/features/companies/companies.test.tsx`
- `src/features/overview-industries/overview-industries.test.tsx`
- `e2e/{routes.spec.ts,app-shell.spec.ts,showcase.spec.ts}`
- `dist/index.html` and final `dist/assets/*`
- `.omo/evidence/{SPEC-trim-sections-code-review.md,SPEC-trim-sections-qa.md,company-cards-code-review.md,company-cards-gate-review.md,fact-sheet-gate-review.md}`
- `.omo/evidence/company-cards-postimpl-qa/*`
- `.omo/final-review/local-root-review.md`

## exact evidence gaps

- A current changed-file manifest and full before/after diff for the final unified-card/simplification revision.
- A current code-review report explicitly covering the final source/tests through `programming`, `remove-ai-slops`, deletion-only, tautological, implementation-mirroring, needless-abstraction, maintenance-burden, and scope-drift criteria.
- A current manual QA matrix for all requested routes/states at 375/768/1280.
- A supplied notepad path and its contents.
- Fresh valid-`#/guide` captures at 375 and 1280 without the recovery alert.
- A fresh post-build filters-open capture.
- Complete 375px guide and company captures that reach the actual footer without blank/truncated output.
- Responsive evidence showing all six market-map stages without hidden content, or an explicit visible/accessible scroll affordance accepted by the product owner.
- Tests for exact footer copy, supplemental typographic quotes, production fallback/SEO 120-company framing, valid guide-route screenshot state, and responsive market-map completeness.
