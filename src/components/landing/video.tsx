import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { VIDEOS, type VideoItem } from "../data/videos.ts";
import LiteYouTube from "../pages/youtube.tsx";

interface VideoCardProps {
  video: VideoItem;
  index: number;
}

function VideoCard({ video, index }: VideoCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 32 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.7, delay: index * 0.12, ease: [0.22, 1, 0.36, 1] }}
      className="group relative overflow-hidden rounded-md border border-border bg-card transition-all duration-500 hover:border-gold"
    >
      <div className="relative aspect-video w-full overflow-hidden">
        <LiteYouTube id={video.id} title={video.title} />
      </div>
      <div className="flex items-center justify-between px-5 py-4">
        <span className="hairline text-muted-foreground">Film</span>
        <h3 className="font-display text-lg text-foreground transition-colors group-hover:text-gold">
          {video.title}
        </h3>
      </div>
    </motion.div>
  );
}

export default function Video() {
  const navigate = useNavigate();
  const featured = VIDEOS.slice(0, 4);

  const handleViewAll = () => {
    window.scrollTo({ top: 0, behavior: "instant" });
    navigate("/videos");
  };

  return (
    <section className="relative w-full bg-background px-6 py-24 md:py-32">
      <div className="mx-auto max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="mb-16 flex flex-col items-center text-center"
        >
          <span className="hairline text-gold">Selected Work</span>
          <h2 className="mt-4 font-display text-4xl text-foreground md:text-6xl">
            Films &amp; Visual Stories
          </h2>
          <div className="gold-line mt-8 w-32" />
        </motion.div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 md:gap-8">
          {featured.map((video, i) => (
            <VideoCard key={`${video.id}-${i}`} video={video} index={i} />
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-16 flex justify-center"
        >
          <button
            onClick={handleViewAll}
            className="group relative inline-flex items-center gap-3 border border-gold bg-transparent px-8 py-4 text-sm tracking-[0.2em] uppercase text-gold transition-all duration-300 hover:bg-gold hover:text-accent-foreground"
          >
            View All Videos
            <span className="inline-block transition-transform duration-300 group-hover:translate-x-1">
              →
            </span>
          </button>
        </motion.div>
      </div>
    </section>
  );
}