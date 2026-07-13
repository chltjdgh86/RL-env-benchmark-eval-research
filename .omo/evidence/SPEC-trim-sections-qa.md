# SPEC-trim-sections QA packet

Date: 2026-07-12

## Scope

Implemented `SPEC-trim-sections.md` in the active checkout. The checkout has no
`.git` directory, so the changed-file manifest is the explicit spec-scoped list
below rather than a VCS diff.

Source and test scope:

- Hash contract: `src/domain/hash-types.ts`, `src/domain/hash-codec.ts`,
  `src/domain/hash-state.test.ts`, `src/app/hash-references.ts`.
- Shell and route dispatch: `src/app/AtlasShell.tsx`, `src/app/AtlasShell.test.tsx`,
  `src/App.tsx`.
- Remaining page copy/tests: field guide, overview, showcase feature index/tests,
  primitive tests, citation tests.
- Deleted: `src/features/market-operations/**`,
  `src/features/playbook-sources/SourcesPage.tsx`,
  `src/features/playbook-sources/MethodologyPage.tsx`.
- QA wiring: `scripts/qa/render-semantic-audit.mjs` and generated files under
  `.omo/evidence/`.
- Browser contracts: `e2e/routes.spec.ts`, `e2e/showcase.spec.ts`.

`research/` and `scripts/research/` were not edited.

## Acceptance evidence

The exact acceptance chain completed successfully:

```text
bun run typecheck
bun run lint
bun run check:no-excuses -> NO_EXCUSES_OK:87
bun run test:unit -> 18 files, 146 tests passed
bun run check:rendered-claims -> RENDERED_CLAIMS_OK:companies,overview-industries
bun run check:semantic-audit -> relationships=13, receipts=70, SEMANTIC_AUDIT_OK
bun run build -> INDEX_SCAFFOLD_OK, BUN_LOCK_OK, vite build succeeded
```

Focused TDD evidence for invalid source parameters:

- RED: `src/domain/hash-state.test.ts` failed because `source=src_missing`
  emitted only `invalid_value`.
- GREEN: after the parser fix, the focused hash, shell, and field-guide tests
  passed; the full unit suite then passed at 146/146.

## Browser matrix

`PLAYWRIGHT_BASE_URL=http://127.0.0.1:4173 bun run test:e2e --
e2e/routes.spec.ts e2e/app-shell.spec.ts e2e/showcase.spec.ts` passed 23/23.

The route matrix covers all six routes at 1280px and 320px, with bounded
viewport screenshots plus scroll-segment evidence and route-specific heading
assertions. Showcase coverage additionally includes 320/375/768/1280px,
text-spacing, four-times page-scale stress, drawer Escape/focus restoration,
and forced-colors/reduced-motion.

## Visual evidence

Fresh route captures are under `.omo/visual-qa/current/` and fresh showcase
captures are under `.omo/evidence/task-5-rl-market-intelligence-site/`.
