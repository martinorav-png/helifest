import { paperVenueRecords, getPaperVenue } from '../home-venues.js';
import { routeHref } from '../router.js';
import { siteCopy } from '../content.js';

const routeOrder = ['paavli', 'hall', 'uuslaine', 'ida', 'd3', 'fonoteek', 'ekkm', 'kumu'];

function mapsEmbedSrc(venue) {
  const query = encodeURIComponent(`${venue.name}, ${venue.address}, Tallinn, Estonia`);
  return `https://maps.google.com/maps?q=${query}&z=15&hl=en&output=embed`;
}

export function renderVenuesView(activeId = 'paavli') {
  const byId = Object.fromEntries(paperVenueRecords.map((venue) => [venue.id, venue]));
  const venues = routeOrder.map((id) => byId[id]).filter(Boolean);
  const active = getPaperVenue(activeId);
  const stopRows = venues.map((venue, index) => `<div class="transport-stop-row"><button class="transport-stop" type="button" data-venue-select="${venue.id}" aria-pressed="${venue.id === active.id}" aria-label="${venue.name}, ${venue.address}"><span>${String(index + 1).padStart(2, '0')}</span><strong>${venue.name}</strong><small>${venue.address}</small></button><a class="venue-open" href="${routeHref('venue', venue.id, { from: 'venues' })}">Ava</a></div>`).join('');

  return `<section class="venues-view utility-page utility-page--dark" data-view="venues">
    <div class="transport-stage">
      <div class="transport-map">
        <iframe class="transport-map-embed" title="${active.name} on Google Maps" src="${mapsEmbedSrc(active)}" loading="lazy" referrerpolicy="no-referrer-when-downgrade" allowfullscreen></iframe>
      </div>
      <aside class="transport-overlay">
        <h1 id="page-title">PAIGAD</h1>
        <p class="transport-lede">${siteCopy.descriptor}</p>
        <div class="transport-stops">${stopRows}</div>
      </aside>
    </div>
  </section>`;
}
