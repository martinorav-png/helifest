# HELI Homepage Paper Pixel-Match Design

## Objective

Replace the current HELI homepage entirely with a pixel-for-pixel implementation of the Paper artboard named `finale` at 1280 × 2092 CSS pixels. The Paper artboard and its exported JSX, computed styles, typefaces, and original image fills are the sole visual authority.

## Scope

- Replace the homepage header, announcement bands, hero, venue feature, ticket call to action, sponsor strip, and closing gradient.
- Preserve the existing application shell, hash routing, programme, venue, artist, ticket, transport, and information views.
- Preserve working homepage navigation and calls to action while positioning them over the matching visual regions.
- Do not introduce a separate mobile layout. At viewports narrower than 1280px, preserve the complete 1280px composition and scale it uniformly to the available width.
- Do not add, remove, restyle, or reinterpret visible homepage content beyond what appears in the Paper artboard.

## Source Truth

- Paper file: `HELIFEST`
- Paper page: `Page 1`
- Artboard: `finale`
- Artboard dimensions: 1280 × 2092
- Supplied React/CSS export: `C:\Users\Martin\.codex\attachments\73cba424-1264-451e-ade2-878aba079c17\pasted-text.txt`
- MCP evidence captured: full-artboard screenshot, JSX export, computed styles, font availability, tree structure, and original image fills.

## Visual Structure

1. A 60px black header with the white HELI wordmark, five uppercase navigation links, and 60px horizontal padding.
2. A 40px dark-gray ticket ticker followed by a 40px white reverse ticker, each using repeated 20px star marks and 14px Stack Sans Headline text.
3. A 499px hero built from the exact exported hero image, with the black circular open-call badge and the second ticket button layered at their Paper coordinates.
4. A 522px venue section containing the Paavli title and placeholder body copy, the exact Paavli night photograph crop, and the Paper pixel-map construction with its white and pink details and triangular marker.
5. A right-aligned 164px ticket call-to-action band.
6. A 165px sponsor strip using the exact exported sponsor image and Paper crop positions.
7. The remaining artboard height filled by the exact off-white-to-transparent/black closing gradient.

## Assets and Typography

- Reuse the existing local `visitor-hero.png`, `paavli-night.png`, `heli-sponsors.png`, HELI logo, star assets, and Stack Sans Notch font where they match the MCP-exported originals.
- Add or derive no substitute artwork. Visible source imagery must remain raster or vector assets as supplied by Paper.
- Use Stack Sans Headline/Stack Sans Notch and Inter at the exact exported weights, sizes, line heights, and tracking. Where Stack Sans Headline is unavailable as a local webfont, use the locally available Stack Sans Notch variable font only for live overlay text; preserve rasterized typography already embedded in source images.
- Use Paper colors exactly: `#000000`, `#FFFFFF`, `#505B5B`, `#FF90DA`, and the exported off-white gradient.

## Implementation Boundaries

- Rewrite `src/home.js` around focused render functions for the Paper homepage sections.
- Replace the homepage-specific CSS in `src/styles.css`; remove prior homepage reference-pass overrides so cascade order cannot create drift.
- Update `src/app.js` only where necessary to mount the replacement homepage and header without changing other routes.
- Keep semantic links and accessible labels for the navigation, ticker regions, open-call badge, and ticket/programme actions.
- Use local assets only; do not hotlink Paper file assets.

## Scaling Behavior

- The authored homepage canvas remains exactly 1280px wide and 2092px high.
- At viewport widths of 1280px or greater, render at 1:1 scale.
- At narrower widths, scale the entire composition uniformly by `viewport width / 1280` from the top center and reserve the correspondingly scaled height so no content is cropped or reflowed.
- The page must not introduce horizontal scrolling at supported viewport widths.

## Testing and Acceptance

- Add renderer tests for the replacement section structure, exact local assets, accessible link targets, and absence of the previous homepage structures.
- Run the complete existing Node test suite.
- Render at a 1280px-wide viewport and compare against the Paper screenshot at matching dimensions.
- Render at a 390px-wide viewport and verify that the complete 1280px composition is uniformly scaled without reflow or clipping.
- Verify navigation and primary calls to action.
- Check browser console output for errors.
- Save the final evidence and comparison history in `design-qa.md`; handoff requires `final result: passed` with no actionable P0, P1, or P2 mismatch.

## Out of Scope

- Redesigning or updating any non-homepage view.
- Changing festival content, venue data, translations, or application routing beyond homepage link wiring.
- Creating a new mobile composition.
- Publishing or deploying the project.
