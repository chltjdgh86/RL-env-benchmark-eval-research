# Wave 1 Live Lead Digest

This file captures high-signal findings raised before final lane reports. Final lane digests supersede it where they differ.

## Company motion and current state

- **Scale AI:** launched in 2016 as a general API for managed human labor and quality control, then found its AV wedge; now sells managed data/RLHF, evaluations/red-teaming, RL environments, and applied AI. The Meta transaction is a SEC-confirmed $13.8B minority investment, not an acquisition. Sources: https://www.ycombinator.com/blog/scale/ ; https://scale.com/about ; https://scale.com/rlenvironments ; https://www.sec.gov/Archives/edgar/data/1326801/000162828026025534/meta-12312025x10kars.htm
- **Scale economics caveat:** a reported 2025 $2B revenue forecast conflicts with later reporting of actual revenue just below $1B; a January 2026 profitability statement is company-reported and does not name metric or period. Sources: https://news.bloomberglaw.com/artificial-intelligence/scale-ai-expects-to-more-than-double-sales-to-2-billion-in-2025 ; https://www.forbes.com/sites/richardnieva/2026/05/14/scale-meta-deal/ ; https://scale.com/blog/scales-next-era-building-for-2026
- **Mercor:** evolved from AI recruiting/search into a frontier-lab expert network, then Build/Evaluate/Hire/Work. On 2026-07-09 it announced an agreement to acquire Deeptune and combine expert supply with hundreds of enterprise-app environments. Sources: https://www.mercor.com/blog/mercor-to-acquire-deeptune/ ; https://www.mercor.com/mission/
- **Mercor economics caveat:** primary figures imply contractor payouts near 73% of headline annualized gross revenue; independent reporting calls the metric gross rather than recurring SaaS revenue. Sources: https://www.mercor.com/blog/when-you-go-from-2-million-a-month-to-2-million-a-day/ ; https://www.mercor.com/mission/ ; https://www.theinformation.com/briefings/exclusive-mercor-hit-1-billion-annualized-revenue-breach
- **Micro1:** moved from AI-vetted recruiting/staffing into expert data, evaluations, RL environments, enterprise agent improvement, robotics, and business-data partnerships. Sources: https://www.micro1.ai/series-a ; https://www.micro1.ai/realm ; https://www.micro1.ai/cortex ; https://www.micro1.ai/robotics
- **Turing:** moved from remote talent into AGI Advancement and enterprise AI transformation; live 2026 offers include data packs, structured RL environments, benchmarks, ALAN QA, Turing Frontier, Project Lazarus, and Advise/Augment/Build enterprise work. Sources: https://www.turing.com/advance ; https://www.turing.com/intelligence ; https://research.turing.com/project-lazarus
- **AfterQuery:** YC W25 applied-research/data supplier; its original FinanceQA launch had three founders, while current materials name Spencer Mateega and Carlos Georgescu. It buys private codebases and turns them into training/evaluation assets. Sources: https://www.afterquery.com/blog/human-expertise-reimagined ; https://www.theinformation.com/newsletters/ai-agenda/turing-buying-failed-startups-codebases
- **Fleet AI:** resolved as fleetai.com/Fleet AI, Inc., not fleet.ai namesakes. It began with developer-context tooling, sold bespoke finance/insurance agents, then shifted toward high-fidelity agent training gyms. Current funding claims remain partly unconfirmed.
- **Deeptune:** founded by Tim Lupo and Lukas Schmit, pivoted from AI dubbing to RL training gyms; Mercor announced acquisition on 2026-07-09 with terms undisclosed.
- **Refresh:** Operative AI, Inc.; rebranded from Operative browser-agent testing to RL simulation/evaluation environments and datasets. Sources: https://www.ycombinator.com/companies/refresh ; https://refresh.dev/ ; https://operative.sh/
- **Vibrant Labs:** Exploding Gradients, Inc.; emerged from the Ragas open-source evaluation project into autonomous RL data and adaptive environments. Sources: https://vibrantlabs.com/research/hello-world ; https://vibrantlabs.com/research/mining-hard-tasks
- **Halluminate:** 2024 company that moved from open-source API evaluation and broad computer-use data toward finance-specific RL gyms and a US professional-expert network. Sources: https://www.halluminate.ai/experts ; https://www.halluminate.ai/careers ; https://www.halluminate.ai/blog/westworld

## Industry architecture

- RLHF/RLAIF/RLVR describe feedback or reward provenance; DPO is an offline preference-optimization method and should not be shown as a peer market category. Sources: https://arxiv.org/abs/2305.18290 ; https://aclanthology.org/2024.findings-acl.297/
- A commercial environment is a resettable stateful system plus observation/action interface, task and initial-state distribution, logger, and verifier/reward. A benchmark is a held-out task suite and scoring protocol; they may share infrastructure but are not synonyms. Sources: https://arxiv.org/abs/2307.13854 ; https://arxiv.org/abs/2412.21139 ; https://docs.primeintellect.ai/tutorials-environments/environments
- The production data stack is hybrid: expert seed/specification, model rollouts, automated filtering/verifiers, expert adjudication, mixture/versioning, and holdouts. Sources: https://arxiv.org/abs/2212.10560 ; https://ai.meta.com/blog/meta-llama-3/ ; https://www.nature.com/articles/s41586-024-07566-y
- Interactive benchmarks such as WebArena, SWE-bench, OSWorld, and tau-bench shifted the unit from rows/prompts toward versioned worlds, tasks, trajectories, and execution/state graders. Sources: https://arxiv.org/abs/2307.13854 ; https://arxiv.org/abs/2310.06770 ; https://arxiv.org/abs/2404.07972 ; https://arxiv.org/abs/2406.12045
- AX is ambiguous: Agent Experience means making products agent-operable; agentic transformation consulting is broader workflow, integration, governance, adoption, and operations work. Sources: https://agentexperience.ax/ ; https://www.deloitte.com/cbc/en/what-we-do/capabilities/agentic-ai.html

## GTM and buyer motion

- Recurring pattern: tightly scoped paid pilot, accelerated NDA/sample, transparent QA and client feedback loop, then expansion. Micro1 cases expanded 10-to-20-to-24 experts and 20-to-60 coders; Turing promises an RL-workflow sample within three business days after NDA. Sources: https://www.micro1.ai/case-study/business-data ; https://www.micro1.ai/case-study/competitive-programmers ; https://www.turing.com/case-study/building-production-ready-rl-gyms-for-commercial-agent-workflows
- Procurement channels include direct researcher/founder access, cloud marketplaces, strategic cloud partnerships, public-sector frameworks, and data/expert referral bounties. Sources: https://aws.amazon.com/marketplace/pp/prodview-4mbbt2ubpysso ; https://labelbox.com/blog/labelbox-expands-partnership-with-google-cloud-to-help-teams-build-ai-applications-faster/ ; https://www.micro1.ai/company-referral
- UK AISI evidence supports a specialist-evaluation wedge: a GBP19.5M early-market framework excluded generic integration, and a GBP5M award weighted quality 70%, price 20%, social value 10%. Sources: https://www.find-tender.service.gov.uk/Notice/001340-2025 ; https://www.find-tender.service.gov.uk/Notice/037042-2025/PDF
- Public benchmarks and technical research act as proof and lead generation, but decay/contamination and verifier gaming require refresh cadence, private holdouts, and version governance. Sources: https://vibrantlabs.com/research/mining-hard-tasks ; https://openai.com/index/trustworthy-third-party-evaluations-foundations/

## Operating model and economics

- Common quality stack: identity/skill screening, calibration against gold tasks, routing, production telemetry/validators, independent or consensus review, client acceptance/rework, and rubric iteration.
- Audited benchmarks show labor-heavy delivery is not SaaS economics: Appen FY2025 crowd expense was 59.7% of revenue and underlying EBITDA 5.4%; TaskUs FY2025 consolidated gross margin was about 37.8% and adjusted EBITDA 21%, with AI Services only part of revenue. Sources: https://announcements.asx.com.au/asxpdf/20260225/pdf/06wq7806yk1ll4.pdf ; https://ir.taskus.com/static-files/b6125cd3-8571-40f2-a8f0-0e7033fff501
- Transparent software/marketplace pricing provides benchmarks: Prolific corporate fee 42.8% on participant reward; Braintrust/LangSmith price scores/traces by usage; Browserbase prices browser runtime, proxy, and network services. Sources: https://www.prolific.com/pricing ; https://www.braintrust.dev/pricing ; https://www.langchain.com/pricing ; https://www.browserbase.com/pricing
- Expert environment COGS can be materially higher: Halluminate advertises $100-$250/hour specialists plus paid onboarding; Micro1 and other networks add double review, ops, tooling and possible client acceptance. Source: https://www.halluminate.ai/experts
- Network size claims are non-comparable; registered, waitlisted, worked-ever, weekly-active, credential-verified, and available-hour metrics must not be ranked as the same quantity.

## Strategic leads

- Strongest early thesis: enter through a paid contextual evaluation sprint, build a private maintained vertical Reliability Twin (workflow environment, task distribution, verifier suite, safety/side-effect cases, freshness operations), then extend into training/RFT data.
- Use open runtime rails and own proprietary tasks, artifacts, verifiers, mutation/freshness operations, and longitudinal failure/outcome data.
- Do not compete as a generic labor marketplace or generic AX studio. Use services as access and learning; productize the repeated environment/verifier substrate.
- Treat verifier assurance as its own product: metamorphic tests, false-pass audits, adversarial canaries, blinded holdouts, reward-hacking checks, and human-reviewed test validity. Sources: https://arxiv.org/abs/2604.15149 ; https://arxiv.org/abs/2605.20744
- Track net revenue, gross profit, accepted-artifact contribution margin, rework, payout lag, concentration, and freshness cost, not marketplace gross run-rate.

## Open expansion leads

- Resolve current funding/customer claims for Fleet, Refresh, Vibrant, and Halluminate.
- Verify Deeptune founder/funding chronology and the legal/current mechanics of the Mercor transaction.
- Expand Browserbase/Prime Intellect BrowserEnv and other environment-infrastructure comparables.
- Counter-search the newcomer Reliability Twin model against internal-build, open-source, and hyperscaler substitutes.
- Deepen buyer-demand evidence after the original buyer lane was blocked.
