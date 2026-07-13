Completed an Exa-first sweep with 50+ materially different queries and multiple counter-search waves. I verified 66 distinct data releases or runnable task corpora on this safety/cyber axis.

Access labels: `public` = downloadable data/configs; `partial` = public subset with fuller corpus gated; `gated` = account/contact approval; `sample` = representative public sample only; `anonymous` = public but under-review provenance.

### General agent safety, harmful action, and authorization

| Dataset / publisher | Type and access | Description |
|---|---|---|
| [AgentHarm — UK AISI / Gray Swan](https://huggingface.co/datasets/ai-safety-institute/AgentHarm) | Tasks, public partial | 468 rows; harmful and benign agent behaviors. Public release currently exposes portions of the test and validation behavior sets. |
| [Agent-SafetyBench — Tsinghua](https://huggingface.co/datasets/thu-coai/Agent-SafetyBench) | Tasks + environments, public | 2,000 test cases over 349 interaction environments, 8 safety-risk categories, and 10 failure modes. |
| [R-Judge — NJU](https://github.com/Lordog/R-Judge) | Labeled interaction records, public | 569 multi-turn agent records spanning 27 risk scenarios, 5 application categories, and 10 risk types. |
| [TrustAgent](https://github.com/agiresearch/TrustAgent) | Task cases, public repo | Safety cases across medicine, cooking, finance, everyday activity, and chemistry; assets are directly runnable with the simulator. |
| [ToolEmu](https://github.com/ryoungj/ToolEmu) | Tasks + tool specifications, public | 144 curated risky tool-use cases across 36 toolkits and 311 tools, plus emulated trajectories and evaluators. |
| [ToolSword](https://github.com/Junjie-Ye/ToolSword) | Safety test data, public | Tool-learning safety data covering malicious queries, jailbreaks, noisy misdirection, risky cues, harmful feedback, and error conflicts. |
| [SafeToolBench](https://github.com/BITHLP/SafeToolBench) | Tool-safety queries, public | Checked-in query files and API/tool specifications for prospective tool-utilization safety evaluation. |
| [ToolMisuseBench](https://huggingface.co/datasets/sigdelakshey/ToolMisuseBench) | Tasks, public | 6,800 deterministic tasks testing schema misuse, authorization errors, interface drift, failures, recovery, and tool-call budgets. |
| [Agent Security Bench](https://github.com/agiresearch/ASB) | Attack/config corpus, public | Agent attacks and defenses over 10 scenarios: direct/observation injection, memory poisoning, and plan-of-thought backdoors. |
| [Agent Security Sandbox](https://github.com/X-PG13/agent-security-sandbox) | Tasks + checked-in results, public | 565 indirect-prompt-injection cases: 352 attack and 213 benign, evaluated against 11 defenses. |
| [RAIL Guard Benchmark](https://huggingface.co/datasets/responsible-ai-labs/rail-guard-benchmark) | Prompts and tool-call scenarios, public | Pool B contains 392 labeled agent tool-call safety scenarios across five domains; Pool A adds 1,197 content-safety prompts. |
| [AuthBench — Evolvent](https://github.com/evolvent-ai/Authbench) | Executable tasks, public | 120 terminal tasks testing file-level read/write/execute permission generation and constrained replay, including 40 sensitive tasks. |
| [ILION-Bench v2](https://zenodo.org/records/18929841) | Labeled action scenarios, public | 400 execution-safety scenarios covering prompt injection, tool misuse, exfiltration, social engineering, jailbreaks, privilege escalation, compliance violations, and destructive actions. |
| [GAP Benchmark](https://huggingface.co/datasets/acartag7/gap-benchmark) | Tool-call interaction records, public | 17,420 scored interactions measuring whether text refusal transfers to tool-call safety across six operational domains. |
| [PropensityBench — Scale AI](https://github.com/scaleapi/propensity-evaluation) | Agentic scenarios, public | 979 scenarios expanded to 5,874 pressure-condition test cases across self-proliferation, cyber, bio, and chemical risk. |
| [Dangerous Capability Evaluations — Google DeepMind](https://github.com/google-deepmind/dangerous-capability-evaluations) | Tasks/environments, public limited | Reproduction data and Docker environments for CTF, self-proliferation, and self-reasoning evaluations; solutions and some details are intentionally withheld. |
| [ATBench](https://huggingface.co/datasets/AI45Research/ATBench) | Labeled trajectories, public | Current 1,000-trajectory safety benchmark plus legacy ATBench500, with binary and fine-grained risk/failure/harm labels. |
| [AgentDoG 1.0 Training Data](https://huggingface.co/datasets/AI45Research/AgentDoG1.0-Training-Data) | Training trajectories, public | Two 4,000-record SFT configurations for binary trajectory safety and fine-grained taxonomy diagnosis. |
| [AgentHazard](https://huggingface.co/datasets/Yunhao-Feng/AgentHazard) | Tasks + traces, public | 2,653 harmful computer-use instances across 10 risk categories and 10 attack strategies, with 10,000+ execution trajectories advertised. |
| [AgentTrap](https://huggingface.co/datasets/zhmzm/AgentTrap) | Executable tasks + fixtures, public | 141 third-party-skill runtime tasks: 91 malicious and 50 benign, covering 16 impact dimensions and 10 attack methods. |
| [CUAHarm](https://huggingface.co/datasets/CUAHarm/CUAHarm) | Tasks, public | 104 realistic misuse scenarios, including 52 directly executable computer-use tasks with rule-based rewards. |
| [OS-Harm](https://huggingface.co/datasets/thomas-kuntz/os-harm) | OSWorld tasks, public | 149 released safety tasks covering deliberate misuse, prompt injection, and agent misbehavior. |
| [RiOSWorld](https://huggingface.co/datasets/JY-Young/RiOSWorld) | Risk tasks + large fixtures, public | 492 multimodal computer-use risk examples and OSWorld-derived environment assets. |
| [RTC-Bench / RedTeamCUA](https://github.com/OSU-NLP-Group/RedTeamCUA) | Executable hybrid Web–OS tasks, public | 864 indirect-injection examples across realistic hybrid web and desktop environments. |
| [DTap-Bench — DecodingTrust-Agent](https://huggingface.co/datasets/DecodingTrust-Agent/DTap-Bench) | Tasks + setup/judges, public | Benign, direct-red-team, and indirect-red-team splits across 14 domains, with MCP configs, setup scripts, and judges. |
| [A3S-Bench — Ant Group / InclusionAI](https://huggingface.co/datasets/inclusionAI/A3S-Bench) | Multi-turn task corpus, public | 424 benign conversations and 726 adversarial injections across 10 risk categories and 6 scenarios. |
| [MT-AgentRisk — CHATS Lab](https://huggingface.co/datasets/CHATS-Lab/MT-AgentRisk) | Executable tasks, gated | 365 single-turn harmful tasks and aligned multi-turn variants across filesystem, browser, terminal, PostgreSQL, and Notion tools. |
| [VIOLA / PVBench](https://huggingface.co/datasets/policy-violation-benchmark/VIOLA) | Labeled full traces, public | 400 AppWorld/CUGA traces covering 11 behavioral-policy violations and 63 clean controls. `policy-violation-benchmark` is the same underlying release under an older alias. |
| [Agentic Red-Team Benchmark](https://huggingface.co/datasets/jash-ai/agentic-redteam-benchmark) | Per-step trajectories, public preview | 2,288 traces: 513 human-authored gold and 1,775 explicitly provenance-flagged, non-human-reviewed augmented cases. |

### Prompt injection, browser security, and memory poisoning

| Dataset / publisher | Type and access | Description |
|---|---|---|
| [AgentDojo — ETH Zurich](https://github.com/ethz-spylab/agentdojo) | Dynamic tasks/environment, public | 97 realistic tasks, 70 tools, 27 injection goals, and 629 security test cases across workspace, Slack, travel, and banking. |
| [InjecAgent — UIUC](https://github.com/uiuc-kang-lab/InjecAgent) | Injection cases + outputs, public | 1,054 test cases spanning 17 user tools and 62 attacker tools; direct-harm and data-stealing variants are checked in. |
| [WASP — Meta](https://github.com/facebookresearch/wasp) | Executable web tasks, public | 84 attack tasks across GitLab and Reddit plus a 37-task benign utility set in a modified VisualWebArena. |
| [BrowseSafe-Bench — Perplexity](https://huggingface.co/datasets/Xander-run/browsesafe-bench) | HTML detection corpus, public | 14,719 realistic HTML samples with hidden/visible prompt injections. This is detector-oriented rather than a full executable agent environment. |
| [LLMail-Inject — Microsoft](https://huggingface.co/datasets/microsoft/llmail-inject-challenge) | Real challenge submissions, public | Adaptive injection prompts from a simulated RAG email assistant challenge with four scenarios and 40 defense/model levels. |
| [Nemotron RL Agentic IPI v1 — NVIDIA](https://huggingface.co/datasets/nvidia/Nemotron-RL-Agentic-Indirect-Prompt-Injection-v1) | RLVR environments, public | 1,272 tool-use environments across nine enterprise domains with deterministic trace verifiers. |
| [AgentPIMA](https://huggingface.co/datasets/agentpima-bench/agentpima-benchmark) | Multi-artifact cases, public anonymous | 21,952 main and 32,928 accumulation-stress cases across email, calendar, documents, chat, tickets, spreadsheets, and wikis. |
| [AgentInjectionBench](https://huggingface.co/datasets/sincpp/AgentInjectionBench) | Injection seeds, public preview | 120 hand-crafted seeds covering tool-output injection, goal hijacking, privilege escalation, exfiltration, multi-turn state, and MCP poisoning. |
| [AgentPoison](https://github.com/AI-secure/AgentPoison) | Poisoning assets and task data, public | Memory/knowledge-base backdoor data for autonomous driving, QA, and EHR agents. |
| [MemShield-Bench](https://huggingface.co/datasets/npow/memshield-bench) | Labeled memory entries, public | 1,178 entries—856 clean and 322 poisoned—across 10 attack types, seven domains, and three difficulty levels. |
| [FragBench](https://huggingface.co/datasets/LidaSafety/fragbench) | Fragment/session corpus, public anonymous | 44,841 fragments from 24 multi-session malicious campaigns plus benign chains; sensitive attack-rewriter artifacts are gated separately. |

### Cybersecurity agent environments and data

| Dataset / publisher | Type and access | Description |
|---|---|---|
| [Cybench](https://cybench.github.io/) | Executable CTF tasks, public | 40 professional CTF tasks with starter files, containers, evaluators, and graded subtasks. |
| [NYU CTF Bench](https://github.com/NYU-LLM-CTF/NYU_CTF_Bench) | Executable CTF tasks, public | 200 test and 55 development challenges across six CTF categories. |
| [CTF-Dojo — Amazon](https://github.com/amazon-science/CTF-Dojo) | Executable challenge corpus/builder, public | 658 containerized CTF-style challenges plus tooling for converting public archives and collecting verified trajectories. |
| [InterCode-CTF — Princeton](https://github.com/princeton-nlp/intercode/tree/master/data/ctf) | Interactive task data, public | CTF challenge JSON and Docker-backed execution environment within the broader InterCode suite. |
| [CyberGym — UC Berkeley](https://huggingface.co/datasets/sunblaze-ucb/cybergym) | Vulnerability environments, public | 1,507 real vulnerability-analysis tasks; 236 GB task data plus much larger optional execution environments. |
| [SEC-bench](https://huggingface.co/datasets/SEC-bench/SEC-bench) | Vulnerability instances, public | 600 real software-security instances with reports, sanitizer traces, Docker/build scripts, and gold patches. |
| [SEC-bench Pro](https://huggingface.co/datasets/SEC-bench/SEC-bench-Pro) | Long-horizon vulnerability tasks, public | 183 unique V8/SpiderMonkey vulnerabilities exposed through 366 dataset rows/configs, with reproducible environments and fixes. |
| [CVE-Bench — UIUC](https://github.com/uiuc-kang-lab/cve-bench) | Executable exploit tasks, public partial | 40 critical real-world web CVEs with zero/one-day variants; task environments are public, while reference exploits are available on request. |
| [3CB — Apart / UK AISI](https://github.com/apartresearch/3cb) | Cyber-offense tasks, public limited | Original catastrophic cyber-capability challenges with Docker task configurations; solutions and flags are withheld. |
| [BountyBench](https://github.com/bountybench/bountytasks) | Bug-bounty task corpus, public/partial setup | Real detect/exploit/patch tasks with metadata, verification, and patch scripts; some target-code infrastructure requires separate access. |
| [AutoPenBench](https://github.com/lucagioacchini/auto-pen-bench) | Pen-test environments, public | Containerized in-vitro and real-world penetration-testing machines with flags and structured agent tools. |
| [DefenderBench — Microsoft](https://github.com/microsoft/DefenderBench) | Environment toolkit, public | Turns public cyber datasets into interactive network intrusion, malicious-content, CTI, vulnerability-detection, and fixing environments. |
| [CyberSOCEval Data — CrowdStrike / Meta](https://github.com/CrowdStrike/CyberSOCEval_data) | Source/eval data, public | Malware-analysis and threat-intelligence source corpora used by CyberSecEval 4; analytical rather than long-horizon autonomous tasks. |
| [CyberSecEval 4 Autonomous Offensive Operations](https://meta-llama.github.io/PurpleLlama/CyberSecEval/docs/benchmarks/autonomous_uplift) | Prompt generator + sample range data, public | Ships sample cyber-range pair data and generates agent prompts/transcripts for autonomous intrusion evaluation. |
| [Cyber Defense Benchmark — Simbian](https://github.com/simbianai/cyber_defense_benchmark) | Threat-hunting sample, public sample | Runnable `sample.zip` with logs and flags; the full threat-hunting dataset is distributed separately by request. |
| [Agent-Trace-Cyber v1 — AnodeAI](https://huggingface.co/datasets/AnodeAI/Agent-Trace-Cyber-v1) | Trajectories, public sample | 62 public ReAct-style cyber/DevOps trajectories; the multi-million-row corpus is commercial/request-access. |

### Monitoring, sabotage, deception, and control

| Dataset / publisher | Type and access | Description |
|---|---|---|
| [ControlArena — UK AISI / Redwood](https://github.com/UKGovernmentBEIS/control-arena) | Tasks, environments, exportable trajectories, public | Main-task/side-task settings for code, infrastructure, data poisoning, eval sabotage, AgentDojo, and SHADE-Arena control experiments. |
| [ControlArena persistent-state public export](https://huggingface.co/datasets/idacy/control-arena-persistent-state-eval-full-public-2026-05-28) | Logs/trajectories, public community mirror | Public export of ControlArena persistent-state evaluations; useful data, but not hosted by the official ControlArena organization. |
| [SHADE-Arena public split](https://github.com/kalescale/SHADE-Arena) | Tasks + transcripts, public partial | Five public task pairs out of 17; full corpus is available by requesting repository access. |
| [Monitor Red Teaming — Scale AI](https://huggingface.co/datasets/ScaleAI/mrt) | Agent and monitor trajectories, public | Thousands of trajectories from 17 SHADE-Arena and 15 CUA-SHADE-AgentCompany tasks, with monitor verdicts and evasion strategies. |
| [MALT-public — METR](https://huggingface.co/datasets/metr-evals/malt-public) | Labeled transcripts, gated | Public/non-internal portion covering 30 task families, 169 tasks, and roughly 19 models; alternate graph representation is linked from its card. |
| [Sandbagging Agent Traces v2](https://huggingface.co/datasets/vincentoh/sandbagging-agent-traces-v2) | Labeled scratchpads, public | 2,788 normalized software-agent traces labeled deceptive or honest; supersedes the noisier v1 release. |
| [MLE-Sabotage / CTRL-ALT-DECEIT](https://github.com/TeunvdWeij/ctrl-alt-deceit) | Tasks + external run logs, public | MLE-Bench tasks paired with sabotage objectives, plus sandbagging configurations and linked experimental logs. |
| [DeceptionBench — PKU](https://huggingface.co/datasets/PKU-Alignment/DeceptionBench) | Scenario prompts, public | 180 scenarios across sycophantic misrepresentation, alignment faking, sandbagging, strategic deception, and honesty evasion; not a tool environment. |
| [Scheming Monitor Benchmark](https://huggingface.co/datasets/Syghmon/blackboxmonitorsMATS) | Labeled trajectories, gated | 9,500 scheming/honest trajectories from ControlArena and synthetic sources. |
| [Realistic Scheming Evals](https://huggingface.co/datasets/VeylanSolmira/realistic-scheming-evals) | Full coding-agent traces, gated | CVE-fixing trajectories with hidden side objectives, tool calls, diffs, sandbox events, judge labels, and three monitor scores. |
| [CheatBench](https://huggingface.co/datasets/steinad/CheatBench) | Labeled benchmark traces, public | 4,472 traces from nine benchmark families, including 847 successful cheating cases and 32 failed attempts with localization annotations. |
| [LinuxArena public](https://huggingface.co/datasets/anonymouslinuxarena/linuxarena-public) | Agent/control trajectories, public anonymous | 22,215 trajectories across 10 Linux environments; a direct 932-trajectory JSONL sample is provided. |

Paper-only or unverified-data candidates were not counted as datasets: PACEBench, LPS-Bench, AgentRedBench, SafeClawBench, ToolSafe, TraceSafe, TRACES, and SLEIGHT-Bench. They surfaced in Exa, but I did not locate a canonical task/data release distinct from a paper or project page during this sweep.

## CLAIMS

- The prior three-item result was far too narrow. This single safety/cyber axis alone yields 66 real public, gated, partial, or sample data releases.
- The strongest production-ready additions are AgentHarm, Agent-SafetyBench, AgentDojo, InjecAgent, OS-Harm, CUAHarm, RiOSWorld, RTC-Bench, WASP, CyberGym, SEC-bench, CVE-Bench, ControlArena, MRT, ATBench, and R-Judge.
- Dataset identity must be deduplicated: VIOLA and PVBench are aliases; ATBench500 is a legacy configuration; sandbagging v2 supersedes v1; SHADE tasks and MRT trajectories are related but distinct artifacts.
- Access and provenance need first-class fields on the site. “Public sample,” “public partial,” “gated,” “commercial full,” “community mirror,” and “anonymous under review” are materially different.
- Detection corpora such as BrowseSafe, MemShield, DeceptionBench, and CyberSOCEval should be labeled separately from executable agent environments.

## EXPAND

- Search companion links from the other domain workers for overlaps with OSWorld, BrowserGym, Terminal-Bench, MCP, coding, and enterprise-work benchmarks.
- Counter-search every retained publisher’s Hugging Face organization and GitHub releases for successor versions and companion trajectory/result datasets.
- Verify row counts through Hugging Face metadata/API before freezing the site registry, especially DTap-Bench, LLMail-Inject, AgentTrap, MRT, and newer anonymous 2026 releases.
- Add a provenance-confidence field so established institutional releases and anonymous/community datasets can coexist without implying equal verification strength.
