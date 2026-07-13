# Company Cards Code-Quality Review

## Verdict

- Result: **FAIL**
- `codeQualityStatus`: **BLOCK**
- `recommendation`: **REQUEST_CHANGES**
- Reviewed goal: implement `SPEC-company-cards.md` exactly.
- Reviewed scope: `CompanyDossier.tsx`, `CompaniesPage.tsx`, `companies.test.tsx`, and the relevant `app.css` rules.

## Findings

### CRITICAL

None.

### HIGH

1. **The required `SectionIntro` `titleId` was not preserved.**

   - Spec evidence: `SPEC-company-cards.md:63-67` requires the new title while preserving `titleId`.
   - Code evidence: `src/features/companies/CompaniesPage.tsx:15-20` passes only `eyebrow` and `title` to `SectionIntro`.
   - Runtime evidence: server-rendering `CompaniesPage` produced `H2: Every company, one card.` with no `id`.
   - Impact: this is direct spec non-compliance and removes the stable heading identifier the change was explicitly required to retain. Green typecheck, lint, semantic-audit, and build output do not detect this contract failure.
   - Required before approval: restore the pre-existing `titleId` value and its prior ID-based association, if any.

2. **The tests do not lock the core positive claim-selection and ordering contract.**

   - Spec evidence: `SPEC-company-cards.md:45-54` requires identity first, followed by every `currentOffer`, `milestones`, and `risks` claim in that exact order.
   - Test evidence: `src/features/companies/companies.test.tsx:51-61` checks an `h4`, one identity statement, and the absence of two headings, but never checks that current-offer, milestone, and risk claims are present or ordered.
   - Impact: deleting all three required claim-group loops, omitting one group, or swapping milestone/risk order would leave the changed test green. This gives false confidence around the most consequential content behavior in the change.
   - Required before approval: add observable, card-scoped coverage proving identity, current-offer, milestone, and risk content is present in the required order. Avoid a tautological assertion that merely rebuilds the component's array expression from the same constants.

### MEDIUM

1. **The test contains a deletion-only, implementation-coupled assertion.**

   - Evidence: `src/features/companies/companies.test.tsx:47` asserts that `.company-dossier` occurs zero times.
   - The positive selector at `src/features/companies/companies.test.tsx:41-45` already proves that the named cards use the required `.landscape-grid > .landscape-record` shape. The zero-count assertion only verifies removal of an old class name; it does not protect user-visible behavior and is brittle under harmless class refactors.
   - Recommendation: remove this assertion or replace it with missing positive behavior coverage described above. The spec-required no-`Origin` heading check is user-visible and is not the problem.

### LOW

None.

## Correctness and Scope Review

- `src/features/companies/CompanyDossier.tsx:13-33` currently renders the required flat article structure, uses an `h4`, and places identity/current-offer/milestone/risk claims in the specified order.
- A direct server-rendered DOM probe observed 10 named cards. The Scale AI card's direct children were `p`, `h4`, `p`, `a`, then claim articles for identity, two current-offer claims, one milestone, and one risk. No `Origin` or `Current offer` heading was rendered.
- `src/features/companies/CompaniesPage.tsx:27-36` contains the exact required header copy and uses `landscape-grid`.
- `src/features/companies/CompaniesPage.tsx:44-56` remains present and the rendered-claims gate passes. Because this checkout has no git metadata or baseline diff, the historical claim that `renderClaimScope` was literally untouched cannot be independently proven.
- `src/styles/app.css:142-147` retains only the statement/source spacing. Searches found no remaining `.company-grid`, `.dossier-sections`, or `.company-dossier` production selector.
- No `<details>`, chips, `try`/`catch`, untyped escape hatch, parameter mutation, needless validation, or newly introduced abstraction was found in the reviewed production code.
- The heading sequence is sane: page `h2`, subsection `h3`, and card `h4`. The missing `titleId` remains a separate explicit-spec defect.

## Required Skill-Perspective Check

- `remove-ai-slops`: **ran** over production code and tests. Production code did not introduce unnecessary extraction, parsing/normalization, defensive code, or needless abstraction. The test at `companies.test.tsx:47` violates the deletion-only-test perspective, and the negative-heavy test leaves the required positive claim behavior insufficiently protected.
- `programming`: **ran**, including the TypeScript/React strictness perspective. Production TypeScript follows readonly props, type-only imports, named exports, Biome formatting, and contains no `any`, assertions, non-null assertions, suppression directives, or catch blocks. The diff violates this perspective through inadequate behavior coverage and the unpreserved `titleId`, not through TypeScript escape hatches.

## Independent Verification

The supplied acceptance artifacts were inspected under `.omo/evidence/company-cards-postimpl-qa/` and then checked independently:

- TypeScript: PASS using no-emit, non-incremental checks for `tsconfig.app.json` and `tsconfig.node.json`.
- Biome: PASS, 145 files checked, no fixes applied.
- No-excuses: PASS, `NO_EXCUSES_OK:101`.
- Unit tests: PASS, 21 files / 150 tests.
- Rendered claims: PASS, `RENDERED_CLAIMS_OK:companies,market-operations,overview-industries,playbook-sources`.
- Semantic audit: PASS, `SEMANTIC_AUDIT_OK`.
- Build: PASS to `/tmp/rl-env-company-cards-review-build`; Vite transformed 176 modules. The existing >500 kB chunk warning is outside this change's review scope.

Evidence inspected:

- `.omo/evidence/company-cards-postimpl-qa/typecheck.txt`
- `.omo/evidence/company-cards-postimpl-qa/lint.txt`
- `.omo/evidence/company-cards-postimpl-qa/no-excuses.txt`
- `.omo/evidence/company-cards-postimpl-qa/unit.txt`
- `.omo/evidence/company-cards-postimpl-qa/rendered-claims.txt`
- `.omo/evidence/company-cards-postimpl-qa/semantic-audit.txt`
- `.omo/evidence/company-cards-postimpl-qa/build.txt`
- `.omo/evidence/company-cards-postimpl-qa/static-shape-audit.txt`

## Review Limitations

- The checkout has no git metadata and no before/after diff was available, so scope control was reviewed against the four supplied current file contents and repository searches rather than commit history.
- No notepad path was supplied or found.

## Blockers

1. Restore the spec-mandated `SectionIntro` `titleId` and any prior association that depended on it.
2. Add card-scoped behavioral coverage for required current-offer, milestone, and risk inclusion and ordering after identity, without mirroring implementation constants.

