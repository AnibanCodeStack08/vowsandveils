import React, {
  lazy,
  Suspense,
  useEffect,
  useRef,
  useState,
  useCallback,
  memo,
} from "react";
import { ArrowUpRight, Plus, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";

// ---- Lazy GSAP (avoids blocking first paint) ----
let gsapLoaded = false;
const loadGsap = async () => {
  if (gsapLoaded) return;
  const [{ default: gsap }, { ScrollTrigger }] = await Promise.all([
    import("gsap"),
    import("gsap/ScrollTrigger"),
  ]);
  gsap.registerPlugin(ScrollTrigger);
  gsapLoaded = true;
  return { gsap, ScrollTrigger };
};

const SectionHeading = lazy(() => import("../pages/sectionheading"));

// -------------------- Assets --------------------
const g3 = "/images/prewedding/img1.jpeg";
const g4 = "/images/adhibash/img6.jpeg";
const g5 = "/images/engagement/img3.jpeg";
const g6 = "/images/wedding/img44.jpg";
const haldi1 = "/images/haldi/img14.jpeg";
const baby = "/images/baby/cover.jpg";

// -------------------- Types & Data --------------------
type Category = {
  name: string;
  tagline: string;
  description: string;
  image: string;
  to: string;
};

const CATEGORIES: Category[] = [
  {
    name: "Haldi",
    tagline: "Yellow hands · warm hearts",
    description:
      "Petals, laughter and golden palms — the morning a wedding really begins.",
    image: haldi1,
    to: "/haldi-gallery",
  },
  {
    name: "Wedding",
    tagline: "Vows · veils · forever",
    description:
      "The seven steps, the stolen glance, the quiet weight of a promise made aloud.",
    image: g6,
    to: "/wedding-gallery",
  },
  {
    name: "Pre Wedding",
    tagline: "Soft light · first promises",
    description:
      "Quiet adventures and unhurried light — love before the world is watching.",
    image: g3,
    to: "/pre-wedding-gallery",
  },
  {
    name: "Adhibash",
    tagline: "Conch shells · sacred thresholds",
    description:
      "Rituals whispered before the vows — the eve a family opens its arms.",
    image: g4,
    to: "/adhibash-gallery",
  },
  {
    name: "Engagement",
    tagline: "Henna · songs · sisterhood",
    description:
      "Inked promises drying slow — a courtyard full of women, music and mischief.",
    image: g5,
    to: "/engagement-gallery",
  },
  {
    name: "Baby Shoot",
    tagline: "Tiny hands · tender hours",
    description:
      "First yawns, first fingers — a chapter that begins where the last one ended.",
    image: baby,
    to: "/baby-shoot-gallery",
  },
];

const pad = (n: number) => String(n + 1).padStart(2, "0");

// =========================================================================
// Lazy image with IntersectionObserver
// =========================================================================
const LazyImage = memo(
  ({
    src,
    alt,
    eager,
    className,
    style,
  }: {
    src: string;
    alt: string;
    eager?: boolean;
    className?: string;
    style?: React.CSSProperties;
  }) => {
    const imgRef = useRef<HTMLImageElement>(null);
    const [loaded, setLoaded] = useState(eager ?? false);

    useEffect(() => {
      if (eager) return;
      const el = imgRef.current;
      if (!el) return;
      const obs = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            el.src = src;
            obs.disconnect();
          }
        },
        { rootMargin: "200px" }
      );
      obs.observe(el);
      return () => obs.disconnect();
    }, [src, eager]);

    return (
      <img
        ref={imgRef}
        src={eager ? src : undefined}
        data-src={eager ? undefined : src}
        alt={alt}
        loading={eager ? "eager" : "lazy"}
        decoding="async"
        onLoad={() => setLoaded(true)}
        className={className}
        style={{
          ...style,
          opacity: loaded ? 1 : 0,
          transition: "opacity 0.5s ease",
        }}
      />
    );
  }
);

// =========================================================================
// Mobile Accordion
// FIX 1: Toggle close — clicking open header sets index to -1
// FIX 2: Full expanded area is a clickable navigate zone
// =========================================================================
const MobileAccordion: React.FC<{
  index: number;
  setIndex: (i: number) => void;
}> = ({ index, setIndex }) => {
  const navigate = useNavigate();

  return (
    <div className="md:hidden mt-6 flex flex-col gap-2">
      {CATEGORIES.map((c, i) => {
        const isActive = i === index;

        return (
          <div
            key={c.name}
            className="relative rounded-sm ring-1 ring-accent/20 bg-card overflow-hidden"
          >
            {/* ---- Header — always visible, toggles open/close ---- */}
            <button
              onClick={() => setIndex(isActive ? -1 : i)}  // ← FIX: toggle close
              aria-expanded={isActive}
              aria-label={isActive ? `Close ${c.name}` : `Open ${c.name}`}
              className="relative w-full flex items-center justify-between px-4 py-3 z-10"
            >
              {/* Accent left rule */}
              <span
                className={`absolute left-0 top-0 bottom-0 w-0.5 transition-colors duration-400 ${
                  isActive ? "bg-accent" : "bg-accent/25"
                }`}
              />

              <div className="flex items-center gap-3">
                <span className="hairline text-accent tabular-nums text-[10px] tracking-widest">
                  {pad(i)}
                </span>
                <span
                  className={`font-display text-lg transition-colors duration-300 ${
                    isActive ? "text-foreground" : "text-foreground/60"
                  }`}
                >
                  {c.name}
                </span>
              </div>

              {/* FIX: show X when open, Plus when closed */}
              <motion.span
                animate={{ rotate: isActive ? 0 : 0 }}
                className="text-accent flex-shrink-0"
              >
                {isActive ? <X size={16} /> : <Plus size={16} />}
              </motion.span>
            </button>

            {/* ---- Expandable body — clicking anywhere navigates ---- */}
            <AnimatePresence initial={false}>
              {isActive && (
                <motion.div
                  key="content"
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                  style={{ overflow: "hidden" }}
                >
                  {/*
                    FIX 3: entire expanded card is one big click zone that navigates.
                    Use a <div role="button"> wrapping everything so the tap target
                    is the full card body, not just a small CTA link.
                  */}
                  <div
                    role="button"
                    tabIndex={0}
                    aria-label={`Go to ${c.name} gallery`}
                    onClick={() => navigate(c.to)}
                    onKeyDown={(e) => e.key === "Enter" && navigate(c.to)}
                    className="cursor-pointer select-none"
                  >
                    {/* Image */}
                    <div
                      className="relative w-full"
                      style={{ height: "min(56vw, 320px)" }}
                    >
                      <LazyImage
                        src={c.image}
                        alt={c.name}
                        eager={i === 0}
                        className="absolute inset-0 h-full w-full object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/30 to-transparent" />

                      {/* Floating navigate hint top-right */}
                      <div className="absolute top-3 right-3 flex items-center gap-1.5 bg-background/60 backdrop-blur-sm rounded-full px-3 py-1.5">
                        <span className="hairline text-foreground/80 text-[10px] tracking-widest uppercase">
                          View gallery
                        </span>
                        <ArrowUpRight size={12} className="text-accent" />
                      </div>
                    </div>

                    {/* Text */}
                    <motion.div
                      initial={{ y: 12, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ duration: 0.4, delay: 0.15 }}
                      className="px-4 pb-5 pt-3"
                    >
                      <span className="hairline text-accent text-[10px] tracking-[0.18em] uppercase block mb-1">
                        Vol {pad(i)} · {c.tagline}
                      </span>

                      <motion.div
                        initial={{ scaleX: 0 }}
                        animate={{ scaleX: 1 }}
                        transition={{
                          duration: 0.5,
                          delay: 0.25,
                          ease: [0.16, 1, 0.3, 1],
                        }}
                        style={{ transformOrigin: "left center" }}
                        className="h-px w-12 bg-accent my-2.5"
                      />

                      <p className="text-foreground/75 text-sm leading-relaxed mb-4">
                        {c.description}
                      </p>

                      <div className="inline-flex items-center gap-2.5 text-foreground">
                        <span className="hairline text-xs tracking-widest uppercase">
                          Open volume
                        </span>
                        <span className="h-px w-8 bg-foreground/40" />
                        <ArrowUpRight size={14} className="text-accent" />
                      </div>
                    </motion.div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}

      {/* Dot counter */}
      <div className="flex items-center justify-between mt-2 px-1">
        <div className="flex items-center gap-2">
          {CATEGORIES.map((_, i) => (
            <button
              key={i}
              onClick={() => setIndex(index === i ? -1 : i)}
              aria-label={`Go to ${CATEGORIES[i].name}`}
              className="flex items-center justify-center"
            >
              <motion.span
                animate={{
                  width: i === index ? 20 : 5,
                  backgroundColor:
                    i === index
                      ? "var(--color-accent, #c9a96e)"
                      : "rgba(255,255,255,0.25)",
                }}
                transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                className="block h-0.5 rounded-full"
                style={{ display: "block" }}
              />
            </button>
          ))}
        </div>

        <AnimatePresence mode="wait">
          <motion.span
            key={index}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.3 }}
            className="hairline text-foreground/50 text-[10px] tabular-nums tracking-widest"
          >
            {index >= 0 ? `${pad(index)} / ${pad(CATEGORIES.length - 1)}` : "—"}
          </motion.span>
        </AnimatePresence>
      </div>
    </div>
  );
};

// =========================================================================
// Desktop SpineCard
// FIX: Hover — removed React.memo entirely so index prop always reflects
//      the latest state. The GSAP flex animation is driven by a useEffect
//      in the parent that runs synchronously whenever index changes.
//      CSS-only hover overlay handled inline so it never fights GSAP.
// =========================================================================
const SpineCard: React.FC<{
  c: Category;
  i: number;
  index: number;
  spineRef: (el: HTMLButtonElement | null) => void;
  onMouseEnter: () => void;
  onFocus: () => void;
  onClick: () => void;
}> = ({ c, i, index, spineRef, onMouseEnter, onFocus, onClick }) => {
  const isActive = i === index;

  return (
    <button
      ref={spineRef}
      role="tab"
      aria-selected={isActive}
      aria-label={`Open ${c.name} gallery`}
      onMouseEnter={onMouseEnter}
      onFocus={onFocus}
      onClick={onClick}
      className="group relative overflow-hidden rounded-sm ring-1 ring-accent/25 bg-card text-left flex-1 min-h-0 cursor-pointer"
      style={{ flexBasis: 0 }}
    >
      {/* Background image */}
      <LazyImage
        src={c.image}
        alt=""
        eager={i === 0}
        className={`absolute inset-0 h-full w-full object-cover transition-all duration-700 ease-out ${
          isActive
            ? "opacity-100 scale-100 grayscale-0"
            : "opacity-35 scale-105 grayscale"
        }`}
        // FIX: Remove Tailwind group-hover from className so it doesn't
        // conflict. Handle hover via the CSS class below instead.
      />

      {/*
        FIX desktop hover: separate overlay div handles the hover brightness
        lift independently of isActive state — group-hover always fires
        because this div is inside the button which IS the group root.
      */}
      {!isActive && (
        <div className="absolute inset-0 transition-all duration-500 ease-out opacity-100 group-hover:opacity-0 bg-background/65" />
      )}

      {/* Active gradient scrim */}
      {isActive && (
        <div className="absolute inset-0 bg-gradient-to-t from-background/85 via-background/20 to-transparent" />
      )}

      {/* Left edge gold rule */}
      <div
        aria-hidden
        className={`absolute left-0 top-0 bottom-0 w-px transition-colors duration-500 ${
          isActive ? "bg-accent" : "bg-accent/40 group-hover:bg-accent"
        }`}
      />

      {/* Inactive spine label */}
      <div
        className={`absolute inset-0 flex flex-col items-center justify-between py-6 transition-opacity duration-300 pointer-events-none ${
          isActive ? "opacity-0" : "opacity-100 delay-200"
        }`}
      >
        <span className="hairline text-accent tabular-nums">{pad(i)}</span>
        <span
          className="font-display text-foreground/85 text-2xl md:text-3xl whitespace-nowrap group-hover:text-foreground transition-colors duration-300"
          style={{ writingMode: "vertical-rl", transform: "rotate(180deg)" }}
        >
          {c.name}
        </span>
        <Plus
          size={16}
          className="text-accent transition-transform duration-500 group-hover:rotate-90"
        />
      </div>

      {/* Active panel content */}
      <AnimatePresence>
        {isActive && (
          <motion.div
            key={`active-${i}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4, delay: 0.3 }}
            className="absolute inset-0 z-10 flex flex-col justify-end p-6 md:p-10"
          >
            <motion.span
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 0.12, x: 0 }}
              transition={{ duration: 0.9, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
              className="pointer-events-none absolute top-4 right-6 md:top-8 md:right-10 font-display text-foreground text-[8rem] md:text-[14rem] leading-none tracking-tighter select-none"
            >
              {pad(i)}
            </motion.span>

            <div className="relative max-w-xl">
              <motion.span
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.42 }}
                className="hairline text-accent block"
              >
                Volume {pad(i)} · {c.tagline}
              </motion.span>

              <motion.h3
                initial={{ opacity: 0, y: 26 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.65, delay: 0.48, ease: [0.22, 1, 0.36, 1] }}
                className="font-display text-foreground text-5xl md:text-7xl leading-[0.95] mt-3"
              >
                {c.name}
              </motion.h3>

              <motion.div
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ duration: 0.7, delay: 0.65, ease: [0.16, 1, 0.3, 1] }}
                style={{ transformOrigin: "left center" }}
                className="h-px w-20 bg-accent my-5"
              />

              <motion.p
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.55, delay: 0.58 }}
                className="text-foreground/80 leading-relaxed text-base md:text-lg max-w-md"
              >
                {c.description}
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.55, delay: 0.68 }}
                className="group/cta mt-8 inline-flex items-center gap-3 text-foreground"
              >
                <span className="hairline">Open this volume</span>
                <span className="relative h-px w-12 bg-foreground/40 overflow-hidden">
                  <span className="absolute inset-y-0 left-0 w-full bg-accent origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-500 ease-out" />
                </span>
                <ArrowUpRight
                  size={18}
                  className="transition-transform duration-500 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                />
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </button>
  );
};

// =========================================================================
// Main Section
// =========================================================================
const Section: React.FC = () => {
  // -1 = nothing open on mobile; desktop always has an active index
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const navigate = useNavigate();

  const sectionRef = useRef<HTMLDivElement>(null);
  const shelfRef = useRef<HTMLDivElement>(null);
  const spineRefs = useRef<Array<HTMLButtonElement | null>>([]);

  // Lazy-load GSAP scroll animations
  useEffect(() => {
    let ctx: any;
    loadGsap().then((mods) => {
      if (!mods) return;
      const { gsap } = mods;
      ctx = gsap.context(() => {
        gsap.from(shelfRef.current, {
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 75%",
            toggleActions: "play none none none",
          },
          y: 60,
          opacity: 0,
          duration: 1,
          ease: "expo.out",
        });
        gsap.from(spineRefs.current.filter(Boolean), {
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 75%",
            toggleActions: "play none none none",
          },
          y: 80,
          opacity: 0,
          stagger: 0.08,
          duration: 0.9,
          ease: "expo.out",
          delay: 0.15,
        });
      }, sectionRef);
    });
    return () => ctx?.revert();
  }, []);

  // GSAP flex-grow animation — runs every time index changes
  useEffect(() => {
    loadGsap().then((mods) => {
      if (!mods) return;
      const { gsap } = mods;
      spineRefs.current.forEach((el, i) => {
        if (!el) return;
        gsap.to(el, {
          flexGrow: i === index ? 7 : 1,
          duration: 0.85,
          ease: "expo.out",
        });
      });
    });
  }, [index]);

  // Auto-advance (desktop only, paused on hover)
  useEffect(() => {
    if (paused) return;
    const id = window.setInterval(
      () => setIndex((i) => (i + 1) % CATEGORIES.length),
      5200
    );
    return () => window.clearInterval(id);
  }, [paused]);

  // Keyboard nav
  const go = useCallback(
    (dir: 1 | -1) =>
      setIndex((i) => (i + dir + CATEGORIES.length) % CATEGORIES.length),
    []
  );
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight" || e.key === "ArrowDown") go(1);
      if (e.key === "ArrowLeft" || e.key === "ArrowUp") go(-1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [go]);

  return (
    <section
      id="work"
      ref={sectionRef}
      className="relative bg-background py-16 md:py-32 px-4 md:px-10 overflow-hidden"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <Suspense fallback={<div className="h-24" />}>
        <SectionHeading
          eyebrow="Selected Works"
          title="Moments, kept in light"
          subtitle="Six chapters from every story — slide one open."
        />
      </Suspense>

      {/* Shelf meta bar */}
      <div className="mx-auto max-w-7xl mt-10 md:mt-12 flex items-center justify-between border-t border-accent/30 pt-4">
        <span className="hairline text-accent text-[10px] md:text-xs tracking-widest">
          The Shelf · 06 Volumes
        </span>
        <span className="hairline text-foreground/50 tabular-nums text-[10px] md:text-xs">
          Now reading — {index >= 0 ? pad(index) : "—"} / {pad(CATEGORIES.length - 1)}
        </span>
      </div>

      {/* MOBILE */}
      <MobileAccordion index={index} setIndex={setIndex} />

      {/* DESKTOP */}
      <div
        ref={shelfRef}
        className="mx-auto max-w-7xl mt-6 hidden md:flex flex-row gap-1.5"
        style={{ height: "min(78vh, 680px)" }}
        role="tablist"
        aria-label="Photo chapter shelf"
      >
        {CATEGORIES.map((c, i) => (
          <SpineCard
            key={c.name}
            c={c}
            i={i}
            index={index}
            spineRef={(el) => { spineRefs.current[i] = el; }}
            onMouseEnter={() => setIndex(i)}
            onFocus={() => setIndex(i)}
            onClick={() => navigate(c.to)}
          />
        ))}
      </div>

      {/* Footer scrub */}
      <div className="mx-auto max-w-7xl mt-6 md:mt-8 flex items-center gap-4 md:gap-6">
        <button
          onClick={() => go(-1)}
          aria-label="Previous volume"
          className="hairline text-foreground/70 hover:text-accent transition-colors text-xs md:text-sm shrink-0"
        >
          ← Prev
        </button>

        <div className="flex-1 relative h-px bg-accent/20">
          <motion.div
            className="absolute inset-y-0 left-0 bg-accent"
            animate={{ width: `${((index + 1) / CATEGORIES.length) * 100}%` }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          />
          <div className="absolute inset-0 flex justify-between">
            {CATEGORIES.map((c, i) => (
              <button
                key={c.name}
                onClick={() => setIndex(i)}
                aria-label={`Go to ${c.name}`}
                className="relative -mt-2 h-5 w-5 flex items-center justify-center"
              >
                <span
                  className={`block w-px transition-all duration-500 ${
                    i <= index ? "bg-accent h-3" : "bg-foreground/30 h-2"
                  }`}
                />
              </button>
            ))}
          </div>
        </div>

        <button
          onClick={() => go(1)}
          aria-label="Next volume"
          className="hairline text-foreground/70 hover:text-accent transition-colors text-xs md:text-sm shrink-0"
        >
          Next →
        </button>
      </div>
    </section>
  );
};

export default Section;