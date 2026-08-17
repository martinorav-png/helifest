export const festivalData = {
  dates: [
    { id: '2026-10-16', label: 'Fri 16 Oct' },
    { id: '2026-10-17', label: 'Sat 17 Oct' },
  ],
  venues: [
    { id: 'paavli', name: 'Paavli Kultuurivabrik', short: 'Paavli', address: 'Paavli tn 7', stop: 'Paavli', access: 'Ligipääsetavuse info lisandub.' },
    { id: 'ida', name: 'IDA', short: 'IDA', address: 'Telliskivi tn 60a-5', stop: 'Telliskivi', access: 'Ligipääsetavuse info lisandub.' },
    { id: 'hall', name: 'HALL', short: 'HALL', address: 'Peetri tn 6', stop: 'Noblessner', access: 'Ligipääsetavuse info lisandub.' },
    { id: 'kumu', name: 'KUMU', short: 'KUMU', address: 'Weizenbergi 34, Valge 1', stop: 'Kadriorg', access: 'Ligipääsetavuse info lisandub.' },
    { id: 'd3', name: 'D3', short: 'D3', address: 'Telliskivi 62-2, Depoo 3', stop: 'Telliskivi', access: 'Ligipääsetavuse info lisandub.' },
    { id: 'ekkm', name: 'EKKM', short: 'EKKM', address: 'Kursi tn 5', stop: 'Kesklinn', access: 'Ligipääsetavuse info lisandub.' },
    { id: 'uuslaine', name: 'Uus Laine', short: 'Uus Laine', address: 'Vana-Kalamaja tn 1', stop: 'Kalamaja', access: 'Ligipääsetavuse info lisandub.' },
    { id: 'fonoteek', name: 'FONOTEEK', short: 'Fonoteek', address: 'Telliskivi tn 62', stop: 'Telliskivi', access: 'Ligipääsetavuse info lisandub.' },
  ],
  artists: [
    { id: 'artist-01', name: 'Artist avalikustatakse peagi', genre: 'Programmi koht', bio: 'Artisti tutvustus lisandub koos programmi avalikustamisega.' },
    { id: 'artist-02', name: 'Artist avalikustatakse peagi', genre: 'Programmi koht', bio: 'Artisti tutvustus lisandub koos programmi avalikustamisega.' },
    { id: 'artist-03', name: 'Artist avalikustatakse peagi', genre: 'Programmi koht', bio: 'Artisti tutvustus lisandub koos programmi avalikustamisega.' },
  ],
  events: [
    { id: 'fri-01', date: '2026-10-16', start: '20:00', end: '21:00', venueId: 'ida', artistId: 'artist-01', category: 'Live', illustrative: true },
    { id: 'fri-02', date: '2026-10-16', start: '21:30', end: '23:00', venueId: 'paavli', artistId: 'artist-02', category: 'DJ set', illustrative: true },
    { id: 'fri-03', date: '2026-10-16', start: '23:30', end: '01:00', venueId: 'hall', artistId: 'artist-03', category: 'Live', illustrative: true },
    { id: 'sat-01', date: '2026-10-17', start: '20:00', end: '21:30', venueId: 'uuslaine', artistId: 'artist-02', category: 'Listening', illustrative: true },
    { id: 'sat-02', date: '2026-10-17', start: '22:00', end: '23:30', venueId: 'd3', artistId: 'artist-01', category: 'DJ set', illustrative: true },
    { id: 'sat-03', date: '2026-10-17', start: '00:00', end: '01:30', venueId: 'ekkm', artistId: 'artist-03', category: 'Live', illustrative: true },
  ],
  shuttleRoute: {
    access: 'Festival pass required',
    description: 'The festival shuttle runs between participating venues on both nights. Departure times will be announced closer to the festival.',
    stops: ['Paavli', 'Telliskivi', 'Kalamaja', 'City centre', 'Kadriorg', 'Noblessner'],
  },
};

export const lookup = (collection, id) => festivalData[collection].find((item) => item.id === id);
