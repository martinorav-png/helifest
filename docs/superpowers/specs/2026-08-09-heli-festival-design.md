# HELI Festival Prototype Design

## Direction

Transport-led festival navigation. The site treats HELI as a connected city route: the main route rail establishes where the visitor is, shuttle connections make movement actionable, and the programme remains instantly accessible as a parallel schedule view. It preserves the supplied black-and-white, geometric identity rather than turning the festival into a map app.

## Primary flow

Home introduces HELI and sends visitors to the route-aware programme. Programme filtering supports date, venue, and category while each entry links to its venue and artist context. Tickets explain the single EUR15 pass. Transport lists stops, the shuttle rule, and venue locations. Visitors can move back to their previous programme context from details.

## Responsive behaviour

Desktop presents route rails, dense row-based programme data, and a stable navigation spine. Mobile presents dates first, compact filters, route summaries, and a persistent ticket action; no desktop table is squeezed into a phone width.

## Content and implementation

Use confirmed venue names from the supplied platform/poster references. Programme entries, artist biographies, service details, and any exact bus times are marked as illustrative until supplied. Data is modelled as arrays of venues, artists, events, and routes so a WordPress API can replace it later without redesign.

## Quality bar

No card-grid landing page, gradients, decorative neon, generic icons, or invented factual claims. Use visible focus, reduced motion, labelled filters, empty results, long-name handling, and high contrast.
