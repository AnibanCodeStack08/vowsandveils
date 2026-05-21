import "./App.css";
import { useEffect, lazy, Suspense } from "react";
import Lenis from "lenis";

// Lazy Loaded Components
const Hero = lazy(() => import("./components/landing/hero"));
const About = lazy(() => import("./components/landing/about"));
const Flimreel = lazy(() => import("./components/landing/flimreel"));
const Section = lazy(() => import("./components/landing/section"));
const Collage = lazy(() => import("./components/landing/collage"));
const Testimonial = lazy(() => import("./components/landing/testimonial"));
const Team = lazy(() => import("./components/landing/team"));
const Video = lazy(() => import("./components/landing/video"));

function App() {
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      smoothWheel: true,
    });

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
    <Suspense
      fallback={
        <div className="w-full h-screen flex items-center justify-center bg-black text-white text-xl">
          Loading...
        </div>
      }
    >
      <Hero />
      <Collage />
      <Section />
      <About />
      <Flimreel />
      <Video />
      <Team />
      <Testimonial />
    </Suspense>
  );
}

export default App;