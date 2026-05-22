import { useCallback, useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

// ─── Review images ────────────────────────────────────────────────────────────
const r1 = "/images/reviews/piu-saha-pathak.jpeg";
const r2 = "/images/reviews/arup-debajia.jpeg";
const r3 = "/images/reviews/aniruddha-sritama.jpeg";
const r4 = "/images/reviews/arindam-ghosh.jpeg";
const r5 = "/images/reviews/moumita-dutta.jpeg";
const r6 = "/images/reviews/srijani-bhowmik.jpeg";
const r7 = "/images/reviews/maitrayee.jpeg";
const r8 = "/images/reviews/snigdha.jpeg";
// ─────────────────────────────────────────────────────────────────────────────

type Testimonial = {
  name: string;
  context: string;
  initials: string;
  image: string;
  quote: string;
  rating: number;
};

const TESTIMONIALS: Testimonial[] = [
  {
    name: "Pia Saha Pathak",
    context: "Baby Shoot & Rice Ceremony",
    initials: "PP",
    image: r1,
    quote:
      "আমাদের মেয়ের baby shoot থেকে rice ceremony পর্যন্ত প্রতিটি মুহূর্ত এত সুন্দরভাবে ক্যাপচার করার জন্য অসংখ্য ধন্যবাদ। তোমার কাজের প্রতি একাগ্রতা ও ভালোবাসা সত্যিই অসাধারণ। আমাদের বিশেষ দিনটিকে আরও বেশি স্পেশাল করে দেওয়ার জন্য অনেক ভালোবাসা। 💝",
    rating: 5,
  },
  {
    name: "Arup & Debajia",
    context: "Wedding",
    initials: "AD",
    image: r2,
    quote:
      "Working with this amazing photography team for our wedding was truly a wonderful experience. Their professionalism, friendly nature, and attention to detail made us feel comfortable like family. The stunning photos perfectly captured the essence of our special day, making it unforgettable.",
    rating: 5,
  },
  {
    name: "Aniruddha & Shritama",
    context: "Annaprashan Ceremony",
    initials: "AS",
    image: r3,
    quote:
      "আমাদের মেয়ে সানায়ার অন্নপ্রাশনের প্রতিটি মুহূর্তকে এত সুন্দরভাবে প্রাণবন্ত করে তোলার জন্য অসংখ্য ধন্যবাদ তোমার ধৈর্য, একাগ্রতা এবং কাজের প্রতি ভালোবাসা সত্যিই প্রশংসনীয়। তোমার মতো একজন ফটোগ্রাফার আমাদের বিশেষ দিনটিকে আরও স্মরণীয় করে তুলেছে। 😊💖",
    rating: 5,
  },
  {
    name: "Arindam Ghosh",
    context: "Event Photography",
    initials: "AG",
    image: r4,
    quote:
      "Excellent technical skills, creative vision, and true professionalism made the entire experience outstanding. Great communication and client satisfaction with real value for money.",
    rating: 5,
  },
  {
    name: "Moumita Dutta",
    context: "Family Portrait",
    initials: "MD",
    image: r5,
    quote:
      "Your photography brought a big smile to me and my daughter's face, and we were truly spellbound after seeing the album. If anyone wants their special day to be even more special, Santanu is the perfect photographer. ❤️",
    rating: 5,
  },
  {
    name: "Srijani Bhowmik",
    context: "Wedding Album",
    initials: "SB",
    image: r6,
    quote:
      "You made my special day even more memorable with your amazing photography. The photos, album, and your gentle behavior were all absolutely perfect. ❤️",
    rating: 5,
  },
  {
    name: "Maitrayee Roy Chowdhury",
    context: "Special Occasion",
    initials: "MR",
    image: r7,
    quote:
      "Really happy and satisfied with the work, dedication, and professionalism provided throughout the event. Highly recommended for future special occasions and memorable celebrations. 🫶🍀",
    rating: 5,
  },
  {
    name: "Snigdha Ray",
    context: "Engagement",
    initials: "SR",
    image: r8,
    quote:
      "Your dedication is truly top-notch, and you did an excellent job capturing our engagement beautifully. The photos turned out amazing, and we are completely satisfied with your work. 😊❤️",
    rating: 5,
  },
];

const AUTOPLAY_MS = 5500;

function Stars({ count }: { count: number }) {
  return (
    <div
      className="flex gap-1 justify-center"
      aria-label={`${count} out of 5 stars`}
    >
      {Array.from({ length: 5 }).map((_, i) => (
        <svg
          key={i}
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill={i < count ? "currentColor" : "none"}
          stroke="currentColor"
          strokeWidth="1.5"
          className="text-gold"
          aria-hidden="true"
        >
          <path d="M12 2l2.9 6.9L22 10l-5.5 4.8L18.2 22 12 18.3 5.8 22l1.7-7.2L2 10l7.1-1.1L12 2z" />
        </svg>
      ))}
    </div>
  );
}

function Avatar({ initials, image, name }: { initials: string; image: string; name: string }) {
  const [imgError, setImgError] = useState(false);

  return (
    <div className="relative h-16 w-16 shrink-0 mx-auto">
      <div className="absolute inset-0 rounded-full border border-gold/50" />
      {!imgError ? (
        <img
          src={image}
          alt={name}
          onError={() => setImgError(true)}
          className="absolute inset-0.75 rounded-full object-cover w-[calc(100%-6px)] h-[calc(100%-6px)]"
        />
      ) : (
        <div className="absolute inset-0.75 rounded-full bg-linear-to-br from-gold/30 via-card to-secondary flex items-center justify-center">
          <span
            className="font-display text-xl text-gold-soft tracking-wide"
            aria-hidden="true"
          >
            {initials}
          </span>
        </div>
      )}
    </div>
  );
}

export default function Testimonial() {
  const [index, setIndex] = useState(0);
  const [direction, setDirection] = useState<1 | -1>(1);
  const [paused, setPaused] = useState(false);
  const total = TESTIMONIALS.length;
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const go = useCallback(
    (next: number, dir: 1 | -1) => {
      setDirection(dir);
      setIndex(((next % total) + total) % total);
    },
    [total]
  );

  const next = useCallback(() => go(index + 1, 1), [go, index]);
  const prev = useCallback(() => go(index - 1, -1), [go, index]);
  const goTo = useCallback(
    (i: number) => go(i, i > index ? 1 : -1),
    [go, index]
  );

  // Autoplay — resets whenever index, paused state changes
  useEffect(() => {
    if (paused) return;
    timerRef.current = setTimeout(() => {
      setDirection(1);
      setIndex((i) => (i + 1) % total);
    }, AUTOPLAY_MS);
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [index, paused, total]);

  // Keyboard navigation
  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowRight") {
      e.preventDefault();
      next();
    } else if (e.key === "ArrowLeft") {
      e.preventDefault();
      prev();
    }
  };

  const current = TESTIMONIALS[index];

  const slideVariants = {
    enter: (dir: 1 | -1) => ({
      opacity: 0,
      x: dir === 1 ? 60 : -60,
    }),
    center: { opacity: 1, x: 0 },
    exit: (dir: 1 | -1) => ({
      opacity: 0,
      x: dir === 1 ? -60 : 60,
    }),
  };

  return (
    <section
      id="testimonials"
      className="relative bg-background py-20 md:py-28 px-4 sm:px-6 lg:px-12 overflow-hidden"
      aria-label="Client testimonials"
    >
      {/* Heading */}
      <div className="mx-auto max-w-3xl text-center mb-12 md:mb-16">
        <p className="hairline text-gold mb-5">Kind Words</p>
        <h2 className="font-display text-4xl md:text-5xl lg:text-6xl text-foreground text-balance">
          Stories from <span className="italic text-gold">cherished</span>{" "}
          moments
        </h2>
        <div className="gold-line w-32 mx-auto mt-7" />
      </div>

      {/* Carousel */}
      <div
        className="mx-auto max-w-6xl relative"
        role="region"
        aria-roledescription="carousel"
        aria-label="Testimonials carousel"
        tabIndex={0}
        onKeyDown={onKeyDown}
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
        onFocus={() => setPaused(true)}
        onBlur={() => setPaused(false)}
      >
        {/* Slide stage — fixed min-height prevents layout shift */}
        <div className="relative">
          <div
            className="relative rounded-md bg-card border border-border overflow-hidden"
            aria-live="polite"
            aria-atomic="true"
          >
            {/* corner ornaments */}
            <span
              aria-hidden="true"
              className="absolute top-4 left-4 h-4 w-4 border-t border-l border-gold/60"
            />
            <span
              aria-hidden="true"
              className="absolute top-4 right-4 h-4 w-4 border-t border-r border-gold/60"
            />
            <span
              aria-hidden="true"
              className="absolute bottom-4 left-4 h-4 w-4 border-b border-l border-gold/60"
            />
            <span
              aria-hidden="true"
              className="absolute bottom-4 right-4 h-4 w-4 border-b border-r border-gold/60"
            />

            <div className="relative px-6 py-7 sm:px-12 sm:py-9 md:px-20 md:py-10 min-h-85 sm:min-h-75 md:min-h-80 flex items-center">
              <AnimatePresence mode="wait" custom={direction}>
                <motion.article
                  key={index}
                  custom={direction}
                  variants={slideVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{
                    x: { type: "spring", stiffness: 260, damping: 30 },
                    opacity: { duration: 0.35 },
                  }}
                  className="w-full text-center"
                  aria-roledescription="slide"
                  aria-label={`${index + 1} of ${total}`}
                >
                  <p
                    className="font-display text-7xl text-gold/30 leading-none -mb-4 select-none"
                    aria-hidden="true"
                  >
                    "
                  </p>
                  <blockquote className="text-foreground/90 text-base sm:text-lg md:text-xl leading-[1.85] max-w-2xl mx-auto whitespace-pre-line">
                    {current.quote}
                  </blockquote>

                  <div className="gold-line w-24 mx-auto my-6" />

                  <Avatar
                    initials={current.initials}
                    image={current.image}
                    name={current.name}
                  />
                  <h3 className="font-display text-xl md:text-2xl text-foreground mt-4">
                    {current.name}
                  </h3>
                  <p className="hairline text-gold mt-2">{current.context}</p>
                  <div className="mt-4">
                    <Stars count={current.rating} />
                  </div>
                </motion.article>
              </AnimatePresence>
            </div>
          </div>

          {/* Prev / Next buttons */}
          <motion.button
            type="button"
            onClick={prev}
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.94 }}
            aria-label="Previous testimonial"
            className="absolute top-1/2 -translate-y-1/2 left-2 sm:-left-4 md:-left-6 h-11 w-11 md:h-12 md:w-12 rounded-full bg-card border border-gold/40 text-gold hover:bg-gold hover:text-primary-foreground hover:border-gold transition-colors flex items-center justify-center shadow-lg z-10"
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              aria-hidden="true"
            >
              <path d="M15 18l-6-6 6-6" />
            </svg>
          </motion.button>

          <motion.button
            type="button"
            onClick={next}
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.94 }}
            aria-label="Next testimonial"
            className="absolute top-1/2 -translate-y-1/2 right-2 sm:-right-4 md:-right-6 h-11 w-11 md:h-12 md:w-12 rounded-full bg-card border border-gold/40 text-gold hover:bg-gold hover:text-primary-foreground hover:border-gold transition-colors flex items-center justify-center shadow-lg z-10"
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              aria-hidden="true"
            >
              <path d="M9 6l6 6-6 6" />
            </svg>
          </motion.button>
        </div>

        {/* Dots */}
        <div
          className="mt-8 flex items-center justify-center gap-2.5"
          role="tablist"
          aria-label="Select testimonial"
        >
          {TESTIMONIALS.map((t, i) => {
            const isActive = i === index;
            return (
              <button
                key={t.name}
                type="button"
                role="tab"
                aria-selected={isActive}
                aria-label={`Go to testimonial ${i + 1}: ${t.name}`}
                onClick={() => goTo(i)}
                className="group p-2"
              >
                <span
                  className={`block h-1.5 rounded-full transition-all duration-500 ${
                    isActive
                      ? "w-8 bg-gold"
                      : "w-1.5 bg-border group-hover:bg-gold/60"
                  }`}
                />
              </button>
            );
          })}
        </div>

        {/* Counter / status */}
        <div className="mt-4 text-center">
          <p className="hairline text-muted-foreground">
            <span className="text-gold">
              {String(index + 1).padStart(2, "0")}
            </span>
            <span className="mx-2 opacity-50">/</span>
            {String(total).padStart(2, "0")}
          </p>
        </div>
      </div>
    </section>
  );
}