import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export function sectionheading({
  eyebrow,
  title,
  subtitle,
  align = "center",
}: {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  align?: "center" | "left";
}) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const eyebrowRef = useRef<HTMLSpanElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const lineRef = useRef<HTMLDivElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);

  const alignCls =
    align === "center" ? "text-center items-center" : "text-left items-start";

  useEffect(() => {
    const ctx = gsap.context(() => {
      const targets = [
        eyebrowRef.current,
        titleRef.current,
        lineRef.current,
        subtitleRef.current,
      ].filter(Boolean);

      gsap.from(targets, {
        scrollTrigger: {
          trigger: wrapperRef.current,
          start: "top 85%",
          toggleActions: "play none none none",
        },
        opacity: 0,
        y: 24,
        filter: "blur(8px)",
        duration: 0.8,
        ease: "expo.out",
        stagger: 0.15,
      });
    }, wrapperRef);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={wrapperRef} className={`flex flex-col ${alignCls} gap-4`}>
      {eyebrow && (
        <span ref={eyebrowRef} className="hairline text-accent">
          {eyebrow}
        </span>
      )}

      <h2
        ref={titleRef}
        className="font-display text-4xl md:text-6xl text-balance"
      >
        {title}
      </h2>

      <div ref={lineRef} className="gold-line w-24" />

      {subtitle && (
        <p
          ref={subtitleRef}
          className="text-muted-foreground max-w-2xl leading-relaxed text-balance"
        >
          {subtitle}
        </p>
      )}
    </div>
  );
}

export default sectionheading;