import { useEffect, useRef, useState } from "react";
import { Volume2, VolumeX } from "lucide-react";

const flimreelVideo = "/videos/flimreel.mp4";

const FADE_DURATION = 900; // ms

const Flimreel = () => {
  const ref      = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const fadeRafRef           = useRef<number | null>(null);
  const hasInteractedRef     = useRef(false); // user has clicked unmute at least once
  const [muted, setMuted]    = useState(true);
  const [inView, setInView]  = useState(false);

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
      const eased    = 1 - Math.pow(1 - progress, 3); // cubic ease-out

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

          // Fade volume up only if the user has already unmuted
          if (hasInteractedRef.current) {
            v.muted  = false;
            v.volume = v.volume === 1 ? 1 : v.volume; // keep current if mid-fade
            fadeVolume(v, 1);
          }
        } else {
          // Fade out first, then mute & pause
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
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // ── Toggle mute button ─────────────────────────────────────────────────
  const toggleMute = () => {
    const v = videoRef.current;
    if (!v) return;

    if (v.muted) {
      // Unmuting: mark interaction, unmute element, fade in
      hasInteractedRef.current = true;
      v.muted  = false;
      v.volume = 0;
      v.play().catch(() => {});
      fadeVolume(v, 1);
      setMuted(false);
    } else {
      // Muting: fade out, then mute
      fadeVolume(v, 0, () => {
        v.muted = true;
        setMuted(true);
      });
    }
  };

  return (
    <>
      {/* Fixed, centered video layer */}
      <div
        aria-hidden={!inView}
        className="fixed inset-0 -z-10 pointer-events-none overflow-hidden"
      >
        <video
          ref={videoRef}
          className="h-full w-full object-cover object-center"
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
        className="relative w-full h-[120vh] bg-transparent"
      >
        {/* Title */}
        <div className="sticky top-0 h-screen w-full flex items-end justify-center pb-[12%] px-6 pointer-events-none">
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