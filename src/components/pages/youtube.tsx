import { useState } from "react";

interface LiteYouTubeProps {
  id: string;
  title: string;
}

export default function LiteYouTube({ id, title }: LiteYouTubeProps) {
  const [activated, setActivated] = useState(false);

  if (activated) {
    return (
      <iframe
        src={`https://www.youtube-nocookie.com/embed/${id}?autoplay=1&rel=0&modestbranding=1&playsinline=1`}
        title={title}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        allowFullScreen
        referrerPolicy="strict-origin-when-cross-origin"
        className="absolute inset-0 h-full w-full"
      />
    );
  }

  return (
    <button
      type="button"
      onClick={() => setActivated(true)}
      aria-label={`Play ${title}`}
      className="group/play absolute inset-0 h-full w-full cursor-pointer overflow-hidden bg-card"
    >
      <img
        src={`https://i.ytimg.com/vi/${id}/hqdefault.jpg`}
        srcSet={`https://i.ytimg.com/vi/${id}/hqdefault.jpg 480w, https://i.ytimg.com/vi/${id}/maxresdefault.jpg 1280w`}
        alt={title}
        loading="lazy"
        className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover/play:scale-105"
      />
      {/* Subtle dark overlay */}
      <div className="absolute inset-0 bg-linear-to-t from-background/60 via-background/10 to-transparent transition-opacity duration-500 group-hover/play:opacity-80" />

      {/* Custom play button */}
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="relative flex h-14 w-14 items-center justify-center rounded-full border border-gold/70 bg-background/40 backdrop-blur-sm transition-all duration-500 group-hover/play:scale-110 group-hover/play:border-gold group-hover/play:bg-gold/20 md:h-16 md:w-16">
          <span className="absolute inset-0 rounded-full border border-gold/30 transition-transform duration-700 group-hover/play:scale-125 group-hover/play:opacity-0" />
          <svg
            viewBox="0 0 24 24"
            fill="currentColor"
            className="ml-0.5 h-5 w-5 text-gold transition-transform duration-300 group-hover/play:scale-110 md:h-6 md:w-6"
            aria-hidden="true"
          >
            <path d="M8 5.14v13.72a1 1 0 0 0 1.52.86l11.06-6.86a1 1 0 0 0 0-1.72L9.52 4.28A1 1 0 0 0 8 5.14z" />
          </svg>
        </span>
      </div>
    </button>
  );
}
