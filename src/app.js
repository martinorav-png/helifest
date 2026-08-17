import { renderPaperHomepage } from './home.js';
import { bindPaperVenueMap } from './home-venue-interactions.js';
import { mountSponsorLoop } from './sponsor-loop.jsx';
import { mountVenuePixel } from './venue-pixel.jsx';
import { getPaperVenue } from './home-venues.js';
import { parseRoute } from './router.js';
import { renderRoute } from './pages.js';
import { renderSiteShell } from './site-shell.js';
import { bindUtilityInteractions } from './utility-interactions.js';

const main = document.querySelector('#main-content');
let cleanupPaperVenueMap = () => {};
let cleanupSponsorLoop = () => {};
let cleanupUtilityInteractions = () => {};
let cleanupVenueDetailPixel = () => {};

function clearMountedFeatures() {
  cleanupPaperVenueMap();
  cleanupSponsorLoop();
  cleanupUtilityInteractions();
  cleanupVenueDetailPixel();
  cleanupPaperVenueMap = () => {};
  cleanupSponsorLoop = () => {};
  cleanupUtilityInteractions = () => {};
  cleanupVenueDetailPixel = () => {};
}

function render() {
  const route = parseRoute(window.location.hash);
  clearMountedFeatures();

  if (route.name === 'home') {
    document.body.classList.add('paper-home-active');
    document.body.classList.remove('utility-active');
    main.innerHTML = renderPaperHomepage({
      marquee: 'GET YOUR TICKET NOW',
      marqueeLabel: 'Festival tickets',
      sponsorsLabel: 'HELI venues and partners',
    });
    cleanupPaperVenueMap = bindPaperVenueMap(main, { mountVenuePixel });
    cleanupSponsorLoop = mountSponsorLoop(main.querySelector('[data-sponsor-loop-root]'));
    return;
  }

  document.body.classList.remove('paper-home-active');
  document.body.classList.add('utility-active');
  const page = renderRoute(route);
  main.innerHTML = renderSiteShell(page);
  cleanupUtilityInteractions = bindUtilityInteractions(main);
  cleanupSponsorLoop = mountSponsorLoop(main.querySelector('[data-sponsor-loop-root]'));

  const venuePixel = main.querySelector('[data-venue-pixel-root]');
  if (venuePixel && route.name === 'venue') {
    const venue = getPaperVenue(route.id);
    cleanupVenueDetailPixel = mountVenuePixel(venuePixel, {
      ...venue,
      images: venue.pageImages?.length ? venue.pageImages : venue.images,
    });
  }

  const section = route.query?.section && document.getElementById(route.query.section);
  if (section) section.scrollIntoView({ block: 'start' });
  else window.scrollTo(0, 0);
}

render();
window.addEventListener('hashchange', render);
