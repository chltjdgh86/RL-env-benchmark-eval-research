#!/usr/bin/env node

import { createHash } from "node:crypto";
import { readFileSync, readdirSync, writeFileSync } from "node:fs";
import { basename, dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

import { evaluateVerticalCandidates } from "./strategy-qualification.mjs";

const HERE = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(HERE, "../..");
const RESEARCH = join(ROOT, "research");
const CORPUS = join(RESEARCH, "corpus");
const CUTOFF = "2026-07-11";
const SEARCH_EXECUTION_DATE = "2026-07-12";
const exaStrategyManifest = JSON.parse(readFileSync(join(RESEARCH, "migrations/exa-strategy-evidence.json"), "utf8"));
const ROOT_POINTER = `# Research synthesis moved

This file is a claim-free deprecation pointer.

Canonical generated research: [\`research/synthesis/SYNTHESIS.md\`](research/synthesis/SYNTHESIS.md)

Provenance seed: [\`research/seeds/SYNTHESIS.pre-canonical.md\`](research/seeds/SYNTHESIS.pre-canonical.md)
`;

const sha256 = (value) => createHash("sha256").update(value).digest("hex");
const slug = (value) =>
  value
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
const unique = (values) => [...new Set(values)];
const writeJson = (path, value) =>
  writeFileSync(path, `${JSON.stringify(value, null, 2)}\n`, "utf8");

const sourceTypeValues = [
  "regulatory_record",
  "procurement_record",
  "buyer_first_party",
  "company_first_party",
  "technical_artifact",
  "academic_primary",
  "repository_primary",
  "independent_reporting",
  "investor_first_party",
  "partner_first_party",
  "secondary_aggregator",
  "other",
];
const segmentValues = [
  "training_data_workforce",
  "expert_talent_network",
  "environment_computer_use_runtime",
  "eval_observability_assurance",
  "post_training_rl_infrastructure",
  "agent_ax_services",
  "incumbent_bpo_consulting",
];
const businessModelValues = [
  "managed_data_bpo",
  "expert_marketplace",
  "employee_bpo",
  "expert_environment_services",
  "eval_observability_saas",
  "runtime_infrastructure",
  "proprietary_data_acquisition",
];
const candidateValues = [
  "regulated_financial_operations",
  "insurance_operations",
  "healthcare_administration",
  "enterprise_software_support",
  "public_sector_administration",
];
const dimensionValues = [
  "pain",
  "willingnessToPay",
  "rightsAccess",
  "verifierFeasibility",
  "expertSupply",
  "freshnessBurden",
  "incumbentPressure",
];
const ELIGIBLE_SCORE_SOURCE_TYPES = new Set([
  "regulatory_record",
  "procurement_record",
  "academic_primary",
  "independent_reporting",
]);
const modelValues = [
  "vertical_domain_assurance_pack",
  "specialist_independent_eval_lab",
  "environment_foundry",
  "ax_transformation_studio",
];
const archetypeValues = [
  "managed_data_bpo",
  "expert_workforce_marketplace",
  "environment_foundry_gym",
  "eval_observability_saas",
  "independent_assurance_lab",
  "post_training_runtime_infrastructure",
  "ax_transformation_consultancy",
];

const companySeeds = [
  {
    companyId: "co_scale-ai",
    name: "Scale AI",
    aliases: ["Scale"],
    domain: "https://scale.com",
    primarySegment: "training_data_workforce",
    businessModelIds: ["managed_data_bpo", "expert_environment_services", "proprietary_data_acquisition"],
    industryIds: ["ind_expert-data-operations", "ind_rlhf", "ind_rl-environments", "ind_evaluations-assurance"],
    sourceIds: ["src_s01", "src_s03"],
    riskSourceIds: ["src_s04", "src_s06", "src_s07"],
    origin: "Scale launched in 2016 as an API for on-demand human work.",
    wedge: "Its early wedge was managed data work, including perception-labeling programs.",
    evolution: "Its public offer expanded from data operations into post-training, evaluation, environments, and applied AI.",
    offer: "Scale's official site advertises managed data, model evaluation, and RL environment services.",
    buyers: "Scale describes frontier laboratories, public-sector programs, and large enterprises as buyer groups.",
    risk: "The corpus separates Meta's minority investment from an acquisition and preserves conflicting 2025 revenue reports.",
    milestone: "Meta reported a $13.8 billion minority investment without control or significant influence.",
  },
  {
    companyId: "co_mercor",
    name: "Mercor",
    aliases: [],
    domain: "https://www.mercor.com",
    primarySegment: "expert_talent_network",
    businessModelIds: ["expert_marketplace", "managed_data_bpo", "expert_environment_services"],
    industryIds: ["ind_expert-data-operations", "ind_rlhf", "ind_rl-environments", "ind_evaluations-assurance"],
    sourceIds: ["src_s08", "src_s09"],
    riskSourceIds: ["src_s11", "src_s12", "src_s13", "src_s14"],
    origin: "Mercor launched in 2023 as an automated recruiting and matching marketplace.",
    wedge: "Its first wedge combined AI interviews, matching, contracting, and payments for cross-border talent.",
    evolution: "The recruiting supply system expanded into expert data, evaluation, agent work, and announced environment capabilities.",
    offer: "Mercor's official surface advertises Work, Hire, Evaluate, and Build services.",
    buyers: "Mercor advertises frontier-model teams and enterprises as buyers of expert work and evaluation programs.",
    risk: "Mercor's annualized marketplace volume is not treated as SaaS ARR, and the Deeptune transaction remains announced rather than closed.",
    milestone: "Mercor announced on 2026-07-09 that it will acquire Deeptune without disclosing price or legal close.",
  },
  {
    companyId: "co_micro1",
    name: "Micro1",
    aliases: ["micro1"],
    domain: "https://www.micro1.ai",
    primarySegment: "training_data_workforce",
    businessModelIds: ["managed_data_bpo", "expert_marketplace", "expert_environment_services"],
    industryIds: ["ind_expert-data-operations", "ind_rlhf", "ind_rl-environments", "ind_computer-use", "ind_evaluations-assurance"],
    sourceIds: ["src_s15", "src_s16", "src_s17", "src_s18", "src_s19"],
    riskSourceIds: ["src_s15"],
    origin: "Micro1 began in 2022 around AI-vetted recruiting and managed remote talent.",
    wedge: "Its Zara interview system supported expert screening and talent operations.",
    evolution: "Micro1 shifted its public positioning toward expert data, contextual evaluation, RL environments, and robotics data.",
    offer: "Micro1's official site advertises Realm, Cortex, Robotics, and expert-data programs.",
    buyers: "Micro1 advertises frontier laboratories, enterprise AI teams, and robotics teams as buyer categories.",
    risk: "Later valuation and run-rate reports are not treated as closed financing or audited revenue in this corpus.",
    milestone: "Micro1 announced a $35 million Series A at a $500 million valuation.",
  },
  {
    companyId: "co_turing",
    name: "Turing",
    aliases: ["Turing.com"],
    domain: "https://www.turing.com",
    primarySegment: "training_data_workforce",
    businessModelIds: ["expert_marketplace", "managed_data_bpo", "expert_environment_services", "proprietary_data_acquisition"],
    industryIds: ["ind_expert-data-operations", "ind_rlhf", "ind_rl-environments", "ind_evaluations-assurance", "ind_ax"],
    sourceIds: ["src_s20", "src_s21", "src_s22", "src_s23", "src_s24"],
    riskSourceIds: ["src_s22"],
    origin: "Turing was founded in 2018 as a global developer talent cloud.",
    wedge: "Its initial wedge was remote developer screening, matching, and staffing.",
    evolution: "Turing expanded into frontier data packs, RL environments, benchmarks, proprietary asset acquisition, and enterprise AI services.",
    offer: "Turing's official site advertises data packs, RL environments, research programs, and enterprise AI delivery.",
    buyers: "Turing describes frontier laboratories and enterprise AI programs as buyer groups.",
    risk: "Turing's private run-rate, profitability, environment-count, and network-size claims remain vendor-reported.",
    milestone: "Turing's public chronology identifies a model-training expansion after its talent-cloud origin.",
  },
  {
    companyId: "co_afterquery",
    name: "AfterQuery",
    aliases: ["After Query"],
    domain: "https://www.afterquery.com",
    primarySegment: "expert_talent_network",
    businessModelIds: ["managed_data_bpo", "expert_environment_services", "proprietary_data_acquisition"],
    industryIds: ["ind_expert-data-operations", "ind_rlhf", "ind_rlvr", "ind_rl-environments", "ind_computer-use"],
    sourceIds: ["src_s25", "src_s26", "src_s27"],
    riskSourceIds: ["src_s27", "src_s28"],
    origin: "AfterQuery is the Y Combinator W25 company operating at afterquery.com.",
    wedge: "Its first public wedge was expert-created data and difficult professional tasks for model development.",
    evolution: "AfterQuery expanded into reasoning traces, rubrics, environments, computer-use trajectories, and forward-deployed delivery.",
    offer: "AfterQuery's official site advertises expert data, evaluations, and agent environment programs.",
    buyers: "AfterQuery describes frontier laboratories and professional-work enterprises as buyers.",
    risk: "The $100 million run-rate, broad lab adoption, and expert-network totals remain unaudited vendor claims.",
    milestone: "AfterQuery announced a $30 million Series A on 2026-04-09.",
  },
  {
    companyId: "co_fleet-ai",
    name: "Fleet AI",
    aliases: ["Fleet", "Fleet Context"],
    domain: "https://www.fleetai.com",
    primarySegment: "environment_computer_use_runtime",
    businessModelIds: ["expert_environment_services", "runtime_infrastructure"],
    industryIds: ["ind_rl-environments", "ind_computer-use", "ind_evaluations-assurance"],
    sourceIds: ["src_s29", "src_s30", "src_s72"],
    riskSourceIds: ["src_s30"],
    origin: "Fleet Context appeared in 2023 as a package and retrieval tool for current software-library knowledge.",
    wedge: "Its initial public wedge was developer context and retrieval infrastructure.",
    evolution: "Fleet's public positioning evolved toward bespoke agents and high-fidelity training gyms.",
    offer: "Fleet AI's official site advertises training gyms for agents performing real work.",
    buyers: "Fleet describes laboratories, hyperscalers, and enterprises as buyer categories.",
    risk: "Reported financing, valuation, revenue growth, and named production customers remain unconfirmed in primary public evidence.",
    milestone: "The Fleet Context package history provides a dated artifact for the company's earlier developer-tool phase.",
  },
  {
    companyId: "co_deeptune",
    name: "Deeptune",
    aliases: [],
    domain: "https://deeptune.com",
    primarySegment: "environment_computer_use_runtime",
    businessModelIds: ["expert_environment_services", "runtime_infrastructure"],
    industryIds: ["ind_rlvr", "ind_rl-environments", "ind_computer-use"],
    sourceIds: ["src_s32", "src_s33"],
    riskSourceIds: ["src_s13", "src_s32", "src_s33"],
    origin: "Deeptune was founded by Tim Lupo and Lukas Schmit and initially worked on AI dubbing.",
    wedge: "Its early wedge was an AI dubbing product before the company pivoted.",
    evolution: "Deeptune pivoted toward high-fidelity code and computer-use training gyms.",
    offer: "Deeptune's official site advertises bespoke training and evaluation environments.",
    buyers: "Deeptune describes frontier laboratories and enterprises as buyer categories.",
    risk: "Mercor's announced acquisition has no disclosed price or verified legal close at the cutoff.",
    milestone: "Deeptune and a16z announced a $43 million Series A led by a16z in March 2026.",
  },
  {
    companyId: "co_refresh",
    name: "Refresh",
    aliases: ["Operative AI", "Operative"],
    domain: "https://refresh.dev",
    primarySegment: "environment_computer_use_runtime",
    businessModelIds: ["expert_environment_services", "runtime_infrastructure"],
    industryIds: ["ind_rlvr", "ind_rl-environments", "ind_computer-use"],
    sourceIds: ["src_s34", "src_s35"],
    riskSourceIds: ["src_s35"],
    origin: "Refresh is the current brand associated with Operative AI, Inc. and Y Combinator S25.",
    wedge: "The team's earlier public wedge was browser-agent testing for coding-agent changes.",
    evolution: "Refresh narrowed toward coding, MCP-tool, and computer-use simulation environments.",
    offer: "Refresh's official site advertises software worlds with tasks and verifiable rewards.",
    buyers: "Refresh describes frontier laboratories and enterprises evaluating agents as buyer groups.",
    risk: "Commercial traction, pricing, and financing beyond accelerator participation remain sparsely disclosed.",
    milestone: "Y Combinator lists Refresh as an active Spring 2025 company.",
  },
  {
    companyId: "co_vibrant-labs",
    name: "Vibrant Labs",
    aliases: ["Exploding Gradients", "Ragas"],
    domain: "https://vibrantlabs.com",
    primarySegment: "eval_observability_assurance",
    businessModelIds: ["eval_observability_saas", "expert_environment_services"],
    industryIds: ["ind_rlvr", "ind_rl-environments", "ind_evaluations-assurance"],
    sourceIds: ["src_s36", "src_s73"],
    riskSourceIds: ["src_s73"],
    origin: "Vibrant Labs grew from the Ragas open-source evaluation project.",
    wedge: "Its initial wedge was open-source evaluation tooling for retrieval-augmented systems.",
    evolution: "Vibrant Labs expanded into hard-task mining, adaptive environments, and verifier design.",
    offer: "Vibrant Labs' official research surface advertises autonomous RL data and adaptive environment work.",
    buyers: "Vibrant Labs describes AI laboratories and agent teams as buyer categories.",
    risk: "Broad adoption and enterprise-scale claims remain primarily vendor-supplied.",
    milestone: "The hard-task-mining research artifact documents the shift from evaluation tooling to environment generation.",
  },
  {
    companyId: "co_halluminate",
    name: "Halluminate",
    aliases: [],
    domain: "https://www.halluminate.ai",
    primarySegment: "environment_computer_use_runtime",
    businessModelIds: ["expert_marketplace", "expert_environment_services"],
    industryIds: ["ind_rlvr", "ind_rl-environments", "ind_computer-use", "ind_evaluations-assurance"],
    sourceIds: ["src_s37", "src_s68", "src_s75"],
    riskSourceIds: ["src_s37"],
    origin: "Halluminate was founded in 2024 and published early evaluation and browser-agent artifacts.",
    wedge: "Its initial wedge used public browser and API evaluations to establish technical credibility.",
    evolution: "Halluminate moved into task simulators and finance-focused RL environments.",
    offer: "Halluminate's official site advertises RL environments for financial-services workflows.",
    buyers: "Halluminate describes laboratories building professional agents as buyer groups.",
    risk: "Funding, frontier-lab customers, pricing, and margins remain undisclosed beyond published expert rates.",
    milestone: "Halluminate's Westworld work with Yutori demonstrated state-based task simulators.",
  },
];

const adjacentSeeds = [
  ["Appen", "https://www.appen.com", "training_data_workforce", ["managed_data_bpo", "employee_bpo"]],
  ["TELUS Digital AI Data Solutions", "https://www.telusdigital.com/solutions/ai-data-solutions", "training_data_workforce", ["managed_data_bpo", "employee_bpo"]],
  ["Sama", "https://www.sama.com", "training_data_workforce", ["managed_data_bpo", "employee_bpo"]],
  ["iMerit", "https://imerit.net", "training_data_workforce", ["managed_data_bpo", "employee_bpo"]],
  ["CloudFactory", "https://www.cloudfactory.com", "training_data_workforce", ["managed_data_bpo", "employee_bpo"]],
  ["Surge AI", "https://www.surgehq.ai", "training_data_workforce", ["managed_data_bpo"]],
  ["Labelbox", "https://labelbox.com", "training_data_workforce", ["managed_data_bpo", "eval_observability_saas"]],
  ["Toloka", "https://toloka.ai", "training_data_workforce", ["managed_data_bpo", "expert_marketplace"]],
  ["DataAnnotation", "https://www.dataannotation.tech", "training_data_workforce", ["expert_marketplace", "managed_data_bpo"]],

  ["Prolific", "https://www.prolific.com", "expert_talent_network", ["expert_marketplace"]],
  ["Handshake", "https://joinhandshake.com", "expert_talent_network", ["expert_marketplace", "proprietary_data_acquisition"]],
  ["Invisible Technologies", "https://www.invisible.co", "expert_talent_network", ["managed_data_bpo", "expert_marketplace"]],
  ["Outlier", "https://outlier.ai", "expert_talent_network", ["expert_marketplace", "managed_data_bpo"]],
  ["Alignerr", "https://www.alignerr.com", "expert_talent_network", ["expert_marketplace", "managed_data_bpo"]],
  ["Mindrift", "https://mindrift.ai", "expert_talent_network", ["expert_marketplace"]],
  ["G2i", "https://www.g2i.co", "expert_talent_network", ["expert_marketplace"]],
  ["Catalant", "https://gocatalant.com", "expert_talent_network", ["expert_marketplace"]],
  ["GLG", "https://glginsights.com", "expert_talent_network", ["expert_marketplace"]],

  ["Browserbase", "https://www.browserbase.com", "environment_computer_use_runtime", ["runtime_infrastructure"]],
  ["E2B", "https://e2b.dev", "environment_computer_use_runtime", ["runtime_infrastructure"]],
  ["Daytona", "https://www.daytona.io", "environment_computer_use_runtime", ["runtime_infrastructure"]],
  ["Modal", "https://modal.com", "environment_computer_use_runtime", ["runtime_infrastructure"]],
  ["Prime Intellect", "https://www.primeintellect.ai", "environment_computer_use_runtime", ["runtime_infrastructure", "expert_environment_services"]],
  ["Steel", "https://steel.dev", "environment_computer_use_runtime", ["runtime_infrastructure"]],
  ["Browser Use", "https://browser-use.com", "environment_computer_use_runtime", ["runtime_infrastructure"]],
  ["Kernel", "https://onkernel.com", "environment_computer_use_runtime", ["runtime_infrastructure"]],
  ["Scrapybara", "https://scrapybara.com", "environment_computer_use_runtime", ["runtime_infrastructure"]],

  ["LangSmith", "https://www.langchain.com/langsmith", "eval_observability_assurance", ["eval_observability_saas"]],
  ["Braintrust", "https://www.braintrust.dev", "eval_observability_assurance", ["eval_observability_saas"]],
  ["Arize AI", "https://arize.com", "eval_observability_assurance", ["eval_observability_saas"]],
  ["Langfuse", "https://langfuse.com", "eval_observability_assurance", ["eval_observability_saas"]],
  ["Patronus AI", "https://www.patronus.ai", "eval_observability_assurance", ["eval_observability_saas"]],
  ["Giskard", "https://www.giskard.ai", "eval_observability_assurance", ["eval_observability_saas"]],
  ["Galileo", "https://galileo.ai", "eval_observability_assurance", ["eval_observability_saas"]],
  ["Confident AI", "https://www.confident-ai.com", "eval_observability_assurance", ["eval_observability_saas"]],
  ["Maxim AI", "https://www.getmaxim.ai", "eval_observability_assurance", ["eval_observability_saas"]],

  ["NVIDIA NeMo", "https://www.nvidia.com/en-us/ai-data-science/products/nemo", "post_training_rl_infrastructure", ["runtime_infrastructure"]],
  ["Amazon Bedrock AgentCore", "https://aws.amazon.com/bedrock/agentcore", "post_training_rl_infrastructure", ["runtime_infrastructure"]],
  ["Google Vertex AI", "https://cloud.google.com/vertex-ai", "post_training_rl_infrastructure", ["runtime_infrastructure"]],
  ["Microsoft Azure AI Foundry", "https://azure.microsoft.com/en-us/products/ai-foundry", "post_training_rl_infrastructure", ["runtime_infrastructure"]],
  ["Together AI", "https://www.together.ai", "post_training_rl_infrastructure", ["runtime_infrastructure"]],
  ["Fireworks AI", "https://fireworks.ai", "post_training_rl_infrastructure", ["runtime_infrastructure"]],
  ["Anyscale", "https://www.anyscale.com", "post_training_rl_infrastructure", ["runtime_infrastructure"]],
  ["Predibase", "https://predibase.com", "post_training_rl_infrastructure", ["runtime_infrastructure"]],
  ["OpenPipe", "https://openpipe.ai", "post_training_rl_infrastructure", ["runtime_infrastructure"]],

  ["Accenture", "https://www.accenture.com/us-en/services/data-ai/generative-ai", "agent_ax_services", ["expert_environment_services", "managed_data_bpo"]],
  ["Deloitte", "https://www.deloitte.com/global/en/services/consulting/services/generative-ai.html", "agent_ax_services", ["expert_environment_services"]],
  ["PwC", "https://www.pwc.com/gx/en/issues/data-and-analytics/artificial-intelligence.html", "agent_ax_services", ["expert_environment_services"]],
  ["QuantumBlack, AI by McKinsey", "https://www.mckinsey.com/capabilities/quantumblack/how-we-help-clients", "agent_ax_services", ["expert_environment_services"]],
  ["BCG X", "https://www.bcg.com/x", "agent_ax_services", ["expert_environment_services"]],
  ["IBM Consulting", "https://www.ibm.com/consulting/artificial-intelligence", "agent_ax_services", ["expert_environment_services", "managed_data_bpo"]],
  ["Slalom", "https://www.slalom.com/us/en/services/artificial-intelligence", "agent_ax_services", ["expert_environment_services"]],
  ["Thoughtworks", "https://www.thoughtworks.com/what-we-do/ai", "agent_ax_services", ["expert_environment_services"]],
  ["Palantir", "https://www.palantir.com/platforms/aip", "agent_ax_services", ["expert_environment_services", "runtime_infrastructure"]],

  ["TaskUs", "https://www.taskus.com", "incumbent_bpo_consulting", ["employee_bpo", "managed_data_bpo"]],
  ["Concentrix", "https://www.concentrix.com", "incumbent_bpo_consulting", ["employee_bpo", "managed_data_bpo"]],
  ["Genpact", "https://www.genpact.com/services/data-and-ai", "incumbent_bpo_consulting", ["employee_bpo", "managed_data_bpo"]],
  ["Wipro", "https://www.wipro.com/ai", "incumbent_bpo_consulting", ["employee_bpo", "managed_data_bpo"]],
  ["Cognizant", "https://www.cognizant.com/us/en/services/ai", "incumbent_bpo_consulting", ["employee_bpo", "managed_data_bpo"]],
  ["Teleperformance", "https://www.tp.com", "incumbent_bpo_consulting", ["employee_bpo", "managed_data_bpo"]],
  ["Capgemini", "https://www.capgemini.com/services/data-and-ai", "incumbent_bpo_consulting", ["employee_bpo", "managed_data_bpo"]],
  ["EXL", "https://www.exlservice.com", "incumbent_bpo_consulting", ["employee_bpo", "managed_data_bpo"]],
  ["TTEC", "https://www.ttec.com", "incumbent_bpo_consulting", ["employee_bpo", "managed_data_bpo"]],
];

const industrySeeds = [
  ["ind_rlhf", "RLHF", ["reinforcement learning from human feedback"], "reward_regime", "signal_data", "src_s38"],
  ["ind_rlaif", "RLAIF", ["reinforcement learning from AI feedback"], "reward_regime", "signal_data", "src_s38"],
  ["ind_dpo", "Direct Preference Optimization", ["DPO"], "optimization_method", "post_training", "src_s39"],
  ["ind_rlvr", "RLVR", ["reinforcement learning with verifiable rewards"], "reward_regime", "post_training", "src_s46"],
  ["ind_rl-environments", "RL environments", ["training gyms", "agent environments"], "commercial_layer", "environment", "src_s44"],
  ["ind_computer-use", "Computer use", ["browser use", "computer-use agents"], "commercial_layer", "environment", "src_s41"],
  ["ind_evaluations-assurance", "Evaluations and assurance", ["evals", "AI assurance"], "service_model", "evaluation_assurance", "src_s49"],
  ["ind_ax", "AX consulting", ["agent experience", "agentic transformation"], "ambiguous_term", "transformation", "src_s61"],
  ["ind_expert-data-operations", "Expert data operations", ["training data", "expert data"], "service_model", "signal_data", "src_s52"],
];

const seedPath = join(RESEARCH, "seeds/SYNTHESIS.pre-canonical.md");
const seedText = readFileSync(seedPath, "utf8");
const seedSourcePattern = /^\[S(\d+)\]:\s+(https:\/\/\S+)\s+"([^"]+)"$/gm;
const parsedSeedSources = [...seedText.matchAll(seedSourcePattern)].map((match) => ({
  number: Number(match[1]),
  sourceId: `src_s${match[1].padStart(2, "0")}`,
  canonicalUrl: match[2],
  title: match[3],
}));

if (parsedSeedSources.length !== 77) {
  throw new Error(`Expected 77 seed sources; found ${parsedSeedSources.length}`);
}

const hostMatches = (host, domain) => host === domain || host.endsWith(`.${domain}`);

const publisherFor = (url) => {
  const host = new URL(url).hostname.replace(/^www\./, "");
  const labels = {
    "ycombinator.com": "Y Combinator",
    "sec.gov": "U.S. Securities and Exchange Commission",
    "arxiv.org": "arXiv",
    "gov.uk": "UK Government",
    "find-tender.service.gov.uk": "UK Find a Tender",
    "announcements.asx.com.au": "Australian Securities Exchange",
    "aws.amazon.com": "Amazon Web Services",
    "docs.aws.amazon.com": "Amazon Web Services",
    "cloud.google.com": "Google Cloud",
    "azure.microsoft.com": "Microsoft Azure",
    "research.nvidia.com": "NVIDIA Research",
    "nvidia.com": "NVIDIA",
    "bloomberglaw.com": "Bloomberg Law",
    "forbes.com": "Forbes",
    "wired.com": "WIRED",
    "theinformation.com": "The Information",
    "epoch.ai": "Epoch AI",
    "gartner.com": "Gartner",
    "pypi.org": "Python Package Index",
    "github.com": "GitHub",
    "healthaffairs.org": "Health Affairs",
    "aclanthology.org": "ACL Anthology",
    "doi.org": "DOI Foundation",
  };
  const matchedLabel = Object.entries(labels).find(([domain]) => hostMatches(host, domain));
  return matchedLabel?.[1] ?? host;
};

const classifySource = (url) => {
  const host = new URL(url).hostname.replace(/^www\./, "");
  const lowerUrl = url.toLowerCase();
  if (host === "find-tender.service.gov.uk" || host === "ted.europa.eu" || lowerUrl.includes("requestid=") || lowerUrl.includes("/rfp") || lowerUrl.includes("_rfp") || lowerUrl.includes("/supply-chain/")) return ["procurement_record", "independent", "open"];
  if (host === "sec.gov" || host.endsWith(".gov") || host.endsWith(".gov.au") || host.endsWith(".gov.uk") || host.endsWith(".mil") || host === "gov.uk" || host === "gov.scot" || host === "legislation.gov.uk" || host === "nao.org.uk" || host === "edps.europa.eu" || host === "ia.org.hk" || host === "fca.org.uk" || host === "ico.org.uk" || host === "bis.org") return ["regulatory_record", "independent", "open"];
  if (host === "announcements.asx.com.au") return ["buyer_first_party", "independent", "open"];
  if (["acams.org", "theiia.org", "cfainstitute.org", "ahima.org", "aha.org"].some((domain) => hostMatches(host, domain))) return ["buyer_first_party", "independent", "open"];
  if (["arxiv.org", "healthaffairs.org", "aclanthology.org", "doi.org", "nber.org", "turing.ac.uk", "tobin.yale.edu", "digitalgovernmenthub.org"].some((domain) => hostMatches(host, domain))) return ["academic_primary", "independent", "open"];
  if (host === "pypi.org" || host === "huggingface.co" || host === "github.com") return ["repository_primary", "independent", "open"];
  if (host === "research.nvidia.com") return ["technical_artifact", "independent", "open"];
  const reportingDomain = ["bloomberglaw.com", "forbes.com", "wired.com", "theinformation.com", "epoch.ai", "gartner.com", "ciodive.com", "insurancebusinessmag.com", "claimspages.com", "riskandinsurance.com", "carnegieuk.org", "adalovelaceinstitute.org"].find((domain) => hostMatches(host, domain));
  if (reportingDomain) {
    const access = ["forbes.com", "theinformation.com", "bloomberglaw.com"].includes(reportingDomain) ? "paywalled" : "open";
    return ["independent_reporting", "independent", access];
  }
  if (host === "ycombinator.com" || host === "a16z.com") return ["investor_first_party", "commercially_affiliated", "open"];
  if (host === "primeintellect.ai" || host === "browserbase.com") return ["partner_first_party", "commercially_affiliated", "open"];
  return ["company_first_party", "subject_controlled", "open"];
};

const normalizeOrigin = (url) => {
  const parsed = new URL(url);
  return `${parsed.protocol}//${parsed.host}`;
};

const namedDomainToId = new Map(
  companySeeds.map((company) => [new URL(company.domain).hostname.replace(/^www\./, ""), company.companyId]),
);
const adjacentDomainToId = new Map(
  adjacentSeeds.map(([name, url]) => [new URL(url).hostname.replace(/^www\./, ""), `adj_${slug(name)}`]),
);

const affiliationsFor = (url) => {
  const host = new URL(url).hostname.replace(/^www\./, "");
  const affiliations = [];
  for (const [domain, companyId] of namedDomainToId) {
    if (host === domain || host.endsWith(`.${domain}`)) {
      affiliations.push({ entityRef: companyId, relationship: "subject", validFrom: null, validTo: null });
    }
  }
  for (const [domain, adjacentId] of adjacentDomainToId) {
    if (host === domain || host.endsWith(`.${domain}`)) {
      affiliations.push({ entityRef: adjacentId, relationship: "subject", validFrom: null, validTo: null });
    }
  }
  if (host === "ycombinator.com") {
    const match = companySeeds.find((company) => url.toLowerCase().includes(slug(company.name)));
    if (match) affiliations.push({ entityRef: match.companyId, relationship: "investor", validFrom: null, validTo: null });
  }
  if (host === "a16z.com" && url.includes("deeptune")) {
    affiliations.push({ entityRef: "co_deeptune", relationship: "investor", validFrom: "2026-03-19", validTo: null });
  }
  return affiliations;
};

const semanticLocatorOverrides = {
  src_s12: {
    access: "paywalled",
    locator: { kind: "page", value: "Indexed publisher title — Mercor gross/net economics reporting" },
    excerpt: "Mercor annualized revenue reporting separates gross marketplace volume from retained revenue",
    captureMethod: "search-indexed-publisher-page",
  },
  src_s20: {
    access: "secondary_only",
    locator: { kind: "section", value: "Our story" },
    excerpt: "In 2018 the founders started Turing as an AI-powered technology services company",
    captureMethod: "search-indexed-official-page",
  },
  src_s21: {
    access: "secondary_only",
    locator: { kind: "html_heading", value: "H1 — Improve Real-World Model Reasoning" },
    excerpt: "Turing advertises data packs, structured RL environments, and research-grade benchmarks",
    captureMethod: "search-indexed-official-page",
  },
  src_s22: {
    access: "secondary_only",
    locator: { kind: "html_heading", value: "H1 — Expert RL Environments Built for Frontier Standards" },
    excerpt: "Controlled environments support agent training and evaluation before larger-scale integration",
    captureMethod: "search-indexed-official-page",
  },
  src_s46: {
    access: "unavailable",
    locator: { kind: "page", value: "Transport metadata — HTTP 404" },
    excerpt: "Direct source content returned HTTP 404 at the research cutoff",
    captureMethod: "transport-metadata",
  },
  src_s53: {
    access: "secondary_only",
    locator: { kind: "page", value: "Transport metadata — HTTP 200 application/pdf" },
    excerpt: "Only transport metadata was captured; document contents were not verified at the research cutoff",
    captureMethod: "transport-metadata",
  },
  src_s54: {
    access: "secondary_only",
    locator: { kind: "page", value: "Transport metadata — HTTP 200 cookie-banner chrome" },
    excerpt: "Only cookie-banner chrome was captured; no substantive roadmap body passage was verified",
    captureMethod: "transport-metadata",
  },
  src_s56: {
    access: "secondary_only",
    locator: { kind: "page", value: "Pages 1-7 — AISI Research and Evals Partner for Cyber" },
    excerpt: "The procurement sought a research and evaluations partner for cyber capability work",
    captureMethod: "search-indexed-official-pdf",
  },
  src_s67: {
    access: "unavailable",
    locator: { kind: "page", value: "Transport metadata — HTTP 403" },
    excerpt: "Direct source content was unavailable at the research cutoff",
    captureMethod: "transport-metadata",
  },
  src_s77: {
    access: "unavailable",
    locator: { kind: "page", value: "Transport metadata — HTTP 403" },
    excerpt: "Direct source content was unavailable at the research cutoff",
    captureMethod: "transport-metadata",
  },
  "src_adj-telus-digital-ai-data-solutions": {
    access: "unavailable",
    locator: { kind: "page", value: "Transport metadata — HTTP 403" },
    excerpt: "Direct source content was unavailable at the research cutoff",
    captureMethod: "transport-metadata",
  },
  "src_adj-glg": {
    access: "secondary_only",
    locator: { kind: "html_heading", value: "H1 — GLG" },
    excerpt: "GLG advertises expert-network access and professional insight services",
    captureMethod: "search-indexed-official-page",
  },
  "src_adj-quantumblack-ai-by-mckinsey": {
    access: "secondary_only",
    locator: { kind: "html_heading", value: "H1 — QuantumBlack, AI by McKinsey" },
    excerpt: "QuantumBlack advertises AI transformation and engineering services",
    captureMethod: "search-indexed-official-page",
  },
  "src_adj-ttec": {
    access: "secondary_only",
    locator: { kind: "html_heading", value: "H1 — TTEC" },
    excerpt: "TTEC advertises technology-enabled customer-experience and AI operations services",
    captureMethod: "search-indexed-official-page",
  },
};

const linkOverrides = {
  src_s06: { access: "login_gated", rawResult: "HTTP 200 authentication boundary observed", finalUrl: "https://news.bloomberglaw.com/artificial-intelligence/scale-ai-expects-to-more-than-double-sales-to-2-billion-in-2025" },
  src_s07: { access: "paywalled", rawResult: "HTTP 200 paywall boundary observed", finalUrl: "https://www.forbes.com/sites/richardnieva/2026/05/14/scale-meta-deal/" },
  src_s12: { access: "paywalled", rawResult: "HTTP 200 subscription boundary observed", finalUrl: "https://www.theinformation.com/briefings/exclusive-mercor-hit-1-billion-annualized-revenue-breach" },
  src_s46: { access: "unavailable", rawResult: "HTTP 404 during bounded link audit", finalUrl: "https://docs.primeintellect.ai/verifiers/environments" },
  src_s56: { access: "unavailable", rawResult: "HTTP 403 during bounded link audit; no control bypass attempted", finalUrl: "https://www.find-tender.service.gov.uk/Notice/037042-2025/PDF" },
  src_s67: { access: "login_gated", rawResult: "HTTP 206 authentication boundary observed", finalUrl: "https://www.gartner.com/en/newsroom/press-releases/2025-06-25-gartner-predicts-over-40-percent-of-agentic-ai-projects-will-be-canceled-by-end-of-2027" },
  src_s77: { access: "unavailable", rawResult: "HTTP 403 during bounded link audit; no control bypass attempted", finalUrl: "https://www.find-tender.service.gov.uk/Notice/001340-2025" },
  "src_adj-predibase": { access: "unavailable", rawResult: "HTTP 200 unrelated cross-origin redirect to Rubrik Agent Cloud", finalUrl: "https://www.rubrik.com/products/rubrik-agent-cloud" },
  "src_adj-ttec": { access: "unavailable", rawResult: "HTTP 403 WAF boundary during bounded link audit; no control bypass attempted", finalUrl: "https://www.ttec.com" },
};

const makeSource = ({ sourceId, title, canonicalUrl, publishedAt = null, accessedAt = CUTOFF }) => {
  const [sourceType, classifiedControl, inferredAccess] = classifySource(canonicalUrl);
  const override = linkOverrides[sourceId];
  const access = semanticLocatorOverrides[sourceId]?.access ?? override?.access ?? inferredAccess;
  const publisherAffiliations = affiliationsFor(canonicalUrl);
  const control = publisherAffiliations.some((affiliation) => affiliation.relationship === "subject")
    ? "subject_controlled"
    : classifiedControl;
  return {
    sourceId,
    title,
    publisher: publisherFor(canonicalUrl),
    canonicalUrl,
    archivedUrl: null,
    sourceType,
    control,
    publisherAffiliations,
    publishedAt,
    accessedAt,
    access,
    lastLinkCheck: {
      checkedAt: SEARCH_EXECUTION_DATE,
      rawResult: override?.rawResult ?? (access === "paywalled" ? "Accessible metadata with paywall or subscription boundary" : "Accessible during bounded research pass"),
      finalUrl: override?.finalUrl ?? canonicalUrl,
    },
    accessNotes: ["paywalled", "login_gated", "unavailable", "secondary_only"].includes(access)
      ? "Access limitations are preserved; no control bypass was attempted, and semantic use is correspondingly constrained."
      : null,
  };
};

const sources = parsedSeedSources.map(makeSource);
const sourceByUrl = new Map(sources.map((source) => [source.canonicalUrl, source]));

for (const [name, url] of adjacentSeeds) {
  const existing = sources.find((source) => {
    const existingHost = new URL(source.canonicalUrl).hostname.replace(/^www\./, "");
    const nextHost = new URL(url).hostname.replace(/^www\./, "");
    return existingHost === nextHost;
  });
  if (existing) continue;
  const source = makeSource({
    sourceId: `src_adj-${slug(name)}`,
    title: `${name} official current offer surface`,
    canonicalUrl: url,
  });
  sources.push(source);
  sourceByUrl.set(url, source);
}

const legacySourceIds = new Set(sources.map((source) => source.sourceId));
const exaSourceIdByEvidenceKey = new Map();
for (const evidence of exaStrategyManifest.evidence) {
  let source = sourceByUrl.get(evidence.canonicalUrl);
  if (!source) {
    source = makeSource({
      sourceId: `src_exa-${slug(evidence.evidenceKey)}`,
      title: evidence.title,
      canonicalUrl: evidence.canonicalUrl,
      publishedAt: evidence.publishedAt,
      accessedAt: SEARCH_EXECUTION_DATE,
    });
    sources.push(source);
    sourceByUrl.set(evidence.canonicalUrl, source);
  }
  exaSourceIdByEvidenceKey.set(evidence.evidenceKey, source.sourceId);
}

const sourceById = new Map(sources.map((source) => [source.sourceId, source]));
const locatorSnapshotPath = join(RESEARCH, "migrations/source-locator-snapshots.json");
const locatorSnapshot = JSON.parse(readFileSync(locatorSnapshotPath, "utf8"));
const exaEvidenceBySourceId = new Map(exaStrategyManifest.evidence.map((evidence) => [exaSourceIdByEvidenceKey.get(evidence.evidenceKey), evidence]));
locatorSnapshot.capturedAt = SEARCH_EXECUTION_DATE;
locatorSnapshot.entries = locatorSnapshot.entries.map((entry) => {
  const exaEvidence = exaEvidenceBySourceId.get(entry.sourceId);
  if (exaEvidence) return {
    ...entry,
    status: 200,
    finalUrl: exaEvidence.canonicalUrl,
    locator: exaEvidence.locator,
    excerpt: exaEvidence.excerpt,
    captureMethod: "exa-fetched-exact-excerpt",
    observerGroup: `exa-receipt-${slug(exaEvidence.evidenceKey.split(":")[0])}`,
  };
  const override = semanticLocatorOverrides[entry.sourceId];
  return override
    ? { ...entry, locator: override.locator, excerpt: override.excerpt, captureMethod: override.captureMethod }
    : entry;
});
const snapshotSourceIds = new Set(locatorSnapshot.entries.map((entry) => entry.sourceId));
for (const source of sources) {
  if (snapshotSourceIds.has(source.sourceId)) continue;
  const evidence = exaEvidenceBySourceId.get(source.sourceId);
  if (!evidence) throw new Error(`Missing Exa evidence for new source ${source.sourceId}`);
  locatorSnapshot.entries.push({
    sourceId: source.sourceId,
    canonicalUrl: source.canonicalUrl,
    status: 200,
    finalUrl: source.canonicalUrl,
    locator: evidence.locator,
    excerpt: evidence.excerpt,
    captureMethod: "exa-fetched-exact-excerpt",
    observerGroup: `exa-receipt-${slug(evidence.evidenceKey.split(":")[0])}`,
  });
}
locatorSnapshot.entries.sort((left, right) => left.sourceId.localeCompare(right.sourceId));
writeJson(locatorSnapshotPath, locatorSnapshot);
const locatorBySourceId = new Map(locatorSnapshot.entries.map((entry) => [entry.sourceId, entry]));
if (locatorBySourceId.size !== sources.length) {
  throw new Error(`Expected ${sources.length} source locator snapshots; found ${locatorBySourceId.size}`);
}
const inaccessibleSearchIndexSourceIds = new Set(locatorSnapshot.entries
  .filter((entry) => entry.status >= 400 && String(entry.captureMethod).startsWith("search-indexed-"))
  .map((entry) => entry.sourceId));
const observations = sources.map((source) => ({
  observationId: source.sourceId.replace(/^src_/, "obs_"),
  sourceId: source.sourceId,
  locator: locatorBySourceId.get(source.sourceId).locator,
  excerpt: locatorBySourceId.get(source.sourceId).excerpt,
  observedAt: locatorSnapshot.capturedAt,
  validAt: source.publishedAt,
  observerGroup: locatorBySourceId.get(source.sourceId).observerGroup,
  independenceBasis:
    source.control === "independent"
      ? `Publisher-controlled evidence at ${new URL(source.canonicalUrl).hostname}`
      : `Aligned first-party evidence; not independence-eligible for the subject claim`,
}));
const observationBySourceId = new Map(observations.map((observation) => [observation.sourceId, observation]));

const claims = [];
const eligibleAlignments = new Set(["regulator_authoritative", "academic_independent", "editorial_independent"]);

const affiliationAlignment = Object.freeze({
  subject: "subject_controlled",
  buyer: "buyer_controlled",
  investor: "investor_aligned",
  acquirer: "acquirer_aligned",
  transaction_counterparty: "transaction_counterparty_aligned",
  commercial_partner: "commercial_partner_aligned",
  parent: "acquirer_aligned",
  syndicator: "republication_same_chain",
});
const affiliationPriority = ["subject", "buyer", "acquirer", "transaction_counterparty", "investor", "commercial_partner", "parent", "syndicator"];

const alignmentFor = (source, subjectIds) => {
  if (source.publisherAffiliations.some((affiliation) => affiliation.relationship === "syndicator")) return "republication_same_chain";
  const relevantAffiliation = source.publisherAffiliations
    .filter((affiliation) => subjectIds.includes(affiliation.entityRef))
    .sort((left, right) => affiliationPriority.indexOf(left.relationship) - affiliationPriority.indexOf(right.relationship))[0];
  if (relevantAffiliation) return affiliationAlignment[relevantAffiliation.relationship];
  if (source.sourceType === "regulatory_record" || source.sourceType === "procurement_record") return "regulator_authoritative";
  if (source.sourceType === "academic_primary") return "academic_independent";
  if (source.sourceType === "independent_reporting") return "editorial_independent";
  if (source.sourceType === "buyer_first_party" || source.sourceType === "technical_artifact") return "buyer_controlled";
  if (source.sourceType === "investor_first_party") return "investor_aligned";
  if (source.sourceType === "partner_first_party") return "commercial_partner_aligned";
  return "subject_controlled";
};
const independenceGroupFor = (source) => {
  const syndicator = source.publisherAffiliations.find((affiliation) => affiliation.relationship === "syndicator");
  const chainSource = sourceById.get(syndicator?.entityRef) ?? source;
  if (chainSource.sourceType === "academic_primary") return `academic-work:${new URL(chainSource.canonicalUrl).href}`;
  return `source-chain:${slug(chainSource.publisher)}`;
};

const makeClaim = ({
  claimId,
  statement,
  subjectIds,
  themes,
  kind = "observation",
  confidence = "medium",
  temporal = "current",
  risk = "routine",
  sourceIds,
  relations = [],
  contradictionClaimIds = [],
  singleSourceException = null,
  section = "companies",
}) => {
  let evidenceLinks = sourceIds.map((sourceId, index) => {
    const source = sourceById.get(sourceId);
    if (!source) throw new Error(`Unknown source while constructing ${claimId}: ${sourceId}`);
    const claimAlignment = relations[index]?.claimAlignment ?? alignmentFor(source, subjectIds);
    const supportRelation = sourceId === "src_s47" || ["unavailable", "secondary_only"].includes(source.access) || semanticLocatorOverrides[sourceId]?.captureMethod === "transport-metadata" || inaccessibleSearchIndexSourceIds.has(sourceId)
      ? "context_only"
      : relations[index]?.supportRelation ?? "supports";
    return {
      observationId: observationBySourceId.get(sourceId).observationId,
      sourceId,
      supportRelation,
      claimAlignment,
      independenceGroup: relations[index]?.independenceGroup ?? independenceGroupFor(source),
    };
  });
  const hasConservativelyDegradedSource = evidenceLinks.some((link) =>
    link.sourceId === "src_s47" || ["unavailable", "secondary_only"].includes(sourceById.get(link.sourceId)?.access) || inaccessibleSearchIndexSourceIds.has(link.sourceId),
  );
  if (risk === "high_risk" && singleSourceException === null && hasConservativelyDegradedSource) {
    const positiveLinks = evidenceLinks.filter((link) => ["supports", "partially_supports"].includes(link.supportRelation));
    const eligibleGroups = new Set(positiveLinks.filter((link) => eligibleAlignments.has(link.claimAlignment)).map((link) => link.independenceGroup));
    const hasPrimary = positiveLinks.some((link) => ["regulatory_record", "procurement_record", "buyer_first_party", "company_first_party", "technical_artifact", "academic_primary", "repository_primary"].includes(sourceById.get(link.sourceId)?.sourceType));
    const independentEnough = eligibleGroups.size >= 2 || (hasPrimary && eligibleGroups.size >= 1);
    const currentEnough = temporal !== "current" || positiveLinks.some((link) => sourceById.get(link.sourceId)?.access === "open");
    if (!independentEnough || !currentEnough) evidenceLinks = evidenceLinks.map((link) => ({ ...link, supportRelation: "context_only" }));
  }
  const independentGroupCount = new Set(
    evidenceLinks
      .filter((link) => eligibleAlignments.has(link.claimAlignment) && ["supports", "partially_supports"].includes(link.supportRelation))
      .map((link) => link.independenceGroup),
  ).size;
  const claim = {
    claimId,
    statement,
    subjectIds: unique(subjectIds),
    themes: unique(themes),
    kind,
    confidence,
    temporal,
    risk,
    evidenceLinks,
    contradictionClaimIds: unique(contradictionClaimIds),
    independentGroupCount,
    singleSourceException,
    canonicalHash: `#/${section}?claim=${encodeURIComponent(claimId)}`,
  };
  claims.push(claim);
  return claim.claimId;
};

const claimGroupsForCompany = new Map();
const buyers = [];
const milestoneSources = {
  "co_scale-ai": ["src_s04"],
  co_mercor: ["src_s13"],
  co_micro1: ["src_s15"],
  co_turing: ["src_s20"],
  co_afterquery: ["src_s27"],
  "co_fleet-ai": ["src_s29"],
  co_deeptune: ["src_s32", "src_s33"],
  co_refresh: ["src_s35"],
  "co_vibrant-labs": ["src_s36"],
  co_halluminate: ["src_s68"],
};
const highRiskMilestones = new Set(["co_scale-ai", "co_mercor", "co_micro1", "co_afterquery", "co_deeptune"]);

for (const seed of companySeeds) {
  const key = seed.companyId.replace(/^co_/, "");
  const primarySource = seed.sourceIds[0];
  const offerSource = seed.sourceIds.find((sourceId) => sourceById.get(sourceId)?.sourceType === "company_first_party") ?? primarySource;
  const offerSourceOpen = sourceById.get(offerSource)?.access === "open";
  const riskSources = unique(seed.riskSourceIds.length > 0 ? seed.riskSourceIds : [primarySource]);
  const identity = makeClaim({
    claimId: `clm_${key}-identity`,
    statement: `${seed.name} is identified in this corpus by the official origin ${seed.domain}.`,
    subjectIds: [seed.companyId],
    themes: ["company"],
    sourceIds: [offerSource],
    singleSourceException: {
      kind: "current_advertised_offer",
      reason: "The exception establishes only the current official identity and offer surface.",
      observationId: observationBySourceId.get(offerSource).observationId,
    },
  });
  const origin = makeClaim({
    claimId: `clm_${key}-origin`,
    statement: seed.origin,
    subjectIds: [seed.companyId],
    themes: ["company", "history"],
    temporal: "historical",
    sourceIds: [primarySource],
  });
  const initialWedge = makeClaim({
    claimId: `clm_${key}-initial-wedge`,
    statement: seed.wedge,
    subjectIds: [seed.companyId],
    themes: ["company", "history"],
    kind: "inference",
    temporal: "historical",
    sourceIds: [primarySource],
  });
  const evolution = makeClaim({
    claimId: `clm_${key}-evolution`,
    statement: seed.evolution,
    subjectIds: [seed.companyId],
    themes: ["company", "history"],
    kind: "inference",
    temporal: "historical",
    sourceIds: unique(seed.sourceIds.slice(0, 2)),
  });
  const currentOffer = makeClaim({
    claimId: `clm_${key}-current-offer`,
    statement: seed.offer,
    subjectIds: [seed.companyId],
    themes: ["company"],
    kind: "reported_claim",
    confidence: offerSourceOpen ? "medium" : "low",
    temporal: offerSourceOpen ? "current" : "unknown",
    risk: "high_risk",
    sourceIds: [offerSource],
    relations: offerSourceOpen ? [] : [{ supportRelation: "context_only" }],
    singleSourceException: offerSourceOpen
      ? {
          kind: "current_advertised_offer",
          reason: "A live official page establishes only the advertised offer, not adoption or efficacy.",
          observationId: observationBySourceId.get(offerSource).observationId,
        }
      : null,
  });
  const classification = makeClaim({
    claimId: `clm_${key}-market-classification`,
    statement: `${seed.name} is classified in the corpus under primary segment ${seed.primarySegment.replaceAll("_", " ")} and business models ${seed.businessModelIds.map((model) => model.replaceAll("_", " ")).join(", ")} based on its advertised offer.`,
    subjectIds: [seed.companyId],
    themes: ["company", "taxonomy"],
    kind: "inference",
    confidence: "medium",
    temporal: "current",
    risk: "routine",
    sourceIds: [offerSource],
  });
  const buyerClaim = makeClaim({
    claimId: `clm_${key}-buyers`,
    statement: seed.buyers,
    subjectIds: [seed.companyId],
    themes: ["company", "buyer"],
    kind: "reported_claim",
    confidence: "low",
    temporal: "unknown",
    risk: "high_risk",
    sourceIds: [offerSource],
    relations: [{ supportRelation: "context_only" }],
  });
  const gtm = makeClaim({
    claimId: `clm_${key}-gtm`,
    statement: `${seed.name}'s public materials are consistent with technical proof, managed delivery, and expansion after acceptance; they do not establish a universal sales sequence.`,
    subjectIds: [seed.companyId],
    themes: ["company", "gtm"],
    kind: "inference",
    temporal: "unknown",
    confidence: "low",
    risk: "material",
    sourceIds: [offerSource],
    relations: [{ supportRelation: "partially_supports" }],
  });
  const operatingModel = makeClaim({
    claimId: `clm_${key}-operating-model`,
    statement: `${seed.name}'s visible offer combines software or workflow infrastructure with managed expert or engineering delivery.`,
    subjectIds: [seed.companyId],
    themes: ["company", "economics"],
    kind: "inference",
    confidence: "medium",
    risk: "material",
    sourceIds: [offerSource],
    relations: [{ supportRelation: "partially_supports" }],
  });
  const economics = makeClaim({
    claimId: `clm_${key}-economics`,
    statement: `This corpus does not treat ${seed.name}'s private operating metrics as audited or directly comparable with software ARR.`,
    subjectIds: [seed.companyId],
    themes: ["company", "economics", "risk"],
    kind: "inference",
    confidence: "high",
    temporal: "unknown",
    risk: "high_risk",
    sourceIds: riskSources,
    relations: riskSources.map(() => ({ supportRelation: "context_only" })),
  });
  const milestone = makeClaim({
    claimId: `clm_${key}-milestone`,
    statement: seed.milestone,
    subjectIds: [seed.companyId],
    themes: ["company", "history"],
    kind: "reported_claim",
    temporal: seed.companyId === "co_mercor" || seed.companyId === "co_deeptune" ? "announced" : "historical",
    risk: highRiskMilestones.has(seed.companyId) ? "high_risk" : "routine",
    sourceIds: milestoneSources[seed.companyId],
    relations: highRiskMilestones.has(seed.companyId) && seed.companyId !== "co_scale-ai"
      ? milestoneSources[seed.companyId].map(() => ({ supportRelation: "context_only" }))
      : [],
  });
  const risk = makeClaim({
    claimId: `clm_${key}-risk`,
    statement: seed.risk,
    subjectIds: [seed.companyId],
    themes: ["company", "risk"],
    kind: "inference",
    confidence: "medium",
    temporal: "unknown",
    risk: "high_risk",
    sourceIds: riskSources,
    relations: riskSources.map((sourceId) => ({
      supportRelation: ["independent_reporting", "regulatory_record", "procurement_record"].includes(sourceById.get(sourceId)?.sourceType)
        ? "partially_supports"
        : "context_only",
    })),
  });
  const currentStatus = makeClaim({
    claimId: `clm_${key}-current-status`,
    statement: offerSourceOpen
      ? `${seed.name} maintained an accessible official offer surface at the 2026-07-11 cutoff.`
      : `${seed.name}'s official offer surface was not directly accessible at the 2026-07-11 cutoff.`,
    subjectIds: [seed.companyId],
    themes: ["company"],
    kind: "observation",
    confidence: offerSourceOpen ? "medium" : "low",
    temporal: offerSourceOpen ? "current" : "unknown",
    risk: "high_risk",
    sourceIds: [offerSource],
    relations: offerSourceOpen ? [] : [{ supportRelation: "context_only" }],
    singleSourceException: offerSourceOpen
      ? {
          kind: "current_advertised_offer",
          reason: "This verifies only the live advertised surface, not commercial activity or adoption.",
          observationId: observationBySourceId.get(offerSource).observationId,
        }
      : null,
  });
  const unknown = makeClaim({
    claimId: `clm_${key}-unknowns`,
    statement: `${seed.name}'s current private margins, customer concentration, renewal profile, and contract terms are not publicly verified in this corpus.`,
    subjectIds: [seed.companyId],
    themes: ["company", "risk", "economics"],
    kind: "inference",
    confidence: "medium",
    temporal: "unknown",
    risk: "high_risk",
    sourceIds: [offerSource],
    relations: [{ supportRelation: "context_only" }],
  });

  let buyerName = null;
  let buyerNameClaimId = null;
  let evidenceState = "vendor_reported_only";
  let buyerObservationIds = [observationBySourceId.get(offerSource).observationId];
  if (seed.companyId === "co_afterquery") {
    buyerName = "NVIDIA";
    evidenceState = "buyer_confirmed";
    buyerNameClaimId = makeClaim({
      claimId: "clm_afterquery-buyer-nvidia",
      statement: "NVIDIA's Nemotron 3 Ultra technical report names AfterQuery tasks.",
      subjectIds: [seed.companyId],
      themes: ["company", "buyer"],
      kind: "observation",
      confidence: "high",
      risk: "material",
      sourceIds: ["src_s28"],
      relations: [{ claimAlignment: "buyer_controlled" }],
    });
    buyerObservationIds = [observationBySourceId.get("src_s28").observationId];
  }
  const buyerEvidenceId = `buy_${key}`;
  buyers.push({
    buyerEvidenceId,
    companyId: seed.companyId,
    buyerName,
    buyerNameClaimId,
    buyerType: buyerName === "NVIDIA" ? "enterprise_ai_team" : "undisclosed",
    motion: buyerName === "NVIDIA" ? "partnership" : "unknown",
    evidenceState,
    claimIds: buyerNameClaimId ? [buyerClaim, buyerNameClaimId] : [buyerClaim],
    observationIds: buyerObservationIds,
    outcomeClaimIds: [],
    validAt: buyerName === "NVIDIA" ? "2026-06-01" : null,
  });
  claimGroupsForCompany.set(seed.companyId, {
    identity,
    buyerEvidenceId,
    claimGroups: {
      origin: [origin],
      initialWedge: [initialWedge],
      evolution: [evolution],
      currentOffer: [currentOffer, classification],
      buyers: buyerNameClaimId ? [buyerClaim, buyerNameClaimId] : [buyerClaim],
      gtm: [gtm],
      operatingModel: [operatingModel],
      economics: [economics],
      milestones: [milestone],
      risks: [risk],
      currentStatus: [currentStatus],
      contradictions: [],
      unknowns: [unknown],
    },
    comparisonMetricClaimIds: [economics, milestone],
  });
}

const companies = companySeeds.map((seed) => {
  const groups = claimGroupsForCompany.get(seed.companyId);
  return {
    companyId: seed.companyId,
    name: seed.name,
    aliases: seed.aliases,
    canonicalDomain: seed.domain,
    identityClaimId: groups.identity,
    entityStatus: seed.companyId === "co_deeptune" ? "acquisition_announced" : "active",
    industryIds: seed.industryIds,
    primarySegment: seed.primarySegment,
    businessModelIds: seed.businessModelIds,
    claimGroups: groups.claimGroups,
    buyerEvidenceIds: [groups.buyerEvidenceId],
    comparisonMetricClaimIds: groups.comparisonMetricClaimIds,
  };
});

const industryIdsForSegment = {
  training_data_workforce: ["ind_expert-data-operations", "ind_rlhf"],
  expert_talent_network: ["ind_expert-data-operations", "ind_rlhf"],
  environment_computer_use_runtime: ["ind_rl-environments", "ind_computer-use", "ind_rlvr"],
  eval_observability_assurance: ["ind_evaluations-assurance"],
  post_training_rl_infrastructure: ["ind_dpo", "ind_rlvr", "ind_rlhf"],
  agent_ax_services: ["ind_ax", "ind_evaluations-assurance"],
  incumbent_bpo_consulting: ["ind_expert-data-operations", "ind_ax"],
};

const adjacent = [];
for (const [name, url, primarySegment, businessModelIds] of adjacentSeeds) {
  const adjacentId = `adj_${slug(name)}`;
  const exactSource = sourceByUrl.get(url);
  const source = exactSource ?? sources.find((candidate) => {
    const candidateHost = new URL(candidate.canonicalUrl).hostname.replace(/^www\./, "");
    const targetHost = new URL(url).hostname.replace(/^www\./, "");
    return candidateHost === targetHost;
  });
  if (!source) throw new Error(`No official source for adjacent record ${name}`);
  const observationId = observationBySourceId.get(source.sourceId).observationId;
  const segmentLabel = primarySegment.replaceAll("_", " ");
  const inclusionClaimId = makeClaim({
    claimId: `clm_${slug(name)}-census-inclusion`,
    statement: source.access === "open"
      ? `${name} is included in the bounded census because its official surface supports classification in ${segmentLabel} with business models ${businessModelIds.map((model) => model.replaceAll("_", " ")).join(", ")}.`
      : `${name} remains in the bounded census as a historical or identity lead; its current ${segmentLabel} offer is not publicly verified at the cutoff.`,
    subjectIds: [adjacentId],
    themes: ["company", "taxonomy"],
    kind: "inference",
    confidence: source.access === "open" ? "medium" : "low",
    temporal: source.access === "open" ? "current" : "unknown",
    risk: "routine",
    sourceIds: [source.sourceId],
    relations: source.access === "open" ? [] : [{ supportRelation: "context_only" }],
  });
  const currentOfferClaimId = makeClaim({
    claimId: `clm_${slug(name)}-current-offer`,
    statement: `${name}'s official surface advertises products or services associated with ${segmentLabel} at the evidence cutoff.`,
    subjectIds: [adjacentId],
    themes: ["company"],
    kind: "reported_claim",
    confidence: source.access === "open" ? "medium" : "low",
    temporal: source.access === "open" ? "current" : "unknown",
    risk: "high_risk",
    sourceIds: [source.sourceId],
    relations: source.access === "open" ? [] : [{ supportRelation: "context_only" }],
    singleSourceException: source.access === "open"
      ? {
          kind: "current_advertised_offer",
          reason: "This verifies only the current advertised offer, not adoption, efficacy, revenue, or active legal status.",
          observationId,
        }
      : null,
  });
  const currentStatusClaimId = makeClaim({
    claimId: `clm_${slug(name)}-current-status-unknown`,
    statement: `${name}'s independent legal and commercial operating status is not established by the official offer surface alone.`,
    subjectIds: [adjacentId],
    themes: ["company", "risk"],
    kind: "inference",
    confidence: "medium",
    temporal: "unknown",
    risk: "high_risk",
    sourceIds: [source.sourceId],
    relations: [{ supportRelation: "context_only" }],
  });
  adjacent.push({
    adjacentId,
    name,
    aliases: [],
    canonicalDomain: normalizeOrigin(url),
    primarySegment,
    secondaryIndustryIds: industryIdsForSegment[primarySegment],
    businessModelIds,
    entityStatus: "unknown",
    inclusionKind: primarySegment === "agent_ax_services" ? "procurement_competitor" : "direct_supplier",
    inclusionClaimId,
    currentOfferClaimId,
    currentStatusClaimId,
    currentOfferObservationIds: [observationId],
    currentStatusObservationIds: [observationId],
  });
}

const industryClaimIds = new Map();
for (const [industryId, name, aliases, kind, valueChainStage, sourceId] of industrySeeds) {
  const definitionClaimId = makeClaim({
    claimId: `clm_${industryId.replace(/^ind_/, "")}-definition`,
    statement:
      industryId === "ind_dpo"
        ? "Direct Preference Optimization is an optimization method, not a feedback-provenance category or commercial market segment."
        : industryId === "ind_ax"
          ? "AX is ambiguous in public usage: it can mean agent experience or broader agentic transformation consulting."
          : `${name} is treated in this atlas as a ${kind.replaceAll("_", " ")} at the ${valueChainStage.replaceAll("_", " ")} stage.`,
    subjectIds: [industryId],
    themes: ["taxonomy"],
    kind: "inference",
    confidence: industryId === "ind_ax" ? "medium" : "high",
    temporal: "historical",
    sourceIds: [sourceId],
    section: "industries",
  });
  const boundaryClaimId = makeClaim({
    claimId: `clm_${industryId.replace(/^ind_/, "")}-boundary`,
    statement:
      industryId === "ind_rl-environments"
        ? "An RL environment supplies resettable state, actions, observations, tasks, logging, and verification; a benchmark is a held-out suite and scoring protocol."
        : `${name} remains a distinct analytic layer even when one vendor bundles it with adjacent services.`,
    subjectIds: [industryId],
    themes: ["taxonomy"],
    kind: "inference",
    confidence: "medium",
    temporal: "historical",
    sourceIds: [sourceId],
    section: "industries",
  });
  const buyerClaimId = makeClaim({
    claimId: `clm_${industryId.replace(/^ind_/, "")}-buyer-boundary`,
    statement: `Buyer evidence for ${name} must distinguish vendor-advertised demand from buyer-controlled or procurement-confirmed demand.`,
    subjectIds: [industryId],
    themes: ["taxonomy", "buyer"],
    kind: "inference",
    confidence: "high",
    temporal: "current",
    risk: "material",
    sourceIds: [sourceId],
    relations: [{ supportRelation: "context_only" }],
    section: "industries",
  });
  industryClaimIds.set(industryId, { definitionClaimId, boundaryClaimId, buyerClaimId, aliases, name, kind, valueChainStage });
}

const industries = industrySeeds.map(([industryId]) => {
  const metadata = industryClaimIds.get(industryId);
  return {
    industryId,
    name: metadata.name,
    aliases: metadata.aliases,
    kind: metadata.kind,
    valueChainStage: metadata.valueChainStage,
    definitionClaimId: metadata.definitionClaimId,
    boundaryClaimIds: [metadata.boundaryClaimId],
    buyerClaimIds: [metadata.buyerClaimId],
    companyIds: companies.filter((company) => company.industryIds.includes(industryId)).map((company) => company.companyId),
    adjacentIds: adjacent.filter((record) => record.secondaryIndustryIds.includes(industryId)).map((record) => record.adjacentId),
  };
});

const marketAnalysis = [];
const analysisClaim = ({ id, statement, subjectIds, sourceIds, themes, temporal = "historical", kind = "inference", risk = "routine" }) =>
  makeClaim({
    claimId: `clm_analysis-${id}`,
    statement,
    subjectIds,
    themes,
    kind,
    confidence: "medium",
    temporal,
    risk,
    sourceIds,
    section: themes.includes("economics") ? "economics" : "market-map",
  });

const historyEvents = [
  ["human-task-api", "2016-01-01", "The early commercial unit included API-mediated human tasks and managed labeling work.", ["co_scale-ai"], ["ind_expert-data-operations"], ["src_s01"]],
  ["preference-learning", "2022-04-12", "RLHF research formalized human preference signal as a model post-training input.", [], ["ind_rlhf"], ["src_s38"]],
  ["dpo-objective", "2023-05-29", "DPO introduced an offline preference-optimization objective distinct from the provenance of feedback.", [], ["ind_dpo"], ["src_s39"]],
  ["interactive-benchmarks", "2023-07-01", "Interactive web and computer benchmarks shifted evaluation toward stateful tasks and held-out scoring.", [], ["ind_rl-environments", "ind_computer-use"], ["src_s40", "src_s41", "src_s42"]],
  ["environment-contracts", "2026-01-01", "Industry interviews reported active demand for bespoke RL environments while leaving category size and margins unresolved.", [], ["ind_rl-environments"], ["src_s47"]],
  ["assurance-demand", "2026-05-01", "Frontier-lab and public-sector materials documented demand for decision-relevant third-party evaluation and assurance.", [], ["ind_evaluations-assurance"], ["src_s49", "src_s50", "src_s54"]],
];
for (const [slugValue, date, statement, companyIds, industryIds, sourceIds] of historyEvents) {
  const claimId = analysisClaim({ id: `history-${slugValue}`, statement, subjectIds: industryIds.length ? industryIds : companyIds, sourceIds, themes: ["history"] });
  marketAnalysis.push({
    analysisId: `ana_history-${slugValue}`,
    analysisType: "history_event",
    themes: ["history"],
    date,
    claimIds: [claimId],
    companyIds,
    industryIds,
  });
}

const gtmStages = [
  [1, "Technical relationship", "Technical or founder relationships often precede formal procurement for bespoke data and environment work."],
  [2, "Diagnostic or sample", "A bounded diagnostic, NDA, or sample turns a capability gap into an inspectable task specification."],
  [3, "Paid pilot", "A narrow paid pilot tests acceptance criteria before a larger managed program."],
  [4, "Acceptance proof", "Held-out results and buyer acceptance create the evidence required for expansion."],
  [5, "Embedded expansion", "Forward-deployed delivery and adjacent work expand only after the initial proof clears buyer review."],
];
for (const [stageOrder, name, statement] of gtmStages) {
  const claimId = analysisClaim({
    id: `gtm-${slug(name)}`,
    statement,
    subjectIds: ["ind_rl-environments"],
    sourceIds: ["src_s31", "src_s22"],
    themes: ["gtm", "buyer"],
    temporal: "current",
  });
  marketAnalysis.push({
    analysisId: `ana_gtm-${slug(name)}`,
    analysisType: "gtm_motion",
    themes: ["gtm", "buyer"],
    name,
    stageOrder,
    claimIds: [claimId],
    buyerEvidenceIds: buyers
      .filter((buyer) => ["buyer_confirmed", "procurement_confirmed"].includes(buyer.evidenceState))
      .map((buyer) => buyer.buyerEvidenceId),
  });
}

const economicSeeds = [
  ["managed_data_bpo", "Managed data / BPO", "buyer price - creator payout - review - rework - runtime - variable support", "accepted artifact", ["src_s52", "src_s53"]],
  ["expert_marketplace", "Expert marketplace", "buyer spend - expert payout - payments - trust and safety", "gross marketplace spend", ["src_s63"]],
  ["employee_bpo", "Employee BPO", "revenue - payroll - facilities - management - idle capacity", "managed employee hour", ["src_s52", "src_s53"]],
  ["expert_environment_services", "Expert + environment services", "milestone revenue - expert time - engineering - review - compute", "accepted environment milestone", ["src_s37", "src_s47"]],
  ["eval_observability_saas", "Eval / observability SaaS", "subscription and usage revenue - judge inference - storage - support", "trace, run, or seat", ["src_s64", "src_s65"]],
  ["runtime_infrastructure", "Runtime infrastructure", "usage revenue - compute - browser - proxy - network - orchestration", "runtime minute or session", ["src_s66", "src_s71"]],
  ["proprietary_data_acquisition", "Proprietary data acquisition", "license revenue - rights acquisition - cleaning - security - provenance", "licensed asset or dataset", ["src_s24"]],
];
for (const [businessModelId, name, formula, comparabilityClass, sourceIds] of economicSeeds) {
  const claimId = analysisClaim({
    id: `economics-${businessModelId.replaceAll("_", "-")}`,
    statement: `${name} contribution is modeled as ${formula}; it should be compared on ${comparabilityClass}, not conflated with gross volume or unrelated SaaS ARR.`,
    subjectIds: ["ind_expert-data-operations"],
    sourceIds,
    themes: ["economics"],
    temporal: "current",
    risk: "material",
  });
  marketAnalysis.push({
    analysisId: `ana_economics-${businessModelId.replaceAll("_", "-")}`,
    analysisType: "economic_model",
    themes: ["economics"],
    businessModelId,
    name,
    formula,
    inputClaimIds: [claimId],
    comparabilityClass,
  });
}

const riskAnalysisClaim = analysisClaim({
  id: "metric-conflation",
  statement: "Gross marketplace volume, net revenue, software ARR, contract ceilings, and registered network size have different denominators and cannot be ranked as one metric.",
  subjectIds: ["ind_expert-data-operations"],
  sourceIds: ["src_s11", "src_s12", "src_s52", "src_s53"],
  themes: ["economics", "risk"],
  temporal: "current",
  risk: "high_risk",
});
marketAnalysis.push({
  analysisId: "ana_risk-metric-conflation",
  analysisType: "risk",
  themes: ["economics", "risk"],
  name: "Metric denominator conflation",
  allegationClaimIds: [],
  incidentClaimIds: [],
  counterevidenceClaimIds: [riskAnalysisClaim],
  unknownClaimIds: [],
});

const valueChainEdges = [
  ["ind_expert-data-operations", "ind_rlhf", "Expert-created demonstrations and preferences can provide post-training signal."],
  ["ind_rlhf", "ind_dpo", "Preference data can be consumed by optimization methods such as DPO without making the two terms equivalent."],
  ["ind_rl-environments", "ind_rlvr", "Stateful environments can expose checkable outcomes used as verifiable rewards."],
  ["ind_rlvr", "ind_evaluations-assurance", "Verifiers and hidden tasks can support evaluation, but construct validity still requires independent review."],
  ["ind_computer-use", "ind_evaluations-assurance", "Computer-use systems require closed-loop evaluation over actions and state, not only final text."],
  ["ind_evaluations-assurance", "ind_ax", "Evaluation evidence can inform transformation decisions without itself completing organizational change."],
];
for (const [fromIndustryId, toIndustryId, statement] of valueChainEdges) {
  const claimId = analysisClaim({
    id: `edge-${fromIndustryId.replace(/^ind_/, "")}-${toIndustryId.replace(/^ind_/, "")}`,
    statement,
    subjectIds: [fromIndustryId, toIndustryId],
    sourceIds: [industrySeeds.find(([id]) => id === fromIndustryId)?.[5] ?? "src_s44", industrySeeds.find(([id]) => id === toIndustryId)?.[5] ?? "src_s49"],
    themes: ["taxonomy"],
    temporal: "historical",
  });
  marketAnalysis.push({
    analysisId: `ana_edge-${fromIndustryId.replace(/^ind_/, "")}-${toIndustryId.replace(/^ind_/, "")}`,
    analysisType: "value_chain_edge",
    themes: ["taxonomy"],
    fromIndustryId,
    toIndustryId,
    claimIds: [claimId],
  });
}

const cellEvidence = {
  regulated_financial_operations: {
    pain: [2, ["src_s58", "src_s59"], "Financial-services assurance offers document high-consequence AI control concerns, but no two-buyer incident corpus was found."],
    willingnessToPay: [1, ["src_s58"], "A formal assurance offer indicates vendor-supplied willingness-to-pay evidence without a public buyer spend record."],
    verifierFeasibility: [2, ["src_s49"], "Evaluation methodology supports partial verifier feasibility while warning about validity and hidden-task design."],
    expertSupply: [2, ["src_s37"], "Halluminate publishes a finance-expert supply channel, but repeatable utilization is not independently verified."],
    freshnessBurden: [4, ["src_s37"], "The target workflows are presented as current professional work, implying a high refresh burden; no independent cadence measure was found."],
    incumbentPressure: [4, ["src_s58", "src_s59", "src_s60"], "Formal assurance incumbents and certification providers already occupy adjacent buyer channels."],
  },
  insurance_operations: {
    pain: [2, ["src_s54"], "Public assurance policy documents high-consequence AI risks without an insurance-operations-specific buyer incident corpus."],
    verifierFeasibility: [2, ["src_s49"], "The public methodology supports partial verifiability with expert review and construct-validity limits."],
    expertSupply: [2, ["src_s63"], "A general research-participant marketplace is visible, but calibrated insurance-operations supply is not established."],
    freshnessBurden: [4, ["src_s54"], "Changing governance and operating procedures imply a high refresh burden; the cadence is not directly measured."],
    incumbentPressure: [3, ["src_s59"], "Large assurance consultancies provide a credible adjacent substitute requiring differentiated technical proof."],
  },
  healthcare_administration: {
    pain: [2, ["src_s54"], "Public assurance materials establish high-consequence AI governance concerns but not a healthcare-administration-specific paid need."],
    verifierFeasibility: [2, ["src_s49"], "Evaluation methodology supports partial automation with expert adjudication, not a fully objective verifier."],
    incumbentPressure: [3, ["src_s58", "src_s59"], "Formal assurance incumbents can bundle governance and domain consulting into the purchase."],
  },
  enterprise_software_support: {
    pain: [2, ["src_s67"], "A cancellation forecast documents broad agent-program value and control risk, not a buyer-specific support-workflow loss."],
    willingnessToPay: [2, ["src_s64", "src_s65"], "Public eval-platform pricing shows spend for tooling but not a premium for an independent vertical assurance pack."],
    verifierFeasibility: [2, ["src_s69"], "LangSmith demonstrates failure clustering and evaluation automation while leaving independent construct validity as a separate problem."],
    freshnessBurden: [4, ["src_s69"], "Production traces and agent behavior change frequently, implying a high operational refresh burden."],
    incumbentPressure: [5, ["src_s69", "src_s70", "src_s71"], "Platforms and hyperscalers bundle tracing, evaluation, runtime, and optimization with low switching friction."],
  },
  public_sector_administration: {
    pain: [2, ["src_s54", "src_s55"], "Public policy documents decision-relevant assurance needs and institutional barriers."],
    willingnessToPay: [3, ["src_s56", "src_s77"], "A public award and specialist evaluation framework show procurement, but only one public-sector buyer system is represented."],
    rightsAccess: [2, ["src_s54"], "The roadmap documents confidentiality and access constraints without durable contractual rights for a newcomer."],
    verifierFeasibility: [2, ["src_s49", "src_s50"], "Two frontier-lab methodologies support hidden tasks, expert baselines, and validity review, but not a public-administration-specific false-pass study."],
    expertSupply: [2, ["src_s54"], "The roadmap identifies the required technical, legal, governance, and domain skills but does not prove repeatable utilization."],
    freshnessBurden: [3, ["src_s54", "src_s55"], "Policy and system change imply at least weekly-to-monthly maintenance in active programs; no precise cadence is public."],
    incumbentPressure: [4, ["src_s58", "src_s59", "src_s60"], "Assurance firms and certification bodies have strong procurement positions in adjacent formal work."],
  },
};

const domainClassValues = [
  "buyer_procurement",
  "regulatory_registry",
  "company_first_party",
  "technical_repository",
  "academic_primary",
  "independent_reporting",
  "investor_partner",
  "secondary_discovery",
];
const receiptTemplateHash = ({ kind, queries, candidateId, dimensionId, searchedDomainClasses }) => {
  const candidate = candidateId.replaceAll("_", " ");
  const queryTemplates = queries.map((query) =>
    query
      .trim()
      .replaceAll(candidate, "{candidate}")
      .replaceAll(dimensionId, "{dimension}")
      .replace(/\s+/g, " ")
      .toLowerCase(),
  );
  return sha256(JSON.stringify({
    kind,
    queryTemplates,
    searchedDomainClasses: [...searchedDomainClasses].sort(),
  }));
};
const receipts = [];
const strategies = [];
const exaReceiptById = new Map(exaStrategyManifest.receipts.map((receipt) => [receipt.id, receipt]));

const scoreWeights = {
  pain: 20,
  willingnessToPay: 20,
  rightsAccess: 15,
  verifierFeasibility: 15,
  expertSupply: 10,
  freshnessBurden: 10,
  incumbentPressure: 10,
};

for (const candidateId of candidateValues) {
  const candidateLabel = candidateId.replaceAll("_", " ");
  const cells = {};
  const candidateObservationIds = [];
  const candidateClaimIds = [];
  for (const dimensionId of dimensionValues) {
    const evidence = exaStrategyManifest.candidates[candidateId]?.cells[dimensionId];
    const positiveId = `rr-${candidateId.replaceAll("_", "-")}-${slug(dimensionId)}-positive`;
    const negativeId = `rr-${candidateId.replaceAll("_", "-")}-${slug(dimensionId)}-negative`;
    const positiveReceipt = exaReceiptById.get(positiveId);
    const negativeReceipt = exaReceiptById.get(negativeId);
    if (!evidence || !positiveReceipt || !negativeReceipt) throw new Error(`Incomplete Exa strategy evidence for ${candidateId}/${dimensionId}`);
    let claimIds = [];
    let observationIds = [];
    const measuredLevel = evidence.measuredLevel;
    let imputation = measuredLevel === null ? "conservative_missing" : null;
    let effectiveRawLevel = ["freshnessBurden", "incumbentPressure"].includes(dimensionId) ? 5 : 0;
    let convertedScore = 0;
    let missingReason = measuredLevel === null
      ? `The executed Exa lanes found no qualifying public evidence for a measured ${dimensionId} score, so this cell remains conservatively missing.`
      : null;
    const scoreSourceIds = unique(evidence.scoreEvidenceKeys.map((key) => exaSourceIdByEvidenceKey.get(key)));
    if (measuredLevel !== null) {
      if (scoreSourceIds.length === 0) throw new Error(`Measured ${candidateId}/${dimensionId} lacks evidence`);
      const cellClaimId = makeClaim({
        claimId: `clm_score-${candidateId.replaceAll("_", "-")}-${slug(dimensionId)}`,
        statement: evidence.finding,
        subjectIds: ["ind_evaluations-assurance"],
        themes: ["strategy", "buyer"],
        kind: "inference",
        confidence: measuredLevel >= 3 ? "medium" : "low",
        temporal: "historical",
        risk: "material",
        sourceIds: scoreSourceIds,
        relations: scoreSourceIds.map(() => ({ supportRelation: "partially_supports" })),
        section: "playbook",
      });
      claimIds = [cellClaimId];
      observationIds = scoreSourceIds.map((sourceId) => observationBySourceId.get(sourceId).observationId);
      candidateClaimIds.push(cellClaimId);
      candidateObservationIds.push(...observationIds);
      effectiveRawLevel = measuredLevel;
      convertedScore = ["freshnessBurden", "incumbentPressure"].includes(dimensionId) ? 5 - measuredLevel : measuredLevel;
    }
    for (const receipt of [positiveReceipt, negativeReceipt]) {
      const sourceIds = unique(receipt.evidenceKeys.map((key) => exaSourceIdByEvidenceKey.get(key)));
      receipts.push({
        id: receipt.id,
        candidateId,
        dimensionId,
        kind: receipt.kind,
        queries: receipt.queries,
        searchedDomainClasses: receipt.searchedDomainClasses,
        searchedAt: receipt.searchedAt,
        cutoffAt: receipt.cutoffAt,
        sourceIds,
        observationIds: sourceIds.map((sourceId) => observationBySourceId.get(sourceId).observationId),
        findings: receipt.findings,
        closure: receipt.closure,
        templateHash: receiptTemplateHash({ ...receipt, searchedDomainClasses: receipt.searchedDomainClasses }),
      });
    }
    cells[dimensionId] = {
      measuredLevel,
      imputation,
      effectiveRawLevel,
      convertedScore,
      claimIds,
      observationIds,
      missingReason,
      positiveSearchReceiptId: positiveId,
      negativeSearchReceiptId: negativeId,
    };
  }
  const rawWeightedScore = dimensionValues.reduce(
    (total, dimensionId) => total + cells[dimensionId].convertedScore * scoreWeights[dimensionId],
    0,
  ) / 5;
  const roundedScore = Math.round((rawWeightedScore + Number.EPSILON) * 10) / 10;
  const rightsBlocker = exaStrategyManifest.candidates[candidateId].rightsBlocker;
  const inferenceClaimId = makeClaim({
    claimId: `clm_strategy-${candidateId.replaceAll("_", "-")}-decision`,
    statement: `${candidateLabel} decision is derived after all five vertical candidates are evaluated.`,
    subjectIds: ["ind_evaluations-assurance"],
    themes: ["strategy"],
    kind: "calculation",
    confidence: "high",
    temporal: "historical",
    risk: "high_risk",
    sourceIds: unique(candidateClaimIds.flatMap((claimId) => claims.find((claim) => claim.claimId === claimId)?.evidenceLinks.map((link) => link.sourceId) ?? [])).slice(0, 3),
    relations: unique(candidateClaimIds.flatMap((claimId) => claims.find((claim) => claim.claimId === claimId)?.evidenceLinks.map((link) => link.sourceId) ?? [])).slice(0, 3).map(() => ({ supportRelation: "context_only" })),
    section: "playbook",
  });
  strategies.push({
    strategyId: `str_vertical-${candidateId.replaceAll("_", "-")}`,
    strategyType: "vertical_candidate",
    name: candidateLabel.replace(/\b\w/g, (letter) => letter.toUpperCase()),
    inferenceClaimIds: [inferenceClaimId],
    observationIds: unique(candidateObservationIds),
    verticalCandidateId: candidateId,
    dimensionCells: cells,
    rawWeightedScore,
    roundedScore,
    caps: ["benefit_cells_use_evidence_quality_caps", "missing_cells_are_conservatively_imputed"],
    rightsBlocker,
    qualificationFailures: [],
    decisionStatus: "no_go",
  });
}

const verticalEvaluation = evaluateVerticalCandidates({ strategies, observations, sources, receipts });
for (const strategy of strategies.filter((item) => item.strategyType === "vertical_candidate")) {
  const result = verticalEvaluation.results.get(strategy.strategyId);
  strategy.qualificationFailures = result.qualificationFailures;
  strategy.decisionStatus = result.decisionStatus;
  const decisionClaim = claims.find((claim) => claim.claimId === strategy.inferenceClaimIds[0]);
  if (result.decisionStatus === "winner") {
    decisionClaim.statement = `${strategy.name} is the conditional winner at ${result.score.toFixed(1)} with a ${result.lead.toFixed(1)}-point lead under the fixed vertical gate.`;
  } else if (result.decisionStatus === "runner_up") {
    decisionClaim.statement = `${strategy.name} is the runner-up under the fixed vertical ordering; it is not the selected vertical.`;
  } else {
    decisionClaim.statement = `${strategy.name} remains no-go under the fixed vertical gate because ${result.qualificationFailures.join(", ")}.`;
  }
}

const modelSeedById = {
  vertical_domain_assurance_pack: {
    name: "Vertical Domain Assurance Pack",
    eligibility: "eligible_hypothesis",
    sources: ["src_s49", "src_s54", "src_s47"],
    model: "A narrow, decision-relevant assurance pack preserves a possible wedge after horizontal platform countersearch.",
    prerequisite: "The model requires lawful workflow access, private held-out tasks, expert-calibrated verifiers, and portable evidence.",
    kill: "Kill the model if no buyer-controlled proof, lawful rights path, or construct-valid verifier can be established.",
  },
  specialist_independent_eval_lab: {
    name: "Specialist Independent Eval Lab",
    eligibility: "countersearched_out",
    sources: ["src_s58", "src_s59", "src_s47"],
    model: "Independence alone is not differentiated because formal assurance and certification incumbents already occupy the channel.",
    prerequisite: "A specialist lab would still need an unusually narrow technical scope and explicit boundary from regulated assurance.",
    kill: "Kill a standalone independence pitch when a formal incumbent can bundle equivalent evaluation with recognized assurance scope.",
  },
  environment_foundry: {
    name: "Environment Foundry",
    eligibility: "countersearched_out",
    sources: ["src_s44", "src_s45", "src_s47"],
    model: "Generic environment runtime is standardizing across open contracts, browser infrastructure, and hyperscaler services.",
    prerequisite: "An environment foundry would need proprietary domain state, tasks, verifier validity, rights, and refresh operations.",
    kill: "Kill a horizontal runtime wedge when standard infrastructure can execute the same task dataset with lower procurement friction.",
  },
  ax_transformation_studio: {
    name: "AX Transformation Studio",
    eligibility: "countersearched_out",
    sources: ["src_s62", "src_s67", "src_s49"],
    model: "A broad AX studio is a low-defensibility services wedge without decision-grade assurance evidence.",
    prerequisite: "An AX studio would need a material workflow, production intent, measurable decision outcome, and a repeatable technical asset.",
    kill: "Kill generic transformation work when the buyer cannot connect the agent program to business value or sustained production intent.",
  },
};

for (const modelId of modelValues) {
  const seed = modelSeedById[modelId];
  const relations = modelId === "ax_transformation_studio"
    ? seed.sources.map(() => ({ supportRelation: "context_only" }))
    : [];
  const modelClaimId = makeClaim({
    claimId: `clm_model-${modelId.replaceAll("_", "-")}`,
    statement: seed.model,
    subjectIds: ["ind_evaluations-assurance"],
    themes: ["strategy"],
    kind: "inference",
    confidence: "medium",
    temporal: "current",
    risk: "high_risk",
    sourceIds: seed.sources,
    relations,
    section: "playbook",
  });
  const prerequisiteClaimId = makeClaim({
    claimId: `clm_model-${modelId.replaceAll("_", "-")}-prerequisite`,
    statement: seed.prerequisite,
    subjectIds: ["ind_evaluations-assurance"],
    themes: ["strategy", "risk"],
    kind: "recommendation",
    confidence: "medium",
    temporal: "current",
    risk: "high_risk",
    sourceIds: seed.sources,
    relations,
    section: "playbook",
  });
  const killClaimId = makeClaim({
    claimId: `clm_model-${modelId.replaceAll("_", "-")}-kill`,
    statement: seed.kill,
    subjectIds: ["ind_evaluations-assurance"],
    themes: ["strategy", "risk"],
    kind: "recommendation",
    confidence: "medium",
    temporal: "current",
    risk: "high_risk",
    sourceIds: seed.sources,
    relations,
    section: "playbook",
  });
  strategies.push({
    strategyId: `str_model-${modelId.replaceAll("_", "-")}`,
    strategyType: "strategic_model",
    name: seed.name,
    inferenceClaimIds: [modelClaimId],
    observationIds: unique(seed.sources.map((sourceId) => observationBySourceId.get(sourceId).observationId)),
    modelId,
    eligibility: seed.eligibility,
    modelClaimIds: [modelClaimId],
    prerequisiteClaimIds: [prerequisiteClaimId],
    killClaimIds: [killClaimId],
  });
}

const archetypeSource = {
  managed_data_bpo: "src_s52",
  expert_workforce_marketplace: "src_s63",
  environment_foundry_gym: "src_s45",
  eval_observability_saas: "src_s43",
  independent_assurance_lab: "src_s58",
  post_training_runtime_infrastructure: "src_s48",
  ax_transformation_consultancy: "src_s62",
};
const responseTargets = [
  ...companySeeds.map((company) => ({
    targetKind: "companyId",
    targetId: company.companyId,
    name: company.name,
    sourceId: company.sourceIds.find((sourceId) => sourceById.get(sourceId)?.sourceType === "company_first_party") ?? company.sourceIds[0],
  })),
  ...archetypeValues.map((archetypeId) => ({
    targetKind: "archetypeId",
    targetId: archetypeId,
    name: archetypeId.replaceAll("_", " "),
    sourceId: archetypeSource[archetypeId],
  })),
];
const responseDimensions = [
  ["incumbent-strength", "incumbentStrengthClaimIds", (name) => `${name} has an installed capability, delivery system, or procurement position that a newcomer should not attempt to duplicate horizontally.`, "inference"],
  ["vulnerable-wedge", "vulnerableWedgeClaimIds", (name) => `${name}'s public offer does not by itself prove ownership of every vertical's lawful private state, hidden tasks, and construct-valid verifiers.`, "inference"],
  ["buyer", "buyerClaimIds", () => "The entrant should target a buyer with an external release, safety, procurement, model-selection, or regulated-workflow decision.", "recommendation"],
  ["entry-proof", "entryProofClaimIds", () => "Entry proof should be a blinded baseline, private held-out tasks, verifier validity tests, and a buyer-relevant decision artifact.", "recommendation"],
  ["counter-move", "likelyCounterMoveClaimIds", (name) => `${name} could respond by bundling adjacent capability, lowering price, recruiting domain experts, or using its installed channel.`, "forecast"],
  ["prerequisite", "prerequisiteClaimIds", () => "A viable entry requires rights-cleared workflow access, calibrated experts, verifier governance, sealed holdouts, and refresh operations.", "recommendation"],
  ["no-go", "noGoTriggerClaimIds", () => "Do not enter when buyer-controlled demand, lawful rights, verifier validity, or a differentiated distribution path cannot be demonstrated.", "recommendation"],
];

for (const target of responseTargets) {
  const response = {
    strategyId: `str_response-${target.targetKind === "companyId" ? target.targetId.replace(/^co_/, "") : target.targetId.replaceAll("_", "-")}`,
    strategyType: "competitor_response",
    name: `${target.name} response map`,
    inferenceClaimIds: [],
    observationIds: unique([
      observationBySourceId.get(target.sourceId).observationId,
      observationBySourceId.get("src_s47").observationId,
      observationBySourceId.get("src_s49").observationId,
    ]),
    [target.targetKind]: target.targetId,
  };
  for (const [claimSlug, field, statement, kind] of responseDimensions) {
    const claimId = makeClaim({
      claimId: `clm_response-${slug(target.targetId)}-${claimSlug}`,
      statement: statement(target.name),
      subjectIds: target.targetKind === "companyId" ? [target.targetId] : ["ind_evaluations-assurance"],
      themes: ["strategy", "risk"],
      kind,
      confidence: "medium",
      temporal: kind === "forecast" ? "unknown" : "current",
      risk: "high_risk",
      sourceIds: unique([target.sourceId, "src_s47", "src_s49"]),
      relations: [
        { supportRelation: "partially_supports" },
        { supportRelation: "partially_supports" },
        { supportRelation: "partially_supports" },
      ],
      section: "playbook",
    });
    response[field] = [claimId];
    response.inferenceClaimIds.push(claimId);
  }
  strategies.push(response);
}

const roadmapSeeds = [
  ["0-30 days", 1, "Choose one externally decision-relevant workflow and secure a buyer-controlled discovery path.", "Advance only with a named decision owner and lawful sample access."],
  ["31-60 days", 2, "Build a private baseline, task specification, verifier prototype, and adversarial validity test.", "Advance only if false-pass risks and expert disagreement are measured."],
  ["61-90 days", 3, "Run a paid blinded pilot and deliver a signed technical evidence report with explicit limitations.", "Advance only if the evidence changes or materially informs the buyer's decision."],
  ["3-12 months", 4, "Version the assurance pack, refresh hidden tasks, and integrate with buyer-selected runtime and evaluation systems.", "Scale only after repeat or expansion evidence from at least two buyers."],
];
for (const [horizon, order, action, gate] of roadmapSeeds) {
  const actionClaimId = makeClaim({
    claimId: `clm_roadmap-${order}-action`,
    statement: action,
    subjectIds: ["ind_evaluations-assurance"],
    themes: ["strategy"],
    kind: "recommendation",
    confidence: "medium",
    temporal: "current",
    risk: "high_risk",
    sourceIds: ["src_s49", "src_s54", "src_s47"],
    section: "playbook",
  });
  const gateClaimId = makeClaim({
    claimId: `clm_roadmap-${order}-gate`,
    statement: gate,
    subjectIds: ["ind_evaluations-assurance"],
    themes: ["strategy", "buyer", "risk"],
    kind: "recommendation",
    confidence: "medium",
    temporal: "current",
    risk: "high_risk",
    sourceIds: ["src_s49", "src_s54", "src_s47"],
    section: "playbook",
  });
  strategies.push({
    strategyId: `str_roadmap-${order}`,
    strategyType: "roadmap",
    name: `${horizon} roadmap gate`,
    inferenceClaimIds: [actionClaimId, gateClaimId],
    observationIds: ["obs_s49", "obs_s54", "obs_s47"],
    horizon,
    order,
    actionClaimIds: [actionClaimId],
    gateClaimIds: [gateClaimId],
  });
}

const pricingHypothesisClaimId = makeClaim({
  claimId: "clm_pricing-paid-discovery-hypothesis",
  statement: "A paid discovery sprint is a pricing experiment for qualifying access, decision ownership, and verifier feasibility; no public evidence sets a universal price.",
  subjectIds: ["ind_evaluations-assurance"],
  themes: ["strategy", "economics"],
  kind: "recommendation",
  confidence: "unscored",
  temporal: "current",
  risk: "high_risk",
  sourceIds: ["src_s49", "src_s56"],
  section: "playbook",
});
const pricingSuccessClaimId = makeClaim({
  claimId: "clm_pricing-paid-discovery-success",
  statement: "The experiment succeeds only when the buyer funds access and accepts a measurable decision artifact.",
  subjectIds: ["ind_evaluations-assurance"],
  themes: ["strategy", "buyer"],
  kind: "recommendation",
  confidence: "unscored",
  temporal: "current",
  risk: "high_risk",
  sourceIds: ["src_s49", "src_s56"],
  section: "playbook",
});
const pricingKillClaimId = makeClaim({
  claimId: "clm_pricing-paid-discovery-kill",
  statement: "Stop the pricing experiment when the buyer will not fund discovery or cannot grant lawful access to a decision-relevant workflow.",
  subjectIds: ["ind_evaluations-assurance"],
  themes: ["strategy", "risk"],
  kind: "recommendation",
  confidence: "unscored",
  temporal: "current",
  risk: "high_risk",
  sourceIds: ["src_s49", "src_s54", "src_s47"],
  section: "playbook",
});
strategies.push({
  strategyId: "str_pricing-paid-discovery",
  strategyType: "pricing_experiment",
  name: "Paid discovery sprint experiment",
  inferenceClaimIds: [pricingHypothesisClaimId],
  observationIds: ["obs_s49", "obs_s56", "obs_s54"],
  amount: null,
  currency: null,
  unit: "bounded paid discovery sprint",
  hypothesisClaimIds: [pricingHypothesisClaimId],
  successClaimIds: [pricingSuccessClaimId],
  killClaimIds: [pricingKillClaimId],
});

for (const claim of claims) {
  claim.evidenceLinks = claim.evidenceLinks.map((link) => {
    if (!legacySourceIds.has(link.sourceId) || !["supports", "partially_supports"].includes(link.supportRelation)) return link;
    return { ...link, supportRelation: "context_only" };
  });
  claim.independentGroupCount = new Set(claim.evidenceLinks
    .filter((link) => eligibleAlignments.has(link.claimAlignment) && ["supports", "partially_supports"].includes(link.supportRelation))
    .map((link) => link.independenceGroup)).size;
}

const sourceMappings = parsedSeedSources.map((source) => ({
  seedSourceId: `S${String(source.number).padStart(2, "0")}`,
  canonicalUrl: source.canonicalUrl,
  contentHash: sha256(`${source.canonicalUrl}\n${source.title}`),
  canonicalSourceId: source.sourceId,
  disposition: null,
}));

const seedBody = seedText.slice(0, seedText.indexOf("## Sources"));
const seedLines = seedBody.split("\n");
const claimMappings = [];
const claimMappingOverrides = new Map(Object.entries({
  21: ["clm_analysis-gtm-technical-relationship", "clm_analysis-gtm-diagnostic-or-sample", "clm_analysis-gtm-paid-pilot", "clm_analysis-gtm-acceptance-proof", "clm_analysis-gtm-embedded-expansion"],
  32: ["clm_scale-ai-initial-wedge", "clm_analysis-history-human-task-api"],
  39: ["clm_analysis-edge-computer-use-evaluations-assurance"],
  47: ["clm_dpo-definition", "clm_analysis-history-dpo-objective"],
  53: ["clm_rl-environments-boundary"],
  105: ["clm_scale-ai-origin", "clm_scale-ai-initial-wedge", "clm_scale-ai-evolution", "clm_analysis-history-human-task-api"],
  107: ["clm_scale-ai-current-offer", "clm_scale-ai-operating-model"],
  109: ["clm_scale-ai-buyers"],
  111: ["clm_scale-ai-milestone", "clm_scale-ai-risk"],
  117: ["clm_mercor-origin", "clm_mercor-initial-wedge"],
  119: ["clm_mercor-evolution", "clm_mercor-current-offer"],
  121: ["clm_mercor-buyers", "clm_mercor-operating-model"],
  125: ["clm_mercor-milestone", "clm_deeptune-risk"],
  129: ["clm_micro1-origin", "clm_micro1-initial-wedge"],
  131: ["clm_micro1-current-offer", "clm_micro1-operating-model"],
  133: ["clm_micro1-buyers", "clm_micro1-gtm"],
  135: ["clm_micro1-milestone", "clm_micro1-risk"],
  139: ["clm_turing-origin", "clm_turing-milestone"],
  141: ["clm_turing-evolution", "clm_turing-current-offer", "clm_turing-operating-model"],
  143: ["clm_turing-buyers", "clm_turing-gtm", "clm_turing-operating-model"],
  145: ["clm_turing-risk"],
  149: ["clm_afterquery-identity", "clm_afterquery-origin"],
  151: ["clm_afterquery-evolution", "clm_afterquery-current-offer", "clm_afterquery-operating-model"],
  153: ["clm_afterquery-buyers", "clm_afterquery-gtm"],
  155: ["clm_afterquery-milestone", "clm_afterquery-risk", "clm_afterquery-buyer-nvidia"],
  159: ["clm_fleet-ai-identity", "clm_fleet-ai-origin", "clm_fleet-ai-initial-wedge"],
  161: ["clm_fleet-ai-evolution", "clm_fleet-ai-current-offer", "clm_fleet-ai-buyers"],
  163: ["clm_fleet-ai-gtm", "clm_fleet-ai-operating-model"],
  165: ["clm_fleet-ai-risk", "clm_fleet-ai-unknowns"],
  169: ["clm_deeptune-origin", "clm_deeptune-initial-wedge", "clm_deeptune-evolution"],
  171: ["clm_deeptune-current-offer", "clm_deeptune-buyers", "clm_deeptune-operating-model"],
  173: ["clm_deeptune-milestone", "clm_deeptune-risk"],
  177: ["clm_refresh-identity", "clm_refresh-origin", "clm_refresh-initial-wedge", "clm_refresh-evolution"],
  179: ["clm_refresh-current-offer", "clm_refresh-operating-model"],
  181: ["clm_refresh-buyers", "clm_refresh-gtm", "clm_refresh-risk"],
  185: ["clm_vibrant-labs-origin", "clm_vibrant-labs-initial-wedge", "clm_vibrant-labs-evolution"],
  187: ["clm_vibrant-labs-current-offer", "clm_vibrant-labs-operating-model"],
  189: ["clm_vibrant-labs-gtm", "clm_vibrant-labs-risk"],
  193: ["clm_halluminate-origin", "clm_halluminate-initial-wedge", "clm_halluminate-evolution"],
  195: ["clm_halluminate-current-offer", "clm_halluminate-buyers"],
  197: ["clm_halluminate-gtm", "clm_halluminate-operating-model"],
  199: ["clm_halluminate-risk", "clm_halluminate-unknowns"],
  292: ["clm_deeptune-risk"],
  418: ["clm_scale-ai-milestone"],
  422: ["clm_deeptune-risk"],
  425: ["clm_afterquery-risk"],
  428: ["clm_vibrant-labs-risk"],
  429: ["clm_halluminate-risk"],
  430: ["clm_analysis-history-environment-contracts"],
}));
let section = "preamble";
for (let index = 0; index < seedLines.length; index += 1) {
  const line = seedLines[index].trim();
  if (line.startsWith("## ")) section = line;
  const formattingOnly =
    line === "" ||
    line.startsWith("#") ||
    line.startsWith("```") ||
    line === "flowchart LR" ||
    /^\|\s*:?-+/.test(line) ||
    /^[-A-Z0-9]+\s*-->/.test(line);
  if (formattingOnly) continue;
  const cited = [...line.matchAll(/\[S(\d+)\]/g)].map((match) => `S${match[1].padStart(2, "0")}`);
  const canonicalClaimIds = claimMappingOverrides.get(String(index + 1)) ?? [];
  let disposition = canonicalClaimIds.length > 0 ? null : "non_atomic";
  if (canonicalClaimIds.length === 0 && section.startsWith("## 10")) disposition = "strategy_hypothesis";
  if (canonicalClaimIds.length === 0 && section.startsWith("## 11")) disposition = [419, 421, 423, 424, 426].includes(index + 1) ? "duplicate" : "superseded";
  if (canonicalClaimIds.length === 0 && section.startsWith("## 12")) disposition = "out_of_scope";
  if (index + 1 === 292 && canonicalClaimIds.length === 0) disposition = "superseded";
  const reason = canonicalClaimIds.length > 0
    ? "Mapped only to canonical claims whose full statement is semantically preserved by this seed line."
    : index + 1 === 292
      ? "The acquisition-announced state is preserved elsewhere, but no canonical claim asserts permanent-independent-peer treatment."
      : disposition === "duplicate"
        ? "The line repeats a factual fragment already migrated from a fuller dossier anchor."
        : disposition === "superseded"
          ? "The canonical corpus preserves the supported status while omitting this broader or stale formulation."
          : disposition === "strategy_hypothesis"
            ? "This seed line is a pre-score strategy hypothesis, not a source-backed atomic factual claim."
            : disposition === "out_of_scope"
              ? "This methodology or limitation line is retained in provenance but is outside the atomic claim graph."
              : "The seed line combines multiple propositions or unsupported connective language and is not safely equivalent to one canonical claim.";
  claimMappings.push({
    seedAnchorId: `seed-line-${index + 1}`,
    lineNumber: index + 1,
    contentHash: sha256(line),
    citedSeedSourceIds: unique(cited),
    canonicalClaimIds,
    disposition,
    reason,
  });
}

const openLeadCount = [...sourceMappings, ...claimMappings].filter(
  (mapping) => mapping.disposition === "unsupported",
).length;

const journalDir = join(ROOT, ".omo/ulw-research/20260711-034936");
const journalFiles = readdirSync(journalDir)
  .filter((name) => name.endsWith(".md"))
  .sort();
const exaSeedDir = join(RESEARCH, "seeds/exa");
const exaSeedFiles = readdirSync(exaSeedDir).filter((name) => name.endsWith(".md")).sort();
const inputManifests = [
  {
    path: "research/seeds/SYNTHESIS.pre-canonical.md",
    role: "immutable-pre-canonical-seed",
    sha256: sha256(seedText),
    bytes: Buffer.byteLength(seedText),
  },
  {
    path: "SYNTHESIS.md",
    role: "claim-free-canonical-pointer",
    sha256: sha256(ROOT_POINTER),
    bytes: Buffer.byteLength(ROOT_POINTER),
  },
  {
    path: "research/migrations/source-locator-snapshots.json",
    role: "exact-source-locator-snapshot",
    sha256: sha256(readFileSync(locatorSnapshotPath)),
    bytes: readFileSync(locatorSnapshotPath).byteLength,
  },
  ...exaSeedFiles.map((name) => {
    const content = readFileSync(join(exaSeedDir, name));
    return {
      path: `research/seeds/exa/${name}`,
      role: "exa-executed-research-input",
      sha256: sha256(content),
      bytes: content.byteLength,
    };
  }),
  ...["research/migrations/exa-strategy-evidence.json", "research/migrations/supplemental-census-input.json"].map((path) => {
    const content = readFileSync(join(ROOT, path));
    return { path, role: "normalized-research-input", sha256: sha256(content), bytes: content.byteLength };
  }),
  ...journalFiles.map((name) => {
    const content = readFileSync(join(journalDir, name), "utf8");
    return {
      path: `.omo/ulw-research/20260711-034936/${name}`,
      role: "research-journal-input",
      sha256: sha256(content),
      bytes: Buffer.byteLength(content),
    };
  }),
];
const migration = {
  version: 1,
  generatedAt: SEARCH_EXECUTION_DATE,
  rootSeed: {
    originalPath: "SYNTHESIS.md",
    seedPath: "research/seeds/SYNTHESIS.pre-canonical.md",
    sha256: sha256(seedText),
    immutable: true,
    canonicalStatus: "deprecated-provenance-seed",
  },
  rootPointer: {
    path: "SYNTHESIS.md",
    target: "research/synthesis/SYNTHESIS.md",
    sha256: sha256(ROOT_POINTER),
    claimFree: true,
  },
  inputManifests,
  sourceMappings,
  claimMappings,
  summary: {
    seedSourceCount: sourceMappings.length,
    mappedSeedSourceCount: sourceMappings.filter((mapping) => mapping.canonicalSourceId).length,
    seedClaimAnchorCount: claimMappings.length,
    mappedSeedClaimAnchorCount: claimMappings.filter((mapping) => mapping.canonicalClaimIds.length > 0).length,
    rejectedSeedClaimAnchorCount: claimMappings.filter((mapping) => mapping.disposition !== null).length,
    openLeadCount,
  },
};

const ref = (name) => ({ $ref: `#/$defs/${name}` });
const stringEnum = (values) => ({ type: "string", enum: values });
const stringArray = (items = { type: "string" }, minItems = 0) => ({ type: "array", items, minItems, uniqueItems: true });
const exactObject = (properties, required = Object.keys(properties)) => ({
  type: "object",
  additionalProperties: false,
  required,
  properties,
});
const nullable = (schema) => ({ anyOf: [schema, { type: "null" }] });
const dateSchema = { type: "string", pattern: "^\\d{4}-\\d{2}-\\d{2}$" };
const idSchema = { type: "string", pattern: "^(src|obs|clm|co|ind|adj|buy|ana|str)_[a-z0-9]+(?:-[a-z0-9]+)*$" };
const claimIdArray = stringArray({ type: "string", pattern: "^clm_[a-z0-9]+(?:-[a-z0-9]+)*$" });
const observationIdArray = stringArray({ type: "string", pattern: "^obs_[a-z0-9]+(?:-[a-z0-9]+)*$" });

const schema = {
  $schema: "https://json-schema.org/draft/2020-12/schema",
  $id: "https://local.rl-market-atlas/research/schemas/corpus.schema.json",
  title: "RL market intelligence canonical corpus bundle",
  description: "Validate by wrapping the nine canonical arrays under their filename stems. Cross-file rules are enforced by scripts/research/check-corpus.mjs.",
  ...exactObject({
    sources: { type: "array", items: ref("source") },
    observations: { type: "array", items: ref("observation") },
    claims: { type: "array", items: ref("claim") },
    companies: { type: "array", items: ref("company") },
    industries: { type: "array", items: ref("industry") },
    adjacent: { type: "array", items: ref("adjacent") },
    "buyer-evidence": { type: "array", items: ref("buyerEvidence") },
    "market-analysis": { type: "array", items: ref("marketAnalysis") },
    strategies: { type: "array", items: ref("strategy") },
    "strategy-research-receipts": { type: "array", items: ref("receipt") },
  }),
  $defs: {},
};

schema.$defs.affiliation = exactObject({
  entityRef: { type: "string", pattern: "^(co|adj|buy|src)_[a-z0-9]+(?:-[a-z0-9]+)*$" },
  relationship: stringEnum(["subject", "buyer", "investor", "acquirer", "transaction_counterparty", "commercial_partner", "parent", "syndicator"]),
  validFrom: nullable(dateSchema),
  validTo: nullable(dateSchema),
});
schema.$defs.source = exactObject({
  sourceId: { type: "string", pattern: "^src_[a-z0-9]+(?:-[a-z0-9]+)*$" },
  title: { type: "string", minLength: 1 },
  publisher: { type: "string", minLength: 1 },
  canonicalUrl: { type: "string", pattern: "^https://" },
  archivedUrl: nullable({ type: "string", pattern: "^https://" }),
  sourceType: stringEnum(sourceTypeValues),
  control: stringEnum(["subject_controlled", "commercially_affiliated", "independent", "unclear"]),
  publisherAffiliations: { type: "array", items: ref("affiliation") },
  publishedAt: nullable(dateSchema),
  accessedAt: dateSchema,
  access: stringEnum(["open", "paywalled", "login_gated", "archived", "unavailable", "secondary_only"]),
  lastLinkCheck: exactObject({ checkedAt: dateSchema, rawResult: { type: "string", minLength: 1 }, finalUrl: nullable({ type: "string", pattern: "^https://" }) }),
  accessNotes: nullable({ type: "string", minLength: 1 }),
});
schema.$defs.observation = exactObject({
  observationId: { type: "string", pattern: "^obs_[a-z0-9]+(?:-[a-z0-9]+)*$" },
  sourceId: { type: "string", pattern: "^src_[a-z0-9]+(?:-[a-z0-9]+)*$" },
  locator: exactObject({ kind: stringEnum(["html_heading", "paragraph", "page", "section", "filing_field", "commit"]), value: { type: "string", minLength: 1 } }),
  excerpt: { type: "string", minLength: 1, maxLength: 240 },
  observedAt: dateSchema,
  validAt: nullable(dateSchema),
  observerGroup: { type: "string", minLength: 1, pattern: "\\S" },
  independenceBasis: { type: "string", minLength: 1, pattern: "\\S" },
});
schema.$defs.evidenceLink = exactObject({
  observationId: { type: "string", pattern: "^obs_[a-z0-9]+(?:-[a-z0-9]+)*$" },
  sourceId: { type: "string", pattern: "^src_[a-z0-9]+(?:-[a-z0-9]+)*$" },
  supportRelation: stringEnum(["supports", "partially_supports", "contests", "contradicts", "context_only"]),
  claimAlignment: stringEnum(["subject_controlled", "buyer_controlled", "regulator_authoritative", "academic_independent", "editorial_independent", "investor_aligned", "acquirer_aligned", "transaction_counterparty_aligned", "commercial_partner_aligned", "republication_same_chain", "unknown"]),
  independenceGroup: { type: "string", minLength: 1 },
});
schema.$defs.claim = exactObject({
  claimId: { type: "string", pattern: "^clm_[a-z0-9]+(?:-[a-z0-9]+)*$" },
  statement: { type: "string", minLength: 1 },
  subjectIds: stringArray(idSchema, 1),
  themes: stringArray(stringEnum(["taxonomy", "company", "gtm", "economics", "buyer", "risk", "history", "strategy"]), 1),
  kind: stringEnum(["observation", "reported_claim", "calculation", "inference", "recommendation", "forecast"]),
  confidence: stringEnum(["high", "medium", "low", "unscored"]),
  temporal: stringEnum(["current", "historical", "announced", "superseded", "unknown"]),
  risk: stringEnum(["routine", "material", "high_risk", "unknown"]),
  evidenceLinks: { type: "array", items: ref("evidenceLink"), minItems: 1 },
  contradictionClaimIds: claimIdArray,
  independentGroupCount: { type: "integer", minimum: 0 },
  singleSourceException: nullable(exactObject({ kind: stringEnum(["registry_field", "current_advertised_offer"]), reason: { type: "string", minLength: 1 }, observationId: { type: "string" } })),
  canonicalHash: { type: "string", pattern: "^#/" },
});
schema.$defs.claimGroups = exactObject(Object.fromEntries(["origin", "initialWedge", "evolution", "currentOffer", "buyers", "gtm", "operatingModel", "economics", "milestones", "risks", "currentStatus", "contradictions", "unknowns"].map((key) => [key, claimIdArray])));
schema.$defs.company = exactObject({
  companyId: { type: "string", pattern: "^co_[a-z0-9]+(?:-[a-z0-9]+)*$" },
  name: { type: "string", minLength: 1 }, aliases: stringArray(), canonicalDomain: { type: "string", pattern: "^https://[^/]+$" }, identityClaimId: { type: "string" },
  entityStatus: stringEnum(["active", "acquisition_announced", "acquired_closed", "inactive", "unknown"]), industryIds: stringArray(), primarySegment: stringEnum(segmentValues),
  businessModelIds: stringArray(stringEnum(businessModelValues), 1), claimGroups: ref("claimGroups"), buyerEvidenceIds: stringArray(), comparisonMetricClaimIds: claimIdArray,
});
schema.$defs.industry = exactObject({
  industryId: { type: "string", pattern: "^ind_[a-z0-9]+(?:-[a-z0-9]+)*$" }, name: { type: "string", minLength: 1 }, aliases: stringArray(),
  kind: stringEnum(["reward_regime", "optimization_method", "commercial_layer", "service_model", "ambiguous_term"]),
  valueChainStage: stringEnum(["signal_data", "environment", "post_training", "evaluation_assurance", "deployment", "transformation"]),
  definitionClaimId: { type: "string" }, boundaryClaimIds: claimIdArray, buyerClaimIds: claimIdArray, companyIds: stringArray(), adjacentIds: stringArray(),
});
schema.$defs.adjacent = exactObject({
  adjacentId: { type: "string", pattern: "^adj_[a-z0-9]+(?:-[a-z0-9]+)*$" }, name: { type: "string", minLength: 1 }, aliases: stringArray(), canonicalDomain: { type: "string", pattern: "^https://[^/]+$" },
  primarySegment: stringEnum(segmentValues), secondaryIndustryIds: stringArray(), businessModelIds: stringArray(stringEnum(businessModelValues), 1), entityStatus: stringEnum(["active", "acquisition_announced", "acquired_closed", "inactive", "unknown"]),
  inclusionKind: stringEnum(["direct_supplier", "substitute", "partner", "acquirer", "procurement_competitor"]), inclusionClaimId: { type: "string" }, currentOfferClaimId: { type: "string" }, currentStatusClaimId: { type: "string" }, currentOfferObservationIds: observationIdArray, currentStatusObservationIds: observationIdArray,
});
const buyerEvidenceCommon = {
  buyerEvidenceId: { type: "string", pattern: "^buy_[a-z0-9]+(?:-[a-z0-9]+)*$" },
  buyerName: nullable({ type: "string", minLength: 1 }),
  buyerNameClaimId: nullable({ type: "string" }),
  buyerType: stringEnum(["frontier_lab", "enterprise_ai_team", "regulated_enterprise", "public_sector", "consultancy", "undisclosed", "other"]),
  motion: stringEnum(["research_relationship", "sample", "paid_pilot", "procurement", "expansion", "marketplace", "partnership", "unknown"]),
  evidenceState: stringEnum(["buyer_confirmed", "procurement_confirmed", "vendor_reported_only", "not_publicly_verified"]),
  claimIds: claimIdArray,
  observationIds: observationIdArray,
  outcomeClaimIds: claimIdArray,
  validAt: nullable(dateSchema),
};
schema.$defs.buyerEvidence = {
  oneOf: [
    exactObject({ ...buyerEvidenceCommon, companyId: { type: "string", pattern: "^co_[a-z0-9]+(?:-[a-z0-9]+)*$" } }),
    exactObject({ ...buyerEvidenceCommon, adjacentId: { type: "string", pattern: "^adj_[a-z0-9]+(?:-[a-z0-9]+)*$" } }),
  ],
};
schema.$defs.receipt = exactObject({
  id: { type: "string", pattern: "^rr-[a-z0-9]+(?:-[a-z0-9]+)*$" }, candidateId: stringEnum(candidateValues), dimensionId: stringEnum(dimensionValues), kind: stringEnum(["positive", "negative"]),
  queries: stringArray({ type: "string", minLength: 1 }, 1), searchedDomainClasses: stringArray(stringEnum(domainClassValues), 1), searchedAt: nullable(dateSchema), cutoffAt: dateSchema,
  sourceIds: stringArray(), observationIds: observationIdArray, findings: { type: "string", minLength: 1 }, closure: stringEnum(["evidence_found", "no_public_evidence", "rights_blocker", "duplicate", "dead", "open_unverified"]), templateHash: { type: "string", pattern: "^[a-f0-9]{64}$" },
});
schema.$defs.scoreCell = exactObject({
  measuredLevel: nullable({ type: "integer", minimum: 0, maximum: 5 }), imputation: nullable({ const: "conservative_missing" }), effectiveRawLevel: { type: "integer", minimum: 0, maximum: 5 }, convertedScore: { type: "integer", minimum: 0, maximum: 5 },
  claimIds: claimIdArray, observationIds: observationIdArray, missingReason: nullable({ type: "string", minLength: 1 }), positiveSearchReceiptId: { type: "string" }, negativeSearchReceiptId: { type: "string" },
});

const analysisCommon = {
  analysisId: { type: "string", pattern: "^ana_[a-z0-9]+(?:-[a-z0-9]+)*$" },
  themes: stringArray(stringEnum(["taxonomy", "company", "gtm", "economics", "buyer", "risk", "history", "strategy"]), 1),
};
schema.$defs.marketAnalysis = {
  oneOf: [
    exactObject({ ...analysisCommon, analysisType: { const: "history_event" }, date: dateSchema, claimIds: claimIdArray, companyIds: stringArray(), industryIds: stringArray() }),
    exactObject({ ...analysisCommon, analysisType: { const: "gtm_motion" }, name: { type: "string", minLength: 1 }, stageOrder: { type: "integer", minimum: 1 }, claimIds: claimIdArray, buyerEvidenceIds: stringArray() }),
    exactObject({ ...analysisCommon, analysisType: { const: "economic_model" }, businessModelId: stringEnum(businessModelValues), name: { type: "string", minLength: 1 }, formula: nullable({ type: "string", minLength: 1 }), inputClaimIds: claimIdArray, comparabilityClass: { type: "string", minLength: 1 } }),
    exactObject({ ...analysisCommon, analysisType: { const: "risk" }, name: { type: "string", minLength: 1 }, allegationClaimIds: claimIdArray, incidentClaimIds: claimIdArray, counterevidenceClaimIds: claimIdArray, unknownClaimIds: claimIdArray }),
    exactObject({ ...analysisCommon, analysisType: { const: "metric" }, name: { type: "string", minLength: 1 }, valueClaimId: { type: "string" }, unit: { type: "string", minLength: 1 }, period: nullable({ type: "string", minLength: 1 }), denominator: nullable({ type: "string", minLength: 1 }), comparabilityClass: { type: "string", minLength: 1 } }),
    exactObject({ ...analysisCommon, analysisType: { const: "value_chain_edge" }, fromIndustryId: { type: "string" }, toIndustryId: { type: "string" }, claimIds: claimIdArray }),
  ],
};
const strategyCommon = {
  strategyId: { type: "string", pattern: "^str_[a-z0-9]+(?:-[a-z0-9]+)*$" },
  name: { type: "string", minLength: 1 },
  inferenceClaimIds: claimIdArray,
  observationIds: observationIdArray,
};
schema.$defs.strategy = {
  oneOf: [
    exactObject({
      ...strategyCommon,
      strategyType: { const: "vertical_candidate" },
      verticalCandidateId: stringEnum(candidateValues),
      dimensionCells: exactObject(Object.fromEntries(dimensionValues.map((dimension) => [dimension, ref("scoreCell")]))),
      rawWeightedScore: { type: "number", minimum: 0, maximum: 100 },
      roundedScore: { type: "number", minimum: 0, maximum: 100 },
      caps: stringArray({ type: "string", minLength: 1 }),
      rightsBlocker: { type: "boolean" },
      qualificationFailures: stringArray({ type: "string", minLength: 1 }),
      decisionStatus: stringEnum(["winner", "runner_up", "no_go", "unscored"]),
    }),
    exactObject({
      ...strategyCommon,
      strategyType: { const: "strategic_model" },
      modelId: stringEnum(modelValues),
      eligibility: stringEnum(["eligible_hypothesis", "countersearched_out"]),
      modelClaimIds: claimIdArray,
      prerequisiteClaimIds: claimIdArray,
      killClaimIds: claimIdArray,
    }),
    exactObject({
      ...strategyCommon,
      strategyType: { const: "competitor_response" },
      companyId: { type: "string" },
      incumbentStrengthClaimIds: claimIdArray,
      vulnerableWedgeClaimIds: claimIdArray,
      buyerClaimIds: claimIdArray,
      entryProofClaimIds: claimIdArray,
      likelyCounterMoveClaimIds: claimIdArray,
      prerequisiteClaimIds: claimIdArray,
      noGoTriggerClaimIds: claimIdArray,
    }),
    exactObject({
      ...strategyCommon,
      strategyType: { const: "competitor_response" },
      archetypeId: stringEnum(archetypeValues),
      incumbentStrengthClaimIds: claimIdArray,
      vulnerableWedgeClaimIds: claimIdArray,
      buyerClaimIds: claimIdArray,
      entryProofClaimIds: claimIdArray,
      likelyCounterMoveClaimIds: claimIdArray,
      prerequisiteClaimIds: claimIdArray,
      noGoTriggerClaimIds: claimIdArray,
    }),
    exactObject({
      ...strategyCommon,
      strategyType: { const: "roadmap" },
      horizon: { type: "string", minLength: 1 },
      order: { type: "integer", minimum: 1 },
      actionClaimIds: claimIdArray,
      gateClaimIds: claimIdArray,
    }),
    exactObject({
      ...strategyCommon,
      strategyType: { const: "pricing_experiment" },
      amount: nullable({ type: "number", minimum: 0 }),
      currency: nullable({ type: "string", minLength: 1 }),
      unit: nullable({ type: "string", minLength: 1 }),
      hypothesisClaimIds: claimIdArray,
      successClaimIds: claimIdArray,
      killClaimIds: claimIdArray,
    }),
  ],
};

writeFileSync(join(RESEARCH, "seeds/SYNTHESIS.pre-canonical.md"), seedText, "utf8");
writeJson(join(RESEARCH, "migrations/root-synthesis-seed.json"), migration);
writeJson(join(RESEARCH, "schemas/corpus.schema.json"), schema);
writeJson(join(CORPUS, "sources.json"), sources);
writeJson(join(CORPUS, "observations.json"), observations);
writeJson(join(CORPUS, "claims.json"), claims);
writeJson(join(CORPUS, "companies.json"), companies);
writeJson(join(CORPUS, "industries.json"), industries);
writeJson(join(CORPUS, "adjacent.json"), adjacent);
writeJson(join(CORPUS, "buyer-evidence.json"), buyers);
writeJson(join(CORPUS, "market-analysis.json"), marketAnalysis);
writeJson(join(CORPUS, "strategies.json"), strategies);
writeJson(join(CORPUS, "strategy-research-receipts.json"), receipts);

console.log(
  JSON.stringify(
    {
      sources: sources.length,
      observations: observations.length,
      claims: claims.length,
      companies: companies.length,
      industries: industries.length,
      adjacent: adjacent.length,
      buyerEvidence: buyers.length,
      marketAnalysis: marketAnalysis.length,
      strategies: strategies.length,
      strategyResearchReceipts: receipts.length,
      migrationAnchors: claimMappings.length,
    },
    null,
    2,
  ),
);
