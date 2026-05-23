import "./App.css";
import { useEffect, Suspense, lazy } from "react";
import Lenis from "lenis";

// Hero is NOT lazy — it's the first thing the user sees
import Hero from "./components/landing/hero";

// Everything below the fold is lazy
const About       = lazy(() => import("./components/landing/about"));
const Flimreel    = lazy(() => import("./components/landing/flimreel"));
const Section     = lazy(() => import("./components/landing/section"));
const Collage     = lazy(() => import("./components/landing/collage"));
const Testimonial = lazy(() => import("./components/landing/testimonial"));
const Team        = lazy(() => import("./components/landing/team"));
const Video       = lazy(() => import("./components/landing/video"));

// Tiny skeleton used as each section's fallback
const SectionSkeleton = () => (
  <div className="min-h-[40vh] bg-black/30 animate-pulse" />
);

function App() {
  useEffect(() => {
    const lenis = new Lenis({ duration: 1.2, smoothWheel: true });
    let raf: number;
    const loop = (time: number) => {
      lenis.raf(time);
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => {
      cancelAnimationFrame(raf);
      lenis.destroy();
    };
  }, []);

  return (
    <>
      {/* Hero renders immediately — no Suspense needed */}
      <Hero />

      {/* Each section has its own boundary → renders as soon as its chunk loads */}
      <Suspense fallback={<SectionSkeleton />}>
        <Collage />
      </Suspense>

      <Suspense fallback={<SectionSkeleton />}>
        <Section />
      </Suspense>

      <Suspense fallback={<SectionSkeleton />}>
        <About />
      </Suspense>

      <Suspense fallback={<SectionSkeleton />}>
        <Flimreel />
      </Suspense>

      <Suspense fallback={<SectionSkeleton />}>
        <Video />
      </Suspense>

      <Suspense fallback={<SectionSkeleton />}>
        <Team />
      </Suspense>

      <Suspense fallback={<SectionSkeleton />}>
        <Testimonial />
      </Suspense>
    </>
  );
}

export default App;