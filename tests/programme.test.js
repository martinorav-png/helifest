import test from 'node:test';
import assert from 'node:assert/strict';
import { filterEvents } from '../src/programme.js';

const events = [
  { id: 'fri-ida', date: '2026-10-16', venueId: 'ida', category: 'Live' },
  { id: 'sat-hall', date: '2026-10-17', venueId: 'hall', category: 'DJ' },
];

test('filterEvents returns events matching every active programme filter', () => {
  assert.deepEqual(
    filterEvents(events, { date: '2026-10-16', venueId: 'ida', category: 'Live' }),
    [events[0]],
  );
});

test('filterEvents returns no entries when filters have no combined match', () => {
  assert.deepEqual(
    filterEvents(events, { date: '2026-10-16', venueId: 'hall', category: 'All' }),
    [],
  );
});
