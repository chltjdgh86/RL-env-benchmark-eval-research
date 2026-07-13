# Enterprise software support: candidate-level NO-GO

`enterprise_software_support` scores **62.0/100**. It independently fails qualification, so the five-candidate winner/10-point-lead comparison is not reached.

Research conditions:

- Search executed: `2026-07-12`
- Evidence cutoff: `2026-07-11`
- Network operations: configured Exa MCP only
- No post-cutoff evidence retained
- No generic search, browser, curl, subagents, or file edits
- Exact rubric: [local plan](/Users/sung/src/frist/RL-env-benchmark-eval-research/.omo/plans/rl-market-intelligence-site.md:119)
- Exact domain-class enum: `buyer_procurement | regulatory_registry | company_first_party | technical_repository | academic_primary | independent_reporting | investor_partner | secondary_discovery`

No receipt claimed `investor_partner`; searched classes below reflect actual returned territories, not merely requested source types.

## Exact weighted computation

| Dimension | Raw 0–5 | Converted | Weight | Numerator | Qualified rubric rung |
|---|---:|---:|---:|---:|---|
| `pain` | 4 | 4 | 20 | 80 | High-consequence service impact with two aligned primary audits |
| `willingnessToPay` | 5 | 5 | 20 | 100 | Multi-year public awards from two separate buyers |
| `rightsAccess` | 0 | 0 | 15 | 0 | Prohibited/unresolved access blocker |
| `verifierFeasibility` | 4 | 4 | 15 | 60 | Strong state checks plus adversarial validity evidence |
| `expertSupply` | 4 | 4 | 10 | 40 | Multiple workforce/training channels |
| `freshnessBurden` | 3 | `5−3 = 2` | 10 | 20 | Weekly refresh/change evidence |
| `incumbentPressure` | 4 | `5−4 = 1` | 10 | 10 | Major incumbents bundle the capability |
| **Total** |  |  |  | **310** | **310 ÷ 5 = 62.0** |

Gate evaluation:

- Full-precision score ≥70: **FAIL** — 62.0
- Every converted dimension ≥3: **FAIL** — rights `0`, freshness `2`, whitespace `1`
- Two separate buyer/procurement observations: **PASS** — O03 and O04
- No rights blocker: **FAIL** — `rightsBlocker=true`
- All nonmissing cells terminally closed: **PASS**
- Winner must lead the next candidate by ≥10: **not reached**, because this candidate is unqualified

No imputation was used.

## Source and observation ledger

`supportRelation` is relative to the candidate-benefit claim: high pain/payment/rights/verifier/supply and low freshness burden/incumbent pressure.

| ID | Source, date, class/control | Observed excerpt | Relation |
|---|---|---|---|
| S01/O01 | [Virginia JLARC — VITA multi-supplier review](https://jlarc.virginia.gov/pdfs/reports/Rpt525-2.pdf), 2019-10-07, `regulatory_registry`, independent | “multiple agencies have experienced prolonged problems with key VITA services…that have hindered their operations.” (19w) | `supports` |
| S02/O02 | [Victoria Auditor-General — Cenitex](https://www.audit.vic.gov.au/sites/default/files/2019-10/20191017-Cenitex-report.pdf), 2019-10-17, `regulatory_registry`, independent | “It met these only in two months and six months respectively over the 36-month period.” (15w) | `supports` |
| S03/O03 | [NHS Freshservice contract award](https://www.find-tender.service.gov.uk/Notice/037131-2024?origin=SearchResults&p=605), 2024-11-18, `buyer_procurement`, buyer-controlled | “The contract is for two years initially…with the option for an additional years extension.” (20w) | `supports` |
| S04/O04 | [Norway DFØ chatbot award](https://ted.europa.eu/en/notice/641773-2024/pdfs), 2024-10-23, `buyer_procurement`, buyer-controlled | “Value of all contracts awarded in this notice: 1 350 000,00 NOK” (12w) | `supports` |
| S05/O05 | [Gartner agentic-project cancellation forecast](https://www.gartner.com/en/newsroom/press-releases/2025-06-25-gartner-predicts-over-40-percent-of-agentic-ai-projects-will-be-canceled-by-end-of-2027), 2025-06-25, `independent_reporting`, not purchaser-controlled | “Over 40% of agentic AI projects will be canceled…due to escalating costs, unclear business value” (21w) | `contests` |
| S06/O06 | [Zendesk AI Services Addendum](https://www.zendesk.com/company/agreements-and-terms/ai-services-addendum/), 2026-05-06, `company_first_party`, **vendor-only** | “Customer is the sole owner of all Service Data which includes Customer AI Input and AI Output.” (17w) | `partially_supports` |
| S07/O07 | [Salesforce Main Services Agreement](https://www.salesforce.com/en-us/wp-content/uploads/sites/4/documents/legal/Salesforce_MSA.pdf), 2025-09-15, `company_first_party`, **vendor-only** | “The Services may not be accessed…for any other benchmarking or competitive purposes.” (23w) | `contradicts` |
| S08/O08 | [EDPS opinion on ECB Dynamics 365 CRM](https://www.edps.europa.eu/system/files/2022-04/21-07-08_edps_opinion_ecb_customer-management-system_en.pdf), 2021-07-07, `regulatory_registry`, regulator-authoritative | “the mitigating measures envisaged by the ECB are insufficient to mitigate the high risks it has identified.” (17w) | `contradicts` |
| S09/O09 | [WorkArena](https://arxiv.org/html/2403.07718v5), initially 2024-03-12, `academic_primary`, ServiceNow-affiliated | “The validation functions offer real-time feedback to agents” (8w) | `supports` |
| S10/O10 | [ServiceNow ITSM SafetyBench](https://github.com/ServiceNow/ServiceNow-itsm-safety-bench), 2026-06-02, `technical_repository`, **vendor-only technical artifact** | “Database diff — structured comparison of DB state before vs. after the simulation” (13w) | `supports` |
| S11/O11 | [The Art of Building Verifiers for Computer Use Agents](https://arxiv.org/html/2604.06240), 2026-04-05, `academic_primary`, Microsoft-affiliated | “We report a reduction in false positive rates to near zero compared to baselines…” (20w) | `supports` |
| S12/O12 | [Can Agent Benchmarks Support Their Scores?](https://arxiv.org/abs/2605.10448), 2026-05-11, `academic_primary`, independent | “When these checks rely on surface level signals…they cannot reliably determine whether the run succeeded.” (25w) | `contests` |
| S13/O13 | [BLS computer-user-support employment](https://www.bls.gov/oes/2023/May/oes151232.htm), 2023-05 vintage, `regulatory_registry`, official statistics | “Employment (1) … 689,700” (4w) | `supports` |
| S14/O14 | [DoD Technical Support Specialist Career Pathway](https://dl.dod.cyber.mil/wp-content/uploads/ccp/pdf/411-Technical-Support-Specialist-Career-Pathway.pdf), 2020-10, `regulatory_registry`, official | “411-Technical Support Specialist is a foundational entry point into the cyber workforce.” (12w) | `supports` |
| S15/O15 | [GAO State Department IT-workforce review](https://www.gao.gov/assets/gao-22-105932.pdf), 2022-07-12, `regulatory_registry`, government audit | “GAO identified 10 challenges related to State recruiting and retaining its IT workforce.” (13w) | `contests` |
| S16/O16 | [Atlassian Long Term Support releases](https://confluence.atlassian.com/security/long-term-support-releases-1409289267.html), modified 2024-07-01, `company_first_party`, **vendor-only** | “If you can manage only one feature release upgrade per year, we recommend upgrading…” (21w) | `supports` |
| S17/O17 | [Zendesk weekly release notes](https://support.zendesk.com/hc/en-us/articles/10904321914138-Release-notes-through-2026-06-12), 2026-06-12, `company_first_party`, **vendor-only** | “This week's release notes include:” (5w) | `contradicts` |
| S18/O18 | [Dynamics 365 service updates](https://learn.microsoft.com/en-us/dynamics365/guidance/implementation-guide/service-solution-service-updates), updated 2026-01-09, `company_first_party`, **vendor-only** | “Service updates are continuous, touchless updates that add new capabilities and fix issues.” (13w) | `contradicts` |
| S19/O19 | [Ada Lovelace Institute — Buying AI](https://www.adalovelaceinstitute.org/report/buying-ai-procurement/), 2024-10-01, `independent_reporting`, independent | “local government does not have access to a clear or comprehensive account of how to procure AI in the public interest.” (21w) | `partially_supports` |
| S20/O20 | [Salesforce Summer 2026 release](https://www.salesforce.com/news/stories/summer-2026-product-release-announcement/), 2026-05-11, `company_first_party`, **vendor-only** | “Salesforce is delivering over 50 specialized AI agents deployed out of the box…in your IT Service Desk” (21w) | `contradicts` |
| S21/O21 | [Microsoft Service Agent general availability](https://www.microsoft.com/en-us/dynamics-365/blog/it-professional/2026/06/30/service-agent-general-availability/), 2026-06-30, `company_first_party`, **vendor-only** | “Service Agent is powered by a robust MCP server designed for service tasks, and delivers 70+ new MCP tools” (19w) | `contradicts` |
| S22/O22 | [ServiceNow Now Assist release notes](https://www.servicenow.com/docs/r/store-release-notes/na-suite-rn-2026-05-05.html), 2026-05-05, `technical_repository`, **vendor-only** | “IT Service Management AI agent collection” (6w) | `contradicts` |

## Fourteen terminal receipts

All receipts use:

- `candidateId: enterprise_software_support`
- `searchedAt: 2026-07-12`
- `cutoffAt: 2026-07-11`

### R1 — `pain / positive`

ID: `rr-enterprise-software-support-pain-positive`

Exact query Q1:

> Find primary sources published on or before 2026-07-11 from enterprise buyers, public procurement bodies, regulators, government auditors, or academic researchers that document measurable recurring operating cost, ticket backlog, SLA breach, outage, customer-service harm, financial loss, or regulatory impact caused by enterprise software support, IT service management, help-desk, CRM case-resolution, or incident-resolution failures. Prefer concrete metrics and active budgets or procurements; exclude vendor marketing unless clearly labeled.

Searched classes: `buyer_procurement | regulatory_registry`

Retained: S01/O01, S02/O02.

Finding: Two independent government audits document prolonged operational impairment and repeated failure to meet severe-incident restoration targets. This qualifies raw `4`, not `5`: the search did not tie material exposure to active procurement by two separately affected buyers.

Terminal closure: `evidence_found`

### R2 — `pain / negative`

ID: `rr-enterprise-software-support-pain-negative`

Exact query Q1:

> Countersearch: find primary or independent sources published on or before 2026-07-11 showing enterprise software support, ITSM, help-desk, CRM case resolution, or incident resolution is low-consequence, improving, inexpensive, rarely causes material harm, or lacks measurable recurring buyer pain. Seek buyer metrics, regulator findings, academic evidence, or procurement cancellations that refute severe repeated operating, financial, service, safety, or regulatory impact; exclude unsupported vendor optimism.

Searched classes: `academic_primary | independent_reporting | secondary_discovery`

Retained: none; therefore no excerpt or purchaser observation.

Finding: Results contained process-improvement case studies and vendor-sponsored ROI material, but no primary or independent evidence that refuted the audited operational harms.

Terminal closure: `no_public_evidence`

### R3 — `willingnessToPay / positive`

ID: `rr-enterprise-software-support-willingness-to-pay-positive`

Exact query Q1:

> Find buyer-controlled procurement notices, contract awards, public spending records, annual reports, or official buyer case materials published on or before 2026-07-11 showing paid pilots, purchases, renewals, expansions, multi-year awards, or disclosed spend for enterprise software support automation, ITSM ticket resolution, CRM service agents, browser/computer-use agents, service-desk AI, or evaluation/assurance of those workflows. Identify distinct buyers and amounts or contract terms; do not treat seller claims as purchaser evidence.

Exact expansion Q2:

> Find official public procurement notices or contract awards published on or before 2026-07-11 for AI service desks, virtual support agents, automated ITSM ticket resolution, CRM customer-service agents, computer-use agents, or independent testing/evaluation of such agents. Return buyer name, award or estimated value, term, and whether it is an award, renewal, expansion, or only a tender; exclude ordinary software licenses unless they include support automation.

Searched classes: `buyer_procurement | secondary_discovery`

Retained: S03/O03, S04/O04.

Finding: NHS North East London awarded a two-year-plus-option Freshservice contract; Norway’s DFØ awarded a 2+1+1-year AI chatbot contract. This meets the literal raw-`5` public-award threshold. It does not establish payment for a separate independent evaluation product.

Terminal closure: `evidence_found`

### R4 — `willingnessToPay / negative`

ID: `rr-enterprise-software-support-willingness-to-pay-negative`

Exact query Q1:

> Countersearch: find buyer-controlled, procurement, audit, academic, or independent evidence published on or before 2026-07-11 that enterprises will not pay, have not renewed, cancelled or reduced spend, remain in unpaid pilots, cannot prove ROI, or prefer bundled/no-cost tools for AI support agents, ITSM or CRM ticket automation, browser/computer-use agents, or independent evaluation/assurance. Seek failed procurements and purchaser-side evidence; do not infer unwillingness merely from silence.

Searched classes: `company_first_party | independent_reporting | secondary_discovery`

Retained: S05/O05.

Finding: Gartner supplies independent evidence of unclear value, cost and forecast cancellations. It is not purchaser-controlled cancellation/non-renewal evidence; no such public record was found. It contests, but does not outweigh, the two observed awards.

Terminal closure: `evidence_found`

### R5 — `rightsAccess / positive`

ID: `rr-enterprise-software-support-rights-access-positive`

Exact query Q1:

> Find authoritative or buyer-controlled sources published on or before 2026-07-11 establishing lawful, documented access paths for using enterprise support or service-operations data in AI training, evaluation, or agent testing: ITSM tickets, CRM cases, internal knowledge bases, browser traces, computer-use traces, and production-resolution histories. Look for contractual rights, customer ownership, export/API access, consent or data-processing terms, deployment controls, retention, de-identification, and refresh rights; distinguish public samples or synthetic data from durable production-trace rights.

Searched classes: `company_first_party`

Retained: S06/O06, S07/O07. Both are vendor-controlled legal terms.

Finding: Zendesk gives customers ownership inside its service, but Salesforce restricts benchmarking and competitor access. No buyer-granted, durable, transferable third-party right to production traces, retention or refresh was found. Raw `0` applies.

Terminal closure: `rights_blocker`

### R6 — `rightsAccess / negative`

ID: `rr-enterprise-software-support-rights-access-negative`

Exact query Q1:

> Countersearch: find regulator, court, standards, buyer-security, procurement, or academic-primary sources published on or before 2026-07-11 showing blockers or unresolved constraints on third-party access to enterprise support traces, ITSM tickets, CRM cases, internal knowledge, browser recordings, credentials, or production-resolution histories for AI training/evaluation. Look for privacy, confidentiality, trade-secret, purpose-limitation, retention, cross-border, security, employee-monitoring, customer-consent, platform-contract, or deletion restrictions; distinguish a blocker from manageable controls.

Searched classes: `regulatory_registry | company_first_party | independent_reporting | secondary_discovery`

Retained: S08/O08.

Finding: The EDPS found the ECB’s proposed Dynamics 365 CRM safeguards insufficient. Combined with the lack of a lawful newcomer-access observation, this confirms the blocker.

Terminal closure: `rights_blocker`

### R7 — `verifierFeasibility / positive`

ID: `rr-enterprise-software-support-verifier-feasibility-positive`

Exact query Q1:

> Find official technical documentation, primary repositories, and academic-primary papers published on or before 2026-07-11 that demonstrate automated verification for enterprise software support, CRM, ITSM, service-desk, browser, or computer-use agent tasks. Prefer benchmarks such as WorkArena, BrowserGym, ITBench, CRM or ticket-resolution environments with database/state assertions, outcome checks, expert review, adversarial tests, false-pass measurement, metamorphic tests, or construct-valid multilayer evaluators.

Searched classes: `academic_primary | technical_repository | company_first_party`

Retained: S09/O09, S10/O10.

Finding: WorkArena provides validation/oracle functions; ITSM SafetyBench supplies database diffs, deterministic flags and adversarial-pressure scenarios. This qualifies raw `4`, not `5`.

Terminal closure: `evidence_found`

### R8 — `verifierFeasibility / negative`

ID: `rr-enterprise-software-support-verifier-feasibility-negative`

Exact query Q1:

> Countersearch: find academic-primary, official technical, repository, or independent evidence published on or before 2026-07-11 that enterprise-support, CRM, ITSM, browser, or computer-use agent evaluation is subjective, partially observable, gameable, brittle, contaminated, non-reproducible, or weakly correlated with real ticket resolution. Seek false-pass failures, benchmark limitations, dynamic UI drift, hidden-state problems, judge unreliability, and tasks requiring expert judgment that refute strong automated verifier feasibility.

Searched classes: `academic_primary`

Retained: S11/O11, S12/O12.

Finding: The countersearch was genuinely mixed. A multilayer computer-use verifier reported near-zero false positives, while a separate primary paper showed surface outcome checks can mis-score runs. Feasibility therefore survives only with state plus process/outcome evidence; no support-specific construct-valid metamorphic system justified raw `5`.

Terminal closure: `evidence_found`

### R9 — `expertSupply / positive`

ID: `rr-enterprise-software-support-expert-supply-positive`

Exact query Q1:

> Find regulator/statistical, buyer-controlled, academic-primary, or official workforce-program evidence published on or before 2026-07-11 showing a recruitable and calibratable supply of enterprise software support experts, service-desk agents, ITSM administrators, CRM administrators, support engineers, or domain SMEs for building and QA-ing support-agent environments. Prefer headcounts, multiple sourcing channels, certification or training pathways, calibration methods, QA, utilization, or repeatable staffing evidence; label vendor-only claims.

Exact expansion Q2:

> Find official U.S. Bureau of Labor Statistics or other national statistical agency pages, published on or before 2026-07-11, reporting employment counts, occupational outlook, entry pathways, training, and certifications for computer user support specialists, help-desk technicians, software support specialists, IT service management administrators, or CRM administrators; prioritize direct government pages and distinguish general support workers from platform-specific SMEs.

Searched classes: `regulatory_registry | academic_primary | secondary_discovery`

Retained: S13/O13, S14/O14.

Finding: BLS counted 689,700 computer-user-support specialists; DoD defines a foundational technical-support pathway. Multiple channels qualify raw `4`; repeatable QA/utilization evidence for raw `5` was absent.

Terminal closure: `evidence_found`

### R10 — `expertSupply / negative`

ID: `rr-enterprise-software-support-expert-supply-negative`

Exact query Q1:

> Countersearch: find government workforce statistics, buyer reports, academic studies, or independent evidence published on or before 2026-07-11 showing shortages, high turnover, scarce platform-specific administrators, limited SME time, difficult calibration, low QA consistency, or costly utilization for enterprise software support, ITSM, CRM, and support-engineering experts. Prefer measured supply constraints over vendor recruiting claims.

Exact expansion Q2:

> Find direct government, public-sector buyer, or academic-primary evidence published on or before 2026-07-11 measuring shortages, vacancies, turnover, recruitment difficulty, or scarce platform-specific skills among IT support specialists, service-desk workers, ServiceNow administrators, Salesforce administrators, CRM/ITSM experts, or support engineers; exclude staffing-vendor marketing.

Searched classes: `regulatory_registry | company_first_party | independent_reporting | secondary_discovery`

Retained: S15/O15.

Finding: GAO documents broad IT recruitment/retention challenges, but no retained source measured platform-specific administrator scarcity, calibration failure or support-evaluation QA capacity. It contests breadth without defeating raw `4`.

Terminal closure: `evidence_found`

### R11 — `freshnessBurden / positive`

ID: `rr-enterprise-software-support-freshness-burden-positive`

Exact query Q1:

> Find authoritative sources published on or before 2026-07-11 showing that enterprise software support, CRM, or ITSM workflows and evaluation environments can remain stable or be refreshed predictably at low burden. Look for long-term support policies, backwards-compatible APIs, standardized ticket schemas or ITIL workflows, fixed release cadences, version pinning, stable test instances, replayable traces, or maintenance intervals of quarterly or less frequent; distinguish standards stability from changing SaaS user interfaces and knowledge.

Searched classes: `company_first_party | technical_repository | secondary_discovery`

Retained: S16/O16, vendor-only.

Finding: Atlassian’s LTS policy supports yearly feature upgrades and a two-year support window, proving that some pinned environments can be refreshed predictably.

Terminal closure: `evidence_found`

### R12 — `freshnessBurden / negative`

ID: `rr-enterprise-software-support-freshness-burden-negative`

Exact query Q1:

> Countersearch: find official release documentation, buyer reports, repositories, academic-primary, or independent evidence published on or before 2026-07-11 showing enterprise support-agent environments require frequent or continuous refresh because SaaS UIs, APIs, permissions, knowledge bases, products, tickets, security controls, or browser behavior change. Seek daily/high-operations maintenance, benchmark breakage, release cadence, distribution drift, or lack of reliable replay; distinguish vendor release schedules from observed environment upkeep.

Exact expansion Q2:

> Find official ServiceNow, Salesforce, Microsoft Dynamics 365, Zendesk, and Atlassian documentation published on or before 2026-07-11 stating release cadence, automatic-update cadence, UI/API deprecations, mandatory upgrades, knowledge refresh requirements, or breaking changes relevant to maintaining browser-based ITSM/CRM/support-agent evaluation environments. Prefer official release notes and lifecycle policies over blogs.

Searched classes: `company_first_party | technical_repository | independent_reporting | secondary_discovery`

Retained: S17/O17, S18/O18; both vendor-only.

Finding: Zendesk documents weekly changes; Dynamics describes continuous updates, monthly update creation, automatically enabled UI changes, deprecations and required testing. This qualifies raw burden `3`. No measured daily/high-operations upkeep justified `4`.

Terminal closure: `evidence_found`

### R13 — `incumbentPressure / positive`

ID: `rr-enterprise-software-support-incumbent-pressure-positive`

Exact query Q1:

> Find buyer-controlled, procurement, regulator, academic, or independent evidence published on or before 2026-07-11 that indicates competitive whitespace or material unmet need for an independent enterprise-software-support agent evaluation and assurance environment. Look for limitations, lock-in concerns, weak cross-platform evaluation, missing independent verification, failed bundled tools, buyer demand for neutral assurance, or procurement requirements not satisfied by ServiceNow, Salesforce, Microsoft, Zendesk, Atlassian, SAP, Oracle, major observability vendors, or internal builds; label vendor-only evidence.

Exact expansion Q2:

> Find public procurement requirements, regulator guidance, buyer-controlled policies, or academic-primary studies published on or before 2026-07-11 that explicitly require independent, vendor-neutral, cross-platform testing or assurance of AI agents used in enterprise customer support, ITSM, CRM, browser, or computer-use workflows, or document that incumbent-native evaluation is inadequate. Do not count generic responsible-AI principles as buyer demand.

Searched classes: `buyer_procurement | regulatory_registry | academic_primary | technical_repository | company_first_party | independent_reporting | secondary_discovery`

Retained: S19/O19.

Finding: Independent research finds procurement-guidance, testing-access, metric and supplier-accountability gaps. This only partially supports whitespace; no support-specific purchaser demand for a neutral evaluator was found.

Terminal closure: `evidence_found`

### R14 — `incumbentPressure / negative`

ID: `rr-enterprise-software-support-incumbent-pressure-negative`

Exact query Q1:

> Countersearch: find official product and technical sources, buyer procurements, and independent analysis published on or before 2026-07-11 showing that major incumbents already bundle enterprise-support AI agents, ticket-resolution automation, browser/computer-use capabilities, observability, evaluation, governance, or assurance into ServiceNow, Salesforce, Microsoft, Zendesk, Atlassian, SAP, Oracle, hyperscaler, and observability platforms. Look for existing-distribution advantages, native data access, cross-platform offerings, low incremental price, or near-zero switching friction; label company-first-party evidence as vendor-only.

Exact expansion Q2:

> Find official product, pricing, and technical pages published on or before 2026-07-11 from ServiceNow, Salesforce, Microsoft, Zendesk, Atlassian, SAP, Oracle, Datadog, and major cloud providers showing bundled AI support agents, autonomous ticket resolution, computer-use/browser automation, native observability, evaluation, governance, or agent-assurance features in existing enterprise platforms. Identify distribution, native data access, and included or incremental pricing; treat all as vendor-only.

Exact currentness Q3:

> Find official first-party product releases, release notes, pricing updates, or technical documentation dated from 2026-04-12 through 2026-07-11 showing ServiceNow, Salesforce, Microsoft, Zendesk, Atlassian, SAP, Oracle, Datadog, or a hyperscaler bundling AI support agents, autonomous ticket resolution, browser/computer-use, agent observability, evaluation, governance, or assurance into an existing enterprise support/ITSM/CRM platform. Exclude anything published after 2026-07-11 and return exact publication dates.

Searched classes: `company_first_party | technical_repository | independent_reporting | secondary_discovery`

Retained: S20/O20, S21/O21, S22/O22; all vendor-only.

Finding: Fresh pre-cutoff sources show Salesforce shipping 50+ out-of-box IT agents, Microsoft Service Agent generally available with 70+ tools and evaluation insights, and ServiceNow shipping ITSM agents plus evaluator/governance components. This qualifies raw pressure `4`, not `5`: adoption, effectiveness and near-zero switching friction were not established.

Terminal closure: `evidence_found`

## Exa calls used

Exactly **29 configured Exa MCP calls**:

### Searches

1. `web_search_exa(R1.Q1, numResults=10)`
2. `web_search_exa(R3.Q1, numResults=10)`
3. `web_search_exa(R5.Q1, numResults=10)`
4. `web_search_exa(R7.Q1, numResults=10)`
5. `web_search_exa(R9.Q1, numResults=10)`
6. `web_search_exa(R11.Q1, numResults=10)`
7. `web_search_exa(R13.Q1, numResults=10)`
8. `web_search_exa(R2.Q1, numResults=10)`
9. `web_search_exa(R4.Q1, numResults=10)`
10. `web_search_exa(R6.Q1, numResults=10)`
11. `web_search_exa(R8.Q1, numResults=10)`
12. `web_search_exa(R10.Q1, numResults=10)`
13. `web_search_exa(R12.Q1, numResults=10)`
14. `web_search_exa(R14.Q1, numResults=12)`
15. `web_search_exa(R9.Q2, numResults=10)`
16. `web_search_exa(R10.Q2, numResults=10)`
17. `web_search_exa(R3.Q2, numResults=10)`
18. `web_search_exa(R12.Q2, numResults=10)`
19. `web_search_exa(R14.Q2, numResults=10)`
20. `web_search_exa(R13.Q2, numResults=10)`
21. `web_search_exa(R14.Q3, numResults=12)`

### Page retrievals

1. `web_fetch_exa(maxCharacters=12000)` — eight pain/WTP pages: Citizens audit, S01, S02, three NSW awards, S03 and S04.
2. `web_fetch_exa(maxCharacters=14000)` — seven rights pages: Salesforce privacy FAQ, S06, S07, S08, Canadian privacy finding, Microsoft supplier requirements and S09.
3. `web_fetch_exa(maxCharacters=15000)` — eight verifier pages: ITBench, CRMArena, S10, WorkArena++, S11, S12, False Success and the tool-calling validity audit.
4. `web_fetch_exa(maxCharacters=12000)` — six expert pages: S13, BLS requirements, O*NET, S14, UK digital-skills research and S15.
5. `web_fetch_exa(maxCharacters=14000)` — six freshness pages: Pega support policy, S16, Salesforce API EOL, S17, S18 and ServiceNow EOL guidance.
6. `web_fetch_exa(maxCharacters=14000)` — eight incumbent pages: UK procurement guidance, S19, OECD procurement research, ServiceNow AI Agents, Salesforce ITSM/pricing, ServiceNow product-tier documentation and its 2025 autonomous-IT release.
7. `web_fetch_exa(maxCharacters=10000)` — Gartner S05 and ITPro; ITPro returned no usable article body and was not retained.
8. `web_fetch_exa(maxCharacters=12000)` — currentness batch S20, S21 and S22.

The material conclusion is robust to the most favorable reasonable adjustment: even raising payment or supply cannot remove the independent rights blocker or repair the freshness and incumbent converted-score failures.