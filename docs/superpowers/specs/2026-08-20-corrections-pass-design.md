# HELI Corrections Pass Design

## Status

Approved in chat on 2026-08-20 when the correction-board outline was accepted for full implementation.

## Goal

Apply all six correction groups from `parandused.pdf` while preserving HELI's supplied geometric identity, improving legibility and accessibility, and keeping motion purposeful.

## Binding decisions

- Keep the HELI mark and festival descriptor as one fixed hero lockup. Remove the looping letter-path morph.
- Reduce the date hierarchy and animate a restrained route line behind the lockup instead of animating the identity itself.
- Increase the black header to 72 px and the wordmark to 156 px. Use a 34 px neutral-gray partner ticker and a subordinate 26 px ticket ticker.
- Slow the partner ticker and verify its names against the sponsor manifest.
- Shrink the Open Call control to 104 px. Cycle square, circle, and star shapes only on hover or keyboard focus; reduced-motion users see the square.
- Replace heart map markers with high-contrast square pixels. Every marker keeps a 44 x 44 px interactive target and a visible selected/focus state.
- Put the homepage venue/map composition on the paper-white surface and reveal venue changes with the shared panel transition.
- Add verified sponsor destinations and per-logo optical scaling. Never invent a destination; use an official site or official social profile when no site exists.
- Keep the homepage white-dominant. Render all routed inner pages on a black-led system with white foreground surfaces only where the content object calls for them.
- Use `public/assets/KÄEPAEL.svg` as the primary homepage ticket CTA while retaining the detailed ticket page.
- Reveal freshly rendered routes with the shared panel transition. Set `aria-busy` only until the next animation frame; do not add artificial loading latency.

## Architecture

`src/home.js` remains the homepage composition boundary. `src/site-shell.js` owns the routed-page reveal wrapper, `src/app.js` owns reveal orchestration, `src/home-venue-interactions.js` owns venue-panel transitions, and `src/sponsors.js` remains the authoritative sponsor manifest. Visual rules stay in `src/styles.css`, following the existing fixed 1280 px homepage canvas and responsive utility-page patterns.

The transition uses the transitions.dev `t-panel-slide` contract (`data-open`, transform, opacity, cross-blur, and a reduced-motion guard). Venue panels and routed pages share the CSS contract without adding a motion dependency.

## Accessibility and responsive requirements

- Preserve semantic headings, link destinations, `aria-pressed`, focus visibility, and descriptive marker labels.
- Maintain at least 44 x 44 px map targets.
- Essential content remains visible with `prefers-reduced-motion: reduce`.
- Hover-only motion also responds to `:focus-visible`.
- Sponsor links open in a new tab with `noopener noreferrer` through the existing LogoLoop behavior.
- Validate the homepage at its scaled desktop canvas and utility pages at desktop, tablet, and mobile widths.

## Scope boundary

This pass does not replace deliberate Lorem ipsum content, enable the disabled ticket purchase, or invent the unfinished transport content. Those are separate content/product tasks not requested by the correction board.

## Verification

- Run focused tests after each red-green cycle.
- Run the complete `npm test` suite and `npm run build`.
- Run the Impeccable detector once over changed UI targets.
- Inspect desktop and mobile screenshots, keyboard focus, map switching, sponsor links, reduced-motion styling, and browser console output.

