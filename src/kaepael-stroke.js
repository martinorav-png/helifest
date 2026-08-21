import { gsap as defaultGsap } from 'gsap';
import defaultDrawSVGPlugin from 'gsap/DrawSVGPlugin';

function prefersReducedMotion(matchMedia) {
  const media = matchMedia
    || (typeof globalThis.matchMedia === 'function' ? globalThis.matchMedia.bind(globalThis) : null);
  if (!media) return false;
  return Boolean(media('(prefers-reduced-motion: reduce)')?.matches);
}

export function bindKaepaelStroke(root, {
  gsap: gsapLib = defaultGsap,
  DrawSVGPlugin: plugin = defaultDrawSVGPlugin,
  matchMedia,
} = {}) {
  const link = root?.querySelector?.('.paper-hero-kaepael');
  const path = link?.querySelector?.('.paper-hero-kaepael-stroke__path');
  if (!link || !path) return () => {};

  gsapLib.registerPlugin(plugin);
  const reduced = prefersReducedMotion(matchMedia);
  const duration = reduced ? 0 : 0.9;

  gsapLib.set(path, { drawSVG: '0% 0%' });

  const enter = () => gsapLib.to(path, {
    drawSVG: '0% 100%',
    duration,
    ease: 'power2.inOut',
    overwrite: 'auto',
  });
  const leave = () => gsapLib.to(path, {
    drawSVG: '0% 0%',
    duration: reduced ? 0 : 0.7,
    ease: 'power2.inOut',
    overwrite: 'auto',
  });

  link.addEventListener('mouseenter', enter);
  link.addEventListener('focusin', enter);
  link.addEventListener('mouseleave', leave);
  link.addEventListener('focusout', leave);

  return () => {
    link.removeEventListener('mouseenter', enter);
    link.removeEventListener('focusin', enter);
    link.removeEventListener('mouseleave', leave);
    link.removeEventListener('focusout', leave);
    gsapLib.killTweensOf(path);
  };
}
