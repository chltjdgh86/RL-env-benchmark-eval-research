#!/usr/bin/env node

import { readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

import {
  BUSINESS_MODELS,
  CANDIDATES,
  DEFAULT_ROOT,
  DIMENSIONS,
  SEGMENTS,
  deriveSupportSummary,
  loadCorpus,
} from "./corpus-validator.mjs";
import { escapeMarkdownText, markdownUrl, renderSourceRegistryEvidence } from "./render-utils.mjs";

const args = new Set(process.argv.slice(2));
const corpus = loadCorpus(DEFAULT_ROOT);
const migration = JSON.parse(
  readFileSync(join(DEFAULT_ROOT, "research/migrations/root-synthesis-seed.json"), "utf8"),
);
const supplemental = JSON.parse(
  readFileSync(join(DEFAULT_ROOT, "research/corpus/supplemental-adjacent.json"), "utf8"),
);
const supplemental2 = JSON.parse(
  readFileSync(join(DEFAULT_ROOT, "research/corpus/supplemental-adjacent-2.json"), "utf8"),
);
const outputPath = join(DEFAULT_ROOT, "research/synthesis/SYNTHESIS.md");
const sourceMap = new Map(corpus.sources.map((source) => [source.sourceId, source]));
const observationMap = new Map(
  corpus.observations.map((observation) => [observation.observationId, observation]),
);
const claimMap = new Map(corpus.claims.map((claim) => [claim.claimId, claim]));
const receiptMap = new Map(corpus.receipts.map((receipt) => [receipt.id, receipt]));

const escape = escapeMarkdownText;
const label = (value) => String(value).replaceAll("_", " ");
const citationLinks = (claim) =>
  [...new Set(claim.evidenceLinks.map((link) => link.sourceId))]
    .map((sourceId) => {
      const source = sourceMap.get(sourceId);
      return `[${escape(source.title)}](${markdownUrl(source.canonicalUrl)})`;
    })
    .join("; ");
const renderClaim = (claimId) => {
  const claim = claimMap.get(claimId);
  if (!claim) return `MISSING CLAIM ${claimId}`;
  return `${escape(claim.statement)} _${label(claim.kind)} · ${label(deriveSupportSummary(claim))} · ${label(claim.confidence)} · ${label(claim.temporal)} · ${label(claim.risk)}_ — ${citationLinks(claim)}`;
};
const sourceLinksForReceipt = (receipt) =>
  receipt.sourceIds.length === 0
    ? "none"
    : receipt.sourceIds
        .map((sourceId) => {
          const source = sourceMap.get(sourceId);
          return `[${escape(source.title)}](${markdownUrl(source.canonicalUrl)})`;
        })
        .join("; ");

const lines = [];
lines.push("# AI Post-Training Economy: Canonical Research Synthesis");
lines.push("");
lines.push("> Generated deterministically from `research/corpus/*.json`. Do not hand-edit this file.");
lines.push("");
lines.push("## Method and scope");
lines.push("");
lines.push(`- Evidence cutoff: 2026-07-11.`);
lines.push(`- Corpus: ${corpus.sources.length} sources, ${corpus.observations.length} atomic observations, ${corpus.claims.length} claims, ${corpus.companies.length} named-company dossiers, and ${corpus.adjacent.length} bounded adjacent records.`);
lines.push(`- Strategy method: ${corpus.receipts.length} executed positive/countersearch receipts across ${CANDIDATES.length} vertical candidates and ${DIMENSIONS.length} fixed dimensions. Every lane was searched on 2026-07-12 against the 2026-07-11 cutoff; zero lanes remain \`open_unverified\`. The four business-entry models remain qualitative hypotheses.`);
lines.push(`- Provenance: root seed SHA-256 \`${migration.rootSeed.sha256}\`; ${migration.sourceMappings.length} seed sources and ${migration.claimMappings.length} cited seed anchors are mapped or rejected in the migration ledger.`);
lines.push(`- The 63-record adjacent census is quota-bounded and cutoff-locked. A separate post-cutoff discovery register reconciles ${supplemental.reconciliation.inputCount} inputs into ${supplemental.reconciliation.addCount} additions, ${supplemental.reconciliation.mergeCount} core merges, and ${supplemental.reconciliation.unresolvedCount} unresolved lead without altering core scores or quotas.`);
lines.push(`- A second post-cutoff discovery register (completeness sweep) adds ${supplemental2.reconciliation.addCount} further entities from ${supplemental2.reconciliation.inputCount} verified sweep inputs, also without altering core scores or quotas.`);
lines.push("- An official offer page proves only that an offer was advertised, not adoption, efficacy, revenue, or active legal status.");
lines.push("");

lines.push("## Highest-signal market findings");
lines.push("");
for (const claimId of [
  "clm_analysis-history-human-task-api",
  "clm_analysis-history-interactive-benchmarks",
  "clm_rl-environments-boundary",
  "clm_analysis-gtm-paid-pilot",
  "clm_analysis-metric-conflation",
  "clm_model-vertical-domain-assurance-pack",
]) {
  lines.push(`- ${renderClaim(claimId)}`);
}
lines.push("");

lines.push("## Industry taxonomy and boundaries");
lines.push("");
lines.push("| Industry | Kind | Value-chain stage | Definition | Boundary | Buyer-evidence rule |");
lines.push("| --- | --- | --- | --- | --- | --- |");
for (const industry of corpus.industries) {
  lines.push(`| ${escape(industry.name)} | ${label(industry.kind)} | ${label(industry.valueChainStage)} | ${renderClaim(industry.definitionClaimId)} | ${industry.boundaryClaimIds.map(renderClaim).join("<br>")} | ${industry.buyerClaimIds.map(renderClaim).join("<br>")} |`);
}
lines.push("");

lines.push("## Value-chain edges");
lines.push("");
for (const edge of corpus.marketAnalysis.filter((analysis) => analysis.analysisType === "value_chain_edge")) {
  const from = corpus.industries.find((industry) => industry.industryId === edge.fromIndustryId)?.name;
  const to = corpus.industries.find((industry) => industry.industryId === edge.toIndustryId)?.name;
  lines.push(`- **${escape(from)} → ${escape(to)}:** ${edge.claimIds.map(renderClaim).join(" ")}`);
}
lines.push("");

lines.push("## Market history");
lines.push("");
for (const event of corpus.marketAnalysis.filter((analysis) => analysis.analysisType === "history_event")) {
  lines.push(`- **${event.date}:** ${event.claimIds.map(renderClaim).join(" ")}`);
}
lines.push("");

lines.push("## Named-company dossiers");
lines.push("");
const groupLabels = {
  origin: "Origin",
  initialWedge: "Initial wedge",
  evolution: "Evolution",
  currentOffer: "Current advertised offer",
  buyers: "Buyer evidence",
  gtm: "Go-to-market",
  operatingModel: "Operating model",
  economics: "Economics",
  milestones: "Milestones",
  risks: "Risks",
  currentStatus: "Current status",
  contradictions: "Contradictions",
  unknowns: "Unknowns",
};
for (const company of corpus.companies) {
  lines.push(`### ${escape(company.name)}`);
  lines.push("");
  lines.push(`- **Identity:** ${renderClaim(company.identityClaimId)}`);
  lines.push(`- **Corpus classification:** ${company.claimGroups.currentOffer.slice(1).map(renderClaim).join(" ")}`);
  lines.push("");
  for (const [group, title] of Object.entries(groupLabels)) {
    const claimIds = company.claimGroups[group];
    if (claimIds.length === 0) continue;
    lines.push(`- **${title}:** ${claimIds.map(renderClaim).join(" ")}`);
  }
  lines.push("");
}

lines.push("## Buyer evidence ledger");
lines.push("");
lines.push("| Subject | Buyer | Buyer type | Motion | Evidence state | Claims |");
lines.push("| --- | --- | --- | --- | --- | --- |");
for (const record of corpus.buyerEvidence) {
  const subject = corpus.companies.find((company) => company.companyId === record.companyId)?.name ?? corpus.adjacent.find((item) => item.adjacentId === record.adjacentId)?.name;
  lines.push(`| ${escape(subject)} | ${escape(record.buyerName ?? "undisclosed")} | ${label(record.buyerType)} | ${label(record.motion)} | ${label(record.evidenceState)} | ${record.claimIds.map(renderClaim).join("<br>")} |`);
}
lines.push("");

lines.push("## GTM motion");
lines.push("");
for (const motion of corpus.marketAnalysis.filter((analysis) => analysis.analysisType === "gtm_motion").sort((a, b) => a.stageOrder - b.stageOrder)) {
  lines.push(`${motion.stageOrder}. **${escape(motion.name)}:** ${motion.claimIds.map(renderClaim).join(" ")}`);
}
lines.push("");

lines.push("## Seven operating models");
lines.push("");
lines.push("| Business model | Formula | Comparable unit | Evidence-backed interpretation |");
lines.push("| --- | --- | --- | --- |");
for (const modelId of BUSINESS_MODELS) {
  const model = corpus.marketAnalysis.find((analysis) => analysis.analysisType === "economic_model" && analysis.businessModelId === modelId);
  lines.push(`| ${label(model.businessModelId)} | \`${escape(model.formula)}\` | ${escape(model.comparabilityClass)} | ${model.inputClaimIds.map(renderClaim).join("<br>")} |`);
}
lines.push("");

lines.push("## Bounded adjacent-company census");
lines.push("");
for (const segment of SEGMENTS) {
  const records = corpus.adjacent.filter((record) => record.primarySegment === segment);
  lines.push(`### ${label(segment)} (${records.length})`);
  lines.push("");
  lines.push("| Entity | Models | Inclusion | Current advertised offer | Independent status |");
  lines.push("| --- | --- | --- | --- | --- |");
  for (const record of records) {
    lines.push(`| [${escape(record.name)}](${markdownUrl(record.canonicalDomain)}) | ${record.businessModelIds.map(label).join(", ")} | ${renderClaim(record.inclusionClaimId)} | ${renderClaim(record.currentOfferClaimId)} | ${renderClaim(record.currentStatusClaimId)} |`);
  }
  lines.push("");
}

lines.push("## Post-cutoff supplemental discovery register");
lines.push("");
lines.push("> Observed 2026-07-12, after the 2026-07-11 evidence cutoff. These entries are not cutoff-current claims and remain outside the canonical claim graph until exact locators are captured.");
lines.push("");
lines.push("| Entity | Kind | Segment | Temporal treatment | Status | Candidate evidence | Canonical ready | ");
lines.push("| --- | --- | --- | --- | --- | --- | --- |");
for (const record of supplemental.records) {
  const source = record.sourceCandidates[0];
  const observation = record.observationCandidates[0];
  lines.push(`| [${escape(record.name)}](${markdownUrl(record.canonicalDomain)}) | ${label(record.entityKind)} | ${label(record.primarySegment)} | ${label(record.cutoffTreatment)} | ${label(record.entityStatus)} | [${escape(source.title)}](${markdownUrl(source.canonicalUrl)}): “${escape(observation.excerpt)}” | ${observation.canonicalReady ? "yes" : "no"} |`);
}
lines.push("");
lines.push(`Core merges: ${supplemental.duplicateInputs.map((record) => `${escape(record.input)} → ${record.mergeInto}`).join("; ")}. Unresolved: ${supplemental.unresolved.map((record) => `${escape(record.input)} (${escape(record.reason)})`).join("; ")}.`);
lines.push("");

lines.push("## Post-cutoff supplemental discovery register 2 (completeness sweep)");
lines.push("");
lines.push("> Observed 2026-07-12 via a multi-modal discovery sweep (market maps, YC directory, funding press, competitor adjacency), after the 2026-07-11 evidence cutoff. These entries are not cutoff-current claims and remain outside the canonical claim graph until exact locators are captured.");
lines.push("");
lines.push("| Entity | Kind | Segment | Temporal treatment | Status | Candidate evidence | Canonical ready | ");
lines.push("| --- | --- | --- | --- | --- | --- | --- |");
for (const record of supplemental2.records) {
  const source = record.sourceCandidates[0];
  const observation = record.observationCandidates[0];
  lines.push(`| [${escape(record.name)}](${markdownUrl(record.canonicalDomain)}) | ${label(record.entityKind)} | ${label(record.primarySegment)} | ${label(record.cutoffTreatment)} | ${label(record.entityStatus)} | [${escape(source.title)}](${markdownUrl(source.canonicalUrl)}): “${escape(observation.excerpt)}” | ${observation.canonicalReady ? "yes" : "no"} |`);
}
lines.push("");

lines.push("## Newcomer model countersearch");
lines.push("");
for (const strategy of corpus.strategies.filter((item) => item.strategyType === "strategic_model")) {
  lines.push(`### ${escape(strategy.name)} — ${label(strategy.eligibility)}`);
  lines.push("");
  lines.push(`- Model: ${strategy.modelClaimIds.map(renderClaim).join(" ")}`);
  lines.push(`- Prerequisites: ${strategy.prerequisiteClaimIds.map(renderClaim).join(" ")}`);
  lines.push(`- Kill criteria: ${strategy.killClaimIds.map(renderClaim).join(" ")}`);
  lines.push("");
}

lines.push("## Read-only vertical scorecard");
lines.push("");
lines.push("Weights: pain 20%, willingness to pay 20%, rights access 15%, verifier feasibility 15%, expert supply 10%, freshness 10%, competitive whitespace 10%. Freshness burden and incumbent pressure are inverted before weighting. Missing benefit cells score zero; missing burden or pressure uses effective raw 5 and converted score zero.");
lines.push("");
for (const candidateId of CANDIDATES) {
  const strategy = corpus.strategies.find((item) => item.strategyType === "vertical_candidate" && item.verticalCandidateId === candidateId);
  lines.push(`### ${escape(strategy.name)} — ${strategy.roundedScore.toFixed(1)} / 100 — ${label(strategy.decisionStatus)}`);
  lines.push("");
  lines.push(`Rights blocker: **${strategy.rightsBlocker ? "yes" : "no"}**. Qualification failures: ${strategy.qualificationFailures.map(escape).join(", ")}.`);
  lines.push("");
  lines.push("| Dimension | Observed score | Imputation | Effective raw | Converted | Evidence | Positive receipt | Negative receipt |");
  lines.push("| --- | ---: | --- | ---: | ---: | --- | --- | --- |");
  for (const dimensionId of DIMENSIONS) {
    const cell = strategy.dimensionCells[dimensionId];
    lines.push(`| ${label(dimensionId)} | ${cell.measuredLevel ?? "unknown"} | ${cell.imputation ? "IMPUTED · CONSERVATIVE MISSING" : "none"} | ${cell.effectiveRawLevel} | ${cell.convertedScore} | ${cell.claimIds.length ? cell.claimIds.map(renderClaim).join("<br>") : escape(cell.missingReason)} | [${cell.positiveSearchReceiptId}](#${cell.positiveSearchReceiptId}) | [${cell.negativeSearchReceiptId}](#${cell.negativeSearchReceiptId}) |`);
  }
  lines.push("");
}

lines.push("## Competitor-response matrix");
lines.push("");
lines.push("| Target | Incumbent strength | Vulnerable wedge | Buyer | Entry proof | Likely counter-move | Prerequisites | No-go trigger |");
lines.push("| --- | --- | --- | --- | --- | --- | --- | --- |");
for (const strategy of corpus.strategies.filter((item) => item.strategyType === "competitor_response")) {
  const target = strategy.companyId
    ? corpus.companies.find((company) => company.companyId === strategy.companyId)?.name
    : label(strategy.archetypeId);
  lines.push(`| ${escape(target)} | ${strategy.incumbentStrengthClaimIds.map(renderClaim).join("<br>")} | ${strategy.vulnerableWedgeClaimIds.map(renderClaim).join("<br>")} | ${strategy.buyerClaimIds.map(renderClaim).join("<br>")} | ${strategy.entryProofClaimIds.map(renderClaim).join("<br>")} | ${strategy.likelyCounterMoveClaimIds.map(renderClaim).join("<br>")} | ${strategy.prerequisiteClaimIds.map(renderClaim).join("<br>")} | ${strategy.noGoTriggerClaimIds.map(renderClaim).join("<br>")} |`);
}
lines.push("");

lines.push("## Roadmap and pricing experiments");
lines.push("");
for (const strategy of corpus.strategies.filter((item) => item.strategyType === "roadmap").sort((a, b) => a.order - b.order)) {
  lines.push(`- **${escape(strategy.horizon)}:** ${strategy.actionClaimIds.map(renderClaim).join(" ")} Gate: ${strategy.gateClaimIds.map(renderClaim).join(" ")}`);
}
for (const strategy of corpus.strategies.filter((item) => item.strategyType === "pricing_experiment")) {
  lines.push(`- **${escape(strategy.name)}:** amount **unscored**; unit: ${escape(strategy.unit)}. Hypothesis: ${strategy.hypothesisClaimIds.map(renderClaim).join(" ")} Success: ${strategy.successClaimIds.map(renderClaim).join(" ")} Kill: ${strategy.killClaimIds.map(renderClaim).join(" ")}`);
}
lines.push("");

lines.push("## Strategy research receipt appendix");
lines.push("");
lines.push("Each candidate × dimension has one executed positive and one executed countersearch receipt. Domain classes, exact queries, retained sources, terminal closure, execution date, and cutoff are preserved. `no_public_evidence` reports only the bounded search result and never proves universal absence.");
lines.push("");
for (const receipt of corpus.receipts) {
  lines.push(`<a id="${receipt.id}"></a>`);
  lines.push(`### ${receipt.id}`);
  lines.push("");
  lines.push(`- Cell: ${label(receipt.candidateId)} / ${label(receipt.dimensionId)} / ${receipt.kind}.`);
  lines.push(`- Query template: ${receipt.queries.map((query) => `\`${escape(query)}\``).join("; ")}.`);
  lines.push(`- Domain classes: ${receipt.searchedDomainClasses.map(label).join(", ")}.`);
  lines.push(`- Per-cell execution date and cutoff: ${receipt.searchedAt ?? "not recorded"} / ${receipt.cutoffAt}.`);
  lines.push(`- Closure: **${label(receipt.closure)}**. Finding: ${escape(receipt.findings)}`);
  lines.push(`- Sources: ${sourceLinksForReceipt(receipt)}.`);
  lines.push(`- Observation IDs: ${receipt.observationIds.length ? receipt.observationIds.join(", ") : "none"}. Template hash: \`${receipt.templateHash}\`.`);
  lines.push("");
}

lines.push("## Source registry");
lines.push("");
lines.push("| ID | Source | Publisher | Type | Control | Access | Published | Observed evidence (25-word source budget) |");
lines.push("| --- | --- | --- | --- | --- | --- | --- | --- |");
for (const source of corpus.sources) {
  const observations = corpus.observations.filter((observation) => observation.sourceId === source.sourceId);
  const evidence = renderSourceRegistryEvidence(observations, escape);
  lines.push(`| ${source.sourceId} | [${escape(source.title)}](${markdownUrl(source.canonicalUrl)}) | ${escape(source.publisher)} | ${label(source.sourceType)} | ${label(source.control)} | ${label(source.access)} | ${source.publishedAt ?? "unknown"} | ${evidence.markdown} |`);
}
lines.push("");
lines.push("## Migration and abstention ledger");
lines.push("");
lines.push(`- Immutable seed: \`${migration.rootSeed.seedPath}\`, SHA-256 \`${migration.rootSeed.sha256}\`.`);
lines.push(`- Seed sources: ${migration.summary.mappedSeedSourceCount}/${migration.summary.seedSourceCount} mapped.`);
lines.push(`- Seed line dispositions: ${migration.summary.mappedSeedClaimAnchorCount} mapped to semantically equivalent canonical claims; ${migration.summary.rejectedSeedClaimAnchorCount} preserved only as non-atomic provenance, strategy hypothesis, out-of-scope material, or another explicit non-mapping disposition.`);
lines.push(`- Open research leads: ${migration.summary.openLeadCount}. Unknown private margins, concentration, contract terms, and unclosed transactions remain explicitly unknown rather than imputed.`);
lines.push("");

const rendered = `${lines.join("\n")}\n`;
if (args.has("--check")) {
  const current = readFileSync(outputPath, "utf8");
  if (current !== rendered) {
    console.error("SYNTHESIS_DRIFT: research/synthesis/SYNTHESIS.md differs from canonical corpus output");
    process.exitCode = 1;
  } else {
    console.log(`SYNTHESIS_OK bytes=${Buffer.byteLength(rendered)} receipts=${corpus.receipts.length} sources=${corpus.sources.length}`);
  }
} else {
  writeFileSync(outputPath, rendered, "utf8");
  console.log(`SYNTHESIS_WRITTEN bytes=${Buffer.byteLength(rendered)} path=${outputPath}`);
}
