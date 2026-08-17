import { getPaperVenue, renderPaperVenueMarkers, renderPaperVenuePanel } from './home-venues.js';
import { renderPaperHeader } from './site-shell.js';
import { sponsorLogos } from './sponsors.js';

const starAsset = () => '/assets/heli-star-dark.svg';

export function renderPaperMarquee(text, label, tone = 'dark') {
  const labels = Array.isArray(text) ? text : Array.from({ length: 8 }, () => text);
  const items = labels.map((name) => `<span class="paper-ticket-item"><img src="${starAsset()}" alt="">${name}</span>`).join('');
  return `<div class="paper-ticket-ticker paper-ticket-ticker--${tone}" role="region" aria-label="${label}"><div class="paper-ticket-marquee" aria-hidden="true"><div class="paper-ticket-track">${items}</div><div class="paper-ticket-track">${items}</div></div></div>`;
}

const heliSquareMark = `<svg class="paper-hero-mark" width="944" height="796" viewBox="0 0 944 796" fill="none" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="HELI"><path class="heli-mark-i" d="M590 796H576V570H590V796ZM590 554H576V428H590V554Z" fill="#000"/><path class="heli-mark-h" d="M15 177H501V0H516V368H501V191H15V368H0V0H15V177Z" fill="#000"/><path class="heli-mark-l" d="M15 781H516V796H0V428H15V781Z" fill="#000"/><path class="heli-mark-e" d="M944 15H591V177H944V191H591V353H944V368H576V0H944V15Z" fill="#000"/></svg>`;

export function renderPaperHero() {
  return `<section class="paper-hero" aria-labelledby="paper-hero-title">${heliSquareMark}<h1 class="paper-hero-title" id="paper-hero-title">Tallinna<br>klubiskeene<br>showcase<br>festival</h1><p class="paper-hero-date" aria-label="16–17 oktoober"><span>16–17</span><span>oktoober</span></p><p class="paper-hero-summary">Üks pilet kaheks õhtuks avastada Tallinna peidetud pärleid.</p><a class="paper-programme-hit" href="#programme">Vaata programmi</a><a class="paper-hero-ticket" href="#tickets">Osta pilet</a><a class="paper-open-call" href="#about" aria-label="Open call"><span>Open call</span></a></section>`;
}

export function renderPaperHeroAnimated() {
  return renderPaperHero();
}

export function renderPaperVenue() {
  return `<section class="paper-venue" aria-labelledby="paper-venue-title">${renderPaperVenuePanel(getPaperVenue('paavli'))}<div class="paper-map-stage"><div class="paper-map-frame"><img class="paper-map-art" src="/assets/tallinn5.png" alt="" aria-hidden="true">${renderPaperVenueMarkers('paavli')}</div><a class="paper-map-tickets" href="#tickets">Piletid</a></div></section>`;
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
  const sponsorNames = copy.sponsorNames || sponsorLogos.map(({ title }) => title);
  return `<div class="paper-homepage-shell">${renderPaperHeader()}<div class="paper-homepage-canvas">${renderPaperMarquee(sponsorNames, sponsorsLabel, 'dark')}${renderPaperMarquee(marquee, marqueeLabel, 'light')}${renderPaperHeroAnimated()}${renderPaperVenue()}${renderPaperSponsors(sponsorsLabel)}${renderPaperFooter()}</div></div>`;
}
