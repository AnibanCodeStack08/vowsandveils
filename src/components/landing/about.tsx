
import { motion } from "framer-motion";

const profile = "images/profile/profile.jpg";

const About = () => {
  const stats = [
    { n: "10+", l: "Years Behind the Lens" },
    { n: "180+", l: "Weddings Documented" },
    { n: "32", l: "Cities Travelled" },
    { n: "100%", l: "Stories, Never Templates" },
  ];

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
          className="relative aspect-[3/4] overflow-hidden"
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
          <h2 className="font-display text-5xl md:text-6xl mt-4 leading-[1]">
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
            Based in Kolkata. Available worldwide. Trusted by couples who want
            their day remembered the way it actually <em>felt</em>.
          </p>

          <div className="mt-10 grid grid-cols-2 sm:grid-cols-4 gap-px bg-border">
            {stats.map((s) => (
              <div key={s.l} className="bg-background p-5">
                <p className="font-display text-3xl text-accent">{s.n}</p>
                <p className="hairline text-muted-foreground mt-2 text-[0.6rem]">
                  {s.l}
                </p>
              </div>
            ))}
          </div>

          <p className="font-display italic text-3xl mt-10 text-foreground/80">
            ~ Santanu
          </p>
        </div>
      </div>
    </section>
  );
};

export default About;