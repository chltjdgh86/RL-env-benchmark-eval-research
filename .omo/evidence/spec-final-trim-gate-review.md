# SPEC-final-trim final current-state gate review

Reviewed: 2026-07-12 18:10 EDT  
Workspace: `/Users/sung/src/frist/RL-env-benchmark-eval-research`  
Mode: current-filesystem final review. The checkout intentionally has no `.git`; historical diff proof is unavailable and was not treated as a blocker.

## recommendation

REJECT

## result

FAIL at the mandatory final slop/overfit gate; all explicit `SPEC-final-trim.md` product and acceptance directives pass.

## blockers

1. `src/app/AtlasShell.test.tsx:52-65` remains a deletion-inventory test. It separately asserts the absence of seven retired labels (`GTM`, `Economics`, `Sources`, `Methodology`, `Overview`, `Market map`, and `Industries`) instead of asserting the exact observable navigation set. This is the precise “test that merely verifies a requested removal” / deletion-only overfit class prohibited by the required `remove-ai-slops` gate. It adds maintenance burden and false confidence while the meaningful positive contract is simply that Atlas navigation contains exactly `Field guide` and `Companies`. The current code-review report explicitly identifies this same pattern and records the required `remove-ai-slops` and `programming` perspectives. No production-code slop or direct spec failure remains.

## originalIntent

Trim the atlas to Field Guide and Companies as the only visible product sections while preserving Showcase as a hash-addressable primitive route; delete Overview/Market Map/Industries; remove the shell search UI without removing `q` parsing; remove retired guide links; turn all 35 Part 5 names into canonical external links; simplify the Companies eyebrow; remove proven-dead CSS; and preserve the research/QA scope.

## desiredOutcome

Users see only Field guide and Companies navigation, no search box, no retired route links, a Companies eyebrow of `Companies`, and 35 exact Part 5 website links with `target="_blank" rel="noreferrer"`. Guide, Companies, and Showcase render with one H1 and no document overflow at desktop or 320px. Existing `q` hashes remain parseable. The exact acceptance chain passes.

## userOutcomeReview

The desired user-visible outcome is satisfied in current files and in a rebuilt production preview. At `#/companies?q=mercor`, Chromium preserved the hash, rendered Mercor content, exposed zero search inputs, exposed exactly `Field guide` and `Companies` in Atlas navigation, retained one H1, and measured `clientWidth=scrollWidth=320`. Part 5 rendered exactly 35 requested external links with no missing, extra, or mismatched URL and no bad `target`/`rel` pair. Part 11's internal route set was exactly `#/companies`. The fresh route matrix passed all seven scenarios, including Showcase at 320px.

## directive verification

| Directive | Status | Current evidence |
| --- | --- | --- |
| Exact acceptance chain | PASS | Fresh command exited 0: typecheck; Biome over 124 files; `NO_EXCUSES_OK:83`; 18 unit files / 145 tests; `RENDERED_CLAIMS_OK:companies`; semantic audit 10 relationships / 70 receipts; 162-module production build. |
| Sections trimmed to Guide, Companies, Showcase | PASS | `src/domain/hash-types.ts:18`; `src/App.tsx`; `src/app/AtlasShell.tsx`. Fresh route matrix passed 7/7. |
| Delete `src/features/overview-industries/` | PASS | Directory is absent. |
| Remove shell SearchField but preserve UtilityNav and parseable `q` | PASS | `src/app/AtlasShell.tsx` imports/renders `UtilityNav` and no `SearchField`; `HASH_QUERY_KEYS` still contains `q`; fresh Chromium preserved `#/companies?q=mercor` and rendered Mercor with zero search inputs. |
| Remove retired guide links; Part 11 only Companies internally | PASS | `rg -n '#/(overview|market-map|industries)' src` returned no matches; runtime Part 11 internal href set was exactly `#/companies`. |
| Part 5 exact 35 canonical URLs and external-link attributes | PASS | Fresh runtime comparison: count 35; zero missing, extra, or mismatched entries; zero bad `target="_blank" rel="noreferrer"` pairs. Render loops are in `src/features/field-guide/FieldGuidePage.tsx:587-604`. |
| Companies eyebrow is Companies | PASS | `src/features/companies/CompaniesPage.tsx:66`. |
| Dead CSS removed after consumer check | PASS | The previously identified zero-consumer selector families no longer occur in `src/styles/app.css`; targeted source grep returned no matches. |
| No horizontal overflow; sane headings | PASS | Fresh rebuilt Chromium `e2e/routes.spec.ts`: 7/7, including Guide, Companies, and Showcase at 320px and 1280px; each route checks one Atlas H1 and the expected H2. |
| Biome style; no try/catch | PASS | Fresh lint passed; `check:no-excuses` passed; targeted `src` grep found no `try`/`catch`. |
| Preserve research and QA scope | PASS on current-state evidence | Rendered claims remains companies-only. No removed-route reference remains under `src`; no overview-industries scope remains in current QA wiring. Historical byte identity is unavailable because there is no `.git`, as explicitly allowed. |

## direct remove-ai-slops and programming review

- Production deletion/reuse/simplification: PASS. Removed route code and dead CSS are absent; retained `SearchField` and `MarketMap` have Showcase/library consumers.
- Obvious comments, broad catches, defensive parsing, needless abstraction, production normalization/extraction, and dead references: no unresolved goal-specific finding.
- Test overfit: FAIL only for `src/app/AtlasShell.test.tsx:52-65`, the deletion-label inventory described in the blocker. The exact-section constant test requested by the spec and the focused route/browser tests are not blockers.
- Excessive/useless tests: no other blocker found. The 145-test count is supported by fresh runner output, not treated as proof by itself.
- Oversized pre-existing modules: advisory only per the user instruction and not a blocker.
- Report-side coverage: `.omo/evidence/SPEC-final-trim-code-review.md` explicitly contains a “Skill-perspective check” covering `remove-ai-slops`, `programming`, deletion-only/removal-inventory tests, implementation-mirroring tests, unnecessary production parsing/normalization, dead CSS, and module size. Its old overflow and CSS conclusions are stale, so only its still-current test-slop analysis was accepted after direct inspection.

## checked artifact paths

- `SPEC-final-trim.md`
- `package.json`
- `src/App.tsx`
- `src/app/AtlasShell.tsx`
- `src/app/AtlasShell.test.tsx`
- `src/domain/hash-types.ts`
- `src/domain/hash-state.ts`
- `src/domain/hash-state.test.ts`
- `src/features/field-guide/FieldGuidePage.tsx`
- `src/features/field-guide/FieldGuidePage.test.tsx`
- `src/features/companies/CompaniesPage.tsx`
- `src/features/companies/claim-scope.json`
- `src/components/PrimitiveShowcase.tsx`
- `src/styles/app.css`
- `src/styles/primitives.css`
- `e2e/routes.spec.ts`
- `e2e/showcase.spec.ts`
- `playwright.config.ts`
- `scripts/qa/render-semantic-audit.mjs`
- `.omo/evidence/SPEC-final-trim-code-review.md`
- `.omo/evidence/spec-final-trim/manualQa.json`
- `.omo/evidence/spec-final-trim-rereview/acceptance-chain.typescript`
- `.omo/evidence/spec-final-trim-rereview/playwright-routes-4174.typescript`
- `.omo/evidence/spec-final-trim-rereview/playwright-full-4174.typescript`
- `.omo/evidence/spec-final-trim-rereview/showcase-320.typescript`
- `.omo/execution/ownership.md`
- `.debug-journal.md`

## exact evidence gaps

- No `.git` metadata exists, so historical changed-file and byte-for-byte untouched proofs cannot be reconstructed. The user explicitly made this non-blocking.
- No dedicated final-trim notepad path was supplied or found. `.debug-journal.md` documents the overflow fix, and `.omo/execution/ownership.md` is the execution ledger; absence of a separate notepad is not a spec blocker.
- `.omo/evidence/spec-final-trim/manualQa.json` is stale and records the pre-fix Showcase overflow. It was not used as current proof; fresh rebuilt-preview execution and newer rereview transcripts supersede it.
- `.omo/evidence/SPEC-final-trim-code-review.md` also predates the final CSS cleanup. Its stale CSS/overflow conclusions were rejected; its explicit skill coverage and still-present deletion-inventory test finding were independently verified.
- Static/security scan: N/A; no goal-specific scanner is configured, and `SPEC-final-trim.md` does not require one.
