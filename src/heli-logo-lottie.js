import defaultLottie from 'lottie-web';

function prefersReducedMotion(matchMedia) {
  const media = matchMedia
    || (typeof globalThis.matchMedia === 'function' ? globalThis.matchMedia.bind(globalThis) : null);
  if (!media) return false;
  return Boolean(media('(prefers-reduced-motion: reduce)')?.matches);
}

// The source file's "return to start" pass (layers with sr: -1, a negative
// time-stretch) never rendered correctly in lottie-web, leaving frames
// ~290-710 blank — and under real-world conditions (e.g. the tab sitting
// backgrounded for a while, which can hand rAF one huge time-delta on
// refocus) playback could still land in that dead zone despite segment
// bounds checked in JS. heli-logo-liikuv.json has since been trimmed to
// drop those layers and truncate the composition to frame 290, so the dead
// zone no longer exists in the data at all. We still play the remaining
// forward pass (0-290) forward-then-backward ourselves for a smooth
// reverse-morph, since the file's own loop would otherwise jump-cut.
// The source keyframes don't start morphing until frame ~48 (nothing before
// that differs from frame 0, it's a plain hold), so starting the working
// range later trims the "stay thin" hold without touching the morph itself.
const WORKING_SEGMENT_START = 20;
const WORKING_SEGMENT_END = 290;
const PLAYBACK_SPEED = 0.25;
const STATIC_FALLBACK_FRAME = 75;

export function bindHeliLogoLottie(root, {
  lottie: lottieLib = defaultLottie,
  matchMedia,
  path = '/assets/heli-logo-liikuv.json',
} = {}) {
  const container = root?.querySelector?.('[data-hero-logo-lottie]');
  if (!container) return () => {};

  const anim = lottieLib.loadAnimation({
    container,
    renderer: 'svg',
    loop: false,
    autoplay: false,
    path,
  });

  let destroyed = false;

  // Derive direction from the actual current frame rather than toggling a
  // flag: lottie-web can fire 'complete' more than once per segment, and a
  // flag-based toggle desyncs when that happens (letting playback slip past
  // frame 290 into the broken native timeline). Reading currentFrame makes
  // repeated calls idempotent.
  function playNext() {
    if (destroyed) return;
    const midpoint = (WORKING_SEGMENT_START + WORKING_SEGMENT_END) / 2;
    const nearEnd = anim.currentFrame > midpoint;
    anim.playSegments(
      nearEnd ? [WORKING_SEGMENT_END, WORKING_SEGMENT_START] : [WORKING_SEGMENT_START, WORKING_SEGMENT_END],
      true,
    );
  }

  if (prefersReducedMotion(matchMedia)) {
    anim.goToAndStop(STATIC_FALLBACK_FRAME, true);
  } else {
    anim.setSpeed(PLAYBACK_SPEED);
    anim.addEventListener('complete', playNext);
    playNext();
  }

  return () => {
    destroyed = true;
    anim.destroy();
  };
}
