import { getPaperVenue, renderPaperVenueMarkers, renderPaperVenuePanel, renderPaperVenueSelector } from './home-venues.js';
import { renderPaperHeader } from './site-shell.js';

const starAsset = () => '/assets/heli-star-dark.svg';

export function renderPaperMarquee(text, label, tone = 'dark') {
  const labels = Array.isArray(text) ? text : Array.from({ length: 8 }, () => text);
  const items = labels.map((name) => `<span class="paper-ticket-item"><img src="${starAsset()}" alt="">${name}</span>`).join('');
  return `<div class="paper-ticket-ticker paper-ticket-ticker--${tone}" role="region" aria-label="${label}"><div class="paper-ticket-marquee" aria-hidden="true"><div class="paper-ticket-track">${items}</div><div class="paper-ticket-track">${items}</div></div></div>`;
}

const heliSquareMark = `<div class="paper-hero-mark" data-hero-logo-lottie role="img" aria-label="HELI"></div>`;

const paperOpenCallMorph = `<svg class="paper-open-call-morph" viewBox="0 0 208 208" aria-hidden="true" focusable="false"><defs><rect id="paper-open-call-square" class="paper-open-call-shape paper-open-call-shape--square" x="10" y="10" width="188" height="188"></rect><circle id="paper-open-call-circle" class="paper-open-call-shape paper-open-call-shape--circle" cx="104" cy="104" r="100"></circle><path id="paper-open-call-star" class="paper-open-call-shape paper-open-call-shape--star" d="M103.9102 0L126.471 34.5653L165.04 19.8622L162.975 61.087L202.82 71.8622L176.918 104L202.82 136.138L162.975 146.913L165.04 188.138L126.471 173.435L103.9102 208L81.3494 173.435L42.7805 188.138L44.8454 146.913L5.000282288 136.138L30.9022 104L5.000282288 71.8622L44.8454 61.087L42.7805 19.8622L81.3494 34.5653L103.9102 0Z"></path></defs><path class="paper-open-call-morph__live" d="M10 10H198V198H10Z"></path></svg>`;

export function renderPaperHero() {
  return `<section class="paper-hero" aria-labelledby="paper-hero-title"><div class="paper-hero-lockup">${heliSquareMark}<h1 class="paper-hero-title" id="paper-hero-title"><span>Tallinna</span><span>klubiskeene</span><span>showcase</span><span>festival</span></h1></div><div class="paper-hero-info"><p class="paper-hero-date" aria-label="16.–17. oktoober">16.-17.<span class="paper-hero-date-tail">10</span></p><p class="paper-hero-summary">Üks pilet kaheks õhtuks avastada Tallinna peidetud pärleid.</p><div class="paper-hero-ctas"><a class="paper-programme-hit" href="#programme">Vaata programmi</a><a class="paper-hero-ticket" href="#tickets">Osta pilet</a></div></div><a class="paper-open-call" href="#about" aria-label="Open call">${paperOpenCallMorph}<span class="paper-open-call-copy">Open call</span></a></section>`;
}

export function renderPaperHeroAnimated() {
  return renderPaperHero();
}

export function renderPaperVenue() {
  return `<section class="paper-venue" aria-labelledby="paper-venue-title">${renderPaperVenuePanel(getPaperVenue('paavli'))}<div class="paper-map-stage"><div class="paper-map-frame"><img class="paper-map-art" src="/assets/pixelmaplite.png" alt="" aria-hidden="true">${renderPaperVenueMarkers('paavli')}</div><div class="paper-map-selector" role="group" aria-label="Vali festivali paik">${renderPaperVenueSelector('paavli')}</div><a class="paper-map-tickets" href="#tickets">Piletid</a></div></section>`;
}

export function renderPaperSponsors(label) {
  return `<section class="paper-sponsors" role="region" aria-label="${label}"><div class="paper-sponsor-loop" data-sponsor-loop-root></div></section>`;
}

export function renderPaperFooter() {
  return `<footer class="paper-footer"><a class="paper-footer-wordmark" href="#home" aria-label="HELI avaleht"><img src="/assets/helihorizontal.svg" alt=""></a><p>16–17 oktoober 2026</p><nav aria-label="Footer"><a href="#programme">Ajakava</a><a href="#tickets">Piletid</a><a href="#about">Meist</a></nav></footer>`;
}

export function renderPaperHomepage(copy = {}) {
  const marquee = copy.marquee || 'GET YOUR TICKET NOW';
  const marqueeLabel = copy.marqueeLabel || 'Festival tickets';
  const sponsorsLabel = copy.sponsorsLabel || 'HELI venues and partners';
  return `<div class="paper-homepage-shell t-panel-slide" data-open="false" aria-busy="true">${renderPaperHeader({ homeLink: true })}<div class="paper-homepage-canvas">${renderPaperMarquee(marquee, marqueeLabel, 'light')}${renderPaperHeroAnimated()}${renderPaperVenue()}${renderPaperSponsors(sponsorsLabel)}${renderPaperFooter()}</div></div>`;
}
