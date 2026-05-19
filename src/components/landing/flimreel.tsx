import { useEffect, useRef, useState } from "react";
import { Volume2, VolumeX } from "lucide-react";

const flimreelVideo = "/videos/flimreel.mp4";

const Flimreel = () => {
  const ref = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [muted, setMuted] = useState(true);
  const [inView, setInView] = useState(false);

  // Play only while the spacer is in view; pause otherwise.
  useEffect(() => {
    const v = videoRef.current;
    const s = ref.current;
    if (!v || !s) return;

    const io = new IntersectionObserver(
      ([e]) => {
        setInView(e.isIntersecting);
        if (e.isIntersecting) v.play().catch(() => {});
        else v.pause();
      },
      { threshold: 0.01 }
    );

    io.observe(s);
    return () => io.disconnect();
  }, []);

  const toggleMute = () => {
    const v = videoRef.current;
    if (!v) return;
    v.muted = !v.muted;
    setMuted(v.muted);
    if (!v.muted) v.play().catch(() => {});
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
          className="h-full w-full object-cover"
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