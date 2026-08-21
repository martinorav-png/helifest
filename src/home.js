import { getPaperVenue, renderPaperVenueMarkers, renderPaperVenuePanel, renderPaperVenueSelector } from './home-venues.js';
import { renderPaperHeader } from './site-shell.js';
import { sponsorLogos } from './sponsors.js';

const starAsset = () => '/assets/heli-star-dark.svg';

export function renderPaperMarquee(text, label, tone = 'dark') {
  const labels = Array.isArray(text) ? text : Array.from({ length: 8 }, () => text);
  const items = labels.map((name) => `<span class="paper-ticket-item"><img src="${starAsset()}" alt="">${name}</span>`).join('');
  return `<div class="paper-ticket-ticker paper-ticket-ticker--${tone}" role="region" aria-label="${label}"><div class="paper-ticket-marquee" aria-hidden="true"><div class="paper-ticket-track">${items}</div><div class="paper-ticket-track">${items}</div></div></div>`;
}

const heliSquareMark = `<svg class="paper-hero-mark" width="944" height="796" viewBox="0 0 944 796" fill="none" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="HELI"><path class="heli-mark-i" d="M944 796H576V570H944V796ZM944 554H576V428H944V554Z" fill="#000"/><path class="heli-mark-h" d="M184 121H332V0H516V368H332V247H184V368H0V0H184V121Z" fill="#000"/><path class="heli-mark-l" d="M184 670H516V796H0V428H184V670Z" fill="#000"/><path class="heli-mark-e" d="M944 126H760V142H944V226H760V242H944V368H576V0H944V126Z" fill="#000"/></svg>`;

const paperOpenCallMorph = `<svg class="paper-open-call-morph" viewBox="0 0 208 208" aria-hidden="true" focusable="false"><defs><rect id="paper-open-call-square" class="paper-open-call-shape paper-open-call-shape--square" x="10" y="10" width="188" height="188"></rect><circle id="paper-open-call-circle" class="paper-open-call-shape paper-open-call-shape--circle" cx="104" cy="104" r="100"></circle><path id="paper-open-call-star" class="paper-open-call-shape paper-open-call-shape--star" d="M103.9102 0L126.471 34.5653L165.04 19.8622L162.975 61.087L202.82 71.8622L176.918 104L202.82 136.138L162.975 146.913L165.04 188.138L126.471 173.435L103.9102 208L81.3494 173.435L42.7805 188.138L44.8454 146.913L5.000282288 136.138L30.9022 104L5.000282288 71.8622L44.8454 61.087L42.7805 19.8622L81.3494 34.5653L103.9102 0Z"></path></defs><path class="paper-open-call-morph__live" d="M10 10H198V198H10Z"></path></svg>`;

const kaepaelStroke = `<svg class="paper-hero-kaepael-stroke" viewBox="0 0 771 89" preserveAspectRatio="none" fill="none" aria-hidden="true" focusable="false"><path class="paper-hero-kaepael-stroke__idle" d="M1 1H770V88H1Z" fill="none"></path><path class="paper-hero-kaepael-stroke__path" d="M1 1H770V88H1Z" fill="none"></path></svg>`;

function renderHeroDatePattern() {
  const unit = '<span>16–17</span>';
  const track = Array.from({ length: 12 }, () => unit).join('');
  const row = `<div class="paper-hero-date-pattern-row"><div class="paper-hero-date-pattern-track">${track}</div><div class="paper-hero-date-pattern-track">${track}</div></div>`;
  return `<div class="paper-hero-date-pattern" aria-hidden="true">${row.repeat(5)}</div>`;
}

export function renderPaperHero() {
  return `<section class="paper-hero" aria-labelledby="paper-hero-title">${renderHeroDatePattern()}<div class="paper-hero-lockup">${heliSquareMark}<h1 class="paper-hero-title" id="paper-hero-title"><span>Tallinna</span><span>klubiskeene</span><span>showcase</span><span>festival</span></h1><p class="paper-hero-date" aria-label="16.–17. oktoober">16.-17.10</p></div><div class="paper-hero-info"><p class="paper-hero-summary">Üks pilet kaheks õhtuks avastada Tallinna peidetud pärleid.</p><a class="paper-programme-hit" href="#programme">Vaata programmi</a><a class="paper-hero-kaepael" href="#tickets" aria-label="Osta HELI festivalipilet">${kaepaelStroke}<img src="/assets/KÄEPAEL.png" alt="" width="4000" height="304"></a></div><a class="paper-open-call" href="#about" aria-label="Open call">${paperOpenCallMorph}<span class="paper-open-call-copy">Open call</span></a></section>`;
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
  const sponsorNames = copy.sponsorNames || sponsorLogos.map(({ title }) => title);
  return `<div class="paper-homepage-shell t-panel-slide" data-open="false" aria-busy="true">${renderPaperHeader({ homeLink: true })}<div class="paper-homepage-canvas">${renderPaperMarquee(sponsorNames, sponsorsLabel, 'dark')}${renderPaperMarquee(marquee, marqueeLabel, 'light')}${renderPaperHeroAnimated()}${renderPaperVenue()}${renderPaperSponsors(sponsorsLabel)}${renderPaperFooter()}</div></div>`;
}
