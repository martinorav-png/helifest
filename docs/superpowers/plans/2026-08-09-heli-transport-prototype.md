# HELI Transport-led Prototype Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a runnable, responsive HELI Festival prototype that makes the festival shuttle and connected venues the primary discovery system.

**Architecture:** A dependency-light static single-page application in semantic HTML, CSS, and JavaScript. One data module models WordPress-ready entities; page rendering and interactive state remain separate from data, allowing later API replacement.

**Tech Stack:** HTML5, CSS custom properties, vanilla JavaScript, CSS media queries, local font-face replacement slot.

## Global Constraints

- Preserve supplied HELI visual identity and use Stack Sans Notch when font files are available.
- Use only confirmed dates, ticket price, and venue names; label invented programme details as illustrative.
- Ensure keyboard operation, focus visibility, high contrast, and reduced-motion support.
- No gradients, glassmorphism, decorative icons, card-grid scaffolding, or stock festival imagery.

---

### Task 1: Establish the app shell and structured sample data

**Files:**
- Create: `index.html`
- Create: `src/data.js`
- Create: `src/app.js`
- Create: `src/styles.css`
- Modify: `package.json`

**Interfaces:**
- Produces `festivalData` with `venues`, `artists`, `events`, and `shuttleRoute` collections.
- Produces `renderApp(view, state)` to mount an accessible view into `#app`.

- [ ] **Step 1: Write a smoke test checklist**

Verify on first load that the document has one `main` landmark, a navigation landmark, a route-aware homepage heading, and a functional programme link.

- [ ] **Step 2: Build the semantic shell and data contract**

Create `index.html` with `<header>`, `<nav aria-label="Primary">`, `<main id="app">`, and a footer. Export data shaped like:

```js
export const festivalData = {
  venues: [{ id: 'ida', name: 'IDA', address: 'Telliskivi tn 60a-5' }],
  artists: [{ id: 'artist-a', name: 'Programme detail forthcoming', status: 'Illustrative placeholder' }],
  events: [{ id: 'fri-01', date: '2026-10-16', venueId: 'ida', artistId: 'artist-a', start: '20:00', illustrative: true }],
  shuttleRoute: { access: 'Festival pass required', stops: ['IDA'] }
};
```

- [ ] **Step 3: Add the first render and run locally**

Render the home view through `renderApp('home', {})`; run a static server and confirm no console errors or missing structural landmarks.

### Task 2: Build transport-led browsing and all required content views

**Files:**
- Modify: `src/app.js`
- Modify: `src/styles.css`

**Interfaces:**
- Consumes `festivalData` and navigation state.
- Produces routes for `home`, `programme`, `venue`, `artist`, `tickets`, `transport`, and `information`.

- [ ] **Step 1: Define expected interaction checks**

Confirm date, venue, and category filters alter programme rows; a combination with no matches announces an empty result; links open the corresponding venue or artist view; and browser hash links restore the requested view.

- [ ] **Step 2: Render visitor views and route map**

Use `location.hash` for routes such as `#programme`, `#venue/ida`, and `#artist/artist-a`. Keep the programme in readable rows:

```html
<article class="programme-row">
  <time datetime="2026-10-16T20:00">20:00</time>
  <a href="#artist/artist-a">Programme detail forthcoming</a>
  <a href="#venue/ida">IDA</a>
</article>
```

- [ ] **Step 3: Implement filters and states**

Use form controls with labels and a live result count. On zero matches render: `No illustrative entries match these filters. Clear filters.` Provide an enabled `Clear filters` button.

- [ ] **Step 4: Verify the interaction checks**

Use the local browser to exercise all route links, one populated filter state, one empty filter state, and the clear action.

### Task 3: Establish visual system, responsive composition, and quality passes

**Files:**
- Modify: `src/styles.css`
- Modify: `src/app.js`

**Interfaces:**
- Consumes the rendered route and programme elements.
- Produces desktop and mobile layouts plus reduced-motion-safe behaviours.

- [ ] **Step 1: Create the visual regression checklist**

At desktop and 390px widths, confirm: the HELI mark and date are recognizable; route progression is visible; type never overflows; schedule rows remain scannable; all controls expose focus; and ticket action is reachable.

- [ ] **Step 2: Implement tokens and responsive grid**

Declare the brand tokens and fallback face:

```css
@font-face { font-family: 'Stack Sans Notch'; src: url('/assets/StackSansNotch.woff2') format('woff2'); font-display: swap; }
:root { --paper: #f7f7f5; --ink: #080808; --muted: #6e6e6a; --rule: #bdbdb8; }
```

Use desktop grid columns for aligned route rails and a single-column mobile layout with horizontal date controls. Respect motion reduction through `@media (prefers-reduced-motion: reduce)`.

- [ ] **Step 3: Perform critique pass one and fix issues**

Inspect desktop and mobile renders against source fidelity, schedule readability, hierarchy, focus, density, and missing-image/long-name states. Fix all critical or major findings before the second pass.

- [ ] **Step 4: Perform critique pass two and final verification**

Repeat the same inspection after fixes. Run the Impeccable detector on the changed UI files, inspect the final desktop/mobile renders, and record remaining limitations (notably the missing licensed font files).
