import { useEffect, useRef, useState, useCallback } from "react";
import { AnimatePresence, motion } from "framer-motion";
import gsap from "gsap";
import { ChevronLeft, ChevronRight, X } from "lucide-react";

const img1  = "images/wedding/img1.jpg";
const img2  = "images/wedding/img2.jpg";
const img3  = "images/wedding/img3.jpg";
const img4  = "images/wedding/img4.jpg";
const img5  = "images/wedding/img5.jpg";
const img6  = "images/wedding/img6.jpg";
const img7  = "images/wedding/img7.jpg";
const img8  = "images/wedding/img8.jpg";
const img9  = "images/wedding/img9.jpg";
const img10 = "images/wedding/img10.jpg";
const img11 = "images/wedding/img11.jpg";
const img12 = "images/wedding/img12.jpg";
const img13 = "images/wedding/img13.jpg";
const img14 = "images/wedding/img14.jpg";
const img15 = "images/wedding/img15.jpg";
const img16 = "images/wedding/img16.jpg";
const img17 = "images/wedding/img17.jpg";
const img18 = "images/wedding/img18.jpg";
const img19 = "images/wedding/img19.jpg";
const img20 = "images/wedding/img20.jpg";
const img21 = "images/wedding/img21.jpg";
const img22 = "images/wedding/img22.jpg";
const img23 = "images/wedding/img23.jpg";
const img24 = "images/wedding/img24.jpg";
const img25 = "images/wedding/img25.jpg";
const img26 = "images/wedding/img26.jpg";
const img27 = "images/wedding/img27.jpg";
const img28 = "images/wedding/img28.jpg";
const img29 = "images/wedding/img29.jpg";
const img30 = "images/wedding/img30.jpg";
const img31 = "images/wedding/img31.jpg";
const img32 = "images/wedding/img32.jpg";
const img33 = "images/wedding/img33.jpg";
const img34 = "images/wedding/img34.jpg";
const img35 = "images/wedding/img35.jpg";
const img36 = "images/wedding/img36.jpg";
const img37 = "images/wedding/img37.jpg";
const img38 = "images/wedding/img38.jpg";
const img39 = "images/wedding/img39.jpg";
const img40 = "images/wedding/img40.jpg";
const img41 = "images/wedding/img41.jpg";
const img42 = "images/wedding/img42.jpg";
const img43 = "images/wedding/img43.jpg";
const img44 = "images/wedding/img44.jpg";
const img45 = "images/wedding/img45.jpg";

export interface WeddingImage {
  src: string;
  alt: string;
}

const defaultImages: WeddingImage[] = [
  { src: img1,  alt: "The procession begins" },
  { src: img2,  alt: "She walked toward the mandap" },
  { src: img3,  alt: "Fire in the sacred pit" },
  { src: img4,  alt: "Hands joined over the flame" },
  { src: img5,  alt: "A glance that held everything" },
  { src: img6,  alt: "Red on her forehead" },
  { src: img7,  alt: "Seven steps around the fire" },
  { src: img8,  alt: "The groom's eyes, steady" },
  { src: img9,  alt: "Marigolds strung at the arch" },
  { src: img10, alt: "Priests chanting at dawn" },
  { src: img11, alt: "The conch shell sounded" },
  { src: img12, alt: "Elders placing their hands" },
  { src: img13, alt: "A canopy of jasmine" },
  { src: img14, alt: "Her dupatta in the wind" },
  { src: img15, alt: "Tears on her mother's cheek" },
  { src: img16, alt: "The knot was tied" },
  { src: img17, alt: "She leaned close and said her name" },
  { src: img18, alt: "Smoke and incense in the air" },
  { src: img19, alt: "Children scattering petals" },
  { src: img20, alt: "Two families becoming one" },
  { src: img21, alt: "The vermilion moment" },
  { src: img22, alt: "Laughter between the rituals" },
  { src: img23, alt: "The ring, and the silence after" },
  { src: img24, alt: "Her hands adorned in henna" },
  { src: img25, alt: "Soft light through the drapes" },
  { src: img26, alt: "The first glance across the mandap" },
  { src: img27, alt: "The brass lamp lit all night" },
  { src: img28, alt: "Flower boats on the water" },
  { src: img29, alt: "The couple beneath the stars" },
  { src: img30, alt: "Her sari, the colour of fire" },
  { src: img31, alt: "His sherwani, cream and gold" },
  { src: img32, alt: "The blessing of the elders" },
  { src: img33, alt: "Music in the courtyard" },
  { src: img34, alt: "A stolen quiet moment" },
  { src: img35, alt: "Guests in a sea of colour" },
  { src: img36, alt: "The feast laid on banana leaves" },
  { src: img37, alt: "She looked back once" },
  { src: img38, alt: "Evening fell on the mandap" },
  { src: img39, alt: "The last rites by firelight" },
  { src: img40, alt: "Walking away, hand in hand" },
  { src: img41, alt: "Petals from the upper balcony" },
  { src: img42, alt: "Joy beyond words" },
  { src: img43, alt: "The night sky and the vows" },
  { src: img44, alt: "Every face lit with the same light" },
  { src: img45, alt: "And then — they were married" },
];

interface WeddingProps {
  images?:      WeddingImage[];
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
export default function Wedding({
  images      = defaultImages,
  eyebrow     = "The Wedding",
  title       = "The Day",
  subtitle    = "When everything stopped, and nothing else mattered.",
  description = "Fire, flowers, and a lifetime promised — every frame from the day the vows were spoken.",
  date        = "",
  location    = "",
}: WeddingProps) {
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
      tl.from(".wd-top-rule",   { scaleX: 0,  duration: 1.6, transformOrigin: "center" }, 0)
        .from(".wd-eyebrow",    { opacity: 0, y: -10, duration: 1 }, 0.15)
        .from(".wd-title",      { opacity: 0, y: 28,  duration: 1.4 }, 0.28)
        .from(".wd-subtitle",   { opacity: 0, y: 14,  duration: 1.1 }, 0.5)
        .from(".wd-bot-rule",   { scaleX: 0,  duration: 1.4, transformOrigin: "center" }, 0.55)
        .from(".wd-desc",       { opacity: 0, y: 10,  duration: 1 }, 0.7)
        .from(".wd-meta",       { opacity: 0,          duration: 0.9 }, 0.85);
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
      id="wedding"
      className="relative w-full overflow-hidden bg-background py-24 sm:py-32 lg:py-40"
    >
      {/* ── Backgrounds ──────────────────────────────────────────────────── */}

      {/* Wide centred glow — softly symmetrical for the centred layout */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-160"
        style={{
          background:
            "radial-gradient(ellipse 80% 65% at 50% -5%, color-mix(in oklab, var(--color-gold) 15%, transparent), transparent 60%)",
        }}
      />

      {/* Faint concentric ring motif — centred, purely decorative */}
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

      <div className="relative mx-auto max-w-400 px-4 sm:px-6 lg:px-10">

        {/* ── HEADER — centred ─────────────────────────────────────────────── */}
        <div
          ref={headingRef}
          className="mb-16 sm:mb-20 lg:mb-28 flex flex-col items-center text-center gap-6 sm:gap-7"
        >

          {/* Top lozenge rule */}
          <LozengeDivider className="wd-top-rule max-w-2xl" />

          {/* Eyebrow */}
          <p
            className="wd-eyebrow tracking-[0.42em] uppercase text-[10px] sm:text-xs mt-2"
            style={{ color: "color-mix(in oklab, var(--color-gold) 72%, transparent)" }}
          >
            {eyebrow}
          </p>

          {/* Main title */}
          <h2
            className="wd-title font-display leading-[0.95]"
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
            className="wd-subtitle font-display italic"
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
          <LozengeDivider className="wd-bot-rule max-w-xs opacity-60 mt-1" />

          {/* Description */}
          <p
            className="wd-desc text-sm sm:text-base leading-relaxed"
            style={{
              color: "color-mix(in oklab, var(--color-foreground) 42%, transparent)",
              maxWidth: "52ch",
            }}
          >
            {description}
          </p>

          {/* Meta row */}
          <div className="wd-meta flex items-center justify-center gap-4 flex-wrap">
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
  image:    WeddingImage;
  index:    number;
  isLast?:  boolean;
  onClick:  () => void;
}

function Tile({ image, index, isLast = false, onClick }: TileProps) {
  // When this tile is the last in its column we make the button flex-1 so it
  // expands to consume the remaining column height, then give the img h-full
  // so it fills that space with object-cover — all four column bottoms align.
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