import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { renderTicketsView } from '../src/views/tickets-view.js';
import { renderTransportView } from '../src/views/transport-view.js';
import { renderAboutView } from '../src/views/about-view.js';

test('tickets view presents the pass as a physical ticket without inventing checkout', () => {
  const html = renderTicketsView();
  const css = readFileSync(new URL('../src/styles.css', import.meta.url), 'utf8');
  const corrections = readFileSync(new URL('../src/corrections.css', import.meta.url), 'utf8');
  assert.match(html, /class="pass-ticket"/);
  assert.match(html, /class="tickets-kaepael"/);
  assert.match(html, /src="\/assets\/KÄEPAEL\.png"/);
  assert.match(html, /<h1[^>]+id="page-title"[^>]*>15 EUR<\/h1>/);
  assert.match(html, /16–17 oktoober 2026/);
  assert.match(html, /disabled/);
  assert.match(html, /<details/);
  assert.doesNotMatch(html, /stripe|ticketmaster|sold out/i);
  assert.match(css, /\.tickets-kaepael\s*\{[^}]*background:\s*#ffffff;/s);
  assert.match(css, /\.tickets-kaepael img\s*\{[^}]*filter:\s*none;/s);
  assert.doesNotMatch(corrections, /body\.utility-active \.tickets-kaepael img/);
});

test('transport view lists confirmed stops and labels pending departures', () => {
  const html = renderTransportView();
  assert.match(html, /<h1[^>]+id="page-title"[^>]*>TRANSPORT<\/h1>/);
  assert.match(html, /Väljumisajad avaldatakse enne festivali/);
  assert.match(html, /festivalipiletit/);
  assert.match(html, /Paavli/);
  assert.match(html, /Telliskivi/);
  assert.match(html, /Kesklinn/);
  assert.match(html, /Noblessner/);
  assert.match(html, /class="transport-stop"/);
  assert.doesNotMatch(html, /transport-map-embed|maps\.google\.com/);
  assert.doesNotMatch(html, /Lorem ipsum/i);
});

test('about view uses source concept and honest policy placeholders', () => {
  const html = renderAboutView();
  assert.match(html, /<h1[^>]+id="page-title"[^>]*>Üks linn\.<br>Ühes rütmis\.<\/h1>/);
  assert.match(html, /klubiskeene showcase/);
  assert.match(html, /<details/);
  assert.match(html, /data-sponsor-loop-root/);
  assert.match(html, /id="contact"/);
  assert.doesNotMatch(html, /info@|\+372|18\+/i);
  assert.doesNotMatch(html, /Lorem ipsum/i);
});
