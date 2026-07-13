# The RL Economy: Market, Company, and Newcomer Synthesis

**Research cutoff:** 2026-07-11 · **Geography:** primarily United States and United Kingdom · **Scope:** RLHF, RLVR, expert data, RL environments, computer-use training, evaluations, AI assurance, and agent-experience / agentic-transformation consulting.

This file is the manifested pre-corpus research seed for the accompanying website. It consolidates at least 14 first-wave research lanes plus nested verification work and a second countersearch wave. The retained source registry contains 77 direct links across first-party product pages, regulatory filings, procurement notices, academic work, audited public-company reports, and independent reporting. The underlying search corpus was larger; an exact deduplicated count was not reconstructed, so no precise corpus total is claimed. After Todo 1 generates `research/synthesis/SYNTHESIS.md`, that generated file becomes the canonical research source of truth; this root seed is then deprecated and retained only as provenance.

## How to read the evidence

- **Confirmed** means a current first-party or primary source supports the fact and, where the claim is high-risk, another independent observation does not contradict it.
- **Vendor-reported** means a company is the only source for its revenue, customer, network, performance, or scale claim. It is evidence of positioning, not audited proof.
- **Reported / not closed** means credible reporting describes a financing, acquisition, or valuation discussion, but no closing evidence was found.
- **Inference** identifies our market or strategy interpretation. It is not presented as a fact.
- “Current” always means observed by the 2026-07-11 cutoff. Product catalogs, customer relationships, and transaction status can change quickly.

## Executive answer

The market did not begin as an “RL environment industry.” It formed through a sequence of changing purchased units: on-demand human tasks; managed labeled datasets; demonstrations and preferences for post-training; hard expert problems, traces, and rubrics; held-out evaluations and verifiers; stateful, resettable environments; and, most recently, whole-workflow agent improvement and transformation services. The layers coexist. Scale AI, Mercor, Micro1, Turing, and AfterQuery all retain labor-intensive expert-data operations even while their websites foreground environments, evaluation, and enterprise agents. [S01] [S09] [S16] [S21] [S26]

Demand for environments is real but the boundaries and economics of a standalone software market remain unproven. Epoch AI's interviews found contracts commonly in the high six to seven figures per quarter, but the evidence is anonymized and comes partly from suppliers; frontier labs multi-source and build internally. OpenEnv, Prime Intellect, Browserbase, and hyperscalers are standardizing or commoditizing the runtime layer. The scarce layer is increasingly the task/state corpus, construct-valid verifier, expert adjudication, private holdout, data rights, and refresh operation—not the existence of a reset/step API or a cloud browser. [S44] [S45] [S46] [S47]

The repeated go-to-market pattern is not self-serve SaaS. It is relationship-led, proof-driven managed delivery: technical relationship → NDA and sample → narrow paid pilot → acceptance evidence → embedded forward-deployed delivery → adjacent expansion → procurement wrapper. Public research, benchmarks, and open-source artifacts create credibility; contractor recruiting is a second, parallel acquisition funnel. Revenue quality depends on pass-through labor, rework, environment/runtime cost, and customer concentration, so gross annualized marketplace volume cannot be compared with SaaS ARR. [S11] [S22] [S31] [S52] [S53]

For a newcomer, a broad “agent reliability platform,” generic RL-environment foundry, labor marketplace, or generic AX consultancy is not a credible wedge. LangSmith already turns traces into clustered failure modes, evaluations, and improvement workflows; Browserbase plus Prime supplies browser runtime; AWS AgentCore bundles runtime, browser, identity, policy, observability, evaluation, and optimization at consumption pricing; large assurance firms already sell formal independent assurance. [S43] [S45] [S48] [S58] [S59] [S60]

The residual entrant idea is a **narrow Domain Assurance Pack** for a buyer that must make an external-evidence decision: a regulated release, safety case, procurement/model-selection decision, or high-consequence workflow launch. This is a pre-score research hypothesis, not a selected strategy; it must clear the website's scorecard and no-go gate before recommendation. If it clears, run it in the buyer's VPC or on-premises environment; export into AWS, LangSmith, Inspect, and OpenEnv; combine a rights-cleared private task/state corpus, expert-calibrated verifiers, hidden holdouts, adversarial validity checks, and a signed release/procurement evidence report. Do not call it certification or attestation without the relevant professional scope and accreditation. Partner or white-label into incumbent assurance and cloud channels. [S49] [S54] [S55] [S58] [S59] [S60]

## 1. How the market formed

| Era | Purchased unit | Buyer problem | Representative suppliers / artifacts | What became scarce |
|---|---|---|---|---|
| 2005–2016 | Human task / label | Convert unstructured inputs into machine-readable targets | Mechanical Turk, Appen, TELUS, Sama | Labor access, workflow tooling, QA |
| 2016–2020 | Managed dataset | Supply high-volume perception data with consistent acceptance | Scale's original human-labor API and autonomous-vehicle expansion [S01] | Program management, ontology, edge-case coverage |
| 2019–2023 | Demonstration / preference | Make language models helpful, safe, and instruction-following | RLHF research; Instruct-style data; Scale, Surge, Appen [S38] [S39] | Skilled raters, rubric design, disagreement handling |
| 2022–2025 | Expert hard task / trace | Push reasoning, coding, science, and professional capability | Mercor, Micro1, Turing, AfterQuery, Alignerr | Verified expertise, tacit knowledge, hard-task discovery |
| 2023–2026 | Evaluation / verifier | Measure capability, safety, regression, and readiness | METR, Gray Swan, Patronus, Braintrust, LangSmith, UK AISI | Construct validity, unseen tasks, baselines, independence |
| 2024–2026 | Stateful environment | Let agents act, receive feedback, reset, and train repeatedly | WebArena, OSWorld, tau-bench, SWE-bench; Deeptune, Fleet, Refresh, Halluminate [S40] [S41] [S42] | Realistic state, deterministic grading, freshness, runtime scale |
| 2025–2026 | Workflow outcome / assurance | Decide whether an agent should be bought, released, or expanded | AX studios, consultancies, domain assurance, AWS AgentCore | Outcome evidence, governance, access rights, procurement trust |

The key structural shift is from **rows to worlds**. Static prompt-response data remains useful for SFT and preference optimization, but computer-use and tool-using agents expose path-dependent failure. The commercial object becomes a versioned world with initial states, tasks, allowed actions, trajectories, and outcome verifiers. Interactive benchmarks such as WebArena, SWE-bench, OSWorld, and tau-bench accelerated this shift. [S40] [S41] [S42]

## 2. Technical and commercial taxonomy

### 2.1 Training objectives are not market segments

- **RLHF** names a feedback provenance and training family: humans provide demonstrations, comparisons, critiques, or reward-model labels used to optimize a policy. [S38]
- **RLAIF** replaces or augments human feedback with model-generated preferences or critiques. Human specification and auditing still matter.
- **DPO** is an offline preference-optimization objective. It is not a substitute for data sourcing, environment execution, or evaluation, and should not be charted as a peer “industry.” [S39]
- **RLVR** uses rewards that can be checked—tests, exact answers, database state, policy constraints, or other verifiers. “Verifiable” does not mean valid: a brittle or gameable verifier can reward the wrong behavior.
- **SFT, preference optimization, and online RL** can all consume artifacts produced by the same expert/environment pipeline. The training algorithm does not define the vendor category.

### 2.2 Environment, benchmark, evaluation, and assurance

A useful commercial environment has: resettable state; observation and action interfaces; a task and initial-state distribution; execution/logging; and one or more verifiers or reward functions. A benchmark is a held-out task suite plus scoring protocol. One environment can support both training and evaluation, but the data, versions, access, and governance must be separated to prevent leakage and self-confirmation. Prime's current contract and OpenEnv's `reset`, `step`, and `state` interface show the runtime layer converging toward standards. [S44] [S46]

Evaluation asks a claim-specific question about a model or agent under a defined harness. OpenAI's third-party playbook distinguishes capability elicitation, safeguard performance, and comparison, and calls out reward hacking, refusal, contamination, broken tasks, and sandbagging as validity hazards. [S49]

Assurance is broader: it turns technical and governance evidence into confidence for a decision-maker. Formal assurance, attestation, or certification has professional and accreditation implications. A startup can issue a technical assessment report; it should not imply AICPA assurance or ISO certification without the required authority. PwC, Deloitte, and BSI already occupy those formal categories. [S58] [S59] [S60]

### 2.3 “AX” has two meanings

1. **Agent Experience:** make a product legible and operable to agents—stable interfaces, machine-readable state, safe actions, identity, observability, and recovery. [S61]
2. **Agentic transformation consulting:** redesign a workflow, integrate agents with tools and data, define governance and human escalation, measure outcomes, and support adoption. [S62]

They overlap but are not the same market. A product team may buy Agent Experience work without a broad transformation program; an enterprise may buy transformation services without changing a public product for third-party agents.

### 2.4 Value-chain diagram

```mermaid
flowchart LR
  A[Rights-cleared domain access] --> B[Experts and source workflows]
  B --> C[Tasks, rubrics, seed states]
  C --> D[Resettable environment]
  D --> E[Model trajectories]
  E --> F[Automated verifiers]
  F --> G[Expert adjudication]
  G --> H[Training mixture]
  G --> I[Private evaluation holdout]
  H --> D
  I --> J[Release / procurement evidence]
  J --> K[Production traces]
  K --> C
```

The production loop is hybrid: experts specify and seed; models generate candidate trajectories and tasks; automated filters and verifiers reduce cost; experts resolve ambiguity and audit false passes; versioning and hidden holdouts protect decision quality. The feedback loop only compounds if contracts permit reuse. Many customers will prohibit third-party access or cross-client reuse, so a reusable “data flywheel” is a hypothesis until rights are explicit.

## 3. Company landscape at a glance

| Company | Original wedge | Current center of gravity | Primary buyer | GTM pattern | Evidence caveat |
|---|---|---|---|---|---|
| Scale AI | General API for outsourced human tasks (2016) | Data foundry, RLHF/expert data, evaluations, RL environments, applied AI | Frontier labs, government/defense, large enterprises | Landmark customer relationships, platform + managed delivery, public research | Meta deal is a minority investment, not an acquisition; 2025 revenue reports conflict |
| Mercor | Automated recruiting and cross-border hiring (2023) | Expert network, APEX evals, datasets, enterprise agents, environments | Frontier labs and enterprises | Marketplace flywheel, founder/researcher sales, product adjacency | Run rate is gross marketplace revenue; $20B valuation is talks; Deeptune close unknown |
| Micro1 | AI-vetted remote recruiting/staffing (2022) | Realm environments, Cortex contextual evals, expert data, robotics | Labs, Fortune-scale enterprises, robotics teams | AI interview supply engine, paid pilots, account expansion | New run-rate and customer breadth are mostly vendor-reported |
| Turing | Remote developer talent cloud (2018) | Data Packs, RL environments, benchmarks, ALAN, expert network, enterprise AI services | Frontier labs and enterprises | Technical sample under NDA, forward-deployed delivery, research proof | $300M run rate/profitability vendor-reported; funding totals conflict |
| AfterQuery | Expert post-training data and FinanceQA-style work (2025) | SFT/RL data, rubrics, agent environments, computer-use trajectories, FDE | Frontier labs and professional-work enterprises | Research-led, expert network, custom in-house tooling | $100M run rate and “every lab” claims unaudited; one strong NVIDIA proof point |
| Fleet AI | Fleet Context developer retrieval/data tool (2023) | High-fidelity training gyms with human supervision | Labs, hyperscalers, enterprises | Applied-research positioning, technical talent, bespoke deployment | Round, valuation, and revenue reports remain unconfirmed |
| Deeptune | AI dubbing before pivot | Computer-use/code training gyms and enterprise-app simulations | Frontier labs and enterprises | Small technical team, deep bespoke builds, strategic investor/customer ties | $43M A confirmed; Mercor announced it “will acquire,” terms/close unknown |
| Refresh | Operative browser-agent testing | Coding, MCP/tool, and computer-use environments with verifiable rewards | Labs and enterprises | YC/founder-led technical sale, failure-first environment construction | Small young team; traction and funding beyond YC are thinly evidenced |
| Vibrant Labs | Ragas open-source LLM evaluation | Autonomous hard-task mining and adaptive RL environments | Labs and agent teams | Open-source/research credibility, pilot-led sale | Scale/customer claims mainly vendor-supplied |
| Halluminate | Open evaluation/browser-agent work | Finance/professional-services RL gyms and expert problem network | Labs building professional agents | Open benchmarks + narrow vertical expert supply | Funding/lab-customer detail undisclosed; named Yutori work is strongest public proof |

## 4. Company dossiers

### 4.1 Scale AI

**How it started.** Scale launched through Y Combinator in 2016 as an API for on-demand human labor—data extraction, calls, and categorization—not as an autonomous-vehicle-only company. It found a high-value wedge in perception labeling, then expanded from computer-vision data operations into language-model post-training, safety/evaluation, public-sector applications, and agent environments. [S01] [S05]

**What it sells now.** Managed data and expert programs; model evaluation and red teaming; RL environments; and applied AI systems through a mix of software, workforce, research, and forward-deployed services. [S02] [S03]

**Who buys.** Frontier labs, government/defense agencies, and large enterprises with high-volume or sensitive model programs. The GTM motion combines deep technical relationships and landmark programs with a procurement-ready enterprise/public-sector wrapper.

**Current status and caveats.** Meta disclosed a $13.8B minority investment and stated it does not control or exert significant influence over Scale; describing the transaction as an acquisition is wrong. [S04] A reported forecast of roughly $2B 2025 revenue conflicts with later reporting of actual revenue below $1B. Scale's January 2026 profitability language is not an audited whole-company margin disclosure. Rival-lab movement after the Meta transaction is mixed and time-sensitive. [S06] [S07]

**Strategic read.** Scale's moat is operating history, security/procurement maturity, workforce and delivery systems, and the ability to bundle data, evals, environments, and applications. Its vulnerability is perceived neutrality, customer concentration, workforce controversy, and the difficulty of maintaining premium quality across many domains.

### 4.2 Mercor

**How it started.** Mercor began operating in January 2023 as an automated recruiting marketplace, using AI interviews and matching to place cross-border talent. That same supply, screening, contracting, work-tracking, and payment system became an engine for expert-created training and evaluation data. [S08]

**What it sells now.** The current surface spans Work, Hire, Evaluate, and Build: expert contracting, APEX workflow evaluations, datasets/rubrics, enterprise agent work, and—through the announced Deeptune transaction—RL environments. Recruiting remains live; expert data and environments are the strategic center. [S09] [S13]

**Who buys and how it sells.** Frontier labs buy domain experts and task/verifier production; enterprises buy hiring, evaluation, and agent-building. Mercor uses a dual marketplace: recruit experts with flexible/high-skill work, then sell that capacity through founder/research relationships and managed projects. Network reputation and buyer reputation reinforce each other.

**Current status and caveats.** The last confirmed financing is a $350M Series C at a $10B valuation; 2026 reports of a $20B valuation describe talks, not a closed round. [S10] The $1B–$2B annualized figure is gross marketplace volume, not SaaS ARR. Mercor says it paid more than $2M per day to over 30,000 weekly active contractors; independent reporting put contractor pass-through around 60–70%, leaving a much smaller net-revenue base. [S11] [S12] Five million network profiles are not five million active workers. A 2026 security incident, resulting customer pauses/litigation, worker-classification questions, and customer concentration are material operating risks. [S14]

**Deeptune transaction.** Mercor said on 2026-07-09 that it “will acquire” Deeptune and that the team will join. Purchase price, legal closing date, and integration milestones were not disclosed; it should be labeled announced/agreed, not completed. [S13]

### 4.3 Micro1

**How it started.** Micro1 began in 2022 around AI-vetted recruiting and managed remote talent. Its Zara interview system created a reusable supply and screening engine. By spring 2025, public positioning shifted toward expert human data for model training and evaluation. [S15]

**What it sells now.** Realm provides realistic RL environments and task data; Cortex evaluates production agents in context; Robotics targets embodied-system data; the broader platform recruits and operates expert workforces and business-data partnerships. [S16] [S17] [S18] [S19]

**Who buys and how it sells.** Frontier labs and large AI teams buy expert data and environments; enterprises buy contextual evaluation and data partnerships; robotics teams buy real-world data. Public cases show narrow programs expanding after acceptance—examples include expert teams growing from 10 to 20 to 24 and coding programs from 20 to 60—consistent with pilot-to-expansion GTM. [S31] [S76]

**Current status and caveats.** A $35M Series A at a $500M valuation is confirmed by the company and independent reporting. [S15] Later valuation offers/discussions are not closed financing. Run-rate figures above $200M and broad customer claims are management reports. Microsoft's relationship is the clearest named proof; several other logos are supplier-side assertions. A historical 40% margin disclosure predates the current data/environment mix and should not be projected forward.

### 4.4 Turing

**How it started.** Turing was founded in 2018 as an AI-powered global developer talent cloud. Public company history marks a 2022 expansion into model-training work, consistent with the wider shift from remote staffing to coding data and post-training. [S20]

**What it sells now.** AGI Advancement includes Frontier Data Packs, RL environments, benchmarks, ALAN quality workflows, high-end experts, and Project Lazarus for acquiring operational/code artifacts. Enterprise services retain an Advise / Augment / Build transformation motion, and legacy talent supply remains active. [S21] [S22] [S23] [S24]

**Who buys and how it sells.** Frontier labs buy expert datasets, coding/reasoning work, environments, and evaluations; enterprises buy custom AI systems and technical capacity. Turing offers scoped experiments and, in one case-study motion, an RL-workflow sample shortly after NDA, then expands into repeatable environments and forward-deployed programs. [S22]

**Current status and caveats.** Turing advertises more than 1,000 UI and non-UI environments; this is a vendor count whose unit and production usage are not independently audited. [S22] NVIDIA has independently described use of Turing data packs, and ServiceNow work offers a stronger enterprise-environment proof than anonymous logos. The reported $300M run rate and profitability are company-reported; funding totals vary across Turing's own and secondary materials. A four-million-person network is a registered supply pool, not active production capacity.

### 4.5 AfterQuery

**Identity and start.** The relevant company is AfterQuery at `afterquery.com`, a Y Combinator W25 company founded in 2025. Current YC materials identify Spencer Mateega and Carlos Georgescu; the original launch text also described Danny as part of the founding team, while current first-party pages omit him. The unresolved change should not be papered over. [S25]

**What it sells now.** Expert-curated SFT data, reasoning traces, RL prompts and rubrics, API/MCP agent environments, computer-use trajectories, custom data programs, and forward-deployed implementation. It also acquires failed-startup or private codebases as training/evaluation assets. [S26] [S27]

**Who buys and how it sells.** Frontier labs are the core stated customer; professional-work enterprises supply or consume finance, legal, medical, software, and office-work expertise. GTM is research-led: publish a benchmark or hill-climb result, demonstrate an expert-data asset, then sell custom delivery and embedded support.

**Current status and caveats.** A $30M Series A at a $300M valuation announced on 2026-04-09 is confirmed first-party. [S27] The same post's $100M revenue run rate, nearly 100,000 verified professionals, and “every leading AI lab” language are unaudited vendor claims. NVIDIA's Nemotron 3 Ultra technical report independently names AfterQuery tasks, providing one unusually strong external usage proof. [S28] Treat OpenAI/Anthropic customer claims as reported, not confirmed by those labs.

### 4.6 Fleet AI

**Identity and start.** The relevant entity is Fleet AI at `fleetai.com` (historically `fleet.so`), not transportation software or the unrelated French “FLEET AI.” Nicolai Ouporov is founder/CEO; public history also associates Andrew Zhou with the founding team. Fleet Context appeared in 2023 as a CLI/API and embeddings corpus for current Python-library knowledge. [S29] [S30]

**Evolution and current offer.** The company subsequently marketed bespoke agents in finance/insurance and now describes itself as an applied research lab that builds high-fidelity training gyms where agents practice real work under human supervision. Current pages name labs, hyperscalers, and enterprises as buyer categories. [S30]

**GTM and operating model.** Technical artifacts and founder relationships created the initial wedge; the current model appears bespoke and forward-deployed, pairing environment engineers with remote domain experts. Confirmed current supporters shown on the company site include Sequoia, Menlo, and SV Angel.

**Caveats.** Reports of a $45M round, $725M valuation, and rapid revenue growth rest on anonymous or thin secondary accounts and were not corroborated with a company announcement or filing. Treat them as unverified. Public evidence for named production customers is also limited.

### 4.7 Deeptune

**How it started and pivoted.** Deeptune was founded by Tim Lupo and Lukas Schmit and initially worked on AI dubbing. It pivoted around 2025 to high-fidelity computer-use and code simulations—“training gyms”—that recreate workplace applications and provide tasks, datasets, and infrastructure. [S32]

**What it sells and to whom.** Bespoke training/evaluation environments for frontier labs and enterprises, with hundreds of simulated apps claimed. The team is small and engineering-heavy, making deep environment construction rather than labor-marketplace scale its initial advantage.

**Funding and current status.** Deeptune announced a $43M Series A led by a16z on 2026-03-19; a16z independently confirmed leading it. [S32] [S33] A related SEC filing recorded roughly $42.2M and included SAFE conversion mechanics, so seed and Series A totals should not be casually added. Mercor's July announcement is prospective; price and close are unknown. [S13]

### 4.8 Refresh

**How it started.** Refresh is the current brand of Operative AI, Inc. The team previously presented Operative as browser-agent testing for coding-agent changes, then narrowed toward simulation environments. YC identifies founders Christopher Settles and Erik Quintanilla, founding year 2025, Spring 2025 batch, active status, and an eight-person team at the cutoff. [S34] [S35]

**What it sells now.** Coding environments, long-horizon MCP/tool gyms, and high-fidelity computer-use software worlds, each built around tasks with verifiable rewards. The company says it finds frontier-model failures, reproduces them, codifies them into tasks, and validates that they remain hard. [S34]

**Who buys and how it sells.** Frontier labs and enterprises evaluating or hill-climbing agents. The motion is founder-led and technically demonstrative: a small bespoke environment or dataset proves fit, then expands. Traction, pricing, and funding beyond YC participation remain sparsely disclosed.

### 4.9 Vibrant Labs

**How it started.** Vibrant Labs is associated with Exploding Gradients, Inc. and grew from Ragas, an open-source LLM evaluation project. That gave it an evaluation-developer audience before it moved into autonomous RL data and adaptive environments. [S36]

**What it sells now.** Hard-task mining, unsupervised/adaptive environment design, verifiers, and environment generation for API/tool-using agents in domains such as ITSM, health, finance, and support. Its thesis is that model-driven mining can find tasks inside a target model's learnable-but-unsolved range. [S36]

**GTM and caveats.** Open-source adoption and technical research create inbound credibility; pilots convert that credibility into bespoke work. A Yutori-related pilot is the clearest public implementation signal. A reported $2.5M pre-seed and broad enterprise/customer statistics are not equally well corroborated; claims such as “80% of Fortune” should remain vendor-reported unless the unit and customer confirmations are disclosed.

### 4.10 Halluminate

**How it started.** Halluminate was founded in 2024 by Jerry Wu and Wyatt Marshall. Its earlier public artifacts included open API evaluation, WebBench/BrowserBench, and computer-use evaluation. Westworld, released with Yutori in 2025, demonstrated task-centric simulators and state-based RLVR-style verification. [S75] [S68]

**What it sells now.** The 2026 homepage is explicitly “RL environments for financial services,” focused on investment banking, private equity, and consulting workflows. Its expert network builds problems, ground-truth deliverables, rubrics, and evaluations. [S37]

**Supply and GTM.** Halluminate recruits US-based 1099 professionals, advertises $100–$250/hour by role/performance, requires substantial weekly availability, and pays a $3,000 milestone for successful training. This is an unusually transparent view of expert COGS before internal review, tooling, runtime, and rework. Public benchmarks attract lab attention; a narrow finance network supports high-value managed projects. [S37]

**Caveats.** Yutori is a named public collaborator. Older Athena/Amplitech cases are historical vendor evidence. Funding amount, frontier-lab customers, price, and margins are undisclosed.

## 5. How these businesses operate

### 5.1 The common production system

1. **Acquire supply or rights.** Recruit generalists, credentialed experts, code/data owners, or workflow partners.
2. **Screen and calibrate.** Verify identity and skills; run gold tasks; measure disagreement and policy compliance.
3. **Design work.** Translate a capability gap into tasks, rubrics, seed states, interfaces, and acceptance criteria.
4. **Produce and observe.** Experts or models generate demonstrations, comparisons, trajectories, adversarial cases, or environment states.
5. **Verify.** Apply deterministic tests where possible, model-based judges where necessary, and independent/consensus review for ambiguity.
6. **Accept, rework, and learn.** Client acceptance feeds rubric and routing changes; failed calibrations and rework are real variable cost.
7. **Version and hold out.** Separate training from private evaluation; mutate or refresh tasks as models and source systems change.
8. **Expand.** Move from one domain or capability to adjacent data, eval, environment, and deployment work.

### 5.2 The repeatable GTM motion

```mermaid
flowchart LR
  R[Researcher / founder relationship] --> D[Diagnostic + NDA]
  D --> P[Narrow paid pilot]
  P --> A[Acceptance evidence]
  A --> F[Forward-deployed program]
  F --> E[Adjacent expansion]
  E --> M[Marketplace / procurement vehicle]
  A --> C[Case study / benchmark]
  C --> R
```

The buyer is often a research lead, post-training lead, agent/product engineering leader, or AI safety/evaluation lead; procurement, security, legal, and data-governance stakeholders enter after technical fit. Enterprise AX adds a business owner and change/adoption lead. Public-sector assurance adds evaluation-methodology and contract-framework requirements.

The best proof is not a logo wall. It is an artifact chain: fixed task definition, blinded baseline, intervention, held-out result, validity checks, limitations, and a buyer-relevant decision. Published benchmark work can seed trust, but public tasks decay through contamination and optimization. OpenAI and Anthropic both emphasize unseen tasks, SME involvement, expert baselines, reproducibility, and claim-specific validity. [S49] [S50]

### 5.3 Channels

- Direct founder/researcher relationships and referrals.
- Technical research, benchmarks, open-source projects, leaderboards, and reproducibility artifacts.
- Expert referral programs and high-status flexible work—the supply-side brand is as important as buyer-side marketing.
- Forward-deployed engineers and program managers embedded in a lab or enterprise team.
- Cloud marketplaces and cloud/platform partnerships that reduce vendor onboarding. [S57]
- Public frameworks and specialist procurements. UK evidence shows quality can dominate price, but also that generic integration may be out of scope. [S56] [S77]
- Customer-to-investor, investor-to-customer, and acquisition relationships, illustrated by Mercor/Deeptune.

## 6. Economics: what the headline metrics hide

### 6.1 Seven operating models

| Model | Revenue unit | Principal variable costs | Natural advantage | Core risk |
|---|---|---|---|---|
| Open marketplace | Buyer spend / take rate | Worker payout, payments, trust/safety | Liquidity and breadth | Low control, classification, fraud |
| Managed contractors | Accepted hour/task/artifact | Creator, reviewer, PM, rework | Flexible specialization | Pass-through optics and utilization |
| Employee BPO | FTE/hour/project | Payroll, facilities, management | Process control | Fixed utilization and wage inflation |
| Expert data/environment studio | Milestone, task pack, environment | High expert rates, environment engineering, compute | Scarce knowledge + deep delivery | Concentration and bespoke creep |
| Evaluation SaaS | Seats, traces, scores, runs | Model judging, storage, support | Recurring workflow integration | Platform bundling and metric commoditization |
| Runtime infrastructure | Browser/sandbox/GPU minute | Compute, proxy, network, orchestration | Scale and reliability | Cloud price competition |
| Proprietary data acquisition | Dataset/license/asset | Rights, cleaning, security, provenance | Unique lawful corpus | Reuse restrictions and liability |

### 6.2 Benchmarks and formula

Audited public-company results are a useful guardrail: Appen's FY2025 crowd expense was about 59.7% of revenue and underlying EBITDA margin 5.4%; TaskUs reported roughly 37.8% consolidated gross margin and 21% adjusted EBITDA, with AI Services only part of its mix. These are not direct valuations of private RL-environment startups, but they show why labor-heavy delivery should not be modeled like software. [S52] [S53]

Prolific's public corporate pricing provides a transparent marketplace reference; Halluminate publishes $100–$250/hour specialist rates before the vendor's review, tooling, runtime, sales, and overhead. Browserbase, LangSmith, and Braintrust expose usage-metered software/runtime prices, illustrating a different gross-margin structure. [S37] [S63] [S64] [S65] [S66]

The useful contribution equation is:

> **Accepted-artifact contribution** = buyer price − creator payout − reviewer/adjudicator payout − failed calibration/rework − model/runtime/proxy cost − variable support/security cost.

Track accepted-artifact contribution margin, gross profit, time-to-acceptance, rework, payout lag, utilization, concentration, verifier false-pass rate, and freshness cost. Do not rank “registered experts,” “evaluated users,” “weekly active,” and “worked-ever” as if they were the same capacity metric.

### 6.3 Demand and TAM caution

Epoch's interviews support meaningful current RL-environment budgets, but do not establish a durable, broad, high-margin standalone market. [S47] Gartner predicts that more than 40% of agentic AI projects will be cancelled by the end of 2027 because of cost, unclear value, or inadequate controls. Reliability spend follows material production intent and decision value; it should not be extrapolated from every agent proof-of-concept. [S67]

## 7. Adjacent competitive landscape

The named companies sit inside a much larger system. Boundaries are porous and consolidation is active.

| Segment | Representative companies / projects | Competitive role |
|---|---|---|
| Scaled data operations | Appen, TELUS Digital, Sama, iMerit, CloudFactory, TaskUs, Surge AI | General/managed labeling, RLHF, content/safety, enterprise delivery |
| Expert data networks | Labelbox/Alignerr, Toloka, Prolific, Handshake, Invisible, DataAnnotation | Recruit, vet, route, and pay experts; substitute for named companies' supply |
| Programmatic/synthetic data | Snorkel AI, Gretel, MOSTLY AI, Scale synthetic tooling | Reduce manual labeling and generate targeted distributions |
| Evaluation platforms | LangSmith, Braintrust, Arize Phoenix, W&B Weave, Langfuse, Patronus, Giskard, Confident AI/DeepEval, Maxim | Observability, datasets, graders, experiment comparison, online monitoring |
| Independent/safety evaluation | METR, Gray Swan, Apollo Research, UK AISI, US CAISI, Inspect ecosystem | Decision-relevant third-party capability and safeguard assessment |
| Environment/runtime infrastructure | Prime Intellect, OpenEnv, Browserbase, E2B, Modal, Together AI, Fireworks AI, Hugging Face | Standard APIs, browser/sandbox execution, training compute, model/runtime rails |
| Computer-use / agent testing | BrowserGym, OSWorld, WebArena, tau-bench, Momentic, Browserbase/Stagehand | Benchmarks, browser control, end-to-end testing, task execution |
| Formal assurance / consulting | PwC, Deloitte, BSI, Accenture, McKinsey, BCG | Governance, transformation, audit-grade testing, attestation/certification channels |
| Vertical agent operators | Harvey, Sierra, Decagon, Hebbia, medical/finance/legal agents | Can build proprietary evals and environments internally; potential buyers or substitutes |

Important market-state caveats:

- Humanloop announced a sunset and its team joined Anthropic; do not list it as an unchanged independent incumbent.
- Cleanlab was acquired by Handshake; W&B's ownership/transaction status must be checked at display time rather than assumed from old category maps.
- Deeptune is under an announced Mercor acquisition agreement, not safely treated as a permanently independent peer. [S13]
- Infrastructure categories are converging. AWS AgentCore's modular stack and Prime/Browserbase/OpenEnv make generic orchestration and runtime less defensible. [S44] [S45] [S48]

## 8. Competitive dynamics

### What incumbents are actually good at

- **Scale:** procurement, security, program scale, multimodal history, public-sector reach, bundled applied AI.
- **Mercor / Micro1:** rapid expert acquisition, vetting, contracting, payment, and managed-work expansion.
- **Turing:** developer/expert network plus enterprise delivery and a broad research/product catalog.
- **AfterQuery:** research-led expert data and a strong recent named training-use proof.
- **Deeptune / Fleet / Refresh:** environment engineering and tight lab-facing technical delivery.
- **Vibrant:** evaluation/open-source credibility and automated hard-task mining.
- **Halluminate:** a deliberately narrow finance/professional-services expert network and public simulation artifact.
- **Platforms:** workflow integration, telemetry, low marginal pricing, and distribution.
- **Big Four / standards bodies:** buyer trust, professional scope, governance, and formal assurance/certification authority.

### Where the market remains weak

- Construct validity and verifier gaming are less visible than task count or environment count.
- Most public performance and revenue claims are supplier-authored.
- Private holdouts, contamination controls, and environment freshness are operationally expensive.
- Customer access and reuse rights can prevent cross-client data compounding.
- Neutrality becomes harder when a supplier is invested in, acquired by, or commercially close to a model provider.
- Long-tail vertical workflows need technical, legal, and domain knowledge simultaneously.
- A buyer can assemble runtime, tracing, and standard evaluators internally; only decision-relevant domain evidence justifies a specialist premium.

## 9. Wave-two countersearch: what *not* to build

The initial hypothesis—a contextual-evaluation sprint that grows into a broad “Reliability Twin”—did not survive countersearch unchanged.

1. **Generic trace-to-fix loop: occupied.** LangSmith clusters traces into failure modes, supports online/offline evaluation and human review, and now proposes diagnoses and improvements. A prettier reliability loop is not a moat. [S43]
2. **Browser execution: commodity rail.** Browserbase and Prime's BrowserEnv handle cloud browser orchestration, execution, and evaluation/training integration; Browserbase's own positioning says the differentiating input can be the task dataset. [S45]
3. **Horizontal agent stack: bundled.** AWS AgentCore offers runtime, browser, identity, policy, observability, evaluations, and optimization as modular consumption-priced services. Competing head-on requires no plausible distribution or cost advantage. [S48]
4. **Independent assurance: occupied.** PwC performs Assurance for AI under AICPA standards, Deloitte sells audit-grade AI testing/assurance, and BSI certifies ISO/IEC 42001 management systems. “We are independent” alone is not differentiation. [S58] [S59] [S60]
5. **Generic enterprise willingness-to-pay: not proven.** The clearest public demand for third-party independence concerns frontier safety, public procurement, and decisions with external accountability—not ordinary internal QA. OpenAI and Anthropic support external evaluation in safety/advanced-capability contexts. [S49] [S50] [S51]
6. **Data flywheel: contract-dependent.** Confidentiality and data rights may prevent the supplier from retaining states, traces, tasks, or failure patterns. Bring code to data and export aggregate evidence; treat reusable cross-client learning as unproven until signed.

## 10. Pre-score newcomer hypothesis: Domain Assurance Packs

The Domain Assurance Pack is a research-derived candidate for the website's competitive scorecard. It is not the final recommended wedge unless it passes that scorecard and every no-go gate below.

### 10.1 Ideal customer profile

Qualify only buyers that answer **yes** to all of these:

- A real workflow is headed toward production, purchase, release, or regulated review—not a curiosity pilot.
- A named decision-maker needs external evidence for a safety case, release gate, procurement/model selection, regulator, board, or customer.
- Failure has material financial, safety, compliance, or contractual consequence.
- The buyer can grant controlled access to domain experts, workflow artifacts, or a representative VPC/on-prem test environment.
- The buyer will fund refresh and revalidation after models, tools, or policies change.

Disqualify generic internal QA and low-value prototypes; AWS, LangSmith, open-source tools, or the buyer's own team are adequate there. [S43] [S48] [S67]

### 10.2 The product

The candidate Domain Assurance Pack is a portable, sealed evidence package for one narrow workflow, initially in a domain where the team has exceptional technical and professional access.

1. Claim and threat model: exactly what purchase/release assertion is being tested.
2. Rights-cleared task/state corpus generated from real workflow evidence.
3. Buyer-hosted execution in its VPC/on-prem environment where confidentiality demands it.
4. Expert-calibrated deterministic, metamorphic, and rubric verifiers.
5. Hidden holdout and canary suite, separated from training/tuning.
6. False-pass audit, reward-hacking tests, contamination review, broken-task review, and adversarial edge cases.
7. Baselines across relevant models/harnesses with cost, latency, tool use, side effects, and task success.
8. Signed technical release/procurement report: claim, method, evidence, limitations, residual risk, and reproducible export.
9. Connectors/export to AWS AgentCore, LangSmith, Inspect, and OpenEnv rather than replacing them.
10. Refresh contract tied to source-system, policy, model, and task-distribution drift.

The defensibility is the **methodology + domain expert network + sealed holdout/verifier validation record + portability**, not horizontal UI or runtime. Formal assurance partners can incorporate the pack into broader work; the newcomer should not claim certification or attestation.

### 10.3 Initial verticals

Score a vertical on external-evidence need, task verifiability, cost of failure, access to rights-cleared data, buyer concentration, and incumbent depth. Plausible examples include financial operations, clinical administration, regulated customer communications, insurance claims, security operations, and public-sector casework. Do not select purely from market size: select the one where founders can obtain expert access and signed data rights fastest.

### 10.4 GTM sequence

```mermaid
flowchart TD
  Q[External-evidence decision?] -->|No| N[Disqualify: use internal/platform QA]
  Q -->|Yes| D[2-week paid diagnostic]
  D --> P[4-8 week Domain Assurance Pack]
  P --> R[Release / procurement decision]
  R --> M[Quarterly refresh + regression]
  P --> W[White-label into PwC/Deloitte/BSI/sector advisor]
  P --> A[AWS Marketplace / platform connector]
  M --> T[Optional training/RFT data only with explicit rights]
```

**Pricing should be discovered, not asserted.** A sensible experiment is fixed-price diagnostic → milestone-priced first pack → annual/quarterly refresh. Any numbers used in a business plan are hypotheses until paid conversion; gross margin must include experts, adjudication, environment engineering, runtime, security, and rework.

### 10.5 First 90 days

- Choose one workflow and recruit 3–5 respected domain advisers plus one assurance/procurement design partner.
- Interview 20–30 decision owners about an actual upcoming release or purchase; reject calls without a dated decision.
- Build 20–50 private tasks in the buyer's environment with an explicit task-rights schedule.
- Run at least two models/harnesses; manually inspect every trajectory before automating graders.
- Measure verifier false passes, inter-rater agreement, task breakage, contamination, outcome correlation, and full delivery cost.
- Deliver one report that changes a real decision; obtain permission for an anonymized methodology case study.
- Ship exporters to existing rails instead of a replacement observability platform.

### 10.6 Twelve-month expansion

- Convert the first pack into a versioned vertical library with signed reuse boundaries.
- Establish blinded benchmark governance and independent methodology review.
- Add refresh/mutation operations and evidence diffing across model/tool versions.
- Partner with one formal assurance provider and one cloud/procurement channel.
- Expand only into adjacent workflows that reuse at least two of: expert network, state model, verifier family, regulatory mapping, or buyer channel.
- Offer training trajectories/RFT tasks only after leakage controls and reuse rights are contractually separated from holdouts.

### 10.7 Kill criteria

Stop or pivot if, after a focused validation period:

- Buyers want dashboards but no external decision report.
- No buyer will permit controlled workflow access or pay for a VPC/on-prem engagement.
- Verifier false-pass rates remain too high for the decision stakes.
- Each workflow requires wholly new experts, integrations, and methodology, preventing reuse.
- Procurement insists on credentials/attestation the team cannot lawfully provide and no partner will sponsor.
- Refresh cost consumes the contribution margin.
- Buyers refuse all reusable rights and one-off pricing cannot support a services business.

## 11. Contradictions, unknowns, and abstentions

| Topic | What the evidence says | Synthesis treatment |
|---|---|---|
| Scale–Meta | SEC: $13.8B minority investment, no control/significant influence | Not an acquisition [S04] |
| Scale 2025 revenue | Early $2B forecast vs later below-$1B reporting | Do not use $2B as actual revenue [S06] [S07] |
| Mercor valuation | $10B Series C closed; $20B later talks | Current confirmed valuation is $10B [S10] |
| Mercor revenue | Gross annualized marketplace volume with large contractor pass-through | Never label it SaaS ARR [S11] [S12] |
| Deeptune acquisition | “Will acquire”; team planned to join | Announced/agreed, close and terms unknown [S13] |
| Micro1 valuation | $500M A closed; later higher indications reported | Use $500M only as confirmed [S15] |
| Turing economics | $300M run rate/profitability self-reported; funding totals conflict | Vendor-reported; no audited margin claim |
| AfterQuery scale | A confirmed; $100M run rate / every-lab / expert counts self-reported | Use as vendor claims; NVIDIA use is independently named [S27] [S28] |
| Fleet scale | Investors visible; financing/revenue reports thin | Do not present round, valuation, or run rate as confirmed [S30] |
| Refresh founding | YC says 2025; one structured-data trace has shown 2024 elsewhere | Prefer YC 2025, note identity-history uncertainty [S35] |
| Vibrant traction | Product and research clear; customer/scale metrics mostly self-reported | Do not infer broad adoption [S36] |
| Halluminate economics | Expert rates visible; customer, revenue, funding, margins not | Use rates only as supply-cost evidence [S37] |
| RL-environment market size | Meaningful contracts reported; no clean standalone category accounts | Demand supported; durable TAM/margins/moat unresolved [S47] |
| Newcomer data moat | Potential reusable failure taxonomy vs customer confidentiality | Unproven until contracts grant reuse rights |
| Enterprise assurance WTP | Stronger in safety/public sector/external decisions than generic QA | Narrow ICP; do not generalize frontier-safety demand |

## 12. Methodology and limitations

Research was decomposed into company origins/current operations, technical taxonomy, market history, GTM, economics, buyer evidence, adjacent competitors, and entrant strategy. First-wave lane owners searched first-party sites, archived/current product materials, filings, independent press, procurement notices, academic work, job pages, pricing, and case studies. Nested specialists resolved company identities and financing/status conflicts. Wave two actively searched for substitutes and refutations of the proposed entrant thesis.

No private financials, customer contracts, or interviews were available to this project. Paywalled reporting was used only where the lane could identify the supported proposition; unsupported details were not promoted. Exact revenue, margin, customer, worker, funding, and valuation claims are explicitly downgraded when first-party-only, prospective, gross, or conflicting. There were no code-shaped market claims suitable for executable verification; verification consisted of source triangulation, primary-source preference, and countersearch. The final website itself requires separate build and browser verification.

## Sources

[S01]: https://www.ycombinator.com/blog/scale/ "YC: Scale is an API for human labor (2016)"
[S02]: https://scale.com/about "Scale current company overview"
[S03]: https://scale.com/rlenvironments "Scale RL environments"
[S04]: https://www.sec.gov/Archives/edgar/data/1326801/000162828026025534/meta-12312025x10kars.htm "Meta 2025 Form 10-K"
[S05]: https://scale.com/blog/scale-ai-series-f "Scale Series F and company chronology"
[S06]: https://news.bloomberglaw.com/artificial-intelligence/scale-ai-expects-to-more-than-double-sales-to-2-billion-in-2025 "Scale 2025 revenue forecast reporting"
[S07]: https://www.forbes.com/sites/richardnieva/2026/05/14/scale-meta-deal/ "Later Scale revenue reporting"
[S08]: https://www.mercor.com/blog/1/ "Mercor launch and origin"
[S09]: https://www.mercor.com/mission/ "Mercor mission, chronology, and current surface"
[S10]: https://www.mercor.com/blog/series-c/ "Mercor Series C"
[S11]: https://www.mercor.com/blog/when-you-go-from-2-million-a-month-to-2-million-a-day/ "Mercor gross run rate and contractor activity"
[S12]: https://www.theinformation.com/briefings/exclusive-mercor-hit-1-billion-annualized-revenue-breach "Mercor gross/net economics reporting"
[S13]: https://www.mercor.com/blog/mercor-to-acquire-deeptune/ "Mercor announced Deeptune acquisition"
[S14]: https://www.wired.com/story/meta-pauses-work-with-mercor-after-data-breach-puts-ai-industry-secrets-at-risk/ "Mercor security incident reporting"
[S15]: https://www.micro1.ai/series-a "Micro1 Series A and company strategy"
[S16]: https://www.micro1.ai/ "Micro1 current product overview"
[S17]: https://www.micro1.ai/realm "Micro1 Realm"
[S18]: https://www.micro1.ai/cortex "Micro1 Cortex"
[S19]: https://www.micro1.ai/robotics "Micro1 Robotics"
[S20]: https://www.turing.com/pt/company "Turing company history"
[S21]: https://www.turing.com/advance "Turing AGI Advancement"
[S22]: https://www.turing.com/advance/rl-environments "Turing RL environments"
[S23]: https://go.turing.com/llm-data-packs "Turing Frontier Data Packs"
[S24]: https://research.turing.com/project-lazarus "Turing Project Lazarus"
[S25]: https://www.ycombinator.com/companies/afterquery "YC AfterQuery profile and launch text"
[S26]: https://www.afterquery.com/ "AfterQuery products"
[S27]: https://www.afterquery.com/blog/human-expertise-reimagined "AfterQuery Series A and vendor metrics"
[S28]: https://research.nvidia.com/labs/nemotron/files/NVIDIA-Nemotron-3-Ultra-Technical-Report.pdf "NVIDIA Nemotron 3 Ultra technical report"
[S29]: https://pypi.org/project/fleet-context/ "Fleet Context package history"
[S30]: https://www.fleetai.com/about "Fleet current company and training-gym position"
[S31]: https://www.micro1.ai/case-study/business-data "Micro1 business-data expansion case"
[S32]: https://deeptune.com/blog/series-a/ "Deeptune Series A and current thesis"
[S33]: https://a16z.com/announcement/investing-in-deeptune/ "a16z investment in Deeptune"
[S34]: https://refresh.dev/ "Refresh current environments"
[S35]: https://www.ycombinator.com/companies/refresh "YC Refresh profile"
[S36]: https://vibrantlabs.com/research/mining-hard-tasks "Vibrant Labs hard-task mining"
[S37]: https://www.halluminate.ai/experts "Halluminate product/expert operating model"
[S38]: https://arxiv.org/abs/2204.05862 "Anthropic helpful and harmless RLHF"
[S39]: https://arxiv.org/abs/2305.18290 "Direct Preference Optimization"
[S40]: https://arxiv.org/abs/2307.13854 "WebArena"
[S41]: https://arxiv.org/abs/2404.07972 "OSWorld"
[S42]: https://arxiv.org/abs/2406.12045 "tau-bench"
[S43]: https://www.langchain.com/langsmith-platform "LangSmith agent engineering platform"
[S44]: https://huggingface.co/openenv "OpenEnv standard"
[S45]: https://www.browserbase.com/blog/browserenv "Browserbase and Prime BrowserEnv"
[S46]: https://docs.primeintellect.ai/verifiers/environments "Prime Intellect environment contracts"
[S47]: https://epoch.ai/gradient-updates/state-of-rl-envs "Epoch AI RL environments industry interviews"
[S48]: https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/ "Amazon Bedrock AgentCore overview"
[S49]: https://openai.com/index/trustworthy-third-party-evaluations-foundations/ "OpenAI third-party evaluation playbook"
[S50]: https://www.anthropic.com/news/a-new-initiative-for-developing-third-party-model-evaluations "Anthropic third-party evaluation initiative"
[S51]: https://openai.com/index/strengthening-safety-with-external-testing/ "OpenAI external testing"
[S52]: https://announcements.asx.com.au/asxpdf/20260225/pdf/06wq7806yk1ll4.pdf "Appen FY2025 results"
[S53]: https://ir.taskus.com/static-files/b6125cd3-8571-40f2-a8f0-0e7033fff501 "TaskUs FY2025 results"
[S54]: https://www.gov.uk/government/publications/trusted-third-party-ai-assurance-roadmap/trusted-third-party-ai-assurance-roadmap "UK trusted third-party AI assurance roadmap"
[S55]: https://www.gov.uk/government/publications/assuring-a-responsible-future-for-ai/assuring-a-responsible-future-for-ai "UK AI assurance strategy"
[S56]: https://www.find-tender.service.gov.uk/Notice/037042-2025/PDF "UK procurement award evidence"
[S57]: https://aws.amazon.com/marketplace/pp/prodview-vmzygmggk4gms "LangSmith on AWS Marketplace"
[S58]: https://www.pwc.com/us/en/services/audit-assurance/digital-assurance-transparency/assurance-ai.html "PwC Assurance for AI"
[S59]: https://www.deloitte.com/nl/en/services/audit-assurance/services/algorithm-ai-assurance.html "Deloitte AI assurance"
[S60]: https://www.bsigroup.com/en-GB/products-and-services/standards/iso-42001-ai-management-system/ "BSI ISO/IEC 42001 certification"
[S61]: https://agentexperience.ax/ "Agent Experience definition"
[S62]: https://www.deloitte.com/cbc/en/what-we-do/capabilities/agentic-ai.html "Agentic AI transformation services"
[S63]: https://www.prolific.com/pricing "Prolific pricing"
[S64]: https://www.braintrust.dev/pricing "Braintrust pricing"
[S65]: https://www.langchain.com/pricing "LangSmith pricing"
[S66]: https://www.browserbase.com/pricing "Browserbase pricing"
[S67]: https://www.gartner.com/en/newsroom/press-releases/2025-06-25-gartner-predicts-over-40-percent-of-agentic-ai-projects-will-be-canceled-by-end-of-2027 "Gartner agentic-project cancellation forecast"
[S68]: https://www.halluminate.ai/blog/westworld "Halluminate Westworld"
[S69]: https://www.langchain.com/blog/how-we-built-langsmith-engine-our-agent-for-improving-agents "LangSmith Engine"
[S70]: https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/evaluations.html "AgentCore Evaluations"
[S71]: https://aws.amazon.com/bedrock/agentcore/pricing/ "AgentCore pricing"
[S72]: https://www.fleetai.com/ "Fleet current home page"
[S73]: https://vibrantlabs.com/ "Vibrant Labs current home page"
[S74]: https://research.turing.com/ "Turing Research"
[S75]: https://www.ycombinator.com/companies/halluminate "YC Halluminate profile and launch history"
[S76]: https://www.micro1.ai/case-study/competitive-programmers "Micro1 competitive-programmer expansion case"
[S77]: https://www.find-tender.service.gov.uk/Notice/001340-2025 "UK AISI specialist evaluation framework notice"
