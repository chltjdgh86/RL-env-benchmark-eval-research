# Result: `public_sector_administration` is a no-go

As of the 2026-07-11 cutoff, the candidate scores **64.0/100**. It fails both the ≥70 score gate and the requirement that every converted dimension score be ≥3: `incumbentPressure` converts to **1**.

All seven cells are evidence-backed; no conservative-missing imputation was needed. Searches ran on 2026-07-12 using only Exa. No dated result after the cutoff was retained.

## Exact scoring

| Dimension | Measured raw | Conversion | Converted | Weight | Numerator |
|---|---:|---|---:|---:|---:|
| `pain` | 4 | benefit | 4 | 20 | 80 |
| `willingnessToPay` | 4 | benefit | 4 | 20 | 80 |
| `rightsAccess` | 3 | benefit | 3 | 15 | 45 |
| `verifierFeasibility` | 3 | benefit | 3 | 15 | 45 |
| `expertSupply` | 3 | benefit | 3 | 10 | 30 |
| `freshnessBurden` | 2 | `5 − 2` | 3 | 10 | 30 |
| `incumbentPressure` | 4 | `5 − 4` | 1 | 10 | 10 |

```text
rawWeightedScore
= (4×20 + 4×20 + 3×15 + 3×15 + 3×10 + (5−2)×10 + (5−4)×10) / 5
= (80 + 80 + 45 + 45 + 30 + 30 + 10) / 5
= 320 / 5
= 64.0
```

Gate results:

- Full-precision score ≥70: **FAIL — 64.0**
- Every converted dimension ≥3: **FAIL — incumbent whitespace = 1**
- Two separate buyer/procurement observations: **PASS**
- `rightsBlocker=false`: **PASS, narrowly**, for accredited/de-identified research and sandbox access—not general live-case deployment
- All nonmissing cells closed: **PASS**
- ≥10-point winner lead: not evaluated; this candidate does not qualify
- Decision: **`no_go`**

## The 14 receipt lanes

`searchedAt=2026-07-12`; `cutoffAt=2026-07-11`. Exa has no native domain-class parameter, so `searchedDomainClasses` records the exact enum territories deliberately targeted and inspected.

### 1–2. `pain`

**R01 — positive**

- Queries: `Q01`, `Q15`
- `searchedDomainClasses`: `buyer_procurement | regulatory_registry | academic_primary`
- Retained: `S01/O01–O02`, `S03/O03`
- Finding: SSA’s backlog rose from 3.2 million to 4.6 million actions, delayed actions produced approximately $1.1 billion in improper payments, and academic-primary work quantifies very large repetitive workload.
- Closure: **`evidence_found`**
- Raw: **4** — high-consequence service/financial impact with aligned regulator and academic-primary observations. Not 5 because the pain lane did not establish active procurement tied to the exposure from two buyers.

**R02 — countersearch**

- Queries: `Q02`, `Q16`
- Same domain classes
- Retained: `S02/O04–O05`, `S04/O06`
- Finding: Universal Credit and a Canadian process-mining intervention show that localized workflows can perform well or improve materially. The same NAO source says DWP overall missed expected standards, so the countersearch did not overturn recurring pain.
- Closure: **`evidence_found`**

### 3–4. `willingnessToPay`

**R03 — positive**

- Query: `Q03`
- `searchedDomainClasses`: `buyer_procurement | regulatory_registry | company_first_party | independent_reporting`
- Retained: `S05/O07–O08`, `S06/O09`
- Finding: Two named government buyers entered real procurement processes: an estimated £8.33 million UK tender and a D.C. price schedule with a $200,000 base plus annual options.
- Closure: **`evidence_found`**
- Raw: **4** — at least two separate procurement buyers. Not 5 because the UK record is a tender with discretionary later phases, while only the D.C. record supplies a clear price/option schedule.

**R04 — countersearch**

- Query: `Q04`
- Same domain classes
- Retained: `S07/O10`, `S08/O11`
- Finding: An official NYC audit found more than $100 million spent with little delivered, while independent research identified 61 cancelled or paused automated-decision systems. This contests interpreting spend as effectiveness, but does not show buyer-wide unwillingness to procure.
- Closure: **`evidence_found`**

### 5–6. `rightsAccess`

**R05 — positive**

- Query: `Q05`
- `searchedDomainClasses`: `buyer_procurement | regulatory_registry | academic_primary | independent_reporting`
- Retained: `S09/O12–O14`
- Finding: The Ministry of Justice documents an accredited, de-identified administrative-data path with safe rooms, approved remote desktops and Safe Pods.
- Closure: **`evidence_found`**
- Raw: **3** — one documented lawful path. Not 4 because it is a controlled research-access regime, not multiple documented operational deployment-rights arrangements.

**R06 — countersearch**

- Query: `Q06`
- Same domain classes
- Retained: `S10/O15`, `S11/O16`
- Finding: Scottish impact assessment and a federal court record demonstrate material purpose, privacy and access constraints. They do not establish a blanket prohibition on de-identified research access.
- Closure: **`evidence_found`**
- `rightsBlocker`: **false only for the narrow research/sandbox scope**. Live operational data would require a new rights determination.

### 7–8. `verifierFeasibility`

**R07 — positive**

- Query: `Q07`
- `searchedDomainClasses`: `buyer_procurement | regulatory_registry | technical_repository | academic_primary`
- Retained: `S12/O17`, `S13/O19`
- Finding: Public-benefits policies can be translated into executable rules with human oversight, and the DOL/CDLE collaboration built a sandbox measuring expert quality and case outcomes.
- Closure: **`evidence_found`**
- Raw: **3** — substantial automated state/outcome checking plus expert review. Not 4 because strong adversarial validity, false-pass or metamorphic evidence was not demonstrated.

**R08 — countersearch**

- Query: `Q08`
- Same domain classes
- Retained: `S12/O18`, `S13/O20`, `S14/O21`
- Finding: Chatbots produced confidently incorrect outputs; the CDLE intervention did not improve quality or efficiency against its sandbox control; earlier welfare automation materially reduced enrollment.
- Closure: **`evidence_found`**

### 9–10. `expertSupply`

**R09 — positive**

- Query: `Q09`
- `searchedDomainClasses`: `buyer_procurement | regulatory_registry | academic_primary | independent_reporting`
- Retained: `S15/O22`, `S16/O23–O24`
- Finding: Government-commissioned and buyer-controlled studies document recruiting, onboarding, training, feedback and professional-development paths for operational delivery and child-welfare caseworkers.
- Closure: **`evidence_found`**
- Raw: **3** — documented recruitment/training path. The multiple channels observed in child welfare were not generalized to reliable candidate-wide public-administration supply.

**R10 — countersearch**

- Query: `Q10`
- Same domain classes
- Retained: `S17/O25`, `S24/O26`
- Finding: SSA identifies human capital as a management challenge, and Commerce OIG found staffing gaps, high vacancies and inadequate workforce planning.
- Closure: **`evidence_found`**

### 11–12. `freshnessBurden`

**R11 — positive**

- Queries: `Q11`, `Q17`
- `searchedDomainClasses`: `buyer_procurement | regulatory_registry | technical_repository | academic_primary`
- Retained: `S18/O27`, `S19/O28`
- Finding: Core benefit uprating has a predictable annual cycle, evidenced by corresponding 2025 and 2026 statutory instruments.
- Closure: **`evidence_found`**

**R12 — countersearch**

- Queries: `Q12`, `Q18`
- Same domain classes
- Retained: `S20/O29–O31`
- Finding: Operational decision guidance was amended in April, May and June 2026, establishing a monthly rather than merely annual refresh burden.
- Closure: **`evidence_found`**
- Raw burden: **2** — monthly. Converted freshness score: **3**.

### 13–14. `incumbentPressure`

**R13 — positive**

- Query: `Q13`
- `searchedDomainClasses`: `buyer_procurement | company_first_party | academic_primary | independent_reporting | secondary_discovery`
- Retained counter-observation: `S23/O32–O33`
- Finding: No procurement-, buyer- or academic-primary evidence established an absence of credible substitutes. The best independent result instead described long-term vendor contracting, lock-in and vendor capture.
- Closure: **`no_public_evidence`**

**R14 — countersearch**

- Query: `Q14`
- Same domain classes
- Retained: `S21/O34–O36`, `S22/O37–O38`
- Finding: Buyer-controlled procurement records show Deloitte bundled with Salesforce, Microsoft and AWS in child welfare, while Canada awarded immigration case-management work to Accenture alongside Microsoft contracts.
- Closure: **`evidence_found`**
- Raw pressure: **4** — major incumbents and hyperscalers are bundled. Not 5 because near-zero switching friction was not proven. Converted whitespace: **1**.

## Source ledger

| ID | Source and date | Type / role | Domain class |
|---|---|---|---|
| S01 | [SSA OIG — Reducing Processing Centers’ Pending Actions](https://oig.ssa.gov/assets/uploads/022313.pdf), 2024-06-28 | `regulatory_record`; regulator-authoritative | `regulatory_registry` |
| S02 | [NAO — DWP customer service](https://www.nao.org.uk/reports/dwp-customer-service/), 2024-07-23 | `regulatory_record`; regulator-authoritative | `regulatory_registry` |
| S03 | [AI for bureaucratic productivity](https://www.turing.ac.uk/sites/default/files/2024-03/ai_for_bureaucratic_productivity.pdf), 2024-03; day not exposed | `academic_primary`; independent | `academic_primary` |
| S04 | [Using Process Mining to Improve Digital Service Delivery](https://arxiv.org/html/2409.05869), 2024-08-23 | `academic_primary`; independent | `academic_primary` |
| S05 | [MHCLG Augmented Planning Decisions](https://www.find-tender.service.gov.uk/Notice/086054-2025), 2025-12-16 | `procurement_record`; buyer-controlled | `buyer_procurement` |
| S06 | [D.C. DGS IRIS sole-source procurement](https://dgs.dc.gov/sites/default/files/dc/sites/dgs/event_content/attachments/DCAM-24-NC-SS-0008%20%28Iris%20AI%20Native%20Platform%29.pdf), publication day not exposed; internal FY24 schedule | `procurement_record`; buyer-controlled | `buyer_procurement` |
| S07 | [NYC Comptroller — MyCity audit](https://comptroller.nyc.gov/reports/audit-report-on-the-new-york-city-office-of-technology-and-innovations-mycity-system/), 2025-12-30 | `regulatory_record`; regulator-authoritative | `regulatory_registry` |
| S08 | [Automating Public Services: Learning from Cancelled Systems](https://carnegieuk.org/wp-content/uploads/2024/10/Automating-Public-Services-Learning-from-Cancelled-Systems-Final-Full-Report-2.pdf), 2022-09 | `independent_reporting`; independent | `independent_reporting` |
| S09 | [Ministry of Justice — Data First User Guide](https://assets.publishing.service.gov.uk/media/683863d5c99c4f37ab4e867c/Data_First_User_Guide_Version_8.2.pdf), 2025-05 | `buyer_first_party`; buyer-controlled | `buyer_procurement` |
| S10 | [Scottish social-security DPIA](https://www.gov.scot/publications/social-security-amendment-scotland-bill-data-protection-impact-assessment-updated-april-2025/pages/3/), 2025-04-28 | `regulatory_record`; authoritative | `regulatory_registry` |
| S11 | [U.S. District Court memorandum opinion](https://www.govinfo.gov/content/pkg/USCOURTS-mdd-1_25-cv-00596/pdf/USCOURTS-mdd-1_25-cv-00596-5.pdf), 2025-04-17 | `regulatory_record`; court-primary | `regulatory_registry` |
| S12 | [AI-Powered Rules as Code](https://digitalgovernmenthub.org/publications/ai-powered-rules-as-code-experiments-with-public-benefits-policy/), 2025-03-24 | `academic_primary`; original experiments | `academic_primary` |
| S13 | [Evaluating Generative AI in Benefits Administration](https://tobin.yale.edu/sites/default/files/2026-01/CDLE_AI_Jan13_2026.pdf), 2026-01; day not exposed | `academic_primary`; academic/buyer collaboration | `academic_primary` |
| S14 | [NBER — When Automation Goes Wrong](https://www.nber.org/papers/w31437), 2023-07-10 | `academic_primary`; independent | `academic_primary` |
| S15 | [Effective Professional Development Design in a Civil Service Context](https://assets.publishing.service.gov.uk/media/6895e6663080e72710b2e2de/Effective_Professional_Development_Design_in_a_Civil_Service_Context.pdf), 2025-05 | `buyer_first_party`; commissioned systematic review | `buyer_procurement` |
| S16 | [ACF — Child Welfare Workforce Training](https://acf.gov/opre/report/child-welfare-workforce-onboarding-training-and-professional-development), 2025-09-04 | `buyer_first_party`; buyer-controlled | `buyer_procurement` |
| S17 | [SSA FY2025–2026 Annual Performance Plan](https://www.ssa.gov/agency/performance/materials/2026/SSA_FYs2025-2026_APP.pdf), as of 2025-05 | `buyer_first_party`; buyer-controlled | `buyer_procurement` |
| S18 | [Social Security Benefits Up-rating Order 2025](https://www.legislation.gov.uk/uksi/2025/295/made), 2025-03-12 | `regulatory_record`; statutory | `regulatory_registry` |
| S19 | [Social Security Benefits Up-rating Order 2026](https://www.legislation.gov.uk/uksi/2026/148/made), 2026-03-02 | `regulatory_record`; statutory | `regulatory_registry` |
| S20 | [Advice for Decision Making — summary of changes](https://assets.publishing.service.gov.uk/media/6a0f0b28065847719dd7b484/adm-summary-of-changes.pdf), 2026-06 | `buyer_first_party`; official guidance | `regulatory_registry` |
| S21 | [NC DHHS child-welfare system award](https://www.ncdhhs.gov/cws642023/open), 2023-09-27 | `procurement_record`; buyer-controlled | `buyer_procurement` |
| S22 | [CanadaBuys — IRCC Case Management Platform](https://canadabuys.canada.ca/en/tender-opportunities/contract-history/cw2375337-004), award 2024-09-19; modified 2026-04-29 | `procurement_record`; buyer-controlled | `buyer_procurement` |
| S23 | [Provisioning Digital Tools and Systems for Government Use](https://www.law.georgetown.edu/tech-institute/wp-content/uploads/sites/42/2024/09/Provisioning-Digital-Tools-and-Systems-for-Government-Use.pdf), 2024-09 | `other`; independent academic concept paper | `secondary_discovery` |
| S24 | [Commerce OIG — Census staffing gaps](https://www.oig.doc.gov/wp-content/OIGPublications/OIG-25-013-I_Final_Report.pdf), 2025-03-13 | `regulatory_record`; regulator-authoritative | `regulatory_registry` |

S06 contains a clerical identifier inconsistency: its header/URL use `DCAM-24-NC-SS-0008`, while page footers show `0002`. Buyer, scope and price schedule remain explicit, but the discrepancy prevents treating it as pristine evidence.

## Observation ledger

Relations are to the proposition tested by the named receipt. Every excerpt is verbatim and at most 25 words.

| Obs. | Receipt | Source | Observed excerpt | `supportRelation` |
|---|---|---|---|---|
| O01 | R01 | S01 | “The PC pending actions backlog increased from 3.2 million in FY 2018 to 4.6 million in FY 2023.” | `supports` |
| O02 | R01 | S01 | “the improper payment amount had increased to approximately $1.1 billion.” | `supports` |
| O03 | R01 | S03 | “saving even an average of just one minute per complex transaction would save the equivalent of approximately 1,200 person-years of work every year.” | `supports` |
| O04 | R02 | S02 | “Universal Credit performing well on payment timeliness and telephony.” | `supports` |
| O05 | R02 | S02 | “DWP’s customer service has fallen short of the expected standards over recent years” | `contradicts` |
| O06 | R02 | S04 | “overall process time from around 31 days to 26 days, on average.” | `partially_supports` |
| O07 | R03 | S05 | “Total value (estimated) £8,333,333.33 excluding VAT” | `supports` |
| O08 | R03 | S05 | “Contract dates (estimated): 22 January 2026 to 22 May 2028” | `supports` |
| O09 | R03 | S06 | “The anticipated fair and reasonable cost to provide the IRIS SaaS during FY24 is $200,000.00 and $55,500 annually thereafter” | `supports` |
| O10 | R04 | S07 | “after spending more than four years and $100 million on the program” | `partially_supports` |
| O11 | R04 | S08 | “This study identifies 61 occasions across Australia, Canada, Europe, New Zealand and the United States when ADS projects were cancelled or paused.” | `supports` |
| O12 | R05 | S09 | “It enables accredited researchers across government and academia to access anonymised, research-ready datasets ethically and responsibly.” | `supports` |
| O13 | R05 | S09 | “Data cannot be removed to be stored, for example, on a researcher’s own PC or university servers.” | `partially_supports` |
| O14 | R05 | S09 | “including ONS safe rooms, approved remote desktop connections and the Safe Pod Network.” | `supports` |
| O15 | R06 | S10 | “The impacts on data protection will be further considered during the development of those regulations.” | `supports` |
| O16 | R06 | S11 | “challenging the legality of the Agency’s decision to provide DOGE with unlimited access” | `supports` |
| O17 | R07 | S12 | “LLMs are capable of supporting the process of generating code from policy, but still require external knowledge and human oversight” | `supports` |
| O18 | R08 | S12 | “Current web-based chatbots have mixed results, often risking incorrect information presented in a confident tone.” | `supports` |
| O19 | R07 | S13 | “We established the first comprehensive sandbox environment for AI evaluation in benefits administration” | `supports` |
| O20 | R08 | S13 | “the system did not improve quality or efficiency in the sandbox control group” | `supports` |
| O21 | R08 | S14 | “SNAP, TANF, and Medicaid enrollments fell by 15%, 24%, and 4% one year after automation” | `supports` |
| O22 | R09 | S15 | “The majority of papers found a positive effect of professional development, with skill acquisition being the most commonly assessed outcome” | `supports` |
| O23 | R09 | S16 | “Agency websites, internship programs, and social media were commonly used to recruit caseworkers” | `supports` |
| O24 | R09 | S16 | “Webinars, online courses, and e-learning modules were the most prominent methods for training caseworkers” | `supports` |
| O25 | R10 | S17 | “managing human capital” | `supports` |
| O26 | R10 | S24 | “The bureau does not have effective strategies to address staffing gaps and high vacancies in FR positions.” | `supports` |
| O27 | R11 | S18 | “The Social Security Benefits Up-rating Order 2025” | `supports` |
| O28 | R11 | S19 | “The Social Security Benefits Up-rating Order 2026” | `supports` |
| O29 | R12 | S20 | “Amended Chapters April 2026” | `supports` |
| O30 | R12 | S20 | “Amended Chapters May 2026” | `supports` |
| O31 | R12 | S20 | “Amended Chapters June 2026” | `supports` |
| O32 | R13 | S23 | “long-term contracts negotiated with agency procurement teams” | `contradicts` |
| O33 | R13 | S23 | “magnify the potential for technology-driven lock-in and vendor capture at scale” | `contradicts` |
| O34 | R14 | S21 | “NC DHHS has moved forward with awarding the CWIS contract to Deloitte Consulting LLC.” | `supports` |
| O35 | R14 | S21 | “Deloitte and the NC DHHS team will leverage Salesforce as the core technology platform.” | `supports` |
| O36 | R14 | S21 | “To provide end to end analytics, the team will use Microsoft PowerBI, Marklogic Data Hub, and Amazon Web Services.” | `supports` |
| O37 | R14 | S22 | “This contract was awarded to: Accenture Inc.” | `supports` |
| O38 | R14 | S22 | “Microsoft \| CW2375341 \| 003 \| 2024/09/19” | `supports` |

## Negative and excluded results

- No returned result carrying an explicit publication date after 2026-07-11 was found in the 18 search responses.
- [Rockmere’s Medicaid eligibility case study](https://rockmerepartners.com/case-studies/state-medicaid-eligibility-ai/) was dated 2026-05-25 but excluded as **vendor-only**: the state buyer was unnamed and no purchaser-controlled corroboration was found.
- [Accenture Human Services Suite](https://www.accenture.com/us-en/products/accenture-human-services-suite) was **vendor-only** and undated; excluded from scoring and purchaser evidence.
- [ServiceNow Public Sector Digital Services](https://www.servicenow.com/standard/resource-center/data-sheet/ds-public-sector-digital-services-government.html) was **vendor-only** and marked only ©2026; exact pre-cutoff publication could not be established.
- [Accenture’s Texas DIR page](https://www.accenture.com/us-en/support/state-texas-accenture-dir-artificial-intelligence) was **vendor-only** and undated; not counted as buyer-controlled procurement proof.
- The undated ONS SRS policy was excluded from scoring; the dated May 2025 Ministry of Justice guide supplied the rights-access observation instead.
- The HMCTS Camunda repository was excluded because Exa exposed it as archived and did not expose a reliable publication/update date.
- The direct NBER PDF fetch timed out. The dated NBER landing page, DOI record and Chicago BFI copy were fetched successfully instead.
- No evidence was found for near-zero incumbent switching friction, durable two-buyer expansion, contractual data retention/refresh rights, or verifier false-pass/metamorphic validation.

## Exa calls used

### `mcp__exa__web_search_exa`

Every call used `numResults=10`.

1. **Q01:** `public-sector administrative workflows benefits casework citizen services documented repeated operating cost service delay error harm regulator audit government buyer procurement academic study before:2026-07-12 -vendor`
2. **Q02:** `public-sector administrative workflows benefits casework citizen services low error rates improving timeliness resolved backlog no material harm regulator audit government buyer procurement academic study before:2026-07-12 -vendor`
3. **Q03:** `public-sector administrative workflow AI automation assurance evaluation benefits casework citizen services contract award procurement paid pilot multi-year government buyer before:2026-07-12`
4. **Q04:** `public-sector administrative workflow AI automation assurance evaluation benefits casework citizen services cancelled procurement failed pilot no award budget cuts government buyer before:2026-07-12`
5. **Q05:** `public-sector administrative data benefits casework citizen services lawful access data sharing agreement secure research environment privacy controls synthetic data government official academic before:2026-07-12`
6. **Q06:** `public-sector administrative data benefits casework citizen services access prohibited privacy security data rights restrictions breach consent regulator official academic before:2026-07-12`
7. **Q07:** `public-sector administrative workflow benefits eligibility casework citizen services automated outcome verification rules as code state checks adversarial evaluation human review government technical repository academic before:2026-07-12`
8. **Q08:** `public-sector administrative workflow benefits eligibility casework citizen services automation verifier failure gameable proxy bias discretion false positive audit academic government before:2026-07-12`
9. **Q09:** `public-sector administration benefits casework citizen services expert workforce recruitment training calibration quality assurance capacity government workforce data academic before:2026-07-12`
10. **Q10:** `public-sector administration benefits casework citizen services workforce shortage vacancy attrition skills gap case backlog government audit academic before:2026-07-12`
11. **Q11:** `public-sector administrative workflow benefits casework citizen services stable rules annual scheduled policy updates change log official government academic before:2026-07-12`
12. **Q12:** `public-sector administrative workflow benefits casework citizen services frequent weekly daily policy guidance changes emergency updates volatile rules official change log government academic before:2026-07-12`
13. **Q13:** `public-sector administrative workflow AI assurance evaluation benefits casework citizen services unmet need fragmented market procurement no incumbent solution government buyer academic before:2026-07-12`
14. **Q14:** `public-sector administrative workflow AI assurance evaluation benefits casework citizen services major incumbent bundled platform contract Accenture Deloitte IBM Microsoft ServiceNow Palantir procurement before:2026-07-12`
15. **Q15:** `site:gao.gov OR site:oversight.gov OR site:nao.org.uk OR site:oig.ssa.gov public benefits casework citizen service backlog delay processing error improper payments audit before:2026-07-12`
16. **Q16:** `site:gao.gov OR site:oversight.gov OR site:nao.org.uk OR site:oig.ssa.gov public benefits casework citizen service backlog reduced processing timeliness target met error rate improved audit before:2026-07-12`
17. **Q17:** `site:gov.uk OR site:dwp.gov.uk OR site:legislation.gov.uk benefits administration annual uprating scheduled policy update guidance change log before:2026-07-12`
18. **Q18:** `site:gov.uk OR site:dwp.gov.uk OR site:legislation.gov.uk benefits administration frequent guidance updates ADM memo change log weekly monthly emergency policy before:2026-07-12`

### `mcp__exa__web_fetch_exa`

1. **F01:** `maxCharacters=6000`; URLs `S01–S08`.
2. **F02:** `maxCharacters=7000`; ONS SRS policy, `S09–S13`, direct NBER PDF, and HMCTS Camunda repository.
3. **F03:** `maxCharacters=7000`; `S15–S17`, `S24`, `S19–S20`, and the 2026-07-09 UK immigration-rules statement.
4. **F04:** `maxCharacters=7000`; `S21–S23`, Accenture Human Services Suite, ServiceNow Public Sector Digital Services, and Accenture Texas DIR.
5. **F05:** `maxCharacters=8000`; NBER landing page `S14`, DOI `10.3386/w31437`, and the Chicago BFI research brief.
6. **F06:** `maxCharacters=3500`; `S18–S19`.

No generic web search, browser, curl, other network tool, subagent, or file edit was used.