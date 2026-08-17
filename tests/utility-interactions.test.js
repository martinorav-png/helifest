import test from 'node:test';
import assert from 'node:assert/strict';

import { programmeHref, selectionHref } from '../src/utility-interactions.js';

test('programme controls preserve useful state and omit default filters', () => {
  assert.equal(
    programmeHref(
      { date: '2026-10-16', venueId: 'paavli', category: 'DJ set' },
      { date: '2026-10-17' },
    ),
    '#programme?date=2026-10-17&venue=paavli&category=DJ+set',
  );
  assert.equal(
    programmeHref({ date: '2026-10-16', venueId: 'All', category: 'All' }),
    '#programme?date=2026-10-16',
  );
});

test('map selections use addressable route state', () => {
  assert.equal(selectionHref('venues', 'paavli'), '#venues?venue=paavli');
  assert.equal(selectionHref('transport', 'd3'), '#transport?stop=d3');
});
