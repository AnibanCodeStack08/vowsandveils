import { useEffect, useRef, useState } from "react";
import { Volume2, VolumeX } from "lucide-react";

const video = "/videos/header-bg.mp4";

const FADE_DURATION = 900;

function Hero() {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const sectionRef = useRef<HTMLElement | null>(null);
  const isVisibleRef = useRef(true);
  const hasInteractedRef = useRef(false);
  const fadeRafRef = useRef<number | null>(null);
  const [muted, setMuted] = useState(true);

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

  // 1. AUTOPLAY
  useEffect(() => {
    const el = videoRef.current;
    if (!el) return;
    el.muted = true;
    el.volume = 0;
    el.play().catch((err) => console.warn("Autoplay blocked:", err));
  }, []);

  // 2. Intersection observer fade
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
              setMuted(false);
            }
          } else {
            fadeVolume(videoEl, 0, () => {
              videoEl.muted = true;
              setMuted(true);
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

  // 3. Mute / unmute toggle
  const toggleMute = () => {
    const el = videoRef.current;
    if (!el) return;

    if (el.muted || el.volume === 0) {
      hasInteractedRef.current = true;
      el.muted = false;
      el.volume = 0;
      el.play().catch(() => {});
      fadeVolume(el, 1);
      setMuted(false);
    } else {
      fadeVolume(el, 0, () => {
        el.muted = true;
        setMuted(true);
      });
    }
  };

  return (
    <section id="home" ref={sectionRef} className="hero-section">
      <style>{`
        /* ── Desktop ───────────────────────────────────────────────────── */
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
            height: 28vh;
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

        /* Mute button */
        .hero-mute-btn {
          position: absolute;
          bottom: 1rem;
          right: 1rem;
          z-index: 10;
          width: 2.25rem;
          height: 2.25rem;
          border-radius: 9999px;
          background: rgba(0, 0, 0, 0.45);
          border: 1px solid rgba(255, 255, 255, 0.2);
          color: #fff;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          backdrop-filter: blur(6px);
          transition: background 0.2s ease;
        }

        .hero-mute-btn:hover {
          background: rgba(0, 0, 0, 0.7);
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

      <button
        onClick={toggleMute}
        aria-label={muted ? "Unmute video" : "Mute video"}
        className="hero-mute-btn"
      >
        {muted ? <VolumeX size={15} /> : <Volume2 size={15} />}
      </button>
    </section>
  );
}

export default Hero;