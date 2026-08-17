import { festivalData, lookup } from '../data.js';
import { artistCopy } from '../content.js';
import { renderProgrammeRow } from '../components/programme-row.js';
import { routeHref } from '../router.js';

export function renderArtistDetailView(id = 'artist-01', context = {}) {
  const artist = lookup('artists', id) || festivalData.artists[0];
  const appearances = festivalData.events.filter((event) => event.artistId === artist.id);
  const first = appearances[0];
  const venue = first ? lookup('venues', first.venueId) : null;
  const back = routeHref('programme', null, { date: context.date || first?.date || '2026-10-16' });
  const related = festivalData.events.filter((event) => event.artistId !== artist.id).slice(0, 2);
  return `<article class="entity-view artist-detail utility-page" data-view="artist">
    <a class="context-back" href="${back}">← Lorem ipsum</a>
    <section class="artist-hero">
      <h1 id="page-title">${artistCopy.name.toUpperCase()}</h1>
    </section>
    <div class="artist-placeholder" aria-label="Lorem ipsum"><span>HE<br>LI</span><small>LOREM IPSUM</small></div>
    <section class="entity-facts">
      <div><span>LOREM</span><strong>${artistCopy.category}</strong></div>
      <div><span>IPSUM</span><strong>${first ? `${first.start}–${first.end}` : 'Lorem ipsum'}</strong></div>
      <div><span>DOLOR</span><strong>${venue ? `<a href="${routeHref('venue', venue.id, { from: 'artist' })}">Lorem ipsum</a>` : 'Lorem ipsum'}</strong></div>
    </section>
    <section class="entity-story"><p>${artistCopy.bio}</p></section>
    <section class="entity-programme"><header><h2>Lorem ipsum dolor</h2></header><div class="programme-table">${related.map((event) => renderProgrammeRow(event, { date: event.date })).join('')}</div></section>
  </article>`;
}
