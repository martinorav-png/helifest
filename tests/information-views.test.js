import test from 'node:test';
import assert from 'node:assert/strict';
import { renderTicketsView } from '../src/views/tickets-view.js';
import { renderTransportView } from '../src/views/transport-view.js';
import { renderAboutView } from '../src/views/about-view.js';

test('tickets view presents the pass as a physical ticket without inventing checkout', () => {
  const html = renderTicketsView();
  assert.match(html, /class="pass-ticket"/);
  assert.match(html, /<h1[^>]+id="page-title"[^>]*>15 EUR<\/h1>/);
  assert.match(html, /16–17 oktoober 2026/);
  assert.match(html, /disabled/);
  assert.match(html, /<details/);
  assert.doesNotMatch(html, /stripe|ticketmaster|sold out/i);
});

test('transport view is a blank placeholder', () => {
  const html = renderTransportView();
  assert.match(html, /<h1[^>]+id="page-title"[^>]*>TRANSPORT<\/h1>/);
  assert.doesNotMatch(html, /transport-map-embed|transport-stop|maps\.google\.com/);
});

test('about view uses source concept and honest policy placeholders', () => {
  const html = renderAboutView();
  assert.match(html, /<h1[^>]+id="page-title"[^>]*>LOREM IPSUM,<br>DOLOR SIT AMET\.<\/h1>/);
  assert.match(html, /Lorem ipsum/);
  assert.match(html, /<details/);
  assert.match(html, /data-sponsor-loop-root/);
  assert.doesNotMatch(html, /info@|\+372|18\+/i);
});
