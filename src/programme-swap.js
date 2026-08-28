import { gsap as defaultGsap } from 'gsap';
import { festivalData } from './data.js';
import { utilitySwipeAxis } from './utility-swipe.js';

export const PROGRAMME_SWAP_DURATION = 0.25;
export const PROGRAMME_SWAP_STAGGER = 0.04;
export const PROGRAMME_SWAP_LEAD = 0.1;
export const PROGRAMME_SWAP_STAGGER_CAP = 0.28;

const CATEGORY_ORDER = ['All', 'Live', 'DJ set', 'Listening'];

function indexDirection(order, fromValue, toValue) {
  const from = order.indexOf(fromValue);
  const to = order.indexOf(toValue);
  if (from < 0 || to < 0 || from === to) return 0;
  return to > from ? 1 : -1;
}

export function programmeSwapDirection(from = {}, to = {}) {
  if (from.date !== to.date) {
    if (!from.date || !to.date) return 0;
    return from.date < to.date ? 1 : -1;
  }

  if (from.venueId !== to.venueId) {
    return indexDirection(
      ['All', ...festivalData.venues.map((venue) => venue.id)],
      from.venueId,
      to.venueId,
    );
  }

  if (from.category !== to.category) {
    return indexDirection(CATEGORY_ORDER, from.category, to.category);
  }

  return 0;
}

export function programmeSwapItems(pane) {
  return [...(pane?.querySelectorAll?.(':scope > .programme-day, :scope > .programme-row, :scope > .programme-empty') || [])];
}

export function programmeSwapStagger(count) {
  if (count <= 1) return 0;
  return Math.min(PROGRAMME_SWAP_STAGGER, PROGRAMME_SWAP_STAGGER_CAP / (count - 1));
}

export function playProgrammeSwap(results, outgoing, incoming, direction, {
  gsap: gsapLib = defaultGsap,
  axis = utilitySwipeAxis(),
  onSettled,
} = {}) {
  if (!results || !outgoing || !incoming || !direction) {
    incoming?.classList.remove('is-incoming');
    onSettled?.();
    return () => {};
  }

  const outgoingItems = programmeSwapItems(outgoing);
  const incomingItems = programmeSwapItems(incoming);
  const vertical = axis === 'y';
  const from = direction * 100;
  const percentKey = vertical ? 'yPercent' : 'xPercent';
  const restKey = vertical ? 'xPercent' : 'yPercent';
  const outStagger = programmeSwapStagger(outgoingItems.length);
  const inStagger = programmeSwapStagger(incomingItems.length);

  results.classList.add('is-swapping');
  incoming.classList.add('is-incoming');
  if (!incoming.parentNode) results.appendChild(incoming);

  const height = Math.max(outgoing.offsetHeight || 0, incoming.offsetHeight || 0);
  results.style.minHeight = height ? `${height}px` : '';

  gsapLib.set(outgoingItems, { [percentKey]: 0, [restKey]: 0, force3D: true });
  gsapLib.set(incomingItems, { [percentKey]: from, [restKey]: 0, force3D: true });

  const timeline = gsapLib.timeline({
    defaults: { duration: PROGRAMME_SWAP_DURATION, ease: 'power3.inOut' },
    onComplete: () => {
      outgoing.remove();
      incoming.classList.remove('is-incoming');
      results.classList.remove('is-swapping');
      results.style.minHeight = '';
      gsapLib.set(incomingItems, { clearProps: 'transform' });
      onSettled?.();
    },
  });

  if (outgoingItems.length) {
    timeline.to(outgoingItems, {
      [percentKey]: from * -1,
      stagger: { each: outStagger },
    }, 0);
  }

  if (incomingItems.length) {
    timeline.to(incomingItems, {
      [percentKey]: 0,
      stagger: { each: inStagger },
    }, PROGRAMME_SWAP_LEAD);
  }

  return () => {
    timeline.kill();
    gsapLib.killTweensOf([...outgoingItems, ...incomingItems]);
  };
}
