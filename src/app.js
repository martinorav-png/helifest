import { renderPaperHomepage } from './home.js';
import { bindPaperVenueMap } from './home-venue-interactions.js';
import { bindOpenCallMorph } from './open-call-morph.js';
import { bindKaepaelStroke } from './kaepael-stroke.js';
import { mountSponsorLoop } from './sponsor-loop.jsx';
import { mountVenuePixel } from './venue-pixel.jsx';
import { getPaperVenue } from './home-venues.js';
import { parseRoute } from './router.js';
import { renderRoute } from './pages.js';
import { renderSiteShell, revealRoutePanel } from './site-shell.js';
import { bindUtilityInteractions } from './utility-interactions.js';

const main = document.querySelector('#main-content');
let cleanupPaperVenueMap = () => {};
let cleanupOpenCallMorph = () => {};
let cleanupKaepaelStroke = () => {};
let cleanupSponsorLoop = () => {};
let cleanupUtilityInteractions = () => {};
let cleanupVenueDetailPixel = () => {};

function clearMountedFeatures() {
  cleanupPaperVenueMap();
  cleanupOpenCallMorph();
  cleanupKaepaelStroke();
  cleanupSponsorLoop();
  cleanupUtilityInteractions();
  cleanupVenueDetailPixel();
  cleanupPaperVenueMap = () => {};
  cleanupOpenCallMorph = () => {};
  cleanupKaepaelStroke = () => {};
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
    cleanupOpenCallMorph = bindOpenCallMorph(main);
    cleanupKaepaelStroke = bindKaepaelStroke(main);
    cleanupSponsorLoop = mountSponsorLoop(main.querySelector('[data-sponsor-loop-root]'));
    cleanupUtilityInteractions = bindUtilityInteractions(main);
    revealRoutePanel(main);
    return;
  }

  document.body.classList.remove('paper-home-active');
  document.body.classList.add('utility-active');
  const page = renderRoute(route);
  main.innerHTML = renderSiteShell(page);
  cleanupUtilityInteractions = bindUtilityInteractions(main);
  cleanupSponsorLoop = mountSponsorLoop(main.querySelector('[data-sponsor-loop-root]'));
  revealRoutePanel(main);

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
