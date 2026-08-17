import test from 'node:test';
import assert from 'node:assert/strict';
import { renderVenuesView } from '../src/views/venues-view.js';
import { renderVenueDetailView } from '../src/views/venue-detail-view.js';
import { renderArtistDetailView } from '../src/views/artist-detail-view.js';
import { getPaperVenue } from '../src/home-venues.js';

const venueIds = ['paavli', 'hall', 'uuslaine', 'ida', 'd3', 'fonoteek', 'ekkm', 'kumu'];

test('venues view pairs its map with a complete textual venue list', () => {
  const html = renderVenuesView('paavli');
  assert.match(html, /<h1[^>]+id="page-title"[^>]*>PAIGAD<\/h1>/);
  assert.equal((html.match(/class="transport-stop"/g) || []).length, 8);
  assert.equal((html.match(/class="venue-open"/g) || []).length, 8);
  assert.match(html, /aria-pressed="true"[^>]+Paavli Kultuurivabrik/);
  assert.match(html, /maps\.google\.com\/maps\?q=/);
  assert.match(html, /class="transport-map-embed"/);
  assert.match(html, /Paavli tn 7/);
  assert.match(html, /Peetri tn 6/);
  assert.match(html, /href="#venue\/paavli\?from=venues"/);
  assert.match(html, /href="#venue\/d3\?from=venues"/);
  assert.doesNotMatch(html, /heartpink\.png|venue-index-row/);
});

test('venue detail keeps address, website and Instagram close to the title', () => {
  const html = renderVenueDetailView('paavli', { from: 'programme', date: '2026-10-16' });
  assert.match(html, /← AJAKAVA/);
  assert.match(html, /<h1[^>]+id="page-title"[^>]*>Paavli Kultuurivabrik<\/h1>/);
  assert.match(html, /class="entity-title-logo"[^>]*src="\/assets\/sponsors\/paavli-kultuurivabrik\.svg"/);
  assert.match(html, /data-venue-pixel-root/);
  assert.match(html, /Paavli tn 7/);
  assert.match(html, /kultuurivabrik\.ee/);
  assert.match(html, /@kultuurivabrik/);
  assert.match(html, /kalatööstushoonesse|Liveurope/);
});

test('each venue page uses the same layout with that venue’s sheet content', () => {
  venueIds.forEach((id) => {
    const venue = getPaperVenue(id);
    const html = renderVenueDetailView(id);

    assert.match(html, /class="entity-hero"/);
    assert.match(html, /class="entity-title-logo"/);
    assert.match(html, new RegExp(venue.logo.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')));
    assert.match(html, new RegExp(`id="page-title"[^>]*>${venue.name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}<`));
    assert.match(html, /class="entity-facts"/);
    assert.match(html, /class="entity-story"/);
    assert.match(html, /class="entity-programme"/);
    assert.match(html, /← PAIGAD/);
    assert.match(html, new RegExp(venue.address.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')));
    assert.match(html, new RegExp(venue.website.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')));
    assert.match(html, new RegExp(venue.instagram.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')));
    assert.match(html, new RegExp(venue.description.slice(0, 24).replace(/[.*+?^${}()|[\]\\]/g, '\\$&')));
  });
});

test('artist detail uses honest pending content and preserves programme context', () => {
  const html = renderArtistDetailView('artist-01', { from: 'programme', date: '2026-10-16' });
  assert.match(html, /Lorem ipsum/);
  assert.match(html, /LOREM IPSUM DOLOR/);
  assert.doesNotMatch(html, /Kode9|Hyperdub|Instagram|Spotify/i);
});
