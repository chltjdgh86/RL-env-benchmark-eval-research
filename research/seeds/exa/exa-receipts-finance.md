ULW-RESEARCH MODE ENABLED!

## Verdict

`regulated_financial_operations` remains a conservative **NO-GO**.

| Dimension | Raw level | Converted | Basis |
|---|---:|---:|---|
| pain | 4 | 4 | Two regulator-primary observations show high financial/regulatory consequences; level 5 withheld because two buyers have not procured the proposed product. |
| willingnessToPay | 3 | 3 | One direct paid procurement: FCA awarded £280,560 for financial-services AI assurance. |
| rightsAccess | 3 | 3 | One documented lawful sandbox path; production-data rights, retention, and reusable contractual access remain unresolved. |
| verifierFeasibility | 3 | 3 | Executable finance benchmarks plus regulator-led shared evaluation exist; no production construct-validity or false-pass evidence. |
| expertSupply | 3 | 3 | Credentialed calibration channels exist, but dual finance-and-AI expertise is explicitly scarce. |
| freshnessBurden | 4 | 1 | Threats, sanctions, and typologies change at daily/high-operations cadence; reliable official feeds prevent level 5. |
| incumbentPressure | 4 | 1 | Google, Oracle, AWS, Big Four, Advai, and internal bank teams are credible bundled substitutes. |

`rawWeightedScore = (4×20 + 3×20 + 3×15 + 3×15 + 3×10 + 1×10 + 1×10) / 5 = 56.0`

Qualification fails because score is below 70 and freshness/whitespace converted scores are below 3. Treat `rightsBlocker=true`: sandbox access does not establish durable rights to production workflows or customer data.

## Auditable search receipts

All searches were executed on 2026-07-12; only evidence published or valid by the 2026-07-11 cutoff was retained.

### 1. Pain

Positive queries:

- `site:cfpb.gov enforcement action bank "automated" "consumer reporting" 2024 2025 financial operations`
- `site:occ.treas.gov "operational risk" bank losses errors regulatory reporting enforcement 2024 2025`
- `site:finra.org enforcement anti-money laundering fine operations 2024 2025`
- `site:fincen.gov/news/news-releases penalty bank anti-money laundering program 2024 2025`
- `site:annualreports.com bank 2024 annual report anti-money laundering remediation spend technology compliance`
- `site:td.com annual report 2025 AML remediation spend compliance investment`
- `site:bankofamerica.com annual report 2025 "financial crimes" technology investment compliance`
- `site:jpmorganchase.com annual report 2025 compliance technology spending financial crime`

Countersearch queries:

- `site:fincen.gov "vast majority of financial institutions" effective AML programs compliant`
- `site:fincen.gov stable AML requirements risk based monitoring not every transaction change`

Truthful domain classes: `regulatory_registry`, `buyer_procurement`.

Closure: evidence supports level 4. TD is a severe outlier; FinCEN itself says the vast majority of institutions partner with it, so universal pain is not established.

### 2. Willingness to pay

Positive queries:

- `site:find-tender.service.gov.uk ("Financial Conduct Authority" OR "Bank of England") "artificial intelligence" contract award`
- `site:contractsfinder.service.gov.uk "Financial Conduct Authority" AI data contract`
- `site:sam.gov "model risk" bank contract award artificial intelligence evaluation`
- `site:usaspending.gov "Financial Crimes Enforcement Network" data analytics contract`
- `site:fca.org.uk "AI Live Testing" firms 2025`
- `site:bankofengland.co.uk AI evaluation pilot financial services firms 2025`
- `site:fca.org.uk artificial intelligence sandbox financial services evaluation procurement`
- `site:sec.gov artificial intelligence pilot financial institution model evaluation 2025`
- `site:contractsfinder.service.gov.uk Advai "Financial Conduct Authority"`
- `site:find-tender.service.gov.uk Advai FCA AI Live Testing contract`
- `"Financial Conduct Authority" "Advai" contract value`
- `"AI Live Testing" Advai procurement award`

Countersearch queries:

- `site:fca.org.uk AI Live Testing "no cost" participants`
- `site:find-tender.service.gov.uk/Notice/ "ocds-h6vhtk-055b82" "Contract change"`
- `site:find-tender.service.gov.uk "C3482" "29 May 2026"`
- `site:find-tender.service.gov.uk "AI Live Testing Support" "£374,080"`

Truthful domain classes: `buyer_procurement`, `regulatory_registry`.

Closure: one paid procurement supports level 3. No second bank-paid AI-assurance contract was found. The FCA sandbox is free to participating firms. The three contract-change searches returned no official indexed result, so the reported 2026 extension value remains unverified.

### 3. Rights and access

Positive queries:

- `site:fca.org.uk digital sandbox GDPR compliant synthetic anonymised pseudonymised financial datasets secure environment`
- `site:ico.org.uk financial services AI personal data lawful basis testing synthetic data guidance`
- `site:fca.org.uk artificial intelligence sandbox financial services evaluation procurement`

Countersearch queries:

- `site:fca.org.uk digital sandbox "not sufficient legal basis" real personal data financial`
- `site:edpb.europa.eu synthetic data anonymisation financial services artificial intelligence privacy guidance`
- `site:occ.treas.gov bank third-party data sharing AI privacy confidential customer information guidance`

Truthful domain class: `regulatory_registry`.

Closure: level 3. FCA provides a documented controlled path using synthetic, public, anonymised, and pseudonymised data. No durable contractual production-data rights, retention terms, cross-bank reuse rights, or bring-to-vendor authorization were found.

### 4. Verifier feasibility

Positive queries:

- `site:fca.org.uk "shared evaluation" AI Live Testing quantitative qualitative financial services`
- `site:arxiv.org anti-money laundering synthetic transaction dataset benchmark ground truth evaluation`
- `site:acm.org anti-money laundering transaction monitoring benchmark labeled dataset false positives financial`
- `site:bis.org AI model validation financial services benchmarks synthetic data fraud detection`
- `"Replayable Financial Agents" DFAH benchmark compliance triage`
- `"CFAgentBench" construction finance agent benchmark`
- `site:arxiv.org financial compliance agent benchmark tool-using LLM environment 2025 2026`
- `site:github.com financial compliance agent benchmark environment replayable`

Countersearch queries:

- `site:bis.org synthetic data limitations anti-money laundering benchmark real data legal practical`
- `("RL environment" OR "agent environment") financial compliance independent assurance bank -vendor`

Truthful domain classes: `regulatory_registry`, `academic_primary`, `technical_repository`.

Closure: level 3. State-diff, forbidden-side-effect, decision, accuracy, and replay checks exist, and FCA testing combines quantitative, qualitative, and SME review. Evidence does not support level 4: most artifacts are synthetic, mock, narrow, or pre-production; no adversarial false-pass or metamorphic validation was found.

### 5. Expert supply

Positive queries:

- `site:acams.org members certified anti-money laundering specialists number 2025 official`
- `site:garp.org FRM certified professionals number 2025 official`
- `site:cfainstitute.org members financial professionals number 2025 official`
- `site:theiia.org certified internal auditor financial services competency official 2025`

Countersearch queries:

- `site:acams.org shortage anti-money laundering professionals skills gap 2025`
- `site:theiia.org financial services internal auditor shortage competent 2025`
- `site:cfainstitute.org AI skills gap finance professionals 2025 survey`
- `site:bis.org financial services AI expertise shortage model risk specialists`

Truthful domain classes: `secondary_discovery` for professional bodies; `regulatory_registry` for BIS/central-bank evidence. The corpus enum has no professional-association class.

Closure: level 3. ACAMS and IIA provide documented credential/exam/recertification paths. No evidence demonstrated repeatable recruitment, contributor utilization, task-author QA, or supply of people combining regulated-operations and AI-evaluation expertise.

### 6. Freshness burden

Positive queries:

- `site:ofac.treasury.gov sanctions list update frequency daily API official`
- `site:fincen.gov advisories alerts financial crime typologies 2025 2026`
- `site:fca.org.uk fraud environment evolving keep updated new techniques typologies financial crime`
- `site:bis.org financial crime patterns evolve real time payments 2025 AI drift`

Countersearch queries:

- `site:ofac.treasury.gov sanctions list service API automated update reliable refresh`
- `site:fincen.gov stable AML requirements risk based monitoring not every transaction change`

Truthful domain class: `regulatory_registry`.

Closure: level 4. OFAC showed updates on successive business days, and regulators require ongoing recalibration. Level 5 is not warranted because OFAC provides live files/API delivery and FinCEN publishes structured alerts and advisories.

### 7. Incumbent pressure

Positive queries:

- `site:cloud.google.com financial-services anti-money-laundering AI product official`
- `site:aws.amazon.com financial-services generative AI model evaluation compliance official`
- `site:microsoft.com financial services AI compliance evaluation official`
- `site:oracle.com financial-services anti-money-laundering AI official`
- `site:pwc.com financial services AI assurance model risk management`
- `site:deloitte.com financial services AI assurance model validation`
- `site:kpmg.com financial services AI assurance testing`
- `site:ey.com financial services AI model risk assurance`

Countersearch queries:

- `site:fca.org.uk financial services AI assurance market gap independent evaluation unmet need`
- `("RL environment" OR "agent environment") financial compliance independent assurance bank -vendor`

Truthful domain classes: `company_first_party`, `buyer_procurement`, `regulatory_registry`, `academic_primary`, `technical_repository`.

Closure: level 4. Oracle already advertises AI-agent simulation that stress-tests financial-crime controls; Google offers AML training/backtesting; AWS bundles evaluation/monitoring; Big Four sell model validation. No evidence establishes commodity pricing or near-zero switching friction, so level 5 is unsupported.

## Source and observation ledger

| ID | Source; publication date | ≤25-word locator/excerpt | Relationship |
|---|---|---|---|
| FIN-S01 | [FinCEN TD Bank enforcement](https://www.fincen.gov/news/news-releases/fincen-assesses-record-13-billion-penalty-against-td-bank); 2024-10-10 | “assessed a record $1.3 billion penalty against TD Bank” | Supports pain 4. Regulator primary. |
| FIN-S02 | [FCA APP synthetic-data page](https://www.fca.org.uk/firms/digital-sandbox/authorised-push-payment-synthetic-data); 2025-03-12, updated 2025-12-05 | “In 2022, APP fraud losses reached £485 million” | Supports pain 4; historical loss observation. |
| FIN-S03 | [TD Q2 2025 results](https://stories.td.com/ca/en/news/2025-05-22-td-bank-group-reports-second-quarter-2025-results); 2025-05-22 | “BSA/AML remediation and related governance and control investments of approximately US$500 million pre-tax” | Context for pain/WTP; buyer first-party, not proposed-product spend. |
| FIN-S04 | [FCA AI Live Testing award](https://www.find-tender.service.gov.uk/Notice/054567-2025); 2025-09-08 | “This contract is for AI assurance consultancy expertise to support the AI Live Testing service.” | Supports WTP 3 and incumbent pressure. Primary procurement record. |
| FIN-S05 | [FCA second AI Live Testing cohort](https://www.fca.org.uk/news/press-releases/fca-announces-second-cohort-ai-live-testing); 2026-04-21 | “Eight new firms, including Barclays, Experian, Lloyds Banking Group … and UBS, have been chosen … to live test AI applications” | Supports buyer interest; no spend evidence. |
| FIN-S06 | [FCA Supercharged Sandbox](https://www.fca.org.uk/firms/innovation/supercharged-sandbox); 2026-04-20, updated 2026-05-05 | “No, there is no cost to take part.” | Contests WTP above level 3. |
| FIN-S07 | [FCA Digital Sandbox](https://www.fca.org.uk/firms/innovation/digital-sandbox); 2020-04-28, updated 2025-10-30 | “Marketplace for 300+ synthetic, public, anonymised and pseudonymised data sets and over 1000 API end points.” | Supports rightsAccess 3. |
| FIN-S08 | [FCA synthetic-data AML report](https://www.fca.org.uk/publications/research-notes/research-note-synthetic-data-anti-money-laundering-project-report); 2026-04-15 | “legal and privacy constraints often restrict sharing of such information.” | Contests rightsAccess above 3. |
| FIN-S09 | [ICO AI lawfulness guidance](https://ico.org.uk/for-organisations/uk-gdpr-guidance-and-resources/artificial-intelligence/guidance-on-ai-and-data-protection/how-do-we-ensure-lawfulness-in-ai/); updated 2024-10-28 | “Such processing could rely on legal obligation as a basis, but this would only cover the auditing and testing of the system” | Partially supports a lawful testing path; purpose-limited. |
| FIN-S10 | [FCA AI Live Testing method](https://www.fca.org.uk/news/blogs/ai-live-testing-how-it-can-support-safe-and-responsible-ai-deployment); 2026-01-30 | “AI system testing (including shared evaluation)” | Supports verifierFeasibility 3 and expert review. |
| FIN-S11 | [BIS Project Hertha](https://www.bis.org/about/bisih/topics/fmis/hertha.htm); updated 2025-06-05 | “The experiments were conducted using a state-of-the-art simulated synthetic transaction dataset” | Supports technical feasibility; contests real-world construct validity. |
| FIN-S12 | [IBM realistic synthetic AML datasets](https://arxiv.org/abs/2306.16424); 2023-06-22 | “ground truth labels are complete, whilst many laundering transactions in real data are never detected.” | Supports machine-gradeable proxies; context-only for production. |
| FIN-S13 | [Replayable Financial Agents / DFAH](https://arxiv.org/abs/2601.15322); 2026-01-17 | “Three financial benchmarks are provided … along with an open-source stress-test harness.” | Supports verifierFeasibility 3; single-author/pre-production limitation. |
| FIN-S14 | [IBM DFAH repository](https://github.com/ibm-client-engineering/output-drift-financial-llms/blob/main/DFAH.md); current by cutoff | “DFAH ships with three financial agent tasks (50 test cases each)” | Technical-repository corroboration; narrow benchmark tasks. |
| FIN-S15 | [CFAgentBench](https://arxiv.org/abs/2606.22000); 2026-06-20 | “functional correctness - a state diff plus forbidden-side-effect checks plus required-output regexes” | Partially supports verifier feasibility; construction-finance context, not banking production. |
| FIN-S16 | [ACAMS certification release](https://www.acams.org/en/media/document/39370); 2025-07-15 | “certified more than 140,000 professionals in over 200 jurisdictions and territories” | Supports a credentialed expert channel. Association first-party. |
| FIN-S17 | [IIA 2026 audit survey](https://www.theiia.org/en/content/communications/press-releases/2026/march/internal-audit-is-being-asked-to-do-more-with-less-according-to-new-report-from-the-internal-audit-foundation/); 2026-03-10 | “serves more than 265,000 global members and has awarded more than 200,000 Certified Internal Auditor certifications worldwide” | Supports a second credentialed channel. |
| FIN-S18 | [BIS-hosted central-bank speech](https://www.bis.org/review/r260520d.htm); 2026-05-20 | “A major constraint is the shortage of skilled AI professionals, both in industry and in supervisory authorities.” | Contests expertSupply above 3. |
| FIN-S19 | [CFA Finance Skills Pulse](https://www.cfainstitute.org/insights/professional-learning/skills-pulse-survey); 2026-05-01 | “a gap exists between the expectations of established finance professionals and the readiness of new entrants” | Contests expertSupply above 3. |
| FIN-S20 | [OFAC sanctions-list updates](https://ofac.treasury.gov/recent-actions/sanctions-list-updates); rolling page, latest used entry 2026-07-01 | “Displaying 1 - 10 of 1884 results.” | Supports freshnessBurden 4; successive daily entries visible. |
| FIN-S21 | [OFAC advanced-list FAQ](https://ofac.treasury.gov/sdn-list-data-formats-data-schemas/frequently-asked-questions-on-advanced-sanctions-list-standard); date not stated | “the new files contain live data and will be updated at the same time as all of OFAC’s other list products.” | Contests burden level 5: reliable automated refresh exists. |
| FIN-S22 | [FinCEN alerts/advisories](https://www.fincen.gov/resources/advisoriesbulletinsfact-sheets); rolling page, latest used entry 2026-06-30 | “Advisories often contain illicit activity typologies, red flags that facilitate monitoring” | Supports ongoing refresh burden. |
| FIN-S23 | [FCA financial-crime speech](https://www.fca.org.uk/news/speeches/working-together-against-financial-crime); 2026-05-14 | “Criminals are adopting new technology at pace, and we have to keep up.” | Supports freshnessBurden 4. |
| FIN-S24 | [Google Cloud AML AI overview](https://docs.cloud.google.com/financial-services/anti-money-laundering/docs/concepts/overview); updated 2026-06-20 | “Google Cloud's Anti Money Laundering AI … is an API that scores AML risk.” | Supports incumbentPressure 4; vendor claim. |
| FIN-S25 | [Google Cloud AML AI pricing](https://cloud.google.com/financial-services/anti-money-laundering/pricing); date not stated | “No registration is required for training, tuning, or backtesting.” | Supports bundled training/evaluation pressure; vendor first-party. |
| FIN-S26 | [Oracle FCCM](https://www.oracle.com/financial-services/aml-financial-crime-compliance/); date not stated, temporal unknown | “deploys AI agents in a simulation environment that stress tests financial crime programs” | Strong direct adjacent incumbent; vendor claim. |
| FIN-S27 | [AWS Financial Services Industry Lens](https://docs.aws.amazon.com/wellarchitected/latest/financial-services-industry-lens/fsiops01.html); date not stated | “Implement a formal model validation process as well as comprehensive model evaluation capabilities” | Supports hyperscaler bundling; vendor guidance. |
| FIN-S28 | [Deloitte financial-services GenAI validation](https://www.deloitte.com/uk/en/Industries/financial-services/blogs/validating-genai-models.html); 2024-10-18 | “regulations require them to be subject to Model Risk Management controls” | Context and incumbent pressure; consultancy first-party. |
| FIN-S29 | [PwC AI Risk Modeling](https://www.pwc.com/us/en/services/audit-assurance/risk-modeling-services/ai-risk-modeling-services.html); date not stated | “helps organizations independently assess AI systems for alignment with … regulatory requirements, and compliance standards” | Supports incumbent pressure; consultancy first-party. |
| FIN-S30 | [FCA/Bank of England AI survey](https://www.fca.org.uk/publications/research-notes/ai-uk-financial-services); updated 2025-12-03 | “33% of AI use cases are from third parties.” | Counter-context: internal development is also a major substitute. |

## Explicit unresolved results

- No public bank-paid contract for an executable financial-operations RL environment or domain-assurance pack was found.
- No second independent paid buyer was found for financial-services AI assurance.
- No public license established durable reuse rights for bank production traces, customer data, or workflow replicas.
- FCA AI Live Testing’s evaluation report was scheduled for Q1 2027 and did not exist by cutoff.
- No verifier source reported production false-pass rates, mutation testing, metamorphic testing, or transfer from synthetic to live bank distributions.
- No source demonstrated repeatable recruitment, QA, utilization, or retention of finance-domain task authors.
- No official publication date was visible for the Oracle, AWS, PwC, or OFAC FAQ pages; use them with `temporal=unknown`, not as sole current-claim support.
- No exact commercial match for “independent financial-compliance RL environment assurance” surfaced, but Oracle’s simulation product and open benchmarks materially narrow that whitespace.

## EXPAND

- LEAD: Obtain the FCA–Advai 2026 contract-change notice and executed extension value.  
  WHY: repeat procurement could strengthen WTP, though still from one buyer.  
  ANGLE: Find a Tender OCDS record/API for `ocds-h6vhtk-055b82`, FCA procurement disclosure, Advai accounts.

- LEAD: Obtain FCA AI Live Testing participant-level evaluation results and Q1 2027 report.  
  WHY: needed to distinguish a paid assurance pilot from proven verifier validity.  
  ANGLE: Barclays, UBS, Lloyds, NatWest, Monzo, Santander, Experian, and FCA publications.

- LEAD: Inspect Digital/Supercharged Sandbox terms, data licenses, retention, export, and model-training restrictions.  
  WHY: required to move rightsAccess beyond level 3.  
  ANGLE: NayaOne terms, FCA application agreements, data-provider licenses, DPIAs.

- LEAD: Execute DFAH/CFAgentBench and audit task provenance, oracle quality, mutation resistance, and hidden-test integrity.  
  WHY: current evidence proves existence, not construct validity.  
  ANGLE: pin repository SHAs, run harnesses, mutate expected states, inspect false-pass behavior.

- LEAD: Find bank procurement or annual-report disclosure specifically for external AI model/agent validation.  
  WHY: broad AML remediation spending does not prove demand for the proposed product.  
  ANGLE: bank supplier registers, regulatory consent-order consultants, model-risk tenders, audit committee disclosures.

- LEAD: Verify Oracle Compliance Agent launch date, customers, pricing, and production scope.  
  WHY: it is the closest major-incumbent match but currently only vendor-positioned.  
  ANGLE: Oracle release notes, customer references, SKU documentation, analyst briefings.

- LEAD: Measure the finance-plus-AI expert labor pool.  
  WHY: professional certifications do not establish recruitability for environment/verifier creation.  
  ANGLE: completed contributor projects, calibrated acceptance rates, task-author inter-rater agreement, rates, utilization.

- DEAD END: Exact official searches for the reported £374,080 FCA contract extension produced no indexed Find a Tender notice by cutoff.
- DEAD END: SAM.gov, USAspending, SEC, and Bank of England searches found no second directly comparable paid AI-assurance procurement.
