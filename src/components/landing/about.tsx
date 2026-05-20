import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";

const profile = "images/profile/profile.jpg";

// --- Count-up hook ---
function useCountUp(target: number, duration = 1800, delay = 0, active = false) {
  const [value, setValue] = useState(0);

  useEffect(() => {
    if (!active) return;
    let start: number | null = null;
    let raf: number;

    const easeOutQuart = (t: number) => 1 - Math.pow(1 - t, 4);

    const timeout = setTimeout(() => {
      const step = (ts: number) => {
        if (!start) start = ts;
        const progress = Math.min((ts - start) / duration, 1);
        setValue(Math.round(easeOutQuart(progress) * target));
        if (progress < 1) raf = requestAnimationFrame(step);
      };
      raf = requestAnimationFrame(step);
    }, delay);

    return () => {
      clearTimeout(timeout);
      cancelAnimationFrame(raf);
    };
  }, [active, target, duration, delay]);

  return value;
}

// --- Individual animated stat ---
function AnimatedStat({
  n,
  l,
  index,
  active,
}: {
  n: string;
  l: string;
  index: number;
  active: boolean;
}) {
  // Parse numeric part and suffix (e.g. "150+" → 150, "+")
  const match = n.match(/^(\d+)(.*)$/);
  const target = match ? parseInt(match[1]) : 0;
  const suffix = match ? match[2] : n;

  const count = useCountUp(target, 1800, index * 160, active);

  return (
    <div className="bg-background p-5">
      <p className="font-display text-3xl" style={{ color: "#c9a84c" }}>
        {count}
        {suffix}
      </p>
      <p className="hairline text-muted-foreground mt-2 text-[0.6rem]">{l}</p>
    </div>
  );
}

const About = () => {
  const stats = [
    { n: "7+", l: "Years Behind the Lens" },
    { n: "150+", l: "Weddings Documented" },
    { n: "25", l: "Cities Travelled" },
    { n: "100%", l: "Stories, Never Templates" },
  ];

  // Trigger animation when grid enters viewport
  const gridRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(false);

  useEffect(() => {
    const el = gridRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setActive(true);
          observer.disconnect();
        }
      },
      { threshold: 0.3 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      id="about"
      className="relative py-24 md:py-32 px-6 md:px-10 bg-background"
    >
      <div className="mx-auto max-w-6xl grid md:grid-cols-2 gap-12 md:gap-16 items-center">
        {/* portrait left */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.9 }}
          className="relative aspect-3/4 overflow-hidden"
        >
          <img
            src={profile}
            alt="Santanu Das"
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 ring-1 ring-accent/30" />
        </motion.div>

        {/* text right */}
        <div>
          <span className="hairline text-accent">The Photographer</span>
          <h2 className="font-display text-5xl md:text-6xl mt-4 leading-none">
            Santanu Das
          </h2>
          <p className="font-display italic text-2xl text-accent mt-3">
            — a quiet eye for loud love.
          </p>
          <div className="gold-line w-24 my-6" />

          <p className="text-muted-foreground leading-relaxed">
            For nearly a decade, Santanu has chased the light across mountains,
            mandaps and quiet morning rooms — translating fleeting glances into
            heirlooms. His work is rooted in patience: he waits for the laugh
            after the photo, the breath before the vow, the second when
            everything finally softens.
          </p>

          <p className="text-muted-foreground leading-relaxed mt-4">
            Based in Jalpaiguri. Available worldwide. Trusted by couples who want
            their day remembered the way it actually <em>felt</em>.
          </p>

          {/* ✦ Animated stats grid */}
          <div
            ref={gridRef}
            className="mt-10 grid grid-cols-2 sm:grid-cols-4 gap-px bg-border"
          >
            {stats.map((s, i) => (
              <AnimatedStat key={s.l} n={s.n} l={s.l} index={i} active={active} />
            ))}
          </div>

          <p className="font-display italic text-3xl mt-10 text-foreground/80">
            ~ Santanu Das
          </p>
        </div>
      </div>
    </section>
  );
};

export default About;