import test from 'node:test';
import assert from 'node:assert/strict';
import { utilityNavKey, utilitySwipeDirection } from '../src/site-shell.js';
import { UTILITY_SWIPE_DURATION, playUtilitySwipe, utilitySwipeAxis } from '../src/utility-swipe.js';

test('utilityNavKey maps detail routes onto the header items', () => {
  assert.equal(utilityNavKey('programme'), 'programme');
  assert.equal(utilityNavKey('venues'), 'venues');
  assert.equal(utilityNavKey('tickets'), 'tickets');
  assert.equal(utilityNavKey('transport'), 'transport');
  assert.equal(utilityNavKey('about'), 'about');
  assert.equal(utilityNavKey('venue'), 'venues');
  assert.equal(utilityNavKey('artist'), 'programme');
  assert.equal(utilityNavKey('home'), null);
});

test('utilitySwipeDirection follows the header order', () => {
  assert.equal(utilitySwipeDirection('programme', 'venues'), 1);
  assert.equal(utilitySwipeDirection('programme', 'about'), 1);
  assert.equal(utilitySwipeDirection('about', 'tickets'), -1);
  assert.equal(utilitySwipeDirection('transport', 'venues'), -1);
  assert.equal(utilitySwipeDirection('venues', 'venues'), 0);
  assert.equal(utilitySwipeDirection('programme', 'programme'), 0);
  assert.equal(utilitySwipeDirection(null, 'tickets'), 0);
});

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

test('utilitySwipeAxis uses a vertical swipe on narrow viewports', () => {
  assert.equal(utilitySwipeAxis(() => ({ matches: false })), 'x');
  assert.equal(utilitySwipeAxis(() => ({ matches: true })), 'y');
});

test('playUtilitySwipe sends a later header page in from the right', () => {
  const outgoing = { id: 'out' };
  const incoming = { id: 'in' };
  const { gsap, timeline, calls } = fakeGsap();
  const settled = [];

  const cleanup = playUtilitySwipe(outgoing, incoming, 1, {
    gsap,
    onSettled() {
      settled.push(true);
    },
  });

  const incomingSet = calls.find((call) => call.type === 'set' && call.target === incoming);
  const outgoingTo = calls.find((call) => call.type === 'to' && call.target === outgoing);
  const incomingTo = calls.find((call) => call.type === 'to' && call.target === incoming);

  assert.equal(incomingSet.vars.xPercent, 100);
  assert.equal(outgoingTo.vars.xPercent, -100);
  assert.equal(incomingTo.vars.xPercent, 0);
  assert.equal(outgoingTo.position, 0);
  assert.equal(incomingTo.position, 0);
  assert.equal(timeline.options.defaults.duration, UTILITY_SWIPE_DURATION);

  timeline.options.onComplete();
  assert.deepEqual(settled, [true]);
  cleanup();
  assert.equal(timeline.killed, true);
});

test('playUtilitySwipe sends an earlier header page in from the left', () => {
  const outgoing = { id: 'out' };
  const incoming = { id: 'in' };
  const { gsap, calls } = fakeGsap();

  playUtilitySwipe(outgoing, incoming, -1, { gsap });

  const incomingSet = calls.find((call) => call.type === 'set' && call.target === incoming);
  const outgoingTo = calls.find((call) => call.type === 'to' && call.target === outgoing);

  assert.equal(incomingSet.vars.xPercent, -100);
  assert.equal(outgoingTo.vars.xPercent, 100);
});

test('playUtilitySwipe sends a later header page in from below on mobile', () => {
  const outgoing = { id: 'out' };
  const incoming = { id: 'in' };
  const { gsap, calls } = fakeGsap();

  playUtilitySwipe(outgoing, incoming, 1, { gsap, axis: 'y', viewportHeight: 800 });

  const incomingSet = calls.find((call) => call.type === 'set' && call.target === incoming);
  const outgoingTo = calls.find((call) => call.type === 'to' && call.target === outgoing);

  assert.equal(incomingSet.vars.y, 800);
  assert.equal(outgoingTo.vars.y, -800);
});

test('playUtilitySwipe sends an earlier header page in from above on mobile', () => {
  const outgoing = { id: 'out' };
  const incoming = { id: 'in' };
  const { gsap, calls } = fakeGsap();

  playUtilitySwipe(outgoing, incoming, -1, { gsap, axis: 'y', viewportHeight: 800 });

  const incomingSet = calls.find((call) => call.type === 'set' && call.target === incoming);
  const outgoingTo = calls.find((call) => call.type === 'to' && call.target === outgoing);

  assert.equal(incomingSet.vars.y, -800);
  assert.equal(outgoingTo.vars.y, 800);
});

test('playUtilitySwipe settles immediately without a direction', () => {
  const settled = [];
  playUtilitySwipe({ id: 'out' }, { id: 'in' }, 0, {
    onSettled() {
      settled.push(true);
    },
  });
  assert.deepEqual(settled, [true]);
});
