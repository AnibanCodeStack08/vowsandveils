import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform } from "framer-motion";
import { useNavigate } from "react-router-dom";
import gsap from "gsap";

const santanu = "/images/profile/profile.jpg";
const subhankar = "/images/team/subhankar.jpg";
const ujjwal = "/images/team/ujjwal.jpg";
const asmita = "/images/team/asmita.jpg";
const rony = "/images/team/rony.jpg";
const sajal = "/images/team/sajal.jpg";

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
  { name: "Asmita Moulik",   role: "Video Editor",         image: asmita,    quote: "The cut is where feeling lives." },
  { name: "Rony Roy",        role: "Cinematographer",      image: rony,      quote: "Compose, then disappear." },
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
  const [paused, setPaused] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (paused) return;
    const id = window.setInterval(() => {
      setActive((a) => (a + 1) % members.length);
    }, 4200);
    return () => window.clearInterval(id);
  }, [paused, members.length]);

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
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
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

      <div className="mx-auto max-w-7xl px-6 py-16 md:px-10 md:py-24">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-12 md:gap-10">
          <div className="md:col-span-8">
            <p className="sp-eyebrow hairline" style={{ color: "var(--color-gold)" }}>
              — {eyebrow}
            </p>
            <h2 id="team-heading" className="sp-title font-display mt-5 text-balance text-5xl leading-[1.02] md:text-7xl">
              {title}
            </h2>
            <div className="sp-rule gold-line mt-6 w-40" />
            <p className="sp-desc mt-5 max-w-xl text-base text-muted-foreground md:text-lg">{description}</p>
          </div>
          <aside className="md:col-span-4 md:pt-3">
            <dl className="grid grid-cols-2 gap-x-6 gap-y-4 text-sm md:grid-cols-1">
              <Meta label="Cast" value={String(members.length).padStart(2, "0")} />
              <Meta label="Reel" value="2026 · 35mm" />
              <Meta label="Now" value={`#${String(active + 1).padStart(2, "0")} ${member.name.split(" ")[0]}`} />
            </dl>
          </aside>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-8 md:mt-16 md:grid-cols-12 md:gap-10">
          <div className="sp-stage relative md:col-span-8">
            <div
              className="relative mx-auto w-full max-w-md h-125 overflow-hidden rounded-md bg-card md:max-w-lg"
              style={{ boxShadow: "0 40px 100px -40px color-mix(in oklab, var(--color-gold) 25%, transparent)" }}
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

              <Corner className="left-3 top-3" />
              <Corner className="right-3 top-3 rotate-90" />
              <Corner className="bottom-3 left-3 -rotate-90" />
              <Corner className="bottom-3 right-3 rotate-180" />
            </div>

            {/* Caption */}
            <div className="mx-auto mt-6 max-w-md text-center md:max-w-lg md:mt-8">
              <div className="overflow-hidden">
                <AnimatePresence mode="wait">
                  <motion.h3
                    key={member.name}
                    initial={{ y: "100%" }}
                    animate={{ y: 0 }}
                    exit={{ y: "-100%" }}
                    transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                    className="font-display text-balance text-4xl leading-none md:text-6xl"
                  >
                    {member.name}
                  </motion.h3>
                </AnimatePresence>
              </div>
              <div className="mt-3 flex flex-col items-center gap-3">
                <AnimatePresence mode="wait">
                  <motion.span
                    key={member.role + active}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.45, delay: 0.15 }}
                    className="hairline"
                    style={{ color: "var(--color-gold)" }}
                  >
                    {member.role}
                  </motion.span>
                </AnimatePresence>
                <span aria-hidden className="h-px w-10" style={{ background: "var(--color-gold)" }} />
                {member.quote && (
                  <AnimatePresence mode="wait">
                    <motion.p
                      key={member.quote + active}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.5, delay: 0.25 }}
                      className="font-display max-w-sm text-base italic text-foreground/85 md:text-xl"
                    >
                      "{member.quote}"
                    </motion.p>
                  </AnimatePresence>
                )}
              </div>
            </div>

            {/* Progress bars */}
            <div className="mt-5 flex items-center gap-2">
              {members.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setActive(i)}
                  aria-label={`Show ${members[i].name}`}
                  className="relative h-1 flex-1 overflow-hidden rounded-full"
                  style={{ background: "var(--color-border)" }}
                >
                  <motion.span
                    className="absolute inset-y-0 left-0 block"
                    style={{ background: "var(--color-gold)" }}
                    initial={false}
                    animate={{ width: i < active ? "100%" : i === active ? (paused ? "30%" : "100%") : "0%" }}
                    transition={{
                      duration: i === active && !paused ? 4.2 : 0.4,
                      ease: i === active && !paused ? "linear" : "easeOut",
                    }}
                  />
                </button>
              ))}
            </div>

            {/* CTA Button */}
            <div className="sp-cta mx-auto mt-10 max-w-md flex justify-center md:max-w-lg">
              <CtaButton onClick={() => navigate("/team-about")} />
            </div>
          </div>

          <ol className="md:col-span-4">
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
    <motion.button
      type="button"
      onClick={onClick}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={handleMouseLeave}
      className="group relative overflow-hidden border px-8 py-4 transition-colors duration-300 focus:outline-none"
      aria-label="Meet the full atelier"
      style={{
        x: translateX,
        y: translateY,
        borderColor: "var(--color-gold)",
        color: hovered ? "var(--color-background)" : "var(--color-foreground)",
      }}
    >
      {/* Sliding gold fill */}
      <motion.span
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{ background: "var(--color-gold)" }}
        initial={false}
        animate={{ y: hovered ? "0%" : "101%" }}
        transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
      />

      {/* Shimmer sweep */}
      <motion.span
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.18) 50%, transparent 60%)",
          backgroundSize: "200% 100%",
        }}
        animate={hovered ? { backgroundPosition: ["200% 0", "-200% 0"] } : { backgroundPosition: "200% 0" }}
        transition={{ duration: 0.7, ease: "easeInOut" }}
      />

      <span className="relative z-10 flex items-center gap-3">
        <span className="hairline tracking-widest text-sm uppercase">Meet the full Atelier</span>
        <motion.span
          aria-hidden
          className="font-display text-xl leading-none"
          animate={{ x: hovered ? 4 : 0 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
        >
          →
        </motion.span>
      </span>

      {/* Gold corner accents that grow on hover */}
      {(["left-0 top-0", "right-0 top-0 rotate-90", "left-0 bottom-0 -rotate-90", "right-0 bottom-0 rotate-180"] as const).map(
        (cls, i) => (
          <motion.span
            key={i}
            aria-hidden
            className={`pointer-events-none absolute h-2.5 w-2.5 ${cls}`}
            style={{ borderTop: "1px solid var(--color-gold)", borderLeft: "1px solid var(--color-gold)" }}
            animate={{ opacity: hovered ? 1 : 0.4, scale: hovered ? 1.3 : 1 }}
            transition={{ duration: 0.3 }}
          />
        ),
      )}
    </motion.button>
  );
}

/* ─── Supporting components ──────────────────────────────────────────────── */

function CastRow({
  member,
  index,
  isActive,
  onActivate,
}: {
  member: TeamMember;
  index: number;
  isActive: boolean;
  onActivate: () => void;
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

  return (
    <motion.li
      ref={ref}
      className="sp-cast-row group relative cursor-pointer border-b border-border/60"
      onMouseMove={handleMove}
      onMouseEnter={onActivate}
      onMouseLeave={() => mx.set(0)}
      onFocus={onActivate}
      tabIndex={0}
      style={{ x: tx }}
    >
      <button
        type="button"
        onClick={onActivate}
        className="flex w-full items-center justify-between gap-4 py-4 text-left md:py-5"
      >
        <div className="flex items-baseline gap-4">
          <span
            className="font-display text-sm tabular-nums transition-colors"
            style={{ color: isActive ? "var(--color-gold)" : "var(--color-muted-foreground)" }}
          >
            {String(index + 1).padStart(2, "0")}
          </span>
          <div>
            <motion.span
              className="font-display block text-2xl leading-tight md:text-3xl"
              animate={{
                x: isActive ? 6 : 0,
                color: isActive ? "var(--color-foreground)" : "var(--color-muted-foreground)",
              }}
              transition={{ duration: 0.4, ease: "easeOut" }}
            >
              {member.name}
            </motion.span>
            <span className="hairline mt-1 block text-muted-foreground">{member.role}</span>
          </div>
        </div>
        <motion.span
          aria-hidden
          className="font-display text-2xl"
          style={{ color: "var(--color-gold)" }}
          animate={{ x: isActive ? 0 : -8, opacity: isActive ? 1 : 0 }}
          transition={{ duration: 0.35 }}
        >
          →
        </motion.span>
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
        <span className="font-display text-7xl" style={{ color: "var(--color-gold)" }}>
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
      className={`pointer-events-none absolute h-3 w-3 ${className}`}
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