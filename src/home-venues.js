const placeImages = {
  hall: new URL('../assets/places/hall.jpg', import.meta.url).href,
  kumu: new URL('../assets/places/kumu.jpg', import.meta.url).href,
  d3: new URL('../assets/places/d3.webp', import.meta.url).href,
  ekkm: new URL('../assets/places/ekkm.jpg', import.meta.url).href,
  uuslaine: new URL('../assets/places/uuslaine.jpg', import.meta.url).href,
  fonoteek: new URL('../assets/places/fonoteek.jpg', import.meta.url).href,
};

const venueSeeds = [
  ['paavli', 'Paavli Kultuurivabrik', 'Paavli tn 7', 241, 113, '/assets/paavli-night.png', 'People gathered at Paavli Kultuurivabrik’s illuminated outdoor terrace at dusk', false],
  ['ida', 'IDA', 'Telliskivi tn 60a-5', 295, 190, null, null, false],
  ['hall', 'HALL', 'Peetri tn 6', 366, 158, placeImages.hall, 'HALL’s brick exterior illuminated at night', false],
  ['kumu', 'Kumu', 'Weizenbergi 34', 344, 180, placeImages.kumu, 'Kumu Art Museum’s glass-and-stone exterior in daylight', false],
  ['d3', 'D3', 'Telliskivi 62/2', 393, 209, placeImages.d3, 'D3’s mural-covered courtyard with outdoor seating', false],
  ['ekkm', 'EKKM', 'Kursi tn 5', 327, 160, placeImages.ekkm, 'EKKM’s entrance with an elevated work platform', false],
  ['uuslaine', 'Uus Laine', 'Vana-Kalamaja tn 1', 334, 225, placeImages.uuslaine, 'Crowd gathered in Uus Laine’s courtyard at dusk', false],
  ['fonoteek', 'FONOTEEK', 'Telliskivi tn 62', 258, 265, placeImages.fonoteek, 'Live guitarist performing at FONOTEEK beneath disco balls', false],
  ['future-01', 'Tulevane paik 01', 'Asukoht lisandub', 500, 251, null, null, true],
  ['future-02', 'Tulevane paik 02', 'Asukoht lisandub', 398, 300, null, null, true],
  ['future-03', 'Tulevane paik 03', 'Asukoht lisandub', 323, 270, null, null, true],
];

export const paperVenueRecords = venueSeeds.map(([id, name, address, x, y, image, imageAlt, isPlaceholder]) => ({
  id,
  name,
  address,
  description: isPlaceholder ? 'Festivali asukoha info lisandub peagi.' : `${name}, ${address}.`,
  x,
  y,
  image,
  imageAlt,
  isPlaceholder,
}));

export function getPaperVenue(id) {
  return paperVenueRecords.find((venue) => venue.id === id) || paperVenueRecords[0];
}

export function renderPaperVenuePanel(record) {
  const venue = record || getPaperVenue();
  const visual = venue.image
    ? `<img src="${venue.image}" alt="${venue.imageAlt}">`
    : `<span class="paper-venue-tile" aria-hidden="true">${venue.name}</span>`;

  return `<div class="paper-venue-content" data-paper-venue-panel aria-live="polite"><div class="paper-venue-copy"><h2 id="paper-venue-title" data-paper-venue-title>${venue.name}</h2><p data-paper-venue-copy><span class="paper-venue-address">${venue.address}</span><br>${venue.description}</p></div><div class="paper-venue-photo" data-paper-venue-visual>${visual}</div></div>`;
}

export function renderPaperVenueMarkers(activeId = 'paavli') {
  const activeVenue = getPaperVenue(activeId);

  return paperVenueRecords
    .filter((venue) => !venue.isPlaceholder)
    .map((venue) => `<button type="button" class="paper-map-marker" data-venue-id="${venue.id}" aria-label="${venue.name}, ${venue.address}" aria-pressed="${venue.id === activeVenue.id}" style="--marker-x: ${venue.x}; --marker-y: ${venue.y};"></button>`)
    .join('');
}
