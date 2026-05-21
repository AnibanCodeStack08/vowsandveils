import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";

const logo = "/images/profile/header-logo.jpeg";

const leftLinks = [
  { href: "/", label: "Home" },
  { href: "#about", label: "About" },
  { href: "#work", label: "Work" },
] as const;

const rightLinks = [
  { href: "#team", label: "Team" },
  { href: "#testimonials", label: "Reviews" },
  { href: "/contact", label: "Contact" },
] as const;

const allLinks = [...leftLinks, ...rightLinks];

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();

    window.addEventListener("scroll", onScroll);

    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const goTo = (href: string) => {
    setOpen(false);

    // Normal page routes
    if (href.startsWith("/") && !href.startsWith("/#")) {
      navigate(href);
      window.scrollTo({ top: 0, behavior: "instant" });
      return;
    }

    // Scroll sections
    const scrollToSection = () => {
      const id = href.replace("#", "").replace("/#", "");
      const el = document.getElementById(id);

      if (el) {
        el.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }
    };

    // If not on homepage, first go home then scroll
    if (location.pathname !== "/") {
      navigate("/");

      setTimeout(() => {
        scrollToSection();
      }, 300);
    } else {
      scrollToSection();
    }
  };

  const openWhatsApp = () => {
    window.open(
      "https://wa.me/8670696443",
      "_blank",
      "noopener,noreferrer"
    );
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? "bg-black/70 backdrop-blur-md border-b border-white/10"
          : "bg-linear-to-b from-black/60 to-transparent"
      }`}
    >
      {/*
        Desktop layout: 3-column grid
          col-1: invisible spacer — exact same width as the CTA (col-3)
          col-2: nav (left-links + logo + right-links) — truly centered in full header
          col-3: Get In Touch CTA
        Using `grid-cols-[1fr_auto_1fr]` so col-1 and col-3 are equal width,
        forcing col-2 (the nav) to sit dead-center.
      */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 md:px-10 h-20 md:h-24 hidden md:grid md:grid-cols-[1fr_auto_1fr] items-center">

        {/* Col 1 — invisible spacer, mirrors CTA column */}
        <div aria-hidden="true" />

        {/* Col 2 — nav: left links + logo + right links, centered */}
        <div className="flex items-center justify-center gap-6 lg:gap-8">
          {/* Left links */}
          {leftLinks.map((link) => (
            <button
              key={link.label}
              onClick={() => goTo(link.href)}
              className="text-[0.7rem] tracking-[0.32em] uppercase text-white/80 hover:text-accent transition-colors whitespace-nowrap"
            >
              {link.label}
            </button>
          ))}

          {/* Logo */}
          <button
            onClick={() => goTo("/")}
            className="shrink-0 flex items-center justify-center mx-2 lg:mx-4"
            aria-label="Go to home"
          >
            <div className="relative h-14 w-14 sm:h-16 sm:w-16 md:h-20 md:w-20 rounded-full overflow-hidden ring-2 ring-accent/40 shadow-lg">
              <img
                src={logo}
                alt="Vows & Veils logo"
                className="h-full w-full object-cover"
              />
            </div>
          </button>

          {/* Right links */}
          {rightLinks.map((link) => (
            <button
              key={link.label}
              onClick={() => goTo(link.href)}
              className="text-[0.7rem] tracking-[0.32em] uppercase text-white/80 hover:text-accent transition-colors whitespace-nowrap"
            >
              {link.label}
            </button>
          ))}
        </div>

        {/* Col 3 — CTA, aligned to the right edge */}
        <div className="flex items-center justify-end">
          <button
            onClick={openWhatsApp}
            aria-label="Get In Touch on WhatsApp"
            style={{
              border: "1px solid rgba(120,66,2,0.75)",
              color: "rgb(255,255,255)",
              background: "rgba(120,66,2,0.12)",
            }}
            onMouseEnter={(e) => {
              const el = e.currentTarget;
              el.style.background = "rgba(120,66,2,0.28)";
              el.style.borderColor = "rgba(120,66,2,1)";
              el.style.color = "rgb(255,255,255)";
              el.style.boxShadow = "0 0 16px rgba(120,66,2,0.45)";
            }}
            onMouseLeave={(e) => {
              const el = e.currentTarget;
              el.style.background = "rgba(120,66,2,0.12)";
              el.style.borderColor = "rgba(120,66,2,0.75)";
              el.style.color = "rgb(255,255,255)";
              el.style.boxShadow = "none";
            }}
            className="
              shrink-0
              px-3 py-1.5
              sm:px-4 sm:py-2
              text-[0.6rem] sm:text-[0.65rem]
              tracking-[0.2em] sm:tracking-[0.24em]
              uppercase font-semibold
              rounded-full
              transition-all duration-300
              whitespace-nowrap
            "
          >
            Get In Touch
          </button>
        </div>
      </div>

      {/* ── Mobile header (unchanged) ── */}
      <div className="md:hidden mx-auto max-w-7xl px-4 sm:px-6 h-20 flex items-center justify-between gap-4">
        {/* Logo */}
        <button
          onClick={() => goTo("/")}
          className="shrink-0 flex items-center justify-center"
          aria-label="Go to home"
        >
          <div className="relative h-14 w-14 sm:h-16 sm:w-16 rounded-full overflow-hidden ring-2 ring-accent/40 shadow-lg">
            <img
              src={logo}
              alt="Vows & Veils logo"
              className="h-full w-full object-cover"
            />
          </div>
        </button>

        {/* Mobile menu toggle */}
        <button
          aria-label={open ? "Close menu" : "Open menu"}
          className="shrink-0 text-white p-1"
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* Mobile dropdown (unchanged) */}
      {open && (
        <div className="md:hidden bg-black/90 backdrop-blur-md border-t border-white/10">
          <nav className="flex flex-col px-6 py-6 gap-5">
            {allLinks.map((link) => (
              <button
                key={link.label}
                onClick={() => goTo(link.href)}
                className="text-left text-[0.7rem] tracking-[0.32em] uppercase text-white/80 hover:text-accent transition-colors"
              >
                {link.label}
              </button>
            ))}

            {/* Mobile CTA */}
            <button
              onClick={() => {
                setOpen(false);
                openWhatsApp();
              }}
              style={{
                border: "1px solid rgba(120,66,2,0.75)",
                color: "rgb(255,255,255)",
                background: "rgba(120,66,2,0.12)",
              }}
              className="
                mt-2 self-start
                px-5 py-2
                text-[0.65rem] tracking-[0.28em]
                uppercase font-semibold
                rounded-full
                transition-all duration-300
              "
            >
              Get In Touch
            </button>
          </nav>
        </div>
      )}
    </header>
  );
}