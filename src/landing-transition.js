import { gsap as defaultGsap } from 'gsap';

export const LANDING_EXIT_SCALE = 7.2;
export const LANDING_ZOOM_DURATION = 0.82;
export const LANDING_COVER_FROM_SCALE = 0.055;
export const LANDING_COVER_TO_SCALE = 1;
export const LANDING_SWOOP_DURATION = 1.08;
export const LANDING_SWOOP_EASE = 'power4.inOut';
export const LANDING_SWOOP_AT = 0.32;
export const LANDING_COVER_FADE_DURATION = 0.55;
export const LANDING_COPY_FADE_AT = 0.52;
export const LANDING_COPY_FADE_DURATION = 0.26;
export const LANDING_RETURN_ZOOM_AT = LANDING_SWOOP_DURATION + LANDING_SWOOP_AT - LANDING_ZOOM_DURATION;

export function prefersReducedMotion(matchMedia) {
  const media = matchMedia
    || (typeof globalThis.matchMedia === 'function' ? globalThis.matchMedia.bind(globalThis) : null);
  if (!media) return false;
  return Boolean(media('(prefers-reduced-motion: reduce)')?.matches);
}

function isModifiedClick(event) {
  return Boolean(
    event.defaultPrevented
    || event.button
    || event.metaKey
    || event.ctrlKey
    || event.shiftKey
    || event.altKey,
  );
}

export function hashFromLink(link) {
  const href = link?.getAttribute?.('href') || '';
  if (href.startsWith('#')) return href;
  if (link?.hash) return link.hash;
  try {
    return new URL(href, 'http://heli.local').hash || '';
  } catch {
    return '';
  }
}

function gapMidpoint(lockup, nav) {
  const lockupRect = lockup.getBoundingClientRect();
  const navRect = nav.getBoundingClientRect();
  const horizontalGap = navRect.left - lockupRect.right;
  const verticalGap = navRect.top - lockupRect.bottom;

  const x = horizontalGap > 8
    ? lockupRect.right + horizontalGap / 2
    : (lockupRect.left + lockupRect.right + navRect.left + navRect.right) / 4;
  const y = horizontalGap > 8
    ? (Math.min(lockupRect.top, navRect.top) + Math.max(lockupRect.bottom, navRect.bottom)) / 2
    : (verticalGap > 8
      ? lockupRect.bottom + verticalGap / 2
      : (Math.min(lockupRect.top, navRect.top) + Math.max(lockupRect.bottom, navRect.bottom)) / 2);

  return { x, y };
}

export function gapTransformOrigin(lockup, nav, stage) {
  if (!lockup?.getBoundingClientRect || !nav?.getBoundingClientRect || !stage?.getBoundingClientRect) {
    return '50% 45%';
  }

  const stageRect = stage.getBoundingClientRect();
  const { x: midX, y: midY } = gapMidpoint(lockup, nav);
  const x = ((midX - stageRect.left) / (stageRect.width || 1)) * 100;
  const y = ((midY - stageRect.top) / (stageRect.height || 1)) * 100;
  return `${x}% ${y}%`;
}

export function coverTransformOrigin(lockup, nav) {
  if (!lockup?.getBoundingClientRect || !nav?.getBoundingClientRect) {
    return '50% 48%';
  }

  const { x: midX, y: midY } = gapMidpoint(lockup, nav);
  const width = globalThis.innerWidth || 1280;
  const height = globalThis.innerHeight || 848;
  return `${(midX / width) * 100}% ${(midY / height) * 100}%`;
}

export function bindLandingExit(root, {
  gsap: gsapLib = defaultGsap,
  matchMedia,
  prepareCover,
  commitHash,
  navigateImmediately,
  onStart,
  onSettled,
} = {}) {
  const shell = root?.querySelector?.('.landing-shell');
  const stage = shell?.querySelector?.('.landing-stage');
  const lockup = shell?.querySelector?.('.landing-lockup');
  const nav = shell?.querySelector?.('.landing-nav');
  const sponsors = shell?.querySelector?.('.landing-sponsors');

  if (!shell || !stage || !lockup || !nav) return () => {};

  let exiting = false;
  let timeline = null;
  let cover = null;

  const cleanupMotion = () => {
    timeline?.kill();
    timeline = null;
    gsapLib.killTweensOf([stage, lockup, nav, sponsors, cover].filter(Boolean));
  };

  const onClick = (event) => {
    const link = event.target?.closest?.('.landing-nav-link');
    if (!link || isModifiedClick(event) || exiting) return;

    const href = hashFromLink(link);
    if (!href || href === '#home' || href === '#') return;

    event.preventDefault();

    if (prefersReducedMotion(matchMedia)) {
      navigateImmediately?.(href);
      return;
    }

    exiting = true;
    shell.setAttribute('data-exiting', 'true');
    shell.setAttribute('aria-busy', 'true');
    onStart?.(href);
    commitHash?.(href);

    const origin = gapTransformOrigin(lockup, nav, stage);
    cover = prepareCover?.(href) || null;

    gsapLib.set(stage, { transformOrigin: origin, force3D: true });
    if (cover) {
      gsapLib.set(cover, {
        scale: LANDING_COVER_FROM_SCALE,
        autoAlpha: 0,
        transformOrigin: coverTransformOrigin(lockup, nav),
        force3D: true,
      });
    }

    timeline = gsapLib.timeline({
      defaults: { ease: 'power3.in' },
      onComplete: () => {
        if (cover) {
          gsapLib.set(cover, { clearProps: 'transform,opacity,visibility' });
        }
        onSettled?.(href);
      },
    });

    timeline
      .to(stage, {
        scale: LANDING_EXIT_SCALE,
        duration: LANDING_ZOOM_DURATION,
        ease: 'power3.in',
      }, 0)
      .to(sponsors, {
        autoAlpha: 0,
        y: 32,
        duration: 0.28,
        ease: 'power2.out',
      }, 0)
      .to([lockup, nav], {
        autoAlpha: 0,
        duration: LANDING_COPY_FADE_DURATION,
        ease: 'power2.out',
      }, LANDING_COPY_FADE_AT);

    if (cover) {
      timeline.to(cover, {
        autoAlpha: 1,
        duration: LANDING_COVER_FADE_DURATION,
        ease: 'power1.out',
      }, LANDING_SWOOP_AT);
      timeline.to(cover, {
        scale: LANDING_COVER_TO_SCALE,
        duration: LANDING_SWOOP_DURATION,
        ease: LANDING_SWOOP_EASE,
      }, LANDING_SWOOP_AT);
    }
  };

  root.addEventListener('click', onClick);

  return () => {
    root.removeEventListener('click', onClick);
    cleanupMotion();
    exiting = false;
  };
}

export function playLandingReturn(shell, cover, {
  gsap: gsapLib = defaultGsap,
  onSettled,
} = {}) {
  const stage = shell?.querySelector?.('.landing-stage');
  const lockup = shell?.querySelector?.('.landing-lockup');
  const nav = shell?.querySelector?.('.landing-nav');
  const sponsors = shell?.querySelector?.('.landing-sponsors');

  if (!shell || !stage || !lockup || !nav || !cover) {
    onSettled?.();
    return () => {};
  }

  const origin = gapTransformOrigin(lockup, nav, stage);
  const coverOrigin = coverTransformOrigin(lockup, nav);

  gsapLib.set(stage, {
    scale: LANDING_EXIT_SCALE,
    transformOrigin: origin,
    force3D: true,
  });
  gsapLib.set([lockup, nav], { autoAlpha: 0 });
  gsapLib.set(sponsors, { autoAlpha: 0, y: 32 });
  gsapLib.set(cover, {
    scale: 1,
    transformOrigin: coverOrigin,
    force3D: true,
  });

  const timeline = gsapLib.timeline({
    defaults: { ease: 'power3.out' },
    onComplete: () => {
      onSettled?.();
    },
  });

  timeline
    .to(cover, {
      scale: LANDING_COVER_FROM_SCALE,
      duration: LANDING_SWOOP_DURATION,
      ease: 'power4.out',
    }, 0)
    .to(cover, {
      autoAlpha: 0,
      duration: 0.18,
      ease: 'power1.out',
    }, LANDING_SWOOP_DURATION - 0.18)
    .to(stage, {
      scale: 1,
      duration: LANDING_ZOOM_DURATION,
      ease: 'power3.out',
    }, LANDING_RETURN_ZOOM_AT)
    .to([lockup, nav], {
      autoAlpha: 1,
      duration: 0.4,
      ease: 'power2.out',
    }, LANDING_RETURN_ZOOM_AT + 0.28)
    .to(sponsors, {
      autoAlpha: 1,
      y: 0,
      duration: 0.4,
      ease: 'power2.out',
    }, LANDING_RETURN_ZOOM_AT + 0.28);

  return () => {
    timeline.kill();
    gsapLib.killTweensOf([stage, lockup, nav, sponsors, cover].filter(Boolean));
  };
}
