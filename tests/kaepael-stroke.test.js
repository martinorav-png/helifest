import test from 'node:test';
import assert from 'node:assert/strict';
import { bindKaepaelStroke } from '../src/kaepael-stroke.js';

function fakeStrokeRoot() {
  const listeners = new Map();
  const path = { id: 'path' };
  const link = {
    querySelector(selector) {
      return selector === '.paper-hero-kaepael-stroke__path' ? path : null;
    },
    addEventListener(type, handler) {
      listeners.set(type, handler);
    },
    removeEventListener(type) {
      listeners.delete(type);
    },
  };

  return {
    path,
    listeners,
    root: {
      querySelector(selector) {
        return selector === '.paper-hero-kaepael' ? link : null;
      },
    },
  };
}

function fakeGsap() {
  const sets = [];
  const tweens = [];
  const gsap = {
    registerPlugin() {},
    set(target, vars) {
      sets.push({ target, vars });
    },
    to(target, vars) {
      tweens.push({ target, vars });
      return vars;
    },
    killTweensOf() {
      gsap.killed = true;
    },
    killed: false,
  };
  return { gsap, DrawSVGPlugin: {}, sets, tweens };
}

test('bindKaepaelStroke hides the path then draws it on hover', () => {
  const { root, path, listeners } = fakeStrokeRoot();
  const { gsap, DrawSVGPlugin, sets, tweens } = fakeGsap();
  const cleanup = bindKaepaelStroke(root, {
    gsap,
    DrawSVGPlugin,
    matchMedia: () => ({ matches: false }),
  });

  assert.deepEqual(sets, [{ target: path, vars: { drawSVG: '0% 0%' } }]);
  listeners.get('mouseenter')();
  assert.equal(tweens[0].vars.drawSVG, '0% 100%');
  assert.equal(tweens[0].vars.duration, 0.9);
  listeners.get('mouseleave')();
  assert.equal(tweens[1].vars.drawSVG, '0% 0%');
  cleanup();
  assert.equal(gsap.killed, true);
});

test('bindKaepaelStroke skips tween duration when motion is reduced', () => {
  const { root, listeners } = fakeStrokeRoot();
  const { gsap, DrawSVGPlugin, tweens } = fakeGsap();
  bindKaepaelStroke(root, {
    gsap,
    DrawSVGPlugin,
    matchMedia: () => ({ matches: true }),
  });

  listeners.get('mouseenter')();
  assert.equal(tweens[0].vars.duration, 0);
});

test('bindKaepaelStroke returns a no-op when the path is absent', () => {
  const { gsap, DrawSVGPlugin } = fakeGsap();
  assert.doesNotThrow(() => bindKaepaelStroke({ querySelector: () => null }, { gsap, DrawSVGPlugin })());
});
