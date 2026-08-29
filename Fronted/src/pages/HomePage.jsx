import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Search,
  GraduationCap,
  Building2,
  Newspaper,
  ArrowRight,
  MessageCircle,
  Compass,
  CheckCircle2,
} from "lucide-react";
import { usePostStore } from "../store/usePostStore.js";
import { useBannerStore } from "../store/useBannerStore.js";
import BusinessCarousel from "../components/BusinessCarousel.jsx";
import HeroCarousel from "../components/HeroCarousel.jsx";

const CATEGORIES = [
  { label: "Universities", icon: GraduationCap, category: "University", desc: "Admissions, programs & deadlines" },
  { label: "Academies", icon: Newspaper, category: "Academy", desc: "Courses, fees & enrollment" },
  { label: "Businesses", icon: Building2, category: "Business", desc: "Local businesses & services" },
];

const HOW_IT_WORKS = [
  {
    icon: Search,
    title: "Find a listing",
    desc: "Search universities, academies and businesses from every corner of Sindh.",
  },
  {
    icon: Compass,
    title: "See the details",
    desc: "Programs, fees, services and location — laid out on one clear page.",
  },
  {
    icon: MessageCircle,
    title: "Chat directly",
    desc: "Message the people behind a listing yourself, no forms or waiting.",
  },
];

// Shown in place of the promo carousel when no banners have been added yet,
// so the hero always has a real visual instead of an empty gap.
function HeroFallback() {
  return (
    <div className="ink-gradient relative flex aspect-[4/3] w-full items-center justify-center overflow-hidden sm:aspect-[16/7]">
      <div className="animate-blob absolute -top-16 -right-10 h-64 w-64 rounded-full bg-signal-light/25 blur-3xl" />
      <div className="animate-blob-slow absolute -bottom-20 -left-14 h-64 w-64 rounded-full bg-gold/20 blur-3xl" />
      <div
        className="absolute inset-0 opacity-[0.07]"
        style={{
          backgroundImage: "radial-gradient(circle, white 1px, transparent 1px)",
          backgroundSize: "22px 22px",
        }}
        aria-hidden="true"
      />
      <div className="relative flex flex-col items-center text-center">
        <span className="brand-gradient animate-ring-pulse grid h-16 w-16 place-items-center rounded-2xl text-white shadow-lg sm:h-20 sm:w-20">
          <MessageCircle size={30} strokeWidth={2.2} />
        </span>
        <p className="mt-4 font-display text-lg font-semibold text-white/90 sm:text-xl">
          Promoted listings appear here
        </p>
      </div>
    </div>
  );
}

function HomePage() {
  const navigate = useNavigate();
  const { businesses, isLoadingBusinesses, fetchFeaturedBusinesses } = usePostStore();
  const { banners, fetchBanners } = useBannerStore();
  const [query, setQuery] = useState("");

  useEffect(() => {
    fetchFeaturedBusinesses();
    fetchBanners();
  }, [fetchFeaturedBusinesses, fetchBanners]);

  const handleSearch = (e) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (query.trim()) params.set("search", query.trim());
    navigate(`/explore${params.toString() ? `?${params}` : ""}`);
  };

  return (
    <div>
      {/* Hero visual — the promoted-listing carousel is the hero itself,
          full-bleed edge to edge, right below the navbar. */}
      <section className="relative">
        {banners.length > 0 ? <HeroCarousel banners={banners} fullBleed /> : <HeroFallback />}
      </section>

      {/* Hero copy — headline, search, CTAs sit under the visual now */}
      <section className="ink-gradient relative overflow-hidden">
        <div
          className="absolute inset-0 opacity-[0.05]"
          style={{
            backgroundImage: "radial-gradient(circle, white 1px, transparent 1px)",
            backgroundSize: "22px 22px",
          }}
          aria-hidden="true"
        />
        <div className="relative mx-auto max-w-2xl px-4 py-12 text-center sm:py-16">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1 text-xs font-medium text-white/90 backdrop-blur-sm">
            <span className="animate-pulse-dot h-1.5 w-1.5 rounded-full bg-gold" />
            Universities · Academies · Businesses · Posts
          </span>
          <h1 className="animate-fade-in-up mt-5 font-display text-3xl font-bold tracking-tight text-white sm:text-5xl">
            Discover and connect across <span className="text-gold">Sindh</span>
          </h1>
          <p
            className="animate-fade-in-up mt-4 text-white/70 sm:text-lg"
            style={{ animationDelay: "0.05s" }}
          >
            Find university admissions, academies, and local businesses near you — then chat
            directly with people who can help, all in one place.
          </p>

          <form
            onSubmit={handleSearch}
            className="animate-fade-in-up mt-8 flex items-center gap-2 rounded-2xl bg-white/95 p-2 shadow-xl backdrop-blur-sm"
            style={{ animationDelay: "0.1s" }}
          >
            <Search size={18} className="ml-2 shrink-0 text-ink-faint" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search universities, academies, businesses, posts..."
              className="w-full bg-transparent text-sm text-ink outline-none placeholder:text-ink-faint"
            />
            <button
              type="submit"
              className="btn-press shrink-0 rounded-xl bg-gold px-4 py-2 text-sm font-semibold text-ink transition hover:opacity-90 hover:shadow-md"
            >
              Search
            </button>
          </form>

          <div
            className="animate-fade-in-up mt-6 flex flex-wrap items-center justify-center gap-3"
            style={{ animationDelay: "0.15s" }}
          >
            <button
              onClick={() => navigate("/explore")}
              className="btn-press rounded-xl border border-white/20 px-4 py-2 text-sm font-medium text-white/85 transition hover:bg-white/10"
            >
              Explore everything
            </button>
            <button
              onClick={() => navigate("/create-post")}
              className="btn-press rounded-xl bg-white/10 px-4 py-2 text-sm font-semibold text-white transition hover:bg-white/15"
            >
              Create a post
            </button>
          </div>
        </div>

        <div className="pattern-trellis" style={{ "--pattern-color": "var(--color-gold)" }} />
      </section>

      <div className="mx-auto max-w-6xl px-4 pb-16">
        {/* Category shortcuts */}
        <section className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-3">
          {CATEGORIES.map(({ label, icon: Icon, category, desc }, i) => (
            <button
              key={category}
              onClick={() => navigate(`/explore?category=${category}`)}
              className="card-elevated stagger-item group flex items-center gap-3 rounded-2xl border border-line bg-panel p-4 text-left transition hover:-translate-y-0.5 hover:shadow-lg"
              style={{ animationDelay: `${0.1 + i * 0.08}s` }}
            >
              <span className="brand-gradient grid h-11 w-11 shrink-0 place-items-center rounded-xl text-white transition duration-300 group-hover:scale-110 group-hover:rotate-3">
                <Icon size={20} />
              </span>
              <span className="flex-1">
                <span className="block font-display text-sm font-semibold text-ink">{label}</span>
                <span className="block text-xs text-ink-faint">{desc}</span>
              </span>
              <ArrowRight size={16} className="shrink-0 text-ink-faint transition group-hover:translate-x-0.5 group-hover:text-signal" />
            </button>
          ))}
        </section>

        {/* How it works — a real sequence, so numbering earns its place here */}
        <section className="mt-16">
          <div className="mx-auto max-w-xl text-center">
            <h2 className="font-display text-2xl font-bold text-ink sm:text-3xl">How SindhLink works</h2>
            <p className="mt-2 text-sm text-ink-faint">Three steps from searching to a real conversation.</p>
          </div>

          <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
            {HOW_IT_WORKS.map(({ icon: Icon, title, desc }, i) => (
              <div
                key={title}
                className="stagger-item relative rounded-2xl border border-line bg-panel p-5"
                style={{ animationDelay: `${0.1 + i * 0.1}s` }}
              >
                <span className="font-display text-xs font-semibold text-gold">
                  0{i + 1}
                </span>
                <span className="mt-3 grid h-10 w-10 place-items-center rounded-xl bg-signal-soft text-signal">
                  <Icon size={18} />
                </span>
                <h3 className="mt-3 font-display text-sm font-semibold text-ink">{title}</h3>
                <p className="mt-1 text-xs leading-relaxed text-ink-faint">{desc}</p>
                {i < HOW_IT_WORKS.length - 1 && (
                  <ArrowRight
                    size={16}
                    className="absolute -right-2.5 top-1/2 hidden -translate-y-1/2 text-ink-faint/40 sm:block"
                  />
                )}
              </div>
            ))}
          </div>
        </section>

        {/* Business promotion carousel */}
        <section className="mt-16">
          <div className="mb-4 flex items-end justify-between">
            <div>
              <h2 className="font-display text-xl font-bold text-ink">Featured Businesses</h2>
              <p className="text-sm text-ink-faint">Promoted businesses from across Sindh</p>
            </div>
            <button
              onClick={() => navigate("/explore?category=Business")}
              className="hidden text-sm font-medium text-signal hover:underline sm:inline"
            >
              View all
            </button>
          </div>

          {isLoadingBusinesses ? (
            <div className="flex gap-4 overflow-hidden">
              {[1, 2, 3].map((i) => (
                <div key={i} className="animate-shimmer h-56 w-64 shrink-0 rounded-2xl sm:w-72" />
              ))}
            </div>
          ) : businesses.length ? (
            <BusinessCarousel businesses={businesses} />
          ) : (
            <div className="card-elevated rounded-2xl border border-line bg-panel p-8 text-center text-sm text-ink-faint">
              No businesses have been promoted yet.{" "}
              <button onClick={() => navigate("/create-post")} className="font-medium text-signal hover:underline">
                Be the first
              </button>
            </div>
          )}
        </section>

        {/* Closing CTA */}
        <section className="card-elevated ink-gradient relative mt-16 overflow-hidden rounded-3xl px-6 py-10 text-center sm:px-10">
          <div
            className="absolute inset-0 opacity-[0.06]"
            style={{
              backgroundImage: "radial-gradient(circle, white 1px, transparent 1px)",
              backgroundSize: "20px 20px",
            }}
            aria-hidden="true"
          />
          <div className="relative mx-auto max-w-lg">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1 text-xs font-medium text-white/85">
              <CheckCircle2 size={13} className="text-gold" />
              Free to list
            </span>
            <h2 className="mt-3 font-display text-2xl font-bold text-white sm:text-3xl">
              Have a university, academy or business to list?
            </h2>
            <p className="mt-2 text-sm text-white/70">
              Create a post in a few minutes and start hearing from people across Sindh.
            </p>
            <button
              onClick={() => navigate("/create-post")}
              className="btn-press mt-6 rounded-xl bg-gold px-5 py-2.5 text-sm font-semibold text-ink transition hover:opacity-90 hover:shadow-md"
            >
              Create a post
            </button>
          </div>
        </section>
      </div>
    </div>
  );
}

export default HomePage;
