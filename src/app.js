import { renderPaperHomepage } from './home.js';
import { bindLandingIntro } from './landing-intro.js';
import { bindLandingExit, playLandingReturn, prefersReducedMotion } from './landing-transition.js';
import { playUtilitySwipe, utilitySwipeAxis } from './utility-swipe.js';
import { mountSponsorLoop } from './sponsor-loop.jsx';
import { mountVenuePixel } from './venue-pixel.jsx';
import { getPaperVenue } from './home-venues.js';
import { parseRoute } from './router.js';
import { renderRoute } from './pages.js';
import { renderSiteShell, revealRoutePanel, syncUtilityHeader, utilityNavKey, utilitySwipeDirection } from './site-shell.js';
import { bindUtilityInteractions } from './utility-interactions.js';

const main = document.querySelector('#main-content');
let cleanupLandingIntro = () => {};
let cleanupLandingExit = () => {};
let cleanupLandingReturn = () => {};
let cleanupUtilitySwipe = () => {};
let cleanupSponsorLoop = () => {};
let cleanupUtilityInteractions = () => {};
let cleanupVenueDetailPixel = () => {};
let ignoreNextHashChange = false;
let currentNavKey = null;

function clearMountedFeatures() {
  cleanupLandingIntro();
  cleanupLandingExit();
  cleanupLandingReturn();
  cleanupUtilitySwipe();
  cleanupSponsorLoop();
  cleanupUtilityInteractions();
  cleanupVenueDetailPixel();
  cleanupLandingIntro = () => {};
  cleanupLandingExit = () => {};
  cleanupLandingReturn = () => {};
  cleanupUtilitySwipe = () => {};
  cleanupSponsorLoop = () => {};
  cleanupUtilityInteractions = () => {};
  cleanupVenueDetailPixel = () => {};
}

function homeExitOptions() {
  return {
    onStart() {
      cleanupLandingIntro();
      cleanupLandingIntro = () => {};
    },
    commitHash(href) {
      if (window.location.hash === href) return;
      ignoreNextHashChange = true;
      window.location.hash = href;
    },
    navigateImmediately(href) {
      window.location.hash = href;
    },
    prepareCover: mountLandingCover,
    onSettled: settleLandingCover,
  };
}

function mountUtilityFeatures(root, route) {
  cleanupUtilityInteractions = bindUtilityInteractions(root);
  cleanupSponsorLoop = mountSponsorLoop(root.querySelector('[data-sponsor-loop-root]'));

  const venuePixel = root.querySelector('[data-venue-pixel-root]');
  if (venuePixel && route.name === 'venue') {
    const venue = getPaperVenue(route.id);
    cleanupVenueDetailPixel = mountVenuePixel(venuePixel, {
      ...venue,
      images: venue.pageImages?.length ? venue.pageImages : venue.images,
    });
  }
}

function createUtilitySite(route) {
  const page = renderRoute(route);
  const staging = document.createElement('div');
  staging.innerHTML = renderSiteShell(page);
  const site = staging.firstElementChild;
  const panel = site.querySelector('.t-panel-slide');
  panel?.setAttribute('data-open', 'true');
  panel?.setAttribute('aria-busy', 'false');
  return site;
}

function mountLandingCover(href) {
  const route = parseRoute(href);
  const cover = document.createElement('div');
  cover.className = 'landing-route-cover';
  cover.setAttribute('data-landing-cover', '');
  const frame = document.createElement('div');
  frame.className = 'landing-route-cover-frame';
  const site = createUtilitySite(route);
  frame.appendChild(site);
  cover.appendChild(frame);

  main.appendChild(cover);
  document.body.classList.add('utility-active', 'landing-exit-active');

  cleanupSponsorLoop();
  mountUtilityFeatures(site, route);
  currentNavKey = utilityNavKey(route.name);
  return frame;
}

function settleLandingCover() {
  cleanupLandingExit();
  cleanupLandingExit = () => {};
  cleanupLandingIntro();
  cleanupLandingIntro = () => {};

  const cover = main.querySelector('[data-landing-cover]');
  const frame = cover?.querySelector('.landing-route-cover-frame');
  const site = cover?.querySelector('.utility-site');

  cover?.classList.add('is-settling');
  if (frame) {
    frame.style.transform = '';
    frame.style.opacity = '';
    frame.style.visibility = '';
    frame.style.willChange = 'auto';
  }

  document.body.classList.remove('paper-home-active', 'landing-exit-active');
  document.body.classList.add('utility-active');

  const commit = () => {
    if (site) main.replaceChildren(site);
    else cover?.remove();
    window.scrollTo(0, 0);
  };

  requestAnimationFrame(() => {
    requestAnimationFrame(commit);
  });
}

function bindHomeLanding({ playIntro = true } = {}) {
  const shell = main.querySelector('.landing-shell');
  if (playIntro) {
    cleanupLandingIntro = bindLandingIntro(main);
  } else if (shell) {
    shell.setAttribute('data-intro', 'done');
    shell.setAttribute('aria-busy', 'false');
  }
  cleanupSponsorLoop = mountSponsorLoop(main.querySelector('[data-sponsor-loop-root]'));
  cleanupLandingExit = bindLandingExit(main, homeExitOptions());
}

function paintHome({ playIntro = true } = {}) {
  currentNavKey = null;
  document.body.classList.add('paper-home-active');
  document.body.classList.remove('utility-active', 'landing-exit-active');
  main.classList.remove('is-swiping');
  main.style.minHeight = '';
  main.innerHTML = renderPaperHomepage({
    sponsorsLabel: 'HELI venues and partners',
  });
  bindHomeLanding({ playIntro });
  revealRoutePanel(main);
}

function settleLandingReturn(cover, shell) {
  cover?.remove();
  document.body.classList.remove('utility-active', 'landing-exit-active');
  document.body.classList.add('paper-home-active');
  shell?.removeAttribute('data-exiting');
  shell?.setAttribute('data-intro', 'done');
  shell?.setAttribute('aria-busy', 'false');
  cleanupLandingReturn = () => {};
  cleanupLandingExit = bindLandingExit(main, homeExitOptions());
  currentNavKey = null;
  window.scrollTo(0, 0);
}

function returnToLanding() {
  const liveSite = main.querySelector('.utility-site:not(.is-incoming)') || main.querySelector('.utility-site');
  if (!liveSite) {
    clearMountedFeatures();
    paintHome({ playIntro: true });
    return;
  }

  cleanupUtilityInteractions();
  cleanupUtilityInteractions = () => {};
  cleanupVenueDetailPixel();
  cleanupVenueDetailPixel = () => {};
  cleanupLandingExit();
  cleanupLandingExit = () => {};
  cleanupUtilitySwipe();
  cleanupUtilitySwipe = () => {};
  main.classList.remove('is-swiping');
  main.style.minHeight = '';

  [...main.querySelectorAll('.utility-site')].forEach((site) => {
    if (site !== liveSite) site.remove();
  });

  liveSite.classList.remove('is-swipe-pane', 'is-incoming');
  liveSite.querySelector('.paper-header')?.removeAttribute('aria-hidden');
  liveSite.classList.add('landing-route-cover', 'is-returning');
  liveSite.setAttribute('data-landing-cover', '');

  const staging = document.createElement('div');
  staging.innerHTML = renderPaperHomepage({
    sponsorsLabel: 'HELI venues and partners',
  });
  const shell = staging.firstElementChild;
  shell.setAttribute('data-intro', 'done');
  shell.setAttribute('aria-busy', 'true');
  shell.setAttribute('data-exiting', 'true');

  main.insertBefore(shell, liveSite);
  document.body.classList.add('paper-home-active', 'landing-exit-active');
  void shell.offsetWidth;

  const releaseOutgoingSponsors = cleanupSponsorLoop;
  const releaseLandingSponsors = mountSponsorLoop(shell.querySelector('[data-sponsor-loop-root]'));
  cleanupSponsorLoop = () => {
    releaseOutgoingSponsors();
    releaseLandingSponsors();
  };

  cleanupLandingReturn = playLandingReturn(shell, liveSite, {
    onSettled() {
      releaseOutgoingSponsors();
      cleanupSponsorLoop = releaseLandingSponsors;
      settleLandingReturn(liveSite, shell);
    },
  });
}

function closeUtilityMenu(root) {
  root.querySelector('.utility-menu-button')?.setAttribute('aria-expanded', 'false');
  root.querySelector('#utility-navigation')?.classList.remove('is-open');
}

function settleUtilitySwipe(outgoing, incoming, route) {
  cleanupUtilitySwipe = () => {};
  outgoing.remove();
  incoming.classList.remove('is-swipe-pane', 'is-incoming');
  incoming.querySelector('.paper-header')?.removeAttribute('aria-hidden');
  main.classList.remove('is-swiping');
  main.style.minHeight = '';
  mountUtilityFeatures(incoming, route);
  window.scrollTo(0, 0);
}

function swipeToUtility(route, direction) {
  const outgoing = main.querySelector('.utility-site');
  const outgoingBody = outgoing?.querySelector('.utility-swipe-body');
  if (!outgoing || !outgoingBody) return false;

  cleanupUtilityInteractions();
  cleanupUtilityInteractions = () => {};
  cleanupVenueDetailPixel();
  cleanupVenueDetailPixel = () => {};

  closeUtilityMenu(outgoing);
  syncUtilityHeader(outgoing, utilityNavKey(route.name));

  const incoming = createUtilitySite(route);
  const incomingBody = incoming.querySelector('.utility-swipe-body');
  if (!incomingBody) return false;

  incoming.querySelector('.paper-header')?.setAttribute('aria-hidden', 'true');
  incoming.classList.add('is-swipe-pane', 'is-incoming');
  outgoing.classList.add('is-swipe-pane');

  const height = Math.max(outgoing.offsetHeight, window.innerHeight || 0);
  main.classList.add('is-swiping');
  main.style.minHeight = `${height}px`;
  main.appendChild(incoming);

  const releaseOutgoingSponsors = cleanupSponsorLoop;
  cleanupSponsorLoop = () => {
    releaseOutgoingSponsors();
  };

  cleanupUtilitySwipe = playUtilitySwipe(outgoingBody, incomingBody, direction, {
    axis: utilitySwipeAxis(),
    onSettled() {
      releaseOutgoingSponsors();
      cleanupSponsorLoop = () => {};
      settleUtilitySwipe(outgoing, incoming, route);
    },
  });

  return true;
}

function paintUtility(route, { reveal = true } = {}) {
  document.body.classList.remove('paper-home-active', 'landing-exit-active');
  document.body.classList.add('utility-active');
  main.classList.remove('is-swiping');
  main.style.minHeight = '';
  main.innerHTML = renderSiteShell(renderRoute(route));
  if (reveal) revealRoutePanel(main);
  else {
    const panel = main.querySelector('.t-panel-slide');
    panel?.setAttribute('data-open', 'true');
    panel?.setAttribute('aria-busy', 'false');
  }
  mountUtilityFeatures(main, route);

  const section = route.query?.section && document.getElementById(route.query.section);
  if (section) section.scrollIntoView({ block: 'start' });
  else window.scrollTo(0, 0);
}

function render() {
  if (ignoreNextHashChange) {
    ignoreNextHashChange = false;
    return;
  }

  const route = parseRoute(window.location.hash);
  const nextNavKey = utilityNavKey(route.name);
  const leavingUtility = document.body.classList.contains('utility-active')
    && Boolean(main.querySelector('.utility-site'));
  const alreadySwiping = main.classList.contains('is-swiping');

  if (route.name === 'home' && leavingUtility && !prefersReducedMotion()) {
    if (main.querySelector('.landing-shell[data-exiting="true"]')) return;
    returnToLanding();
    return;
  }

  const direction = utilitySwipeDirection(currentNavKey, nextNavKey);
  if (
    leavingUtility
    && !alreadySwiping
    && direction
    && route.name !== 'home'
    && !prefersReducedMotion()
  ) {
    currentNavKey = nextNavKey;
    if (swipeToUtility(route, direction)) return;
  }

  clearMountedFeatures();

  if (route.name === 'home') {
    paintHome({ playIntro: true });
    return;
  }

  currentNavKey = nextNavKey;
  paintUtility(route);
}

render();
window.addEventListener('hashchange', render);
