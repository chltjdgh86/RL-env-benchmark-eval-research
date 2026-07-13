I ran 78 Exa searches across collaboration, negotiation, social simulation, memory, long-horizon planning, games, interactive agents, and offline multi-agent RL, then counter-searched companion trajectories, result archives, and successor datasets.

### Released task, sample, or trajectory data

| Category | Dataset / publisher | Canonical and data URLs | Type / access | Description and evidence |
|---|---|---|---|---|
| Collaboration | CooperBench / CooperBench | [Data](https://huggingface.co/datasets/CooperBench/cooperbench-dataset), [code](https://github.com/cooperbench/CooperBench) | Tasks; public MIT | 199 task rows representing 31 PR-derived tasks across 12 repositories and 652 feature pairs; includes setup, tests, feature briefs, and patches. |
| Collaboration | CooperBench original trajectories | [Data](https://huggingface.co/datasets/CooperBench/trajectories) | Trajectories; public MIT; 27.6 GB; viewer broken | Original agent-run archive. The viewer reports a schema mismatch, so link to the files page rather than promising browser preview. |
| Collaboration | CooperBench trajectory archive | [Data](https://huggingface.co/datasets/CooperBench/cooperbench-trajectories) | Trajectories; public; 1.22 GB; minimally documented | Separate companion archive; no useful dataset card and viewer unavailable. |
| Collaboration | CooperBench team trajectories | [Data](https://huggingface.co/datasets/CooperBench/team-trajectories) | Trajectories; Apache-2.0; 125 MB | Raw Codex and mini-swe-agent solo/cooperative/team logs for the full 652 feature pairs; task trajectories, streams, patches, and evaluation outputs. |
| Collaboration | CooperBench merge-solver SFT | [Data](https://huggingface.co/datasets/CooperBench/merge-solver-sft-data) | Training companion; public; 8,055 rows | Merge-conflict solving examples derived from the benchmark ecosystem; not an evaluation set. |
| Collaboration | CooperBench cooperator SFT | [Data](https://huggingface.co/datasets/CooperBench/cooperator-sft-data) | Training companion; public; 792 rows | Cooperation-oriented SFT samples; minimally documented. |
| Collaboration | TeamBench / ybkim95 | [Data](https://huggingface.co/datasets/ybkim95/teambench), [JSON](https://huggingface.co/datasets/ybkim95/teambench/resolve/main/teambench_dataset.json), [code](https://github.com/ybkim95/TeamBench) | Tasks; public MIT | 851 templates and 931 seeded instances over 19 categories, with OS-enforced Planner, Executor, and Verifier role separation; also publishes core and hard subsets. |
| Collaboration | Collaborative Gym real trajectories / SALT-NLP | [Data](https://huggingface.co/datasets/SALT-NLP/cogym-real-trajectories), [code](https://github.com/SALT-NLP/collaborative-gym) | Human-agent trajectories; CC-BY-SA-4.0; 74.7 MB | 228 real human-agent collaboration trajectories for travel planning, related-work writing, and tabular analysis. |
| Collaboration | Collaborative Agent Bench / Meta | [Data](https://huggingface.co/datasets/facebook/collaborative_agent_bench), [code](https://github.com/facebookresearch/sweet_rl) | Tasks plus offline interactions; custom CC-BY-NC/Llama terms; 674 MB | Backend programming tasks plus roughly 15,000 offline collaborative interactions. Files include train/test JSONL and `colbench_code_offline_15k_llama8b.jsonl`. |
| Collaboration | AgentCollabBench | [Data](https://huggingface.co/datasets/AgentCollabBench/AgentCollabBench) | Tasks; CC-BY-4.0 | 900 structured data-engineering, DevOps, and SWE collaboration tasks measuring instruction decay, tracer durability, consensus pollution, and cross-task leakage. |
| Collaboration | EntCollabBench / Kirito-Lab | [Data](https://huggingface.co/datasets/Kirito-Lab/EntCollabBench) | Tasks and seed data; public; license not declared | 300 enterprise collaboration tasks: 200 MCP-oriented and 100 approval tasks, with local seed archives and single/multi-task splits. |
| Collaboration | Multiagent collaboration scenarios / AWS | [Code and data](https://github.com/aws-samples/multiagent-collab-scenario-benchmark) | Repository-shipped tasks; code MIT-0, dataset CC-BY-4.0 | 90 hypothetical scenarios: 30 each for travel, mortgage, and software. Repository contains scenarios, agent definitions, sample conversations, and results. |
| Collaboration | GAIA2 / Meta ARE | [Data](https://huggingface.co/datasets/meta-agents-research-environments/gaia2), [code](https://github.com/facebookresearch/meta-agents-research-environments) | Dynamic tasks; account/login may be required; CC-BY-4.0 plus Llama terms | 800 scenarios across 10 simulated universes, including search, execution, adaptability, time, ambiguity, noise, and agent-to-agent interaction; 200-scenario mini subset. |
| Collaboration | AgentSense | [Code and data](https://github.com/ljcleo/agent_sense) | Repository-shipped task data; MIT | 1,225 script-derived social scenarios; JSONL files are under `SENSE/data`. |
| Collaboration | SocialBench / X-PLUG | [Code and data](https://github.com/X-PLUG/SocialBench) | Repository-shipped task data; public | More than 500 roles, 6,000 questions, and 30,800 utterances covering conversation memory, emotional perception, self-awareness, and social preferences. |
| Collaboration | CHAIC | [Code and data](https://github.com/UMass-Embodied-AGI/CHAIC) | Repository-shipped embodied tasks; public | Extensive `dataset/test_dataset` JSONs and metadata for embodied human-AI collaboration. |

### Social simulation, negotiation, debate, and privacy

| Dataset / publisher | Canonical and data URLs | Type / access | Description and evidence |
|---|---|---|---|
| Many Worlds social-simulation sweeps / ComplexDataLab | [Data](https://huggingface.co/datasets/ComplexDataLab/socsim26-sharedtask), [code](https://github.com/sandbox-social/socsim26_sharedtask) | Simulation logs; CC-BY-4.0; 470 MB | Five study archives: beauty contest, iterated prisoner’s dilemma, polarization, observed norms, and persona expression. Includes manifests, action events, prompts, responses, configs, probes, and metrics. |
| C2C AI-vs-AI negotiation games | [Data](https://huggingface.co/datasets/negotiation-games/c2c-ai-vs-ai) | Game logs; CC-BY-4.0; 25 GB; no viewer | 972 fully logged four-player mixed-motive games under six intervention conditions; includes engine logs, state snapshots, manifests, and deal summaries. |
| DEBATE / Multi-Agent-LLMs | [Data](https://huggingface.co/datasets/Multi-Agent-LLMs/DEBATE) | Dialogue/debate; Apache-2.0; 14,410 rows, ~41.8 GB | Multi-agent debates spanning roles, personas, communication styles, and consensus/voting strategies. Dataset card is sparse. |
| SOTOPIA episodes / CMU-LTI | [Data](https://huggingface.co/datasets/cmu-lti/sotopia), [code](https://github.com/sotopia-lab/sotopia) | Social episodes; public; 547 MB | Releases `sotopia_episodes_v1` in JSONL/CSV plus benchmark agents and episode-level model/reward information. |
| SOTOPIA-π / CMU-LTI | [Data](https://huggingface.co/datasets/cmu-lti/sotopia-pi) | Social training episodes; CC-BY-SA-4.0; 33,410 rows | Inspirational prompts, selected prompts, scenarios, profiles, goals, and multi-turn social-interaction episodes. |
| SOTOPIA-Ω / WYRipple | [Data](https://huggingface.co/datasets/WENYUAN98/sotopia-omega), [code](https://github.com/WYRipple/SOTOPIA-Omega) | Dialogue training corpus; CC-BY-NC-SA-4.0; 25,922 rows | Dynamically generated high-quality social-dialogue examples designed to inject strategies and break negotiation deadlocks. |
| SOTOPIA-ToM | [Data](https://huggingface.co/datasets/yashwanthys/sotopia-tom) | Evaluation and training scenarios; CC-BY-4.0; 760 rows | 160 human-reviewed gold and 600 silver scenarios with 3–5 agents, private knowledge, disclosure policies, acquisition goals, and privacy constraints. |
| Sotopia-RL reward annotations / ulab-ai | [Data](https://huggingface.co/datasets/ulab-ai/sotopia-rl-reward-annotation), [code](https://github.com/sotopia-lab/sotopia-rl) | Reward/training companion; public; 7,568 rows | Processed SOTOPIA-π conversations with utterance-level, multi-dimensional reward attribution and reward-model/GRPO training formats. |
| AgentSocialBench | [Data](https://huggingface.co/datasets/kingofspace0wzz/AgentSocialBench), [code](https://github.com/kingofspace0wzz/agentsocialbench) | Social/privacy tasks; MIT | 372 privacy scenarios across seven interaction categories, 80 user profiles, and four handcrafted reference samples. |
| SoMe Social-Media Agents Benchmark | [Data](https://huggingface.co/datasets/LivXue/Social-Media-Agents-Benchmark), [code](https://github.com/LivXue/SoMe) | Tasks and corpus; card says Apache-2.0; 25.6 GB | Eight tasks with 17,869 annotated queries, 9.16 million posts, 6,591 profiles, and 25,686 reports. |
| SocialMaze / MBZUAI | [Data](https://huggingface.co/datasets/MBZUAI/SocialMaze), [code](https://github.com/xzx34/SocialMaze) | Role-deduction QA; CC-BY-4.0 | 200,000 easy and hard deception/hidden-role scenarios with gold reasoning. |
| AgentViSS | [Data](https://huggingface.co/datasets/JunsWan/AgentViSS), [code](https://github.com/JunsWan/AgentViSS) | Multimodal social scenarios; MIT | 240 scenarios and 282 images with goals, emotions, conflict/dialogue types, and structured agent context. |
| SoMi-ToM | [Data](https://huggingface.co/datasets/SoMi-ToM/SoMi-ToM) | Multimodal social reasoning; MIT; 2,998 rows | First- and third-person embodied social interactions with 1,225 questions about self and others’ mental states. |
| Step Game | [Code and logs](https://github.com/lechmazur/step_game) | Complete game logs; public; license not declared | 5,185 three-player games with public dialogue and secret moves; repository contains thousands of `game_*.jsonl` logs and global scores. |
| Deal or No Deal dialogue / Meta | [Data](https://huggingface.co/datasets/mikelewis0/deal_or_no_dialog), [code](https://github.com/facebookresearch/end-to-end-negotiator) | Human negotiation source corpus; public | Historic bargaining-dialogue data often reused to seed or evaluate negotiation agents; not itself an LLM-agent benchmark. |
| LAMEN negotiation transcripts | [Data](https://zenodo.org/records/10254697) | Transcript archive; public | Negotiation transcript corpus useful as adjacent interaction data, but peripheral to modern interactive-agent benchmarks. |

### Memory and long-horizon interaction

| Dataset / publisher | Canonical and data URLs | Type / access | Description and evidence |
|---|---|---|---|
| LongMemEval cleaned / xiaowu0162 | [Data](https://huggingface.co/datasets/xiaowu0162/longmemeval-cleaned), [code](https://github.com/xiaowu0162/LongMemEval) | Long-dialogue QA; MIT; 3.03 GB | Corrected release with noisy sessions removed. The older `xiaowu0162/longmemeval` page is explicitly deprecated. |
| LongMemEval-V2 | [Data](https://huggingface.co/datasets/xiaowu0162/longmemeval-v2), [code](https://github.com/xiaowu0162/LongMemEval-V2) | Long-horizon task trajectories; Apache-2.0; 7.12 GB | 451 curated questions over 1,870 web and enterprise trajectories, screenshots, and haystacks reaching 500 trajectories or 115M tokens. |
| MemoryAgentBench | [Data](https://huggingface.co/datasets/ai-hyz/MemoryAgentBench), [code](https://github.com/HUST-AI-HYZ/MemoryAgentBench) | Memory tasks; MIT; 146 rows | Tests retrieval, test-time learning, long-range understanding, and conflict resolution. |
| AMA-Bench | [Data](https://huggingface.co/datasets/AMA-bench/AMA-bench), [code](https://github.com/AMA-Bench/AMA-Hub) | Trajectory-grounded memory QA; MIT; 208 rows | Agent trajectories plus open-ended questions testing recall, causal inference, state updates, and abstraction. |
| MemoryArena | [Data](https://huggingface.co/datasets/ZexueHe/memoryarena) | Interdependent multi-session tasks; card says CC-BY-4.0; 701 rows | Bundled shopping, progressive search, group travel planning, and formal math/physics reasoning. |
| WorldMemArena | [Data](https://huggingface.co/datasets/WorldMemArena/WorldMemArena) | Multimodal lifelong-memory tasks; CC-BY-4.0 annotations; 9.91 GB | 461 samples, 8,489 sessions, 59,858 turns, and 15,609 images, with gold memory points and QA checkpoints. |
| MemGUI-Bench tasks | [Data](https://huggingface.co/datasets/lgy0404/MemGUI-Bench) | Mobile GUI memory tasks; MIT | 128 tasks across 26 apps plus a 40-task mini subset. |
| MemGUI-Bench trajectories | [Data](https://huggingface.co/datasets/lgy0404/memgui-bench-trajs) | GUI trajectories; Apache-2.0; 309 GB | Screenshots, logs, and evaluation artifacts for multiple agents on MemGUI-Bench. |
| MemoryBench | [Data](https://huggingface.co/datasets/THUIR/MemoryBench) | Balanced memory/continual-learning set; public; 4,063 rows | Dialogues and implicit user feedback spanning memory and continual learning; includes DialSim and LoCoMo configurations. |
| MemoryBench-Full | [Data](https://huggingface.co/datasets/THUIR/MemoryBench-Full) | Full task corpus; public; 17,975 rows | Superset of the balanced MemoryBench release. |
| MemoryBench-Results | [Data](https://huggingface.co/datasets/THUIR/MemoryBench-Results) | Result companion; public; 3.44 GB | Predictions, per-sample evaluations, summaries, and sanitized configurations; not a task dataset. |
| MINTEval | [Data](https://huggingface.co/datasets/dinobby/MINTEval), [code](https://github.com/amy-hyunji/MINTEval) | Multi-session memory tasks; public; 595 sessions | State tracking, dialogue, Wikipedia revision, and GitHub commit histories with five question types and interference. |
| ConvoMem / Salesforce | [Data](https://huggingface.co/datasets/Salesforce/ConvoMem), [code](https://github.com/SalesforceAIResearch/ConvoMem) | Conversational memory QA; public; 27.5 GB | 75,336 QA pairs, 100 personas, 40,000 filler conversations, and pre-mixed cases at 15 context sizes. |
| PersonaMem-v2 | [Data](https://huggingface.co/datasets/bowen-upenn/PersonaMem-v2), [code](https://github.com/bowen-upenn/PersonaMem) | Text/multimodal personalized memory; public; 51,711 rows | 1,000 personas and 26,100 preference/snippet/QA items with 32K- and 128K-token histories. |
| RealMem | [Code and data](https://github.com/AvatarMemory/RealMemBench) | Repository-shipped dialogue data; Apache-2.0 | Persona JSON files containing multi-session dialogues, memory points, queries, and retrieval/evaluation outputs; paper reports 2,000+ dialogues across 11 scenarios. |
| LoCoMo / Snap | [Code and data](https://github.com/snap-research/locomo), [direct JSON](https://github.com/snap-research/locomo/blob/main/data/locomo10.json) | Long-conversation QA; CC-BY-NC-4.0 | Ten very long conversations with observations, session summaries, QA, and event summarization annotations. |
| Engram v3 | [Data](https://huggingface.co/datasets/matthewschramm/engram-v3) | Runtime memory benchmark; MIT; 498 tasks | Seed/settle/probe/judge tasks spanning nine question types, with a 50-task test subset. |
| AgentLongBench | [Data](https://huggingface.co/datasets/ign1s/AgentLongBench), [code](https://github.com/euReKa025/AgentLongBench) | Long agent histories; MIT; 256 rows, 1.02 GB | Multi-round environment rollouts from 32K to 4M tokens with tool, environment, and final-answer questions. |
| EvoMemBench | [Code and data](https://github.com/DSAIL-Memory/EvoMemBench) | Curated suite; mixed upstream licenses | Combines in-episode and cross-episode knowledge/execution tasks using MemoryAgentBench, BFCL, CL-Bench, WebWalkerQA, and ALFWorld-derived resources. |
| Long-horizon agent memory derivative | [Data](https://huggingface.co/datasets/HieuNguyenDang/long-horizon-agent-memory) | Community derivative; CC-BY-NC-4.0; 40 cases | Bilingual/multimodal staged cases derived from AMA-Bench, LongMemEval, and LoCoMo; keep in a community-derived tier. |

### Planning, travel, and world-model data

| Dataset / publisher | Canonical and data URLs | Type / access | Description and evidence |
|---|---|---|---|
| TravelPlanner / OSU NLP | [Data](https://huggingface.co/datasets/osunlp/TravelPlanner), [code](https://github.com/OSU-NLP-Group/TravelPlanner) | Planning tasks plus sandbox records; CC-BY-4.0 | 1,225 curated travel intents and reference plans plus roughly four million sandbox records; train/validation/test CSVs and example submissions. |
| PlanBench original | [Code and data](https://github.com/karthikv792/LLMs-Planning/tree/main/plan-bench) | Repository-shipped PDDL tasks; public | PDDL instances, prompts, responses, and results for planning, replanning, and verification. The similarly named `chichi56/PlanBench` HF dataset is unrelated. |
| PlanningBench / Tencent | [Data](https://huggingface.co/datasets/tencent/PlanningBench) | Planning evaluation; public; license not clearly declared; 467 rows | Manually checked synthetic instances across six planning families and more than 30 task types, each with verifiable checklists. |
| DeepPlanning / Qwen | [Data](https://huggingface.co/datasets/Qwen/DeepPlanning), [code/tasks](https://github.com/QwenLM/Qwen-Agent/tree/main/benchmark/deepplanning) | Interactive offline planning; Apache-2.0 | 120 English and 120 Chinese travel tasks plus 120 shopping tasks. HF hosts environment databases; GitHub ships queries and API-driven sandbox code. |
| AdaPlanBench | [Data](https://huggingface.co/datasets/JiayuJeff/AdaPlanBench), [code](https://github.com/JiayuJeff/AdaPlanBench) | Household planning tasks; public; license not declared | 307 queries, each paired with six increasingly constrained environment profiles. |
| AgentWorldBench / Qwen | [Data](https://huggingface.co/datasets/Qwen/AgentWorldBench) | World-model trajectory samples; Apache-2.0; 2,170 rows | Real agent histories spanning MCP, search, terminal, SWE, Android, web, and OS environments with ground-truth next observations. |

### Games and interactive environments with released trajectories

| Dataset / publisher | Canonical and data URLs | Type / access | Description and evidence |
|---|---|---|---|
| AgentTraj-L / AgentGym | [Data](https://huggingface.co/datasets/AgentGym/AgentTraj-L) | Full trajectories; public; license not declared; 14,485 trajectories | ALFWorld, BabyAI, maze, Wordle, SciWorld, SQLGym, and TextCraft agent trajectories. |
| AgentGym-RL Data-ID | [Data](https://huggingface.co/datasets/AgentGym/AgentGym-RL-Data-ID), [code](https://github.com/WooooDyy/AgentGym-RL) | Interactive RL task data; CC-BY-NC-4.0; 186,062 rows | Training/evaluation records for WebArena, search, TextCraft, BabyAI, SciWorld, and related environments; not every row is a complete trajectory. |
| TALES trajectories / PEARLS Lab and Microsoft | [Data](https://huggingface.co/datasets/PEARLS-Lab/TALES-Trajectories), [code](https://github.com/microsoft/tale-suite) | Game trajectories; framework-specific licenses; 38,383 trajectories | Full observation/action/score/thought traces across ALFWorld, Jericho, ScienceWorld, TextWorld, and TextWorldExpress. |
| Orak / KRAFTON | [Data](https://huggingface.co/datasets/KRAFTON/Orak) | Expert decision trajectories; CC-BY-NC-4.0; 11,990 rows | Text observations and actions across 12 games and six genres, designed for MCP-style evaluation. |
| RNGBench Game Trajectories / InternLM | [Data](https://huggingface.co/datasets/internlm/RNGBench-Game-Trajectories), [code](https://github.com/InternLM/RNGBench) | Multimodal game trajectories; MIT; 45,331 rows, 61.7 GB | Optimal and rollout-policy traces for Matching Pairs and 3D Maze, released as ShareGPT JSONL plus images. |

### Offline multi-agent RL data

| Dataset / publisher | Canonical and data URLs | Type / access | Description and evidence |
|---|---|---|---|
| OG-MARL / InstaDeep | [Data](https://huggingface.co/datasets/InstaDeepAI/og-marl), [code](https://github.com/instadeepai/og-marl) | Offline MARL trajectories; Apache-2.0; 70.6 GB | 74 Good, Medium, Poor, and Replay bundles across SMAC v1/v2, Flatland, MAMuJoCo, and PettingZoo in a unified Vault format. |
| D4MARL | [Code and downloader](https://github.com/jymh/d4marl) | Offline MARL HDF5; public; license not verified | Demonstration datasets for StarCraft II maps at multiple quality levels, downloaded from the project’s object store. |
| SMACv2 Offline | [Data](https://huggingface.co/datasets/jwjeonn/smacv2-offline) | Offline MARL episodes; CC-BY-4.0; 1.09 GB | QMIX-generated HDF5 episodes across three races, three team sizes, and medium/medium-replay qualities. |
| Hokoff | [Project and downloads](https://sites.google.com/view/hok-offline) | Offline game RL/MARL; public; license not visible | 1v1 and 3v3 Honor of Kings offline datasets. |

### Code, config, or aggregate-results only

These should not be shown as “sample datasets” without a qualifier.

| Environment | Canonical URL | Release status |
|---|---|---|
| MultiAgentBench / MARBLE | [GitHub](https://github.com/MultiAgentBench/MultiAgentBench) | Ships task/config data, including coding configs, Werewolf prompts, maps, and scores, but no standalone trajectory corpus found. |
| AdaSociety | [GitHub](https://github.com/bigai-ai/AdaSociety) | Ships JSON configs for contract, exploration, negotiation, and social-structure mini-games; no standalone trajectory release found. |
| AgentSociety | [GitHub](https://github.com/tsinghua-fib-lab/AgentSociety) | Framework, benchmark package, examples, and configs; no clean standalone task/log dataset located. |
| Melting Pot | [GitHub](https://github.com/google-deepmind/meltingpot) | Public substrates and environment code; no official trajectory corpus found. |
| ALEM | [GitHub](https://github.com/alem-world/alem-env) | Procedural coordination environment; only leaderboard JSON located, not trajectories. |
| RoboFactory | [GitHub](https://github.com/MARS-EAI/RoboFactory) | Embodied multi-agent code and configs; no standalone trajectory archive located. |
| VIKI-R | [GitHub](https://github.com/MARS-EAI/VIKI-R) | Repository claims public benchmark data, but its actual release location was unresolved in this pass. |
| Collab-Overcooked | [GitHub](https://github.com/marimeireles/Collab-Overcooked) | Environment plus aggregate analysis/result tables; no clean standalone trajectory dataset found. |

## CLAIMS

- CLAIM: At least 65 directly relevant public task, sample, dialogue, trajectory, or results artifacts were verified on this axis alone. — RISK: Some Hugging Face uploads omit explicit licenses or detailed cards. — SOURCES: Canonical URLs in the tables. — COUNTER: Code-only and weak-provenance projects were separated rather than counted as clean datasets. — PRIMARY: First-party repositories and publisher-owned Hugging Face organizations.
- CLAIM: The strongest companion-data ecosystems are CooperBench, SOTOPIA, MemoryBench, MemGUI-Bench, AgentGym, and Planning/Travel benchmarks. — RISK: Companion archives are not always evaluation data. — SOURCES: Their task, trajectory, SFT, reward, and results links above. — COUNTER: Every companion is labeled as task, trajectory, training, or results data. — PRIMARY: Official dataset organizations and source repositories.
- CLAIM: The site should expose access states such as viewer-ready, large archive/no viewer, repository-shipped data, deprecated/superseded, community derivative, and license unverified. — RISK: Access behavior may change over time. — SOURCES: Hugging Face file/viewer status and canonical repository contents. — COUNTER: Direct file/repository links remain useful when viewers fail. — PRIMARY: Current canonical dataset pages.
- CLAIM: `xiaowu0162/longmemeval-cleaned` should replace the deprecated original LongMemEval entry. — RISK: Older papers may still link the deprecated release. — SOURCES: [Cleaned dataset](https://huggingface.co/datasets/xiaowu0162/longmemeval-cleaned), [repository](https://github.com/xiaowu0162/LongMemEval). — COUNTER: Preserve the old name as an alias, not as the preferred download. — PRIMARY: Author-owned release.
- CLAIM: Community-derived datasets should appear in a visibly separate tier from first-party benchmark releases. — RISK: A few author uploads are under personal rather than lab accounts. — SOURCES: Publisher and repository cross-links above. — COUNTER: Cross-linked paper repositories can establish first-party provenance even when the hosting account is personal. — PRIMARY: Publication repositories and author-linked dataset cards.

## EXPAND

- LEAD: Search each verified Hugging Face organization’s sibling datasets to capture additional model-specific trajectory variants, especially CooperBench and SOTOPIA; list these only in expandable companion sections.
- LEAD: Resolve the dataset location claimed by VIKI-R and check whether its files moved to a separate Hugging Face organization.
- LEAD: Fetch SOTOPIA-RL’s canonical `cmu-lti/sotopia-rl-data` files directly; the canonical HF page timed out during this pass, while the verified annotation mirror remained accessible.
- LEAD: Add a provenance field to the site schema: `first_party`, `official_companion`, `community_derivative`, or `code_only`.
