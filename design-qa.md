# Homepage visual QA

final result: passed

## Source truth and implementation evidence

- Source Paper artboard: `tmp/paper-finale-source.png`
- Final desktop implementation: `tmp/paper-home-final-live-text-desktop.png`
- Full side-by-side comparison: `tmp/paper-home-final-live-text-comparison.png`
- Focused hero comparison: `tmp/paper-home-final-live-text-hero-comparison.png`
- Final mobile implementation: `tmp/paper-home-final-live-text-mobile.png`
- Final HALL interaction evidence: browser-rendered `#home` state with the HALL marker selected and `/assets/places/hall.jpg` visible.
- State: `#home`, Estonian source copy, animation running.

## Viewport and normalization

- Paper source: 1280 × 2092 pixels.
- Desktop CSS viewport: 1280 × 2200; comparison crop: 1280 × 2092; device scale factor: 1.
- Desktop source and implementation were placed together in a 2560 × 2092 comparison image without density resampling.
- Focused hero comparison: matching 1280 × 498 crops placed together at native density.
- Mobile CSS viewport: 390 × 844; uniformly scaled Paper shell: 390 × 637.40625; device scale factor: 1.
- Desktop and mobile checks report no horizontal overflow.

## Findings

- No actionable P0, P1, or P2 issue remains.
- The live-text hero preserves the Paper hierarchy and geometry while making the festival descriptor, date, summary, and buttons selectable HTML. It contains exactly one image: the supplied HELI mark.
- The deliberate user-requested changes from the static source are the live hero text, interactive venue states with real photographs, and the animated local sponsor loop.
- Remaining source/implementation differences are acceptable live-font rasterization, animation phase, and deliberate real venue copy rather than defects.

## Required fidelity surfaces

- Fonts and typography: Stack Sans Headline is used for the hero display text and Inter for supporting copy. Size, weight, line breaks, tracking, and hierarchy closely match the Paper source; the 1280 px focused comparison shows no material wrapping or alignment drift.
- Spacing and layout rhythm: the 60 / 40 / 40 / 499 / 522 / 164 / 165 px section stack and 1280 × 2092 canvas remain intact. Desktop and 390 px mobile captures show no overlap or horizontal overflow.
- Colors and visual tokens: black, `#f7f7f5`, ticker gray, pink selected marker, white markers, and the closing fade match the established Paper palette. Hover inversions preserve black/white contrast.
- Image quality and asset fidelity: the HELI mark uses the supplied transparent asset; six supplied venue photographs use Vite-managed production URLs and `object-fit: cover`; all 24 sponsor identities use local transparent assets. No broken visible images or console warnings/errors were observed.
- Copy and content: hero, navigation, tickers, buttons, venue names/addresses, future-place labels, and sponsor accessibility labels are coherent and present.
- Icons: ticker stars use the supplied SVG assets; map markers remain the Paper squares. No placeholder or handcrafted replacement imagery was introduced.
- States and interactions: all 11 map markers are rendered; all 11 were exercised earlier in the implementation pass, and the final HALL state was rechecked after the last changes. HALL updates the selected marker, title, photograph, and accurate alt text after the 150 ms transition.
- Accessibility: one live hero heading, semantic links, venue button labels/pressed state, polite venue panel updates, sponsor-region label, hidden duplicate logo lists, accurate photograph alts, focus outlines, and reduced-motion rules are present.

## Motion and overlap evidence

- Both ticket tracks move linearly in opposite directions with duplicated sequences and no blank interval.
- The LogoLoop track transform changed from `matrix(1, 0, 0, 1, -3229.41, 0)` to `matrix(1, 0, 0, 1, -3255.7, 0)` during the final sample.
- Native sponsor-list markers are removed (`list-style-type: none`).
- Minimum measured adjacent sponsor-item gap: 33.99999 px; maximum measured item width: 222.375 px. No logo/dot or logo/logo overlap remains.
- Header underline hover reached `scaleX(1)`.
- `Vaata programmi` changed from transparent background/black text to black background/white text on hover while retaining a computed 1 px solid border.

## Primary interactions and console

- Header links, programme button, ticket button, open-call link, and lower ticket CTA retain their destinations.
- Sponsor React root unmounts outside `#home` and mounts once on return.
- Final browser console check: no errors or warnings.
- Final production/static asset checks are covered by the build and automated suite.

## Comparison history

1. P2: the official long-form Kumu lockup rendered 765.8 px wide at 54 px height. Fixed by using the exact compact Paper KUMU crop in the visible manifest while retaining the official SVG as provenance-only. Post-fix maximum item width is 222.375 px.
2. P2: native `<li>` bullets appeared as dividing dots between sponsor logos. Fixed with a sponsor-island-scoped list reset. Post-fix `list-style-type` is `none` and the measured gap is 34 px.
3. P2: the live `Vaata programmi` control initially lacked the Paper border. Fixed with a `.8px solid #000` declaration and covering tests. Browser computes it as a 1 px solid black border and the focused comparison shows both controls bordered.
4. Post-fix desktop and mobile recaptures show the earlier findings resolved and no new P0/P1/P2 mismatch.

## Follow-up polish

- No blocking follow-up remains. Byte-for-byte LogoLoop source comparison and the venue wrapper-stripping helper remain low-risk test/code-maintenance opportunities, not visible product defects.
