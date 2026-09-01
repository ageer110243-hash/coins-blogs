import { useEffect, useRef, useState } from "react";
import {
  ImagePlus,
  Images,
  Eye,
  EyeOff,
  Loader,
  Trash2,
} from "lucide-react";
import toast from "react-hot-toast";
import { useBannerStore } from "../../store/useBannerStore.js";

function BannerManager() {
  const {
    adminBanners,
    isLoadingAdminBanners,
    isSavingBanner,
    fetchAdminBanners,
    createBanner,
    toggleBannerActive,
    deleteBanner,
  } = useBannerStore();
  const fileInputRef = useRef(null);

  const [imagePreview, setImagePreview] = useState("");
  const [imageData, setImageData] = useState("");
  const [title, setTitle] = useState("");
  const [businessName, setBusinessName] = useState("");
  const [link, setLink] = useState("");

  useEffect(() => {
    fetchAdminBanners();
  }, [fetchAdminBanners]);

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (!file || !file.type.startsWith("image/")) return;
    const reader = new FileReader();
    reader.onload = () => {
      setImagePreview(reader.result);
      setImageData(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const resetForm = () => {
    setImagePreview("");
    setImageData("");
    setTitle("");
    setBusinessName("");
    setLink("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!imageData) {
      toast.error("Please choose an image for the slide");
      return;
    }
    if (!title.trim()) {
      toast.error("Title is required");
      return;
    }
    const created = await createBanner({
      image: imageData,
      title: title.trim(),
      businessName: businessName.trim(),
      link: link.trim(),
    });
    if (created) resetForm();
  };

  return (
    <div className="card-elevated animate-fade-in-up rounded-2xl border border-line bg-panel">
      <div className="flex items-center gap-2 border-b border-line p-4">
        <Images size={16} className="text-signal" />
        <h2 className="font-display text-sm font-semibold text-ink">
          Home page hero carousel
        </h2>
      </div>

      <div className="grid grid-cols-1 gap-6 p-4 lg:grid-cols-[minmax(0,320px)_1fr]">
        {/* Add banner form */}
        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <span className="text-xs font-medium text-ink-soft">Promo image</span>
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="mt-1 flex aspect-[16/9] w-full items-center justify-center overflow-hidden rounded-xl border-2 border-dashed border-line bg-panel-soft transition hover:border-signal"
            >
              {imagePreview ? (
                <img src={imagePreview} alt="" className="h-full w-full object-cover" />
              ) : (
                <span className="flex flex-col items-center gap-1.5 text-ink-faint">
                  <ImagePlus size={20} />
                  <span className="text-xs">Click to upload</span>
                </span>
              )}
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              hidden
              onChange={handleImageChange}
            />
          </div>

          <label className="block">
            <span className="text-xs font-medium text-ink-soft">Title</span>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. 20% off this week"
              className="mt-1 w-full rounded-lg border border-line bg-panel px-3 py-2 text-sm text-ink outline-none focus:border-signal"
            />
          </label>

          <label className="block">
            <span className="text-xs font-medium text-ink-soft">Business name (optional)</span>
            <input
              value={businessName}
              onChange={(e) => setBusinessName(e.target.value)}
              placeholder="e.g. Sindh Bakers"
              className="mt-1 w-full rounded-lg border border-line bg-panel px-3 py-2 text-sm text-ink outline-none focus:border-signal"
            />
          </label>

          <label className="block">
            <span className="text-xs font-medium text-ink-soft">
              Link when clicked (optional)
            </span>
            <input
              value={link}
              onChange={(e) => setLink(e.target.value)}
              placeholder="/posts/postId or https://..."
              className="mt-1 w-full rounded-lg border border-line bg-panel px-3 py-2 text-sm text-ink outline-none focus:border-signal"
            />
            <span className="mt-1 block text-[11px] text-ink-faint">
              Paste a business's post URL (e.g. /posts/123) to promote it, or any
              external link. Leave blank for a non-clickable slide.
            </span>
          </label>

          <button
            type="submit"
            disabled={isSavingBanner}
            className="brand-gradient flex w-full items-center justify-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold text-white transition hover:opacity-90 disabled:opacity-60"
          >
            {isSavingBanner ? <Loader size={15} className="animate-spin" /> : <ImagePlus size={15} />}
            {isSavingBanner ? "Adding..." : "Add banner"}
          </button>
        </form>

        {/* Existing banners */}
        <div>
          {isLoadingAdminBanners ? (
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="animate-shimmer aspect-[16/9] rounded-xl" />
              ))}
            </div>
          ) : adminBanners.length === 0 ? (
            <div className="grid h-full min-h-[160px] place-items-center rounded-xl border border-dashed border-line text-center text-sm text-ink-faint">
              No banners yet — add one to promote a business on the Home page.
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
              {adminBanners.map((b) => (
                <div
                  key={b._id}
                  className="overflow-hidden rounded-xl border border-line bg-panel-soft"
                >
                  <div className="relative aspect-[16/9] w-full">
                    <img src={b.image} alt={b.title} className="h-full w-full object-cover" />
                    {!b.isActive && (
                      <div className="absolute inset-0 grid place-items-center bg-ink/50 text-xs font-semibold text-white">
                        Hidden
                      </div>
                    )}
                  </div>
                  <div className="p-3">
                    <p className="truncate text-sm font-medium text-ink">{b.title}</p>
                    {b.businessName && (
                      <p className="truncate text-xs text-ink-faint">{b.businessName}</p>
                    )}
                    <div className="mt-2 flex items-center justify-end gap-1.5">
                      <button
                        onClick={() => toggleBannerActive(b._id, !b.isActive)}
                        title={b.isActive ? "Hide from Home page" : "Show on Home page"}
                        className="rounded-lg p-1.5 text-ink-soft transition hover:bg-panel hover:text-signal"
                      >
                        {b.isActive ? <Eye size={15} /> : <EyeOff size={15} />}
                      </button>
                      <button
                        onClick={() => deleteBanner(b._id)}
                        title="Delete banner"
                        className="rounded-lg p-1.5 text-ink-soft transition hover:bg-danger-soft hover:text-danger"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}


export default BannerManager;
