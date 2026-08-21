import { renderProgrammeView } from './views/programme-view.js';
import { renderVenuesView } from './views/venues-view.js';
import { renderVenueDetailView } from './views/venue-detail-view.js';
import { renderArtistDetailView } from './views/artist-detail-view.js';
import { renderTicketsView } from './views/tickets-view.js';
import { renderTransportView } from './views/transport-view.js';
import { renderAboutView } from './views/about-view.js';

export function renderRoute(route) {
  const query = route.query || {};

  switch (route.name) {
    case 'programme':
      return {
        active: 'programme',
        tone: 'dark',
        content: renderProgrammeView({
          date: query.date,
          venueId: query.venue,
          category: query.category,
        }),
      };
    case 'venues':
      return { active: 'venues', tone: 'dark', content: renderVenuesView(query.venue) };
    case 'venue':
      return { active: 'venues', tone: 'dark', content: renderVenueDetailView(route.id, query) };
    case 'artist':
      return { active: 'programme', tone: 'dark', content: renderArtistDetailView(route.id, query) };
    case 'tickets':
      return { active: 'tickets', tone: 'dark', content: renderTicketsView() };
    case 'transport':
      return { active: 'transport', tone: 'dark', content: renderTransportView() };
    case 'about':
      return { active: 'about', tone: 'dark', content: renderAboutView() };
    default:
      return {
        active: 'home',
        tone: 'dark',
        content: '<section class="utility-page not-found-view"><p>404</p><h1 id="page-title">SEDA LEHTE EI OLE.</h1><a class="outline-action" href="#home">TAGASI AVALEHELE</a></section>',
      };
  }
}
