Robotics/physical-world axis saturated: 55 distinct Exa searches and roughly 80 canonical page fetches. The strongest verified catalog contains 55 dataset families.

### Robot manipulation, VLA, and physical-agent datasets

| Dataset | Publisher | Canonical/data URL | Access | Description and inspectable sample evidence |
|---|---|---|---|---|
| DROID | Stanford/UT Austin + consortium | https://droid-dataset.github.io/ | Open download | 76k real-robot demonstrations, 350 hours, 564 scenes, and 86 tasks. Project page has task videos and links to full data, code, and calibration updates. |
| BridgeData V2 | UC Berkeley RAIL | https://rail-berkeley.github.io/bridgedata/ | Open download | 60,096 language-labeled trajectories across 24 environments and 13 skills; project page exposes example trajectories and download instructions. |
| Open X-Embodiment | Google DeepMind + 34 labs | https://robotics-transformer-x.github.io/ | Mixed; component licenses apply | Aggregate of 60 robot datasets with 1M+ trajectories, 22 embodiments, and 527 skills. Project page includes task videos, data browser links, and source-dataset sheet. |
| RH20T | Shanghai Jiao Tong University | https://rh20t.github.io/ | Open Google Drive/Baidu; usage warning | 110k+ contact-rich sequences over 147 tasks with RGB-D, IR, force/torque, audio, actions, and limited tactile data. Page includes sample visualizations and resized download archives. |
| RoboSet | RoboHive/RoboOpen | https://robopen.github.io/roboset/ | Open download | 28,500 real kitchen trajectories: 9,500 teleoperated and 19,000 replayed with scene variation. Four camera views and videos are previewed on the site. |
| AgiBot World Beta | AgiBot/OpenDriveLab | https://huggingface.co/datasets/agibot-world/AgiBotWorld-Beta | Gated terms; CC BY-NC-SA 4.0 | 1M+ trajectories, 2,976 hours, 100 robots, 200+ tasks, and 100+ real-world scenarios. HF card exposes videos and detailed schema before approval. |
| RoboMIND | X-Humanoid | https://huggingface.co/datasets/x-humanoid-robomind/RoboMIND | Gated HF terms | 107k real demonstrations covering 479 tasks, 96 object classes, and four embodiments. Dataset card shows composition, examples, and format. |
| InternData-M1 | InternRobotics | https://huggingface.co/datasets/InternRobotics/InternData-M1 | Gated; CC BY-NC-SA 4.0 | 244k simulated manipulation demonstrations with 2D/3D boxes, grasp points, semantic masks, trajectories, and interactive-dialog annotations. |
| PhysicalAI Kitchen Demos | NVIDIA | https://huggingface.co/datasets/nvidia/PhysicalAI-Robotics-Manipulation-Kitchen-Demos | Open HF data | 55k human-teleoperated trajectories over 316 mobile-manipulation tasks and 600 hours, packaged in LeRobot format with metadata and videos. |
| PhysicalAI GR00T X-Embodiment Sim | NVIDIA | https://huggingface.co/datasets/nvidia/PhysicalAI-Robotics-GR00T-X-Embodiment-Sim | Open HF data | GR00T post-training trajectories including 9k cross-embodiment bimanual and 240k humanoid tabletop trajectories. HF card lists each task and trajectory count. |
| PhysicalAI Manipulation Objects | NVIDIA | https://huggingface.co/datasets/nvidia/PhysicalAI-Robotics-Manipulation-Objects | Open; research use | Synthetic bimanual kitchen pick/place motions generated with Isaac Sim and motion planning, supplied in LeRobot format with file tree. |
| LeRobot Community Dataset v3 | Hugging Face VLA community | https://huggingface.co/datasets/HuggingFaceVLA/community_dataset_v3 | Open HF data | 791 contributed datasets, 50,622 episodes, 251.5 hours, and 46 robot types. HF file browser exposes every constituent dataset. |
| VLABench Unified | OpenMOSS/LeRobot | https://huggingface.co/datasets/lerobot/vlabench_unified | Open HF data | 10,977 episodes, 3.1M frames, and 295 language-conditioned long-horizon manipulation tasks in LeRobot v3. |
| VLA-Arena datasets | VLA-Arena | https://huggingface.co/datasets/VLA-Arena/VLA_Arena_L1_L_lerobot_smolvla | Open HF data | Family of L0/L1, medium/large, LeRobot/RLDS demonstration releases. The linked L1-large split has 2,750 trajectories across 55 tasks; related variants are linked from the card. |
| ManipArena | ManipArena/CVPR 2026 | https://huggingface.co/datasets/ManipArena/maniparena-dataset | Gated, automatic approval | Multimodal LeRobot demonstrations for 20 real and three simulated bimanual tasks, with camera streams, joints, currents, mobile-base state, and language annotations. |
| RoboCasa365 | UC Berkeley/Ember Lab | https://robocasa.ai/docs/build/html/datasets/datasets_overview.html | Open; MIT mirrors | Over 2,200 hours across 300 pretraining and 50 target household tasks. Six LeRobot mirrors include human and MimicGen splits; example: https://huggingface.co/datasets/ember-lab-berkeley/robocasa365-target-atomic |
| LIBERO | Lifelong Robot Learning | https://libero-project.github.io/datasets | Open download | Demonstrations for Spatial, Object, Goal, LIBERO-90, and LIBERO-10 suites with workspace/wrist RGB, proprioception, language, and PDDL. Also mirrored as LeRobot: https://huggingface.co/datasets/nvidia/LIBERO_LeRobot_v3 |
| ManiSkill | HaoSu Lab | https://huggingface.co/datasets/haosulab/ManiSkill | Open download | Assets and demonstrations for 20 task families, 2,000+ object models, and 4M+ frames. CLI downloads per-task demos and sample videos. |
| MimicGen | NVIDIA | https://mimicgen.github.io/docs/datasets/mimicgen_corl_2023.html | Open download | Generated manipulation demonstrations across robosuite tasks; public core and larger datasets include replayable HDF5 trajectories and videos. |
| robomimic v0.1 | NVIDIA | https://robomimic.github.io/docs/v0.2/datasets/robomimic_v0.1.html | Open download | Simulated and real demonstrations across multiple tasks, demonstrators, and quality levels. Download utility supports small task/type-specific subsets. |
| CALVIN | University of Freiburg | https://github.com/mees/calvin | Open download | Language-conditioned long-horizon manipulation benchmark data across four environments. Repository supplies full splits and a 1.3 GB debug dataset. |
| BEHAVIOR 2026 demos | Stanford/OmniGibson | https://behavior.stanford.edu/challenge/dataset.html | HF-hosted; challenge terms | 20,000 human teleoperation demonstrations over 100 household tasks: 1.44 TB raw replay data and 3.27 TB LeRobot RGB/depth/action data. |
| LAMBDA | Brown University et al. | https://lambdabenchmark.github.io/ | Open data link | 571 human demonstrations for language-conditioned, long-horizon, multi-room and multi-floor mobile manipulation. Page provides code, data, and videos. |
| HIW-500 | BitRobot | https://huggingface.co/datasets/BitRobot/HIW-500 | Open HF data | 500+ hours and 23k+ Unitree G1 episodes across 12 real homes, 10+ tasks, and 161 subtask labels, with synchronized vision, state, and action traces. |
| T-Rex | Tactile-Reactive Dexterous Manipulation | https://tactile-rex.github.io/dataset/ | Open download | 50 hours of tactile-rich bimanual play over 200+ objects and 22 motion primitives; synchronized vision, state, action, tactile, and language data. |
| FurnitureBench | USC CLVR | https://clvrai.github.io/furniture-bench/docs/tutorials/dataset.html | Open Google Drive | 5,100 successful furniture-assembly demonstrations totaling 219.6 hours, split by furniture and low/medium/high initialization randomness. |
| Functional Manipulation Benchmark | UC Berkeley | https://functional-manipulation-benchmark.github.io/dataset/index.html | Open direct archives | 545 GB single-object and 233 GB multi-object multistage manipulation data; page documents every trajectory field and file naming scheme. |
| REASSEMBLE | TU Wien | https://researchdata.tuwien.at/records/0ewrv-8cb44 | Open repository | 4,551 contact-rich assembly/disassembly demonstrations using 17 NIST-board objects, with RGB, event cameras, force/torque, and audio. |
| AssemblyBench | MERL + collaborators | https://zenodo.org/records/19742725 | Open Zenodo | Synthetic data for 2,789 industrial objects with multimodal manuals, 3D parts, and physically plausible assembly trajectories. |
| ARMBench | Amazon Robotics | https://www.armbench.com/ | Registration/license | Warehouse manipulation perception datasets for segmentation, identification, defect detection, and stow-success prediction. Site includes task previews and downloads. |
| NIST MOAD v2 | NIST/UMass Lowell | https://www.robot-manipulation.org/nist-moad | Open | Raw meshes, point clouds, CAD, and scans for four NIST assembly boards. Useful environment/object data rather than action trajectories. |
| RoboTwin 2.0 / RoboTwin-OD | Shanghai AI Lab consortium | https://robotwin-platform.github.io/ | Open code/data release | Bimanual task/data generator and benchmark; RoboTwin-OD contains 731 manipulation objects across 147 categories with semantic annotations. |

### Navigation, household, trajectory, and egocentric datasets

| Dataset | Publisher | Canonical/data URL | Access | Description and sample evidence |
|---|---|---|---|---|
| EB-Habitat trajectories | EmbodiedBench | https://huggingface.co/datasets/EmbodiedBench/EB-Habitat_trajectory_dataset | Open HF files | Model-generated embodied trajectories containing images, executable plans, action IDs, reasoning/planning, and success information. |
| EB-Navigation trajectories | EmbodiedBench | https://huggingface.co/datasets/EmbodiedBench/EB-Nav_trajectory_dataset | Open HF files | Low-level navigation trajectories from multiple open and closed models, with multi-step and single-step plan formats. |
| EB-ALFRED trajectories | EmbodiedBench | https://huggingface.co/datasets/EmbodiedBench/EB-Alfred_trajectory_dataset | Open HF files | Agent trajectories collected in the ALFRED environment; companion to the benchmark’s Habitat and navigation releases. |
| ALFRED | Allen Institute for AI | https://github.com/askforalfred/alfred/blob/master/data/README.md | Open direct archives | 8k+ expert household demonstrations with 3+ language annotations each. Offers 35 MB JSON-only, 17 GB quickstart, and 109 GB full variants. |
| TEACh | Amazon Alexa AI | https://github.com/alexa/teach | Open under split licenses | Human-human dialogues and action histories for completing simulated household tasks. Repository includes download code and sample episodes. |
| Room-to-Room (R2R) | Matterport/Georgia Tech | https://bringmeaspoon.org/ | Data open; Matterport imagery terms | 22k grounded navigation instructions paired with Matterport3D trajectories. Site has interactive demo, data, and evaluation links. |
| Room-Across-Room (RxR) | Google Research | https://github.com/google-research-datasets/RxR | Open CC BY 4.0 | 126k multilingual instructions and 126k navigation demonstrations in English, Hindi, and Telugu with dense alignment data. |
| REVERIE | ANU et al. | https://github.com/YuankaiQi/REVERIE | Open annotations; Matterport terms | Remote object-referring navigation instructions and trajectories in Matterport3D, with validation data and current evaluation tooling. |
| CVDN | University of Washington | https://cvdn.dev/ | Open data | 2,050 cooperative human dialogues comprising 7k+ navigation trajectories over 83 home scans. Site includes examples and download links. |
| Habitat 3 episodes | Meta AI Habitat | https://huggingface.co/datasets/ai-habitat/hab3_episodes | Open, CC BY-NC assets | 37k training and 1.2k evaluation episodes for social navigation and social rearrangement; only 52 MB for episode files. |
| ProcTHOR-10K | Allen Institute for AI | https://github.com/allenai/procthor-10k | Open Apache 2.0 | Fixed dataset of 10,000 procedurally generated interactive houses, loadable directly with the \`prior\` package and demonstrated in Colab. |
| VirtualHome programs | Stanford/CMU | https://github.com/xavierpuigf/virtualhome/blob/master/virtualhome/dataset/README.md | Open repository | Executable household activity programs, environment graphs, initial states, and state sequences across seven scenes. |
| Ego4D | Meta + consortium | https://ego4d-data.org/ | Registration/license | 3,670 hours of egocentric daily-life video from 923 participants across 74 locations. Site exposes an interactive sample explorer. |
| Ego-Exo4D | Meta + consortium | https://ego-exo4d-data.org/ | Registration/license | 1,286.3 hours of synchronized first/third-person skilled activity from 740 wearers with language, pose, and multimodal sensing; sample videos are interactive. |
| HoloAssist | Microsoft | https://holoassist.github.io/ | Terms/registration | 169 hours from 350 instructor-performer pairs completing physical tasks with seven synchronized streams, dialogue, actions, and intervention labels. |
| EPIC-KITCHENS-100 family | University of Bristol et al. | https://epic-kitchens.github.io/ | Registration/license | 100 hours, 700 videos, and 89.9k actions from 45 kitchens, plus VISOR masks, sounds, 3D fields, and other connected datasets. Site previews each component. |
| EgoDex | Apple | https://github.com/apple/ml-egodex | Public data instructions/license | 829 hours of 1080p egocentric tabletop manipulation across 194 tasks with 3D upper-body/hand poses and language labels. |

### Autonomous-driving agent/environment datasets

| Dataset | Publisher | Canonical/data URL | Access | Description and sample evidence |
|---|---|---|---|---|
| Waymo Open Dataset | Waymo | https://waymo.com/open/ | Google login/terms | Perception, Motion (103,354 scenes), and End-to-End Driving datasets. Official page provides challenge examples, visualizations, tutorials, and downloads. |
| Argoverse 2 | Argo AI/CMU | https://argoverse.org/ | Account/terms | Motion forecasting, lidar, sensor, and map-change datasets with detailed HD maps and hundreds of thousands of scenarios. |
| nuScenes | Motional | https://www.nuscenes.org/nuscenes | Account/terms | Multimodal autonomous-driving scenes and labels; provides a small \`v1.0-mini\` sample split and official devkit. |
| nuPlan | Motional | https://github.com/motional/nuplan-devkit | Account/terms; code Apache 2.0 | Closed-loop autonomous-vehicle planning dataset and simulator. Official distribution includes \`nuplan-mini\` sensor and scenario data for tutorials. |
| NAVSIM | Autonomous Vision Group | https://github.com/autonomousvision/navsim | Open code; nuPlan data terms | Data-driven planning benchmark built from nuPlan, with public \`navtest\`/\`navhard\` splits, tutorials, metrics, and visualization code. |
| Bench2Drive | Shanghai Jiao Tong University | https://thinklab-sjtu.github.io/Bench2Drive/ | Open download | Two million annotated training frames from 13,638 clips spanning 44 interactive scenarios, 23 weather settings, and 12 CARLA towns. Project page includes videos and downloads. |

### Environment/generator-only records to keep separate

These are relevant but should not be presented as fixed downloadable trajectory datasets unless the site explicitly labels generated data:

| Environment | Canonical URL | Data distinction |
|---|---|---|
| RLBench | https://github.com/stepjam/RLBench | Large manipulation task suite that can generate demonstrations through its API; no single canonical fixed corpus. |
| iGibson | https://github.com/StanfordVL/iGibson | Scene/assets dataset and task simulator; primarily environment data rather than public agent trajectories. |
| AI2-THOR/RoboTHOR | https://ai2thor.allenai.org/robothor/ | Interactive simulator and challenge episode definitions; fixed trajectory corpus is not the principal release. |
| HumanoidBench | https://github.com/carlosferrazza/humanoid-bench | Humanoid control task environment; no canonical demonstration corpus verified. |
| HumanoidArena | https://humanoidarena.github.io/ | Simulation-first humanoid benchmark with code/dataset links, but the current canonical page does not document a stable fixed-corpus schema as clearly as the entries above. |

## CLAIMS

- The physical-agent ecosystem contains dozens of directly inspectable datasets beyond the three user seeds; the strongest verified robotics/navigation/driving catalog alone has 55 dataset families.
- The largest verified physical-agent sources are Open X-Embodiment and AgiBot World at 1M+ trajectories, with RoboMIND, RH20T, DROID, NVIDIA Kitchen Demos, BridgeData V2, and LeRobot Community v3 forming the next high-value tier.
- “Sample data” is exposed through several mechanisms: HF file viewers/cards, small debug or mini splits, lightweight JSON releases, project video galleries, and per-task download utilities.
- Access must be modeled explicitly. AgiBot World, RoboMIND, InternData, ManipArena, driving corpora, and egocentric datasets have gates or license acceptance; they are not equivalent to unrestricted open downloads.
- Fixed datasets should be separated from simulators and demonstration generators such as RLBench, iGibson, and AI2-THOR.

## EXPAND

Second-wave leads worth a targeted verification pass if maximum recall is required:

- \`Posttraining-RFM-RSS2026/Challenge-phase1-dataset\`
- \`ProcessBench-2026/RoboProcessBench\`
- \`InternRobotics/InternData-A1\`
- \`agibot-world/AgiBotWorld2026\`
- ManiFeel and UniVTAC tactile benchmark data
- MoMa-Kitchen 100K+
- MobileManiBench and M3Bench
- NaviTrace, EmbRACE-3K, CFG-Bench, and EmbodiedEval
- SOON and additional VLN families such as NDH and R4R
- NVIDIA Physical AI collection sub-releases: augmented manipulation, single-arm, tuned tasks, and world-model synthetic robot scenes
