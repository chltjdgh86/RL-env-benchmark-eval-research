# Exa receipt reconstruction: insurance_operations

Cutoff: 2026-07-11  
Execution date: 2026-07-12  
External search/fetch channel: Exa only, through the connected Exa toolkit  
Workspace mutations: none

## Executive result

The 14 symmetric lanes were executed: one positive and one countersearch receipt for each of seven dimensions. Every retained source was published, issued, or contained dated data no later than the 2026-07-11 cutoff. Undated pages are labeled and are not used to establish a volatile high-risk fact by themselves.

| Dimension | Weight | Measured level | Effective raw | Converted level | Weighted points | Disposition |
|---|---:|---:|---:|---:|---:|---|
| Pain | 20% | 2 | 2 | 2 | 8.0 | Evidence found; capped conservatively because quantified evidence originates in vendor-sponsored surveys/trade reporting. |
| Willingness to pay | 20% | null | 0 | 0 | 0.0 | Conservatively missing. Broad insurer AI spending is visible, but no public buyer/procurement evidence supports purchase of this specific independent Domain Assurance Pack. |
| Rights access | 15% | null | 0 | 0 | 0.0 | Conservatively missing. Controlled sandboxes exist, but no public evidence grants a newcomer durable lawful access, retention, or cross-client reuse rights. |
| Verifier feasibility | 15% | 2 | 2 | 2 | 6.0 | Partial feasibility: regulators require testing and an academic benchmark demonstrates formal verification, but real claims remain ambiguous and multimodal. |
| Expert supply | 10% | 2 | 2 | 2 | 4.0 | Large occupational pools exist, but calibrated availability is constrained by licensing, experience, and specialized-role shortages. |
| Freshness burden | 10% inverted | 4 | 4 | 1 | 2.0 | High burden: annual testing, drift, data currency, regulation, policy, medical, vehicle, and court-outcome changes require recurrent maintenance. |
| Incumbent pressure | 10% inverted | 3 | 3 | 2 | 4.0 | Material adjacent pressure from core insurance platforms, decisioning vendors, and large assurance firms; the market still has execution gaps. |
| **Total** | **100%** |  |  |  | **24.0 / 100** |  |

Formula:

    (2×20 + 0×20 + 0×15 + 2×15 + 2×10 + 1×10 + 2×10) / 5 = 24.0

### Rights blocker

rightsBlocker = true.

Reasons:

1. rightsAccess is unmeasured and converts to 0, below the required 3.
2. No retained observation grants durable lawful access, retention, or reuse rights for claims, underwriting, or consumer data.
3. Current regulator evidence instead requires privacy controls, data governance, validation, auditability, and consumer disclosure/access.
4. The Hong Kong sandbox is controlled access for participating regulated institutions and partner firms; it is not evidence of transferable production-data rights.

### Decision

**NO-GO — DISCOVERY REQUIRED**

Qualification failures:

- full-precision score 24.0 is below 70;
- one or more converted dimensions are below 3;
- fewer than two separate buyer-controlled/procurement observations support purchase of this exact offer;
- rights blocker is true;
- the ≥10-point lead gate is not reached because the candidate does not qualify.

All 14 searches are terminal for this bounded reconstruction. Two positive lanes close as no_public_evidence for their fixed propositions: willingnessToPay and rightsAccess. The other 12 lanes close evidence_found.

Implementation caution: the prose rubric permits conservatively missing cells with terminal receipts. The current validator separately requires positive.closure=evidence_found for its all-cell receipt gate; feeding these two honest no_public_evidence positives into that unchanged implementation would retain auditable_receipt_closure_gate as an additional failure.

## Exact 14-receipt ledger

All searches used Exa type=deep, endPublishedDate=2026-07-11, and direct-source preference. Each receipt records the canonical query first and the disclosed resolution query second.

| Receipt | Exact queries | Exa request IDs: canonical / resolution | Retained evidence | Closure | Finding |
|---|---|---|---|---|---|
| rr-insurance-operations-pain-positive | 1. "insurance operations" "pain" buyer procurement official evidence<br>2. insurance operations claims underwriting manual work delays errors costs buyer survey insurer 2025 2026 | 1438d6f36b77ae4dcf41d10d99a76c3a / a7bc73f7daca69ef6a5ca42e92a39644 | S01/O01-O02; S02/O03-O04 | evidence_found | Insurance operations show long settlements, manual work, rework, and material costs. Commercial provenance limits the level to 2. |
| rr-insurance-operations-pain-negative | 1. "insurance operations" "pain" counterevidence blocker incumbent no adoption<br>2. insurance operations AI automation failed pilots legacy integration barriers ROI no adoption 2025 2026 | 5aefe18ec438a3ff92ea24185a48d619 / 86c37accee55d264a03c2591b4f315f5 | S03/O05-O06; S15/O27 | evidence_found | Pain does not imply easy adoption: few carriers report scaled success, human oversight remains necessary, and weak foundations stall projects. |
| rr-insurance-operations-willingnesstopay-positive | 1. "insurance operations" "willingnessToPay" buyer procurement official evidence<br>2. insurance carrier procurement AI model validation assurance evaluation contract award claims automation | 6965c7b4d5f0bcaa97321a57ea64e351 / aea537f6da0d369230665a8970432d34 | S04/O07 as context only | no_public_evidence | Insurers spend materially on AI, but the search found no public buyer-controlled purchase or procurement of this specific independent assurance pack. |
| rr-insurance-operations-willingnesstopay-negative | 1. "insurance operations" "willingnessToPay" counterevidence blocker incumbent no adoption<br>2. insurance AI technology spending low ROI cancelled pilots budget barriers no adoption 2025 2026 | af5fd9c72bf980852de971528bd2771b / bc5f0c8be162ebc2c9fb4929b775f53f | S04/O08; S03/O05; S15/O27 | evidence_found | Public reporting says ROI is often unproven and production deployment rare, countering an inference from broad AI budgets to assurance-pack willingness to pay. |
| rr-insurance-operations-rightsaccess-positive | 1. "insurance operations" "rightsAccess" buyer procurement official evidence<br>2. insurance AI data sharing sandbox lawful access third party model testing privacy preserving regulator | cc80b6a975922ff6632487b4d7ec0f82 / 46c1c47d8a972beb050f87920f5d5501 | S06/O12 as context only | no_public_evidence | A regulator-sponsored sandbox enables controlled participation; it does not grant durable production-data access, retention, or reuse rights to a newcomer. |
| rr-insurance-operations-rightsaccess-negative | 1. "insurance operations" "rightsAccess" counterevidence blocker incumbent no adoption<br>2. insurance claims underwriting data third party AI model training privacy confidentiality access restrictions regulator | faaf2c389619eab6a9a7b98a0f6ecc61 / 5082ecedf9696d26a518fe19aee643e5 | S05/O11; S07/O12-O14 | evidence_found | Regulators impose consumer-data, governance, testing, and disclosure duties; no source resolves contractual access or cross-client reuse rights. |
| rr-insurance-operations-verifierfeasibility-positive | 1. "insurance operations" "verifierFeasibility" buyer procurement official evidence<br>2. insurance claims AI model validation testing objective outcomes audit unfair denial regulator standards | 957f755b8b3a853cb81afd4c05ff446d / 4a6a05dffb153bf3c4b862eb91b6675c | S05/O09-O10; S07/O14; S08/O15 | evidence_found | Regulation requires validation/testing, and InsLogicBench demonstrates policy-grounded outcome/reasoning checks. This supports partial, not complete, feasibility. |
| rr-insurance-operations-verifierfeasibility-negative | 1. "insurance operations" "verifierFeasibility" counterevidence blocker incumbent no adoption<br>2. insurance claims AI evaluation ground truth ambiguity human judgment model validation limitations | 33891a525cbca30cd8ce0b6f4299f78d / f3243f0bf54d584f5fe516b3c217ead1 | S08/O16-O17; S03/O06 | evidence_found | Real claims have ambiguous facts, multimodal evidence, quantitative loss work, and legitimate expert disagreement; simple output matching is insufficient. |
| rr-insurance-operations-expertsupply-positive | 1. "insurance operations" "expertSupply" buyer procurement official evidence<br>2. insurance claims adjusters underwriters actuaries employment workforce supply official statistics 2025 | a0c9afedcb740570392c94a5ae7b60b8 / fc546553b46e427532199af4451c2b86 | S09/O18-O19; S10/O20 | evidence_found | Government statistics establish sizable underwriter and claims occupations and recurring openings, but not calibrated availability for assurance work. |
| rr-insurance-operations-expertsupply-negative | 1. "insurance operations" "expertSupply" counterevidence blocker incumbent no adoption<br>2. insurance claims adjuster underwriter actuary shortage skills gap AI expertise 2025 2026 | f4a87b0ffefa5a9e7e0d54e8d7a6e8ae / 9ab10a78557c70b0de88b822b3788871 | S11/O22; S09/O19; S10/O20-O21 | evidence_found | Specialized actuarial, analytics, and executive roles remain difficult to fill; licensing, continuing education, and domain change constrain usable supply. |
| rr-insurance-operations-freshnessburden-positive | 1. "insurance operations" "freshnessBurden" buyer procurement official evidence<br>2. insurance regulation policy forms rates claims procedures ongoing change model monitoring update requirements | d04d5c7658f37dc32c411d498a7ea1fd / 930a61f6729c788aee30bc1ffb5388cf | S05/O09; S07/O13-O14; S10/O21; S12/O23 | evidence_found | Annual testing, model drift, data currency, legal outcomes, medical procedures, vehicle changes, and evolving regulation imply high recurrent maintenance. |
| rr-insurance-operations-freshnessburden-negative | 1. "insurance operations" "freshnessBurden" counterevidence blocker incumbent no adoption<br>2. insurance claims workflows standardized stable automation rules low maintenance evidence | b5b7d5f449687145cb04b26f50c535a5 / f3614d111cca5acc963736f3fd2346ef | S13/O24 | evidence_found | ACORD schemas make parts of reinsurance/accounting/claims messages programmatically validatable, reducing—but not eliminating—refresh work. |
| rr-insurance-operations-incumbentpressure-positive | 1. "insurance operations" "incumbentPressure" buyer procurement official evidence<br>2. insurance AI claims automation assurance incumbents Guidewire Shift CCC Accenture Deloitte market 2025 2026 | b5a9d825fc1a7a6c51b97430bb3d782d / 54b7eed0aa778eae270d01b3bd0b5860 | S14/O25-O26; S16/O28-O29 | evidence_found | Guidewire/Shift occupy insurance decisioning and Deloitte sells independent assurance/model testing, creating credible adjacent procurement substitutes. |
| rr-insurance-operations-incumbentpressure-negative | 1. "insurance operations" "incumbentPressure" counterevidence blocker incumbent no adoption<br>2. insurance AI assurance unmet need fragmented market independent evaluation vendor gap | d7a4a67d14d84560354041ec449dc6ca / 59f07292d0ada27cfb9ae8e5f050cdb6 | S03/O05; S04/O08; S15/O27 | evidence_found | Existing spend and suppliers have not solved scaling, ROI, governance, or legacy integration, leaving whitespace despite material incumbent pressure. |

### Receipt closure summary

| Closure | Count | Receipt IDs |
|---|---:|---|
| evidence_found | 12 | pain positive/negative; willingnessToPay negative; rightsAccess negative; verifierFeasibility positive/negative; expertSupply positive/negative; freshnessBurden positive/negative; incumbentPressure positive/negative |
| no_public_evidence | 2 | willingnessToPay positive; rightsAccess positive |
| open_unverified | 0 | none |

## Source and observation ledger

Every excerpt below is 25 words or fewer. Excerpts are verbatim from Exa-retrieved text/highlights. “Vendor survey” or “vendor claim” labels are retained where applicable.

| Observation | Source and status at cutoff | Type/control | Locator | Excerpt |
|---|---|---|---|---|
| O01 | S01 [AutoRek, Insurance Operations & Financial Transformation 2026](https://autorek.com/report/insurance-operations-report-2026-autorek/), 2026-03-18 | Company first-party; vendor survey of 250 leaders | “The Settlement Squeeze” | “Nearly 44% of insurers now face settlement periods longer than 60 days, driven by higher transaction volumes and increased processing complexity.” |
| O02 | S01, 2026-03-18 | Company first-party; vendor survey | Same section | “Firms are spending 14% of their operational budgets correcting manual errors and rework.” |
| O03 | S02 [Claims Pages, Legacy Insurance Systems Drive Claims Delays and Rising Costs](https://www.claimspages.com/news/legacy-insurance-systems-drive-claims-delays-and-rising-costs-20260430/), 2026-04-30 | Independent trade reporting; underlying industry report | Manual workflows paragraph | “more than 50% of policy and claims-related processes still require human intervention” |
| O04 | S02, 2026-04-30 | Independent trade reporting; underlying industry report | Financial impact paragraph | “organizations are spending between $475,000 and $1.1 million annually on manual workarounds” |
| O05 | S03 [Insurance Business, Carriers stuck in pilot purgatory](https://www.insurancebusinessmag.com/us/news/technology/carriers-stuck-in-pilot-purgatory-as-ai-fails-to-graduate--sedgwick-567339.aspx), 2026-03-04 | Independent trade reporting; reports Sedgwick research | Adoption paragraph | “just 7% have reached what Sedgwick calls scalable success” |
| O06 | S03, 2026-03-04 | Independent trade reporting; reports Sedgwick research | Human oversight paragraph | “Three-quarters of claims professionals surveyed said AI still requires human oversight” |
| O07 | S04 [CIO Dive, Insurance industry still stuck in AI pilot phase](https://www.ciodive.com/news/insurance-industry-stuck-ai-pilot-phase/816759/), 2026-04-06 | Independent trade reporting; underlying vendor synthesis | Spending bullet | “More than four in five insurance companies dedicate at least $5 million annually to AI” |
| O08 | S04, 2026-04-06 | Independent trade reporting; underlying vendor synthesis | Same bullet | “finance teams are unable to tie AI investments to returns” |
| O09 | S05 [New York DFS Circular Letter No. 7](https://www.dfs.ny.gov/industry-guidance/circular-letters/cl2024-07), 2024-07-11 | Regulatory record | Governance/testing section | “Insurers should include standards for model development, implementation, use, and validation” |
| O10 | S05, 2024-07-11 | Regulatory record | Independent review clause | “promote independent review and effective challenge to risk analysis, validation, testing, development” |
| O11 | S05, 2024-07-11 | Regulatory record | Consumer disclosure clause | “such person has the right to request information about the specific data that resulted in the underwriting or pricing decision” |
| O12 | S06 [Hong Kong Insurance Authority, GenA.I. Sandbox++](https://www.ia.org.hk/en/infocenter/press_releases/20260305.html), 2026-03-05 | Regulatory first-party | Launch description | “Participating financial institutions will receive targeted supervisory guidance, technical support, and complimentary access to graphics processing unit” |
| O13 | S07 [Massachusetts DOI Bulletin 2024-10](https://www.mass.gov/doc/bulletin-2024-10-the-use-of-artificial-intelligence-systems-in-insurance-issued-december-9-2024/download), 2024-12-09 | Regulatory record | Section 3.2 | “data currency, lineage, quality, integrity, bias analysis and minimization, and suitability” |
| O14 | S07, 2024-12-09 | Regulatory record | Verification/testing paragraph | “verification and testing methods to identify errors and bias in Predictive Models and AI Systems” |
| O15 | S08 [ACL 2026, InsLogicBench](https://aclanthology.org/2026.acl-long.1035.pdf), proceedings dated 2026-07-02–07 | Academic primary | Abstract | “benchmark providing complete reasoning traces that link factual inputs, relevant policy clauses, and final verdicts” |
| O16 | S08, 2026-07-02–07 | Academic primary | Limitations | “real-world claims frequently contain ambiguous descriptions or incomplete information that complicates the decision process” |
| O17 | S08, 2026-07-02–07 | Academic primary | Limitations | “Practical adjudication often involves multimodal evidence and requires quantitative calculations for loss assessment” |
| O18 | S09 [BLS, Insurance Underwriters](https://www.bls.gov/OOH/business-and-financial/insurance-underwriters.htm), 2024 employment data | Government statistics | Employment section | “Insurance underwriters held about 127,000 jobs in 2024.” |
| O19 | S09, 2024 data/2024–34 projection | Government statistics | Job outlook | “about 8,200 openings for insurance underwriters are projected each year” |
| O20 | S10 [BLS, Claims Adjusters, Appraisers, Examiners, and Investigators](https://www.bls.gov/ooh/Business-and-Financial/Claims-adjusters-appraisers-examiners-and-investigators.htm), 2024 data/2024–34 projection | Government statistics | Job outlook | “about 21,600 openings for claims adjusters, appraisers, examiners, and investigators are projected each year” |
| O21 | S10, 2024 data | Government statistics | Continuing education | “Federal and state laws and the outcomes of claim disputes adjudicated in court affect how the claims must be handled” |
| O22 | S11 [Risk & Insurance, Insurance Industry Poised for Modest Growth](https://riskandinsurance.com/insurance-industry-poised-for-modest-growth-despite-mounting-talent-challenges/), 2026-02-27 | Independent trade reporting; reports Aon/Jacobson survey | Recruiting difficulty paragraph | “One in five companies report that hiring has become more difficult compared to the prior year” |
| O23 | S12 [Deloitte, 2026 Insurance Regulatory Outlook](https://www.deloitte.com/us/en/services/consulting/articles/insurance-regulatory-outlook.html), 2026 edition; page date not supplied | Company first-party; consultancy | Regulatory-change bullets | “new frameworks for artificial intelligence (AI), data governance, and risk management” |
| O24 | S13 [ACORD, Reinsurance & Large Commercial Data Standards](https://www.acord.org/standards-architecture/acord-data-standards/Global_Reinsurance_Data_Standards), undated | Industry-standards first-party | Schema Files bullet | “Schema Files: Scripts that define the structure and content of XML and/or JSON GRLC messages, and can be used to programmatically validate those messages.” |
| O25 | S14 [Guidewire/Shift partnership release](https://ir.guidewire.com/news-releases/news-release-details/guidewire-deepens-relationship-shift-technology-naming-shift-its), 2024-11-12 | Company first-party; vendor claim | Guidewire boilerplate | “More than 570 insurers in 42 countries, from new ventures to the largest and most complex in the world, rely on Guidewire products.” |
| O26 | S14, 2024-11-12 | Company first-party; vendor claim | Shift description | “with the trust of over 115 insurance customers across 25 countries” |
| O27 | S15 [Grant Thornton, How insurance companies can drive tech ROI and growth](https://www.grantthornton.com/insights/articles/insurance/2025/insurance-roi-growth-tech-innovation), 2025 | Company first-party; consultancy survey | ROI paragraph | “Poor governance structures, legacy system complications and employee resistance lead to stalled pilots and wasted resources.” |
| O28 | S16 [Deloitte Netherlands, AI Assurance](https://www.deloitte.com/nl/en/services/audit-assurance/services/algorithm-ai-assurance.html), undated active offer | Company first-party; incumbent offer | Featured services | “Independent Assurance” |
| O29 | S16, undated active offer | Company first-party; incumbent offer | Featured services | “Technical model review & testing” |

### Evidence-quality notes

- S01, S02, S03, S04, S11, S14, and S15 ultimately rely wholly or partly on supplier, consultancy, or commissioned surveys. They establish market signals, not audited prevalence.
- S05, S07, S08, S09, and S10 are the strongest scoring anchors: regulator, academic-primary, and government-statistical records.
- S06 proves controlled sandbox availability only. It does not prove customer-data ownership, retention, training, or cross-client reuse rights.
- S12, S13, and S16 are undated current pages. They are used for nonvolatile product/standards context, not to prove dated financial, customer, or legal status.
- S14’s installed-base figures are vendor claims; the dated partnership itself is directly supported.
- No source is treated as a procurement award or buyer-controlled purchase of an independent insurance Domain Assurance Pack.

## Exa call ledger

Session ID: love  
Toolkit connection: Exa account active  
Discovery timestamp returned by connector: 2026-07-12T09:25:40.019Z  
Cutoff parameter on every search: endPublishedDate=2026-07-11

### E1 — tool discovery

- Connector log: log_vwWXZh5ud-XQ
- Result: EXA_SEARCH and EXA_GET_CONTENTS_ACTION schemas loaded; Exa connection active.
- This was metadata discovery, not an external evidence search.

### E2 — 14 canonical searches

- Connector log: log_nUGYZRjgv_ng
- Tools: 14 × EXA_SEARCH
- Parameters: type=deep; numResults=6; cutoff=2026-07-11; highlights enabled; primary/regulatory/procurement/academic/independent preference.
- Result: 14/14 successful; 84 returned candidates; Exa reported $0.012 per call.

| Lane | Exa request ID |
|---|---|
| pain positive | 1438d6f36b77ae4dcf41d10d99a76c3a |
| pain negative | 5aefe18ec438a3ff92ea24185a48d619 |
| willingnessToPay positive | 6965c7b4d5f0bcaa97321a57ea64e351 |
| willingnessToPay negative | af5fd9c72bf980852de971528bd2771b |
| rightsAccess positive | cc80b6a975922ff6632487b4d7ec0f82 |
| rightsAccess negative | faaf2c389619eab6a9a7b98a0f6ecc61 |
| verifierFeasibility positive | 957f755b8b3a853cb81afd4c05ff446d |
| verifierFeasibility negative | 33891a525cbca30cd8ce0b6f4299f78d |
| expertSupply positive | a0c9afedcb740570392c94a5ae7b60b8 |
| expertSupply negative | f4a87b0ffefa5a9e7e0d54e8d7a6e8ae |
| freshnessBurden positive | d04d5c7658f37dc32c411d498a7ea1fd |
| freshnessBurden negative | b5b7d5f449687145cb04b26f50c535a5 |
| incumbentPressure positive | b5a9d825fc1a7a6c51b97430bb3d782d |
| incumbentPressure negative | d7a4a67d14d84560354041ec449dc6ca |

### E3 — 14 resolution searches

- Connector log: log_cDK_vN06S49i
- Tools: 14 × EXA_SEARCH
- Parameters: type=deep; numResults=5; cutoff=2026-07-11; one dimension-specific resolution query per canonical lane.
- Reason: canonical camelCase queries returned semantically noisy results, especially consumer insurance willingness-to-pay and generic contract rights.
- Result: 14/14 successful; 70 returned candidates; Exa reported $0.012 per call.

| Lane | Exa request ID |
|---|---|
| pain positive | a7bc73f7daca69ef6a5ca42e92a39644 |
| pain negative | 86c37accee55d264a03c2591b4f315f5 |
| willingnessToPay positive | aea537f6da0d369230665a8970432d34 |
| willingnessToPay negative | bc5f0c8be162ebc2c9fb4929b775f53f |
| rightsAccess positive | 46c1c47d8a972beb050f87920f5d5501 |
| rightsAccess negative | 5082ecedf9696d26a518fe19aee643e5 |
| verifierFeasibility positive | 4a6a05dffb153bf3c4b862eb91b6675c |
| verifierFeasibility negative | f3243f0bf54d584f5fe516b3c217ead1 |
| expertSupply positive | fc546553b46e427532199af4451c2b86 |
| expertSupply negative | 9ab10a78557c70b0de88b822b3788871 |
| freshnessBurden positive | 930a61f6729c788aee30bc1ffb5388cf |
| freshnessBurden negative | f3614d111cca5acc963736f3fd2346ef |
| incumbentPressure positive | 54b7eed0aa778eae270d01b3bd0b5860 |
| incumbentPressure negative | 59f07292d0ada27cfb9ae8e5f050cdb6 |

### E4 — first Exa content fetch

- Connector log: log_gXBCVnjTtrfu
- Exa request: 5993efc41b157da2b271c5e1c08cbcd3
- Tool: EXA_GET_CONTENTS_ACTION
- URLs: 8
- Result: 8/8 success; all marked cached; text and highlights returned.
- Exa cost: $0.016.

### E5 — second Exa content fetch

- Connector log: log_LC4K1XlI5IkU
- Exa request: 7dc60632393fdd694af4ee1cfcd9eb1e
- Tool: EXA_GET_CONTENTS_ACTION
- URLs: 8
- Result: 8/8 success; all marked cached; text and highlights returned.
- Exa cost: $0.016.

### E6 — incumbent assurance fetch

- Connector log: log_fxh_xRPpkG-m
- Exa request: 3d14b251796402b30710e6860bf7d0eb
- Tool: EXA_GET_CONTENTS_ACTION
- URLs: 1
- Result: 1/1 success; marked cached.
- Exa cost: $0.002.

Total Exa calls: 31 = 28 searches + 3 content fetches.  
Total URLs fetched: 17.  
Search candidates returned: 154.  
Reported Exa cost: $0.370.  
Failed Exa searches/fetches: 0.

Remote-workbench calls only parsed the saved Exa responses; they did not perform external search or fetch and are excluded from the Exa-call count.

## Reproducibility and boundedness

- No generic web-search tool, browser search, direct curl, or non-Exa fetch was used for external evidence.
- Local reads were limited to the plan, score formula, current receipt schema, and encoded insurance score levels.
- The search cutoff was applied at Exa search time. Sources without machine-readable publication dates were retained only when the document itself supplied a pre-cutoff date or for nonvolatile context with an explicit undated label.
- Search-result snippets alone were not used for retained observations; all retained URLs were fetched with EXA_GET_CONTENTS_ACTION and returned success.
- No workspace file was edited. This report is stored only at /tmp/exa-receipts-insurance.md.
