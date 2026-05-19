import { useEffect, useRef } from "react";

const video = "/videos/header-bg.mp4";

function Hero() {
  const videoRef    = useRef<HTMLVideoElement>(null);
  const sectionRef  = useRef<HTMLElement>(null);
  const isVisibleRef     = useRef(true);   // is the section in the viewport?
  const hasInteractedRef = useRef(false);  // has the user gestured yet?

  // ── 1. AUTOPLAY — always start muted (browser requirement) ───────────────
  useEffect(() => {
    const el = videoRef.current;
    if (!el) return;

    el.muted  = true;
    el.volume = 1; // pre-set so unmute is instant, not jarring

    el.play().catch((err) => console.warn("Autoplay blocked:", err));
  }, []);

  // ── 2. UNLOCK — unmute on first click / tap / key (NOT scroll) ───────────
  //
  //  ⚠️  "scroll" intentionally removed:
  //      scroll is also the trigger for the Intersection Observer.
  //      Having it here caused a state update mid-scroll that tore down
  //      and rebuilt the observer, which paused/glitched the video.
  useEffect(() => {
    const el = videoRef.current;
    if (!el) return;

    const unlock = () => {
      hasInteractedRef.current = true;

      // Only unmute if the hero is currently visible
      if (isVisibleRef.current) {
        el.muted = false;
      }

      // One-shot — remove immediately after the first gesture
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
  }, []); // ← runs once; refs don't need to be in deps

  // ── 3. INTERSECTION OBSERVER — mute/unmute as hero enters/leaves view ────
  //
  //  ⚠️  Empty dep array [] is intentional and critical:
  //      The observer must NEVER be torn down mid-scroll.
  //      It reads hasInteractedRef / isVisibleRef directly (always current).
  useEffect(() => {
    const videoEl   = videoRef.current;
    const sectionEl = sectionRef.current;
    if (!videoEl || !sectionEl) return;

    let debounce: ReturnType<typeof setTimeout> | null = null;

    const observer = new IntersectionObserver(
      ([entry]) => {
        // Debounce absorbs rapid-fire events during fast scrolling
        if (debounce) clearTimeout(debounce);

        debounce = setTimeout(() => {
          isVisibleRef.current = entry.isIntersecting;

          if (entry.isIntersecting) {
            // Scrolled back in — unmute only if the user has already clicked
            if (hasInteractedRef.current) {
              videoEl.muted = false;
            }
          } else {
            // Scrolled out — always safe to mute
            videoEl.muted = true;
          }
        }, 150);
      },
      {
        // 0   → fires the instant ANY part leaves the viewport (for muting)
        // 0.1 → fires once 10 % is back in view (avoids hair-trigger unmute)
        threshold: [0, 0.1],
      }
    );

    observer.observe(sectionEl);

    return () => {
      observer.disconnect();
      if (debounce) clearTimeout(debounce);
    };
  }, []); // ← empty: observer is created once and lives until unmount

  return (
    <section
      ref={sectionRef}
      id="home"
      className="relative w-full h-screen overflow-hidden"
    >
      <video
        ref={videoRef}
        className="absolute top-0 left-0 w-full h-full object-cover"
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