# HELI homepage interaction and sponsor-loop design

## Goal

Extend the Paper-matched homepage without changing its visual structure. The ticket banners must remain continuously populated, the header navigation gains animated underlines, the map becomes an eleven-marker venue selector, and the sponsor row becomes a React-powered infinite logo loop using the user-supplied `LogoLoop` component and CSS.

## Existing architecture

The site is a Vite application rendered primarily with HTML strings and plain JavaScript. The homepage keeps a fixed 1280 × 2092 Paper canvas and scales it uniformly to the viewport. React is not currently installed.

The sponsor animation will therefore be implemented as a small React island mounted only inside the sponsor section. The rest of the routing and rendering architecture remains unchanged.

## Infinite ticket banners

- Keep the current dark and light 40 px ticket strips.
- Both strips retain `GET YOUR TICKET NOW`, the star artwork, and opposing travel directions.
- Each moving sequence must cover at least the full internal 1280 px ticker width before duplication.
- The duplicated sequence begins immediately after the first sequence, with the same item gap at the seam.
- The light strip must use the same left-anchored geometry as the dark strip; reversing velocity must not right-anchor the oversized track.
- Motion remains linear and uninterrupted. Reduced-motion users receive a static, fully populated strip.

## Header navigation motion

- Each header navigation link receives a one-pixel white underline rendered below the label.
- The underline starts at zero horizontal scale and draws left-to-right over 250 ms using the existing smooth-out motion token.
- It retracts smoothly when hover ends.
- Keyboard focus receives the same underline state without replacing the existing visible focus treatment.
- Link geometry and the Paper header spacing remain unchanged.

## Interactive venue map

### Markers

- Overlay eleven semantic `<button>` markers at the exact square positions exported from Paper.
- The eleven markers map to the existing pink marker and ten white squares.
- The active marker is pink (`#FF90DA`); inactive markers are white.
- Markers receive a slightly enlarged invisible hit target while the visible square remains 10 × 10 px.
- Hover, focus, and pressed states must be visible and keyboard accessible.

### Venue records

Markers one through eight use the existing venue records, in this order:

1. Paavli Kultuurivabrik
2. IDA
3. HALL
4. Kumu
5. D3
6. EKKM
7. Uus Laine
8. FONOTEEK

Markers nine through eleven use explicit temporary records:

9. Tulevane paik 01
10. Tulevane paik 02
11. Tulevane paik 03

The temporary records display “Asukoht lisandub” for their address and a short festival-location placeholder description. They are deliberately represented as future venues rather than fabricated real businesses.

### Venue panel behavior

- Paavli remains selected on first render.
- Activating a marker updates the left-side heading, address/description, and visual tile without navigating away from the homepage.
- Paavli retains its supplied photograph.
- Other real venues and the three future venues use typographic tiles in the existing 200 × 200 px image slot; no unverified venue photography is introduced.
- The panel change uses a compact text-state transition: fade and slight vertical movement, then the new content enters. The whole section does not resize.
- The venue panel is an `aria-live="polite"` region, while each marker exposes its venue name and selected state.

## Sponsor asset library

Create `assets/sponsors/` with one transparent, tightly bounded logo asset per sponsor visible in the supplied Paper sponsor strip.

Asset priority:

1. Official downloadable vector or transparent raster from the sponsor’s official website or brand kit.
2. A reliable public asset whose page identifies the original official source and usage status.
3. If neither exists, an exact crop from the supplied Paper sponsor artwork. Do not redraw, trace, or invent a logo.

All assets are normalized to monochrome black where the provided identity is already monochrome. Aspect ratios remain unchanged. `assets/sponsors/SOURCES.md` records the sponsor name, filename, source URL or “Paper artwork crop,” and any relevant license or provenance note.

## React LogoLoop integration

- Add React and React DOM to the existing Vite application.
- Run `npx shadcn@latest add @react-bits/LogoLoop-JS-CSS` first. If the registry command cannot install into this non-React/non-shadcn project, add the exact user-supplied `LogoLoop` component and CSS locally without changing its animation algorithm or public props.
- Store the component at `src/components/LogoLoop.jsx` and its stylesheet at `src/components/LogoLoop.css`.
- Mount it through a dedicated sponsor-loop module into the homepage sponsor root after the ordinary HTML render completes.
- Unmount the React root before replacing homepage markup or navigating to another route.
- Supply the individual sponsor assets through the component’s `logos` prop.
- Use a horizontal left-moving loop, full width, Paper-appropriate logo height and spacing, no edge fade, no hover pause, and the supplied scale-on-hover behavior only if it does not cause clipping in the 165 px sponsor row.
- Preserve the component’s dynamic copy-count behavior so wide viewports never expose an empty interval.
- Preserve its reduced-motion rules.

## Error handling

- A sponsor image load failure must not stop the remaining loop; the component’s existing image loader already treats errors as completed loads.
- A missing venue record falls back to one of the explicit future-venue records rather than producing blank text.
- If React cannot mount, the sponsor section remains present with a static accessible list of logos.

## Testing

- Renderer tests verify eleven map buttons, eight real venue IDs, three future venue IDs, and the sponsor-loop mount root.
- Venue-selection unit tests verify the selected record and generated panel content.
- Interaction wiring tests verify that clicking a marker updates `aria-pressed`, the active pink state, and the venue panel.
- CSS contract tests verify the gap-free ticker geometry, header underline transition, marker hit targets, panel transition, and reduced-motion behavior.
- Sponsor tests verify the React island imports the exact `LogoLoop` component and supplies individual assets from `assets/sponsors/`.
- Browser verification checks ticker coverage at desktop and mobile widths, all eleven marker buttons, at least three venue changes, header hover/focus underline, sponsor-loop continuity, console errors, and route cleanup.

## Acceptance criteria

- No empty area appears in either ticket banner during a full loop.
- Every header navigation link animates an underline on hover and focus.
- All eleven map markers are interactive and keep their visible Paper positions.
- Selecting any marker updates the left venue panel and active pink marker.
- Eight markers use existing venue information and three use the explicit future-venue placeholders.
- The sponsor row uses individual files from `assets/sponsors/` and the supplied React `LogoLoop` behavior.
- The homepage remains full-width, uniformly scaled, accessible, and free of horizontal overflow.
- The full automated test suite and production build pass, and `design-qa.md` ends with `final result: passed`.
