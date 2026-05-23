import { useLayoutEffect, useRef, useState } from "react";
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform } from "framer-motion";
import { useNavigate } from "react-router-dom";
import gsap from "gsap";

const santanu = "/images/team/santanu1.JPG";
const subhankar = "/images/team/subhankar1.jpg";
const ujjwal = "/images/team/ujjwal1.jpg";
const asmita = "/images/team/asmita1.jpg";
const rony = "/images/team/rony1.jpg";
const sajal = "/images/team/sajal1.jpg";

export interface TeamMember {
  name: string;
  role: string;
  image: string;
  quote?: string;
}

interface TeamProps {
  members?: TeamMember[];
  eyebrow?: string;
  title?: string;
  description?: string;
}

const DEFAULT_MEMBERS: TeamMember[] = [
  { name: "Santanu Das",     role: "Founder",              image: santanu,   quote: "Frames are memory's grammar." },
  { name: "Subhankar Dutta", role: "Lead Photographer",    image: subhankar, quote: "Light first. Always light." },
  { name: "Ujjwal Biswas",   role: "Lead Cinematographer", image: ujjwal,    quote: "A film is a held breath." },
  { name: "Rony Roy",        role: "Cinematographer",      image: rony,      quote: "Compose, then disappear." },
  { name: "Asmita Moulik",   role: "Video Editor",         image: asmita,    quote: "The cut is where feeling lives." },
  { name: "Sajal Biswas",    role: "Photo Editor",         image: sajal,     quote: "Color is the second exposure." },
];

export default function Team({
  members = DEFAULT_MEMBERS,
  eyebrow = "Vows&Veils · Atelier 2026",
  title = "The Hands Behind Every Frame",
  description = "Six storytellers crafting the quiet, unrepeatable moments of your day. Hover a name to meet them.",
}: TeamProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const [active, setActive] = useState(0);
  const navigate = useNavigate();

  useLayoutEffect(() => {
    if (!sectionRef.current) return;
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
      tl.from(".sp-eyebrow", { opacity: 0, y: 14, duration: 0.7 })
        .from(".sp-title", { opacity: 0, y: 24, duration: 0.9 }, "-=0.4")
        .from(".sp-rule", { scaleX: 0, transformOrigin: "left", duration: 1, ease: "power3.inOut" }, "-=0.5")
        .from(".sp-desc", { opacity: 0, y: 16, duration: 0.7 }, "-=0.6")
        .from(".sp-stage", { opacity: 0, scale: 0.96, duration: 1.1, ease: "power4.out" }, "-=0.6")
        .from(".sp-cast-row", { opacity: 0, x: 30, duration: 0.6, stagger: 0.07 }, "-=0.8")
        .from(".sp-meta", { opacity: 0, y: 12, duration: 0.6, stagger: 0.06 }, "-=0.5")
        .from(".sp-cta", { opacity: 0, y: 20, duration: 0.7, ease: "power3.out" }, "-=0.3");
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  const member = members[active];

  return (
    <section
      id="team"
      ref={sectionRef}
      aria-labelledby="team-heading"
      className="relative isolate overflow-hidden bg-background text-foreground"
    >
      <motion.div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        animate={{
          background: `radial-gradient(60% 50% at ${20 + active * 10}% 30%, color-mix(in oklab, var(--color-gold) 12%, transparent), transparent 70%), radial-gradient(50% 60% at ${80 - active * 10}% 70%, color-mix(in oklab, var(--color-gold-soft) 10%, transparent), transparent 70%)`,
        }}
        transition={{ duration: 1.2, ease: "easeInOut" }}
      />
      <FilmGrain />

      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16 md:px-10 md:py-24">

        {/* ── Header row ── */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-12 md:gap-10">
          <div className="md:col-span-8">
            <p className="sp-eyebrow hairline text-xs sm:text-sm" style={{ color: "var(--color-gold)" }}>
              — {eyebrow}
            </p>
            <h2
              id="team-heading"
              className="sp-title font-display mt-4 text-balance leading-[1.02] text-4xl sm:text-5xl md:text-7xl"
            >
              {title}
            </h2>
            <div className="sp-rule gold-line mt-5 w-32 sm:w-40" />
            <p className="sp-desc mt-4 max-w-xl text-sm text-muted-foreground sm:text-base md:text-lg">
              {description}
            </p>
          </div>

          <aside className="md:col-span-4 md:pt-3">
            {/* Mobile */}
            <dl className="flex items-center gap-0 divide-x divide-border/60 border border-border/40 md:hidden">
              <MetaCompact label="Cast" value={String(members.length).padStart(2, "0")} />
              <MetaCompact label="Now" value={`#${String(active + 1).padStart(2, "0")} ${member.name.split(" ")[0]}`} />
            </dl>
            {/* Desktop */}
            <dl className="hidden md:grid md:grid-cols-1 gap-x-6 gap-y-4 text-sm">
              <Meta label="Cast" value={String(members.length).padStart(2, "0")} />
              <Meta label="Now" value={`#${String(active + 1).padStart(2, "0")} ${member.name.split(" ")[0]}`} />
            </dl>
          </aside>
        </div>

        {/* ── Main body ── */}
        <div className="mt-8 grid grid-cols-1 gap-6 sm:mt-10 md:mt-16 md:grid-cols-12 md:gap-10">

          {/* ── Portrait + caption + progress + CTA ── */}
          <div className="sp-stage md:col-span-8">

            <div className="flex flex-col gap-1 sm:flex-row sm:items-start sm:gap-5 md:block">

              {/*
               * Portrait frame
               *
               * Aspect ratio behaviour by breakpoint:
               *   mobile (< sm)  → aspect-square  (1:1) — no maxHeight so the
               *                    square fills the full container width cleanly
               *   sm (640px+)    → aspect-[3/4]   restores the portrait crop;
               *                    maxHeight re-applied via inline style so the
               *                    sidebar layout still feels balanced
               *   md (768px+)    → same 3/4 crop, constrained by md:max-w-lg
               *
               * We keep aspectRatio out of the inline style entirely and drive
               * it through Tailwind so the responsive switch requires no JS.
               */}

              {/*
               * Mobile-only name + role banner — displayed ABOVE the portrait.
               * Hidden at md+ because the full animated caption below the image
               * handles that range. AnimatePresence mirrors the bottom caption's
               * motion so member swaps feel consistent across breakpoints.
               */}
              <div className="mb-1 text-center md:hidden">
                <div className="overflow-hidden">
                  <AnimatePresence mode="wait">
                    <motion.p
                      key={member.name + "-mob"}
                      initial={{ y: "100%" }}
                      animate={{ y: 0 }}
                      exit={{ y: "-100%" }}
                      transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
                      className="font-display text-balance leading-none text-2xl"
                    >
                      {member.name}
                    </motion.p>
                  </AnimatePresence>
                </div>
                <div className="mt-1.5 flex flex-col items-center gap-1">
                  <span aria-hidden className="h-px w-6" style={{ background: "var(--color-gold)" }} />
                  <AnimatePresence mode="wait">
                    <motion.span
                      key={member.role + active + "-mob"}
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -6 }}
                      transition={{ duration: 0.35, delay: 0.1 }}
                      className="hairline text-[10px] uppercase tracking-widest"
                      style={{ color: "var(--color-gold)" }}
                    >
                      {member.role}
                    </motion.span>
                  </AnimatePresence>
                </div>
              </div>

              <div
                className={[
                  "relative w-full overflow-hidden rounded-md bg-card",
                  // ─ mobile: perfect square, no size cap (width IS the cap)
                  "aspect-square",
                  // ─ sm: restore portrait crop + half-width sidebar layout
                  "sm:aspect-[3/4] sm:w-[48%] sm:shrink-0",
                  // ─ md: full-width within the left column, centred
                  "md:w-full md:max-w-lg md:mx-auto",
                ].join(" ")}
                style={{
                  // maxHeight is only meaningful at sm+ where the frame is
                  // narrower than the viewport — on mobile the square is
                  // self-constraining via width, so we skip it there.
                  // Using a CSS custom property fallback keeps this a single
                  // style declaration while still being viewport-aware.
                  maxHeight: "clamp(300px, 55vw, 500px)",
                  // On mobile the element is full-width; aspect-square makes
                  // height === width, so maxHeight would cap it at 300px for a
                  // 375px-wide screen and break the square.  We override with
                  // "none" below the sm breakpoint via a data attribute + CSS,
                  // but the simpler zero-JS approach is a CSS variable:
                  //   see the <style> block injected in FilmGrain's sibling.
                  boxShadow: "0 40px 100px -40px color-mix(in oklab, var(--color-gold) 25%, transparent)",
                }}
                // data attribute lets a single @media rule clear maxHeight
                data-portrait-frame
              >
                <AnimatePresence mode="popLayout">
                  <motion.div
                    key={active}
                    className="absolute inset-0"
                    initial={{ clipPath: "inset(0 0 100% 0)", scale: 1.1 }}
                    animate={{ clipPath: "inset(0 0 0% 0)", scale: 1 }}
                    exit={{ clipPath: "inset(100% 0 0 0)", scale: 1.05 }}
                    transition={{ duration: 1.0, ease: [0.77, 0, 0.175, 1] }}
                  >
                    <motion.div
                      className="absolute inset-0"
                      initial={{ scale: 1.0 }}
                      animate={{ scale: 1.06 }}
                      transition={{ duration: 8, ease: "easeOut" }}
                    >
                      <Portrait member={member} />
                    </motion.div>
                  </motion.div>
                </AnimatePresence>

                <Corner className="left-2 top-2 sm:left-3 sm:top-3" />
                <Corner className="right-2 top-2 rotate-90 sm:right-3 sm:top-3" />
                <Corner className="bottom-2 left-2 -rotate-90 sm:bottom-3 sm:left-3" />
                <Corner className="bottom-2 right-2 rotate-180 sm:bottom-3 sm:right-3" />
              </div>

              {/* Mobile-only grid cast list — 3 cols (2×3 for 6 members) */}
              <ol
                className="flex-1 grid gap-1.5 content-start md:hidden"
                style={{ gridTemplateColumns: "repeat(3, minmax(0, 1fr))" }}
              >
                {members.map((m, i) => (
                  <CastRow
                    key={m.name}
                    member={m}
                    index={i}
                    isActive={i === active}
                    onActivate={() => setActive(i)}
                    compact
                    gridCell
                  />
                ))}
              </ol>
            </div>

            {/* Caption */}
            <div className="mt-5 text-center sm:mt-6 md:mt-8 md:mx-auto md:max-w-lg">
              {/*
               * Name + role are shown ABOVE the portrait on mobile via the
               * banner inserted earlier, so we hide them here below md to
               * avoid duplication. At md+ the full animated caption renders
               * as before.
               */}
              <div className="hidden md:block overflow-hidden">
                <AnimatePresence mode="wait">
                  <motion.h3
                    key={member.name}
                    initial={{ y: "100%" }}
                    animate={{ y: 0 }}
                    exit={{ y: "-100%" }}
                    transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                    className="font-display text-balance leading-none text-3xl sm:text-4xl md:text-6xl"
                  >
                    {member.name}
                  </motion.h3>
                </AnimatePresence>
              </div>
              <div className="mt-3 flex flex-col items-center gap-2 sm:gap-3">
                <AnimatePresence mode="wait">
                  <motion.span
                    key={member.role + active}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.45, delay: 0.15 }}
                    className="hairline hidden md:block text-xs sm:text-sm"
                    style={{ color: "var(--color-gold)" }}
                  >
                    {member.role}
                  </motion.span>
                </AnimatePresence>
                <span aria-hidden className="hidden md:block h-px w-8 sm:w-10" style={{ background: "var(--color-gold)" }} />
                {member.quote && (
                  <AnimatePresence mode="wait">
                    <motion.p
                      key={member.quote + active}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.5, delay: 0.25 }}
                      className="font-display max-w-xs italic text-foreground/85 text-sm sm:max-w-sm sm:text-base md:text-xl"
                    >
                      "{member.quote}"
                    </motion.p>
                  </AnimatePresence>
                )}
              </div>
            </div>

            {/* Progress bars */}
            <div className="mt-4 flex items-center gap-1.5 sm:mt-5 sm:gap-2">
              {members.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setActive(i)}
                  aria-label={`Show ${members[i].name}`}
                  className="relative h-[3px] flex-1 overflow-hidden rounded-full sm:h-1"
                  style={{ background: "var(--color-border)" }}
                >
                  <motion.span
                    className="absolute inset-y-0 left-0 block"
                    style={{ background: "var(--color-gold)" }}
                    initial={false}
                    animate={{ width: i <= active ? "100%" : "0%" }}
                    transition={{ duration: 0.4, ease: "easeOut" }}
                  />
                </button>
              ))}
            </div>

            {/* CTA */}
            <div className="sp-cta mt-7 flex justify-center sm:mt-8 md:mt-10 md:max-w-lg md:mx-auto">
              <CtaButton onClick={() => navigate("/team-about")} />
            </div>
          </div>

          {/* Desktop-only cast list */}
          <ol className="hidden md:block md:col-span-4">
            {members.map((m, i) => (
              <CastRow
                key={m.name}
                member={m}
                index={i}
                isActive={i === active}
                onActivate={() => setActive(i)}
              />
            ))}
          </ol>
        </div>
      </div>

      {/*
       * Scoped responsive override for the portrait frame's maxHeight.
       *
       * The inline style sets maxHeight for sm+ breakpoints where the frame
       * is narrower than the viewport (sidebar or max-w-lg context).
       * On mobile the frame is full-width and aspect-square is self-sizing,
       * so maxHeight must be cleared to avoid capping the height below the
       * width and breaking the square.
       *
       * We target [data-portrait-frame] so this stays local to the component
       * and doesn't require a global stylesheet change.
       */}
      <style>{`
        @media (max-width: 639px) {
          [data-portrait-frame] {
            max-height: none !important;
          }
        }
      `}</style>
    </section>
  );
}

/* ─── CTA Button ─────────────────────────────────────────────────────────── */

function CtaButton({ onClick }: { onClick: () => void }) {
  const [hovered, setHovered] = useState(false);
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  function handleMouseMove(e: React.MouseEvent<HTMLButtonElement>) {
    const rect = e.currentTarget.getBoundingClientRect();
    x.set(e.clientX - rect.left - rect.width / 2);
    y.set(e.clientY - rect.top - rect.height / 2);
  }

  function handleMouseLeave() {
    x.set(0);
    y.set(0);
    setHovered(false);
  }

  const springX = useSpring(x, { stiffness: 200, damping: 18 });
  const springY = useSpring(y, { stiffness: 200, damping: 18 });
  const translateX = useTransform(springX, (v) => v * 0.18);
  const translateY = useTransform(springY, (v) => v * 0.18);

  return (
    <motion.div
      style={{ x: translateX, y: translateY }}
      animate={{ scale: hovered ? 1.03 : 1 }}
      whileTap={{ scale: 0.97 }}
      transition={{ type: "spring", stiffness: 200, damping: 18 }}
    >
      <button
        type="button"
        onClick={onClick}
        onMouseMove={handleMouseMove}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={handleMouseLeave}
        className="group relative overflow-hidden border px-6 py-3 transition-colors duration-300 focus:outline-none sm:px-8 sm:py-4"
        aria-label="Meet the full atelier"
        style={{
          borderColor: "var(--color-gold)",
          color: hovered ? "var(--color-background)" : "var(--color-foreground)",
        }}
      >
        <motion.span
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{ background: "var(--color-gold)" }}
          initial={false}
          animate={{ y: hovered ? "0%" : "101%" }}
          transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
        />
        <motion.span
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{
            background: "linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.18) 50%, transparent 60%)",
            backgroundSize: "200% 100%",
          }}
          animate={hovered ? { backgroundPosition: ["200% 0", "-200% 0"] } : { backgroundPosition: "200% 0" }}
          transition={{ duration: 0.7, ease: "easeInOut" }}
        />
        <span className="relative z-10 flex items-center gap-2 sm:gap-3">
          <span className="hairline text-xs tracking-widest uppercase sm:text-sm">Meet the full Atelier</span>
          <motion.span
            aria-hidden
            className="font-display text-lg leading-none sm:text-xl"
            animate={{ x: hovered ? 4 : 0 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
          >
            →
          </motion.span>
        </span>
        {(["left-0 top-0", "right-0 top-0 rotate-90", "left-0 bottom-0 -rotate-90", "right-0 bottom-0 rotate-180"] as const).map(
          (cls, i) => (
            <motion.span
              key={i}
              aria-hidden
              className={`pointer-events-none absolute h-2 w-2 sm:h-2.5 sm:w-2.5 ${cls}`}
              style={{ borderTop: "1px solid var(--color-gold)", borderLeft: "1px solid var(--color-gold)" }}
              animate={{ opacity: hovered ? 1 : 0.4, scale: hovered ? 1.3 : 1 }}
              transition={{ duration: 0.3 }}
            />
          ),
        )}
      </button>
    </motion.div>
  );
}

/* ─── Supporting components ──────────────────────────────────────────────── */

function CastRow({
  member,
  index,
  isActive,
  onActivate,
  compact = false,
  gridCell = false,
}: {
  member: TeamMember;
  index: number;
  isActive: boolean;
  onActivate: () => void;
  compact?: boolean;
  gridCell?: boolean;
}) {
  const ref = useRef<HTMLLIElement>(null);
  const mx = useMotionValue(0);
  const sx = useSpring(mx, { stiffness: 200, damping: 20 });
  const tx = useTransform(sx, (v) => v * 14);

  function handleMove(e: React.MouseEvent<HTMLLIElement>) {
    const r = ref.current?.getBoundingClientRect();
    if (!r) return;
    mx.set((e.clientX - r.left) / r.width - 0.5);
  }

  // ── Grid-cell variant (mobile 3-col grid) ─────────────────────────────────
  // Stacks index → first name → role vertically inside a small bordered box.
  // Active state is shown with a gold bottom border + slightly brighter text.
  if (gridCell) {
    const firstName = member.name.split(" ")[0];

    return (
      <motion.li
        ref={ref}
        className="sp-cast-row relative cursor-pointer overflow-hidden rounded-sm"
        onMouseEnter={onActivate}
        onFocus={onActivate}
        tabIndex={0}
        animate={{
          borderColor: isActive
            ? "color-mix(in oklab, var(--color-gold) 55%, transparent)"
            : "color-mix(in oklab, var(--color-border) 80%, transparent)",
          backgroundColor: isActive
            ? "color-mix(in oklab, var(--color-gold) 6%, transparent)"
            : "transparent",
        }}
        transition={{ duration: 0.4 }}
        style={{ border: "1px solid var(--color-border)" }}
      >
        {/*
         * Button is the full cell surface.
         * — index floats absolute top-left so it never displaces the name
         * — name uses flex centering to sit exactly in the middle of the cell
         */}
        <button
          type="button"
          onClick={onActivate}
          className="relative flex h-full w-full items-center justify-center focus:outline-none"
          style={{ minHeight: "4rem" }}
        >
          {/* Index — absolute top-left, never shifts the name */}
          <span
            className="absolute left-1.5 top-1.5 font-display tabular-nums text-[8px] leading-none transition-colors"
            style={{ color: isActive ? "var(--color-gold)" : "var(--color-muted-foreground)" }}
          >
            {String(index + 1).padStart(2, "0")}
          </span>

          {/* Name — true centre of the cell */}
          <motion.span
            className="font-display block w-full truncate px-3 text-center text-[12px] leading-none tracking-wide"
            animate={{
              color: isActive ? "var(--color-foreground)" : "var(--color-muted-foreground)",
              scale: isActive ? 1.05 : 1,
            }}
            transition={{ duration: 0.35, ease: "easeOut" }}
          >
            {firstName}
          </motion.span>
        </button>

        {/* Active gold underline */}
        <motion.span
          aria-hidden
          className="absolute bottom-0 left-0 h-[2px] w-full"
          style={{ background: "var(--color-gold)" }}
          initial={false}
          animate={{ scaleX: isActive ? 1 : 0, transformOrigin: "left" }}
          transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
        />
      </motion.li>
    );
  }

  // ── Default list variant (desktop sidebar + sm sidebar) ───────────────────
  return (
    <motion.li
      ref={ref}
      className="sp-cast-row group relative cursor-pointer border-b border-border/60"
      onMouseMove={handleMove}
      onMouseEnter={onActivate}
      onMouseLeave={() => mx.set(0)}
      onFocus={onActivate}
      tabIndex={0}
      style={{ x: compact ? 0 : tx }}
    >
      <button
        type="button"
        onClick={onActivate}
        className={`flex w-full items-center justify-between gap-3 text-left ${
          compact ? "py-2.5" : "py-4 gap-4 md:py-5"
        }`}
      >
        <div className="flex items-baseline gap-2 sm:gap-4">
          <span
            className={`font-display tabular-nums transition-colors ${compact ? "text-xs" : "text-sm"}`}
            style={{ color: isActive ? "var(--color-gold)" : "var(--color-muted-foreground)" }}
          >
            {String(index + 1).padStart(2, "0")}
          </span>
          <div>
            <motion.span
              className={`font-display block leading-tight ${
                compact ? "text-base sm:text-lg" : "text-2xl md:text-3xl"
              }`}
              animate={{
                x: isActive ? 4 : 0,
                color: isActive ? "var(--color-foreground)" : "var(--color-muted-foreground)",
              }}
              transition={{ duration: 0.4, ease: "easeOut" }}
            >
              {member.name}
            </motion.span>
            <span className={`hairline mt-0.5 block text-muted-foreground ${compact ? "text-[10px]" : "mt-1"}`}>
              {member.role}
            </span>
          </div>
        </div>
      </button>
      <motion.span
        aria-hidden
        className="absolute bottom-0 left-0 h-px"
        style={{ background: "var(--color-gold)" }}
        initial={false}
        animate={{ width: isActive ? "100%" : "0%" }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      />
    </motion.li>
  );
}

function MetaCompact({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-0.5 px-2 py-2">
      <dt className="hairline text-[9px] uppercase tracking-widest text-muted-foreground">{label}</dt>
      <dd className="font-display text-sm leading-none" style={{ color: "var(--color-gold-soft)" }}>
        {value}
      </dd>
    </div>
  );
}

function Meta({ label, value }: { label: string; value: string }) {
  return (
    <div className="sp-meta flex items-baseline justify-between border-b border-border/60 pb-3">
      <dt className="hairline text-muted-foreground">{label}</dt>
      <dd className="font-display text-lg" style={{ color: "var(--color-gold-soft)" }}>
        {value}
      </dd>
    </div>
  );
}

function Portrait({ member }: { member: TeamMember }) {
  const [errored, setErrored] = useState(false);
  const initials = member.name.split(" ").map((p) => p[0]).slice(0, 2).join("");

  if (errored) {
    return (
      <div
        className="flex h-full w-full items-center justify-center"
        style={{ background: "linear-gradient(135deg, oklch(0.26 0 0), oklch(0.13 0 0))" }}
      >
        <span className="font-display text-5xl sm:text-7xl" style={{ color: "var(--color-gold)" }}>
          {initials}
        </span>
      </div>
    );
  }

  return (
    <img
      src={member.image}
      alt={`${member.name} — ${member.role}`}
      onError={() => setErrored(true)}
      className="h-full w-full object-cover"
      loading="lazy"
    />
  );
}

function Corner({ className = "" }: { className?: string }) {
  return (
    <span
      aria-hidden
      className={`pointer-events-none absolute h-2.5 w-2.5 sm:h-3 sm:w-3 ${className}`}
      style={{ borderTop: "1px solid var(--color-gold)", borderLeft: "1px solid var(--color-gold)" }}
    />
  );
}

function FilmGrain() {
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-0 z-1 opacity-[0.05] mix-blend-overlay"
      style={{
        backgroundImage:
          "radial-gradient(rgba(255,255,255,0.6) 1px, transparent 1px), radial-gradient(rgba(255,255,255,0.4) 1px, transparent 1px)",
        backgroundSize: "3px 3px, 5px 5px",
        backgroundPosition: "0 0, 1px 2px",
      }}
    />
  );
}