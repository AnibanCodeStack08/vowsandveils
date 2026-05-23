import { BrowserRouter, Routes, Route, Outlet, useLocation } from "react-router-dom";
import { useEffect, lazy, Suspense } from "react";

import App from "./App";
import { Header } from "./components/layout/header";
import Footer from "./components/layout/footer";

// All page routes lazy-loaded — none of this runs on first visit to "/"
const VideoGallery   = lazy(() => import("./components/pages/video-gallery"));
const TeamAboutPage  = lazy(() => import("./components/pages/team-about"));
const Adhibash       = lazy(() => import("./components/pages/adhibash"));
const Haldi          = lazy(() => import("./components/pages/haldi"));
const Engagement     = lazy(() => import("./components/pages/engagement"));
const PreWedding     = lazy(() => import("./components/pages/prewedding"));
const Wedding        = lazy(() => import("./components/pages/wedding"));
const Contact        = lazy(() => import("./components/pages/contact"));
const Baby           = lazy(() => import("./components/pages/baby"));

const PageLoader = () => (
  <div className="min-h-screen flex flex-col gap-3 items-center justify-center bg-black">
    <div className="w-10 h-10 rounded-full border-4 border-white/20 border-t-white animate-spin" />
    <p className="text-white/60 text-sm tracking-widest uppercase">Loading</p>
  </div>
);

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
  }, [pathname]);
  return null;
}

function Layout() {
  return (
    <>
      <Header />
      <Suspense fallback={<PageLoader />}>
        <Outlet />
      </Suspense>
      <Footer />
    </>
  );
}

export default function Router() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <Routes>
        <Route element={<Layout />}>
          <Route path="/"                    element={<App />} />
          <Route path="/videos"              element={<VideoGallery />} />
          <Route path="/team-about"          element={<TeamAboutPage />} />
          <Route path="/adhibash-gallery"    element={<Adhibash />} />
          <Route path="/haldi-gallery"       element={<Haldi />} />
          <Route path="/engagement-gallery"  element={<Engagement />} />
          <Route path="/pre-wedding-gallery" element={<PreWedding />} />
          <Route path="/wedding-gallery"     element={<Wedding />} />
          <Route path="/contact"             element={<Contact />} />
          <Route path="/baby-shoot-gallery"  element={<Baby />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}