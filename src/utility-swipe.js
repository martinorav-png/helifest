import { gsap as defaultGsap } from 'gsap';
import { prefersReducedMotion } from './landing-transition.js';

export const UTILITY_SWIPE_DURATION = 0.52;
export const UTILITY_SWIPE_MOBILE_QUERY = '(max-width: 1079px)';

export function utilitySwipeAxis(matchMedia) {
  const media = matchMedia
    || (typeof globalThis.matchMedia === 'function' ? globalThis.matchMedia.bind(globalThis) : null);
  if (typeof media !== 'function') return 'x';
  return media(UTILITY_SWIPE_MOBILE_QUERY)?.matches ? 'y' : 'x';
}

export function playUtilitySwipe(outgoing, incoming, direction, {
  gsap: gsapLib = defaultGsap,
  axis = 'x',
  viewportHeight = typeof globalThis.innerHeight === 'number' ? globalThis.innerHeight : 0,
  onSettled,
} = {}) {
  if (!outgoing || !incoming || !direction) {
    onSettled?.();
    return () => {};
  }

  const vertical = axis === 'y';
  const from = vertical
    ? direction * (viewportHeight || 800)
    : direction * 100;
  const fromVars = vertical ? { y: from, xPercent: 0 } : { xPercent: from, y: 0 };
  const restVars = vertical ? { y: 0 } : { xPercent: 0 };
  const outVars = vertical ? { y: from * -1 } : { xPercent: from * -1 };

  gsapLib.set(incoming, { ...fromVars, force3D: true });
  gsapLib.set(outgoing, { ...restVars, force3D: true });

  const timeline = gsapLib.timeline({
    defaults: { duration: UTILITY_SWIPE_DURATION, ease: 'power3.inOut' },
    onComplete: () => {
      gsapLib.set(incoming, { clearProps: 'transform' });
      onSettled?.();
    },
  });

  timeline
    .to(outgoing, outVars, 0)
    .to(incoming, restVars, 0);

  return () => {
    timeline.kill();
    gsapLib.killTweensOf([outgoing, incoming]);
  };
}

export { prefersReducedMotion };
