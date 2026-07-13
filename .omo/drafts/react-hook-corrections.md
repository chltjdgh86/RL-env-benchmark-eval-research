# React Hook Corrections Draft

- intent: clear
- review_required: false
- size: standard
- status: scope-change-pending
- pending_action: resolve whether `skills` means user-global Codex/Claude skill packages or application capabilities
- test_strategy: TDD with a failing behavior test before each product correction

## Requested outcome

Review every first-party React hook call site and correct every demonstrated behavioral,
lifecycle, and test-harness issue without expanding into the repository-wide React Doctor
warning backlog.

## Scope

In scope:

- `src/app/AtlasShell.tsx`
- `src/app/AtlasShell.test.tsx`
- `src/components/controls.tsx`
- `src/components/disclosure.tsx`
- `src/components/primitives.test.tsx`
- `src/test/setup.ts`
- targeted browser regression coverage under `e2e/` only if the corrected behavior needs a
  real-browser proof

Out of scope:

- third-party hooks under `node_modules/`
- the 62 non-hook React Doctor warnings in unrelated files
- visual redesigns, new product behavior, corpus/data changes, and dependency upgrades

## Components ledger

| ID | Component | Outcome | Status | Evidence |
| --- | --- | --- | --- | --- |
| H1 | Route/hash lifecycle | Reparse URL state against the current index, keep listener/effect lifecycles stable, and reset scroll only for section changes | confirmed issue | `src/app/AtlasShell.tsx:26-47`; direct rerender probe retained removed `co_scale-ai` |
| H2 | Search state | Make every user clear path share the same callback contract while preserving focus and normalization | confirmed inconsistency | `src/components/controls.tsx:33-43`; Escape clears state without `onClear` |
| H3 | Accordion state | Preserve the existing uncontrolled `defaultExpanded` contract and verify disabled/toggle behavior | no demonstrated product defect; coverage gap only | `src/components/disclosure.tsx:13-49`; `src/components/primitives.test.tsx:97-113` |
| H4 | Drawer lifecycle | Keep background isolation correct across overlapping drawers and cleanup, with focus trapping/restoration verified | confirmed issue | `src/components/disclosure.tsx:75-89`; direct nested-drawer probe left one dialog open with root non-inert |
| H5 | Hook test harness | Replace JSDOM's unimplemented scroll API with an observable test double and assert calls | confirmed issue | full Vitest run passes 145 tests but emits seven `Window.scrollTo` errors |

## Verified baseline

- `bun run lint`: pass, 124 files
- `bun run typecheck`: pass
- `bun run check:no-excuses`: pass, `NO_EXCUSES_OK:83`
- `bun run test:unit`: pass, 18 files / 145 tests, with seven scroll diagnostics
- React Doctor suppression audit: zero hook-rule findings; 62 unrelated warnings
- No `.git` metadata exists in this checkout, so filesystem truth replaces diff/history checks

## Approaches considered

### A. Focused lifecycle corrections (recommended)

Keep the existing component APIs. Recompute parsed hash state when the memoized reference index
changes, split independent subscription/canonicalization work so the listener does not churn on
every parsed state object, replace the scroll dependency suppression with explicit previous-section
tracking, route SearchField clear interactions through one callback-aware helper, and make Drawer
background isolation ownership-safe. Add behavior-first tests for each correction.

Trade-off: slightly more lifecycle code, but the smallest change that fixes every demonstrated
issue without inventing new abstractions.

### B. Minimal symptom patch

Only reparse on `index` changes, preserve `inert`, invoke `onClear` on Escape, and mock `scrollTo`.

Trade-off: smallest diff, but leaves the combined AtlasShell effect resubscribing on every parsed
state change and leaves the dependency suppression in place.

### C. Extract custom hook modules

Create dedicated `useHashState`, `useSectionScrollReset`, and `useModalIsolation` hooks and test them
independently.

Trade-off: strongest isolation, but unnecessary abstraction and file growth for 15 hook calls in
three small components.

## Proposed design

Use approach A. Preserve all public props and current visible behavior. Each external synchronization
process gets one lifecycle and mirrored cleanup. Route parsing derives from the current hash and the
current reference index; canonical URL recovery remains explicit. Scroll reset records the prior
section so it can use a truthful dependency list and avoid query-only resets. Drawer isolation tracks
ownership so closing one drawer cannot reactivate the app while another drawer is open. Search clear
paths update state, notify `onClear`, and retain the existing focus behavior.

Every product change starts with a failing Vitest regression. Browser QA covers hash navigation and
drawer keyboard behavior after the unit layer is green. Final verification runs the hook-focused
tests, full unit suite, typecheck, Biome, no-excuses, build, and targeted Playwright scenarios. No
React Doctor warning outside the scoped hook files becomes part of this work.

## Approval gate

Approve approach A to authorize writing the decision-complete implementation plan. Approval does not
yet authorize product-code edits; execution begins only after the plan is written and explicitly
started.

## Scope-change note

The user approved the hook brief, then requested review and optimization of "all hooks and skills."
This checkout contains first-party React hooks but no repository skill packages. Chronicle could not
be used to disambiguate because the recorder was not running. The plan must not expand into
user-global `~/.codex`, `~/.claude`, `~/.agents`, or plugin-cache skills until the user confirms that
machine-level scope.
