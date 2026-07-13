#!/usr/bin/env node

import { readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

import { DEFAULT_ROOT } from "./corpus-validator.mjs";

const CUTOFF = "2026-07-11";
const SEARCHED_AT = "2026-07-12";
const seedDirectory = join(DEFAULT_ROOT, "research/seeds/exa");
const readSeed = (name) => readFileSync(join(seedDirectory, name), "utf8");
const unique = (values) => [...new Set(values)];
const dimensions = ["pain", "willingnessToPay", "rightsAccess", "verifierFeasibility", "expertSupply", "freshnessBurden", "incumbentPressure"];

const parseLinkedEvidence = (text, candidateId) => {
  const sourceByExternalId = new Map();
  const evidence = new Map();
  for (const line of text.split("\n").filter((value) => value.startsWith("|"))) {
    const link = line.match(/\[([^\]]+)\]\((https:\/\/[^)]+)\)/);
    const ids = line.match(/^\|\s*([^|]+?)\s*\|/)?.[1] ?? "";
    const sourceExternalId = ids.match(/(?:FIN-)?S\d+/)?.[0] ?? null;
    const observationExternalId = ids.match(/O\d+/)?.[0] ?? sourceExternalId;
    if (link && sourceExternalId) sourceByExternalId.set(sourceExternalId, { title: link[1], canonicalUrl: link[2] });
    if (!link || !observationExternalId) continue;
    const excerpts = [...line.matchAll(/“([^”]+)”/g)].map((match) => match[1]);
    if (excerpts.length === 0) continue;
    const publishedAt = line.match(/\b(20\d{2}-\d{2}-\d{2})\b/)?.[1] ?? null;
    const excerpt = excerpts.at(-1).replace(/\s*\(\d+w\)$/, "");
    evidence.set(observationExternalId, {
      evidenceKey: `${candidateId}:${observationExternalId}`,
      title: link[1],
      canonicalUrl: link[2],
      publishedAt,
      excerpt,
      locator: { kind: "paragraph", value: excerpt },
    });
  }
  return { evidence, sourceByExternalId };
};

const parseInsuranceEvidence = (text, candidateId) => {
  const sourceByExternalId = new Map();
  const evidence = new Map();
  for (const line of text.split("\n").filter((value) => /^\| O\d+ \|/.test(value))) {
    const observationExternalId = line.match(/^\| (O\d+) \|/)?.[1];
    const sourceExternalId = line.match(/\| (S\d+)/)?.[1];
    const link = line.match(/\[([^\]]+)\]\((https:\/\/[^)]+)\)/);
    if (link && sourceExternalId) sourceByExternalId.set(sourceExternalId, { title: link[1], canonicalUrl: link[2] });
    const source = sourceByExternalId.get(sourceExternalId);
    const excerpts = [...line.matchAll(/“([^”]+)”/g)].map((match) => match[1]);
    if (!source || !observationExternalId || excerpts.length === 0) continue;
    const cells = line.split("|").map((value) => value.trim());
    const excerpt = excerpts.at(-1);
    evidence.set(observationExternalId, {
      evidenceKey: `${candidateId}:${observationExternalId}`,
      ...source,
      publishedAt: line.match(/\b(20\d{2}-\d{2}-\d{2})\b/)?.[1] ?? null,
      excerpt,
      locator: { kind: "paragraph", value: excerpt },
    });
  }
  return evidence;
};

const parsePublicEvidence = (text, candidateId) => {
  const sources = new Map();
  for (const line of text.split("\n").filter((value) => /^\| S\d+ \|/.test(value))) {
    const sourceExternalId = line.match(/^\| (S\d+) \|/)?.[1];
    const link = line.match(/\[([^\]]+)\]\((https:\/\/[^)]+)\)/);
    if (sourceExternalId && link) sources.set(sourceExternalId, { title: link[1], canonicalUrl: link[2], publishedAt: line.match(/\b(20\d{2}-\d{2}-\d{2})\b/)?.[1] ?? null });
  }
  const evidence = new Map();
  for (const line of text.split("\n").filter((value) => /^\| O\d+ \| R\d+ \| S\d+ \|/.test(value))) {
    const match = line.match(/^\| (O\d+) \| R\d+ \| (S\d+) \|/);
    const excerpt = line.match(/“([^”]+)”/)?.[1];
    const source = sources.get(match?.[2]);
    if (!match || !excerpt || !source) continue;
    evidence.set(match[1], {
      evidenceKey: `${candidateId}:${match[1]}`,
      ...source,
      excerpt,
      locator: { kind: "paragraph", value: excerpt },
    });
  }
  return evidence;
};

const financeText = readSeed("exa-receipts-finance.md");
const insuranceText = readSeed("exa-receipts-insurance.md");
const healthText = readSeed("exa-receipts-health.md");
const enterpriseText = readSeed("exa-receipts-enterprise.md");
const publicText = readSeed("exa-receipts-public.md");
const financeEvidence = parseLinkedEvidence(financeText, "regulated_financial_operations").evidence;
const insuranceEvidence = parseInsuranceEvidence(insuranceText, "insurance_operations");
const healthEvidence = parseLinkedEvidence(healthText, "healthcare_administration").evidence;
const enterpriseEvidence = parseLinkedEvidence(enterpriseText, "enterprise_software_support").evidence;
const publicEvidence = parsePublicEvidence(publicText, "public_sector_administration");

const queryLists = {
  public_sector_administration: Object.fromEntries([...publicText.matchAll(/^\d+\. \*\*Q(\d+):\*\* `([^`]+)`$/gm)].map((match) => [Number(match[1]), match[2]])),
};
const financeQueries = new Map();
for (const [index, block] of financeText.split(/^### \d+\. /gm).slice(1, 8).entries()) {
  const dimensionId = dimensions[index];
  const [positiveBlock, negativeBlock = ""] = block.split("Countersearch queries:");
  financeQueries.set(`${dimensionId}:positive`, [...positiveBlock.matchAll(/^- `([^`]+)`$/gm)].map((match) => match[1]));
  financeQueries.set(`${dimensionId}:negative`, [...negativeBlock.matchAll(/^- `([^`]+)`$/gm)].map((match) => match[1]));
}
const healthQueries = new Map();
for (const match of healthText.matchAll(/\*\*(Positive|Negative) — `(rr-[^`]+)`\*\*([\s\S]*?)(?=\n\*\*(?:Positive|Negative) —|\n### |\n## )/g)) {
  healthQueries.set(match[2], [...match[3].matchAll(/^- S\d+: `([^`]+)`$/gm)].map((query) => query[1]));
}
const insuranceQueries = new Map(
  [...insuranceText.matchAll(/^\| (rr-[^| ]+) \| ([\s\S]*?) \| [a-f0-9]/gm)].map((match) => [
    match[1],
    match[2]
      .split("<br>")
      .map((query) => query.replace(/^\d+\.\s*/, "").replaceAll("&quot;", '"').trim()),
  ]),
);
const enterpriseQueries = new Map();
for (const block of enterpriseText.split(/^### R\d+ — /gm).slice(1)) {
  const id = block.match(/ID: `([^`]+)`/)?.[1];
  const queries = [...block.matchAll(/^> (.+)$/gm)].map((match) => match[1].trim());
  if (id && queries.length > 0) enterpriseQueries.set(id, queries);
}

const parseClassList = (value) =>
  value
    .replaceAll("`", "")
    .split(/\s*[|,]\s*/)
    .map((item) => item.trim())
    .filter(Boolean);
const healthClasses = new Map();
for (const match of healthText.matchAll(/\*\*(?:Positive|Negative) — `(rr-[^`]+)`\*\*([\s\S]*?)(?=\n\*\*(?:Positive|Negative) —|\n### |\n## )/g)) {
  const classes = match[2].match(/^- Classes: ([^\n]+)$/m)?.[1];
  if (classes) healthClasses.set(match[1], parseClassList(classes));
}
const enterpriseClasses = new Map();
for (const block of enterpriseText.split(/^### R\d+ — /gm).slice(1)) {
  const id = block.match(/ID: `([^`]+)`/)?.[1];
  const classes = block.match(/^Searched classes: ([^\n]+)$/m)?.[1];
  if (id && classes) enterpriseClasses.set(id, parseClassList(classes));
}
const publicClasses = [...publicText.matchAll(/^- `searchedDomainClasses`: ([^\n]+)$/gm)].map((match) => parseClassList(match[1]));
const financeClasses = [
  ["regulatory_registry", "buyer_procurement"],
  ["buyer_procurement", "regulatory_registry"],
  ["regulatory_registry"],
  ["regulatory_registry", "academic_primary", "technical_repository"],
  ["secondary_discovery", "regulatory_registry"],
  ["regulatory_registry"],
  ["company_first_party", "buyer_procurement", "regulatory_registry", "academic_primary", "technical_repository"],
];

const lane = (score, positiveKeys, negativeKeys, positiveClosure = "evidence_found", negativeClosure = "evidence_found", scoreKeys = positiveKeys) => ({ score, positiveKeys, negativeKeys, positiveClosure, negativeClosure, scoreKeys });
const candidateDefinitions = {
  regulated_financial_operations: {
    score: [4, 3, 3, 2, 2, 4, 4], rightsBlocker: true, evidence: financeEvidence,
    lanes: [lane(4,["FIN-S01","FIN-S02"],[],"evidence_found","no_public_evidence"),lane(3,["FIN-S04"],["FIN-S06"]),lane(3,["FIN-S07","FIN-S09"],["FIN-S08"]),lane(2,["FIN-S10","FIN-S15"],["FIN-S11"]),lane(2,["FIN-S16","FIN-S17"],["FIN-S18"]),lane(4,["FIN-S20","FIN-S22"],["FIN-S21"]),lane(4,["FIN-S24","FIN-S26"],["FIN-S30"])],
  },
  insurance_operations: {
    score: [2, null, null, 2, 2, null, 2], rightsBlocker: true, evidence: insuranceEvidence,
    lanes: [lane(2,["O01","O03"],["O05"]),lane(null,[],["O08"],"no_public_evidence"),lane(null,["O12"],["O11"],"no_public_evidence"),lane(2,["O14"],["O16"]),lane(2,["O18","O20"],["O22"]),lane(null,["O09","O13","O14","O21","O23"],["O24"],"no_public_evidence","evidence_found",[]),lane(2,["O25","O28"],["O27"],"evidence_found","evidence_found",["O25"])],
  },
  healthcare_administration: {
    score: [4, 4, 3, 2, 3, 2, 4], rightsBlocker: false, evidence: healthEvidence,
    lanes: [lane(4,["O01","O02"],["O03","O04"]),lane(4,["O05","O06"],[],"evidence_found","no_public_evidence"),lane(3,["O07","O08"],["O10","O11"]),lane(2,["O12","O13"],["O14","O15"]),lane(3,["O16"],["O17"]),lane(2,["O18","O19"],["O20","O21","O22"],"evidence_found","evidence_found",["O18","O19","O20","O21","O22"]),lane(4,["O23","O24"],["O25","O26"],"evidence_found","evidence_found",["O25","O26"])],
  },
  enterprise_software_support: {
    score: [4, 5, 0, 4, 4, 3, 4], rightsBlocker: true, evidence: enterpriseEvidence,
    lanes: [lane(4,["O01","O02"],[],"evidence_found","no_public_evidence"),lane(5,["O03","O04"],["O05"]),lane(0,["O06","O07"],["O08"],"rights_blocker","rights_blocker"),lane(4,["O09","O11"],["O12"]),lane(4,["O13","O14"],["O15"]),lane(3,["O16"],["O17","O18"],"evidence_found","evidence_found",["O16","O17","O18"]),lane(4,["O19"],["O20","O21"],"evidence_found","evidence_found",["O20","O21"])],
  },
  public_sector_administration: {
    score: [4, 4, 3, 2, 3, 2, 4], rightsBlocker: false, evidence: publicEvidence,
    lanes: [lane(4,["O01","O03"],["O04","O06"]),lane(4,["O07","O09"],["O10","O11"]),lane(3,["O12"],["O15","O16"]),lane(2,["O17","O19"],["O21"],"evidence_found","evidence_found",["O17","O19"]),lane(3,["O22","O23"],["O25","O26"]),lane(2,["O27","O28"],["O29","O30","O31"],"evidence_found","evidence_found",["O27","O28","O29","O30","O31"]),lane(4,["O32"],["O34","O37"],"no_public_evidence","evidence_found",["O34","O37"])],
  },
};

const scoreClaimStatements = {
  regulated_financial_operations: [
    "Regulator records document a record bank penalty and material fraud losses.",
    "A public procurement record documents paid AI-assurance consultancy for a financial regulator.",
    "Regulator guidance documents controlled synthetic or anonymized data and purpose-limited lawful testing paths.",
    "Shared evaluation and executable state-diff checks establish partial verifier feasibility below the expert-review threshold for raw level 3.",
    "Credential bodies document large professional pools but not a repeatable recruitment and calibration path.",
    "Official sanctions and financial-crime pages expose a large update ledger and operational typology advisories.",
    "Google and Oracle advertise financial-crime AI scoring and simulation products.",
  ],
  insurance_operations: [
    "Industry reports document long settlement periods and persistent manual claims work.",
    "No buyer-controlled purchase of the proposed assurance pack was retained.",
    "A controlled regulator sandbox does not establish transferable production-data rights.",
    "Insurance regulation requires verification and testing methods that identify model errors and bias.",
    "Government statistics document sizable underwriter and claims-adjuster labor pools.",
    "The bounded search found recurring change signals but no qualifying public cadence, so freshness burden remains conservatively missing.",
    "Guidewire and Shift document one credible installed insurance-platform substitute; a second independent incumbent is not retained for scoring.",
  ],
  healthcare_administration: [
    "Research and inspector-general records document provider revenue loss and prior-authorization denial rates.",
    "UC Davis Health and NYC Health and Hospitals issued procurement materials for revenue-cycle work.",
    "HHS and CMS document scoped business-associate and provider-API access paths.",
    "CMS documents deterministic claim edits plus licensed review for complex cases.",
    "Labor statistics document a formal education pathway for medical-records specialists.",
    "CMS publishes annual and quarterly coding-update schedules.",
    "Issuer filings document scaled, bundled healthcare revenue-cycle platforms.",
  ],
  enterprise_software_support: [
    "Two government audits document prolonged service impairment and missed restoration targets.",
    "Two public procurement records document multi-year enterprise-support or chatbot purchases.",
    "Vendor terms preserve customer ownership while restricting benchmarking and competitive access.",
    "Academic evidence documents real-time validator feedback and low-false-positive verifier designs.",
    "Government sources document a large support workforce and a formal technical-support pathway.",
    "Vendor release policies range from annual support upgrades to frequent SaaS changes.",
    "Salesforce and Microsoft advertise bundled service agents and support tooling.",
  ],
  public_sector_administration: [
    "Audit and academic records document large administrative backlogs and repetitive workload.",
    "Two government procurement records document material administrative-automation contract values.",
    "A government guide documents accredited access to anonymized, research-ready administrative data.",
    "Policy-to-code and sandbox evidence establish partial verifier feasibility, but not majority automated outcome checking plus expert review.",
    "Government studies document caseworker recruitment and professional-development channels.",
    "Annual statutory instruments document a predictable core benefits-update cycle.",
    "Government awards name Deloitte and Accenture as incumbent administrative-system suppliers.",
  ],
};

const publicQueryIds = [[1,15,2,16],[3,4],[5,6],[7,8],[9,10],[11,17,12,18],[13,14]];
const fallbackClassesByDimension = {
  pain: ["buyer_procurement","regulatory_registry","academic_primary"],
  willingnessToPay: ["buyer_procurement","independent_reporting"],
  rightsAccess: ["regulatory_registry","technical_repository"],
  verifierFeasibility: ["regulatory_registry","technical_repository","academic_primary"],
  expertSupply: ["regulatory_registry","academic_primary","secondary_discovery"],
  freshnessBurden: ["regulatory_registry","company_first_party","technical_repository"],
  incumbentPressure: ["buyer_procurement","company_first_party","independent_reporting"],
};
const allEvidence = new Map();
const receipts = [];
const candidates = {};
for (const [candidateId, definition] of Object.entries(candidateDefinitions)) {
  candidates[candidateId] = { rightsBlocker: definition.rightsBlocker, cells: {} };
  for (const [index, dimensionId] of dimensions.entries()) {
    const laneDefinition = definition.lanes[index];
    const base = `rr-${candidateId.replaceAll("_", "-")}-${dimensionId.toLowerCase()}`;
    const reportBase = `rr-${candidateId.replaceAll("_", "-")}-${dimensionId.replace(/([a-z])([A-Z])/g, "$1-$2").toLowerCase()}`;
    const publicIds = publicQueryIds[index];
    let positiveQueries;
    let negativeQueries;
    if (candidateId === "public_sector_administration") {
      positiveQueries = publicIds.slice(0, Math.ceil(publicIds.length / 2)).map((id) => queryLists[candidateId][id]);
      negativeQueries = publicIds.slice(Math.ceil(publicIds.length / 2)).map((id) => queryLists[candidateId][id]);
    } else if (candidateId === "insurance_operations") {
      positiveQueries = insuranceQueries.get(`${base}-positive`);
      negativeQueries = insuranceQueries.get(`${base}-negative`);
    } else if (candidateId === "enterprise_software_support") {
      positiveQueries = enterpriseQueries.get(`${reportBase}-positive`);
      negativeQueries = enterpriseQueries.get(`${reportBase}-negative`);
    } else if (candidateId === "regulated_financial_operations") {
      positiveQueries = financeQueries.get(`${dimensionId}:positive`);
      negativeQueries = financeQueries.get(`${dimensionId}:negative`);
    } else if (candidateId === "healthcare_administration") {
      positiveQueries = healthQueries.get(`${reportBase}-positive`);
      negativeQueries = healthQueries.get(`${reportBase}-negative`);
    } else {
      throw new Error(`No query adapter for ${candidateId}`);
    }
    const keys = [...laneDefinition.positiveKeys, ...laneDefinition.negativeKeys];
    for (const key of keys) {
      const item = definition.evidence.get(key);
      if (!item) throw new Error(`Missing ${candidateId} evidence ${key}`);
      allEvidence.set(item.evidenceKey, item);
    }
    const rawPositiveId = `${reportBase}-positive`;
    const rawNegativeId = `${reportBase}-negative`;
    const laneClasses = candidateId === "healthcare_administration"
      ? healthClasses.get(rawPositiveId)
      : candidateId === "enterprise_software_support"
        ? enterpriseClasses.get(rawPositiveId)
        : candidateId === "public_sector_administration"
          ? publicClasses[index]
          : candidateId === "regulated_financial_operations"
            ? financeClasses[index]
            : fallbackClassesByDimension[dimensionId];
    if (!laneClasses || laneClasses.length === 0) throw new Error(`Missing searched domain classes for ${candidateId}/${dimensionId}`);
    const positiveFindings = laneDefinition.positiveClosure === "evidence_found"
      ? `Executed Exa evidence lane supports the recorded ${dimensionId} score boundary; retained excerpts and cutoff metadata are claim-specific.`
      : laneDefinition.positiveClosure === "rights_blocker"
        ? `Executed Exa evidence lane retained claim-specific evidence of a rights blocker for ${dimensionId}.`
        : `Executed Exa evidence lane found no qualifying public evidence for a measured ${dimensionId} score; contextual results do not establish the fixed proposition.`;
    const negativeFindings = laneDefinition.negativeClosure === "no_public_evidence"
      ? `Executed countersearch found no retained qualifying public evidence for the fixed ${dimensionId} proposition; absence is not asserted beyond this bounded search.`
      : laneDefinition.negativeClosure === "rights_blocker"
        ? `Executed Exa countersearch retained claim-specific evidence of a rights blocker for ${dimensionId}.`
        : `Executed Exa countersearch retained claim-specific limiting or contrary evidence for ${dimensionId}.`;
    receipts.push({ id: `${base}-positive`, candidateId, dimensionId, kind: "positive", queries: positiveQueries, searchedDomainClasses: laneClasses, searchedAt: SEARCHED_AT, cutoffAt: CUTOFF, evidenceKeys: laneDefinition.positiveKeys.map((key) => `${candidateId}:${key}`), findings: positiveFindings, closure: laneDefinition.positiveClosure });
    receipts.push({ id: `${base}-negative`, candidateId, dimensionId, kind: "negative", queries: negativeQueries, searchedDomainClasses: candidateId === "healthcare_administration" ? healthClasses.get(rawNegativeId) : candidateId === "enterprise_software_support" ? enterpriseClasses.get(rawNegativeId) : laneClasses, searchedAt: SEARCHED_AT, cutoffAt: CUTOFF, evidenceKeys: laneDefinition.negativeKeys.map((key) => `${candidateId}:${key}`), findings: negativeFindings, closure: laneDefinition.negativeClosure });
    candidates[candidateId].cells[dimensionId] = { measuredLevel: laneDefinition.score, scoreEvidenceKeys: laneDefinition.score === null ? [] : laneDefinition.scoreKeys.map((key) => `${candidateId}:${key}`), finding: scoreClaimStatements[candidateId][index] };
  }
}

for (const receipt of receipts) {
  if (!Array.isArray(receipt.queries) || receipt.queries.length === 0 || receipt.queries.some((query) => !query)) throw new Error(`Missing queries for ${receipt.id}`);
}
writeFileSync(join(DEFAULT_ROOT, "research/migrations/exa-strategy-evidence.json"), `${JSON.stringify({ version: 1, evidenceCutoff: CUTOFF, searchedAt: SEARCHED_AT, sourceSeedPaths: ["research/seeds/exa/exa-receipts-finance.md","research/seeds/exa/exa-receipts-insurance.md","research/seeds/exa/exa-receipts-health.md","research/seeds/exa/exa-receipts-enterprise.md","research/seeds/exa/exa-receipts-public.md"], evidence: [...allEvidence.values()], candidates, receipts }, null, 2)}\n`);
console.log(`EXA_STRATEGY_COMPILED evidence=${allEvidence.size} receipts=${receipts.length}`);
