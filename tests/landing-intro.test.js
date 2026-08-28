import test from 'node:test';
import assert from 'node:assert/strict';
import { bindLandingIntro } from '../src/landing-intro.js';

function fakeLandingRoot() {
  const mark = { id: 'mark' };
  const markLink = { id: 'mark-link' };
  const titleLines = [{ id: 't1' }, { id: 't2' }, { id: 't3' }, { id: 't4' }];
  const date = { id: 'date' };
  const navLinks = [{ id: 'n1' }, { id: 'n2' }];
  const sponsors = { id: 'sponsors' };
  const lockup = { id: 'lockup' };
  const stage = {
    id: 'stage',
    querySelector(selector) {
      if (selector === '.landing-lockup') return lockup;
      if (selector === '.landing-mark-link') return markLink;
      if (selector === '.landing-mark') return mark;
      if (selector === '.landing-date') return date;
      if (selector === '.landing-sponsors') return sponsors;
      return null;
    },
    querySelectorAll(selector) {
      if (selector === '.landing-title span') return titleLines;
      if (selector === '.landing-nav-link') return navLinks;
      return [];
    },
  };
  const attributes = { 'data-intro': 'pending', 'aria-busy': 'true' };
  const shell = {
    attributes,
    querySelector(selector) {
      if (selector === '.landing-stage') return stage;
      return stage.querySelector(selector);
    },
    querySelectorAll(selector) {
      return stage.querySelectorAll(selector);
    },
    setAttribute(name, value) {
      attributes[name] = String(value);
    },
    getAttribute(name) {
      return attributes[name];
    },
  };

  return {
    mark,
    markLink,
    titleLines,
    date,
    navLinks,
    sponsors,
    lockup,
    stage,
    shell,
    root: {
      querySelector(selector) {
        return selector === '.landing-shell' ? shell : null;
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

test('bindLandingIntro drops a large centered mark then shoots copy out of it', () => {
  const { root, markLink, titleLines, navLinks, date, shell } = fakeLandingRoot();
  const { gsap, timeline, calls } = fakeGsap();

  const cleanup = bindLandingIntro(root, { gsap, matchMedia: () => ({ matches: false }) });

  const markSet = calls.find((call) => call.type === 'set' && call.target === markLink);
  const markTweens = calls.filter((call) => call.type === 'to' && call.target === markLink);
  const titleSet = calls.find((call) => call.type === 'set' && call.target === titleLines);
  const navSet = calls.find((call) => call.type === 'set' && call.target === navLinks);
  const dateSet = calls.find((call) => call.type === 'set' && call.target === date);
  const titleTo = calls.find((call) => call.type === 'to' && call.target === titleLines);
  const navTo = calls.find((call) => call.type === 'to' && call.target === navLinks);
  const dateTo = calls.find((call) => call.type === 'to' && call.target === date);

  assert.equal(markSet.vars.scale > 1, true);
  assert.equal(markSet.vars.x > 0, true);
  assert.equal(markSet.vars.y < 0, true);
  assert.equal(markTweens[0].vars.y, 0);
  assert.equal(markTweens[1].vars.x, 0);
  assert.equal(markTweens[1].vars.scale, 1);
  assert.equal(titleSet.vars.x < 0, true);
  assert.equal(navSet.vars.x < titleSet.vars.x, true);
  assert.equal(dateSet.vars.y < 0, true);
  assert.equal(titleTo.vars.x, 0);
  assert.equal(navTo.vars.x, 0);
  assert.equal(dateTo.vars.y, 0);
  assert.equal(navTo.vars.duration > titleTo.vars.duration, true);
  assert.equal(dateTo.position > titleTo.position, true);
  assert.equal(typeof timeline.options.onComplete, 'function');
  timeline.options.onComplete();
  assert.equal(shell.getAttribute('data-intro'), 'done');
  cleanup();
  assert.equal(timeline.killed, true);
});

test('bindLandingIntro skips motion when the visitor prefers reduced motion', () => {
  const { root, shell } = fakeLandingRoot();
  const { gsap, calls } = fakeGsap();

  bindLandingIntro(root, { gsap, matchMedia: () => ({ matches: true }) });

  assert.equal(shell.getAttribute('data-intro'), 'done');
  assert.equal(calls.length, 0);
});

test('bindLandingIntro returns a no-op when the landing shell is absent', () => {
  const { gsap } = fakeGsap();
  assert.doesNotThrow(() => bindLandingIntro({ querySelector: () => null }, { gsap })());
});
