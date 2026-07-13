# RL Economy Atlas

An evidence-linked research product for the AI post-training economy: training data, expert workforces, RL environments, computer use, evaluations and assurance, post-training infrastructure, and agent-experience services.

The canonical market-research cutoff is **2026-07-11**. Separately labeled company discoveries and the public-dataset registry were verified on **2026-07-12**; neither mutates the core census or strategy scores.

## What is included

- 235 sources, 235 anchored observations, and 561 atomic claims.
- Ten named-company dossiers and a reproducible 63-record adjacent-company census.
- A separate 47-record supplemental register plus a 12-record completeness sweep, two core merges, and one unresolved identity.
- Nine technical taxonomies, seven operating-economic models, buyer/GTM evidence, and risk guardrails.
- Four qualitative strategic hypotheses, five fixed vertical candidates, 35 score cells, and 70 symmetric positive/countersearch receipts.
- A dedicated datasets index with 925 dataset families, 1,083 public surfaces, and an auditable coverage ledger for all 132 companies in the research universe.
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
bun run research:datasets:check
bun run research:render
bun run research:fallback
bun run typecheck
bun run lint
bun run test:unit
bun run build
```

The canonical data lives in `research/corpus/`; the generated long-form synthesis is `research/synthesis/SYNTHESIS.md`. Dataset import and compiler tests run with `node --test scripts/research/build-dataset-registry.test.mjs`. Run `bun run check:dataset-links` only when a live network audit is intended. Do not hand-edit generated outputs.
