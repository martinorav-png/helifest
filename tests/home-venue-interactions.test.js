import test from 'node:test';
import assert from 'node:assert/strict';
import { bindPaperVenueMap } from '../src/home-venue-interactions.js';

class FakeMarker {
  constructor(id, pressed = false) {
    this.dataset = { venueId: id };
    this.attributes = { 'aria-pressed': String(pressed) };
    this.listeners = new Map();
  }

  addEventListener(type, listener) { this.listeners.set(type, listener); }
  removeEventListener(type) { this.listeners.delete(type); }
  setAttribute(name, value) { this.attributes[name] = String(value); }
  getAttribute(name) { return this.attributes[name]; }
  click() { this.listeners.get('click')?.({ currentTarget: this }); }
}

class FakePanel {
  constructor() {
    const classes = new Set();
    this.classList = { add: (name) => classes.add(name), remove: (name) => classes.delete(name), has: (name) => classes.has(name) };
    this.attributes = { 'data-open': 'true' };
    this.innerHTML = 'initial panel';
  }
  setAttribute(name, value) { this.attributes[name] = String(value); }
  getAttribute(name) { return this.attributes[name]; }
}

function createMapRoot({ panel = new FakePanel(), markers = [new FakeMarker('paavli', true), new FakeMarker('ida')], chips = [] } = {}) {
  return {
    panel,
    markers,
    chips,
    querySelector(selector) { return selector === '[data-paper-venue-panel]' ? panel : null; },
    querySelectorAll(selector) { return selector.includes('.paper-map-marker[data-venue-id]') ? [...markers, ...chips] : []; },
  };
}

function withFakeTiming(run) {
  const original = {
    setTimeout: globalThis.setTimeout,
    clearTimeout: globalThis.clearTimeout,
    requestAnimationFrame: globalThis.requestAnimationFrame,
    cancelAnimationFrame: globalThis.cancelAnimationFrame,
  };
  let now = 0;
  let nextId = 1;
  const timers = new Map();
  const frames = new Map();
  const cancelledFrames = [];
  globalThis.setTimeout = (callback, delay) => {
    const id = nextId++;
    timers.set(id, { callback, dueAt: now + delay });
    return id;
  };
  globalThis.clearTimeout = (id) => timers.delete(id);
  globalThis.requestAnimationFrame = (callback) => {
    const id = nextId++;
    frames.set(id, callback);
    return id;
  };
  globalThis.cancelAnimationFrame = (id) => {
    if (frames.delete(id)) cancelledFrames.push(id);
  };
  const clock = {
    advance(milliseconds) {
      now += milliseconds;
      [...timers.entries()].filter(([, timer]) => timer.dueAt <= now).forEach(([id, timer]) => {
        timers.delete(id);
        timer.callback();
      });
    },
    runFrames() {
      [...frames.entries()].forEach(([id, callback]) => {
        frames.delete(id);
        callback();
      });
    },
    get pendingFrames() { return frames.size; },
    get cancelledFrames() { return cancelledFrames.length; },
  };
  try { run(clock); } finally { Object.assign(globalThis, original); }
}

test('bindPaperVenueMap switches after the close transition and reopens on the next animation frame', () => {
  const root = createMapRoot();
  const panel = root.panel;
  withFakeTiming((clock) => {
    const cleanup = bindPaperVenueMap(root);
    root.markers[1].click();
    assert.equal(panel.getAttribute('data-open'), 'false');
    clock.advance(219);
    assert.equal(panel.innerHTML, 'initial panel');
    assert.equal(root.markers[0].getAttribute('aria-pressed'), 'true');
    clock.advance(1);
    assert.equal(root.querySelector('[data-paper-venue-panel]'), panel);
    assert.match(panel.innerHTML, /IDA/);
    assert.equal(root.markers[0].getAttribute('aria-pressed'), 'false');
    assert.equal(root.markers[1].getAttribute('aria-pressed'), 'true');
    assert.equal(panel.getAttribute('data-open'), 'false');
    clock.runFrames();
    assert.equal(panel.getAttribute('data-open'), 'true');
    cleanup();
  });
});

test('bindPaperVenueMap ignores the selected marker and cleanup cancels pending timeout and animation-frame work', () => {
  const root = createMapRoot();
  withFakeTiming((clock) => {
    const cleanup = bindPaperVenueMap(root);
    root.markers[0].click();
    assert.equal(root.panel.getAttribute('data-open'), 'true');
    root.markers[1].click();
    cleanup();
    clock.advance(220);
    assert.equal(root.panel.innerHTML, 'initial panel');
    assert.equal(root.markers[1].listeners.has('click'), false);

    const secondRoot = createMapRoot();
    const secondCleanup = bindPaperVenueMap(secondRoot);
    secondRoot.markers[1].click();
    clock.advance(220);
    assert.equal(clock.pendingFrames, 1);
    secondCleanup();
    assert.equal(clock.cancelledFrames, 1);
    clock.runFrames();
    assert.equal(secondRoot.panel.getAttribute('data-open'), 'false');
  });
});

test('bindPaperVenueMap remounts the venue pixel island after a switch', () => {
  const mounts = [];
  const root = createMapRoot();
  root.panel.querySelector = (selector) => (selector === '[data-venue-pixel-root]' ? { id: 'pixel-host' } : null);

  withFakeTiming((clock) => {
    const cleanup = bindPaperVenueMap(root, {
      mountVenuePixel: (element, venue) => {
        mounts.push({ element, venueId: venue.id });
        return () => {};
      },
    });

    assert.equal(mounts.length, 1);
    assert.equal(mounts[0].venueId, 'paavli');

    root.markers[1].click();
    clock.advance(220);

    assert.equal(mounts.at(-1).venueId, 'ida');
    assert.match(root.panel.innerHTML, /data-venue-pixel-root/);
    cleanup();
  });
});

test('map pins and mobile chips keep the same venue selected', () => {
  const markers = [new FakeMarker('paavli', true), new FakeMarker('ida')];
  const chips = [new FakeMarker('paavli', true), new FakeMarker('ida')];
  const root = createMapRoot({ markers, chips });

  withFakeTiming((clock) => {
    const cleanup = bindPaperVenueMap(root);
    chips[1].click();
    clock.advance(220);

    assert.equal(markers[0].getAttribute('aria-pressed'), 'false');
    assert.equal(chips[0].getAttribute('aria-pressed'), 'false');
    assert.equal(markers[1].getAttribute('aria-pressed'), 'true');
    assert.equal(chips[1].getAttribute('aria-pressed'), 'true');
    cleanup();
  });
});

test('bindPaperVenueMap returns a no-op cleanup when the panel is absent', () => {
  assert.doesNotThrow(() => bindPaperVenueMap({ querySelector: () => null, querySelectorAll: () => [new FakeMarker('paavli')] })());
});

test('bindPaperVenueMap returns a no-op cleanup when markers are absent', () => {
  assert.doesNotThrow(() => bindPaperVenueMap({ querySelector: () => new FakePanel(), querySelectorAll: () => [] })());
});
