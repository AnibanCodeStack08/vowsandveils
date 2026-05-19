import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";

const logo = "images/profile/header-logo.jpeg";

const leftLinks = [
  { href: "/", label: "Home" },
  { href: "#about", label: "About" },
  { href: "#work", label: "Work" },
] as const;

const rightLinks = [
  { href: "#team", label: "Team" },
  { href: "#testimonials", label: "Reviews" },
  { href: "#contact", label: "Contact" },
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

    /* Route Navigation */
    if (href.startsWith("/")) {
      navigate(href);
      return;
    }

    /* Section Scroll */
    const scrollToSection = () => {
      const id = href.replace("#", "");
      const el = document.getElementById(id);
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    };

    /* If not on homepage, go home first */
    if (location.pathname !== "/") {
      navigate("/");
      setTimeout(() => scrollToSection(), 100);
    } else {
      scrollToSection();
    }
  };

  const openWhatsApp = () => {
    window.open("https://wa.me/8670696443", "_blank", "noopener,noreferrer");
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? "bg-black/70 backdrop-blur-md border-b border-white/10"
          : "bg-linear-to-b from-black/60 to-transparent"
      }`}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 md:px-10 h-20 md:h-24 flex items-center justify-between gap-4">

        {/* Left nav — desktop only */}
        <nav className="hidden md:flex items-center justify-end gap-6 lg:gap-8 flex-1 pr-6 lg:pr-10">
          {leftLinks.map((link) => (
            <button
              key={link.label}
              onClick={() => goTo(link.href)}
              className="text-[0.7rem] tracking-[0.32em] uppercase text-white/80 hover:text-accent transition-colors whitespace-nowrap"
            >
              {link.label}
            </button>
          ))}
        </nav>

        {/* Logo — always visible */}
        <button
          onClick={() => goTo("/")}
          className="shrink-0 flex items-center justify-center"
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

        {/* Right nav — desktop only */}
        <nav className="hidden md:flex items-center justify-start gap-6 lg:gap-8 flex-1 pl-6 lg:pl-10">
          {rightLinks.map((link) => (
            <button
              key={link.label}
              onClick={() => goTo(link.href)}
              className="text-[0.7rem] tracking-[0.32em] uppercase text-white/80 hover:text-accent transition-colors whitespace-nowrap"
            >
              {link.label}
            </button>
          ))}
        </nav>

        {/* Hire Me button — always visible */}
        <button
          onClick={openWhatsApp}
          aria-label="Hire Me on WhatsApp"
          className="
            shrink-0
            px-3 py-1.5
            sm:px-4 sm:py-2
            text-[0.6rem] sm:text-[0.65rem]
            tracking-[0.2em] sm:tracking-[0.28em]
            uppercase font-semibold
            rounded-full
            border border-emerald-500/70
            text-emerald-400
            bg-emerald-500/10
            hover:bg-emerald-500/25
            hover:border-emerald-400
            hover:text-emerald-300
            hover:shadow-[0_0_14px_rgba(52,211,153,0.35)]
            transition-all duration-300
            whitespace-nowrap
          "
        >
          Hire Me
        </button>

        {/* Mobile menu toggle */}
        <button
          aria-label={open ? "Close menu" : "Open menu"}
          className="md:hidden shrink-0 text-white p-1"
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* Mobile dropdown menu */}
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

            {/* Hire Me inside mobile menu */}
            <button
              onClick={() => {
                setOpen(false);
                openWhatsApp();
              }}
              className="
                mt-2 self-start
                px-5 py-2
                text-[0.65rem] tracking-[0.28em]
                uppercase font-semibold
                rounded-full
                border border-emerald-500/70
                text-emerald-400
                bg-emerald-500/10
                hover:bg-emerald-500/25
                hover:border-emerald-400
                hover:text-emerald-300
                transition-all duration-300
              "
            >
              Hire Me
            </button>
          </nav>
        </div>
      )}
    </header>
  );
}