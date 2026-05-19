import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { VIDEOS, type VideoItem } from "./../data/videos.ts";
import LiteYouTube from "./youtube.tsx";
interface VideoCardProps {
  video: VideoItem;
  index: number;
}

function VideoCard({ video, index }: VideoCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{
        duration: 0.7,
        delay: index * 0.08,
        ease: [0.22, 1, 0.36, 1],
      }}
      className="group relative overflow-hidden rounded-md border border-border bg-card transition-all duration-500 hover:border-gold hover:shadow-[0_0_40px_-12px_var(--color-gold)]"
    >
      <div className="relative aspect-video w-full overflow-hidden">
        <LiteYouTube id={video.id} title={video.title} />
      </div>
      <div className="flex items-center justify-between px-5 py-4">
        <span className="hairline text-muted-foreground">
          {String(index + 1).padStart(2, "0")}
        </span>
        <h3 className="font-display text-lg text-foreground transition-colors group-hover:text-gold">
          {video.title}
        </h3>
      </div>
    </motion.div>
  );
}

export default function VideoGallery() {
  const navigate = useNavigate();

  // Scroll to top when gallery mounts
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
  }, []);

  const handleBackHome = () => {
    window.scrollTo({ top: 0, behavior: "instant" });
    navigate("/");
  };

  return (
    <section className="relative min-h-screen w-full bg-background px-6 py-24 md:py-32">
      <div className="mx-auto max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="mb-16 flex flex-col items-center text-center"
        >
          <button
            onClick={handleBackHome}
            className="hairline mb-6 text-muted-foreground transition-colors hover:text-gold"
          >
            ← Back Home
          </button>
          <span className="hairline text-gold">Complete Archive</span>
          <h1 className="mt-4 font-display text-5xl text-foreground md:text-7xl">
            The Full Collection
          </h1>
          <div className="gold-line mt-8 w-40" />
          <p className="mt-6 max-w-xl text-muted-foreground">
            Every film, story, and frame — gathered in one place.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 md:gap-8 lg:grid-cols-3">
          {VIDEOS.map((video, i) => (
            <VideoCard key={`${video.id}-${i}`} video={video} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}