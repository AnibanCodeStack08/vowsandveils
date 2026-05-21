import "./App.css";
import { useEffect, Suspense, lazy } from "react";
import Lenis from "lenis";

const Hero       = lazy(() => import("./components/landing/hero"));
const About      = lazy(() => import("./components/landing/about"));
const Flimreel   = lazy(() => import("./components/landing/flimreel"));
const Section    = lazy(() => import("./components/landing/section"));
const Collage    = lazy(() => import("./components/landing/collage"));
const Testimonial= lazy(() => import("./components/landing/testimonial"));
const Team       = lazy(() => import("./components/landing/team"));
const Video      = lazy(() => import("./components/landing/video"));
// import Hero from "./components/landing/hero";
// import About from "./components/landing/about";
// import Flimreel from "./components/landing/flimreel";
// import Section from "./components/landing/section";
// import Collage from "./components/landing/collage";
// import Testimonial from "./components/landing/testimonial";
// import Team from "./components/landing/team";
// import Video from "./components/landing/video";


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
    <>
    <Suspense fallback={
    <div className="min-h-screen flex flex-col gap-3 items-center justify-center bg-black">
      <div className="w-10 h-10 rounded-full border-4 border-white/20 border-t-white animate-spin" />
      <p className="text-white/60 text-sm tracking-widest uppercase">Loading</p></div>}>
          <Hero />
      <Collage />
      <Section />
      <About />
      <Flimreel />
      <Video />
      <Team />
      <Testimonial />
    </Suspense>
    </>
  );
}

export default App;