import { useEffect, useRef, useState, useCallback } from "react";
import { AnimatePresence, motion } from "framer-motion";
import gsap from "gsap";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { useNavigate } from "react-router-dom";

const img1  = "/images/engagement/img1.jpeg";
const img2  = "/images/engagement/img2.jpeg";
const img3  = "/images/engagement/img3.jpeg";
const img4  = "/images/engagement/img4.jpeg";
const img5  = "/images/engagement/img5.jpeg";
const img6  = "/images/engagement/img6.jpeg";
const img7  = "/images/engagement/img7.jpeg";
const img8  = "/images/engagement/img8.jpeg";
const img9  = "/images/engagement/img9.jpeg";
const img10 = "/images/engagement/img10.jpeg";
const img11 = "/images/engagement/img11.jpeg";
const img12 = "/images/engagement/img12.jpeg";
const img13 = "/images/engagement/img13.jpeg";
const img14 = "/images/engagement/img14.jpeg";
const img15 = "/images/engagement/img15.jpeg";
const img16 = "/images/engagement/img16.jpeg";
const img17 = "/images/engagement/img17.jpeg";
const img18 = "/images/engagement/img18.jpeg";
const img19 = "/images/engagement/img19.jpeg";
const img20 = "/images/engagement/img20.jpeg";

export interface EngagementImage {
  src: string;
  alt: string;
}

const defaultImages: EngagementImage[] = [
  { src: img1,  alt: "The ring slipped on in silence" },
  { src: img2,  alt: "Eyes that said yes before the words" },
  { src: img3,  alt: "Hands clasped, a promise made" },
  { src: img4,  alt: "Flower garlands on the threshold" },
  { src: img5,  alt: "The moment before everything changed" },
  { src: img6,  alt: "She glanced at the ring" },
  { src: img7,  alt: "Laughter between the families" },
  { src: img8,  alt: "A quiet corner, a shared secret" },
  { src: img9,  alt: "Petals on the ceremonial cloth" },
  { src: img10, alt: "The exchange of garlands" },
  { src: img11, alt: "Joy in the elders' eyes" },
  { src: img12, alt: "Shy smiles across the room" },
  { src: img13, alt: "The ring catches the light" },
  { src: img14, alt: "Hands held under marigold strings" },
  { src: img15, alt: "Blessed by the ones who came before" },
  { src: img16, alt: "Together on the steps" },
  { src: img17, alt: "A sari edge, a ring, a vow" },
  { src: img18, alt: "The afternoon the world changed" },
  { src: img19, alt: "Two families become one" },
  { src: img20, alt: "A beginning written in gold" },
];

interface EngagementProps {
  images?: EngagementImage[];
  eyebrow?: string;
  title?: string;
  subtitle?: string;
  description?: string;
  date?: string;
  location?: string;
}

// ── Small centred lozenge divider ────────────────────────────────────────────
function LozengeDivider({ className }: { className?: string }) {
  return (
    <div className={`flex items-center justify-center gap-3 w-full ${className ?? ""}`}>
      <span
        className="flex-1 h-px max-w-[120px] sm:max-w-[180px]"
        style={{
          background:
            "linear-gradient(to right, transparent, color-mix(in oklab, var(--color-gold) 50%, transparent))",
        }}
      />
      <svg viewBox="0 0 20 20" width="9" height="9" aria-hidden fill="none">
        <path
          d="M10 1 L19 10 L10 19 L1 10 Z"
          stroke="color-mix(in oklab, var(--color-gold) 65%, transparent)"
          strokeWidth="1.2"
        />
        <path
          d="M10 5 L15 10 L10 15 L5 10 Z"
          fill="color-mix(in oklab, var(--color-gold) 55%, transparent)"
        />
      </svg>
      <span
        className="flex-1 h-px max-w-[120px] sm:max-w-[180px]"
        style={{
          background:
            "linear-gradient(to left, transparent, color-mix(in oklab, var(--color-gold) 50%, transparent))",
        }}
      />
    </div>
  );
}

// ── Main component ────────────────────────────────────────────────────────────
export default function Engagement({
  images = defaultImages,
  eyebrow = "Prologue",
  title = "Engagement",
  subtitle = "Before the vows were spoken — two rings, two families, and a room full of light that knew.",
  description = "Two rings exchanged, two families joined — every frame from the day the promise was made.",
  date = "",
  location = "",
}: EngagementProps) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [colCount, setColCount] = useState(4);
  // Start with empty ratios — grid renders immediately with fallback ratio
  const [ratios, setRatios] = useState<Record<string, number>>({});

  const sectionRef = useRef<HTMLElement>(null);
  const headingRef = useRef<HTMLDivElement>(null);

  const navigate = useNavigate();

  // ── Responsive column count ─────────────────────────────────────────────
  useEffect(() => {
    const compute = () => {
      const w = window.innerWidth;
      setColCount(w >= 1024 ? 4 : w >= 640 ? 3 : 2);
    };

    compute();
    window.addEventListener("resize", compute);
    return () => window.removeEventListener("resize", compute);
  }, []);

  // ── Measure images progressively — update ratio as each one loads ───────
  useEffect(() => {
    let cancelled = false;
    images.forEach((img) => {
      const el = new window.Image();
      el.onload = () => {
        if (cancelled) return;
        const ratio = el.naturalHeight / el.naturalWidth;
        setRatios((prev) => ({ ...prev, [img.src]: ratio }));
      };
      el.onerror = () => {
        if (cancelled) return;
        setRatios((prev) => ({ ...prev, [img.src]: 1.33 }));
      };
      el.src = img.src;
    });
    return () => { cancelled = true; };
  }, [images]);

  // ── Greedy bin-pack — uses fallback ratio (1.33) until real ratio arrives ─
  const columns: number[][] = (() => {
    const cols: { items: number[]; h: number }[] = Array.from(
      { length: colCount },
      () => ({ items: [], h: 0 }),
    );
    images.forEach((img, idx) => {
      const r = ratios[img.src] ?? 1.33; // fallback until measured
      let t = 0;
      for (let i = 1; i < cols.length; i++) {
        if (cols[i].h < cols[t].h) t = i;
      }
      cols[t].items.push(idx);
      cols[t].h += r;
    });
    return cols.map((c) => c.items);
  })();

  // ── GSAP heading entrance ───────────────────────────────────────────────
  useEffect(() => {
    if (!headingRef.current) return;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        defaults: { ease: "expo.out" },
      });

      tl.from(".eng-top-rule", {
        scaleX: 0,
        duration: 1.6,
        transformOrigin: "center",
      }, 0)
        .from(".eng-eyebrow", {
          opacity: 0,
          y: -10,
          duration: 1,
        }, 0.15)
        .from(".eng-title", {
          opacity: 0,
          y: 28,
          duration: 1.4,
        }, 0.28)
        .from(".eng-subtitle", {
          opacity: 0,
          y: 14,
          duration: 1.1,
        }, 0.5)
        .from(".eng-bot-rule", {
          scaleX: 0,
          duration: 1.4,
          transformOrigin: "center",
        }, 0.55)
        .from(".eng-desc", {
          opacity: 0,
          y: 10,
          duration: 1,
        }, 0.7)
        .from(".eng-meta", {
          opacity: 0,
          duration: 0.9,
        }, 0.85);
    }, headingRef);

    return () => ctx.revert();
  }, []);

  // ── Lightbox controls ───────────────────────────────────────────────────
  const close = useCallback(() => setActiveIndex(null), []);

  const next = useCallback(() => {
    setActiveIndex((i) =>
      i === null ? i : (i + 1) % images.length
    );
  }, [images.length]);

  const prev = useCallback(() => {
    setActiveIndex((i) =>
      i === null ? i : (i - 1 + images.length) % images.length
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
      id="engagement"
      className="relative w-full overflow-hidden bg-background py-24 sm:py-32 lg:py-40"
    >
      {/* ── Backgrounds ──────────────────────────────────────────────────── */}

      {/* Wide centred glow */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-[640px]"
        style={{
          background:
            "radial-gradient(ellipse 80% 65% at 50% -5%, color-mix(in oklab, var(--color-gold) 15%, transparent), transparent 60%)",
        }}
      />

      {/* Faint concentric ring motif */}
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-0 -translate-x-1/2 -translate-y-1/2 opacity-[0.045]"
        style={{
          width: "min(900px, 110vw)",
          aspectRatio: "1",
        }}
      >
        {[1, 0.75, 0.55, 0.38].map((scale, i) => (
          <span
            key={i}
            className="absolute inset-0 rounded-full"
            style={{
              border:
                "1px solid color-mix(in oklab, var(--color-gold) 100%, transparent)",
              transform: `scale(${scale})`,
              top: "50%",
              left: "50%",
              width: "100%",
              height: "100%",
              translate: "-50% -50%",
              position: "absolute",
            }}
          />
        ))}
      </div>

      {/* Dot grid */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.028] mix-blend-screen"
        style={{
          backgroundImage:
            "radial-gradient(circle at 1px 1px, color-mix(in oklab, var(--color-gold) 100%, transparent) 1px, transparent 0)",
          backgroundSize: "36px 36px",
        }}
      />

      {/* ── HEADER ─────────────────────────────────────────────────────── */}
      <div className="relative mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-10">
        <div
          ref={headingRef}
          className="mb-16 sm:mb-20 lg:mb-28 flex flex-col items-center text-center gap-6 sm:gap-7"
        >
          <LozengeDivider className="eng-top-rule max-w-2xl" />

          <p
            className="eng-eyebrow tracking-[0.42em] uppercase text-[10px] sm:text-xs mt-2"
            style={{
              color:
                "color-mix(in oklab, var(--color-gold) 72%, transparent)",
            }}
          >
            {eyebrow}
          </p>

          <h2
            className="eng-title font-display leading-[0.95]"
            style={{
              fontSize: "clamp(3.8rem, 11vw, 9.5rem)",
              fontWeight: 300,
              letterSpacing: "-0.015em",
              color: "var(--color-foreground)",
            }}
          >
            {title}
          </h2>

          <p
            className="eng-subtitle font-display italic"
            style={{
              fontSize: "clamp(1rem, 2.2vw, 1.6rem)",
              fontWeight: 300,
              letterSpacing: "0.01em",
              color:
                "color-mix(in oklab, var(--color-foreground) 55%, transparent)",
              maxWidth: "44ch",
            }}
          >
            {subtitle}
          </p>

          <LozengeDivider className="eng-bot-rule max-w-xs opacity-60 mt-1" />

          <p
            className="eng-desc text-sm sm:text-base leading-relaxed"
            style={{
              color:
                "color-mix(in oklab, var(--color-foreground) 42%, transparent)",
              maxWidth: "52ch",
            }}
          >
            {description}
          </p>

          <div className="eng-meta flex items-center justify-center gap-4 flex-wrap">
            {date && (
              <span
                className="tracking-[0.32em] text-[10px] sm:text-xs uppercase"
                style={{
                  color:
                    "color-mix(in oklab, var(--color-gold) 62%, transparent)",
                }}
              >
                {date}
              </span>
            )}

            {date && location && (
              <span
                aria-hidden
                style={{
                  color:
                    "color-mix(in oklab, var(--color-gold) 28%, transparent)",
                }}
              >
                ·
              </span>
            )}

            {location && (
              <span
                className="tracking-[0.32em] text-[10px] sm:text-xs uppercase"
                style={{
                  color:
                    "color-mix(in oklab, var(--color-gold) 62%, transparent)",
                }}
              >
                {location}
              </span>
            )}

            {(date || location) && (
              <span
                aria-hidden
                style={{
                  color:
                    "color-mix(in oklab, var(--color-gold) 28%, transparent)",
                }}
              >
                ·
              </span>
            )}

            <span
              className="tracking-[0.32em] text-[10px] sm:text-xs uppercase"
              style={{
                color:
                  "color-mix(in oklab, var(--color-foreground) 28%, transparent)",
              }}
            >
              {String(images.length).padStart(2, "0")} photos
            </span>
          </div>
        </div>
      </div>

      {/* ── MASONRY GRID ─────────────────────────────────────────────── */}
      <div className="relative w-full">
        <div
          className="grid items-stretch gap-[3px]"
          style={{
            gridTemplateColumns: `repeat(${colCount}, minmax(0, 1fr))`,
          }}
        >
          {columns.map((colIndices, ci) => (
            <div key={ci} className="flex h-full flex-col gap-[3px]">
              {colIndices.map((globalIndex, position) => (
                <Tile
                  key={images[globalIndex].src + globalIndex}
                  image={images[globalIndex]}
                  index={globalIndex}
                  isLast={position === colIndices.length - 1}
                  onClick={() => setActiveIndex(globalIndex)}
                />
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* ── BOTTOM RULE + CTA ─────────────────────────────────────────────── */}
      <div className="relative mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-10">
        <LozengeDivider className="mt-16 sm:mt-20 lg:mt-28 opacity-35" />

        {/* Back CTA */}
        <div className="mt-14 sm:mt-16 flex justify-center">
          <button
            onClick={() => navigate(-1)}
            className="group relative inline-flex items-center gap-3 overflow-hidden px-9 py-4 text-xs tracking-[0.38em] uppercase transition-all duration-500"
            style={{
              border:
                "1px solid color-mix(in oklab, var(--color-gold) 38%, transparent)",
              color:
                "color-mix(in oklab, var(--color-gold) 72%, transparent)",
              background: "transparent",
            }}
          >
            {/* Shimmer fill on hover */}
            <span
              aria-hidden
              className="pointer-events-none absolute inset-0 -translate-x-full transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:translate-x-0"
              style={{
                background:
                  "linear-gradient(105deg, color-mix(in oklab, var(--color-gold) 10%, transparent), color-mix(in oklab, var(--color-gold) 6%, transparent))",
              }}
            />

            {/* Arrow */}
            <svg
              aria-hidden
              viewBox="0 0 20 20"
              width="14"
              height="14"
              fill="none"
              className="relative transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:-translate-x-1"
              style={{
                stroke:
                  "color-mix(in oklab, var(--color-gold) 72%, transparent)",
              }}
            >
              <path
                d="M13 4L7 10L13 16"
                strokeWidth="1.4"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>

            <span className="relative">Return to memories</span>

            {/* Corner accents */}
            {[
              "top-0 left-0 border-t border-l",
              "top-0 right-0 border-t border-r",
              "bottom-0 left-0 border-b border-l",
              "bottom-0 right-0 border-b border-r",
            ].map((cls, i) => (
              <span
                key={i}
                aria-hidden
                className={`pointer-events-none absolute ${cls} h-2.5 w-2.5 opacity-0 transition-opacity duration-500 group-hover:opacity-100`}
                style={{
                  borderColor:
                    "color-mix(in oklab, var(--color-gold) 80%, transparent)",
                }}
              />
            ))}
          </button>
        </div>

        <LozengeDivider className="mt-14 sm:mt-16 opacity-20" />
      </div>

      {/* ── LIGHTBOX ───────────────────────────────────────────────────── */}
      <AnimatePresence>
        {activeIndex !== null && (
          <motion.div
            key="lightbox"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{
              duration: 0.3,
              ease: [0.22, 1, 0.36, 1],
            }}
            className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-background/96 backdrop-blur-lg"
            onClick={close}
          >
            <button
              onClick={(e) => {
                e.stopPropagation();
                close();
              }}
              className="absolute top-5 right-5 z-10 p-2 text-foreground/45 transition-colors hover:text-foreground"
              aria-label="Close"
            >
              <X size={20} />
            </button>

            <div
              className="absolute top-6 left-1/2 -translate-x-1/2 tracking-[0.35em] text-xs uppercase select-none"
              style={{
                color:
                  "color-mix(in oklab, var(--color-foreground) 38%, transparent)",
              }}
            >
              {String(activeIndex + 1).padStart(2, "0")}
              <span
                className="mx-2"
                style={{
                  color:
                    "color-mix(in oklab, var(--color-foreground) 16%, transparent)",
                }}
              >
                /
              </span>
              {String(images.length).padStart(2, "0")}
            </div>

            <button
              onClick={(e) => {
                e.stopPropagation();
                prev();
              }}
              className="absolute left-3 sm:left-6 z-10 p-3 text-foreground/38 transition-colors hover:text-foreground"
              aria-label="Previous"
            >
              <ChevronLeft size={26} />
            </button>

            <div
              className="relative max-h-[80vh] max-w-[88vw] sm:max-w-[76vw] flex flex-col items-center gap-5"
              onClick={(e) => e.stopPropagation()}
            >
              <AnimatePresence mode="wait">
                <motion.img
                  key={images[activeIndex].src}
                  src={images[activeIndex].src}
                  alt={images[activeIndex].alt}
                  initial={{ opacity: 0, scale: 0.97, y: 10 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.97, y: -10 }}
                  transition={{
                    duration: 0.45,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                  className="max-h-[74vh] max-w-full object-contain"
                  style={{
                    boxShadow:
                      "0 40px 100px -20px rgba(0,0,0,0.65)",
                  }}
                  draggable={false}
                />
              </AnimatePresence>

              <AnimatePresence mode="wait">
                <motion.p
                  key={images[activeIndex].alt}
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -5 }}
                  transition={{
                    duration: 0.35,
                    delay: 0.1,
                  }}
                  className="italic text-xs sm:text-sm text-center"
                  style={{
                    color:
                      "color-mix(in oklab, var(--color-foreground) 36%, transparent)",
                  }}
                >
                  {images[activeIndex].alt}
                </motion.p>
              </AnimatePresence>
            </div>

            <button
              onClick={(e) => {
                e.stopPropagation();
                next();
              }}
              className="absolute right-3 sm:right-6 z-10 p-3 text-foreground/38 transition-colors hover:text-foreground"
              aria-label="Next"
            >
              <ChevronRight size={26} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}

// ── Tile ───────────────────────────────────────────────────────────────
interface TileProps {
  image: EngagementImage;
  index: number;
  isLast?: boolean;
  onClick: () => void;
}

function Tile({
  image,
  index,
  isLast = false,
  onClick,
}: TileProps) {
  // First 8 tiles are above the fold — load eagerly with high priority
  const isAboveFold = index < 8;

  const isLastCls = isLast ? " flex-1 flex flex-col" : "";

  const imgCls = isLast
    ? "block w-full flex-1 h-0 min-h-0 object-cover transition-all duration-[1300ms] ease-out will-change-transform group-hover:scale-[1.045] group-hover:brightness-[1.06]"
    : "block h-auto w-full object-cover transition-all duration-[1300ms] ease-out will-change-transform group-hover:scale-[1.045] group-hover:brightness-[1.06]";

  return (
    <motion.button
      type="button"
      onClick={onClick}
      initial={{ opacity: 0, y: 22 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{
        duration: 0.95,
        ease: [0.22, 1, 0.36, 1],
        delay: (index % 4) * 0.06,
      }}
      className={`group relative block w-full overflow-hidden bg-card focus:outline-none focus-visible:ring-2 focus-visible:ring-gold hover:z-10${isLastCls}`}
      aria-label={`Open photo: ${image.alt}`}
    >
      <img
        src={image.src}
        alt={image.alt}
        loading={isAboveFold ? "eager" : "lazy"}
        decoding={isAboveFold ? "sync" : "async"}
        // @ts-ignore — fetchpriority is valid HTML but TS types lag behind
        fetchpriority={index === 0 ? "high" : "auto"}
        className={imgCls}
      />

      <div
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-700 group-hover:opacity-100"
        style={{
          boxShadow:
            "inset 0 0 55px color-mix(in oklab, var(--color-gold) 25%, transparent)",
        }}
      />

      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 translate-y-full transition-transform duration-[480ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:translate-y-0"
        style={{
          background:
            "linear-gradient(to top, color-mix(in oklab, var(--color-background) 82%, transparent), transparent)",
          paddingTop: "2.5rem",
          paddingBottom: "0.75rem",
          paddingInline: "0.875rem",
        }}
      >
        <p
          className="text-xs italic leading-snug"
          style={{
            color:
              "color-mix(in oklab, var(--color-foreground) 65%, transparent)",
          }}
        >
          {image.alt}
        </p>
      </div>
    </motion.button>
  );
}