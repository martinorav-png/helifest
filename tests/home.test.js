import test from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import { renderPaperHero, renderPaperHomepage } from '../src/home.js';

const copy = {
  marquee: 'GET YOUR TICKET NOW',
  marqueeLabel: 'Festival tickets',
  venueTitle: 'Paavli Kultuurivabrik',
  venueBody: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
  sponsorsLabel: 'HELI venues and partners',
};

const baseCssUrl = new URL('../src/styles.css', import.meta.url);
const correctionsCssUrl = new URL('../src/corrections.css', import.meta.url);
const readStyles = () => `${readFileSync(baseCssUrl, 'utf8')}\n${existsSync(correctionsCssUrl) ? readFileSync(correctionsCssUrl, 'utf8') : ''}`;
const readCorrections = () => existsSync(correctionsCssUrl) ? readFileSync(correctionsCssUrl, 'utf8') : '';

test('renderPaperHomepage returns the complete Paper finale composition', () => {
  const markup = renderPaperHomepage(copy);

  assert.match(markup, /^<div class="paper-homepage-shell t-panel-slide" data-open="false" aria-busy="true">/);
  assert.equal((markup.match(/class="paper-homepage-canvas"/g) || []).length, 1);
  assert.equal((markup.match(/class="paper-ticket-ticker/g) || []).length, 2);
  assert.equal((markup.match(/class="paper-ticket-marquee"/g) || []).length, 2);
  assert.equal((markup.match(/class="paper-ticket-track"/g) || []).length, 4);
  assert.doesNotMatch(markup, /\/assets\/visitor-hero\.png/);
  assert.doesNotMatch(markup, /paper-hero-art/);
  assert.match(markup, /data-venue-pixel-root/);
  assert.doesNotMatch(markup, /\/assets\/paavli-night\.png/);
  assert.equal((markup.match(/data-sponsor-loop-root/g) || []).length, 1);
  assert.doesNotMatch(markup, /paper-sponsor-crop|paper-sponsor-source|\/assets\/heli-sponsors\.png/);
  assert.match(markup, /<a class="paper-wordmark" href="#home" aria-label="HELI avaleht">/);
  assert.match(markup, /<button class="utility-menu-button"[^>]*aria-controls="utility-navigation"/);
  assert.match(markup, /src="\/assets\/helihorizontal\.svg"/);
  assert.doesNotMatch(markup, /paper-wordmark\.png/);
  assert.match(markup, /class="paper-open-call"/);
  assert.match(markup, /class="paper-map-stage"/);
  assert.equal((markup.match(/class="paper-map-marker"/g) || []).length, 8);
  assert.equal((markup.match(/class="paper-map-chip"/g) || []).length, 8);
  assert.match(markup, /src="\/assets\/pixelmaplite\.png"/);
  assert.doesNotMatch(markup, /heart2\.png|heartpink\.png|tallinn5\.png/);
  assert.match(markup, /<a class="paper-nav-link" href="#programme">Ajakava<\/a>/);
  assert.match(markup, /<a class="paper-nav-link" href="#venues">Paigad<\/a>/);
  assert.match(markup, /<a class="paper-nav-link" href="#tickets">Piletid<\/a>/);
  assert.match(markup, /<a class="paper-nav-link" href="#transport">Transport<\/a>/);
  assert.match(markup, /<a class="paper-nav-link" href="#about">Meist<\/a>/);
  assert.doesNotMatch(markup, />FAQ</);
  assert.match(markup, /Paavli Kultuurivabrik/);
  assert.match(markup, /class="paper-sponsors"/);
  assert.match(markup, /class="paper-footer"/);
  assert.match(markup, /<p>16–17 oktoober 2026<\/p>/);
  assert.doesNotMatch(markup, /paper-closing-gradient/);
});

test('renderPaperHomepage removes the previous homepage structures', () => {
  const markup = renderPaperHomepage(copy);

  assert.doesNotMatch(markup, /live-hero/);
  assert.doesNotMatch(markup, /venue-feature-map/);
  assert.doesNotMatch(markup, /icon-strip/);
  assert.doesNotMatch(markup, /placeholder-icon/);
});

test('all absolute homepage asset URLs are available from the public asset root', () => {
  const requiredAssets = [
    'public/assets/helihorizontal.svg',
    'public/assets/Manrope-VariableFont_wght.ttf',
    'public/assets/heli-star-dark.svg',
    'public/assets/heli-star-light.svg',
    'public/assets/pixelmaplite.png',
    'public/assets/ribbon.png',
    'public/assets/KÄEPAEL.png',
    'public/assets/Group 80.png',
    'public/assets/paavli-night.png',
    'public/assets/sponsors/tallinn.svg',
    'public/assets/shapes/Rectangle 58.svg',
    'public/assets/shapes/Ellipse 3.svg',
    'public/assets/shapes/Star 2.svg',
  ];

  requiredAssets.forEach((asset) => assert.equal(existsSync(new URL(`../${asset}`, import.meta.url)), true, asset));
});

test('the application preserves the Paper homepage and mounts routed utility screens', () => {
  const source = readFileSync(new URL('../src/app.js', import.meta.url), 'utf8');

  assert.match(source, /import \{ renderPaperHomepage \} from '\.\/home\.js'/);
  assert.match(source, /import \{ renderSiteShell, revealRoutePanel \} from '\.\/site-shell\.js'/);
  assert.match(source, /import \{ bindPaperVenueMap \} from '\.\/home-venue-interactions\.js'/);
  assert.match(source, /import \{ bindOpenCallMorph \} from '\.\/open-call-morph\.js'/);
  assert.match(source, /import \{ bindKaepaelStroke \} from '\.\/kaepael-stroke\.js'/);
  assert.match(source, /import \{ mountSponsorLoop \} from '\.\/sponsor-loop\.jsx'/);
  assert.match(source, /import \{ mountVenuePixel \} from '\.\/venue-pixel\.jsx'/);
  assert.match(source, /let cleanupPaperVenueMap = \(\) => \{\};/);
  assert.match(source, /let cleanupSponsorLoop = \(\) => \{\};/);
  assert.match(source, /let cleanupOpenCallMorph = \(\) => \{\};/);
  assert.match(source, /let cleanupKaepaelStroke = \(\) => \{\};/);
  assert.match(source, /clearMountedFeatures\(\);/);
  assert.match(source, /cleanupPaperVenueMap = bindPaperVenueMap\(main, \{ mountVenuePixel \}\);/);
  assert.match(source, /cleanupOpenCallMorph = bindOpenCallMorph\(main\);/);
  assert.match(source, /cleanupKaepaelStroke = bindKaepaelStroke\(main\);/);
  assert.match(source, /cleanupSponsorLoop = mountSponsorLoop\(main\.querySelector\('\[data-sponsor-loop-root\]'\)\);/);
  assert.match(source, /cleanupUtilityInteractions = bindUtilityInteractions\(main\);/);
  assert.match(source, /revealRoutePanel\(main\);/);
  assert.match(source, /renderPaperHomepage\(/);
  assert.match(source, /parseRoute\(window\.location\.hash\)/);
  assert.match(source, /main\.innerHTML = renderSiteShell\(page\)/);
  assert.match(source, /window\.addEventListener\('hashchange', render\)/);
  assert.doesNotMatch(source, /renderMarquee|renderVenueFeature|renderVisitorHero/);
});

test('the sponsor row reserves the Paper geometry for the React island', () => {
  const css = readCorrections();

  assert.match(css, /\.paper-sponsors\s*\{[^}]*min-height:\s*165px;/s);
  assert.match(css, /\.paper-sponsor-loop\s*\{[^}]*width:\s*100%;/s);
  assert.doesNotMatch(css, /\.paper-sponsor-crop|\.paper-sponsor-source/);
});

test('renderPaperHero uses the live HELI mark and Group 80 type lockup', () => {
  const markup = renderPaperHero();

  assert.match(markup, /^<section class="paper-hero" aria-labelledby="paper-hero-title">/);
  assert.doesNotMatch(markup, /paper-hero-route/);
  assert.match(markup, /<div class="paper-hero-lockup">/);
  assert.match(markup, /<svg class="paper-hero-mark"[^>]*viewBox="0 0 944 796"/);
  assert.match(markup, /class="heli-mark-h"/);
  assert.match(markup, /class="heli-mark-e"/);
  assert.match(markup, /class="heli-mark-l"/);
  assert.match(markup, /class="heli-mark-i"/);
  assert.match(markup, /d="M184 121H332V0H516V368H332V247H184V368H0V0H184V121Z"/);
  assert.match(markup, /d="M944 126H760V142H944V226H760V242H944V368H576V0H944V126Z"/);
  assert.match(markup, /d="M184 670H516V796H0V428H184V670Z"/);
  assert.match(markup, /d="M944 796H576V570H944V796ZM944 554H576V428H944V554Z"/);
  assert.doesNotMatch(markup, /M15 177H501V0H516V368/);
  assert.match(markup, /<h1 class="paper-hero-title" id="paper-hero-title"><span>Tallinna<\/span><span>klubiskeene<\/span><span>showcase<\/span><span>festival<\/span><\/h1>/);
  assert.match(markup, /<p class="paper-hero-date" aria-label="16\.–17\. oktoober">16\.-17\.10<\/p>/);
  assert.match(markup, /<div class="paper-hero-date-pattern" aria-hidden="true">/);
  assert.match(markup, /paper-hero-date-pattern-row/);
  assert.doesNotMatch(markup, /paper-hero-lockup-art|Group%2080|paper-hero-a11y/);
  assert.match(markup, /<p class="paper-hero-summary">Üks pilet kaheks õhtuks avastada Tallinna peidetud pärleid\.<\/p>/);
  assert.match(markup, /<a class="paper-programme-hit" href="#programme">Vaata programmi<\/a>/);
  assert.doesNotMatch(markup, /paper-wristband|paper-wristband-heli|paper-wristband-date/);
  assert.match(markup, /<a class="paper-hero-kaepael" href="#tickets" aria-label="Osta HELI festivalipilet">/);
  assert.match(markup, /<svg class="paper-hero-kaepael-stroke"[^>]*fill="none"/);
  assert.match(markup, /<path class="paper-hero-kaepael-stroke__idle" d="M1 1H770V88H1Z" fill="none">/);
  assert.match(markup, /<path class="paper-hero-kaepael-stroke__path" d="M1 1H770V88H1Z" fill="none">/);
  assert.match(markup, /<img src="\/assets\/KÄEPAEL\.png" alt="" width="4000" height="304">/);
  assert.match(markup, /<a class="paper-open-call" href="#about" aria-label="Open call">/);
  assert.match(markup, /<svg class="paper-open-call-morph"/);
  assert.equal((markup.match(/class="paper-open-call-shape paper-open-call-shape--(?:square|circle|star)"/g) || []).length, 3);
  assert.match(markup, /<span class="paper-open-call-copy">Open call<\/span>/);
  assert.equal((markup.match(/<img\b/g) || []).length, 1);
  assert.doesNotMatch(markup, /visitor-hero\.png|paper-hero-art/);
});

test('the hero keeps its identity fixed and limits motion to authored one-shot moments', () => {
  const css = readCorrections();

  assert.match(css, /\.paper-hero\s*\{[^}]*height:\s*499px;[^}]*display:\s*grid;/s);
  assert.match(css, /\.paper-hero-lockup\s*\{[^}]*display:\s*grid;[^}]*max-width:\s*500px;/s);
  assert.match(css, /\.paper-hero-mark\s*\{[^}]*width:\s*100%;/s);
  assert.match(css, /\.paper-hero-title\s*\{[^}]*align-self:\s*stretch;[^}]*display:\s*flex;[^}]*flex-direction:\s*column;[^}]*justify-content:\s*space-between;/s);
  assert.match(css, /@keyframes\s+paper-hero-date-scroll/);
  assert.match(css, /\.paper-hero-date-pattern-track\s*\{[^}]*gap:\s*0\.9em;/s);
  assert.match(css, /\.paper-hero-kaepael\s*\{[^}]*width:\s*100%;[^}]*padding:\s*0;/s);
  assert.match(css, /\.paper-hero-kaepael-stroke__idle\s*\{[^}]*stroke-width:\s*1px;/s);
  assert.match(css, /\.paper-hero-kaepael-stroke__path\s*\{[^}]*vector-effect:\s*non-scaling-stroke;/s);
  assert.match(css, /\.paper-hero-mark \.heli-mark-h,[\s\S]*\.paper-hero-mark \.heli-mark-i\s*\{[^}]*animation:\s*none;/s);
  assert.doesNotMatch(css, /paper-hero-route|paper-route-draw|paper-wristband-trace/);
  assert.match(css, /\.paper-open-call\s*\{[^}]*width:\s*141px;[^}]*height:\s*141px;/s);
  assert.match(css, /\.paper-open-call-morph\s*\{[^}]*inset:\s*0;/s);
  assert.doesNotMatch(css, /@keyframes\s+paper-open-call-(?:square|circle|star)/);
  assert.match(css, /@media\s*\(prefers-reduced-motion:\s*reduce\)[\s\S]*\.t-panel-slide\s*\{\s*transition:\s*none/s);
});

test('the Paper map keeps its stage geometry and accessible marker transitions', () => {
  const css = readCorrections();

  assert.match(css, /\.paper-map-frame\s*\{[^}]*width:\s*100%;[^}]*height:\s*100%;/s);
  assert.match(css, /\.paper-map-art\s*\{[^}]*object-fit:\s*contain;/s);
  assert.match(css, /\.paper-venue\s*\{[^}]*grid-template-columns:\s*minmax\(0,\s*1fr\)\s*minmax\(0,\s*1\.11fr\);/s);
  assert.match(css, /\.paper-venue\s*\{[^}]*background:\s*#(?:fff|ffffff);/s);
  assert.match(css, /\.paper-map-marker\s*\{[^}]*width:\s*44px;[^}]*height:\s*44px;/s);
  assert.match(css, /\.paper-map-marker__pixel\s*\{[^}]*width:\s*18px;[^}]*height:\s*18px;[^}]*background:\s*#(?:fff|ffffff);/s);
  assert.match(css, /--correction-pink:\s*#f6b3d1;/);
  assert.match(css, /\.paper-map-marker\[aria-pressed=['"]true['"]\]\s+\.paper-map-marker__pixel\s*\{[^}]*width:\s*22px;[^}]*height:\s*22px;/s);
  assert.match(css, /\.paper-map-chip\s*\{[^}]*min-height:\s*44px;/s);
  assert.match(css, /\.t-panel-slide\s*\{[^}]*filter:\s*blur\(var\(--panel-blur\)\);[^}]*pointer-events:\s*none;/s);
  assert.match(css, /\.t-panel-slide\[data-open="true"\]\s*\{[^}]*pointer-events:\s*auto;/s);
});

test('the homepage canvas scales the 1280 artboard to the viewport like production', () => {
  const css = readCorrections();
  const base = readFileSync(baseCssUrl, 'utf8');

  assert.match(css, /--paper-home-scale:\s*calc\(100vw \/ 1280px\);/);
  assert.match(css, /--paper-canvas-h:\s*1406px;/);
  assert.match(css, /\.paper-homepage-canvas\s*\{[^}]*width:\s*1280px;[^}]*transform:\s*scale\(var\(--paper-home-scale\)\);/s);
  assert.match(base, /--paper-home-scale:\s*calc\(100vw \/ 1280px\);/);
  assert.match(css, /\.paper-header\s*\{[^}]*width:\s*100%;[^}]*max-width:\s*none;/s);
  assert.match(css, /body\.utility-active \.utility-site\s*\{[^}]*width:\s*100%;[^}]*max-width:\s*none;/s);
  assert.match(css, /--paper-header-h:\s*60px;/);
  assert.match(css, /--paper-ticker-dark-h:\s*40px;/);
  assert.match(css, /--paper-ticker-light-h:\s*40px;/);
  assert.match(css, /\.paper-header\s*\{[^}]*height:\s*var\(--paper-header-h\);/s);
  assert.match(css, /\.paper-ticket-ticker--dark\s*\{[^}]*height:\s*var\(--paper-ticker-dark-h\);/s);
  assert.match(css, /\.paper-homepage-canvas\s*\{[^}]*background:\s*var\(--correction-paper\);/s);
  assert.match(css, /\.paper-ticket-ticker--light\s*\{[^}]*height:\s*var\(--paper-ticker-light-h\);/s);
  assert.match(css, /body\.paper-home-active \.paper-hero-lockup \.paper-hero-date\s*\{[^}]*font-size:\s*calc\(103 \/ 1019 \* 100cqi\);/s);
  assert.match(css, /@media\s*\(max-width:\s*1079px\)/);
  assert.match(css, /@media\s*\(max-width:\s*767px\)/);
  assert.match(css, /@media\s*\(max-width:\s*1079px\)[\s\S]*\.paper-header \.utility-navigation\s*\{[^}]*display:\s*none;/s);
  assert.match(css, /\.paper-header \.utility-navigation\.is-open\s*\{[^}]*display:\s*flex;/s);
  assert.match(css, /@media\s*\(max-width:\s*1079px\)[\s\S]*\.paper-homepage-canvas\s*\{[^}]*transform:\s*none;/s);
  assert.match(css, /@media\s*\(max-width:\s*767px\)[\s\S]*\.paper-map-frame\s*\{[^}]*height:\s*min\(72vw,\s*340px\);/s);
});

test('the ticket banners scroll continuously and buttons invert on hover', () => {
  const css = readStyles();
  const corrections = readCorrections();

  assert.match(css, /@keyframes\s+paper-ticket-scroll/);
  assert.match(css, /\.paper-ticket-marquee\s*\{[^}]*animation-name:\s*paper-ticket-scroll;[^}]*animation-timing-function:\s*linear;[^}]*animation-iteration-count:\s*infinite;/s);
  assert.match(css, /\.paper-ticket-ticker--light \.paper-ticket-marquee\s*\{[^}]*animation-direction:\s*reverse;/s);
  assert.match(css, /\.paper-map-tickets:hover[^}]*background:\s*#ffffff;[^}]*color:\s*#000000;/s);
  assert.match(corrections, /--correction-neutral:\s*#d7d7d2;/);
  assert.match(corrections, /\.paper-ticket-ticker--dark\s*\{[^}]*background:\s*var\(--correction-neutral\);/s);
  assert.match(corrections, /\.paper-ticket-ticker--dark \.paper-ticket-marquee\s*\{[^}]*animation-duration:\s*(?:7[6-9]|8[0-4])s;/s);
  assert.match(css, /@media \(prefers-reduced-motion:\s*reduce\)[\s\S]*\.paper-ticket-marquee\s*\{[^}]*animation:\s*none;/s);
});

test('the paper ticker loops gap-free and header links use motion-safe underlines', () => {
  const markup = renderPaperHomepage(copy);
  const css = readStyles();
  const corrections = readCorrections();
  const tracks = [...markup.matchAll(/<div class="paper-ticket-track">([\s\S]*?)<\/div>/g)];

  assert.equal(tracks.length, 4);
  assert.equal((tracks[0][1].match(/class="paper-ticket-item"/g) || []).length, 24);
  assert.match(tracks[0][1], /Paavli Kultuurivabrik/);
  assert.match(tracks[0][1], /Tallinn/);
  assert.doesNotMatch(tracks[0][1], /GET YOUR TICKET NOW/);
  assert.equal((tracks[2][1].match(/class="paper-ticket-item"/g) || []).length, 8);
  assert.match(tracks[2][1], /GET YOUR TICKET NOW/);
  assert.match(markup, /paper-ticket-ticker--dark/);
  assert.match(corrections, /\.paper-ticket-ticker--dark\s*\{[^}]*background:\s*var\(--correction-neutral\);/s);
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

test('the responsive correction stylesheet loads after the legacy base styles', () => {
  const html = readFileSync(new URL('../index.html', import.meta.url), 'utf8');
  assert.match(html, /<link rel="stylesheet" href="\/src\/styles\.css"\s*\/?>[\s\S]*<link rel="stylesheet" href="\/src\/corrections\.css"\s*\/?>/);
});
