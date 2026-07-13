# The RL Economy Atlas — Design System

Status: implementation contract  
Evidence cutoff: 2026-07-11  
Dataset verification date: 2026-07-12
Reference-fidelity target: `.omo/frontend-design/references/rl-economy-atlas-concept.png`

This file is the source of truth for visual and interaction decisions. Any new color, type size, spacing value, reusable primitive, or motion rule must be declared here before application code uses it.

## 0. Research Log

- **Embedded references:** shortlisted `wired.md`, `ibm.md`, and `together.md`; selected `minimalist-skill.md` + `wired.md`. The useful material is WIRED's broadsheet grid, square geometry, type-role separation, hard rules, and compact editorial rhythm, executed with minimalist restraint. The atlas replaces WIRED's blue and branding with a warm paper system and electric orange evidence traces; it does not copy logos, proprietary typefaces, brand copy, or page modules.
- **Lazyweb real-product screens:** ran three queries — `competitive intelligence research database market map`, `AI research knowledge base technical report dashboard`, and `market landscape company comparison data visualization` — and viewed four screens: NationGraph, Affinity, Mixpanel, and Clay. Retained persistent filter/navigation rails, legible comparison rows, dense but aligned records, and a central analysis canvas. Rejected rounded SaaS cards, branded color systems, and nested panels.
- **UI/UX database:** checked data-dense editorial/dashboard, chart, and accessibility guidance. Retained restrained color, explicit chart labels, keyboard-operable filters, table fallbacks, and visible focus. Rejected the suggested Exo/Roboto Mono and black-pink palette because they flatten the selected reference and conflict with the newsprint identity.
- **Imagen drafts:** generated three full-screen concepts: white editorial (`/Users/sung/.codex/generated_images/019f5000-4938-75f1-8d03-5e2f363af7d6/exec-081f3a5d-6a58-4df1-a546-8dac2f9a5bc6.png`), dark terminal (`/Users/sung/.codex/generated_images/019f5000-4938-75f1-8d03-5e2f363af7d6/exec-466153ec-49a9-4c14-8006-0ce9be7c3c3f.png`), and warm newsprint atlas (`/Users/sung/.codex/generated_images/019f5000-4938-75f1-8d03-5e2f363af7d6/exec-b2aece71-7a57-4a73-86f8-9776af60c93b.png`). Picked the warm newsprint atlas, copied to `.omo/frontend-design/references/rl-economy-atlas-concept.png`, as the visual contract.
- **Reference extraction:** the selected concept uses a wide masthead, a left atlas rail, a large semantic market-map canvas, a narrow evidence/context rail, and two rule-separated comparison tables below. The memorable moment is an orange radial evidence network converging on a black center. It uses cream paper, near-black ink, electric orange, condensed display lettering, compact mono evidence markers, square controls, and no shadows or rounded cards.
- **Content caveat:** names, counts, dates, evidence IDs, and example companies shown in the generated concept are layout placeholders. The implementation must render only the verified research corpus. The image is a visual contract, not a factual source.
- **Post-cutoff discovery supplement:** company leads supplied or searched on 2026-07-12 may appear in a visibly labeled supplemental census, but they cannot establish cutoff-current status, buyer evidence, or strategy scores without a dated pre-cutoff source. Post-cutoff-only and unresolved records render as `TIME UNKNOWN`, historical/acquired context, or explicit research leads; they are never silently backdated to the 2026-07-11 evidence cutoff.
- **Dataset evidence surface:** the public-dataset registry was verified on 2026-07-12 and remains separate from cutoff-current company claims. It may establish a public artifact and its access surface, but not adoption, efficacy, revenue, buyer evidence, or company status.

## 1. Atmosphere & Identity

The atlas should feel like a working intelligence dossier spread across an analyst's desk: rigorous, current, inspectable, and slightly tactile. It is dense because the subject is dense, but every rule and label creates orientation. It must never feel like a generic SaaS dashboard or a marketing microsite.

The signature is **the evidence circuit**: thin electric-orange edges connect sources, companies, buyers, and technical layers to a heavy black core. Rules, numbered sections, and source tags make the page read like a research broadsheet; the orange circuit makes it unmistakably about a live learning economy.

The first view has one clear focal point: the title and market map. Search and headline metrics support that focus; they do not compete with it. The map is the hero object, not a decorative illustration.

### Design principles

1. **Evidence before ornament.** A line, tag, color, or transition must communicate provenance, state, hierarchy, or action.
2. **One page, many registers.** Rails, diagrams, timelines, and tables share a common baseline and rule system rather than becoming separate cards.
3. **Dense, not cramped.** Editorial alignment, type contrast, and controlled disclosure carry density; tiny type and stacked boxes do not.
4. **Uncertainty is dimensional.** Provenance, control relationship, support, confidence, time, risk, access, and claim kind remain separate and may co-occur.
5. **Text is the fallback and the truth.** Every diagram has an adjacent semantic summary or table containing the same information.
6. **Accessibility outranks fidelity.** When the reference conflicts with readable type, focus visibility, touch size, contrast, or reflow, the accessible interpretation wins.

### Anti-references

- Rounded dashboard cards, glass, shadows, gradients, neon glow, purple AI palettes, or floating blobs.
- Logo walls, fake metrics, decorative status pills, or pseudo-technical labels.
- Canvas-only diagrams, hover-only evidence, tiny citations, horizontally scrolling page shells, or color-only status.
- Marketing superlatives and filler language. Copy is specific, qualified, and sourceable.

## 2. Color

### Palette

| Role | Token | Value | Contrast / usage |
|---|---|---:|---|
| Paper / canvas | `--paper` | `#F4F0E6` | Primary background; warm newsprint stock |
| Paper / raised | `--paper-raised` | `#FBF8F0` | Inputs, open drawers, selected table row; separated by rules, never shadows |
| Paper / subdued | `--paper-subdued` | `#E6DFD0` | Disabled/loading bands and quiet grouping |
| Ink / primary | `--ink` | `#181713` | Headlines and body; 15.76:1 on `--paper` |
| Ink / hard | `--ink-hard` | `#0B0B09` | Section ribbons, strong rules, map core |
| Ink / muted | `--ink-muted` | `#5A554C` | Metadata and secondary copy; 6.50:1 on `--paper` |
| Rule / strong | `--rule-strong` | `#181713` | Structural 1–2px rules |
| Rule / quiet | `--rule-quiet` | `#A79F90` | Non-text separators and inactive chart lines only |
| Accent / circuit | `--accent` | `#F04B16` | Evidence edges, filled markers, large figures; not normal text |
| Accent / text | `--accent-ink` | `#A92D00` | Links and normal-size orange text; 6.03:1 on `--paper` |
| Accent / wash | `--accent-wash` | `#F8D4C5` | Selected/highlight background with `--ink` text |
| Success | `--status-success` | `#235E3B` | Verified completion; always paired with text/icon |
| Warning | `--status-warning` | `#7A4E00` | Qualified/caution state; always paired with text/icon |
| Error / unresolved | `--status-error` | `#8F1D16` | Invalid data, broken source, unresolved risk |
| Inverse text | `--paper-inverse` | `#FBF8F0` | Text on `--ink` or `--ink-hard` only |

### Application rules

- `--accent` is a graphic signal, not body-copy color. Use `--accent-ink` for links, labels, and focus-adjacent text.
- Text on an `--accent` fill is `--ink`, not white; the pairing is 4.89:1.
- Strong rules communicate structure; quiet rules communicate adjacency. Do not add a new gray to simulate elevation.
- Status never depends on color. Pair the color with a word, evidence code, border pattern, or icon.
- External links are underlined by default. Hover may change from `--ink` to `--accent-ink`, but underline remains.
- Selected data rows use an orange 4px leading rule plus `--accent-wash`; hover uses `--paper-raised`. Selection and hover must remain distinguishable.
- No gradient of any kind. No shadow color. The only texture is the paper-grain recipe in Section 7.
- In forced-colors mode, let system colors replace the palette; preserve rule weight, text labels, and evidence patterns.

### Orthogonal evidence dimensions

Evidence is not one quality class. Every displayed claim is modeled across separate axes; applicable tags co-occur and never imply one another. A company-controlled source may support a claim; an independent source may contest it; an inference may have high confidence; a high-risk claim may still be current and well supported.

There are eight independent evidence dimensions. Support is represented twice by design: `supportRelation` is stored on each Claim+Observation+Source relationship, while `supportSummary` is derived for the claim. The group word embedded in each `sourceType` label (`PRIMARY`, `VENDOR`, `INDEPENDENT`, or `UNVERIFIED`) is presentation-only; it never implies control, support, confidence, or authority.

#### Canonical enum-to-display contract

This table is copied verbatim from the approved work plan. Filters, methodology records, comparison rows, strategy data, and source data use these exact labels, never ad-hoc synonyms. Reader-facing claim cards do not render the evidence-axis chip set or audit metadata.

| Dimension | Canonical value -> exact display label |
| --- | --- |
| sourceType | `regulatory_record` -> `PRIMARY · REGULATORY`; `procurement_record` -> `PRIMARY · PROCUREMENT`; `buyer_first_party` -> `PRIMARY · BUYER`; `company_first_party` -> `VENDOR · COMPANY`; `technical_artifact` -> `PRIMARY · TECHNICAL`; `academic_primary` -> `PRIMARY · ACADEMIC`; `repository_primary` -> `PRIMARY · REPOSITORY`; `independent_reporting` -> `INDEPENDENT · REPORTING`; `investor_first_party` -> `VENDOR · INVESTOR`; `partner_first_party` -> `VENDOR · PARTNER`; `secondary_aggregator` -> `UNVERIFIED · SECONDARY`; `other` -> `UNVERIFIED · OTHER` |
| control | `subject_controlled` -> `VENDOR`; `commercially_affiliated` -> `AFFILIATED`; `independent` -> `INDEPENDENT`; `unclear` -> `UNVERIFIED` |
| supportRelation | `supports` -> `SUPPORTS`; `partially_supports` -> `PARTIAL SUPPORT`; `contests` -> `CONTESTS`; `contradicts` -> `CONTRADICTS`; `context_only` -> `CONTEXT ONLY` |
| supportSummary | `supported` -> `SUPPORTED`; `partially_supported` -> `PARTIAL`; `contested` -> `DISPUTED`; `not_publicly_verified` -> `UNVERIFIED`; `contradicted` -> `CONTRADICTED` |
| confidence | `high` -> `HIGH CONFIDENCE`; `medium` -> `MEDIUM CONFIDENCE`; `low` -> `LOW CONFIDENCE`; `unscored` -> `UNSCORED` |
| temporal | `current` -> `CURRENT`; `historical` -> `HISTORICAL`; `announced` -> `ANNOUNCED`; `superseded` -> `SUPERSEDED`; `unknown` -> `TIME UNKNOWN` |
| risk | `routine` -> `ROUTINE`; `material` -> `MATERIAL`; `high_risk` -> `HIGH RISK`; `unknown` -> `RISK UNKNOWN` |
| access | `open` -> `OPEN`; `paywalled` -> `PAYWALLED`; `login_gated` -> `LOGIN GATED`; `archived` -> `ARCHIVED`; `unavailable` -> `UNAVAILABLE`; `secondary_only` -> `SECONDARY ONLY` |
| kind | `observation` -> `OBSERVATION`; `reported_claim` -> `REPORTED CLAIM`; `calculation` -> `CALCULATION`; `inference` -> `INFERENCE`; `recommendation` -> `RECOMMENDATION`; `forecast` -> `FORECAST` |
| independence | `no_eligible_group` -> `NO ELIGIBLE GROUP`; `one_group` -> `ONE ELIGIBLE GROUP`; `two_plus_groups` -> `2+ ELIGIBLE GROUPS`; `single_source_exception` -> `SINGLE-SOURCE EXCEPTION` |
| BusinessModelId | `managed_data_bpo` -> `MANAGED DATA / BPO`; `expert_marketplace` -> `EXPERT MARKETPLACE`; `employee_bpo` -> `EMPLOYEE BPO`; `expert_environment_services` -> `EXPERT + ENVIRONMENT SERVICES`; `eval_observability_saas` -> `EVAL / OBSERVABILITY SAAS`; `runtime_infrastructure` -> `RUNTIME INFRASTRUCTURE`; `proprietary_data_acquisition` -> `PROPRIETARY DATA ACQUISITION` |
| StrategicModelId | `vertical_domain_assurance_pack` -> `VERTICAL DOMAIN ASSURANCE PACK`; `specialist_independent_eval_lab` -> `SPECIALIST INDEPENDENT EVAL LAB`; `environment_foundry` -> `ENVIRONMENT FOUNDRY`; `ax_transformation_studio` -> `AX TRANSFORMATION STUDIO` |
| VerticalCandidateId | `regulated_financial_operations` -> `REGULATED FINANCIAL OPERATIONS`; `insurance_operations` -> `INSURANCE OPERATIONS`; `healthcare_administration` -> `HEALTHCARE ADMINISTRATION`; `enterprise_software_support` -> `ENTERPRISE SOFTWARE / SUPPORT`; `public_sector_administration` -> `PUBLIC-SECTOR ADMINISTRATION` |
| CompetitorArchetypeId | `managed_data_bpo` -> `MANAGED DATA / BPO`; `expert_workforce_marketplace` -> `EXPERT WORKFORCE MARKETPLACE`; `environment_foundry_gym` -> `ENVIRONMENT FOUNDRY / GYM`; `eval_observability_saas` -> `EVAL / OBSERVABILITY SAAS`; `independent_assurance_lab` -> `INDEPENDENT ASSURANCE LAB`; `post_training_runtime_infrastructure` -> `POST-TRAINING RUNTIME INFRASTRUCTURE`; `ax_transformation_consultancy` -> `AX TRANSFORMATION CONSULTANCY` |
| imputation | `conservative_missing` -> `IMPUTED · CONSERVATIVE MISSING` |

#### Relationship, observation, and filter mapping

The eight evidence axes are a view over the canonical corpus, not a second schema. The Methodology appendix may expose relationship and observation fields that explain why a source counts; reader-facing claim cards retain only the statement and plain source links.

| Canonical field | Exact schema values / shape | Display contract |
|---|---|---|
| `Source.sourceType` | the 12 values in the canonical table above | visible axis name `SRC` plus the exact canonical display label; the label's first word is the only permitted presentation group |
| `Source.control` | `subject_controlled \| commercially_affiliated \| independent \| unclear` | visible axis name `CTRL` plus the exact canonical display label; never inferred from `sourceType` or `claimAlignment` |
| `Source.access` | `open \| paywalled \| login_gated \| archived \| unavailable \| secondary_only` | visible axis name `ACCESS` plus the exact canonical display label adjacent to the link; degraded states remain visible |
| `Observation.locator.kind` | `html_heading \| paragraph \| page \| section \| filing_field \| commit` | expanded evidence shows the canonical code and `locator.value`; never display a source without its exact observation anchor |
| `Observation` dates | `observedAt`; nullable `validAt` | expanded evidence labels both “Observed” and “Valid at”; neither substitutes for `Claim.temporal` |
| `Claim.kind` | `observation \| reported_claim \| calculation \| inference \| recommendation \| forecast` | visible axis name `KIND` plus the exact canonical display label |
| `Claim.confidence` | `high \| medium \| low \| unscored` | visible axis name `CONF` plus the exact canonical display label and redundant ticks |
| `Claim.temporal` | `current \| historical \| announced \| superseded \| unknown` | visible axis name `TIME` plus the exact canonical display label |
| `Claim.risk` | `routine \| material \| high_risk \| unknown` | visible axis name `RISK` plus the exact canonical display label; compact view may omit only `routine` |
| `Claim.evidenceLinks[].supportRelation` | `supports \| partially_supports \| contests \| contradicts \| context_only` | expanded per-source axis name `RELATION` plus the exact canonical display label; this is the only stored support field |
| derived `supportSummary` | `supported \| partially_supported \| contested \| contradicted \| not_publicly_verified` | compact claim-level axis name `SUPPORT` plus the exact canonical display label; computed, never stored or edited |
| `Claim.evidenceLinks[].claimAlignment` | `subject_controlled \| buyer_controlled \| regulator_authoritative \| academic_independent \| editorial_independent \| investor_aligned \| acquirer_aligned \| transaction_counterparty_aligned \| commercial_partner_aligned \| republication_same_chain \| unknown` | expanded methodology row shows the canonical code verbatim; only regulator/academic/editorial values are independence-eligible |
| `Claim.evidenceLinks[].independenceGroup` | stable group ID | expanded `GROUP` row; sources in the same chain retain the same visible group ID |
| derived `independentGroupCount` | nonnegative integer | methodology line, never a quality badge |
| `singleSourceException` | `null` or `{kind: registry_field \| current_advertised_offer, reason, observationId}` | explicit `SINGLE-SOURCE EXCEPTION` notice with reason and observation link; never silently upgrades support |

Filter keys map exactly: `kind` → `Claim.kind`; `source-type` → `Source.sourceType`; `control` → `Source.control`; `support` → derived `supportSummary`; `confidence` → `Claim.confidence`; `temporal` → `Claim.temporal`; `risk` → `Claim.risk`; `access` → `Source.access`; and `independence` → `no_eligible_group \| one_group \| two_plus_groups \| single_source_exception`, derived from `independentGroupCount` and `singleSourceException`. `kind` is a canonical persisted URL/filter facet; `supportRelation` is relationship detail and never a global URL facet. Each option uses the canonical display table verbatim. Filters never rewrite evidence and never combine unrelated claim/source relationships to manufacture a match.

Axis ownership is explicit: `sourceType`, `control`, and `access` belong to a source; observation locator/dates belong to an observation; `supportRelation`, `claimAlignment`, and `independenceGroup` belong to a Claim+Observation+Source relationship; `confidence`, `temporal`, `risk`, and `kind` belong to the synthesized claim. `supportSummary` and `independentGroupCount` are derived and never independently editable. A source must not receive one global “quality” label that is reused for every claim it touches.

#### Display priority

- Reader-facing claim treatment shows the statement and deduplicated external source titles in first-seen order. Source IDs, claim IDs, locators, relation/alignment labels, observation IDs, and evidence-axis chips are not rendered there.
- Methodology treatment may show every applicable claim field plus, for each source, its exact `sourceType` label and embedded group prefix, `control`, `access`, observation locator/dates, claim-specific `supportRelation`, `claimAlignment`, and `independenceGroup`; any single-source exception is adjacent.
- Derived summary is deterministic in this order: any `contests`, or any positive relation (`supports`/`partially_supports`) coexisting with `contradicts`, → `contested`; contradiction-only (plus optional context) → `contradicted`; any `supports` without contest/contradiction → `supported`; partial-only (plus optional context) → `partially_supported`; otherwise context-only/no positive evidence → `not_publicly_verified`.
- `contested`, `not_publicly_verified`, `contradicted`, `high_risk`, `unknown` risk, and degraded access are never hidden behind a tooltip or disclosure.
- Visual treatments may repeat across axes, but fields and DOM attributes remain separate. Canonical display words such as `PRIMARY`, `INDEPENDENT`, `VENDOR`, `INFERENCE`, `UNVERIFIED`, and `DISPUTED` are labels only; none may become a composite corpus value or visual variant that overwrites its owning axis.

## 3. Typography

Three families are intentional. The atlas needs a condensed structural voice, a long-form reading voice, and a machine-like evidence register; collapsing those roles makes dense pages harder to scan.

### Font stacks

- **Display and UI:** `"Barlow Condensed", "Arial Narrow", sans-serif` — masthead, navigation, section ribbons, controls, table headings.
- **Editorial body:** `"Newsreader Variable", Georgia, serif` — paragraphs, dossier narrative, explanatory decks, quotations.
- **Evidence and figures:** `"IBM Plex Mono", "SFMono-Regular", Consolas, monospace` — source IDs, dates, metrics, timeline ticks, small technical labels.

Use self-hosted WOFF2 assets or `@fontsource` packages with `font-display: swap`. Load only required weights and character subsets. The fallback layout must remain usable without web fonts.

### Scale

| Role / token | Size | Weight | Line height | Tracking | Usage |
|---|---:|---:|---:|---:|---|
| Atlas masthead / `--type-atlas` | `clamp(2.5rem, 4.5vw, 4.25rem)` | 800 | 0.84 | `-0.035em` | “THE RL ECONOMY”; 1–2 lines maximum |
| Display / `--type-display` | `clamp(2rem, 3.4vw, 3.25rem)` | 750 | 0.92 | `-0.025em` | Overview and dossier feature title |
| H1 / `--type-h1` | `clamp(1.75rem, 3vw, 2.75rem)` | 700 | 0.98 | `-0.018em` | Route/page title |
| H2 / `--type-h2` | `clamp(1.4rem, 2.2vw, 1.9rem)` | 700 | 1.02 | `-0.01em` | Major section heading |
| H3 / `--type-h3` | `1.25rem` | 650 | 1.12 | `0` | Subsection and dossier block |
| Deck / `--type-deck` | `1.125rem` | 450 | 1.35 | `0` | Executive thesis and section lead |
| Body / `--type-body` | `1rem` | 400 | 1.5 | `0.005em` | Default reading copy |
| Body small / `--type-body-sm` | `0.9375rem` | 400 | 1.55 | `0` | Secondary narrative, table cells |
| UI / `--type-ui` | `0.9375rem` | 600 | 1.2 | `0.025em` | Buttons, filters, navigation |
| Evidence / `--type-evidence` | `0.8125rem` | 550 | 1.35 | `0.025em` | Source dates and compact methodology metadata |
| Kicker / `--type-kicker` | `0.75rem` | 650 | 1.15 | `0.12em` | Uppercase section and table labels |

### Rules

- Body copy is never below 15px; source IDs and short metadata may be 12–13px but must never carry a full sentence.
- Display/UI type may use uppercase for labels of four words or fewer. Never set paragraphs or instructions in all caps.
- Long-form lines cap at 70 characters. Executive decks cap at 60 characters. Dense table cells may run wider because columns and rules aid tracking.
- Masthead text uses a real text heading, never raster text from the concept image.
- Tabular figures use `font-variant-numeric: tabular-nums lining-nums`.
- Links use meaningful text. Never show a raw long URL as the primary label.
- At 200% and 400% browser zoom, type follows the compact layout rather than shrinking; an effective 320 CSS-pixel viewport is only a labeled fallback for 400%-equivalent automation.

## 4. Spacing & Layout

### Spacing tokens

The base unit is 4px. Use only these tokens for layout and component spacing.

| Token | Value | Typical use |
|---|---:|---|
| `--space-0` | `0` | Flush editorial edges |
| `--space-1` | `4px` | Evidence tag internals, kicker gap |
| `--space-2` | `8px` | Inline icon gap, compact row rhythm |
| `--space-3` | `12px` | Table cell vertical padding |
| `--space-4` | `16px` | Compact page gutter, control padding |
| `--space-5` | `20px` | Rail section spacing |
| `--space-6` | `24px` | Standard gutter and section inset |
| `--space-8` | `32px` | Major module separation |
| `--space-10` | `40px` | Desktop rail gutter |
| `--space-12` | `48px` | Page-section rhythm |
| `--space-16` | `64px` | Feature break |
| `--space-20` | `80px` | Masthead lower breathing room |
| `--space-24` | `96px` | Maximum intentional separation |

### Rule and control tokens

| Token | Value | Usage |
|---|---:|---|
| `--rule-hairline` | `1px` | Row and column division |
| `--rule-default` | `2px` | Section bands, controls, buttons |
| `--rule-emphasis` | `4px` | Active rail marker and selected row |
| `--control-min` | `44px` | Minimum pointer target in both dimensions |
| `--focus-width` | `3px` | Keyboard focus outline |
| `--page-max` | `1600px` | Maximum atlas sheet width |
| `--reading-max` | `70ch` | Narrative line length |

### Desktop atlas grid

- The page sheet is centered and capped at `--page-max`; margins use `clamp(16px, 2.5vw, 48px)`.
- At 1280px and wider, use a three-zone grid: `minmax(168px, 13rem) minmax(0, 1fr) minmax(224px, 17rem)` with 24px gutters and 1px vertical rules.
- The left `SectionRail` and right `ContextRail` are sticky within the document (`top: 16px`) and keep natural page height. They must not create independent scrolling columns.
- The central canvas uses a 12-column grid with 24px gutters. Diagrams may span all 12; comparison modules may split 7/5 or 8/4 when content justifies it.
- The wide masthead spans all zones. The title occupies the center; edition/date marks occupy the left; search and corpus counts occupy the right.
- Below the hero map, table modules align to the same central grid and share a 2px top rule. They are not boxed cards.

### Responsive states

| State | Width | Layout behavior |
|---|---:|---|
| Compact | `<640px` | One column, 16px gutters; compact sticky toolbar; rails become drawers; diagrams default to summary/list with optional visual toggle; comparison becomes labeled rows |
| Medium | `640–959px` | One main column, 24px gutters; two-column index lists; context rail moves after the active section; filter tray opens below toolbar |
| Wide | `960–1279px` | Left rail + main canvas; right context content moves inline below map; masthead search spans main width |
| Atlas | `1280–1599px` | Full three-zone grid, 24px gutters, sticky left/right rails |
| Maximum | `≥1600px` | Sheet caps at 1600px; only outer paper margins grow |

### Reflow rules

- The document itself never scrolls horizontally.
- Data tables first collapse nonessential columns into labeled row details. When a genuinely comparative table still requires width, place only that table in a named `role="region"` with a visible “Scroll table horizontally” instruction and keyboard focus.
- Diagrams keep a minimum readable node label size. At compact widths, show the semantic list/table first and place the SVG behind a “Show visual map” control.
- The title, primary task, and current evidence status appear before secondary metrics in DOM order at every breakpoint.
- At 200% zoom on a 1280px viewport, the app reflows as compact/medium. At actual 400% zoom on 1280px, or a clearly labeled 320 CSS-pixel equivalent when zoom automation is unavailable, it has no clipped controls, off-screen dialogs, lost content/function, or page-level horizontal scrolling.
- Sticky elements must never cover anchored headings; use `scroll-margin-block-start` derived from the compact toolbar height.

## 5. Components

Every component is square or rule-bound. There are no generic cards and no ornamental containers. A component used twice must be implemented as a reusable primitive and remain consistent with the specifications below.

### SkipLink

- **Structure:** anchor to `#main-content`, first focusable element in DOM.
- **States:** visually hidden by default; paper-filled, 2px ruled, fully visible on focus.
- **Accessibility:** lands before the route H1 and never behind the sticky toolbar.

### Masthead

- **Structure:** edition block; H1 title; strapline; search/corpus summary block; 2px lower rule.
- **Variants:** full first-view; compact route masthead. The compact version is static at its route position, not a shrinking animation.
- **Spacing:** title is flush to the central grid; 24–48px vertical rhythm.
- **States:** corpus counts may be loading, loaded, or error; text explains every state.
- **Accessibility:** exactly one page H1; count labels remain adjacent to values; title does not become an image.

### UtilityNav

- **Structure:** semantic `<nav>` with route links and a compact source/method/export group.
- **Variants:** horizontal utility strip; compact drawer list.
- **States:** default, hover underline, current with 4px orange leading rule and `aria-current="page"`, focus, disabled/unavailable.
- **Accessibility:** 44px targets; visible current label; no icon-only primary destinations.

### SectionRail

- **Structure:** named `<nav>`; section ribbon; ordered route list; legend; active filter summary.
- **Variants:** sticky desktop rail; modal `Drawer` content on compact/medium.
- **States:** default, hover, current, focus, filtered, empty filter summary.
- **Accessibility:** current section uses `aria-current`; list order matches document order; no nested scroll.

### ContextRail

- **Structure:** “How to read this view,” view options, evidence sample, and related links.
- **Variants:** sticky right rail; inline disclosure after main content.
- **Accessibility:** instructions are text, not tooltip-only; checkboxes are native controls.

### SearchField

- **Structure:** labeled `<search>` region, visible label, text input, submit/clear buttons, result status.
- **Variants:** masthead wide; compact toolbar.
- **States:** idle, focus, populated, submitting/loading, results, zero results, invalid query, disabled.
- **Interaction:** Enter submits; Escape clears only when populated; clear retains focus; no search-as-you-type focus theft.
- **Accessibility:** result count announced in a polite live region after a settled update; label is never placeholder-only.

### FilterControl and FilterTray

- **Structure:** native select/checkbox group where possible; button + labeled menu only when multiselect requires it; active-filter chips are rectangular removable tokens.
- **Variants:** rail stack; horizontal summary; compact drawer/tray.
- **States:** closed, open, hover, focus, selected, disabled, loading options, no options, invalid combination.
- **Interaction:** “Clear all” is always visible when filters are active; closing restores focus to trigger.
- **Accessibility:** group has a legend; selected values are announced; filter changes do not move focus.
- **Evidence filters:** `kind`, `sourceType` (optgrouped only by the prefix embedded in its exact display label), `control`, derived `supportSummary`, `confidence`, `temporal`, `risk`, `access`, and derived independence state are separate canonical persisted controls. `kind` serializes from `Claim.kind`; `supportRelation` remains visible per claim/source relationship and never serializes as a global URL facet. A single “evidence quality” filter is forbidden; relationship predicates must stay on the same claim/source link.

### ClaimText and SourceLink

- **Structure:** claim text followed by deduplicated external source-title links. The reader-facing claim surface does not expose claim IDs, source IDs, locators, relation/alignment labels, observation IDs, or evidence chips.
- **Variants:** inline citation and bibliography row; the Methodology appendix may expose the underlying evidence fields for audit and interpretation.
- **States:** resolved, invalid, missing, stale, and unavailable sources remain explicit in the underlying data and validation surfaces.
- **Accessibility:** source links name the source and announce that they open in a new tab; statement text remains readable without expanding a reader-facing evidence panel.

### SourceLink

- **Structure:** descriptive source title with an external-link indicator. Publisher, URL, and date metadata remain available in the source registry; claim-specific relationships and locators remain in the underlying corpus and methodology surfaces.
- **Variants:** inline citation, full bibliography row, diagram citation.
- **States:** default, hover, focus, visited, unavailable/broken, loading verification.
- **Accessibility:** new-tab behavior is stated in accessible and visible context; external icon is decorative; raw URLs wrap but are not primary labels.

### Metric

- **Structure:** tabular numeral, concise label, qualifier, evidence link.
- **Variants:** corpus count, observed metric, reported metric, calculated comparison, unavailable. Claim-kind and evidence axes remain adjacent rather than becoming the metric style.
- **States:** loaded, loading, not-publicly-verified, non-comparable warning, error.
- **Accessibility:** qualifier and time basis are adjacent; run rate, ARR, contract ceiling, network size, and audited revenue are never presented as equivalent.

### SectionRibbon

- **Structure:** full-width black band, paper text, numbered mono/kicker prefix, optional action aligned at end.
- **Variants:** primary black ribbon; 2px ruled outline subsection.
- **States:** static; action receives standard hover/focus/disabled states.
- **Accessibility:** uses the correct heading level; never relies on all-caps styling as the heading semantic.

### DataTable

- **Structure:** `<table>` with caption, column headers using `scope`, body, source cells, optional footnote and comparison warning.
- **Variants:** company index, source registry, metric comparison, risk register, responsive labeled-row list.
- **States:** default, sortable header, sorted ascending/descending, row hover, selected row, focus-within, loading, empty, error, incompatible-comparison warning.
- **Accessibility:** sortable controls are real buttons with `aria-sort`; captions summarize purpose; sticky headings do not obscure focus; table region instructions appear only if horizontal scrolling is unavoidable.

### TimelineItem

- **Structure:** time/date, marker, title, narrative, evidence links in ordered-list semantics.
- **Variants:** milestone, transaction, product change, customer/partner event, risk event. Evidence and time axes attach independently.
- **States:** default, hover/focus on linked item, selected, loading, empty, error; `TIME`, `KIND`, derived `SUPPORT`, and other axes describe the event without replacing these interaction states.
- **Accessibility:** chronological order is explicit; the marker and line are decorative; date is text.

### MarketMap / DiagramNode / DiagramEdge

- **Structure:** `<figure>` with visible title and summary; semantic SVG; grouped focusable node links/buttons; decorative edges; adjacent HTML list/table equivalent.
- **Variants:** radial value chain, buyer funnel, GTM ladder, economics stack, competitor adjacency.
- **States:** default, node hover, node focus, node selected, related edges highlighted, filtered/dimmed, no data, error.
- **Interaction:** selecting a node reveals its text summary and relevant evidence without requiring pointer precision. Deselect is explicit and Escape-supported.
- **Accessibility:** `aria-labelledby` and `aria-describedby`; DOM order follows logical reading order; all insights and citations exist in the fallback; no essential information is encoded solely by line style or position.

### DossierHeader

- **Structure:** company/industry name, verified identity line, current-status label, one-sentence thesis, segment/buyer/economic-model links, evidence-cutoff note.
- **Variants:** company, industry, strategy model.
- **States:** current, historical/acquired, uncertain identity, announced transaction, unavailable metric.
- **Accessibility:** status is written in plain language; no logo required; headings preserve hierarchy.

### ComparisonRow

- **Structure:** attribute label followed by 2–3 company values and a comparability/evidence line.
- **Variants:** text, metric, status, buyer, GTM, risk.
- **States:** comparable, partly comparable, incompatible, missing/unverified.
- **Accessibility:** mobile renders as repeated `<dl>` groups; source and warning remain associated with each value.

### StrategyHypothesis

- **Structure:** a qualitative, claim-backed comparison table for exactly four `StrategicModelId` rows, followed by the research-eligibility conclusion and its evidence/counterevidence.
- **Rows:** `vertical_domain_assurance_pack`, `specialist_independent_eval_lab`, `environment_foundry`, and `ax_transformation_studio`, using the exact canonical display labels in Section 2.
- **Content:** model, prerequisites, evidence, counterevidence, operating burden, kill criteria, and `eligibility` (`eligible_hypothesis | countersearched_out`).
- **Eligibility rule:** only `vertical_domain_assurance_pack` renders `eligible_hypothesis`; the other three render `countersearched_out` with their refuting evidence. Eligibility is qualitative research status, not a score or rank.
- **Research receipt drilldown:** every eligibility conclusion provides an adjacent drilldown to the claim/observation trail and its strategy-research/countersearch receipt and closure rationale when present; a missing receipt is labeled missing and is never fabricated.
- **States:** default, focus, evidence expanded, counterevidence expanded, incomplete evidence, and error. There is no scoring, weighting, ranking, winner, selected, or user-editable state.
- **Accessibility:** table headers describe the qualitative dimensions; each eligibility conclusion has adjacent evidence and counterevidence; no color, row order, accent, or icon implies a score.

### Scorecard

- **Structure:** a semantically separate, fixed read-only scorecard for five `VerticalCandidateId` rows inside the sole research-eligible `vertical_domain_assurance_pack` hypothesis. These are candidate domains, not competing products or strategic models.
- **Vertical candidates:** exactly `regulated_financial_operations`, `insurance_operations`, `healthcare_administration`, `enterprise_software_support`, and `public_sector_administration`, using the exact canonical display labels in Section 2.
- **Fixed read-only criteria:** pain 20%, willingness to pay 20%, rights access 15%, verifier feasibility 15%, expert supply 10%, inverted freshness burden 10%, and inverted incumbent pressure 10%. Show these as methodology text/table, never sliders, editable inputs, draggable controls, or URL state.
- **Cell evidence and caps:** every candidate has the same seven 0–5 cells. A missing cell stores `convertedScore:0`, `measuredLevel:null`, empty claim/observation arrays, a nonblank `missingReason`, and resolved nonblank `positiveSearchReceiptId` and `negativeSearchReceiptId`. For missing `freshnessBurden` or `incumbentPressure`, conservative scoring imputes an effective raw level of 5 solely for conversion, yielding `convertedScore:0`; stored `measuredLevel` remains null and the UI visibly labels the cell `IMPUTED · NO PUBLIC EVIDENCE`. Vendor-only, low-confidence, disputed, unresolved, or stale positive evidence caps a benefit cell at 2; one eligible independence group caps it at 3. Show raw/measured state, effective imputation when applicable, converted/displayed value, cap/missing reason, claims, and observations for every cell.
- **Research receipt drilldown:** every cell shows both `positiveSearchReceiptId` and `negativeSearchReceiptId`. The expandable drilldown exposes positive-query count, countersearch-query count, searched-domain classes, cutoff, closure rule, and missing reason; it remains available for evidenced and valid missing cells.
- **Rights gate:** `rightsBlocker=true` if a current high-risk rights/privacy/security claim is disputed or unresolved, no lawful-rights observation exists, or rights access is below 3. A rights blocker always disqualifies the vertical.
- **Qualification gate:** full-precision weighted score ≥70; each benefit dimension ≥3; each inverted burden/pressure score ≥3; two separate buyer-controlled/procurement observations; no rights blocker; every nonmissing cell claim/observation backed; and every valid missing cell closed by empty claim/observation arrays, nonblank `missingReason`, resolved receipt IDs, null measured level, and conservative imputation. The highest qualifying vertical must lead the second-highest candidate, qualified or not, by ≥10 full-precision points. Tie order is full score, willingness to pay, rights access, verifier feasibility, lower freshness burden, lower incumbent pressure, then lexical `strategyId`.
- **Gate result:** the immutable corpus scorer either yields one qualifying vertical under those fixed qualification/lead/tie rules or yields `NO-GO — DISCOVERY REQUIRED`. A qualifying result is labeled `CONDITIONAL GO · DOMAIN ASSURANCE PACK · <VERTICAL>`; it gates the hypothesis into paid validation and is not a guarantee of product-market fit. No UI path may override the scorer.
- **Variants:** loading, incomplete, capped cell, rights blocker, conditional go, no-go, and scorer error.
- **States:** default, focus, evidence expanded, methodology expanded, loading, incomplete, qualified, no-go, error. There is no weight-editing, score-editing, eligibility-editing, or model-scoring state.
- **Domain Assurance Pack rule:** it receives no accent fill, “winner,” “recommended,” rank-one, or default-selection treatment before the five-vertical gate completes. A `NO-GO` result keeps the hypothesis unrecommended and opens the documented discovery program.
- **Accessibility:** criterion names, fixed weights, raw/displayed values, caps, failures, evidence, and uncertainty are textual; bars are supplemental. Read-only values are plain text/table data, not disabled form controls. Incomplete, capped, rights-blocked, and no-go states are announced and never styled as success.

### Accordion

- **Structure:** heading with full-width button; ruled content region.
- **Variants:** methodology, limitations, source notes, compact dossier detail.
- **States:** collapsed, expanded, hover, focus, disabled, loading, error.
- **Interaction:** Enter/Space toggle; icon rotates only by transform; expanded content is in DOM.
- **Accessibility:** button uses `aria-expanded` and `aria-controls`; no nested interactive trigger inside the button.

### Drawer

- **Structure:** modal dialog, title, close button, rail/filter content, ruled backdrop boundary.
- **Variants:** navigation, filters, evidence detail.
- **States:** closed, opening/open, closing, loading, error.
- **Interaction:** transform/opacity only; Escape closes; focus is trapped while open and restored to trigger; backdrop click is supplemental, not the only close path.
- **Accessibility:** page behind becomes inert; dialog has name and description; close target is 44px.

### EmptyState and ErrorNotice

- **Structure:** explicit heading, short cause, recovery action, optional diagnostic/source ID.
- **Variants:** no search results, no matching filters, unavailable evidence, malformed deep link, load/parse failure.
- **States:** static; actions use normal button/link states.
- **Accessibility:** plain language; no decorative illustration required; error receives `role="alert"` only when introduced after interaction.

### Primitive state matrix

`—` means the state is not meaningful; it must not be simulated as decoration.

| Primitive | Hover | Active/current | Focus | Disabled | Loading | Empty | Error |
|---|:---:|:---:|:---:|:---:|:---:|:---:|:---:|
| UtilityNav / SectionRail | ✓ | ✓ | ✓ | ✓ | — | ✓ | — |
| SearchField | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| FilterControl / Tray | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| ClaimText / SourceLink | ✓ | ✓ | ✓ | ✓ | ✓ | — | ✓ |
| Metric | — | ✓ | ✓ when linked | — | ✓ | ✓ | ✓ |
| DataTable | ✓ | ✓ | ✓ | ✓ where sortable | ✓ | ✓ | ✓ |
| TimelineItem | ✓ when linked | ✓ | ✓ | — | — | ✓ | ✓ |
| Map / Node / Edge | ✓ | ✓ | ✓ | ✓ when filtered | ✓ | ✓ | ✓ |
| StrategyHypothesis | ✓ | — qualitative only | ✓ | — | — | ✓ | ✓ |
| Scorecard | ✓ | ✓ conditional go/no-go | ✓ | — read-only | ✓ | ✓ | ✓ |
| Accordion | ✓ | ✓ | ✓ | ✓ | ✓ | — | ✓ |
| Drawer | — | ✓ | ✓ | — | ✓ | — | ✓ |
| EmptyState / ErrorNotice | action only | action only | action only | action only | — | ✓ | ✓ |

### Primitive showcase contract

No product screen may be composed until the `#/showcase` route passes this gate.

1. Render every primitive above with real atlas copy, not lorem ipsum.
2. Show default, forced-hover, active/current, focus-visible, disabled, loading, empty, and error examples wherever the matrix marks a state.
3. Include an evidence-axis matrix in the Methodology appendix that proves co-occurrence: at minimum a subject-controlled regulatory record with `supportRelation=supports`, an independent source with `supportRelation=contests`, an inference with `supportSummary=supported` and medium/high confidence, a current high-risk claim, and an unavailable source. Keep the reader-facing claim surface limited to the statement and plain source links.
4. Include a compact, medium, and atlas-width layout specimen. Capture actual browser screenshots at 375px, 768px, and 1280px.
5. Exercise keyboard order, SkipLink, search clear/submit, sortable table, accordion, diagram-node selection, fixed-score methodology disclosures, and drawer focus trap/restore. Confirm `kind` persists and round-trips as a `Claim.kind` URL/filter facet, `supportRelation` never appears as a global URL facet, and score weights cannot be edited by pointer, keyboard, URL, or form submission.
6. Capture a 320px-wide reflow specimen in addition to 375/768/1280. Run 400%-equivalent QA as a 1280px viewport at 400% browser zoom when supported; otherwise use a 320 CSS-pixel effective viewport and label it equivalent rather than actual zoom proof.
7. Inject WCAG text spacing — line height 1.5× font size, paragraph spacing 2× font size, letter spacing 0.12× font size, word spacing 0.16× font size — and confirm no clipping, overlap, truncation, or loss of function.
8. Repeat with reduced motion, 200% zoom, `prefers-contrast: more`, and forced-colors where the browser supports it.
9. Confirm no page-level horizontal overflow, clipped focus ring, text below its minimum size, unannounced state change, or raw undeclared color/spacing value.
10. Store proof under `.omo/evidence/task-5-rl-market-intelligence-site/` and `.omo/visual-qa/`. A screenshot without driven interaction states is insufficient.

#### Design checker expectations

- Reject a single `evidenceClass`, `evidenceQuality`, or visual variant whose values conflate source provenance, control, support, confidence, inference, temporal state, risk, or access.
- Require the exact schema values and display labels in the canonical table; reject aliases or additional enum values.
- Require separate `sourceType`, `control`, `supportRelation`, derived `supportSummary`, `confidence`, `temporal`, `risk`, `access`, and `kind` fields where applicable.
- Require claim-source support to live in `supportRelation`, not as a global source or independently editable claim field; compact `supportSummary` must derive from those relationships.
- Require `kind` to persist and round-trip through the canonical URL/filter grammar mapped only to `Claim.kind`; reject any global `supportRelation` query key or control.
- Require expanded evidence to retain the exact observation anchor/dates, raw canonical `claimAlignment`, `independenceGroup`, and any `singleSourceException`; verify that aligned/republication sources do not manufacture independent groups.
- Require `KIND:INFERENCE` to coexist with support and confidence rather than replacing them.
- Require expanded evidence details to expose every applicable axis; compact mode may omit only routine risk and otherwise-normal access.
- Require high-risk, contested/not-verified/contradicted, and degraded-access states to remain visibly labeled without hover.
- Reject scores/ranks/weights/selected styling on the four qualitative strategic models.
- Require exactly five fixed vertical rows and the seven read-only criterion weights; reject inputs, sliders, URL weight state, or any user-editable weight control.
- Require every vertical cell to expose both research receipt IDs and a receipt drilldown. For a missing inverse cell, require `measuredLevel:null`, conservative effective raw level 5, converted score 0, and visible `IMPUTED · NO PUBLIC EVIDENCE`; reject stored measured level 5.
- Reject pre-gate `winner`, `recommended`, rank-one, accent-selected, or default-selected treatment on `Domain Assurance Pack`; require either one conditional-go vertical or no-go after the fixed gate.
- Require the showcase fixtures and checker failure fixtures to include the co-occurrence examples above.

## 6. Motion & Interaction

Motion is editorial punctuation. It explains state and relationship; it never decorates static content.

### Timing

| Token | Duration | Easing | Usage |
|---|---:|---|---|
| `--motion-micro` | `120ms` | `ease-out` | Button press, link underline, focus-adjacent response |
| `--motion-standard` | `180ms` | `cubic-bezier(0.2, 0, 0, 1)` | Accordion, filter disclosure, selected-row response |
| `--motion-emphasis` | `240ms` | `cubic-bezier(0.16, 1, 0.3, 1)` | Drawer enter/exit and route content fade-through |

### Signature interactions

1. **Evidence trace:** selecting a map node raises the opacity of related orange edges and linked evidence content while unrelated edges dim. Geometry does not move; only opacity changes.
2. **Rail reveal:** compact drawers slide a maximum of 16px while fading in, then return focus to their trigger on close. Route content uses a short opacity-only fade-through after focus moves to the new H1.

### Rules

- Animate only `transform` and `opacity`. Do not animate height, width, position, color sweeps, SVG path geometry, or scroll position.
- Hover changes are never the only indication of action. Focus-visible gets an equally strong or stronger treatment.
- No automatic carousel, parallax, background drift, staggered content reveal, skeleton shimmer, or infinite animation.
- `prefers-reduced-motion: reduce` sets durations to zero and removes transforms while preserving state changes.
- Programmatic scrolling, when necessary for deep links, uses instant behavior under reduced motion and never steals focus from an active control.
- Loading feedback for the local corpus is static ruled placeholder text plus `aria-busy`; it does not pulse.

## 7. Depth & Surface

### Strategy: borders-only, with tactile paper

Depth is communicated by rule weight and inversion, not by simulated elevation.

| Level | Treatment | Usage |
|---|---|---|
| 0 | Paper + no enclosing border | Default narrative and map canvas |
| 1 | 1px quiet rule | Row/column adjacency |
| 2 | 1px strong rule | Editorial section boundary |
| 3 | 2px strong rule | Inputs, buttons, primary module boundary |
| 4 | 4px orange leading rule | Active/current/selected state |
| 5 | Solid ink ribbon, paper text | Section ribbon and map core |

### Paper recipe

- Base is `--paper`.
- A single fixed, pointer-inert pseudo-element may apply a local monochrome 128×128 newsprint texture at 2–3% opacity with `mix-blend-mode: multiply`.
- The texture must be an inline/local asset under 4KB, must not contain content, must not move, and must be removed in forced-colors and print modes.
- If the asset cannot meet performance or contrast gates, remove the texture but retain warm paper, rules, and type; do not replace it with a gradient.

### Surface rules

- `border-radius: 0` on every rectangular surface and control.
- Circular geometry is reserved for diagram nodes and icon-only controls; filters are never pills.
- No `box-shadow`, `filter: drop-shadow`, blur, glass, translucent overlay, or nested framed card stack.
- Drawers and dialogs use a 2px ink boundary plus an opaque paper backdrop. The page scrim may use solid/semitransparent ink; it is not blurred.
- Print styles remove sticky positioning and texture, expand disclosures, preserve evidence labels, and print source URLs after source titles.

### Dataset registry composition

- `#/datasets` is an exhaustive editorial index, not a dashboard. Families sit in rule-separated category registers; related repositories, viewers, downloads, and leaderboards remain source links inside the family record.
- Search and the four dataset facets use the existing square control, focus, rule, paper, and selected-state treatments. Category is family-scoped. Artifact, access, and provenance remain orthogonal but must match the same public surface; selection is OR within one facet and AND across facets.
- Every public surface exposes its own kind, access, provenance, artifact labels, hostname, verification date, and version when known. Links that open a new tab say so in their accessible names.
- The collapsed company-coverage ledger reports attributed and exact-name no-hit outcomes across all 132 companies. A no-hit is a bounded search result, never proof that no dataset exists.
- Every family keeps its complete description and link labels in the DOM. `content-visibility: auto` may reduce paint work, but it must not virtualize, truncate, paginate, or remove records from keyboard and assistive-technology access.
- Wide layouts may use two editorial columns inside a category. Compact layouts collapse to one column, preserve 44px filter targets, and never introduce page-level horizontal scrolling.
- Results always state family and public-surface totals. Zero results use a visible recovery message and the same reset control; filter changes retain focus at the initiating control.
- Only one polite live region announces result changes. The filter disclosure says `Show filters` or `Hide filters`; route changes move focus to the page H1, while query state is replace-synchronized to the hash URL.
- The dataset route and corpus load lazily. Bundled, version-pinned fonts prevent third-party font requests and preserve the declared typographic roles.
- The registry introduces no new color, type, spacing, elevation, radius, or motion token. Rules and typographic roles carry hierarchy; cards, shadows, pills, gradients, and decorative dataset logos remain prohibited.

## 8. Accessibility Constraints & Accepted Debt

### Constraints

- Target WCAG 2.2 AA everywhere, with 7:1 body-text contrast where the palette permits.
- Every pointer target is at least 44×44 CSS px; inline text links are exempt but retain underline and adequate line height.
- Focus-visible uses a 3px `--ink-hard` outline, a 2px `--paper-raised` offset/halo, and never clips at scroll or overflow boundaries.
- Landmarks are ordered banner → navigation/search → main → complementary → contentinfo. Each repeated nav has a unique accessible name.
- Heading levels form a complete outline. Route changes focus the H1 after updating the URL; filter changes keep focus in the filter.
- Every diagram includes a visible summary and equivalent list/table in the same DOM. SVG nodes are keyboard operable; decorative edges are hidden from the accessibility tree.
- Tables include captions and scoped headers. Comparative metrics include units, time basis, source/control context, support, confidence, and explicit non-comparability warnings.
- `sourceType`, `control`, `supportRelation`/derived `supportSummary`, `confidence`, `temporal`, `risk`, `access`, and `kind` use the exact human labels in Section 2 plus redundant shape/pattern cues, never one composite badge or color alone.
- Search results, filter counts, parse failures, and source-check failures announce changes with an appropriately polite/assertive live region.
- Drawers and dialogs trap and restore focus, close with Escape, and make the background inert.
- Tooltips may only repeat supplemental information. If used, they are hoverable, focusable, dismissible, and never contain the sole source or instruction.
- Reflow passes at 320 CSS px, 200% zoom, and 400%-equivalent zoom/reflow without loss of content or function. Actual 400% browser zoom is preferred; a 320 CSS-pixel effective viewport from a 1280px base is acceptable only when clearly labeled equivalent.
- WCAG text-spacing injection must pass with line height 1.5× font size, paragraph spacing 2× font size, letter spacing 0.12× font size, and word spacing 0.16× font size; no text or control may clip, overlap, truncate, or disappear.
- Reduced motion, increased contrast, forced colors, keyboard-only operation, screen-reader reading order, and touch operation are first-class verification states.
- Error and empty copy states name what happened and how to recover. They do not blame the user or collapse into an icon.
- English is the initial locale, but company names, citations, and long technical terms may wrap without truncation. Do not use fixed-height text containers.

### Cognitive-accessibility constraints

- Persistent location cues: active section, breadcrumb/dossier identity, current filters, evidence cutoff, and result count stay visible or immediately reachable.
- “Clear all” and “Back to overview” provide reversible exits. Deep links recover to a valid route and explain the fallback.
- Dense views begin with an executive thesis and “How to read this” text; detail follows in progressive disclosures without hiding source access.
- Consistent axis names are mandatory: `SRC`, `CTRL`, `RELATION`, `SUPPORT`, `CONF`, `TIME`, `RISK`, `ACCESS`, and `KIND`; the value beside each uses the canonical table verbatim. `INFERENCE` is a `kind` display value; `INDEPENDENT` may appear under source type or control; neither substitutes for `supportRelation`, `supportSummary`, or `confidence`.
- The four strategic models remain qualitative and unranked. Domain Assurance Pack is the sole research-eligible product hypothesis; its fixed, read-only five-vertical gate yields one conditional-go domain only when every gate passes, otherwise no-go.
- Comparison is capped at three companies at once. Adding a fourth requires replacing an existing choice, preventing an unreadable matrix.

### Accepted debt

No design or accessibility debt is accepted at contract creation. Critical or Major findings cannot enter this table; they must be repaired or escalated. Any future Minor/Note debt requires affected users, location, exact fix, owner, and explicit acknowledgement where accessibility is involved.

| ID | Location | Severity | Affected users | Why accepted | Suggested fix | Owner / exit | Acknowledgement |
|---|---|---|---|---|---|---|---|
| _None_ | — | — | — | — | — | — | — |

### Verification handoff

- Primitive proof: `.omo/evidence/task-5-rl-market-intelligence-site/`
- Responsive/visual proof: `.omo/visual-qa/`
- Design operating state: `.omo/frontend-design/state.md`
- Final accessibility, persona, heuristic, and review findings: `.omo/review-work/`

The build is not visually complete until the actual production surface is exercised at 320/375/768/1280px, at 200% and actual-or-clearly-labeled-equivalent 400% zoom, with the WCAG text-spacing override, by keyboard, with reduced motion and forced/high contrast; then reviewed against the selected concept and this contract.
