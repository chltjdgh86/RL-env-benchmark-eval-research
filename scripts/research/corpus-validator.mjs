import { createHash } from "node:crypto";
import { existsSync, readFileSync, readdirSync, realpathSync, statSync } from "node:fs";
import { dirname, isAbsolute, join, relative, resolve, sep } from "node:path";
import { fileURLToPath } from "node:url";

import { validateCorpusAgainstSchema } from "./json-schema-validator.mjs";
import { approvedRedirectOriginsFor, classifyRedirect } from "./link-audit-policy.mjs";
import { evaluateVerticalCandidates } from "./strategy-qualification.mjs";

const HERE = dirname(fileURLToPath(import.meta.url));
export const DEFAULT_ROOT = resolve(HERE, "../..");
export const EXPECTED_ROOT_POINTER = `# Research synthesis moved

This file is a claim-free deprecation pointer.

Canonical generated research: [\`research/synthesis/SYNTHESIS.md\`](research/synthesis/SYNTHESIS.md)

Provenance seed: [\`research/seeds/SYNTHESIS.pre-canonical.md\`](research/seeds/SYNTHESIS.pre-canonical.md)
`;

export const FILES = {
  sources: "sources.json",
  observations: "observations.json",
  claims: "claims.json",
  companies: "companies.json",
  industries: "industries.json",
  adjacent: "adjacent.json",
  buyerEvidence: "buyer-evidence.json",
  marketAnalysis: "market-analysis.json",
  strategies: "strategies.json",
  receipts: "strategy-research-receipts.json",
};

export const SEGMENTS = [
  "training_data_workforce",
  "expert_talent_network",
  "environment_computer_use_runtime",
  "eval_observability_assurance",
  "post_training_rl_infrastructure",
  "agent_ax_services",
  "incumbent_bpo_consulting",
];
export const BUSINESS_MODELS = [
  "managed_data_bpo",
  "expert_marketplace",
  "employee_bpo",
  "expert_environment_services",
  "eval_observability_saas",
  "runtime_infrastructure",
  "proprietary_data_acquisition",
];
export const CANDIDATES = [
  "regulated_financial_operations",
  "insurance_operations",
  "healthcare_administration",
  "enterprise_software_support",
  "public_sector_administration",
];
export const DIMENSIONS = [
  "pain",
  "willingnessToPay",
  "rightsAccess",
  "verifierFeasibility",
  "expertSupply",
  "freshnessBurden",
  "incumbentPressure",
];
export const MODELS = [
  "vertical_domain_assurance_pack",
  "specialist_independent_eval_lab",
  "environment_foundry",
  "ax_transformation_studio",
];
export const ARCHETYPES = [
  "managed_data_bpo",
  "expert_workforce_marketplace",
  "environment_foundry_gym",
  "eval_observability_saas",
  "independent_assurance_lab",
  "post_training_runtime_infrastructure",
  "ax_transformation_consultancy",
];

const SOURCE_TYPES = ["regulatory_record", "procurement_record", "buyer_first_party", "company_first_party", "technical_artifact", "academic_primary", "repository_primary", "independent_reporting", "investor_first_party", "partner_first_party", "secondary_aggregator", "other"];
const CONTROLS = ["subject_controlled", "commercially_affiliated", "independent", "unclear"];
const ACCESS = ["open", "paywalled", "login_gated", "archived", "unavailable", "secondary_only"];
const SUPPORT_RELATIONS = ["supports", "partially_supports", "contests", "contradicts", "context_only"];
const ALIGNMENTS = ["subject_controlled", "buyer_controlled", "regulator_authoritative", "academic_independent", "editorial_independent", "investor_aligned", "acquirer_aligned", "transaction_counterparty_aligned", "commercial_partner_aligned", "republication_same_chain", "unknown"];
const ELIGIBLE_ALIGNMENTS = new Set(["regulator_authoritative", "academic_independent", "editorial_independent"]);
const THEMES = ["taxonomy", "company", "gtm", "economics", "buyer", "risk", "history", "strategy"];
const KINDS = ["observation", "reported_claim", "calculation", "inference", "recommendation", "forecast"];
const CONFIDENCE = ["high", "medium", "low", "unscored"];
const TEMPORAL = ["current", "historical", "announced", "superseded", "unknown"];
const RISKS = ["routine", "material", "high_risk", "unknown"];
const ENTITY_STATUS = ["active", "acquisition_announced", "acquired_closed", "inactive", "unknown"];
const CLAIM_GROUPS = ["origin", "initialWedge", "evolution", "currentOffer", "buyers", "gtm", "operatingModel", "economics", "milestones", "risks", "currentStatus", "contradictions", "unknowns"];
const DOMAIN_CLASSES = ["buyer_procurement", "regulatory_registry", "company_first_party", "technical_repository", "academic_primary", "independent_reporting", "investor_partner", "secondary_discovery"];
const ID = /^(src|obs|clm|co|ind|adj|buy|ana|str)_[a-z0-9]+(?:-[a-z0-9]+)*$/;
const DATE = /^\d{4}-\d{2}-\d{2}$/;
const RECEIPT_ID = /^rr-[a-z0-9]+(?:-[a-z0-9]+)*$/;
const INTERSTITIAL_TEXT = /\b(?:access denied|attention required|checking your browser|enable javascript(?: and cookies)?|just a moment|pardon our interruption|sorry, you have been blocked|verify you are human|403 forbidden)\b/i;

const asArray = (value) => (Array.isArray(value) ? value : []);
const unique = (values) => [...new Set(values)];
const groupSlug = (value) => String(value).toLowerCase().normalize("NFKD").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
const sameStringSet = (left, right) => {
  const leftValues = unique(asArray(left)).sort();
  const rightValues = unique(asArray(right)).sort();
  return leftValues.length === rightValues.length && leftValues.every((value, index) => value === rightValues[index]);
};
const sha256 = (value) => createHash("sha256").update(value).digest("hex");
export const deriveReceiptTemplateHash = (receipt) => {
  const candidate = String(receipt?.candidateId ?? "").replaceAll("_", " ");
  const queryTemplates = asArray(receipt?.queries).map((query) =>
    String(query)
      .trim()
      .replaceAll(candidate, "{candidate}")
      .replaceAll(String(receipt?.dimensionId ?? ""), "{dimension}")
      .replace(/\s+/g, " ")
      .toLowerCase(),
  );
  return sha256(JSON.stringify({
    kind: receipt?.kind,
    queryTemplates,
    searchedDomainClasses: [...asArray(receipt?.searchedDomainClasses)].sort(),
  }));
};
const isTransportCapture = (entry) =>
  String(entry?.captureMethod ?? "").startsWith("transport-") ||
  ([403, 404].includes(entry?.status) &&
    !String(entry?.captureMethod ?? "").startsWith("search-indexed-") &&
    !String(entry?.captureMethod ?? "").startsWith("archived-"));
const isInaccessibleSearchIndexCapture = (entry) =>
  Number(entry?.status) >= 400 && String(entry?.captureMethod ?? "").startsWith("search-indexed-");
const AFFILIATION_ALIGNMENT = Object.freeze({
  subject: "subject_controlled",
  buyer: "buyer_controlled",
  investor: "investor_aligned",
  acquirer: "acquirer_aligned",
  transaction_counterparty: "transaction_counterparty_aligned",
  commercial_partner: "commercial_partner_aligned",
  parent: "acquirer_aligned",
  syndicator: "republication_same_chain",
});
const AFFILIATION_PRIORITY = ["subject", "buyer", "acquirer", "transaction_counterparty", "investor", "commercial_partner", "parent", "syndicator"];
const expectedClaimAlignment = (source, subjectIds) => {
  if (asArray(source?.publisherAffiliations).some((affiliation) => affiliation.relationship === "syndicator")) return "republication_same_chain";
  const relevantAffiliation = asArray(source?.publisherAffiliations)
    .filter((affiliation) => asArray(subjectIds).includes(affiliation.entityRef))
    .sort((left, right) => AFFILIATION_PRIORITY.indexOf(left.relationship) - AFFILIATION_PRIORITY.indexOf(right.relationship))[0];
  if (relevantAffiliation) return AFFILIATION_ALIGNMENT[relevantAffiliation.relationship];
  if (source?.sourceType === "regulatory_record" || source?.sourceType === "procurement_record") return "regulator_authoritative";
  if (source?.sourceType === "academic_primary") return "academic_independent";
  if (source?.sourceType === "independent_reporting") return "editorial_independent";
  if (source?.sourceType === "buyer_first_party" || source?.sourceType === "technical_artifact") return "buyer_controlled";
  if (source?.sourceType === "investor_first_party") return "investor_aligned";
  if (source?.sourceType === "partner_first_party") return "commercial_partner_aligned";
  return "subject_controlled";
};
const EXPECTED_CONTROLS_BY_SOURCE_TYPE = Object.freeze({
  academic_primary: ["independent"],
  buyer_first_party: ["independent"],
  company_first_party: ["subject_controlled"],
  independent_reporting: ["independent"],
  investor_first_party: ["commercially_affiliated"],
  partner_first_party: ["subject_controlled", "commercially_affiliated"],
  procurement_record: ["independent"],
  regulatory_record: ["independent"],
  repository_primary: ["independent"],
  technical_artifact: ["subject_controlled"],
});
const hostMatches = (host, domain) => host === domain || host.endsWith(`.${domain}`);
const expectedSourceIdentity = (url) => {
  const host = new URL(url).hostname.replace(/^www\./, "");
  const publisherLabels = {
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
  const publisher = Object.entries(publisherLabels).find(([domain]) => hostMatches(host, domain))?.[1] ?? host;
  let sourceType = "company_first_party";
  const lowerUrl = url.toLowerCase();
  if (host === "find-tender.service.gov.uk" || host === "ted.europa.eu" || lowerUrl.includes("requestid=") || lowerUrl.includes("/rfp") || lowerUrl.includes("_rfp") || lowerUrl.includes("/supply-chain/")) sourceType = "procurement_record";
  else if (host === "sec.gov" || host.endsWith(".gov") || host.endsWith(".gov.au") || host.endsWith(".gov.uk") || host.endsWith(".mil") || host === "gov.uk" || host === "gov.scot" || host === "legislation.gov.uk" || host === "nao.org.uk" || host === "edps.europa.eu" || host === "ia.org.hk" || host === "fca.org.uk" || host === "ico.org.uk" || host === "bis.org") sourceType = "regulatory_record";
  else if (host === "announcements.asx.com.au") sourceType = "buyer_first_party";
  else if (["acams.org", "theiia.org", "cfainstitute.org", "ahima.org", "aha.org"].some((domain) => hostMatches(host, domain))) sourceType = "buyer_first_party";
  else if (["arxiv.org", "healthaffairs.org", "aclanthology.org", "doi.org", "nber.org", "turing.ac.uk", "tobin.yale.edu", "digitalgovernmenthub.org"].some((domain) => hostMatches(host, domain))) sourceType = "academic_primary";
  else if (host === "pypi.org" || host === "huggingface.co" || host === "github.com") sourceType = "repository_primary";
  else if (host === "research.nvidia.com") sourceType = "technical_artifact";
  else if (["bloomberglaw.com", "forbes.com", "wired.com", "theinformation.com", "epoch.ai", "gartner.com", "ciodive.com", "insurancebusinessmag.com", "claimspages.com", "riskandinsurance.com", "carnegieuk.org", "adalovelaceinstitute.org"].some((domain) => hostMatches(host, domain))) sourceType = "independent_reporting";
  else if (host === "ycombinator.com" || host === "a16z.com") sourceType = "investor_first_party";
  else if (host === "primeintellect.ai" || host === "browserbase.com") sourceType = "partner_first_party";
  return { publisher, sourceType };
};
const independenceGroupFor = (source, sourceMap) => {
  const syndicator = asArray(source.publisherAffiliations).find((affiliation) => affiliation.relationship === "syndicator");
  const chainSource = sourceMap.get(syndicator?.entityRef) ?? source;
  if (chainSource.sourceType === "academic_primary") return `academic-work:${new URL(chainSource.canonicalUrl).href}`;
  return `source-chain:${groupSlug(chainSource.publisher)}`;
};
const resolveRootedPath = (root, candidate) => {
  if (typeof candidate !== "string" || candidate.trim() === "") return null;
  const rootPath = resolve(root);
  const absolute = resolve(rootPath, candidate);
  const relativePath = relative(rootPath, absolute);
  if (relativePath === ".." || relativePath.startsWith(`..${sep}`) || isAbsolute(relativePath)) return null;
  try {
    const realRoot = realpathSync(rootPath);
    let existingAncestor = absolute;
    while (!existsSync(existingAncestor) && dirname(existingAncestor) !== existingAncestor) existingAncestor = dirname(existingAncestor);
    const realAncestor = realpathSync(existingAncestor);
    const realRelative = relative(realRoot, realAncestor);
    if (realRelative === ".." || realRelative.startsWith(`..${sep}`) || isAbsolute(realRelative)) return null;
    return existsSync(absolute) ? realpathSync(absolute) : absolute;
  } catch {
    return null;
  }
};
const isHttpsOrigin = (value) => {
  if (typeof value !== "string" || !value.isWellFormed()) return false;
  try {
    const parsed = new URL(value);
    return parsed.protocol === "https:" && parsed.username === "" && parsed.password === "" && parsed.origin === value;
  } catch {
    return false;
  }
};
const isHttpsUrl = (value) => {
  if (typeof value !== "string" || !value.isWellFormed()) return false;
  try {
    const parsed = new URL(value);
    return parsed.protocol === "https:" && parsed.username === "" && parsed.password === "";
  } catch {
    return false;
  }
};

export function loadCorpus(root = DEFAULT_ROOT) {
  const directory = join(root, "research/corpus");
  return Object.fromEntries(
    Object.entries(FILES).map(([key, file]) => [key, JSON.parse(readFileSync(join(directory, file), "utf8"))]),
  );
}

export function deriveSupportSummary(claim) {
  const relations = asArray(claim?.evidenceLinks).map((link) => link.supportRelation);
  const positive = relations.some((relation) => relation === "supports" || relation === "partially_supports");
  if (relations.includes("contests") || (positive && relations.includes("contradicts"))) return "contested";
  if (!positive && relations.includes("contradicts")) return "contradicted";
  if (relations.includes("supports")) return "supported";
  if (relations.includes("partially_supports")) return "partially_supported";
  return "not_publicly_verified";
}

const errorCollector = () => {
  const errors = [];
  return {
    errors,
    add(code, path, message) {
      errors.push({ code, path, message });
    },
  };
};

const validateExactKeys = (collector, value, expected, path) => {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    collector.add("INVALID_OBJECT", path, "Expected an object");
    return;
  }
  const actual = Object.keys(value);
  for (const key of actual) {
    if (!expected.includes(key)) collector.add("UNKNOWN_OBJECT_KEY", `${path}.${key}`, `Unknown key ${key}`);
  }
  for (const key of expected) {
    if (!Object.hasOwn(value, key)) collector.add("MISSING_OBJECT_KEY", `${path}.${key}`, `Missing key ${key}`);
  }
};

const validateEnum = (collector, value, allowed, path) => {
  if (!allowed.includes(value)) collector.add("INVALID_ENUM", path, `Expected one of ${allowed.join(", ")}`);
};

const validateDate = (collector, value, path, nullable = false) => {
  if (value === null && nullable) return;
  if (typeof value !== "string" || !DATE.test(value) || Number.isNaN(Date.parse(`${value}T00:00:00Z`))) {
    collector.add("INVALID_DATE", path, "Expected an ISO YYYY-MM-DD date");
  }
};

const validateUniqueArray = (collector, value, path, { min = 0 } = {}) => {
  if (!Array.isArray(value)) {
    collector.add("INVALID_ARRAY", path, "Expected an array");
    return [];
  }
  if (value.length < min) collector.add("EMPTY_REQUIRED_ARRAY", path, `Expected at least ${min} item(s)`);
  const serialized = value.map((item) => JSON.stringify(item));
  if (new Set(serialized).size !== value.length) collector.add("DUPLICATE_ARRAY_VALUE", path, "Array values must be unique");
  return value;
};

const addDuplicateErrors = (collector, values, key, path, code = "DUPLICATE_ID") => {
  const seen = new Set();
  for (const [index, value] of values.entries()) {
    const id = value?.[key];
    if (seen.has(id)) collector.add(code, `${path}[${index}].${key}`, `Duplicate ${id}`);
    seen.add(id);
  }
};

export function validateCorpus(corpus) {
  const collector = errorCollector();
  const schemaErrors = validateCorpusAgainstSchema(corpus, DEFAULT_ROOT);
  const rootCollections = [
    corpus?.sources,
    corpus?.observations,
    corpus?.claims,
    corpus?.companies,
    corpus?.industries,
    corpus?.adjacent,
    corpus?.buyerEvidence,
    corpus?.marketAnalysis,
    corpus?.strategies,
    corpus?.receipts,
  ];
  const unsafeTopLevelItem = rootCollections.some((collection) =>
    !Array.isArray(collection) || collection.some((item) => item === null || typeof item !== "object" || Array.isArray(item)),
  );
  const unsafeEvidenceLink = Array.isArray(corpus?.claims) && corpus.claims.some((claim) =>
    claim && (!Array.isArray(claim.evidenceLinks) || claim.evidenceLinks.some((link) => link === null || typeof link !== "object" || Array.isArray(link))),
  );
  const unsafeSchemaShape = schemaErrors.some((error) => /^Expected (?:object|array)$/.test(error.message));
  if (unsafeTopLevelItem || unsafeEvidenceLink || unsafeSchemaShape) return schemaErrors;
  const sources = asArray(corpus?.sources);
  const observations = asArray(corpus?.observations);
  const claims = asArray(corpus?.claims);
  const companies = asArray(corpus?.companies);
  const industries = asArray(corpus?.industries);
  const adjacent = asArray(corpus?.adjacent);
  const buyerEvidence = asArray(corpus?.buyerEvidence);
  const marketAnalysis = asArray(corpus?.marketAnalysis);
  const strategies = asArray(corpus?.strategies);
  const receipts = asArray(corpus?.receipts);

  for (const [values, key, path] of [[sources, "sourceId", "sources"], [observations, "observationId", "observations"], [claims, "claimId", "claims"], [companies, "companyId", "companies"], [industries, "industryId", "industries"], [adjacent, "adjacentId", "adjacent"], [buyerEvidence, "buyerEvidenceId", "buyerEvidence"], [marketAnalysis, "analysisId", "marketAnalysis"], [strategies, "strategyId", "strategies"], [receipts, "id", "receipts"]]) {
    addDuplicateErrors(collector, values, key, path, key === "id" ? "DUPLICATE_SEARCH_RECEIPT" : "DUPLICATE_ID");
  }

  const sourceMap = new Map(sources.map((value) => [value.sourceId, value]));
  const observationMap = new Map(observations.map((value) => [value.observationId, value]));
  const claimMap = new Map(claims.map((value) => [value.claimId, value]));
  const companyMap = new Map(companies.map((value) => [value.companyId, value]));
  const industryMap = new Map(industries.map((value) => [value.industryId, value]));
  const adjacentMap = new Map(adjacent.map((value) => [value.adjacentId, value]));
  const buyerMap = new Map(buyerEvidence.map((value) => [value.buyerEvidenceId, value]));
  const analysisMap = new Map(marketAnalysis.map((value) => [value.analysisId, value]));
  const strategyMap = new Map(strategies.map((value) => [value.strategyId, value]));
  const receiptMap = new Map(receipts.map((value) => [value.id, value]));
  const entityIds = new Set([...companyMap.keys(), ...industryMap.keys(), ...adjacentMap.keys(), ...buyerMap.keys(), ...analysisMap.keys(), ...strategyMap.keys(), ...sourceMap.keys()]);
  const affiliationEntityIds = new Set([...companyMap.keys(), ...adjacentMap.keys(), ...buyerMap.keys(), ...sourceMap.keys()]);
  const subjectDomains = [...companies.map((record) => [record.companyId, record.canonicalDomain]), ...adjacent.map((record) => [record.adjacentId, record.canonicalDomain])]
    .flatMap(([entityRef, domain]) => {
      try {
        return [[entityRef, new URL(domain).hostname.replace(/^www\./, "")]];
      } catch {
        return [];
      }
    });
  const seenSourceUrls = new Set();

  for (const [index, source] of sources.entries()) {
    const path = `sources[${index}]`;
    validateExactKeys(collector, source, ["sourceId", "title", "publisher", "canonicalUrl", "archivedUrl", "sourceType", "control", "publisherAffiliations", "publishedAt", "accessedAt", "access", "lastLinkCheck", "accessNotes"], path);
    if (!ID.test(source.sourceId ?? "")) collector.add("INVALID_ID", `${path}.sourceId`, "Invalid source ID");
    if (typeof source.title !== "string" || source.title.trim() === "") collector.add("BLANK_REQUIRED_STRING", `${path}.title`, "Title must be nonblank");
    if (typeof source.publisher !== "string" || source.publisher.trim() === "") collector.add("BLANK_REQUIRED_STRING", `${path}.publisher`, "Publisher must be nonblank");
    if (!isHttpsUrl(source.canonicalUrl)) collector.add("INVALID_HTTPS_URL", `${path}.canonicalUrl`, "Canonical URL must be a well-formed HTTPS URL without credentials");
    if (seenSourceUrls.has(source.canonicalUrl)) collector.add("DUPLICATE_SOURCE_URL", `${path}.canonicalUrl`, `Canonical source URL ${source.canonicalUrl} is reused`);
    seenSourceUrls.add(source.canonicalUrl);
    if (source.archivedUrl !== null && !isHttpsUrl(source.archivedUrl)) collector.add("INVALID_HTTPS_URL", `${path}.archivedUrl`, "Archived URL must be a well-formed HTTPS URL or null");
    validateEnum(collector, source.sourceType, SOURCE_TYPES, `${path}.sourceType`);
    validateEnum(collector, source.control, CONTROLS, `${path}.control`);
    const expectedControls = EXPECTED_CONTROLS_BY_SOURCE_TYPE[source.sourceType];
    if (expectedControls && !expectedControls.includes(source.control)) collector.add("SOURCE_TYPE_CONTROL_MISMATCH", path, `${source.sourceType} requires control in ${expectedControls.join(", ")}`);
    if (isHttpsUrl(source.canonicalUrl)) {
      const expectedIdentity = expectedSourceIdentity(source.canonicalUrl);
      if (source.sourceType !== expectedIdentity.sourceType) collector.add("SOURCE_TYPE_DOMAIN_MISMATCH", `${path}.sourceType`, `Expected ${expectedIdentity.sourceType} for ${source.canonicalUrl}`);
      if (source.publisher !== expectedIdentity.publisher) collector.add("PUBLISHER_DOMAIN_MISMATCH", `${path}.publisher`, `Expected ${expectedIdentity.publisher} for ${source.canonicalUrl}`);
    }
    validateEnum(collector, source.access, ACCESS, `${path}.access`);
    validateDate(collector, source.publishedAt, `${path}.publishedAt`, true);
    validateDate(collector, source.accessedAt, `${path}.accessedAt`);
    validateExactKeys(collector, source.lastLinkCheck, ["checkedAt", "rawResult", "finalUrl"], `${path}.lastLinkCheck`);
    validateDate(collector, source.lastLinkCheck?.checkedAt, `${path}.lastLinkCheck.checkedAt`);
    if (source.lastLinkCheck?.finalUrl !== null && !isHttpsUrl(source.lastLinkCheck?.finalUrl)) collector.add("INVALID_HTTPS_URL", `${path}.lastLinkCheck.finalUrl`, "Final URL must be a well-formed HTTPS URL or null");
    if (!Array.isArray(source.publisherAffiliations)) collector.add("INVALID_ARRAY", `${path}.publisherAffiliations`, "Publisher affiliations must be an array");
    const hasSubjectAffiliation = asArray(source.publisherAffiliations).some((affiliation) => affiliation?.relationship === "subject");
    if (hasSubjectAffiliation && source.control !== "subject_controlled") collector.add("AFFILIATION_CONTROL_MISMATCH", `${path}.control`, "A source affiliated to its subject cannot be classified as independent or merely unclear");
    const hasCommercialAffiliation = asArray(source.publisherAffiliations).some((affiliation) => ["investor", "acquirer", "transaction_counterparty", "commercial_partner", "parent"].includes(affiliation?.relationship));
    if (hasCommercialAffiliation && source.control === "independent") collector.add("AFFILIATION_CONTROL_MISMATCH", `${path}.control`, "A commercially affiliated source cannot be classified as independent");
    try {
      const sourceHost = new URL(source.canonicalUrl).hostname.replace(/^www\./, "");
      for (const [entityRef, domain] of subjectDomains.filter(([, domain]) => sourceHost === domain || sourceHost.endsWith(`.${domain}`))) {
        if (!asArray(source.publisherAffiliations).some((affiliation) => affiliation.relationship === "subject" && affiliation.entityRef === entityRef)) {
          collector.add("MISSING_SUBJECT_AFFILIATION", `${path}.publisherAffiliations`, `${source.sourceId} must retain its subject affiliation to ${entityRef}`);
        }
      }
    } catch {
      // URL validation reports the malformed source separately.
    }
    for (const [affiliationIndex, affiliation] of asArray(source.publisherAffiliations).entries()) {
      const affiliationPath = `${path}.publisherAffiliations[${affiliationIndex}]`;
      validateExactKeys(collector, affiliation, ["entityRef", "relationship", "validFrom", "validTo"], affiliationPath);
      if (!affiliationEntityIds.has(affiliation.entityRef)) collector.add("INVALID_AFFILIATION_ENTITY_TYPE", `${affiliationPath}.entityRef`, `Affiliation entity must be a Company, Adjacent, BuyerEvidence, or Source ID: ${affiliation.entityRef}`);
      validateEnum(collector, affiliation.relationship, ["subject", "buyer", "investor", "acquirer", "transaction_counterparty", "commercial_partner", "parent", "syndicator"], `${affiliationPath}.relationship`);
      validateDate(collector, affiliation.validFrom, `${affiliationPath}.validFrom`, true);
      validateDate(collector, affiliation.validTo, `${affiliationPath}.validTo`, true);
    }
  }

  for (const [index, observation] of observations.entries()) {
    const path = `observations[${index}]`;
    validateExactKeys(collector, observation, ["observationId", "sourceId", "locator", "excerpt", "observedAt", "validAt", "observerGroup", "independenceBasis"], path);
    if (!sourceMap.has(observation.sourceId)) collector.add("UNKNOWN_SOURCE_ID", `${path}.sourceId`, `Unknown source ${observation.sourceId}`);
    validateExactKeys(collector, observation.locator, ["kind", "value"], `${path}.locator`);
    validateEnum(collector, observation.locator?.kind, ["html_heading", "paragraph", "page", "section", "filing_field", "commit"], `${path}.locator.kind`);
    if (typeof observation.locator?.value !== "string" || observation.locator.value.trim() === "") collector.add("EMPTY_LOCATOR_VALUE", `${path}.locator.value`, "Observation locator value must be nonblank");
    if (INTERSTITIAL_TEXT.test(String(observation.locator?.value ?? ""))) collector.add("INTERSTITIAL_LOCATOR_TEXT", `${path}.locator.value`, "Access interstitial text cannot serve as an observation locator");
    const source = sourceMap.get(observation.sourceId);
    if (source && String(observation.locator?.value ?? "").trim().toLowerCase() === String(source.title).trim().toLowerCase()) collector.add("PSEUDO_LOCATOR_SOURCE_TITLE", `${path}.locator.value`, "Locally authored source title cannot masquerade as an observed source locator");
    if (observation.excerpt === null || typeof observation.excerpt !== "string" || observation.excerpt.trim() === "") collector.add("NULL_OR_EMPTY_LOCATOR_EVIDENCE", `${path}.excerpt`, "Observation requires a short exact excerpt or transport metadata");
    if (INTERSTITIAL_TEXT.test(String(observation.excerpt ?? ""))) collector.add("INTERSTITIAL_EXCERPT_TEXT", `${path}.excerpt`, "Access interstitial text cannot serve as evidence");
    if (observation.excerpt !== null && String(observation.excerpt).trim().split(/\s+/).length > 25) collector.add("EXCERPT_WORD_LIMIT", `${path}.excerpt`, "Excerpt exceeds 25 words");
    validateDate(collector, observation.observedAt, `${path}.observedAt`);
    validateDate(collector, observation.validAt, `${path}.validAt`, true);
    if (typeof observation.observerGroup !== "string" || observation.observerGroup.trim() === "") collector.add("BLANK_REQUIRED_STRING", `${path}.observerGroup`, "Observer group must be nonblank");
    if (typeof observation.independenceBasis !== "string" || observation.independenceBasis.trim() === "") collector.add("BLANK_REQUIRED_STRING", `${path}.independenceBasis`, "Independence basis must be nonblank");
  }

  for (const [index, claim] of claims.entries()) {
    const path = `claims[${index}]`;
    validateExactKeys(collector, claim, ["claimId", "statement", "subjectIds", "themes", "kind", "confidence", "temporal", "risk", "evidenceLinks", "contradictionClaimIds", "independentGroupCount", "singleSourceException", "canonicalHash"], path);
    if (!ID.test(claim.claimId ?? "")) collector.add("INVALID_ID", `${path}.claimId`, "Invalid claim ID");
    if (typeof claim.statement !== "string" || claim.statement.trim() === "") collector.add("BLANK_REQUIRED_STRING", `${path}.statement`, "Statement must be nonblank");
    for (const subjectId of validateUniqueArray(collector, claim.subjectIds, `${path}.subjectIds`, { min: 1 })) {
      if (entityIds.size > 0 && !entityIds.has(subjectId)) collector.add("UNKNOWN_SUBJECT_ID", `${path}.subjectIds`, `Unknown subject ${subjectId}`);
    }
    for (const theme of validateUniqueArray(collector, claim.themes, `${path}.themes`, { min: 1 })) validateEnum(collector, theme, THEMES, `${path}.themes`);
    validateEnum(collector, claim.kind, KINDS, `${path}.kind`);
    validateEnum(collector, claim.confidence, CONFIDENCE, `${path}.confidence`);
    validateEnum(collector, claim.temporal, TEMPORAL, `${path}.temporal`);
    validateEnum(collector, claim.risk, RISKS, `${path}.risk`);
    const eligibleGroups = new Set();
    const evidencePairs = new Set();
    for (const [linkIndex, link] of validateUniqueArray(collector, claim.evidenceLinks, `${path}.evidenceLinks`, { min: 1 }).entries()) {
      const linkPath = `${path}.evidenceLinks[${linkIndex}]`;
      validateExactKeys(collector, link, ["observationId", "sourceId", "supportRelation", "claimAlignment", "independenceGroup"], linkPath);
      if (!sourceMap.has(link.sourceId)) collector.add("UNKNOWN_SOURCE_ID", `${linkPath}.sourceId`, `Unknown source ${link.sourceId}`);
      if (!observationMap.has(link.observationId)) collector.add("UNKNOWN_OBSERVATION_ID", `${linkPath}.observationId`, `Unknown observation ${link.observationId}`);
      if (observationMap.has(link.observationId) && observationMap.get(link.observationId).sourceId !== link.sourceId) collector.add("OBSERVATION_SOURCE_MISMATCH", linkPath, "Observation and source do not agree");
      validateEnum(collector, link.supportRelation, SUPPORT_RELATIONS, `${linkPath}.supportRelation`);
      validateEnum(collector, link.claimAlignment, ALIGNMENTS, `${linkPath}.claimAlignment`);
      const source = sourceMap.get(link.sourceId);
      const expectedAlignment = expectedClaimAlignment(source, claim.subjectIds);
      if (source && link.claimAlignment !== expectedAlignment) collector.add("CLAIM_ALIGNMENT_SOURCE_MISMATCH", `${linkPath}.claimAlignment`, `Expected ${expectedAlignment} from ${link.sourceId} provenance`);
      if (source) {
        try {
          const expectedGroup = independenceGroupFor(source, sourceMap);
          if (link.independenceGroup !== expectedGroup) collector.add("INDEPENDENCE_GROUP_SOURCE_MISMATCH", `${linkPath}.independenceGroup`, `Expected ${expectedGroup}`);
        } catch {
          collector.add("INVALID_HTTPS_URL", `${linkPath}.sourceId`, "Cannot derive an independence group from an invalid source URL");
        }
      }
      const evidencePair = `${link.observationId}|${link.sourceId}`;
      if (evidencePairs.has(evidencePair)) collector.add("DUPLICATE_CLAIM_EVIDENCE_PAIR", linkPath, "A claim cannot count the same observation-source relationship more than once");
      evidencePairs.add(evidencePair);
      if (sourceMap.get(link.sourceId)?.access === "unavailable" && ["supports", "partially_supports"].includes(link.supportRelation)) collector.add("UNAVAILABLE_SOURCE_USED_AS_SUPPORT", linkPath, "An unavailable source cannot positively support a canonical claim");
      if (sourceMap.get(link.sourceId)?.access === "secondary_only" && ["supports", "partially_supports"].includes(link.supportRelation)) collector.add("SECONDARY_ONLY_SOURCE_USED_AS_SUPPORT", linkPath, "A secondary-only or search-index capture cannot positively support a canonical claim");
      if (link.sourceId === "src_s47" && ["supports", "partially_supports"].includes(link.supportRelation)) collector.add("TITLE_ONLY_OBSERVATION_USED_AS_SUPPORT", linkPath, "The retained Epoch observation is title-only and cannot positively support a substantive claim");
      if (ELIGIBLE_ALIGNMENTS.has(link.claimAlignment) && ["supports", "partially_supports"].includes(link.supportRelation)) eligibleGroups.add(link.independenceGroup);
    }
    if (claim.independentGroupCount !== eligibleGroups.size) {
      collector.add("INDEPENDENCE_COUNT_MISMATCH", `${path}.independentGroupCount`, `Stored ${claim.independentGroupCount}; derived ${eligibleGroups.size}`);
      if (claim.independentGroupCount > eligibleGroups.size) collector.add("ALIGNED_SOURCE_COUNTED_INDEPENDENT", `${path}.independentGroupCount`, "Aligned or republication evidence was counted as independent");
    }
    for (const contradictionId of validateUniqueArray(collector, claim.contradictionClaimIds, `${path}.contradictionClaimIds`)) {
      if (!claimMap.has(contradictionId)) collector.add("UNKNOWN_CLAIM_ID", `${path}.contradictionClaimIds`, `Unknown claim ${contradictionId}`);
    }
    if (claim.singleSourceException !== null) {
      validateExactKeys(collector, claim.singleSourceException, ["kind", "reason", "observationId"], `${path}.singleSourceException`);
      validateEnum(collector, claim.singleSourceException?.kind, ["registry_field", "current_advertised_offer"], `${path}.singleSourceException.kind`);
      if (!asArray(claim.evidenceLinks).some((link) => link.observationId === claim.singleSourceException?.observationId)) collector.add("INVALID_SINGLE_SOURCE_EXCEPTION", `${path}.singleSourceException.observationId`, "Exception observation is not linked");
    }
    if (typeof claim.canonicalHash !== "string" || !claim.canonicalHash.startsWith("#/")) collector.add("INVALID_CANONICAL_HASH", `${path}.canonicalHash`, "Canonical hash must begin #/");
    if (claim.risk === "high_risk") {
      const summary = deriveSupportSummary(claim);
      const positiveLinks = asArray(claim.evidenceLinks).filter((link) => ["supports", "partially_supports"].includes(link.supportRelation));
      const hasPrimary = positiveLinks.some((link) => {
        const sourceType = sourceMap.get(link.sourceId)?.sourceType;
        return ["regulatory_record", "procurement_record", "buyer_first_party", "company_first_party", "technical_artifact", "academic_primary", "repository_primary"].includes(sourceType);
      });
      const independentEnough = eligibleGroups.size >= 2 || (hasPrimary && eligibleGroups.size >= 1);
      const exception = claim.singleSourceException !== null;
      if (!independentEnough && !exception && !["contested", "contradicted", "not_publicly_verified"].includes(summary)) {
        collector.add("HIGH_RISK_INDEPENDENCE_FAILURE", path, `High-risk claim without required independence must be canonically degraded; derived ${summary}`);
      }
      if (claim.temporal === "current") {
        const liveAtCutoff = positiveLinks.some((link) => {
          const source = sourceMap.get(link.sourceId);
          return source?.access === "open" && source.accessedAt === "2026-07-11";
        });
        if (!liveAtCutoff && !["contested", "contradicted", "not_publicly_verified"].includes(summary)) collector.add("HIGH_RISK_CURRENTNESS_FAILURE", path, "Current high-risk claim lacks an open cutoff observation or canonical degradation");
      }
    }
  }

  for (const [index, company] of companies.entries()) {
    const path = `companies[${index}]`;
    validateExactKeys(collector, company, ["companyId", "name", "aliases", "canonicalDomain", "identityClaimId", "entityStatus", "industryIds", "primarySegment", "businessModelIds", "claimGroups", "buyerEvidenceIds", "comparisonMetricClaimIds"], path);
    if (!isHttpsOrigin(company.canonicalDomain)) collector.add("INVALID_CANONICAL_DOMAIN", `${path}.canonicalDomain`, "Company canonical domain must be an HTTPS origin without a path");
    validateEnum(collector, company.entityStatus, ENTITY_STATUS, `${path}.entityStatus`);
    validateEnum(collector, company.primarySegment, SEGMENTS, `${path}.primarySegment`);
    for (const model of validateUniqueArray(collector, company.businessModelIds, `${path}.businessModelIds`, { min: 1 })) validateEnum(collector, model, BUSINESS_MODELS, `${path}.businessModelIds`);
    if (!claimMap.has(company.identityClaimId)) collector.add("UNKNOWN_CLAIM_ID", `${path}.identityClaimId`, `Unknown claim ${company.identityClaimId}`);
    for (const industryId of validateUniqueArray(collector, company.industryIds, `${path}.industryIds`, { min: 1 })) {
      if (!industryMap.has(industryId)) collector.add("UNKNOWN_INDUSTRY_ID", `${path}.industryIds`, `Unknown industry ${industryId}`);
      else if (!asArray(industryMap.get(industryId).companyIds).includes(company.companyId)) collector.add("RECIPROCAL_LINK_MISMATCH", `${path}.industryIds`, `Industry ${industryId} omits ${company.companyId}`);
    }
    validateExactKeys(collector, company.claimGroups, CLAIM_GROUPS, `${path}.claimGroups`);
    for (const group of CLAIM_GROUPS) {
      const claimIds = validateUniqueArray(collector, company.claimGroups?.[group], `${path}.claimGroups.${group}`, { min: ["contradictions", "unknowns"].includes(group) ? 0 : 1 });
      for (const claimId of claimIds) {
        const claim = claimMap.get(claimId);
        if (!claim) collector.add("UNKNOWN_CLAIM_ID", `${path}.claimGroups.${group}`, `Unknown claim ${claimId}`);
        else if (!asArray(claim.subjectIds).includes(company.companyId)) collector.add("GROUPED_CLAIM_SUBJECT_MISMATCH", `${path}.claimGroups.${group}`, `${claimId} omits company subject`);
      }
    }
    for (const buyerId of validateUniqueArray(collector, company.buyerEvidenceIds, `${path}.buyerEvidenceIds`)) {
      if (!buyerMap.has(buyerId)) collector.add("UNKNOWN_BUYER_EVIDENCE_ID", `${path}.buyerEvidenceIds`, `Unknown buyer evidence ${buyerId}`);
    }
  }

  for (const [index, industry] of industries.entries()) {
    const path = `industries[${index}]`;
    validateExactKeys(collector, industry, ["industryId", "name", "aliases", "kind", "valueChainStage", "definitionClaimId", "boundaryClaimIds", "buyerClaimIds", "companyIds", "adjacentIds"], path);
    validateEnum(collector, industry.kind, ["reward_regime", "optimization_method", "commercial_layer", "service_model", "ambiguous_term"], `${path}.kind`);
    validateEnum(collector, industry.valueChainStage, ["signal_data", "environment", "post_training", "evaluation_assurance", "deployment", "transformation"], `${path}.valueChainStage`);
    if (industry.industryId === "ind_dpo" && industry.kind !== "optimization_method") collector.add("DPO_TAXONOMY_MISCLASSIFIED", `${path}.kind`, "DPO must be an optimization method");
    for (const [field, min] of [["boundaryClaimIds", 1], ["buyerClaimIds", 0]]) {
      for (const claimId of validateUniqueArray(collector, industry[field], `${path}.${field}`, { min })) if (!claimMap.has(claimId)) collector.add("UNKNOWN_CLAIM_ID", `${path}.${field}`, `Unknown claim ${claimId}`);
    }
    if (!claimMap.has(industry.definitionClaimId)) collector.add("UNKNOWN_CLAIM_ID", `${path}.definitionClaimId`, `Unknown claim ${industry.definitionClaimId}`);
    for (const companyId of validateUniqueArray(collector, industry.companyIds, `${path}.companyIds`)) {
      if (!companyMap.has(companyId) || !asArray(companyMap.get(companyId)?.industryIds).includes(industry.industryId)) collector.add("RECIPROCAL_LINK_MISMATCH", `${path}.companyIds`, `Company link ${companyId} does not reciprocate`);
    }
    for (const adjacentId of validateUniqueArray(collector, industry.adjacentIds, `${path}.adjacentIds`)) {
      if (!adjacentMap.has(adjacentId) || !asArray(adjacentMap.get(adjacentId)?.secondaryIndustryIds).includes(industry.industryId)) collector.add("RECIPROCAL_LINK_MISMATCH", `${path}.adjacentIds`, `Adjacent link ${adjacentId} does not reciprocate`);
    }
  }

  const namedDomains = new Set(companies.map((company) => String(company.canonicalDomain).toLowerCase()));
  const namedAliases = new Set(companies.flatMap((company) => [company.name, ...asArray(company.aliases)]).map((value) => String(value).toLowerCase()));
  const segmentCounts = Object.fromEntries(SEGMENTS.map((segment) => [segment, 0]));
  for (const [index, record] of adjacent.entries()) {
    const path = `adjacent[${index}]`;
    validateExactKeys(collector, record, ["adjacentId", "name", "aliases", "canonicalDomain", "primarySegment", "secondaryIndustryIds", "businessModelIds", "entityStatus", "inclusionKind", "inclusionClaimId", "currentOfferClaimId", "currentStatusClaimId", "currentOfferObservationIds", "currentStatusObservationIds"], path);
    validateEnum(collector, record.primarySegment, SEGMENTS, `${path}.primarySegment`);
    validateEnum(collector, record.entityStatus, ENTITY_STATUS, `${path}.entityStatus`);
    validateEnum(collector, record.inclusionKind, ["direct_supplier", "substitute", "partner", "acquirer", "procurement_competitor"], `${path}.inclusionKind`);
    if (!isHttpsOrigin(record.canonicalDomain)) collector.add("INVALID_CANONICAL_DOMAIN", `${path}.canonicalDomain`, "Adjacent canonical domain must be an HTTPS origin without a path");
    if (segmentCounts[record.primarySegment] !== undefined) segmentCounts[record.primarySegment] += 1;
    if (namedDomains.has(String(record.canonicalDomain).toLowerCase())) collector.add("NAMED_COMPANY_DOMAIN_REUSED", `${path}.canonicalDomain`, "Adjacent record reuses named-company domain");
    for (const name of [record.name, ...asArray(record.aliases)]) if (namedAliases.has(String(name).toLowerCase())) collector.add("NAMED_COMPANY_ALIAS_REUSED", `${path}.name`, "Adjacent record reuses named-company name or alias");
    for (const model of validateUniqueArray(collector, record.businessModelIds, `${path}.businessModelIds`, { min: 1 })) validateEnum(collector, model, BUSINESS_MODELS, `${path}.businessModelIds`);
    for (const industryId of validateUniqueArray(collector, record.secondaryIndustryIds, `${path}.secondaryIndustryIds`, { min: 1 })) {
      if (!industryMap.has(industryId)) collector.add("UNKNOWN_INDUSTRY_ID", `${path}.secondaryIndustryIds`, `Unknown industry ${industryId}`);
      else if (!asArray(industryMap.get(industryId).adjacentIds).includes(record.adjacentId)) collector.add("RECIPROCAL_LINK_MISMATCH", `${path}.secondaryIndustryIds`, `Industry ${industryId} omits ${record.adjacentId}`);
    }
    for (const field of ["inclusionClaimId", "currentOfferClaimId", "currentStatusClaimId"]) if (!claimMap.has(record[field])) collector.add("UNKNOWN_CLAIM_ID", `${path}.${field}`, `Unknown claim ${record[field]}`);
    for (const [field, claimField] of [["currentOfferObservationIds", "currentOfferClaimId"], ["currentStatusObservationIds", "currentStatusClaimId"]]) {
      const ids = validateUniqueArray(collector, record[field], `${path}.${field}`, { min: 1 });
      const linked = new Set(asArray(claimMap.get(record[claimField])?.evidenceLinks).map((link) => link.observationId));
      for (const observationId of ids) {
        if (!observationMap.has(observationId)) collector.add("UNKNOWN_OBSERVATION_ID", `${path}.${field}`, `Unknown observation ${observationId}`);
        if (!linked.has(observationId)) collector.add("ADJACENT_OBSERVATION_NOT_LINKED", `${path}.${field}`, `${observationId} is absent from ${record[claimField]}`);
      }
    }
    const offerClaim = claimMap.get(record.currentOfferClaimId);
    const offerSources = asArray(offerClaim?.evidenceLinks).map((link) => sourceMap.get(link.sourceId)).filter(Boolean);
    const hasOpenCurrentOffer = offerClaim?.temporal === "current" && offerSources.some((source) => source.access === "open" && source.accessedAt === "2026-07-11");
    const degraded = ["unknown", "superseded"].includes(offerClaim?.temporal) && ["not_publicly_verified", "contested", "contradicted"].includes(deriveSupportSummary(offerClaim));
    if (!hasOpenCurrentOffer && !degraded) collector.add("MISSING_ADJACENT_CURRENT_SOURCE", `${path}.currentOfferClaimId`, "Adjacent offer requires open cutoff evidence or canonical degradation");
  }
  if (adjacent.length < 60) collector.add("ADJACENT_CENSUS_TOO_SMALL", "adjacent", `Expected at least 60; found ${adjacent.length}`);
  for (const segment of SEGMENTS) if (segmentCounts[segment] < 8) collector.add("SEGMENT_QUOTA_NOT_MET", `adjacent.${segment}`, `Expected at least 8; found ${segmentCounts[segment]}`);

  for (const [index, buyer] of buyerEvidence.entries()) {
    const path = `buyerEvidence[${index}]`;
    const ownerKeys = ["companyId", "adjacentId"].filter((key) => Object.hasOwn(buyer, key));
    const expected = ["buyerEvidenceId", ownerKeys[0] ?? "companyId", "buyerName", "buyerNameClaimId", "buyerType", "motion", "evidenceState", "claimIds", "observationIds", "outcomeClaimIds", "validAt"];
    validateExactKeys(collector, buyer, expected, path);
    if (ownerKeys.length !== 1) collector.add("BUYER_EVIDENCE_OWNER_COUNT", path, "Exactly one of companyId or adjacentId is required");
    if (buyer.companyId && !companyMap.has(buyer.companyId)) collector.add("UNKNOWN_COMPANY_ID", `${path}.companyId`, `Unknown company ${buyer.companyId}`);
    if (buyer.adjacentId && !adjacentMap.has(buyer.adjacentId)) collector.add("UNKNOWN_ADJACENT_ID", `${path}.adjacentId`, `Unknown adjacent ${buyer.adjacentId}`);
    if ((buyer.buyerName === null) !== (buyer.buyerNameClaimId === null)) collector.add("BUYER_NAME_CLAIM_NULLABILITY", path, "buyerName and buyerNameClaimId must both be null or non-null");
    validateEnum(collector, buyer.buyerType, ["frontier_lab", "enterprise_ai_team", "regulated_enterprise", "public_sector", "consultancy", "undisclosed", "other"], `${path}.buyerType`);
    validateEnum(collector, buyer.motion, ["research_relationship", "sample", "paid_pilot", "procurement", "expansion", "marketplace", "partnership", "unknown"], `${path}.motion`);
    validateEnum(collector, buyer.evidenceState, ["buyer_confirmed", "procurement_confirmed", "vendor_reported_only", "not_publicly_verified"], `${path}.evidenceState`);
    for (const field of ["claimIds", "outcomeClaimIds"]) for (const claimId of validateUniqueArray(collector, buyer[field], `${path}.${field}`, { min: field === "claimIds" ? 1 : 0 })) if (!claimMap.has(claimId)) collector.add("UNKNOWN_CLAIM_ID", `${path}.${field}`, `Unknown claim ${claimId}`);
    for (const observationId of validateUniqueArray(collector, buyer.observationIds, `${path}.observationIds`, { min: 1 })) if (!observationMap.has(observationId)) collector.add("UNKNOWN_OBSERVATION_ID", `${path}.observationIds`, `Unknown observation ${observationId}`);
    validateDate(collector, buyer.validAt, `${path}.validAt`, true);
    if (["buyer_confirmed", "procurement_confirmed"].includes(buyer.evidenceState)) {
      const required = buyer.evidenceState === "buyer_confirmed" ? "buyer_controlled" : "regulator_authoritative";
      const hasRequired = asArray(buyer.claimIds).some((claimId) => asArray(claimMap.get(claimId)?.evidenceLinks).some((link) => link.claimAlignment === required));
      if (!hasRequired) collector.add("BUYER_SIDE_EVIDENCE_REQUIRED", path, `${buyer.evidenceState} requires ${required} evidence`);
    }
  }

  const economicModels = [];
  for (const [index, analysis] of marketAnalysis.entries()) {
    const path = `marketAnalysis[${index}]`;
    const common = ["analysisId", "analysisType", "themes"];
    const keysByType = {
      history_event: [...common, "date", "claimIds", "companyIds", "industryIds"],
      gtm_motion: [...common, "name", "stageOrder", "claimIds", "buyerEvidenceIds"],
      economic_model: [...common, "businessModelId", "name", "formula", "inputClaimIds", "comparabilityClass"],
      risk: [...common, "name", "allegationClaimIds", "incidentClaimIds", "counterevidenceClaimIds", "unknownClaimIds"],
      metric: [...common, "name", "valueClaimId", "unit", "period", "denominator", "comparabilityClass"],
      value_chain_edge: [...common, "fromIndustryId", "toIndustryId", "claimIds"],
    };
    if (!keysByType[analysis.analysisType]) {
      collector.add("INVALID_ANALYSIS_TYPE", `${path}.analysisType`, `Unknown type ${analysis.analysisType}`);
      continue;
    }
    validateExactKeys(collector, analysis, keysByType[analysis.analysisType], path);
    validateUniqueArray(collector, analysis.themes, `${path}.themes`, { min: 1 });
    const allClaimFields = ["claimIds", "inputClaimIds", "allegationClaimIds", "incidentClaimIds", "counterevidenceClaimIds", "unknownClaimIds"].filter((field) => Object.hasOwn(analysis, field));
    const supportedClaimCount = allClaimFields.reduce((count, field) => count + asArray(analysis[field]).length, 0) + (analysis.valueClaimId ? 1 : 0);
    if (supportedClaimCount === 0) collector.add("ANALYSIS_WITHOUT_CLAIM_SUPPORT", path, "Analysis must link at least one claim");
    for (const field of allClaimFields) for (const claimId of validateUniqueArray(collector, analysis[field], `${path}.${field}`)) if (!claimMap.has(claimId)) collector.add("UNKNOWN_CLAIM_ID", `${path}.${field}`, `Unknown claim ${claimId}`);
    if (analysis.analysisType === "economic_model") {
      validateEnum(collector, analysis.businessModelId, BUSINESS_MODELS, `${path}.businessModelId`);
      economicModels.push(analysis.businessModelId);
    }
    if (analysis.analysisType === "history_event") {
      validateDate(collector, analysis.date, `${path}.date`);
      for (const companyId of asArray(analysis.companyIds)) if (!companyMap.has(companyId)) collector.add("UNKNOWN_COMPANY_ID", `${path}.companyIds`, `Unknown company ${companyId}`);
      for (const industryId of asArray(analysis.industryIds)) if (!industryMap.has(industryId)) collector.add("UNKNOWN_INDUSTRY_ID", `${path}.industryIds`, `Unknown industry ${industryId}`);
    }
    if (analysis.analysisType === "gtm_motion") {
      for (const buyerId of asArray(analysis.buyerEvidenceIds)) {
        if (!buyerMap.has(buyerId)) collector.add("UNKNOWN_BUYER_EVIDENCE_ID", `${path}.buyerEvidenceIds`, `Unknown buyer evidence ${buyerId}`);
        else if (!["buyer_confirmed", "procurement_confirmed"].includes(buyerMap.get(buyerId).evidenceState)) collector.add("UNCONFIRMED_BUYER_IN_GTM_MOTION", `${path}.buyerEvidenceIds`, `${buyerId} is not buyer/procurement confirmed`);
      }
    }
    if (analysis.analysisType === "value_chain_edge") {
      if (!industryMap.has(analysis.fromIndustryId) || !industryMap.has(analysis.toIndustryId)) collector.add("UNKNOWN_INDUSTRY_ID", path, "Value chain edge uses unknown industry");
    }
  }
  for (const model of BUSINESS_MODELS) {
    const count = economicModels.filter((value) => value === model).length;
    if (count !== 1) collector.add("ECONOMIC_MODEL_COVERAGE", "marketAnalysis", `Expected exactly one ${model}; found ${count}`);
  }

  const referencedReceipts = new Map();
  const candidateStrategies = [];
  const modelStrategies = [];
  const responseStrategies = [];
  const scoreWeights = { pain: 20, willingnessToPay: 20, rightsAccess: 15, verifierFeasibility: 15, expertSupply: 10, freshnessBurden: 10, incumbentPressure: 10 };
  const claimArrayFieldsForStrategy = (strategy) => {
    if (strategy.strategyType === "strategic_model") return ["inferenceClaimIds", "modelClaimIds", "prerequisiteClaimIds", "killClaimIds"];
    if (strategy.strategyType === "competitor_response") return ["inferenceClaimIds", "incumbentStrengthClaimIds", "vulnerableWedgeClaimIds", "buyerClaimIds", "entryProofClaimIds", "likelyCounterMoveClaimIds", "prerequisiteClaimIds", "noGoTriggerClaimIds"];
    if (strategy.strategyType === "roadmap") return ["inferenceClaimIds", "actionClaimIds", "gateClaimIds"];
    if (strategy.strategyType === "pricing_experiment") return ["inferenceClaimIds", "hypothesisClaimIds", "successClaimIds", "killClaimIds"];
    return ["inferenceClaimIds"];
  };

  for (const [index, strategy] of strategies.entries()) {
    const path = `strategies[${index}]`;
    if (!ID.test(strategy.strategyId ?? "")) collector.add("INVALID_ID", `${path}.strategyId`, "Invalid strategy ID");
    const common = ["strategyId", "strategyType", "name", "inferenceClaimIds", "observationIds"];
    const expectedByType = {
      vertical_candidate: [...common, "verticalCandidateId", "dimensionCells", "rawWeightedScore", "roundedScore", "caps", "rightsBlocker", "qualificationFailures", "decisionStatus"],
      strategic_model: [...common, "modelId", "eligibility", "modelClaimIds", "prerequisiteClaimIds", "killClaimIds"],
      roadmap: [...common, "horizon", "order", "actionClaimIds", "gateClaimIds"],
      pricing_experiment: [...common, "amount", "currency", "unit", "hypothesisClaimIds", "successClaimIds", "killClaimIds"],
    };
    if (strategy.strategyType === "competitor_response") expectedByType.competitor_response = [...common, Object.hasOwn(strategy, "companyId") ? "companyId" : "archetypeId", "incumbentStrengthClaimIds", "vulnerableWedgeClaimIds", "buyerClaimIds", "entryProofClaimIds", "likelyCounterMoveClaimIds", "prerequisiteClaimIds", "noGoTriggerClaimIds"];
    if (!expectedByType[strategy.strategyType]) {
      collector.add("INVALID_STRATEGY_TYPE", `${path}.strategyType`, `Unknown type ${strategy.strategyType}`);
      continue;
    }
    validateExactKeys(collector, strategy, expectedByType[strategy.strategyType], path);
    for (const field of claimArrayFieldsForStrategy(strategy)) for (const claimId of validateUniqueArray(collector, strategy[field], `${path}.${field}`, { min: 1 })) if (!claimMap.has(claimId)) collector.add("UNKNOWN_CLAIM_ID", `${path}.${field}`, `Unknown claim ${claimId}`);
    for (const observationId of validateUniqueArray(collector, strategy.observationIds, `${path}.observationIds`)) if (!observationMap.has(observationId)) collector.add("UNKNOWN_OBSERVATION_ID", `${path}.observationIds`, `Unknown observation ${observationId}`);

    if (strategy.strategyType === "vertical_candidate") {
      candidateStrategies.push(strategy);
      validateEnum(collector, strategy.verticalCandidateId, CANDIDATES, `${path}.verticalCandidateId`);
      validateExactKeys(collector, strategy.dimensionCells, DIMENSIONS, `${path}.dimensionCells`);
      let computedScore = 0;
      for (const dimensionId of DIMENSIONS) {
        const cell = strategy.dimensionCells?.[dimensionId];
        const cellPath = `${path}.dimensionCells.${dimensionId}`;
        validateExactKeys(collector, cell, ["measuredLevel", "imputation", "effectiveRawLevel", "convertedScore", "claimIds", "observationIds", "missingReason", "positiveSearchReceiptId", "negativeSearchReceiptId"], cellPath);
        if (!cell) continue;
        const positive = receiptMap.get(cell.positiveSearchReceiptId);
        const negative = receiptMap.get(cell.negativeSearchReceiptId);
        for (const [kind, receipt, receiptId] of [["positive", positive, cell.positiveSearchReceiptId], ["negative", negative, cell.negativeSearchReceiptId]]) {
          if (!receipt) collector.add("MISSING_SEARCH_RECEIPT", cellPath, `Missing ${kind} receipt ${receiptId}`);
          else {
            const key = `${strategy.verticalCandidateId}|${dimensionId}|${kind}`;
            if (receipt.candidateId !== strategy.verticalCandidateId || receipt.dimensionId !== dimensionId || receipt.kind !== kind) collector.add("MISMATCHED_SEARCH_RECEIPT", cellPath, `${receiptId} does not match ${key}`);
            referencedReceipts.set(receiptId, (referencedReceipts.get(receiptId) ?? 0) + 1);
          }
        }
        const missing = cell.measuredLevel === null;
        if (missing) {
          const burden = ["freshnessBurden", "incumbentPressure"].includes(dimensionId);
          if (cell.imputation !== "conservative_missing" || cell.effectiveRawLevel !== (burden ? 5 : 0) || cell.convertedScore !== 0 || asArray(cell.claimIds).length !== 0 || asArray(cell.observationIds).length !== 0 || typeof cell.missingReason !== "string" || cell.missingReason.trim() === "") {
            collector.add("NONCONSERVATIVE_MISSING_IMPUTATION", cellPath, "Missing cells must use conservative values and empty evidence");
          }
        } else {
          if (!Number.isInteger(cell.measuredLevel) || cell.measuredLevel < 0 || cell.measuredLevel > 5 || cell.imputation !== null || cell.effectiveRawLevel !== cell.measuredLevel || cell.missingReason !== null || asArray(cell.claimIds).length === 0 || asArray(cell.observationIds).length === 0) collector.add("INVALID_MEASURED_SCORE_CELL", cellPath, "Measured cells require 0-5 evidence-backed values and null imputation/missing reason");
          const expectedConverted = ["freshnessBurden", "incumbentPressure"].includes(dimensionId) ? 5 - cell.measuredLevel : cell.measuredLevel;
          if (cell.convertedScore !== expectedConverted) collector.add("SCORE_CONVERSION_MISMATCH", `${cellPath}.convertedScore`, `Expected ${expectedConverted}`);
          for (const claimId of asArray(cell.claimIds)) if (!claimMap.has(claimId)) collector.add("UNKNOWN_CLAIM_ID", `${cellPath}.claimIds`, `Unknown claim ${claimId}`);
          for (const observationId of asArray(cell.observationIds)) if (!observationMap.has(observationId)) collector.add("UNKNOWN_OBSERVATION_ID", `${cellPath}.observationIds`, `Unknown observation ${observationId}`);
          const hasPositiveSupport = asArray(cell.claimIds).some((claimId) =>
            asArray(claimMap.get(claimId)?.evidenceLinks).some((link) =>
              ["supports", "partially_supports"].includes(link.supportRelation),
            ),
          );
          if (!hasPositiveSupport) collector.add("MEASURED_CELL_LACKS_POSITIVE_SUPPORT", cellPath, "Measured score cells require at least one supporting or partially supporting claim link");
          const terminalClosures = new Set(["evidence_found", "no_public_evidence", "rights_blocker", "duplicate", "dead"]);
          if (!terminalClosures.has(positive?.closure) || positive?.searchedAt === null || !terminalClosures.has(negative?.closure) || negative?.searchedAt === null) collector.add("MEASURED_CELL_RECEIPT_CLOSURE", cellPath, "Measured cells require two dated terminal search receipts");
          const supportingLinks = asArray(cell.claimIds).flatMap((claimId) =>
            asArray(claimMap.get(claimId)?.evidenceLinks).filter((link) =>
              ["supports", "partially_supports"].includes(link.supportRelation),
            ),
          );
          const supportingSourceIds = supportingLinks.map((link) => link.sourceId);
          const supportingObservationIds = supportingLinks.map((link) => link.observationId);
          const receiptSourceIds = unique([...asArray(positive?.sourceIds), ...asArray(negative?.sourceIds)]);
          const receiptObservationIds = unique([...asArray(positive?.observationIds), ...asArray(negative?.observationIds)]);
          if (!sameStringSet(cell.observationIds, supportingObservationIds) || supportingSourceIds.some((sourceId) => !receiptSourceIds.includes(sourceId)) || supportingObservationIds.some((observationId) => !receiptObservationIds.includes(observationId))) {
            collector.add("MEASURED_CELL_RECEIPT_EVIDENCE_MISMATCH", cellPath, "Measured-cell evidence must match its claim links and be retained by one of the two executed receipt lanes");
          }
          if (!["freshnessBurden", "incumbentPressure"].includes(dimensionId)) {
            let cap = 5;
            for (const claimId of asArray(cell.claimIds)) {
              const cellClaim = claimMap.get(claimId);
              if (!cellClaim) continue;
              const positiveSources = asArray(cellClaim.evidenceLinks)
                .filter((link) => ["supports", "partially_supports"].includes(link.supportRelation))
                .map((link) => sourceMap.get(link.sourceId))
                .filter(Boolean);
              if (positiveSources.some((source) => ["subject_controlled", "commercially_affiliated"].includes(source.control)) || ["low", "unscored"].includes(cellClaim.confidence) || ["contested", "not_publicly_verified", "contradicted"].includes(deriveSupportSummary(cellClaim)) || ["superseded", "unknown"].includes(cellClaim.temporal)) cap = Math.min(cap, 2);
              if (cellClaim.independentGroupCount === 1) cap = Math.min(cap, 3);
            }
            if (cell.measuredLevel > cap) collector.add("SCORE_QUALITY_CAP_VIOLATION", cellPath, `Measured ${cell.measuredLevel} exceeds evidence cap ${cap}`);
          }
        }
        computedScore += cell.convertedScore * scoreWeights[dimensionId];
      }
      computedScore /= 5;
      const rounded = Math.round((computedScore + Number.EPSILON) * 10) / 10;
      if (Math.abs(strategy.rawWeightedScore - computedScore) > 1e-9 || strategy.roundedScore !== rounded) collector.add("STRATEGY_SCORE_MISMATCH", path, `Expected ${computedScore}/${rounded}`);
    }

    if (strategy.strategyType === "strategic_model") {
      modelStrategies.push(strategy);
      validateEnum(collector, strategy.modelId, MODELS, `${path}.modelId`);
      validateEnum(collector, strategy.eligibility, ["eligible_hypothesis", "countersearched_out"], `${path}.eligibility`);
    }
    if (strategy.strategyType === "competitor_response") {
      responseStrategies.push(strategy);
      const ownerCount = Number(Object.hasOwn(strategy, "companyId")) + Number(Object.hasOwn(strategy, "archetypeId"));
      if (ownerCount !== 1) collector.add("COMPETITOR_RESPONSE_TARGET_COUNT", path, "Exactly one response target is required");
      if (strategy.companyId && !companyMap.has(strategy.companyId)) collector.add("UNKNOWN_COMPANY_ID", `${path}.companyId`, `Unknown company ${strategy.companyId}`);
      if (strategy.archetypeId) validateEnum(collector, strategy.archetypeId, ARCHETYPES, `${path}.archetypeId`);
    }
  }

  if (candidateStrategies.length !== 5 || new Set(candidateStrategies.map((strategy) => strategy.verticalCandidateId)).size !== 5) collector.add("VERTICAL_CANDIDATE_COVERAGE", "strategies", "Expected five unique vertical candidates");
  const verticalEvaluation = evaluateVerticalCandidates({ strategies: candidateStrategies, observations, sources, receipts });
  for (const [index, strategy] of candidateStrategies.entries()) {
    const path = `strategies[${strategies.indexOf(strategy)}]`;
    const expected = verticalEvaluation.results.get(strategy.strategyId);
    if (!sameStringSet(strategy.qualificationFailures, expected.qualificationFailures)) {
      collector.add("VERTICAL_QUALIFICATION_FAILURE_MISMATCH", `${path}.qualificationFailures`, `Expected ${expected.qualificationFailures.join(", ") || "none"}`);
    }
    if (strategy.decisionStatus !== expected.decisionStatus) {
      collector.add("VERTICAL_DECISION_MISMATCH", `${path}.decisionStatus`, `Expected ${expected.decisionStatus}`);
    }
    if (strategy.decisionStatus === "winner" && expected.buyerProcurementObservationIds.length < 2) {
      collector.add("VERTICAL_BUYER_GATE_NOT_ENFORCED", `${path}.decisionStatus`, "Winner requires two distinct buyer-controlled or procurement observations");
    }
    if (strategy.decisionStatus === "winner" && !expected.auditableReceiptClosureGate) {
      collector.add("VERTICAL_RECEIPT_GATE_NOT_ENFORCED", `${path}.decisionStatus`, "Candidate cannot win without auditable terminal positive and negative receipt closures for every dimension");
    }
    if (!expected.auditableReceiptClosureGate && !asArray(strategy.qualificationFailures).includes("auditable_receipt_closure_gate")) {
      collector.add("VERTICAL_RECEIPT_GATE_NOT_ENFORCED", `${path}.qualificationFailures`, "Open or incompatible receipt lanes must remain an explicit qualification failure");
    }
    const baseFailures = expected.qualificationFailures.filter((failure) => failure !== "winner_lead_below_10");
    if (strategy.decisionStatus === "winner" && baseFailures.length > 0) {
      collector.add("VERTICAL_GATE_NOT_ENFORCED", `${path}.decisionStatus`, "Unqualified candidate cannot win");
    }
    if (strategy.decisionStatus === "winner" && expected.qualificationFailures.includes("winner_lead_below_10")) {
      collector.add("VERTICAL_WINNER_LEAD_NOT_ENFORCED", `${path}.decisionStatus`, "Winner must lead the second-highest candidate by at least ten full-precision points");
    }
  }
  if (modelStrategies.length !== 4 || new Set(modelStrategies.map((strategy) => strategy.modelId)).size !== 4) collector.add("STRATEGIC_MODEL_COVERAGE", "strategies", "Expected four unique strategic models");
  const eligibleModels = modelStrategies.filter((strategy) => strategy.eligibility === "eligible_hypothesis").map((strategy) => strategy.modelId);
  if (eligibleModels.length !== 1 || eligibleModels[0] !== "vertical_domain_assurance_pack") collector.add("STRATEGIC_MODEL_ELIGIBILITY", "strategies", "Only the vertical domain assurance pack may remain eligible");
  const responseTargets = responseStrategies.map((strategy) => strategy.companyId ? `company:${strategy.companyId}` : `archetype:${strategy.archetypeId}`);
  const expectedTargets = [...companies.map((company) => `company:${company.companyId}`), ...ARCHETYPES.map((archetype) => `archetype:${archetype}`)];
  if (responseTargets.length !== 17 || new Set(responseTargets).size !== 17 || expectedTargets.some((target) => !responseTargets.includes(target))) collector.add("MISSING_COMPETITOR_RESPONSE_TARGET", "strategies", "Expected exactly ten company and seven archetype responses");

  if (receipts.length !== 70) collector.add("SEARCH_RECEIPT_COUNT", "receipts", `Expected 70; found ${receipts.length}`);
  const scoreCells = new Map(candidateStrategies.flatMap((strategy) =>
    DIMENSIONS.map((dimensionId) => [
      `${strategy.verticalCandidateId}|${dimensionId}`,
      strategy.dimensionCells?.[dimensionId],
    ]),
  ));
  const receiptTriples = new Set();
  const templateHashes = { positive: new Set(), negative: new Set() };
  const domainClassSignatures = new Set();
  for (const [index, receipt] of receipts.entries()) {
    const path = `receipts[${index}]`;
    validateExactKeys(collector, receipt, ["id", "candidateId", "dimensionId", "kind", "queries", "searchedDomainClasses", "searchedAt", "cutoffAt", "sourceIds", "observationIds", "findings", "closure", "templateHash"], path);
    if (!RECEIPT_ID.test(receipt.id ?? "")) collector.add("INVALID_RECEIPT_ID", `${path}.id`, "Invalid receipt ID");
    validateEnum(collector, receipt.candidateId, CANDIDATES, `${path}.candidateId`);
    validateEnum(collector, receipt.dimensionId, DIMENSIONS, `${path}.dimensionId`);
    validateEnum(collector, receipt.kind, ["positive", "negative"], `${path}.kind`);
    validateEnum(collector, receipt.closure, ["evidence_found", "no_public_evidence", "rights_blocker", "duplicate", "dead", "open_unverified"], `${path}.closure`);
    validateDate(collector, receipt.searchedAt, `${path}.searchedAt`, true);
    if (receipt.closure !== "open_unverified" && receipt.searchedAt === null) collector.add("UNDATED_SEARCH_CLOSURE", `${path}.searchedAt`, "A terminal search closure requires a recorded execution date");
    validateDate(collector, receipt.cutoffAt, `${path}.cutoffAt`);
    const queries = validateUniqueArray(collector, receipt.queries, `${path}.queries`, { min: 1 });
    if (queries.some((query) => typeof query !== "string" || query.trim() === "")) collector.add("BLANK_SEARCH_QUERY", `${path}.queries`, "Search receipt queries must be nonblank strings");
    if (typeof receipt.findings !== "string" || receipt.findings.trim() === "") collector.add("BLANK_SEARCH_FINDING", `${path}.findings`, "Search receipt finding must be nonblank");
    const classes = validateUniqueArray(collector, receipt.searchedDomainClasses, `${path}.searchedDomainClasses`, { min: 1 });
    for (const domainClass of classes) validateEnum(collector, domainClass, DOMAIN_CLASSES, `${path}.searchedDomainClasses`);
    domainClassSignatures.add([...classes].sort().join("|"));
    const triple = `${receipt.candidateId}|${receipt.dimensionId}|${receipt.kind}`;
    if (receiptTriples.has(triple)) collector.add("DUPLICATE_SEARCH_RECEIPT_CELL", path, `Duplicate ${triple}`);
    receiptTriples.add(triple);
    if (templateHashes[receipt.kind]) templateHashes[receipt.kind].add(receipt.templateHash);
    if (receipt.templateHash !== deriveReceiptTemplateHash(receipt)) collector.add("SEARCH_TEMPLATE_HASH_MISMATCH", `${path}.templateHash`, "Template hash must be derived from normalized query templates and searched domain classes");
    if ((referencedReceipts.get(receipt.id) ?? 0) === 0) collector.add("ORPHAN_SEARCH_RECEIPT", path, `${receipt.id} is not referenced by a score cell`);
    if ((referencedReceipts.get(receipt.id) ?? 0) > 1) collector.add("REUSED_SEARCH_RECEIPT", path, `${receipt.id} is referenced more than once`);
    const sourceIds = validateUniqueArray(collector, receipt.sourceIds, `${path}.sourceIds`);
    const observationIds = validateUniqueArray(collector, receipt.observationIds, `${path}.observationIds`);
    for (const sourceId of sourceIds) if (!sourceMap.has(sourceId)) collector.add("UNKNOWN_SOURCE_ID", `${path}.sourceIds`, `Unknown source ${sourceId}`);
    for (const observationId of observationIds) {
      const observation = observationMap.get(observationId);
      if (!observation) collector.add("UNKNOWN_OBSERVATION_ID", `${path}.observationIds`, `Unknown observation ${observationId}`);
      else if (!sourceIds.includes(observation.sourceId)) collector.add("RECEIPT_SOURCE_OBSERVATION_MISMATCH", path, `${observationId} source is not listed`);
    }
    if (sourceIds.length !== observationIds.length) collector.add("RECEIPT_SOURCE_OBSERVATION_MISMATCH", path, "Receipt source and observation counts differ");
    const observationSourceIds = observationIds.map((observationId) => observationMap.get(observationId)?.sourceId).filter(Boolean);
    if (!sameStringSet(sourceIds, observationSourceIds)) collector.add("RECEIPT_SOURCE_OBSERVATION_MISMATCH", path, "Receipt sources and observations must form an exact one-to-one set");
    if (["evidence_found", "rights_blocker"].includes(receipt.closure) && sourceIds.length === 0) collector.add("UNSUPPORTED_SEARCH_CLOSURE", `${path}.closure`, "Evidence-found and rights-blocker closures require retained provenance");
    const cell = scoreCells.get(`${receipt.candidateId}|${receipt.dimensionId}`);
    if (receipt.closure === "evidence_found") {
      if (sourceIds.length === 0) collector.add("UNSUPPORTED_POSITIVE_RECEIPT", path, "Evidence-found receipts require retained source and observation provenance");
    }
    if (receipt.kind === "negative") {
      const positiveReceipt = receiptMap.get(cell?.positiveSearchReceiptId);
      if (observationIds.some((observationId) => asArray(positiveReceipt?.observationIds).includes(observationId))) collector.add("REUSED_POSITIVE_AS_COUNTEREVIDENCE", path, "A claim-specific observation cannot be mechanically reused as negative countersearch evidence");
    }
  }
  for (const candidate of CANDIDATES) for (const dimension of DIMENSIONS) for (const kind of ["positive", "negative"]) if (!receiptTriples.has(`${candidate}|${dimension}|${kind}`)) collector.add("MISSING_SEARCH_RECEIPT", "receipts", `Missing ${candidate}/${dimension}/${kind}`);

  const representedModels = new Set([...companies, ...adjacent].flatMap((record) => asArray(record.businessModelIds)));
  for (const model of BUSINESS_MODELS) if (!representedModels.has(model)) collector.add("BUSINESS_MODEL_NOT_REPRESENTED", "companies|adjacent", `No record uses ${model}`);

  collector.errors.push(...schemaErrors);

  return collector.errors;
}

export function validateMigration(migration, corpus, root = DEFAULT_ROOT) {
  const collector = errorCollector();
  const allowedDispositions = ["duplicate", "unsupported", "superseded", "non_atomic", "strategy_hypothesis", "out_of_scope"];
  const isRecord = (value) => value !== null && typeof value === "object" && !Array.isArray(value);
  if (!isRecord(migration)) collector.add("INVALID_MIGRATION_SHAPE", "migration", "Migration must be an object");
  for (const key of ["rootSeed", "rootPointer", "summary"]) {
    if (!isRecord(migration?.[key])) collector.add("INVALID_MIGRATION_SHAPE", `migration.${key}`, `${key} must be an object`);
  }
  for (const key of ["inputManifests", "sourceMappings", "claimMappings"]) {
    if (!Array.isArray(migration?.[key]) || migration[key].some((item) => !isRecord(item))) collector.add("INVALID_MIGRATION_SHAPE", `migration.${key}`, `${key} must be an array of objects`);
  }
  for (const [index, mapping] of asArray(migration?.claimMappings).entries()) {
    if (!Array.isArray(mapping.citedSeedSourceIds) || !Array.isArray(mapping.canonicalClaimIds)) collector.add("INVALID_MIGRATION_SHAPE", `migration.claimMappings[${index}]`, "Claim mapping citation and canonical-claim fields must be arrays");
    if (typeof mapping.reason !== "string" || mapping.reason.trim() === "") collector.add("INVALID_MIGRATION_SHAPE", `migration.claimMappings[${index}].reason`, "Claim mappings require a meaningful mapping or omission reason");
  }
  if (!Array.isArray(corpus?.sources) || corpus.sources.some((source) => !isRecord(source)) ||
    !Array.isArray(corpus?.observations) || corpus.observations.some((observation) => !isRecord(observation)) ||
    !Array.isArray(corpus?.claims) || corpus.claims.some((claim) => !isRecord(claim) || !Array.isArray(claim.evidenceLinks) || claim.evidenceLinks.some((link) => !isRecord(link)))) {
    collector.add("INVALID_MIGRATION_SHAPE", "corpus", "Migration validation requires object-valued sources, observations, claims, and evidence links");
  }
  if (collector.errors.length > 0) return collector.errors;
  const sourceById = new Map(asArray(corpus?.sources).map((source) => [source.sourceId, source]));
  const sourceIds = new Set(sourceById.keys());
  const claimIds = new Set(asArray(corpus?.claims).map((claim) => claim.claimId));
  validateExactKeys(collector, migration, ["version", "generatedAt", "rootSeed", "rootPointer", "inputManifests", "sourceMappings", "claimMappings", "summary"], "migration");
  validateExactKeys(collector, migration?.rootSeed, ["originalPath", "seedPath", "sha256", "immutable", "canonicalStatus"], "migration.rootSeed");
  validateExactKeys(collector, migration?.rootPointer, ["path", "target", "sha256", "claimFree"], "migration.rootPointer");
  validateExactKeys(collector, migration?.summary, ["seedSourceCount", "mappedSeedSourceCount", "seedClaimAnchorCount", "mappedSeedClaimAnchorCount", "rejectedSeedClaimAnchorCount", "openLeadCount"], "migration.summary");
  const seedPath = resolveRootedPath(root, migration.rootSeed.seedPath);
  let seedContent = null;
  if (seedPath === null) collector.add("MIGRATION_PATH_OUTSIDE_ROOT", "migration.rootSeed.seedPath", "Seed path must remain inside the workspace root");
  else if (!existsSync(seedPath)) collector.add("SEED_COPY_MISSING", "migration.rootSeed.seedPath", "Immutable provenance seed is missing");
  else {
    try {
      if (!statSync(seedPath).isFile()) collector.add("MIGRATION_INPUT_NOT_FILE", "migration.rootSeed.seedPath", "Seed path must be a regular file");
      else {
        seedContent = readFileSync(seedPath, "utf8");
        if (sha256(seedContent) !== migration.rootSeed.sha256) collector.add("SEED_HASH_MISMATCH", "migration.rootSeed.sha256", "Immutable provenance seed does not match the manifest hash");
      }
    } catch {
      collector.add("MIGRATION_INPUT_UNREADABLE", "migration.rootSeed.seedPath", "Seed path could not be read");
    }
  }
  const pointerPath = resolveRootedPath(root, migration.rootPointer.path);
  if (pointerPath === null) collector.add("MIGRATION_PATH_OUTSIDE_ROOT", "migration.rootPointer.path", "Root pointer path must remain inside the workspace root");
  else if (!existsSync(pointerPath)) collector.add("ROOT_POINTER_MISSING", "migration.rootPointer.path", "Root deprecation pointer is missing");
  else {
    try {
      if (!statSync(pointerPath).isFile()) collector.add("MIGRATION_INPUT_NOT_FILE", "migration.rootPointer.path", "Root pointer path must be a regular file");
      else {
        const pointer = readFileSync(pointerPath, "utf8");
        if (pointer !== EXPECTED_ROOT_POINTER || sha256(pointer) !== migration.rootPointer.sha256 || migration.rootPointer.target !== "research/synthesis/SYNTHESIS.md" || migration.rootPointer.claimFree !== true) collector.add("ROOT_POINTER_INVALID", "migration.rootPointer", "Root SYNTHESIS.md must be the exact claim-free canonical pointer");
      }
    } catch {
      collector.add("MIGRATION_INPUT_UNREADABLE", "migration.rootPointer.path", "Root pointer path could not be read");
    }
  }
  const inputPaths = new Set();
  for (const [index, input] of asArray(migration?.inputManifests).entries()) {
    const path = `migration.inputManifests[${index}]`;
    validateExactKeys(collector, input, ["path", "role", "sha256", "bytes"], path);
    inputPaths.add(input.path);
    const absolute = resolveRootedPath(root, input.path);
    if (absolute === null) collector.add("MIGRATION_PATH_OUTSIDE_ROOT", `${path}.path`, "Manifest input path must remain inside the workspace root");
    else if (!existsSync(absolute)) collector.add("MIGRATION_INPUT_MISSING", `${path}.path`, `Missing ${input.path}`);
    else {
      try {
        if (!statSync(absolute).isFile()) collector.add("MIGRATION_INPUT_NOT_FILE", `${path}.path`, `${input.path} must be a regular file`);
        else {
          const content = readFileSync(absolute);
          if (sha256(content) !== input.sha256 || content.byteLength !== input.bytes) collector.add("MIGRATION_INPUT_HASH_MISMATCH", path, `Hash or size mismatch for ${input.path}`);
        }
      } catch {
        collector.add("MIGRATION_INPUT_UNREADABLE", `${path}.path`, `${input.path} could not be read`);
      }
    }
  }
  const journalDirectory = join(root, ".omo/ulw-research/20260711-034936");
  if (existsSync(journalDirectory)) {
    for (const name of readdirSync(journalDirectory).filter((value) => value.endsWith(".md"))) {
      const relative = `.omo/ulw-research/20260711-034936/${name}`;
      if (!inputPaths.has(relative)) collector.add("UNMANIFESTED_RESEARCH_INPUT", "migration.inputManifests", `Missing manifest for ${relative}`);
    }
  }
  const locatorSnapshotPath = join(root, "research/migrations/source-locator-snapshots.json");
  if (!existsSync(locatorSnapshotPath)) {
    collector.add("LOCATOR_SNAPSHOT_MISSING", "migration.inputManifests", "Exact source-locator snapshot is missing");
  } else {
    const snapshot = JSON.parse(readFileSync(locatorSnapshotPath, "utf8"));
    const entries = asArray(snapshot.entries);
    const entryMap = new Map(entries.map((entry) => [entry.sourceId, entry]));
    if (entries.length !== asArray(corpus.sources).length || entryMap.size !== entries.length) collector.add("LOCATOR_SNAPSHOT_COVERAGE", "locatorSnapshot.entries", "Snapshot must contain exactly one entry for every source");
    const observationBySource = new Map(asArray(corpus.observations).map((observation) => [observation.sourceId, observation]));
    for (const source of asArray(corpus.sources)) {
      const entry = entryMap.get(source.sourceId);
      const observation = observationBySource.get(source.sourceId);
      if (!entry || entry.canonicalUrl !== source.canonicalUrl) collector.add("LOCATOR_SNAPSHOT_SOURCE_MISMATCH", "locatorSnapshot.entries", `Missing or mismatched snapshot for ${source.sourceId}`);
      else if (!observation || JSON.stringify(entry.locator) !== JSON.stringify(observation.locator) || entry.excerpt !== observation.excerpt) collector.add("LOCATOR_SNAPSHOT_OBSERVATION_MISMATCH", "locatorSnapshot.entries", `Snapshot and canonical observation differ for ${source.sourceId}`);
      if (entry && isTransportCapture(entry) && source.access === "open") collector.add("OPEN_ACCESS_FOR_TRANSPORT_CAPTURE", "locatorSnapshot.entries", `Transport-only capture cannot establish open access for ${source.sourceId}`);
      if (entry?.captureMethod === "exa-fetched-exact-excerpt" && entry.locator?.kind === "paragraph" && entry.locator?.value !== entry.excerpt) collector.add("EXA_PSEUDO_LOCATOR", "locatorSnapshot.entries", `Exa paragraph locator must be the exact retained excerpt for ${source.sourceId}`);
      const unrelatedRedirect = entry && classifyRedirect(source.canonicalUrl, entry.finalUrl, { approvedFinalOrigins: approvedRedirectOriginsFor(source.sourceId) }).unrelatedCrossOrigin;
      if (unrelatedRedirect && source.access === "open") collector.add("UNRELATED_REDIRECT_USED_AS_OPEN", "locatorSnapshot.entries", `Unrelated redirect cannot establish an open current offer for ${source.sourceId}`);
      if (unrelatedRedirect && !isTransportCapture(entry)) collector.add("UNRELATED_REDIRECT_SEMANTIC_CAPTURE", "locatorSnapshot.entries", `Unrelated redirect content cannot be attributed semantically to ${source.sourceId}`);
    }
    for (const [claimIndex, claim] of asArray(corpus.claims).entries()) {
      for (const [linkIndex, link] of asArray(claim.evidenceLinks).entries()) {
        if (isTransportCapture(entryMap.get(link.sourceId)) && ["supports", "partially_supports"].includes(link.supportRelation)) {
          collector.add("TRANSPORT_CAPTURE_USED_AS_SUPPORT", `claims[${claimIndex}].evidenceLinks[${linkIndex}]`, `Transport-only capture cannot positively support ${claim.claimId}`);
        }
        if (isInaccessibleSearchIndexCapture(entryMap.get(link.sourceId)) && ["supports", "partially_supports"].includes(link.supportRelation)) {
          collector.add("SEARCH_INDEX_CAPTURE_USED_AS_SUPPORT", `claims[${claimIndex}].evidenceLinks[${linkIndex}]`, `An inaccessible search-index capture cannot positively support ${claim.claimId}`);
        }
      }
    }
  }
  const seenSeedSources = new Set();
  const seenCanonicalSourceTargets = new Set();
  const seedSourceDefinitions = new Map(
    [...String(seedContent ?? "").matchAll(/^\[S(\d+)\]:\s+(https:\/\/\S+)\s+"([^"]+)"\s*$/gm)].map((match) => [
      `S${match[1].padStart(2, "0")}`,
      { canonicalUrl: match[2], contentHash: sha256(`${match[2]}\n${match[3]}`) },
    ]),
  );
  for (const [index, mapping] of asArray(migration?.sourceMappings).entries()) {
    const path = `migration.sourceMappings[${index}]`;
    validateExactKeys(collector, mapping, ["seedSourceId", "canonicalUrl", "contentHash", "canonicalSourceId", "disposition"], path);
    if (seenSeedSources.has(mapping.seedSourceId)) collector.add("DUPLICATE_SEED_SOURCE_MAPPING", `${path}.seedSourceId`, `Seed source ${mapping.seedSourceId} is mapped more than once`);
    seenSeedSources.add(mapping.seedSourceId);
    const mapped = mapping.canonicalSourceId !== null;
    const rejected = mapping.disposition !== null;
    if (mapped === rejected) collector.add("UNMAPPED_SEED_SOURCE", path, "Seed source must be mapped or rejected, never both/neither");
    if (mapped && !sourceIds.has(mapping.canonicalSourceId)) collector.add("UNMAPPED_SEED_SOURCE", `${path}.canonicalSourceId`, `Unknown canonical source ${mapping.canonicalSourceId}`);
    if (mapped && seenCanonicalSourceTargets.has(mapping.canonicalSourceId)) collector.add("DUPLICATE_SEED_SOURCE_TARGET", `${path}.canonicalSourceId`, `Canonical source target ${mapping.canonicalSourceId} is reused`);
    if (mapped) seenCanonicalSourceTargets.add(mapping.canonicalSourceId);
    if (mapped && sourceById.get(mapping.canonicalSourceId)?.canonicalUrl !== mapping.canonicalUrl) collector.add("SEED_SOURCE_TARGET_URL_MISMATCH", path, "Seed URL and canonical source target URL must match exactly");
    if (rejected && !allowedDispositions.includes(mapping.disposition)) collector.add("INVALID_MIGRATION_DISPOSITION", `${path}.disposition`, `Invalid disposition ${mapping.disposition}`);
    const seedDefinition = seedSourceDefinitions.get(mapping.seedSourceId);
    if (!seedDefinition || mapping.canonicalUrl !== seedDefinition.canonicalUrl || mapping.contentHash !== seedDefinition.contentHash) collector.add("SEED_SOURCE_HASH_MISMATCH", path, `Seed source definition does not match ${mapping.seedSourceId}`);
  }
  if (seenSeedSources.size !== 77) collector.add("SEED_SOURCE_COVERAGE", "migration.sourceMappings", `Expected 77 unique seed sources; found ${seenSeedSources.size}`);
  const seedBody = String(seedContent ?? "").split("## Sources")[0];
  const seedLines = seedBody.split("\n");
  const seenSeedAnchors = new Set();
  for (const [index, mapping] of asArray(migration?.claimMappings).entries()) {
    const path = `migration.claimMappings[${index}]`;
    validateExactKeys(collector, mapping, ["seedAnchorId", "lineNumber", "contentHash", "citedSeedSourceIds", "canonicalClaimIds", "disposition", "reason"], path);
    const mapped = asArray(mapping.canonicalClaimIds).length > 0;
    const rejected = mapping.disposition !== null;
    if (seenSeedAnchors.has(mapping.seedAnchorId)) collector.add("DUPLICATE_SEED_ANCHOR", `${path}.seedAnchorId`, `Duplicate ${mapping.seedAnchorId}`);
    seenSeedAnchors.add(mapping.seedAnchorId);
    const expectedLine = seedLines[mapping.lineNumber - 1]?.trim();
    if (!Number.isInteger(mapping.lineNumber) || mapping.lineNumber < 1 || expectedLine === undefined || mapping.seedAnchorId !== `seed-line-${mapping.lineNumber}` || mapping.contentHash !== sha256(expectedLine)) collector.add("SEED_LINE_HASH_MISMATCH", path, "Seed anchor ID, line number, or content hash does not match the immutable seed");
    const expectedCitations = unique([...String(expectedLine ?? "").matchAll(/\[S(\d+)\]/g)].map((match) => `S${match[1].padStart(2, "0")}`));
    if (JSON.stringify(asArray(mapping.citedSeedSourceIds)) !== JSON.stringify(expectedCitations)) collector.add("SEED_LINE_CITATION_MISMATCH", `${path}.citedSeedSourceIds`, "Seed citations must exactly match the immutable source line");
    if (mapped === rejected) collector.add("UNMAPPED_SEED_CLAIM", path, "Seed claim anchor must be mapped or rejected, never both/neither");
    for (const claimId of asArray(mapping.canonicalClaimIds)) if (!claimIds.has(claimId)) collector.add("UNMAPPED_SEED_CLAIM", `${path}.canonicalClaimIds`, `Unknown canonical claim ${claimId}`);
    if (rejected && !allowedDispositions.includes(mapping.disposition)) collector.add("INVALID_MIGRATION_DISPOSITION", `${path}.disposition`, `Invalid disposition ${mapping.disposition}`);
    for (const sourceRef of asArray(mapping.citedSeedSourceIds)) if (!seenSeedSources.has(sourceRef)) collector.add("UNMAPPED_SEED_SOURCE", `${path}.citedSeedSourceIds`, `Unknown seed source ${sourceRef}`);
  }
  if (asArray(migration?.claimMappings).length === 0) collector.add("SEED_CLAIM_COVERAGE", "migration.claimMappings", "No seed factual anchors were mapped");
  const expectedSummary = {
    seedSourceCount: asArray(migration?.sourceMappings).length,
    mappedSeedSourceCount: asArray(migration?.sourceMappings).filter((mapping) => mapping.canonicalSourceId !== null).length,
    seedClaimAnchorCount: asArray(migration?.claimMappings).length,
    mappedSeedClaimAnchorCount: asArray(migration?.claimMappings).filter((mapping) => asArray(mapping.canonicalClaimIds).length > 0).length,
    rejectedSeedClaimAnchorCount: asArray(migration?.claimMappings).filter((mapping) => mapping.disposition !== null).length,
    openLeadCount: [...asArray(migration?.sourceMappings), ...asArray(migration?.claimMappings)].filter((mapping) => mapping.disposition === "unsupported").length,
  };
  if (JSON.stringify(migration?.summary) !== JSON.stringify(expectedSummary)) collector.add("MIGRATION_SUMMARY_MISMATCH", "migration.summary", "Migration summary must be derived from the mapping ledgers");
  if (expectedSummary.openLeadCount !== 0) collector.add("OPEN_RESEARCH_LEADS", "migration.summary.openLeadCount", "Open research leads must be zero");
  return collector.errors;
}

export const SUPPLEMENTAL_REGISTERS = [
  {
    file: "research/corpus/supplemental-adjacent.json",
    lock: {
      evidenceCutoff: "2026-07-11",
      observedAt: "2026-07-12",
      requiredMerges: { Refresh: "co_refresh", Halluminate: "co_halluminate" },
      requiredUnresolvedIds: ["adj_originator"],
      reconciliation: { inputCount: 50, addCount: 47, mergeCount: 2, unresolvedCount: 1, unknownStatusCount: 45, acquiredClosedCount: 2, coreCensusAffected: false },
    },
  },
  {
    file: "research/corpus/supplemental-adjacent-2.json",
    lock: {
      evidenceCutoff: "2026-07-11",
      observedAt: "2026-07-12",
      requiredMerges: {},
      requiredUnresolvedIds: [],
      reconciliation: { inputCount: 12, addCount: 12, mergeCount: 0, unresolvedCount: 0, unknownStatusCount: 11, acquiredClosedCount: 1, coreCensusAffected: false },
    },
  },
];

export function validateSupplementalAdjacent(supplemental, corpus, lock = SUPPLEMENTAL_REGISTERS[0].lock) {
  const collector = errorCollector();
  const manifest = lock.reconciliation;
  const expectedTopLevel = ["schemaVersion", "evidenceCutoff", "observedAt", "records", "duplicateInputs", "relationships", "unresolved", "reconciliation"];
  validateExactKeys(collector, supplemental, expectedTopLevel, "supplemental");
  if (supplemental?.schemaVersion !== 1) collector.add("SUPPLEMENTAL_SCHEMA_VERSION", "supplemental.schemaVersion", "Expected schema version 1");
  if (supplemental?.evidenceCutoff !== lock.evidenceCutoff || supplemental?.observedAt !== lock.observedAt) collector.add("SUPPLEMENTAL_TEMPORAL_BOUNDARY", "supplemental", "Supplemental census must preserve the cutoff and post-cutoff observation date");
  const records = asArray(supplemental?.records);
  const duplicates = asArray(supplemental?.duplicateInputs);
  const unresolved = asArray(supplemental?.unresolved);
  if (records.length !== manifest.addCount || duplicates.length !== manifest.mergeCount || unresolved.length !== manifest.unresolvedCount) collector.add("SUPPLEMENTAL_RECONCILIATION", "supplemental", "Additions, merges, and unresolved leads must match the audited integration manifest");
  const recordIds = records.map((record) => record?.adjacentId);
  if (new Set(recordIds).size !== records.length) collector.add("SUPPLEMENTAL_DUPLICATE_ID", "supplemental.records", "All supplemental IDs must be unique");
  const coreEntityIds = new Set([...asArray(corpus?.companies).map((record) => record.companyId), ...asArray(corpus?.adjacent).map((record) => record.adjacentId)]);
  for (const [index, record] of records.entries()) {
    const path = `supplemental.records[${index}]`;
    validateExactKeys(collector, record, ["adjacentId", "inputRefs", "entityKind", "name", "aliases", "canonicalDomain", "primarySegment", "businessModelIds", "entityStatus", "sourceReportedStatus", "inclusionKind", "cutoffTreatment", "sourceCandidates", "observationCandidates", "caveat", "confidence", "relationshipIds"], path);
    if (!/^adj_[a-z0-9]+(?:-[a-z0-9]+)*$/.test(record?.adjacentId ?? "")) collector.add("SUPPLEMENTAL_INVALID_ID", `${path}.adjacentId`, "Supplemental record requires a stable adj_ ID");
    if (coreEntityIds.has(record?.adjacentId)) collector.add("SUPPLEMENTAL_CORE_COLLISION", `${path}.adjacentId`, "Supplemental ID must not collide with the cutoff-locked core census");
    validateEnum(collector, record?.entityKind, ["company", "brand", "product", "business_unit"], `${path}.entityKind`);
    validateEnum(collector, record?.primarySegment, SEGMENTS, `${path}.primarySegment`);
    for (const model of validateUniqueArray(collector, record?.businessModelIds, `${path}.businessModelIds`, { min: 1 })) validateEnum(collector, model, BUSINESS_MODELS, `${path}.businessModelIds`);
    validateEnum(collector, record?.entityStatus, ["unknown", "acquired_closed"], `${path}.entityStatus`);
    validateEnum(collector, record?.cutoffTreatment, ["time_unknown", "historical_offer_only", "acquired_historical"], `${path}.cutoffTreatment`);
    if (!isHttpsUrl(record?.canonicalDomain)) collector.add("SUPPLEMENTAL_INVALID_URL", `${path}.canonicalDomain`, "Canonical domain must be HTTPS");
    for (const [sourceIndex, source] of validateUniqueArray(collector, record?.sourceCandidates, `${path}.sourceCandidates`, { min: 1 }).entries()) {
      const sourcePath = `${path}.sourceCandidates[${sourceIndex}]`;
      validateExactKeys(collector, source, ["canonicalUrl", "title", "sourceDate", "accessedAt"], sourcePath);
      if (!isHttpsUrl(source?.canonicalUrl)) collector.add("SUPPLEMENTAL_INVALID_URL", `${sourcePath}.canonicalUrl`, "Source candidate must be HTTPS");
      validateDate(collector, source?.sourceDate, `${sourcePath}.sourceDate`, true);
      if (source?.accessedAt !== lock.observedAt) collector.add("SUPPLEMENTAL_TEMPORAL_BOUNDARY", `${sourcePath}.accessedAt`, "Source candidates were accessed on the discovery date");
    }
    for (const [observationIndex, observation] of validateUniqueArray(collector, record?.observationCandidates, `${path}.observationCandidates`, { min: 1 }).entries()) {
      const observationPath = `${path}.observationCandidates[${observationIndex}]`;
      validateExactKeys(collector, observation, ["excerpt", "locator", "observedAt", "canonicalReady", "note"], observationPath);
      if (typeof observation?.excerpt !== "string" || observation.excerpt.trim() === "" || observation.excerpt.trim().split(/\s+/).length > 25) collector.add("SUPPLEMENTAL_EXCERPT_LIMIT", `${observationPath}.excerpt`, "Observation candidates require a nonblank excerpt of at most 25 words");
      if (observation?.locator !== null || observation?.canonicalReady !== false) collector.add("SUPPLEMENTAL_PREMATURE_PROMOTION", observationPath, "Post-cutoff candidates without exact locators must remain explicitly non-canonical");
      if (observation?.observedAt !== lock.observedAt) collector.add("SUPPLEMENTAL_TEMPORAL_BOUNDARY", `${observationPath}.observedAt`, "Observation candidates were recorded on the discovery date");
    }
  }
  const unknownCount = records.filter((record) => record.entityStatus === "unknown").length;
  const acquiredCount = records.filter((record) => record.entityStatus === "acquired_closed").length;
  const mergeMap = new Map(duplicates.map((record) => [record.input, record.mergeInto]));
  const requiredMerges = Object.entries(lock.requiredMerges ?? {});
  if (unknownCount !== manifest.unknownStatusCount || acquiredCount !== manifest.acquiredClosedCount || requiredMerges.some(([input, mergeInto]) => mergeMap.get(input) !== mergeInto)) collector.add("SUPPLEMENTAL_RECONCILIATION", "supplemental", "Status and duplicate reconciliation does not match the audited integration manifest");
  const requiredUnresolvedIds = lock.requiredUnresolvedIds ?? [];
  const unresolvedIds = unresolved.map((record) => record?.adjacentId);
  if (JSON.stringify(unresolvedIds) !== JSON.stringify(requiredUnresolvedIds) || supplemental?.reconciliation?.coreCensusAffected !== false) collector.add("SUPPLEMENTAL_RECONCILIATION", "supplemental", "Unresolved leads and core-census impact must match the audited integration manifest");
  if (JSON.stringify(supplemental?.reconciliation) !== JSON.stringify(manifest)) collector.add("SUPPLEMENTAL_RECONCILIATION", "supplemental.reconciliation", "Reconciliation summary must be exactly derived from the integration manifest");
  if (asArray(corpus?.adjacent).length !== 63 || asArray(corpus?.companies).length !== 10 || asArray(corpus?.receipts).length !== 70) collector.add("SUPPLEMENTAL_CORE_IMPACT", "corpus", "Supplemental discovery must not alter core census or scoring counts");
  return collector.errors;
}

export function validateSupplementalRegisters(registers, corpus) {
  const collector = errorCollector();
  const errors = registers.flatMap(({ value, lock }) => validateSupplementalAdjacent(value, corpus, lock));
  const seenIds = new Set();
  for (const { value } of registers) {
    for (const record of asArray(value?.records)) {
      if (seenIds.has(record?.adjacentId)) collector.add("SUPPLEMENTAL_DUPLICATE_ID", "supplemental.records", `Supplemental ID ${record?.adjacentId} appears in more than one register`);
      seenIds.add(record?.adjacentId);
    }
  }
  return [...errors, ...collector.errors];
}

export function summarizeCorpus(corpus, migration = null) {
  const segmentCounts = Object.fromEntries(SEGMENTS.map((segment) => [segment, asArray(corpus.adjacent).filter((record) => record.primarySegment === segment).length]));
  const evidenceStates = Object.fromEntries(
    ["buyer_confirmed", "procurement_confirmed", "vendor_reported_only", "not_publicly_verified"].map((state) => [state, asArray(corpus.buyerEvidence).filter((record) => record.evidenceState === state).length]),
  );
  const receiptClosures = Object.fromEntries(
    ["evidence_found", "no_public_evidence", "rights_blocker", "duplicate", "dead", "open_unverified"].map((closure) => [closure, asArray(corpus.receipts).filter((record) => record.closure === closure).length]),
  );
  const adjacentCoverage = asArray(corpus.adjacent).map((record) => ({
    adjacentId: record.adjacentId,
    segment: record.primarySegment,
    currentOfferClaimId: record.currentOfferClaimId,
    sourceCount: asArray(corpus.claims).find((claim) => claim.claimId === record.currentOfferClaimId)?.evidenceLinks.length ?? 0,
  }));
  return {
    generatedAt: "2026-07-11",
    counts: Object.fromEntries(Object.entries(corpus).map(([key, value]) => [key, asArray(value).length])),
    segmentQuotas: segmentCounts,
    adjacentSourceCoverage: adjacentCoverage,
    receiptClosures,
    responseTargets: asArray(corpus.strategies).filter((strategy) => strategy.strategyType === "competitor_response").length,
    businessModels: Object.fromEntries(BUSINESS_MODELS.map((model) => [model, [...asArray(corpus.companies), ...asArray(corpus.adjacent)].filter((record) => asArray(record.businessModelIds).includes(model)).length])),
    evidenceStates,
    migration: migration ? migration.summary : null,
    openLeads: migration?.summary?.openLeadCount ?? 0,
    openReceiptLanes: receiptClosures.open_unverified,
  };
}
