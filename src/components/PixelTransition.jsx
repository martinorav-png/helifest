import { useRef, useEffect, useState, useCallback } from 'react';
import { flushSync } from 'react-dom';
import { gsap } from 'gsap';
import './PixelTransition.css';

function PixelTransition({
  firstContent,
  secondContent,
  slides,
  slideKey = '',
  gridSize = 7,
  pixelColor = 'currentColor',
  animationStepDuration = 0.3,
  once = false,
  aspectRatio = '100%',
  className = '',
  style = {},
  autoPlay = false,
  autoPlayInterval = 2800,
}) {
  const containerRef = useRef(null);
  const pixelGridRef = useRef(null);
  const delayedCallRef = useRef(null);
  const commitCallRef = useRef(null);
  const timerRef = useRef(null);
  const indexRef = useRef(0);
  const animatingRef = useRef(false);
  const slideRefs = useRef([]);

  const slideList = Array.isArray(slides) && slides.length > 0
    ? slides
    : [firstContent, secondContent].filter((slide) => slide != null);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [incomingIndex, setIncomingIndex] = useState(null);
  const [isActive, setIsActive] = useState(false);

  const prefersReducedMotion = typeof window !== 'undefined'
    && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const isTouchDevice =
    typeof window !== 'undefined' &&
    ('ontouchstart' in window || navigator.maxTouchPoints > 0 || window.matchMedia('(pointer: coarse)').matches);

  useEffect(() => {
    const pixelGridEl = pixelGridRef.current;
    if (!pixelGridEl) return;

    pixelGridEl.innerHTML = '';

    for (let row = 0; row < gridSize; row++) {
      for (let col = 0; col < gridSize; col++) {
        const pixel = document.createElement('div');
        pixel.classList.add('pixelated-image-card__pixel');
        pixel.style.backgroundColor = pixelColor;

        const size = 100 / gridSize;
        pixel.style.width = `${size}%`;
        pixel.style.height = `${size}%`;
        pixel.style.left = `${col * size}%`;
        pixel.style.top = `${row * size}%`;
        pixelGridEl.appendChild(pixel);
      }
    }
  }, [gridSize, pixelColor]);

  useEffect(() => () => {
    delayedCallRef.current?.kill();
    commitCallRef.current?.kill();
    if (timerRef.current) clearTimeout(timerRef.current);
    const pixelGridEl = pixelGridRef.current;
    if (pixelGridEl) gsap.killTweensOf(pixelGridEl.querySelectorAll('.pixelated-image-card__pixel'));
  }, []);

  useEffect(() => {
    indexRef.current = 0;
    setCurrentIndex(0);
    setIncomingIndex(null);
    setIsActive(false);
    animatingRef.current = false;
    delayedCallRef.current?.kill();
    commitCallRef.current?.kill();
    slideRefs.current.forEach((el, index) => {
      if (!el) return;
      el.style.opacity = index === 0 ? '1' : '0';
      el.style.zIndex = index === 0 ? '1' : '0';
    });
  }, [slideKey, slideList.length]);

  const runPixelBurst = useCallback((onMidpoint) => {
    const pixelGridEl = pixelGridRef.current;
    if (!pixelGridEl) return;

    const pixels = pixelGridEl.querySelectorAll('.pixelated-image-card__pixel');
    if (!pixels.length) return;

    gsap.killTweensOf(pixels);
    delayedCallRef.current?.kill();

    gsap.set(pixels, { display: 'none' });

    const staggerDuration = animationStepDuration / pixels.length;

    gsap.to(pixels, {
      display: 'block',
      duration: 0,
      stagger: { each: staggerDuration, from: 'random' },
    });

    delayedCallRef.current = gsap.delayedCall(animationStepDuration, () => {
      onMidpoint?.();
    });

    gsap.to(pixels, {
      display: 'none',
      duration: 0,
      delay: animationStepDuration,
      stagger: { each: staggerDuration, from: 'random' },
    });
  }, [animationStepDuration]);

  const showSlide = (index, { incoming = false } = {}) => {
    slideRefs.current.forEach((el, slideIndex) => {
      if (!el) return;
      const isCurrent = slideIndex === index;
      el.style.opacity = isCurrent ? '1' : '0';
      el.style.zIndex = isCurrent ? (incoming ? '2' : '1') : '0';
    });
  };

  const animatePixels = useCallback((activate) => {
    if (slideList.length < 2) return;
    const from = indexRef.current;
    const to = activate ? (from + 1) % slideList.length : from;

    setIsActive(activate);
    if (activate) {
      setIncomingIndex(to);
      const incomingEl = slideRefs.current[to];
      if (incomingEl) {
        incomingEl.style.opacity = '0';
        incomingEl.style.zIndex = '2';
      }
    }

    runPixelBurst(() => {
      if (activate) showSlide(to, { incoming: true });
      else showSlide(from);
    });

    commitCallRef.current?.kill();
    commitCallRef.current = gsap.delayedCall(animationStepDuration * 2, () => {
      if (activate) {
        indexRef.current = to;
        setCurrentIndex(to);
        showSlide(to);
      }
      setIncomingIndex(null);
      setIsActive(false);
    });
  }, [animationStepDuration, runPixelBurst, slideList.length]);

  const advanceSlide = useCallback((onComplete) => {
    if (animatingRef.current || slideList.length < 2) {
      onComplete?.();
      return;
    }

    animatingRef.current = true;
    const from = indexRef.current;
    const to = (from + 1) % slideList.length;
    const incomingEl = slideRefs.current[to];

    flushSync(() => {
      setIncomingIndex(to);
      setIsActive(true);
    });

    // Stage the next slide under the pixels without revealing it yet.
    if (incomingEl) {
      incomingEl.style.opacity = '0';
      incomingEl.style.zIndex = '2';
    }
    const currentEl = slideRefs.current[from];
    if (currentEl) currentEl.style.zIndex = '1';

    runPixelBurst(() => {
      // Mid-wipe: reveal the incoming slide while pixels still cover the frame.
      if (incomingEl) incomingEl.style.opacity = '1';
      if (currentEl) currentEl.style.opacity = '0';
    });

    commitCallRef.current?.kill();
    commitCallRef.current = gsap.delayedCall(animationStepDuration * 2, () => {
      indexRef.current = to;
      // Keep incoming visible as the new current; never re-show `from`.
      showSlide(to);
      flushSync(() => {
        setCurrentIndex(to);
        setIncomingIndex(null);
        setIsActive(false);
      });
      animatingRef.current = false;
      onComplete?.();
    });
  }, [animationStepDuration, runPixelBurst, slideList.length]);

  useEffect(() => {
    if (!autoPlay || prefersReducedMotion || slideList.length < 2) return undefined;

    let cancelled = false;

    const schedule = () => {
      timerRef.current = setTimeout(() => {
        if (cancelled) return;
        advanceSlide(() => {
          if (!cancelled) schedule();
        });
      }, autoPlayInterval);
    };

    schedule();

    return () => {
      cancelled = true;
      if (timerRef.current) clearTimeout(timerRef.current);
      commitCallRef.current?.kill();
    };
  }, [advanceSlide, autoPlay, autoPlayInterval, prefersReducedMotion, slideKey, slideList.length]);

  const handleEnter = () => {
    if (autoPlay) return;
    if (!isActive) animatePixels(true);
  };
  const handleLeave = () => {
    if (autoPlay) return;
    if (isActive && !once) animatePixels(false);
  };
  const handleClick = () => {
    if (autoPlay) return;
    if (!isActive) animatePixels(true);
    else if (isActive && !once) animatePixels(false);
  };

  return (
    <div
      ref={containerRef}
      className={`pixelated-image-card ${className}`}
      style={style}
      onMouseEnter={!autoPlay && !isTouchDevice ? handleEnter : undefined}
      onMouseLeave={!autoPlay && !isTouchDevice ? handleLeave : undefined}
      onClick={!autoPlay ? handleClick : undefined}
      onFocus={!autoPlay && !isTouchDevice ? handleEnter : undefined}
      onBlur={!autoPlay && !isTouchDevice ? handleLeave : undefined}
      tabIndex={autoPlay ? -1 : 0}
      role={autoPlay ? 'img' : 'button'}
      aria-pressed={autoPlay ? undefined : isActive}
      aria-label={autoPlay ? undefined : (isActive ? 'Hide content' : 'Reveal content')}
    >
      <div style={{ paddingTop: aspectRatio }} />
      <div className="pixelated-image-card__slides">
        {slideList.map((slide, index) => (
          <div
            key={`${slideKey}-${index}`}
            ref={(el) => {
              slideRefs.current[index] = el;
              if (el && !animatingRef.current) {
                const isCurrent = index === indexRef.current;
                el.style.opacity = isCurrent ? '1' : '0';
                el.style.zIndex = isCurrent ? '1' : '0';
              }
            }}
            className="pixelated-image-card__slide"
            aria-hidden={index !== currentIndex && index !== incomingIndex}
          >
            {slide}
          </div>
        ))}
      </div>
      <div className="pixelated-image-card__pixels" ref={pixelGridRef} />
    </div>
  );
}

export default PixelTransition;
