import { Link } from "react-router-dom";
import { MessageCircle, Facebook, Instagram, Twitter, Mail, MapPin } from "lucide-react";

const EXPLORE_LINKS = [
  { label: "Universities", to: "/explore?category=University" },
  { label: "Academies", to: "/explore?category=Academy" },
  { label: "Businesses", to: "/explore?category=Business" },
  { label: "All posts", to: "/explore" },
];

const SITE_LINKS = [
  { label: "Home", to: "/" },
  { label: "Chat", to: "/chat" },
  { label: "Create a post", to: "/create-post" },
  { label: "About", to: "/about" },
];

function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="ink-gradient relative mt-20 text-white/80">
      <div className="pattern-trellis" style={{ "--pattern-color": "var(--color-gold)" }} />

      <div className="mx-auto max-w-6xl px-4 py-12">
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div className="lg:col-span-1">
            <Link to="/" className="group flex items-center gap-2">
              <span className="brand-gradient grid h-9 w-9 place-items-center rounded-lg text-white shadow-sm">
                <MessageCircle size={18} strokeWidth={2.4} />
              </span>
              <span className="font-display text-lg font-bold tracking-tight text-white">
                Sindh<span className="text-gold">Link</span>
              </span>
            </Link>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-white/60">
              The community board for Sindh — find universities, academies and local
              businesses, then chat directly with the people behind them.
            </p>
            <div className="mt-5 flex items-center gap-2">
              {[Facebook, Instagram, Twitter].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  aria-label="Social link"
                  className="grid h-9 w-9 place-items-center rounded-lg bg-white/10 text-white/70 transition hover:bg-gold hover:text-ink"
                >
                  <Icon size={15} />
                </a>
              ))}
            </div>
          </div>

          {/* Explore */}
          <div>
            <h3 className="font-display text-sm font-semibold uppercase tracking-wide text-white">
              Explore
            </h3>
            <ul className="mt-4 space-y-2.5">
              {EXPLORE_LINKS.map(({ label, to }) => (
                <li key={label}>
                  <Link to={to} className="text-sm text-white/65 transition hover:text-gold">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Site */}
          <div>
            <h3 className="font-display text-sm font-semibold uppercase tracking-wide text-white">
              SindhLink
            </h3>
            <ul className="mt-4 space-y-2.5">
              {SITE_LINKS.map(({ label, to }) => (
                <li key={label}>
                  <Link to={to} className="text-sm text-white/65 transition hover:text-gold">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-display text-sm font-semibold uppercase tracking-wide text-white">
              Get in touch
            </h3>
            <ul className="mt-4 space-y-3">
              <li className="flex items-start gap-2.5 text-sm text-white/65">
                <MapPin size={16} className="mt-0.5 shrink-0 text-gold" />
                <span>Serving cities across Sindh, Pakistan</span>
              </li>
              <li className="flex items-start gap-2.5 text-sm text-white/65">
                <Mail size={16} className="mt-0.5 shrink-0 text-gold" />
                <a href="mailto:hello@sindhlink.com" className="transition hover:text-gold">
                  hello@sindhlink.com
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-10 flex flex-col items-center justify-between gap-3 border-t border-white/10 pt-6 text-xs text-white/50 sm:flex-row">
          <p>© {year} SindhLink. All rights reserved.</p>
          <p>Made for the universities, academies and businesses of Sindh.</p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
