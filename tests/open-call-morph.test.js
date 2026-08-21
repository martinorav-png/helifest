import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { bindOpenCallMorph } from '../src/open-call-morph.js';
import { renderPaperHero } from '../src/home.js';

function fakeMorphRoot() {
  const live = { id: 'live' };
  const square = { id: 'paper-open-call-square' };
  const circle = { id: 'paper-open-call-circle' };
  const star = { id: 'paper-open-call-star' };
  const svg = {
    querySelector(selector) {
      if (selector === '.paper-open-call-morph__live') return live;
      if (selector === '#paper-open-call-square') return square;
      if (selector === '#paper-open-call-circle') return circle;
      if (selector === '#paper-open-call-star') return star;
      return null;
    },
    querySelectorAll(selector) {
      return selector === 'rect, circle' ? [square, circle] : [];
    },
  };

  return {
    live,
    square,
    circle,
    star,
    root: {
      querySelector(selector) {
        return selector === '.paper-open-call-morph' ? svg : null;
      },
    },
  };
}

function fakeGsap() {
  const morphs = [];
  const timeline = {
    to(_target, vars) {
      morphs.push(vars.morphSVG);
      return timeline;
    },
    kill() {
      timeline.killed = true;
    },
    killed: false,
  };

  return {
    morphs,
    timeline,
    gsap: {
      registerPlugin() {},
      timeline() { return timeline; },
    },
    MorphSVGPlugin: {
      convertToPath() {},
    },
  };
}

test('Open Call markup uses the three public shape assets as morph targets', () => {
  const markup = renderPaperHero();
  const starAsset = readFileSync(new URL('../public/assets/shapes/Star 2.svg', import.meta.url), 'utf8');
  const squareAsset = readFileSync(new URL('../public/assets/shapes/Rectangle 58.svg', import.meta.url), 'utf8');
  const circleAsset = readFileSync(new URL('../public/assets/shapes/Ellipse 3.svg', import.meta.url), 'utf8');

  assert.match(squareAsset, /<rect width="188" height="188"/);
  assert.match(circleAsset, /<circle cx="100" cy="100" r="100"/);
  assert.match(starAsset, /M98\.9102 0L121\.471 34\.5653/);
  assert.match(markup, /<svg class="paper-open-call-morph"/);
  assert.match(markup, /id="paper-open-call-square"[^>]*width="188" height="188"/);
  assert.match(markup, /id="paper-open-call-circle"[^>]*r="100"/);
  assert.match(markup, /id="paper-open-call-star"[^>]*d="M103\.9102 0L126\.471 34\.5653/);
  assert.match(markup, /class="paper-open-call-morph__live"/);
});

test('bindOpenCallMorph loops square to circle to star', () => {
  const { root, circle, star, square } = fakeMorphRoot();
  const { gsap, MorphSVGPlugin, morphs, timeline } = fakeGsap();
  const cleanup = bindOpenCallMorph(root, {
    gsap,
    MorphSVGPlugin,
    matchMedia: () => ({ matches: false }),
  });

  assert.deepEqual(morphs, [circle, star, square]);
  cleanup();
  assert.equal(timeline.killed, true);
});

test('bindOpenCallMorph stays on the square when motion is reduced', () => {
  const { root } = fakeMorphRoot();
  const { gsap, MorphSVGPlugin, morphs } = fakeGsap();
  const cleanup = bindOpenCallMorph(root, {
    gsap,
    MorphSVGPlugin,
    matchMedia: () => ({ matches: true }),
  });

  assert.deepEqual(morphs, []);
  assert.doesNotThrow(() => cleanup());
});

test('bindOpenCallMorph returns a no-op when the morph svg is absent', () => {
  const { gsap, MorphSVGPlugin } = fakeGsap();
  assert.doesNotThrow(() => bindOpenCallMorph({ querySelector: () => null }, { gsap, MorphSVGPlugin })());
});
