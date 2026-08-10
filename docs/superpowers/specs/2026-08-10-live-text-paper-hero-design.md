# Live-text Paper hero design

## Goal

Replace the rasterized hero composition with accessible, selectable HTML text while preserving the approved Paper artboard geometry. The HELI mark remains a supplied image. The hero must continue to scale uniformly with the existing 1280 px Paper canvas.

## Approaches considered

1. **Faithful live-text reconstruction — selected.** Keep the exact two-column Paper composition and rebuild every text element in HTML. This preserves the chosen visual target and improves accessibility and text rendering.
2. **Responsive mobile reflow — rejected.** Stack and re-typeset the hero below a breakpoint. This improves small-screen reading size but changes the approved Paper composition and the site's established uniform-scaling behavior.
3. **Raster hero with hidden/overlaid text — rejected.** Retain the screenshot and add duplicate text for accessibility. This risks doubled content, brittle alignment, and fails the request to use actual visible text.

## Content and semantics

- Keep the supplied black HELI mark as the only hero image, using `assets/helilogo2.png` or the equivalent existing transparent HELI asset.
- Render `Tallinna klubiskeene showcase festival` as the primary live heading, with deliberate line breaks matching Paper.
- Render the date as live display text: `16–17` above `oktoober`.
- Render the supporting sentence as live text: `Üks pilet kaheks õhtuks avastada Tallinna peidetud pärleid.`
- Keep `Vaata programmi` and `Osta pilet` as real links with their current destinations and inverse hover/focus animation.
- Keep `Open call` as a real circular link with its existing live text and interaction.
- The removed center divider must not return.

## Layout

- Preserve `.paper-hero` at 1280 × 499 px inside the fixed Paper canvas.
- Use two positioned content regions matching the current source composition: HELI mark and festival descriptor on the left; date, supporting sentence, and buttons on the right.
- Match the existing Paper typography using the already bundled Stack Sans and Inter faces. No new font download is required.
- Preserve the existing Paper background, black typography, button borders, and open-call treatment.
- Keep the current whole-canvas viewport scaling on desktop and mobile; do not introduce a new mobile stack.

## Implementation boundary

- Replace `.paper-hero-art` output in `renderPaperHero()` with semantic HTML elements and the HELI mark image.
- Replace image-dependent CSS with explicit hero layout styles. Retain current link classes where practical to avoid behavior regressions.
- Do not change map, venue, ticket ticker, sponsor LogoLoop, route behavior, or overall section heights.

## Testing and verification

- Add source-contract tests proving the raster `visitor-hero.png` is absent from homepage output and all required live text is present.
- Assert the HELI mark remains an image and buttons retain their routes.
- Assert the hero center divider is absent.
- Run focused tests, the full suite, and the production build.
- Capture the 1280 px desktop hero and 390 px responsive view in the in-app browser.
- Compare the rendered hero against the Paper source at the same viewport. The build passes only with no actionable P0/P1/P2 differences, no overlap, no broken assets, and no console errors.

## Self-review

- No placeholders or unresolved decisions remain.
- The selected approach matches the user's approved recommendation.
- Scope is limited to the hero implementation and its tests/QA.
- The existing non-Git workspace means this document cannot be committed; it is saved alongside the other approved design specs.
