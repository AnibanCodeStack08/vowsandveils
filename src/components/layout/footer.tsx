import { useEffect, useRef } from "react";
import { motion, useInView } from "framer-motion";
import { useNavigate } from "react-router-dom";
import gsap from "gsap";

function InstagramIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M7 2h10a5 5 0 0 1 5 5v10a5 5 0 0 1-5 5H7a5 5 0 0 1-5-5V7a5 5 0 0 1 5-5zm5 6.5A4.5 4.5 0 1 0 16.5 13 4.5 4.5 0 0 0 12 8.5zm6.7-.9a1.1 1.1 0 1 1-1.1-1.1 1.1 1.1 0 0 1 1.1 1.1z" />
    </svg>
  );
}

function FacebookIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M22 12a10 10 0 1 0-11.5 9.9v-7h-2.2v-2.9h2.2V9.1c0-2.2 1.3-3.4 3.3-3.4.96 0 1.96.17 1.96.17v2.1h-1.08c-1.06 0-1.39.66-1.39 1.33v1.6h2.36l-.38 2.9h-1.98v7A10 10 0 0 0 22 12z" />
    </svg>
  );
}

const WhatsAppIcon = ({ className }: { className?: string; strokeWidth?: number }) => (
  <svg viewBox="0 0 32 32" fill="currentColor" className={className} aria-hidden="true">
    <path d="M16.001 3C8.82 3 3 8.82 3 16c0 2.29.6 4.52 1.74 6.49L3 29l6.7-1.75A12.93 12.93 0 0 0 16 29c7.18 0 13-5.82 13-13S23.18 3 16.001 3Zm0 23.6c-1.99 0-3.93-.53-5.62-1.54l-.4-.24-3.98 1.04 1.06-3.88-.26-.4A10.55 10.55 0 0 1 5.4 16C5.4 10.15 10.15 5.4 16 5.4S26.6 10.15 26.6 16 21.85 26.6 16.001 26.6Zm5.82-7.93c-.32-.16-1.88-.93-2.17-1.03-.29-.11-.5-.16-.71.16-.21.32-.81 1.03-1 1.24-.18.21-.37.24-.69.08-.32-.16-1.34-.5-2.55-1.58-.94-.84-1.57-1.87-1.76-2.19-.18-.32-.02-.5.14-.66.14-.14.32-.37.48-.55.16-.18.21-.32.32-.53.11-.21.05-.4-.03-.55-.08-.16-.71-1.72-.98-2.35-.26-.61-.52-.53-.71-.54l-.6-.01c-.21 0-.55.08-.84.4s-1.1 1.08-1.1 2.63 1.13 3.05 1.29 3.26c.16.21 2.22 3.39 5.39 4.75.75.32 1.34.51 1.8.66.76.24 1.45.21 2 .13.61-.09 1.88-.77 2.15-1.51.26-.74.26-1.37.18-1.51-.08-.13-.29-.21-.61-.37Z" />
  </svg>
);

type SocialLink = {
  name: string;
  href: string;
  Icon: React.ComponentType<{ className?: string; strokeWidth?: number }>;
  gradient: string;
  hoverGlow: string;
};

const SOCIAL_LINKS: SocialLink[] = [
  {
    name: "Instagram",
    href: "https://www.instagram.com/vowsandveils.in?igsh=MXU5cGNvNm5jMGR5cA%3D%3D",
    Icon: InstagramIcon,
    gradient: "linear-gradient(135deg, #f9ce34 0%, #ee2a7b 45%, #6228d7 100%)",
    hoverGlow: "0 0 32px rgba(238, 42, 123, 0.55)",
  },
  {
    name: "Facebook",
    href: "https://www.facebook.com/share/17UqWnHNJB/",
    Icon: FacebookIcon,
    gradient: "linear-gradient(135deg, #1877f2 0%, #3b5998 100%)",
    hoverGlow: "0 0 32px rgba(24, 119, 242, 0.55)",
  },
  {
    name: "WhatsApp",
    href: "https://wa.me/919867069643",
    Icon: WhatsAppIcon,
    gradient: "linear-gradient(135deg, #25d366 0%, #128c7e 100%)",
    hoverGlow: "0 0 32px rgba(37, 211, 102, 0.55)",
  },
];

// ✅ These hrefs now match the actual routes defined in Router.tsx
const NAV_LINKS = [
  { label: "Videos", href: "/videos" },
  { label: "Team & About", href: "/team-about" },
  { label: "Contact", href: "/contact" },
] as const;

export default function Footer() {
  const rootRef = useRef<HTMLElement | null>(null);
  const lineRef = useRef<HTMLDivElement | null>(null);
  const isInView = useInView(rootRef, { once: true, margin: "-80px" });
  const navigate = useNavigate();

  useEffect(() => {
    if (!isInView || !lineRef.current) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        lineRef.current,
        { scaleX: 0, transformOrigin: "center" },
        { scaleX: 1, duration: 1.4, ease: "power3.out" },
      );
    }, rootRef);
    return () => ctx.revert();
  }, [isInView]);

  const handleNavClick = (href: string) => {
    navigate(href);
    window.scrollTo({ top: 0, behavior: "instant" });
  };

  return (
    <motion.footer
      ref={rootRef}
      initial={{ opacity: 0, y: 24 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
      className="relative w-full bg-background text-foreground"
      aria-labelledby="footer-heading"
    >
      <h2 id="footer-heading" className="sr-only">
        Footer
      </h2>

      <div ref={lineRef} className="gold-line w-full" />

      <div className="mx-auto max-w-7xl px-6 py-16 sm:px-10 lg:px-16 lg:py-24">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-3 md:gap-16">

          {/* Brand & Contact */}
          <div className="flex flex-col gap-6">
            <span className="hairline text-gold">Studio</span>
            <h3 className="font-display text-4xl text-foreground sm:text-5xl">
              Vows<span className="text-gold">&</span>Veils
            </h3>
            <p className="max-w-sm text-sm leading-relaxed text-muted-foreground">
              Timeless wedding photography crafted with quiet intention and an
              unhurried eye.
            </p>
            <a
              href="mailto:vowsandveils.studio@gmail.com"
              className="group relative inline-flex w-fit items-center text-sm tracking-wide text-foreground transition-colors hover:text-gold"
            >
              vowsandveils.studio@gmail.com
              <span className="absolute -bottom-1 left-0 h-px w-full origin-left scale-x-0 bg-gold transition-transform duration-500 group-hover:scale-x-100" />
            </a>
          </div>

          {/* Navigation — uses useNavigate, no full page reload */}
          <nav aria-label="Footer navigation" className="flex flex-col gap-6">
            <span className="hairline text-gold">Explore</span>
            <ul className="flex flex-col gap-4">
              {NAV_LINKS.map((link) => (
                <li key={link.href}>
                  <button
                    onClick={() => handleNavClick(link.href)}
                    className="group relative inline-flex items-center text-base text-foreground/90 transition-colors hover:text-gold"
                  >
                    <span className="mr-3 h-px w-4 bg-border transition-all duration-500 group-hover:w-8 group-hover:bg-gold" />
                    {link.label}
                  </button>
                </li>
              ))}
            </ul>
          </nav>

          {/* Social */}
          <div className="flex flex-col gap-6">
            <span className="hairline text-gold">Follow</span>
            <ul className="flex items-center gap-5">
              {SOCIAL_LINKS.map((social, i) => (
                <li key={social.name}>
                  <motion.a
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={social.name}
                    initial={{ opacity: 0, y: 16, scale: 0.85 }}
                    animate={isInView ? { opacity: 1, y: 0, scale: 1 } : {}}
                    transition={{
                      duration: 0.7,
                      delay: 0.3 + i * 0.12,
                      ease: [0.22, 1, 0.36, 1],
                    }}
                    whileHover={{ y: -4, scale: 1.08, boxShadow: social.hoverGlow }}
                    whileTap={{ scale: 0.95 }}
                    style={{ background: social.gradient }}
                    className="relative flex h-12 w-12 items-center justify-center overflow-hidden rounded-full text-white shadow-lg shadow-black/40 transition-shadow"
                  >
                    <span
                      aria-hidden
                      className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 hover:opacity-100"
                      style={{
                        background:
                          "radial-gradient(circle at 30% 20%, rgba(255,255,255,0.45), transparent 60%)",
                      }}
                    />
                    <social.Icon className="relative h-5 w-5" strokeWidth={1.8} />
                  </motion.a>
                </li>
              ))}
            </ul>
            <p className="text-xs text-muted-foreground">
              DM us — we usually reply within a day.
            </p>
          </div>
        </div>

        {/* Bottom strip */}
        <div className="mt-16 flex flex-col items-start justify-between gap-4 border-t border-border pt-8 text-xs text-muted-foreground sm:flex-row sm:items-center">
          <p>© {new Date().getFullYear()} Vows&Veils. All rights reserved.</p>
          <p className="hairline text-gold-soft">Crafted with devotion</p>
        </div>
      </div>
    </motion.footer>
  );
}