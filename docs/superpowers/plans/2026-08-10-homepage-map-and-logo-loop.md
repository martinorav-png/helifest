# Homepage Map and Logo Loop Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add eleven interactive Paper-map markers, a changing venue panel, a gap-free ticket marquee, animated header underlines, and the supplied React `LogoLoop` sponsor animation with individual sponsor assets.

**Architecture:** Keep the existing string-rendered Vite site and add one isolated React root inside the sponsor section. Venue records and pure render helpers live in a focused module; DOM event wiring remains in a second module. Existing Paper geometry stays fixed at 1280 × 2092 and continues scaling uniformly to the viewport.

**Tech Stack:** Vite 8, JavaScript modules, React 19, React DOM 19, Node test runner, CSS animations/transitions, ResizeObserver, requestAnimationFrame.

## Global Constraints

- Preserve the 1280 × 2092 Paper canvas and its existing section dimensions.
- Use the exact user-supplied `LogoLoop` algorithm and public props.
- Map markers use the exact eleven Paper square coordinates and 10 × 10 px visible geometry.
- Eight markers use existing venue records; three use explicit future-venue records.
- Sponsor logos must live in `assets/sponsors/` and retain their original aspect ratios.
- Use official logo assets where verifiable; otherwise use exact Paper-artwork crops and record provenance in `assets/sponsors/SOURCES.md`.
- Preserve keyboard access, `aria-pressed`, focus visibility, live-region updates, and reduced-motion behavior.
- This workspace is not a Git repository; replace commit steps with verified task checkpoints.

---

### Task 1: Venue data and map renderer

**Files:**
- Create: `src/home-venues.js`
- Modify: `src/home.js`
- Test: `tests/home-venues.test.js`
- Test: `tests/home.test.js`

**Interfaces:**
- Produces: `paperVenueRecords: Array<PaperVenueRecord>` where each record has `id`, `name`, `address`, `description`, `x`, `y`, `image`, and `isPlaceholder`.
- Produces: `getPaperVenue(id: string): PaperVenueRecord`.
- Produces: `renderPaperVenuePanel(record: PaperVenueRecord): string`.
- Produces: `renderPaperVenueMarkers(activeId?: string): string`.
- Consumed by: `renderPaperVenue()` and Task 2 interaction wiring.

- [ ] **Step 1: Write failing venue-data tests**

```js
import test from 'node:test';
import assert from 'node:assert/strict';
import { paperVenueRecords, getPaperVenue, renderPaperVenueMarkers, renderPaperVenuePanel } from '../src/home-venues.js';

test('Paper map exposes eight real venues and three future venues', () => {
  assert.equal(paperVenueRecords.length, 11);
  assert.equal(paperVenueRecords.filter(item => item.isPlaceholder).length, 3);
  assert.deepEqual(paperVenueRecords.map(item => [item.x, item.y]), [
    [241, 113], [295, 190], [366, 158], [344, 180], [393, 209],
    [327, 160], [334, 225], [258, 265], [500, 251], [398, 300], [323, 270],
  ]);
});

test('marker and panel renderers expose accessible selected state', () => {
  assert.match(renderPaperVenueMarkers('hall'), /data-venue-id="hall"[^>]*aria-pressed="true"/);
  assert.match(renderPaperVenuePanel(getPaperVenue('hall')), /HALL/);
  assert.match(renderPaperVenuePanel(getPaperVenue('future-01')), /Asukoht lisandub/);
});
```

- [ ] **Step 2: Run tests and confirm the module is missing**

Run: `node --test tests/home-venues.test.js`
Expected: FAIL with `ERR_MODULE_NOT_FOUND` for `src/home-venues.js`.

- [ ] **Step 3: Implement the eleven records and pure render helpers**

Create the module with the exact ordered IDs:

```js
const venueSeeds = [
  ['paavli', 'Paavli Kultuurivabrik', 'Paavli tn 7', 241, 113, '/assets/paavli-night.png', false],
  ['ida', 'IDA', 'Telliskivi tn 60a-5', 295, 190, null, false],
  ['hall', 'HALL', 'Peetri tn 6', 366, 158, null, false],
  ['kumu', 'Kumu', 'Weizenbergi 34', 344, 180, null, false],
  ['d3', 'D3', 'Telliskivi 62/2', 393, 209, null, false],
  ['ekkm', 'EKKM', 'Kursi tn 5', 327, 160, null, false],
  ['uuslaine', 'Uus Laine', 'Vana-Kalamaja tn 1', 334, 225, null, false],
  ['fonoteek', 'FONOTEEK', 'Telliskivi tn 62', 258, 265, null, false],
  ['future-01', 'Tulevane paik 01', 'Asukoht lisandub', 500, 251, null, true],
  ['future-02', 'Tulevane paik 02', 'Asukoht lisandub', 398, 300, null, true],
  ['future-03', 'Tulevane paik 03', 'Asukoht lisandub', 323, 270, null, true],
];
```

Real descriptions identify the venue and address; future records use `Festivali asukoha info lisandub peagi.`. Render markers as `<button type="button" class="paper-map-marker">` with `data-venue-id`, `aria-label`, and `aria-pressed`. Render the panel with stable hooks `data-paper-venue-panel`, `data-paper-venue-title`, `data-paper-venue-copy`, and `data-paper-venue-visual`.

- [ ] **Step 4: Replace the static venue markup**

Update `renderPaperVenue()` to compose `renderPaperVenuePanel(getPaperVenue('paavli'))`, the existing map image, and `renderPaperVenueMarkers('paavli')` inside a `paper-map-stage` wrapper.

- [ ] **Step 5: Run venue and homepage tests**

Run: `node --test tests/home-venues.test.js tests/home.test.js`
Expected: all tests PASS.

---

### Task 2: Venue-selection behavior and transitions

**Files:**
- Create: `src/home-venue-interactions.js`
- Modify: `src/app.js`
- Modify: `src/styles.css`
- Test: `tests/home-venue-interactions.test.js`
- Test: `tests/home.test.js`

**Interfaces:**
- Consumes: `getPaperVenue()` and `renderPaperVenuePanel()` from Task 1.
- Produces: `bindPaperVenueMap(root: ParentNode): () => void`, returning a cleanup function.

- [ ] **Step 1: Write failing interaction source-contract tests**

```js
test('venue map binding updates markers and the live panel', () => {
  const source = readFileSync(new URL('../src/home-venue-interactions.js', import.meta.url), 'utf8');
  assert.match(source, /export function bindPaperVenueMap/);
  assert.match(source, /aria-pressed/);
  assert.match(source, /data-paper-venue-panel/);
  assert.match(source, /paper-venue-panel--switching/);
});
```

- [ ] **Step 2: Run the test and confirm the interaction module is missing**

Run: `node --test tests/home-venue-interactions.test.js`
Expected: FAIL because `src/home-venue-interactions.js` does not exist.

- [ ] **Step 3: Implement marker click handling**

`bindPaperVenueMap()` queries all `[data-venue-id]` buttons. On click it:

1. exits if the clicked venue is already active;
2. adds `paper-venue-panel--switching`;
3. after 150 ms, replaces the panel contents with `renderPaperVenuePanel(record)` inner content;
4. updates every marker’s `aria-pressed` value;
5. removes the switching class on the next animation frame;
6. returns cleanup that removes listeners and pending timers.

- [ ] **Step 4: Wire lifecycle cleanup in `app.js`**

Track a module-level `let cleanupPaperVenueMap = () => {};`. Call it before each render replaces `main.innerHTML`, then assign `cleanupPaperVenueMap = bindPaperVenueMap(main)` after rendering the homepage.

- [ ] **Step 5: Add exact marker and panel CSS**

Position `.paper-map-stage` at `left: 607px; top: 0; width: 673px; height: 522px`. Each marker uses `left: calc(var(--marker-x) * 1px - 7px)` and `top: calc(var(--marker-y) * 1px - 7px)`, a 24 × 24 px transparent button, and a 10 × 10 px visible `::before` square centered inside. Active markers use `#ff90da`; inactive markers use white. Add hover/focus scale to 1.35 and preserve the pink focus outline.

The panel transition uses opacity and `translateY(8px)` for 150 ms, with transitions removed under `prefers-reduced-motion: reduce`.

- [ ] **Step 6: Run interaction and CSS tests**

Run: `node --test tests/home-venue-interactions.test.js tests/home.test.js`
Expected: all tests PASS.

---

### Task 3: Gap-free ticket loops and animated header underlines

**Files:**
- Modify: `src/home.js`
- Modify: `src/styles.css`
- Test: `tests/home.test.js`

**Interfaces:**
- Keeps: `renderPaperMarquee(text, label, tone)`.
- Produces: two equal marquee sequences whose individual width exceeds the internal 1280 px viewport.

- [ ] **Step 1: Add failing layout-contract tests**

Assert that each track renders at least eight 179 px items, the light ticker does not use `justify-content: flex-end`, and `.paper-header nav a::after` animates `transform: scaleX(0)` to `scaleX(1)` on hover/focus.

- [ ] **Step 2: Run the focused test and confirm the light-track/underline requirements fail**

Run: `node --test --test-name-pattern="ticket banners|header underline" tests/home.test.js`
Expected: FAIL on the absent underline and/or light alignment contract.

- [ ] **Step 3: Make each marquee sequence wider than the ticker**

Render eight items per sequence. Keep exactly two equal `.paper-ticket-track` elements. Remove `justify-content: flex-end` from the light ticker and keep `animation-direction: reverse` on its moving container.

- [ ] **Step 4: Add the animated header underline**

Use a positioned `::after` line with `transform-origin: left`, `transform: scaleX(0)`, and a 250 ms `var(--ease-smooth-out)` transition. Hover and focus-visible set `scaleX(1)`. Disable the transition for reduced motion.

- [ ] **Step 5: Run the homepage tests**

Run: `node --test tests/home.test.js`
Expected: all tests PASS.

---

### Task 4: Sponsor asset library and provenance

**Files:**
- Create: `assets/sponsors/*.png` and/or `assets/sponsors/*.svg`
- Create: `assets/sponsors/SOURCES.md`
- Create: `src/sponsors.js`
- Test: `tests/sponsors.test.js`

**Interfaces:**
- Produces: `sponsorLogos: Array<{ src: string, alt: string, title: string, href?: string }>`.
- Consumed by: Task 5 sponsor React island.

- [ ] **Step 1: Write a failing sponsor manifest test**

```js
test('sponsor manifest uses individual assets with accessible labels', () => {
  assert.ok(sponsorLogos.length >= 20);
  for (const logo of sponsorLogos) {
    assert.match(logo.src, /^\/assets\/sponsors\//);
    assert.ok(logo.alt.length > 0);
    assert.ok(existsSync(join(projectRoot, logo.src.slice(1))));
  }
});
```

- [ ] **Step 2: Run the sponsor test and confirm the manifest is missing**

Run: `node --test tests/sponsors.test.js`
Expected: FAIL with `ERR_MODULE_NOT_FOUND` for `src/sponsors.js`.

- [ ] **Step 3: Acquire and normalize sponsor assets**

Create assets for the unique visible identities: Paavli Kultuurivabrik, IDA, HALL, Kumu, D3, MOD, EKKM, Hungr, Uus Laine, Ülase 12, Fonoteek, TOPS, Plastik, Kureeritud Uudised Records, Von Krahl, EKA, Biit Me, Kino Sõprus, XINH, Pudel, Stuudio, Burger Box, Terminal, and Tallinn.

Use verified official downloads for Kumu, EKA, and Tallinn. For any identity without an official downloadable asset, crop the exact monochrome mark from `assets/heli-sponsors.png`, preserve transparency, and save a tightly bounded PNG. Do not redraw any logo.

- [ ] **Step 4: Record provenance**

Create a Markdown table in `assets/sponsors/SOURCES.md` with columns `Sponsor`, `File`, `Source`, and `Notes`. Include the official source URL for downloaded assets and `Paper artwork crop: assets/heli-sponsors.png` for crop fallbacks.

- [ ] **Step 5: Create and verify the manifest**

Export all assets in visual row order from `src/sponsors.js`, then run `node --test tests/sponsors.test.js` and confirm PASS.

---

### Task 5: Exact React LogoLoop sponsor island

**Files:**
- Modify: `package.json`
- Modify: `package-lock.json`
- Create: `src/components/LogoLoop.jsx`
- Create: `src/components/LogoLoop.css`
- Create: `src/sponsor-loop.jsx`
- Modify: `src/home.js`
- Modify: `src/app.js`
- Modify: `src/styles.css`
- Test: `tests/sponsors.test.js`
- Test: `tests/home.test.js`

**Interfaces:**
- Consumes: `sponsorLogos` from Task 4.
- Produces: `mountSponsorLoop(element: HTMLElement): () => void`.

- [ ] **Step 1: Add failing React-island contract tests**

Assert that the homepage contains `data-sponsor-loop-root`, `sponsor-loop.jsx` imports `createRoot`, `LogoLoop`, and `sponsorLogos`, and the exact component contains `ANIMATION_CONFIG`, `ResizeObserver`, dynamic `copyCount`, and `requestAnimationFrame`.

- [ ] **Step 2: Run tests and confirm the React island is absent**

Run: `node --test tests/sponsors.test.js tests/home.test.js`
Expected: FAIL on missing sponsor-loop and LogoLoop files.

- [ ] **Step 3: Install React support and the registry component**

Run:

```powershell
npm install react@19 react-dom@19
npx shadcn@latest add @react-bits/LogoLoop-JS-CSS
```

If the registry command declines because this project has no shadcn configuration, create `src/components/LogoLoop.jsx` and `src/components/LogoLoop.css` from the user-supplied attachment verbatim.

- [ ] **Step 4: Implement the mount wrapper**

`mountSponsorLoop(element)` creates a React root and renders:

```jsx
<LogoLoop
  logos={sponsorLogos}
  speed={62}
  direction="left"
  width="100%"
  logoHeight={54}
  gap={34}
  pauseOnHover={false}
  fadeOut={false}
  scaleOnHover
  ariaLabel="HELI venues and partners"
/>
```

Return `() => root.unmount()`.

- [ ] **Step 5: Replace the raster sponsor slices with the mount root**

Render `<section class="paper-sponsors"><div class="paper-sponsor-loop" data-sponsor-loop-root></div></section>`. In `app.js`, unmount any previous sponsor root before rerendering and mount after the homepage HTML is inserted.

- [ ] **Step 6: Fit LogoLoop to the Paper sponsor row**

Keep `.paper-sponsors` at 165 px. Center `.paper-sponsor-loop` vertically, set width to 1280 px, and ensure scaled logo hover remains unclipped. Preserve the supplied LogoLoop reduced-motion CSS.

- [ ] **Step 7: Run sponsor/home tests and production build**

Run: `node --test tests/sponsors.test.js tests/home.test.js && npm run build`
Expected: all tests PASS and Vite builds JSX without errors.

---

### Task 6: Browser verification and QA report

**Files:**
- Modify: `design-qa.md`
- Create: `tmp/paper-home-interactive-1440.png`
- Create: `tmp/paper-home-interactive-mobile.png`

**Interfaces:**
- Verifies all outputs from Tasks 1–5.

- [ ] **Step 1: Run the full automated verification**

Run: `npm test`
Expected: zero failures.

Run: `npm run build`
Expected: exit code 0.

- [ ] **Step 2: Verify the live homepage at 1440 × 900**

Confirm document width equals viewport width, both ticket banners remain populated across multiple animation samples, header underline appears on hover/focus, and the sponsor loop transform changes without exposing an empty interval.

- [ ] **Step 3: Exercise the map**

Click Paavli, HALL, FONOTEEK, and all three future markers. Confirm the left title/address/tile changes, exactly one marker is pink/pressed, keyboard activation works, and no navigation occurs.

- [ ] **Step 4: Verify mobile at 390 × 844**

Confirm uniform scaling, no horizontal overflow, markers remain clickable through transformed coordinates, and both moving loops remain populated.

- [ ] **Step 5: Capture and inspect final screenshots**

Save neutral desktop/mobile captures, compare against the Paper composition, and verify that only the requested interaction changes differ.

- [ ] **Step 6: Update the QA gate**

Document source/reference paths, viewports, interaction states, motion behavior, marker coverage, sponsor provenance, console status, and any remaining P3 notes. End with the exact line `final result: passed` only when no P0/P1/P2 issue remains.
