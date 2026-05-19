import { useEffect, useRef, useState, useCallback } from "react";
import { AnimatePresence, motion } from "framer-motion";
import gsap from "gsap";
import { ChevronLeft, ChevronRight, X } from "lucide-react";

const img1  = "/images/baby/img1.jpg";
const img2  = "/images/baby/img2.jpg";
const img3  = "/images/baby/img3.jpg";
const img4  = "/images/baby/img4.jpg";
const img5  = "/images/baby/img5.jpg";
const img6  = "/images/baby/img6.jpg";
const img7  = "/images/baby/img7.jpg";
const img8  = "/images/baby/img8.jpg";
const img9  = "/images/baby/img9.jpg";
const img10 = "/images/baby/img10.jpg";
const img11 = "/images/baby/img11.jpg";
const img12 = "/images/baby/img12.jpg";
const img13 = "/images/baby/img13.jpg";
const img14 = "/images/baby/img14.jpg";
const img15 = "/images/baby/img15.jpg";
const img16 = "/images/baby/img16.jpg";
const img17 = "/images/baby/img17.jpg";
const img18 = "/images/baby/img18.jpg";
const img19 = "/images/baby/img19.jpg";
const img20 = "/images/baby/img20.jpg";
const img21 = "/images/baby/img21.jpg";
const img22 = "/images/baby/img22.jpg";
const img23 = "/images/baby/img23.jpg";
const img24 = "/images/baby/img24.jpg";
const img25 = "/images/baby/img25.jpg";
const img26 = "/images/baby/img26.jpg";
const img27 = "/images/baby/img27.jpg";
const img28 = "/images/baby/img28.jpg";
const img29 = "/images/baby/img29.jpg";
const img30 = "/images/baby/img30.jpg";

export interface BabyImage {
  src: string;
  alt: string;
}

const defaultImages: BabyImage[] = [
  { src: img1,  alt: "Ten fingers, ten toes" },
  { src: img2,  alt: "The first breath of morning" },
  { src: img3,  alt: "Held against a heartbeat" },
  { src: img4,  alt: "Wrapped in soft white cotton" },
  { src: img5,  alt: "Eyes still learning the light" },
  { src: img6,  alt: "Tiny fist, enormous love" },
  { src: img7,  alt: "Father's hands, the whole world" },
  { src: img8,  alt: "Mother's face — complete" },
  { src: img9,  alt: "Asleep on a familiar chest" },
  { src: img10, alt: "The first smile that wasn't wind" },
  { src: img11, alt: "Grandparents' eyes brimming over" },
  { src: img12, alt: "Nestled in the crook of an arm" },
  { src: img13, alt: "Flowers bigger than the baby" },
  { src: img14, alt: "Barefoot on a soft blanket" },
  { src: img15, alt: "The house full and quiet at once" },
  { src: img16, alt: "Petals scattered around the bassinet" },
  { src: img17, alt: "An afternoon nap, uninterrupted" },
  { src: img18, alt: "A yawn that filled the whole room" },
  { src: img19, alt: "Fingers wrapped around one finger" },
  { src: img20, alt: "Sunlight on a small cheek" },
  { src: img21, alt: "The naming ceremony begins" },
  { src: img22, alt: "Sacred water on the forehead" },
  { src: img23, alt: "Elders whispering a blessing" },
  { src: img24, alt: "The family gathered close" },
  { src: img25, alt: "A new name spoken for the first time" },
  { src: img26, alt: "Marigolds and the softest light" },
  { src: img27, alt: "Carried gently through the doorway" },
  { src: img28, alt: "Cousins peering over the cradle" },
  { src: img29, alt: "The day slowed down for this" },
  { src: img30, alt: "And then there were three" },
];

interface BabyProps {
  images?:      BabyImage[];
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
        className="flex-1 h-px max-w-30 sm:max-w-45"
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
        className="flex-1 h-px max-w-30 sm:max-w-45"
        style={{
          background:
            "linear-gradient(to left, transparent, color-mix(in oklab, var(--color-gold) 50%, transparent))",
        }}
      />
    </div>
  );
}

// ── Main component ────────────────────────────────────────────────────────────
export default function Baby({
  images      = defaultImages,
  eyebrow     = "Baby Shoot",
  title       = "Little One",
  subtitle    = "The smallest hands held the biggest hearts.",
  description = "Every yawn, every blink, every quiet moment — framed before they grow too fast to catch.",
  date        = "",
  location    = "",
}: BabyProps) {
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
      tl.from(".by-top-rule", { scaleX: 0,  duration: 1.6, transformOrigin: "center" }, 0)
        .from(".by-eyebrow",  { opacity: 0, y: -10, duration: 1 }, 0.15)
        .from(".by-title",    { opacity: 0, y: 28,  duration: 1.4 }, 0.28)
        .from(".by-subtitle", { opacity: 0, y: 14,  duration: 1.1 }, 0.5)
        .from(".by-bot-rule", { scaleX: 0,  duration: 1.4, transformOrigin: "center" }, 0.55)
        .from(".by-desc",     { opacity: 0, y: 10,  duration: 1 }, 0.7)
        .from(".by-meta",     { opacity: 0,          duration: 0.9 }, 0.85);
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
      id="baby"
      className="relative w-full overflow-hidden bg-background py-24 sm:py-32 lg:py-40"
    >
      {/* ── Backgrounds ──────────────────────────────────────────────────── */}

      {/* Wide centred glow */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-160"
        style={{
          background:
            "radial-gradient(ellipse 80% 65% at 50% -5%, color-mix(in oklab, var(--color-gold) 15%, transparent), transparent 60%)",
        }}
      />

      {/* Faint concentric rings — centred, purely decorative */}
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
              top: "50%", left: "50%",
              width: "100%", height: "100%",
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

      <div className="relative mx-auto max-w-400 px-4 sm:px-6 lg:px-10">

        {/* ── HEADER — centred ─────────────────────────────────────────────── */}
        <div
          ref={headingRef}
          className="mb-16 sm:mb-20 lg:mb-28 flex flex-col items-center text-center gap-6 sm:gap-7"
        >
          {/* Top lozenge rule */}
          <LozengeDivider className="by-top-rule max-w-2xl" />

          {/* Eyebrow */}
          <p
            className="by-eyebrow tracking-[0.42em] uppercase text-[10px] sm:text-xs mt-2"
            style={{ color: "color-mix(in oklab, var(--color-gold) 72%, transparent)" }}
          >
            {eyebrow}
          </p>

          {/* Main title */}
          <h2
            className="by-title font-display leading-[0.95]"
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
            className="by-subtitle font-display italic"
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
          <LozengeDivider className="by-bot-rule max-w-xs opacity-60 mt-1" />

          {/* Description */}
          <p
            className="by-desc text-sm sm:text-base leading-relaxed"
            style={{
              color: "color-mix(in oklab, var(--color-foreground) 42%, transparent)",
              maxWidth: "52ch",
            }}
          >
            {description}
          </p>

          {/* Meta row */}
          <div className="by-meta flex items-center justify-center gap-4 flex-wrap">
            {date && (
              <span
                className="tracking-[0.32em] text-[10px] sm:text-xs uppercase"
                style={{ color: "color-mix(in oklab, var(--color-gold) 62%, transparent)" }}
              >
                {date}
              </span>
            )}
            {date && location && (
              <span aria-hidden style={{ color: "color-mix(in oklab, var(--color-gold) 28%, transparent)" }}>·</span>
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
              <span aria-hidden style={{ color: "color-mix(in oklab, var(--color-gold) 28%, transparent)" }}>·</span>
            )}
            <span
              className="tracking-[0.32em] text-[10px] sm:text-xs uppercase"
              style={{ color: "color-mix(in oklab, var(--color-foreground) 28%, transparent)" }}
            >
              {String(images.length).padStart(2, "0")} frames
            </span>
          </div>
        </div>

        {/* ── MASONRY GRID ─────────────────────────────────────────────────── */}
        <div
          className="grid items-stretch gap-0.75"
          style={{ gridTemplateColumns: `repeat(${colCount}, minmax(0, 1fr))` }}
        >
          {columns.map((colIndices, ci) => (
            <div key={ci} className="flex h-full flex-col gap-0.75">
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

        {/* Bottom lozenge rule */}
        <LozengeDivider className="mt-16 sm:mt-20 lg:mt-28 opacity-35" />
      </div>

      {/* ── LIGHTBOX ─────────────────────────────────────────────────────────── */}
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
                  style={{ boxShadow: "0 40px 100px -20px rgba(0,0,0,0.65)" }}
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
  image:   BabyImage;
  index:   number;
  isLast?: boolean;
  onClick: () => void;
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
      transition={{ duration: 0.95, ease: [0.22, 1, 0.36, 1], delay: (index % 4) * 0.06 }}
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
        style={{ boxShadow: "inset 0 0 55px color-mix(in oklab, var(--color-gold) 25%, transparent)" }}
      />

      {/* Caption slide-up */}
      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 translate-y-full transition-transform duration-480 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:translate-y-0"
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