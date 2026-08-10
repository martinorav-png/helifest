import { getPaperVenue, renderPaperVenueMarkers, renderPaperVenuePanel } from './home-venues.js';

const starAsset = (tone) => tone === 'light' ? '/assets/heli-star-dark.svg' : '/assets/heli-star-light.svg';

const animatedLogo = () => `<svg class="paper-hero-animated-logo" viewBox="0 0 944 796" fill="none" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="HELI"><path class="heli-logo-letter heli-logo-letter--i" d="M944 796H576V570H944V796ZM944 554H576V428H944V554Z" fill="currentColor"/><path class="heli-logo-letter heli-logo-letter--h" d="M184 121H332V0H516V368H332V247H184V368H0V0H184V121Z" fill="currentColor"/><path class="heli-logo-letter heli-logo-letter--l" d="M184 670H516V796H0V428H184V670Z" fill="currentColor"/><path class="heli-logo-letter heli-logo-letter--e" d="M944 126H760V142H944V226H760V242H944V368H576V0H944V126Z" fill="currentColor"/></svg>`;

export function renderPaperMarquee(text, label, tone = 'dark') {
  const items = Array.from({ length: 8 }, () => `<span class="paper-ticket-item"><img src="${starAsset(tone)}" alt="">${text}</span>`).join('');
  return `<div class="paper-ticket-ticker paper-ticket-ticker--${tone}" role="region" aria-label="${label}"><div class="paper-ticket-marquee" aria-hidden="true"><div class="paper-ticket-track">${items}</div><div class="paper-ticket-track">${items}</div></div></div>`;
}

export function renderPaperHero() {
  return `<section class="paper-hero" aria-labelledby="paper-hero-title"><img class="paper-hero-mark" src="/assets/helilogo2.png" alt="HELI"><h1 class="paper-hero-title" id="paper-hero-title">Tallinna<br>klubiskeene<br>showcase<br>festival</h1><p class="paper-hero-date" aria-label="16–17 oktoober"><span>16–17</span><span>oktoober</span></p><p class="paper-hero-summary">Üks pilet kaheks õhtuks avastada Tallinna peidetud pärleid.</p><button class="paper-programme-hit" type="button">Vaata programmi</button><button class="paper-hero-ticket" type="button">Osta pilet</button><button class="paper-open-call" type="button" aria-label="Open call"><span>Open call</span></button></section>`;
}

export function renderPaperHeroAnimated() {
  return `<section class="paper-hero" aria-labelledby="paper-hero-title"><div class="paper-hero-mark">${animatedLogo()}</div><h1 class="paper-hero-title" id="paper-hero-title">Tallinna<br>klubiskeene<br>showcase<br>festival</h1><p class="paper-hero-date" aria-label="16-17 oktoober"><span>16-17</span><span>oktoober</span></p><p class="paper-hero-summary">Uks pilet kaheks ohtuks avastada Tallinna peidetud parleid.</p><button class="paper-programme-hit" type="button">Vaata programmi</button><button class="paper-hero-ticket" type="button">Osta pilet</button><button class="paper-open-call" type="button" aria-label="Open call"><span>Open call</span></button></section>`;
}

export function renderPaperVenue() {
  return `<section class="paper-venue" aria-labelledby="paper-venue-title">${renderPaperVenuePanel(getPaperVenue('paavli'))}<div class="paper-map-stage"><img class="paper-map-art" src="/assets/paper-map.png" alt="" aria-hidden="true">${renderPaperVenueMarkers('paavli')}</div></section>`;
}

export function renderPaperTicketCta() {
  return `<section class="paper-ticket-cta" aria-label="Tickets"><button type="button">Piletid</button></section>`;
}

export function renderPaperSponsors(label) {
  return `<section class="paper-sponsors" role="region" aria-label="${label}"><div class="paper-sponsor-loop" data-sponsor-loop-root></div></section>`;
}

export function renderPaperHomepage(copy = {}) {
  const marquee = copy.marquee || 'GET YOUR TICKET NOW';
  const marqueeLabel = copy.marqueeLabel || 'Festival tickets';
  const sponsorsLabel = copy.sponsorsLabel || 'HELI venues and partners';
  const header = `<header class="paper-header"><div class="paper-wordmark" role="img" aria-label="HELI"><img src="/assets/paper-wordmark.png" alt=""></div><nav aria-label="Primary"><button class="paper-nav-link" type="button">Ajakava</button><button class="paper-nav-link" type="button">Piletid</button><button class="paper-nav-link" type="button">Transport</button><button class="paper-nav-link" type="button">Meist</button><button class="paper-nav-link" type="button">FAQ</button></nav></header>`;
  return `<div class="paper-homepage-shell"><div class="paper-homepage-canvas">${header}${renderPaperMarquee(marquee, marqueeLabel, 'dark')}${renderPaperMarquee(marquee, marqueeLabel, 'light')}${renderPaperHeroAnimated()}${renderPaperVenue()}${renderPaperTicketCta()}${renderPaperSponsors(sponsorsLabel)}<div class="paper-closing-gradient" aria-hidden="true"></div></div></div>`;
}
