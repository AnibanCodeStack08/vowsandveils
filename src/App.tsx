import "./App.css";
import { useEffect } from "react";
import Lenis from "lenis";

import Hero from "./components/landing/hero";
import About from "./components/landing/about";
import Flimreel from "./components/landing/flimreel";
import Section from "./components/landing/section";
import Collage from "./components/landing/collage";
import Testimonial from "./components/landing/testimonial";
import Team from "./components/landing/team";
import Video from "./components/landing/video";


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
      <Hero />
      <Collage />
      <Section />
      <About />
      <Flimreel />
      <Video />
      <Team />
      <Testimonial />
    </>
  );
}

export default App;