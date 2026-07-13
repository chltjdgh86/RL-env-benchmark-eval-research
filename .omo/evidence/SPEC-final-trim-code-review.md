# Final current-state code-quality review: SPEC-final-trim.md

Date: 2026-07-12  
Scope: `SPEC-final-trim.md` exactly; current checkout state only  
Verdict: **FAIL**  
codeQualityStatus: **BLOCK**  
recommendation: **REQUEST_CHANGES**

## Review boundary

- The checkout has no `.git`, as expected. Historical changed-file and full-diff proof is unavailable and was not treated as a blocker.
- Current-state implementation files were inspected directly: hash state/types and tests, `App`, `AtlasShell` and tests, field guide and tests, Companies page/tests, route E2E, claim-scope QA, and current CSS consumers.
- No notepad path was supplied. No prior report or executor claim was trusted as test evidence.
- `research/` and `scripts/research/` were not modified by this review. The only review write is this required report artifact; verification commands rebuilt generated output and screenshot evidence.

## Findings by severity

### CRITICAL

None.

### HIGH

1. **The exact acceptance chain fails at the required lint gate.** `bun run typecheck` passes, but `bun run lint` exits 1 because Biome would reformat the positive navigation-contract assertion at `src/app/AtlasShell.test.tsx:58`. Since `SPEC-final-trim.md` requires the commands to pass as one `&&` chain, this is a current release blocker even though the focused test itself passes.

### MEDIUM

None.

### LOW (advisory; non-blocking under the requested review policy)

1. Some tests are removal/constant pins rather than durable behavior tests: `src/domain/hash-state.test.ts:31` and `src/features/field-guide/FieldGuidePage.test.tsx:58`. This is the deletion-test / implementation-mirroring pattern flagged by the `remove-ai-slops` and `programming` perspectives. It is advisory here because the user explicitly made deletion-test style non-blocking and the live route/render probes independently verify the outcome. The current AtlasShell test is not in this category: it positively asserts the exact retained two-link navigation contract at `src/app/AtlasShell.test.tsx:52`.
2. `src/features/field-guide/FieldGuidePage.tsx` is 888 physical lines. This violates the programming skill's general module-size preference, but it is pre-existing, content-heavy, and explicitly non-blocking for this narrow trim review. No unrelated split is requested.
3. The successful build reports one non-fatal chunk-size warning (`App` chunk above 500 kB). This is outside `SPEC-final-trim.md` and does not affect the acceptance result.

## Acceptance evidence

### Exact acceptance chain — FAIL

Freshly rerun after the user's latest current-state instruction:

```sh
bun run typecheck && bun run lint && bun run check:no-excuses && bun run test:unit \
  && bun run check:rendered-claims && bun run check:semantic-audit && bun run build
```

Observed result:

- TypeScript: exit 0.
- Biome: exit 1 at `src/app/AtlasShell.test.tsx:58`; the formatter would wrap the `within(navigation).getAllByRole("link").map(...)` expression and compact the expected array.
- Because the command uses `&&`, the authoritative chain stops at lint and therefore does not pass.

The remaining gates were also run separately to distinguish the formatting blocker from functional failures:

- Focused AtlasShell suite: `1 passed` file; `4 passed (4)` tests.
- No-excuses: `NO_EXCUSES_OK:83`.
- Full unit suite: `18 passed` files; `145 passed (145)` tests.
- Rendered claims: `RENDERED_CLAIMS_OK:companies`.
- Semantic audit: `SEMANTIC_AUDIT_RENDER_OK ...` and `SEMANTIC_AUDIT_OK`.
- Build: `INDEX_SCAFFOLD_OK`, `BUN_LOCK_OK`, 162 modules transformed, exit 0.
- Vitest printed seven jsdom `Window.scrollTo()` not-implemented notices, but no test failed.

### Rebuilt Chromium route matrix — PASS

After the fresh build, a new Vite preview was started on `127.0.0.1:4199`, then:

```sh
PLAYWRIGHT_BASE_URL=http://127.0.0.1:4199 bunx playwright test e2e/routes.spec.ts --project=chromium
```

Result: `7 passed (4.8s)`. The matrix covers the single-H1 Showcase check plus Guide, Companies, and Showcase at 1280px and 320px (`e2e/routes.spec.ts:33`, `e2e/routes.spec.ts:46`, `e2e/routes.spec.ts:65`). The Showcase 320px case passed.

Fresh screenshot artifacts include:

- `.omo/visual-qa/current/mobile-showcase-320x900.png`
- `.omo/visual-qa/current/desktop-showcase-1280x900.png`
- `.omo/visual-qa/current/mobile-guide-320x900.png`
- `.omo/visual-qa/current/mobile-companies-320x900.png`

### Directive-by-directive current-state checks — PASS

- Sections: `HASH_SECTIONS` is exactly `guide`, `companies`, `showcase` (`src/domain/hash-types.ts:18`); `App` only imports/renders those three surfaces (`src/App.tsx:1`, `src/App.tsx:33`); shell labels match (`src/app/AtlasShell.tsx:15`).
- Deleted surface: `src/features/overview-industries/` does not exist.
- Search UI: `AtlasShell` imports `Masthead`, `SkipLink`, and `UtilityNav`, not `SearchField`, and its toolbar renders only `UtilityNav` (`src/app/AtlasShell.tsx:3`, `src/app/AtlasShell.tsx:67`). `q` remains in the hash schema (`src/domain/hash-types.ts:19`) and a direct parse/serialize probe returned `Q_PARSE_OK:Mercor labs`.
- Removed routes: fresh `rg -n '#/overview|#/market-map|#/industries' src` returned no matches.
- Field guide: Parts 2 and 3 have no removed-route links; Part 11 exposes only `#/companies` internally (`src/features/field-guide/FieldGuidePage.tsx:830`).
- Part 5 links: rendered-markup verification found exactly 35 requested links; every name/URL matched the SPEC and every link had `target="_blank"` and `rel="noreferrer"`. Data objects are typed and readonly (`src/features/field-guide/FieldGuidePage.tsx:24`, `src/features/field-guide/FieldGuidePage.tsx:30`, `src/features/field-guide/FieldGuidePage.tsx:68`); rendering is at lines 577-606.
- Companies eyebrow: exactly `Companies` (`src/features/companies/CompaniesPage.tsx:66`).
- Claim scope: the only discovered `claim-scope.json` is `src/features/companies/claim-scope.json`; the acceptance output confirms only `companies` is rendered.
- CSS consumer check: every class selector in current `src/styles/app.css` had a TypeScript/TSX literal consumer. Specifically, retained `MarketMap`, `TimelineItem`, and `SearchField` classes are live through `src/components/layout.tsx:107`, `src/components/layout.tsx:161`, `src/components/controls.tsx:13`, and `src/components/PrimitiveShowcase.tsx:86`; they are not dead residue from deleted routes.
- Trim code has no `try`/`catch`; `check:no-excuses` and TypeScript are green. Biome is not green because of the formatting finding above.

## Skill-perspective check

The `remove-ai-slops` and `programming` skills, including the TypeScript reference, were explicitly loaded and applied before maintainability/test-relevance judgment.

- Production code: no blocking slop found. The goal-required object restructuring is direct, typed, and rendered without unnecessary parsing, extraction, normalization, defensive branches, or untyped escape hatches.
- Tests: the current AtlasShell navigation test is a relevant positive contract and passes `4/4`; it does not violate either skill perspective. The remaining deletion-only / implementation-constant assertions noted under LOW are advisory under the user's explicit scope rule.
- Programming perspective: the oversized field-guide module is an advisory violation only, per the user's explicit scope rule.

## Blockers

- Format `src/app/AtlasShell.test.tsx:58` so `bun run lint` exits 0, then rerun the exact acceptance chain from `SPEC-final-trim.md` end to end.

## Final judgment

The requested functional trim is present and its focused/unit/E2E checks pass, but the current checkout does **not** satisfy the SPEC's exact acceptance chain because the required lint gate fails. Approval is blocked on the single formatting issue above.
