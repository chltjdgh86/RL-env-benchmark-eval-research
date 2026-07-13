# Verdict

`healthcare_administration` is a **NO-GO** under the exact rubric in the [local plan](/Users/sung/src/frist/RL-env-benchmark-eval-research/.omo/plans/rl-market-intelligence-site.md:119).

- Full-precision weighted score: **61.0 / 100**
- Required threshold: **≥70**
- Dimension-floor failures: `verifierFeasibility=2`, converted `incumbentPressure=1`
- Buyer/procurement gate: passed with two buyer-controlled RFPs
- Rights blocker: false only for a scoped HIPAA business-associate workflow with contractual/security controls; Part 2 data requires consent
- Winner/10-point-lead test: not reached because the candidate does not qualify
- Decision: **`no_go`**

All searches ran on 2026-07-12 with cutoff `2026-07-11`. No post-cutoff evidence was retained. Undated live vendor pages were excluded from scoring.

## Fourteen receipt lanes

All `searchedDomainClasses` use the plan’s exact enum.

### 1–2. `pain`

**Positive — `rr-healthcare-administration-pain-positive`**

- S01: `Healthcare administrative workflows prior authorization claims revenue cycle scheduling coding appeals documented repeated operating cost denial patient delay regulatory impact primary evidence site:cms.gov OR site:oig.hhs.gov OR site:gao.gov OR site:jamanetwork.com OR site:healthaffairs.org before:2026-07-12`
- Classes: `regulatory_registry`, `academic_primary`
- Retained: O01–O02
- Finding: Primary academic evidence shows repeated provider-revenue loss; OIG found substantial denial rates and oversight/access risks.
- Closure: `evidence_found`

**Negative — `rr-healthcare-administration-pain-negative`**

- S02: `Healthcare administrative workflows prior authorization claims revenue cycle scheduling coding appeals low burden no material delay reduced denials successful simplification automation primary evidence site:cms.gov OR site:oig.hhs.gov OR site:gao.gov OR site:jamanetwork.com OR site:healthaffairs.org before:2026-07-12`
- S22: `Prior authorization administrative process generally complied low error rate no recommendations successful oversight official site:oig.hhs.gov OR site:cms.gov before:2026-07-12`
- Classes: `regulatory_registry`, `academic_primary`
- Retained: O03–O04
- Finding: Some audited plans mostly complied and one denied only 3% of requests. This narrows universality but does not erase measured financial and access consequences.
- Closure: `evidence_found`
- Score: measured/effective/converted **4/4/4**. Level 5 was not awarded because no current active procurement from two buyers was tied directly to the pain evidence.

### 3–4. `willingnessToPay`

**Positive — `rr-healthcare-administration-willingness-to-pay-positive`**

- S03: `"revenue cycle management" OR "medical coding services" OR "prior authorization" hospital health system RFP award contract procurement site:gov OR site:edu before:2026-07-12`
- Classes: `buyer_procurement`
- Retained: O05–O06
- Finding: UC Davis Health and NYC Health + Hospitals independently procured revenue-cycle optimization or outsourced AR work. These prove procurement intent, not awards or spend.
- Closure: `evidence_found`

**Negative — `rr-healthcare-administration-willingness-to-pay-negative`**

- S04: `"revenue cycle management" OR "medical coding services" OR "prior authorization" hospital health system RFP cancelled rejected no award no bids budget procurement site:gov OR site:edu before:2026-07-12`
- Classes: `buyer_procurement`
- Retained: none
- Finding: The ten returned results contained positive/neutral procurement documents, but no official cancellation, no-award, bid failure, or budget rejection.
- Closure: `no_public_evidence`
- Score: **4/4/4**. Two procurement buyers qualify level 4; level 5 lacks repeat, expansion, multi-year, or two-buyer public-award evidence.

### 5–6. `rightsAccess`

**Positive — `rr-healthcare-administration-rights-access-positive`**

- S05: `Healthcare administrative workflow lawful data access HIPAA business associate claims prior authorization FHIR API permitted use deployment safeguards official site:hhs.gov OR site:cms.gov OR site:healthit.gov OR site:hl7.org before:2026-07-12`
- Classes: `regulatory_registry`, `technical_repository`
- Retained: O07–O09
- Finding: HHS expressly permits claims, billing, utilization-review, and QA work through business-associate arrangements; CMS supplies an additional regulated API path; HHS requires deployment safeguards.
- Closure: `evidence_found`

**Negative — `rr-healthcare-administration-rights-access-negative`**

- S06: `Healthcare administrative workflow data access prohibited restricted HIPAA minimum necessary business associate 42 CFR Part 2 consent privacy security prior authorization claims official site:hhs.gov OR site:cms.gov OR site:healthit.gov OR site:hl7.org before:2026-07-12`
- Classes: `regulatory_registry`, `technical_repository`
- Retained: O10–O11
- Finding: Access is purpose-limited; minimum-necessary rules apply, and Part 2 introduces consent requirements. No durable retention/refresh rights were found.
- Closure: `evidence_found`
- Score: rubric level **4**, capped to effective/converted **3** because HHS and CMS share one parent control chain; buyer-controlled evidence is not independence-eligible. `rightsBlocker=false` only for the stated scoped workflow.

### 7–8. `verifierFeasibility`

**Positive — `rr-healthcare-administration-verifier-feasibility-positive`**

- S07: `Healthcare administrative claims coding prior authorization automated validation objective state outcome checks expert review study error rate FHIR X12 site:cms.gov OR site:healthit.gov OR site:hl7.org OR site:academic.oup.com OR site:jamanetwork.com before:2026-07-12`
- S15: `Medicare claims administrative coding automated edits National Correct Coding Initiative prepayment review data analysis expert medical review official site:cms.gov OR site:oig.hhs.gov OR site:gao.gov before:2026-07-12`
- Classes: `regulatory_registry`, `technical_repository`, `academic_primary`
- Retained: O12–O13
- Finding: Claims provide deterministic code-pair/unit checks and initial payment states, with licensed review for complex cases.
- Closure: `evidence_found`

**Negative — `rr-healthcare-administration-verifier-feasibility-negative`**

- S08: `Healthcare administrative claims coding prior authorization automation unreliable gameable proxy false approval false denial expert judgment inter-rater variability study site:cms.gov OR site:healthit.gov OR site:hl7.org OR site:academic.oup.com OR site:jamanetwork.com before:2026-07-12`
- S16: `Medicare claims automated edits improper payments false positives errors coding medical review limitations official site:cms.gov OR site:oig.hhs.gov OR site:gao.gov before:2026-07-12`
- S18: `"Expert Agreement in Current Procedural Terminology Evaluation and Management Coding" results agreement kappa`
- Classes: `regulatory_registry`, `technical_repository`, `academic_primary`
- Retained: O14–O15
- Finding: CMS says many prior-authorization decisions still need human review; primary research found substantial disagreement among coding specialists. No administrative false-pass, adversarial, or metamorphic validity evidence was found.
- Closure: `evidence_found`
- Score: **2/2/2** — objective but partial and potentially gameable proxies, not majority automation with demonstrated construct validity.

### 9–10. `expertSupply`

**Positive — `rr-healthcare-administration-expert-supply-positive`**

- S09: `Healthcare administration workforce medical records specialists coders billers prior authorization revenue cycle documented training certification recruitment calibration supply official site:bls.gov OR site:cms.gov OR site:ahima.org OR site:aapc.com OR site:jamanetwork.com before:2026-07-12`
- Classes: `regulatory_registry`, `company_first_party`, `academic_primary`
- Retained: O16
- Finding: BLS documents an established education/certification route and a sizable occupational base. This proves a recruitment path, not utilization or QA performance.
- Closure: `evidence_found`

**Negative — `rr-healthcare-administration-expert-supply-negative`**

- S10: `Healthcare administration workforce medical records specialists coders billers prior authorization revenue cycle shortage vacancy turnover burnout scarcity official site:bls.gov OR site:cms.gov OR site:ahima.org OR site:aapc.com OR site:jamanetwork.com before:2026-07-12`
- Classes: `regulatory_registry`, `company_first_party`, `academic_primary`
- Retained: O17
- Finding: An AHIMA/NORC survey found widespread understaffing, limiting any stronger repeatable-supply conclusion.
- Closure: `evidence_found`
- Score: **3/3/3** — documented recruit/calibration path; no repeatable QA/utilization proof.

### 11–12. `freshnessBurden`

**Positive — `rr-healthcare-administration-freshness-burden-positive`**

- S11: `Healthcare administration coding claims prior authorization rules predictable annual update schedule stable notice period official ICD CPT CMS coverage policy site:cms.gov OR site:cdc.gov OR site:ama-assn.org OR site:healthit.gov before:2026-07-12`
- S19: `Official payer provider prior authorization code list coverage policy predictable update schedule advance notice quarterly monthly UnitedHealthcare Aetna Elevance Cigna before:2026-07-12`
- Classes: `regulatory_registry`, `company_first_party`, `technical_repository`
- Retained: O18–O19
- Finding: Federal CPT/HCPCS and NCCI assets have published annual and quarterly cadences.
- Closure: `evidence_found`

**Negative — `rr-healthcare-administration-freshness-burden-negative`**

- S12: `Healthcare administration coding claims prior authorization rules frequent monthly weekly daily changes payer coverage policy update burden volatility official site:cms.gov OR site:cdc.gov OR site:ama-assn.org OR site:healthit.gov before:2026-07-12`
- S20: `Official payer provider prior authorization code list coverage policy frequent immediate weekly daily retroactive changes no advance notice UnitedHealthcare Aetna Elevance Cigna before:2026-07-12`
- Classes: `regulatory_registry`, `company_first_party`, `technical_repository`
- Retained: O20–O22
- Finding: Payer-controlled materials show monthly policy/prior-authorization changes. No weekly, daily, or continuous cadence was retained.
- Closure: `evidence_found`
- Score: measured/effective burden **2/2**; converted freshness score **3**.

### 13–14. `incumbentPressure`

**Positive — `rr-healthcare-administration-incumbent-pressure-positive`**

- S13: `Healthcare administration prior authorization claims revenue cycle coding scheduling fragmented manual low automation adoption unmet buyer need incumbent gaps site:cms.gov OR site:healthit.gov OR site:aha.org OR site:epic.com OR site:oracle.com OR site:optum.com before:2026-07-12`
- S24: `Healthcare revenue cycle management claims coding prior authorization fragmented competition no dominant provider customer switching official 10-K site:sec.gov before:2026-07-12`
- Classes: `regulatory_registry`, `company_first_party`, `technical_repository`
- Retained: O23–O24
- Finding: CMS and the hospital trade association document fragmented manual workflows and cross-sector gaps, establishing whitespace.
- Closure: `evidence_found`

**Negative — `rr-healthcare-administration-incumbent-pressure-negative`**

- S14: `Healthcare administration prior authorization claims revenue cycle coding scheduling incumbent bundled platform EHR automation internal build major vendor substitute site:cms.gov OR site:healthit.gov OR site:aha.org OR site:epic.com OR site:oracle.com OR site:optum.com before:2026-07-12`
- S23: `Healthcare revenue cycle management claims coding prior authorization incumbent platform competition official 10-K Epic Optum R1 Waystar site:sec.gov before:2026-07-12`
- S25: `R1 RCM 2023 2024 annual report revenue cycle management competition healthcare providers site:sec.gov/Archives before:2026-07-12`
- Classes: `regulatory_registry`, `company_first_party`, `technical_repository`
- Retained: O25–O26
- Finding: Dated SEC filings disclose two scaled, bundled RCM platforms. The underlying product/scale assertions remain issuer-controlled and are therefore labeled **vendor-only**.
- Closure: `evidence_found`
- Score: measured/effective pressure **4/4**; converted whitespace score **1**. Level 5 was not awarded because near-zero switching friction was not proven.

## Source/observation ledger

All observations were made through Exa on 2026-07-12. Relations are against the favorable proposition for each dimension: high pain/WTP/rights/verifier/supply, but low freshness burden/incumbent pressure.

| Obs. | Retained source, date, control | Observed excerpt, ≤25 words | `supportRelation` |
|---|---|---|---|
| O01 | [Medicare Advantage Denies 17 Percent Of Initial Claims…](https://www.healthaffairs.org/doi/10.1377/hlthaff.2024.01485), 2025-06-01, academic-primary | “We calculated that denials resulted in a 7 percent net reduction in provider MA revenue” | `supports` |
| O02 | [High Rates of Prior Authorization Denials…](https://oig.hhs.gov/reports/all/2023/high-rates-of-prior-authorization-denials-by-some-plans-and-limited-state-oversight-raise-concerns-about-access-to-care-in-medicaid-managed-care/), 2023-07-17, regulator | “Overall, the MCOs included in our review denied one out of every eight requests for the prior authorization of services in 2019.” | `supports` |
| O03 | [Louisiana Healthcare Connections Generally Complied…](https://oig.hhs.gov/reports/all/2026/louisiana-healthcare-connections-generally-complied-with-federal-and-state-process-requirements-when-denying-prior-authorization-requests/), 2026-04-03, regulator | “LHCC complied with Federal and State requirements when it denied 64 of the 76 sampled behavioral health service requests” | `contests` |
| O04 | [Amerigroup Iowa’s Prior Authorization and Appeal Processes Were Effective…](https://oig.hhs.gov/reports/all/2023/amerigroup-iowas-prior-authorization-and-appeal-processes-were-effective-but-improvements-can-be-made/), 2023-09-13, regulator | “Amerigroup denied only 3 percent of requested medical services during its prior authorization process” | `contests` |
| O05 | [Addendum 1: RFP_06282024_Revenue Cycle Optimization_UCDH](https://health.ucdavis.edu/media-resources/supply-chain/documents/fy25/06282024_BJ_Addendum_1a_ResponsestoQuestionsAddendum.pdf), 2024-06-28 document identifier, buyer-controlled | “Scope will primarily be project management and implementation support for revenue cycle assessment recommendations.” | `supports` |
| O06 | [Request for Proposals for Accounts Receivable Engagement](https://a856-cityrecord.nyc.gov/Search/GetFile?documentId=36342&requestId=20230503115&requestStatus=Archived&sectionId=6), RFP release 2023-05-05, buyer-controlled | “NYC Health + Hospitals seeks to outsource a portion of its low dollar, high volume insured accounts receivable to selected vendors.” | `supports` |
| O07 | [Business Associates](https://www.hhs.gov/hipaa/for-professionals/privacy/guidance/business-associates/index.html), 2009-01-07, regulator | “Business associate functions and activities include: claims processing or administration; data analysis, processing or administration; utilization review; quality assurance; billing” | `supports` |
| O08 | [CMS Interoperability and Prior Authorization Final Rule](https://www.cms.gov/newsroom/fact-sheets/cms-interoperability-prior-authorization-final-rule-cms-0057-f), 2024-01-17, regulator | “We are requiring that impacted payers implement and maintain a Provider Access API to share patient data with in-network providers” | `supports` |
| O09 | [Summary of the HIPAA Security Rule](https://www.hhs.gov/hipaa/for-professionals/security/laws-regulations/index.html), 2009-11-20, regulator | “The Security Rule sets forth the administrative, physical, and technical safeguards that covered entities and business associates must put in place” | `supports` |
| O10 | [Minimum Necessary Requirement](https://www.hhs.gov/hipaa/for-professionals/privacy/guidance/minimum-necessary-requirement/index.html), 2009-01-07, regulator | “The Privacy Rule generally requires covered entities to take reasonable steps to limit the use or disclosure of, and requests for, protected health information” | `contests` |
| O11 | [Fact Sheet 42 CFR Part 2 Final Rule](https://www.hhs.gov/hipaa/for-professionals/regulatory-initiatives/fact-sheet-42-cfr-part-2-final-rule/index.html), 2024-02-07; updated 2026-01-30, regulator | “Requires a separate patient consent for the use and disclosure of SUD counseling notes.” | `contests` |
| O12 | [NCCI for Medicare](https://www.cms.gov/medicare/coding-billing/national-correct-coding-initiative-ncci-edits), modified 2026-03-04, regulator | “The purpose of the NCCI Procedure to Procedure edits is to prevent improper payment when incorrect code combinations are reported.” | `partially_supports` |
| O13 | [Medicare Claim Review Programs](https://www.cms.gov/outreach-and-education/medicare-learning-network-mln/mlnproducts/downloads/mcrp-booklet-text-only.pdf), 2016-09-15, regulator | “Complex review: Requires licensed professionals who review additional documentation associated with a claim” | `partially_supports` |
| O14 | [Prior Authorization API](https://www.cms.gov/priorities/burden-reduction/overview/interoperability/frequently-asked-questions/prior-authorization-api), modified 2026-04-15, regulator | “other decisions will continue to necessitate review and evaluation by clinical reviewers” | `contests` |
| O15 | [Expert Agreement in Current Procedural Terminology Evaluation and Management Coding](https://doi.org/10.1001/archinte.162.3.316), 2002-02-11, academic-primary | “There is substantial disagreement among coding specialists in application of the CPT E/M coding guidelines.” | `contradicts` |
| O16 | [Medical Records Specialists](https://www.bls.gov/ooh/healthcare/medical-records-and-health-information-technicians.htm), 2025-08-28, official labor statistics | “Community colleges and technical schools offer certificate and associate’s degree programs for medical records specialists.” | `supports` |
| O17 | [Understaffed and Overworked: How Can Organizations Improve HI Staffing?](https://journal.ahima.org/page/understaffed-and-overworked-how-can-organizations-improve-hi-staffing), 2024-03-04, association-controlled | “two-thirds (66 percent) of respondents reported understaffing of HI professionals at their organizations within the last two years.” | `contests` |
| O18 | [List of CPT/HCPCS Codes](https://www.cms.gov/medicare/regulations-guidance/physician-self-referral/list-cpt-hcpcs-codes), modified 2026-03-25, regulator | “We maintain and annually update a List of Current Procedural Terminology (CPT)/Healthcare Common Procedure Coding System (HCPCS) Codes” | `supports` |
| O19 | [Medicare NCCI Procedure to Procedure Edits](https://www.cms.gov/medicare/coding-billing/national-correct-coding-initiative-ncci-edits/medicare-ncci-procedure-procedure-ptp-edits), modified 2026-05-29, regulator | “CMS posts changes to each of its NCCI PTP published edit files on a quarterly basis.” | `supports` |
| O20 | [2026 Summary of Changes to Advance Notification and Prior Authorization Requirements](https://www.uhcprovider.com/content/dam/provider/docs/public/prior-auth/pa-requirements/multi/2026-Summary-of-Changes-AdvNotice-and-PriorAuth.pdf), 2026-04-01 observation, payer-controlled | “This month's published changes affect the following plans” | `contests` |
| O21 | [Aetna monthly OfficeLink Updates, April 2026](https://www.aetna.com/content/dam/aetna/pdfs/olu/officelink-updates-april-2026-olu.pdf), 2026-04, payer-controlled | “We update these formulary documents regularly during the benefits year as we add or update additional coverage each month.” | `contests` |
| O22 | [January 2026 Policy Updates](https://static.cigna.com/assets/chcp/pdf/coveragePolicies/policy_updates/january_2026_policy_updates.pdf), 2026-01, payer-controlled | “Coverage Policy Unit (CPU) - Monthly Policy Updates” | `contests` |
| O23 | [Moving Prior Authorization into the 21st Century](https://www.cms.gov/newsroom/blog/moving-prior-authorization-21st-century), 2026-05-05, regulator | “workflow gaps and technical handoffs that no single sector can fix alone.” | `supports` |
| O24 | [AHA Comments on CMS’ Interoperability and Prior Authorization Proposed Rule](https://www.aha.org/lettercomment/2026-06-15-aha-comments-cms-interoperability-and-prior-authorization-proposed-rule), 2026-06-15, buyer-association | “providers must navigate complex, fragmented and manual processes that detract from care delivery” | `supports` |
| O25 | [Waystar 2024 Annual Report](https://www.sec.gov/Archives/edgar/data/1990354/000110465925041392/tm259007d2_ars.pdf), 2025; FY ended 2024-12-31, **vendor-only/issuer-controlled** | “Waystar’s software platform integrates with more than 500 EHR and Practice Management systems” | `contradicts` |
| O26 | [R1 RCM Annual Report 2023](https://www.sec.gov/Archives/edgar/data/1910851/000162828024015926/a2023annualreport.pdf), 2024-02-27, **vendor-only/issuer-controlled** | “R1 covers more than $1 trillion in NPR, including end-to-end and modular customers.” | `contradicts` |

## Exact weighted computation

| Dimension | Measured raw | Effective/converted | Weight | Weighted points |
|---|---:|---:|---:|---:|
| `pain` | 4 | 4 | 20 | 16 |
| `willingnessToPay` | 4 | 4 | 20 | 16 |
| `rightsAccess` | 4 | 3 after cap | 15 | 9 |
| `verifierFeasibility` | 2 | 2 | 15 | 6 |
| `expertSupply` | 3 | 3 | 10 | 6 |
| `freshnessBurden` | 2 | `5−2=3` | 10 | 6 |
| `incumbentPressure` | 4 | `5−4=1` | 10 | 2 |

```text
rawWeightedScore
= (4×20 + 4×20 + 3×15 + 2×15 + 3×10 + 3×10 + 1×10) / 5
= 305 / 5
= 61.0
```

Gate results:

- `score >= 70`: **FAIL**
- Every converted dimension `>=3`: **FAIL** (`verifierFeasibility=2`, competitive whitespace `=1`)
- Two separate buyer/procurement observations: **PASS** (O05, O06)
- No rights blocker: **PASS only for scoped BA/consented workflows**
- All nonmissing cells terminally closed: **PASS**
- Lead second-highest candidate by ≥10: **NOT EVALUATED**
- Final: **`decisionStatus=no_go`**

## Negative results and exclusions

- No official cancellation, no-award, bid-failure, or budget-rejection evidence was found for the willingness-to-pay countersearch. This is `no_public_evidence`, not proof of absence.
- No administrative verifier evidence demonstrated false-pass measurement, adversarial validity, or metamorphic tests.
- No repeatable expert-supply QA/utilization evidence qualified level 4 or 5.
- No weekly/daily payer-policy cadence was retained; monthly evidence won the freshness countersearch.
- No near-zero switching-friction evidence qualified incumbent-pressure level 5.
- Scheduling-specific evidence did not survive retention; the score is grounded mainly in prior authorization, claims/RCM, coding, appeals, and privacy/access.
- Undated live pages for Optum Integrity One, Epic Financial, Optum’s prior-authorization API, AAPC RCMS, and AHIMA CCS were fetched only as discovery context and excluded from scoring because pre-cutoff publication could not be established. Their product claims were vendor-only.

## Exa calls used

Only `mcp__exa__web_search_exa` and `mcp__exa__web_fetch_exa` were used externally.

- `web_search_exa`: **25 calls**, S01–S25. Exact substantive queries appear in the 14 receipts above.
  - S17, metadata validation: `"Medicare Advantage Denies 17 Percent Of Initial Claims" publication date Health Affairs`
  - S21 repeated S02 verbatim to obtain compact negative-result metadata.
  - `numResults=10`, except S17=`5`, S18=`6`, S22=`8`, S25=`8`.

- `web_fetch_exa`: **10 batch calls**:
  - F01, `maxCharacters=12000`: Health Affairs denial study; 2023 OIG denial report; Louisiana OIG PDF.
  - F02, `10000`: UC Davis RFP addendum; NYC H+H AR RFP; Nassau RCM RFP.
  - F03, `9000`: HHS Business Associates; CMS-0057-F fact sheet; HHS Minimum Necessary; Part 2 fact sheet; HIPAA Security Rule.
  - F04, `9000`: CMS NCCI; Medicare Claim Review Programs; HL7 PAS use cases; CMS Prior Authorization API; JAMA coding agreement; GAO-16-394.
  - F05, `9000`: BLS Medical Records Specialists; AHIMA CCS; AAPC RCMS; AHIMA staffing article.
  - F06, `9000`: CMS ICD-10; CMS CPT/HCPCS list; CMS NCCI PTP edits.
  - F07, `9000`: CMS prior-authorization blog; AHA comments; Optum Integrity One; Epic Financial; Optum PA Submission API.
  - F08, `9000`: UnitedHealthcare 2026 change summary; Aetna April 2026 update; Cigna January 2026 update.
  - F09, `7000`: Louisiana OIG report page; Amerigroup Iowa OIG report page.
  - F10, `12000`: Waystar 2024 Annual Report; R1 RCM 2023 Annual Report.