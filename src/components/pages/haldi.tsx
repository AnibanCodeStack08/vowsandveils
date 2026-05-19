import { useEffect, useRef, useState, useCallback } from "react";
import { AnimatePresence, motion } from "framer-motion";
import gsap from "gsap";
import { ChevronLeft, ChevronRight, X } from "lucide-react";

const img1 = "/images/haldi/img1.jpeg";
const img2 = "/images/haldi/img2.jpeg";
const img3 = "/images/haldi/img3.jpeg";
const img4 = "/images/haldi/img4.jpeg";
const img5 = "/images/haldi/img5.jpeg";
const img6 = "/images/haldi/img6.jpeg";
const img7 = "/images/haldi/img7.jpeg";
const img8 = "/images/haldi/img8.jpeg";
const img9 = "/images/haldi/img9.jpeg";
const img10 = "/images/haldi/img10.jpeg";
const img11 = "/images/haldi/img11.jpeg";
const img12 = "/images/haldi/img12.jpeg";
const img13 = "/images/haldi/img13.jpeg";
const img14 = "/images/haldi/img14.jpeg";
const img15 = "/images/haldi/img15.jpeg";
const img16 = "/images/haldi/img16.jpeg";
const img17 = "/images/haldi/img17.jpeg";
const img18 = "/images/haldi/img18.jpeg";
const img19 = "/images/haldi/img19.jpeg";
const img20 = "/images/haldi/img20.jpeg";

export interface HaldiImage {
  src: string;
  alt: string;
}

const defaultImages: HaldiImage[] = [
  { src: img1, alt: "Turmeric on open palms" },
  { src: img2, alt: "A dab of gold on the cheek" },
  { src: img3, alt: "Laughter in the courtyard" },
  { src: img4, alt: "Sisters smearing haldi" },
  { src: img5, alt: "The bride eyes closed, at peace" },
  { src: img6, alt: "Yellow petals in a brass bowl" },
  { src: img7, alt: "Elders blessing the threshold" },
  { src: img8, alt: "Hands stained with turmeric" },
  { src: img9, alt: "Morning light on the mandap" },
  { src: img10, alt: "The groom's face — golden" },
  { src: img11, alt: "Marigolds underfoot" },
  { src: img12, alt: "Joy spilling through the doorway" },
  { src: img13, alt: "Cousins in a huddle" },
  { src: img14, alt: "Paste on the forehead" },
  { src: img15, alt: "A smile behind the veil of yellow" },
  { src: img16, alt: "Dhol in the distance" },
  { src: img17, alt: "Floral patterns on the floor" },
  { src: img18, alt: "Gentle hands, gentle rite" },
  { src: img19, alt: "The bride alone — serene" },
  { src: img20, alt: "A golden beginning" },
];

interface HaldiProps {
  images?: HaldiImage[];
  eyebrow?: string;
  title?: string;
  subtitle?: string;
  description?: string;
  date?: string;
  location?: string;
}

function LozengeDivider({ className }: { className?: string }) {
  return (
    <div
      className={`flex items-center justify-center gap-3 w-full ${
        className ?? ""
      }`}
    >
      <span
        className="flex-1 h-px max-w-32 sm:max-w-44"
        style={{
          background:
            "linear-gradient(to right, transparent, rgba(212,175,55,0.4))",
        }}
      />

      <svg viewBox="0 0 20 20" width="9" height="9" aria-hidden fill="none">
        <path
          d="M10 1 L19 10 L10 19 L1 10 Z"
          stroke="rgba(212,175,55,0.7)"
          strokeWidth="1.2"
        />
        <path
          d="M10 5 L15 10 L10 15 L5 10 Z"
          fill="rgba(212,175,55,0.45)"
        />
      </svg>

      <span
        className="flex-1 h-px max-w-32 sm:max-w-44"
        style={{
          background:
            "linear-gradient(to left, transparent, rgba(212,175,55,0.4))",
        }}
      />
    </div>
  );
}

export default function Haldi({
  images = defaultImages,
  eyebrow = "The Haldi",
  title = "Golden Morning",
  subtitle = "Turmeric on skin, sunlight on everything.",
  description = "The ceremony that colours the morning before the vows — yellow, gold, and unguarded joy.",
  date = "",
  location = "",
}: HaldiProps) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [colCount, setColCount] = useState(4);
  const [ratios, setRatios] = useState<Record<string, number>>({});

  const sectionRef = useRef<HTMLElement>(null);
  const headingRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const compute = () => {
      const w = window.innerWidth;
      setColCount(w >= 1024 ? 4 : w >= 640 ? 3 : 2);
    };

    compute();

    window.addEventListener("resize", compute);

    return () => window.removeEventListener("resize", compute);
  }, []);

  useEffect(() => {
    let cancelled = false;

    const map: Record<string, number> = {};
    let pending = images.length;

    images.forEach((img) => {
      const el = new Image();

      const done = () => {
        if (cancelled) return;

        pending--;

        if (pending === 0) {
          setRatios({ ...map });
        }
      };

      el.onload = () => {
        map[img.src] = el.naturalHeight / el.naturalWidth;
        done();
      };

      el.onerror = () => {
        map[img.src] = 1.3;
        done();
      };

      el.src = img.src;
    });

    return () => {
      cancelled = true;
    };
  }, [images]);

  const columns: number[][] = (() => {
    const cols = Array.from({ length: colCount }, () => [] as number[]);

    images.forEach((_, idx) => {
      cols[idx % colCount].push(idx);
    });

    return cols;
  })();

  useEffect(() => {
    if (!headingRef.current) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".hl-animate",
        {
          opacity: 0,
          y: 30,
        },
        {
          opacity: 1,
          y: 0,
          duration: 1,
          stagger: 0.12,
          ease: "power3.out",
        }
      );
    }, headingRef);

    return () => ctx.revert();
  }, []);

  const close = useCallback(() => {
    setActiveIndex(null);
  }, []);

  const next = useCallback(() => {
    setActiveIndex((prev) =>
      prev === null ? null : (prev + 1) % images.length
    );
  }, [images.length]);

  const prev = useCallback(() => {
    setActiveIndex((prev) =>
      prev === null
        ? null
        : (prev - 1 + images.length) % images.length
    );
  }, [images.length]);

  useEffect(() => {
    if (activeIndex === null) return;

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      if (e.key === "ArrowRight") next();
      if (e.key === "ArrowLeft") prev();
    };

    window.addEventListener("keydown", onKey);

    document.body.style.overflow = "hidden";

    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [activeIndex, close, next, prev]);

  return (
    <section
      ref={sectionRef}
      id="haldi"
      className="relative w-full overflow-hidden bg-black py-24 sm:py-32"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div
          ref={headingRef}
          className="mb-16 flex flex-col items-center text-center gap-6"
        >
          <LozengeDivider className="hl-animate max-w-2xl" />

          <p className="hl-animate tracking-[0.4em] uppercase text-xs text-yellow-500">
            {eyebrow}
          </p>

          <h2 className="hl-animate text-white text-5xl sm:text-7xl font-light leading-none">
            {title}
          </h2>

          <p className="hl-animate text-white/70 italic text-lg max-w-2xl">
            {subtitle}
          </p>

          <LozengeDivider className="hl-animate max-w-sm" />

          <p className="hl-animate text-white/60 text-sm sm:text-base max-w-3xl leading-relaxed">
            {description}
          </p>

          <div className="hl-animate flex items-center gap-4 text-xs uppercase tracking-[0.3em] text-yellow-500">
            {date && <span>{date}</span>}
            {location && <span>{location}</span>}
            <span>{images.length} Frames</span>
          </div>
        </div>

        {/* Grid */}
        <div
          className="grid gap-1"
          style={{
            gridTemplateColumns: `repeat(${colCount}, minmax(0, 1fr))`,
          }}
        >
          {columns.map((col, ci) => (
            <div key={ci} className="flex flex-col gap-1">
              {col.map((index) => (
                <Tile
                  key={images[index].src}
                  image={images[index]}
                  index={index}
                  onClick={() => setActiveIndex(index)}
                />
              ))}
            </div>
          ))}
        </div>

        <LozengeDivider className="mt-20 opacity-40" />
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {activeIndex !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/95 backdrop-blur-md flex items-center justify-center"
            onClick={close}
          >
            <button
              onClick={(e) => {
                e.stopPropagation();
                close();
              }}
              className="absolute top-5 right-5 text-white/70 hover:text-white"
            >
              <X size={28} />
            </button>

            <button
              onClick={(e) => {
                e.stopPropagation();
                prev();
              }}
              className="absolute left-4 text-white/70 hover:text-white"
            >
              <ChevronLeft size={36} />
            </button>

            <div
              className="max-w-6xl max-h-[85vh] px-4"
              onClick={(e) => e.stopPropagation()}
            >
              <motion.img
                key={images[activeIndex].src}
                src={images[activeIndex].src}
                alt={images[activeIndex].alt}
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.96 }}
                transition={{ duration: 0.35 }}
                className="max-h-[80vh] w-auto object-contain"
              />

              <p className="mt-4 text-center text-white/60 italic text-sm">
                {images[activeIndex].alt}
              </p>
            </div>

            <button
              onClick={(e) => {
                e.stopPropagation();
                next();
              }}
              className="absolute right-4 text-white/70 hover:text-white"
            >
              <ChevronRight size={36} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}

interface TileProps {
  image: HaldiImage;
  index: number;
  onClick: () => void;
}

function Tile({ image, index, onClick }: TileProps) {
  return (
    <motion.button
      type="button"
      onClick={onClick}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{
        duration: 0.8,
        delay: (index % 4) * 0.08,
      }}
      className="group relative overflow-hidden"
    >
      <img
        src={image.src}
        alt={image.alt}
        loading="lazy"
        decoding="async"
        className="w-full object-cover transition-transform duration-700 group-hover:scale-105"
      />

      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-500" />

      <div className="absolute bottom-0 left-0 right-0 translate-y-full group-hover:translate-y-0 transition-transform duration-500 bg-linear-to-t from-black/80 to-transparent p-4">
        <p className="text-white/80 text-xs italic">
          {image.alt}
        </p>
      </div>
    </motion.button>
  );
}