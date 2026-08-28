import { useRef, useState } from "react";
import { X, ImagePlus } from "lucide-react";
import toast from "react-hot-toast";
import { usePostStore } from "../store/usePostStore.js";

const MAX_IMAGE_MB = 5;

function CreatePostModal({ onClose }) {
  const { categories, createPost, isCreating } = usePostStore();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState(categories[0] || "Other");
  const [imagePreview, setImagePreview] = useState(null);
  const fileInputRef = useRef(null);

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file");
      return;
    }
    if (file.size > MAX_IMAGE_MB * 1024 * 1024) {
      toast.error(`Image must be under ${MAX_IMAGE_MB}MB`);
      return;
    }
    const reader = new FileReader();
    reader.onload = () => setImagePreview(reader.result);
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim() || !description.trim() || !imagePreview) {
      toast.error("Title, description, and a photo are all required");
      return;
    }
    const ok = await createPost({
      title,
      description,
      image: imagePreview,
      category,
    });
    if (ok) onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-ink/40 p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="animate-pop-in w-full max-w-md rounded-2xl bg-panel p-6 shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-display text-lg font-bold text-ink">Promote your business</h2>
          <button
            onClick={onClose}
            className="grid h-8 w-8 place-items-center rounded-lg text-ink-faint transition hover:bg-panel-soft hover:text-ink"
          >
            <X size={16} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            {imagePreview ? (
              <div className="relative">
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="h-40 w-full rounded-xl object-cover"
                />
                <button
                  type="button"
                  onClick={() => setImagePreview(null)}
                  className="absolute right-2 top-2 grid h-7 w-7 place-items-center rounded-full bg-black/50 text-white"
                >
                  <X size={14} />
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="flex h-40 w-full flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-line text-ink-faint transition hover:border-signal hover:text-signal"
              >
                <ImagePlus size={22} />
                <span className="text-sm font-medium">Add a photo</span>
              </button>
            )}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleImageChange}
            />
          </div>

          <div>
            <label className="mb-1 block text-xs font-medium text-ink-soft">
              Business / title
            </label>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value.slice(0, 80))}
              placeholder="e.g. Areeba's Home Bakery"
              className="w-full rounded-lg border border-line bg-panel-soft px-3 py-2.5 text-sm outline-none transition-all focus:border-signal focus:ring-4 focus:ring-signal-soft"
            />
          </div>

          <div>
            <label className="mb-1 block text-xs font-medium text-ink-soft">Category</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full rounded-lg border border-line bg-panel-soft px-3 py-2.5 text-sm outline-none transition-all focus:border-signal focus:ring-4 focus:ring-signal-soft"
            >
              {categories.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          <div>
            <div className="mb-1 flex items-center justify-between">
              <label className="block text-xs font-medium text-ink-soft">Description</label>
              <span className="text-[11px] text-ink-faint">{description.length}/500</span>
            </div>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value.slice(0, 500))}
              placeholder="What are you offering? Prices, contact details, anything people should know."
              rows={4}
              className="w-full resize-none rounded-lg border border-line bg-panel-soft px-3 py-2.5 text-sm outline-none transition-all focus:border-signal focus:ring-4 focus:ring-signal-soft"
            />
          </div>

          <button
            type="submit"
            disabled={isCreating}
            className="brand-gradient w-full rounded-lg px-4 py-2.5 text-sm font-semibold text-white transition hover:shadow-lg disabled:opacity-60"
          >
            {isCreating ? "Posting…" : "Post it"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default CreatePostModal;
