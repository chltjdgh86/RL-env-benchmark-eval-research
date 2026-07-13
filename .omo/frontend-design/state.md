# Frontend Design State: The RL Economy Atlas

Last updated: 2026-07-11  
Mode: Auto within the approved build request  
Phase: Design contract complete; primitive implementation and verification pending

## Current Objective

Build a responsive, source-first research atlas that lets a reader understand the AI post-training economy, compare companies, trace claims to evidence, and evaluate candidate newcomer strategies without losing uncertainty or provenance.

## Locked Decisions

| Decision | Locked choice | Why it is locked / reopen condition |
|---|---|---|
| Product identity | **The RL Economy Atlas**, strapline **From labor to learning systems** | Matches the chosen concept and research scope; reopen only for a user naming decision |
| Visual contract | `.omo/frontend-design/references/rl-economy-atlas-concept.png` | Selected from three Imagen concepts; implementation must preserve the broadsheet geometry and evidence-circuit signature |
| Taste sources | `minimalist-skill.md` + `wired.md`, adapted rather than copied | Supplies editorial restraint, square geometry, type roles, and rule-based density without adopting WIRED branding |
| Color/material | Warm newsprint paper, black ink, electric orange circuit; borders-only depth | The signature system; no gradients, shadows, glass, purple AI palette, or rounded cards |
| Information architecture | Technical value chain first: signal/data → environments → post-training → evaluation/assurance → deployment → transformation | More stable and technically accurate than treating every market buzzword as a peer industry |
| Evidence model | Exact corpus fields map to separate `SRC`, `CTRL`, per-source `RELATION`, derived `SUPPORT`, `CONF`, `TIME`, `RISK`, `ACCESS`, and `KIND` displays; expanded evidence also exposes locator/dates, `claimAlignment`, `independenceGroup`, and any single-source exception | `kind` is a canonical persisted URL/filter facet mapped to `Claim.kind`; global URL state never exposes `supportRelation`. Source/Observation/Claim/relationship ownership remains separate, while support summary/group count are derived. Machine values and labels are exhaustive in `DESIGN.md` Section 2 |
| Newcomer framing | Four exact strategic models are a qualitative research comparison; only `vertical_domain_assurance_pack` is `eligible_hypothesis`, while `specialist_independent_eval_lab`, `environment_foundry`, and `ax_transformation_studio` are `countersearched_out`; five fixed vertical candidates gate the sole eligible hypothesis or produce no-go | The four models never receive scores, ranks, weights, winners, or selected styling. The vertical scorer and seven weights are read-only; users inspect evidence and methodology but cannot override them |
| Surface architecture | Wide masthead + persistent section rail/search/filter + central canvas + contextual evidence rail; compact drawers on narrow screens | Extracted from concept and real-product layout research |
| Diagram implementation | Semantic SVG/HTML with a visible text/table equivalent | Accessibility and source integrity requirement; no canvas-only art |
| Theme | Light newsprint only in v1; support increased contrast and forced colors, not a decorative dark theme | The paper metaphor is the identity. Reopen only if the user requests dark mode or testing shows a light-only blocker |
| Brand assets | Company names as text; no copied logos | Avoids licensing ambiguity and keeps evidence central |
| Implementation stack | Static Vite + React + strict TypeScript, local versioned corpus | Approved project plan; no backend, auth, CMS, analytics, or live scraper |
| Factual cutoff | Current-state evidence cutoff is 2026-07-11 | Prevents silent drift; future refreshes must update the date and affected source observations |
| Post-cutoff supplement | 2026-07-12 user/Exa discoveries are a labeled supplemental census and cannot establish cutoff-current status or scores without dated pre-cutoff evidence | Keeps the locked cutoff honest while allowing new leads to remain searchable as time-unknown, historical/acquired, or unresolved records |
| Motion | Evidence opacity trace and compact rail reveal only | Motion must explain relationship or state; reduced motion makes all transitions immediate |

## Source Inputs

### Design and planning

- Design system contract: `DESIGN.md`
- Chosen static visual reference: `.omo/frontend-design/references/rl-economy-atlas-concept.png`
- Build draft: `.omo/drafts/rl-market-intelligence-site.md`
- Work plan: `.omo/plans/rl-market-intelligence-site.md`
- Research journal: `.omo/ulw-research/20260711-034936/`

### Research lanes reflected in the contract

- Embedded reference shortlist: WIRED, IBM, Together; selected minimalist + WIRED.
- Lazyweb: three queries, four viewed real-product screens (NationGraph, Affinity, Mixpanel, Clay).
- Imagen: white editorial, dark terminal, and warm newsprint atlas concepts; warm newsprint selected.
- UI/UX database: density, chart-labeling, and accessibility guidance; suggested palette/type rejected.

### Explicit exclusions

- Generated concept copy and counts are placeholders, not evidence.
- No third-party logo, proprietary font, visual brand mark, or copied editorial module is an implementation asset.
- No framesmith, Figma bridge tooling, `figma-bridge`, canvas adapter, or `canvas_evaluate` route is permitted.

## Design Brief

### Problem statement

The market is noisy, private-company claims are often non-comparable, and the requested categories overlap technically. The interface must make the structure legible while preserving source type, control relationship, support, confidence, time basis, risk, access, claim kind, contradiction, and unknowns at the point of use.

### Target users

1. Strategy and investment readers who need an accurate landscape and fast company comparisons.
2. Technical post-training leaders who need precise taxonomy, environment/evaluation boundaries, and vendor operating detail.
3. Researchers using keyboard and screen-reader workflows who need semantic navigation, equivalent diagram content, and predictable focus.
4. Time-constrained operators who need the thesis, decision points, and evidence on a phone or small laptop during interruptions.

### Primary journeys

| Journey | Successful outcome |
|---|---|
| Orient to the market | Reader understands the value chain and why RLHF, RLVR, DPO, environments, evals, and AX are not peer categories |
| Inspect a company | Reader finds origin, initial wedge, current offer, buyers, GTM, operating model, risks, status, contradictions, and direct sources |
| Compare vendors | Reader compares up to three companies and sees when revenue, run rate, network, margin, or customer claims are not comparable |
| Trace evidence | Reader moves from claim/evidence tag to the exact source entry and back without losing context |
| Evaluate an entry strategy | Reader reviews four unscored qualitative strategic models, then inspects a fixed read-only scorecard for five vertical candidates that conditionally gates the Domain Assurance Pack or yields no-go |
| Resume/share | Deep link restores the section/company/filter state and invalid state fails gracefully with an explanation |

### Information hierarchy

1. Product identity, evidence cutoff, global search, and corpus counts.
2. Executive thesis and radial market/value-chain map.
3. Industry taxonomy, history, and buyer/GTM/economic structures.
4. Company dossiers, comparison, and adjacent landscape.
5. Newcomer playbook: sole Domain Assurance Pack hypothesis, separate four-model qualitative comparison, fixed five-vertical gate, counterevidence, assumptions, uncertainty, and kill criteria.
6. Source library, methodology, limitations, and export/access routes.

### Fixed vertical-gate contract

- **Candidate rows:** regulated financial operations, insurance, healthcare administration, enterprise software/support, and public-sector administration only.
- **Read-only criteria:** pain 20%, willingness to pay 20%, rights access 15%, verifier feasibility 15%, expert supply 10%, inverted freshness burden 10%, and inverted incumbent pressure 10%.
- **Evidence behavior:** every 0–5 cell exposes measured/effective/converted values, claims, observations, cap or missing reason, `positiveSearchReceiptId`, and `negativeSearchReceiptId`. A valid missing cell stores `convertedScore=0`, `measuredLevel=null`, empty claim/observation evidence, a nonblank `missingReason`, and resolved nonblank receipt IDs. Missing freshness/incumbent cells conservatively impute effective raw level 5 only for conversion, retain null measured level, yield `convertedScore=0`, and visibly read `IMPUTED · NO PUBLIC EVIDENCE`. Vendor-only, low-confidence, disputed, unresolved, or stale positive evidence caps at 2; one eligible independence group caps at 3.
- **Rights blocker:** any current disputed/unresolved high-risk rights/privacy/security claim, absent lawful-rights observation, or rights access below 3 disqualifies.
- **Qualification:** full-precision score ≥70; every benefit dimension ≥3; both inverted burden/pressure values ≥3; two separate buyer-controlled/procurement observations; no rights blocker; every nonmissing cell evidence backed; every valid missing cell closed by empty evidence, nonblank `missingReason`, resolved receipt IDs, null measured level, and conservative imputation; and the highest qualifying vertical leads the second-highest candidate, qualified or not, by ≥10 points. Fixed tie order is full score, willingness to pay, rights access, verifier feasibility, lower freshness burden, lower incumbent pressure, then lexical strategy ID.
- **Only outputs:** `CONDITIONAL GO · DOMAIN ASSURANCE PACK · <VERTICAL>` or `NO-GO — DISCOVERY REQUIRED`. No UI control, URL parameter, or form state can change weights, cells, gates, ordering, or output.

### Tone and content rules

- Specific, analytical, and plain-spoken; never promotional.
- Lead with the finding, then qualification, then the separate evidence dimensions.
- Use “company-reported,” “announced,” “independently corroborated,” “not publicly verified,” and exact date language instead of smoothing uncertainty.
- Proposed prices and strategic moves are labeled experiments, recommendations, or analysis under `KIND`, not observed market facts.
- Fixed scorecard output is either `Conditional go · Domain Assurance Pack · <vertical>` or `No-go · Discovery required`. It never guarantees product-market fit, and the weights are not user-editable.
- New-tab and download/export behavior is announced before activation.

### Design principles and taste signals

- Evidence before ornament.
- One continuous broadsheet rather than a dashboard of cards.
- Dense through alignment and hierarchy, never tiny type.
- Visible, orthogonal provenance/support/confidence/time/risk/access/claim-kind signals and comparability warnings.
- Warm tactile paper, hard ink rules, and one electric-orange evidence circuit.
- Square, direct, and editorial. The page should look assembled by an investigative design desk, not generated from a SaaS template.

### Success criteria

- A first-time reader can explain the value chain after the overview and map.
- Any factual paragraph or quantitative claim exposes direct source access plus exact `sourceType`, `control`, per-source `supportRelation`, derived `supportSummary`, `confidence`, `temporal`, `risk`, `access`, and `kind` labels where applicable; expanded evidence retains its locator/dates, alignment, independence group, and any single-source exception.
- The four strategic models remain qualitative and unranked. Exactly five vertical candidates use the fixed read-only gate; Domain Assurance Pack appears only as a pre-gate hypothesis, conditional-go result, or no-go.
- All ten requested dossiers are reachable by search, filter, index, map, and deep link.
- Keyboard and screen-reader users can complete the same primary journeys as pointer users.
- 320px, compact, medium, atlas, 200% zoom, 400%-equivalent reflow, WCAG text-spacing, reduced-motion, and high/forced-contrast states preserve content and function.
- The production surface visually retains the warm paper, hard-rule grid, condensed/editorial type contrast, and orange evidence circuit from the selected concept.

## Inclusive Personas

### P1 — Mina, strategy reader under decision pressure

- **Context:** scans on a 13-inch laptop between meetings; high domain fluency, low tolerance for unexplained UI.
- **Goals:** identify category structure, compare three vendors, separate who controls a source from whether it supports a claim, share a deep link.
- **Stressors:** interrupted attention, large content volume, non-comparable metrics, stale claims.
- **Pass:** reaches a sourced comparison and the fixed vertical gate in under five navigational actions; active filters, fixed weights, evidence cutoff, and conditional-go/no-go status remain visible.
- **Fail:** must remember hidden filter state, infer control/support/confidence from one badge or color, can edit score weights, sees a strategic model scored, or sees the pre-gate hypothesis styled as a winner.

### P2 — Ravi, technical post-training lead

- **Context:** uses a wide monitor and keyboard heavily; understands RL methods and checks definitions closely.
- **Goals:** separate feedback regimes from optimization methods, inspect environment/verifier architecture, trace claims to primary technical sources, shortlist vendors.
- **Stressors:** marketing category collapse, diagrams without exact definitions, source links divorced from the technical claim.
- **Pass:** navigates map nodes by keyboard, reaches technical definitions and sources, and sees training/evaluation split plus verifier assumptions.
- **Fail:** DPO is shown as a peer “industry,” diagram edges have no text equivalent, or a vendor assertion is presented as independent truth.

### P3 — Elena, keyboard and screen-reader researcher

- **Context:** blind researcher using VoiceOver or NVDA with browser keyboard commands; may also use speech input when fatigued.
- **Goals:** traverse landmarks and headings, search companies, open a dossier, understand the market map through its equivalent table, inspect source metadata, close drawers predictably.
- **Stressors:** focus loss, repeated unnamed navigation, visually ordered but semantically scrambled content, icon-only controls, live-region chatter.
- **Pass:** completes search → dossier → citation → return with a stable focus path; every diagram insight is available in prose/table form; drawer focus traps and restores correctly.
- **Fail:** essential content exists only in SVG geometry/hover, route changes are silent, or filter updates steal focus.

### P4 — Theo, time-constrained field operator

- **Context:** checks the atlas on a 375px phone, sometimes one-handed, with interruptions and variable network; may use large text.
- **Goals:** read the executive thesis, check one company’s current status, review top entry moves and kill criteria, copy/share a source.
- **Stressors:** tiny controls, wide tables, deep nested accordions, clipped long names, lost place after interruption.
- **Pass:** uses 44px controls, compact search/navigation, labeled comparison rows, and stable deep links without page-level horizontal scroll.
- **Fail:** must pinch-zoom, drag a full-page canvas, or dismiss overlapping sticky elements to read content.

### Ability-spectrum stress cases

- Low vision at 200% and 400% browser text scaling.
- Protanopia/deuteranopia where orange, red, and green cannot carry meaning alone.
- Temporary motor limitation requiring keyboard-only or large touch targets.
- Cognitive fatigue requiring persistent location cues, concise summaries, and reversible actions.
- Reduced-motion or vestibular sensitivity requiring immediate state changes.
- Forced-colors/high-contrast mode replacing the paper palette.

## Adaptive Preferences

| Preference / environment | Required response | Verification |
|---|---|---|
| `prefers-reduced-motion: reduce` | Zero-duration state changes; no transform; all information remains visible | Browser emulation plus keyboard flow |
| `prefers-contrast: more` | Strengthen quiet rules to ink, suppress paper grain, preserve evidence words/patterns | Browser emulation and screenshot |
| Forced colors | Use system colors and native focus; retain border styles, visible labels, and selected/current semantics | Chromium/Windows forced-colors emulation where available |
| 200% zoom | Reflow to compact/medium layout; drawers stay in viewport; no page-level horizontal overflow | 1280px viewport at 200% |
| 400%-equivalent / 320px reflow | Preserve all content/function with no page-level two-dimensional scroll; actual 400% browser zoom preferred, otherwise label a 320 CSS-pixel effective viewport as equivalent | 1280px at 400% plus 320px fallback evidence when necessary |
| Text spacing overrides | Line height 1.5× font size, paragraph spacing 2×, letter spacing 0.12×, word spacing 0.16×; no clipping, overlap, truncation, or fixed-height text boxes | WCAG text-spacing style injection on every route and showcase |
| Keyboard only | Logical order, SkipLink, visible focus, Escape/restore, no pointer-only operation | Manual full journey |
| Screen reader | Named landmarks/navs, route H1 focus, restrained live regions, equivalent diagram tables | VoiceOver or accessibility-tree inspection plus keyboard |
| Touch / coarse pointer | 44px targets and no hover requirement | 375px mobile emulation and tap journey |
| Dark color scheme | Remain intentionally light newsprint in v1; declare `color-scheme: light`; no broken UA control contrast | Dark OS preference with app inspection |
| Data saver / slow network | Core local corpus and system fallbacks remain readable before custom fonts; paper texture is nonessential | Disabled cache/throttled load smoke |
| Long names / source titles | Wrap naturally; never fixed-height truncate essential content | Stress fixture with longest corpus strings |
| Print | Remove sticky/drawer behavior and texture; expand disclosures; append source URLs | Print preview/PDF inspection |

## Primitive State Ledger

The complete specifications live in `DESIGN.md` Section 5. This ledger records the implementation obligation before product composition.

| Primitive | Required functional states | Compact adaptation |
|---|---|---|
| SkipLink | hidden, focus-visible | unchanged |
| Masthead | full, compact, corpus loading/loaded/error | title scales; search moves to toolbar |
| UtilityNav / SectionRail | default, hover, current, focus, disabled, empty filter summary | modal navigation drawer |
| ContextRail | instruction, view options, evidence sample | inline disclosure after active content |
| SearchField | idle, focused, populated, submitting, results, zero, invalid, disabled | full-width sticky-toolbar control |
| FilterControl / FilterTray | closed, open, selected, focus, disabled, loading, empty, invalid combination; canonical persisted `kind` facet; no global `supportRelation` facet | drawer/tray with focus restore and the same URL round-trip semantics |
| ClaimText / EvidenceTagSet | exact `sourceType`, `control`, `supportRelation`, derived `supportSummary`, `confidence`, `temporal`, `risk`, `access`, and `kind` labels; compact/expanded; contested, not-publicly-verified, contradicted, high-risk, degraded-access, and missing-source states | compact claim fields plus derived summary/source IDs; expanded `<dl>` also exposes observation locator/dates, `claimAlignment`, `independenceGroup`, and any single-source exception using the canonical display table |
| SourceLink | inline/full, hover, focus, visited, `open`/`paywalled`/`login_gated`/`archived`/`unavailable`/`secondary_only`, verification loading | exact source-type label and embedded group prefix + control + access + observation anchor wrap under title; support/alignment/group stay claim-specific |
| Metric | loaded, loading, observed/reported/calculated kind, not-publicly-verified, non-comparable, error | label/value stacks; qualifier and independent evidence axes retained |
| SectionRibbon | primary, outline, action hover/focus/disabled | wraps to two rows if needed |
| DataTable | default, sorted, row hover/selected, focus, loading, empty, error, incompatible warning | semantic labeled rows first; named scroll region only when essential |
| TimelineItem | milestone/transaction/product/customer/risk event; default, selected, loading, empty, error; independent `temporal`/`kind`/derived `supportSummary` fields | marker line simplified, text and labels unchanged |
| MarketMap / Node / Edge | default, hover, focus, selected, related, dimmed, loading, empty, error | text/table default; visual map optional |
| DossierHeader | company, industry, strategy; current, historical, uncertain, announced transaction | metadata stacks under title |
| ComparisonRow | comparable, partial, incompatible, missing | repeated `<dl>` per company |
| StrategyHypothesis | four qualitative unscored model rows; only Domain Assurance Pack research-eligible; incomplete/countersearched/error evidence states; research-receipt drilldown | stacked qualitative rows; no scores, ranks, weights, winner, or selected state |
| Scorecard | five fixed vertical rows; loading, incomplete, capped, missing inverse/imputed, rights-blocked, conditional-go, no-go, error; two-receipt drilldown per cell | read-only criteria/weights/evidence; missing inverse shows null measured level, effective raw 5, converted 0, and `IMPUTED · NO PUBLIC EVIDENCE` |
| Accordion | collapsed, expanded, hover, focus, disabled, loading, error | unchanged |
| Drawer | closed, open, closing, loading, error; trap and restore | navigation/filter/evidence variants |
| EmptyState / ErrorNotice | no result, no filter match, bad deep link, missing evidence, parse failure; recovery action | full-width plain text |

## Primitive Showcase Contract

Status: **required before product-screen composition; not yet verified**.

- Canonical route: `#/showcase`.
- Use final tokens, fonts, paper recipe, primitives, and contextual atlas copy.
- Render every state in the ledger, including the exact schema-to-label map and evidence co-occurrence matrix, invalid deep link, incompatible comparison, table empty/error, map selected/dimmed/error, and drawer focus restore.
- Evidence fixtures must include: `regulatory_record + subject_controlled + supports`; `independent_reporting + independent + contests`; `kind=inference + supportSummary=supported + confidence=medium|high`; `temporal=current + risk=high_risk`; and `access=unavailable`. Compact and expanded views must preserve the fields.
- Filter fixtures must prove `kind` survives canonical URL serialization/back/forward as `Claim.kind`, while a global `supportRelation` query is never emitted or accepted as a facet.
- Render Domain Assurance Pack as the sole neutral pre-gate product hypothesis. Render the four strategic models in an unscored qualitative table. Render exactly five fixed vertical rows — regulated financial operations, insurance, healthcare administration, enterprise software/support, public-sector administration — with read-only weights and both conditional-go and no-go fixtures.
- Include an evidenced cell and a missing inverse cell with both receipt drilldowns. The missing inverse fixture must visibly show `measuredLevel=null`, effective raw imputation 5, converted score 0, and `IMPUTED · NO PUBLIC EVIDENCE` without pretending 5 was observed.
- Confirm no score/rank/weight appears on the four models and no score weight can be edited by pointer, keyboard, URL, or form state.
- Include a live interaction bench and a static state gallery; forced-hover/focus specimens supplement but do not replace real interactions.
- Capture at 320×800, 375×812, 768×1024, and 1280×900; repeat at 200% zoom, actual 400% zoom when supported, 320px effective-width equivalence, WCAG text spacing, and reduced motion.
- Drive SkipLink, search, filters, sorting, accordion, diagram node, and drawer entirely by keyboard.
- Check accessibility tree/roles, live regions, touch targets, contrast, overflow, clipping, and design-token compliance.
- Evidence destinations: `.omo/evidence/task-5-rl-market-intelligence-site/` and `.omo/visual-qa/`.
- Exit rule: all Critical/Major visual, interaction, persona, and accessibility findings are fixed and reverified. Minor/Note deferrals enter the debt register with affected users and owner.

## Verification Matrix

No row may be marked pass without a real artifact from the actual surface.

| Gate | Surface / scenario | Required evidence | Pass condition | Status |
|---|---|---|---|---|
| Contract validation | `DESIGN.md` + state | Required headings/tokens/primitives; exact enum/label map; canonical `kind` URL facet; relationship-only `supportRelation`; qualitative four-model comparison; fixed five-vertical gate; missing inverse imputation; research receipts; debt/evidence tables | Complete, internally consistent, and free of schema aliases, global relationship facets, model scores, editable weights, false observed inverse levels, or pre-gate winner styling | Ready for checker |
| Primitive visual QA | `#/showcase` at 320/375/768/1280 | Screenshots and state captures | No overflow/clipping; concept/tokens preserved | Pending implementation |
| Primitive interaction | Showcase keyboard and touch | Browser trace/notes | Every applicable state and focus path works | Pending implementation |
| Responsive/reflow | All routes at 320/375/768/1280, 200%, and 400%-equivalent | Screenshots plus overflow measurements | No lost content/function; no page-level two-dimensional scroll | Pending implementation |
| Accessibility | Keyboard, accessibility tree, axe/Lighthouse, exact WCAG text-spacing injection | Reports plus manual journey | Zero Critical/Serious violations; no spacing clipping/overlap; personas pass | Pending implementation |
| Adaptive preferences | Reduced motion, more contrast, forced colors, dark OS, print | Screenshots/inspection notes | Required adaptations in table above hold | Pending implementation |
| Reference fidelity | Production view against chosen concept | Visual QA comparison and design critique | Broadsheet geometry, paper material, type contrast, rules, and orange circuit survive | Pending implementation |
| Performance | Production build in real Chromium | Lighthouse mobile/desktop median, render checks | Plan targets met without removing content or identity | Pending implementation |
| Persona walkthrough | P1–P4 primary journeys | Task/steps/outcome/barrier matrix | No persona-blocking finding | Pending implementation |
| Heuristic review | Key journeys, Nielsen H1–H10 | Located findings with severity | Critical/Major repaired and reverified | Pending implementation |
| Final review | Significant implementation packet | `.omo/review-work/` verdicts | All required lanes approve | Pending implementation |

## Decisions Log

| Date | Decision | Rationale | Evidence |
|---|---|---|---|
| 2026-07-11 | Chose warm newsprint concept over white editorial and dark terminal concepts | Best fit for high-density research, market maps, source tags, and a memorable non-SaaS identity | `.omo/frontend-design/references/rl-economy-atlas-concept.png` |
| 2026-07-11 | Adapted minimalist + WIRED rather than cloning a brand | Preserves editorial grid/type/rule craft while producing an original atlas | `DESIGN.md` Research Log |
| 2026-07-11 | Kept electric orange as graphic evidence circuit and introduced darker orange for text | Bright orange alone fails normal-text contrast on paper; role separation protects accessibility | `DESIGN.md` Color table |
| 2026-07-11 | Defined three font roles | Dense research needs structural scanning, long-form reading, and exact evidence/figure registers | `DESIGN.md` Typography |
| 2026-07-11 | Made text/table equivalents mandatory for diagrams | Ensures the evidence model works without vision, SVG, or fine pointer input | Plan Todo 7 and `DESIGN.md` Components |
| 2026-07-11 | Limited comparison to three companies | Preserves readable comparisons and reduces cognitive load at compact and wide sizes | `DESIGN.md` cognitive constraints |
| 2026-07-11 | Declined v1 dark theme | The selected paper metaphor is identity; forced/high-contrast support addresses accessibility needs without a second unresearched surface | Adaptive Preferences |
| 2026-07-11 | Locked exact evidence schema/display mappings | `sourceType`, control, relation/summary support, confidence, time, risk, access, and kind describe different facts; source display groups are presentation-only | `DESIGN.md` exhaustive schema-to-human-label map |
| 2026-07-11 | Separated qualitative strategy research from the vertical gate | Four strategic models are unscored; the sole Domain Assurance Pack hypothesis is gated by five vertical candidates with immutable weights or yields no-go | `DESIGN.md` StrategyHypothesis and Scorecard |
| 2026-07-11 | Locked 320px, 400%-equivalent, and exact WCAG text-spacing checks | Dense evidence UI must preserve all content and function at Reflow and Text Spacing stress conditions, not only ordinary mobile widths | `DESIGN.md` Primitive showcase and accessibility constraints |

## Open Questions

No blocking design questions. Implementation may reveal a font-performance or diagram-density tradeoff; any change to the three type roles, paper texture, map-first hierarchy, exact evidence enums/labels, source display groups, five verticals, or fixed scoring contract must update `DESIGN.md` before code and be recorded here.

## Design Debt Register

No debt is accepted at this stage. Critical and Major issues are blockers, not debt.

| ID | Date | Source | Severity | Issue / location | Affected users | Suggested fix | Owner | Status | Acknowledgement / notes |
|---|---|---|---|---|---|---|---|---|---|
| _None_ | — | — | — | — | — | — | — | — | — |

## Handoff Notes

- Implementation owners must read all of `DESIGN.md` and this state file before editing UI.
- Build `#/showcase` and pass the primitive gate before composing overview, company, GTM, economics, or playbook screens.
- Use the generated concept only for geometry, material, type relationships, and interaction hierarchy; never reuse its factual placeholders.
- Do not add raw hex colors, arbitrary spacing, new radii, shadows, gradients, or component patterns. Update the contract first if a genuine gap appears.
- The design checker must reject composite evidence variants and enum aliases; require the exact Source/Observation/Claim/relationship mapping, including locator/dates, `claimAlignment`, `independenceGroup`, and any single-source exception; and verify derived support/group values are not stored as editable evidence.
- Persist `kind` as the canonical URL/filter facet mapped to `Claim.kind`; keep `supportRelation` confined to relationship drilldowns and out of global URL/filter state.
- Keep the four strategic models qualitative and unranked. Only Domain Assurance Pack is `eligible_hypothesis`; the other three are `countersearched_out`. Exactly five vertical rows and immutable weights produce `CONDITIONAL GO · DOMAIN ASSURANCE PACK · <VERTICAL>` or `NO-GO — DISCOVERY REQUIRED`.
- Reject weight inputs/sliders, URL weight state, model scores, rank/selected styling, and any gate override. Users may expand evidence and methodology but never alter the score contract.
- Every strategy/score-cell research receipt remains drillable. Missing inverse cells retain null measured level, use conservative effective raw 5 only for conversion, yield score 0, and visibly state `IMPUTED · NO PUBLIC EVIDENCE`.
- Responsive QA must include 320px, actual 400% zoom when supported (otherwise clearly labeled 320-CSS-pixel equivalence), and the exact WCAG text-spacing injection; 375px and 200% alone are insufficient.
- UI workers must report which persona, principle, token, and state each major decision serves, plus real-surface artifact paths and cleanup receipts.
- Lane C review order is objective `/visual-qa` evidence first, then design/accessibility/heuristic/persona judgment, then `/review-work`.
- Deferred Minor/Note findings must enter this register. Accessibility debt also requires explicit user acknowledgement; none is currently accepted.

## Evidence Index

| Artifact | Path | State |
|---|---|---|
| Original design concept | `.omo/frontend-design/references/rl-economy-atlas-concept.png` | Present |
| Design contract | `DESIGN.md` | Present |
| Design operating state | `.omo/frontend-design/state.md` | Present |
| Approved build draft | `.omo/drafts/rl-market-intelligence-site.md` | Present |
| Work plan | `.omo/plans/rl-market-intelligence-site.md` | Present; review/implementation ongoing |
| Research journal | `.omo/ulw-research/20260711-034936/` | Present; convergence ongoing |
| Primitive evidence | `.omo/evidence/task-5-rl-market-intelligence-site/` | Pending |
| Product integration evidence | `.omo/evidence/task-11-rl-market-intelligence-site/` | Pending |
| Final verification evidence | `.omo/evidence/task-12-rl-market-intelligence-site/` | Pending |
| Visual QA artifacts | `.omo/visual-qa/` | Pending |
| Final review packet | `.omo/review-work/` | Pending |
| Browser/server cleanup receipts | `.omo/evidence/task-12-rl-market-intelligence-site/cleanup.txt` | Pending |

## Retrospective

Pending implementation and final verification. Record fix rounds, reference-fidelity lessons, persona outcomes, final debt health, and evidence paths here after the production surface passes review.
