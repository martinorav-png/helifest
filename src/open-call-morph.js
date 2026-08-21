import { gsap as defaultGsap } from 'gsap';
import defaultMorphSVGPlugin from 'gsap/MorphSVGPlugin';

function prefersReducedMotion(matchMedia) {
  const media = matchMedia
    || (typeof globalThis.matchMedia === 'function' ? globalThis.matchMedia.bind(globalThis) : null);
  if (!media) return false;
  return Boolean(media('(prefers-reduced-motion: reduce)')?.matches);
}

export function bindOpenCallMorph(root, {
  gsap: gsapLib = defaultGsap,
  MorphSVGPlugin: plugin = defaultMorphSVGPlugin,
  matchMedia,
} = {}) {
  const svg = root?.querySelector?.('.paper-open-call-morph');
  const live = svg?.querySelector?.('.paper-open-call-morph__live');
  if (!svg || !live) return () => {};
  if (prefersReducedMotion(matchMedia)) return () => {};

  gsapLib.registerPlugin(plugin);
  plugin.convertToPath(svg.querySelectorAll('rect, circle'));

  const square = svg.querySelector('#paper-open-call-square');
  const circle = svg.querySelector('#paper-open-call-circle');
  const star = svg.querySelector('#paper-open-call-star');
  if (!square || !circle || !star) return () => {};

  const timeline = gsapLib.timeline({
    repeat: -1,
    defaults: { duration: 0.7, ease: 'power2.inOut' },
  });

  timeline
    .to(live, { morphSVG: circle, delay: 0.45 })
    .to(live, { morphSVG: star, delay: 0.45 })
    .to(live, { morphSVG: square, delay: 0.45 });

  return () => {
    timeline.kill();
  };
}
