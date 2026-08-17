import { festivalData } from '../data.js';
import { getPaperVenue } from '../home-venues.js';
import { renderProgrammeRow } from '../components/programme-row.js';
import { routeHref } from '../router.js';

function siteLabel(url) {
  return url.replace(/^https?:\/\//, '').replace(/\/$/, '');
}

function factLink(url, label) {
  if (!url) return '—';
  return `<a href="${url}" target="_blank" rel="noreferrer">${label}</a>`;
}

export function renderVenueDetailView(id = 'paavli', context = {}) {
  const venue = getPaperVenue(id);
  const events = festivalData.events.filter((event) => event.venueId === venue.id);
  const fromProgramme = context.from === 'programme';
  const back = fromProgramme
    ? routeHref('programme', null, { date: context.date || '2026-10-16', venue: venue.id })
    : '#venues';
  const backLabel = fromProgramme ? '← AJAKAVA' : '← PAIGAD';
  const imageAlt = venue.imageAlt || venue.name;
  const websiteAction = venue.website
    ? `<a class="outline-action" href="${venue.website}" target="_blank" rel="noreferrer">${siteLabel(venue.website)}</a>`
    : `<a class="outline-action" href="#venues?venue=${venue.id}">PAIGAD</a>`;

  return `<article class="entity-view venue-detail utility-page" data-view="venue">
    <a class="context-back" href="${back}">${backLabel}</a>
    <section class="entity-hero">
      <div class="entity-image" data-venue-pixel-root data-static-src="${venue.image || ''}">${venue.image ? `<img src="${venue.image}" alt="${imageAlt}">` : `<span>${venue.name}</span>`}</div>
      <div class="entity-title-block"><div class="entity-title-lockup">${venue.logo ? `<img class="entity-title-logo" src="${venue.logo}" alt="">` : ''}<h1 id="page-title">${venue.name}</h1></div></div>
    </section>
    <section class="entity-facts">
      <div><span>AADRESS</span><strong>${venue.address}</strong></div>
      <div><span>VEEBILEHT</span><strong>${factLink(venue.website, siteLabel(venue.website))}</strong></div>
      <div><span>INSTAGRAM</span><strong>${factLink(venue.instagramUrl, venue.instagram)}</strong></div>
    </section>
    <section class="entity-story"><p>${venue.description}</p>${websiteAction}</section>
    <section class="entity-programme"><header><h2>AJAKAVA</h2></header><div class="programme-table">${events.length ? events.map((event) => renderProgrammeRow(event, { date: event.date, venueId: venue.id })).join('') : '<div class="programme-empty"><h2>Lorem ipsum dolor sit amet.</h2><p>Consectetur adipiscing elit.</p></div>'}</div></section>
  </article>`;
}
