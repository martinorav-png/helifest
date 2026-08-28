import test from 'node:test';
import assert from 'node:assert/strict';
import { renderProgrammeView } from '../src/views/programme-view.js';

test('programme view renders a dense ruled schedule with entity links', () => {
  const html = renderProgrammeView({ date: '2026-10-16', venueId: 'All', category: 'All' });

  assert.match(html, /<h1[^>]+id="page-title"[^>]*>AJAKAVA<\/h1>/);
  assert.match(html, /aria-label="Vali festivali päev"/);
  assert.match(html, /aria-pressed="true"[^>]*>R 16\.10/);
  assert.match(html, /data-filter-panel/);
  assert.match(html, /class="programme-swap"/);
  assert.match(html, /data-programme-date="2026-10-16"/);
  assert.match(html, /class="programme-row"/);
  assert.match(html, /legend>PAIK/);
  assert.match(html, /legend>VORM/);
  assert.match(html, /href="#artist\/artist-01\?from=programme/);
  assert.match(html, /href="#venue\/ida\?from=programme/);
  assert.match(html, /Artist avalikustatakse peagi/);
  assert.match(html, />Näidis</);
  assert.doesNotMatch(html, /card|rounded|pill/i);
  assert.doesNotMatch(html, /masthead-mark|HE<br>LI/);
  assert.doesNotMatch(html, /Lorem ipsum/i);
});

test('programme view exposes a useful empty state for impossible filters', () => {
  const html = renderProgrammeView({ date: '2026-10-16', venueId: 'kumu', category: 'Listening' });

  assert.match(html, /Ükski valik ei sobi/);
  assert.match(html, /data-clear-filters/);
  assert.match(html, /Tühjenda filtrid/);
});
