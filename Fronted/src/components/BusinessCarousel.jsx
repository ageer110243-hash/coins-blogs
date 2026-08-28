import { useRef } from "react";
import { Link } from "react-router-dom";
import { ChevronLeft, ChevronRight, MapPin, Building2 } from "lucide-react";

// Simple, dependency-free carousel built on CSS scroll-snap. Keeps this
// safe to build on Vercel without adding a new package.
function BusinessCarousel({ businesses }) {
  const trackRef = useRef(null);

  const scrollByCard = (direction) => {
    const track = trackRef.current;
    if (!track) return;
    const card = track.querySelector("[data-card]");
    const amount = (card?.offsetWidth || 280) + 16;
    track.scrollBy({ left: direction * amount, behavior: "smooth" });
  };

  if (!businesses?.length) return null;

  return (
    <div className="relative">
      <div
        ref={trackRef}
        className="thin-scroll flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-smooth pb-2"
      >
        {businesses.map((biz) => (
          <Link
            key={biz._id}
            data-card
            to={`/posts/${biz._id}`}
            className="card-elevated group flex w-64 shrink-0 snap-start flex-col overflow-hidden rounded-2xl border border-line bg-panel transition hover:-translate-y-0.5 hover:shadow-lg sm:w-72"
          >
            <div className="aspect-[4/3] w-full overflow-hidden bg-panel-soft">
              {biz.image ? (
                <img
                  src={biz.image}
                  alt={biz.title}
                  className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
                />
              ) : (
                <div className="grid h-full w-full place-items-center text-ink-faint">
                  <Building2 size={26} />
                </div>
              )}
            </div>
            <div className="flex flex-1 flex-col gap-1.5 p-4">
              <span className="w-fit rounded-full bg-signal-soft px-2 py-0.5 text-xs font-medium text-signal">
                {biz.business?.businessCategory || "Business"}
              </span>
              <h4 className="line-clamp-1 font-display text-sm font-semibold text-ink">
                {biz.organizationName || biz.title}
              </h4>
              <p className="line-clamp-2 text-xs text-ink-faint">{biz.description}</p>
              <span className="mt-auto inline-flex items-center gap-1 pt-1 text-xs text-ink-soft">
                <MapPin size={12} />
                {biz.city}
              </span>
            </div>
          </Link>
        ))}
      </div>

      {businesses.length > 2 && (
        <div className="mt-3 flex justify-end gap-2">
          <button
            type="button"
            onClick={() => scrollByCard(-1)}
            className="grid h-9 w-9 place-items-center rounded-full border border-line bg-panel text-ink-soft transition hover:bg-panel-soft"
            aria-label="Previous businesses"
          >
            <ChevronLeft size={16} />
          </button>
          <button
            type="button"
            onClick={() => scrollByCard(1)}
            className="grid h-9 w-9 place-items-center rounded-full border border-line bg-panel text-ink-soft transition hover:bg-panel-soft"
            aria-label="Next businesses"
          >
            <ChevronRight size={16} />
          </button>
        </div>
      )}
    </div>
  );
}

export default BusinessCarousel;
