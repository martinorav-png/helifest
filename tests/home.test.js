import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { renderPaperHero, renderPaperHomepage } from '../src/home.js';

const copy = {
  marquee: 'GET YOUR TICKET NOW',
  marqueeLabel: 'Festival tickets',
  venueTitle: 'Paavli Kultuurivabrik',
  venueBody: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
  sponsorsLabel: 'HELI venues and partners',
};

test('renderPaperHomepage returns the complete Paper finale composition', () => {
  const markup = renderPaperHomepage(copy);

  assert.equal((markup.match(/class="paper-homepage-canvas"/g) || []).length, 1);
  assert.equal((markup.match(/class="paper-ticket-ticker/g) || []).length, 2);
  assert.equal((markup.match(/class="paper-ticket-marquee"/g) || []).length, 2);
  assert.equal((markup.match(/class="paper-ticket-track"/g) || []).length, 4);
  assert.doesNotMatch(markup, /\/assets\/visitor-hero\.png/);
  assert.doesNotMatch(markup, /paper-hero-art/);
  assert.match(markup, /\/assets\/paavli-night\.png/);
  assert.equal((markup.match(/data-sponsor-loop-root/g) || []).length, 1);
  assert.doesNotMatch(markup, /paper-sponsor-crop|paper-sponsor-source|\/assets\/heli-sponsors\.png/);
  assert.match(markup, /class="paper-open-call"/);
  assert.match(markup, /class="paper-map-stage"/);
  assert.equal((markup.match(/class="paper-map-marker"/g) || []).length, 11);
  assert.doesNotMatch(markup, /href="#(?:programme|tickets|transport|info|venues|home)"/);
  assert.match(markup, /<button class="paper-nav-link" type="button">Ajakava<\/button>/);
  assert.match(markup, /<button class="paper-nav-link" type="button">Piletid<\/button>/);
  assert.match(markup, /<button class="paper-nav-link" type="button">Transport<\/button>/);
  assert.match(markup, /<button class="paper-nav-link" type="button">Meist<\/button>/);
  assert.match(markup, /<button class="paper-nav-link" type="button">FAQ<\/button>/);
  assert.match(markup, /Paavli Kultuurivabrik/);
  assert.match(markup, /class="paper-sponsors"/);
  assert.match(markup, /class="paper-closing-gradient"/);
});

test('renderPaperHomepage removes the previous homepage structures', () => {
  const markup = renderPaperHomepage(copy);

  assert.doesNotMatch(markup, /live-hero/);
  assert.doesNotMatch(markup, /venue-feature-map/);
  assert.doesNotMatch(markup, /icon-strip/);
  assert.doesNotMatch(markup, /placeholder-icon/);
});

test('the application mounts only the Paper homepage renderer', () => {
  const source = readFileSync(new URL('../src/app.js', import.meta.url), 'utf8');

  assert.match(source, /import \{ renderPaperHomepage \} from '\.\/home\.js'/);
  assert.match(source, /import \{ bindPaperVenueMap \} from '\.\/home-venue-interactions\.js'/);
  assert.match(source, /import \{ mountSponsorLoop \} from '\.\/sponsor-loop\.jsx'/);
  assert.match(source, /let cleanupPaperVenueMap = \(\) => \{\};/);
  assert.match(source, /let cleanupSponsorLoop = \(\) => \{\};/);
  assert.match(source, /cleanupPaperVenueMap\(\);[\s\S]*main\.innerHTML/);
  assert.match(source, /cleanupSponsorLoop\(\);[\s\S]*main\.innerHTML/);
  assert.match(source, /cleanupPaperVenueMap = bindPaperVenueMap\(main\);/);
  assert.match(source, /cleanupSponsorLoop = mountSponsorLoop\(main\.querySelector\('\[data-sponsor-loop-root\]'\)\);/);
  assert.match(source, /renderPaperHomepage\(/);
  assert.doesNotMatch(source, /hashchange|programmeView|venuesView|venueView|artistsView|artistView|ticketsView|transportView|infoView/);
  assert.doesNotMatch(source, /renderMarquee|renderVenueFeature|renderVisitorHero/);
});

test('the sponsor row reserves the Paper geometry for the React island', () => {
  const css = readFileSync(new URL('../src/styles.css', import.meta.url), 'utf8');

  assert.match(css, /\.paper-sponsor-loop\s*\{[^}]*width:\s*1280px;[^}]*overflow:\s*visible;[^}]*padding:/s);
  assert.doesNotMatch(css, /\.paper-sponsor-crop|\.paper-sponsor-source/);
});

test('renderPaperHero provides an accessible live-text Paper composition', () => {
  const markup = renderPaperHero();

  assert.match(markup, /^<section class="paper-hero" aria-labelledby="paper-hero-title">/);
  assert.match(markup, /<img class="paper-hero-mark" src="\/assets\/helilogo2\.png" alt="HELI">/);
  assert.match(markup, /<h1 class="paper-hero-title" id="paper-hero-title">Tallinna<br>klubiskeene<br>showcase<br>festival<\/h1>/);
  assert.match(markup, /<p class="paper-hero-date" aria-label="16–17 oktoober"><span>16–17<\/span><span>oktoober<\/span><\/p>/);
  assert.match(markup, /<p class="paper-hero-summary">Üks pilet kaheks õhtuks avastada Tallinna peidetud pärleid\.<\/p>/);
  assert.match(markup, /<button class="paper-programme-hit" type="button">Vaata programmi<\/button>/);
  assert.match(markup, /<button class="paper-hero-ticket" type="button">Osta pilet<\/button>/);
  assert.match(markup, /<button class="paper-open-call" type="button" aria-label="Open call"><span>Open call<\/span><\/button>/);
  assert.equal((markup.match(/<img\b/g) || []).length, 1);
  assert.doesNotMatch(markup, /visitor-hero\.png|paper-hero-art/);
});

test('the live Paper hero uses its specified text geometry without a divider mask', () => {
  const css = readFileSync(new URL('../src/styles.css', import.meta.url), 'utf8');
  const rule = (selector) => new RegExp(`${selector}\\s*\\{([^}]*)\\}`).exec(css)?.[1] || '';
  const assertRule = (selector, properties) => {
    const declaration = rule(selector);
    properties.forEach((property) => assert.match(declaration, property));
  };

  assertRule('\\.paper-hero', [/width:\s*1280px;/, /height:\s*499px;/, /background:\s*#f7f7f5;/]);
  assertRule('\\.paper-hero-mark', [/position:\s*absolute;/, /left:\s*32px;/, /top:\s*145px;/, /width:\s*245px;/, /height:\s*auto;/]);
  assertRule('\\.paper-hero-title', [/position:\s*absolute;/, /left:\s*300px;/, /top:\s*178px;/, /font-family:\s*'Stack Sans Notch'(?:,|;)/, /font-size:\s*44px;/, /font-weight:\s*500;/, /letter-spacing:\s*-2\.2px;/, /line-height:\s*\.79;/, /color:\s*#000000;/, /margin:\s*0;/]);
  assertRule('\\.paper-hero-date', [/position:\s*absolute;/, /left:\s*704px;/, /top:\s*168px;/, /font-family:\s*'Stack Sans Notch'(?:,|;)/, /font-size:\s*103px;/, /font-weight:\s*500;/, /letter-spacing:\s*-5\.8px;/, /line-height:\s*\.82;/, /color:\s*#000000;/, /margin:\s*0;/]);
  assertRule('\\.paper-hero-date span', [/display:\s*block;/, /white-space:\s*nowrap;/]);
  assertRule('\\.paper-hero-summary', [/position:\s*absolute;/, /left:\s*705px;/, /top:\s*370px;/, /width:\s*300px;/, /font-family:\s*'Inter'(?:,|;)/, /font-size:\s*16px;/, /font-weight:\s*500;/, /line-height:\s*18px;/, /color:\s*#000000;/, /margin:\s*0;/]);
  assert.doesNotMatch(css, /\.paper-hero::after/);
  assert.doesNotMatch(css, /\.paper-hero-art/);
  assert.doesNotMatch(css, /\.paper-programme-hit::after/);
  assert.match(css, /\.paper-programme-hit\s*\{[^}]*color:\s*#000000;/s);
  assert.match(css, /\.paper-programme-hit\s*\{[^}]*border:\s*\.8px solid #000000;/s);
  assert.match(css, /\.paper-programme-hit\s*\{[^}]*font-family:\s*'Stack Sans Notch'/s);
  assert.match(css, /\.paper-hero-ticket\s*\{[^}]*font-family:\s*'Stack Sans Notch'/s);
  assert.match(css, /\.paper-open-call span\s*\{[^}]*font-family:\s*'Stack Sans Notch'/s);
  assert.match(css, /\.paper-programme-hit:hover,\s*\.paper-programme-hit:focus-visible,[\s\S]*\{[^}]*background:\s*#000000;[^}]*color:\s*#ffffff;/s);
  assert.match(css, /\.paper-programme-hit,\s*\.paper-hero-ticket,\s*\.paper-open-call\s*\{[^}]*z-index:\s*2;/s);
});

test('the Paper map keeps its stage geometry and accessible marker transitions', () => {
  const css = readFileSync(new URL('../src/styles.css', import.meta.url), 'utf8');

  assert.match(css, /\.paper-map-stage\s*\{[^}]*position:\s*absolute;[^}]*left:\s*607px;[^}]*top:\s*0;[^}]*width:\s*673px;[^}]*height:\s*522px;/s);
  assert.match(css, /\.paper-map-art\s*\{[^}]*left:\s*0;[^}]*top:\s*0;[^}]*width:\s*673px;[^}]*height:\s*522px;/s);
  assert.match(css, /\.paper-map-marker\s*\{[^}]*width:\s*24px;[^}]*height:\s*24px;/s);
  assert.match(css, /\.paper-map-marker\s*\{[^}]*left:\s*calc\(var\(--marker-x\) \* 1px - 7px\);[^}]*top:\s*calc\(var\(--marker-y\) \* 1px - 7px\);/s);
  assert.match(css, /\.paper-map-marker::before\s*\{[^}]*width:\s*10px;[^}]*height:\s*10px;[^}]*background:\s*#ffffff;/s);
  assert.match(css, /\.paper-map-marker\[aria-pressed="true"\]::before\s*\{[^}]*background:\s*#ff90da;/s);
  assert.match(css, /\.paper-venue-panel--switching\s*\{[^}]*opacity:\s*0;[^}]*translateY\(8px\);/s);
  assert.match(css, /\.paper-venue-content\s*\{[^}]*transition:[^}]*150ms/s);
  assert.match(css, /@media \(prefers-reduced-motion:\s*reduce\)[\s\S]*\.paper-map-marker[\s\S]*transition:\s*none;/s);
});

test('the homepage stylesheet defines one fixed Paper artboard and scales it without reflow', () => {
  const css = readFileSync(new URL('../src/styles.css', import.meta.url), 'utf8');

  assert.equal((css.match(/\/\* Paper finale homepage \*\//g) || []).length, 1);
  assert.match(css, /\.paper-homepage-canvas\s*\{[^}]*width:\s*1280px;[^}]*height:\s*2092px;/s);
  assert.match(css, /\.paper-header\s*\{[^}]*height:\s*60px;/s);
  assert.match(css, /\.paper-ticket-ticker\s*\{[^}]*height:\s*40px;/s);
  assert.match(css, /\.paper-hero\s*\{[^}]*height:\s*499px;/s);
  assert.match(css, /\.paper-venue\s*\{[^}]*height:\s*522px;/s);
  assert.match(css, /\.paper-ticket-cta\s*\{[^}]*height:\s*164px;/s);
  assert.match(css, /\.paper-sponsors\s*\{[^}]*height:\s*165px;/s);
  assert.match(css, /--paper-home-scale/);
  assert.match(css, /--paper-home-scale:\s*calc\(100vw \/ 1280px\)/);
  assert.match(css, /\.paper-homepage-shell\s*\{[^}]*width:\s*100vw;/s);
  assert.doesNotMatch(css, /--paper-home-scale:\s*min\(/);
  assert.match(css, /transform:\s*scale\(var\(--paper-home-scale\)\)/);
  assert.match(css, /\[hidden\]\s*\{\s*display:\s*none\s*!important;/);
  assert.match(css, /body\.paper-home-active::?-webkit-scrollbar\s*\{[^}]*display:\s*none;/s);
  assert.match(css, /html:has\(body\.paper-home-active\)::?-webkit-scrollbar\s*\{[^}]*display:\s*none;/s);
  assert.match(css, /body\.paper-home-active\s*\{[^}]*min-height:\s*100vh;/s);
  assert.match(css, /\.paper-open-call\s*\{[^}]*rotate:\s*-18\.66deg;[^}]*transform-origin:\s*0 0;/s);
  assert.match(css, /@font-face\s*\{\s*font-family:\s*'Stack Sans Headline';/);
  assert.match(css, /\.paper-ticket-item\s*\{[^}]*font-family:\s*'Stack Sans Headline'/s);
  assert.match(css, /\.paper-open-call span\s*\{[^}]*font-family:\s*'Stack Sans Notch'/s);
  assert.doesNotMatch(css, /Homepage reference pass|Figma fidelity pass|placeholder-icon|live-hero/);
});

test('the ticket banners scroll continuously and buttons invert on hover', () => {
  const css = readFileSync(new URL('../src/styles.css', import.meta.url), 'utf8');

  assert.match(css, /@keyframes\s+paper-ticket-scroll/);
  assert.match(css, /\.paper-ticket-marquee\s*\{[^}]*animation-name:\s*paper-ticket-scroll;[^}]*animation-timing-function:\s*linear;[^}]*animation-iteration-count:\s*infinite;/s);
  assert.match(css, /\.paper-ticket-ticker--light \.paper-ticket-marquee\s*\{[^}]*animation-direction:\s*reverse;/s);
  assert.match(css, /\.paper-hero-ticket:hover[^}]*background:\s*#000000;[^}]*color:\s*#ffffff;/s);
  assert.match(css, /\.paper-ticket-cta button:hover[^}]*background:\s*#000000;[^}]*color:\s*#ffffff;/s);
  assert.match(css, /\.paper-open-call:hover[^}]*background:\s*#ffffff;[^}]*color:\s*#000000;/s);
  assert.match(css, /@media \(prefers-reduced-motion:\s*reduce\)[\s\S]*\.paper-ticket-marquee\s*\{[^}]*animation:\s*none;/s);
});

test('the paper ticker loops gap-free and header links use motion-safe underlines', () => {
  const markup = renderPaperHomepage(copy);
  const css = readFileSync(new URL('../src/styles.css', import.meta.url), 'utf8');
  const tracks = [...markup.matchAll(/<div class="paper-ticket-track">([\s\S]*?)<\/div>/g)];

  assert.equal(tracks.length, 4);
  for (const [, track] of tracks) {
    assert.equal((track.match(/class="paper-ticket-item"/g) || []).length, 8);
  }
  assert.match(css, /\.paper-ticket-track\s*\{[^}]*gap:\s*10px;[^}]*padding-right:\s*10px;/s);
  assert.doesNotMatch(css, /\.paper-ticket-ticker--light\s*\{[^}]*justify-content:\s*flex-end;/s);
  assert.doesNotMatch(css, /\.paper-ticket-ticker--light[^}]*margin-(?:left|right):\s*auto;/s);
  assert.match(css, /\.paper-header nav \.paper-nav-link\s*\{[^}]*position:\s*relative;/s);
  assert.match(css, /\.paper-header nav \.paper-nav-link::after\s*\{[^}]*bottom:\s*-1px;[^}]*width:\s*100%;[^}]*height:\s*1px;[^}]*transform:\s*scaleX\(0\);[^}]*transform-origin:\s*left center;[^}]*transition:\s*transform var\(--duration-fast\) var\(--ease-smooth-out\);/s);
  assert.match(css, /\.paper-header nav \.paper-nav-link:hover::after,\s*\.paper-header nav \.paper-nav-link:focus-visible::after\s*\{\s*transform:\s*scaleX\(1\);\s*\}/s);
  assert.match(css, /@media \(prefers-reduced-motion:\s*reduce\)[\s\S]*\.paper-header nav \.paper-nav-link::after\s*\{[^}]*transition:\s*none;/s);
});

test('the Vite project exposes a production build command', () => {
  const packageJson = JSON.parse(readFileSync(new URL('../package.json', import.meta.url), 'utf8'));
  assert.equal(packageJson.scripts.build, 'vite build');
});
