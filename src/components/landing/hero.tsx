import { useEffect, useRef } from "react";

const video = "/videos/header-bg.mp4";

const FADE_DURATION = 900;

function Hero() {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const sectionRef = useRef<HTMLElement | null>(null);
  const isVisibleRef = useRef(true);
  const hasInteractedRef = useRef(false);
  const fadeRafRef = useRef<number | null>(null);

  const cancelFade = () => {
    if (fadeRafRef.current !== null) {
      cancelAnimationFrame(fadeRafRef.current);
      fadeRafRef.current = null;
    }
  };

  const fadeVolume = (
    el: HTMLVideoElement,
    targetVolume: number,
    onComplete?: () => void
  ) => {
    cancelFade();
    const startVolume = el.volume;
    const delta = targetVolume - startVolume;

    if (Math.abs(delta) < 0.001) {
      onComplete?.();
      return;
    }

    const startTime = performance.now();

    const tick = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / FADE_DURATION, 1);
      const eased = 1 - Math.pow(1 - progress, 3);

      el.volume = Math.min(
        1,
        Math.max(0, startVolume + delta * eased)
      );

      if (progress < 1) {
        fadeRafRef.current = requestAnimationFrame(tick);
      } else {
        fadeRafRef.current = null;
        onComplete?.();
      }
    };

    fadeRafRef.current = requestAnimationFrame(tick);
  };

  // 1. AUTOPLAY
  useEffect(() => {
    const el = videoRef.current;
    if (!el) return;

    el.muted = true;
    el.volume = 0;

    el.play().catch((err) => console.warn("Autoplay blocked:", err));
  }, []);

  // 2. UNLOCK on first interaction
  useEffect(() => {
    const el = videoRef.current;
    if (!el) return;

    const unlock = () => {
      if (hasInteractedRef.current) return;

      hasInteractedRef.current = true;

      if (isVisibleRef.current) {
        el.muted = false;
        el.volume = 0;
        fadeVolume(el, 1);
      }

      window.removeEventListener("click", unlock);
      window.removeEventListener("touchstart", unlock);
      window.removeEventListener("keydown", unlock);
    };

    window.addEventListener("click", unlock);
    window.addEventListener("touchstart", unlock, { passive: true });
    window.addEventListener("keydown", unlock);

    return () => {
      window.removeEventListener("click", unlock);
      window.removeEventListener("touchstart", unlock);
      window.removeEventListener("keydown", unlock);
    };
  }, []);

  // 3. Intersection observer fade
  useEffect(() => {
    const videoEl = videoRef.current;
    const sectionEl = sectionRef.current;

    if (!videoEl || !sectionEl) return;

    let debounce: ReturnType<typeof setTimeout> | null = null;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (debounce) clearTimeout(debounce);

        debounce = setTimeout(() => {
          isVisibleRef.current = entry.isIntersecting;

          if (entry.isIntersecting) {
            if (hasInteractedRef.current && videoEl.muted) {
              videoEl.muted = false;
              videoEl.volume = 0;
            }

            if (hasInteractedRef.current) {
              fadeVolume(videoEl, 1);
            }
          } else {
            fadeVolume(videoEl, 0, () => {
              videoEl.muted = true;
            });
          }
        }, 150);
      },
      { threshold: [0, 0.1] }
    );

    observer.observe(sectionEl);

    return () => {
      observer.disconnect();

      if (debounce) clearTimeout(debounce);

      cancelFade();
    };
  }, []);

  return (
    <section id="home" ref={sectionRef} className="hero-section">
      <style>{`
        /* ── Desktop (unchanged) ───────────────────────────────────────── */
        .hero-section {
          position: relative;
          width: 100%;
          height: 100vh;
          overflow: hidden;
        }

        .hero-section video {
          width: 100%;
          height: 100%;
          object-fit: cover;
          object-position: center;
        }

        /* ── Mobile cinematic landscape frame ─────────────────────────── */
        @media (max-width: 1024px) {
          #home.hero-section {
            position: relative;
            width: 100%;
            height: 42vh;
            background: #000;
            overflow: hidden;

            display: flex;
            align-items: center;
            justify-content: center;
          }

          #home.hero-section video {
            width: 100%;
            height: auto;
            aspect-ratio: 16 / 9;
            object-fit: contain;
            object-position: center;
          }
        }

        /* Landscape phones */
        @media (max-width: 1024px) and (orientation: landscape) {
          #home.hero-section {
            height: 100vh;
          }

          #home.hero-section video {
            width: 100%;
            height: 100%;
            object-fit: cover;
          }
        }

        .audio-nudge {
          position: absolute;
          bottom: 20px;
          left: 50%;
          transform: translateX(-50%);
          color: white;
          font-size: 14px;
          background: rgba(0,0,0,0.4);
          padding: 8px 14px;
          border-radius: 999px;
          backdrop-filter: blur(4px);
        }
      `}</style>

      <video
        ref={videoRef}
        src={video}
        playsInline
        autoPlay
        loop
        muted
        preload="auto"
      />

      <div className="audio-nudge" aria-hidden="true">
        Click anywhere to enable audio
      </div>
    </section>
  );
}

export default Hero;