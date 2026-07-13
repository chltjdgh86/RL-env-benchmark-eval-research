Exa breadth: 43 distinct searches across finance, banking, insurance, accounting, legal, compliance, diligence, and professional-agent terminology; 60+ retained primary data surfaces were fetched and checked. I excluded paper-only records and announcement pages without sample data.

### Finance, banking, accounting, and investment

| Dataset | Publisher | Canonical / data URL | Access | Description |
|---|---|---|---|---|
| BankerToolBench | Handshake AI Research | [HF dataset](https://huggingface.co/datasets/handshake-ai-research/bankertoolbench) | Open download | 100 end-to-end investment-banking agent tasks with input files, rubrics, reference deliverables, and SEC/VDR tool data. |
| Finance Agent Benchmark | Vals AI | [HF dataset](https://huggingface.co/datasets/vals-ai/finance_agent_benchmark) | Public sample | 50-row public release from a 537-question benchmark covering nine expert finance-research categories using SEC filings. |
| FrontierFinance | Samaya AI | [HF dataset](https://huggingface.co/datasets/samaya-ai/FrontierFinance) | Open download | 220 investor-workflow queries with 11,543 expert rubrics across modeling, research, screening, earnings, and monitoring. |
| BigFinanceBench public release | Rogo AI | [HF dataset](https://huggingface.co/datasets/RogoAI/big-finance-benchmark) | Public subset | 50-question stratified subset of a 928-item financial-research agent benchmark, including rubrics, traces, and grades. |
| FinanceBench sample | Patronus AI | [GitHub data](https://github.com/patronus-ai/financebench) | Public subset | 150 open annotated QA examples from a 10,231-question finance benchmark, with answers and evidence. |
| DiligenceBench | The LLM Data Company | [HF dataset](https://huggingface.co/datasets/tldc/diligence-bench) | Open download | 150 equity diligence tasks spanning cash-flow quality, capital adequacy, reserves, liquidity, and concentration risk. |
| FinRetrieval | Daloopa | [HF dataset](https://huggingface.co/datasets/daloopa/finretrieval) | Open download | 500 finance-retrieval questions plus 7,000 responses, scores, and tool traces across 14 configurations. |
| FinSearchComp | FinSearchComp team | [HF dataset](https://huggingface.co/datasets/Quinnnan/FinSearchComp) | Open download | 635 expert-annotated financial-search questions covering time-sensitive fetching and historical investigation. |
| FinAgent Benchmark | FinAgent Benchmark | [HF dataset](https://huggingface.co/datasets/finagent-benchmark/finagent-benchmark) | Open download | 133 verified SEC-grounded questions for vector RAG, agentic RAG, and multi-agent orchestration. |
| ProFinR | ProFinAgent team | [HF dataset](https://huggingface.co/datasets/huangchenglaile/ProFinR) | Open download | Multi-level finance-agent tasks with expected tools and reference execution results across investment-analysis domains. |
| Herculean | The FinAI | [HF dataset](https://huggingface.co/datasets/TheFinAI/Herculean) | Open download | Offline agent environment for trading, hedging, report work, and XBRL auditing, including DuckDB/Parquet market data and 158 filings. |
| PortBench Market | AgenticFinLab | [HF dataset](https://huggingface.co/datasets/AgenticFinLab/PortBench-Market) | Open download | Ten years of point-in-time data for 183 instruments across six asset classes, plus news, macro data, and correlations. |
| PortBench QA | AgenticFinLab | [HF dataset](https://huggingface.co/datasets/AgenticFinLab/PortBench-QA) | Open download | 6,269 portfolio-reasoning pairs covering prediction, VaR, sizing, allocation, rebalancing, and regime detection. |
| QuantitativeFinance-Bench | QF-Bench | [GitHub tasks](https://github.com/QF-Bench/QuantitativeFinance-Bench) | Open repository | Stateful Harbor tasks in which coding agents clean data, debug failures, and produce verified quantitative-finance outputs. |
| FinToolBench | FinToolBench team | [GitHub data](https://github.com/Double-wk/FinToolBench) | Open; external APIs | 295 tool-required finance questions and a manifest of 760 executable tools with timeliness, intent, and regulatory tags. |
| FinanceBenchmark | Microsoft | [GitHub data](https://github.com/microsoft/FinanceBenchmark) | Open; ERP lane needs Dynamics | Roughly 300 tasks for obligations research, company-performance research, and business briefs; includes \`data/dataset.yaml\`. |
| FundBench | ScaleFirst AI | [GitHub tasks](https://github.com/scalefirstai/FundBench) | Open repository | 50 agent tasks across fund accounting, reconciliation, corporate actions, operations, analytics, and regulatory reporting. |
| Finch / FinWorkBench | FinWorkBench | [HF dataset](https://huggingface.co/datasets/FinWorkBench/Finch) | Open download | 172 long-horizon finance/accounting workflows with 1,710 spreadsheets, supporting documents, and reference outputs. |
| SheetBench-50 | HUD | [HF dataset](https://huggingface.co/datasets/hud-evals/SheetBench-50) | Open download | 50 spreadsheet-agent tasks in data hygiene, derivation, forecasting, amortization, and financial modeling. |
| AIDABench | AIDA team | [HF dataset](https://huggingface.co/datasets/MichaelYang-lyx/AIDA) | Open download | 600+ end-to-end analytics tasks over spreadsheets, databases, reports, and operational files. |
| AuditBench | AuditBench team | [GitHub data](https://github.com/Oppugno-Rushi/AuditBench-Benchmarking-LLMs-for-Financial-Auditing) | Open repository | Financial-statement auditing data with 10,000 extracted tables, transactions, and injected accounting errors. |
| FinSM | The FinAI | [HF dataset](https://huggingface.co/datasets/TheFinAI/FinSM) | Open download | 330 financial semantic-matching instances from the FinAuditing benchmark. |
| FinRE | The FinAI | [HF dataset](https://huggingface.co/datasets/TheFinAI/FinRE) | Open download | 440 XBRL relationship-error classification instances from FinAuditing. |
| FinMR | The FinAI | [HF dataset](https://huggingface.co/datasets/TheFinAI/FinMR) | Open download | 332 XBRL mathematical-reasoning and reported-value verification instances. |
| Fin-RATE | GGLab Yale | [HF dataset](https://huggingface.co/datasets/GGLabYale/Fin-RATE) | Open download | 7,500 SEC-filing QA instances for detailed reasoning, cross-company comparison, and longitudinal tracking. |
| BizFinBench.v2 | HiThink Research | [GitHub data](https://github.com/HiThink-Research/BizFinBench.v2) | Open repository | 28,860 bilingual, real-query finance QA pairs supporting offline and live evaluation. |
| Agent Finance Reasoning | Snorkel AI | [HF viewer](https://huggingface.co/datasets/snorkelai/agent-finance-reasoning/viewer/default/train) | Open download | 357 released tool-use traces from 79 expert financial questions grounded in 10-K tables. |
| EDGAR-FinTrace | Independent release | [HF dataset](https://huggingface.co/datasets/rachpradhan/EDGAR-FinTrace) | Open download | Verified financial-agent episodes containing questions, SEC tool calls, observations, calculations, and grounded answers. |
| Agentar-DeepFinance-100K | Ant Group | [HF viewer](https://huggingface.co/datasets/antgroup/Agentar-DeepFinance-100K) | Open download | 99,068 finance reasoning conversations with bilingual and professional-domain coverage. |
| Artha Benchmark | Artha | [HF dataset](https://huggingface.co/datasets/Tej-Katika/artha-benchmark) | Open download | 136 personal-finance tasks over synthetic, BLS-calibrated banking and investment ledgers, including false-premise traps. |
| τ³ Banking Knowledge | Sierra Research | [GitHub environment](https://github.com/sierra-research/tau2-bench) | Open repository | Banking customer-service environment with roughly 700 policy documents, multi-step tools, backend-state scoring, and public tasks. |
| APEX-Agents | Mercor | [HF dataset](https://huggingface.co/datasets/mercor/apex-agents) | Gated download | 480 long-horizon tasks across investment banking, law, and consulting, including 33 worlds, files, rubrics, and gold outputs. |
| APEX-v1-extended | Mercor | [HF dataset](https://huggingface.co/datasets/mercor/APEX-v1-extended) | Open dev set | 100 open professional-work dev cases; the 400-case held-out evaluation set covers banking, consulting, law, and medicine. |
| PRBench | Scale AI | [HF dataset](https://huggingface.co/datasets/ScaleAI/PRBench) | Open download | 1,100 expert-authored finance/legal conversations with 18,692 rubric criteria and hard subsets. |

### Insurance

| Dataset | Publisher | Canonical / data URL | Access | Description |
|---|---|---|---|---|
| Multi-Turn Insurance Underwriting | Snorkel AI | [HF viewer](https://huggingface.co/datasets/snorkelai/Multi-Turn-Insurance-Underwriting/viewer/default/train) | Open sample | Expert-verified traces across six commercial-underwriting task types, with 10–20 turns and MCP-backed tools. |
| Insurance Underwriting Code-Gen | Snorkel AI | [HF viewer](https://huggingface.co/datasets/snorkelai/Multi-Turn-Insurance-Underwriting-Code-Gen/viewer/default/train) | Open sample | Underwriting variant where agents explore a filesystem and solve tasks using only a code interpreter. |
| Insurance AI Agent Reliability Benchmark | Pavel Sukhachev | [HF dataset](https://huggingface.co/datasets/pashas/insurance-ai-reliability-benchmark) | Open download | 510 workflow scenarios across claims, policy service, payments, escalation, recovery, and multi-turn handling. |
| INS-MMBench | FDU-INS | [HF dataset](https://huggingface.co/datasets/FDU-INS/INS-MMBench) | Open download | 12,052 images and 10,372 questions covering underwriting, monitoring, claims, liability, and health/property/agriculture scenarios. |

### Legal work and contract agents

| Dataset | Publisher | Canonical / data URL | Access | Description |
|---|---|---|---|---|
| Harvey Legal Agent Benchmark | Harvey | [GitHub tasks](https://github.com/harveyai/harvey-labs) | Open repository | Evolving collection of realistic legal-agent assignments with instructions, documents, rubrics, and an execution harness. |
| BigLaw Bench samples | Harvey | [GitHub samples](https://github.com/harveyai/biglaw-bench) | Public samples; full set by request | Core, workflow, and retrieval samples for transactional, litigation, SPA, contract, and discovery-email work. |
| LegalAgentBench | CSHaitao team | [GitHub data](https://github.com/CSHaitao/LegalAgentBench) | Open repository | 300 Chinese legal-agent tasks over 17 corpora and 37 tools, including intermediate-step annotations. |
| J1-Eval | Fudan DISC | [HF dataset](https://huggingface.co/datasets/CharlesBeaumont/J1-Eval_Dataset) | Gated research access | Multi-level interactive legal-agent cases across knowledge queries, litigation, drafting, consultation, and research environments. |
| Legal Research Agent Benchmark samples | Vals AI | [GitHub sample data](https://github.com/vals-ai/legal-research-bench) | Public questions; platform gated | Public \`data/public.json\` questions for tool-using research over statutes, regulations, case law, and CourtListener. |
| LawVal 2.0 | Percipient | [HF dataset](https://huggingface.co/datasets/percipient-co/LawVal2.0) | Open download | Attorney-authored professional deliverables including coverage and employment memos, document review, and contract redlining. |
| JudgmentBench | JudgmentBench team | [HF dataset](https://huggingface.co/datasets/judgmentbench/JudgmentBench) | Open download | 30 legal tasks with documents, 2,274 outputs, practicing-lawyer rubric scores, preferences, and autograder annotations. |
| RedlineBench | Crosby / micro1 | [HF dataset](https://huggingface.co/datasets/crosbylegal/RedlineBench) | Open download | 140 runnable Harbor tasks across three multi-turn SaaS and services contract negotiations, with Word redlines and attorney rubrics. |
| LegalBench | Stanford / Hazy Research | [HF dataset](https://huggingface.co/datasets/nguha/legalbench) | Open download | 162 legal-reasoning tasks spanning statutes, opinions, contracts, evidence, procedure, extraction, generation, and entailment. |
| LexRubric | LexRubric team | [HF dataset](https://huggingface.co/datasets/chenyifan0929/LexRubric) | Open, noncommercial license | 649 open-ended consultation and examination cases with 12,337 atomic legal-quality rubrics. |
| PLawBench | Skylenage AI | [GitHub data](https://github.com/skylenage/PLawbench) | Open repository | 280 released legal consultation, case-analysis, and document-drafting tasks with answers and scoring rubrics. |
| CLERC | Johns Hopkins CLSP | [HF dataset](https://huggingface.co/datasets/jhu-clsp/CLERC) | Open download | 105,699 rows for legal case retrieval and retrieval-augmented analysis generation; includes collection and generation splits. |
| ACORD | Atticus Project | [GitHub data](https://github.com/TheAtticusProject/acord) | Open repository | 114 attorney-written contract-drafting queries and 126,662 lawyer-rated query–clause pairs. |
| LEXam | LEXam team | [HF dataset](https://huggingface.co/datasets/LEXam-Benchmark/LEXam) | Open download | Legal-reasoning evaluation built from 340 Swiss, EU, and international law examinations. |

### Compliance, governance, and financial-agent safety

| Dataset | Publisher | Canonical / data URL | Access | Description |
|---|---|---|---|---|
| FinVault | AI FinLab | [GitHub data](https://github.com/aifinlab/FinVault) | Open repository | 31 executable finance-safety sandboxes with 107 attacks, 107 benign requests, and 856 synthesized attacks across six domains. |
| FinProof | Zytra | [HF dataset](https://huggingface.co/datasets/Zytra/finproof-bench) | Open public tiers | BFSI guardrail benchmark with 1,606 public attacks and 140 benign calibration examples across seven attack categories. |
| FinSafeGuard Ultra-Mini | Domyn | [HF dataset](https://huggingface.co/datasets/domyn/FinSafeGuard) | Open, noncommercial license | 709,303 safety-annotated BFSI conversations across 20 banking, financial-services, and insurance risk categories. |
| ACE: Assessing Compliance in Enterprise | Fujitsu Research | [GitHub data](https://github.com/FujitsuResearch/Fujitsu-Assessing-Compliance-in-Enterprise-Dataset) | Open repository | 4,700 multi-clause compliance scenarios from 633 enterprise contracts and 26 agreement types. |
| ComplianceMAS-Bench | ComplianceMAS team | [HF dataset](https://huggingface.co/datasets/compliancemas/ComplianceMAS-Bench) | Open download | 269 multi-agent-memory compliance scenarios across HIPAA/GDPR failure modes and four regulated domains. |
| ComplianceBench | ComplianceBench team | [HF dataset](https://huggingface.co/datasets/laugustyniak/ComplianceBench) | Open download | 266 bilingual scenarios across the EU AI Act, GDPR, DORA, and financial-services obligations. |
| OmniCompliance-100K | HKUST | [HF dataset](https://huggingface.co/datasets/hubin/OmniCompliance100K) | Open download | 77,016 released rule–case records covering laws, regulations, platform policies, and compliance outcomes. |
| GOVBENCH | GOVBENCH authors | [HF dataset](https://huggingface.co/datasets/kmaamari/GOVBENCH) | Gated download | 479 enterprise-governance task templates across eight domains and named frameworks such as SOX, GDPR, FCRA, and NIST. |
| RegulatoryAgentBench | Carver Agents | [GitHub samples](https://github.com/carveragents/RegulatoryAgentBench) | Public sample | 50 real regulatory-update artifacts and executable scenarios drawn from a larger private intelligence corpus. |
| MANTRA | MANTRA team | [HF dataset](https://huggingface.co/datasets/mantra-anon/MANTRA) | Open download | 285 self-contained, deterministic tool-compliance cases across six environments, each with policies, tools, state, and trace checks. |
| EU-Agent-Bench preview | EU-Agent-Bench team | [GitHub data](https://github.com/ilijalichkovski/eu-agent-bench) | Public preview | Human-curated tool-action scenarios testing compliance with EU data-protection, discrimination, and research-integrity law. |
| Policy Violation Benchmark | CUGA team | [HF dataset](https://huggingface.co/datasets/policy-violation-benchmark/policy-violation-benchmark) | Open download | 400 violating and 63 clean multi-agent execution traces across 11 policy-violation types and five agents. |

## CLAIMS

- The company-first pass materially undercounted the ecosystem; domain-first searches produced dozens of additional primary data surfaces.
- The strongest new agent-environment datasets are BankerToolBench, Finch, QF-Bench, FinToolBench, Microsoft FinanceBenchmark, FinVault, MANTRA, RedlineBench, Harvey LAB, LegalAgentBench, and RegulatoryAgentBench.
- Several benchmark names hide multiple independently useful datasets: PortBench has Market and QA releases; FinAuditing has FinSM, FinRE, and FinMR; Snorkel insurance has MCP-tool and code-interpreter variants.
- Access must be modeled separately from availability: APEX-Agents, J1-Eval, and GOVBENCH are gated; Vals Finance, BigFinanceBench, FinanceBench, BigLaw Bench, and RegulatoryAgentBench expose only public subsets or samples.
- InsureBench and several recent papers were excluded because they currently expose announcements or papers but no inspectable dataset/sample surface.

## EXPAND

- Cross-axis deduplication: APEX, PRBench, SheetBench, and τ³ may also appear in workplace, spreadsheet, customer-service, or general-tool-agent sweeps.
- Companion leads worth merging from other workers: FinanceQA/AppBench-style environments, MCP finance traces, general spreadsheet benchmarks, professional-work rubrics, and customer-support banking tasks.
- Recheck after August 2026: InsureBench says it is launching then and may become eligible once task samples or downloads appear.
