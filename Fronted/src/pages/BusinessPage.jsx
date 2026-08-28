import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, Heart, MessageCircle, BadgeCheck, Trash2, Store } from "lucide-react";
import toast from "react-hot-toast";
import { usePostStore } from "../store/usePostStore.js";
import { useAuthStore } from "../store/useAuthStore.js";
import { useChatStore } from "../store/useChatStore.js";
import { axiosInstance } from "../lib/axios.js";
import CreatePostModal from "../components/CreatePostModal.jsx";

function initials(name = "") {
  return name
    .split(" ")
    .map((p) => p[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

function PostCard({ post }) {
  const { authUser } = useAuthStore();
  const { toggleLike, deletePost, startInquiry } = usePostStore();
  const { selectContact } = useChatStore();
  const navigate = useNavigate();
  const [verified, setVerifiedLocal] = useState(post.verified);

  const isOwner = post.userId._id === authUser?._id;
  const isAdmin = authUser?.role === "admin";

  const handleToggleVerify = async () => {
    try {
      const res = await axiosInstance.patch(`/posts/${post._id}/verify`, {
        verified: !verified,
      });
      setVerifiedLocal(res.data.verified);
    } catch (error) {
      toast.error(error?.response?.data?.message || "Couldn't update verification");
    }
  };

  const handleMessage = async () => {
    const seller = await startInquiry(post._id);
    if (seller) {
      selectContact(seller);
      navigate("/");
    }
  };

  return (
    <div className="stagger-item card-elevated overflow-hidden rounded-2xl border border-line bg-panel">
      <div className="relative aspect-[4/3]">
        <img src={post.image} alt={post.title} className="h-full w-full object-cover" />
        <span className="absolute left-2 top-2 rounded-full bg-panel/90 px-2.5 py-1 text-[11px] font-semibold text-ink backdrop-blur-sm">
          {post.category}
        </span>
        {(isOwner || isAdmin) && (
          <button
            onClick={() => deletePost(post._id)}
            title="Remove post"
            className="absolute right-2 top-2 grid h-7 w-7 place-items-center rounded-full bg-black/50 text-white transition hover:bg-danger"
          >
            <Trash2 size={13} />
          </button>
        )}
      </div>

      <div className="p-4">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-display text-base font-bold leading-snug text-ink">
            {post.title}
          </h3>
          {isAdmin ? (
            <button
              onClick={handleToggleVerify}
              title={verified ? "Remove verified badge" : "Mark as verified business"}
              className={`mt-0.5 shrink-0 transition ${
                verified ? "text-signal" : "text-ink-faint hover:text-signal"
              }`}
            >
              <BadgeCheck size={17} fill={verified ? "currentColor" : "none"} />
            </button>
          ) : (
            verified && (
              <span title="Verified business" className="mt-0.5 shrink-0 text-signal">
                <BadgeCheck size={17} fill="currentColor" />
              </span>
            )
          )}
        </div>
        <p className="mt-1 line-clamp-3 text-sm leading-relaxed text-ink-soft">
          {post.description}
        </p>

        <div className="mt-3 flex items-center gap-2 text-xs text-ink-faint">
          <span className="brand-gradient grid h-5 w-5 place-items-center rounded-full text-[9px] font-semibold text-white">
            {post.userId.profilePic ? (
              <img
                src={post.userId.profilePic}
                alt=""
                className="h-full w-full rounded-full object-cover"
              />
            ) : (
              initials(post.userId.fullName)
            )}
          </span>
          {post.userId.fullName}
        </div>

        <div className="mt-4 flex items-center gap-2">
          <button
            onClick={() => toggleLike(post._id)}
            className={`flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-sm font-medium transition ${
              post.likedByMe
                ? "border-danger/30 bg-danger-soft text-danger"
                : "border-line text-ink-soft hover:bg-panel-soft"
            }`}
          >
            <Heart size={14} fill={post.likedByMe ? "currentColor" : "none"} />
            {post.likesCount}
          </button>
          {!isOwner && (
            <button
              onClick={handleMessage}
              className="brand-gradient flex flex-1 items-center justify-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-semibold text-white transition hover:shadow-md"
            >
              <MessageCircle size={14} />
              Message
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

function PostCardSkeleton() {
  return (
    <div className="overflow-hidden rounded-2xl border border-line bg-panel">
      <div className="aspect-[4/3] animate-pulse bg-line" />
      <div className="space-y-2 p-4">
        <div className="h-4 w-2/3 animate-pulse rounded bg-line" />
        <div className="h-3 w-full animate-pulse rounded bg-line" />
        <div className="h-3 w-4/5 animate-pulse rounded bg-line" />
      </div>
    </div>
  );
}

function BusinessPage() {
  const { posts, categories, activeCategory, isLoading, getPosts, getCategories, setCategory } =
    usePostStore();
  const [showCreate, setShowCreate] = useState(false);

  useEffect(() => {
    getCategories();
    getPosts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Store className="text-signal" size={22} />
          <h1 className="font-display text-2xl font-bold text-ink">Business Wall</h1>
        </div>
        <button
          onClick={() => setShowCreate(true)}
          className="brand-gradient flex items-center gap-1.5 rounded-lg px-4 py-2 text-sm font-semibold text-white transition hover:shadow-lg"
        >
          <Plus size={16} />
          Promote your business
        </button>
      </div>

      <div className="thin-scroll mb-6 flex gap-2 overflow-x-auto pb-1">
        {["All", ...categories].map((c) => (
          <button
            key={c}
            onClick={() => setCategory(c)}
            className={`shrink-0 rounded-full px-3.5 py-1.5 text-sm font-medium transition ${
              activeCategory === c
                ? "brand-gradient text-white"
                : "border border-line text-ink-soft hover:bg-panel-soft"
            }`}
          >
            {c}
          </button>
        ))}
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <PostCardSkeleton key={i} />
          ))}
        </div>
      ) : posts.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-line py-16 text-center">
          <Store className="mx-auto mb-3 text-ink-faint" size={28} />
          <p className="text-sm text-ink-faint">
            No businesses posted in this category yet — be the first!
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {posts.map((post, i) => (
            <div key={post._id} style={{ animationDelay: `${Math.min(i, 9) * 0.04}s` }}>
              <PostCard post={post} />
            </div>
          ))}
        </div>
      )}

      {showCreate && <CreatePostModal onClose={() => setShowCreate(false)} />}
    </div>
  );
}

export default BusinessPage;
