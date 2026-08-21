# HELI Corrections Pass Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Implement the approved HELI visual correction board across the homepage, sponsor loop, routed pages, and motion system.

**Architecture:** Preserve the existing string-rendered Vite application and React islands. Extend the current render functions and interaction binders, centralize the shared panel-reveal contract in CSS, and use data-driven sponsor presentation values rather than one-off selectors.

**Tech Stack:** Vite 8, JavaScript ES modules, Node test runner, React 19 islands, CSS.

**Spec:** `docs/superpowers/specs/2026-08-20-corrections-pass-design.md`

## Global Constraints

- Preserve the geometric HELI identity, Stack Sans Notch, and black/white/neutral-gray palette.
- Homepage is white-dominant; every routed inner page is black-led.
- Map targets are at least 44 x 44 px and retain visible focus and selected states.
- Motion is purposeful, uses the shared panel transition where applicable, and has `prefers-reduced-motion` coverage.
- No invented partner destinations or factual copy.
- Preserve existing user-owned untracked files, including `public/assets/KÄEPAEL.svg`.

---

### Task 1: Homepage hierarchy, hero, wristband, and Open Call

**Files:**
- Modify: `tests/home.test.js`
- Modify: `src/home.js`
- Modify: `src/styles.css`

**Interfaces:**
- Consumes: existing `renderPaperHero()` and `renderPaperHomepage()` string renderers.
- Produces: `.paper-hero-lockup`, `.paper-hero-route`, `.paper-wristband`, and three `.paper-open-call-shape` layers.

- [ ] **Step 1: Write failing render tests**

Add assertions that the rendered hero groups the mark and descriptor, contains an aria-hidden route SVG, exposes the wristband as a ticket link, and keeps Open Call as one accessible link with three decorative shape layers.

- [ ] **Step 2: Run the focused tests and verify RED**

Run: `npm test -- tests/home.test.js`

Expected: failures for the missing lockup, route, wristband, and shape markup.

- [ ] **Step 3: Implement the minimal markup**

Group the existing SVG and title, add the route path, replace the small ticket button with the wristband asset link, and add decorative shape spans inside Open Call.

- [ ] **Step 4: Implement the approved hierarchy and motion CSS**

Set the 72/34/26 px chrome hierarchy, 156 px wordmark, smaller date, 104 px Open Call control, interaction-triggered shape cycle, one-shot route draw, and reduced-motion fallbacks. Remove the looping HELI letter-path animation.

- [ ] **Step 5: Run the focused tests and verify GREEN**

Run: `npm test -- tests/home.test.js`

Expected: all home tests pass.

### Task 2: Map markers and venue panel reveal

**Files:**
- Modify: `tests/home-venues.test.js`
- Modify: `tests/home-venue-interactions.test.js`
- Modify: `src/home-venues.js`
- Modify: `src/home-venue-interactions.js`
- Modify: `src/styles.css`

**Interfaces:**
- Consumes: `renderPaperVenueMarkers(activeId)` and `bindPaperVenueMap(root, options)`.
- Produces: square marker visuals, 44 px targets, `t-panel-slide`/`data-open` venue-panel state, and the white venue/map composition.

- [ ] **Step 1: Write a failing interaction test**

Assert that selecting another marker closes the panel with `data-open="false"`, swaps real venue content after the close interval, then reopens it on the next frame.

- [ ] **Step 2: Run focused tests and verify RED**

Run: `npm test -- tests/home-venue-interactions.test.js tests/home-venues.test.js`

Expected: failure because the current binder uses a switching class instead of the panel-state contract.

- [ ] **Step 3: Implement panel state and marker markup**

Render the venue panel with `class="paper-venue-content t-panel-slide" data-open="true"`; toggle `data-open` in the binder and keep all existing accessible button labels and pressed states.

- [ ] **Step 4: Apply the transition and white composition CSS**

Install the transitions.dev panel variables/snippet once, tune local travel to 12 px, replace heart image pseudo-elements with square pixels, and invert venue/map copy and controls for the paper surface.

- [ ] **Step 5: Run focused tests and verify GREEN**

Run: `npm test -- tests/home-venue-interactions.test.js tests/home-venues.test.js`

Expected: all focused tests pass.

### Task 3: Sponsor destinations and optical normalization

**Files:**
- Modify: `tests/sponsors.test.js`
- Modify: `src/sponsors.js`
- Modify: `src/components/LogoLoop.jsx`
- Modify: `src/components/LogoLoop.css`
- Modify: `src/styles.css`
- Replace if a verified combined lockup exists: `public/assets/sponsors/tallinn.svg`

**Interfaces:**
- Consumes: `sponsorLogos` objects and LogoLoop's existing `href` support.
- Produces: an authoritative `href` and numeric `opticalScale` per sponsor plus image-level custom-property styling.

- [ ] **Step 1: Write failing sponsor-manifest tests**

Assert that every sponsor has an HTTPS destination, unique `src`, non-empty accessible name, and an optical scale within 0.7-1.3.

- [ ] **Step 2: Run the focused test and verify RED**

Run: `npm test -- tests/sponsors.test.js`

Expected: failure because current records have no destinations or optical scales.

- [ ] **Step 3: Add verified data and image presentation support**

Add the official destinations and optical scales. Pass each scale to the image as `--logoloop-item-scale` and preserve the existing anchor security attributes.

- [ ] **Step 4: Normalize sponsor layout CSS**

Scale images optically without changing the loop's measured item geometry, and preserve keyboard focus visibility.

- [ ] **Step 5: Run the focused test and verify GREEN**

Run: `npm test -- tests/sponsors.test.js`

Expected: all sponsor tests pass.

### Task 4: Dark routed pages and route reveal

**Files:**
- Modify: `tests/pages.test.js`
- Modify: `tests/site-shell.test.js`
- Modify: `tests/utility-interactions.test.js`
- Modify: `src/pages.js`
- Modify: `src/site-shell.js`
- Modify: `src/app.js`
- Modify: `src/styles.css`

**Interfaces:**
- Consumes: `renderRoute(route)`, `renderSiteShell(page)`, and the application render lifecycle.
- Produces: dark tone for every inner route, `.t-panel-slide[data-open="false"]` route wrappers, and exported `revealRoutePanel(root, requestFrame)` behavior.

- [ ] **Step 1: Write failing route and reveal tests**

Assert every named inner route returns `tone: "dark"`; the shell begins `aria-busy="true"` and closed; and the reveal helper opens the panel and clears busy state on the next frame.

- [ ] **Step 2: Run focused tests and verify RED**

Run: `npm test -- tests/pages.test.js tests/site-shell.test.js tests/utility-interactions.test.js`

Expected: failures for light route tones and missing reveal state/helper.

- [ ] **Step 3: Implement route state and orchestration**

Return dark tone for every inner route, add the shell transition attributes, export the reveal helper, and call it after both homepage and utility-page renders without artificial delay.

- [ ] **Step 4: Implement the dark visual system**

Update programme, venue/artist detail, transport, about, filters, tables, FAQ, and footer surfaces to use black-led backgrounds with white text/rules and paper foreground objects where semantically appropriate.

- [ ] **Step 5: Run focused tests and verify GREEN**

Run: `npm test -- tests/pages.test.js tests/site-shell.test.js tests/utility-interactions.test.js`

Expected: all focused tests pass.

### Task 5: Whole-path verification and visual QA

**Files:**
- Modify only if verification finds a real defect in an already changed target.

**Interfaces:**
- Consumes: the complete correction implementation.
- Produces: passing tests/build, one detector report, desktop/mobile screenshots, and a running development server.

- [ ] **Step 1: Run the complete test suite**

Run: `npm test`

Expected: zero failed tests.

- [ ] **Step 2: Run the production build**

Run: `npm run build`

Expected: Vite exits 0 with no build errors.

- [ ] **Step 3: Run the Impeccable detector once**

Run: `node C:/Users/orafm/.agents/skills/impeccable/scripts/detect.mjs --json src/home.js src/site-shell.js src/app.js src/styles.css src/sponsors.js src/components/LogoLoop.jsx`

Expected: inspect every finding; fix real defects in one batch.

- [ ] **Step 4: Start the dev server and inspect representative routes**

Run: `npm run start -- --host 127.0.0.1`

Inspect `#home`, `#programme`, `#venues`, `#tickets`, `#transport`, and `#about` at desktop and mobile widths, including keyboard focus, map switching, sponsor links, route reveal, and console output.

- [ ] **Step 5: Re-run tests/build after any visual-QA fixes**

Run: `npm test` and `npm run build`.

Expected: zero failed tests and build exit 0.

