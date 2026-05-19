import { useEffect, useRef, useState, useCallback } from "react";
import { AnimatePresence, motion } from "framer-motion";
import gsap from "gsap";
import { ChevronLeft, ChevronRight, X } from "lucide-react";

const img1  = "images/adhibash/img1.jpeg";
const img2  = "images/adhibash/img2.jpeg";
const img3  = "images/adhibash/img3.jpeg";
const img4  = "images/adhibash/img4.jpeg";
const img5  = "images/adhibash/img5.jpeg";
const img6  = "images/adhibash/img6.jpeg";
const img7  = "images/adhibash/img7.jpeg";
const img8  = "images/adhibash/img8.jpeg";
const img9  = "images/adhibash/img9.jpeg";
const img10 = "images/adhibash/img10.jpeg";
const img11 = "images/adhibash/img11.jpeg";
const img12 = "images/adhibash/img12.jpeg";
const img13 = "images/adhibash/img13.jpeg";
const img14 = "images/adhibash/img14.jpeg";
const img15 = "images/adhibash/img15.jpeg";
const img16 = "images/adhibash/img16.jpeg";
const img17 = "images/adhibash/img17.jpeg";
const img18 = "images/adhibash/img18.jpeg";
const img19 = "images/adhibash/img19.jpeg";
const img20 = "images/adhibash/img20.jpeg";

export interface AdhibashImage {
  src: string;
  alt: string;
}

const defaultImages: AdhibashImage[] = [
  { src: img1,  alt: "Bride by the still water" },
  { src: img2,  alt: "Winnowing rice at the harvest" },
  { src: img3,  alt: "Resting under the mandap" },
  { src: img4,  alt: "Joy in the paddy field" },
  { src: img5,  alt: "Walking through the rice stalks" },
  { src: img6,  alt: "With a peacock feather" },
  { src: img7,  alt: "Couple at the temple steps" },
  { src: img8,  alt: "Couple by the village home" },
  { src: img9,  alt: "On the boat at dawn" },
  { src: img10, alt: "Feet in the river" },
  { src: img11, alt: "Beneath the painted boat" },
  { src: img12, alt: "At the water's edge" },
  { src: img13, alt: "A ride through the fields" },
  { src: img14, alt: "Through the tall stalks" },
  { src: img15, alt: "Dance with the pigeons" },
  { src: img16, alt: "Sunlit terracotta arches" },
  { src: img17, alt: "By the flowing river" },
  { src: img18, alt: "Among the fallen petals" },
  { src: img19, alt: "Beneath the bougainvillea" },
  { src: img20, alt: "A quiet pledge" },
];

interface AdhibashProps {
  images?:      AdhibashImage[];
  eyebrow?:     string;
  title?:       string;
  subtitle?:    string;
  description?: string;
  date?:        string;
  location?:    string;
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
export default function Adhibash({
  images      = defaultImages,
  eyebrow     = "Chapter Two",
  title       = "Adhibash",
  subtitle    = "The eve before the vows — quiet rituals, soft light, and a bride at home in her own story.",
  description = "Sacred preparations on the night before the wedding — every frame from the eve of the ceremony.",
  date        = "",
  location    = "",
}: AdhibashProps) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [colCount, setColCount]       = useState(4);
  const [ratios, setRatios]           = useState<Record<string, number>>({});
  const ratiosReady = Object.keys(ratios).length === images.length;

  const sectionRef = useRef<HTMLElement>(null);
  const headingRef = useRef<HTMLDivElement>(null);

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

  // ── Measure all images ──────────────────────────────────────────────────
  useEffect(() => {
    let cancelled = false;
    const map: Record<string, number> = {};
    let pending = images.length;
    images.forEach((img) => {
      const el = new window.Image();
      const done = () => {
        if (cancelled) return;
        pending--;
        if (pending === 0) setRatios({ ...map });
      };
      el.onload  = () => { map[img.src] = el.naturalHeight / el.naturalWidth; done(); };
      el.onerror = () => { map[img.src] = 1.33; done(); };
      el.src = img.src;
    });
    return () => { cancelled = true; };
  }, [images]);

  // ── Greedy bin-pack ─────────────────────────────────────────────────────
  const columns: number[][] = (() => {
    if (!ratiosReady) return Array.from({ length: colCount }, () => [] as number[]);
    const cols: { items: number[]; h: number }[] = Array.from(
      { length: colCount },
      () => ({ items: [], h: 0 }),
    );
    images.forEach((img, idx) => {
      const r = ratios[img.src];
      let t = 0;
      for (let i = 1; i < cols.length; i++) if (cols[i].h < cols[t].h) t = i;
      cols[t].items.push(idx);
      cols[t].h += r;
    });
    return cols.map((c) => c.items);
  })();

  // ── GSAP heading entrance ───────────────────────────────────────────────
  useEffect(() => {
    if (!headingRef.current) return;
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: "expo.out" } });
      tl.from(".adh-top-rule",  { scaleX: 0,  duration: 1.6, transformOrigin: "center" }, 0)
        .from(".adh-eyebrow",   { opacity: 0, y: -10, duration: 1 }, 0.15)
        .from(".adh-title",     { opacity: 0, y: 28,  duration: 1.4 }, 0.28)
        .from(".adh-subtitle",  { opacity: 0, y: 14,  duration: 1.1 }, 0.5)
        .from(".adh-bot-rule",  { scaleX: 0,  duration: 1.4, transformOrigin: "center" }, 0.55)
        .from(".adh-desc",      { opacity: 0, y: 10,  duration: 1 }, 0.7)
        .from(".adh-meta",      { opacity: 0,          duration: 0.9 }, 0.85);
    }, headingRef);
    return () => ctx.revert();
  }, []);

  // ── Lightbox controls ───────────────────────────────────────────────────
  const close = useCallback(() => setActiveIndex(null), []);
  const next  = useCallback(
    () => setActiveIndex((i) => (i === null ? i : (i + 1) % images.length)),
    [images.length],
  );
  const prev  = useCallback(
    () => setActiveIndex((i) => (i === null ? i : (i - 1 + images.length) % images.length)),
    [images.length],
  );

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
      id="adhibash"
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
        style={{ width: "min(900px, 110vw)", aspectRatio: "1" }}
      >
        {[1, 0.75, 0.55, 0.38].map((scale, i) => (
          <span
            key={i}
            className="absolute inset-0 rounded-full"
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

      {/* Dot grid — very faint */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.028] mix-blend-screen"
        style={{
          backgroundImage:
            "radial-gradient(circle at 1px 1px, color-mix(in oklab, var(--color-gold) 100%, transparent) 1px, transparent 0)",
          backgroundSize: "36px 36px",
        }}
      />

      <div className="relative mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-10">

        {/* ── HEADER — centred ─────────────────────────────────────────────── */}
        <div
          ref={headingRef}
          className="mb-16 sm:mb-20 lg:mb-28 flex flex-col items-center text-center gap-6 sm:gap-7"
        >

          {/* Top lozenge rule */}
          <LozengeDivider className="adh-top-rule max-w-2xl" />

          {/* Eyebrow */}
          <p
            className="adh-eyebrow tracking-[0.42em] uppercase text-[10px] sm:text-xs mt-2"
            style={{ color: "color-mix(in oklab, var(--color-gold) 72%, transparent)" }}
          >
            {eyebrow}
          </p>

          {/* Main title */}
          <h2
            className="adh-title font-display leading-[0.95]"
            style={{
              fontSize: "clamp(3.8rem, 11vw, 9.5rem)",
              fontWeight: 300,
              letterSpacing: "-0.015em",
              color: "var(--color-foreground)",
            }}
          >
            {title}
          </h2>

          {/* Subtitle */}
          <p
            className="adh-subtitle font-display italic"
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

          {/* Bottom lozenge rule */}
          <LozengeDivider className="adh-bot-rule max-w-xs opacity-60 mt-1" />

          {/* Description */}
          <p
            className="adh-desc text-sm sm:text-base leading-relaxed"
            style={{
              color: "color-mix(in oklab, var(--color-foreground) 42%, transparent)",
              maxWidth: "52ch",
            }}
          >
            {description}
          </p>

          {/* Meta row */}
          <div className="adh-meta flex items-center justify-center gap-4 flex-wrap">
            {date && (
              <span
                className="tracking-[0.32em] text-[10px] sm:text-xs uppercase"
                style={{ color: "color-mix(in oklab, var(--color-gold) 62%, transparent)" }}
              >
                {date}
              </span>
            )}
            {date && location && (
              <span
                aria-hidden
                style={{ color: "color-mix(in oklab, var(--color-gold) 28%, transparent)" }}
              >
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
              <span
                aria-hidden
                style={{ color: "color-mix(in oklab, var(--color-gold) 28%, transparent)" }}
              >
                ·
              </span>
            )}
            <span
              className="tracking-[0.32em] text-[10px] sm:text-xs uppercase"
              style={{ color: "color-mix(in oklab, var(--color-foreground) 28%, transparent)" }}
            >
              {String(images.length).padStart(2, "0")} frames
            </span>
          </div>
        </div>

        {/* ── MASONRY GRID ──────────────────────────────────────────────────── */}
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

        {/* Preload all images */}
        <div aria-hidden className="sr-only absolute w-0 h-0 overflow-hidden">
          {images.map((img, i) => (
            <img key={i} src={img.src} alt="" />
          ))}
        </div>

        {/* Bottom rule */}
        <LozengeDivider className="mt-16 sm:mt-20 lg:mt-28 opacity-35" />
      </div>

      {/* ── LIGHTBOX ────────────────────────────────────────────────────────── */}
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
            {/* Close */}
            <button
              onClick={(e) => { e.stopPropagation(); close(); }}
              className="absolute top-5 right-5 z-10 p-2 text-foreground/45 transition-colors hover:text-foreground"
              aria-label="Close"
            >
              <X size={20} />
            </button>

            {/* Counter */}
            <div
              className="absolute top-6 left-1/2 -translate-x-1/2 tracking-[0.35em] text-xs uppercase select-none"
              style={{ color: "color-mix(in oklab, var(--color-foreground) 38%, transparent)" }}
            >
              {String(activeIndex + 1).padStart(2, "0")}
              <span
                className="mx-2"
                style={{ color: "color-mix(in oklab, var(--color-foreground) 16%, transparent)" }}
              >
                /
              </span>
              {String(images.length).padStart(2, "0")}
            </div>

            {/* Prev */}
            <button
              onClick={(e) => { e.stopPropagation(); prev(); }}
              className="absolute left-3 sm:left-6 z-10 p-3 text-foreground/38 transition-colors hover:text-foreground"
              aria-label="Previous"
            >
              <ChevronLeft size={26} />
            </button>

            {/* Image + caption */}
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
                  animate={{ opacity: 1, scale: 1,    y: 0 }}
                  exit={{    opacity: 0, scale: 0.97, y: -10 }}
                  transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                  className="max-h-[74vh] max-w-full object-contain"
                  style={{
                    boxShadow: "0 40px 100px -20px rgba(0,0,0,0.65)",
                  }}
                  draggable={false}
                />
              </AnimatePresence>

              {/* Caption */}
              <AnimatePresence mode="wait">
                <motion.p
                  key={images[activeIndex].alt}
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{    opacity: 0, y: -5 }}
                  transition={{ duration: 0.35, delay: 0.1 }}
                  className="italic text-xs sm:text-sm text-center"
                  style={{ color: "color-mix(in oklab, var(--color-foreground) 36%, transparent)" }}
                >
                  {images[activeIndex].alt}
                </motion.p>
              </AnimatePresence>
            </div>

            {/* Next */}
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
  image:    AdhibashImage;
  index:    number;
  isLast?:  boolean;
  onClick:  () => void;
}

function Tile({ image, index, isLast = false, onClick }: TileProps) {
  const isLastCls = isLast ? " flex-1 flex flex-col" : "";
  const imgCls    = isLast
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
      {/* Photo */}
      <img
        src={image.src}
        alt={image.alt}
        loading="lazy"
        decoding="async"
        className={imgCls}
      />

      {/* Inner glow on hover */}
      <div
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-700 group-hover:opacity-100"
        style={{
          boxShadow:
            "inset 0 0 55px color-mix(in oklab, var(--color-gold) 25%, transparent)",
        }}
      />

      {/* Caption slide-up */}
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