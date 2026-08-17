import test from 'node:test';
import assert from 'node:assert/strict';
import { faqItems, siteCopy, ticketFacts, transportFacts } from '../src/content.js';

test('content keeps confirmed festival facts and labels pending details plainly', () => {
  assert.match(siteCopy.dates, /Lorem ipsum/i);
  assert.equal(ticketFacts.price, '15 EUR');
  assert.equal(ticketFacts.nights, 2);
  assert.match(ticketFacts.access, /Lorem ipsum/i);
  assert.match(ticketFacts.collection, /Lorem ipsum/i);
  assert.match(transportFacts.departures, /Lorem ipsum/i);
  assert.match(transportFacts.access, /Lorem ipsum/i);
});

test('visitor copy avoids fabricated policy and contact details', () => {
  const text = JSON.stringify({ faqItems, siteCopy, ticketFacts, transportFacts });
  assert.doesNotMatch(text, /hello@|info@|\+372|tagasimakse toimub|18\+/i);
  assert.match(text, /Lorem ipsum/);
  assert.doesNotMatch(text, /seamless|innovatiivne|unustamatu|elamuslik teekond/i);
});
