import { createHash } from "node:crypto"
import { existsSync, readFileSync, readdirSync, writeFileSync } from "node:fs"
import { dirname, join, relative, resolve } from "node:path"
import { fileURLToPath, pathToFileURL } from "node:url"

const SCRIPT_DIR = dirname(fileURLToPath(import.meta.url))
export const DEFAULT_ROOT = resolve(SCRIPT_DIR, "../..")
const DEFAULT_OUTPUT = join(DEFAULT_ROOT, "research/seeds/datasets/decision-manifest.json")

const REPORT_CATEGORIES = {
  "benchmark_directories.md": "general_agent_suites_trajectories",
  "browser_web_agents.md": "browser_web",
  "coding_terminal.md": "coding_terminal",
  "company_collections.md": "company_sample_catalogs",
  "company_coverage_followup.md": "company_sample_catalogs",
  "computer_use_mobile.md": "computer_use_gui",
  "enterprise_customer.md": "enterprise_customer_service",
  "finance_legal.md": "finance_legal_compliance",
  "general_agent_datasets.md": "general_agent_suites_trajectories",
  "mcp_tool_agents.md": "mcp_tool_use",
  "multiagent_memory.md": "multiagent_memory_planning_games",
  "office_professional.md": "office_professional",
  "robotics_physical.md": "robotics_physical_ai",
  "safety_monitoring.md": "safety_cybersecurity",
  "science_data_research.md": "science_data_research",
  "skeptic_dedup_access.md": "general_agent_suites_trajectories",
  "trajectory_rl_data.md": "general_agent_suites_trajectories",
}

const REQUIRED_SEEDS = [
  { label: "Mercor APEX-Agents leaderboard", publisher: "Mercor", url: "https://www.mercor.com/apex/apex-agents-leaderboard/", category: "office_professional", description: "Leaderboard results for the APEX-Agents benchmark of cross-application professional work." },
  { label: "APEX-Agents", publisher: "Mercor", url: "https://huggingface.co/datasets/mercor/apex-agents", category: "office_professional", description: "Task data for evaluating agents on long-horizon professional workflows across multiple applications." },
  { label: "GDPval train viewer", publisher: "OpenAI", url: "https://huggingface.co/datasets/openai/gdpval/viewer/default/train", category: "office_professional", description: "Professional knowledge-work tasks with reference files and expert-authored evaluation criteria." },
  { label: "Aviro C4 Samples", publisher: "Aviro", url: "https://www.aviro.ai/benchmarks/c4/samples", category: "company_sample_catalogs", description: "A browsable sample gallery of long-running agent tasks from Aviro's C4 benchmark." },
  { label: "WebLINX raw demonstrations", publisher: "McGill NLP", url: "https://huggingface.co/datasets/McGill-NLP/WebLINX-full", category: "browser_web", description: "Raw conversational web-navigation demonstrations collected across more than 150 real websites." },
]

const DISALLOWED_MIRROR_URLS = new Set(["https://huggingface.co/datasets/benchflow/skillsbench", "https://huggingface.co/datasets/harborframework/terminal-bench-2.0", "https://huggingface.co/datasets/markov-ai/apex-agents"])
const KNOWN_BROKEN_URLS = new Set(["https://cua.ai/docs/cuabench/guide/fundamentals/registry", "https://github.com/roger-creus/agentick/tree/v1.0", "https://os-world.github.io/", "https://www.armbench.com/"])
const RESULT_ONLY_URLS = new Set(["https://datasets-server.huggingface.co/size?dataset=ServiceNow-AI/EnterpriseOps-Gym"])

const EXPLICIT_FAMILIES = [
  ["ds_clawbench", "ClawBench", "TIGER / NAIL", "browser_web", /(?:clawbenchv[12]trace|nail-group\/clawbench|tiger-(?:ai-)?lab\/clawbench)/iu],
  ["ds_agents_last_exam", "Agents' Last Exam", "UC Berkeley RDI", "office_professional", /agents-last-exam/iu],
  ["ds_fdabench", "FDABench", "FDABench", "science_data_research", /fdabench2026\/(?:fdabench-lite|fdabench-full|fdabench-file)/iu],
  ["ds_weblinx", "WebLINX", "McGill NLP", "browser_web", /mcgill-nlp\/(?:weblinx|weblinx-full|weblinx-browsergym)/iu],
  ["ds_terminal_bench_2", "Terminal-Bench 2", "Harbor", "coding_terminal", /(?:terminal-bench-2(?:\.0)?(?:-trajectories)?|terminalbench-trajectories)(?=$|[\s/?#])/iu],
  ["ds_osworld", "OSWorld", "xlang", "computer_use_gui", /(?:os-world\.github\.io|xlang-ai\/osworld-v2|ubuntu_osworld_verified_trajs|hud-evals\/osworld-(?:verified|gold))/iu],
  ["ds_apex_agents", "APEX-Agents", "Mercor", "office_professional", /(?:mercor\/apex-agents|apex\/apex-agents-leaderboard)/iu],
  ["ds_gdpval", "GDPval", "OpenAI", "office_professional", /openai\/gdpval/iu],
  ["ds_aviro_c4", "Aviro C4 Samples", "Aviro", "company_sample_catalogs", /aviro\.ai\/benchmarks\/c4\/samples/iu],
]

const cleanText = (value) =>
  value
    .replace(/\[([^\]]+)\]\([^)]*\)/gu, "$1")
    .replace(/[`*_]/gu, "")
    .replace(/<br\s*\/?>/giu, " ")
    .replace(/\s+/gu, " ")
    .trim()

const deterministicCompare = (left, right) => (left === right ? 0 : left < right ? -1 : 1)

const DESCRIPTION_HEADER = /description|evidence|scale|contents?|scope|what (?:it|is)|notes?|caveat|summary|details?|data form|coverage/iu
const RESEARCH_SHORTHAND = /(?:^|[,. ;])(?:HF(?:\/Exa)?|Exa|AAE|AAB|ACU|Survey|Compendium|Directory expansion|High-confidence accessible datasets)(?=$|[,. ;])/giu
const sanitizeDescription = (value) =>
  cleanText(value)
    .replace(/https:\/\/[^\s)<>{}\]|]+/giu, " ")
    .replace(RESEARCH_SHORTHAND, " ")
    .replace(/\s+([,.;:])/gu, "$1")
    .replace(/\s+/gu, " ")
    .trim()

const descriptionFromCells = ({ cells, headers, nameColumn, publisherColumn }) =>
  sanitizeDescription(
    headers
      .map((header, index) => ({ header, index }))
      .filter(
        ({ header, index }) =>
          index !== nameColumn &&
          index !== publisherColumn &&
          DESCRIPTION_HEADER.test(header) &&
          !/discovery|verification|citation|source|url|link/iu.test(header),
      )
      .map(({ index }) => cells[index] ?? "")
      .filter(Boolean)
      .join(" "),
  )

const slug = (value) =>
  value
    .normalize("NFKD")
    .replace(/[^a-z0-9]+/giu, "_")
    .replace(/^_+|_+$/gu, "")
    .toLowerCase()

const hash = (value) => createHash("sha256").update(value).digest("hex").slice(0, 12)
const splitRow = (line) => line.trim().replace(/^\||\|$/gu, "").split("|").map(cleanText)
const markdownLinks = (line) =>
  [...line.matchAll(/\[([^\]]+)\]\((https:\/\/[^)\s]+)\)/gu)].map((match) => ({
    label: cleanText(match[1] ?? "surface"),
    url: match[2] ?? "",
  }))

const extractLinks = (line) => {
  const links = markdownLinks(line)
  const linkedUrls = new Set(links.map(({ url }) => url))
  for (const match of line.matchAll(/https:\/\/[^\s)<>{}\]|]+/gu)) {
    const url = (match[0] ?? "").replace(/[.,;:]+$/gu, "")
    if (!linkedUrls.has(url)) links.push({ label: "", url })
  }
  return links.filter(({ url }, index, values) => values.findIndex((value) => value.url === url) === index)
}

const headerIndex = (headers, pattern) => headers.findIndex((header) => pattern.test(header))
const ACCESS_EVIDENCE = /\bcredentials?\b|\baccounts?\b|api key|\bkaggle\b|\blogin\b|\bsign[- ]?in\b|\bregistration\b|\bregister(?:ed|ing)?\b|\b(?:gate|gated|gates|gating)\b|\bapproval\b|accept(?:ance)? terms|(?<!non)(?<!non-)\bcommercial\b|\bproprietary\b|paid access|paid license|\bpublic\b|\bopen\b|\brolling\b|\bevolving\b|\b(?:samples?|demos?|previews?)\b|\bsubset\b|\bpartial\b|\bmixed\b|\bwithheld\b|\bprovisional\b|\bunclear\b|\banonymous\b|metadata warning/iu
const HARD_ACCESS_EVIDENCE = /\bcredentials?\b|\baccounts?\b|api key|\bkaggle\b|\blogin\b|\bsign[- ]?in\b|\bregistration\b|\bregister(?:ed|ing)?\b|\b(?:gate|gated|gates|gating)\b|\bapproval\b|accept(?:ance)? terms|(?<!non)(?<!non-)\bcommercial\b|\bproprietary\b|paid access|paid license|\bpublic\b|\bopen\b|\brolling\b|\bevolving\b|\bsubset\b|\bpartial\b|\bwithheld\b|\bprovisional\b|\bunclear\b|\banonymous\b|metadata warning/iu
const DIFFERENTIATED_ARTIFACT = /(?<![a-z0-9])(?:trajector(?:y|ies)|traces?|rollouts?|demonstrations?|interactions?|videos?|results?|scores?|leaderboards?|(?:evaluation )?logs?|inputs?|fixtures?|assets?|file corp(?:us|ora)|documents?|references?|gold|answers?|rubrics?|training|sft|rlhf|preferences?|rewards?|viewers?|samples?|galler(?:y|ies)|previews?)(?![a-z0-9])/iu
const LINK_SCOPE_STOPWORDS = new Set(["canonical", "data", "dataset", "download", "file", "files", "full", "link", "open", "project", "public", "release", "source", "surface", "task", "tasks"])
const normalizeEvidenceToken = (value) => {
  if (value.endsWith("ies") && value.length > 4) return `${value.slice(0, -3)}y`
  if (value.endsWith("s") && value.length > 3) return value.slice(0, -1)
  return value
}
const evidenceTokens = (value) =>
  new Set(
    (cleanText(value).toLowerCase().match(/[a-z0-9]+/gu) ?? [])
      .map(normalizeEvidenceToken)
      .filter((token) => token.length > 1 && !LINK_SCOPE_STOPWORDS.has(token)),
  )
const evidenceClauses = (text) =>
  cleanText(text)
    .split(/\s*\|\s*|\s*;\s*|(?<=[.!?])\s+/u)
    .map(cleanText)
    .filter((clause) => clause.length > 0)
const linkScopeWeights = (label, url) => {
  const weights = new Map([...evidenceTokens(label)].map((token, index) => [token, index === 0 ? 1 : 2]))
  const hostname = new URL(url).hostname.toLowerCase()
  if (hostname === "github.com") for (const token of ["github", "repo", "repository", "framework"]) if (!weights.has(token)) weights.set(token, 1)
  if (hostname === "huggingface.co") for (const token of ["hf", "hugging", "face"]) if (!weights.has(token)) weights.set(token, 1)
  return weights
}
const scopedClauses = (label, url, text) => {
  const scope = linkScopeWeights(label, url)
  return evidenceClauses(text)
    .map((clause) => ({
      clause,
      score: [...evidenceTokens(clause)].reduce((score, token) => score + (scope.get(token) ?? 0), 0),
    }))
    .filter(({ score }) => score > 0)
    .sort((left, right) => right.score - left.score)
}
const linkLocalSurfaceContext = ({ familyLabel, linkLabel, url, sharedRowContext, companyCollection, linkCount }) => {
  const base = cleanText(`${familyLabel} ${linkLabel} ${url}`)
  if (linkCount === 1) return cleanText(`${base} ${sharedRowContext}`)
  if (companyCollection) return base
  const common = evidenceClauses(sharedRowContext).filter(
    (clause) => /(?<![a-z0-9])(?:tasks?|benchmarks?|environments?)(?![a-z0-9])/iu.test(clause) && !DIFFERENTIATED_ARTIFACT.test(clause),
  )
  const local = scopedClauses(linkLabel, url, sharedRowContext).map(({ clause }) => clause)
  return cleanText([...new Set([base, ...common, ...local])].join(" "))
}

const isPaperLink = ({ label, url }) =>
  /\bpaper\b/iu.test(label) || /(?:arxiv\.org|openreview\.net)(?:\/|$)/iu.test(url)

const scopedAccess = (label, text) => {
  const namedException = text.match(/mostly open;\s*([^.;]+?)\s+(?:are|is)\s+gated/iu)
  if (namedException !== null) {
    const gatedNames = (namedException[1] ?? "").split(/\s+(?:and|,)\s*/u).map(slug)
    return gatedNames.some((name) => slug(label).includes(name)) ? "gated" : "open"
  }
  const match = text.match(/([a-z0-9+_.-]+(?:\s+(?:and|,)\s*[a-z0-9+_.-]+)*)\s+(?:are|is)\s+gated;\s*(?:the\s+)?others\s+open/iu)
  if (match === null) return null
  const gatedNames = (match[1] ?? "").split(/\s+(?:and|,)\s*/u).map(slug)
  return gatedNames.some((name) => slug(label).includes(name)) ? "gated" : "open"
}
const matchRanges = (pattern, text) => [...text.matchAll(pattern)].map((match) => ({ start: match.index ?? 0, end: (match.index ?? 0) + (match[0]?.length ?? 0) }))
const rangeDistance = (left, right) => left.end < right.start ? right.start - left.end : right.end < left.start ? left.start - right.end : 0
const targetedAccess = (label, text) => {
  const normalizedText = cleanText(text).toLowerCase()
  const normalizedLabel = cleanText(label).toLowerCase()
  if (normalizedLabel.length < 4) return null
  const escapedLabel = normalizedLabel.replace(/[.*+?^${}()|[\]\\]/gu, "\\$&")
  const labelRanges = matchRanges(new RegExp(escapedLabel, "gu"), normalizedText)
  const rules = [
    ["credential_dependent", /credential|\baccounts?\b|api key|kaggle|\blogin\b|\bsign[- ]?in\b|\bregistration\b|\bregister(?:ed|ing)?\b/gu],
    ["gated", /gated|approval|accept(?:ance)? terms/gu],
    ["commercial", /(?<!non)(?<!non-)\bcommercial\b|\bproprietary\b|paid access|paid license/gu],
    ["open", /public|open/gu],
    ["rolling", /rolling|evolving/gu],
    ["public_subset", /subset|partial|mixed|withheld/gu],
    ["provisional", /provisional|unclear|anonymous/gu],
  ]
  const evidence = rules.flatMap(([access, pattern], priority) => matchRanges(pattern, normalizedText).filter((range) => labelRanges.every((labelRange) => rangeDistance(labelRange, range) > 0)).map((range) => {
    const proximity = labelRanges.map((labelRange) => ({ distance: rangeDistance(labelRange, range), direction: range.end <= labelRange.start ? 0 : 1 })).sort((left, right) => left.distance - right.distance || left.direction - right.direction)[0]
    return { access, priority, distance: proximity?.distance ?? Number.POSITIVE_INFINITY, direction: proximity?.direction ?? 1 }
  })).filter(({ distance }) => distance <= 40).sort((left, right) => left.distance - right.distance || left.direction - right.direction || left.priority - right.priority)[0]
  return evidence?.access ?? null
}
const OPEN_LICENSE_EVIDENCE =
  /(?<![a-z0-9])(?:mit|apache(?:[- ]?2(?:\.0)?)?|cc(?:[- ]?by(?:[- ](?:sa|nc|nd))*[- ]?\d(?:\.\d)?|0(?:[- ]?\d(?:\.\d)?)?)|bsd(?:[- ]?\d[- ]?clause)?|(?:a?gpl|lgpl)(?:[- ]?v?\d(?:\.\d)?)?|mpl(?:[- ]?\d(?:\.\d)?)?|odc(?:[- ]?by)?|odbl|public domain)(?![a-z0-9])/iu
const SAMPLE_ACCESS_EVIDENCE = /\b(?:public|open|free)\s+(?:schema(?: and generated)?\s+)?(?:samples?|demos?|previews?)\b|\bpublic\b.{0,60}\b(?:samples?|demos?|previews?)\b.{0,30}\bonly\b|\b(?:samples?|demos?|previews?)\s+only\b|\bonly\s+(?:an?\s+)?(?:samples?|demos?|previews?)\b|\bfree demo\b|\bpublic artifact is only (?:an?\s+)?sample\b|\bexposes?\s+(?:\S+\s+){0,5}(?:samples?|demos?|previews?)(?:\s+cases?)?\b/iu
const PUBLIC_SUBSET_EVIDENCE = /\b(?:public|open)\s+(?:\d+(?:\.\d+)?%\s+)?(?:subsets?|partial|limited)\b|\b(?:subsets?|partial|limited)\s+(?:is\s+)?(?:public|open)\b|\bonly\s+\d+(?:\.\d+)?%\s+public\b|\b(?:public|open)\b.{0,180}\b(?:private|protected|held[ -]out|withheld|restricted|encrypted|not redistributed|requires? (?:an?\s+)?(?:email\s+)?request|by request)\b|\b(?:gold|test|reference|evaluator)(?:\/(?:gold|test|reference|evaluator))?\s+(?:artifacts?|material)?\s*(?:are\s+)?(?:distributed separately|by request|private|protected|restricted|withheld|encrypted)\b/iu
const classifyAccessEvidence = (text) => {
  if (/credential|\baccounts?\b|api key|kaggle|\blogin\b|\bsign[- ]?in\b|\bregistration\b|\bregister(?:ed|ing)?\b/iu.test(text)) return "credential_dependent"
  if (/\b(?:gate|gated|gates|gating)\b|approval|accept.*terms|challenge terms/iu.test(text)) return "gated"
  if (SAMPLE_ACCESS_EVIDENCE.test(text)) return "sample_demo"
  if (PUBLIC_SUBSET_EVIDENCE.test(text)) return "public_subset"
  if (/(?<!non)(?<!non-)\bcommercial\b|\bproprietary\b|contact (?:required|sales)|paid (?:access|license)|license (?:purchase|required|sold)|purchasable/iu.test(text)) return "commercial"
  if (/\b(?:public|open)\b/iu.test(text) || OPEN_LICENSE_EVIDENCE.test(text)) return "open"
  if (/rolling|evolving/iu.test(text)) return "rolling"
  if (/^\s*(?:samples?|demos?|previews?)(?:\/contact)?\s*$/iu.test(text)) return "sample_demo"
  if (/^\s*(?:subset|partial|withheld)\s*$/iu.test(text)) return "public_subset"
  if (/provisional|unclear|anonymous|metadata warning/iu.test(text)) return "provisional"
  return null
}
const inferAccessDefault = (text, linkCount) => {
  if (/\b(?:mix(?:ed)? of|both)\s+(?:public|open)\s+and\s+gated\b/iu.test(text)) return null
  if (SAMPLE_ACCESS_EVIDENCE.test(text)) return "sample_demo"
  if (PUBLIC_SUBSET_EVIDENCE.test(text)) return "public_subset"
  const leading = classifyAccessEvidence(evidenceClauses(text)[0] ?? "")
  if (linkCount === 1 && leading !== null) return leading
  const levels = [...new Set(evidenceClauses(text).map(classifyAccessEvidence).filter((access) => access !== null))]
  if (levels.includes("public_subset") && levels.every((level) => level === "open" || level === "public_subset")) return "public_subset"
  if (linkCount > 1 && levels.length > 1) return null
  return levels.length === 1 ? levels[0] : null
}
const inferAccess = ({ text, defaultText, label, url, linkCount, companyCollection }) => {
  const scoped = scopedAccess(label, text)
  if (scoped !== null) return scoped
  const rowDefault = inferAccessDefault(defaultText, linkCount)
  if (companyCollection && /^\s*(?:public|open)\s+samples?\b/iu.test(defaultText)) {
    return /\b(?:samples?|demos?|previews?)\b/iu.test(label) ? "sample_demo" : "open"
  }
  if (companyCollection && /^\s*(?:public|open)(?:\s+(?:datasets?|data|benchmarks?|releases?))?\s*[.!;]/iu.test(defaultText)) return "open"
  if (linkCount === 1 && rowDefault !== null) return rowDefault
  if (linkCount === 1) {
    const contextualDefault = inferAccessDefault(text, linkCount)
    if (contextualDefault !== null) return contextualDefault
  }
  const targeted = evidenceClauses(text)
    .map((clause) => targetedAccess(label, clause))
    .find((access) => access !== null)
  if (targeted !== undefined) return targeted
  const localEvidence = scopedClauses(label, url, text)
    .filter(({ clause }) => ACCESS_EVIDENCE.test(clause))
    .map(({ clause }) => ({ access: classifyAccessEvidence(clause), hard: HARD_ACCESS_EVIDENCE.test(clause) }))
    .filter(({ access }) => access !== null)
  const hardLocal = localEvidence.find(({ hard }) => hard)?.access
  if (hardLocal !== undefined && hardLocal !== null) return hardLocal
  const specialOpen = new URL(url).hostname.toLowerCase() === "github.com" || /viewer|gallery/iu.test(label) || /\/viewer(?:\/|$)/iu.test(url)
  if (rowDefault !== null) return specialOpen && ["gated", "credential_dependent", "commercial"].includes(rowDefault) ? "open" : rowDefault
  const softLocal = localEvidence[0]?.access
  if (softLocal !== undefined && softLocal !== null) return softLocal
  if (companyCollection && /^\s*(?:public|open)(?:\s+(?:samples?|datasets?|data|benchmarks?|releases?))?\s*[.!;]/iu.test(defaultText)) return "open"
  if (companyCollection && /research benchmarks? (?:are|is) open/iu.test(defaultText) && !/catalog|commercial|packs?/iu.test(label)) return "open"
  if (specialOpen) return "open"
  const fallback = inferAccessDefault(text, linkCount)
  if (fallback !== null) return fallback
  if (/\/samples?(?:\/|$)/iu.test(url)) return "sample_demo"
  if (/\b(?:mixed|var(?:y|ies)|depends)\b|\b(?:public|open)\b.*\bgated\b|\bgated\b.*\b(?:public|open)\b/iu.test(text)) return "provisional"
  return "open"
}

const artifactEvidenceText = (text, label) => {
  const labelNamesCompanion = /(?<![a-z0-9])(?:trajector(?:y|ies)|traces?|rollouts?|demonstrations?|logs?|inputs?|references?|training|sft)(?![a-z0-9])/iu.test(label)
  const artifactNoun = String.raw`(?:trajector(?:y|ies)|traces?|rollouts?|demonstrations?|interactions?|videos?|results?|scores?|logs?|inputs?|fixtures?|assets?|documents?|references?|answers?|rubrics?|training|samples?|demos?|previews?|viewers?|environments?|gyms?|sandboxes?|worlds?|runtimes?|tasks?|benchmarks?|prompts?|questions?|scenarios?|problems?)`
  const qualifiedNegation = new RegExp(
    String.raw`\b(?:no|without)\s+(?:[a-z0-9-]+\s+){0,3}${artifactNoun}(?:\s+(?:corp(?:us|ora)|datasets?|data))?(?:\s+(?:are|is)\s+(?:released|available))?\b`,
    "giu",
  )
  return evidenceClauses(text)
    .filter((clause) => labelNamesCompanion || !/\bcompanion\b.{0,80}\b(?:trajector(?:y|ies)|traces?|rollouts?|datasets?)\b/iu.test(clause))
    .map((clause) => clause
      .replace(qualifiedNegation, "")
      .replace(/\bnot\s+(?:itself\s+)?(?:an?\s+)?(?:task dataset|benchmark dataset|tool environment|environment|sample viewer|viewer|benchmark)\b/giu, "")
      .replace(/\b(?:viewers?|previews?|galler(?:y|ies))\s+(?:currently\s+)?(?:unavailable|broken|missing|not available)\b/giu, "")
      .replace(/\bdo[- ]not[- ]answer\b/giu, "")
      .replace(/\bper[- ]sample\b/giu, "per item"))
    .join(" ")
}

const inferArtifacts = (text, label = "") => {
  const evidence = artifactEvidenceText(text, label)
  const explicitlyNonTraining = /\b(?:no|without)\s+(?:llm|model)\s+training\b/iu.test(text)
  const explicitlyNoViewer = /\b(?:no|without)\s+(?:[a-z0-9-]+\s+){0,2}viewers?\b|\bviewers?\s+(?:currently\s+)?(?:unavailable|broken|missing|not available)\b|\bviewers?\b.{0,40}\bschema mismatch\b/iu.test(text)
  const artifacts = []
  if (
    /\bcatalogs?\b|\boff-the-shelf\b|\b(?:data|datasets?) marketplaces?\b|\bmarketplaces? (?:for|of) (?:data|datasets?)\b|\bmulti[- ]dataset offerings?\b|\bcommercial (?:benchmark-specific )?datasets\b/iu.test(
      evidence,
    )
  ) {
    artifacts.push("commercial_catalog")
  }
  if (/(?<![a-z0-9])(?:trajector(?:y|ies)|traces?|rollouts?|demonstrations?|interactions?|videos?)(?![a-z0-9])/iu.test(evidence)) artifacts.push("trajectories")
  if (/(?<![a-z0-9])(?:results?|scores?|leaderboards?|(?:evaluation )?logs?)(?![a-z0-9])/iu.test(evidence)) artifacts.push("results")
  if (/(?<![a-z0-9])(?:inputs?|fixtures?|assets?|file corp(?:us|ora)|documents?|html decks?|slide images?|source papers?)(?![a-z0-9])/iu.test(evidence)) artifacts.push("inputs")
  if (/(?<![a-z0-9])(?:references?|gold|answers?|rubrics?)(?![a-z0-9])/iu.test(evidence)) artifacts.push("references")
  if (!explicitlyNonTraining && /(?<![a-z0-9])(?:training|sft|rlhf|preferences?|rewards?)(?![a-z0-9])/iu.test(evidence)) artifacts.push("training")
  if (!explicitlyNoViewer && /(?<![a-z0-9])(?:viewers?|samples?|galler(?:y|ies)|previews?)(?![a-z0-9])/iu.test(evidence)) artifacts.push("viewer_sample")
  if (/(?<![a-z0-9])(?:environments?|gyms?|sandboxes?|worlds?|runtimes?|docker|vms?)(?![-a-z0-9])/iu.test(evidence)) artifacts.push("environment")
  if (/(?<![a-z0-9])(?:tasks?|benchmarks?|prompts?|questions?|scenarios?|problems?)(?![a-z0-9])/iu.test(evidence)) artifacts.push("tasks")
  return artifacts.length === 0 ? ["tasks"] : [...new Set(artifacts)]
}

const inferKind = (url, label) => {
  if (/leaderboard/iu.test(url)) return "leaderboard"
  if (/\/viewer(?:\/|$)|\/samples?(?:\/|$)|gallery/iu.test(url)) return "sample_viewer"
  if (/huggingface\.co\/datasets\//iu.test(url)) return "dataset"
  if (/github\.com\//iu.test(url)) return "repository"
  if (/catalog|marketplace|\/datasets\/?$/iu.test(url)) return "catalog"
  if (/(?<![a-z0-9])(?:environment|gym|sandbox|world)(?![a-z0-9])/iu.test(`${url} ${label}`)) return "environment"
  if (/\.(?:csv|tsv|json|jsonl|zip|tar|gz|parquet)(?:\?|$)/iu.test(url)) return "download"
  return "benchmark_page"
}

const inferProvenance = (label, url, text) => {
  const local = `${label} ${url}`
  if (/anonymous/iu.test(local) || /\banonymous release\b/iu.test(text)) return "anonymous_release"
  if (/community|third-party|derivative|unofficial|mirror|rehost|fork/iu.test(local) || /\bcommunity[- ](?:derived|package|release)\b/iu.test(text)) return "community_derivative"
  if (/\bcompanion\b/iu.test(local) || (/\bcompanion\b/iu.test(text) && /(?<![a-z0-9])(?:trajector(?:y|ies)|traces?|rollouts?|logs?|inputs?|references?|training|sft)(?![a-z0-9])/iu.test(local))) return "official_companion"
  return "first_party"
}

const familyNameKey = (value) => cleanText(value).normalize("NFKC").toLowerCase()
const GENERIC_FAMILY_NAMES = new Set(["data", "dataset", "download", "github", "hf", "hugging face", "leaderboard", "repo", "repository", "samples", "site", "viewer"])
const PUBLISHER_STOPWORDS = new Set(["ai", "al", "and", "academic", "author", "authors", "collaborators", "collaboration", "community", "et", "institute", "lab", "labs", "nlp", "official", "release", "research", "team", "the", "university"])
const familyStem = (value) => slug(value).replace(/(?:_?bench(?:mark)?)$/u, "")
const isSelfPublisher = (candidate) => {
  const name = slug(candidate.familyLabel)
  const stem = familyStem(candidate.familyLabel)
  const publisher = slug(candidate.publisher)
  return publisher.includes(name) || name.includes(publisher) || (stem.length >= 4 && publisher.includes(stem))
}
const publisherTokens = (candidate) =>
  isSelfPublisher(candidate)
    ? []
    : slug(candidate.publisher).split("_").filter((token) => token.length > 1 && !PUBLISHER_STOPWORDS.has(token))
const sharesLineage = (left, right) => left.some((token) => right.includes(token))
const canonicalCandidate = (group) => [...group].sort((left, right) => Number(["general_agent_suites_trajectories", "company_sample_catalogs"].includes(left.category)) - Number(["general_agent_suites_trajectories", "company_sample_catalogs"].includes(right.category)) || Number(isSelfPublisher(left)) - Number(isSelfPublisher(right)) || deterministicCompare(left.publisher, right.publisher))[0]
const urlOwner = (value) => {
  const url = new URL(value)
  const parts = url.pathname.split("/").filter(Boolean)
  return url.hostname === "huggingface.co" && parts[0] === "datasets" ? parts[1] : parts[0]
}
const canonicalFamilyIdentities = (candidates) => {
  const groups = new Map()
  for (const candidate of candidates) groups.set(familyNameKey(candidate.familyLabel), [...(groups.get(familyNameKey(candidate.familyLabel)) ?? []), candidate])
  const identities = new Map()
  for (const [key, group] of groups) {
    if (new Set(group.map((candidate) => candidate.sourceReport)).size < 2 || GENERIC_FAMILY_NAMES.has(key)) continue
    const components = []
    const withoutLineage = []
    for (const candidate of group) {
      const tokens = publisherTokens(candidate)
      if (tokens.length === 0) {
        withoutLineage.push(candidate)
        continue
      }
      const matches = components.filter((component) => component.some((entry) => sharesLineage(tokens, publisherTokens(entry))))
      const merged = [candidate, ...matches.flat()]
      components.splice(0, components.length, ...components.filter((component) => !matches.includes(component)), merged)
    }
    if (components.length <= 1) {
      const canonical = canonicalCandidate(group)
      if (canonical !== undefined) for (const candidate of group) identities.set(candidate, { familyId: `ds_${slug(canonical.familyLabel).slice(0, 42)}_${hash(key).slice(0, 8)}`, name: canonical.familyLabel, publisher: canonical.publisher, category: canonical.category })
      continue
    }
    const selfGroups = new Map()
    for (const candidate of withoutLineage) {
      const publisher = slug(candidate.publisher)
      selfGroups.set(publisher, [...(selfGroups.get(publisher) ?? []), candidate])
    }
    const lineageGroups = [...components, ...selfGroups.values()]
    for (const lineageGroup of lineageGroups) {
      const canonical = canonicalCandidate(lineageGroup)
      if (canonical === undefined) continue
      const qualifier = isSelfPublisher(canonical) ? (urlOwner(canonical.url) ?? canonical.publisher) : canonical.publisher
      const lineageKey = `${key}|${slug(qualifier)}|${canonical.category}`
      const identity = { familyId: `ds_${slug(canonical.familyLabel).slice(0, 34)}_${slug(qualifier).slice(0, 16)}_${hash(lineageKey).slice(0, 8)}`, name: `${canonical.familyLabel} (${qualifier})`, publisher: canonical.publisher, category: canonical.category }
      for (const candidate of lineageGroup) identities.set(candidate, identity)
    }
  }
  return identities
}

const familyIdentity = (candidate, canonicalIdentities) => {
  const searchable = `${candidate.familyLabel} ${candidate.url}`
  const explicit = EXPLICIT_FAMILIES.find(([, , , , pattern]) => pattern.test(searchable))
  if (explicit !== undefined) {
    return { familyId: explicit[0], name: explicit[1], publisher: explicit[2], category: explicit[3] }
  }
  const canonical = canonicalIdentities.get(candidate)
  if (canonical !== undefined) return canonical
  const key = `${candidate.category}|${candidate.publisher}|${candidate.familyLabel}`
  return { familyId: `ds_${slug(candidate.familyLabel).slice(0, 42)}_${hash(key).slice(0, 8)}`, name: candidate.familyLabel, publisher: candidate.publisher, category: candidate.category }
}

export function parseMarkdownCandidates({ markdown, sourceReport, category }) {
  const lines = markdown.split(/\r?\n/gu)
  const candidates = []
  let section = "Unsectioned evidence"
  for (let lineIndex = 0; lineIndex < lines.length; lineIndex += 1) {
    const line = lines[lineIndex] ?? ""
    const heading = line.match(/^#{1,6}\s+(.+)$/u)
    if (heading !== null) section = cleanText(heading[1] ?? section)
    if (
      /^[-*]\s+/u.test(line) &&
      /results?-only|exclusion|rejection|dead ends?|counter-search findings|code, config, or aggregate-results only/iu.test(
        section,
      )
    ) {
      for (const link of extractLinks(line)) {
        const label = link.label || cleanText(line).slice(0, 120)
        candidates.push({ sourceReport, section, sourceLine: lineIndex + 1, rowExcerpt: cleanText(line).slice(0, 600), publisher: label, label, familyLabel: label, url: link.url, category, context: cleanText(`${line} ${section}`), description: sanitizeDescription(cleanText(line)), surfaceContext: cleanText(`${label} ${line}`) })
      }
    }
    const separator = lines[lineIndex + 1] ?? ""
    if (!/^\|.*\|$/u.test(line) || !/^\|[\s|:-]+\|$/u.test(separator)) continue
    const headers = splitRow(line).map((header) => header.toLowerCase())
    const companyColumn = headerIndex(headers, /^company$/u)
    const publisherColumn = headerIndex(headers, /publisher|company/u)
    const nameColumn = Math.max(0, headerIndex(headers, /dataset|release|artifact|environment|candidate|surface/u))
    const accessColumn = headerIndex(headers, /access|availability|release status|license/u)
    for (lineIndex += 2; lineIndex < lines.length && /^\|.*\|$/u.test(lines[lineIndex] ?? ""); lineIndex += 1) {
      const row = lines[lineIndex] ?? ""
      const cells = splitRow(row)
      const links = extractLinks(row)
      const nameParts = cleanText(cells[nameColumn] ?? links[0]?.label ?? "Dataset surface").split(/\s+[—–]\s+/u)
      const rowLabel = nameParts[0] ?? "Dataset surface"
      const publisherCell = cells[publisherColumn] ?? rowLabel
      const publisher = publisherColumn === nameColumn && nameParts.length > 1 ? nameParts.slice(1).join(" — ") : cleanText(publisherCell).split(/\s+[—–]\s+/u)[0] || rowLabel
      const sharedRowContext = cleanText(row.replace(/\[[^\]]+\]\(https:\/\/[^)]+\)/gu, " "))
      const description = descriptionFromCells({ cells, headers, nameColumn, publisherColumn })
      for (const link of links) {
        const companyCollection = companyColumn >= 0
        const linkLabel = link.label || rowLabel
        const familyLabel = companyCollection ? linkLabel : rowLabel
        const label = companyCollection || linkLabel.toLowerCase() === familyLabel.toLowerCase() ? linkLabel : `${familyLabel} — ${linkLabel}`
        const releasedLinks = links.filter((candidateLink) => !isPaperLink(candidateLink))
        const linkContext = linkLocalSurfaceContext({ familyLabel, linkLabel, url: link.url, sharedRowContext, companyCollection, linkCount: links.length })
        const surfaceContext = cleanText(`${linkContext} ${releasedLinks.length === 1 && releasedLinks[0]?.url === link.url ? sharedRowContext : ""}`)
        const accessDefaultContext = accessColumn >= 0 ? cleanText(cells[accessColumn] ?? "") : ""
        candidates.push({ sourceReport, section, sourceLine: lineIndex + 1, rowExcerpt: cleanText(row).slice(0, 600), publisher, label, familyLabel, linkLabel, url: link.url, category, context: cleanText(`${cells.join(" ")} ${section}`), description, surfaceContext, accessContext: sharedRowContext, accessDefaultContext, linkCount: links.length, companyCollection })
      }
    }
    lineIndex -= 1
  }
  return candidates
}

export function classifyCandidate(candidate) {
  const text = `${candidate.section} ${candidate.label} ${candidate.context}`.toLowerCase()
  if (/\bpaper(?:\s*\/\s*poster)?[- ]only\b|\bposter[- ]only\b/iu.test(text) || /arxiv\.org|\/poster\/|\bpaper\b/iu.test(`${candidate.url} ${candidate.label}`)) return { decision: "paper_only", exclusionReason: "Paper surface without released dataset artifacts" }
  if (DISALLOWED_MIRROR_URLS.has(candidate.url.toLowerCase())) return { decision: "mirror", exclusionReason: "Known read-only mirror; canonical source retained separately" }
  if (RESULT_ONLY_URLS.has(candidate.url)) return { decision: "result_only", exclusionReason: "Operational metadata endpoint, not a durable dataset artifact" }
  if (KNOWN_BROKEN_URLS.has(candidate.url)) return { decision: "broken_unverifiable", exclusionReason: "URL failed a standards-compliant live availability check" }
  if (/mirror|fork|rehost|copy/iu.test(candidate.label) || (/rejection|exclusion/iu.test(candidate.section) && /mirror|fork|rehost|duplicate/iu.test(text))) return { decision: "mirror", exclusionReason: "Mirror or duplicate of a canonical release" }
  if (/results?-only|code, config, or aggregate-results only/iu.test(candidate.section)) return { decision: "result_only", exclusionReason: "Result or code archive is not a task or sample corpus" }
  if (/generic viewers?.*not counted as datasets|not counted as datasets?.*generic viewers?/iu.test(text)) return { decision: "result_only", exclusionReason: "Generic viewer explicitly excluded from the dataset inventory" }
  if (/\bcode[- ]only\b/iu.test(text)) return { decision: "result_only", exclusionReason: "Code archive without released task or sample data" }
  if (/high-confidence accepted dataset surfaces/iu.test(candidate.section)) return { decision: "retained" }
  if (/\/pull\/\d+(?:\/|$)/iu.test(candidate.url) || /verification pr|supporting evidence only/iu.test(candidate.label)) return { decision: "result_only", exclusionReason: "Supporting change record, not a dataset artifact" }
  if (/coming soon/iu.test(text)) return { decision: "unreleased", exclusionReason: "Release is announced but not available" }
  if (/no public (?:task|dataset|data) subset/iu.test(text)) return { decision: "result_only", exclusionReason: "No public task or dataset subset is available" }
  if (/no public (?:code|data|code\/data)(?: url| release)?/iu.test(text) || /\bexcluded\b/iu.test(text)) return { decision: "broken_unverifiable", exclusionReason: "Explicitly excluded with no verifiable public dataset artifact" }
  if (/\bunverifiable\b|\bdownload unclear\b|\bdead end\b|\bbroken\s+(?:link|url|download|site|page|release)\b/iu.test(text)) return { decision: "broken_unverifiable", exclusionReason: "No verifiable downloadable dataset surface" }
  if (/will be.*available|forthcoming|\btbu\b|not yet (?:public|released)|unreleased/iu.test(text)) return { decision: "unreleased", exclusionReason: "Release is announced but not available" }
  if (/monitoring queue|watchlist|recheck when|follow after release/iu.test(candidate.section)) return { decision: "monitoring", exclusionReason: "Tracked for a future release" }
  return { decision: "retained" }
}

const EXPLICIT_DESCRIPTIONS = new Map([
  ["ds_apex_agents", "APEX-Agents evaluates long-horizon professional workflows across multiple applications; the task data are gated while public leaderboard results remain browsable."],
  ["ds_gdpval", "GDPval contains professional knowledge-work tasks with reference files and expert-authored evaluation criteria."],
  ["ds_aviro_c4", "Aviro C4 presents a browsable sample gallery of long-running agent tasks from the C4 benchmark."],
  ["ds_weblinx", "WebLINX contains conversational web-navigation demonstrations collected across more than 150 real websites."],
])
const CATEGORY_DESCRIPTIONS = {
  computer_use_gui: "computer-use evaluation",
  browser_web: "browser-agent research",
  mcp_tool_use: "tool-use and MCP evaluation",
  coding_terminal: "coding and terminal-agent evaluation",
  office_professional: "professional knowledge-work evaluation",
  enterprise_customer_service: "enterprise and customer-service evaluation",
  finance_legal_compliance: "finance, legal, and compliance evaluation",
  science_data_research: "science, data, and research-agent evaluation",
  safety_cybersecurity: "agent safety and cybersecurity evaluation",
  multiagent_memory_planning_games: "multi-agent, memory, planning, and game evaluation",
  robotics_physical_ai: "robotics and physical-agent evaluation",
  general_agent_suites_trajectories: "general agent training and evaluation",
  company_sample_catalogs: "public company dataset and sample discovery",
}
const ARTIFACT_DESCRIPTIONS = {
  tasks: "tasks",
  environment: "an executable environment",
  inputs: "input files",
  references: "reference materials",
  trajectories: "agent trajectories",
  results: "evaluation results",
  training: "training records",
  viewer_sample: "browsable samples",
  commercial_catalog: "a dataset catalog",
}
const stripAccessPreamble = (value) =>
  value
    .replace(/^(?:public|open|gated|commercial|credential dependent|account required|mix(?:ed)? of public and gated|mostly open)\s*[.;:]\s*/iu, "")
    .trim()
const endSentence = (value) => (/[.!?]$/u.test(value) ? value : `${value}.`)
const truncateDescription = (value) => {
  if (value.length <= 480) return value
  const prefix = value.slice(0, 476)
  const boundary = prefix.lastIndexOf(" ")
  return `${prefix.slice(0, boundary > 300 ? boundary : 476).trim()}…`
}
const familyDescription = ({ identity, raw, artifacts }) => {
  const explicit = EXPLICIT_DESCRIPTIONS.get(identity.familyId)
  if (explicit !== undefined) return explicit
  const evidence = stripAccessPreamble(sanitizeDescription(raw.description ?? ""))
  const fallbackArtifacts = artifacts.slice(0, 3).map((artifact) => ARTIFACT_DESCRIPTIONS[artifact]).join(", ")
  const detail = evidence.length >= 18
    ? evidence
    : `Provides ${fallbackArtifacts || "dataset artifacts"} for ${CATEGORY_DESCRIPTIONS[identity.category]}.`
  const named = detail.toLowerCase().startsWith(identity.name.toLowerCase())
    ? detail
    : `${identity.name} — ${detail}`
  return truncateDescription(endSentence(named))
}

export function createDecisionManifest(rawCandidates, { verifiedAt, companyCoverage }) {
  const seenUrls = new Map()
  const canonicalIdentities = canonicalFamilyIdentities(rawCandidates)
  const candidates = rawCandidates.map((raw) => {
    const candidateId = `cand_${hash(`${raw.sourceReport}|${raw.sourceLine}|${raw.url}|${raw.label}`)}`
    const identity = familyIdentity(raw, canonicalIdentities)
    const classification = classifyCandidate(raw)
    const base = { candidateId, sourceReport: raw.sourceReport, section: raw.section, rowExcerpt: raw.rowExcerpt, publisher: raw.publisher, label: raw.label, url: raw.url, category: raw.category, companyIds: raw.companyIds ?? [] }
    if (classification.decision !== "retained") return { ...base, decision: classification.decision, exclusionReason: classification.exclusionReason }
    const aliasOf = seenUrls.get(raw.url)
    if (aliasOf !== undefined) return { ...base, category: aliasOf.category, decision: "alias", familyId: aliasOf.familyId, aliasOf: aliasOf.candidateId }
    const surfaceId = `surface_${hash(raw.url)}`
    const surfaceText = raw.surfaceContext ?? `${raw.label} ${raw.url}`
    const artifacts = inferArtifacts(surfaceText, raw.label)
    const retained = {
      ...base,
      category: identity.category,
      decision: "retained",
      familyId: identity.familyId,
      family: { name: identity.name, publisher: identity.publisher, description: familyDescription({ identity, raw, artifacts }), category: identity.category, tags: [...new Set([identity.category, ...artifacts])], versionNote: null },
      surface: { surfaceId, label: raw.label, url: raw.url, kind: inferKind(raw.url, raw.label), artifacts, access: inferAccess({ text: raw.accessContext ?? raw.context, defaultText: raw.accessDefaultContext ?? "", label: raw.linkLabel ?? raw.label, url: raw.url, linkCount: raw.linkCount ?? 1, companyCollection: raw.companyCollection ?? false }), provenance: inferProvenance(raw.label, raw.url, surfaceText), notes: raw.context.slice(0, 600) },
    }
    seenUrls.set(raw.url, { candidateId, familyId: identity.familyId, category: identity.category })
    return retained
  })
  return { schemaVersion: 1, verifiedAt, sourceRoot: ".omo/ulw-research/20260712-233722", candidates, companyCoverage }
}

const readCanonicalCompanies = (root) => {
  const read = (path) => JSON.parse(readFileSync(join(root, path), "utf8"))
  const core = read("research/corpus/companies.json").map((record) => ({ companyId: record.companyId, name: record.name, aliases: record.aliases ?? [] }))
  const adjacent = read("research/corpus/adjacent.json").map((record) => ({ companyId: record.adjacentId, name: record.name, aliases: record.aliases ?? [] }))
  const supplemental = ["research/corpus/supplemental-adjacent.json", "research/corpus/supplemental-adjacent-2.json"].flatMap((path) => read(path).records.map((record) => ({ companyId: record.adjacentId, name: record.name, aliases: [...(record.aliases ?? []), ...(record.inputRefs ?? [])] })))
  return [...core, ...adjacent, ...supplemental]
}

const attachCompanyIds = (rawCandidates, companies) => {
  const aliases = { "telus digital": "TELUS Digital AI Data Solutions", nvidia: "NVIDIA NeMo", aws: "Amazon Bedrock AgentCore", google: "Google Vertex AI", microsoft: "Microsoft Azure AI Foundry", ibm: "IBM Consulting", datacurve: "Datacurve" }
  const index = new Map()
  for (const company of companies) for (const name of [company.name, ...company.aliases]) index.set(slug(name), company.companyId)
  return rawCandidates.map((candidate) => {
    const names = candidate.publisher.split(/\s*\/\s*/u).map((name) => aliases[slug(name).replaceAll("_", " ")] ?? name)
    const companyIds = [...new Set(names.map((name) => index.get(slug(name))).filter(Boolean))]
    return { ...candidate, companyIds }
  })
}

export function extractNoHitReceiptNames(markdown) {
  const names = []
  let collecting = false
  for (const line of markdown.split(/\r?\n/gu)) {
    if (/following companies received exact-name countersearches/iu.test(line)) {
      collecting = true
      continue
    }
    if (!collecting) continue
    if (/^#{1,6}\s+/u.test(line) || /^These should be recorded/iu.test(line)) break
    const bullet = line.match(/^[-*]\s+(.+)$/u)
    if (bullet === null) continue
    names.push(...cleanText(bullet[1] ?? "").split(/\s*,\s*/u).filter(Boolean))
  }
  return new Set(names.map(familyNameKey))
}

export function createCompanyCoverage(companies, candidates, noHitReceiptNames) {
  const receipts = new Set([...noHitReceiptNames].map(familyNameKey))
  return [...companies]
    .sort((left, right) => deterministicCompare(left.companyId, right.companyId))
    .map((company) => {
      const candidateIds = candidates
        .filter((candidate) => (candidate.decision === "retained" || candidate.decision === "alias") && candidate.companyIds.includes(company.companyId))
        .map((candidate) => candidate.candidateId)
        .sort(deterministicCompare)
      if (candidateIds.length > 0) return { companyId: company.companyId, name: company.name, candidateIds }
      const companyNames = [company.name, ...(company.aliases ?? [])].map(familyNameKey)
      const hasReceipt = companyNames.some((name) =>
        [...receipts].some((receipt) => name === receipt || (receipt.length >= 4 && name.includes(receipt))),
      )
      if (!hasReceipt) throw new Error(`DATASET_NO_HIT_RECEIPT: ${company.name}`)
      return { companyId: company.companyId, name: company.name, status: "no_attributable_public_dataset" }
    })
}

export function importDatasetEvidence(root = DEFAULT_ROOT) {
  const workersDir = join(root, ".omo/ulw-research/20260712-233722/workers")
  const reports = readdirSync(workersDir).filter((name) => name.endsWith(".md")).sort()
  const reportDocuments = reports.map((name) => ({ name, markdown: readFileSync(join(workersDir, name), "utf8") }))
  const raw = reportDocuments.flatMap(({ name, markdown }) => parseMarkdownCandidates({ markdown, sourceReport: `workers/${name}`, category: REPORT_CATEGORIES[name] }))
  REQUIRED_SEEDS.forEach(({ label, publisher, url, category, description }, index) => raw.push({ sourceReport: "SYNTHESIS.md", section: "Required seed surfaces", sourceLine: 19 + index, rowExcerpt: `${label}: ${url}`, publisher, label, familyLabel: label, url, category, context: description, description }))
  const companies = readCanonicalCompanies(root)
  const manifest = createDecisionManifest(attachCompanyIds(raw, companies), { verifiedAt: "2026-07-12", companyCoverage: [] })
  const noHitReceiptNames = new Set(reportDocuments.flatMap(({ markdown }) => [...extractNoHitReceiptNames(markdown)]))
  manifest.companyCoverage = createCompanyCoverage(companies, manifest.candidates, noHitReceiptNames)
  return manifest
}

export const serializeDatasetEvidence = (root = DEFAULT_ROOT) =>
  `${JSON.stringify(importDatasetEvidence(root), null, 2)}\n`

const parseArguments = (arguments_) => {
  const result = { check: false, outputPath: DEFAULT_OUTPUT, root: DEFAULT_ROOT }
  for (let index = 0; index < arguments_.length; index += 1) {
    const argument = arguments_[index]
    if (argument === "--check") result.check = true
    else if (argument === "--output") result.outputPath = resolve(arguments_[(index += 1)] ?? "")
    else throw new RangeError(`DATASET_IMPORT_ARGUMENT: ${argument}`)
  }
  return result
}

export function runDatasetEvidenceImport(options) {
  const rendered = serializeDatasetEvidence(options.root)
  if (options.check) {
    const existing = existsSync(options.outputPath) ? readFileSync(options.outputPath, "utf8") : ""
    if (existing !== rendered) {
      throw new Error(`DATASET_MANIFEST_STALE: ${options.outputPath}`)
    }
    return "DATASET_MANIFEST_OK"
  }
  writeFileSync(options.outputPath, rendered)
  return relative(options.root, options.outputPath)
}

function main() {
  try {
    process.stdout.write(`${runDatasetEvidenceImport(parseArguments(process.argv.slice(2)))}\n`)
  } catch (error) {
    if (error instanceof Error) {
      process.stderr.write(`${error.message}\n`)
      process.exitCode = 1
      return
    }
    throw error
  }
}

if (import.meta.url === pathToFileURL(process.argv[1] ?? "").href) main()
