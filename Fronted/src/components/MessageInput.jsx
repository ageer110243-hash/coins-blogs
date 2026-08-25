import { useRef, useState } from "react";
import { Send, ImagePlus, X, Reply } from "lucide-react";
import toast from "react-hot-toast";
import { useChatStore } from "../store/useChatStore.js";

const MAX_IMAGE_MB = 5;

function MessageInput() {
  const [text, setText] = useState("");
  const [imagePreview, setImagePreview] = useState(null);
  const fileInputRef = useRef(null);
  const { sendMessage, isSending, replyingTo, clearReplyingTo } = useChatStore();

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

  const removeImage = () => {
    setImagePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!text.trim() && !imagePreview) return;
    sendMessage({ text, image: imagePreview });
    setText("");
    removeImage();
  };

  return (
    <div className="border-t border-line bg-panel p-3 sm:p-4">
      {replyingTo && (
        <div className="mb-2 flex items-center gap-2 rounded-lg bg-panel-soft py-1.5 pl-3 pr-2">
          <Reply size={14} className="shrink-0 text-signal" />
          <div className="min-w-0 flex-1">
            <p className="text-xs font-medium text-signal">Replying to</p>
            <p className="truncate text-xs text-ink-faint">
              {replyingTo.image && !replyingTo.text ? "Photo" : replyingTo.text}
            </p>
          </div>
          <button
            onClick={clearReplyingTo}
            type="button"
            className="grid h-6 w-6 shrink-0 place-items-center rounded-full text-ink-faint hover:bg-line"
          >
            <X size={13} />
          </button>
        </div>
      )}
      {imagePreview && (
        <div className="mb-2 flex items-center gap-2">
          <div className="relative">
            <img
              src={imagePreview}
              alt="Selected"
              className="h-16 w-16 rounded-lg border border-line object-cover"
            />
            <button
              onClick={removeImage}
              type="button"
              className="absolute -right-1.5 -top-1.5 grid h-5 w-5 place-items-center rounded-full bg-ink text-white"
            >
              <X size={12} />
            </button>
          </div>
        </div>
      )}
      <form onSubmit={handleSubmit} className="flex items-center gap-2">
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleImageChange}
        />
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="grid h-10 w-10 shrink-0 place-items-center rounded-full text-ink-soft transition hover:bg-panel-soft hover:text-signal"
        >
          <ImagePlus size={19} />
        </button>
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Type a message"
          className="flex-1 rounded-full border border-line bg-panel-soft px-4 py-2.5 text-sm outline-none transition-all focus:border-signal focus:ring-4 focus:ring-signal-soft"
        />
        <button
          type="submit"
          disabled={(!text.trim() && !imagePreview) || isSending}
          className="brand-gradient grid h-10 w-10 shrink-0 place-items-center rounded-full text-white transition-all hover:shadow-lg active:scale-90 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:shadow-none"
        >
          <Send size={17} />
        </button>
      </form>
    </div>
  );
}

export default MessageInput;
