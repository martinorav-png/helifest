import { getPaperVenue, renderPaperVenuePanel } from './home-venues.js';

const panelInnerMarkup = (record) => {
  return renderPaperVenuePanel(record)
    .replace(/^<div\b[^>]*>/, '')
    .replace(/<\/div>$/, '');
};

export function bindPaperVenueMap(root) {
  const panel = root.querySelector('[data-paper-venue-panel]');
  const markers = [...root.querySelectorAll('.paper-map-marker[data-venue-id]')];
  if (!panel || !markers.length) return () => {};

  let timeoutId;
  let frameId;
  const requestFrame = typeof requestAnimationFrame === 'function' ? requestAnimationFrame : (callback) => setTimeout(callback, 0);
  const cancelFrame = typeof cancelAnimationFrame === 'function' ? cancelAnimationFrame : clearTimeout;
  const listeners = markers.map((marker) => {
    const listener = () => {
      if (marker.getAttribute('aria-pressed') === 'true') return;
      panel.classList.add('paper-venue-panel--switching');
      clearTimeout(timeoutId);
      cancelFrame(frameId);
      timeoutId = setTimeout(() => {
        const venue = getPaperVenue(marker.dataset.venueId);
        panel.innerHTML = panelInnerMarkup(venue);
        markers.forEach((item) => item.setAttribute('aria-pressed', String(item === marker)));
        frameId = requestFrame(() => panel.classList.remove('paper-venue-panel--switching'));
      }, 150);
    };
    marker.addEventListener('click', listener);
    return [marker, listener];
  });

  return () => {
    clearTimeout(timeoutId);
    cancelFrame(frameId);
    listeners.forEach(([marker, listener]) => marker.removeEventListener('click', listener));
  };
}
