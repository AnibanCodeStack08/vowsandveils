import { motion, type Variants } from "framer-motion";

const g1 = "/images/collage/img1.jpg";
const g2 = "/images/collage/img2.jpeg";
const g3 = "/images/collage/img3.jpg";
const g4 = "/images/collage/img4.jpg";
const g5 = "/images/collage/img5.jpeg";

const g6 = "/images/collage/img6.jpeg";
const g7 = "/images/collage/img7.jpg";
const g8 = "/images/collage/img8.jpg";
const g9 = "/images/collage/img9.jpeg";
const g10 = "/images/collage/img10.jpg";

const g11 = "/images/collage/img11.jpg";
const g12 = "/images/collage/img12.jpg";
const g13 = "/images/collage/img13.jpeg";
const g14 = "/images/collage/img14.jpeg";

const logo = "/images/collage/logo.jpeg";

// ─── Variants ────────────────────────────────────────────────────────────────
// Opacity-only fade: no scale/translate means zero layout thrashing,
// the compositor handles it entirely on the GPU.
const containerVariants: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.045, // slightly tighter — less wall-clock time animating
    },
  },
};

const tileVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: 0.55, ease: "easeOut" },
  },
};

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } },
};

// ─── Component ───────────────────────────────────────────────────────────────
const Collage = () => {
  const tiles = [
    g1, g2, g3, g4, g5,
    g6, g7, null, g8, g9,
    g10, g11, g12, g13, g14,
  ];

  return (
    <section
      id="why-us"
      className="bg-background py-24 md:py-32 overflow-x-hidden"
    >
      {/* ── Heading ── */}
      {/*
        Use whileInView directly — avoids the useRef+useInView pattern that
        fires a JS callback on every scroll event.
      */}
      <motion.div
        variants={fadeUp}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-80px" }}
        className="text-center max-w-3xl mx-auto mb-14 md:mb-20 px-4 md:px-8"
      >
        <span className="hairline text-accent">A Wall of Forevers</span>

        <h2 className="font-display text-4xl md:text-6xl mt-4 leading-[1.05] text-balance">
          Fifteen frames,{" "}
          <span className="italic text-accent">a hundred heartbeats.</span>
        </h2>

        <div className="gold-line w-24 mx-auto my-6" />

        <p className="text-muted-foreground leading-relaxed text-balance">
          A mosaic stitched from haldi mornings, candlelit vows, and stolen
          in-between glances — each square a chapter, together one unrepeatable
          love letter.
        </p>
      </motion.div>

      {/* ── Collage Grid ── */}
      {/*
        Key perf changes vs the original:
        1. whileInView replaces animate={isInView} — no JS on every scroll tick.
        2. Opacity-only tile animation — scale was forcing the browser to
           repaint all 15 tiles simultaneously, causing frame drops.
        3. will-change: transform on the *container* (not tiles) — promotes
           the whole grid to its own compositor layer up-front.
        4. contain: "layout paint" on every tile — isolates repaints so a
           change in one cell never triggers a full-grid repaint.
        5. Hover scale stays (it's a user gesture, not scroll) but lives on
           the img element so only one layer is promoted, not the whole grid.
      */}
      <motion.div
        className="grid grid-cols-3 md:grid-cols-5 w-full"
        style={{ gap: 0, willChange: "transform" }}
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-80px" }}
      >
        {tiles.map((src, i) => (
          <motion.div
            key={i}
            variants={tileVariants}
            className="relative overflow-hidden bg-card"
            style={{
              aspectRatio: "4/5",
              // Isolates repaints to this cell only
              contain: "layout paint",
            }}
          >
            <img
              src={src ?? logo}
              alt={src ? "" : "Logo"}
              loading={i < 5 ? "eager" : "lazy"}
              fetchPriority={i === 0 ? "high" : "auto"}
              decoding="async"
              width={400}
              height={500}
              /*
                will-change is set here permanently (not just on hover).
                This pre-promotes the image to its own GPU layer so the
                hover scale never causes a mid-interaction layer promotion
                jank spike. The cost is slightly more VRAM, which is
                acceptable for a fixed 15-image grid.
              */
              style={{
                display: "block",
                position: "absolute",
                inset: 0,
                height: "100%",
                width: "100%",
                objectFit: "cover",
                willChange: "transform",
                transition: "transform 600ms cubic-bezier(0.25, 0.46, 0.45, 0.94)",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLImageElement).style.transform = "scale(1.06)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLImageElement).style.transform = "scale(1)";
              }}
            />
          </motion.div>
        ))}
      </motion.div>

      {/* ── Closing line ── */}
      <motion.p
        variants={fadeUp}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        className="font-display italic text-2xl md:text-3xl text-center text-foreground/80 mt-14 md:mt-20 max-w-2xl mx-auto leading-snug px-4 md:px-8"
      >
        "Some stories are told in words. Ours, in light."
      </motion.p>
    </section>
  );
};

export default Collage;