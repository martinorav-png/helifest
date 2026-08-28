import test from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import { renderSiteShell, revealRoutePanel, syncUtilityHeader, utilityNavKey, utilitySwipeDirection } from '../src/site-shell.js';

test('utility shell exposes semantic Estonian navigation and active state', () => {
  const html = renderSiteShell({ active: 'programme', content: '<h1 id="page-title">Ajakava</h1>', tone: 'light' });

  assert.match(html, /<header class="paper-header"/);
  assert.match(html, /<nav[^>]+aria-label="Primary"/);
  assert.match(html, /href="#programme"[^>]+aria-current="page"/);
  assert.match(html, />Ajakava</);
  assert.match(html, />Paigad</);
  assert.match(html, />Piletid</);
  assert.match(html, />Transport</);
  assert.match(html, />Meist</);
  assert.doesNotMatch(html, />FAQ</);
  assert.match(html, /class="paper-nav-link"/);
  assert.match(html, /class="paper-wordmark"/);
  assert.match(html, /aria-controls="utility-navigation"/);
  assert.match(html, /class="utility-navigation-panel"/);
  assert.match(html, /src="\/assets\/helihorizontal\.svg"/);
  assert.doesNotMatch(html, /paper-wordmark\.png/);
  assert.doesNotMatch(html, /utility-nav-link/);
  assert.match(html, /class="utility-swipe-body"/);
  assert.match(html, /id="utility-content" class="t-panel-slide" data-open="false" aria-busy="true" data-route="programme"/);
  assert.equal(utilityNavKey('venue'), 'venues');
  assert.equal(utilitySwipeDirection('programme', 'tickets'), 1);
});

test('syncUtilityHeader moves the current page underline onto the destination item', () => {
  const links = {
    programme: mockNavLink('#programme', 'page'),
    venues: mockNavLink('#venues'),
    tickets: mockNavLink('#tickets'),
  };

  syncUtilityHeader({
    querySelectorAll: () => Object.values(links),
  }, 'venues');

  assert.equal(links.programme.current, null);
  assert.equal(links.venues.current, 'page');
  assert.equal(links.tickets.current, null);
});

function mockNavLink(href, current = null) {
  return {
    getAttribute(name) {
      if (name === 'href') return href;
      if (name === 'aria-current') return current;
      return null;
    },
    setAttribute(name, value) {
      if (name === 'aria-current') current = value;
    },
    removeAttribute(name) {
      if (name === 'aria-current') current = null;
    },
    get current() {
      return current;
    },
  };
}

test('route panels reveal on the next animation frame without an artificial delay', () => {
  const attributes = { 'data-open': 'false', 'aria-busy': 'true' };
  const panel = {
    offsetWidth: 320,
    getAttribute: (name) => attributes[name],
    setAttribute: (name, value) => { attributes[name] = String(value); },
  };
  const frames = [];
  const root = { querySelector: () => panel };

  revealRoutePanel(root, (callback) => frames.push(callback));

  assert.equal(panel.getAttribute('data-open'), 'false');
  assert.equal(panel.getAttribute('aria-busy'), 'true');
  assert.equal(frames.length, 1);
  frames.shift()();
  assert.equal(panel.getAttribute('data-open'), 'true');
  assert.equal(panel.getAttribute('aria-busy'), 'false');
});

test('utility shell renders a restrained footer without a fact rail', () => {
  const html = renderSiteShell({ active: 'tickets', content: '<h1 id="page-title">Piletid</h1>', tone: 'dark' });

  assert.match(html, /Programmi detailid on näidisena/);
  assert.doesNotMatch(html, /utility-fact-rail/);
  assert.doesNotMatch(html, /rounded|shadow|gradient/i);
});

test('the dark inner-page layer preserves contrast across formerly light views', () => {
  const cssUrl = new URL('../src/corrections.css', import.meta.url);
  const css = existsSync(cssUrl) ? readFileSync(cssUrl, 'utf8') : '';

  assert.match(css, /body\.utility-active\s*\{[^}]*--heli-rule:\s*var\(--correction-dark-rule\);/s);
  assert.match(css, /body\.utility-active #utility-content,[\s\S]*\{[^}]*color:\s*var\(--correction-paper\);[^}]*background:\s*var\(--correction-ink\);/s);
  assert.match(css, /body\.utility-active \.programme-row:hover\s*\{[^}]*color:\s*#ffffff;[^}]*background:\s*#171717;/s);
  assert.match(css, /body\.utility-active \.entity-title-lockup\s*\{[^}]*color:\s*var\(--correction-paper\);[^}]*background:\s*var\(--correction-ink\);/s);
  assert.match(css, /body\.utility-active \.about-sponsors img,[\s\S]*\{[^}]*filter:\s*invert\(1\);/s);
});
