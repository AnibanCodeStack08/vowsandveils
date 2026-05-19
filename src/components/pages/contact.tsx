import { useEffect, useRef, useState, type FormEvent } from "react";
import { motion, useInView } from "framer-motion";
import gsap from "gsap";
import { Mail, Phone, MapPin, Send, Check, Loader2 } from "lucide-react";

// Simple Instagram icon (lucide-react doesn't export in this setup)
function InstagramIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M7 2h10a5 5 0 0 1 5 5v10a5 5 0 0 1-5 5H7a5 5 0 0 1-5-5V7a5 5 0 0 1 5-5zm5 6.5A4.5 4.5 0 1 0 16.5 13 4.5 4.5 0 0 0 12 8.5zm6.7-.9a1.1 1.1 0 1 1-1.1-1.1 1.1 1.1 0 0 1 1.1 1.1z" />
    </svg>
  );
}

// Simple Facebook icon
function FacebookIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M22 12a10 10 0 1 0-11.5 9.9v-7h-2.2v-2.9h2.2V9.1c0-2.2 1.3-3.4 3.3-3.4.96 0 1.96.17 1.96.17v2.1h-1.08c-1.06 0-1.39.66-1.39 1.33v1.6h2.36l-.38 2.9h-1.98v7A10 10 0 0 0 22 12z" />
    </svg>
  );
}


const STUDIO_MAP_URL =
  "https://www.google.com/maps/search/?api=1&query=Dipmita+Apt%2C+New+Circular+Ln%2C+Raikot+Para%2C+Silpasamiti+Para%2C+Jalpaiguri%2C+West+Bengal+735101";

// WhatsApp icon (lucide doesn't ship one)
function WhatsAppIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.768.967-.942 1.164-.173.198-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.247-.694.247-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z"/>
    </svg>
  );
}

type SocialLink = {
  label: string;
  href: string;
  Icon: React.ComponentType<{ className?: string }>;
};

const socials: SocialLink[] = [
  {
    label: "Instagram",
    href: "https://www.instagram.com/vowsandveils.in?igsh=MXU5cGNvNm5jMGR5cA%3D%3D",
    Icon: InstagramIcon,
  },
  {
    label: "Facebook",
    href: "https://www.facebook.com/share/17UqWnHNJB/",
    Icon: FacebookIcon,
  },
  {
    label: "WhatsApp",
    href: "https://wa.me/918670696443",
    Icon: WhatsAppIcon,
  },
];

type Status = "idle" | "submitting" | "success" | "error";

type FormState = {
  name: string;
  email: string;
  phone: string;
  message: string;
};

type FormErrors = Partial<Record<keyof FormState, string>>;

const initialForm: FormState = {
  name: "",
  email: "",
  phone: "",
  message: "",
};

function validate(form: FormState): FormErrors {
  const errors: FormErrors = {};
  if (!form.name.trim()) errors.name = "Please share your name";
  else if (form.name.trim().length > 100) errors.name = "Name is too long";

  if (!form.email.trim()) errors.email = "We need an email to reply";
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim()))
    errors.email = "That email doesn't look right";

  if (form.phone && form.phone.replace(/\D/g, "").length < 7)
    errors.phone = "Please enter a valid phone";

  if (!form.message.trim()) errors.message = "Tell us about your day";
  else if (form.message.trim().length > 1500) errors.message = "Message is too long";

  return errors;
}

export default function Contact() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const headingRef = useRef<HTMLDivElement | null>(null);
  const socialsRef = useRef<HTMLDivElement | null>(null);

  const inView = useInView(sectionRef, { once: true, margin: "-15% 0px" });

  const [form, setForm] = useState<FormState>(initialForm);
  const [errors, setErrors] = useState<FormErrors>({});
  const [status, setStatus] = useState<Status>("idle");

  // GSAP: hairline reveal + sequential social logo entrance
  useEffect(() => {
    if (!inView) return;
    const ctx = gsap.context(() => {
      gsap.from(".gsap-hairline", {
        scaleX: 0,
        transformOrigin: "left center",
        duration: 1.2,
        ease: "power3.out",
      });
      gsap.from(".gsap-heading-word", {
        yPercent: 110,
        opacity: 0,
        duration: 1,
        ease: "power4.out",
        stagger: 0.08,
        delay: 0.15,
      });
      gsap.from(".gsap-social", {
        y: 24,
        opacity: 0,
        scale: 0.85,
        rotate: -8,
        duration: 0.9,
        ease: "back.out(1.6)",
        stagger: 0.12,
        delay: 0.4,
      });
    }, sectionRef);
    return () => ctx.revert();
  }, [inView]);

  const handleChange =
    (field: keyof FormState) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setForm((f) => ({ ...f, [field]: e.target.value }));
      if (errors[field]) setErrors((prev) => ({ ...prev, [field]: undefined }));
    };

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const v = validate(form);
    if (Object.keys(v).length) {
      setErrors(v);
      return;
    }
    setStatus("submitting");
    // Frontend-only: simulate a brief send, then show success
    setTimeout(() => {
      setStatus("success");
      setForm(initialForm);
      setTimeout(() => setStatus("idle"), 4000);
    }, 600);
  }

  return (
    <section
      ref={sectionRef}
      id="contact"
      className="relative w-full overflow-hidden bg-background py-24 px-6 md:px-12 lg:px-20"
    >
      {/* Decorative gold glow */}
      <div
        aria-hidden
        className="pointer-events-none absolute -top-32 left-1/2 h-[420px] w-[420px] -translate-x-1/2 rounded-full opacity-[0.08] blur-3xl"
        style={{ background: "var(--color-gold)" }}
      />

      <div className="relative mx-auto max-w-7xl">
        {/* Header */}
        <div ref={headingRef} className="mb-16 text-center">
          <div className="gsap-hairline gold-line mx-auto mb-6 w-32" />
          <p className="hairline text-gold mb-4">Get in touch</p>
          <h2 className="font-display text-balance text-4xl md:text-6xl lg:text-7xl text-foreground">
            <span className="inline-block overflow-hidden align-bottom">
              <span className="gsap-heading-word inline-block">Let's&nbsp;</span>
            </span>
            <span className="inline-block overflow-hidden align-bottom">
              <span className="gsap-heading-word inline-block italic text-gold">tell&nbsp;</span>
            </span>
            <span className="inline-block overflow-hidden align-bottom">
              <span className="gsap-heading-word inline-block">your&nbsp;</span>
            </span>
            <span className="inline-block overflow-hidden align-bottom">
              <span className="gsap-heading-word inline-block">story.</span>
            </span>
          </h2>
          <p className="mx-auto mt-6 max-w-xl text-balance text-sm md:text-base text-muted-foreground">
            From first looks to last dances — Vows&amp;Veils captures the moments
            between the moments. Reach out and let's begin.
          </p>
        </div>

        <div className="grid gap-12 lg:grid-cols-5 lg:gap-16">
          {/* LEFT — Info + Socials + Map */}
          <motion.div
            initial={{ opacity: 0, x: -24 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
            className="lg:col-span-2 space-y-10"
          >
            {/* Brand block */}
            <div>
              <p className="hairline text-muted-foreground mb-3">Studio</p>
              <h3 className="font-display text-3xl md:text-4xl text-foreground">
                Vows<span className="text-gold">&amp;</span>Veils
              </h3>
            </div>

            {/* Contact rows */}
            <ul className="space-y-5">
              <ContactRow
                Icon={Mail}
                label="Email"
                value="vowsandveils.studio@gmail.com"
                href="mailto:vowsandveils.studio@gmail.com"
              />
              <ContactRow
                Icon={Phone}
                label="Phone"
                value="086706 96443"
                href="tel:+918670696443"
              />
              <ContactRow
                Icon={MapPin}
                label="Studio"
                value="Dipmita Apt, New Circular Ln, Raikot Para, Jalpaiguri, WB 735101"
                href={STUDIO_MAP_URL}
                external
              />

            </ul>

            {/* Socials */}
            <div>
              <p className="hairline text-muted-foreground mb-4">Follow along</p>
              <div ref={socialsRef} className="flex items-center gap-4">
                {socials.map(({ label, href, Icon }) => (
                  <motion.a
                    key={label}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={label}
                    whileHover={{ y: -4, scale: 1.06 }}
                    whileTap={{ scale: 0.95 }}
                    transition={{ type: "spring", stiffness: 320, damping: 18 }}
                    className="gsap-social group relative grid h-12 w-12 place-items-center rounded-full border border-border bg-card text-foreground transition-colors hover:border-gold hover:text-gold"
                  >
                    <span
                      aria-hidden
                      className="absolute inset-0 rounded-full opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                      style={{
                        background:
                          "radial-gradient(circle at center, var(--color-gold) 0%, transparent 70%)",
                        filter: "blur(10px)",
                      }}
                    />
                    <Icon className="relative h-5 w-5" />
                  </motion.a>
                ))}
              </div>
            </div>
          </motion.div>




          {/* RIGHT — Form */}
          <motion.div
            initial={{ opacity: 0, x: 24 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1], delay: 0.3 }}
            className="lg:col-span-3"
          >
            <form
              onSubmit={handleSubmit}
              noValidate
              className="relative rounded-md border border-border bg-card p-6 md:p-10"
            >
              <div
                aria-hidden
                className="absolute -top-px left-10 right-10 h-px"
                style={{
                  background:
                    "linear-gradient(to right, transparent, var(--color-gold), transparent)",
                }}
              />

              <p className="hairline text-gold mb-2">Enquire</p>
              <h3 className="font-display text-2xl md:text-3xl mb-8 text-foreground">
                Begin your story
              </h3>

              <div className="grid gap-5 md:grid-cols-2">
                <Field
                  label="Your name"
                  name="name"
                  value={form.name}
                  onChange={handleChange("name")}
                  error={errors.name}
                  autoComplete="name"
                />
                <Field
                  label="Email"
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={handleChange("email")}
                  error={errors.email}
                  autoComplete="email"
                />
                <Field
                  label="Phone (optional)"
                  name="phone"
                  type="tel"
                  value={form.phone}
                  onChange={handleChange("phone")}
                  error={errors.phone}
                  autoComplete="tel"
                />
              </div>

              <div className="mt-5">
                <Field
                  label="Tell us about your day"
                  name="message"
                  as="textarea"
                  rows={5}
                  value={form.message}
                  onChange={handleChange("message")}
                  error={errors.message}
                />
              </div>

              <div className="mt-8 flex flex-col-reverse items-stretch gap-4 sm:flex-row sm:items-center sm:justify-between">
                <p className="text-xs text-muted-foreground">
                  We'll reply within 24 hours.
                </p>

                <motion.button
                  type="submit"
                  disabled={status === "submitting" || status === "success"}
                  whileHover={{ scale: status === "idle" ? 1.02 : 1 }}
                  whileTap={{ scale: 0.97 }}
                  className="group relative inline-flex items-center justify-center gap-2 overflow-hidden rounded-sm border border-gold bg-gold px-8 py-3.5 text-sm font-medium tracking-widest uppercase text-primary-foreground transition-colors disabled:cursor-not-allowed disabled:opacity-90"
                >
                  <span
                    aria-hidden
                    className="absolute inset-0 -translate-x-full bg-gold-soft transition-transform duration-500 group-hover:translate-x-0"
                  />
                  <span className="relative flex items-center gap-2">
                    {status === "submitting" && (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Sending
                      </>
                    )}
                    {status === "success" && (
                      <>
                        <Check className="h-4 w-4" />
                        Sent
                      </>
                    )}
                    {(status === "idle" || status === "error") && (
                      <>
                        <Send className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                        Send enquiry
                      </>
                    )}
                  </span>
                </motion.button>
              </div>

              {status === "success" && (
                <motion.p
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-4 text-sm text-gold-soft"
                >
                  Thank you — your message is with us. We'll be in touch soon.
                </motion.p>
              )}
              {status === "error" && (
                <p className="mt-4 text-sm text-destructive">
                  Something went wrong. Please try again or email us directly.
                </p>
              )}
            </form>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

/* ---------- Sub-components ---------- */

function ContactRow({
  Icon,
  label,
  value,
  href,
  external,
}: {
  Icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
  href?: string;
  external?: boolean;
}) {
  const content = (
    <div className="group flex items-start gap-4">
      <span className="mt-0.5 grid h-10 w-10 shrink-0 place-items-center rounded-full border border-border bg-card transition-colors group-hover:border-gold">
        <Icon className="h-4 w-4 text-gold" />
      </span>
      <div>
        <p className="hairline text-muted-foreground">{label}</p>
        <p className="mt-1 text-base text-foreground transition-colors group-hover:text-gold">
          {value}
        </p>
      </div>
    </div>
  );
  return (
    <li>
      {href ? (
        <a
          href={href}
          className="block"
          {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
        >
          {content}
        </a>
      ) : (
        content
      )}
    </li>
  );
}

type FieldProps = {
  label: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  error?: string;
  type?: string;
  autoComplete?: string;
  as?: "input" | "textarea";
  rows?: number;
};

function Field({
  label,
  name,
  value,
  onChange,
  error,
  type = "text",
  autoComplete,
  as = "input",
  rows = 4,
}: FieldProps) {
  const [focused, setFocused] = useState(false);
  const floating = focused || value.length > 0;

  const baseClasses =
    "peer w-full bg-transparent border-0 border-b border-border px-0 pt-6 pb-2 text-foreground placeholder-transparent outline-none transition-colors focus:border-gold";

  return (
    <div className="relative">
      {as === "textarea" ? (
        <textarea
          id={name}
          name={name}
          rows={rows}
          value={value}
          onChange={onChange}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          placeholder={label}
          className={`${baseClasses} resize-none`}
        />
      ) : (
        <input
          id={name}
          name={name}
          type={type}
          value={value}
          onChange={onChange}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          placeholder={label}
          autoComplete={autoComplete}
          className={baseClasses}
        />
      )}

      <label
        htmlFor={name}
        className={`pointer-events-none absolute left-0 transition-all duration-300 ${
          floating
            ? "top-1 text-[0.65rem] tracking-[0.32em] uppercase text-gold"
            : "top-6 text-sm text-muted-foreground"
        }`}
      >
        {label}
      </label>

      {/* Animated underline accent */}
      <span
        aria-hidden
        className={`absolute bottom-0 left-0 h-px bg-gold transition-all duration-500 ${
          focused ? "w-full" : "w-0"
        }`}
      />

      {error && (
        <motion.p
          initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-2 text-xs text-destructive"
        >
          {error}
        </motion.p>
      )}
    </div>
  );
}
