# Company cards final gate review

recommendation: REJECT

verdict: FAIL

## blockers

1. **Missed explicit requirement:** `SPEC-company-cards.md:63-67` says to preserve the `SectionIntro` `titleId`, but `src/features/companies/CompaniesPage.tsx:15-20` passes no `titleId`. `SectionIntro` forwards that prop to its `<h2>` at `src/features/shared/SectionIntro.tsx:3-15`; fresh server rendering returned `introTitleId: null`.
2. **Unresolved slop/false-confidence coverage:** `src/features/companies/companies.test.tsx:47` merely asserts that the removed implementation class `.company-dossier` has zero matches. This deletion-only implementation assertion is not a user-visible behavior lock. The tests also fail to lock the required claim-group inclusion/order, exact replacement copy, preserved `titleId`, and per-card exclusion of retired narrative groups; global assertions at lines 51-61 can pass with misplaced content.
3. **Incomplete dead-selector cleanup:** repository-wide source search finds no `<summary>` under `.corpus-claim` or `.landscape-record`, yet `src/styles/app.css:150-151` retains selectors for both. The named company/dossier selectors were removed correctly, but the direct dead-code/slop pass is not clean.
4. **Visual outcome is not approvable:** fresh Companies captures at 375/768/1280 exist, but all visibly contain purple component-inspector overlays/labels and therefore are not clean user-surface evidence. No fresh post-change overview or industries captures were supplied even though the global `.corpus-claim` change explicitly requires checking those pages (`SPEC-company-cards.md:69-76`). Existing `.omo/visual-qa/current/` captures predate the changed files and are stale.
5. **Mandatory report artifacts are absent:** no full diff/baseline, no task-specific code-review report explicitly covering `programming`, `remove-ai-slops`, and overfit/slop criteria, no manual QA matrix, and no notepad path. Missing code-review coverage is independently rejecting under the gate contract.
6. **Scope/preservation cannot be proved:** this checkout has no Git metadata and no supplied baseline/diff, so forbidden-path compliance and exact preservation of `renderClaimScope` cannot be independently verified. The current rendered-claims pass proves behavior, not textual preservation or changed-file scope.

## originalIntent

Implement `SPEC-company-cards.md` exactly: collapse each named-company dossier into one compact census-style card, preserve claim-scope and heading semantics, flatten claim styling without regressions elsewhere, remove obsolete CSS, and update tests without weakening coverage or creating maintenance slop.

## desiredOutcome

Users should see ten responsive named-company cards with the exact new copy. Each card should contain metadata, its canonical-domain link, identity, current offer, milestones, and risks in that order, with no old section labels, details, chips, or boxed claims. Overview and industries should remain visually sound, and forbidden areas should remain unchanged.

## userOutcomeReview

The central card experience is substantially implemented: ten real DOM cards render with `h4` names, exact new copy, canonical links, flat claims, and the intended current-corpus claim order. However, the explicit heading-ID preservation requirement is missed, clean visual evidence is incomplete, and scope/preservation evidence is absent. The shipped artifact therefore does not satisfy the complete user-visible and semantic outcome.

## requirement status

| Requirement | Status | Evidence |
|---|---|---|
| One `article.landscape-record` per named company with kicker, `h4`, evidence, canonical link, identity | achieved | `CompanyDossier.tsx:13-23`; fresh DOM: 10 direct named cards, all direct headings `h4`. |
| Render `currentOffer`, `milestones`, `risks` flat in that order | achieved for current corpus | `CompanyDossier.tsx:24-32`; Scale DOM order was identity, two current-offer claims, milestone, risk. |
| Omit origin/wedge/evolution/buyers/GTM/economics/status/contradictions/unknowns | achieved for current corpus | Only allowed groups appear at `CompanyDossier.tsx:23-32`; fresh Scale probe found no excluded IDs. |
| Delete `claimGroupOrder` and 13 labeled sections | achieved | No source occurrence of `claimGroupOrder`; no labeled child sections in `CompanyDossier.tsx`. |
| Use `landscape-grid` | achieved | `CompaniesPage.tsx:32-36`. |
| Exact section paragraph, deck, and title copy | achieved | `CompaniesPage.tsx:15-20,27-30`; fresh normalized DOM text matched. |
| Preserve `SectionIntro.titleId` | missed | No prop at `CompaniesPage.tsx:15`; rendered `<h2>` ID is null. |
| Leave `renderClaimScope` untouched | partial/unproven | Export exists at `CompaniesPage.tsx:44-56`; rendered-claims passes; no baseline/diff proves untouched status. |
| Remove claim box treatment and retain statement/source gap | achieved | `app.css:142-147`; browser evidence reports 0px padding/border, transparent background, 12px statement gap. |
| Remove dead company/dossier CSS | achieved for named selectors; partial overall | No CSS rules for `.company-grid`, `.dossier-sections`, `.company-dossier`; dead summary selectors remain at `app.css:150-151`. |
| Tests assert new shape/no Origin without weakening unrelated tests | partial | `companies.test.tsx:39-62` covers count, `h4`, identity text, and missing headings, but has the deletion-only line 47 assertion and misses key contracts. |
| Forbidden paths untouched | unproven | No diff/baseline/Git metadata. |
| No details/chips/try-catch; card `h4`; Biome style | achieved | Static search found none; `CompanyDossier.tsx:15`; fresh lint/no-excuses pass. |
| Typecheck, lint, no-excuses, unit, rendered-claims, semantic-audit, build | achieved | Fresh chain: 145 files linted; `NO_EXCUSES_OK:101`; 21/21 files and 150/150 tests; rendered claims and semantic audit pass; 176-module build passes. |

## edge-case verification

1. **Unfiltered corpus:** fresh server render produced exactly 10 named cards, each with a direct `h4` (`CompaniesPage.tsx:21-36`, `CompanyDossier.tsx:15`).
2. **Multi-claim ordering:** Scale AI's two current-offer claims both precede milestone and risk, matching `CompanyDossier.tsx:23-32`.
3. **Retired-group exclusion:** none of Scale AI's origin, wedge, evolution, buyer, GTM, operating-model, economics, status, contradiction, or unknown IDs appeared in its card.
4. **Zero-result filter:** `q=definitely-no-company-match` yielded zero named cards and `0 of 10 matches`, while retaining the named grid (`CompaniesPage.tsx:10-36`).
5. **Canonical URL display:** Scale rendered `href=https://scale.com` and visible hostname `scale.com` (`CompanyDossier.tsx:20-22`).
6. **Forbidden disclosure shape:** fresh named-card DOM contained zero `<details>`; changed TSX contains no chip or try/catch.
7. **Heading anchor:** exact title text renders, but the `<h2>` has no ID, confirming the blocking semantic regression.
8. **Duplicate-group risk:** current records contain no cross-group duplicate claim IDs, but `ClaimGroupsSchema` enforces uniqueness only within each array (`entity-schema.ts:23-53`). A future duplicate would render twice with duplicate DOM IDs/React keys; current tests do not cover this non-blocking data-shape risk.

## remove-ai-slops and programming pass

Production TSX is small, strictly typed, uses existing components/tokens, and contains no needless abstraction, parsing/normalization layer, broad catch, debug code, or speculative helper. The three explicit group maps are the clearest order-preserving implementation. Blocking slop remains in the deletion-only class assertion, missing observable behavior locks, and dead CSS selectors described above. No unrelated production extraction or scope expansion was found in the four supplied changed contents, but the absence of a diff prevents proving repository-wide scope.

## checked artifact paths

- `SPEC-company-cards.md`
- `src/features/companies/{CompanyDossier.tsx,CompaniesPage.tsx,CoreLandscape.tsx,companies.test.tsx}`
- `src/features/shared/{CorpusClaim.tsx,SectionIntro.tsx}`
- `src/domain/entity-schema.ts`
- `src/styles/app.css`
- `research/corpus/companies.json` (read-only data validation)
- `.omo/evidence/company-cards-postimpl-qa/` including acceptance logs, `browser-inspection.json`, and `playwright-route.txt`
- `/tmp/company-cards-visual-qa/{companies-375x900.png,companies-768x900.png,companies-1280x900.png}` (opened directly; inspector overlays visible)
- `.omo/visual-qa/current/{desktop-audit.json,desktop-companies-1280x900.png,mobile-companies-320x900.png,desktop-overview-1280x900.png,mobile-overview-320x900.png,desktop-industries-1280x900.png,mobile-industries-320x900.png}` (stale comparison only)
- `.omo/final-review/local-root-review.md` and `.omo/evidence/task-1-rl-market-intelligence-site/self-review.txt` (predate and do not cover this task)

## exact evidence gaps

- Original-to-current diff or baseline snapshot proving the changed-file set, forbidden-path compliance, and exact `renderClaimScope` preservation.
- Task-specific code-review report with explicit `programming`, `remove-ai-slops`, overfit, deletion-only, tautological, implementation-mirroring, needless-abstraction, maintenance-burden, and scope-drift coverage.
- Manual QA matrix.
- Notepad path and contents.
- Clean production-preview Companies captures and fresh post-change overview/industries captures at responsive breakpoints.
- Regression coverage for `titleId`, exact copy, per-card claim order/exclusion, and the visual behavior of globally flattened claims.
