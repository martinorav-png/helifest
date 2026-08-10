import test from 'node:test';
import assert from 'node:assert/strict';
import { selectedAttribute } from '../src/form.js';

test('selectedAttribute marks the currently active option', () => {
  assert.equal(selectedAttribute('Live', 'Live'), ' selected');
  assert.equal(selectedAttribute('DJ set', 'Live'), '');
});
