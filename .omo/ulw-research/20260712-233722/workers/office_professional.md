# Office and Professional-Work Dataset Inventory

Completed the office/professional-work axis with 60+ distinct Exa queries and primary-source verification.

## Public task/data releases

| Dataset | Publisher | Data / canonical URL | Access | Description and sample evidence |
|---|---|---|---|---|
| SpreadsheetBench | RUCKB Reasoning | https://github.com/RUCKBReasoning/SpreadsheetBench | Open download | 912 real spreadsheet-manipulation instructions and 2,729 workbook test cases. Repository includes a 200-task sample archive and the complete benchmark. |
| SpreadsheetBench 2 | KAKA22 / SpreadsheetBench | https://huggingface.co/datasets/KAKA22/SpreadsheetBench-v2 | Open files; no row viewer | End-to-end business spreadsheet workflows involving financial modeling, debugging, cross-sheet reasoning, and visualization. The 308 MB release is downloadable. |
| Spreadsheet-RL | Spreadsheet-RL | https://huggingface.co/datasets/Spreadsheet-RL/Spreadsheet-RL | Open viewer/download | Spreadsheet-agent RL data: 5,925 training rows per tool-call format and 2,722 evaluation rows, plus workbook artifacts and SpreadsheetBench Verified. |
| AI Spreadsheet Benchmark | Rows | https://huggingface.co/datasets/rowshq/aispreadsheetbenchmark | Open viewer/download | 53 realistic spreadsheet-copilot prompts covering analysis, enrichment, charts, models, and workbook management. |
| Finch / FinWorkBench | FinWorkBench | https://huggingface.co/datasets/FinWorkBench/Finch | Open download | 172 long-horizon finance and accounting workflows with 1,710 spreadsheets and 27 million cells, including task instructions, inputs, and references. |
| BlueFin public release | Longitude Labs | https://huggingface.co/datasets/Longitude-Labs/bluefin-release | Open viewer/download | Public financial-spreadsheet subset: 3 interrogation rows, 7 manipulation tasks, and 1 synthesis task, with embedded Excel workbooks and rubrics/reference outputs. |
| FormulaCascade eval-200 | FormulaCascade | https://huggingface.co/datasets/anonymity11/FormulaCascade_Benchmark | Open files/viewer manifest | 200 evaluation workbooks for long-horizon formula-dependency and formula-family reasoning. |
| SheetBench-50 | HUD | https://huggingface.co/datasets/hud-evals/SheetBench-50 | Open viewer/download | 50 spreadsheet tasks across data preparation, derivation, compliance filters, forecasting, amortization, and scenario modeling. |
| Spreadsheet Arena release | Longitude Labs | https://huggingface.co/datasets/Longitude-Labs/spreadsheet-arena-release | Open viewer/download | 555 human preference votes over generated spreadsheets from 124 user prompts and 17 models; generated `.xlsx` outputs are included. |
| AIDABench | AIDA | https://huggingface.co/datasets/MichaelYang-lyx/AIDA | Open viewer/download | 1,206 bilingual rows covering file generation, document-grounded QA, and visualization over XLSX, CSV, DOCX, PDF, databases, and reports. |
| OfficeBench | OfficeBench authors | https://github.com/zlwang-cs/OfficeBench | Open GitHub tasks | 300 office-automation tasks: 93 single-app, 95 two-app, and 112 three-app. Task JSON, testbed data, and reference files are checked in. |
| OfficeBench HF normalization | Community derivative | https://huggingface.co/datasets/tuandunghcmut/officebench-automation | Open viewer/download | Viewer-friendly 300-row normalization of OfficeBench task descriptions and evaluation metadata. |
| OdysseyBench | Microsoft | https://github.com/microsoft/OdysseyBench | Open GitHub tasks | 602 long-horizon office workflows: 300 OdysseyBench+ and 302 OdysseyBench-Neo tasks, with multi-day dialogue histories, task JSON, and testbed files. |
| DeskCraft | DeskCraft authors | https://github.com/mrwwk/DeskCraft | Open GitHub tasks | 538 executable desktop tasks—386 standard and 152 interactive—covering office, browser, development, media, and creative applications. Includes 279 assets and deterministic evaluators. |
| Workspace-Bench | OpenDataBox | https://huggingface.co/datasets/Workspace-Bench/Workspace-Bench | Open download | 388 tasks over 20,476 files, 74 file types, five worker profiles, dependency graphs, and 7,399 rubrics. |
| Workspace-Bench-Lite | OpenDataBox | https://huggingface.co/datasets/Workspace-Bench/Workspace-Bench-Lite | Open viewer/download | Public 100-task lower-cost subset retaining the workspace-role and file-dependency distribution. |
| WorkBench | MindsDB / WorkBench | https://github.com/olly-styles/WorkBench | Open GitHub data | 690 tasks across analytics, email, calendar, CRM, and project management. Sandbox databases, task/outcome CSVs, and evaluation results are included. |
| DELEGATE52 | Microsoft | https://huggingface.co/datasets/microsoft/delegate52 | Open viewer/download | 234 redistributable document-editing environments across 48 professional domains, containing 1,629 reversible edit pairs, seed documents, distractors, and provenance. |
| PPTArena | PPTArena authors | https://huggingface.co/datasets/mofengenden/PPTArena | Open files/download | 100 PowerPoint editing cases with source decks, human-authored target decks, instructions, and edit metadata. |
| DECKEDIT-BENCH | EditPPT | https://huggingface.co/datasets/EditPPT/DECKEDIT-BENCH | Open viewer/download | 183 instruction-guided PowerPoint edits over 28 real decks, with prompt taxonomy and deck metadata. |
| DECKBench artifacts | DECKBench authors | https://huggingface.co/datasets/mheisler/DeckBench | Open, partial artifacts | Starting HTML decks, slide images, and source papers for academic paper-to-slide and iterative editing. No ground-truth edit logs are released. |
| PresentBench | PresentBench | https://huggingface.co/datasets/PresentBench/PresentBench | Open viewer/download | 238 slide-generation tasks with background materials and an average of 54.1 binary checklist criteria per instance. |
| BizGenEval | Microsoft | https://huggingface.co/datasets/microsoft/BizGenEval | Open viewer/download | 400 professional visual-content prompts across slides, charts, webpages, posters, and scientific figures, with 8,000 human-verified checks. |
| Office Comprehension Benchmark | Microsoft | https://huggingface.co/datasets/microsoft/OfficeComprehensionBenchmark | Open, mixed hosted/URL files | 922 file-fidelity queries over 244 Office files and 120 domain questions over 124 files. All questions, answers, and rubrics are public; some source files are fetched through a URL manifest. |
| AgencyBench | GAIR | https://huggingface.co/datasets/GAIR/AgencyBench | Open viewer/download | 32 long-horizon scenarios comprising 138 tasks with queries, deliverables, rubrics, and evaluation scripts; scenarios average roughly 90 tool calls. |
| ProfBench | NVIDIA | https://huggingface.co/datasets/nvidia/ProfBench | Open viewer/download | 40 professional report tasks with over 3,000 rubric criteria across physics, chemistry, finance, and consulting. |
| GDPval | OpenAI | https://huggingface.co/datasets/openai/gdpval | Open viewer/download | 220 real-world knowledge-work tasks across 44 occupations, including prompts and supporting reference files. |
| JobBench | JobBench | https://huggingface.co/datasets/JobBench/job-bench | Open viewer/download | 65 full and 63 easier white-collar tasks across roughly 35 professions, with task cards, files, references, and weighted rubrics. |
| EconEvals | EconEvals | https://huggingface.co/datasets/EconEvals/EconEvals | Open viewer/download | 80,296 real and synthetic economically relevant prompts organized around O*NET occupations, tasks, and detailed work activities. |
| OpenEconIndex | University of Michigan | https://huggingface.co/datasets/umich-fatml/OpenEconIndex | Open viewer/download | 1.67 million public conversations mapped to O*NET occupational tasks; useful as a professional-task discovery and benchmark-construction corpus. |
| OccuBench | OccuBench authors | https://huggingface.co/datasets/gregH/OccuBench | Open viewer/download | 382 evaluation instances derived from 100 professional scenarios across 10 industries and 65 specialized domains, with language-world-model configurations. |
| SafePro | UCSC / UCSB / Cisco | https://huggingface.co/datasets/kzhou35/SafePro | Open files; viewer currently broken | 275 harmful or safety-critical professional tasks across nine sectors and 51 occupations. |
| Agents Last Exam metadata | Berkeley RDI | https://huggingface.co/datasets/agents-last-exam/agents-last-exam | Open viewer | 153 professional computer-use task cards with prompts, taxonomy, and input-file descriptors. |
| Agents Last Exam inputs | Berkeley RDI | https://huggingface.co/datasets/agents-last-exam/agents-last-exam-data | Open download | Input files supplied to agents for the public ALE tasks. Reference outputs are a separate gated release. |
| BankerToolBench | Handshake | https://huggingface.co/datasets/handshake-ai-research/bankertoolbench | Open viewer/download | 100 end-to-end investment-banking tasks with Excel/PDF inputs, multi-file deliverables, expert rubrics, and selected golden outputs. |
| π-Bench | Simplified Reasoning | https://github.com/Simplified-Reasoning/Pi-Bench | Open GitHub tasks | 100 multi-turn, persistent personal-assistant workflows across researcher, marketer, pharmacist, law trainee, and financier personas. |
| ClawMark | Evolvent AI | https://github.com/evolvent-ai/ClawMark | Open GitHub tasks | 100 multi-day coworker tasks across 13 professions, combining email, files, calendar, Notion, Sheets, multimodal inputs, and deterministic checkers. |
| STATE-Bench | Microsoft | https://github.com/microsoft/STATE-Bench | Open GitHub data | 450 stateful enterprise tasks across travel, support, and shopping. Includes 300 train trajectories and 150 held-out task definitions/environments. |
| EnterpriseOps-Gym | ServiceNow | https://huggingface.co/datasets/ServiceNow-AI/EnterpriseOps-Gym | Open viewer/download | Roughly 1.1K stateful enterprise tasks across calendar, email, drive, Teams, HR, CSM, ITSM, and hybrid workflows, with SQL verifiers and multiple tool-set configurations. |
| EntCollabBench | Kirito Lab | https://huggingface.co/datasets/Kirito-Lab/EntCollabBench | Open viewer/download | 300 enterprise collaboration tasks: 200 MCP-oriented and 100 approval-oriented, with seed services, policy documents, delegation, and approval workflows. |
| ERP-Bench | Agentic Labs | https://github.com/agentic-labs/erp-bench | Open GitHub tasks | 300 long-horizon Odoo 19 procurement and manufacturing tasks with seeded environments, oracle plans, and verifiers. |
| CRMArena | Salesforce | https://huggingface.co/datasets/Salesforce/CRMArena | Open viewer/download | 1,170 CRM query instances over 16 interconnected industrial objects, with task metadata, queries, and answers. |
| CRMArena-Pro | Salesforce | https://huggingface.co/datasets/Salesforce/CRMArenaPro | Open viewer/download | 8,560 query instances generated from 19 expert-validated CRM task types across sales, service, CPQ, B2B/B2C, multi-turn interaction, and confidentiality. |
| WorkArena / WorkArena++ | ServiceNow | https://github.com/ServiceNow/WorkArena | Open task generators; environment gated | WorkArena-L1 exposes 19,912 generated instances from 33 atomic tasks; WorkArena++ adds 682 compositional knowledge-work tasks. ServiceNow instances require approval. |
| SaaS-Bench | UniPat AI | https://github.com/UniPat-AI/SaaS-Bench | Open tasks; large environment downloads | 106 browser-driven business workflows across 23 self-hosted SaaS applications and six domains, with task-specific state verifiers. |
| SCUBA | Salesforce | https://github.com/SalesforceAIResearch/SCUBA | Open 300-task JSON; Salesforce org required | 300 CRM computer-use tasks across administrator, sales, and service personas. Both zero-shot and demonstration-augmented task files are checked in. |
| Business Utility Evaluation | deepsense.ai | https://github.com/deepsense-ai/business-utility-evaluation | Open GitHub samples | Five small synthetic business datasets: bottleneck employees, machinery malfunctions, marketplace activity, sales representatives, and supply chain. |
| Vectrix ART-E | TonicAI | https://huggingface.co/datasets/TonicAI/vectrix-art-e | Open viewer/download | Synthetic email-agent environment with 1,964 emails, 1,109 training tasks, 184 evaluation tasks, metadata, and a ready-to-query SQLite database. |
| Email Calendar Evaluation | Independent | https://github.com/shawn-d123/email-calendar-evaluation-pipeline | Open GitHub sample | 40 labeled email-action/calendar examples—20 synthetic and 20 Enron-derived—plus cleaned artifacts and outputs. |

## Partial, gated, or sample-only releases

| Dataset | URL | Status |
|---|---|---|
| FORTE | https://github.com/AGI-Eval-Official/FORTE | Full benchmark has 180 tasks across 15 professions, but only one complete demo task per profession—15 public demos—is released. |
| GDPVal Extended | https://gbox.ai/home/gdpval | Full 3,879-task corpus is not downloadable; the site exposes three end-to-end demo cases with prompts, files, criteria, and ideal deliverables. |
| AA-Briefcase-Lite | https://huggingface.co/datasets/ArtificialAnalysis/AA-Briefcase-Lite | One public week-long scenario and 63 checks; the four scored AA-Briefcase scenarios remain private. |
| DRA-Bench | https://huggingface.co/datasets/deccan-ai/dra-bench | Gated request-access release with 42 professional-services deep-research tasks, files, SME rubrics, verifiers, and reference responses. |
| KWBench | https://huggingface.co/datasets/clio-ai/kwbench | Gated 223-task knowledge-work release across 32 domains. |
| OfficeQA | https://huggingface.co/datasets/databricks/officeqa | Gated 246-question document-grounded benchmark over U.S. Treasury Bulletins; includes a 133-question Pro subset. |
| EnterpriseBench | https://huggingface.co/datasets/AST-FRI/EnterpriseBench | Gated simulated enterprise data and task definitions across HR, IT, customer relations, and business management. |
| Agents Last Exam references | https://huggingface.co/datasets/agents-last-exam/agents-last-exam-reference | Ground-truth outputs are manually gated; metadata and task inputs are open separately. |
| Workflow-GYM | https://workflow-gym.github.io/ | Excluded from usable inventory for now: project describes 300 professional GUI tasks, but the dataset is explicitly marked “Coming Soon.” |
| Vals Excel Modeling Benchmark | https://www.vals.ai/benchmarks/emb | Excluded from usable inventory: proprietary leaderboard with no public task subset found. |

## Adjacent training and trajectory datasets

- [Simia OfficeBench SFT-30k](https://huggingface.co/datasets/Simia-Agent/Simia-OfficeBench-SFT-30k): 29,587 synthetic OfficeBench tool-use trajectories.
- [OpenOfficeRL](https://github.com/bvsbharat/OpenOfficeRL): role-based office-agent environment with pre-generated expert trajectories under `office_os/training_data/`.
- [Spreadsheet-RL](https://huggingface.co/datasets/Spreadsheet-RL/Spreadsheet-RL): both evaluation data and RL training rows.
- [STATE-Bench](https://github.com/microsoft/STATE-Bench): 300 public training trajectories in addition to 150 test tasks.
- [ClawBenchPro community package](https://huggingface.co/datasets/ErenJaegerYeager/ClawBenchPro): 1,000 packaged workplace tasks with task-local builders and skills; community-derived rather than a canonical benchmark publisher release.

## CLAIMS

- The company-name-only method materially undercounted the ecosystem. An artifact-first search added dozens of canonical office, professional-work, spreadsheet, document, slide, CRM, ERP, email, and knowledge-work task packs.
- Public releases range from tiny inspection samples to complete reproducible environments; access status must be surfaced explicitly rather than treating every benchmark page as equivalent.
- Leaderboards without public task/sample artifacts were excluded. Gated, demo-only, mixed-license, and viewer-broken releases are labeled separately.
- The strongest site taxonomy for this axis is: `spreadsheet`, `document`, `presentation`, `cross-app office`, `professional/economic`, `email/calendar`, `CRM/ERP`, and `multi-day workplace`, with access badges for `open`, `gated`, `demo`, `mixed`, and `private`.

## EXPAND

- Merge/dedupe against the finance/legal worker’s results for BankerToolBench, DRA-Bench, Vals finance/legal datasets, and GDPval variants.
- Merge against the computer-use worker for DeskCraft, OfficeBench, OdysseyBench, WorkArena, SaaS-Bench, and SCUBA.
- Merge against the enterprise/MCP worker for EnterpriseOps-Gym, EntCollabBench, STATE-Bench, CRMArena, ERP-Bench, and MCPMark.
- New cross-axis leads discovered for follow-up: [AgencyBench](https://huggingface.co/datasets/GAIR/AgencyBench), [ProfBench](https://huggingface.co/datasets/nvidia/ProfBench), [BizGenEval](https://huggingface.co/datasets/microsoft/BizGenEval), [OpenEconIndex](https://huggingface.co/datasets/umich-fatml/OpenEconIndex), and [STATE-Bench](https://github.com/microsoft/STATE-Bench).
