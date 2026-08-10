import test from 'node:test';
import assert from 'node:assert/strict';
import {
  paperVenueRecords,
  getPaperVenue,
  renderPaperVenuePanel,
  renderPaperVenueMarkers,
} from '../src/home-venues.js';

test('paper venue records retain the specified venues, placeholders, and map positions', () => {
  assert.equal(paperVenueRecords.length, 11);
  assert.equal(paperVenueRecords.filter((venue) => venue.isPlaceholder).length, 3);
  assert.deepEqual(
    paperVenueRecords.map(({ x, y }) => [x, y]),
    [[241, 113], [295, 190], [366, 158], [344, 180], [393, 209], [327, 160], [334, 225], [258, 265], [500, 251], [398, 300], [323, 270]],
  );
});

test('photographed venue panels render their Vite-managed image and accurate alt text', () => {
  const photographedVenues = [
    ['paavli', '/assets/paavli-night.png', 'People gathered at Paavli Kultuurivabrik’s illuminated outdoor terrace at dusk'],
    ['hall', new URL('../assets/places/hall.jpg', import.meta.url).href, 'HALL’s brick exterior illuminated at night'],
    ['kumu', new URL('../assets/places/kumu.jpg', import.meta.url).href, 'Kumu Art Museum’s glass-and-stone exterior in daylight'],
    ['d3', new URL('../assets/places/d3.webp', import.meta.url).href, 'D3’s mural-covered courtyard with outdoor seating'],
    ['ekkm', new URL('../assets/places/ekkm.jpg', import.meta.url).href, 'EKKM’s entrance with an elevated work platform'],
    ['uuslaine', new URL('../assets/places/uuslaine.jpg', import.meta.url).href, 'Crowd gathered in Uus Laine’s courtyard at dusk'],
    ['fonoteek', new URL('../assets/places/fonoteek.jpg', import.meta.url).href, 'Live guitarist performing at FONOTEEK beneath disco balls'],
  ];

  photographedVenues.forEach(([id, src, alt]) => {
    const record = getPaperVenue(id);
    const markup = renderPaperVenuePanel(record);

    assert.equal(record.image, src);
    assert.equal(record.imageAlt, alt);
    assert.match(markup, new RegExp(`<img src="${src}" alt="${alt}">`));
  });

  assert.deepEqual(
    Object.fromEntries(paperVenueRecords.filter(({ image }) => !image).map(({ id, image }) => [id, image])),
    { ida: null, 'future-01': null, 'future-02': null, 'future-03': null },
  );
});

test('getPaperVenue finds HALL and falls back to Paavli for an unknown ID', () => {
  assert.equal(getPaperVenue('hall').name, 'HALL');
  assert.equal(getPaperVenue('not-a-venue').id, 'paavli');
});

test('markers mark HALL as active and expose their positional contract', () => {
  const markup = renderPaperVenueMarkers('hall');

  assert.equal((markup.match(/<button\b/g) || []).length, 11);
  assert.match(markup, /data-venue-id="hall"[^>]*aria-pressed="true"[^>]*style="--marker-x: 366; --marker-y: 158;"/);
  assert.equal((markup.match(/aria-pressed="true"/g) || []).length, 1);
});

test('a placeholder panel announces that its location will be added', () => {
  const markup = renderPaperVenuePanel(getPaperVenue('future-01'));

  assert.match(markup, /data-paper-venue-panel/);
  assert.match(markup, /data-paper-venue-title/);
  assert.match(markup, /data-paper-venue-copy/);
  assert.match(markup, /data-paper-venue-visual/);
  assert.match(markup, /aria-live="polite"/);
  assert.match(markup, /Asukoht lisandub/);
});
