import { useEffect, useRef, useState, useCallback } from "react";
import { Volume2, VolumeX } from "lucide-react";

const VIDEO_SRC = "/videos/header-bg.mp4";

// CSS-based fade duration — no rAF loop needed
const FADE_MS = 800;

function Hero() {
  const videoRef            = useRef<HTMLVideoElement | null>(null);
  const sectionRef          = useRef<HTMLElement | null>(null);
  const hasInteractedRef    = useRef(false);
  const fadeTimerRef        = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [muted, setMuted]   = useState(true);

  // ── Util: clear any pending fade timer ─────────────────────────────────
  const clearFadeTimer = () => {
    if (fadeTimerRef.current !== null) {
      clearTimeout(fadeTimerRef.current);
      fadeTimerRef.current = null;
    }
  };

  // ── Util: fade volume using Web Audio / CSS-style linear ramp ──────────
  // Uses the HTMLMediaElement volume property with a single setInterval tick
  // at 60 fps equivalent — much lighter than rAF on the main thread because
  // it doesn't block layout/paint and can be throttled by the browser when
  // the tab is hidden.
  const fadeVolume = useCallback(
    (
      el: HTMLVideoElement,
      target: number,
      onDone?: () => void
    ) => {
      clearFadeTimer();

      const start     = el.volume;
      const delta     = target - start;
      const steps     = 30;                       // ~16ms × 30 = ~480ms
      const interval  = FADE_MS / steps;
      let   step      = 0;

      // Snap immediately if already at target
      if (Math.abs(delta) < 0.005) {
        el.volume = target;
        onDone?.();
        return;
      }

      const tick = () => {
        step++;
        const t       = step / steps;
        // Ease-out cubic
        const eased   = 1 - Math.pow(1 - t, 3);
        el.volume     = Math.min(1, Math.max(0, start + delta * eased));

        if (step < steps) {
          fadeTimerRef.current = setTimeout(tick, interval);
        } else {
          el.volume = target;            // clamp to exact value
          fadeTimerRef.current = null;
          onDone?.();
        }
      };

      fadeTimerRef.current = setTimeout(tick, interval);
    },
    []
  );

  // ── Safe play helper — avoids AbortError race ──────────────────────────
  const safePlay = (el: HTMLVideoElement) => {
    if (el.readyState >= 2) {           // HAVE_CURRENT_DATA or better
      el.play().catch(() => {});
    } else {
      el.addEventListener("canplay", () => el.play().catch(() => {}), { once: true });
    }
  };

  // 1. AUTOPLAY — muted, volume = 0 ──────────────────────────────────────
  useEffect(() => {
    const el = videoRef.current;
    if (!el) return;
    el.muted  = true;
    el.volume = 0;
    safePlay(el);
  }, []);

  // 2. Intersection observer — pause when off-screen, resume on-screen ───
  // Using `once: false` threshold 0.1 so we only fire when a meaningful
  // portion is visible, not on every sub-pixel scroll.
  useEffect(() => {
    const videoEl   = videoRef.current;
    const sectionEl = sectionRef.current;
    if (!videoEl || !sectionEl) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          // Resume playback (was paused on exit)
          safePlay(videoEl);

          // Restore audio only if user has explicitly unmuted
          if (hasInteractedRef.current) {
            videoEl.muted = false;
            videoEl.volume = 0;
            fadeVolume(videoEl, 1);
            setMuted(false);
          }
        } else {
          // Fade out then pause — reduces CPU/GPU when hero is off-screen
          fadeVolume(videoEl, 0, () => {
            videoEl.muted = true;
            setMuted(true);
            // Pause video when fully off-screen to free GPU resources
            if (!videoEl.paused) videoEl.pause();
          });
        }
      },
      { threshold: 0.1 }         // single threshold, no array — fewer callbacks
    );

    observer.observe(sectionEl);

    return () => {
      observer.disconnect();
      clearFadeTimer();
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fadeVolume]);

  // 3. Toggle mute ────────────────────────────────────────────────────────
  const toggleMute = useCallback(() => {
    const el = videoRef.current;
    if (!el) return;

    if (el.muted || el.volume < 0.05) {
      hasInteractedRef.current = true;
      el.muted  = false;
      el.volume = 0;
      safePlay(el);
      fadeVolume(el, 1);
      setMuted(false);
    } else {
      fadeVolume(el, 0, () => {
        el.muted = true;
        setMuted(true);
      });
    }
  }, [fadeVolume]);

  return (
    <section id="home" ref={sectionRef} className="hero-section">
      <style>{`
        /* ── Desktop ─────────────────────────────────────────────── */
        .hero-section {
          position: relative;
          width: 100%;
          height: 100vh;
          overflow: hidden;
          /* GPU layer for the whole hero — prevents repaint on scroll */
          contain: layout style paint;
        }

        .hero-section video {
          width: 100%;
          height: 100%;
          object-fit: cover;
          object-position: center;
          /* Own compositing layer — keeps video decode off main thread */
          will-change: transform;
          transform: translateZ(0);
        }

        /* ── Mobile ──────────────────────────────────────────────── */
        @media (max-width: 1024px) {
          #home.hero-section {
            height: 28vh;
          }
        }

        /* Landscape phones */
        @media (max-width: 1024px) and (orientation: landscape) {
          #home.hero-section {
            height: 100vh;
          }
        }

        /* ── Mute button ─────────────────────────────────────────── */
        .hero-mute-btn {
          position: absolute;
          bottom: 1rem;
          right: 1rem;
          z-index: 10;
          width: 2.25rem;
          height: 2.25rem;
          border-radius: 9999px;
          background: rgba(0, 0, 0, 0.5);
          border: 1px solid rgba(255, 255, 255, 0.2);
          color: #fff;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          /* removed backdrop-filter — it triggers compositing on every scroll */
          transition: background 0.2s ease;
        }

        .hero-mute-btn:hover {
          background: rgba(0, 0, 0, 0.75);
        }
      `}</style>

      <video
        ref={videoRef}
        src={VIDEO_SRC}
        playsInline
        autoPlay
        loop
        muted
        preload="metadata"   /* was "auto" — metadata is enough to start playing */
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