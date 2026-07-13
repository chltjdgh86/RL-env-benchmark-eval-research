# Trajectory / RL Data Research

Completed 45 distinct Exa searches plus canonical-page verification. This axis surfaced 70+ relevant data artifacts; the strongest, deduplicated set is below.

### General agent trajectories, tasks, and tool-use corpora

| Dataset | Benchmark/environment supported | Data form / scale | Access |
|---|---|---|---|
| [OpenThoughts AgentTrove](https://huggingface.co/datasets/open-thoughts/AgentTrove) | Harbor/Terminus-2; code repair, terminal, math, computer use | 1,696,847 complete trajectories from 219 source datasets, with tool outputs and rewards | Open |
| [OpenThoughts TaskTrove](https://huggingface.co/datasets/open-thoughts/TaskTrove) | Harbor RL/SFT task environments | 17,191 executable task bundles; instructions, environments, optional verifiers | Open |
| [Neulab Agent Data Collection](https://huggingface.co/datasets/neulab/agent-data-collection) | ALFWorld, WebShop, Mind2Web, SWE, knowledge-base and household agents | Multi-source raw, standardized ADP, OpenHands, SWE-agent, and AgentLab formats | Open |
| [Trace Commons Agent Traces](https://huggingface.co/datasets/trace-commons/agent-traces) | Codex, Claude Code, Cursor, pi, OpenCode coding agents | Donated, anonymized real sessions with prompts, tools, messages, and command output | Open; CC-BY-4.0 |
| [ISETrace](https://huggingface.co/datasets/valiere/ISETrace) | OS/terminal, file, automation, web-extraction, memory agents | 23,132 execution-grounded trajectories plus 43,955 structured intents | Open; CC-BY-4.0 |
| [AgentInstruct](https://huggingface.co/datasets/zai-org/AgentInstruct) | ALFWorld, WebShop, Mind2Web, KG, OS, database | 1,866 reward-filtered ReAct trajectories | Open |
| [OpenManus-RL](https://huggingface.co/datasets/CharlieDreemur/OpenManus-RL) | OS, DB, web, KG, household, ecommerce | 48,927 reformatted Agent-FLAN and AgentTraj-L interactions | Open; mixed upstream terms |
| [NVIDIA Nemotron-Agentic-v1](https://huggingface.co/datasets/nvidia/Nemotron-Agentic-v1) | Conversational and general tool-use agents | 335,122 synthetic multi-turn trajectories | Open; CC-BY-4.0 |
| [NVIDIA Nemotron-SFT-Agentic-v2](https://huggingface.co/datasets/nvidia/Nemotron-SFT-Agentic-v2) | Tool calling, search, customer service across 838 domains | 991,900 trajectories | Open; CC-BY-4.0 |
| [Toucan-1.5M](https://huggingface.co/datasets/Agent-Ark/Toucan-1.5M) | MCP-Universe, BFCL, multi-server tool use | 1,646,546 real-execution synthetic trajectories from 495 MCP servers and 2,000+ tools | Open; Apache-2.0 |
| [Toolathlon Trajectories](https://huggingface.co/datasets/hkust-nlp/Toolathlon-Trajectories) | Long-horizon MCP/local-tool execution | Messages, tool calls, results, task metadata, and execution outcomes | Open; CC-BY-4.0 |
| [TRAJECT-Bench](https://huggingface.co/datasets/bigboss24/TRAJECT-Bench) | Parallel/sequential tool use across ten practical domains | 4,000 parallel simple/hard cases with tool schemas and reference trajectories | Open |
| [SynthTools Tasks](https://huggingface.co/datasets/namkoong-lab/SynthTools-Tasks) | Synthetic, executable tool environments | 79,925 tasks with tools, ground-truth calls, initial state, and verifiable final state | Open |
| [OpenThoughts Agent v1 SFT](https://huggingface.co/datasets/open-thoughts/OpenThoughts-Agent-v1-SFT) | Terminal-Bench and SWE-style training | 15,209 full nl2bash/InferredBugs teacher traces | Open |
| [OpenThoughts Agent v1 RL](https://huggingface.co/datasets/open-thoughts/OpenThoughts-Agent-v1-RL) | Verifier-backed terminal RL | 728 instruction + Docker environment + pytest-verifier tasks | Open |
| [OpenThoughts Agent RL-5K](https://huggingface.co/datasets/open-thoughts/OpenThoughts-Agent-RL-5K) | On-policy software-agent RL | 5,000 executable `pymethods2test` tasks with oracle test rewards | Open |
| [AgentGym-RL Data](https://huggingface.co/datasets/AgentGym/AgentGym-RL-Data-ID) | WebArena, deep search, TextCraft, BabyAI, SciWorld | RL task data for long-horizon interactive training | Open; CC-BY-NC-4.0 |
| [Open Agent Traces](https://huggingface.co/datasets/juliensimon/open-agent-traces) | Enterprise multi-agent workflow evaluation | 17,019 events across 500 synthetic runs, ten domains, three orchestration patterns | Open |
| [AgentTrace](https://huggingface.co/datasets/pagarsky/agent-trace) | MBPP and NL2Bash/InterCode terminal agents | 1,400 traces with tool I/O, timing, CPU, memory, disk, and replay metadata | Open; Apache-2.0 |
| [MCP Agent Trajectory Benchmark](https://huggingface.co/datasets/obaydata/mcp-agent-trajectory-benchmark) | Finance, health, HR, logistics, marketing, support MCP agents | 49 ATIF/OpenClaw trajectories plus complete MCP server implementations | Open |

### Coding, terminal, and executable software environments

| Dataset | Benchmark/environment supported | Data form / scale | Access |
|---|---|---|---|
| [NVIDIA Nemotron Terminal Corpus](https://huggingface.co/datasets/nvidia/Nemotron-Terminal-Corpus) | Terminal-Bench 2.0 | 366,154 execution trajectories from adapted and synthetic terminal tasks | Open |
| [NVIDIA Open-SWE-Traces](https://huggingface.co/datasets/nvidia/Open-SWE-Traces) | SWE-rebench-V2 / SWE-Bench-style | 207,489 OpenHands and SWE-agent trajectories with patches and resolution labels | Open; CC-BY-4.0 |
| [NVIDIA Nemotron-SWE-v1](https://huggingface.co/datasets/nvidia/Nemotron-SWE-v1) | SWE-Gym and R2E-Gym | Approximately 51K OpenHands trajectories | Open; CC-BY-4.0 |
| [NVIDIA Nemotron-SFT-SWE-v2](https://huggingface.co/datasets/nvidia/Nemotron-SFT-SWE-v2) | SWE-Bench-style agent and agentless repair | 46,278 agent trajectories plus 209,976 localization/repair/test examples | Open; CC-BY-4.0 |
| [NVIDIA Nemotron-SFT-SWE-v3](https://huggingface.co/datasets/nvidia/Nemotron-SFT-SWE-v3) | OpenHands, SWE-agent, mini-SWE-agent | 237,970 trajectories | Open; CC-BY-4.0 |
| [NVIDIA SWE-Zero](https://huggingface.co/datasets/nvidia/SWE-Zero-openhands-trajectories) | SWE-Gym, R2E-Gym, SWE-rebench | 318,115 execution-free OpenHands trajectories | Open; CC-BY-4.0 |
| [NVIDIA SWE-Hero](https://huggingface.co/datasets/nvidia/SWE-Hero-openhands-trajectories) | Executed SWE-Bench-style training | 34,269 execution-based OpenHands trajectories | Open; CC-BY-4.0 |
| [SWE-ZERO-12M](https://huggingface.co/datasets/AlienKevin/SWE-ZERO-12M-trajectories) | SWE-rebench-V2 PR tasks | 12,290,800 execution-free rollouts across 122,908 PRs | Open; CC-BY-4.0 |
| [Nebius SWE Agent Trajectories](https://huggingface.co/datasets/nebius/SWE-agent-trajectories) | SWE-bench-extra | 80,036 trajectories with patches, test logs, and resolved labels | Open; CC-BY-4.0 |
| [Nebius SWE-rebench OpenHands Trajectories](https://huggingface.co/datasets/nebius/SWE-rebench-openhands-trajectories) | SWE-rebench | 67,074 OpenHands trajectories; successful and unsuccessful runs | Open |
| [SWE-smith Trajectories](https://huggingface.co/datasets/SWE-bench/SWE-smith-trajectories) | SWE-smith / SWE-agent | 5,017 complete teacher trajectories; Hub representation contains 76,002 rows | Open |
| [SWE-Gym OpenHands Sampled Trajectories](https://huggingface.co/datasets/SWE-Gym/OpenHands-Sampled-Trajectories) | SWE-Gym | 6,055 sampled OpenHands traces | Open |
| [R2E-Gym SFT Trajectories](https://huggingface.co/datasets/R2E-Gym/R2EGym-SFT-Trajectories) | R2E-Gym executable repositories | 3,231 multi-turn coding-agent trajectories | Open |
| [Terminal-Bench 2.0 Trajectories](https://huggingface.co/datasets/yoonholee/terminalbench-trajectories) | Terminal-Bench 2.0 | 52,104 public leaderboard trials across 89 tasks and 109 agent/model combinations | Open; Apache-2.0 |
| [SWE-Gym Verifier Trajectories](https://huggingface.co/datasets/SWE-Gym/OpenHands-Verifier-Trajectories) | SWE-Gym verifier/rejection sampling | 5,272 OpenHands verifier traces | Open |
| [Multi-SWE-RL-Verified](https://huggingface.co/datasets/PrimeIntellect/Multi-SWE-RL-Verified) | Multilingual executable SWE RL | 2,232 twice-validated tasks across C, Go, Java, JS, Rust, and TypeScript | Open |
| [Paper2Env Trajectories](https://huggingface.co/datasets/thibble/paper2env-trajectories) | Paper2Env/PaperBench reproduction tasks | 9,973 coding-agent rollouts with tools, observations, rewards, and verifier output | Open |
| [OpenThoughts TBLite](https://huggingface.co/datasets/NousResearch/openthoughts-tblite) | Terminal-Bench 2.0 difficulty-calibrated subset | 100 executable tasks with Docker environments and tests | Open |
| [RLVR Bash Terminal-Bench](https://huggingface.co/datasets/lisayan/rlvr-bash-terminal-bench) | Terminal-Bench bash RLVR | 1,120 verified candidate scripts across 88 tasks with partial rewards | Open |
| [Microsoft Orchard](https://huggingface.co/datasets/microsoft/Orchard) | SWE-rebench, Scale-SWE, WebVoyager-style GUI | Intended release: 107,185 SWE trajectories plus 3,070 GUI rollout steps | Temporarily paused/on hold |
| [MLE Trajectory Dataset v1](https://huggingface.co/datasets/jerryyan/mle-traj-v1) | Kaggle machine-learning engineering | 622 human/agent trajectories and 14,944 annotated version transitions | Gated |

### Browser, GUI, deep-research, and world-model trajectories

| Dataset | Benchmark/environment supported | Data form / scale | Access |
|---|---|---|---|
| [MolmoWeb Human Trajectories](https://huggingface.co/datasets/allenai/MolmoWeb-HumanTrajs) | Open-web visual browser agents | 35,981 human trajectories with screenshots, clicks, typing, scrolling, and browser state | Open; ODC-BY-1.0 |
| [WebArena-Infinity Trajectories](https://huggingface.co/datasets/webarena-x/webarena-infinity-trajectories) | 13 generated Gmail/GitLab/PayPal/Xero/etc. environments | 2,329 successful trajectories with screenshots, reasoning, actions, and verifier messages | Open |
| [OpenWebRL SFT Trajectories](https://huggingface.co/datasets/OpenWebRL/OpenWebRL-SFT-Trajectories) | PAE-WebVoyager / live-web RL initialization | 3,085 rewarded turn examples from 412 successful browser tasks | Open |
| [OpenWebRL RL Tasks](https://huggingface.co/datasets/OpenWebRL/OpenWebRL-RL-Tasks) | Live-web on-policy RL | 2,198 prompts with URLs, difficulty, domain, and evaluator references | Open; tasks rather than stored rollouts |
| [Qwen WebWorldData](https://huggingface.co/datasets/Qwen/WebWorldData) | Browser world-model training | Card reports 1.06M state-action-next-state web trajectories from 680K+ URLs | Open; Apache-2.0 |
| [Patronus World Model Corpus](https://huggingface.co/datasets/PatronusAI/world_model_corpus) | Tau2Bench, SWE-Smith, OpenResearcher, BFCL, WebShop, Toolathlon, Pandora, CoderForge | 239,403 train + 19,454 validation + 20,847 test grounded trajectories | Open; MIT |
| [AgentSynth](https://huggingface.co/datasets/sunblaze-ucb/AgentSynth) | Generalist computer-use task generation | Tasks plus screenshots, thoughts, and commands; card claims 6K+ generated tasks, Hub exposes 1,210 rows | Open |
| [WebChain](https://huggingface.co/datasets/webagentlab/WebChain) | Real-web GUI planning and grounding | 31,725 human-verified trajectories, 317,993 steps, 428 domains | Gated; academic approval |
| [AgentNet](https://huggingface.co/datasets/xlangai/AgentNet) | Windows, macOS, Ubuntu desktop use | 22.6K human-annotated cross-platform tasks with screenshots, PyAutoGUI actions, CoT, and quality labels | Open; MIT |
| [ClawBench V1 Traces](https://huggingface.co/datasets/NAIL-Group/ClawBenchV1Trace) | 153 everyday online tasks | Thousands of full runs with video, HTTP traffic, actions, reasoning, and intercepted requests | Open raw files; Apache-2.0 |
| [ClawBench V2 Traces](https://huggingface.co/datasets/NAIL-Group/ClawBenchV2Trace) | Updated 130-task online benchmark | 806+ full multimodal execution traces at the verified snapshot | Open raw files; Apache-2.0 |
| [MiroVerse v0.1](https://huggingface.co/datasets/miromind-ai/MiroVerse-v0.1) | Deep research, web navigation, multi-hop QA, science | 147,985 full successful trajectories, 1.99B tokens, 602K tool interactions | Gated; mixed licenses, trace data CC-BY-NC-4.0 |
| [OpenResearcher Dataset](https://huggingface.co/datasets/OpenResearcher/OpenResearcher-Dataset) | BrowseComp, GAIA, WebWalkerQA, xbench-DeepSearch | 97,630 long-horizon browser/search trajectories, commonly 100+ turns | Open |
| [OpenResearcher Eval Logs](https://huggingface.co/datasets/OpenResearcher/OpenResearcher-Eval-Logs) | BrowseComp-Plus, BrowseComp, GAIA, xbench | Complete evaluation trajectories and scored summaries | Open raw logs |
| [DR Tulu SFT Data](https://huggingface.co/datasets/rl-research/dr-tulu-sft-data) | OpenScholar, Search Arena, WebWalker, TaskCraft, PopQA, TyDiQA | 13,062 full research trajectories with reasoning, searches, and cited answers | Open; ODC-BY |
| [IPF DeepResearch-traj](https://huggingface.co/datasets/IPF/DeepResearch-traj) | OpenResearcher-derived pass@k evaluation | 97,630 trajectories over 6,102 questions and 16 seeds, with correctness/pass-rate labels | Open; MIT |
| [SearchSwarm SFT](https://huggingface.co/datasets/SearchSwarm/SearchSwarm-SFT) | Delegating deep-research agents | 6,732 main-agent bundles plus their subagent conversations | Open |
| [AutoWorldModelBench](https://huggingface.co/datasets/AutoWorldModel/AutoWorldModelBench) | Action-conditioned game world models | 152,000 episodes and 158M frames across eight games | Open |
| [ARC-AGI-3 World Model Traces](https://huggingface.co/datasets/fredericowieser/arc-agi-3-wm-traces) | ARC-AGI-3 environment transition modeling | 14,619,505 state/action/next-state transitions | Open; mixed upstream terms |
| [Datoric Computer-Use Traces Sample](https://huggingface.co/datasets/Datoric/computer-use-agent-traces-250k) | Browser, SaaS, office, ecommerce, research workflows | Public schema and generated sample metadata; production set is 250K traces/15K hours | Gated sample; full data commercially licensed |

### Reward-model, verifier, and preference data

| Dataset | Benchmark/environment supported | Data form / scale | Access |
|---|---|---|---|
| [AgentRewardBench](https://huggingface.co/datasets/McGill-NLP/agent-reward-bench) | AssistantBench, WebArena, VisualWebArena, WorkArena | 1,408 trajectories, screenshots, and judge outputs for outcome/reward evaluation | Open; 38.4 GB |
| [AgentProcessBench](https://huggingface.co/datasets/LulaCola/AgentProcessBench) | BFCL, GAIA, HotpotQA, Tau2 | 1,000 full trajectories with step-wise process labels | Open |
| [WebPRMBench](https://huggingface.co/datasets/ZYao720/WEBPRMBENCH) | Mind2Web, WebArena, AssistantBench, WorkArena | 4,600 action-preference pairs over 1,150 web states | Open; MIT |
| [Plan-RewardBench](https://huggingface.co/datasets/wyy1112/Plan-RewardBench) | Tool planning, recovery, safety refusal, irrelevant tools | 1,171 chosen/rejected trajectory pairs | Open; CC-BY-4.0 |
| [ToolPref-Pairwise-30K](https://huggingface.co/datasets/RioLee/ToolPref-Pairwise-30K) | ToolRM / BFCL-oriented reward modeling | 30K underlying preference annotations, published in several formats totaling 89,500 rows | Open; CC-BY-NC-SA-4.0 |
| [Reagent-RL-709K](https://huggingface.co/datasets/bunny127/Reagent-RL-709K) | GAIA, WebWalkerQA and agent reasoning rewards | Reasoning trace, critique, and score signals; Hub currently reports 5,600 rows despite the title | Open; Apache-2.0 |
| [Data-Agent RL Train](https://huggingface.co/datasets/AdithyaSK/data_agent_rl_environment_train) | Kaggle-backed bash/data-analysis agents | 2,238 Harbor tasks with Docker environments, gold answers, and tested reward functions | Open |
| [Data-Agent RL Eval](https://huggingface.co/datasets/AdithyaSK/data_agent_rl_environment_eval) | Held-out data-agent evaluation | 366 verifier-backed tasks with broader recovery/verification paths | Open |
| [Data-Agent Multi-Reward](https://huggingface.co/datasets/AdithyaSK/data_agent_rl_environment_train_multireward) | GRPO-style data-agent RL | Same 2,238 tasks with correctness, submission, and tool-efficiency rewards | Open |
| [ARPO DeepSearch-1K](https://huggingface.co/datasets/dongguanting/ARPO-RL-DeepSearch-1K) | SimpleDeepSearch, WebDancer, GAIA, HLE | 1,071 released rows for multi-turn agentic RL/search | Open |

Important deduplication and access findings:

- `gijl/AgentTrove`, `mvpe/AgentTrove`, and similar uploads are mirrors; `open-thoughts/AgentTrove` is canonical.
- `chilomax/SWE-rebench-openhands-trajectories` points consumers to the Nebius dataset; I used the Nebius canonical URL.
- `shlo09/OpenResearcher-Dataset` is a gated mirror. The current canonical `OpenResearcher/OpenResearcher-Dataset` is open.
- `benchflow/data_agent_rl_environment_train` is a format conversion of the AdithyaSK source, not new task content.
- `IPF/DeepResearch-traj` is a labeled multi-seed derivative of OpenResearcher, so it is useful but should not be counted as wholly independent prompts.
- Orchard is described but currently unavailable.
- ToolPRMBench has an official repository and paper, but its repository still says code/data release is forthcoming; I excluded it from the available-data table.
- AgentBank has 53,205 rows but an empty dataset card, so its content cannot be described reliably enough for the site without inspecting samples separately.
- Several cards have scale discrepancies—AgentSynth, Nemotron-SWE-v1, SWE-smith, and Reagent—so the site should preserve the qualified wording above rather than silently choosing one number.

## CLAIMS

- CLAIM: The ecosystem contains many dozens of public agent dataset artifacts beyond Mercor APEX, GDPval, and Aviro C4 — RISK: normal — SOURCES: huggingface.co, github.com — COUNTER: mirrors and format conversions were explicitly searched and removed — PRIMARY: first-party dataset cards and repositories.
- CLAIM: The highest-breadth trajectory collections are AgentTrove, Toucan-1.5M, Nemotron Agentic/SWE/Terminal releases, WebWorldData, and the OpenResearcher/MiroVerse deep-research family — RISK: normal — SOURCES: huggingface.co — COUNTER: searched newer releases, supersessions, and mirrors — PRIMARY: publisher dataset cards.
- CLAIM: Public artifacts divide materially into complete trajectories, task/environment bundles, reward/preference datasets, raw multimodal run logs, gated samples, and commercial samples; they should not be shown as one undifferentiated “dataset” type — RISK: normal — SOURCES: huggingface.co — COUNTER: checked schemas and access terms — PRIMARY: dataset cards.
- CLAIM: Dataset counts on a few Hub cards are internally inconsistent and require qualified display text — RISK: normal — SOURCES: huggingface.co — COUNTER: compared overview claims, quantification tables, and Hub row counters — PRIMARY: dataset cards.

## EXPAND

- LEAD: AgentTrove’s 219 source repositories — WHY: exhaustive shard-level inventory is possible but would mostly expose teacher/model/temperature variants rather than distinct benchmark datasets — ANGLE: include the aggregate once and expose source lineage in expandable metadata.
- LEAD: NVIDIA NeMo Gym’s 32-dataset RLVR collection — WHY: contains additional math/science/instruction-following pivots beyond this trajectory axis — ANGLE: assign to the science/reasoning and safety lanes.
- DEAD END: ToolPRMBench data — official repository still indicates release forthcoming.
- DEAD END: obvious AgentTrove, OpenResearcher, SWE-rebench, and data-agent mirrors/conversions — closed as duplicates.
- DEAD END: AgentBank description — dataset card is empty, so no evidence-backed description was possible without a separate sample inspection.
