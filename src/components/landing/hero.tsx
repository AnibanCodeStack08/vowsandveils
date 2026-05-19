import { useEffect, useRef } from "react";

const video = "/videos/header-bg.mp4";

// Duration in ms over which volume fades in/out
const FADE_DURATION = 900;

function Hero() {
  const videoRef         = useRef<HTMLVideoElement>(null);
  const sectionRef       = useRef<HTMLElement>(null);
  const isVisibleRef     = useRef(true);
  const hasInteractedRef = useRef(false);
  const fadeRafRef       = useRef<number | null>(null); // active rAF handle

  // ── Helper: cancel any in-progress fade ──────────────────────────────────
  const cancelFade = () => {
    if (fadeRafRef.current !== null) {
      cancelAnimationFrame(fadeRafRef.current);
      fadeRafRef.current = null;
    }
  };

  // ── Helper: smoothly fade volume from current → target over FADE_DURATION ─
  //    onComplete is called only when the target is actually reached.
  const fadeVolume = (
    el: HTMLVideoElement,
    targetVolume: number,
    onComplete?: () => void
  ) => {
    cancelFade();

    const startVolume = el.volume;
    const delta       = targetVolume - startVolume;

    // Nothing to do
    if (Math.abs(delta) < 0.001) {
      onComplete?.();
      return;
    }

    const startTime = performance.now();

    const tick = (now: number) => {
      const elapsed  = now - startTime;
      const progress = Math.min(elapsed / FADE_DURATION, 1);
      // ease-out curve for a natural feel
      const eased    = 1 - Math.pow(1 - progress, 3);

      el.volume = Math.min(1, Math.max(0, startVolume + delta * eased));

      if (progress < 1) {
        fadeRafRef.current = requestAnimationFrame(tick);
      } else {
        fadeRafRef.current = null;
        onComplete?.();
      }
    };

    fadeRafRef.current = requestAnimationFrame(tick);
  };

  // ── 1. AUTOPLAY — always start muted (browser requirement) ───────────────
  useEffect(() => {
    const el = videoRef.current;
    if (!el) return;

    el.muted  = true;
    el.volume = 0; // start at 0; unmute flow will set muted=false + fade in

    el.play().catch((err) => console.warn("Autoplay blocked:", err));
  }, []);

  // ── 2. UNLOCK — unmute on first click / tap / key (NOT scroll) ───────────
  useEffect(() => {
    const el = videoRef.current;
    if (!el) return;

    const unlock = () => {
      if (hasInteractedRef.current) return; // guard against double-fire
      hasInteractedRef.current = true;

      if (isVisibleRef.current) {
        // Unmute the element, then fade volume up from 0 → 1
        el.muted  = false;
        el.volume = 0;
        fadeVolume(el, 1);
      }

      window.removeEventListener("click",      unlock);
      window.removeEventListener("touchstart", unlock);
      window.removeEventListener("keydown",    unlock);
    };

    window.addEventListener("click",      unlock);
    window.addEventListener("touchstart", unlock, { passive: true });
    window.addEventListener("keydown",    unlock);

    return () => {
      window.removeEventListener("click",      unlock);
      window.removeEventListener("touchstart", unlock);
      window.removeEventListener("keydown",    unlock);
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // ── 3. INTERSECTION OBSERVER — fade audio as hero enters / leaves view ───
  useEffect(() => {
    const videoEl   = videoRef.current;
    const sectionEl = sectionRef.current;
    if (!videoEl || !sectionEl) return;

    let debounce: ReturnType<typeof setTimeout> | null = null;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (debounce) clearTimeout(debounce);

        debounce = setTimeout(() => {
          isVisibleRef.current = entry.isIntersecting;

          if (entry.isIntersecting) {
            // Back in view — fade up only if user has already interacted
            if (hasInteractedRef.current && videoEl.muted) {
              videoEl.muted  = false;
              videoEl.volume = 0;
            }
            if (hasInteractedRef.current) {
              fadeVolume(videoEl, 1);
            }
          } else {
            // Leaving view — fade volume down, THEN mute
            fadeVolume(videoEl, 0, () => {
              videoEl.muted = true;
            });
          }
        }, 150);
      },
      {
        threshold: [0, 0.1],
      }
    );

    observer.observe(sectionEl);

    return () => {
      observer.disconnect();
      if (debounce) clearTimeout(debounce);
      cancelFade();
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <section
      ref={sectionRef}
      id="home"
      className="relative w-full h-screen overflow-hidden"
    >
      <video
        ref={videoRef}
        /*
         * Responsive sizing:
         * - w-full h-full        → fills the section in both axes
         * - object-cover         → crops to fill without distortion on any
         *                          screen size (mobile portrait included)
         * - min-w-full min-h-full → belt-and-suspenders for older browsers
         */
        className="
          absolute inset-0
          w-full h-full min-w-full min-h-full
          object-cover object-center
        "
        src={video}
        loop
        playsInline
        preload="auto"
      />

      {/* Nudge badge — pure CSS, no state, no re-renders */}
      <div
        className="
          absolute bottom-8 left-1/2 -translate-x-1/2 z-20
          flex items-center gap-2 px-4 py-2 rounded-full
          bg-black/40 text-white text-sm backdrop-blur-sm
          pointer-events-none select-none
          animate-pulse
          [animation-iteration-count:3]
        "
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="w-4 h-4"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path d="M11 5L6 9H2v6h4l5 4V5z" />
          <line x1="23" y1="9" x2="17" y2="15" />
          <line x1="17" y1="9" x2="23" y2="15" />
        </svg>
        Click anywhere to enable audio
      </div>

      <div className="relative z-10 h-full w-full" />
    </section>
  );
}

export default Hero;