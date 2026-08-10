# Homepage Reference Pass Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rework the HELI homepage first viewport to match the supplied reference while keeping the existing festival navigation, route, programme preview, pass, and language behavior intact.

**Architecture:** Keep the current vanilla render architecture in `src/app.js` and `src/styles.css`. Add small homepage-only helpers for the announcement marquees, then reshape the homepage into a black utility header, two scrolling banners, a split editorial hero, and an early venue discovery block using existing festival data and assets.

**Tech Stack:** Vite, vanilla JavaScript modules, CSS, Node test runner.

## Global Constraints

- Preserve `Stack Sans Notch`, `#F7F7F5`, `#080808`, `#6E6E6A`, and rule-based depth from `DESIGN.md`.
- Use existing content and assets; do not invent confirmed programme facts.
- Keep all controls keyboard accessible with visible focus and 44px minimum touch targets.
- Marquee motion must stop or become static under `prefers-reduced-motion`.
- Keep the homepage responsive without introducing horizontal page overflow.

---

### Task 1: Add homepage marquee and hero behavior tests

**Files:**
- Modify: `tests/programme.test.js` or create `tests/home.test.js`
- Test: `src/app.js` exported homepage helpers, if extraction is needed

**Interfaces:**
- Produces test coverage for marquee copy presence, primary homepage action, and venue discovery copy.

- [ ] **Step 1: Write the failing test**

Assert that the homepage render contains two marquee regions, an accessible programme action, and the first participating venue name.

- [ ] **Step 2: Run the focused test to verify it fails**

Run: `npm test -- --test-name-pattern="homepage"`

Expected: FAIL because the current homepage has no marquee regions and does not expose the new homepage structure.

- [ ] **Step 3: Keep the test focused on rendered behavior**

Use a small exported `homeView`/`homeMarkup` seam only if the current module shape requires it; do not assert CSS implementation details.

---

### Task 2: Implement the reference-led homepage structure

**Files:**
- Modify: `src/app.js`
- Modify: `src/i18n.js`

**Interfaces:**
- Consumes: `festivalData`, `lookup`, `translations`, and existing `buttonLink`/`mark` helpers.
- Produces: homepage markup containing `.announcement-marquee`, `.reference-hero`, `.venue-feature`, and the existing `.programme-preview`, `.pass-block`, and `.route-rail` sections.

- [ ] **Step 1: Add a reusable marquee helper**

Create a homepage helper that renders a labelled `div` with `aria-label`, a static text copy repeated enough to fill the strip, and `aria-hidden="true"` on the moving inner track so screen readers receive the label once.

- [ ] **Step 2: Rebuild `homeView()` first viewport**

Render the existing header above the homepage, followed by two scrolling banners: one for the festival date/pass message and one for the shuttle/venue message. Replace the current hero with a split editorial hero where the HELI mark and identity sit beside the oversized date, intro, and primary programme link.

- [ ] **Step 3: Add an early venue feature**

Use `festivalData.venues[0]` and the existing `t('home...')` copy to introduce Paavli Kultuurivabrik before the programme preview. Use `/assets/tallinnpixeled.png` only if its content is appropriate; otherwise retain a typographic venue panel with no fabricated image claim.

- [ ] **Step 4: Normalize homepage-visible encoding**

Rewrite the affected Estonian translation strings in UTF-8 so the page visibly renders `€`, `Ü`, `ä`, and related characters correctly.

- [ ] **Step 5: Run the focused test to verify it passes**

Run: `npm test -- --test-name-pattern="homepage"`

Expected: PASS.

---

### Task 3: Style the reference-led homepage and marquees

**Files:**
- Modify: `src/styles.css`

**Interfaces:**
- Consumes: the new homepage class names from `src/app.js`.
- Produces: a responsive black header/banner spine, split hero, venue feature, and reduced-motion-safe marquee styling.

- [ ] **Step 1: Restyle the header for the reference**

Use a black header with inverted HELI mark, compact uppercase navigation, and reversed pass/language controls while preserving focus visibility.

- [ ] **Step 2: Add two marquee strips**

Create `.announcement-marquee` with overflow clipping, `.marquee-track` with a transform-based linear animation, and a static single-line fallback under reduced motion. Keep the strips compact and avoid decorative flashing.

- [ ] **Step 3: Add the split editorial hero**

Use rules and asymmetry rather than cards or shadows. Keep the date prominent, cap display sizing at 6rem where practical, and ensure the hero collapses into a readable one-column mobile layout.

- [ ] **Step 4: Add the venue feature block**

Give the venue a black typographic panel paired with a light information panel, using the existing venue address and shuttle stop. Keep text measures readable and avoid fabricated details.

- [ ] **Step 5: Preserve downstream homepage sections**

Retain the programme preview, pass block, and route rail but tighten their spacing and border rhythm so they feel like one system with the new first viewport.

- [ ] **Step 6: Run tests and build**

Run: `npm test`

Run: `npm run build`

Expected: all tests pass and Vite completes without warnings or errors.

---

### Task 4: Verify responsive and implementation quality

**Files:**
- Modify: `src/app.js` or `src/styles.css` only if verification finds a defect.

- [ ] **Step 1: Check homepage at desktop and mobile widths**

Verify that the top banners clip internally, the page does not gain horizontal scroll, the primary action remains visible, and the venue feature stacks cleanly below 760px.

- [ ] **Step 2: Run the Impeccable detector on changed UI files**

Run: `node C:\Users\Martin\.agents\skills\impeccable\scripts\detect.mjs --json src/app.js src/styles.css`

Review findings in context and fix verified issues only.

- [ ] **Step 3: Re-run tests and build after any fixes**

Run: `npm test`

Run: `npm run build`

Expected: all tests pass and the build remains clean.
