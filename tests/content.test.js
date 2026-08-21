import test from 'node:test';
import assert from 'node:assert/strict';
import { faqItems, siteCopy, ticketFacts, transportFacts } from '../src/content.js';

test('content keeps confirmed festival facts and labels pending details plainly', () => {
  assert.match(siteCopy.dates, /16–17 oktoober 2026/);
  assert.equal(ticketFacts.price, '15 EUR');
  assert.equal(ticketFacts.nights, 2);
  assert.match(ticketFacts.access, /osalevatesse kohtadesse/i);
  assert.match(ticketFacts.collection, /kätte/i);
  assert.match(transportFacts.departures, /Väljumisajad avaldatakse/i);
  assert.match(transportFacts.access, /festivalipiletit/i);
  assert.match(siteCopy.programmeIntro, /avaldamisel/i);
  assert.match(ticketFacts.purchase, /Ostulink lisandub/i);
});

test('visitor copy avoids fabricated policy and contact details', () => {
  const text = JSON.stringify({ faqItems, siteCopy, ticketFacts, transportFacts });
  assert.doesNotMatch(text, /hello@|info@|\+372|tagasimakse toimub|18\+/i);
  assert.doesNotMatch(text, /Lorem ipsum/i);
  assert.doesNotMatch(text, /seamless|innovatiivne|unustamatu|elamuslik teekond/i);
});
