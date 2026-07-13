Completed 27 distinct Exa searches and fetched 66 canonical dataset/repository pages. The directory-first pass found substantially more public task data, trajectories, executable environments, and sample releases than a company-name search alone.

Directory provenance abbreviations:

- AAE: [Awesome AI Agent Evaluation](https://github.com/lhy723/awesome-ai-agent-evaluation)
- AAB: [Awesome Agent Benchmarks](https://github.com/dataanswer/awesome-agent-benchmarks)
- ACU: [Awesome Computer Use](https://github.com/eddieogola/awesome-computer-use)
- Survey: [LLM Agent Evaluation Survey](https://github.com/Asaf-Yehudai/LLM-Agent-Evaluation-Survey)
- HF/Exa: direct Hugging Face collection/tag and semantic search

### High-confidence accessible datasets

| Dataset / publisher | Canonical data URL | Type | Access | Description / evidence | Provenance |
|---|---|---|---|---|---|
| WebTailBench — Microsoft | https://huggingface.co/datasets/microsoft/WebTailBench | Tasks + rubrics | Open viewer/download | 609 hand-verified live-web tasks across 11 categories, plus 111 refusal tasks; V2 refresh provides updated task strings and rubrics. | HF/Exa |
| WebBench — Halluminate | https://huggingface.co/datasets/Halluminate/WebBench | Browser tasks | Open viewer/download | 2,454 task-oriented workflows across 452 live sites; read/create/update/delete/file-manipulation categories. | AAB, HF/Exa |
| ClawBench — NAIL Group | https://huggingface.co/datasets/NAIL-Group/ClawBench | Tasks + rubrics | Open viewer/download | V1 has 153 live-web tasks; V2 adds 130. Companion V1/V2 trace datasets contain screenshots, HTTP traffic, actions, and agent messages. | AAE, HF collection |
| CAP-Bench | https://huggingface.co/datasets/Warrior0302/CAP-Bench | Browser tasks | Open public split | Public split has 192 of 420 cross-site browser tasks spanning complex actions and visual perception across 108 sites. | HF/Exa |
| WeaveBench | https://huggingface.co/datasets/wanlilll/WeaveBench | Executable CUA tasks | Open download | 114 long-horizon tasks across eight work domains combining GUI, CLI, and code; task assets, VM, runtime bootstrap, and judge are downloadable. | HF/Exa |
| LexBench-Browser — Lexmount | https://huggingface.co/datasets/Lexmount/LexBench-Browser | Browser tasks + rubrics | Open download | 210 no-login tasks across 107 sites, with bilingual instructions, reference steps, key points, common errors, and rubrics. | HF/Exa |
| ComponentBench | https://huggingface.co/datasets/TianchenGuan/ComponentBench | UI interaction tasks + traces | Open viewer/download | 2,910 full and 912 core diagnostic UI-component tasks across 97 component types and 14 interaction families, with human traces. | HF/Exa |
| CUA-Gym — xlang | https://huggingface.co/datasets/xlangai/CUA-Gym | Executable RLVR tasks | Open viewer + artifact archive | 10,910 verifiable computer-use tasks, each with instruction, setup artifacts, and executable reward code; covers 327 application types. | HF collection |
| AgentNet — xlang | https://huggingface.co/datasets/xlangai/AgentNet | Human desktop trajectories | Open download | 22.6K human-annotated tasks across Windows, macOS, and Ubuntu. | ACU, HF/Exa |
| OSWorld successful trajectories — Markov AI | https://huggingface.co/datasets/markov-ai/computer-use | Successful trajectories | Open viewer/download | 160 fully successful OSWorld trajectories and 1,378 action steps across Chrome, LibreOffice, GIMP, email, OS, and cross-app tasks. | HF/Exa |
| Computer Use Large — Markov AI | https://huggingface.co/datasets/markov-ai/computer-use-large | Screen-recording corpus | Open download | 48,478 videos, about 12,300 hours, covering AutoCAD, Blender, Excel, Photoshop, Salesforce, and VS Code. | ACU |
| VideoCUA — ServiceNow | https://huggingface.co/datasets/ServiceNow/VideoCUA | Expert desktop videos/actions | Open download | Roughly 10K tasks, 55 hours, six million frames, and 87 professional desktop applications, with precise input-event logs. | HF/Exa |
| Desktop Agent Trajectories Sample | https://huggingface.co/datasets/diogoneno/desktop-agent-trajectories-sample | Sample trajectories | Open viewer/download | 56 Linux desktop-agent trajectories covering browser, terminal, files, and GUI interaction in chat/tool format. | HF/Exa |
| Mind2Web — OSU NLP | https://huggingface.co/datasets/osunlp/Mind2Web | Web demonstrations | Open train data; controlled test | More than 2,000 tasks from 137 sites and 31 domains with crowdsourced action sequences and HTML grounding. | AAE, Survey |
| Multimodal Mind2Web — OSU NLP | https://huggingface.co/datasets/osunlp/Multimodal-Mind2Web | Screenshot/HTML/action data | Open viewer/download | Screenshot-aligned Mind2Web actions: 7,775 train actions and multiple cross-task/site/domain test splits. | HF/Exa |
| WebLINX — McGill NLP | https://huggingface.co/datasets/McGill-NLP/WebLINX | Conversational web demonstrations | Open viewer/download | About 100K interactions from 2,300 expert demonstrations across more than 150 real sites. | AAE, Survey |
| WebLINX BrowserGym | https://huggingface.co/datasets/McGill-NLP/weblinx-browsergym | BrowserGym-ready demonstrations | Open viewer/download | WebLINX 1.1 converted for BrowserGym/AgentLab, including tab actions and evaluation steps. | Directory expansion |
| WebArena | https://github.com/web-arena-x/webarena | Self-hosted tasks/environment | Open repository | Canonical task configs and evaluators for realistic state-changing web tasks; repository also includes human trajectories for about 170 tasks. | AAE, Survey |
| VisualWebArena | https://github.com/web-arena-x/visualwebarena | Visual browser tasks | Open repository | 910 visually grounded tasks across Classifieds, Shopping, and Reddit environments. | AAE, Survey |
| WebArena-Verified — ServiceNow | https://github.com/ServiceNow/webarena-verified | Verified tasks + deterministic evaluators | Open repository | Curated, version-controlled WebArena tasks with network-trace replay and audited deterministic evaluation. | AAE expansion |
| WorkArena — ServiceNow | https://github.com/ServiceNow/WorkArena | Enterprise browser environment/tasks | Open repository/package | 33 atomic ServiceNow task families and WorkArena++ compositional tasks; task classes include native state validation. | AAE, Survey |
| AssistantBench | https://huggingface.co/datasets/AssistantBench/AssistantBench | Research/web tasks | Open viewer/download | 214 realistic, time-consuming, automatically evaluated tasks; 33 validation and 181 test rows. | AAB, Survey |
| Odysseys | https://github.com/ljang0/Odysseys | Live-web tasks | Open repository | 200 long-horizon tasks derived from real browsing sessions, evaluated on the live web with rubrics. | HF/Exa |
| SaaS-Bench | https://github.com/UniPat-AI/SaaS-Bench | Self-hosted professional workflows | Open repository | 106 tasks across six domains and 23 locally deployable SaaS apps, with state-based per-task verifiers. | HF/Exa |
| OfficeBench | https://github.com/zlwang-cs/OfficeBench | Multi-application office tasks | Open repository | Long-horizon Word, spreadsheet, email, and cross-application office workflows with environment and evaluation code. | Compendium |
| FORTE | https://github.com/AGI-Eval-Official/FORTE | Professional office tasks | Open repository | Full-cycle office benchmark spanning 15 corporate professions; task and evaluation assets are present in the repository. | Compendium |
| ScreenSpot | https://huggingface.co/datasets/rootsautomation/ScreenSpot | GUI grounding | Open viewer/download | More than 1,200 grounding instructions across iOS, Android, macOS, Windows, and web, with screenshots and target boxes. | ACU |
| ScreenSpot V2 | https://huggingface.co/datasets/OS-Copilot/ScreenSpot-v2 | GUI grounding | Open download | Updated ScreenSpot release; repository has approximately 1.33 GB of assets, though its dataset card is empty. | ACU |
| ScreenSpot-Pro | https://huggingface.co/datasets/likaixin/ScreenSpot-Pro | Professional GUI grounding | Open viewer/download | High-resolution expert-annotated screenshots spanning professional applications, five industries, and multiple operating systems. | ACU |
| CAGUI — OpenBMB | https://huggingface.co/datasets/openbmb/CAGUI | Android grounding + agent episodes | Open viewer/download | Chinese Android dataset with screenshot grounding/OCR data and multi-step agent episodes with actions and step screenshots. | ACU |
| SWITCH Basic public subset — BAAI | https://huggingface.co/datasets/BAAI-Agents/SWITCH-Basic-v1-open | Tangible interface interaction | Open 30% public subset | Visual state, planning, causal reasoning, and outcome-verification annotations for real-world tangible computer interfaces. | HF/Exa |
| AgentSearchBench Tasks | https://huggingface.co/datasets/AgentSearch/AgentSearchBench-Tasks | Agent discovery/search tasks | Open viewer/download | Validation/test queries derived from nearly 10K agents; includes single-agent and multi-agent retrieval/reranking tasks. | HF/Exa |
| Escalation Bench | https://huggingface.co/datasets/nealdesai/escalation-bench | Tool-agent safety decisions | Open viewer/download | Minimal-pair tasks testing whether agents should proceed or request human handoff, with canned tool worlds and terminal-action scoring. | HF/Exa |
| AgentBoard | https://huggingface.co/datasets/hkust-nlp/agentboard | Cross-environment agent tasks | Open viewer/download | Aggregates nine embodied, game, web, and tool environments including ALFWorld, ScienceWorld, WebShop, WebArena, and tool tasks. | HF/Exa |
| AgencyBench — GAIR | https://huggingface.co/datasets/GAIR/AgencyBench | Long-horizon tasks + rubrics | Open viewer/download | V2 covers 32 scenarios and 138 subtasks across backend, frontend, code, game, research, and MCP; detailed queries, deliverables, and rubrics. | HF/Exa |
| AgenticDataBench | https://huggingface.co/datasets/shawnzzzh/AgenticDataBench | Data-agent tasks/artifacts | Open download | Public data-science workflow benchmark across 15 domains; HF release contains 663 rows and approximately 28.4 GB. Repository also includes tasks, skills, and gold artifacts. | HF/Exa |
| Data Agent RL Environment Eval | https://huggingface.co/datasets/AdithyaSK/data_agent_rl_environment_eval | Executable data-analysis tasks | Open viewer/download | 366 Harbor-format tasks with Kaggle dependencies, Docker environments, tests, reward functions, and L1–L5 difficulty labels. | HF/Exa |
| Toolathlon Trajectories — HKUST | https://huggingface.co/datasets/hkust-nlp/Toolathlon-Trajectories | Tool-agent trajectories | Open download, CC-BY-4.0 | More than 5,000 execution records across about 108 tasks, 17 models, and three runs, including messages, tools, status, cost, and timing. | HF/Exa |
| Terminal-Bench 2.0 Trajectories | https://huggingface.co/datasets/yoonholee/terminalbench-trajectories | Terminal-agent trajectories | Open viewer/download | 52,104 trajectories over 89 tasks, 26 agent scaffolds, and 49 underlying models, with tool calls and observations. | HF/Exa |
| CC-Bench Trajectories — Z.ai | https://huggingface.co/datasets/zai-org/CC-Bench-trajectories | Coding-agent tasks/trajectories | Open viewer/download | 74 tasks across frontend, app development, UI optimization, build/deploy, data analysis, and ML, with complete model trajectories. | HF/Exa |
| ITBench Trajectories — IBM | https://huggingface.co/datasets/ibm-research/ITBench-Trajectories | IT operations trajectories | Open download | 105 complete agent runs across 35 SRE scenarios, including reasoning, generated code, observability context, and evaluation metrics. | HF/Exa |
| ACEBench Trajectories | https://huggingface.co/datasets/AgentSuite/ACEBench-trajectories | Agent trajectories | Open download | One JSONL per model, 30 models and 1,023 tasks per model, containing messages and evaluation results. Card warns some agent trajectories predate a task correction. | HF/Exa |
| LinuxArena Public | https://huggingface.co/datasets/anonymouslinuxarena/linuxarena-public | Linux trajectories + monitor traces | Open viewer/download | 22,215 trajectories from 172 evaluation runs across ten Linux environments; direct sample JSONL contains 932 trajectories. | HF/Exa |
| CodeTraceBench | https://huggingface.co/datasets/NJU-LINK/CodeTraceBench | Diagnosed coding trajectories | Open viewer/download | 4,316 SWE-bench/Terminal-Bench trajectories with human-verified step-level incorrect/unuseful annotations. | HF/Exa |
| ATBench | https://huggingface.co/datasets/AI45Research/ATBench | Agent safety trajectories | Open viewer/download | 1,000 audited long-horizon trajectories, balanced safe/unsafe, plus legacy 500-case split; includes tool calls and environment feedback. | HF/Exa |
| SWE-bench Pro — Scale AI | https://huggingface.co/datasets/ScaleAI/SWE-bench_Pro | Software engineering tasks | Open public release | Public long-horizon repository issue-resolution dataset with canonical benchmark data and companion open-source harness. | AAB |
| BFCL — Berkeley/Gorilla | https://huggingface.co/datasets/gorilla-llm/Berkeley-Function-Calling-Leaderboard | Function-calling tests | Open download | Multilingual function-calling data across simple, parallel, multiple, relevance, and multi-turn categories. | AAB |
| ToolBench | https://huggingface.co/datasets/Maurus/ToolBench | API tool-use data | Open download | Public ToolBench mirror with 88,895 rows and about 348 MB of data. | AAB, Survey |
| ComplexFuncBench — Z.ai | https://huggingface.co/datasets/zai-org/ComplexFuncBench | Complex function calls | Open viewer/download | 1,000 samples covering multi-step calls, user constraints, implicit parameter reasoning, long values, and 128K context. | AAB, Survey |
| HammerBench — MadeAgents | https://huggingface.co/datasets/MadeAgents/HammerBench | Mobile assistant tool dialogues | Open viewer/download | English/Chinese interactive slot-filling conversations covering incomplete requests, intent changes, and external personal information references. | AAB |
| ToolSandbox — Apple | https://github.com/apple/ToolSandbox | Stateful tool environment + trajectories | Open repository | 1,032 crafted test cases with stateful tools, conversational user simulation, dynamic milestones, and sample run trajectories. | AAE, Survey |
| τ-bench | https://github.com/sierra-research/tau-bench | Customer-service tasks + data | Open repository | Airline and retail tool-agent-user conversations with policies, databases, expected actions, and state-based scoring; repository now notes newer task fixes live in τ2/τ3. | AAE, Survey |
| τ2/τ3 Bench | https://github.com/sierra-research/tau2-bench | Customer-service environments/tasks | Open repository | Current framework covers airline, retail, telecom, banking-knowledge, and mock domains; task data, policies, databases, simulators, and result viewer are included. | AAE |
| AgentDojo — ETH Zurich | https://github.com/ethz-spylab/agentdojo | Security tasks/environment | Open repository | 97 utility tasks and 629 prompt-injection security cases across email, banking, travel, and other tool-using applications. | AAE, Survey |
| MCP Atlas — Scale AI | https://huggingface.co/datasets/ScaleAI/MCP-Atlas | MCP tasks + reference trajectories | Open 500-task sample | 500 public tasks spanning all 36 servers and 220 tools; each includes prompt, enabled tools, reference claims, and 3–6-call trajectory. | AAB, HF/Exa |
| MCPToolBench++ | https://huggingface.co/datasets/MCPToolBench/MCPToolBenchPP | MCP function calls | Open viewer/download | 1,509 instances across browser, filesystem, search, map, finance, and payment tools; card describes larger server collection as work in progress. | HF/Exa |
| LiveMCPBench | https://huggingface.co/datasets/ICIP/LiveMCPBench | Live MCP tasks | Open viewer/download | 95 real-world tasks using 70 MCP servers and 527 tools. | AAB, HF/Exa |
| DynamicMCPBench | https://huggingface.co/datasets/anonsubmitter/DynamicMCPBench | MCP specs + reference traces | Open, anonymized | Effect-based TaskSpecs, reference traces, minefields, ordering constraints, and deterministic replay artifacts; about 2.57 GB. | HF/Exa |
| Limbic MCP Tool Use Eval — Quotient | https://huggingface.co/datasets/quotientai/limbic-eval-tool-use-mcp | Synthetic MCP function calls | Open viewer/download | 9,813 examples for tool selection and parameter structure/value evaluation. | HF/Exa |
| MCP Agent Trajectory Benchmark | https://huggingface.co/datasets/obaydata/mcp-agent-trajectory-benchmark | MCP trajectories + server implementations | Open download | 49 standardized trajectories across finance, health, HR, logistics, marketing, and support, including working MCP server code and workspace configs. | HF/Exa |

### Conditional-access sample data worth listing with explicit labels

| Dataset | URL | Access note |
|---|---|---|
| ST-WebAgentBench | https://huggingface.co/datasets/ST-WebAgentBench/st-webagentbench | Gated HF access. Contains 375 enterprise tasks and 3,057 policy instances across six safety dimensions. |
| Online-Mind2Web | https://huggingface.co/datasets/osunlp/Online-Mind2Web | Gated HF access. Contains 300 refreshed live-web tasks from 136 sites. |
| WebChain | https://huggingface.co/datasets/webagentlab/WebChain | Gated; academic/educational approval, separate commercial permission. 31,725 trajectories and 317,993 steps over 428 domains. |
| GAIA | https://huggingface.co/datasets/gaia-benchmark/GAIA | Gated to reduce contamination; public dev subset, private test answers, and no unrestricted redistribution. More than 450 tool-using assistant questions. |
| Datoric Computer-Use Traces Sample | https://huggingface.co/datasets/Datoric/computer-use-agent-traces-250k | Public schema/sample metadata only; the 250K production traces are commercially licensed. |
| SWITCH Basic | https://huggingface.co/datasets/BAAI-Agents/SWITCH-Basic-v1-open | Only 30% of the full benchmark is public; label as a public subset. |

### Results-only datasets to keep separate from task/sample data

- [Open Agent Leaderboard Results](https://huggingface.co/datasets/open-agent-leaderboard/results) contains benchmark scores, cost, steps, and run counts across AppWorld, BrowseComp+, SWE-bench, and τ-bench variants. It is useful evidence data but not a task corpus.
- ClawBench’s companion trace datasets and LinuxArena are execution-result corpora; tag them as “trajectories,” not benchmark task definitions.

### Exclusion / quality warnings

- `brijeshvadi/mcp-tool-calling-benchmark` should not be published without qualification. Its card claims 6,451 logs, while the live HF metadata exposed only 53 rows and 12.5 KB during verification.
- ScreenSpot-V2’s canonical-looking HF repository has data but an empty README. Use the OS-Copilot link and avoid asserting detailed counts until independently checked.
- The older `tau-bench` repository explicitly says its airline/retail task versions are outdated; use `tau2-bench`/τ3 for the current catalog entry and retain τ-bench as historical.
- Open Agent Leaderboard results should not be counted as a distinct task dataset.
- Anonymous/double-blind releases such as DynamicMCPBench are accessible but should be labeled “anonymous research release,” not attributed to a company.

## CLAIMS

- Directory- and collection-first search surfaced more than 60 concrete data-bearing resources beyond the three user-provided examples.
- At least 53 are directly downloadable public datasets or repositories with task/config/trajectory artifacts.
- Six additional resources expose useful samples or complete data behind gated, academic, subset, or commercial-review access.
- The strongest new additions for the site are WebTailBench, ClawBench, CAP-Bench, WeaveBench, ComponentBench, CUA-Gym, AgencyBench, WebLINX, SaaS-Bench, Toolathlon/Terminal-Bench trajectories, LinuxArena, CodeTraceBench, ATBench, BFCL, ComplexFuncBench, ToolSandbox, and the MCP benchmark family.
- Access type and artifact type must be first-class fields; otherwise task definitions, trajectories, leaderboard results, and commercial sample schemas will be misleadingly mixed.

## EXPAND

- Verify the exact canonical publisher and row count for ScreenSpot-V2; several HF mirrors exist.
- Inspect FORTE’s task directories for exact public task count and artifact schema.
- Inspect AgenticDataBench’s 663-row HF structure to determine whether rows are full tasks or bundled artifacts.
- Search each HF collection attached to CUA-Gym, ClawBench, ATBench, and Toolathlon for companion task/trajectory datasets not returned by top-level semantic queries.
- Search public leaderboard submission repositories for downloadable raw runs separately from task corpora: Steel browser leaderboard, AgentBoard, BFCL, τ-bench, and SWE-bench Pro.
- Recursively expand directories for newer 2026 benchmarks named in the compendium but lacking canonical data links, especially SpreadsheetBench 2, BlueFin, WildClawBench, and FORTE.
