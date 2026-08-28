import { gsap as defaultGsap } from 'gsap';

function prefersReducedMotion(matchMedia) {
  const media = matchMedia
    || (typeof globalThis.matchMedia === 'function' ? globalThis.matchMedia.bind(globalThis) : null);
  if (!media) return false;
  return Boolean(media('(prefers-reduced-motion: reduce)')?.matches);
}

const TITLE_FROM_X = -248;
const NAV_FROM_X = -760;
const DATE_FROM_Y = -96;
const MARK_CENTER_X = 420;
const MARK_INTRO_SCALE = 1.89;
const MARK_DROP_Y = -380;
const COMPACT_TITLE_FROM_X = -140;
const COMPACT_NAV_FROM_X = -80;
const COMPACT_MARK_CENTER_X = 72;
const COMPACT_MARK_SCALE = 1.45;
const COMPACT_MARK_DROP_Y = -220;

export function bindLandingIntro(root, {
  gsap: gsapLib = defaultGsap,
  matchMedia,
} = {}) {
  const shell = root?.querySelector?.('.landing-shell');
  const stage = shell?.querySelector?.('.landing-stage');
  const lockup = shell?.querySelector?.('.landing-lockup');
  const markLink = shell?.querySelector?.('.landing-mark-link') || shell?.querySelector?.('.landing-mark');
  const titleLines = shell?.querySelectorAll?.('.landing-title span');
  const date = shell?.querySelector?.('.landing-date');
  const navLinks = shell?.querySelectorAll?.('.landing-nav-link');
  const sponsors = shell?.querySelector?.('.landing-sponsors');

  if (!shell || !stage || !lockup || !markLink) return () => {};

  const finish = () => {
    shell.setAttribute('data-intro', 'done');
    shell.setAttribute('aria-busy', 'false');
  };

  const reduced = prefersReducedMotion(matchMedia);
  const compactQuery = matchMedia
    || (typeof globalThis.matchMedia === 'function' ? globalThis.matchMedia.bind(globalThis) : null);
  const compact = Boolean(compactQuery?.('(max-width: 1079px)')?.matches);

  if (reduced) {
    finish();
    return () => {};
  }

  const titleFromX = compact ? COMPACT_TITLE_FROM_X : TITLE_FROM_X;
  const navFromX = compact ? COMPACT_NAV_FROM_X : NAV_FROM_X;

  gsapLib.set(markLink, {
    x: compact ? COMPACT_MARK_CENTER_X : MARK_CENTER_X,
    y: compact ? COMPACT_MARK_DROP_Y : MARK_DROP_Y,
    scale: compact ? COMPACT_MARK_SCALE : MARK_INTRO_SCALE,
    transformOrigin: '50% 50%',
    opacity: 1,
  });
  gsapLib.set(titleLines, { x: titleFromX, opacity: 0 });
  gsapLib.set(date, { y: DATE_FROM_Y, opacity: 0 });
  gsapLib.set(navLinks, { x: navFromX, opacity: 0 });
  gsapLib.set(sponsors, { opacity: 0, y: 16 });

  const timeline = gsapLib.timeline({
    defaults: { ease: 'power3.out' },
    onComplete: finish,
  });

  timeline
    .to(markLink, { y: 0, duration: 0.8, ease: 'power3.out' }, 0)
    .to(markLink, { x: 0, scale: 1, duration: 0.75, ease: 'power2.inOut' }, 0.85)
    .to(titleLines, {
      x: 0,
      opacity: 1,
      duration: 0.62,
      stagger: 0.05,
      ease: 'power3.out',
    }, 1.5)
    .to(navLinks, {
      x: 0,
      opacity: 1,
      duration: compact ? 0.55 : 0.95,
      stagger: 0.055,
      ease: 'power4.out',
    }, compact ? 1.58 : 1.62)
    .to(date, { y: 0, opacity: 1, duration: 0.5, ease: 'power3.out' }, compact ? 2.05 : 2.2)
    .to(sponsors, { opacity: 1, y: 0, duration: 0.45 }, compact ? 2.2 : 2.4);

  return () => {
    timeline.kill();
    gsapLib.killTweensOf([markLink, titleLines, date, navLinks, sponsors, lockup, stage]);
  };
}
