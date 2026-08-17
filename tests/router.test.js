import test from 'node:test';
import assert from 'node:assert/strict';
import { parseRoute, routeHref } from '../src/router.js';

test('parseRoute resolves every visitor route and preserves detail context', () => {
  assert.deepEqual(parseRoute('#home'), { name: 'home', id: null, query: {} });
  assert.deepEqual(parseRoute('#programme?date=2026-10-16&venue=paavli'), {
    name: 'programme', id: null, query: { date: '2026-10-16', venue: 'paavli' },
  });
  assert.deepEqual(parseRoute('#venues'), { name: 'venues', id: null, query: {} });
  assert.deepEqual(parseRoute('#venue/paavli?from=programme'), { name: 'venue', id: 'paavli', query: { from: 'programme' } });
  assert.deepEqual(parseRoute('#artist/artist-01'), { name: 'artist', id: 'artist-01', query: {} });
  assert.equal(parseRoute('#tickets').name, 'tickets');
  assert.equal(parseRoute('#transport').name, 'transport');
  assert.equal(parseRoute('#about').name, 'about');
  assert.equal(parseRoute('#something-else').name, 'not-found');
});

test('routeHref encodes identifiers and query values', () => {
  assert.equal(routeHref('programme', null, { date: '2026-10-16', venue: 'Uus Laine' }), '#programme?date=2026-10-16&venue=Uus+Laine');
  assert.equal(routeHref('venue', 'paavli', { from: 'programme' }), '#venue/paavli?from=programme');
});
