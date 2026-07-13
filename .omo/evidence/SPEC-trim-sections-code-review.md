# SPEC-trim-sections code-quality review

Reviewed: 2026-07-12 17:00 EDT  
Workspace: `/Users/sung/src/frist/RL-env-benchmark-eval-research`  
Review mode: current-filesystem, read-only source review; `.git` is intentionally absent. No historical diff or notepad path was available, so scope was established from `SPEC-trim-sections.md`, current source, current tests, and current generated evidence. Older review reports were not used.

## Result

- `codeQualityStatus`: **BLOCK**
- `recommendation`: **REQUEST_CHANGES**
- Verdict: **REVISE**

## Findings

### CRITICAL

None.

### HIGH

1. **The required extended-browser contract is four tests short.** The current route suite ends after the two six-route layout loops (`e2e/routes.spec.ts:56-92`) and contains no four additional behavioral cases. The exact requested command reports `Running 23 tests` and `23 passed`, not the required 27. A green exit code does not satisfy the explicit count contract and leaves the four expected cases absent.

### MEDIUM

1. **The custom BOM-preserving decoder behavior is not regression-tested.** `src/domain/hash-codec.ts:41-51` deliberately uses `TextDecoder(..., { ignoreBOM: true })` and byte-for-byte re-encoding. Current tests cover ordinary valid UTF-8 (`src/domain/hash-state.test.ts:123-134`) and malformed UTF-8 (`src/domain/hash-state.test.ts:168-178`), but no test locks the U+FEFF/BOM round trip. A direct live probe passed `%EF%BB%BF`, `A%EF%BB%BFB`, café, emoji, and U+FFFD, so this is a coverage defect rather than a current runtime failure.

2. **Citation backlink validation still treats removed routes as canonical.** `src/domain/citations.ts:6-17` includes `gtm`, `economics`, `sources`, and `methodology`; `claimBacklink` consequently returns a `valid` backlink for those sections at `src/domain/citations.ts:166-185`. Current UI consumers do not render `canonicalHash`, and the required `src/` href sweep is clean, so no live removed-route link was observed. Still, this exported navigation-shaped helper disagrees with the six-section hash grammar and can reintroduce removed links. The unchanged corpus explains the legacy values, but that compatibility boundary is not separated from current-route backlink validity.

### LOW

1. **Several tests mirror deletions instead of asserting a compact positive contract.** Examples include exact absence checks in `src/features/field-guide/FieldGuidePage.test.tsx:55-67`, `src/app/AtlasShell.test.tsx:72-79`, `src/features/overview-industries/overview-industries.test.tsx:12-15`, and `src/features/playbook-sources/playbook-sources.test.tsx:5-10`. Adjacent positive assertions and the source sweep reduce risk, but these checks are brittle and can pass while unrelated required content disappears.

## Targeted correctness review

- **No try/catch:** PASS. No `try` or `catch` occurs in `src/domain/hash-codec.ts`, `src/domain/citations.ts`, or `src/App.tsx`; `bun run check:no-excuses` returned `NO_EXCUSES_OK:87`.
- **UTF-8/BOM:** Current runtime behavior PASS. Direct probes round-tripped `caf%C3%A9`, `%F0%9F%98%80`, `%EF%BB%BF`, `A%EF%BB%BFB`, and `%EF%BF%BD` byte-for-byte. Missing BOM regression coverage is noted above.
- **Source outside sources:** PASS. Current parsing leaves `source: null` and emits `source_outside_sources` for valid, unknown, malformed, and repeated source values; unknown and malformed cases retain their specific warning, and repeated values retain `repeated_key`.
- **App dispatch:** PASS. `src/App.tsx:34-51` exhaustively switches over all six `HashSection` variants and sends the default branch to `assertNever`.
- **Removed href sweep:** PASS. `rg '#/(gtm|economics|sources|methodology)|"Method, receipts"' src` returned no matches.
- **Generated semantic evidence:** PASS current drift checks. `.omo/evidence/semantic-audit.json` records 13 rendered relationships and 70 strategy receipts with input hashes matching `scripts/qa/render-semantic-audit.mjs`; both JSONL files contain the corresponding 13 and 70 records.

## Skill-perspective check

The `omo:programming` TypeScript perspective and `omo:remove-ai-slops` overfit/slop perspective were explicitly loaded and applied.

- Programming perspective: exhaustive dispatch, strict types, boundary parsing, and no untyped escape hatches passed. It flags the missing BOM regression and the stale citation-route validity boundary.
- Remove-AI-slops perspective: no unnecessary production extraction/normalization was found in the source-param path; parsing is needed to retain malformed/unknown/repeated warning semantics without `try/catch`. It flags the deletion-mirroring assertions listed under LOW. Targeted production files are below the 250 pure-LOC ceiling (`hash-codec.ts` 233; `citations.ts` 172).

## Exact verification results

Fresh run after the workspace stabilized:

```text
bun run typecheck                                      PASS (exit 0)
bun run lint                                           PASS; 129 files, no fixes
bun run check:no-excuses                               PASS; NO_EXCUSES_OK:87
bun run test:unit                                      PASS; 18 files, 145 tests
bun run check:rendered-claims                          PASS; companies,overview-industries
bun run check:semantic-audit                           PASS; 13 relationships, 70 receipts; SEMANTIC_AUDIT_OK
bun run build                                          PASS; 166 modules; large-chunk warning only
```

The exact chained command exited 0. Unit output included eight jsdom `Window.scrollTo()` not-implemented notices; no test failed.

```text
PLAYWRIGHT_BASE_URL=http://127.0.0.1:4173 bun run test:e2e -- e2e/routes.spec.ts e2e/app-shell.spec.ts e2e/showcase.spec.ts
RESULT: exit 0, 23 passed in 8.3s
CONTRACT: FAIL — expected 27 tests
```

Current browser artifact status is recorded at `test-results/.last-run.json` (`status: passed`), and the run refreshed `.omo/visual-qa/current/` screenshots. Current semantic artifacts are:

- `.omo/evidence/rendered-claim-semantic-audit.jsonl` — 13 records
- `.omo/evidence/strategy-receipt-semantic-audit.jsonl` — 70 records
- `.omo/evidence/semantic-audit.json` — SHA-256 `78ad06c3bdfceb906935c09a59e76fdb4675b248708522d263a50f34ecc93c6b`

## Blockers before approval

1. Restore the exact extended-browser suite to 27 meaningful tests and rerun the user-specified command with `27 passed`. The four cases must assert observable behavior, not merely source deletion or absent text.

