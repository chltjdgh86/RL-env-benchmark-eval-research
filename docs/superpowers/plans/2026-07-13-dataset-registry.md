# Dataset Registry Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a dedicated `#/datasets` section that turns the exhaustive Exa sweep into a broad, searchable, access-aware registry of benchmark, environment, task, sample, and trajectory datasets.

**Architecture:** Keep research data in a checked-in JSON corpus, validate it at the application boundary with strict Zod schemas, and expose pure query/filter helpers to the React page. Treat each benchmark family as the top-level record and nest its canonical, data, sample, trajectory, and reference surfaces beneath it. Reuse the atlas newsprint primitives and hash router, while keeping dataset-specific filters local to the new route.

**Tech Stack:** React 19, TypeScript 7, Zod 4, Vitest/Testing Library, Playwright, Vite, Biome.

**Canonical dataset enums:**

- Categories: `computer_use_gui`, `browser_web`, `mcp_tool_use`, `coding_terminal`, `office_professional`, `enterprise_customer_service`, `finance_legal_compliance`, `science_data_research`, `safety_cybersecurity`, `multiagent_memory_planning_games`, `robotics_physical_ai`, `general_agent_suites_trajectories`, `company_sample_catalogs`.
- Artifact types: `tasks`, `environment`, `inputs`, `references`, `trajectories`, `results`, `training`, `viewer_sample`, `commercial_catalog`.
- Access states: `open`, `gated`, `public_subset`, `sample_demo`, `commercial`, `credential_dependent`, `rolling`, `provisional`.
- Provenance states: `first_party`, `official_companion`, `community_derivative`, `anonymous_release`.
- Surface kinds: `benchmark_page`, `dataset`, `repository`, `sample_viewer`, `leaderboard`, `environment`, `catalog`, `download`.
- Candidate decisions: `retained`, `alias`, `mirror`, `paper_only`, `result_only`, `unreleased`, `broken_unverifiable`, `monitoring`.

---

## Chunk 1: Typed corpus and query model

### Task 1: Build the exhaustive dataset corpus

**Files:**
- Create: `research/seeds/datasets/decision-manifest.json`
- Create: `research/corpus/datasets.json`
- Create: `scripts/research/import-dataset-evidence.mjs`
- Create: `scripts/research/build-dataset-registry.mjs`
- Create: `scripts/research/build-dataset-registry.test.mjs`
- Create: `scripts/research/check-dataset-links.mjs`
- Create: `src/features/datasets/dataset-schema.ts`
- Create: `src/features/datasets/dataset-corpus.ts`
- Create: `src/features/datasets/dataset-corpus.test.ts`
- Modify: `package.json`

- [x] **Step 1: Write failing corpus contract tests**

  Assert that parsing fails on malformed records; all 13 categories are represented; family IDs, surface IDs, and normalized retained URLs are unique; every family has a nonblank publisher, description, verified date, and primary surface; every surface has an HTTPS URL plus kind, artifact, access, and provenance; the registry contains at least 400 retained families and 500 data surfaces; and the Mercor APEX leaderboard, Mercor APEX data, OpenAI GDPval viewer, and Aviro C4 samples are present. Add manifest-accounting tests proving every candidate has exactly one decision; every `retained` candidate maps to one family surface; every `alias` maps to a retained candidate/family; excluded decisions do not enter the default corpus; and all 132 site companies appear exactly once with either candidate IDs or `no_attributable_public_dataset`.

- [x] **Step 2: Run the focused test and confirm RED**

  Run: `bunx vitest run src/features/datasets/dataset-corpus.test.ts`

  Expected: FAIL because the schema and corpus do not exist.

- [x] **Step 3: Import the Exa evidence into a tracked decision manifest**

  `import-dataset-evidence.mjs` is the one-time evidence importer. It parses every candidate-bearing table shape from `.omo/ulw-research/20260712-233722/workers`, explodes multi-dataset company rows, records the source report/section/row excerpt, and emits a reviewable tracked manifest. Every candidate receives one explicit decision. Every retained/alias candidate stores an explicit `familyId`, so cross-URL companion grouping never depends on URL equality. The manifest also stores explicit family identity/alias records and a 132-row company coverage ledger. Add parser fixtures for each table shape, raw and Markdown links, multi-link rows, duplicate URLs, explicit cross-URL family grouping, result-only sections, exclusion sections, broken links, and company rows with no attributable surface.

- [x] **Step 4: Implement strict schemas and the deterministic compiler**

  Model `DatasetFamily` with family-level identity/description/category/tags/version fields and nested `DatasetSurface[]`. Keep surface kind, artifact types, access, provenance, URL, and notes on each surface because companions can differ. The compiler reads only the tracked manifest, validates exact accounting, seeds the required URLs, collapses explicit aliases, excludes non-retained decisions, and produces stable ordering. `--check` regenerates in memory and byte-compares the checked-in corpus.

- [x] **Step 5: Generate and parse the checked-in corpus**

  Run: `node scripts/research/build-dataset-registry.mjs`

  Expected: `research/corpus/datasets.json` is generated with stable ordering and summary counts.

- [x] **Step 6: Add deterministic and policy-aware link gates**

  Add `research:datasets:check` for manifest/schema/accounting/byte-staleness checks and `check:dataset-links` for normalized HTTPS URLs, disallowed mirror patterns, duplicate destinations, required seeds, and bounded live availability checks with explicit WAF/gated policies. Add `research:datasets:check` to `verify:all`; keep the live audit as an explicit final command so transient network failures remain distinguishable from corpus integrity failures.

- [x] **Step 7: Run the focused tests and confirm GREEN**

  Run: `bunx vitest run src/features/datasets/dataset-corpus.test.ts && node scripts/research/build-dataset-registry.test.mjs && bun run research:datasets:check`

  Expected: PASS.

### Task 2: Add pure search, filtering, and grouping

**Files:**
- Create: `src/features/datasets/dataset-filters.ts`
- Create: `src/features/datasets/dataset-filters.test.ts`

- [x] **Step 1: Write failing behavior tests**

  Cover Unicode/case-insensitive search across family, publisher, description, tags, and surface labels; AND-across-facets / OR-within-a-facet semantics; empty results; stable category/publisher/name ordering; and filter option counts.

- [x] **Step 2: Run the focused test and confirm RED**

  Run: `bunx vitest run src/features/datasets/dataset-filters.test.ts`

  Expected: FAIL because the filter module does not exist.

- [x] **Step 3: Implement the minimal typed selectors**

  Keep filtering pure and deterministic. Return grouped category sections and summary totals without mutating corpus records.

- [x] **Step 4: Run the focused test and confirm GREEN**

  Run: `bunx vitest run src/features/datasets/dataset-filters.test.ts`

  Expected: PASS.

## Chunk 2: Product surface and routing

### Task 3: Build the dedicated datasets page

**Files:**
- Create: `src/features/datasets/DatasetsPage.tsx`
- Create: `src/features/datasets/DatasetFamilyRecord.tsx`
- Create: `src/features/datasets/index.ts`
- Create: `src/features/datasets/datasets.test.tsx`
- Modify: `src/styles/app.css`
- Modify: `DESIGN.md`
- Modify: `.omo/frontend-design/state.md`

- [x] **Step 1: Write failing UI tests**

  Assert the registry heading and methodology note; total family/surface counts; all four required URLs; accessible search; category/artifact/access/provenance controls; query and facet behavior; clear-all behavior; no-results recovery; category grouping; and nested companion links.

- [x] **Step 2: Run the focused test and confirm RED**

  Run: `bunx vitest run src/features/datasets/datasets.test.tsx`

  Expected: FAIL because the page does not exist.

- [x] **Step 3: Implement the live DOM registry**

  Reuse `SectionIntro`, tokenized typography, rules, controls, and paper surfaces. Render real links and semantic articles, not a raster or mock. Keep controls compact, expose live result counts, show access/provenance without color-only meaning, and use `content-visibility` only as a progressive performance enhancement.

- [x] **Step 4: Document the new page primitive**

  Extend `DESIGN.md` with the Dataset Registry and Dataset Family Record contracts, responsive behavior, and access-label rules. Record the approved direction and QA evidence locations in `.omo/frontend-design/state.md`.

- [x] **Step 5: Run the focused test and confirm GREEN**

  Run: `bunx vitest run src/features/datasets/datasets.test.tsx`

  Expected: PASS with no axe violations.

### Task 4: Wire the route and navigation

**Files:**
- Modify: `src/domain/hash-types.ts`
- Modify: `src/domain/hash-state.test.ts`
- Modify: `src/app/AtlasShell.tsx`
- Modify: `src/app/AtlasShell.test.tsx`
- Modify: `src/App.tsx`
- Modify: `src/App.test.tsx`
- Modify: `e2e/routes.spec.ts`
- Create: `e2e/datasets.spec.ts`
- Modify: `playwright.config.ts`

- [x] **Step 1: Write failing router and shell tests**

  Add `datasets` to the canonical hash sections, require the primary nav order `Field guide`, `Companies`, `Datasets`, require the datasets heading at `#/datasets`, and require the company-only global facet tray to stay hidden on the dedicated registry.

- [x] **Step 2: Make Playwright self-starting and write browser coverage**

  Add a managed production build/preview `webServer` to `playwright.config.ts`, so `bun run test:e2e` works from a clean checkout without a separately started server. Enumerate datasets in the all-route overflow suite. Add search/facet/reset/nested-link checks; Axe audits for default, filtered, and empty states; keyboard-only control and focus-retention checks; polite live-result announcements; 320, 375, 768, and 1280 pixel viewport assertions; 200% and 400%-equivalent reflow; exact WCAG text-spacing injection; forced colors; and reduced motion.

- [x] **Step 3: Run unit and browser tests and confirm RED**

  Run: `bunx vitest run src/domain/hash-state.test.ts src/app/AtlasShell.test.tsx src/App.test.tsx && bunx playwright test e2e/routes.spec.ts e2e/datasets.spec.ts`

  Expected: FAIL because `datasets` is not a route.

- [x] **Step 4: Implement exhaustive route handling**

  Extend the Zod route enum and exhaustive switches, add the nav label, render `DatasetsPage` with the route query as its initial search, and leave the hidden showcase route intact.

- [x] **Step 5: Run focused unit and browser tests and confirm GREEN**

  Run: `bunx vitest run src/domain/hash-state.test.ts src/app/AtlasShell.test.tsx src/App.test.tsx && bunx playwright test e2e/routes.spec.ts e2e/datasets.spec.ts`

  Expected: PASS.

## Chunk 3: Verification and independent review

### Task 5: Verify the complete implementation

**Files:**
- Evidence: `.omo/visual-qa/datasets/`

- [x] **Step 1: Run static and unit gates**

  Run: `bun run typecheck && bun run lint && bun run check:no-excuses && bun run test:unit && bun run build`

  Expected: every command exits 0.

- [x] **Step 2: Run browser and live-link tests**

  Run: `bun run test:e2e && bun run check:dataset-links`

  Expected: all Playwright tests pass with no horizontal overflow or accessibility failure, and every retained registry URL satisfies the policy-aware availability audit.

- [x] **Step 3: Capture every datasets state on the current build**

  Capture desktop, tablet, and mobile default states plus searched, filtered, and empty states after the last source edit. Include 200%, 400%-equivalent, text-spacing, forced-colors, and reduced-motion states. Store screenshots and a complete state inventory in `.omo/visual-qa/datasets/`.

- [x] **Step 4: Run dual independent visual review**

  Dispatch read-only design-system/functional and visual-fidelity reviewers against all fresh captures. Fix and repeat until both return PASS with no blocking findings.

- [x] **Step 5: Run the five-lane post-implementation review**

  Dispatch goal, hands-on QA, code-quality, security, and context-mining reviewers. Fix and rerun any failing lane until all five pass.

- [x] **Step 6: Run the canonical final gate fresh**

  Run: `bun run verify:all && bun run test:e2e && bun run check:dataset-links`

  Expected: both commands exit 0 on the final files.
