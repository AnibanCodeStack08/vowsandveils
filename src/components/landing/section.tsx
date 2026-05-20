import React, {
  lazy,
  Suspense,
  useEffect,
  useRef,
  useState,
  useCallback,
} from "react";
import { ArrowUpRight, Plus } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

// Create a motion-enhanced Link component for animated navigation elements
const MotionLink = motion(Link);

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
      "Rituals whispered before the vows — the eve a family opens its arms and a new story finds its first line.",
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
// Mobile card carousel — swipe-friendly horizontal snap strip
// =========================================================================
const MobileShelf: React.FC<{
  index: number;
  setIndex: (i: number) => void;
}> = ({ index, setIndex }) => {
  const trackRef = useRef<HTMLDivElement>(null);
  const startXRef = useRef(0);
  const isDraggingRef = useRef(false);

  const handlePointerDown = (e: React.PointerEvent) => {
    startXRef.current = e.clientX;
    isDraggingRef.current = true;
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    if (!isDraggingRef.current) return;
    isDraggingRef.current = false;
    const dx = e.clientX - startXRef.current;
    if (Math.abs(dx) > 40) {
      if (dx < 0) setIndex(Math.min(index + 1, CATEGORIES.length - 1));
      else setIndex(Math.max(index - 1, 0));
    }
  };

  return (
    <div className="md:hidden mt-6 select-none">
      {/* ── Card track ── */}
      <div
        ref={trackRef}
        className="relative overflow-hidden"
        onPointerDown={handlePointerDown}
        onPointerUp={handlePointerUp}
        onPointerCancel={() => {
          isDraggingRef.current = false;
        }}
        style={{ touchAction: "pan-y" }}
      >
        <motion.div
          className="flex"
          animate={{
            x: `calc(-${index * 100}% + ${index > 0 ? "0px" : "0px"})`,
          }}
          transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
          style={{ willChange: "transform" }}
        >
          {CATEGORIES.map((c, i) => {
            const isActive = i === index;
            return (
              <div
                key={c.name}
                className="relative shrink-0 w-full"
                style={{ height: "min(70vw, 420px)" }}
              >
                {/* ── Image ── */}
                <motion.img
                  src={c.image}
                  alt={c.name}
                  loading={i === 0 ? "eager" : "lazy"}
                  decoding="async"
                  className="absolute inset-0 h-full w-full object-cover"
                  animate={{
                    scale: isActive ? 1 : 1.06,
                    filter: isActive ? "grayscale(0%)" : "grayscale(40%)",
                  }}
                  transition={{ duration: 0.7, ease: "easeOut" }}
                />

                {/* Gradient scrim */}
                <div className="absolute inset-0 bg-linear-to-t from-background/90 via-background/25 to-transparent" />

                {/* Left accent binding */}
                <div
                  className={`absolute left-0 top-0 bottom-0 w-0.5 transition-colors duration-500 ${
                    isActive ? "bg-accent" : "bg-accent/30"
                  }`}
                />

                {/* ── Content ── */}
                <AnimatePresence mode="wait">
                  {isActive && (
                    <motion.div
                      key={`mob-content-${i}`}
                      initial={{ opacity: 0, y: 16 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.4, delay: 0.1 }}
                      className="absolute inset-0 flex flex-col justify-end p-5"
                    >
                      {/* Ghost numeral */}
                      <span
                        aria-hidden
                        className="pointer-events-none absolute top-3 right-4 font-display text-foreground/10 text-[6rem] leading-none tracking-tighter select-none"
                      >
                        {pad(i)}
                      </span>

                      <span className="hairline text-accent text-[10px] tracking-[0.18em] uppercase mb-1">
                        Vol {pad(i)} · {c.tagline}
                      </span>

                      <h3 className="font-display text-foreground text-4xl leading-[0.95] mt-1">
                        {c.name}
                      </h3>

                      {/* Accent rule */}
                      <motion.div
                        initial={{ scaleX: 0 }}
                        animate={{ scaleX: 1 }}
                        transition={{
                          duration: 0.5,
                          delay: 0.3,
                          ease: [0.16, 1, 0.3, 1],
                        }}
                        style={{ transformOrigin: "left center" }}
                        className="h-px w-14 bg-accent my-3"
                      />

                      <p className="text-foreground/75 text-sm leading-relaxed max-w-[85%]">
                        {c.description}
                      </p>

                      {/* ✅ FIXED: was <a href={c.to}> — now uses Link for client-side navigation */}
                      <Link
                        to={c.to}
                        className="group/cta mt-5 inline-flex items-center gap-2.5 text-foreground"
                      >
                        <span className="hairline text-xs tracking-widest uppercase">
                          Open volume
                        </span>
                        <span className="relative h-px w-8 bg-foreground/40 overflow-hidden">
                          <span className="absolute inset-y-0 left-0 w-full bg-accent origin-left scale-x-0 group-hover/cta:scale-x-100 transition-transform duration-500 ease-out" />
                        </span>
                        <ArrowUpRight size={14} />
                      </Link>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </motion.div>
      </div>

      {/* ── Dot + counter row ── */}
      <div className="flex items-center justify-between mt-4 px-1">
        {/* Dots */}
        <div className="flex items-center gap-2">
          {CATEGORIES.map((_, i) => (
            <button
              key={i}
              onClick={() => setIndex(i)}
              aria-label={`Go to ${CATEGORIES[i].name}`}
              className="relative flex items-center justify-center"
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
                className="block h-0.75 rounded-full"
                style={{ display: "block" }}
              />
            </button>
          ))}
        </div>

        {/* Chapter name + counter */}
        <AnimatePresence mode="wait">
          <motion.span
            key={index}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.3 }}
            className="hairline text-foreground/50 text-[10px] tabular-nums tracking-widest"
          >
            {pad(index)} / {pad(CATEGORIES.length - 1)}
          </motion.span>
        </AnimatePresence>
      </div>

      {/* ── Swipe hint ── */}
      <p className="mt-2 text-center hairline text-foreground/30 text-[10px] tracking-widest uppercase">
        Swipe to explore
      </p>
    </div>
  );
};

// =========================================================================
// Section — "Bookshelf Spines" accordion
// =========================================================================
const Section: React.FC = () => {
  const [index, setIndex] = useState(0);
  const [hovered, setHovered] = useState<number | null>(null);
  const [paused, setPaused] = useState(false);

  const sectionRef = useRef<HTMLDivElement>(null);
  const shelfRef = useRef<HTMLDivElement>(null);
  const spineRefs = useRef<Array<HTMLButtonElement | null>>([]);

  const active = CATEGORIES[index];

  // ----- Auto-advance -----
  useEffect(() => {
    if (paused) return;
    const id = window.setInterval(() => {
      setIndex((i) => (i + 1) % CATEGORIES.length);
    }, 5200);
    return () => window.clearInterval(id);
  }, [paused]);

  // ----- Scroll-in choreography -----
  useEffect(() => {
    const ctx = gsap.context(() => {
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
    return () => ctx.revert();
  }, []);

  // ----- Animate flex-basis on index/hover change -----
  useEffect(() => {
    spineRefs.current.forEach((el, i) => {
      if (!el) return;
      const isActive = i === index;
      const isPeek = hovered === i && !isActive;
      const grow = isActive ? 7 : isPeek ? 1.6 : 1;
      gsap.to(el, {
        flexGrow: grow,
        duration: 0.9,
        ease: "expo.out",
      });
    });
  }, [index, hovered]);

  // ----- Keyboard nav -----
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
      onMouseLeave={() => {
        setPaused(false);
        setHovered(null);
      }}
    >
      <Suspense fallback={<div className="h-24" />}>
        <SectionHeading
          eyebrow="Selected Works"
          title="Moments, kept in light"
          subtitle="Six chapters from every story — slide one open."
        />
      </Suspense>

      {/* ── Shelf meta bar ── */}
      <div className="mx-auto max-w-7xl mt-10 md:mt-12 flex items-center justify-between border-t border-accent/30 pt-4">
        <span className="hairline text-accent text-[10px] md:text-xs tracking-widest">
          The Shelf · 06 Volumes
        </span>
        <span className="hairline text-foreground/50 tabular-nums text-[10px] md:text-xs">
          Now reading — {pad(index)} / {pad(CATEGORIES.length - 1)}
        </span>
      </div>

      {/* ══════════════════════════════════════════════
          MOBILE — full-width card swipe carousel
      ══════════════════════════════════════════════ */}
      <MobileShelf index={index} setIndex={setIndex} />

      {/* ══════════════════════════════════════════════
          DESKTOP — original bookshelf spine accordion
      ══════════════════════════════════════════════ */}
      <div
        ref={shelfRef}
        className="mx-auto max-w-7xl mt-6 hidden md:flex flex-row gap-1.5"
        style={{ height: "min(78vh, 680px)" }}
        role="tablist"
        aria-label="Photo chapter shelf"
      >
        {CATEGORIES.map((c, i) => {
          const isActive = i === index;
          return (
            <button
              key={c.name}
              ref={(el) => {
                spineRefs.current[i] = el;
              }}
              role="tab"
              aria-selected={isActive}
              aria-label={c.name}
              onClick={() => setIndex(i)}
              onMouseEnter={() => setHovered(i)}
              onFocus={() => setIndex(i)}
              className={`group relative overflow-hidden rounded-sm ring-1 ring-accent/25 bg-card text-left flex-1 min-h-0 ${
                isActive ? "cursor-default" : "cursor-pointer"
              }`}
              style={{ flexBasis: 0 }}
            >
              {/* Background image */}
              <img
                src={c.image}
                alt=""
                aria-hidden
                loading={i === 0 ? "eager" : "lazy"}
                decoding="async"
                className={`absolute inset-0 h-full w-full object-cover transition-all duration-1000 ease-out ${
                  isActive
                    ? "opacity-100 scale-100"
                    : "opacity-30 scale-105 grayscale group-hover:opacity-55 group-hover:grayscale-0"
                }`}
              />

              {/* Tint scrim */}
              <div
                className={`absolute inset-0 transition-opacity duration-700 ${
                  isActive
                    ? "bg-linear-to-t from-background/85 via-background/20 to-transparent opacity-100"
                    : "bg-background/70 opacity-100 group-hover:bg-background/50"
                }`}
              />

              {/* Left edge gold rule */}
              <div
                aria-hidden
                className={`absolute left-0 top-0 bottom-0 w-px transition-colors duration-500 ${
                  isActive
                    ? "bg-accent"
                    : "bg-accent/40 group-hover:bg-accent"
                }`}
              />

              {/* Inactive spine label (vertical) */}
              <div
                className={`absolute inset-0 flex flex-col items-center justify-between py-6 transition-opacity duration-300 ${
                  isActive ? "opacity-0 pointer-events-none" : "opacity-100 delay-300"
                }`}
              >
                <span className="hairline text-accent tabular-nums">
                  {pad(i)}
                </span>
                <span
                  className="font-display text-foreground/85 text-2xl md:text-3xl whitespace-nowrap"
                  style={{
                    writingMode: "vertical-rl",
                    transform: "rotate(180deg)",
                  }}
                >
                  {c.name}
                </span>
                <Plus
                  size={16}
                  className="text-accent transition-transform duration-500 group-hover:rotate-90"
                />
              </div>

              {/* Active spine content */}
              <AnimatePresence>
                {isActive && (
                  <motion.div
                    key={`active-${i}`}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.4, delay: 0.35 }}
                    className="absolute inset-0 z-10 flex flex-col justify-end p-6 md:p-10"
                  >
                    <motion.span
                      initial={{ opacity: 0, x: 30 }}
                      animate={{ opacity: 0.12, x: 0 }}
                      transition={{
                        duration: 0.9,
                        delay: 0.45,
                        ease: [0.22, 1, 0.36, 1],
                      }}
                      className="pointer-events-none absolute top-4 right-6 md:top-8 md:right-10 font-display text-foreground text-[8rem] md:text-[14rem] leading-none tracking-tighter select-none"
                    >
                      {pad(i)}
                    </motion.span>

                    <div className="relative max-w-xl">
                      <motion.span
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.45 }}
                        className="hairline text-accent block"
                      >
                        Volume {pad(i)} · {active.tagline}
                      </motion.span>

                      <motion.h3
                        initial={{ opacity: 0, y: 26 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{
                          duration: 0.65,
                          delay: 0.5,
                          ease: [0.22, 1, 0.36, 1],
                        }}
                        className="font-display text-foreground text-5xl md:text-7xl leading-[0.95] mt-3"
                      >
                        {active.name}
                      </motion.h3>

                      <motion.div
                        initial={{ scaleX: 0 }}
                        animate={{ scaleX: 1 }}
                        transition={{
                          duration: 0.7,
                          delay: 0.7,
                          ease: [0.16, 1, 0.3, 1],
                        }}
                        style={{ transformOrigin: "left center" }}
                        className="h-px w-20 bg-accent my-5"
                      />

                      <motion.p
                        initial={{ opacity: 0, y: 14 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.55, delay: 0.62 }}
                        className="text-foreground/80 leading-relaxed text-base md:text-lg max-w-md"
                      >
                        {active.description}
                      </motion.p>

                      {/* ✅ FIXED: was <motion.a href={active.to}> — now uses MotionLink for client-side navigation */}
                      <MotionLink
                        to={active.to}
                        initial={{ opacity: 0, y: 14 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.55, delay: 0.72 }}
                        className="group/cta mt-8 inline-flex items-center gap-3 text-foreground"
                      >
                        <span className="hairline">Open this volume</span>
                        <span className="relative h-px w-12 bg-foreground/40 overflow-hidden">
                          <span className="absolute inset-y-0 left-0 w-full bg-accent origin-left scale-x-0 group-hover/cta:scale-x-100 transition-transform duration-500 ease-out" />
                        </span>
                        <ArrowUpRight
                          size={18}
                          className="transition-transform duration-500 group-hover/cta:-translate-y-0.5 group-hover/cta:translate-x-0.5"
                        />
                      </MotionLink>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </button>
          );
        })}
      </div>

      {/* ── Footer scrub (shared — works for both views) ── */}
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
            layout
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
                  className={`block h-2 w-px transition-all duration-500 ${
                    i <= index ? "bg-accent h-3" : "bg-foreground/30"
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