# RL Economy Atlas

An evidence-linked research product for the AI post-training economy: training data, expert workforces, RL environments, computer use, evaluations and assurance, post-training infrastructure, and agent-experience services.

The canonical research cutoff is **2026-07-11**. A separately labeled user-supplied discovery register was observed on **2026-07-12** and does not mutate the core census.

## What is included

- 235 sources, 235 anchored observations, and 561 atomic claims.
- Ten named-company dossiers and a reproducible 63-record adjacent-company census.
- A separate 47-record supplemental register, two core merges, and one unresolved identity.
- Nine technical taxonomies, seven operating-economic models, buyer/GTM evidence, and risk guardrails.
- Four qualitative strategic hypotheses, five fixed vertical candidates, 35 score cells, and 70 symmetric positive/countersearch receipts.
- A fixed strategy result of **NO-GO — DISCOVERY REQUIRED** under the current evidence.

## Run locally

```sh
bun install --frozen-lockfile
bun run dev
```

Open the URL printed by Vite. The application is client-only and uses hash-addressable routes.

## Verify

```sh
bun run research:check
bun run research:render
bun run research:fallback
bun run typecheck
bun run lint
bun run test:unit
bun run build
```

The canonical data lives in `research/corpus/`; the generated long-form synthesis is `research/synthesis/SYNTHESIS.md`. Do not hand-edit generated outputs.
