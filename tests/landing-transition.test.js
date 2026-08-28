import test from 'node:test';
import assert from 'node:assert/strict';
import {
  LANDING_COPY_FADE_AT,
  LANDING_COVER_FROM_SCALE,
  LANDING_COVER_TO_SCALE,
  LANDING_EXIT_SCALE,
  LANDING_RETURN_ZOOM_AT,
  LANDING_SWOOP_AT,
  LANDING_SWOOP_DURATION,
  LANDING_SWOOP_EASE,
  LANDING_ZOOM_DURATION,
  bindLandingExit,
  gapTransformOrigin,
  hashFromLink,
  playLandingReturn,
} from '../src/landing-transition.js';

function rect(left, top, width, height) {
  return {
    left,
    top,
    right: left + width,
    bottom: top + height,
    width,
    height,
  };
}

function fakeLandingRoot() {
  const lockup = {
    id: 'lockup',
    getBoundingClientRect: () => rect(119, 327, 478, 220),
  };
  const nav = {
    id: 'nav',
    getBoundingClientRect: () => rect(875, 311, 280, 280),
  };
  const stage = {
    id: 'stage',
    getBoundingClientRect: () => rect(0, 0, 1280, 848),
    querySelector(selector) {
      if (selector === '.landing-lockup') return lockup;
      if (selector === '.landing-nav') return nav;
      if (selector === '.landing-sponsors') return sponsors;
      return null;
    },
  };
  const sponsors = { id: 'sponsors' };
  const attributes = { 'data-exiting': 'false', 'aria-busy': 'false' };
  const shell = {
    attributes,
    querySelector(selector) {
      if (selector === '.landing-stage') return stage;
      return stage.querySelector(selector);
    },
    setAttribute(name, value) {
      attributes[name] = String(value);
    },
    getAttribute(name) {
      return attributes[name];
    },
  };
  const listeners = new Map();
  const link = {
    href: '#programme',
    getAttribute(name) {
      return name === 'href' ? '#programme' : null;
    },
    closest(selector) {
      return selector === '.landing-nav-link' ? link : null;
    },
  };

  return {
    lockup,
    nav,
    stage,
    sponsors,
    shell,
    link,
    listeners,
    root: {
      querySelector(selector) {
        return selector === '.landing-shell' ? shell : null;
      },
      addEventListener(type, handler) {
        listeners.set(type, handler);
      },
      removeEventListener(type, handler) {
        if (listeners.get(type) === handler) listeners.delete(type);
      },
    },
  };
}

function fakeGsap() {
  const calls = [];
  const timeline = {
    to(target, vars, position) {
      calls.push({ type: 'to', target, vars, position });
      return timeline;
    },
    kill() {
      timeline.killed = true;
    },
    killed: false,
  };

  return {
    calls,
    timeline,
    gsap: {
      set(target, vars) {
        calls.push({ type: 'set', target, vars });
      },
      timeline(options) {
        timeline.options = options;
        return timeline;
      },
      killTweensOf() {
        calls.push({ type: 'killTweensOf' });
      },
    },
  };
}

function click(handler, link, extras = {}) {
  const event = {
    target: link,
    button: 0,
    metaKey: false,
    ctrlKey: false,
    shiftKey: false,
    altKey: false,
    defaultPrevented: false,
    preventDefault() {
      event.defaultPrevented = true;
    },
    ...extras,
  };
  handler(event);
  return event;
}

test('gapTransformOrigin sits in the white space between lockup and nav', () => {
  const lockup = { getBoundingClientRect: () => rect(119, 327, 478, 220) };
  const nav = { getBoundingClientRect: () => rect(875, 311, 280, 280) };
  const stage = { getBoundingClientRect: () => rect(0, 0, 1280, 848) };
  const origin = gapTransformOrigin(lockup, nav, stage);
  const [x, y] = origin.split(' ').map((value) => Number.parseFloat(value));

  assert.equal(x > 46 && x < 58, true);
  assert.equal(y > 35 && y < 55, true);
});

test('hashFromLink reads a hash href', () => {
  assert.equal(hashFromLink({ getAttribute: () => '#tickets' }), '#tickets');
});

test('bindLandingExit zooms the stage into the gap then the next page comes from far and fills the screen', () => {
  const { root, stage, sponsors, shell, lockup, nav, link, listeners } = fakeLandingRoot();
  const { gsap, timeline, calls } = fakeGsap();
  const cover = { id: 'cover' };
  const prepared = [];
  const committed = [];
  const settled = [];
  let started = 0;

  const cleanup = bindLandingExit(root, {
    gsap,
    matchMedia: () => ({ matches: false }),
    prepareCover(href) {
      prepared.push(href);
      return cover;
    },
    commitHash(href) {
      committed.push(href);
    },
    onStart() {
      started += 1;
    },
    onSettled(href) {
      settled.push(href);
    },
  });

  const event = click(listeners.get('click'), link);

  assert.equal(event.defaultPrevented, true);
  assert.equal(shell.getAttribute('data-exiting'), 'true');
  assert.equal(started, 1);
  assert.deepEqual(committed, ['#programme']);
  assert.deepEqual(prepared, ['#programme']);

  const stageSet = calls.find((call) => call.type === 'set' && call.target === stage);
  const coverSet = calls.find((call) => call.type === 'set' && call.target === cover);
  const stageTo = calls.find((call) => call.type === 'to' && call.target === stage);
  const sponsorTo = calls.find((call) => call.type === 'to' && call.target === sponsors);
  const copyFadeTo = calls.find((call) => call.type === 'to' && Array.isArray(call.target) && call.target.includes(lockup) && call.target.includes(nav));
  const coverScaleTo = calls.find((call) => call.type === 'to' && call.target === cover && call.vars.scale === LANDING_COVER_TO_SCALE);
  const coverFadeTo = calls.find((call) => call.type === 'to' && call.target === cover && call.vars.autoAlpha === 1);

  assert.match(stageSet.vars.transformOrigin, /%/);
  assert.equal(coverSet.vars.scale, LANDING_COVER_FROM_SCALE);
  assert.equal(coverSet.vars.autoAlpha, 0);
  assert.equal(coverSet.vars.scale < 0.2, true);
  assert.match(coverSet.vars.transformOrigin, /%/);
  assert.equal(stageTo.vars.scale, LANDING_EXIT_SCALE);
  assert.equal(stageTo.vars.duration, LANDING_ZOOM_DURATION);
  assert.equal(sponsorTo.vars.autoAlpha, 0);
  assert.equal(copyFadeTo.vars.autoAlpha, 0);
  assert.equal(copyFadeTo.position, LANDING_COPY_FADE_AT);
  assert.equal(copyFadeTo.position > 0.4, true);
  assert.equal(coverFadeTo.vars.autoAlpha, 1);
  assert.equal(coverFadeTo.vars.ease, 'power1.out');
  assert.equal(coverScaleTo.vars.scale, LANDING_COVER_TO_SCALE);
  assert.equal(coverScaleTo.vars.scale, 1);
  assert.equal(coverScaleTo.vars.ease, LANDING_SWOOP_EASE);
  assert.equal(coverScaleTo.vars.ease, 'power4.inOut');
  assert.equal(coverScaleTo.vars.duration, LANDING_SWOOP_DURATION);
  assert.equal(coverScaleTo.position, LANDING_SWOOP_AT);
  assert.equal(coverFadeTo.position, LANDING_SWOOP_AT);
  assert.equal(coverScaleTo.position < stageTo.vars.duration, true);

  timeline.options.onComplete();
  const cleared = calls.find((call) => call.type === 'set' && typeof call.vars.clearProps === 'string');
  assert.match(cleared.vars.clearProps, /transform/);
  assert.deepEqual(settled, ['#programme']);
  cleanup();
  assert.equal(timeline.killed, true);
  assert.equal(listeners.has('click'), false);
});

test('bindLandingExit skips motion when the visitor prefers reduced motion', () => {
  const { root, link, listeners } = fakeLandingRoot();
  const { gsap, calls } = fakeGsap();
  const immediate = [];

  bindLandingExit(root, {
    gsap,
    matchMedia: () => ({ matches: true }),
    navigateImmediately(href) {
      immediate.push(href);
    },
    prepareCover() {
      throw new Error('cover should not mount when motion is reduced');
    },
  });

  click(listeners.get('click'), link);
  assert.deepEqual(immediate, ['#programme']);
  assert.equal(calls.length, 0);
});

test('bindLandingExit ignores modified clicks and home links', () => {
  const { root, link, listeners } = fakeLandingRoot();
  const { gsap, calls } = fakeGsap();
  const prepared = [];

  bindLandingExit(root, {
    gsap,
    matchMedia: () => ({ matches: false }),
    prepareCover(href) {
      prepared.push(href);
      return { id: 'cover' };
    },
  });

  const modified = click(listeners.get('click'), link, { metaKey: true });
  assert.equal(modified.defaultPrevented, false);

  const homeLink = {
    getAttribute: () => '#home',
    closest: (selector) => (selector === '.landing-nav-link' ? homeLink : null),
  };
  click(listeners.get('click'), homeLink);
  assert.equal(prepared.length, 0);
  assert.equal(calls.length, 0);
});

test('bindLandingExit returns a no-op when the landing shell is absent', () => {
  const { gsap } = fakeGsap();
  assert.doesNotThrow(() => bindLandingExit({ querySelector: () => null }, { gsap })());
});

test('playLandingReturn shrinks the page away then zooms the landing back out', () => {
  const { shell, stage, sponsors } = fakeLandingRoot();
  const cover = { id: 'cover' };
  const { gsap, timeline, calls } = fakeGsap();
  const settled = [];

  const cleanup = playLandingReturn(shell, cover, {
    gsap,
    onSettled() {
      settled.push(true);
    },
  });

  const stageSet = calls.find((call) => call.type === 'set' && call.target === stage);
  const coverSet = calls.find((call) => call.type === 'set' && call.target === cover);
  const stageTo = calls.find((call) => call.type === 'to' && call.target === stage);
  const sponsorTo = calls.find((call) => call.type === 'to' && call.target === sponsors);
  const coverScaleTo = calls.find((call) => call.type === 'to' && call.target === cover && call.vars.scale != null);
  const coverFadeTo = calls.find((call) => call.type === 'to' && call.target === cover && call.vars.autoAlpha === 0);

  assert.equal(stageSet.vars.scale, LANDING_EXIT_SCALE);
  assert.equal(coverSet.vars.scale, 1);
  assert.equal(coverScaleTo.vars.scale, LANDING_COVER_FROM_SCALE);
  assert.equal(coverScaleTo.vars.ease, 'power4.out');
  assert.equal(coverScaleTo.vars.duration, LANDING_SWOOP_DURATION);
  assert.equal(coverFadeTo.position, LANDING_SWOOP_DURATION - 0.18);
  assert.equal(stageTo.vars.scale, 1);
  assert.equal(stageTo.vars.ease, 'power3.out');
  assert.equal(stageTo.position, LANDING_RETURN_ZOOM_AT);
  assert.equal(sponsorTo.vars.autoAlpha, 1);
  assert.equal(stageTo.position > 0, true);

  timeline.options.onComplete();
  assert.deepEqual(settled, [true]);
  cleanup();
  assert.equal(timeline.killed, true);
});

test('playLandingReturn settles immediately when the landing shell is incomplete', () => {
  const settled = [];
  const cleanup = playLandingReturn(null, { id: 'cover' }, {
    onSettled() {
      settled.push(true);
    },
  });
  assert.deepEqual(settled, [true]);
  assert.doesNotThrow(() => cleanup());
});
