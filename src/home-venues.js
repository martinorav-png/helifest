// Drop extra frames as `{id}-2` / `{id}-3` under assets/places/, then add their
// `new URL(...)` entries to each venue's `frames` list below.
const placeGalleries = {
  paavli: {
    alt: 'People gathered at Paavli Kultuurivabrik’s illuminated outdoor terrace at dusk',
    frames: [
      '/assets/paavli-night.png',
      new URL('../assets/places/paavli2.webp', import.meta.url).href,
      new URL('../assets/places/paavli3.jpeg', import.meta.url).href,
    ],
  },
  ida: {
    alt: 'IDA Radio studio and venue interior',
    frames: [
      new URL('../assets/places/ida.png', import.meta.url).href,
      new URL('../assets/places/ida2.jpg', import.meta.url).href,
      new URL('../assets/places/ida3.webp', import.meta.url).href,
    ],
  },
  hall: {
    alt: 'HALL’s brick exterior illuminated at night',
    frames: [
      new URL('../assets/places/hall.jpg', import.meta.url).href,
      new URL('../assets/places/hall2.jpg', import.meta.url).href,
      new URL('../assets/places/hall3.jpg', import.meta.url).href,
    ],
  },
  kumu: {
    alt: 'Kumu Art Museum’s glass-and-stone exterior in daylight',
    frames: [
      new URL('../assets/places/kumu.jpg', import.meta.url).href,
      new URL('../assets/places/kumu2.png', import.meta.url).href,
      new URL('../assets/places/kumu3.jpg', import.meta.url).href,
    ],
  },
  d3: {
    alt: 'D3’s mural-covered courtyard with outdoor seating',
    frames: [
      new URL('../assets/places/d3.webp', import.meta.url).href,
      new URL('../assets/places/d3-2.webp', import.meta.url).href,
      new URL('../assets/places/d3-3.webp', import.meta.url).href,
    ],
  },
  ekkm: {
    alt: 'EKKM’s entrance with an elevated work platform',
    frames: [
      new URL('../assets/places/ekkm.jpg', import.meta.url).href,
      new URL('../assets/places/ekkm2.jpg', import.meta.url).href,
      new URL('../assets/places/ekkm3.jpg', import.meta.url).href,
    ],
  },
  uuslaine: {
    alt: 'Crowd gathered in Uus Laine’s courtyard at dusk',
    frames: [
      new URL('../assets/places/uuslaine.jpg', import.meta.url).href,
      new URL('../assets/places/uuslaine2.jpg', import.meta.url).href,
      new URL('../assets/places/uuslaine3.jpg', import.meta.url).href,
    ],
  },
  fonoteek: {
    alt: 'Live guitarist performing at FONOTEEK beneath disco balls',
    frames: [
      new URL('../assets/places/fonoteek.jpg', import.meta.url).href,
      new URL('../assets/places/fonoteek2.webp', import.meta.url).href,
      new URL('../assets/places/fonoteek3.jpg', import.meta.url).href,
    ],
  },
};

const venueLogos = {
  paavli: '/assets/sponsors/paavli-kultuurivabrik.svg',
  ida: '/assets/sponsors/ida.svg',
  hall: '/assets/sponsors/hall.svg',
  kumu: '/assets/sponsors/kumu.svg',
  d3: '/assets/sponsors/d3.svg',
  ekkm: '/assets/sponsors/ekkm.svg',
  uuslaine: '/assets/sponsors/uus-laine.svg',
  fonoteek: '/assets/sponsors/fonoteek.svg',
};

const paavliPageFrames = [
  '/assets/places/paavli/paavli-kultuurivabrik-2025-evertpalmets-34.jpg',
  '/assets/places/paavli/paavli-kultuuriklubi-2025-evertpalmets-67.jpg',
  '/assets/places/paavli/tanker-live-room-3.jpg',
  '/assets/places/paavli/paavli-open-day1-304-1.jpg',
  '/assets/places/paavli/copy-of-paavli-open-day1-428.jpg',
  '/assets/places/paavli/paavli-1yr-day1-pastakeda-3973.jpg',
  '/assets/places/paavli/paavli-1yr-day1-pastakeda-5279-1.jpg',
  '/assets/places/paavli/feelgoodhit-0049.jpg',
  '/assets/places/paavli/feelgoodhit-3612.jpg',
  '/assets/places/paavli/copy-of-3-tallinncolors-3-1.jpg',
  '/assets/places/paavli/copy-of-untitled-5210013-1.jpg',
  '/assets/places/paavli/dsc4575-2.jpg',
  '/assets/places/paavli/476969264-556664797408594-1257381905480447016-n.jpg',
  '/assets/places/paavli/477474079-556665137408560-4268492644496434537-n.jpg',
];

function framesToImages(frames, alt) {
  return frames.filter(Boolean).map((src, index) => ({
    src,
    alt: `${alt} (${index + 1})`,
  }));
}

function galleryFor(id) {
  const config = placeGalleries[id];
  if (!config?.frames?.length) return { images: [], image: null, imageAlt: null };

  const unique = config.frames.filter(Boolean);
  while (unique.length < 3) unique.push(unique[unique.length - 1]);

  const images = framesToImages(unique.slice(0, 3), config.alt);
  const pageFrames = id === 'paavli' ? paavliPageFrames : unique;
  const pageImages = framesToImages(pageFrames, config.alt);

  return {
    images,
    pageImages,
    image: images[0].src,
    imageAlt: config.alt,
  };
}

const venueSeeds = [
  // Pin positions from pin-dropper on tallinn5.png (stage 673×522).
  // Addresses, websites and Instagram handles from the HELI 2026 website sheet.
  // Bios distilled from venue sites / public profiles (Liveurope, hall.vision, d-3.ee, fonoteek.ee, ekkm.ee, TMW, Visit Estonia).
  ['paavli', 'Paavli Kultuurivabrik', 'Paavli tn 7', 'Endisesse kalatööstushoonesse rajatud kontsert- ja klubisaal Põhja-Tallinnas. Avatud 2023; Liveurope’i liige kureeritud live- ja klubiprogrammiga.', 74, 210, false, 'https://kultuurivabrik.ee', '@kultuurivabrik'],
  ['ida', 'IDA', 'Telliskivi tn 60a-5', 'Sõltumatu kogukonnaraadio Telliskivi Loomelinnakus. Stuudio ja baar, kus live-saated, DJ-sessioonid ja peod kohtuvad.', 232, 376, false, 'https://idaidaida.net', '@ida.radio'],
  ['hall', 'HALL', 'Peetri tn 6', 'Noblessneri endises tööstushoones tegutsev techno-klubi (alates 2017). Ida-Euroopa undergroundi lava; suvel ka Suvila aed.', 221, 143, false, 'https://hall.vision', '@halltallinn'],
  ['kumu', 'KUMU', 'Weizenbergi 34, Valge 1', 'Eesti Kunstimuuseumi peakorter Kadriorus - üks Põhja-Euroopa suuremaid kunstimuuseume. Näituste kõrval auditoorium kontsertideks ja üritusteks.', 541, 250, false, 'https://kumu.ekm.ee', '@kumukunstimuuseum'],
  ['d3', 'D3', 'Telliskivi 62-2, Depoo 3', 'Telliskivi Depoos asuv kontsert- ja klubisaal (2021). Tööstuslik ruum tugeva heliga nädalavahetuse pidudeks ja live’ideks.', 249, 368, false, 'https://d-3.ee', '@d3_tallinn'],
  ['ekkm', 'EKKM', 'Kursi tn 5', 'Artistide algatatud Eesti Kaasaegse Kunsti Muuseum endises katlamaja hoones. Eksperimentaalne näitusruum, mis küsib, milline võiks muuseum olla.', 354, 273, false, 'https://ekkm.ee', '@ekkmtallinn'],
  ['uuslaine', 'Uus Laine', 'Vana-Kalamaja tn 1', 'Kalamaja Art Deco baar ja kogukonnapaik. Live, DJ-õhtud, viktoriinid ja kohtumised - avatud plaaniga koht.', 275, 353, false, 'https://uuslaine.com', '@laine.bar'],
  ['fonoteek', 'FONOTEEK', 'Telliskivi tn 62', 'Telliskivi helitempel Funktion-One kõlaritega. Mixoloogia ja muusika; live, DJ-setid ja kureeritud programmid.', 225, 416, false, 'https://fonoteek.ee', '@fonoteek'],
  ['future-01', 'Tulevane paik 01', 'Asukoht lisandub', 'Festivali asukoha info lisandub peagi.', 500, 251, true, '', ''],
  ['future-02', 'Tulevane paik 02', 'Asukoht lisandub', 'Festivali asukoha info lisandub peagi.', 398, 300, true, '', ''],
  ['future-03', 'Tulevane paik 03', 'Asukoht lisandub', 'Festivali asukoha info lisandub peagi.', 323, 270, true, '', ''],
];

export const paperVenueRecords = venueSeeds.map(([id, name, address, description, x, y, isPlaceholder, website, instagram]) => {
  const gallery = isPlaceholder
    ? { images: [], pageImages: [], image: null, imageAlt: null }
    : galleryFor(id);
  return {
    id,
    name,
    address,
    description,
    x,
    y,
    website,
    instagram,
    instagramUrl: instagram ? `https://www.instagram.com/${instagram.replace(/^@/, '')}/` : '',
    logo: isPlaceholder ? null : venueLogos[id] || null,
    images: gallery.images,
    pageImages: gallery.pageImages,
    image: gallery.image,
    imageAlt: gallery.imageAlt,
    isPlaceholder,
  };
});

export function getPaperVenue(id) {
  return paperVenueRecords.find((venue) => venue.id === id) || paperVenueRecords[0];
}

export function renderPaperVenuePanel(record) {
  const venue = record || getPaperVenue();

  return `<div class="paper-venue-content t-panel-slide" data-paper-venue-panel data-open="true" aria-live="polite"><div class="paper-venue-copy"><h2 id="paper-venue-title" data-paper-venue-title>${venue.name}</h2><p data-paper-venue-copy><span class="paper-venue-address">${venue.address}</span><br><span class="paper-venue-bio">${venue.description}</span></p></div><div class="paper-venue-photo" data-paper-venue-visual><div data-venue-pixel-root></div></div></div>`;
}

export function renderPaperVenueMarkers(activeId = 'paavli') {
  const activeVenue = getPaperVenue(activeId);

  return paperVenueRecords
    .filter((venue) => !venue.isPlaceholder)
    .map((venue) => `<button type="button" class="paper-map-marker" data-venue-id="${venue.id}" aria-label="${venue.name}, ${venue.address}" aria-pressed="${venue.id === activeVenue.id}" style="--marker-x: ${venue.x}; --marker-y: ${venue.y};"><span class="paper-map-marker__pixel" aria-hidden="true"></span></button>`)
    .join('');
}

export function renderPaperVenueSelector(activeId = 'paavli') {
  const activeVenue = getPaperVenue(activeId);

  return paperVenueRecords
    .filter((venue) => !venue.isPlaceholder)
    .map((venue) => `<button type="button" class="paper-map-chip" data-venue-id="${venue.id}" aria-pressed="${venue.id === activeVenue.id}">${venue.name}</button>`)
    .join('');
}

export { placeGalleries };
