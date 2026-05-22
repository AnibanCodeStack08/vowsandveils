import { useLayoutEffect, useRef, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { useNavigate } from "react-router-dom";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

const santanu = "/images/profile/profile.jpg";
const subhankar = "/images/team/subhankar.jpg";
const ujjwal = "/images/team/ujjwal.jpg";
const asmita = "/images/team/asmita.jpg";
const rony = "/images/team/rony.jpg";
const sajal = "/images/team/sajal.jpg";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

interface MemberDetail {
  name: string;
  role: string;
  image: string;
  years: string;
  based: string;
  specialties: string[];
  bio: string;
  philosophy: string;
  signature: string;
  testimonial?: { quote: string; author: string };
}

const MEMBERS: MemberDetail[] = [
  {
    name: "Santanu Das",
    role: "Founder & Creative Director",
    image: santanu,
    years: "8 yrs",
    based: "Jalpaiguri, IN",
    specialties: ["Creative Direction", "Editorial Portraits", "Brand Vision"],
    bio: "Santanu founded Vows&Veils on a single belief — that a wedding is a piece of literature, not a checklist. He directs every shoot like a chapter of your story, choosing the light, the pace and the silences with the same care a novelist gives to a sentence.",
    philosophy: "Frames are memory's grammar. Punctuate them gently.",
    signature: "Hand-curates every couple's final reel before delivery.",
  },
  {
    name: "Subhankar Dutta",
    role: "Lead Photographer",
    image: subhankar,
    years: "11 yrs",
    based: "Kolkata, IN",
    specialties: ["Natural Light", "Candid Portraits", "Heritage Venues"],
    bio: "Subhankar reads light the way musicians read a score. From the gold of a haldi morning to the candlelit hush of a vidaai, he composes frames that feel inevitable — as if the moment was always meant to look this way.",
    philosophy: "Light first. Always light.",
    signature: "Shoots an intimate first-look series for every couple, gifted as a private folio.",
  },
  {
    name: "Ujjwal Biswas",
    role: "Lead Cinematographer",
    image: ujjwal,
    years: "9 yrs",
    based: "Mumbai, IN",
    specialties: [
      "Cinematic Films",
      "Stories in Motion.",
      "Long-Form Wedding Cinema",
    ],
    bio: "Ujjwal believes a wedding film should breathe. He moves like a guest who never interrupts, capturing glances and gestures most people would miss — then weaves them into films that play like quiet, beautiful cinema.",
    philosophy: "A film is a held breath. Release it slowly.",
    signature: "Personally directs the highlight film score with our composer collaborators.",
  },
  {
    name: "Rony Roy",
    role: "Cinematographer",
    image: rony,
    years: "6 yrs",
    based: "Kolkata, IN",
    specialties: ["Gimbal Choreography", "Drone & Aerial", "Reception Coverage"],
    bio: "Rony moves through a room without disturbing it. His coverage gives our films their texture — the laugh at table four, the cousin dancing with his shoes off, the quiet hand-squeeze before the vows.",
    philosophy: "Compose, then disappear.",
    signature: "Pre-walks every venue at golden hour to plan his angles.",
  },
  {
    name: "Asmita Moulik",
    role: "Video Editor",
    image: asmita,
    years: "7 yrs",
    based: "Kolkata, IN",
    specialties: ["Story Edit", "Color Grading", "Sound Design"],
    bio: "Asmita lives in the cut. She listens to hours of footage the way one listens to old letters — patient, attentive, looking for the line that holds everything together. The pacing of our films is hers.",
    philosophy: "The cut is where feeling lives.",
    signature: "Crafts a custom 60-second teaser within seven days of every wedding.",
  },
  {
    name: "Sajal Biswas",
    role: "Photo Editor",
    image: sajal,
    years: "8 yrs",
    based: "Kolkata, IN",
    specialties: ["Color Science", "Skin Tone Mastery", "Album Design"],
    bio: "Sajal is our quiet alchemist. Every photograph passes through his hands before it reaches yours — warmed, balanced, unified into a single visual voice that feels timeless rather than trendy.",
    philosophy: "Color is the second exposure.",
    signature: "Hand-finishes every printed album with archival-grade calibration.",
  },
];

export default function TeamAboutPage() {
  const rootRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  useLayoutEffect(() => {
    if (!rootRef.current) return;
    const ctx = gsap.context(() => {
      gsap
        .timeline({ defaults: { ease: "power3.out" } })
        .from(".ta-eyebrow", { opacity: 0, y: 14, duration: 0.7 })
        .from(".ta-title", { opacity: 0, y: 28, duration: 0.9 }, "-=0.4")
        .from(".ta-rule", { scaleX: 0, transformOrigin: "left", duration: 1, ease: "power3.inOut" }, "-=0.5")
        .from(".ta-lede", { opacity: 0, y: 16, duration: 0.7 }, "-=0.6");

      gsap.utils.toArray<HTMLElement>(".ta-member").forEach((el) => {
        gsap.from(el, {
          opacity: 0,
          y: 60,
          duration: 1,
          ease: "power3.out",
          scrollTrigger: { trigger: el, start: "top 85%" },
        });
      });
    }, rootRef);
    return () => ctx.revert();
  }, []);

  return (
    <div ref={rootRef} className="relative min-h-screen overflow-hidden bg-background text-foreground">
      <AmbientBackdrop />
      <FilmGrain />

      <header className="relative mx-auto max-w-7xl px-6 pt-12 md:px-10 md:pt-16">
        {/* FIX: navigate(-1) — goes back through browser history instead of hardcoding "/" */}
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="hairline inline-flex items-center gap-2 text-muted-foreground transition-colors hover:text-foreground focus:outline-none"
        >
          <span aria-hidden>←</span> Back to Atelier
        </button>
      </header>

      <section className="relative mx-auto max-w-7xl px-6 pb-12 pt-10 md:px-10 md:pb-20 md:pt-16">
        <p className="ta-eyebrow hairline" style={{ color: "var(--color-gold)" }}>
          — Vows&Veils · The Atelier
        </p>
        <h1 className="ta-title font-display mt-5 text-balance text-5xl leading-[1.02] md:text-7xl lg:text-8xl">
          Meet the storytellers <br className="hidden md:block" />
          <span className="italic" style={{ color: "var(--color-gold-soft)" }}>
            of your most-told day.
          </span>
        </h1>
        <div className="ta-rule gold-line mt-8 w-48" />
        <p className="ta-lede mt-6 max-w-2xl text-base text-muted-foreground md:text-lg">
          Six artists. One quiet promise — to listen first, photograph second, and edit with the patience your
          memories deserve. Get to know the hands and eyes behind every Vows&Veils film and frame.
        </p>
      </section>

      <main className="relative mx-auto max-w-7xl px-6 pb-32 md:px-10">
        <ul className="space-y-24 md:space-y-40">
          {MEMBERS.map((m, i) => (
            <MemberSpread key={m.name} member={m} index={i} reverse={i % 2 === 1} />
          ))}
        </ul>

        <div className="mt-32 border-t border-border/60 pt-16 text-center">
          <p className="hairline" style={{ color: "var(--color-gold)" }}>
            — Begin your story
          </p>
          <h2 className="font-display mt-4 text-balance text-4xl md:text-6xl">
            Let's design the film of your wedding.
          </h2>
          {/* FIX: navigate(-1) — goes back through browser history instead of hardcoding "/" */}
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="group mt-10 inline-flex items-center gap-3 border border-border px-8 py-4 transition-colors hover:border-(--color-gold) focus:outline-none"
            style={{ color: "var(--color-foreground)" }}
          >
            <span className="hairline">Return to Atelier</span>
            <span
              aria-hidden
              className="font-display text-xl transition-transform group-hover:translate-x-1"
              style={{ color: "var(--color-gold)" }}
            >
              →
            </span>
          </button>
        </div>
      </main>
    </div>
  );
}

function MemberSpread({
  member,
  index,
  reverse,
}: {
  member: MemberDetail;
  index: number;
  reverse: boolean;
}) {
  const ref = useRef<HTMLLIElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], [40, -40]);
  const imgScale = useTransform(scrollYProgress, [0, 1], [1.08, 1]);

  const isSantanu = index === 0;

  return (
    <li
      ref={ref}
      className={`ta-member grid grid-cols-1 items-center gap-10 md:grid-cols-12 md:gap-16 ${
        reverse ? "md:[direction:rtl]" : ""
      }`}
    >
      <div className="md:col-span-6 md:[direction:ltr]">
        <motion.div
          style={{ y }}
          className="relative mx-auto aspect-3/4 w-full max-w-md overflow-hidden rounded-md bg-card"
        >
          <motion.div style={{ scale: imgScale }} className="absolute inset-0">
            <Portrait member={member} />
          </motion.div>
          <Corner className="left-3 top-3" />
          <Corner className="right-3 top-3 rotate-90" />
          <Corner className="bottom-3 left-3 -rotate-90" />
          <Corner className="bottom-3 right-3 rotate-180" />
          <div
            className="pointer-events-none absolute inset-0"
            style={{
              boxShadow: "inset 0 0 120px color-mix(in oklab, var(--color-gold) 10%, transparent)",
            }}
          />
        </motion.div>
      </div>

      <div className="md:col-span-6 md:[direction:ltr]">
        <div className="flex items-baseline gap-4">
          <span
            className="font-display text-sm tabular-nums"
            style={{ color: "var(--color-gold)" }}
          >
            {String(index + 1).padStart(2, "0")} / {String(MEMBERS.length).padStart(2, "0")}
          </span>
          <span aria-hidden className="h-px flex-1" style={{ background: "var(--color-border)" }} />
        </div>

        <h2 className="font-display mt-5 text-balance text-4xl leading-[1.02] md:text-6xl">
          {member.name}
        </h2>
        <p className="hairline mt-3" style={{ color: "var(--color-gold)" }}>
          {member.role}
        </p>

        <p className="mt-6 max-w-xl text-base leading-relaxed text-foreground/85 md:text-lg">
          {member.bio}
        </p>

        <blockquote
          className="font-display mt-6 max-w-xl border-l pl-5 text-xl italic md:text-2xl"
          style={{ borderColor: "var(--color-gold)", color: "var(--color-gold-soft)" }}
        >
          "{member.philosophy}"
        </blockquote>

        {isSantanu && (
          <dl className="mt-8 grid grid-cols-2 gap-x-6 gap-y-4 md:grid-cols-3">
            <Meta label="Experience" value={member.years} />
            <Meta label="Based" value={member.based} />
            <Meta label="Reel" value={`#${String(index + 1).padStart(2, "0")}`} />
          </dl>
        )}

        <div className="mt-8">
          <p className="hairline mb-3 text-muted-foreground">Specialties</p>
          <ul className="flex flex-wrap gap-2">
            {member.specialties.map((s) => (
              <li
                key={s}
                className="border px-3 py-1.5 text-xs tracking-wide"
                style={{ borderColor: "var(--color-border)", color: "var(--color-foreground)" }}
              >
                {s}
              </li>
            ))}
          </ul>
        </div>

        {isSantanu && (
          <div className="mt-8 flex items-start gap-3">
            <span
              aria-hidden
              className="font-display mt-1 text-2xl leading-none"
              style={{ color: "var(--color-gold)" }}
            >
              ✦
            </span>
            <p className="max-w-lg text-sm text-muted-foreground">
              <span className="hairline mr-2" style={{ color: "var(--color-gold-soft)" }}>
                Signature ritual ·
              </span>
              {member.signature}
            </p>
          </div>
        )}

        {member.testimonial && (
          <figure className="mt-10 max-w-xl border-t border-border/60 pt-6">
            <blockquote className="font-display text-lg italic md:text-xl">
              "{member.testimonial.quote}"
            </blockquote>
            <figcaption className="hairline mt-3 text-muted-foreground">
              — {member.testimonial.author}
            </figcaption>
          </figure>
        )}
      </div>
    </li>
  );
}

function Meta({ label, value }: { label: string; value: string }) {
  return (
    <div className="border-b border-border/60 pb-3">
      <dt className="hairline text-muted-foreground">{label}</dt>
      <dd className="font-display mt-1 text-lg" style={{ color: "var(--color-gold-soft)" }}>
        {value}
      </dd>
    </div>
  );
}

function Portrait({ member }: { member: MemberDetail }) {
  const [errored, setErrored] = useState(false);
  const initials = member.name
    .split(" ")
    .map((p) => p[0])
    .slice(0, 2)
    .join("");

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

function AmbientBackdrop() {
  const { scrollYProgress } = useScroll();
  const hue = useTransform(scrollYProgress, [0, 1], [0, 30]);
  const bg = useTransform(
    hue,
    (h) =>
      `radial-gradient(60% 50% at ${20 + h}% 20%, color-mix(in oklab, var(--color-gold) 10%, transparent), transparent 70%), radial-gradient(50% 60% at ${80 - h}% 80%, color-mix(in oklab, var(--color-gold-soft) 8%, transparent), transparent 70%)`,
  );
  return (
    <motion.div
      aria-hidden
      className="pointer-events-none absolute inset-0"
      style={{ background: bg }}
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