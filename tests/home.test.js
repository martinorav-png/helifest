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
const landingCssUrl = new URL('../src/landing.css', import.meta.url);
const readStyles = () => `${readFileSync(baseCssUrl, 'utf8')}\n${existsSync(correctionsCssUrl) ? readFileSync(correctionsCssUrl, 'utf8') : ''}`;
const readCorrections = () => existsSync(correctionsCssUrl) ? readFileSync(correctionsCssUrl, 'utf8') : '';
const readLanding = () => existsSync(landingCssUrl) ? readFileSync(landingCssUrl, 'utf8') : '';

test('renderPaperHomepage returns the 24.08 landing lockup', () => {
  const markup = renderPaperHomepage(copy);

  assert.match(markup, /^<div class="landing-shell t-panel-slide" data-open="false" data-intro="pending" aria-busy="true">/);
  assert.equal((markup.match(/class="landing-canvas"/g) || []).length, 1);
  assert.match(markup, /class="landing-mark"/);
  assert.match(markup, /<h1 class="landing-title" id="landing-title"><span>Tallinna<\/span><span>klubiskeene<\/span><span>showcase<\/span><span>festival<\/span><\/h1>/);
  assert.match(markup, /<p class="landing-date" aria-label="16\.–17\. oktoober">16\.–17\.10<\/p>/);
  assert.match(markup, /<a class="landing-nav-link" href="#programme">Ajakava<\/a>/);
  assert.match(markup, /<a class="landing-nav-link" href="#venues">Paigad<\/a>/);
  assert.match(markup, /<a class="landing-nav-link" href="#tickets">Piletid<\/a>/);
  assert.match(markup, /<a class="landing-nav-link" href="#transport">Transport<\/a>/);
  assert.match(markup, /<a class="landing-nav-link" href="#about">Meist<\/a>/);
  assert.match(markup, /<a class="landing-nav-link" href="#about">Open call<\/a>/);
  assert.equal((markup.match(/data-sponsor-loop-root/g) || []).length, 1);
  assert.match(markup, /class="landing-sponsors"/);
  assert.match(markup, /<\/nav><\/div><\/div><section class="landing-sponsors"/);
  assert.doesNotMatch(markup, />FAQ</);
  assert.doesNotMatch(markup, /paper-closing-gradient/);
});

test('renderPaperHomepage removes the previous homepage structures', () => {
  const markup = renderPaperHomepage(copy);

  assert.doesNotMatch(markup, /live-hero/);
  assert.doesNotMatch(markup, /venue-feature-map/);
  assert.doesNotMatch(markup, /icon-strip/);
  assert.doesNotMatch(markup, /placeholder-icon/);
  assert.doesNotMatch(markup, /paper-homepage-shell|paper-homepage-canvas/);
  assert.doesNotMatch(markup, /paper-ticket-ticker|paper-header|paper-hero|paper-venue|paper-footer/);
  assert.doesNotMatch(markup, /utility-menu-button|pixelmaplite|KÄEPAEL/);
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

test('the application mounts the 24.08 landing and routed utility screens', () => {
  const source = readFileSync(new URL('../src/app.js', import.meta.url), 'utf8');

  assert.match(source, /import \{ renderPaperHomepage \} from '\.\/home\.js'/);
  assert.match(source, /import \{ bindLandingIntro \} from '\.\/landing-intro\.js'/);
  assert.match(source, /import \{ bindLandingExit, playLandingReturn, prefersReducedMotion \} from '\.\/landing-transition\.js'/);
  assert.match(source, /import \{ playUtilitySwipe, utilitySwipeAxis \} from '\.\/utility-swipe\.js'/);
  assert.match(source, /import \{ playProgrammeSwap, programmeSwapDirection \} from '\.\/programme-swap\.js'/);
  assert.match(source, /swapProgrammeInPlace\(/);
  assert.match(source, /playProgrammeSwap\(results, outgoing, incoming/);
  assert.match(source, /import \{ renderSiteShell, revealRoutePanel, syncUtilityHeader, utilityNavKey, utilitySwipeDirection \} from '\.\/site-shell\.js'/);
  assert.match(source, /import \{ mountSponsorLoop \} from '\.\/sponsor-loop\.jsx'/);
  assert.match(source, /import \{ mountVenuePixel \} from '\.\/venue-pixel\.jsx'/);
  assert.match(source, /let cleanupLandingIntro = \(\) => \{\};/);
  assert.match(source, /let cleanupLandingExit = \(\) => \{\};/);
  assert.match(source, /let cleanupLandingReturn = \(\) => \{\};/);
  assert.match(source, /let cleanupSponsorLoop = \(\) => \{\};/);
  assert.match(source, /clearMountedFeatures\(\);/);
  assert.match(source, /cleanupLandingIntro = bindLandingIntro\(main\);/);
  assert.match(source, /cleanupLandingExit = bindLandingExit\(main,/);
  assert.match(source, /prepareCover: mountLandingCover/);
  assert.match(source, /landing-route-cover-frame/);
  assert.match(source, /onSettled: settleLandingCover/);
  assert.match(source, /is-settling/);
  assert.match(source, /requestAnimationFrame\(\(\) => \{\s*requestAnimationFrame\(commit\)/);
  assert.match(source, /playLandingReturn\(/);
  assert.match(source, /returnToLanding\(/);
  assert.match(source, /ignoreNextHashChange/);
  assert.match(source, /cleanupSponsorLoop = mountSponsorLoop\(main\.querySelector\('\[data-sponsor-loop-root\]'\)\);/);
  assert.match(source, /cleanupUtilityInteractions = bindUtilityInteractions\(root\);/);
  assert.match(source, /revealRoutePanel\(main\);/);
  assert.match(source, /renderPaperHomepage\(/);
  assert.match(source, /parseRoute\(window\.location\.hash\)/);
  assert.match(source, /swipeToUtility\(/);
  assert.match(source, /playUtilitySwipe\(outgoingBody, incomingBody/);
  assert.match(source, /axis: utilitySwipeAxis\(\)/);
  assert.match(source, /syncUtilityHeader\(/);
  assert.match(source, /utilitySwipeDirection\(/);
  assert.match(source, /main\.innerHTML = renderSiteShell/);
  assert.match(source, /window\.addEventListener\('hashchange', render\)/);
  assert.doesNotMatch(source, /bindPaperVenueMap|bindOpenCallMorph|bindKaepaelStroke/);
  assert.doesNotMatch(source, /renderMarquee|renderVenueFeature|renderVisitorHero/);
});

test('the landing sponsor row reserves the Figma footer geometry for the React island', () => {
  const css = readLanding();

  assert.match(css, /\.landing-sponsors\s*\{[^}]*width:\s*100%;[^}]*height:\s*165px;/s);
  assert.match(css, /\.landing-sponsor-loop\s*\{[^}]*width:\s*100%;/s);
  assert.match(css, /\.landing-shell\[data-exiting='true'\]\s*\{[^}]*overflow:\s*hidden;/s);
  assert.match(css, /\.landing-route-cover\s*\{[^}]*position:\s*fixed;[^}]*inset:\s*0;[^}]*border-radius:\s*0;/s);
  assert.match(css, /\.landing-route-cover-frame\s*\{[^}]*border-radius:\s*0;/s);
  assert.match(css, /\.landing-route-cover\.is-settling \.landing-route-cover-frame\s*\{[^}]*transform:\s*none/s);
  assert.match(css, /\.landing-route-cover\.is-returning\s*\{[^}]*pointer-events:\s*none;/s);
  assert.match(css, /\.landing-sponsor-loop \.logoloop__list\s*\{[^}]*list-style:\s*none;[^}]*gap:\s*var\(--logoloop-gap\);/s);
  assert.match(css, /\.landing-sponsor-loop \.logoloop__item\s*\{[^}]*margin-right:\s*0;/s);
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
  assert.match(css, /#main-content\.is-swiping\s*\{[^}]*overflow:\s*hidden;/s);
  assert.match(css, /\.utility-site\.is-swipe-pane\s*\{[^}]*position:\s*absolute;/s);
  assert.match(css, /#main-content\.is-swiping \.utility-site\.is-incoming\s*\{[^}]*background:\s*transparent;/s);
  assert.match(css, /#main-content\.is-swiping \.utility-site\.is-incoming > \.paper-header\s*\{[^}]*visibility:\s*hidden;/s);
  assert.match(css, /#main-content\.is-swiping \.utility-swipe-body\s*\{[^}]*will-change:\s*transform;/s);
});

test('the landing canvas scales the 1280×848 Figma frame to the viewport', () => {
  const landing = readLanding();
  const css = readCorrections();

  assert.match(landing, /\.landing-canvas\s*\{[^}]*width:\s*1280px;[^}]*height:\s*848px;/s);
  assert.match(landing, /\.landing-canvas\s*\{[^}]*transform:\s*scale\(min\(100vw \/ 1280, 100dvh \/ 848\)\);/s);
  assert.match(landing, /\.landing-lockup\s*\{[^}]*left:\s*96px;[^}]*top:\s*292px;/s);
  assert.match(landing, /\.landing-nav\s*\{[^}]*left:\s*888px;[^}]*top:\s*276px;/s);
  assert.match(landing, /\.landing-title\s*\{[^}]*font-size:\s*52px;/s);
  assert.match(landing, /\.landing-nav-link\s*\{[^}]*font-size:\s*52px;/s);
  assert.match(landing, /\.landing-mark-link\s*\{[^}]*width:\s*248px;[^}]*height:\s*209px;/s);
  assert.match(landing, /\.landing-nav-link:hover,[\s\S]*--nav-wght:\s*700;/);
  assert.match(landing, /@media\s*\(prefers-reduced-motion:\s*reduce\)/);
  assert.match(landing, /@media\s*\(max-width:\s*1079px\)[\s\S]*\.landing-canvas\s*\{[^}]*transform:\s*none;/s);
  assert.match(css, /\.paper-header\s*\{[^}]*width:\s*100%;[^}]*max-width:\s*none;/s);
  assert.match(css, /body\.utility-active \.utility-site\s*\{[^}]*width:\s*100%;[^}]*max-width:\s*none;/s);
  assert.match(css, /--paper-header-h:\s*60px;/);
  assert.match(css, /@media\s*\(max-width:\s*1079px\)[\s\S]*\.paper-header \.utility-navigation\s*\{[^}]*transform:\s*translateY\(-100%\);/s);
  assert.match(css, /\.paper-header \.utility-navigation\.is-open\s*\{[^}]*transform:\s*translateY\(0\);/s);
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

test('utility header links keep motion-safe underlines', () => {
  const css = readStyles();

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
  assert.match(html, /<link rel="stylesheet" href="\/src\/styles\.css"\s*\/?>[\s\S]*<link rel="stylesheet" href="\/src\/corrections\.css"\s*\/?>[\s\S]*<link rel="stylesheet" href="\/src\/landing\.css"\s*\/?>/);
});
