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
  const name = artist.name || artistCopy.name;
  const category = artist.genre || artistCopy.category;
  const bio = artist.bio || artistCopy.bio;
  return `<article class="entity-view artist-detail utility-page" data-view="artist">
    <a class="context-back" href="${back}">← AJAKAVA</a>
    <section class="artist-hero">
      <h1 id="page-title">${name.toUpperCase()}</h1>
    </section>
    <div class="artist-placeholder" aria-label="Artisti pilt lisandub avalikustamisel"><span>HE<br>LI</span><small>Avalikustamisel</small></div>
    <section class="entity-facts">
      <div><span>VORM</span><strong>${category}</strong></div>
      <div><span>KELL</span><strong>${first ? `${first.start}–${first.end}` : 'Aeg lisandub'}</strong></div>
      <div><span>PAIK</span><strong>${venue ? `<a href="${routeHref('venue', venue.id, { from: 'artist' })}">${venue.name}</a>` : 'Paik lisandub'}</strong></div>
    </section>
    <section class="entity-story"><p>${bio}</p></section>
    <section class="entity-programme"><header><h2>Teised näidised</h2></header><div class="programme-table">${related.map((event) => renderProgrammeRow(event, { date: event.date })).join('')}</div></section>
  </article>`;
}
