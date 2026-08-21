import { getPaperVenue, renderPaperVenuePanel } from './home-venues.js';

const panelInnerMarkup = (record) => {
  return renderPaperVenuePanel(record)
    .replace(/^<div\b[^>]*>/, '')
    .replace(/<\/div>$/, '');
};

export function bindPaperVenueMap(root, { mountVenuePixel = () => () => {} } = {}) {
  const panel = root.querySelector('[data-paper-venue-panel]');
  const markers = [...root.querySelectorAll('.paper-map-marker[data-venue-id], .paper-map-chip[data-venue-id]')];
  if (!panel || !markers.length) return () => {};

  let timeoutId;
  let frameId;
  let cleanupVenuePixel = () => {};
  const requestFrame = typeof requestAnimationFrame === 'function' ? requestAnimationFrame : (callback) => setTimeout(callback, 0);
  const cancelFrame = typeof cancelAnimationFrame === 'function' ? cancelAnimationFrame : clearTimeout;

  const syncVenuePixel = (venue) => {
    cleanupVenuePixel();
    const host = typeof panel.querySelector === 'function'
      ? panel.querySelector('[data-venue-pixel-root]')
      : null;
    cleanupVenuePixel = mountVenuePixel(host, venue);
  };

  const activeMarker = markers.find((marker) => marker.getAttribute('aria-pressed') === 'true') || markers[0];
  syncVenuePixel(getPaperVenue(activeMarker?.dataset.venueId));

  const listeners = markers.map((marker) => {
    const listener = () => {
      if (marker.getAttribute('aria-pressed') === 'true') return;
      panel.setAttribute('data-open', 'false');
      clearTimeout(timeoutId);
      cancelFrame(frameId);
      timeoutId = setTimeout(() => {
        const venue = getPaperVenue(marker.dataset.venueId);
        cleanupVenuePixel();
        cleanupVenuePixel = () => {};
        panel.innerHTML = panelInnerMarkup(venue);
        markers.forEach((item) => item.setAttribute('aria-pressed', String(item.dataset.venueId === marker.dataset.venueId)));
        syncVenuePixel(venue);
        frameId = requestFrame(() => panel.setAttribute('data-open', 'true'));
      }, 220);
    };
    marker.addEventListener('click', listener);
    return [marker, listener];
  });

  return () => {
    clearTimeout(timeoutId);
    cancelFrame(frameId);
    cleanupVenuePixel();
    listeners.forEach(([marker, listener]) => marker.removeEventListener('click', listener));
  };
}
