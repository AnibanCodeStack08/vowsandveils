/**
 * video-gallary.tsx  — Three-section video archive
 * Sections: Prewedding · Wedding · Rice Ceremony
 *
 * Stack: React · TypeScript · Tailwind CSS · GSAP · Framer Motion
 */

import { useEffect, useRef, useState, useCallback } from "react";
import { motion, useInView } from "framer-motion";
import { useNavigate } from "react-router-dom";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  GALLERY_SECTIONS,
  type GallerySection,
  type VideoItem,
} from "./../data/videos.ts";
import LiteYouTube from "./youtube.tsx";

gsap.registerPlugin(ScrollTrigger);

// ─── tiny helpers ────────────────────────────────────────────────────────────

function pad(n: number) {
  return String(n).padStart(2, "0");
}

// ─── VideoCard ───────────────────────────────────────────────────────────────

interface VideoCardProps {
  video: VideoItem;
  index: number;
  sectionIndex: number;
  isPlaying: boolean;
  accentColor: string;
  onPlay: (id: string) => void;
}

function VideoCard({
  video,
  index,
  sectionIndex,
  isPlaying,
  accentColor,
  onPlay,
}: VideoCardProps) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "0px 0px -80px 0px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 48, scale: 0.96 }}
      animate={inView ? { opacity: 1, y: 0, scale: 1 } : {}}
      transition={{
        duration: 0.75,
        delay: (index % 3) * 0.09 + sectionIndex * 0.04,
        ease: [0.22, 1, 0.36, 1],
      }}
      className="group relative overflow-hidden rounded-md border border-white/10 bg-[#0d0d0d] transition-all duration-500"
      style={
        {
          "--accent": accentColor,
        } as React.CSSProperties
      }
    >
      {/* Hover glow ring */}
      <div
        className="pointer-events-none absolute inset-0 rounded-md opacity-0 ring-1 transition-opacity duration-500 group-hover:opacity-100"
        style={{ boxShadow: `0 0 36px -8px ${accentColor}`, "--tw-ring-color": accentColor } as React.CSSProperties}
      />

      {/* Video embed */}
      <div
        className="relative aspect-video w-full cursor-pointer overflow-hidden"
        onClick={() => onPlay(video.id)}
      >
        <LiteYouTube
          key={isPlaying ? video.id : `${video.id}--idle`}
          id={video.id}
          title={video.title}
        />
      </div>

      {/* Caption bar */}
      <div className="flex items-center justify-between px-5 py-4">
        <span
          className="font-mono text-xs tracking-widest"
          style={{ color: accentColor }}
        >
          {pad(index + 1)}
        </span>
        <h3 className="font-display text-base text-white/80 transition-colors duration-300 group-hover:text-white">
          {video.title}
        </h3>
      </div>
    </motion.div>
  );
}

// ─── SectionBlock ─────────────────────────────────────────────────────────────

interface SectionBlockProps {
  section: GallerySection;
  sectionIndex: number;
  playingId: string | null;
  onPlay: (id: string) => void;
}

function SectionBlock({
  section,
  sectionIndex,
  playingId,
  onPlay,
}: SectionBlockProps) {
  const headingRef = useRef<HTMLHeadingElement>(null);
  const lineRef = useRef<HTMLDivElement>(null);
  const blockRef = useRef<HTMLDivElement>(null);

  // GSAP scroll-triggered title reveal
  useEffect(() => {
    const ctx = gsap.context(() => {
      if (!headingRef.current || !lineRef.current) return;

      gsap.fromTo(
        headingRef.current,
        { opacity: 0, y: 40, skewY: 2 },
        {
          opacity: 1,
          y: 0,
          skewY: 0,
          duration: 1,
          ease: "expo.out",
          scrollTrigger: {
            trigger: blockRef.current,
            start: "top 82%",
            toggleActions: "play none none none",
          },
        }
      );

      gsap.fromTo(
        lineRef.current,
        { scaleX: 0, transformOrigin: "left center" },
        {
          scaleX: 1,
          duration: 1.2,
          ease: "expo.out",
          delay: 0.25,
          scrollTrigger: {
            trigger: blockRef.current,
            start: "top 82%",
            toggleActions: "play none none none",
          },
        }
      );
    }, blockRef);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={blockRef} className="mb-28 last:mb-0">
      {/* Section header */}
      <div className="mb-10 flex flex-col gap-4">
        <div className="flex items-baseline gap-6">
          <span
            className="font-mono text-xs tracking-[0.3em] uppercase"
            style={{ color: section.accent }}
          >
            {pad(sectionIndex + 1)} — Category
          </span>
          <span className="h-px flex-1 bg-white/10" />
        </div>

        <h2
          ref={headingRef}
          className="font-display text-5xl leading-none text-white opacity-0 md:text-7xl"
        >
          {section.label}
        </h2>

        <div
          ref={lineRef}
          className="h-px w-32 origin-left"
          style={{ background: section.accent }}
        />

        <p className="max-w-md text-sm text-white/40">
          {section.videos.length} film{section.videos.length !== 1 ? "s" : ""} in this collection
        </p>
      </div>

      {/* Video grid */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {section.videos.map((video, i) => (
          <VideoCard
            key={`${video.id}-${i}`}
            video={video}
            index={i}
            sectionIndex={sectionIndex}
            isPlaying={playingId === video.id}
            accentColor={section.accent}
            onPlay={onPlay}
          />
        ))}
      </div>
    </div>
  );
}

// ─── Tab navigation ───────────────────────────────────────────────────────────

interface TabNavProps {
  sections: GallerySection[];
  activeKey: string;
  onSelect: (key: string) => void;
}

function TabNav({ sections, activeKey, onSelect }: TabNavProps) {
  return (
    <div className="sticky top-0 z-40 border-b border-white/10 bg-[#080808]/90 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center gap-1 overflow-x-auto px-6 py-0 scrollbar-none">
        {sections.map((s) => {
          const active = s.key === activeKey;
          return (
            <button
              key={s.key}
              onClick={() => onSelect(s.key)}
              className="relative shrink-0 px-5 py-5 font-mono text-xs tracking-widest uppercase transition-colors duration-300"
              style={{ color: active ? s.accent : "rgba(255,255,255,0.4)" }}
            >
              {s.label}
              {active && (
                <motion.div
                  layoutId="tab-underline"
                  className="absolute bottom-0 left-0 right-0 h-px"
                  style={{ background: s.accent }}
                  transition={{ type: "spring", stiffness: 400, damping: 35 }}
                />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}

// ─── CinematicCTA ─────────────────────────────────────────────────────────────

interface CinematicCTAProps {
  onNavigate: () => void;
}

function CinematicCTA({ onNavigate }: CinematicCTAProps) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "0px 0px -60px 0px" });
  const [hovered, setHovered] = useState(false);

  const accentColor = GALLERY_SECTIONS[0].accent;

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 56 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
      className="relative flex flex-col items-center justify-center gap-8 py-24 md:py-32"
    >
      {/* Ambient glow beneath the CTA */}
      <motion.div
        className="pointer-events-none absolute inset-0 flex items-center justify-center"
        animate={{ opacity: hovered ? 1 : 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <div
          className="h-48 w-96 rounded-full blur-[80px]"
          style={{ background: accentColor, opacity: 0.12 }}
        />
      </motion.div>

      {/* Eyebrow label */}
      <motion.p
        initial={{ opacity: 0, letterSpacing: "0.2em" }}
        animate={inView ? { opacity: 1, letterSpacing: "0.35em" } : {}}
        transition={{ duration: 1.2, delay: 0.25, ease: "easeOut" }}
        className="font-mono text-[10px] uppercase text-white/30"
      >
        End of Archive
      </motion.p>

      {/*
       * FIX: Use a plain <button> (same as wedding.tsx) wrapped in a motion.div
       * for scale animations. motion.button's whileTap/whileHover pointer-event
       * handling was intercepting and swallowing the onClick in some cases.
       */}
      <motion.div
        animate={{ scale: hovered ? 1.03 : 1 }}
        whileTap={{ scale: 0.97 }}
        transition={{ type: "spring", stiffness: 340, damping: 28 }}
      >
        <button
          type="button"
          onClick={onNavigate}
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
          className="group relative flex cursor-pointer items-center gap-5 overflow-hidden rounded-sm border border-white/10 bg-transparent px-10 py-5 md:px-14 md:py-6"
          style={{ outline: "none" }}
        >
          {/* Sliding fill on hover */}
          <motion.span
            className="pointer-events-none absolute inset-0"
            style={{ background: accentColor }}
            initial={{ x: "-101%" }}
            animate={{ x: hovered ? "0%" : "-101%" }}
            transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
          />

          {/* Glow border pulse */}
          <motion.span
            className="pointer-events-none absolute inset-0 rounded-sm"
            animate={
              hovered
                ? { boxShadow: `0 0 32px -4px ${accentColor}80, inset 0 0 20px -8px ${accentColor}30` }
                : { boxShadow: "none" }
            }
            transition={{ duration: 0.5, ease: "easeOut" }}
          />

          {/* Arrow icon */}
          <motion.span
            className="relative z-10 flex items-center"
            animate={{ x: hovered ? 0 : -4, opacity: hovered ? 1 : 0.45 }}
            transition={{ duration: 0.35, ease: "easeOut" }}
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
              className="transition-colors duration-300"
              style={{ color: hovered ? "#080808" : "rgba(255,255,255,0.5)" }}
            >
              <path
                d="M8 1L1 8M1 8L8 15M1 8H15"
                stroke="currentColor"
                strokeWidth="1.4"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </motion.span>

          {/* Label */}
          <motion.span
            className="relative z-10 font-mono text-sm tracking-[0.22em] uppercase transition-colors duration-300"
            animate={{ color: hovered ? "#080808" : "rgba(255,255,255,0.75)" }}
            transition={{ duration: 0.3 }}
          >
            Return to Stories
          </motion.span>
        </button>
      </motion.div>

      {/* Decorative ruled lines flanking the button */}
      <motion.div
        initial={{ opacity: 0, scaleX: 0 }}
        animate={inView ? { opacity: 1, scaleX: 1 } : {}}
        transition={{ duration: 1.4, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="flex w-full max-w-xs items-center gap-4 origin-center"
      >
        <div className="h-px flex-1 bg-white/8" />
        <span
          className="font-mono text-[9px] tracking-[0.4em] uppercase"
          style={{ color: `${accentColor}60` }}
        >
          ✦
        </span>
        <div className="h-px flex-1 bg-white/8" />
      </motion.div>
    </motion.div>
  );
}

// ─── VideoGallery (page root) ─────────────────────────────────────────────────

export default function VideoGallery() {
  const navigate = useNavigate();
  const [playingId, setPlayingId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<string>(GALLERY_SECTIONS[0].key);
  const heroRef = useRef<HTMLDivElement>(null);

  const handlePlay = useCallback((id: string) => setPlayingId(id), []);

  // Scroll to top on mount
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
  }, []);

  // GSAP hero entrance
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

  // Scroll to section when tab clicked
  const handleTabSelect = useCallback((key: string) => {
    setActiveTab(key);
    const el = document.getElementById(`section-${key}`);
    if (el) {
      const top = el.getBoundingClientRect().top + window.scrollY - 64;
      window.scrollTo({ top, behavior: "smooth" });
    }
  }, []);

  // Sync active tab on scroll via IntersectionObserver
  useEffect(() => {
    const observers: IntersectionObserver[] = [];

    GALLERY_SECTIONS.forEach((s) => {
      const el = document.getElementById(`section-${s.key}`);
      if (!el) return;
      const obs = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) setActiveTab(s.key);
        },
        { rootMargin: "-30% 0px -60% 0px", threshold: 0 }
      );
      obs.observe(el);
      observers.push(obs);
    });

    return () => observers.forEach((o) => o.disconnect());
  }, []);

  const handleBackHome = useCallback(() => {
    navigate(-1);
  }, [navigate]);

  return (
    <div className="min-h-screen bg-[#080808] text-white">
      {/* ── Hero ── */}
      <section
        ref={heroRef}
        className="relative flex min-h-[52vh] flex-col items-center justify-end overflow-hidden pb-16 pt-32"
      >
        {/* Ambient glow blobs */}
        <div
          className="pointer-events-none absolute -top-32 left-1/4 h-[480px] w-[480px] rounded-full opacity-10 blur-[120px]"
          style={{ background: GALLERY_SECTIONS[0].accent }}
        />
        <div
          className="pointer-events-none absolute -bottom-16 right-1/4 h-[360px] w-[360px] rounded-full opacity-8 blur-[100px]"
          style={{ background: GALLERY_SECTIONS[1].accent }}
        />

        <div className="relative flex flex-col items-center text-center">
          <p className="hero-sub mb-6 font-mono text-xs tracking-[0.35em] text-white/50 uppercase opacity-0">
            Complete Archive
          </p>

          {/* Masked word-by-word reveal */}
          <div className="overflow-hidden">
            <h1 className="font-display text-6xl leading-none tracking-tight md:text-9xl">
              {"The Full".split("").map((ch, i) => (
                <span
                  key={i}
                  className="hero-word inline-block opacity-0"
                  style={{ display: ch === " " ? "inline" : "inline-block" }}
                >
                  {ch === " " ? "\u00A0" : ch}
                </span>
              ))}
            </h1>
          </div>
          <div className="overflow-hidden">
            <h1
              className="font-display text-6xl leading-none tracking-tight md:text-9xl"
              style={{ WebkitTextStroke: "1px rgba(255,255,255,0.3)", color: "transparent" }}
            >
              {"Collection".split("").map((ch, i) => (
                <span key={i} className="hero-word inline-block opacity-0">
                  {ch}
                </span>
              ))}
            </h1>
          </div>

          <div className="hero-sub mt-10 flex items-center gap-4 opacity-0">
            {GALLERY_SECTIONS.map((s, i) => (
              <span key={s.key} className="flex items-center gap-4">
                <span className="font-mono text-xs tracking-widest" style={{ color: s.accent }}>
                  {pad(s.videos.length)} {s.label}
                </span>
                {i < GALLERY_SECTIONS.length - 1 && (
                  <span className="text-white/20">·</span>
                )}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ── Sticky tab nav ── */}
      <TabNav
        sections={GALLERY_SECTIONS}
        activeKey={activeTab}
        onSelect={handleTabSelect}
      />

      {/* ── Sections ── */}
      <main className="mx-auto max-w-7xl px-6 py-20 md:px-10">
        {GALLERY_SECTIONS.map((section, si) => (
          <div key={section.key} id={`section-${section.key}`}>
            <SectionBlock
              section={section}
              sectionIndex={si}
              playingId={playingId}
              onPlay={handlePlay}
            />

            {/* Divider between sections */}
            {si < GALLERY_SECTIONS.length - 1 && (
              <div className="mb-28 flex items-center gap-6">
                <div className="h-px flex-1 bg-white/5" />
                <span className="font-mono text-xs tracking-widest text-white/20 uppercase">
                  ···
                </span>
                <div className="h-px flex-1 bg-white/5" />
              </div>
            )}
          </div>
        ))}

        {/* ── Cinematic CTA ── */}
        <CinematicCTA onNavigate={handleBackHome} />
      </main>

      {/* ── Footer strip ── */}
      <footer className="border-t border-white/10 px-6 py-10 text-center">
        <p className="font-mono text-xs tracking-widest text-white/25 uppercase">
          Every story, every frame — crafted with intention
        </p>
      </footer>
    </div>
  );
}