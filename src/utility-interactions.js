import { routeHref } from './router.js';

export function programmeHref(state = {}, patch = {}) {
  const next = { ...state, ...patch };
  return routeHref('programme', null, {
    date: next.date || '2026-10-16',
    venue: next.venueId && next.venueId !== 'All' ? next.venueId : null,
    category: next.category && next.category !== 'All' ? next.category : null,
  });
}

export function selectionHref(view, id) {
  return routeHref(view, null, { [view === 'transport' ? 'stop' : 'venue']: id });
}

function programmeState(root) {
  return {
    date: root.querySelector('[data-date][aria-pressed="true"]')?.dataset.date || '2026-10-16',
    venueId: root.querySelector('input[name="venue"]:checked')?.value || 'All',
    category: root.querySelector('input[name="category"]:checked')?.value || 'All',
  };
}

export function bindUtilityInteractions(root) {
  if (!root) return () => {};

  const click = (event) => {
    const menu = event.target.closest('.utility-menu-button');
    if (menu) {
      const open = menu.getAttribute('aria-expanded') !== 'true';
      menu.setAttribute('aria-expanded', String(open));
      root.querySelector('#utility-navigation')?.classList.toggle('is-open', open);
      return;
    }

    const date = event.target.closest('[data-date]');
    if (date) {
      window.location.hash = programmeHref(programmeState(root), { date: date.dataset.date });
      return;
    }

    if (event.target.closest('[data-clear-filters]')) {
      window.location.hash = programmeHref({ date: programmeState(root).date });
      return;
    }

    const filterToggle = event.target.closest('.filter-toggle');
    const filterClose = event.target.closest('[data-filter-close]');
    if (filterToggle || filterClose) {
      const panel = root.querySelector('[data-filter-panel]');
      const open = filterClose ? false : !panel?.classList.contains('is-open');
      panel?.classList.toggle('is-open', open);
      filterToggle?.setAttribute('aria-expanded', String(open));
      return;
    }

    const venue = event.target.closest('[data-venue-select]');
    if (venue) {
      window.location.hash = selectionHref('venues', venue.dataset.venueSelect);
      return;
    }

    const stop = event.target.closest('[data-stop-select]');
    if (stop) window.location.hash = selectionHref('transport', stop.dataset.stopSelect);

    const mode = event.target.closest('[data-venue-mode]');
    if (mode) {
      const mapMode = mode.dataset.venueMode === 'map';
      root.querySelector('[data-view="venues"]')?.classList.toggle('show-map', mapMode);
      root.querySelectorAll('[data-venue-mode]').forEach((button) => {
        button.setAttribute('aria-pressed', String(button === mode));
      });
    }
  };

  const change = (event) => {
    if (!event.target.matches('input[name="venue"], input[name="category"]')) return;
    const state = programmeState(root);
    window.location.hash = programmeHref(state, {
      [event.target.name === 'venue' ? 'venueId' : 'category']: event.target.value,
    });
  };

  root.addEventListener('click', click);
  root.addEventListener('change', change);
  return () => {
    root.removeEventListener('click', click);
    root.removeEventListener('change', change);
  };
}
