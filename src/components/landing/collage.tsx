import { motion, useInView, type Variants } from "framer-motion";
import { useRef } from "react";

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

const containerVariants: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.06,
    },
  },
};

const tileVariants: Variants = {
  hidden: { opacity: 0, scale: 0.92 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.7, ease: "easeOut" },
  },
};

const Collage = () => {
  const gridRef = useRef(null);
  const isInView = useInView(gridRef, { once: true, margin: "-80px" });

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
      {/* Heading */}
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.9, ease: "easeOut" }}
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

      {/* Collage */}
      <motion.div
        ref={gridRef}
        className="grid grid-cols-3 md:grid-cols-5 w-full"  // 👈 only change
        style={{ gap: 0 }}
        variants={containerVariants}
        initial="hidden"
        animate={isInView ? "visible" : "hidden"}
      >
        {tiles.map((src, i) => (
          <motion.div
            key={i}
            variants={tileVariants}
            className="relative overflow-hidden bg-card group"
            style={{
              aspectRatio: "4/5",
              willChange: "transform",
            }}
          >
            <img
              src={src ?? logo}
              alt={src ? "" : "Logo"}
              loading="lazy"
              className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
              style={{ display: "block" }}
            />
          </motion.div>
        ))}
      </motion.div>

      {/* Closing line */}
      <motion.p
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, delay: 0.2 }}
        className="font-display italic text-2xl md:text-3xl text-center text-foreground/80 mt-14 md:mt-20 max-w-2xl mx-auto leading-snug px-4 md:px-8"
      >
        "Some stories are told in words. Ours, in light."
      </motion.p>
    </section>
  );
};

export default Collage;