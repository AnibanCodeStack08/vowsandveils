import { useEffect, useRef, useState, useCallback } from "react";
import { AnimatePresence, motion } from "framer-motion";
import gsap from "gsap";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { useNavigate } from "react-router-dom";

const img1  = "/images/prewedding/img1.jpeg";
const img2  = "/images/prewedding/img2.jpeg";
const img3  = "/images/prewedding/img3.jpeg";
const img4  = "/images/prewedding/img4.jpeg";
const img5  = "/images/prewedding/img5.jpeg";
const img6  = "/images/prewedding/img6.jpeg";
const img7  = "/images/prewedding/img7.jpeg";
const img8  = "/images/prewedding/img8.jpeg";
const img9  = "/images/prewedding/img9.jpeg";
const img10 = "/images/prewedding/img10.jpeg";
const img11 = "/images/prewedding/img11.jpeg";
const img12 = "/images/prewedding/img12.jpeg";
const img13 = "/images/prewedding/img13.jpeg";
const img14 = "/images/prewedding/img14.jpeg";
const img15 = "/images/prewedding/img15.jpeg";
const img16 = "/images/prewedding/img16.jpeg";
const img17 = "/images/prewedding/img17.jpeg";
const img18 = "/images/prewedding/img18.jpeg";
const img19 = "/images/prewedding/img19.jpeg";
const img20 = "/images/prewedding/img20.jpeg";
const img21 = "/images/prewedding/img21.jpeg";
const img22 = "/images/prewedding/img22.jpeg";
const img23 = "/images/prewedding/img23.jpeg";
const img24 = "/images/prewedding/img24.jpeg";
const img25 = "/images/prewedding/img25.jpeg";
const img26 = "/images/prewedding/img26.jpeg";
const img27 = "/images/prewedding/img27.jpeg";
const img28 = "/images/prewedding/img28.jpeg";
const img29 = "/images/prewedding/img29.jpeg";
const img30 = "/images/prewedding/img30.jpeg";
const img31 = "/images/prewedding/img31.jpeg";
const img32 = "/images/prewedding/img32.jpeg";

export interface PreWeddingImage {
  src: string;
  alt: string;
}

const defaultImages: PreWeddingImage[] = [
  { src: img1,  alt: "Golden hour by the water" },
  { src: img2,  alt: "A quiet walk through the fields" },
  { src: img3,  alt: "She laughed without reason" },
  { src: img4,  alt: "His hand around her shoulder" },
  { src: img5,  alt: "Between the old banyan roots" },
  { src: img6,  alt: "The sari caught the wind" },
  { src: img7,  alt: "Looking out over the river" },
  { src: img8,  alt: "Foreheads together, eyes closed" },
  { src: img9,  alt: "Light through the lattice" },
  { src: img10, alt: "Under the open sky" },
  { src: img11, alt: "A moment of stillness" },
  { src: img12, alt: "Running along the shoreline" },
  { src: img13, alt: "Shadows on the terracotta wall" },
  { src: img14, alt: "The courtyard in afternoon light" },
  { src: img15, alt: "Wildflowers at her feet" },
  { src: img16, alt: "A glance over her shoulder" },
  { src: img17, alt: "Beside the painted doorway" },
  { src: img18, alt: "He whispered something" },
  { src: img19, alt: "Hands intertwined" },
  { src: img20, alt: "Dust and gold in the air" },
  { src: img21, alt: "The boat drifted slowly" },
  { src: img22, alt: "Beneath a canopy of leaves" },
  { src: img23, alt: "Silhouette at the window" },
  { src: img24, alt: "Petals scattered on the steps" },
  { src: img25, alt: "Two shadows, one direction" },
  { src: img26, alt: "Morning mist over the fields" },
  { src: img27, alt: "Barefoot on the cool stone" },
  { src: img28, alt: "She held the jasmine loosely" },
  { src: img29, alt: "A stolen smile" },
  { src: img30, alt: "Leaning into each other" },
  { src: img31, alt: "The last light of the evening" },
  { src: img32, alt: "Before forever began" },
];

interface PreWeddingProps {
  images?:      PreWeddingImage[];
  eyebrow?:     string;
  title?:       string;
  subtitle?:    string;
  description?: string;
  date?:        string;
  location?:    string;
}

// ── Centred lozenge divider ───────────────────────────────────────────────────
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
export default function PreWedding({
  images      = defaultImages,
  eyebrow     = "Pre Wedding",
  title       = "Before The Day",
  subtitle    = "Stolen afternoons and unhurried light.",
  description = "Before the ceremony, there was just the two of them — a story told before the vows.",
  date        = "",
  location    = "",
}: PreWeddingProps) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [colCount, setColCount]       = useState(4);
  const [ratios, setRatios]           = useState<Record<string, number>>({});

  const sectionRef = useRef<HTMLElement>(null);
  const heroRef    = useRef<HTMLDivElement>(null);

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

  // ── Measure images progressively ────────────────────────────────────────
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

  // ── Greedy bin-pack ──────────────────────────────────────────────────────
  const columns: number[][] = (() => {
    const cols: { items: number[]; h: number }[] = Array.from(
      { length: colCount },
      () => ({ items: [], h: 0 }),
    );
    images.forEach((img, idx) => {
      const r = ratios[img.src] ?? 1.33;
      let t = 0;
      for (let i = 1; i < cols.length; i++) {
        if (cols[i].h < cols[t].h) t = i;
      }
      cols[t].items.push(idx);
      cols[t].h += r;
    });
    return cols.map((c) => c.items);
  })();

  // ── GSAP hero entrance — same pattern as adhibash.tsx ───────────────────
  //
  //  .hero-word  →  each letter slides up from behind overflow-hidden mask
  //                 (yPercent 110 → 0, skewY 6 → 0, stagger 0.12)
  //  .hero-sub   →  eyebrow / subtitle / dividers / description / meta
  //                 fade + y slide (opacity 0→1, y 16→0, delay 0.7)
  //
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".hero-word",
        { yPercent: 110, opacity: 0, skewY: 6 },
        {
          yPercent: 0,
          opacity: 1,
          skewY: 0,
          duration: 1.1,
          stagger: 0.12,
          ease: "expo.out",
          delay: 0.2,
        }
      );
      gsap.fromTo(
        ".hero-sub",
        { opacity: 0, y: 16 },
        { opacity: 1, y: 0, duration: 1, delay: 0.7, ease: "power3.out" }
      );
    }, heroRef);

    return () => ctx.revert();
  }, []);

  // ── Lightbox controls ────────────────────────────────────────────────────
  const close = useCallback(() => setActiveIndex(null), []);

  const next = useCallback(() => {
    setActiveIndex((i) => (i === null ? i : (i + 1) % images.length));
  }, [images.length]);

  const prev = useCallback(() => {
    setActiveIndex((i) => (i === null ? i : (i - 1 + images.length) % images.length));
  }, [images.length]);

  useEffect(() => {
    if (activeIndex === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape")     close();
      if (e.key === "ArrowRight") next();
      if (e.key === "ArrowLeft")  prev();
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
      id="prewedding"
      className="relative w-full overflow-hidden bg-background py-24 sm:py-32 lg:py-40"
    >
      {/* ── Backgrounds ──────────────────────────────────────────────────── */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-[640px]"
        style={{
          background:
            "radial-gradient(ellipse 80% 65% at 50% -5%, color-mix(in oklab, var(--color-gold) 15%, transparent), transparent 60%)",
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-0 -translate-x-1/2 -translate-y-1/2 opacity-[0.045]"
        style={{ width: "min(900px, 110vw)", aspectRatio: "1" }}
      >
        {[1, 0.75, 0.55, 0.38].map((scale, i) => (
          <span
            key={i}
            className="absolute rounded-full"
            style={{
              border: "1px solid color-mix(in oklab, var(--color-gold) 100%, transparent)",
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
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.028] mix-blend-screen"
        style={{
          backgroundImage:
            "radial-gradient(circle at 1px 1px, color-mix(in oklab, var(--color-gold) 100%, transparent) 1px, transparent 0)",
          backgroundSize: "36px 36px",
        }}
      />

      {/* ── HERO HEADER — same animation as adhibash.tsx ─────────────────── */}
      <div
        ref={heroRef}
        className="relative mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-10"
      >
        <div className="mb-16 sm:mb-20 lg:mb-28 flex flex-col items-center text-center gap-6 sm:gap-7">

          {/* Top lozenge rule — hero-sub */}
          <LozengeDivider className="hero-sub max-w-2xl opacity-0" />

          {/* Eyebrow — hero-sub */}
          <p
            className="hero-sub tracking-[0.42em] uppercase text-[10px] sm:text-xs mt-2 opacity-0"
            style={{
              color: "color-mix(in oklab, var(--color-gold) 72%, transparent)",
            }}
          >
            {eyebrow}
          </p>

          {/* ── Title — letter-by-letter reveal behind overflow-hidden mask ── */}
          <div className="overflow-hidden leading-none">
            <h2
              className="font-display leading-[0.95] text-center"
              style={{
                fontSize: "clamp(3.8rem, 11vw, 9.5rem)",
                fontWeight: 300,
                letterSpacing: "-0.015em",
                color: "var(--color-foreground)",
              }}
            >
              {title.split("").map((ch, i) => (
                <span
                  key={i}
                  className="hero-word inline-block opacity-0"
                  style={{ display: ch === " " ? "inline" : "inline-block" }}
                >
                  {ch === " " ? "\u00A0" : ch}
                </span>
              ))}
            </h2>
          </div>

          {/* Subtitle — hero-sub */}
          <p
            className="hero-sub font-display italic opacity-0"
            style={{
              fontSize: "clamp(1rem, 2.2vw, 1.6rem)",
              fontWeight: 300,
              letterSpacing: "0.01em",
              color: "color-mix(in oklab, var(--color-foreground) 55%, transparent)",
              maxWidth: "44ch",
            }}
          >
            {subtitle}
          </p>

          {/* Mid lozenge rule — hero-sub */}
          <LozengeDivider className="hero-sub max-w-xs opacity-60 mt-1 opacity-0" />

          {/* Description — hero-sub */}
          <p
            className="hero-sub text-sm sm:text-base leading-relaxed opacity-0"
            style={{
              color: "color-mix(in oklab, var(--color-foreground) 42%, transparent)",
              maxWidth: "52ch",
            }}
          >
            {description}
          </p>

          {/* Meta — hero-sub */}
          <div className="hero-sub flex items-center justify-center gap-4 flex-wrap opacity-0">
            {date && (
              <span
                className="tracking-[0.32em] text-[10px] sm:text-xs uppercase"
                style={{ color: "color-mix(in oklab, var(--color-gold) 62%, transparent)" }}
              >
                {date}
              </span>
            )}
            {date && location && (
              <span aria-hidden style={{ color: "color-mix(in oklab, var(--color-gold) 28%, transparent)" }}>
                ·
              </span>
            )}
            {location && (
              <span
                className="tracking-[0.32em] text-[10px] sm:text-xs uppercase"
                style={{ color: "color-mix(in oklab, var(--color-gold) 62%, transparent)" }}
              >
                {location}
              </span>
            )}
            {(date || location) && (
              <span aria-hidden style={{ color: "color-mix(in oklab, var(--color-gold) 28%, transparent)" }}>
                ·
              </span>
            )}
            <span
              className="tracking-[0.32em] text-[10px] sm:text-xs uppercase"
              style={{ color: "color-mix(in oklab, var(--color-foreground) 28%, transparent)" }}
            >
              {String(images.length).padStart(2, "0")} photos
            </span>
          </div>
        </div>
      </div>

      {/* ── MASONRY GRID ─────────────────────────────────────────────────── */}
      <div className="relative w-full">
        <div
          className="grid items-stretch gap-[3px]"
          style={{ gridTemplateColumns: `repeat(${colCount}, minmax(0, 1fr))` }}
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

      {/* ── BOTTOM RULE + CTA ───────────────────────────────────────────── */}
      <div className="relative mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-10">
        <LozengeDivider className="mt-16 sm:mt-20 lg:mt-28 opacity-35" />

        <div className="mt-14 sm:mt-16 flex justify-center">
          <button
            onClick={() => navigate(-1)}
            className="group relative inline-flex items-center gap-3 overflow-hidden px-9 py-4 text-xs tracking-[0.38em] uppercase transition-all duration-500"
            style={{
              border: "1px solid color-mix(in oklab, var(--color-gold) 38%, transparent)",
              color: "color-mix(in oklab, var(--color-gold) 72%, transparent)",
              background: "transparent",
            }}
          >
            <span
              aria-hidden
              className="pointer-events-none absolute inset-0 -translate-x-full transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:translate-x-0"
              style={{
                background:
                  "linear-gradient(105deg, color-mix(in oklab, var(--color-gold) 10%, transparent), color-mix(in oklab, var(--color-gold) 6%, transparent))",
              }}
            />
            <svg
              aria-hidden
              viewBox="0 0 20 20"
              width="14"
              height="14"
              fill="none"
              className="relative transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:-translate-x-1"
              style={{ stroke: "color-mix(in oklab, var(--color-gold) 72%, transparent)" }}
            >
              <path d="M13 4L7 10L13 16" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <span className="relative">Return to memories</span>
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
                style={{ borderColor: "color-mix(in oklab, var(--color-gold) 80%, transparent)" }}
              />
            ))}
          </button>
        </div>

        <LozengeDivider className="mt-14 sm:mt-16 opacity-20" />
      </div>

      {/* ── LIGHTBOX ─────────────────────────────────────────────────────── */}
      <AnimatePresence>
        {activeIndex !== null && (
          <motion.div
            key="lightbox"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-background/96 backdrop-blur-lg"
            onClick={close}
          >
            <button
              onClick={(e) => { e.stopPropagation(); close(); }}
              className="absolute top-5 right-5 z-10 p-2 text-foreground/45 transition-colors hover:text-foreground"
              aria-label="Close"
            >
              <X size={20} />
            </button>

            <div
              className="absolute top-6 left-1/2 -translate-x-1/2 tracking-[0.35em] text-xs uppercase select-none"
              style={{ color: "color-mix(in oklab, var(--color-foreground) 38%, transparent)" }}
            >
              {String(activeIndex + 1).padStart(2, "0")}
              <span className="mx-2" style={{ color: "color-mix(in oklab, var(--color-foreground) 16%, transparent)" }}>
                /
              </span>
              {String(images.length).padStart(2, "0")}
            </div>

            <button
              onClick={(e) => { e.stopPropagation(); prev(); }}
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
                  transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                  className="max-h-[74vh] max-w-full object-contain"
                  style={{ boxShadow: "0 40px 100px -20px rgba(0,0,0,0.65)" }}
                  draggable={false}
                />
              </AnimatePresence>

              <AnimatePresence mode="wait">
                <motion.p
                  key={images[activeIndex].alt}
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -5 }}
                  transition={{ duration: 0.35, delay: 0.1 }}
                  className="italic text-xs sm:text-sm text-center"
                  style={{ color: "color-mix(in oklab, var(--color-foreground) 36%, transparent)" }}
                >
                  {images[activeIndex].alt}
                </motion.p>
              </AnimatePresence>
            </div>

            <button
              onClick={(e) => { e.stopPropagation(); next(); }}
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

// ── Tile ──────────────────────────────────────────────────────────────────────
interface TileProps {
  image: PreWeddingImage;
  index: number;
  isLast?: boolean;
  onClick: () => void;
}

function Tile({ image, index, isLast = false, onClick }: TileProps) {
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
          boxShadow: "inset 0 0 55px color-mix(in oklab, var(--color-gold) 25%, transparent)",
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
          style={{ color: "color-mix(in oklab, var(--color-foreground) 65%, transparent)" }}
        >
          {image.alt}
        </p>
      </div>
    </motion.button>
  );
}