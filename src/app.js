import { festivalData, lookup } from './data.js';
import { filterEvents } from './programme.js';
import { selectedAttribute } from './form.js';
import { translations, translate } from './i18n.js';
import { renderPaperHomepage } from './home.js';
import { bindPaperVenueMap } from './home-venue-interactions.js';
import { mountSponsorLoop } from './sponsor-loop.jsx';

const main = document.querySelector('#main-content');
const header = document.querySelector('#site-header');
const footer = document.querySelector('#site-footer');
let cleanupPaperVenueMap = () => {};
let cleanupSponsorLoop = () => {};
const initialLocale = localStorage.getItem('heli-locale');
const state = { locale: initialLocale === 'en' ? 'en' : 'ee', filters: { date: '2026-10-16', venueId: 'All', category: 'All' } };
const mark = () => '<img class="heli-logo" src="/assets/helilogo2.png" alt="HELI">';
const venue = (id) => lookup('venues', id);
const artist = (id) => lookup('artists', id);
const buttonLink = (href, text, extra = '') => `<a class="button-link ${extra}" href="${href}">${text}</a>`;
const copy = () => translations[state.locale];
const t = (path) => translate(state.locale, path);
const dateLabels = { ee: { '2026-10-16': 'R 16. okt', '2026-10-17': 'L 17. okt' }, en: { '2026-10-16': 'Fri 16 Oct', '2026-10-17': 'Sat 17 Oct' } };
const categoryLabel = (category) => ({ Live: t('programme.live'), 'DJ set': t('programme.dj'), Listening: t('programme.listening') }[category] || category);

function headerMarkup() {
  document.documentElement.lang = state.locale === 'ee' ? 'et' : 'en';
  document.title = t('pageTitle');
  const nav = `<a href="#programme">Ajakava</a><a href="#tickets">Piletid</a><a href="#transport">Transport</a><a href="#info">Meist</a><a href="#info">FAQ</a>`;
  header.innerHTML = `<a class="brand" href="#home" aria-label="HELI">${mark()}</a><nav aria-label="Primary">${nav}</nav><div class="header-actions"><div class="language-switch" aria-label="${t('language.label')}"><button type="button" data-language="ee" class="${state.locale === 'ee' ? 'active' : ''}">EE</button><button type="button" data-language="en" class="${state.locale === 'en' ? 'active' : ''}">EN</button></div>${buttonLink('#tickets', t('header.ticket'), 'header-ticket invert')}</div>`;
  footer.innerHTML = `<div>${mark()}</div><p>${t('pageTitle')}<br>${state.locale === 'ee' ? '16-17 oktoober' : '16-17 October'}</p><p>${t('header.footerNote')}</p>`;
  header.querySelectorAll('[data-language]').forEach((button) => button.addEventListener('click', () => { state.locale = button.dataset.language; localStorage.setItem('heli-locale', state.locale); render(); }));
}

function routeRail() {
  return `<section class="route-rail" aria-labelledby="route-title"><div><p class="label" id="route-title">${t('route.label')}</p><strong>${t('route.shuttle')}</strong></div><ol>${festivalData.shuttleRoute.stops.map((stop, index) => `<li><span>${String(index + 1).padStart(2, '0')}</span>${stop}</li>`).join('')}</ol><p>${t('route.passRequired')}</p></section>`;
}

function homeView() {
  return renderPaperHomepage({
    marquee: 'GET YOUR TICKET NOW',
    marqueeLabel: t('home.marqueeLabel'),
    sponsorsLabel: t('home.iconRowLabel'),
  });
}

function renderEventRows(events) {
  return `<div class="programme-list">${events.map((event) => { const eventVenue = venue(event.venueId); return `<article class="programme-row"><time datetime="${event.date}T${event.start}">${event.start}<small>${event.end}</small></time><div><a href="#artist/${event.artistId}">${t('artists.toBeAnnounced')}</a><span>${categoryLabel(event.category)} <em>${t('common.placeholder')}</em></span></div><a class="venue-link" href="#venue/${eventVenue.id}">${eventVenue.short}<small>${eventVenue.stop}</small></a></article>`; }).join('')}</div>`;
}

function programmeView() {
  const filtered = filterEvents(festivalData.events, state.filters); const c = copy();
  return `<section class="page-heading"><p class="label">${c.programme.label}</p><h1>${c.programme.title}</h1><p>${c.programme.intro}</p></section><section class="programme-layout">${routeRail()}<div><form class="filters" aria-label="${c.nav.programme}"><fieldset><legend>${c.common.date}</legend>${festivalData.dates.map((date) => `<button type="button" data-filter="date" data-value="${date.id}" class="${state.filters.date === date.id ? 'selected' : ''}">${dateLabels[state.locale][date.id]}</button>`).join('')}</fieldset><label>${c.common.venue}<select data-filter-select="venueId"><option value="All"${selectedAttribute('All', state.filters.venueId)}>${c.common.all}</option>${festivalData.venues.map((item) => `<option value="${item.id}"${selectedAttribute(item.id, state.filters.venueId)}>${item.name}</option>`).join('')}</select></label><label>${c.common.format}<select data-filter-select="category"><option value="All"${selectedAttribute('All', state.filters.category)}>${c.common.all}</option><option value="Live"${selectedAttribute('Live', state.filters.category)}>${c.programme.live}</option><option value="DJ set"${selectedAttribute('DJ set', state.filters.category)}>${c.programme.dj}</option><option value="Listening"${selectedAttribute('Listening', state.filters.category)}>${c.programme.listening}</option></select></label><button class="clear-filters" type="button">${c.common.clearFilters}</button></form><p class="result-count" aria-live="polite">${c.programme.result(filtered.length)}</p>${filtered.length ? renderEventRows(filtered) : `<div class="empty-state"><h2>${c.programme.emptyTitle}</h2><p>${c.programme.emptyText}</p><button class="clear-filters" type="button">${c.common.clearFilters}</button></div>`}</div></section>`;
}

function venuesView() { const c = copy(); return `<section class="page-heading"><p class="label">${c.venues.label}</p><h1>${c.venues.title}</h1></section><section class="venue-index">${festivalData.venues.map((item, index) => `<a href="#venue/${item.id}"><span>${String(index + 1).padStart(2, '0')}</span><strong>${item.name}</strong><small>${item.address} / ${c.venues.stop}: ${item.stop}</small></a>`).join('')}</section>`; }
function venueView(id) { const item = venue(id); if (!item) return notFound(); const c = copy(); const events = festivalData.events.filter((event) => event.venueId === id); return `<section class="detail-heading"><p class="label">${c.common.venue} / ${c.venues.stop}: ${item.stop}</p><h1>${item.name}</h1><p>${item.address}</p><a href="#programme" class="back-link">${c.common.backToProgramme}</a></section><section class="detail-grid"><div class="venue-visual">${mark()}<span>${item.short}</span></div><div><h2>${c.venues.onRoute}</h2><p>${c.venues.description}</p><dl><dt>${c.venues.address}</dt><dd>${item.address}</dd><dt>${c.venues.accessibility}</dt><dd>${c.venues.accessibilityTbd}</dd><dt>${c.venues.transport}</dt><dd>${t('route.shuttle')}: ${item.stop}</dd></dl></div></section><section class="detail-programme"><p class="label">${c.venues.atVenue}</p>${renderEventRows(events)}</section>`; }

function artistsView() { const c = copy(); return `<section class="page-heading"><p class="label">${c.artists.label}</p><h1>${c.artists.title}</h1><p>${c.artists.intro}</p></section><section class="artist-index">${festivalData.artists.map((item) => `<a href="#artist/${item.id}"><span>${mark()}</span><strong>${c.artists.toBeAnnounced}</strong><small>${c.common.programmePlaceholder}</small></a>`).join('')}</section>`; }
function artistView(id) { const item = artist(id); if (!item) return notFound(); const c = copy(); const appearances = festivalData.events.filter((event) => event.artistId === id); return `<section class="detail-heading"><p class="label">${c.artists.label} / ${c.common.programmePlaceholder}</p><h1>${c.artists.toBeAnnounced}</h1><a href="#programme" class="back-link">${c.common.backToProgramme}</a></section><section class="artist-bio"><div class="artist-placeholder">${mark()}</div><div><p>${c.artists.bio}</p><p class="note">${c.artists.social}</p></div></section><section class="detail-programme"><p class="label">${c.artists.appearances}</p>${renderEventRows(appearances)}</section>`; }

function ticketsView() { const c = copy(); return `<section class="ticket-page"><p class="label">${c.tickets.label}</p><h1>15 €</h1><p class="ticket-intro">${c.tickets.intro}</p><div class="ticket-rules"><p><strong>${c.tickets.venues}</strong>${c.tickets.venuesText}</p><p><strong>${c.tickets.shuttle}</strong>${c.tickets.shuttleText}</p><p><strong>${c.tickets.collection}</strong>${c.tickets.collectionText}</p></div><p class="note">${c.tickets.linkNote}</p><a href="#transport" class="button-link invert">${c.tickets.stops}</a></section>`; }

function transportView() { const c = copy(); return `<section class="page-heading"><p class="label">${c.transport.label}</p><h1>${c.transport.title}</h1><p>${c.transport.description}</p></section><section class="transport-page"><div class="route-diagram"><p class="label">${c.transport.stops}</p>${festivalData.shuttleRoute.stops.map((stop, index) => `<div><span>${String(index + 1).padStart(2, '0')}</span><strong>${stop}</strong><small>${c.transport.nearby}</small></div>`).join('')}</div><div class="transport-notes"><h2>${c.transport.before}</h2><p>${c.transport.buses}</p><p>${c.transport.times}</p><a href="#venues" class="button-link">${c.transport.venuesByStop}</a></div></section>`; }
function infoView() { const c = copy(); return `<section class="page-heading"><p class="label">${c.info.label}</p><h1>${c.info.title}</h1><p>${c.info.intro}</p></section><section class="info-grid"><details open><summary>${c.info.what}</summary><p>${c.info.whatText}</p></details><details><summary>${c.info.safety}</summary><p>${c.info.safetyText}</p></details><details><summary>${c.info.accessibility}</summary><p>${c.info.accessibilityText}</p></details><details><summary>${c.info.contact}</summary><p>${c.info.contactText}</p></details></section>`; }
function notFound() { const c = copy(); return `<section class="page-heading"><p class="label">${c.notFound.label}</p><h1>${c.notFound.title}</h1>${buttonLink('#programme', c.notFound.action)}</section>`; }

function render() {
  const route = (location.hash.slice(1) || 'home').split('/');
  const isHome = route[0] === 'home';
  document.body.classList.toggle('paper-home-active', isHome);
  header.hidden = isHome;
  footer.hidden = isHome;
  cleanupPaperVenueMap();
  cleanupPaperVenueMap = () => {};
  cleanupSponsorLoop();
  cleanupSponsorLoop = () => {};
  if (isHome) {
    main.innerHTML = homeView();
    cleanupPaperVenueMap = bindPaperVenueMap(main);
    cleanupSponsorLoop = mountSponsorLoop(main.querySelector('[data-sponsor-loop-root]'));
  } else {
    header.className = 'site-header';
    headerMarkup();
    const views = {
      programme: () => programmeView(),
      venues: () => venuesView(),
      venue: () => venueView(route[1]),
      artists: () => artistsView(),
      artist: () => artistView(route[1]),
      tickets: () => ticketsView(),
      transport: () => transportView(),
      info: () => infoView(),
    };
    main.innerHTML = (views[route[0]] || notFound)();
  }
  bindInteractions();
}
function bindInteractions() {
  main.querySelectorAll('[data-filter]').forEach((button) => button.addEventListener('click', () => { state.filters[button.dataset.filter] = button.dataset.value; render(); }));
  main.querySelectorAll('[data-filter-select]').forEach((select) => select.addEventListener('change', () => { state.filters[select.dataset.filterSelect] = select.value; render(); }));
  main.querySelectorAll('.clear-filters').forEach((button) => button.addEventListener('click', () => { state.filters = { date: '2026-10-16', venueId: 'All', category: 'All' }; render(); }));
}

window.addEventListener('hashchange', render);
render();
