import test from 'node:test';
import assert from 'node:assert/strict';
import { renderSiteShell } from '../src/site-shell.js';

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
  assert.match(html, /src="\/assets\/helihorizontal\.svg"/);
  assert.doesNotMatch(html, /paper-wordmark\.png/);
  assert.doesNotMatch(html, /utility-nav-link/);
});

test('utility shell renders a restrained footer without a fact rail', () => {
  const html = renderSiteShell({ active: 'tickets', content: '<h1 id="page-title">Piletid</h1>', tone: 'dark' });

  assert.match(html, /Lorem ipsum dolor sit amet/);
  assert.doesNotMatch(html, /utility-fact-rail/);
  assert.doesNotMatch(html, /rounded|shadow|gradient/i);
});
