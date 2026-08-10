# HELI Homepage Paper Pixel-Match Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the existing homepage with a faithful 1280 × 2092 implementation of the Paper `finale` artboard and uniformly scale that fixed composition on narrower viewports.

**Architecture:** Keep the existing vanilla JavaScript application and hash routes. Build the homepage as focused string-renderer functions in `src/home.js`, mount the Paper-specific header and page from `src/app.js`, and replace every accumulated homepage override in `src/styles.css` with one authoritative stylesheet section. Use only local source assets already present in `assets/`.

**Tech Stack:** Vanilla ES modules, semantic HTML, CSS, Vite, Node's built-in test runner, Paper MCP source evidence, in-app browser verification.

## Global Constraints

- The Paper `finale` artboard at 1280 × 2092 is the sole visual authority.
- Replace the current homepage entirely; preserve all non-homepage data and view functions.
- Preserve the fixed composition and scale it uniformly below 1280px; do not reflow it.
- Use local assets only and do not approximate visible source art.
- Keep semantic labels and working hash links over the matching Paper regions.
- The workspace is not a Git repository, so commit steps are replaced by explicit verified checkpoints.

---

### Task 1: Paper Homepage Renderers

**Files:**
- Modify: `tests/home.test.js`
- Modify: `src/home.js`

**Interfaces:**
- Produces: `renderPaperMarquee(text, label, tone)`, `renderPaperHero()`, `renderPaperVenue()`, `renderPaperTicketCta()`, `renderPaperSponsors(label)`, and `renderPaperHomepage(copy)` returning HTML strings.
- Consumes: local asset URLs under `/assets/` and translated labels supplied by `src/app.js`.

- [ ] **Step 1: Write failing renderer tests**

Add tests that call `renderPaperHomepage()` and independently assert that it produces one `.paper-homepage-canvas`, two ticker regions, `/assets/visitor-hero.png`, `/assets/paavli-night.png`, `/assets/heli-sponsors.png`, an open-call link, programme and ticket links, the Paavli section, sponsor strip, and closing gradient element. Assert that legacy classes such as `.live-hero`, `.venue-feature-map`, and `.icon-strip` are absent.

- [ ] **Step 2: Run the renderer tests and verify RED**

Run: `node --test tests/home.test.js`

Expected: FAIL because `renderPaperHomepage` is not exported.

- [ ] **Step 3: Implement minimal renderers**

Implement the requested exports using semantic sections and fixed class names. The hero uses the exact `visitor-hero.png` asset plus live overlay links/badge. The venue renderer uses the exact photograph and a `<div class="paper-map-art" aria-hidden="true">` whose child positions map directly to the Paper rectangle coordinates. The sponsor renderer uses the exact sponsor raster in three crop slots matching the artboard.

- [ ] **Step 4: Run the renderer tests and verify GREEN**

Run: `node --test tests/home.test.js`

Expected: all homepage renderer tests pass.

- [ ] **Step 5: Run the complete test suite**

Run: `npm test`

Expected: all existing and new tests pass with zero failures.

### Task 2: Application Mount and Paper Header

**Files:**
- Modify: `src/app.js`
- Modify: `tests/home.test.js`

**Interfaces:**
- Consumes: `renderPaperHomepage(copy)` from `src/home.js`.
- Produces: the fixed Paper homepage inside `#main-content` and the exact five-link black header inside `#site-header`.

- [ ] **Step 1: Add a failing integration-contract test**

Read `src/app.js` as text and assert it imports and calls `renderPaperHomepage`, no longer imports the legacy homepage renderers, and builds the five exact navigation labels with their intended hash destinations.

- [ ] **Step 2: Run the contract test and verify RED**

Run: `node --test tests/home.test.js`

Expected: FAIL because the application still imports and calls the legacy homepage functions.

- [ ] **Step 3: Wire the new homepage**

Replace the legacy imports and `homeView()` assembly. Render the Paper header wordmark from the exact local white HELI asset, map `AJAKAVA`, `PILETID`, `TRANSPORT`, `MEIST`, and `FAQ` to the existing programme, tickets, transport, information, and information routes, and hide the ordinary site footer only on the Paper homepage.

- [ ] **Step 4: Run tests and verify GREEN**

Run: `npm test`

Expected: all tests pass.

### Task 3: Authoritative Pixel-Match CSS

**Files:**
- Modify: `src/styles.css`
- Modify: `tests/home.test.js`

**Interfaces:**
- Consumes: class names emitted by the renderers.
- Produces: exact 1280 × 2092 artboard geometry and uniform viewport scaling.

- [ ] **Step 1: Add failing CSS-contract tests**

Read `src/styles.css` and assert there is one `/* Paper finale homepage */` section, a 1280px `.paper-homepage-canvas`, 2092px height, 60px header, two 40px tickers, 499px hero, 522px venue band, 164px CTA band, 165px sponsor band, and a narrow-screen scale rule based on `--paper-home-scale`. Assert the old homepage section markers and responsive reflow selectors are absent.

- [ ] **Step 2: Run tests and verify RED**

Run: `node --test tests/home.test.js`

Expected: FAIL because the authoritative Paper section does not exist and legacy homepage overrides remain.

- [ ] **Step 3: Replace homepage CSS**

Keep the shared non-homepage CSS above the existing homepage marker. Delete all earlier homepage reference/Figma/finale passes and add one `/* Paper finale homepage */` section whose dimensions and coordinates come from the Paper JSX and computed styles. Use a fixed 1280px canvas and a wrapper whose height is `calc(2092px * var(--paper-home-scale))`; scale the canvas from top center using `min(1, 100vw / 1280)` behavior implemented through CSS media rules.

- [ ] **Step 4: Run tests and build**

Run: `npm test`

Run: `npm run build`

Expected: both commands exit 0.

### Task 4: Browser Verification and Design QA

**Files:**
- Create: `tmp/paper-finale-source.png`
- Create: `tmp/paper-home-desktop.png`
- Create: `tmp/paper-home-mobile.png`
- Create: `design-qa.md`

**Interfaces:**
- Consumes: the Paper MCP source screenshot and locally rendered homepage.
- Produces: matched comparison evidence and a passing QA report.

- [ ] **Step 1: Start the local preview**

Run the existing Vite app on a stable local port and keep it running.

- [ ] **Step 2: Capture the desktop implementation**

Open the homepage in the in-app browser at a 1280px content viewport, wait for fonts and images, capture the full 1280 × 2092 composition, test the five header links plus programme/ticket/open-call links, and check browser console errors.

- [ ] **Step 3: Compare desktop against Paper**

Combine the Paper source screenshot and local desktop capture into one comparison image. Check typography, geometry, colors, raster crops, copy, and interaction overlays. Record all P0/P1/P2 findings.

- [ ] **Step 4: Fix and repeat desktop comparison**

For each P0/P1/P2 mismatch, add a failing regression assertion where behavior is testable, apply the smallest code/CSS fix, recapture at the same viewport, and repeat comparison until no actionable P0/P1/P2 findings remain.

- [ ] **Step 5: Verify fixed mobile scaling**

Capture at 390px width and confirm the 1280px composition is uniformly scaled without reflow, clipping, or horizontal scrolling. Test that links remain operable.

- [ ] **Step 6: Write the final QA report**

Create `design-qa.md` with source and implementation paths, viewport and density, full-view and focused-region evidence, comparison history, interaction/console results, and `final result: passed` only when no actionable P0/P1/P2 issue remains.

- [ ] **Step 7: Fresh final verification**

Run: `npm test`

Run: `npm run build`

Expected: both commands exit 0 immediately before handoff.
