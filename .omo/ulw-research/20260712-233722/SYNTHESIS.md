# Agent benchmark and environment dataset ecosystem

Research date: 2026-07-12

## Outcome

The original company-name-first pass was materially incomplete. The expanded search used benchmark-first, environment-first, artifact-first, publisher-organization, directory, and skeptical counter-search strategies.

- 872+ materially distinct Exa queries across the root sweep and 16 independent research axes.
- 1,132 unique source URLs captured in the evidence reports.
- 634 distinct Hugging Face dataset identifiers referenced before rejection and cross-host deduplication.
- 344 distinct GitHub repository identifiers referenced before rejection and cross-host deduplication.
- 132 site-listed companies rechecked; at least 50 expose attributable dataset, benchmark, trajectory, sample-gallery, or catalog surfaces.

These are evidence-surface counts, not the final site row count. The final registry must collapse aliases and mirrors, group multi-surface benchmark families, and exclude paper-only or promised-but-unreleased data.

## Required seeds

- Mercor APEX-Agents: https://www.mercor.com/apex/apex-agents-leaderboard/ and https://huggingface.co/datasets/mercor/apex-agents
- OpenAI GDPval: https://huggingface.co/datasets/openai/gdpval/viewer/default/train
- Aviro C4 Samples: https://www.aviro.ai/benchmarks/c4/samples

## Registry model recommended for the site

Each retained family should have:

- name and publisher
- concise description
- environment/domain families
- artifact type: tasks, environment, inputs, references, trajectories, results, training, viewer/sample, or commercial catalog
- access: open, gated, public subset, sample/demo, commercial, credential-dependent, rolling, or provisional
- provenance: first-party, official companion, community derivative, mirror, or anonymous research release
- canonical benchmark URL plus one or more data-surface URLs
- version/supersession note
- verified date and count caveat where source pages disagree

Companion surfaces should be nested under one benchmark family instead of inflating the top-level benchmark count. Examples include ClawBench tasks plus V1/V2 traces; Agents Last Exam metadata, inputs, and gated references; FDABench Lite, Full, and File; WebLINX processed, raw, and BrowserGym data; Terminal-Bench tasks plus derived trajectories; and the OSWorld version/trajectory family.

## Recommended information architecture

1. Computer use and GUI: desktop, mobile, OS, grounding, verifiers, trajectories.
2. Browser and web: cloned sites, live web, search/research, offline demonstrations, web RL.
3. MCP and tool use: MCP-native tasks, function calling, APIs, stateful tools, enterprise tools.
4. Coding and terminal: SWE tasks, terminal sandboxes, DevOps/SRE, ML engineering, trajectories.
5. Office and professional work: spreadsheets, documents, slides, email/calendar, knowledge work.
6. Enterprise and customer service: CRM/ERP, travel, support, retail, voice, SOPs.
7. Finance, legal, insurance, compliance: professional deliverables, analysis, regulated workflows.
8. Science, data, and research: data agents, SQL, notebooks, deep research, scientific discovery.
9. Safety and cybersecurity: harmful action, injection, cyber ranges, monitoring, deception/control.
10. Multi-agent, memory, planning, and games: collaboration, negotiation, social simulation, memory, MARL.
11. Robotics and physical AI: manipulation, navigation, egocentric, driving, VLA data.
12. General agent suites and trajectories: broad task packs, multi-domain environments, task/trace aggregations.
13. Company sample catalogs: commercial previews and company-native collections not already represented above.

## Access and quality rules

- Prefer publisher-owned repositories and dataset pages over mirrors.
- Preserve historical releases only when their data remain analytically useful; label them superseded.
- Do not call gated or credential-dependent data an open download.
- Do not call a task card a full dataset when inputs or references live in separate releases.
- Do not count leaderboards or result-only archives as task datasets.
- Keep public samples of private corpora, but label the exposed scope exactly.
- Keep commercial sample viewers only when sample content or structured metadata is actually inspectable.
- Exclude paper-only, announcement-only, broken, and unverifiable releases from the default catalog; retain them in a monitoring ledger.

## Evidence reports

- [Benchmark directories](workers/benchmark_directories.md)
- [Browser and web agents](workers/browser_web_agents.md)
- [Coding and terminal](workers/coding_terminal.md)
- [Company collections](workers/company_collections.md)
- [Computer use and mobile](workers/computer_use_mobile.md)
- [Enterprise and customer service](workers/enterprise_customer.md)
- [Finance and legal](workers/finance_legal.md)
- [General agent datasets](workers/general_agent_datasets.md)
- [MCP and tool agents](workers/mcp_tool_agents.md)
- [Multi-agent, memory, planning, and games](workers/multiagent_memory.md)
- [Office and professional work](workers/office_professional.md)
- [Robotics and physical AI](workers/robotics_physical.md)
- [Safety and monitoring](workers/safety_monitoring.md)
- [Science, data, and research](workers/science_data_research.md)
- [Skeptical deduplication and access audit](workers/skeptic_dedup_access.md)
- [Trajectory and RL data](workers/trajectory_rl_data.md)

## High-confidence expansion examples beyond the three seeds

- Computer use: OSWorld/OSWorld 2.0, AgentNet, ScaleCUA-Data, CUA-Gym, MobileWorld, Android in the Wild, WindowsAgentArena, macOSWorld, DeskCraft, GUI-360.
- Browser: WebArena-Verified, WebArena-Infinity, WebTailBench, ClawBench and trace companions, WebLINX, Mind2Web variants, WebChain, MolmoWeb, WebWorldData, TimeWarp, WebForge.
- Tools/MCP: MCP-Atlas, MCPMark Verified, Toolathlon-Verified and trajectories, MCP-Universe, LiveMCPBench, BFCL, ToolBench/StableToolBench, ToolSandbox, VAKRA, EnterpriseOps-Gym.
- Coding/terminal: SWE-bench family, SWE-rebench V2, SWE-smith language releases, SWE-Gym, R2E-Gym, Terminal-Bench, TerminalWorld, DevOps-Gym, ITBench, Nemotron Terminal and SWE trajectories.
- Professional work: SpreadsheetBench, Spreadsheet-RL, Finch, Workspace-Bench, WorkBench, OfficeBench, OdysseyBench, Agents Last Exam, FORTE demos, BankerToolBench.
- Enterprise/customer: ResolveBench, STATE-Bench, EVA-Bench, CRMArena-Pro, WorkArena, SCUBA, SaaS-Bench, ERP-Bench, tau-family data, SOPBench variants.
- Finance/legal: FrontierFinance, BigFinanceBench sample, FinanceBench sample, DiligenceBench, FinToolBench, PortBench, Harvey legal tasks, RedlineBench, LawVal 2.0, MANTRA, FinVault.
- Science/data: DataClawBench, CoDA-Bench, FDABench, DABstep, AIDABench, DeepSearchQA, DRBench, DeepResearch-9K, ScholarGym, SciAgentGym, PaperBench.
- Safety/cyber: AgentHarm, Agent-SafetyBench, AgentDojo, CUAHarm, OS-Harm, RTC-Bench, CyberGym, SEC-bench, ControlArena, MRT, ATBench, R-Judge.
- Multi-agent/memory: CooperBench, Collaborative Gym trajectories, AgentCollabBench, C2C game logs, SOTOPIA family, LongMemEval V2, WorldMemArena, AgentWorldBench, OG-MARL.
- Robotics: DROID, Open X-Embodiment, AgiBot World, RoboMIND, NVIDIA Kitchen Demos, VLABench, RoboCasa365, LIBERO, Habitat episodes, ALFRED, Waymo, nuPlan, Bench2Drive.
- Broad trajectories: AgentTrove, TaskTrove, Toucan-1.5M, Nemotron Agentic/SWE/Terminal families, OpenResearcher trajectories, WebWorldData, AgentRewardBench, CodeTraceBench.

## Residual limits

No open-web inventory can prove mathematical completeness. New datasets appear continuously, some cards change access or row counts, commercial catalogs are only partially indexable, and some benchmark data are distributed after manual approval. This sweep therefore records the verification date and monitoring leads rather than claiming timeless completeness.
