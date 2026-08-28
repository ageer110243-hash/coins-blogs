import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search, GraduationCap, Building2, Newspaper, ArrowRight } from "lucide-react";
import { usePostStore } from "../store/usePostStore.js";
import BusinessCarousel from "../components/BusinessCarousel.jsx";

function HomePage() {
  const navigate = useNavigate();
  const { businesses, isLoadingBusinesses, fetchFeaturedBusinesses } = usePostStore();
  const [query, setQuery] = useState("");

  useEffect(() => {
    fetchFeaturedBusinesses();
  }, [fetchFeaturedBusinesses]);

  const handleSearch = (e) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (query.trim()) params.set("search", query.trim());
    navigate(`/explore${params.toString() ? `?${params}` : ""}`);
  };

  return (
    <div className="mx-auto max-w-6xl px-4 pb-16">
      {/* Hero */}
      <section className="relative overflow-hidden rounded-3xl border border-line bg-panel px-6 py-14 sm:px-10 sm:py-20">
        <div className="animate-blob absolute -top-16 -right-10 h-56 w-56 rounded-full bg-signal-soft blur-3xl" />
        <div className="animate-blob-slow absolute -bottom-16 -left-10 h-56 w-56 rounded-full bg-accent-soft blur-3xl" />

        <div className="relative mx-auto max-w-2xl text-center">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-signal-soft px-3 py-1 text-xs font-medium text-signal">
            Universities · Academies · Businesses · Posts
          </span>
          <h1 className="animate-fade-in-up mt-4 font-display text-3xl font-bold tracking-tight text-ink sm:text-5xl">
            Discover and connect across{" "}
            <span className="brand-gradient-text">Sindh</span>
          </h1>
          <p className="animate-fade-in-up mt-4 text-ink-soft sm:text-lg" style={{ animationDelay: "0.05s" }}>
            Find university admissions, academies, and local businesses near you — then chat
            directly with people who can help, all in one place.
          </p>

          <form
            onSubmit={handleSearch}
            className="animate-fade-in-up mt-8 flex items-center gap-2 rounded-2xl border border-line bg-panel-soft p-2 shadow-sm"
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
              className="brand-gradient shrink-0 rounded-xl px-4 py-2 text-sm font-semibold text-white transition hover:opacity-90"
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
              className="rounded-xl border border-line bg-panel px-4 py-2 text-sm font-medium text-ink-soft transition hover:bg-panel-soft"
            >
              Explore everything
            </button>
            <button
              onClick={() => navigate("/create-post")}
              className="brand-gradient rounded-xl px-4 py-2 text-sm font-semibold text-white transition hover:opacity-90"
            >
              Create a post
            </button>
          </div>
        </div>
      </section>

      {/* Category shortcuts */}
      <section className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-3">
        {[
          { label: "Universities", icon: GraduationCap, category: "University", desc: "Admissions, programs & deadlines" },
          { label: "Academies", icon: Newspaper, category: "Academy", desc: "Courses, fees & enrollment" },
          { label: "Businesses", icon: Building2, category: "Business", desc: "Local businesses & services" },
        ].map(({ label, icon: Icon, category, desc }) => (
          <button
            key={category}
            onClick={() => navigate(`/explore?category=${category}`)}
            className="card-elevated group flex items-center gap-3 rounded-2xl border border-line bg-panel p-4 text-left transition hover:-translate-y-0.5 hover:shadow-lg"
          >
            <span className="brand-gradient grid h-11 w-11 shrink-0 place-items-center rounded-xl text-white">
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

      {/* Business promotion carousel */}
      <section className="mt-12">
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
    </div>
  );
}

export default HomePage;
