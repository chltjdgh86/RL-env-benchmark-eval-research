# Canonical research corpus

This directory is the content source of truth for the static market-intelligence application. The root `SYNTHESIS.md` is a claim-free deprecation pointer. The immutable pre-canonical research is preserved verbatim at `research/seeds/SYNTHESIS.pre-canonical.md`; the generated canonical synthesis is `research/synthesis/SYNTHESIS.md`.

## Files

- `corpus/sources.json`: source identity, control, access, affiliations, and link-check state.
- `corpus/observations.json`: dated, located observations anchored to one source.
- `corpus/claims.json`: atomic statements and relationship-level evidence links.
- `corpus/companies.json`: the ten requested named-company dossiers.
- `corpus/industries.json`: taxonomy and reciprocal market relations.
- `corpus/adjacent.json`: a quota-bounded 63-record census across seven segments.
- `corpus/supplemental-adjacent.json`: post-cutoff discovery register; 50 inputs reconcile to 47 non-canonical additions, two core merges, and one unresolved identity without changing core quotas or scores.
- `corpus/supplemental-adjacent-2.json`: second post-cutoff discovery register from the 2026-07-12 completeness sweep (market maps, YC directory, funding press, competitor adjacency); 12 verified inputs reconcile to 12 non-canonical additions (11 unknown, one acquired) without changing core quotas or scores. Generated from `migrations/supplemental-census-input-2.json` by `scripts/research/import-sweep-inputs.mjs`.
- `corpus/buyer-evidence.json`: buyer-controlled, procurement, vendor-only, and unverified states.
- `corpus/market-analysis.json`: history, GTM, economic models, risks, metrics, and value-chain edges.
- `corpus/strategies.json`: four qualitative entry models, five scored vertical candidates, 17 competitor responses, roadmap, and pricing experiment.
- `corpus/strategy-research-receipts.json`: 70 executed positive/countersearch receipts, all searched on 2026-07-12 against the 2026-07-11 cutoff, with exact queries, domain classes, evidence, and terminal closures.
- `corpus/datasets.json`: generated public-dataset registry with 925 deduplicated families, 1,083 public surfaces, and attributed/no-hit coverage outcomes for all 132 researched companies.
- `schemas/corpus.schema.json`: strict JSON Schema for the bundled file arrays; cross-file invariants are enforced by the checker.
- `migrations/root-synthesis-seed.json`: SHA-256 manifests and source/claim-anchor migration dispositions.
- `migrations/source-locator-snapshots.json`: exact observed HTML headings/page titles, PDF page locations, or transport metadata, each with a compliant excerpt.
- `migrations/exa-strategy-evidence.json`: normalized evidence and score inputs compiled from the five persisted Exa receipt packets.
- `seeds/exa/`: immutable raw Exa research packets, including the 50-input supplemental integration manifest.
- `seeds/datasets/decision-manifest.json`: generated disposition ledger for 1,360 researched dataset candidates, including retained surfaces, aliases, and exclusions.
- `.omo/ulw-research/20260712-233722/workers/`: source-preserving Exa-led breadth packets and company follow-up receipts used by the dataset importer.

## Evidence semantics

Support is stored on each Claim → Observation → Source relationship. Claim support summary and independence band are derived; neither is mutable corpus data. Only regulator-authoritative, academic-independent, and editorial-independent relationships can contribute an eligible independence group. Buyer-controlled evidence can establish buyer confirmation but does not become independent evidence merely because it sits on another domain.

An official current page can use the narrow `current_advertised_offer` exception. It establishes only that the offer is advertised at the cutoff, not adoption, efficacy, revenue, or active legal status. The adjacent census therefore preserves `entityStatus: "unknown"` unless the corpus has stronger evidence.

The census is systematic and quota-bounded, not literally complete. Each of seven segments contains nine records. Records are deduplicated against the ten named companies by canonical origin, name, and aliases.

The supplemental register is a separate post-cutoff discovery surface. Its 45 unknown and two acquired records are deliberately excluded from the core claim graph, census quotas, buyer evidence, response matrix, and strategy scorecard. Each observation candidate is capped at 25 words and carries `canonicalReady: false` with a null locator; promotion requires a later exact-locator research pass. Refresh and Halluminate merge into their existing core records, Dojo is represented as a Chakra Labs product, and Originator remains unresolved.

The dataset registry is a separate public-artifact index verified on 2026-07-12. It groups repositories, viewers, downloads, samples, and leaderboards into families without treating adjacent links as separate datasets. A company may receive `no_attributable_public_dataset` only when its evidence packet includes an exact-name search receipt; the result means no attributable public dataset was found in this sweep, not that none can exist. Dataset verification does not establish cutoff-current company status, adoption, efficacy, revenue, or buyer evidence.

## Deterministic workflow

```sh
node scripts/research/build-corpus.mjs
node scripts/research/import-sweep-inputs.mjs # regenerate discovery register 2 from its input manifest
node scripts/research/snapshot-locators.mjs # refresh only when deliberately re-observing sources
node scripts/research/check-corpus.mjs
node scripts/research/check-corpus.mjs --check-seed-migration
node --test scripts/research/check-corpus.test.mjs
node --test scripts/research/check-corpus.fixtures.test.mjs
node --test scripts/research/supplemental-census.test.mjs
node scripts/research/render-synthesis.mjs
node scripts/research/render-synthesis.mjs --check
node scripts/research/check-corpus.mjs --report
node scripts/research/check-links.mjs
node scripts/research/import-dataset-evidence.mjs --check
node scripts/research/build-dataset-registry.mjs --check
node --test scripts/research/build-dataset-registry.test.mjs
node scripts/research/check-dataset-links.mjs --offline
```

`check-links.mjs` follows at most five HTTPS redirects, uses a 15-second request timeout, and falls back from HEAD to GET. Blocked, paywalled, login-gated, and unavailable states are advisory by default because transport success does not prove semantic support and transport failure does not disprove a claim. It never bypasses access controls.

`check-dataset-links.mjs --offline` validates registry/manifests and prior audit state without network access. Use `bun run check:dataset-links` for the explicit strict live audit.

Do not hand-edit the generated synthesis. Update canonical JSON, validate, render, and run drift checking. `public/research-synthesis.txt` is intentionally not generated here; application integration owns that fallback asset.
