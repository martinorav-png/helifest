# HELI Festival - Master Google Stitch Prompt

## Role and objective

Act as a senior digital art director, information architect, and product designer. Create seven new responsive website screens for HELI Festival, a two-night showcase of Tallinn's independent club scene on 16-17 October 2026.

The supplied homepage screenshot is already approved and implemented. Do not redesign it. Use it as the visual source of truth and extend its design language into the rest of the site.

Generate these seven screens:

1. Programme / schedule
2. Venues index
3. Venue detail
4. Artist detail
5. Tickets
6. Transport / locations
7. About / contact / FAQ

For every screen, create a deliberate desktop composition and a deliberate mobile composition. The mobile design must reorganize information for scanning and touch; it must not be a uniformly scaled desktop image.

## Attachments and source hierarchy

Study all attached references before generating anything. Use this priority order if sources appear to conflict:

1. `current-homepage-reference.png` - primary authority for the current digital visual system, density, proportion, tone, controls, and component styling.
2. `HELI-Festival-2026-osalejate-ettepanek.pdf` - primary authority for the identity, concept, audience, event facts, programme philosophy, transport concept, ticket facts, typography, and supplied logo applications.
3. `StackSansNotch-VariableFont_wght.ttf` - mandatory production typeface for all identity-led display typography. This supplied font must be loaded and used; it is not an optional reference.
4. `figjam-Sisend.png` - supporting project inputs and visual identity overview.
5. `figjam-Insp.png` - supporting references for editorial density, schedules, grids, asymmetry, and image treatment. Use these as principles, not as layouts to copy.
6. `figjam-Flow.png` - supporting visitor journey and information architecture.

Do not invent a new identity. Do not reinterpret HELI as a colorful electronic-music brand, a generic nightlife site, a SaaS product, or a trendy event template.

## Festival concept and audience

HELI is a two-day showcase festival connecting Tallinn's distinctive clubs, bars, cultural spaces, artists, DJs, promoters, collectives, and audiences. It exists to make the city's music landscape easier to enter, help visitors discover unfamiliar artists and venues, and create collaboration rather than competition between independent locations.

Primary audience:

- Tallinn residents aged roughly 20-40
- People who attend concerts, clubs, and cultural events
- Fans of electronic music, live music, alternative culture, and DJ culture
- Creative-industry workers, students, and young professionals

Secondary audience:

- Venues, bars, and cultural centers
- Artists and DJs
- Promoters, labels, platforms, and collectives

The visitor's central journey is:

`Homepage -> Programme -> Tickets -> Transport / locations -> About / contact`

Venue and artist details should open naturally from programme entries and allow the visitor to return to the exact schedule context they came from.

## Confirmed facts and content discipline

Use these facts exactly:

- Event: HELI Festival
- Description: Tallinna klubiskeene showcase festival
- Dates: 16-17 October 2026
- Ticket: EUR 15 for both nights and all participating venues
- Ticket holders can use the festival buses
- Ticket sales and checks can happen at venue doors and on the buses
- The ticket is a wristband
- The brief proposes 3-4 buses rotating between participating venues throughout the evening
- Bus access is for festival-pass holders
- Movement between venues is part of the festival experience

Use Estonian as the primary visible interface language, matching the homepage. Use concise, natural Estonian labels such as `Ajakava`, `Piletid`, `Transport`, `Meist`, `FAQ`, `Vaata programmi`, and `Osta pilet`. An `ET / EN` language control may be included where it fits the interface, but do not create a separate language-heavy header.

Do not invent confirmed artists, set times, transport departure times, age limits, accessibility facts, safety policies, external URLs, email addresses, or phone numbers. When information is not final, use clearly labeled editorial placeholders such as `Artist avalikustatakse peagi`, `Aeg täpsustamisel`, or `Info lisandub`. Placeholder data must still demonstrate a realistic dense layout.

Known venue records available in the project include:

- Paavli Kultuurivabrik - Paavli tn 7
- IDA - Telliskivi tn 60a-5
- HALL - Peetri tn 6
- KUMU - Weizenbergi 34
- D3 - Telliskivi 62/2
- EKKM - Kursi tn 5
- Uus Laine - Vana-Kalamaja tn 1
- FONOTEEK - Telliskivi tn 62

The broader identity material also contains additional partner/venue marks. Do not imply that every sponsor is a confirmed programme venue unless the source identifies it as one.

## The visual DNA to extend from the homepage

### Overall character

The site should feel like an independent cultural publication, a wayfinding system, and a city-night programme at the same time. It is direct, slightly severe, playful through scale and movement, and confident enough to leave large areas empty. The design is not polished through decoration; it is polished through exact typography, alignment, rhythm, contrast, and purposeful irregularity.

Use the reference homepage as evidence of these core traits:

- A black header with a compact white HELI wordmark and widely spaced uppercase navigation
- Two narrow, full-width announcement tickers directly under the header
- An off-white hero dominated by the oversized geometric HELI mark, compact stacked festival descriptor, and enormous date
- A rotated black square for the open call rather than a round badge or pill
- Very small, square, outlined CTA controls beside huge typography
- A black venue section where white text, a small pixel-transition photograph, and a white pixel map share an asymmetric composition
- White and pink pixel-heart map markers; pink is a functional accent, not a decorative palette
- A monochrome sponsor strip with oversized logos moving horizontally
- A long off-white-to-black closing fade that creates theatrical negative space
- Hard boundaries, square corners, flat surfaces, no card shadows, and almost no conventional container chrome

### Color system

Use a deliberately narrow palette:

- Deep black: `#000000` for headers, inverted sections, text, and strong rules
- Warm/off white: approximately `#F7F7F5` for primary page surfaces
- Pure white: `#FFFFFF` for reversed text and high-contrast graphic marks
- Supporting neutral gray: approximately `#6E6E6A`
- Fine rule gray: approximately `#BDBDB8`
- One functional accent: hot pink approximately `#FF90DA`, reserved for active map markers, selected states, focus indicators, route emphasis, or one critical highlight

Do not introduce gradients except the established off-white-to-black atmospheric fade or a closely related section transition. No purple-blue gradients, neon rainbow palettes, glass effects, soft drop shadows, beige lifestyle palettes, or multi-color genre tags.

### Typography

**Stack Sans Notch is mandatory and non-negotiable.** Load the supplied `StackSansNotch-VariableFont_wght.ttf` file and use it for all identity-led display typography, including major page titles, festival dates, high-impact statements, venue and artist mastheads, and prominent numeric treatments. Do not substitute, approximate, recreate, or replace Stack Sans Notch with another geometric grotesk. Do not proceed with a fallback font for these elements.

If the design environment cannot preview an uploaded custom font, keep every relevant text layer explicitly assigned to `Stack Sans Notch` and include the supplied font file in the generated project through `@font-face`. A preview limitation is not permission to change the typeface. Preserve the supplied HELI logo as artwork rather than typesetting it.

Use Manrope for navigation, labels, UI, and body copy. Stack Sans Notch must be used for display dates and high-impact section titles. Use tabular numerals for programme times and transport times, using Stack Sans Notch where those numerals become a dominant identity element.

Required implementation contract:

```css
@font-face {
  font-family: "Stack Sans Notch";
  src: url("/assets/StackSansNotch-VariableFont_wght.ttf") format("truetype");
  font-weight: 200 700;
  font-style: normal;
  font-display: swap;
}
```

Set identity-led display styles to `font-family: "Stack Sans Notch"` with no visually similar replacement ahead of it. A system sans-serif may appear only as a technical last-resort CSS fallback after the supplied family, never as the intended rendered design.

Typography must carry the composition:

- Display scale: very large, tightly tracked, often occupying 35-70% of a screen width
- Display line-height: compact, roughly 0.78-0.92 depending on the face
- Body text: compact but readable, usually 15-18px desktop and 15-17px mobile
- Labels and utility text: often 10-14px, uppercase or semibold
- Schedule times: prominent, tabular, aligned consistently down the page
- Avoid centered marketing headings followed by centered paragraphs
- Avoid generic `hero headline + subheading + large rounded button` composition

### Grid and spacing

Use a 12-column desktop grid and a 4-column mobile grid. The grid should be felt through alignments and collisions, not drawn as a decorative overlay.

Desktop guidance:

- Reference canvas: 1280px wide
- Header height: approximately 60px
- Ticker height: approximately 40px each
- Major page gutters: 32-60px depending on the composition
- Dense informational rows may run nearly full width
- Use strong horizontal rules to structure schedules and lists
- Alternate compact dense areas with intentionally large negative-space areas

Mobile guidance:

- Design around 390px width
- Use 16-20px outer gutters
- Maintain 44px minimum touch targets even if the visible control is visually smaller
- Let large display type crop or wrap deliberately; never shrink it into timid headings
- Stack information in a reading order that preserves time, artist, venue, and action
- Sticky date and filter controls are acceptable if they remain compact

### Shape and component language

- Square corners by default
- Thin 1px rules, occasionally 2px for major separation
- Rectangular outlined buttons with text centered exactly
- Hover/active state: black-white inversion or pink functional accent
- No rounded cards, pills, floating bubbles, shadowed modals, glossy controls, or default Material components
- Use rotated squares sparingly for campaign calls, never for ordinary controls
- Use the HELI star and pixel-heart motifs only where they communicate repetition, movement, venue location, selection, or a ticket route

### Photography and imagery

Venue photography may introduce warm, dark, or saturated real-world color, but images must sit inside a strict monochrome editorial frame. Use supplied venue images wherever possible. Do not apply generic nightlife stock photos.

Preferred image behaviors:

- Hard rectangular crops with no radius
- Pixelated reveal or block transition on venue images
- One strong image rather than mosaics of decorative thumbnails
- Small image beside large text, or a large image interrupted by structural type/rules
- Preserve venue individuality while the surrounding page remains unmistakably HELI

### Motion

Motion must explain navigation, selection, or continuity:

- Continuous linear ticker motion
- Sponsor/logo loops
- A pixel-block venue-image transition
- Left-to-right underline draw on navigation hover/focus
- Compact fade/vertical transition when a selected venue changes
- Smooth filter transitions in the programme
- Optional route-line drawing on the transport screen

Respect `prefers-reduced-motion`. Essential information must never depend on animation.

## Global shell for all seven screens

Every screen must clearly belong to the same website as the supplied homepage.

Desktop shell:

- Reuse the 60px black header, left-aligned white HELI wordmark, and uppercase navigation language from the homepage.
- Keep the navigation compact: `AJAKAVA`, `PILETID`, `TRANSPORT`, `MEIST`, `FAQ`.
- Add `PAIGAD` only if it can be integrated without crowding; otherwise venues remain reachable from Ajakava and the map.
- The active destination receives a white underline or white/pink state with no pill background.
- Preserve the two-ticker motif where it improves continuity. On dense utility pages, one ticker may become a static information rail, but the total header area must remain shallow.
- Do not place a large conventional footer on every screen. End pages with an editorial information rail, sponsor strip, or black field carrying essential links.

Mobile shell:

- Keep a compact black header with the HELI wordmark and one square menu control.
- The opened navigation is a full-width black panel with oversized stacked text and hard rules, not a rounded dropdown.
- Preserve a single 30-40px ticker or information rail under the header.
- Keep ticket access easy to reach without creating a floating rounded action button.

Reusable components:

- `Site header`
- `Moving or static information ticker`
- `Page masthead` using one oversized title and one compact facts block
- `Outlined action button`
- `Date switcher`
- `Filter rail`
- `Programme row`
- `Venue marker` using white/pink pixel hearts
- `Venue image with pixel transition`
- `Entity breadcrumb/back-to-context link`
- `Metadata list` with hard rules
- `Accordion row` for FAQ/accessibility/safety
- `Sponsor logo loop`
- `Black closing field` or controlled fade where appropriate

## Screen 1 - Programme / Ajakava

This is the site's most important utility screen. Prioritize instant scanning and comparison over visual spectacle.

### Desktop composition

- Begin with the global header and a compact ticker showing a practical message such as festival dates, one-ticket access, or transport access.
- Create a page masthead with an enormous `AJAKAVA` title occupying the left two-thirds and a compact festival facts block on the right: `16-17 OKTOOBER`, `2 OHTUT`, `1 PILET`, `8+ PAIKA` only where supported or clearly treated as a flexible count.
- Directly below, create a sticky filter rail separated by black rules.
- Date switcher: `R 16.10` and `L 17.10`; selected date uses solid black with off-white text.
- Include venue and category filters. Prefer square inline controls or a structured filter drawer over pills.
- Include a clear `Nulli filtrid` action.
- Main schedule uses full-width rows, not cards.
- Align columns consistently: start/end time, artist/event, venue, category, and a small arrow/action.
- Times should be large enough to anchor scanning and use tabular numerals.
- Venue names should remain clickable and visually distinct without colored tags.
- Crossing-midnight entries must be understandable; display end times and optionally a subtle `+1` marker.
- Use alternating off-white/white or black inversion only for purposeful grouping, not zebra striping for its own sake.
- Use a black intermission/transport rail between time groups if helpful, showing shuttle context.
- Allow an expanded programme row to reveal a short description and links without navigating away.

### Mobile composition

- Sticky compact date switcher below the header/ticker.
- One `FILTRID` control opens a full-width bottom or side sheet styled as a flat black/off-white panel with square controls.
- Each event row stacks as: large time on the left/top, artist name as the strongest text, venue and category beneath, then a clear arrow.
- Preserve chronological flow and avoid two-column microtype.
- Keep selected filters visible as a plain text summary such as `Paavli / Live / 3 tulemust`, not rounded chips.

### Required states

- Default full programme
- Filtered results
- No results with a helpful `Nulli filtrid` action
- Loading/skeleton state made from flat rules and blocks, not gray rounded cards
- Very long artist and venue names without overlap
- Missing artist image, since programme rows must work without images

## Screen 2 - Venues index / Paigad

This screen should make the city and its venues feel like one connected festival while preserving each venue's identity.

### Desktop composition

- Use a black-dominant screen inspired by the homepage venue section.
- Oversized `PAIGAD` title, compact introduction, and a count of participating locations.
- Split the primary area asymmetrically: venue list/panel on the left and the supplied white pixel map on black on the right.
- Use white pixel-heart markers with one hot-pink active marker.
- Selecting or hovering a venue updates a compact left panel with name, address, one short description, and a pixel-transition image.
- Below the map, continue with a full-width venue directory using large ruled rows, not cards.
- Each row includes venue name, district/area or address, a concise identity line, and `Vaata paika`.
- Venue logos may appear, but normalize their scale carefully so the page remains structured.
- Include a direct link from each venue to its programme.

### Mobile composition

- Begin with the venue list, because it is easier to scan than a squeezed map.
- Provide a compact `KAART / NIMEKIRI` switch using rectangular controls.
- The map becomes a horizontally framed or full-width interaction with touch-safe heart markers.
- Selecting a marker opens an inline panel below the map rather than a floating tooltip.
- Venue rows remain full-width and rule-separated.

### Required states

- Default venue selected
- Different venue selected
- Venue with missing image uses a black typographic tile, not stock imagery
- Placeholder/future venue uses `Asukoht lisandub`
- Map unavailable state still exposes the complete accessible venue list

## Screen 3 - Venue detail

Design one representative detail screen for `Paavli Kultuurivabrik`, but make the template clearly reusable for every venue.

### Desktop composition

- Provide a small `TAGASI PAIKADE JUURDE` or `TAGASI AJAKAVASSE` context link directly under the header.
- Build an asymmetric masthead: enormous venue name spanning multiple lines on one side and a strong supplied venue image on the other.
- The venue's own character can appear through the photograph, while typography, rules, and controls remain HELI.
- Include address, map link, venue website/social placeholder, and accessibility status in a compact ruled metadata block.
- Include a short, readable venue biography with a narrow line length.
- Add a `Selle paiga ajakava` section using the same programme-row component as the main schedule, already filtered to this venue.
- Include date switcher for 16/17 October if the venue has entries on both nights.
- Include a small locator map with the active marker in pink and related nearby stops in white.
- Provide `Osta pilet` and `Vaata kogu programmi` as square outlined controls.

### Mobile composition

- Venue name first, then image, then address/actions.
- Keep the return-to-context link visible and precise.
- Metadata becomes full-width ruled rows.
- Venue programme uses the mobile programme-row structure.
- Avoid placing long biography text above the essential address and schedule.

### Required states

- Image gallery with one image loaded
- Missing image
- No announced programme yet
- Accessibility information pending
- Long venue name and long address

## Screen 4 - Artist detail

This screen should feel editorial and focused, not like a streaming-service profile.

### Desktop composition

- Use a context link such as `TAGASI AJAKAVASSE - R 16.10 / PAAVLI`.
- Large artist name is the central visual event. Let it wrap or crop deliberately without hiding letters needed for identification.
- Pair the name with one portrait/performance image or a strict typographic placeholder.
- Include category/genre as plain metadata, not a colored pill.
- Use a concise biography with a measured text column.
- Place festival appearance information high on the page: date, start/end time, venue, and direct venue link.
- Include optional social/audio/video links only as simple text links with arrows. Do not build an embedded streaming-player UI.
- End with `Veel programmis` showing two or three related programme rows or artists, using rules rather than cards.

### Mobile composition

- Context link, artist name, appearance facts, then image and biography.
- Keep the schedule appearance visible above the fold where practical.
- External links stack as full-width ruled rows.

### Required states

- Artist announced with image
- Artist announced without image
- `Artist avalikustatakse peagi` placeholder
- Multiple festival appearances
- Extremely long artist name

## Screen 5 - Tickets / Piletid

Make the EUR 15 offer immediately understandable. This is a transactional page, but it must still feel like HELI rather than an e-commerce checkout template.

### Desktop composition

- Create a high-impact black/off-white masthead dominated by `15 EUR` and `1 PILET / 2 OHTUT / KOIK PAIGAD`.
- Use the wristband artwork or wristband motif from the source identity if supplied.
- Primary action: `OSTA PILET`, rendered as a large but square black/white inversion control.
- Explain clearly in short ruled facts:
  - access to both nights
  - access to participating venues
  - festival bus access
  - ticket/wristband collection at venue or bus door
- Do not invent a ticket provider. Use a clearly labeled placeholder checkout destination if required.
- Include a compact `Kuidas see toimib?` sequence with 3 numbered steps, laid out as editorial columns or a horizontal rule system, not cards.
- Add a small FAQ subset focused on tickets, refunds/changes only if copy is available, wristband collection, and bus access. Unknown policy must read `Info lisandub`.
- Cross-link to transport and programme.

### Mobile composition

- Lead with `15 EUR` and the buy action.
- Keep the offer facts immediately below.
- Steps and FAQ become full-width ruled rows/accordions.
- A bottom purchase rail may be sticky, but it must be a flat full-width black bar, not a floating rounded button.

### Required states

- Ticket available
- External checkout loading
- Checkout link unavailable with a clear non-error placeholder
- Sold-out state only as a designed state example, not as a claim about the real event

## Screen 6 - Transport / locations

Treat movement through Tallinn as part of the festival narrative and as a practical night-time utility.

### Desktop composition

- Use a black background with the supplied pixel map as the main visual field.
- Oversized `TRANSPORT` title may overlap negative map space but must never cover essential route information.
- Show venue markers as white pixel hearts and the selected/current point in hot pink.
- Draw one restrained white or pink route line connecting stops. The line may animate once, then remain visible.
- Create a structured stop list/timetable panel beside or below the map.
- Separate confirmed facts from pending times. Since departure times are not final, show a realistic structure labeled `Valjumisajad lisanduvad` rather than invented times.
- State the proposed operating concept: 3-4 buses rotate between venues through the evening; access is for festival-pass holders; movement between venues is part of the experience.
- Include each known venue with address and stop/area where available.
- Add direct `Ava kaardil` and `Vaata paiga programmi` actions as text links or square buttons.
- Clearly distinguish festival shuttle information from ordinary external map/navigation links.

### Mobile composition

- Start with the essential service status and pass requirement.
- Use a compact map with list toggle.
- The stop list is the primary utility view and must remain usable if the map is hidden.
- Each stop row shows venue, area/address, service-status placeholder, and an expansion action.
- Do not rely on hover-only marker behavior.

### Required states

- Route/times pending
- Venue selected
- Map unavailable but stop list available
- Service notice or delay treatment using black/pink and text, not amber/red alert cards
- Reduced-motion route with no line animation

## Screen 7 - About / contact / FAQ

Combine the festival story, practical information, safety/accessibility placeholders, contact, and partners without producing a generic corporate About page.

### Desktop composition

- Begin with an oversized statement drawn from the concept: `MITTE KONKURENTS, VAID KOOSTOO.` or an equivalent short Estonian line. Do not fabricate a long manifesto.
- Use a two-column editorial structure: narrow labels/facts and wider concept copy.
- Explain that HELI connects independent venues, artists, and communities; makes the music landscape more accessible; encourages discovery; and creates collaboration.
- Include an `INFO` section divided by hard rules:
  - Festival dates
  - Ticket and wristband basics
  - Safety
  - Age restrictions
  - Accessibility
  - Contact
- Unknown safety, age, accessibility, and contact details must be visibly marked as pending rather than invented.
- FAQ uses full-width accordion rows with plus/minus or rotating-square indicators. No bordered rounded accordion cards.
- Include partner/sponsor identities in a monochrome loop or carefully aligned strip near the end.
- Use a restrained black closing field with HELI mark, dates, navigation, and legal placeholders.

### Mobile composition

- Strong statement first, then a short concept paragraph.
- All practical sections use full-width ruled accordions.
- Contact actions are square full-width rows.
- Sponsor marks may move slowly in one horizontal line or appear in a strict two-column monochrome list.

### Required states

- Accordion closed/open
- Information pending
- Very long FAQ answer
- Keyboard focus state
- Partner logo unavailable, with text fallback

## Cross-screen interaction rules

- Every programme row can open an artist or venue.
- Opening an artist or venue preserves the originating date/filter context and provides a visible return link.
- Ticket CTAs lead to the ticket screen or external checkout placeholder.
- Venue markers update venue information without a full-page reload where practical.
- All selected states are communicated with more than color: combine pink with fill, underline, label, or `aria-pressed` behavior.
- Hover states invert black/off-white or draw an underline; focus states use a clearly visible 3px outline, preferably hot pink on black or black on off-white.
- Avoid modal dialogs for ordinary content. Prefer inline expansion or full-screen mobile panels.
- Use meaningful empty states that preserve the layout and offer a next action.

## Responsive behavior and edge cases

Design at minimum for desktop 1280px and mobile 390px. Ensure the system also remains viable between those widths.

Explicitly handle:

- Long artist and venue names
- Programme entries crossing midnight
- Several events with identical start times
- Missing artist or venue imagery
- No programme results after filtering
- No announced events for a venue
- Pending bus times
- Long FAQ answers
- Estonian copy, which may be longer than English
- Keyboard navigation
- Reduced motion
- Map unavailable or blocked
- Sponsor logos with very different aspect ratios

On mobile, do not scale the homepage's fixed artboard behavior into the new utility screens. The homepage screenshot is a style reference, not a mandate to make schedule text microscopic.

## Accessibility requirements

- Meet WCAG AA contrast at minimum.
- Use semantic heading order and one primary page heading.
- All controls have visible labels; do not rely on icon-only ambiguity.
- Touch targets are at least 44x44px.
- Keyboard focus is always visible.
- Date switchers, filters, accordions, and map markers expose selected/expanded/pressed state.
- Images have meaningful alt text; decorative identity marks can be hidden from assistive technology where adjacent text repeats them.
- Programme data has a logical reading order independent of visual columns.
- Motion has a reduced-motion alternative.
- The map always has an equivalent textual list.

## WordPress and content-model readiness

Design the screens as templates driven by structured content, not one-off static posters.

Assume these editable entities:

- Venue: name, slug, address, description, images, map coordinates, accessibility details, website/social links
- Artist: name, slug, biography, image, category/genre, external links
- Programme entry: date, start time, end time, artist, venue, category, description, status, illustrative/confirmed flag
- Transport route: route name, service status, stops, times, access note
- Information page: section title, body, status/pending flag
- FAQ item: question, answer, category, order
- Site settings: festival dates, ticket price, ticket URL, contact, navigation, sponsors

Components must tolerate empty fields and should not depend on hardcoded line counts.

## Anti-template constraints

Reject and redesign any output containing:

- Generic hero plus three feature cards
- Rounded cards or pill filters
- Purple/blue gradients or neon festival palettes
- Glassmorphism, blurred panels, soft shadows, or floating white cards
- Generic stock nightlife photography
- Centered marketing-copy sections repeated down the page
- Dashboard-like sidebars
- Oversized buttons with rounded corners
- Decorative squiggles, blobs, or abstract 3D shapes
- A schedule rendered as separate event cards
- Genre chips in many colors
- Excessive icons where text is clearer
- Minimalism that is merely empty or unfinished
- Dense information shrunk to unreadable sizes
- A new logo or altered HELI geometry

## Generation sequence

1. Inspect the homepage screenshot and all supplied references.
2. Extract a compact internal design system from the references.
3. Create shared desktop and mobile components before composing pages.
4. Generate the Programme screen first because it establishes the densest component system.
5. Generate Venues index and Venue detail using the programme components and map language.
6. Generate Artist detail using the same return-to-context and schedule system.
7. Generate Tickets and Transport with direct cross-links.
8. Generate About / contact / FAQ and the closing sponsor/footer system.
9. Audit all seven screens together for family resemblance, content clarity, responsive behavior, and source fidelity.
10. Revise any screen that appears to come from a different template or design system.

## Final quality audit

Before presenting the result, perform two critique passes.

Pass 1 - system and fidelity:

- Does every screen clearly belong to the supplied homepage?
- Are black, off-white, typography, hard rules, square controls, pink state, map hearts, and editorial asymmetry used consistently?
- Has the output avoided generic event-site conventions?
- Is the HELI logo preserved accurately?
- Is the supplied Stack Sans Notch font loaded and visibly used for every identity-led display element, with no substitute typeface?
- Are the new pages responsive rather than scaled desktop posters?

Pass 2 - task usability:

- Can a visitor scan a long programme quickly?
- Can they understand ticket value and bus access immediately?
- Can they locate a venue and return to their prior schedule context?
- Are pending facts clearly distinguished from confirmed facts?
- Do empty, missing-image, and long-content states remain coherent?
- Are keyboard focus, touch targets, contrast, and reduced motion addressed?

Revise the highest-impact failures before finalizing. Deliver a cohesive family of seven desktop screens and seven mobile states, using the supplied homepage only as the approved visual reference.
