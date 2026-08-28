import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Search, SlidersHorizontal, ChevronLeft, ChevronRight, Frown } from "lucide-react";
import { usePostStore } from "../store/usePostStore.js";
import { SINDH_CITIES, POST_CATEGORIES } from "../constants/index.js";
import PostCard from "../components/PostCard.jsx";

function ExplorePage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const { posts, isLoadingPosts, page, totalPages, filters, setFilters, fetchPosts } =
    usePostStore();
  const [searchInput, setSearchInput] = useState(
    () => searchParams.get("search") || filters.search
  );

  // Seed filters from the URL once (e.g. coming from Home's search bar or
  // a "Universities" shortcut), then fetch.
  useEffect(() => {
    const urlSearch = searchParams.get("search") || "";
    const urlCity = searchParams.get("city") || "All Cities";
    const urlCategory = searchParams.get("category") || "All";
    setFilters({ search: urlSearch, city: urlCity, category: urlCategory });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    fetchPosts(1);
  }, [filters.city, filters.category, filters.search, fetchPosts]);

  const applySearch = (e) => {
    e.preventDefault();
    setFilters({ search: searchInput.trim() });
  };

  const updateCity = (city) => {
    setFilters({ city });
    setSearchParams((prev) => {
      const p = new URLSearchParams(prev);
      city === "All Cities" ? p.delete("city") : p.set("city", city);
      return p;
    });
  };

  const updateCategory = (category) => {
    setFilters({ category });
    setSearchParams((prev) => {
      const p = new URLSearchParams(prev);
      category === "All" ? p.delete("category") : p.set("category", category);
      return p;
    });
  };

  return (
    <div className="mx-auto max-w-6xl px-4 pb-16">
      <div className="pt-8">
        <h1 className="font-display text-2xl font-bold text-ink sm:text-3xl">Explore</h1>
        <p className="mt-1 text-sm text-ink-faint">
          Search universities, academies, businesses and posts across Sindh.
        </p>
      </div>

      {/* Search */}
      <form onSubmit={applySearch} className="mt-6 flex items-center gap-2 rounded-2xl border border-line bg-panel p-2 shadow-sm">
        <Search size={18} className="ml-2 shrink-0 text-ink-faint" />
        <input
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          placeholder="Search by title, organization or keyword..."
          className="w-full bg-transparent text-sm text-ink outline-none placeholder:text-ink-faint"
        />
        <button
          type="submit"
          className="brand-gradient shrink-0 rounded-xl px-4 py-2 text-sm font-semibold text-white transition hover:opacity-90"
        >
          Search
        </button>
      </form>

      {/* Filters */}
      <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center">
        <span className="inline-flex items-center gap-1.5 text-sm font-medium text-ink-soft">
          <SlidersHorizontal size={15} />
          Filters:
        </span>
        <select
          value={filters.city}
          onChange={(e) => updateCity(e.target.value)}
          className="rounded-lg border border-line bg-panel px-3 py-1.5 text-sm text-ink outline-none focus:border-signal"
        >
          {SINDH_CITIES.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
        <select
          value={filters.category}
          onChange={(e) => updateCategory(e.target.value)}
          className="rounded-lg border border-line bg-panel px-3 py-1.5 text-sm text-ink outline-none focus:border-signal"
        >
          {POST_CATEGORIES.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
      </div>

      {/* Results */}
      <div className="mt-6">
        {isLoadingPosts ? (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="animate-shimmer h-72 rounded-2xl" />
            ))}
          </div>
        ) : posts.length ? (
          <>
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {posts.map((post) => (
                <PostCard key={post._id} post={post} />
              ))}
            </div>

            {totalPages > 1 && (
              <div className="mt-8 flex items-center justify-center gap-3">
                <button
                  disabled={page <= 1}
                  onClick={() => fetchPosts(page - 1)}
                  className="grid h-9 w-9 place-items-center rounded-full border border-line bg-panel text-ink-soft transition hover:bg-panel-soft disabled:cursor-not-allowed disabled:opacity-40"
                >
                  <ChevronLeft size={16} />
                </button>
                <span className="text-sm text-ink-soft">
                  Page {page} of {totalPages}
                </span>
                <button
                  disabled={page >= totalPages}
                  onClick={() => fetchPosts(page + 1)}
                  className="grid h-9 w-9 place-items-center rounded-full border border-line bg-panel text-ink-soft transition hover:bg-panel-soft disabled:cursor-not-allowed disabled:opacity-40"
                >
                  <ChevronRight size={16} />
                </button>
              </div>
            )}
          </>
        ) : (
          <div className="card-elevated flex flex-col items-center gap-2 rounded-2xl border border-line bg-panel p-12 text-center">
            <Frown size={28} className="text-ink-faint" />
            <p className="font-medium text-ink">No posts match those filters</p>
            <p className="text-sm text-ink-faint">Try a different city, category or search term.</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default ExplorePage;
