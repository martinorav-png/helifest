import defaultLottie from 'lottie-web';

function prefersReducedMotion(matchMedia) {
  const media = matchMedia
    || (typeof globalThis.matchMedia === 'function' ? globalThis.matchMedia.bind(globalThis) : null);
  if (!media) return false;
  return Boolean(media('(prefers-reduced-motion: reduce)')?.matches);
}

// The source file's "return to start" pass (layers with sr: -1, a negative
// time-stretch) isn't rendered by lottie-web, which leaves frames ~290-710
// blank. The forward pass (frames 0-290) is the only part that actually
// renders, so we loop that segment forward-then-backward ourselves instead
// of trusting the file's own out-point/loop.
const WORKING_SEGMENT_END = 290;
const PLAYBACK_SPEED = 0.2;
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
    const nearEnd = anim.currentFrame > WORKING_SEGMENT_END / 2;
    anim.playSegments(nearEnd ? [WORKING_SEGMENT_END, 0] : [0, WORKING_SEGMENT_END], true);
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
