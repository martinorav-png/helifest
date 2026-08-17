# HELI Stitch Multipage Platform Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Extend the approved HELI homepage into a routed, responsive seven-screen festival platform using the downloaded Stitch screens as structural references while preserving the existing HELI visual system.

**Architecture:** Keep the existing Vite/React-island architecture and add a small hash router around focused string-rendered page modules. Shared shell, programme rows, entity links, and interaction binding live in dedicated modules; page-specific renderers consume the existing structured festival data. The homepage remains the current fixed Paper composition, while utility pages use responsive layouts.

**Tech Stack:** Vite 8, JavaScript ES modules, semantic HTML renderers, CSS, existing React islands for LogoLoop and PixelTransition, Node test runner.

## Global Constraints

- The current homepage remains visually unchanged and is the primary visual authority.
- Stack Sans Notch from `assets/StackSansNotch-VariableFont_wght.ttf` is mandatory for identity-led display text.
- Use `#000000`, `#F7F7F5`, white, neutral gray, and functional `#FF90DA`; no decorative gradients, rounded cards, pills, glass, or shadows.
- Programme information is the central visitor tool; rows are ruled data structures, never cards.
- Estonian copy must use confirmed facts only and clearly mark unannounced details.
- Every new screen has a deliberate 1280px desktop and 390px mobile structure.
- New behavior is implemented test-first; every test must be observed failing for the intended missing behavior before production code is added.
- Run Humanizer on substantial copy surfaces and Impeccable critique passes during implementation, then a final Impeccable audit.

---

### Task 1: Routed shared shell and page contracts

**Files:**
- Create: `src/router.js`
- Create: `src/site-shell.js`
- Create: `src/pages.js`
- Modify: `src/app.js`
- Modify: `src/home.js`
- Test: `tests/router.test.js`
- Test: `tests/site-shell.test.js`

**Interfaces:**
- Produces: `parseRoute(hash) -> { name, id?, query }`, `routeHref(name, id?, query?) -> string`, `renderSiteShell({ active, content, tone }) -> string`, and `pageRenderers` keyed by route name.
- Consumes: existing `renderPaperHomepage`, venue-map binder, sponsor island, and venue pixel island.

- [ ] Write failing route tests for `#home`, `#programme`, `#venues`, `#venue/paavli`, `#artist/artist-01`, `#tickets`, `#transport`, and `#about`, including unknown-route fallback.
- [ ] Run `node --test tests/router.test.js` and confirm failures are caused by missing `src/router.js`.
- [ ] Implement literal route parsing and href construction without a routing dependency.
- [ ] Run the route test and confirm it passes.
- [ ] Write failing shell tests asserting semantic header navigation, active `aria-current="page"`, Estonian labels, skip-link destination, and square mobile menu control.
- [ ] Run `node --test tests/site-shell.test.js` and confirm failure is caused by the missing shell renderer.
- [ ] Implement the shared black header, compact ticker rail, content wrapper, and restrained footer.
- [ ] Replace homepage header buttons with real route anchors while preserving their classes and exact visible geometry.
- [ ] Update `src/app.js` to render by hash, clean up homepage islands before route changes, bind utility-page interactions, and move focus to `#page-title` after navigation.
- [ ] Run both task tests and the existing homepage tests; keep the homepage contract green.

### Task 2: Structured content and humanized copy

**Files:**
- Create: `src/content.js`
- Modify: `src/data.js`
- Modify: `src/i18n.js`
- Test: `tests/content.test.js`

**Interfaces:**
- Produces: `siteCopy`, `programmeEntries`, `venueDetails`, `artistDetails`, `ticketFacts`, `transportFacts`, `faqItems`.
- Consumes: existing `festivalData`, `paperVenueRecords`, and confirmed brief facts.

- [ ] Write failing tests that require natural Estonian copy, confirmed EUR15 and 16-17 October facts, explicit pending labels, and no fabricated external contact or policy facts.
- [ ] Run `node --test tests/content.test.js`; confirm missing exports cause the failure.
- [ ] Build content records from the supplied brief and Stitch structures. Use `Artist avalikustatakse peagi`, `Väljumisajad lisanduvad`, and `Info lisandub` instead of synthetic factual claims.
- [ ] Repair mojibake in live Estonian strings touched by the new screens.
- [ ] Humanizer pass: remove generic promotional phrases, stacked slogan triads, vague claims, chatbot tone, and overly symmetrical empty-state language.
- [ ] Run the content tests and read every visitor-facing paragraph aloud for tone and factual restraint.

### Task 3: Programme screen and shared programme row

**Files:**
- Create: `src/components/programme-row.js`
- Create: `src/views/programme-view.js`
- Create: `src/utility-interactions.js`
- Modify: `src/programme.js`
- Modify: `src/styles.css`
- Test: `tests/programme-view.test.js`
- Test: `tests/utility-interactions.test.js`

**Interfaces:**
- Produces: `renderProgrammeRow(entry, context)`, `renderProgrammeView(state)`, `bindUtilityInteractions(root, navigate)`.
- Consumes: `filterEvents`, `programmeEntries`, `routeHref`, and shared site shell.

- [ ] Write a failing renderer test for the oversized `AJAKAVA` masthead, date switcher, venue/category filters, chronological ruled rows, artist/venue links, illustrative labels, and no-results reset action.
- [ ] Run `node --test tests/programme-view.test.js` and confirm the missing view causes failure.
- [ ] Implement the programme row and desktop/mobile schedule markup with no card wrappers or colored genre chips.
- [ ] Run the renderer test and confirm it passes.
- [ ] Write failing interaction tests for date switching, combined filters, result count, clear filters, empty state, and URL query synchronization.
- [ ] Run `node --test tests/utility-interactions.test.js` and confirm missing bindings cause failure.
- [ ] Implement filters with native buttons/checkboxes, `aria-pressed`, a mobile filter panel, and context-preserving entity links.
- [ ] Add responsive CSS using a 12-column desktop and four-column mobile grid, tabular times, sticky mobile date rail, 44px targets, and visible focus.
- [ ] Impeccable pass: compare the live screen with `tmp/stitch-reference/programme.png`; correct hierarchy, row density, filter prominence, and below-fold rhythm while removing Stitch boilerplate.
- [ ] Humanizer pass on filter summaries, empty state, and pending artist labels.

### Task 4: Venues index, venue detail, and artist detail

**Files:**
- Create: `src/views/venues-view.js`
- Create: `src/views/venue-detail-view.js`
- Create: `src/views/artist-detail-view.js`
- Modify: `src/utility-interactions.js`
- Modify: `src/styles.css`
- Test: `tests/entity-views.test.js`

**Interfaces:**
- Produces: `renderVenuesView(activeId)`, `renderVenueDetailView(id, context)`, `renderArtistDetailView(id, context)`.
- Consumes: `paperVenueRecords`, galleries, programme row, artist/venue content, and route context query.

- [ ] Write failing tests for the black venues/map split, eight real venue links, pink active marker, list fallback, Paavli detail metadata/schedule, artist appearance facts, and return-to-context links.
- [ ] Run `node --test tests/entity-views.test.js` and confirm missing renderers cause failure.
- [ ] Implement the venues view with a list-first mobile mode, accessible map marker buttons, and inline selected panel.
- [ ] Implement Paavli as the representative venue detail using supplied photography, address, pending accessibility copy, filtered programme rows, and locator map.
- [ ] Implement artist detail using schedule context, an image or strict typographic placeholder, biography, appearance facts, and related programme rows.
- [ ] Reuse the PixelTransition island for venue image changes where the DOM contract permits; preserve a static image fallback.
- [ ] Run the entity tests.
- [ ] Impeccable pass against `venues.png`, `venue-detail.png`, and `artist-detail.png`: remove fake cartographic boilerplate, generic metadata labels, and layout drift; keep asymmetric scale, hard rules, and HELI route language.
- [ ] Humanizer pass on venue descriptions, artist biography, return links, and missing-content states.

### Task 5: Tickets, transport, and about/FAQ screens

**Files:**
- Create: `src/views/tickets-view.js`
- Create: `src/views/transport-view.js`
- Create: `src/views/about-view.js`
- Modify: `src/utility-interactions.js`
- Modify: `src/styles.css`
- Test: `tests/information-views.test.js`

**Interfaces:**
- Produces: `renderTicketsView()`, `renderTransportView(activeStop)`, `renderAboutView()`.
- Consumes: confirmed ticket/transport facts, venue locations, FAQ data, shared shell, sponsor manifest.

- [ ] Write failing tests for the EUR15 offer, two-night/venue/bus facts, pending checkout state, three-step wristband flow, transport pass requirement, pending departures, accessible stop list, concept copy, pending policies, and FAQ accordions.
- [ ] Run `node --test tests/information-views.test.js` and confirm missing views cause failure.
- [ ] Implement Tickets with the dominant `15 EUR`, square purchase state, factual three-step wristband flow, and ruled FAQ rows.
- [ ] Implement Transport with the black pixel map, white/pink heart markers, list equivalent, selected stop state, and `Väljumisajad lisanduvad` rather than fabricated times.
- [ ] Implement About with source-faithful concept copy, practical pending information, accessible native disclosure rows, monochrome partner strip, and restrained footer.
- [ ] Run the information-view tests.
- [ ] Impeccable pass against `tickets.png`, `transport.png`, and `about.png`: preserve the useful structures but replace generic legal/contact filler, fake map controls, and non-Notch headings.
- [ ] Humanizer pass on purchase guidance, shuttle explanation, concept statement, safety/accessibility placeholders, and FAQ answers.

### Task 6: Responsive hardening, motion, and full verification

**Files:**
- Modify: `src/styles.css`
- Modify: all new view/component modules as findings require
- Create: `docs/impeccable/2026-08-12-multipage-audit.md`
- Test: all `tests/*.test.js`

**Interfaces:**
- Consumes all completed views and shared interactions.
- Produces a verified desktop/mobile implementation and written audit.

- [ ] Run the complete suite with `npm test`; fix only implementation defects revealed by tests.
- [ ] Run `npm run build` and confirm production output succeeds.
- [ ] Start the Vite server and verify all routes at 1280px and 390px with browser screenshots.
- [ ] Exercise programme filters, mobile navigation, venue selection, entity return links, FAQ disclosure, and transport stop selection with keyboard and pointer input.
- [ ] Check for blank pages, error overlays, broken images, horizontal overflow, illegible text, inaccessible focus, and essential motion under reduced-motion preference.
- [ ] Run the Impeccable mechanical detector once: `node C:\Users\Martin\.agents\skills\impeccable\scripts\detect.mjs --json src/app.js src/site-shell.js src/views src/styles.css`.
- [ ] Perform the final Impeccable audit across source fidelity, typography, hierarchy, responsive behavior, accessibility, performance, content density, edge cases, and slop-language bans. Record findings and resolutions in the audit document.
- [ ] Perform the final Humanizer audit by asking what still sounds generated, revising it, and recording the remaining intentional placeholders.
- [ ] Re-run `npm test` and `npm run build` after all audit fixes.
