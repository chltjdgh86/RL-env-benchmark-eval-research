Exa-first saturation pass complete for the science/data/deep-research axis. I ran more than 50 discovery and counter-search queries, then checked canonical repositories, Hugging Face releases, benchmark viewers, companion corpora, and access restrictions. Only task, sample, trajectory, database, or evaluation-data surfaces with a primary source are included below.

Access labels: **Open** = directly downloadable; **Mixed** = some public material but credentials, private gold, or external data required; **Gate** = contact-sharing or terms gate; **Viewer** = browsable samples but incomplete downloadable data.

### Data analysis, notebook, and data-agent benchmarks

| Dataset | Publisher | Canonical/data URL | Type and scale | Access | Description/evidence |
|---|---|---|---|---|---|
| DA-Code | DA-Code authors | [HF](https://huggingface.co/datasets/Luo2003/DA-Code), [repo](https://github.com/yiyihum/da-code) | 500 tasks; 100-source-task sample | Mixed | Executable Python/SQL tasks spanning wrangling, EDA, visualization, and ML. HF full set is gated; repo exposes a 100-task source sample. |
| DataSciBench | THUDM | [repo](https://github.com/THUDM/DataSciBench), [HF](https://huggingface.co/datasets/zd21/DataSciBench) | 222 prompts; 519 test cases | Mixed | Six data-science task types with instruction-following constraints and executable ground truth. HF uses a contact-sharing gate. |
| AgenticDataBench | Tsinghua/Ant collaborators | [repo](https://github.com/AgenticDataBench/AgenticDataBench), [HF](https://huggingface.co/datasets/shawnzzzh/AgenticDataBench) | 15 domains; 28.4 GB raw data | Mixed | Tasks, gold outputs, and raw enterprise-style datasets are public; 98 leaderboard tasks are withheld. |
| Data Agent RL Environment Eval | AdithyaSK | [HF](https://huggingface.co/datasets/AdithyaSK/data_agent_rl_environment_eval) | 366 tasks | Open | Harbor-format data-analysis environments containing instructions, Docker setup, graders, manifests, and task files. |
| DataAgentBench | UC Berkeley/Hasura | [repo](https://github.com/ucbepic/DataAgentBench), [HF data](https://huggingface.co/datasets/ruiyingm/DataAgentBench-data) | 54 queries; 12 datasets; 13.4 GB | Open | Natural-language database-analysis tasks across PostgreSQL, MongoDB, SQLite, and DuckDB, with validators and gold CSVs. |
| AgentDS | AgentDS authors | [hub](https://huggingface.co/datasets/lainmn/AgentDS), [Commerce sample](https://huggingface.co/datasets/lainmn/AgentDS-Commerce) | Six domain suites; 2–3 challenges/domain | Mixed | Commerce, banking, insurance, healthcare, manufacturing, and food data-science challenges. Train/sample data are open; test labels are private. |
| FDABench-Lite | FDABench | [HF](https://huggingface.co/datasets/FDAbench2026/Fdabench-Lite) | 289 tasks | Open | 116 single-choice, 56 multi-choice, and 117 report-generation financial data-agent tasks. |
| FDABench-Full | FDABench | [HF](https://huggingface.co/datasets/FDAbench2026/FDAbench-Full) | 2,007 tasks; 139 databases | Mixed | SQL, web, vector retrieval, analysis, and report tasks; public records and viewer, with portions of gold answers protected for evaluation. |
| FDABench File Corpus | FDABench | [HF](https://huggingface.co/datasets/FDAbench2026/FDABench-File) | 11.5 GB; 1,418 PDFs plus images/audio/video | Gate | Companion multimodal financial corpus across 50 domains; contact-sharing and noncommercial terms apply. |
| DS-Agent | DS-Agent authors | [repo](https://github.com/guosyjlu/DS-Agent) | 30 tasks | Open | Tabular, text, and time-series classification/regression tasks; data distributed through public Drive links. |
| DSBench | DSBench authors | [repo](https://github.com/LiqiangJing/DSBench) | 466 analysis + 74 modeling tasks | Open | End-to-end data-analysis and modeling tasks derived from ModelOff and Kaggle sources. |
| DAEval / DABench | InfiAgent | [HF](https://huggingface.co/datasets/infiagent/DABench), [project](https://infiagent.github.io/) | Public split: 311 questions, 55 CSVs | Open, viewer degraded | Data-analysis questions and answer artifacts. Current public release is larger than the older 257-question paper snapshot; HF viewer fails on heterogeneous schemas but files download. |
| DAComp-DA | ByteDance Seed | [repo](https://github.com/ByteDance-Seed/DAComp), [HF](https://huggingface.co/datasets/DAComp/dacomp-da) | Part of 210-task suite | Open | Open-ended data-analysis tasks with executable evaluation. |
| DAComp-DE | ByteDance Seed | [HF](https://huggingface.co/datasets/DAComp/dacomp-de) | Repo-level data engineering; ~2.27 GB | Open | SQL pipeline and repository-level data-engineering tasks. |
| DAComp Evaluation Artifacts | ByteDance Seed | [HF](https://huggingface.co/datasets/DAComp/dacomp-da-eval) | 5 large evaluation rows; ~240 MB | Open | Companion evaluator/reference artifacts for DAComp-DA. |
| AIDABench | AIDABench authors | [HF](https://huggingface.co/datasets/MichaelYang-lyx/AIDA), [repo](https://github.com/MichaelYang-lyx/AIDABench) | 603 tasks; 1,206 HF artifact rows | Open | Realistic spreadsheets, databases, operations records, reports, QA, visualization, and file-generation tasks. |
| InsightBench | ServiceNow | [HF](https://huggingface.co/datasets/ServiceNow/insight_bench), [repo](https://github.com/ServiceNow/insight-bench) | Current release: 100 datasets | Open | Synthetic enterprise tables with planted insights, analyst questions, and ground-truth notebooks. Some older landing-page text still says 31. |
| DataClawBench | GTML-LAB | [HF](https://huggingface.co/datasets/GTML-LAB/DataClaw) | 492 tasks; ~2.06M records | Open | Process-annotated financial data-analysis tasks over noisy enterprise, industry, and policy data. |
| CoDA-Bench | RUC DataLab | [HF](https://huggingface.co/datasets/RUC-DataLab/CoDA-Bench) | 1,009 tasks + 119 hard; ~45.6 GB | Open | Complex data-agent environments built from 199 Kaggle datasets across 31 communities, often containing hundreds of files per environment. |
| DABstep | Adyen/Hugging Face | [HF](https://huggingface.co/datasets/adyen/DABstep) | 450+ tasks | Open | Multi-step analysis over structured and unstructured business data with evaluations and baselines. |
| DashboardQA | vis-nlp | [HF](https://huggingface.co/datasets/ahmed-masry/DashboardQA), [repo](https://github.com/vis-nlp/DashboardQA) | 405 QA pairs; 112 Tableau dashboards | Open | Factoid, hypothetical, conversational, multi-dashboard, and multiple-choice dashboard tasks. |
| SciVisAgentBench | SciVisAgentBench authors | [tasks](https://huggingface.co/datasets/SciVisAgentBench/SciVisAgentBench-tasks), [repo](https://github.com/KuangshiAi/SciVisAgentBench) | 108 current test cases; 296 operations | Open | Scientific visualization workflows using ParaView, bioimage, molecular, volume, and topology data. |
| Agentic Data Access Benchmark | Hasura | [HF](https://huggingface.co/datasets/hasura/agentic-data-access-benchmark) | 144 rows | Open | Enterprise-style closed-domain data-access questions for qualitative agent evaluation. |
| CausalDS | CausalDS authors | [repo](https://github.com/andleb/causalds), [HF](https://huggingface.co/datasets/andleb/causalds) | 100-task released exam | Open | Causal reasoning over synthetic scenes, natural-language stories, and tabular data across Pearl’s causal hierarchy. |
| DiscoveryBench | Allen Institute for AI | [HF](https://huggingface.co/datasets/allenai/discoverybench) | 264 rows | Open | Data-driven scientific discovery tasks with CSV inputs, gold hypotheses, and statistical and semantic reasoning. |
| BLADE | Behavioral Data Science | [repo](https://github.com/behavioral-data/BLADE) | 14 named scientific analyses | Open | Real behavioral/social-science datasets, questions, expert analysis decisions, and notebook-agent evaluation. |
| ARCADE | Google Research | [repo](https://github.com/google-research/arcade-nl2code) | Existing and new notebook-task splits | Mixed | Natural-language-to-code tasks grounded in existing Jupyter notebooks; Kaggle download or API is required for parts of the data. |
| DS-1000 | xlang | [repo](https://github.com/xlang-ai/DS-1000) | 1,000 executable problems | Open | Data-science code generation across seven Python libraries; useful as a notebook-agent task bank. |
| Jupyter Agent Dataset | Jupyter Agent authors | [HF](https://huggingface.co/datasets/jupyter-agent/jupyter-agent-dataset) | Notebook tasks/trajectories | Open | Public notebook-agent training and evaluation material. |
| LAB-Bench | FutureHouse | [HF](https://huggingface.co/datasets/futurehouse/lab-bench) | 1,967 public rows; 8 categories, 30 subtasks | Mixed | Biology research-agent tasks over literature, protocols, sequences, figures, tables, databases, and cloning; about 20% held out. |
| InnovatorBench | GAIR-NLP | [repo](https://github.com/GAIR-NLP/InnovatorBench), [HF](https://huggingface.co/datasets/GAIR/InnovatorBench) | ResearchGym task suite | Open | ML-research tasks involving data construction, filtering, augmentation, objectives, rewards, and agent scaffolds. |

### SQL and database-agent environments

| Dataset | Publisher | Canonical/data URL | Type and scale | Access | Description/evidence |
|---|---|---|---|---|---|
| Spider 2.0 | xlang | [repo](https://github.com/xlang-ai/Spider2) | Lite, Snow, and 68-task DBT split | Mixed | Enterprise text-to-SQL and repository-level database tasks. Public questions and partial gold SQL; Snowflake/BigQuery worlds require accounts. |
| Spider2-V | xlang | [repo](https://github.com/xlang-ai/Spider2-V) | 494 executable tasks; 20 apps | Mixed | GUI-based data-science and data-engineering tasks with public task JSON and VM assets; some account-dependent applications. |
| BIRD-Interact Lite | BIRD | [HF](https://huggingface.co/datasets/birdsql/bird-interact-lite) | 300 visible rows | Mixed | Interactive PostgreSQL tasks with user simulation. Questions and metadata are public; gold SQL and test cases require email request. |
| BIRD-Interact Full | BIRD | [HF](https://huggingface.co/datasets/birdsql/bird-interact-full) | 600 rows | Mixed | Full conversational and agentic database-interaction suite; gold/test artifacts distributed separately. |
| LiveSQLBench Base-Lite | BIRD | [HF](https://huggingface.co/datasets/birdsql/livesqlbench-base-lite) | 270 rows; 18 databases | Mixed | BI, CRUD, and knowledge-intensive SQL tasks; questions public, reference/test material by request. |
| LiveSQLBench Base-Full v1 | BIRD | [HF](https://huggingface.co/datasets/birdsql/livesqlbench-base-full-v1) | 600 rows; 22 databases | Mixed | Larger enterprise SQL task release with public questions and restricted evaluator artifacts. |
| LiveSQLBench Large v1 | BIRD | [HF](https://huggingface.co/datasets/birdsql/livesqlbench-large-v1) | 480 rows; 18 large databases | Mixed | Industrial-scale schemas averaging roughly 1,000 columns and very long context. |
| LiveSQLBench Base-Lite SQLite | BIRD | [HF](https://huggingface.co/datasets/birdsql/livesqlbench-base-lite-sqlite) | 270 rows; 39.7 MB | Open | Lower-friction SQLite portability version of Base-Lite. |
| BIRD Mini-Dev | BIRD | [repo](https://github.com/BIRD-bench/mini_dev) | 500 original; 780 in V2 | Open | SQLite, MySQL, and PostgreSQL mini-development sets with databases and LiveSQL augmentation. |
| DBBench environment | THUDM AgentBench | [repo](https://github.com/THUDM/AgentBench) | Database-agent dev/test split | Open | Dockerized interactive database tasks included as one of AgentBench’s eight environments. |

### Deep research, web research, and scholarly search datasets

| Dataset | Publisher | Canonical/data URL | Type and scale | Access | Description/evidence |
|---|---|---|---|---|---|
| DeepSearchQA | Google DeepMind | [HF](https://huggingface.co/datasets/google/deepsearchqa) | 900 prompts | Open | Web research questions requiring causal-chain search and exhaustive, multi-item answers across 17 domains. |
| LiveDRBench | Microsoft | [HF](https://huggingface.co/datasets/microsoft/LiveDRBench) | 100 core tasks; 110 config rows | Mixed | Scientific and public-event claim discovery. Prompts and references are public; ground-truth answers are encrypted. |
| LiveResearchBench | Salesforce | [HF](https://huggingface.co/datasets/Salesforce/LiveResearchBench) | 100 tasks | Gate | Expert-curated dynamic research questions across daily, enterprise, and academic domains. |
| BrowseComp | OpenAI | [benchmark](https://openai.com/index/browsecomp/), [data/eval](https://github.com/openai/simple-evals) | 1,266 questions | Open, encrypted answers | Hard fact-finding questions designed for browsing agents; public questions and encrypted reference answers. |
| BrowseComp-Plus | Tevatron/Texttron | [HF](https://huggingface.co/datasets/Tevatron/browsecomp-plus), [corpus](https://huggingface.co/datasets/Tevatron/browsecomp-plus-corpus) | 830 queries; ~100,195 documents | Open | Fixed-corpus BrowseComp variant with evidence documents, gold documents, and hard negatives. |
| AssistantBench | AssistantBench authors | [HF](https://huggingface.co/datasets/AssistantBench/AssistantBench) | 214 tasks | Mixed | Realistic, time-consuming web tasks. Development items include answers, URLs, and explanations; test answers are withheld. |
| OpenResearcher Web-Bench | OpenResearcher | [HF](https://huggingface.co/datasets/OpenResearcher/web-bench) | 5,498 rows; 4,318 unique questions | Open | Aggregates GAIA-text, HLE, WebWalkerQA, XBench, SealQA, and BrowseComp. Components should not be counted twice. |
| DeepResearch-Bench | MUSETAI | [HF](https://huggingface.co/datasets/muset-ai/DeepResearch-Bench-Dataset) | 100 prompts; 400 reports; 150 annotations | Open | Deep-research report generation with reports from four systems and human RACE annotations. |
| DRBench | ServiceNow | [HF](https://huggingface.co/datasets/ServiceNow/drbench) | 100 tasks; 1,958 files | Open | Enterprise deep-research tasks grounded in PDFs, DOCX, spreadsheets, chat, and email artifacts. |
| ReportBench | ByteDance BandAI | [HF](https://huggingface.co/datasets/ByteDance-BandAI/ReportBench) | 100 tasks | Open | Academic-survey report tasks with citation and reference ground truth. |
| DeepResearchEval | Infinity AI Lab | [HF](https://huggingface.co/datasets/Infinity-AILab/DeepResearchEval), [repo](https://github.com/Infinity-AILab/DeepResearchEval) | 100 tasks | Open | Persona-driven research tasks with report-quality and fact-checking evaluation. |
| DeepResearch-9K | DeepSynthesis contributors | [HF](https://huggingface.co/datasets/artillerywu/DeepResearch-9K) | 9,000 trajectories/questions; 3,974 hard config rows | Open | Teacher research trajectories, plans, and answers for training and evaluation. |
| DeepWideSearch | ATH-MaaS | [HF](https://huggingface.co/datasets/ATH-MaaS/DeepWideSearch) | 220 tasks; 15 domains | Open | Table-output questions combining multi-hop depth with broad entity/data collection. |
| Sage | Sage authors | [repo](https://github.com/HughieHu/Sage) | 1,200 queries | Open | Scientific-literature retrieval benchmark: 600 target-paper and 600 open-ended relevance-tier queries. |
| ScholarGym | ScholarGym authors | [HF](https://huggingface.co/datasets/shenhao/ScholarGym) | 300 queries; 570K-paper corpus | Open | Fast and hard scholarly-research tasks grounded in a static CS, physics, and mathematics corpus. |
| AutoResearchBench | AutoResearchBench authors | [HF](https://huggingface.co/datasets/Lk123/AutoResearchBench) | 1,000 questions; 195 topics | Mixed | Target-paper retrieval and broad set-discovery tasks. Release uses reversible obfuscation and may require a token for some artifacts. |
| ScholarQABench | AllenAI/OpenScholar | [repo](https://github.com/AkariAsai/ScholarQABench) | 2,967 queries; 208 long-form answers | Open | Expert scientific questions across CS, physics, neuroscience, and biomedicine, with rubrics and example system outputs. |
| GAIA | GAIA benchmark | [HF](https://huggingface.co/datasets/gaia-benchmark/GAIA) | 466 questions | Mixed | Multimodal, tool-using, and web-search assistant tasks across three difficulty levels; test answers are private. |
| FRAMES | Google | [HF](https://huggingface.co/datasets/google/frames-benchmark) | 824 questions | Open | Multi-hop search and reasoning across 2–15 Wikipedia articles, with answers and supporting articles. |
| DEEPSYNTH Bench | DeepSynthesis Team | [HF](https://huggingface.co/datasets/DeepSynthesisTeam/deepsynth-bench) | 120 tasks | Mixed | Forty development tasks include decompositions and intermediate answers; 80 public test questions have private gold. |
| Researchy Questions | Microsoft Research contributors | [HF](https://huggingface.co/datasets/corbyrosset/researchy_questions) | ~96K queries | Open | Real Bing queries selected for decomposition, multiple perspectives, and non-factoid research; includes plans, subqueries, and click histograms. |
| WebWalkerQA | WebWalkerQA authors | [HF](https://huggingface.co/datasets/callanwu/WebWalkerQA) | 680 questions | Open | Website-structure traversal tasks with answers, root URLs, golden paths, hop counts, and difficulty. |

### Scientific discovery and ML experimentation environments

| Dataset | Publisher | Canonical/data URL | Type and scale | Access | Description/evidence |
|---|---|---|---|---|---|
| ScienceAgentBench | OSU NLP | [HF](https://huggingface.co/datasets/osunlp/ScienceAgentBench) | 102 tasks; 44 papers; 4 disciplines | Mixed | Scientific data-analysis tasks requiring executable Python. Instructions and previews are public; some underlying paper data are referenced rather than redistributed. |
| DiscoveryWorld | Allen Institute for AI | [repo](https://github.com/allenai/discoveryworld) | Generated scenarios and run traces | Open | Gym-like virtual scientific-discovery environment with difficulties, seeds, human/agent runs, videos, and raw logs. |
| ScienceWorld | Allen Institute for AI | [repo](https://github.com/allenai/ScienceWorld) | 30 task families; thousands of variations | Open | Text-based elementary-science environment with generated task instances and demo/playthrough transcripts. |
| SciAgentGym / SciAgentBench | SciAgentGym authors | [repo](https://github.com/CMarsRover/SciAgentGYM) | 259 tasks; 1,134 subquestions; 1,780 tools | Open | Isolated scientific workflows spanning physics, chemistry, materials, and life science, with golden traces. |
| ScienceBoard | OS-Copilot | [repo](https://github.com/OS-Copilot/ScienceBoard), [trajectories](https://huggingface.co/datasets/OS-Copilot/ScienceBoard-Traj) | 169 tasks; 6 domains | Open | GUI and CLI scientific workflow tasks plus released agent trajectories and VM assets. |
| PaperBench | OpenAI | [repo/data](https://github.com/openai/frontier-evals/tree/main/project/paperbench) | 20 ICML papers; 8,316 rubric nodes | Mixed | Reproduction tasks with paper PDFs, markdown, assets, and hierarchical rubrics; a few JudgeEval artifacts cannot be redistributed. |
| CORE-Bench | CORE-Bench authors | [repo](https://github.com/siegelz/core-bench), [HF](https://huggingface.co/datasets/siegelz/core-bench) | 270 tasks; 90 papers | Open, encrypted test | Reproducibility tasks across CS, social science, and medicine with code capsules and questions. |
| ResearchBench | ResearchBench authors | [HF](https://huggingface.co/datasets/ankilok/ResearchBench) | 1,369 papers; retrieval/generation/ranking splits | Gate | Research-agent tasks with a small smoke-test bundle; full release is academic/noncommercial and contact-gated. |
| OpenDiscoveryTrace | OpenDiscoveryTrace authors | [HF](https://huggingface.co/datasets/aayambansall/OpenDiscoveryTrace) | 432 trajectories; 124 executed tasks | Open | Complete AI-scientist trajectories from frontier and open models over a 200-task bank in four domains. |
| SGI-Bench | InternScience | [repo](https://github.com/InternScience/SGI-Bench) | 1,000+ samples; 10 disciplines | Gate | Deep research, idea generation, dry/wet experiments, and multimodal experimental reasoning; HF data require contact-sharing acceptance. |
| MoSciBench | HKUST | [repo](https://github.com/usail-hkust/MoSciBench) | 88 tasks; 6 domains; 7 modalities | Open | Multimodal scientific hypothesis generation and discovery tasks; datasets distributed via public Drive links. |
| SciAgentArena | SciAgentArena authors | [HF](https://huggingface.co/datasets/iLOVE2D/SciAgentArena), [repo](https://github.com/HelloWorldLTY/SciAgentArena) | Approximately 200 tasks | Gate | Step-verified biomedical tasks across single-cell/spatial omics, drug discovery, EHR, and genetics; large underlying omics corpus. |
| MLE-bench | OpenAI | [repo](https://github.com/openai/mle-bench) | 75 Kaggle competitions; 22 Lite | Kaggle | End-to-end ML engineering agents. Harness and task metadata are open; competition data require Kaggle credentials and terms. |
| MLE-Dojo | MLE-Dojo authors | [repo](https://github.com/MLE-Dojo/MLE-Dojo) | 200+ environments | Kaggle | Interactive Kaggle-derived ML engineering environments; code is open, competition data are credentialed. |
| MLAgentBench | Stanford SNAP | [repo](https://github.com/snap-stanford/MLAgentBench) | 13 tasks | Mixed | End-to-end ML experimentation tasks with automatic preparation; some sources require Kaggle authentication. |
| MLGym | Meta | [repo](https://github.com/facebookresearch/MLGym) | 13 tasks | Open | Gym-style open-ended AI research tasks across CV, NLP, RL, and game theory. |
| FML-bench | FML-bench authors | [repo](https://github.com/qrzou/fml-bench) | 8 tasks | Open | Fundamental ML-research tasks with baselines, evaluation, and iterative agent harnesses. |
| MLS-Bench | MLS-Bench authors | [repo](https://github.com/Imbernoulli/MLS-Bench), [task specs](https://huggingface.co/datasets/Bohan22/MLS-Bench-Tasks) | 140 tasks; 30-task Lite | Open, compute-heavy | Executable ML-research tasks across 12 domains; full suite reports approximately 704.7 H100-hours. |
| ML-Bench | ML-Bench authors | [site/data links](https://ml-bench.github.io/) | 9,641 examples; 18 repositories | Open | Repository-grounded ML code and agent tasks split between ML-LLM-Bench and Linux-sandbox ML-Agent-Bench. |
| AIRS-Bench | Meta | [repo](https://github.com/facebookresearch/airs-bench) | 20 tasks; 17 papers; 16 HF datasets | Open | Executable AI-research problems pairing datasets, metrics, and state-of-the-art targets. |

Important exclusions and normalization:

- I excluded **UniDataBench** from the counted catalog because Exa located the paper but no verified public task, sample, viewer, or data release.
- OpenResearcher Web-Bench is an aggregator; its BrowseComp, WebWalkerQA, GAIA-text, and other components should not inflate totals.
- Several official cards have inconsistent snapshots: DAEval’s old 257/52 count versus the current public 311/55 release; InsightBench’s stale 31-dataset landing copy versus the current 100-dataset release; BIRD-Interact Lite prose saying 270 in places while the viewer contains 300 rows.
- Kaggle-derived benchmarks are accessible environments, but the underlying competition data remain subject to Kaggle credentials and competition terms.
- “Encrypted answer” releases still qualify as sample datasets because questions, metadata, environments, and usually evaluator scaffolding are public; they should be labeled clearly on the site.

## CLAIMS

- Exa-first search uncovered dozens of additional public sample-data surfaces beyond the three seed links, including large releases such as CoDA-Bench, FDABench, DeepResearch-9K, ScholarGym, DataClawBench, DABstep, and Spider2-V.
- The strongest directly downloadable data-agent releases are DataClawBench, CoDA-Bench, DABstep, AIDABench, DataAgentBench, DiscoveryBench, CausalDS, FDABench-Lite, and the 366-task Data Agent RL Environment Eval.
- The strongest deep-research sample releases are DeepSearchQA, BrowseComp/Plus, DRBench, ReportBench, DeepResearchEval, ScholarGym, Sage, AutoResearchBench, DeepWideSearch, and DEEPSYNTH.
- Public access is not binary: leaderboard sets commonly expose prompts and environments while withholding gold answers; others use HF contact gates, email-distributed evaluators, account-dependent databases, or Kaggle data terms.
- Paper-only announcements without a task/sample/data surface were deliberately excluded.

## EXPAND

- Counter-search benchmark companion releases for `OpenHands`, `SWE-bench multimodal`, `ToolSandbox`, `BrowserGym`, `WebArena`, and `OSWorld` specifically for data/science task subsets.
- Search individual Kaggle competition manifests used by MLE-bench, MLE-Dojo, MLAgentBench, CoDA-Bench, and ARCADE to expose legal first-party sample links without duplicating benchmark entries.
- Check recent 2026 papers citing DataSciBench, AgenticDataBench, FDABench, DAComp, SciAgentGym, and LiveResearchBench for newly released hard/test/trajectory companions.
- Search Zenodo, Figshare, OSF, Dataverse, and institutional repositories for ScienceAgentBench and paper-reproduction capsules that are referenced but not mirrored on GitHub/Hugging Face.
- Revisit UniDataBench, newer InfiAgent/DAEval releases, and any SciAgentArena full release when their public repositories expose stable task files rather than paper-only descriptions.
