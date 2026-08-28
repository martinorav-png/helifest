import test from 'node:test';
import assert from 'node:assert/strict';
import {
  PROGRAMME_SWAP_DURATION,
  PROGRAMME_SWAP_LEAD,
  playProgrammeSwap,
  programmeSwapDirection,
  programmeSwapStagger,
} from '../src/programme-swap.js';

test('programmeSwapDirection follows day, venue, and category order', () => {
  assert.equal(programmeSwapDirection({ date: '2026-10-16' }, { date: '2026-10-17' }), 1);
  assert.equal(programmeSwapDirection({ date: '2026-10-17' }, { date: '2026-10-16' }), -1);
  assert.equal(programmeSwapDirection(
    { date: '2026-10-16', venueId: 'All' },
    { date: '2026-10-16', venueId: 'ida' },
  ), 1);
  assert.equal(programmeSwapDirection(
    { date: '2026-10-16', venueId: 'hall', category: 'All' },
    { date: '2026-10-16', venueId: 'ida', category: 'All' },
  ), -1);
  assert.equal(programmeSwapDirection(
    { date: '2026-10-16', venueId: 'All', category: 'All' },
    { date: '2026-10-16', venueId: 'All', category: 'Live' },
  ), 1);
  assert.equal(programmeSwapDirection(
    { date: '2026-10-16', venueId: 'All', category: 'Listening' },
    { date: '2026-10-16', venueId: 'All', category: 'Live' },
  ), -1);
  assert.equal(programmeSwapDirection(
    { date: '2026-10-16', venueId: 'All', category: 'All' },
    { date: '2026-10-16', venueId: 'All', category: 'All' },
  ), 0);
});

test('programmeSwapStagger keeps a long list overlapping instead of waiting in line', () => {
  assert.equal(programmeSwapStagger(1), 0);
  assert.equal(programmeSwapStagger(2), 0.04);
  assert.ok(programmeSwapStagger(20) < 0.04);
  assert.ok(programmeSwapStagger(20) * 19 <= 0.28 + 1e-9);
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

function pane(items) {
  return {
    querySelectorAll(selector) {
      if (String(selector).includes('programme-')) return items;
      return [];
    },
    offsetHeight: 120,
    parentNode: true,
    classList: { add() {}, remove() {} },
    remove() {
      pane.removed = true;
    },
    style: {},
  };
}

test('playProgrammeSwap staggers outgoing rows then overlaps incoming rows', () => {
  const outgoingItems = [{ id: 'out-1' }, { id: 'out-2' }, { id: 'out-3' }];
  const incomingItems = [{ id: 'in-1' }, { id: 'in-2' }];
  const outgoing = pane(outgoingItems);
  const incoming = pane(incomingItems);
  const results = {
    classList: { add() {}, remove() {} },
    style: {},
    appendChild() {},
  };
  const { gsap, timeline, calls } = fakeGsap();
  const settled = [];

  playProgrammeSwap(results, outgoing, incoming, 1, {
    gsap,
    axis: 'x',
    onSettled() {
      settled.push(true);
    },
  });

  const outgoingTo = calls.find((call) => call.type === 'to' && call.vars.xPercent === -100);
  const incomingTo = calls.find((call) => call.type === 'to' && call.vars.xPercent === 0);
  const incomingSet = calls.find((call) => call.type === 'set' && call.vars.xPercent === 100);

  assert.equal(incomingSet.vars.xPercent, 100);
  assert.equal(outgoingTo.vars.xPercent, -100);
  assert.equal(incomingTo.vars.xPercent, 0);
  assert.equal(outgoingTo.vars.stagger.each, programmeSwapStagger(3));
  assert.equal(incomingTo.vars.stagger.each, programmeSwapStagger(2));
  assert.equal(outgoingTo.position, 0);
  assert.equal(incomingTo.position, PROGRAMME_SWAP_LEAD);
  assert.equal(timeline.options.defaults.duration, PROGRAMME_SWAP_DURATION);

  timeline.options.onComplete();
  assert.deepEqual(settled, [true]);
});

test('playProgrammeSwap sends later filters up on mobile', () => {
  const outgoingItems = [{ id: 'out' }];
  const incomingItems = [{ id: 'in' }];
  const { gsap, calls } = fakeGsap();

  playProgrammeSwap(pane([]), pane(outgoingItems), pane(incomingItems), 1, {
    gsap,
    axis: 'y',
  });

  const incomingSet = calls.find((call) => call.type === 'set' && call.vars.yPercent === 100);
  const outgoingTo = calls.find((call) => call.type === 'to' && call.vars.yPercent === -100);

  assert.equal(incomingSet.vars.yPercent, 100);
  assert.equal(outgoingTo.vars.yPercent, -100);
});
