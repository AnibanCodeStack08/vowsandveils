import {
  BrowserRouter,
  Routes,
  Route,
  Outlet,
  useLocation,
} from "react-router-dom";

import { useEffect } from "react";

import App from "./App";

import VideoGallery from "./components/pages/video-gallery.tsx";
import TeamAboutPage from "./components/pages/team-about.tsx";
import Adhibash from "./components/pages/adhibash.tsx";
import Haldi from "./components/pages/haldi.tsx";
import Engagement from "./components/pages/engagement.tsx";
import PreWedding from "./components/pages/prewedding.tsx";
import Wedding from "./components/pages/wedding.tsx";

import { Header } from "./components/layout/header";
import Footer from "./components/layout/footer";
import Contact from "./components/pages/contact.tsx";
import Baby from "./components/pages/baby.tsx";

function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: "instant",
    });
  }, [pathname]);

  return null;
}

/* Shared Layout */
function Layout() {
  return (
    <>
      <Header />

      {/* Page Content */}
      <Outlet />

      <Footer />
    </>
  );
}

export default function Router() {
  return (
    <BrowserRouter>
      <ScrollToTop />

      <Routes>
        {/* All routes inside this will use Header + Footer */}
        <Route element={<Layout />}>
          <Route path="/" element={<App />} />

          <Route path="/videos" element={<VideoGallery />} />

          <Route
            path="/team-about"
            element={<TeamAboutPage />}
          />

          <Route
            path="/adhibash-gallery"
            element={<Adhibash />}
          />

          <Route
            path="/haldi-gallery"
            element={<Haldi />}
          />

          <Route
            path="/engagement-gallery"
            element={<Engagement />}
          />

          <Route
            path="/pre-wedding-gallery"
            element={<PreWedding />}
          />

          <Route
            path="/wedding-gallery"
            element={<Wedding />}
          />
          <Route 
            path="/contact" 
            element={<Contact />} />
          <Route 
            path="/baby-shoot-gallery" 
            element={<Baby />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}