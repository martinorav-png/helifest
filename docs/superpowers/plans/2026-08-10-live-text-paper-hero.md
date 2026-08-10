# Live-Text Paper Hero Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the raster hero composition with pixel-faithful, selectable HTML text while retaining the supplied HELI mark image and all existing interactions.

**Architecture:** Keep `renderPaperHero()` as the sole hero renderer, but replace its full-section raster image with semantic hero markup. The fixed 1280 × 499 geometry remains in `src/styles.css`, so the existing whole-canvas scaling continues to handle desktop and mobile without a new breakpoint or layout system.

**Tech Stack:** Vite, vanilla JavaScript template rendering, CSS, Node's built-in test runner.

## Global Constraints

- Preserve `.paper-hero` at exactly 1280 × 499 px.
- Keep the supplied HELI mark as the only hero image.
- Render `Tallinna klubiskeene showcase festival`, `16–17`, `oktoober`, the supporting sentence, and both buttons as visible HTML text.
- Keep the current `#programme`, `#tickets`, and `#venues` destinations.
- Keep the center divider absent.
- Preserve the existing uniform Paper-canvas viewport scaling.
- Do not modify venue/map, ticker, sponsor LogoLoop, route, or other section behavior.
- This workspace is not a Git repository. Do not initialize Git; record completion in the existing SDD ledger instead of committing.

---

## File Structure

- Modify `src/home.js`: semantic hero markup and live copy.
- Modify `src/styles.css`: explicit hero typography, positioning, and existing interaction states.
- Modify `tests/home.test.js`: live-text, image-removal, geometry, and accessibility source contracts.
- Create `.superpowers/sdd/2026-08-10-homepage-map-and-logo-loop/task-7-report.md`: red/green and verification evidence.
- Modify `.superpowers/sdd/2026-08-10-homepage-map-and-logo-loop/progress.md`: non-Git completion/review record.

### Task 7: Rebuild the Paper hero with live text

**Files:**
- Modify: `src/home.js`
- Modify: `src/styles.css`
- Modify: `tests/home.test.js`
- Create: `.superpowers/sdd/2026-08-10-homepage-map-and-logo-loop/task-7-report.md`

**Interfaces:**
- Consumes: existing `renderPaperHomepage(copy = {})`, `.paper-hero`, `.paper-programme-hit`, `.paper-hero-ticket`, and `.paper-open-call` contracts.
- Produces: `renderPaperHero(): string` containing one `.paper-hero-mark` image, one `.paper-hero-title` heading, one `.paper-hero-date` block, one `.paper-hero-summary`, and the three existing link destinations.

- [ ] **Step 1: Write failing markup tests**

Add assertions to `tests/home.test.js` that require live hero content and reject the raster composition:

```js
assert.doesNotMatch(markup, /\/assets\/visitor-hero\.png|paper-hero-art/);
assert.match(markup, /<img class="paper-hero-mark" src="\/assets\/helilogo2\.png" alt="HELI">/);
assert.match(markup, /<h1 class="paper-hero-title">Tallinna<br>klubiskeene<br>showcase<br>festival<\/h1>/);
assert.match(markup, /class="paper-hero-date"[^>]*>\s*<span>16–17<\/span>\s*<span>oktoober<\/span>/);
assert.match(markup, /class="paper-hero-summary">Üks pilet kaheks õhtuks avastada Tallinna peidetud pärleid\.<\/p>/);
assert.match(markup, /<a class="paper-programme-hit" href="#programme">Vaata programmi<\/a>/);
assert.match(markup, /<a class="paper-hero-ticket" href="#tickets">Osta pilet<\/a>/);
```

- [ ] **Step 2: Write failing CSS-contract tests**

Replace the obsolete center-mask test with explicit live-layout assertions:

```js
assert.doesNotMatch(css, /\.paper-hero-art|\.paper-hero::after/);
assert.match(css, /\.paper-hero-mark\s*\{[^}]*position:\s*absolute;[^}]*left:\s*32px;[^}]*top:\s*145px;[^}]*width:\s*245px;/s);
assert.match(css, /\.paper-hero-title\s*\{[^}]*position:\s*absolute;[^}]*left:\s*300px;[^}]*font-family:\s*'Stack Sans Headline'/s);
assert.match(css, /\.paper-hero-date\s*\{[^}]*position:\s*absolute;[^}]*left:\s*704px;[^}]*font-family:\s*'Stack Sans Headline'/s);
assert.match(css, /\.paper-hero-summary\s*\{[^}]*position:\s*absolute;[^}]*left:\s*705px;/s);
assert.match(css, /\.paper-programme-hit[^}]*color:\s*#000000;/s);
```

- [ ] **Step 3: Run the focused test and confirm RED**

Run:

```powershell
node --test tests/home.test.js
```

Expected: failures because `visitor-hero.png` and `.paper-hero-art` still exist and the live hero classes are absent.

- [ ] **Step 4: Replace the raster hero markup**

Implement this structure in `renderPaperHero()`:

```js
export function renderPaperHero() {
  return `<section class="paper-hero" aria-labelledby="paper-hero-title"><img class="paper-hero-mark" src="/assets/helilogo2.png" alt="HELI"><h1 class="paper-hero-title" id="paper-hero-title">Tallinna<br>klubiskeene<br>showcase<br>festival</h1><p class="paper-hero-date" aria-label="16–17 oktoober"><span>16–17</span><span>oktoober</span></p><p class="paper-hero-summary">Üks pilet kaheks õhtuks avastada Tallinna peidetud pärleid.</p><a class="paper-programme-hit" href="#programme">Vaata programmi</a><a class="paper-hero-ticket" href="#tickets">Osta pilet</a><a class="paper-open-call" href="#venues" aria-label="Open call"><span>Open call</span></a></section>`;
}
```

- [ ] **Step 5: Replace image-dependent hero CSS**

Remove `.paper-hero-art` and `.paper-hero::after`. Add positioned live elements matching the Paper source:

```css
.paper-hero { background: #f7f7f5; }
.paper-hero-mark {
  position: absolute;
  left: 32px;
  top: 145px;
  width: 245px;
  height: auto;
}
.paper-hero-title {
  position: absolute;
  left: 300px;
  top: 178px;
  margin: 0;
  color: #000;
  font-family: 'Stack Sans Headline', Arial, sans-serif;
  font-size: 44px;
  font-weight: 500;
  letter-spacing: -2.2px;
  line-height: .79;
}
.paper-hero-date {
  position: absolute;
  left: 704px;
  top: 168px;
  margin: 0;
  color: #000;
  font-family: 'Stack Sans Headline', Arial, sans-serif;
  font-size: 103px;
  font-weight: 500;
  letter-spacing: -5.8px;
  line-height: .82;
}
.paper-hero-date span { display: block; white-space: nowrap; }
.paper-hero-summary {
  position: absolute;
  left: 705px;
  top: 370px;
  width: 300px;
  margin: 0;
  color: #000;
  font-family: Inter, Arial, sans-serif;
  font-size: 16px;
  font-weight: 500;
  line-height: 18px;
}
```

Keep the current button/open-call geometry, remove the generated `paper-programme-hit::after` content, set the programme link's visible `color: #000000`, and retain existing hover/focus transitions.

- [ ] **Step 6: Run focused tests and confirm GREEN**

Run:

```powershell
node --test tests/home.test.js tests/sponsors.test.js
```

Expected: all focused tests pass with no warnings.

- [ ] **Step 7: Run regression and production verification**

Run:

```powershell
npm test
npm run build
```

Expected: full suite passes and Vite completes a production build.

- [ ] **Step 8: Verify in the in-app browser**

At `http://127.0.0.1:4173/#home`:

1. Capture the hero at 1280 px width and compare it with `tmp/paper-finale-source.png`.
2. Capture the page at 390 × 844 and confirm uniform scaling, no horizontal overflow, and no text/image collisions.
3. Confirm the hero contains no `visitor-hero.png`, the heading and date are selectable text, and all three hero links work.
4. Hover both rectangular buttons and verify black/white inversion.
5. Check browser console warnings/errors.
6. Record evidence in `design-qa.md`; `final result` must be exactly `passed` before handoff.

- [ ] **Step 9: Record the non-Git checkpoint**

Write `task-7-report.md` with RED/GREEN output, full-suite/build results, browser evidence, and self-review. Append the task status and reviewer result to the existing SDD progress ledger. Do not initialize a repository.

## Plan self-review

- Spec coverage: every content, layout, interaction, responsiveness, and verification requirement maps to Task 7.
- Placeholder scan: no TBD/TODO or unspecified implementation step remains.
- Interface consistency: all class names in markup, CSS, tests, and browser QA match exactly.
- Scope: one independently testable hero task; no unrelated subsystem edits.
