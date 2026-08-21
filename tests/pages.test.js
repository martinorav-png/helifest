import test from 'node:test';
import assert from 'node:assert/strict';

import { renderRoute } from '../src/pages.js';

test('route registry renders each public utility screen in the shared shell', () => {
  const cases = [
    [{ name: 'programme', query: {} }, 'data-view="programme"'],
    [{ name: 'venues', query: {} }, 'data-view="venues"'],
    [{ name: 'venue', id: 'paavli', query: {} }, 'data-view="venue"'],
    [{ name: 'artist', id: 'artist-01', query: {} }, 'data-view="artist"'],
    [{ name: 'tickets', query: {} }, 'data-view="tickets"'],
    [{ name: 'transport', query: {} }, 'data-view="transport"'],
    [{ name: 'about', query: {} }, 'data-view="about"'],
  ];

  for (const [route, marker] of cases) {
    const page = renderRoute(route);
    assert.match(page.content, new RegExp(marker));
    assert.ok(page.active);
    assert.equal(page.tone, 'dark', `${route.name} must use the black-led inner-page system`);
  }
});

test('route registry passes query state to filtered screens', () => {
  const programme = renderRoute({
    name: 'programme',
    query: { date: '2026-10-17', venue: 'paavli', category: 'Live' },
  });
  assert.match(programme.content, /LAUPÄEV, 17\. OKTOOBER/);
  assert.match(programme.content, /value="paavli" checked/);

  const venues = renderRoute({ name: 'venues', query: { venue: 'd3' } });
  assert.match(venues.content, /data-venue-select="d3"[^>]*aria-pressed="true"/);
});
