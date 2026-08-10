import test from 'node:test';
import assert from 'node:assert/strict';
import { translate } from '../src/i18n.js';

test('translate returns Estonian copy by default and English when requested', () => {
  assert.equal(translate('ee', 'nav.programme'), 'Programm');
  assert.equal(translate('en', 'nav.programme'), 'Programme');
});

test('translate keeps unknown keys visible for content review', () => {
  assert.equal(translate('ee', 'missing.copy'), 'missing.copy');
});
