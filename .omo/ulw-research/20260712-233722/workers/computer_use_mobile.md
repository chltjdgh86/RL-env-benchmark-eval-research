ULW-RESEARCH MODE ENABLED!

Completed this axis with 49 Exa queries and full-page fetches of 60+ retained primary sources. I deduplicated mirrors, separated benchmarks from trajectory/training corpora, and distinguished full-open releases from partial, gated, commercial, and paper-only previews.

### Interactive environments and task benchmarks

| Release | Platform / scope | Public artifact | Access | Evidence |
|---|---|---|---|---|
| [OSWorld](https://os-world.github.io/) | Ubuntu, Windows, macOS | Environment, 369 tasks, evaluators, trajectories | Open | “369 real-world computer tasks”; 361 excluding unavailable Drive tasks |
| [OSWorld 2.0](https://github.com/xlang-ai/OSWorld-V2) | Long-horizon desktop tasks | Environment, assets, trajectory viewer | Partially gated | Public code/assets; official task classes require auto-approved agreement |
| [WindowsAgentArena](https://github.com/microsoft/WindowsAgentArena) | Windows 11, 15 apps | 154 tasks, Azure/local VM harness | Open, MIT | “154 tasks across 15 applications” |
| [WindowsAgentArena-V2](https://github.com/GAIR-NLP/WindowsAgentArena-V2) | Windows 11, 11 apps | 141 corrected tasks, VM snapshot | Open, MIT | Repairs dependency, initial-state and evaluator flaws in WAA |
| [WindowsWorld](https://github.com/HITsz-TMG/WindowsWorld) | Windows, 17 apps | 181 process-centric tasks | Open, Apache-2.0 | 77.9% multi-app; average 4.97 checkpoints |
| [macOSWorld](https://github.com/showlab/macosworld) | macOS, 30 apps, five languages | 202 tasks, environment, evaluators | Open code; macOS host required | Includes 29-task safety subset |
| [MacArena](https://github.com/MacPaw/MacArena) | Native macOS, 50 apps | 421 manually verified tasks and VM | Open; mixed upstream licensing | 221 OSWorld ports + 151 macOSWorld + 49 native |
| [OpenGVLab MacOS Arena](https://github.com/OpenGVLab/ScaleCUA/blob/main/evaluation/MacOSArena/README.md) | Dockerized macOS | 70 tasks, images, evaluation harness | Open | Distinct from MacPaw MacArena |
| [macbench](https://github.com/LocalKinAI/macbench) | Native local macOS | Deterministic benchmark and evaluators | Open | Current v0.2 README reports 379 tasks |
| [MacAgentBench](https://github.com/JetAstra/MacAgentBench) | macOS, 18 app/tool categories | 110 tasks, rule-based evaluation | Open, MIT | Docker macOS image supported |
| [AndroidWorld](https://github.com/google-research/android_world) | Android emulator, 20 apps | 116 parameterized tasks, rewards | Open, Apache-2.0 | Dynamic initialization and durable reward functions |
| [B-MoCA](https://github.com/jylee425/b-moca) | Android with randomized device contexts | Appium/ADB environment and benchmark | Open, Apache-2.0 | Device snapshots vary configuration and state |
| [MobileAgentBench](https://github.com/MobileAgentBench/mobile-agent-bench) | Android, 10 apps | 100 tasks and automated completion checks | Open | Reproducible app-level evaluation |
| [MobileWorld](https://github.com/Tongyi-MAI/MobileWorld) | Android, 20 apps | 201 tasks, deterministic evaluators, Arena | Open | Supports user interaction and MCP calls |
| [MobileWorld task data](https://huggingface.co/datasets/Tongyi-MAI/MobileWorld) | MobileWorld metadata | 201 task records | Open | Small task/config release; full environment is GitHub-hosted |
| [AndroidArena](https://github.com/AndroidArenaAgent/AndroidArena) | Android, cross-app and constrained tasks | Task instructions and environment preview | Partial | Annotated action sequences are still promised for later release |
| [A3 / AITK](https://github.com/YuxiangChai/AITK) | Android, 20 dynamic online apps | 100 tasks, AVD, procedural evaluator | Open, Apache-2.0 | Current canonical successor to archived Android Agent Arena repo |
| [SPA-Bench](https://github.com/ai-agents-2030/SPA-Bench) | Android, 66 apps, bilingual | 340 tasks: 300 single-app + 40 cross-app | Partial | Core code released; full snapshot/release remained incomplete |
| [AndroidLab](https://github.com/THUDM/Android-Lab) | Android, nine offline apps | 138 tasks, AVD/Docker environment | Open, MIT | Reproducible offline-app task suite |
| [AndroidDaily](https://huggingface.co/datasets/stepfun-ai/AndroidDaily) | Android daily-use closed-source apps | 235 task records, 3,146 static actions | Open | Duplicate `XiWang12/AndroidDaily` mirror excluded |
| [ProBench](https://arxiv.org/html/2511.09157v1) | Android, 34 bilingual online apps | 200+ process-aware tasks | Paper-only | No public code/data repository found |
| [iOSWorld](https://github.com/ljang0/iOSWorld) | iOS, 26 reproducible SwiftUI apps | 133 tasks/rubrics, local and EC2 runners | Open, Apache-2.0 | Supports screenshot/XML observations and optional MCP |
| [DeskCraft](https://github.com/mrwwk/DeskCraft) | Ubuntu desktop, 11 apps plus multi-app | 538 tasks, 279 assets, evaluators | Open, Apache-2.0 | 386 standard + 152 interactive tasks |
| [WeaveBench](https://weavebench.github.io/) | Ubuntu hybrid GUI/CLI work | 114 tasks across eight work domains | Open | Includes trajectory-aware judging and shortcut detection |
| [Gym-Anything / CUA-World](https://cmu-l3.github.io/gym-anything/) | Linux, Windows, Android | 200+ software environments, 10K+ tasks | Open | Checklist verifiers and public explorer/trajectory samples |
| [OpenComputer](https://github.com/echo0715/OpenComputer) | Desktop software worlds | 33 apps, 1,000 finalized tasks | Open, Apache-2.0 | Structured application-state verifiers |
| [OSUniverse](https://github.com/agentsea/osuniverse) | Dockerized desktop/browser/terminal/LibreOffice | Environment, tasks, local result viewer | Open, MIT | Includes desktop, browser and multi-app categories |
| [SCUBA](https://github.com/SalesforceAIResearch/SCUBA) | Salesforce CRM browser/computer use | 300 task instances | Open, Apache-2.0 | Tasks derived from admin, sales and service interviews |
| [ProSoftArena](https://prosoftarena.github.io/) | 13 professional apps, six disciplines | Current publication reports 456 tasks | Preview | Site says data/code “will be openly available soon” |

### Offline benchmarks, task-state corpora, and verifier sets

| Release | Artifact | Access | Evidence |
|---|---|---|---|
| [WorldGUI-Bench](https://huggingface.co/datasets/hhenryz/WorldGUI-Bench) | Dynamic initial states, queries, videos, plans and project files | Open | Current project expansion reports 611 augmented instances |
| [OS-Nav](https://huggingface.co/datasets/baidu-frontier-research/OS-Nav) | Offline trajectory navigation benchmark | Open | ChiM-Nav: 142 trajectories/991 steps; Ubu-Nav: 101/641 |
| [MMBench-GUI](https://huggingface.co/datasets/OpenGVLab/MMBench-GUI) | Four-level GUI understanding-to-automation benchmark | Open | 8K+ tasks across desktop, mobile and web platforms |
| [OmniACT](https://huggingface.co/datasets/Writer/omniact) | Screenshot/task → PyAutoGUI program benchmark | Open, MIT | 9,799 hosted rows; paper reports 9,802 |
| [FineState-Bench](https://github.com/FengxianJi/FineState-Bench) / [data](https://huggingface.co/datasets/Willtime2006/Static-FineBench) | Exact final GUI-state evaluation | Open | 2,209 current instances; original release reported 2,257 |
| [CUAVerifierBench](https://huggingface.co/datasets/microsoft/CUAVerifierBench) | Human-labeled trajectory-judge benchmark | Open | 106 public-suite + 154 internal-derived trajectories |
| [Are We Done Yet?](https://doi.org/10.5281/zenodo.17696742) | Human/VLM completion judgments over macOS trajectories | Open | Full trajectories from three CUAs across 42 built-in apps |
| [UI-Vision](https://huggingface.co/datasets/ServiceNow/ui-vision) | Dense desktop GUI demonstrations and grounding/action tasks | Open, MIT | 1,464 rows spanning 83 applications |
| [ScreenSpot](https://huggingface.co/datasets/rootsautomation/ScreenSpot) / [corrected v2](https://huggingface.co/datasets/ZhuOnR/ScreenSpot-v2) | Cross-platform text/icon grounding | Open | Approximately 1.27K samples; revisions consolidated as one family |
| [ScreenSpot-Pro](https://huggingface.co/datasets/likaixin/ScreenSpot-Pro) | High-resolution professional-app grounding | Open | 26 apps across Windows, macOS and Linux |
| [CUActSpot](https://github.com/microsoft/Phi-Ground/tree/main/benchmark/CUActSpot) | Computer-use action grounding benchmark code | Code-only | README explicitly says benchmark data is not included |

### Demonstration and trajectory corpora

| Release | Platform / contents | Access | Evidence |
|---|---|---|---|
| [OSWorld verified trajectories](https://huggingface.co/datasets/xlangai/ubuntu_osworld_verified_trajs) | Ubuntu OSWorld screenshots/actions/reasoning/results | Open | 1,000+ episodes, 480GB, 15+ model variants |
| [WAA STEVE trajectories](https://huggingface.co/datasets/Fanbin/waa_steve_trajectories) | WindowsAgentArena agent runs | Open, third-party | 37K action steps over all 154 WAA tasks |
| [AgentNet](https://huggingface.co/datasets/xlangai/AgentNet) | Human-annotated Windows/macOS/Ubuntu tasks | Open, MIT | 22.6K tasks, screenshots, PyAutoGUI, CoT and reflection |
| [ScaleCUA-Data](https://huggingface.co/datasets/OpenGVLab/ScaleCUA-Data) | Grounding and operation trajectories across desktop/mobile/web | Open | 1.07TB; automated collection plus human correction |
| [SATraj-OS](https://huggingface.co/datasets/AI45Research/SATraj-OS) | Capability and safety desktop trajectories | Open | 10,496 trajectories, 158,196 steps, 15 apps |
| [ProCUA-SFT](https://huggingface.co/datasets/nvidia/ProCUA-SFT) | Synthetic multi-app desktop trajectories | Open, CC BY 4.0 | 93,566 raw trajectories, 916GB |
| [GUI-360](https://huggingface.co/datasets/vyokky/GUI-360) | Word/Excel/PowerPoint full-state trajectories | Open, MIT | 1.2M+ action steps; successful and failed paths |
| [GUI-Odyssey](https://huggingface.co/datasets/OpenGVLab/GUI-Odyssey) | Cross-app mobile demonstrations | Open, CC BY 4.0 | 7,735 episodes, 201 apps, six devices |
| [Android in the Wild](https://github.com/google-research/google-research/tree/master/android_in_the_wild) | Large-scale Android interaction episodes | Open | 715,142 episodes, 5.69M examples, 30,378 prompts |
| [AndroidControl](https://github.com/google-research/google-research/tree/master/android_control) | Human Android demonstrations | Open | 15K+ demonstrations, 833 apps, high/low-level instructions |
| [AndroidInteraction](https://github.com/google-research/google-research/tree/master/android_interaction) | Android tasks requiring user interaction | Open | 772 episodes, 3,605 steps, 250+ apps |
| [Android Instruct](https://github.com/THUDM/Android-Lab/blob/main/docs/instruction_tuning.md) | AndroidLab instruction-tuning traces | Open | Released subsets: 6,208 XML steps and 6,053 SoM steps |
| [GUIrilla-Task](https://huggingface.co/datasets/macpaw-research/GUIrilla-Task) | macOS screenshot/instruction/action grounding | Open, CC BY-NC 4.0 | 27,171 rows, 46.9GB, app-disjoint split |
| [WildGUI / Video2GUI](https://github.com/WeiminXiong/Video2GUI) / [data](https://huggingface.co/datasets/xwm/WildGUI) | Tutorial-video-derived cross-platform trajectories | Open reprocessing | 57,500 task rows; noisy provenance should be disclosed |
| [LearnGUI](https://huggingface.co/datasets/lgy0404/LearnGUI) | Expert mobile demonstrations | Open | 2,353 instructions, 73 apps, average 13.2 steps |
| [OmniGUI](https://huggingface.co/datasets/OmniGUI/OmniGUI) | Multimodal smartphone episodes | Open | 708 episodes, 2,572 steps, 29 apps, Chinese/English |
| [PangO Office](https://huggingface.co/datasets/chakra-labs/pango-office-trajectories) | Authentic Sheets/Slides/Figma/Canva work sessions | Gated/contact | 16.3GB preview; video and action metadata |
| [PangO](https://huggingface.co/datasets/chakra-labs/pango) | Broader real-work computer-use corpus preview | Preview/contact | Publisher targets 100K+ hours; public artifact is only a sample |
| [Contra creative-design trajectories](https://huggingface.co/datasets/contra-labs/creative-design-trajectories) | Expert Photoshop/browser creative work | Open preview; full commercial | 14 trajectories, 294 steps, five sessions |
| [Terac Computer-Use Workflows](https://terac.com/datasets/computer-use-workflows) | Continuous expert recordings across 500+ professional apps | Commercial/sample request | Windows, macOS, Linux and browser workflows |

### Deduplication and dead ends

- Consolidated ScreenSpot, ScreenSpot-v2 and mirrors into one benchmark family; ScreenSpot-Pro remains distinct.
- Consolidated WildGUI with its originating Video2GUI project; the accessible HF release is a reprocessing, not the original publisher account.
- Excluded `XiWang12/AndroidDaily` as a duplicate of the StepFun release.
- Kept MacPaw MacArena and OpenGVLab MacOS Arena separate: they are unrelated 421-task and 70-task projects.
- Kept OSWorld benchmark, verified-trajectory corpus and OSWorld 2.0 separate.
- Generic viewers—including [CUA Trace Viewer](https://github.com/Computer-use-agents/CUA-Trace-Viewer)—were not counted as datasets.
- CUActSpot has public evaluation code but no benchmark data.
- ProSoftArena remains announced/preview-only.
- ProBench yielded a paper and proceedings page but no public dataset or environment.
- AndroidArena promises annotated action sequences later.
- SPA-Bench’s repository describes an incomplete staged release.
- FineState’s 2,257 versus 2,209 counts correspond to original versus current versions, not two independent datasets.
- ProSoftArena’s older 436 count was superseded by the current CVPR publication’s 456.

## CLAIMS

1. The strongest fully open, reproducible cross-OS benchmark family is OSWorld plus OSWorld verified trajectories; OSWorld 2.0 improves task realism but introduces task-class gating.
2. Windows now has three materially distinct task suites: WindowsAgentArena, its corrected V2, and process-centric WindowsWorld.
3. macOS coverage expanded rapidly: macOSWorld, MacArena, OpenGVLab MacOS Arena, macbench and MacAgentBench should not be conflated.
4. Mobile evaluation divides into dynamic emulator environments—AndroidWorld, MobileWorld, AITK, AndroidLab, iOSWorld—and offline demonstration/grounding datasets such as AITW, AndroidControl, GUI-Odyssey and OmniGUI.
5. Gym-Anything/CUA-World is the broadest claimed software-environment release by scale: 200+ software environments and 10K+ tasks across Linux, Windows and Android.
6. The largest public computer-use trajectory artifacts found are ScaleCUA-Data by hosted size, Android in the Wild by episode count, and GUI-360 by action-step count.
7. Professional-work data remains substantially less open than general desktop/mobile data: ProSoftArena is pending, PangO is gated, Contra is a preview, and Terac is commercial.
8. Verifier research is becoming a separate dataset category: CUAVerifierBench, FineState-Bench and “Are We Done Yet?” target judgment reliability rather than agent policy training.
9. Public iOS resources remain sparse; iOSWorld is the clearest reproducible environment, while most cross-platform grounding datasets only contain static iOS screenshots.
10. Dataset-card counts frequently drift from papers; version, row-count and mirror provenance should be recorded explicitly in any catalog.

## EXPAND

- Follow the OSWorld 2.0 task repository after agreement to enumerate exact task/domain counts unavailable on the public README.
- Recheck ProSoftArena when the promised code/data release lands.
- Monitor AndroidArena for annotated-sequence publication and SPA-Bench for its complete Android snapshot.
- Seek publisher confirmation for WildGUI’s authoritative original dataset location; the accessible HF corpus is a third-party reprocessing.
- Contact PangO, Contra and Terac if private/commercial datasets are in scope; public previews substantially underrepresent their claimed collections.
- Audit individual licenses before commercial use, especially MacArena’s inherited macOSWorld tasks, GUIrilla’s noncommercial license, and PangO/Contra/Terac terms.
