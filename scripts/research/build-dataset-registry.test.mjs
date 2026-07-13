import assert from "node:assert/strict"
import { mkdtempSync, readFileSync, writeFileSync } from "node:fs"
import { tmpdir } from "node:os"
import { join, resolve } from "node:path"
import { spawnSync } from "node:child_process"
import test from "node:test"

import * as registry from "./build-dataset-registry.mjs"
import {
  checkDatasetAvailability,
  checkDatasetUrl,
  classifyDatasetAvailability,
  classifyDatasetRedirect,
  isStrictAvailabilityFailure,
} from "./check-dataset-links.mjs"
import * as importer from "./import-dataset-evidence.mjs"
import { requestPinnedHttps } from "./safe-http.mjs"

const CATEGORY = "general_agent_suites_trajectories"

const parse = (markdown) =>
  importer.parseMarkdownCandidates({ markdown, sourceReport: "workers/fixture.md", category: CATEGORY })
const manifestFor = (markdown) =>
  importer.createDecisionManifest(parse(markdown), { verifiedAt: "2026-07-12", companyCoverage: [] })
const decisionsFor = (markdown) =>
  parse(markdown).map((candidate) => importer.classifyCandidate(candidate).decision)
const runNode = (...arguments_) => spawnSync(process.execPath, arguments_)

test("parser handles linked first cells and raw URL table shapes", () => {
  // Given: two candidate-bearing table shapes from the worker reports.
  const markdown = `### Interactive environments
| Release | Artifact | Access | Evidence |
|---|---|---|---|
| [OSWorld](https://os-world.github.io/) | Tasks and environment | Open | Desktop benchmark |

### Office releases
| Dataset | Publisher | Canonical/data URL | Access | Description |
|---|---|---|---|---|
| GDPval | OpenAI | https://huggingface.co/datasets/openai/gdpval | Open | Professional tasks |

### Combined publisher cell
| Dataset / publisher | Canonical/data URL | Access |
|---|---|---|
| WebTailBench — Microsoft | https://huggingface.co/datasets/microsoft/WebTailBench | Open |
`

  // When: the Markdown evidence is parsed.
  const candidates = parse(markdown)

  // Then: both shapes preserve section, publisher, label, and URL evidence.
  assert.deepEqual(
    candidates.map(({ section, publisher, label, url }) => ({ section, publisher, label, url })),
    [
      {
        section: "Interactive environments",
        publisher: "OSWorld",
        label: "OSWorld",
        url: "https://os-world.github.io/",
      },
      {
        section: "Office releases",
        publisher: "OpenAI",
        label: "GDPval",
        url: "https://huggingface.co/datasets/openai/gdpval",
      },
      {
        section: "Combined publisher cell",
        publisher: "Microsoft",
        label: "WebTailBench",
        url: "https://huggingface.co/datasets/microsoft/WebTailBench",
      },
    ],
  )
})

test("parser expands company collection rows into distinct linked datasets", () => {
  // Given: one company row containing multiple dataset links.
  const markdown = `### Company collections
| Company | Dataset(s) and evidence | Access / description |
|---|---|---|
| Scale AI | [SWE-bench Pro](https://huggingface.co/datasets/ScaleAI/SWE-bench_Pro), [ASPI](https://huggingface.co/datasets/ScaleAI/aspi) | Public datasets |
`

  // When: the row is parsed.
  const candidates = parse(markdown)

  // Then: each link becomes its own candidate with company attribution.
  assert.deepEqual(
    candidates.map(({ publisher, label }) => ({ publisher, label })),
    [
      { publisher: "Scale AI", label: "SWE-bench Pro" },
      { publisher: "Scale AI", label: "ASPI" },
    ],
  )
  assert.equal(candidates[0]?.description, "Public datasets")
})

test("parser preserves descriptive prose without URLs or research shorthand", () => {
  const [candidate] = parse(`### Browser releases
| Dataset | Publisher | Canonical public surface | Artifact type | Access state | Scale / contents | Discovery path | Verification |
|---|---|---|---|---|---|---|---|
| WebTailBench | Microsoft | https://huggingface.co/datasets/microsoft/WebTailBench | Tasks + rubrics | Open viewer/download | 609 hand-verified live-web tasks across 11 categories. | HF/Exa | High-confidence accessible datasets |
`)

  assert.equal(candidate?.description, "609 hand-verified live-web tasks across 11 categories.")
  assert.doesNotMatch(candidate?.description ?? "", /https?:\/\/|HF\/Exa|High-confidence/iu)
})

test("selective company-row access applies to named links instead of every companion", () => {
  const candidates = parse(`### Company collections
| Company | Dataset(s) and evidence | Access / description |
|---|---|---|
| Mercor | [APEX-Agents](https://example.com/apex), [APEX-SWE](https://example.com/swe), [ACE](https://example.com/ace), [CL-bench](https://example.com/cl) | APEX-Agents and CL-bench are gated; others open. |
`)
  const access = importer.createDecisionManifest(candidates, { verifiedAt: "2026-07-12", companyCoverage: [] }).candidates.map((candidate) => candidate.surface?.access)
  assert.deepEqual(access, ["gated", "open", "open", "gated"])

  const datacurve = parse(`### Company collections
| Company | Dataset(s) and evidence | Access / description |
|---|---|---|
| Datacurve | [Deep-SWE](https://example.com/deep-swe), [leaderboard data](https://example.com/leaderboard) | Gated SWE trajectory/task corpus plus public leaderboard data. |
`)
  const datacurveAccess = importer.createDecisionManifest(datacurve, { verifiedAt: "2026-07-12", companyCoverage: [] }).candidates.map((candidate) => candidate.surface?.access)
  assert.deepEqual(datacurveAccess, ["gated", "open"])

  const namedExceptions = parse(`### Company collections
| Company | Dataset(s) and evidence | Access / description |
|---|---|---|
| Scale AI | [ASPI](https://example.com/aspi), [EnigmaEval](https://example.com/enigma), [TutorBench sample](https://example.com/sample), [full org](https://example.com/org) | Mostly open; EnigmaEval is gated. |
| IBM | [VAKRA](https://example.com/vakra), [Flow-Bench](https://example.com/flow) | Mostly open; Flow-Bench is gated. |
`)
  const namedManifest = importer.createDecisionManifest(namedExceptions, { verifiedAt: "2026-07-12", companyCoverage: [] })
  assert.deepEqual(
    namedManifest.candidates.map((candidate) => candidate.surface?.access),
    ["open", "gated", "open", "open", "open", "gated"],
  )
  assert.deepEqual(namedManifest.candidates[0].surface?.artifacts, ["tasks"])
})

test("surface kind and artifacts use link-local evidence instead of section-wide wording", () => {
  const manifest = manifestFor(`### Browser execution environments
| Dataset | Publisher | URL | Type | Access | Description |
|---|---|---|---|---|---|
| BrowseComp | OpenAI | https://openai.com/index/browsecomp/ | Hard web-search QA | Public | Questions that do not execute GUI actions or mutate website state. |
| BrowseComp data | OpenAI | https://example.com/browsecomp.csv | Reference answers | Public | Direct task file. |
`)

  assert.equal(manifest.candidates[0].surface?.kind, "benchmark_page")
  assert.deepEqual(manifest.candidates[0].surface?.artifacts, ["tasks"])
  assert.equal(manifest.candidates[1].surface?.kind, "download")
})

test("mixed companion rows keep access and artifacts local to each link", () => {
  const daCode = manifestFor(`### Released task corpora
| Dataset | Publisher | Public artifact | Size | Access | Description |
|---|---|---|---|---|---|
| DA-Code | DA-Code authors | [HF](https://huggingface.co/datasets/Luo2003/DA-Code), [repo](https://github.com/yiyihum/da-code) | 500 tasks; 100-source-task sample | Mixed | Executable Python/SQL tasks. HF full set is gated; repo exposes a 100-task source sample. |
`)
  const enterprise = manifestFor(`### Released task corpora
| Dataset | Publisher | Public artifact | Access | Description |
|---|---|---|---|---|
| EnterpriseBench | AST-FRI | [Project](https://github.com/ast-fri/EnterpriseBench), [HF data](https://huggingface.co/datasets/AST-FRI/EnterpriseBench) | gated | Realistic enterprise sandbox data and work tasks; terms acceptance required. The GitHub framework is public. |
`)
  const ale = manifestFor(`### Released task corpora
| Dataset | Publisher | Public artifact | Access | Description |
|---|---|---|---|---|
| Agents’ Last Exam | UC Berkeley RDI | [153-row metadata viewer](https://huggingface.co/datasets/agents-last-exam/agents-last-exam), [Open task inputs](https://huggingface.co/datasets/agents-last-exam/agents-last-exam-data), [Gated references](https://huggingface.co/datasets/agents-last-exam/agents-last-exam-reference), [Repo](https://github.com/rdi-berkeley/agents-last-exam) | Professional CUA tasks; mixed open/gated | Input files are open; ground-truth reference artifacts require manual approval. |
`)

  assert.deepEqual(
    daCode.candidates.map((candidate) => candidate.surface?.access),
    ["gated", "sample_demo"],
  )
  assert.deepEqual(daCode.candidates[0].surface?.artifacts, ["tasks"])
  assert.deepEqual(daCode.candidates[1].surface?.artifacts, ["viewer_sample", "tasks"])
  assert.deepEqual(
    enterprise.candidates.map((candidate) => candidate.surface?.access),
    ["open", "gated"],
  )
  assert.deepEqual(
    ale.candidates.map((candidate) => candidate.surface?.access),
    ["open", "open", "gated", "open"],
  )
  assert.deepEqual(ale.candidates[1].surface?.artifacts, ["inputs", "tasks"])
  assert.deepEqual(ale.candidates[2].surface?.artifacts, ["references", "tasks"])
  assert.equal(ale.candidates[1].surface?.artifacts.includes("references"), false)
  assert.equal(ale.candidates[2].surface?.artifacts.includes("inputs"), false)
})

test("public companion collections do not inherit a sibling sample access label", () => {
  const manifest = manifestFor(`### Company collections
| Company | Dataset(s) and evidence | Access / description |
|---|---|---|
| Good Start Labs | [GSLBenchmark](https://huggingface.co/datasets/GoodStartLabs/GSLBenchmark), [benchmark logs](https://huggingface.co/datasets/GoodStartLabs/gsl-benchmark-logs), [rollout samples](https://huggingface.co/datasets/GoodStartLabs/rollout-samples), [gin-rummy training](https://huggingface.co/datasets/GoodStartLabs/gin-rummy-training-data), [32K trajectories](https://huggingface.co/datasets/GoodStartLabs/gin-rummy-trajectories-32k) | Public game-environment tasks, rollouts, logs, trajectories, and training records. |
`)

  assert.deepEqual(
    manifest.candidates.map((candidate) => candidate.surface?.access),
    ["open", "open", "open", "open", "open"],
  )
  assert.deepEqual(manifest.candidates[1].surface?.artifacts, ["results", "tasks"])
  assert.deepEqual(manifest.candidates[2].surface?.artifacts, ["trajectories", "viewer_sample"])
  assert.deepEqual(manifest.candidates[4].surface?.artifacts, ["trajectories"])

  const mixed = manifestFor(`### Company collections
| Company | Dataset(s) and evidence | Access / description |
|---|---|---|
| Chakra Labs / Dojo | [Pango sample](https://huggingface.co/datasets/chakra-labs/pango-sample), [Pango office trajectories](https://huggingface.co/datasets/chakra-labs/pango-office-trajectories), [Dojo-Bench-Mini](https://huggingface.co/datasets/chakra-labs/dojo-bench-mini), [customer Colossus](https://huggingface.co/datasets/chakra-labs/dojo-bench-customer-colossus) | Pango sample and 219-task Dojo-Bench-Mini are open; larger office/customer data are gated. |
`)
  assert.deepEqual(
    mixed.candidates.map((candidate) => candidate.surface?.access),
    ["open", "gated", "open", "gated"],
  )
})

test("plural trajectory and log labels produce the corresponding artifacts", () => {
  const manifest = manifestFor(`### Released data
| Dataset / publisher | Canonical/data URL | Access | Description |
|---|---|---|---|
| ITBench Trajectories — IBM | https://huggingface.co/datasets/ibm-research/ITBench-Trajectories | Open download | 105 complete agent runs. |
| Pango office trajectories — Chakra Labs | https://huggingface.co/datasets/chakra-labs/pango-office-trajectories | Open download | Real productivity work. |
| Benchmark logs — Example | https://huggingface.co/datasets/example/benchmark-logs | Public | Execution records. |
`)

  assert.deepEqual(
    manifest.candidates.map((candidate) => candidate.surface?.artifacts),
    [["trajectories"], ["trajectories"], ["results", "tasks"]],
  )
})

test("explicit open access is not overridden by substrings or descriptive samples", () => {
  const manifest = manifestFor(`### Public releases
| Dataset | Publisher | URL | Access | Description |
|---|---|---|---|---|
| DELEGATE52 | Microsoft | https://huggingface.co/datasets/microsoft/delegate52 | Open viewer/download | Redistributable document-editing environments. |
| WebLINX BrowserGym | McGill NLP | https://huggingface.co/datasets/McGill-NLP/weblinx-browsergym | Open viewer/download | BrowserGym-ready demonstrations. |
| SpreadsheetBench | RUCKB Reasoning | https://github.com/RUCKBReasoning/SpreadsheetBench | Open download | Repository includes a 200-task sample archive and the complete benchmark. |
| LexRubric | LexRubric team | https://huggingface.co/datasets/chenyifan0929/LexRubric | Open, noncommercial license | Open-ended legal cases and rubrics. |
| LIBERO | Lifelong Robot Learning | https://libero-project.github.io/datasets | Open download | Demonstrations for the complete suites. Also mirrored as https://huggingface.co/datasets/nvidia/LIBERO_LeRobot_v3 |
`)

  assert.deepEqual(
    manifest.candidates.map((candidate) => candidate.surface?.access),
    ["open", "open", "open", "open", "open", "open"],
  )
})

test("single-link rows retain artifact evidence from adjacent table cells", () => {
  const manifest = manifestFor(`### Demonstration and trajectory corpora
| Dataset / publisher | Canonical/data URL | Artifact | Access | Description |
|---|---|---|---|---|
| AgentNet — xlang | https://huggingface.co/datasets/xlangai/AgentNet | Human desktop trajectories | Open download | Human-annotated tasks. |
| GUI-360 — GUI-360 | https://huggingface.co/datasets/vyokky/GUI-360 | Word/Excel/PowerPoint full-state trajectories | Open, MIT | Successful and failed paths. |
| AndroidControl — Google Research | https://github.com/google-research/google-research/tree/master/android_control | Human Android demonstrations | Open | High- and low-level instructions. |
`)

  assert.deepEqual(
    manifest.candidates.map((candidate) => candidate.surface?.artifacts),
    [["trajectories", "tasks"], ["trajectories"], ["trajectories"]],
  )
})

test("explicit access cells outrank access words in dataset names", () => {
  const manifest = manifestFor(`### Public releases
| Dataset / publisher | Canonical/data URL | Type | Access | Description |
|---|---|---|---|---|
| SWITCH Basic public subset — BAAI | https://huggingface.co/datasets/BAAI-Agents/SWITCH-Basic-v1-open | Interaction tasks | Open 30% public subset | Public annotations. |
| Waymo Open Dataset — Waymo | https://waymo.com/open/ | Driving data | Google login/terms | Official downloads. |
| Argoverse 2 — Argo AI/CMU | https://argoverse.org/ | Driving data | Account/terms | Motion-forecasting tasks. |
| HoloAssist — Microsoft | https://holoassist.github.io/ | Physical-assistance data | Terms/registration | Instructor-performer tasks. |

### Monitoring
| Dataset / publisher | Type and access | Description |
|---|---|---|
| [SHADE-Arena public split](https://github.com/kalescale/SHADE-Arena) | Tasks + transcripts, public partial | Five public task pairs out of 17. |
`)

  assert.deepEqual(
    manifest.candidates.map((candidate) => candidate.surface?.access),
    [
      "public_subset",
      "credential_dependent",
      "credential_dependent",
      "credential_dependent",
      "public_subset",
    ],
  )
  assert.equal(manifest.candidates[1].surface?.artifacts.includes("results"), false)
  assert.equal(manifest.candidates[2].surface?.artifacts.includes("commercial_catalog"), false)
})

test("explicit access and open-license evidence outrank descriptive availability words", () => {
  const manifest = manifestFor(`### Access precedence
| Dataset | Publisher | URL | Access | Description |
|---|---|---|---|---|
| Office Comprehension Benchmark | Microsoft | https://example.com/office | Open, mixed hosted/URL files | Public questions over mixed file hosts. |
| MemGUI-Bench tasks | MemGUI | https://example.com/memgui | Mobile GUI tasks; MIT | Full release plus a mini subset. |
| Engram v3 | Engram | https://example.com/engram | Runtime benchmark; MIT | Full release with a test subset. |
| AgentSocialBench | Authors | https://example.com/social | Social tasks; MIT | Full release with reference samples. |
| AgentWorldBench | Qwen | https://example.com/world | Trajectory samples; Apache-2.0 | Full 2,170-row release. |
| C2C negotiation games | Authors | https://example.com/c2c | Game logs; CC-BY-4.0 | Fully logged mixed-motive games. |
| BEHAVIOR 2026 demos | Stanford | https://example.com/behavior | HF-hosted; challenge terms | Full demonstration archive. |
| Terminal-Bench Pro | Alibaba | https://example.com/terminal-pro | Mixed | Public tasks plus private evaluation tasks. |
| AgentDS | Authors | https://example.com/agentds | Mixed | Train data are open; test labels are private. |
| FDABench-Full | FDABench | https://example.com/fda | Mixed | Public records with protected gold answers. |
| LAB-Bench | FutureHouse | https://example.com/lab | Mixed | Public rows with twenty percent held out. |
| BIRD-Interact | BIRD | https://example.com/bird | Mixed | Public questions; gold SQL requires request. |
| LiveSQLBench | BIRD | https://example.com/livesql | Mixed | Public questions and restricted evaluator artifacts. |
| LiveDRBench | Microsoft | https://example.com/livedr | Mixed | Public references; answers are encrypted. |
| DEEPSYNTH | Authors | https://example.com/deepsynth | Mixed | Public questions with private gold. |
| OpenManus-RL | Authors | https://example.com/openmanus | Open; mixed upstream terms | Complete traces. |
| ARC-AGI-3 traces | Authors | https://example.com/arc | Open; mixed upstream terms | Complete traces. |
| MiroVerse | MiroMind | https://example.com/miro | Gated; mixed licenses | Full trace data. |
`)

  assert.deepEqual(
    manifest.candidates.map((candidate) => candidate.surface?.access),
    [
      "open",
      "open",
      "open",
      "open",
      "open",
      "open",
      "gated",
      "public_subset",
      "public_subset",
      "public_subset",
      "public_subset",
      "public_subset",
      "public_subset",
      "public_subset",
      "public_subset",
      "open",
      "open",
      "gated",
    ],
  )
})

test("sample-only surfaces are not widened to unrestricted open", () => {
  const manifest = manifestFor(`### Sample access
| Dataset | Publisher | URL | Access | Description |
|---|---|---|---|---|
| Datoric traces sample | Datoric | https://huggingface.co/datasets/Datoric/computer-use-agent-traces-250k | Public schema/sample metadata only; production is commercial | Sample metadata. |

### Company collections
| Company | Dataset(s) and evidence | Access / description |
|---|---|---|
| Micro1 | [LongExtractBench-50](https://huggingface.co/datasets/micro1-inc/longextract-bench-50), [Prospera sample](https://huggingface.co/datasets/micro1-inc/Prospera_Benchmark) | Public samples; full Prospera is commercial. |
`)

  assert.deepEqual(
    manifest.candidates.map((candidate) => candidate.surface?.access),
    ["sample_demo", "open", "sample_demo"],
  )
})

test("mixed company collections scope commercial access to catalog links", () => {
  const manifest = manifestFor(`### Company collections
| Company | Dataset(s) and evidence | Access / description |
|---|---|---|
| Micro1 | [LongExtractBench-50](https://huggingface.co/datasets/micro1-inc/longextract-bench-50), [Prospera sample](https://huggingface.co/datasets/micro1-inc/Prospera_Benchmark) | Public samples; full Prospera is commercial. |
| Turing | [Turing Open Reasoning](https://huggingface.co/datasets/TuringEnterprises/Turing-Open-Reasoning), [Open-RL](https://huggingface.co/datasets/TuringEnterprises/Open-RL) | Public. Verifiable reasoning task data. Some cards advertise larger commercial packs. |
| Toloka | [commercial dataset catalog](https://toloka.ai/datasets/), [14 public HF datasets](https://huggingface.co/toloka/datasets), [Beemo](https://huggingface.co/datasets/toloka/beemo) | Catalog data are commercial; research benchmarks are open. |
`)

  assert.deepEqual(
    manifest.candidates.map((candidate) => candidate.surface?.access),
    ["open", "sample_demo", "open", "open", "commercial", "open", "open"],
  )
})

test("artifact, kind, and provenance inference respects negation and sibling wording", () => {
  const negated = manifestFor(`### Semantic evidence
| Dataset | Publisher | URL | Access | Description |
|---|---|---|---|---|
| WebGym | Authors | https://example.com/webgym | Open | Training tasks and evaluator metadata but no rollouts. |
| Arc CRM | Authors | https://example.com/arc-crm | Open | Task references are downloadable; viewer unavailable. |
| MemoryBench Results | Authors | https://example.com/memory-results | Open | Per-sample evaluations; not a task dataset. |
| DeceptionBench | Authors | https://example.com/deception | Open | Safety benchmark, not a tool environment. |
`)
  assert.deepEqual(
    negated.candidates.map((candidate) => candidate.surface?.artifacts),
    [
      ["training", "tasks"],
      ["references", "tasks"],
      ["results"],
      ["tasks"],
    ],
  )
  assert.equal(negated.candidates[3].surface?.kind, "benchmark_page")

  const scoped = manifestFor(`### Link-local semantics
| Dataset | Publisher | Public artifact | Access | Description |
|---|---|---|---|---|
| ClawBench | NAIL Group | [Task corpus](https://huggingface.co/datasets/NAIL-Group/ClawBench) | Open | Public tasks. Companion trace datasets contain rollouts. |
| WebHarbor | Aiming Lab | [Project](https://aiming-lab.github.io/webharbor.github.io/) | Open | Docker mirrors of live websites. |
| SkillsBench | BenchFlow | [Canonical repo](https://github.com/benchflow-ai/skillsbench) | Open | HF is a useful mirror but GitHub is primary. |
| SWE-rebench | Nebius | [Project article](https://nebius.com/blog/posts/swe-rebench-dataset), [HF data](https://huggingface.co/datasets/nebius/SWE-rebench) | Open | Environment-validated issue and PR tasks. |
`)
  const [clawBench, webHarbor, skillsBench, article, data] = scoped.candidates
  assert.deepEqual(clawBench.surface?.artifacts, ["tasks"])
  assert.equal(clawBench.surface?.provenance, "first_party")
  assert.equal(webHarbor.surface?.provenance, "first_party")
  assert.equal(skillsBench.surface?.provenance, "first_party")
  assert.equal(article.surface?.kind, "benchmark_page")
  assert.equal(article.surface?.artifacts.includes("environment"), false)
  assert.equal(data.surface?.kind, "dataset")
})

test("artifact inference handles qualified negation in reviewed production phrasing", () => {
  const manifest = manifestFor(`### Reviewed semantic evidence
| Dataset | Publisher | URL | Access | Description |
|---|---|---|---|---|
| BrowserGym | ServiceNow | https://github.com/ServiceNow/BrowserGym | Open | Unified browser environment framework; not itself a task dataset. |
| HumanoidBench | Authors | https://github.com/carlosferrazza/humanoid-bench | Open | Humanoid control task environment; no canonical demonstration corpus verified. |
| SpreadsheetBench 2 | KAKA22 | https://huggingface.co/datasets/KAKA22/SpreadsheetBench-v2 | Open files; no row viewer | End-to-end business spreadsheet workflows. |
| xLAM function calling | Salesforce | https://huggingface.co/datasets/Salesforce/xlam-function-calling-60k | Open | Training corpus, not a benchmark. |
| tau USI | CMU LTI | https://huggingface.co/datasets/cmu-lti/tau-usi | Open | Human interaction traces for research/evaluation only; no LLM training; includes tasks and reward labels. |
| DECKBench artifacts | Authors | https://huggingface.co/datasets/mheisler/DeckBench | Open | Starting HTML decks, slide images, and source papers. No ground-truth edit logs are released. |
| C2C game logs | Authors | https://huggingface.co/datasets/negotiation-games/c2c-ai-vs-ai | Open; no viewer | Game logs. |
| Do-Not-Answer scenarios | Giskard | https://huggingface.co/datasets/giskardai/do-not-answer-scenarios | Open | Serialized refusal scenarios. |
| CooperBench original trajectories | CooperBench | https://huggingface.co/datasets/CooperBench/trajectories | Open; viewer broken | Trajectory archive. The viewer reports a schema mismatch, so link to the files page rather than promising browser preview. |
`)

  assert.deepEqual(
    manifest.candidates.map((candidate) => candidate.surface?.artifacts),
    [
      ["environment"],
      ["environment", "tasks"],
      ["tasks"],
      ["training"],
      ["trajectories", "tasks"],
      ["inputs"],
      ["results"],
      ["tasks"],
      ["trajectories"],
    ],
  )
})

test("a sole released surface inherits artifact evidence shared with a paper link", () => {
  const manifest = manifestFor(`### Companion trajectory and training corpora
| Dataset | Publisher and links | Evidence / access |
|---|---|---|
| xLAM function-calling 60K | Salesforce — [HF](https://huggingface.co/datasets/Salesforce/xlam-function-calling-60k), [paper](https://arxiv.org/abs/2406.18518) | Click-through gated; training corpus, not benchmark. |
`)

  assert.deepEqual(manifest.candidates[0].surface?.artifacts, ["training"])
  assert.equal(manifest.candidates[1].decision, "paper_only")
})

test("login wording does not create a results artifact", () => {
  const manifest = manifestFor(`### Browser releases
| Dataset | Publisher | URL | Access | Description |
|---|---|---|---|---|
| LexBench-Browser | Lexmount | https://huggingface.co/datasets/Lexmount/LexBench-Browser | Open download | No-login browser tasks. |
| WebVoyager | Example | https://example.com/webvoyager | Open | Login-capable browser tasks. |
`)

  assert.deepEqual(
    manifest.candidates.map((candidate) => candidate.surface?.artifacts),
    [["tasks"], ["tasks"]],
  )
})

test("org top-level domains do not create commercial catalog artifacts", () => {
  const manifest = manifestFor(`### Public releases
| Dataset | Publisher | URL | Access | Description |
|---|---|---|---|---|
| Zenodo deposit | Authors | https://doi.org/10.5281/zenodo.17696742 | Open | Complete trajectories. |
| MiniWoB++ | Farama | https://miniwob.farama.org/index.html | Open | Browser environment. |
`)

  assert.equal(
    manifest.candidates.every(
      (candidate) => candidate.surface?.artifacts.includes("commercial_catalog") === false,
    ),
    true,
  )
})

test("collection prose does not create commercial catalog artifacts without explicit catalog evidence", () => {
  const manifest = manifestFor(`### Public releases
| Dataset | Publisher | URL | Access | Description |
|---|---|---|---|---|
| ScaleCUA-Data | OpenGVLab | https://example.com/scalecua | Open | Automated collection plus human correction. |
| CLERC | Johns Hopkins | https://example.com/clerc | Open | Includes collection and generation splits from the organization. |
| Business Utility Evaluation | deepsense.ai | https://example.com/business-utility | Open | Synthetic marketplace activity tasks. |
| Insurance Underwriting | Snorkel AI | https://example.com/underwriting | Open | Commercial-underwriting task types. |
| Enterprise task corpus | Eigen AI | https://example.com/enterprise | Commercial | Full corpus commercial; samples are free. |
| WebChain | WebAgentLab | https://example.com/webchain | Gated | Separate commercial permission. |
| Toloka catalog | Toloka | https://example.com/toloka | Commercial | Commercial dataset catalog. |
| David datasets | David AI | https://example.com/david | Account required | Data marketplace for speech datasets. |
| Kled dataset catalog | Kled AI | https://example.com/kled | Samples | Dataset catalog previews with commercial licensing. |
| Appen datasets | Appen | https://example.com/appen | Commercial | Off-the-shelf datasets. |
| Protege healthcare datasets | Protege | https://example.com/protege | Commercial | Commercial benchmark-specific datasets for five healthcare specialties. |
`)

  assert.deepEqual(
    manifest.candidates.map((candidate) =>
      candidate.surface?.artifacts.includes("commercial_catalog"),
    ),
    [false, false, false, false, false, false, true, true, true, true, true],
  )
})

test("artifact lexemes require token boundaries while exact supported forms remain classified", () => {
  const negatives = manifestFor(`### Public releases
| Dataset | Publisher | URL | Access | Description |
|---|---|---|---|---|
| Preference model | Example | https://example.com/preference | Open | Pairwise preference data. |
| Documented release | Example | https://example.com/documented | Open | Minimally documented policies. |
| Tracer release | Example | https://example.com/tracer | Open | Tracer durability measurements. |
| Sampled release | Example | https://example.com/sampled | Open | Sampled executions. |
| Scored release | Example | https://example.com/scored | Open | Scored executions. |
| Rewarding release | Example | https://example.com/rewarding | Open | Rewarding behavior. |
| Previewed release | Example | https://example.com/previewed | Open | Previewed outputs. |
| Environmental release | Example | https://example.com/environmental | Open | Environmental sandboxing worldwide. |
| Benchmarking trajectory | Example | https://example.com/benchmarking | Open | One trajectory. |
| Questionnaire trajectory | Example | https://example.com/questionnaire | Open | One trajectory. |
| Golden trajectory | Example | https://example.com/golden | Open | One golden trajectory. |
| Answering trajectory | Example | https://example.com/answering | Open | Question-answering trajectory. |
| Referenced trajectory | Example | https://example.com/referenced | Open | Referenced trajectory. |
`)

  assert.deepEqual(
    negatives.candidates.map((candidate) => candidate.surface?.artifacts),
    [
      ["training"],
      ["tasks"],
      ["tasks"],
      ["tasks"],
      ["tasks"],
      ["tasks"],
      ["tasks"],
      ["tasks"],
      ["trajectories"],
      ["trajectories"],
      ["trajectories"],
      ["trajectories", "tasks"],
      ["trajectories"],
    ],
  )

  const positives = manifestFor(`### Public releases
| Dataset | Publisher | URL | Access | Description |
|---|---|---|---|---|
| Exact artifact vocabulary | Example | https://example.com/exact-artifacts | Open | Trajectories, traces, rollouts, demonstrations, interactions, videos; results, scores, leaderboards, evaluation logs; inputs, fixtures, assets, file corpus, documents; references, gold, answers, rubrics; training, SFT, RLHF, preferences, rewards; viewers, samples, galleries, previews; environments, gyms, sandboxes, worlds, runtimes, Docker VMs; tasks, benchmarks, prompts, questions, scenarios, problems. |
`)

  assert.deepEqual(positives.candidates[0].surface?.artifacts, [
    "trajectories",
    "results",
    "inputs",
    "references",
    "training",
    "viewer_sample",
    "environment",
    "tasks",
  ])
})

test("parser preserves multiple companion links in ordinary dataset rows", () => {
  // Given: a benchmark row with repository and dataset companions.
  const markdown = `### Released task corpora
| Dataset | Publisher | Public artifact | Access |
|---|---|---|---|
| ToolBench | THUDM | [repo](https://github.com/OpenBMB/ToolBench), [data](https://huggingface.co/datasets/ToolBench/ToolBench) | Open |
`

  // When: the row is parsed.
  const candidates = parse(markdown)

  // Then: both URLs remain in one explicit family before registry generation.
  assert.equal(candidates.length, 2)
  assert.equal(candidates[0]?.familyLabel, "ToolBench")
  assert.equal(candidates[1]?.familyLabel, "ToolBench")
})

test("standard open licenses do not become commercial access", () => {
  // Given: public releases with ordinary software and data licenses.
  const manifest = manifestFor(`### Released datasets
| Dataset | Publisher | URL | Access |
|---|---|---|---|
| MIT release | Example | https://example.com/mit | Open, MIT licensed |
| CC release | Example | https://example.com/cc | Open, CC-BY-4.0 license |
`)

  // When: retained surface access is inferred.
  const access = manifest.candidates.map((candidate) => candidate.surface?.access)

  // Then: standard open licenses remain open rather than commercial.
  assert.deepEqual(access, ["open", "open"])
})

test("manifest aliases duplicate URLs instead of emitting duplicate surfaces", () => {
  // Given: two reports pointing at the same canonical dataset URL.
  const manifest = manifestFor(`### Released datasets
| Dataset | Publisher | URL | Access |
|---|---|---|---|
| One | Publisher | https://huggingface.co/datasets/example/shared | Open |
| One duplicate | Publisher | https://huggingface.co/datasets/example/shared | Open |
`)

  // When: explicit decisions are assigned.
  // Then: one candidate is retained and the duplicate resolves as an alias.
  assert.deepEqual(
    manifest.candidates.map(({ decision }) => decision),
    ["retained", "alias"],
  )
  assert.equal(manifest.candidates[1]?.aliasOf, manifest.candidates[0]?.candidateId)
})

test("explicit companion rules group cross-URL releases into one family", () => {
  // Given: processed, raw, and BrowserGym WebLINX releases on distinct URLs.
  const manifest = manifestFor(`### Released datasets
| Dataset | Publisher | URL | Access |
|---|---|---|---|
| WebLINX | McGill NLP | https://huggingface.co/datasets/McGill-NLP/WebLINX | Open |
| WebLINX raw | McGill NLP | https://huggingface.co/datasets/McGill-NLP/WebLINX-full | Open |
| WebLINX BrowserGym | McGill NLP | https://huggingface.co/datasets/McGill-NLP/weblinx-browsergym | Open |
`)

  // When: the decision manifest is created.
  // Then: grouping is explicit despite URL differences.
  assert.equal(new Set(manifest.candidates.map(({ familyId }) => familyId)).size, 1)

  const sameNameCandidates = parse(`### Cross-report identity
| Dataset | Publisher | URL | Access |
|---|---|---|---|
| AssistantBench | Hebrew University | https://example.com/assistant-repo | Open |
| AssistantBench | AssistantBench | https://example.com/assistant-data | Open |
`)
  sameNameCandidates[1].sourceReport = "workers/other-report.md"
  const sameName = importer.createDecisionManifest(sameNameCandidates, { verifiedAt: "2026-07-12", companyCoverage: [] })
  assert.equal(new Set(sameName.candidates.map(({ familyId }) => familyId)).size, 1)

  const versions = manifestFor(`### Versioned releases
| Dataset | Publisher | URL | Access |
|---|---|---|---|
| Terminal-Bench 2.0 | Harbor | https://github.com/harbor-framework/terminal-bench-2 | Open |
| Terminal-Bench 2.1 | Harbor | https://github.com/harbor-framework/terminal-bench-2-1 | Open |
`)
  assert.equal(new Set(versions.candidates.map(({ familyId }) => familyId)).size, 2)

  const homonyms = parse(`### Same name, unrelated publishers
| Dataset | Publisher | URL | Access |
|---|---|---|---|
| MCP-Universe | AfterQuery | https://huggingface.co/datasets/AfterQuery/MCP-Universe | Open |
| MCP-Universe | Salesforce | https://github.com/SalesforceAIResearch/MCP-Universe | Open |
`)
  homonyms[1].sourceReport = "workers/other-report.md"
  const homonymManifest = importer.createDecisionManifest(homonyms, { verifiedAt: "2026-07-12", companyCoverage: [] })
  assert.equal(new Set(homonymManifest.candidates.map(({ familyId }) => familyId)).size, 2)
  assert.equal(new Set(homonymManifest.candidates.map((candidate) => candidate.family?.name)).size, 2)
})

test("classification excludes result-only, rejection, broken, paper, and unreleased rows", () => {
  // Given: worker sections that explicitly qualify non-default candidates.
  const decisions = decisionsFor(`### Results-only datasets
| Dataset | URL | Access |
|---|---|---|
| Scores | https://example.com/results | Results only |

### Rejection and qualification ledger
| Candidate | URL | Decision |
|---|---|---|
| Mirror | https://huggingface.co/datasets/community/mirror | Exclude mirror |
| Broken | https://example.com/broken | Broken/unverifiable |
| Preview | https://example.com/preview | Unreleased |
| Paper | https://arxiv.org/abs/2601.00001 | Paper-only |

### Known unavailable dataset surfaces
| Dataset | URL | Access |
|---|---|---|
| Cua registry | https://cua.ai/docs/cuabench/guide/fundamentals/registry | Open |
| Agentick v1 tag | https://github.com/roger-creus/agentick/tree/v1.0 | Open |
| EnterpriseOps size API | https://datasets-server.huggingface.co/size?dataset=ServiceNow-AI/EnterpriseOps-Gym | Open |
| ARMBench | https://www.armbench.com/ | Gated |
| OSWorld legacy site | https://os-world.github.io/ | Open |

### Explicitly excluded evidence
| Dataset | URL | Decision |
|---|---|---|
| MCP-AgentBench | https://ojs.aaai.org/index.php/AAAI/article/view/40347 | Paper-only; no public code/data URL found |
| Workflow-GYM | https://workflow-gym.github.io/ | Excluded from usable inventory; Coming Soon |
| Excel Modeling Benchmark | https://www.vals.ai/benchmarks/emb | Excluded; no public task subset |
| MCPMark | [Verification PR](https://github.com/eval-sys/mcpmark/pull/264) | Supporting evidence only |

### Released DOI dataset deposits
| Dataset | URL | Access |
|---|---|---|
| Cloud-OpsBench Artifact | https://doi.org/10.5281/zenodo.19348888 | Public data |
| Are We Done Yet? | https://doi.org/10.5281/zenodo.17696742 | Open full trajectories |
`)

  // When: every URL receives one explicit decision.
  // Then: none of these qualified rows silently enters the default corpus.
  assert.deepEqual(decisions, ["result_only", "mirror", "broken_unverifiable", "unreleased", "paper_only", "broken_unverifiable", "broken_unverifiable", "result_only", "broken_unverifiable", "broken_unverifiable", "paper_only", "unreleased", "result_only", "result_only", "retained", "retained"])
})

test("negative prose excludes generic viewers that the research did not count as datasets", () => {
  const decisions = decisionsFor(`### Deduplication and dead ends
- Generic viewers—including [CUA Trace Viewer](https://github.com/Computer-use-agents/CUA-Trace-Viewer)—were not counted as datasets.
`)

  assert.deepEqual(decisions, ["result_only"])
})

test("no-hit company coverage requires an exact-name search receipt", () => {
  const companies = [
    { companyId: "adj_no_hit", name: "No Hit Labs" },
    { companyId: "adj_with_data", name: "With Data" },
  ]
  const manifest = manifestFor(`### Released datasets
| Dataset | Publisher | URL | Access | Description |
|---|---|---|---|---|
| Public tasks | With Data | https://example.com/public-tasks | Open | Ten executable tasks. |
`)
  manifest.candidates[0].companyIds = ["adj_with_data"]

  assert.throws(
    () => importer.createCompanyCoverage(companies, manifest.candidates, new Set()),
    /DATASET_NO_HIT_RECEIPT.*No Hit Labs/u,
  )
  assert.deepEqual(
    importer.createCompanyCoverage(companies, manifest.candidates, new Set(["no hit labs"])),
    [
      {
        companyId: "adj_no_hit",
        name: "No Hit Labs",
        status: "no_attributable_public_dataset",
      },
      {
        candidateIds: [manifest.candidates[0].candidateId],
        companyId: "adj_with_data",
        name: "With Data",
      },
    ],
  )
})

test("candidate decisions distinguish unavailable surfaces from descriptive broken wording", () => {
  const decisions = decisionsFor(`### Candidate policy
| Dataset | Publisher | URL | Access | Description |
|---|---|---|---|---|
| AppWorld-UL | Authors | https://icml.cc/virtual/2026/poster/62856 | Paper/poster-only in counter-search | No standalone data release. |
| CUActSpot | Microsoft | https://github.com/microsoft/Phi-Ground/tree/main/benchmark/CUActSpot | Code-only | Benchmark data is not included. |
| Find the Needle | OS-Tack | https://github.com/os-tack/find-the-needle | repo | 23 broken-Dockerfile repair benchmarks. |
| Cooper trajectories | CooperBench | https://huggingface.co/datasets/CooperBench/trajectories | Trajectories; public MIT; viewer broken | Files are downloadable. |
| SafePro | UCSC / UCSB / Cisco | https://huggingface.co/datasets/kzhou35/SafePro | Open files; viewer currently broken | 275 tasks. |
`)

  assert.deepEqual(decisions, [
    "paper_only",
    "result_only",
    "retained",
    "retained",
    "retained",
  ])
})

test("code, config, or aggregate-results-only sections are result-only", () => {
  // Given: a table explicitly scoped away from dataset artifacts.
  const decisions = decisionsFor(`### Code, config, or aggregate-results only
| Environment | Canonical URL | Release status |
|---|---|---|
| Config repository | https://github.com/example/config-only | Code only |
`)

  // When: the section policy is classified.
  // Then: code-only surfaces do not enter the default dataset corpus.
  assert.deepEqual(decisions, ["result_only"])
})

test("qualified candidate-bearing bullet sections are imported without claim citations", () => {
  // Given: a result-only bullet and an unrelated CLAIMS citation bullet.
  const candidates = parse(`### Results-only datasets to keep separate
- [Open Agent Leaderboard Results](https://huggingface.co/datasets/open-agent-leaderboard/results) contains scores only.

## CLAIMS
- Source citation: [paper](https://example.com/research-paper)
`)

  // When: non-table candidate evidence is parsed.
  const decisions = candidates.map((candidate) => importer.classifyCandidate(candidate).decision)

  // Then: only the qualified result candidate is recorded and classified.
  assert.equal(candidates.length, 1)
  assert.equal(candidates[0]?.label, "Open Agent Leaderboard Results")
  assert.deepEqual(decisions, ["result_only"])
})

test("monitoring topics and accepted datasets are not mistaken for monitoring decisions", () => {
  // Given: a safety-monitoring dataset and accepted data whose companion code is unavailable.
  const decisions = decisionsFor(`### Monitoring, sabotage, deception, and control
| Dataset | URL | Access |
|---|---|---|
| Monitor data | https://example.com/monitor-data | Open trajectories |

### High-confidence accepted dataset surfaces
| Dataset | URL | Access | Notes |
|---|---|---|---|
| Linux trajectories | https://example.com/linux-data | Open | Benchmark code is not yet public |
`)

  // When: explicit decisions are assigned.
  // Then: both available data surfaces remain retained.
  assert.deepEqual(decisions, ["retained", "retained"])
})

test("known read-only mirrors are excluded even when another report omits the caveat", () => {
  // Given: a mirror URL presented as ordinary public data in a separate report.
  const [candidate] = parse(`### Released datasets
| Dataset | Publisher | URL | Access |
|---|---|---|---|
| SkillsBench | BenchFlow | https://huggingface.co/datasets/benchflow/skillsbench | Public |
`)

  // When: the canonical mirror policy is applied.
  const decision = candidate === undefined ? undefined : importer.classifyCandidate(candidate)

  // Then: the known mirror cannot enter the retained registry.
  assert.equal(decision?.decision, "mirror")
})

test("importer --check detects stale bytes without rewriting the manifest", () => {
  const directory = mkdtempSync(join(tmpdir(), "dataset-import-"))
  const outputPath = join(directory, "decision-manifest.json")
  const importerPath = resolve("scripts/research/import-dataset-evidence.mjs")
  writeFileSync(outputPath, "{}\n")

  const stale = runNode(importerPath, "--check", "--output", outputPath)
  const staleBytes = readFileSync(outputPath, "utf8")
  const built = runNode(importerPath, "--output", outputPath)
  const current = runNode(importerPath, "--check", "--output", outputPath)

  assert.equal(stale.status, 1)
  assert.match(stale.stderr.toString(), /DATASET_MANIFEST_STALE/u)
  assert.equal(staleBytes, "{}\n")
  assert.equal(built.status, 0, built.stderr.toString())
  assert.equal(current.status, 0, current.stderr.toString())
  assert.match(current.stdout.toString(), /DATASET_MANIFEST_OK/u)
})

test("--check rejects stale bytes and passes after deterministic regeneration", () => {
  // Given: a small valid manifest and a stale output file.
  const directory = mkdtempSync(join(tmpdir(), "dataset-registry-"))
  const manifestPath = join(directory, "manifest.json")
  const outputPath = join(directory, "datasets.json")
  const builderPath = resolve("scripts/research/build-dataset-registry.mjs")
  const manifest = manifestFor(`### Released datasets
| Dataset | Publisher | URL | Access |
|---|---|---|---|
| Fixture | Example | https://example.com/dataset | Open |
`)
  const canonicalCoverage = JSON.parse(
    readFileSync(resolve("research/seeds/datasets/decision-manifest.json"), "utf8"),
  ).companyCoverage
  manifest.companyCoverage = canonicalCoverage.map(({ companyId, name }) => ({
    companyId,
    name,
    status: "no_attributable_public_dataset",
  }))
  const attributedCompany = manifest.companyCoverage[0]
  manifest.candidates[0].companyIds = [attributedCompany.companyId]
  manifest.companyCoverage[0] = {
    companyId: attributedCompany.companyId,
    name: attributedCompany.name,
    candidateIds: [manifest.candidates[0].candidateId],
  }
  writeFileSync(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`)
  const invalidFixtures = [
    ["access", (value) => { value.candidates[0].surface.access = "definitely_invalid" }, /surface\.access/u],
    ["coverage", (value) => { value.companyCoverage = [] }, /companyCoverage/u],
    ["coverage-count", (value) => { value.companyCoverage.pop() }, /companyCoverage/u],
    ["coverage-identity", (value) => { value.companyCoverage[0].name = "Wrong company" }, /companyCoverage/u],
    ["coverage-status", (value) => { value.companyCoverage[0] = { companyId: value.companyCoverage[0].companyId, name: value.companyCoverage[0].name, status: "no_attributable_public_dataset" } }, /companyCoverage/u],
    ["coverage-attribution", (value) => { value.companyCoverage[1] = { companyId: value.companyCoverage[1].companyId, name: value.companyCoverage[1].name, candidateIds: [value.candidates[0].candidateId] } }, /companyCoverage/u],
    ["description", (value) => { value.candidates[0].family.description = " " }, /family\.description/u],
    ["date", (value) => { value.verifiedAt = "2026-99-99" }, /verifiedAt/u],
    ["tags", (value) => { value.candidates[0].family.tags = [] }, /family\.tags/u],
  ]
  const invalidResults = invalidFixtures.map(([name, mutate]) => {
    const value = structuredClone(manifest)
    mutate(value)
    const path = join(directory, `invalid-${name}.json`)
    writeFileSync(path, `${JSON.stringify(value, null, 2)}\n`)
    return [name, runNode(builderPath, "--manifest", path, "--output", outputPath, "--check")]
  })
  writeFileSync(outputPath, "{}\n")

  // When: check mode runs before and after the normal build.
  const builderArguments = [builderPath, "--manifest", manifestPath, "--output", outputPath]
  const stale = runNode(...builderArguments, "--check")
  const built = runNode(...builderArguments)
  const current = runNode(...builderArguments, "--check")

  // Then: stale bytes fail, generated bytes are stable, and output is nonempty.
  for (const [index, [name, result]] of invalidResults.entries()) {
    assert.equal(result.status, 1, `${name} should fail schema validation`)
    assert.match(result.stderr.toString(), /DATASET_MANIFEST_SCHEMA/u)
    assert.match(result.stderr.toString(), invalidFixtures[index][2])
  }
  assert.equal(stale.status, 1)
  assert.match(stale.stderr.toString(), /DATASET_REGISTRY_STALE/u)
  assert.equal(built.status, 0)
  assert.equal(current.status, 0)
  assert.ok(readFileSync(outputPath, "utf8").includes('"families"'))
  assert.equal(typeof registry.buildDatasetRegistry, "function")
})

test("registry bytes remain stable under a non-English process locale", () => {
  const builderPath = resolve("scripts/research/build-dataset-registry.mjs")
  const result = spawnSync(process.execPath, [builderPath, "--check"], {
    env: { ...process.env, LANG: "tr_TR.UTF-8", LC_ALL: "tr_TR.UTF-8" },
  })

  assert.equal(result.status, 0, result.stderr.toString())
  assert.match(result.stdout.toString(), /DATASET_REGISTRY_OK/u)
})

test("offline link audit enforces URL, seed, mirror, and normalized duplicate policies", () => {
  // Given: the checked-in corpus and a deliberately invalid fixture corpus.
  const directory = mkdtempSync(join(tmpdir(), "dataset-links-"))
  const fixturePath = join(directory, "invalid.json")
  const checkerPath = resolve("scripts/research/check-dataset-links.mjs")
  writeFileSync(
    fixturePath,
    `${JSON.stringify({
      families: [
        {
          surfaces: [
            { url: "http://example.com/insecure" },
            { url: "https://EXAMPLE.com/path" },
            { url: "https://example.com/path/" },
            { url: "https://huggingface.co/datasets/benchflow/skillsbench" },
          ],
        },
      ],
    })}\n`,
  )

  // When: deterministic audit mode checks the canonical and invalid corpora.
  const canonical = spawnSync(process.execPath, [checkerPath, "--offline"])
  const invalid = spawnSync(process.execPath, [
    checkerPath,
    "--offline",
    "--corpus",
    fixturePath,
  ])
  const diagnostics = invalid.stderr.toString()

  // Then: canonical data passes and every deterministic policy violation is named.
  assert.equal(canonical.status, 0, canonical.stderr.toString())
  assert.equal(invalid.status, 1)
  assert.match(diagnostics, /DATASET_LINK_HTTPS/u)
  assert.match(diagnostics, /DATASET_LINK_DUPLICATE/u)
  assert.match(diagnostics, /DATASET_LINK_REQUIRED_SEED/u)
  assert.match(diagnostics, /DATASET_LINK_DISALLOWED_MIRROR/u)
})

test("strict live link policy fails outages but accepts classified redirects and documented gates", () => {
  // Given: representative live responses without making the test depend on the network.
  const fixtures = [
    { response: { status: 200, error: null }, kind: "reachable", strictFailure: false },
    { response: { status: 302, error: null }, kind: "redirect", strictFailure: false },
    { response: { status: 401, error: null }, kind: "login_gate", strictFailure: false },
    { response: { status: 402, error: null }, kind: "commercial_gate", strictFailure: false },
    { response: { status: 403, error: null }, kind: "waf_or_rate_limit", strictFailure: false },
    { response: { status: 429, error: null }, kind: "waf_or_rate_limit", strictFailure: false },
    { response: { status: 400, error: null }, kind: "client_error", strictFailure: true },
    { response: { status: 404, error: null }, kind: "not_found", strictFailure: true },
    { response: { status: 500, error: null }, kind: "server_error", strictFailure: true },
    {
      response: { status: null, error: "TimeoutError" },
      kind: "network_error",
      strictFailure: true,
    },
  ]

  // When: each response is classified and evaluated by strict mode.
  const actual = fixtures.map(({ response }) => {
    const kind = classifyDatasetAvailability(response)
    return { kind, strictFailure: isStrictAvailabilityFailure(kind) }
  })

  // Then: only genuine availability failures trip the gate.
  assert.deepEqual(
    actual,
    fixtures.map(({ kind, strictFailure }) => ({ kind, strictFailure })),
  )
})

test("HEAD 405 falls back to a bounded GET", async () => {
  const calls = []
  const requester = async (url, options) => {
    calls.push({ url, ...options })
    return {
      status: options.method === "HEAD" ? 405 : 200,
      headers: {},
      body: Buffer.alloc(0),
      truncated: false,
      error: null,
    }
  }

  const result = await checkDatasetUrl("https://example.com/dataset", 100, requester)

  assert.deepEqual(
    calls.map(({ url, method, maxBytes, headers }) => ({
      url,
      method,
      maxBytes,
      range: headers.range ?? null,
    })),
    [
      { url: "https://example.com/dataset", method: "HEAD", maxBytes: 0, range: null },
      {
        url: "https://example.com/dataset",
        method: "GET",
        maxBytes: 1,
        range: "bytes=0-0",
      },
    ],
  )
  assert.equal(calls[0].signal, calls[1].signal)
  assert.equal(result.status, 200)
  assert.equal(result.availability, "reachable")
  assert.equal(isStrictAvailabilityFailure(result.availability), false)
})

test("strict redirects reject missing, insecure, private, and unapproved cross-origin locations", () => {
  const initial = "https://example.com/dataset"
  const fixtures = [
    { location: "/moved", availability: "redirect" },
    { location: "https://www.example.com/moved", availability: "redirect" },
    { location: undefined, availability: "unsafe_redirect" },
    { location: "http://example.com/moved", availability: "unsafe_redirect" },
    { location: "https://127.0.0.1/private", availability: "unsafe_redirect" },
    { location: "https://unapproved.example.org/moved", availability: "unsafe_redirect" },
  ]

  const actual = fixtures.map(({ location }) =>
    classifyDatasetRedirect(initial, {
      status: 302,
      error: null,
      headers: location === undefined ? {} : { location },
    }).availability,
  )

  assert.deepEqual(
    actual,
    fixtures.map(({ availability }) => availability),
  )
  assert.equal(isStrictAvailabilityFailure("unsafe_redirect"), true)
})

test("strict redirect validation follows a bounded chain before accepting it", async () => {
  const calls = []
  const requester = async (url) => {
    calls.push(url)
    return url.endsWith("/dataset")
      ? { status: 302, error: null, headers: { location: "/hop" } }
      : { status: 302, error: null, headers: { location: "http://127.0.0.1/internal" } }
  }

  const result = await checkDatasetUrl("https://example.com/dataset", 100, requester)

  assert.equal(result.availability, "unsafe_redirect")
  assert.deepEqual(calls, ["https://example.com/dataset", "https://example.com/hop"])
})

test("live check deadline includes a request stalled before HTTP begins", async () => {
  const startedAt = Date.now()
  const result = await checkDatasetUrl(
    "https://example.com/dataset",
    20,
    () => new Promise(() => undefined),
  )

  assert.equal(result.availability, "network_error")
  assert.match(result.detail, /timed out after 20ms/iu)
  assert.ok(Date.now() - startedAt < 300)
})

test("live deadline propagates cancellation and safe HTTP bounds DNS resolution", async () => {
  let observedSignal
  const cancelled = await checkDatasetUrl(
    "https://example.com/dataset",
    20,
    (_url, options) =>
      new Promise((resolveRequest) => {
        observedSignal = options.signal
        options.signal.addEventListener(
          "abort",
          () => resolveRequest({ status: null, headers: {}, error: "AbortError: cancelled" }),
          { once: true },
        )
      }),
  )
  assert.equal(cancelled.availability, "network_error")
  assert.equal(observedSignal?.aborted, true)

  const dnsBound = await Promise.race([
    requestPinnedHttps("https://example.com", {
      timeoutMs: 20,
      lookupFn: () => new Promise(() => undefined),
    }).then(() => "request-finished"),
    new Promise((resolveWatchdog) => setTimeout(() => resolveWatchdog("watchdog"), 100)),
  ])
  assert.equal(dnsBound, "request-finished")
})

test("exported availability checker requires every positive integer option", async () => {
  await assert.rejects(
    () => checkDatasetAvailability(["https://example.com"], {}),
    /DATASET_LINK_ARGUMENT.*limit/u,
  )
})

test("link checker rejects fractional and nonpositive numeric arguments", () => {
  const checkerPath = resolve("scripts/research/check-dataset-links.mjs")
  for (const arguments_ of [
    ["--limit", "0.5"],
    ["--timeout-ms", "0"],
    ["--concurrency", "-1"],
  ]) {
    const result = runNode(checkerPath, "--offline", ...arguments_)
    assert.equal(result.status, 1)
    assert.match(result.stderr.toString(), /DATASET_LINK_ARGUMENT/u)
  }
})
