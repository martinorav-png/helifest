import { festivalData } from '../data.js';
import { transportFacts } from '../content.js';

export function renderTransportView() {
  const stops = festivalData.shuttleRoute.stops;
  const stopRows = stops.map((stop, index) => {
    const nearby = festivalData.venues.filter((venue) => venue.stop === stop).map((venue) => venue.name);
    const nearbyLabel = nearby.length ? nearby.join(', ') : 'Osalevad paigad lisanduvad.';
    return `<li class="transport-stop-row"><div class="transport-stop"><span>${String(index + 1).padStart(2, '0')}</span><strong>${stop}</strong><small>${nearbyLabel}</small></div></li>`;
  }).join('');

  return `<section class="transport-view utility-page" data-view="transport">
    <div class="utility-masthead">
      <h1 id="page-title">TRANSPORT</h1>
      <p>${transportFacts.service}</p>
    </div>
    <p class="transport-lede">${transportFacts.access} ${transportFacts.departures}</p>
    <ol class="transport-stops" aria-label="Bussipeatused">${stopRows}</ol>
    <p class="transport-note">${transportFacts.note}</p>
  </section>`;
}
