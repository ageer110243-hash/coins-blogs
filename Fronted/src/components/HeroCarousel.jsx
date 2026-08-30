import { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronLeft, ChevronRight } from "lucide-react";

const AUTOPLAY_MS = 2000;
const SWIPE_THRESHOLD_PX = 40;

// Admin-managed promo slides for the Home page hero. Dependency-free
// (no carousel package) — autoplay via setInterval, manual nav via
// dots/arrows, and touch swipe on mobile. Pauses autoplay on
// hover/touch so people can actually read a slide.
function HeroCarousel({ banners, fullBleed = false }) {
  const navigate = useNavigate();
  const [index, setIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const touchStartX = useRef(null);

  const count = banners.length;

  const goTo = useCallback(
    (i) => {
      if (!count) return;
      setIndex(((i % count) + count) % count);
    },
    [count]
  );

  const next = useCallback(() => goTo(index + 1), [goTo, index]);
  const prev = useCallback(() => goTo(index - 1), [goTo, index]);

  useEffect(() => {
    if (isPaused || count <= 1) return;
    const id = setInterval(next, AUTOPLAY_MS);
    return () => clearInterval(id);
  }, [isPaused, count, next]);

  // Keep index in range if the admin deletes a slide out from under it.
  useEffect(() => {
    if (index >= count) setIndex(0);
  }, [count, index]);

  if (!count) return null;

  const handleSlideClick = (banner) => {
    if (!banner.link) return;
    if (/^https?:\/\//i.test(banner.link)) {
      window.open(banner.link, "_blank", "noreferrer");
    } else {
      navigate(banner.link);
    }
  };

  const handleTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX;
  };
  const handleTouchEnd = (e) => {
    if (touchStartX.current === null) return;
    const delta = e.changedTouches[0].clientX - touchStartX.current;
    if (delta > SWIPE_THRESHOLD_PX) prev();
    else if (delta < -SWIPE_THRESHOLD_PX) next();
    touchStartX.current = null;
  };

  return (
    <div
      className={`group/hero relative w-full overflow-hidden bg-panel-soft ${
        fullBleed ? "" : "rounded-2xl border border-line"
      }`}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      <div
        className={
          fullBleed
            ? "relative h-56 w-full sm:h-72 md:h-80 lg:h-96"
            : "relative aspect-[16/9] w-full sm:aspect-[21/9]"
        }
      >
        {banners.map((banner, i) => (
          <div
            key={banner._id}
            className="absolute inset-0 transition-opacity duration-700 ease-in-out"
            style={{ opacity: i === index ? 1 : 0, pointerEvents: i === index ? "auto" : "none" }}
            aria-hidden={i !== index}
          >
            <button
              type="button"
              onClick={() => handleSlideClick(banner)}
              className={`relative block h-full w-full overflow-hidden ${banner.link ? "cursor-pointer" : "cursor-default"}`}
              tabIndex={i === index ? 0 : -1}
            >
              {/* Blurred, zoomed copy fills the frame edge-to-edge so there's
                  never empty letterbox space, no matter the image's aspect
                  ratio... */}
              <img
                src={banner.image}
                alt=""
                aria-hidden="true"
                draggable={false}
                className="absolute inset-0 h-full w-full scale-110 object-cover opacity-60 blur-2xl"
              />
              {/* ...while the real image sits on top, uncropped, so the
                  whole picture is always visible. */}
              <img
                src={banner.image}
                alt={banner.title}
                className="relative h-full w-full object-contain"
                draggable={false}
              />
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink/70 via-transparent to-transparent" />
              <div className={`absolute inset-x-0 bottom-0 text-left ${fullBleed ? "p-4 sm:p-8" : "p-3 sm:p-5"}`}>
                {banner.businessName && (
                  <span className="inline-block rounded-full bg-white/15 px-2 py-0.5 text-[11px] font-medium text-white backdrop-blur-sm sm:text-xs">
                    {banner.businessName}
                  </span>
                )}
                <h3
                  className={`mt-1 line-clamp-1 font-display font-semibold text-white ${
                    fullBleed ? "text-base sm:text-2xl" : "text-sm sm:text-lg"
                  }`}
                >
                  {banner.title}
                </h3>
              </div>
            </button>
          </div>
        ))}
      </div>

      {count > 1 && (
        <>
          <button
            type="button"
            onClick={prev}
            aria-label="Previous slide"
            className={`absolute left-2 top-1/2 hidden -translate-y-1/2 rounded-full bg-ink/40 p-1.5 text-white opacity-0 backdrop-blur-sm transition hover:bg-ink/60 group-hover/hero:opacity-100 sm:grid sm:place-items-center ${
              fullBleed ? "sm:left-4" : ""
            }`}
          >
            <ChevronLeft size={18} />
          </button>
          <button
            type="button"
            onClick={next}
            aria-label="Next slide"
            className={`absolute right-2 top-1/2 hidden -translate-y-1/2 rounded-full bg-ink/40 p-1.5 text-white opacity-0 backdrop-blur-sm transition hover:bg-ink/60 group-hover/hero:opacity-100 sm:grid sm:place-items-center ${
              fullBleed ? "sm:right-4" : ""
            }`}
          >
            <ChevronRight size={18} />
          </button>

          <div className="absolute inset-x-0 bottom-2 flex items-center justify-center gap-1.5 sm:bottom-4">
            {banners.map((b, i) => (
              <button
                key={b._id}
                type="button"
                onClick={() => goTo(i)}
                aria-label={`Go to slide ${i + 1}`}
                className={`h-1.5 rounded-full transition-all ${
                  i === index ? "w-5 bg-white" : "w-1.5 bg-white/50"
                }`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}

export default HeroCarousel;
