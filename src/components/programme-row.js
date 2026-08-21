import { lookup } from '../data.js';
import { routeHref } from '../router.js';

const categoryLabels = { Live: 'Live', 'DJ set': 'DJ-set', Listening: 'Kuulamine' };

export function renderProgrammeRow(entry, context = {}) {
  const artist = lookup('artists', entry.artistId);
  const venue = lookup('venues', entry.venueId);
  const query = { from: 'programme', date: context.date || entry.date, venue: context.venueId === 'All' ? '' : context.venueId };
  const category = categoryLabels[entry.category] || entry.category;
  return `<article class="programme-row" data-programme-entry="${entry.id}">
    <time class="programme-time" datetime="${entry.date}T${entry.start}"><strong>${entry.start}</strong><span>${entry.end}</span></time>
    <div class="programme-artist"><a href="${routeHref('artist', artist.id, query)}">${artist.name}</a>${entry.illustrative ? '<small>Näidis</small>' : ''}</div>
    <a class="programme-venue" href="${routeHref('venue', venue.id, query)}">${venue.name}</a>
    <span class="programme-category">${category}</span>
    <span class="programme-arrow" aria-hidden="true">→</span>
  </article>`;
}
