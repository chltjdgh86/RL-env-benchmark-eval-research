Skeptical audit complete: 34 successful Exa searches across 35 varied queries, followed by primary-source fetches for 58 candidate URLs.

### High-confidence accepted dataset surfaces

| Dataset / surface | Canonical URL | Access | What is actually available |
|---|---|---:|---|
| Terminal-Bench 2.0 | https://github.com/harbor-framework/terminal-bench-2 | Open | Full containerized terminal task packages. The HF copy explicitly identifies itself as a read-only mirror, so GitHub should be canonical. |
| Terminal-Bench 2.0 Trajectories | https://huggingface.co/datasets/yoonholee/terminalbench-trajectories | Open | 52,104 trials over 89 tasks, including stepwise messages, tool calls, observations, rewards, cost and timing. Public derivative of leaderboard runs, not the task publisher. |
| SkillsBench v1.1 | https://github.com/benchflow-ai/skillsbench | Open | 87 runnable task packages, each with prompt, environment, skills, oracle and verifier. HF is a useful mirror but says GitHub is primary. |
| Agents Last Exam task cards | https://huggingface.co/datasets/agents-last-exam/agents-last-exam | Open | 153 full prompts, taxonomies and input-file descriptors; metadata only. |
| Agents Last Exam inputs | https://huggingface.co/datasets/agents-last-exam/agents-last-exam-data | Open | 49.6 GB of per-task input and software fixtures. Ground-truth outputs are separately gated. |
| AgentNet | https://huggingface.co/datasets/xlangai/AgentNet | Open, MIT | 22.6K human-annotated Windows/macOS/Ubuntu computer-use tasks with screenshots, PyAutoGUI actions, observations, thoughts and reflections. |
| AgentWorldBench | https://huggingface.co/datasets/Qwen/AgentWorldBench | Open | 2,170 observation-prediction samples from MCP, search, terminal, SWE, Android, web and desktop trajectories. |
| AgencyBench V1/V2 | https://huggingface.co/datasets/GAIR/AgencyBench | Open | 10 V1 task rows plus 32 V2 scenarios containing 138 long-horizon subtasks, deliverables and rubrics. |
| WorkBench | https://github.com/olly-styles/WorkBench | Open, MIT | 690 workplace tasks, five sandbox databases, ground-truth outcomes, precomputed results and regeneration code. |
| Workspace-Bench | https://huggingface.co/datasets/Workspace-Bench/Workspace-Bench | Open, Apache-2.0 | 388 task metadata packages paired with workspace archives; 20,476 files, 74 formats, and dependency-aware rubrics. |
| FORTE demos | https://github.com/AGI-Eval-Official/FORTE | Open, MIT | One complete demo task for each of 15 professions, with prompts, inputs, solutions, skills and rubrics. The full 180-task set is not released. |
| PaperBench | https://github.com/openai/frontier-evals/tree/main/project/paperbench | Open via Git LFS | Dataset and rubrics for replicating 20 ICML papers, plus code and debug split. |
| SpreadsheetBench | https://github.com/RUCKBReasoning/SpreadsheetBench | Open | 200-point sample archive and full 912-instruction release with 2,729 workbook test cases. |
| Spreadsheet-RL | https://huggingface.co/datasets/Spreadsheet-RL/Spreadsheet-RL | Open, CC BY-SA 4.0 | 21,418 rows plus 10,709 workbook task directories spanning training, SpreadsheetBench, verified and domain splits. |
| WebLINX | https://huggingface.co/datasets/McGill-NLP/WebLINX | Open, noncommercial | 79,777 processed turns; companion raw demos and a 140 GB BrowserGym-formatted surface are also available. |
| ClawBench task corpus | https://huggingface.co/datasets/NAIL-Group/ClawBench | Open | 153 V1 plus 130 V2 live-web tasks with instructions, rubrics and evaluation schemas. |
| ClawBench V1 traces | https://huggingface.co/datasets/NAIL-Group/ClawBenchV1Trace | Open, Apache-2.0 | 34.7 GB of videos, network logs, browser actions, agent messages and interception records. |
| ClawBench V2 traces | https://huggingface.co/datasets/NAIL-Group/ClawBenchV2Trace | Open, rolling | 3.82 GB at verification time; 806 V2 runs with recordings, actions, HTTP traces and judge outputs. |
| WebVoyager | https://github.com/MinorJerry/WebVoyager | Open, Apache-2.0 | Canonical live-web task JSONL and browser-agent implementation. |
| Browser Use benchmark | https://github.com/browser-use/benchmark | Open | BU Bench V1, 100 hand-selected browser automation tasks. |
| Halluminate WebBench | https://github.com/Halluminate/WebBench | Open | Roughly 2.5K read/action browser tasks and benchmark support data. |
| CAP-Bench public split | https://huggingface.co/datasets/Warrior0302/CAP-Bench | Open, CC BY 4.0 | 192 public cross-site browser tasks; 228 additional tasks remain private. |
| AgentBoard | https://huggingface.co/datasets/hkust-nlp/agentboard | Open | 1,012 rows and a 1.4 GB tarball spanning nine embodied, game, web and tool environments. |
| AgentBench data | https://github.com/THUDM/AgentBench/tree/main/data | Open | Task/environment data for AlfWorld, Avalon, DBBench, knowledge graph, OS interaction, Mind2Web prompts and other domains. |
| MCP-Atlas public release | https://huggingface.co/datasets/ScaleAI/MCP-Atlas | Open, CC BY 4.0 | 500 public sample tasks using 36 real MCP servers and 220 tools, with prompts, enabled tools, claims and reference trajectories. |
| Toolathlon trajectories | https://huggingface.co/datasets/hkust-nlp/Toolathlon-Trajectories | Open, CC BY 4.0 | More than 5,000 full executions for roughly 108 tasks across 17 models and three runs. |
| NVIDIA When2Call | https://huggingface.co/datasets/nvidia/When2Call | Open, Apache-2.0 | Training and test data for choosing whether to call a tool, ask for information, answer directly or decline. |
| BFCL | https://huggingface.co/datasets/gorilla-llm/Berkeley-Function-Calling-Leaderboard | Open | Official Berkeley Function Calling Leaderboard evaluation data, including multi-turn and executable categories. |
| τ²/τ³-bench | https://github.com/sierra-research/tau2-bench | Open, MIT | Versioned customer-service tasks, policies, databases and tools for airline, retail, telecom, banking and voice modes. |
| AppWorld | https://github.com/StonyBrookNLP/appworld | Open via CLI | Environment data and 750 tasks across nine simulated apps; obtained with `appworld download data`. |
| BrowseComp | https://openaipublic.blob.core.windows.net/simple-evals/browse_comp_test_set.csv | Open | Canonical 1,266-problem CSV used directly by OpenAI’s `simple-evals`; questions and answers are encoded but decoded by the public evaluator. |
| GAIA | https://huggingface.co/datasets/gaia-benchmark/GAIA | Gated | More than 450 questions plus attachments. Publicly discoverable but requires accepting anti-redistribution terms. |
| MobileWorld task goals | https://huggingface.co/datasets/Tongyi-MAI/MobileWorld | Open | 201 task goals across 20 Android apps. This is an overview surface, not the complete environment assets. |
| GitTaskBench | https://huggingface.co/datasets/Nicole-Yi/GitTaskBench | Open, noncommercial | 54 repository-driven multimodal tasks and 82.8 MB of task/input material. |
| OpenThoughts-Agent v1 RL | https://huggingface.co/datasets/open-thoughts/OpenThoughts-Agent-v1-RL | Open | 728 instruction/environment/verifier task packages for terminal-agent RL. |
| ATBench | https://huggingface.co/datasets/AI45Research/ATBench | Open | Latest 1,000 safety trajectories plus legacy ATBench500, with tool pools, full trajectories and fine-grained risk labels. |
| SafeAgentBench | https://huggingface.co/datasets/safeagentbench/SafeAgentBench/viewer | Open | Four visible configurations totaling 750 embodied-safety task rows. |
| Agent-SafetyBench | https://huggingface.co/datasets/thu-coai/Agent-SafetyBench | Open | Official safety tasks paired with the released environments and scoring code. |
| AgentHazard | https://huggingface.co/datasets/Yunhao-Feng/AgentHazard | Open, metadata warning | 2,653 harmful computer-use instances and advertised execution traces; card lacks complete HF YAML metadata, so label as provisional-current. |
| AgentCollabBench | https://huggingface.co/datasets/AgentCollabBench/AgentCollabBench | Open, CC BY 4.0 | 900 structured multi-agent scenarios covering instruction decay, information loss, consensus pollution and context leakage. |
| LinuxArena public trajectories | https://huggingface.co/datasets/anonymouslinuxarena/linuxarena-public | Open, CC BY 4.0 | 22,215 Linux-agent trajectories; includes a directly downloadable 932-trajectory reviewer sample. Publisher is still anonymous and benchmark code is not yet public. |

### Rejection and qualification ledger

| Candidate | Decision | Reason |
|---|---|---|
| `harborframework/terminal-bench-2.0` on HF | Do not use as canonical | Its own card says it is a read-only mirror and points to the GitHub task repository. |
| `benchflow/skillsbench` on HF | Mirror only | Useful for browsing/download, but its card says GitHub is the primary source. |
| WebVoyager copies in `darrenhwang1/agent-kura-benchmarks` and Skyvern | Exclude duplicates | Third-party copies of the canonical `MinorJerry/WebVoyager` JSONL. |
| `AmineHA/WebArena-Verified` | Exclude as canonical | Third-party HF rehost; canonical verified set is `ServiceNow/webarena-verified`. |
| `tuandunghcmut/toolbench-v1` | Exclude as canonical | Unofficial rehost; primary benchmark is `OpenBMB/ToolBench`. |
| `josancamon/paperbench` | Exclude duplicate | Third-party conversion; OpenAI’s Git-LFS repository is primary. |
| `aradhye/agent-safety-bench` | Exclude duplicate | Official publisher surface is `thu-coai/Agent-SafetyBench`. |
| `reacher-z/ClawBench` pinned tree | Exclude fork | Canonical data is under NAIL-Group. |
| `gijl/AgentTrove` | Exclude from benchmark list | Aggregated trajectories from other benchmarks; useful corpus, but not a distinct benchmark/sample source. |
| `AdithyaSK/data_agent_rl_environment_eval` | Hold | Derivative data with unclear primary benchmark attribution. |
| `bunnybhaiya/agentgym-sft-trajectories` | Hold | Third-party trajectory derivative; prefer official AgentGym releases. |
| `anon-agentgraphbench-neurips2026/agb-generated` | Hold/unverifiable | Anonymous generated set without a verified primary paper, codebase or publisher identity. |
| `DeepNLP/Agent-Function-Calling-Open-Dataset`, `pyromind/agentic-tool-call-dataset-12k` | Out of current scope | Generic synthetic training corpora, not sample data from a named benchmark/environment. |
| EnterpriseOps-Gym-AA | Leaderboard-only in this pass | An evaluation page was found, but no canonical downloadable task/sample surface was verified. |
| KWBench | Project-page-only in this pass | Benchmark description found, but no primary dataset download was established. |
| AgentSearchBench | Project-page-only in this pass | No canonical dataset/sample URL verified yet. |
| HINTBench | Paper-only in this pass | ArXiv page found; no released data surface verified. |
| C-World | Paper-only in this pass | Environment-creator paper found; no released dataset verified. |
| OSWorld-Human | Paper-only in this pass | Paper/DOI found, but no canonical task or trajectory release verified. |
| FORTE “180 tasks” | Do not claim as open | Public repository contains only 15 demos, one per profession. |
| MobileWorld “full benchmark data” | Do not claim | HF currently exposes task-goal overview rows, not full environment assets. |
| Agents Last Exam metadata | Do not describe as complete | Task cards exclude inputs and reference outputs; inputs are a separate 49.6 GB repo and reference data is gated. |
| GAIA | Do not label open-download | Access requires accepting gating and anti-redistribution conditions. |
| WorkArena instances | Gated | Code and task generators are open, but the benchmark instance dataset requires access approval. |
| MCP-Atlas | Public subset only | The released 500 rows are explicitly a sample of the larger benchmark. |
| CAP-Bench | Public subset only | 192 of 420 tasks are public. |
| LinuxArena | Include with provisional publisher caveat | Data is substantial and inspectable, but publisher remains anonymous and companion benchmark code is unavailable. |

## CLAIMS

- The ecosystem contains at least 40 distinct, directly usable task, sample, environment, input, verifier, or trajectory surfaces beyond the three URLs supplied by the user.
- “Dataset” must be typed in the site catalog: task definitions, task inputs, reference outputs, environment packages, trajectories, result archives, and task-overview metadata are materially different resources.
- Canonicalization is necessary: several prominent HF repos explicitly call themselves mirrors, while search results frequently elevate third-party rehosts over the primary source.
- Access cannot be binary. The catalog needs at least `open`, `gated`, `public subset`, `sample/demo`, `rolling`, `mirror`, and `provisional` labels.
- High-value missed families include full trajectory releases, not merely benchmark prompts: Terminal-Bench, ClawBench, Toolathlon, AgentNet, LinuxArena and WebLINX each expose substantial execution data.
- Several benchmarks require multiple catalog rows because task cards, input assets, reference outputs and traces are separately published; Agents Last Exam and ClawBench are the clearest examples.

## EXPAND

- `Agents Last Exam reference data` — locate and verify the exact gated companion URL; needed to complete the three-repository family.
- `SkillsBench leaderboard trajectories` — inspect `https://huggingface.co/datasets/benchflow/skillsbench-leaderboard` and decide whether task data and run artifacts deserve separate rows.
- `WorkArena-L1 / WorkArena++` — distinguish open parametric task generators from gated ServiceNow instance archives and enumerate official splits.
- `OSWorld`, `OSWorld-Verified`, `OSWorld-V2`, `OSWorld-Human` — audit as separate versions and determine which publish JSON task configs versus only task classes/papers.
- `EnterpriseOps-Gym-AA`, `KWBench`, `AgentSearchBench`, `HINTBench`, `C-World` — targeted counter-search for hidden GitHub/HF releases before final exclusion.
- `ToolBench`, `StableToolBench`, `ToolBench trajectories` — enumerate official OpenBMB/StableToolBench assets while excluding third-party HF conversions.
- `ClawBenchV1Trace` and `ClawBenchV2Trace` — retain as separate trace datasets; V2 is rolling and should carry a verification date.
- `terminalbench-trajectories` and `linuxarena-public` — label as public derived/anonymous trajectory corpora rather than publisher-canonical task releases.
- `Workspace-Bench-Workspaces` and `Workspace-Bench-Lite` — add companion rows after verifying exact HF IDs and archive access.
- `WebLINX-full` and `weblinx-browsergym` — likely merit separate rows for raw demonstrations and environment-ready conversion.
