import test from 'node:test';
import assert from 'node:assert/strict';
import {
  paperVenueRecords,
  getPaperVenue,
  renderPaperVenuePanel,
  renderPaperVenueMarkers,
  renderPaperVenueSelector,
} from '../src/home-venues.js';

test('paper venue records retain the specified venues, placeholders, and map positions', () => {
  assert.equal(paperVenueRecords.length, 11);
  assert.equal(paperVenueRecords.filter((venue) => venue.isPlaceholder).length, 3);
  assert.deepEqual(
    paperVenueRecords.map(({ x, y }) => [x, y]),
    [[74, 210], [232, 376], [221, 143], [541, 250], [249, 368], [354, 273], [275, 353], [225, 416], [500, 251], [398, 300], [323, 270]],
  );
});

test('mobile venue selector exposes one 44px-capable control per mapped venue', () => {
  const markup = renderPaperVenueSelector('hall');

  assert.equal((markup.match(/class="paper-map-chip"/g) || []).length, 8);
  assert.match(markup, /data-venue-id="hall"[^>]*aria-pressed="true"/);
  assert.match(markup, />Paavli Kultuurivabrik<\/button>/);
  assert.doesNotMatch(markup, /Tulevane paik/);
});

test('photographed venue panels expose three distinct gallery frames and a PixelTransition mount root', () => {
  const photographedVenues = [
    ['paavli', '/assets/paavli-night.png', 'People gathered at Paavli Kultuurivabrik’s illuminated outdoor terrace at dusk'],
    ['ida', new URL('../assets/places/ida.png', import.meta.url).href, 'IDA Radio studio and venue interior'],
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
    const uniqueSources = new Set(record.images.map((image) => image.src));

    assert.equal(record.image, src);
    assert.equal(record.imageAlt, alt);
    assert.equal(record.images.length, 3);
    assert.equal(uniqueSources.size, 3);
    assert.equal(record.images[0].src, src);
    assert.match(markup, /data-venue-pixel-root/);
    assert.doesNotMatch(markup, /<img\b/);
  });

  assert.match(getPaperVenue('paavli').images[2].src, /paavli3\.jpeg/);
  assert.doesNotMatch(getPaperVenue('paavli').images[2].src, /paavli3\.webp/);

  assert.deepEqual(
    Object.fromEntries(paperVenueRecords.filter(({ image }) => !image).map(({ id, image }) => [id, image])),
    { 'future-01': null, 'future-02': null, 'future-03': null },
  );
});

test('Paavli venue pages cycle all 14 source photographs', () => {
  const paavli = getPaperVenue('paavli');
  const uniquePages = new Set(paavli.pageImages.map((image) => image.src));

  assert.equal(paavli.images.length, 3);
  assert.equal(paavli.pageImages.length, 14);
  assert.equal(uniquePages.size, 14);
  paavli.pageImages.forEach((image) => {
    assert.match(image.src, /\/assets\/places\/paavli\//);
  });
});

test('getPaperVenue finds HALL and falls back to Paavli for an unknown ID', () => {
  assert.equal(getPaperVenue('hall').name, 'HALL');
  assert.equal(getPaperVenue('not-a-venue').id, 'paavli');
});

test('photographed venues keep sheet addresses, websites and Instagram handles', () => {
  const paavli = getPaperVenue('paavli');
  const d3 = getPaperVenue('d3');
  const kumu = getPaperVenue('kumu');

  assert.equal(paavli.address, 'Paavli tn 7');
  assert.equal(paavli.website, 'https://kultuurivabrik.ee');
  assert.equal(paavli.instagram, '@kultuurivabrik');
  assert.equal(d3.address, 'Telliskivi 62-2, Depoo 3');
  assert.equal(d3.website, 'https://d-3.ee');
  assert.equal(kumu.address, 'Weizenbergi 34, Valge 1');
  assert.equal(kumu.instagramUrl, 'https://www.instagram.com/kumukunstimuuseum/');
});

test('markers mark HALL as active and expose their positional contract', () => {
  const markup = renderPaperVenueMarkers('hall');

  assert.equal((markup.match(/<button\b/g) || []).length, 8);
  assert.doesNotMatch(markup, /data-venue-id="future-0[1-3]"/);
  assert.match(markup, /data-venue-id="hall"[^>]*aria-pressed="true"[^>]*style="--marker-x: 221; --marker-y: 143;"/);
  assert.equal((markup.match(/aria-pressed="true"/g) || []).length, 1);
  assert.equal((markup.match(/<span class="paper-map-marker__pixel" aria-hidden="true"><\/span>/g) || []).length, 8);
});

test('venue panels include researched site bios under the address', () => {
  const bios = {
    paavli: /kalatööstushoonesse|Liveurope/,
    ida: /kogukonnaraadio|Telliskivi/,
    hall: /techno-klubi|Noblessneri/,
    kumu: /Kunstimuuseumi|Kadriorus/,
    d3: /Depoos|kontsert- ja klubisaal/,
    ekkm: /Kaasaegse Kunsti|eksperimentaalne/i,
    uuslaine: /Art Deco|kogukonnapaik/,
    fonoteek: /Funktion-One|helitempel/,
  };

  Object.entries(bios).forEach(([id, pattern]) => {
    const record = getPaperVenue(id);
    const markup = renderPaperVenuePanel(record);

    assert.match(record.description, pattern);
    assert.match(markup, /class="paper-venue-bio"/);
    assert.match(markup, pattern);
  });
});

test('a placeholder panel announces that its location will be added', () => {
  const markup = renderPaperVenuePanel(getPaperVenue('future-01'));

  assert.match(markup, /data-paper-venue-panel/);
  assert.match(markup, /class="paper-venue-content t-panel-slide"[^>]*data-open="true"/);
  assert.match(markup, /data-paper-venue-title/);
  assert.match(markup, /data-paper-venue-copy/);
  assert.match(markup, /data-paper-venue-visual/);
  assert.match(markup, /aria-live="polite"/);
  assert.match(markup, /Asukoht lisandub/);
});
