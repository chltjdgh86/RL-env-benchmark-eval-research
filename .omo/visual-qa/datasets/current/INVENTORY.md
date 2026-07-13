# Dataset Registry Visual QA Inventory

Fresh capture run: 2026-07-13 after the latest rendered-source edit.

Surface under review: the single dedicated `#/datasets` route. The selected Atlas concept and
`DESIGN.md` define a directional newsprint system; there is no dataset-page pixel reference.

## Enumerated captures

- Default/top and first-results states at 320, 375, 768, and 1280 CSS pixels:
  `default-{top,results}-{320,375,768,1280}x900.png`
- Facet disclosure, keyboard-selected Browser category:
  `filters-open-{320,1280}x900.png`
- Query result: `query-gdpval-768x900.png`
- Empty result and recovery control: `empty-375x900.png`
- WCAG text-spacing override: `text-spacing-320x900.png`
- Browser-zoom reflow equivalents from a 1280px display: 640 CSS pixels for 200% and 320 CSS
  pixels for 400%: `zoom-200-percent-1280-equivalent-640x900.png` and
  `zoom-400-percent-1280-equivalent-320x900.png`. These use the post-zoom effective layout
  viewport rather than CDP pinch/page scaling.
- `zoom-200-percent-320x900.png` and `zoom-400-percent-320x900.png` are superseded diagnostic
  captures of CDP pinch/page scaling. They are retained as failure evidence and are explicitly not
  part of the passing capture set.
- Forced colors, increased contrast, and reduced motion:
  `forced-colors-reduced-motion-375x900.png`

## Objective browser evidence

- 12/12 dedicated visual scenarios pass.
- Every default viewport has `scrollWidth <= clientWidth`.
- Search, reset, and filter-disclosure controls are at least 44 CSS pixels tall at 320px.
- The disclosure and a checkbox are operable by keyboard; the selected state remains visible.
- Text spacing, 200%-equivalent, 400%-equivalent, forced colors, increased contrast, and
  reduced-motion scenarios keep the search control and required content reachable. Both zoom
  equivalents also assert `scrollWidth <= clientWidth`.
- Barlow Condensed 800, Newsreader Variable 400, and IBM Plex Mono 400 resolve to bundled font
  faces, report `loaded`, and appear in the computed display, body, and evidence stacks.
- The dedicated datasets behavior/accessibility suite passes 8/8, including three axe scans with
  no violations. The full production-browser suite passes 39/39.

## Content contract

- 925 dataset families and 1,083 distinct public surfaces across all 13 categories.
- Required Mercor APEX leaderboard/data, OpenAI GDPval train viewer, Aviro C4 samples, and the
  Browserbase Stagehand evaluation dataset are present as live DOM links.
- All records remain semantic DOM content; there is no pagination, virtualization, rasterized UI,
  shadow, gradient, rounded card, or decorative motion.
