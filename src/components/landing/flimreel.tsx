import { useEffect, useRef, useState } from "react";
import { Volume2, VolumeX } from "lucide-react";

const flimreelVideo = "/videos/flimreel.mp4";

const FADE_DURATION = 900; // ms

const Flimreel = () => {
  const ref = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const fadeRafRef = useRef<number | null>(null);
  const hasInteractedRef = useRef(false);
  const [muted, setMuted] = useState(true);
  const [inView, setInView] = useState(false);

  // ── Helper: cancel any in-progress fade ────────────────────────────────
  const cancelFade = () => {
    if (fadeRafRef.current !== null) {
      cancelAnimationFrame(fadeRafRef.current);
      fadeRafRef.current = null;
    }
  };

  // ── Helper: rAF-based volume fade with ease-out ─────────────────────────
  const fadeVolume = (
    el: HTMLVideoElement,
    target: number,
    onComplete?: () => void
  ) => {
    cancelFade();

    const start = el.volume;
    const delta = target - start;

    if (Math.abs(delta) < 0.001) {
      onComplete?.();
      return;
    }

    const startTime = performance.now();

    const tick = (now: number) => {
      const progress = Math.min((now - startTime) / FADE_DURATION, 1);
      const eased = 1 - Math.pow(1 - progress, 3);

      el.volume = Math.min(1, Math.max(0, start + delta * eased));

      if (progress < 1) {
        fadeRafRef.current = requestAnimationFrame(tick);
      } else {
        fadeRafRef.current = null;
        onComplete?.();
      }
    };

    fadeRafRef.current = requestAnimationFrame(tick);
  };

  // ── Play / pause + smooth mute on intersection ─────────────────────────
  useEffect(() => {
    const v = videoRef.current;
    const s = ref.current;
    if (!v || !s) return;

    const io = new IntersectionObserver(
      ([e]) => {
        setInView(e.isIntersecting);

        if (e.isIntersecting) {
          v.play().catch(() => {});

          if (hasInteractedRef.current) {
            v.muted = false;
            fadeVolume(v, 1);
          }
        } else {
          if (!v.muted) {
            fadeVolume(v, 0, () => {
              v.muted = true;
              setMuted(true);
              v.pause();
            });
          } else {
            v.pause();
          }
        }
      },
      { threshold: [0, 0.01] }
    );

    io.observe(s);

    return () => {
      io.disconnect();
      cancelFade();
    };
  }, []);

  // ── Toggle mute button ─────────────────────────────────────────────────
  const toggleMute = () => {
    const v = videoRef.current;
    if (!v) return;

    if (v.muted) {
      hasInteractedRef.current = true;
      v.muted = false;
      v.volume = 0;
      v.play().catch(() => {});
      fadeVolume(v, 1);
      setMuted(false);
    } else {
      fadeVolume(v, 0, () => {
        v.muted = true;
        setMuted(true);
      });
    }
  };

  return (
    <>
      <style>{`
        /* Landscape phones / small tablets */
        @media (max-width: 1024px) and (orientation: landscape) {
          .flimreel-spacer {
            height: 100vh !important;
          }

          .flimreel-title-wrap h2 {
            font-size: clamp(1rem, 4vw, 2rem) !important;
            letter-spacing: 0.2em !important;
          }
        }

        /* Portrait phones */
        @media (max-width: 767px) and (orientation: portrait) {
          .flimreel-spacer {
            height: 30vh !important;
          }
          .flimreel-spacer::before {
            content: "";
            display: block;
            height: 70vh;
          }
          /* KEEP VIDEO IN LANDSCAPE FRAME */
          .flimreel-video {
            width: 100vw !important;
            height: auto !important;
            aspect-ratio: 16 / 9 !important;
            object-fit: cover !important;

            position: absolute !important;
            top: 50% !important;
            left: 50% !important;
            transform: translate(-50%, -50%) !important;
          }

          .flimreel-title-wrap h2 {
            font-size: clamp(1rem, 6vw, 1.75rem) !important;
            letter-spacing: 0.18em !important;
          }
        }
      `}</style>

      {/* Fixed full-viewport video layer */}
      <div
        aria-hidden={!inView}
        className="fixed inset-0 -z-10 pointer-events-none overflow-hidden bg-black"
      >
        <video
          ref={videoRef}
          className="flimreel-video h-full w-full object-cover object-center"
          src={flimreelVideo}
          muted
          loop
          playsInline
          preload="metadata"
        />

        <div className="absolute inset-0 bg-linear-to-t from-black/70 via-transparent to-black/40" />
      </div>

      {/* Spacer section */}
      <section
        ref={ref}
        className="flimreel-spacer relative w-full bg-transparent"
      >
        {/* Sticky title */}
        <div className="flimreel-title-wrap sticky top-0 h-screen w-full flex items-end justify-center pb-[12%] px-6 pointer-events-none">
          <h2 className="font-display tracking-[0.3em] uppercase text-4xl md:text-6xl text-highlight drop-shadow-[0_2px_20px_rgba(0,0,0,0.6)] text-center">
            Cinematic Moments
          </h2>
        </div>

        {/* Mute / Unmute */}
        {inView && (
          <button
            onClick={toggleMute}
            aria-label={muted ? "Unmute video" : "Mute video"}
            className="fixed bottom-6 right-6 z-30 h-10 w-10 rounded-full bg-black/50 backdrop-blur-sm border border-white/20 text-white flex items-center justify-center hover:bg-black/70 transition-colors"
            style={{ pointerEvents: "auto" }}
          >
            {muted ? (
              <VolumeX className="h-4 w-4" />
            ) : (
              <Volume2 className="h-4 w-4" />
            )}
          </button>
        )}
      </section>
    </>
  );
};

export default Flimreel;