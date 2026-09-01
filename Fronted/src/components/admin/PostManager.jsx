import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  Search,
  Trash2,
  FileText,
  PlusCircle,
  ListChecks,
  MapPin,
  Pencil,
} from "lucide-react";
import { usePostStore } from "../../store/usePostStore.js";
import PostForm from "../PostForm.jsx";

function PostManager() {
  const {
    adminPosts,
    isLoadingAdminPosts,
    isSavingPost,
    fetchAdminPosts,
    createPost,
    updatePost,
    deletePost,
  } = usePostStore();
  const [tab, setTab] = useState("create"); // "create" | "manage"
  const [query, setQuery] = useState("");
  const [editingPost, setEditingPost] = useState(null);

  useEffect(() => {
    if (tab === "manage") fetchAdminPosts();
  }, [tab, fetchAdminPosts]);

  const handleCreate = async (payload) => {
    const created = await createPost(payload);
    if (created) {
      fetchAdminPosts();
    }
    return created;
  };

  const handleUpdate = async (payload) => {
    const result = await updatePost(editingPost._id, payload);
    if (result) setEditingPost(null); // back to the list once saved
    return result;
  };

  const handleDelete = async (id, title) => {
    if (!window.confirm(`Delete "${title}"? This cannot be undone.`)) return;
    await deletePost(id);
  };

  const filtered = adminPosts.filter(
    (p) =>
      p.title.toLowerCase().includes(query.toLowerCase()) ||
      (p.organizationName || "").toLowerCase().includes(query.toLowerCase()) ||
      (p.author?.fullName || "").toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="card-elevated animate-fade-in-up rounded-2xl border border-line bg-panel">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-line p-4">
        <div className="flex items-center gap-2">
          <FileText size={16} className="text-signal" />
          <h2 className="font-display text-sm font-semibold text-ink">Posts</h2>
        </div>

        <div className="flex gap-1 rounded-lg bg-panel-soft p-1">
          <button
            onClick={() => {
              setTab("create");
              setEditingPost(null);
            }}
            className={`flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-semibold transition ${
              tab === "create" ? "bg-panel text-signal shadow-sm" : "text-ink-faint hover:text-ink"
            }`}
          >
            <PlusCircle size={13} />
            Create Post
          </button>
          <button
            onClick={() => {
              setTab("manage");
              setEditingPost(null);
            }}
            className={`flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-semibold transition ${
              tab === "manage" ? "bg-panel text-signal shadow-sm" : "text-ink-faint hover:text-ink"
            }`}
          >
            <ListChecks size={13} />
            Manage All
          </button>
        </div>
      </div>

      {tab === "create" ? (
        <div className="animate-fade-in-up p-4 sm:p-6">
          <p className="mb-4 text-xs text-ink-faint">
            Published under your admin account — shows up on Explore and the Home page just
            like any other post.
          </p>
          <PostForm onSubmit={handleCreate} isSaving={isSavingPost} submitLabel="Publish Post" />
        </div>
      ) : editingPost ? (
        <div className="animate-fade-in-up p-4 sm:p-6">
          <div className="mb-4 flex items-center justify-between">
            <p className="text-xs text-ink-faint">
              Editing <span className="font-medium text-ink">{editingPost.title}</span> — pick a
              new image below to replace the current one, or leave it as is.
            </p>
            <button
              onClick={() => setEditingPost(null)}
              className="shrink-0 text-xs font-medium text-ink-soft transition hover:text-ink"
            >
              Cancel
            </button>
          </div>
          <PostForm
            key={editingPost._id}
            initialPost={editingPost}
            onSubmit={handleUpdate}
            isSaving={isSavingPost}
            submitLabel="Save Changes"
          />
        </div>
      ) : (
        <div className="animate-fade-in-up p-4">
          <div className="relative mb-4">
            <Search size={15} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-ink-faint" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search all posts"
              className="w-full rounded-lg border border-line bg-panel-soft py-2 pl-9 pr-3 text-sm outline-none transition focus:border-signal sm:w-72"
            />
          </div>

          {isLoadingAdminPosts ? (
            <div className="space-y-2">
              {[1, 2, 3].map((i) => (
                <div key={i} className="animate-shimmer h-16 rounded-xl" />
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <div className="grid min-h-[140px] place-items-center rounded-xl border border-dashed border-line text-center text-sm text-ink-faint">
              {adminPosts.length === 0 ? "No posts yet." : `No posts match "${query}"`}
            </div>
          ) : (
            <div className="thin-scroll max-h-[420px] space-y-2 overflow-y-auto pr-1">
              {filtered.map((p, i) => (
                <div
                  key={p._id}
                  className="stagger-item flex items-center gap-3 rounded-xl border border-line p-2.5 transition hover:bg-panel-soft"
                  style={{ animationDelay: `${Math.min(i, 8) * 0.03}s` }}
                >
                  <div className="h-12 w-16 shrink-0 overflow-hidden rounded-lg bg-panel-soft">
                    {p.image ? (
                      <img src={p.image} alt="" className="h-full w-full object-cover" />
                    ) : (
                      <div className="grid h-full w-full place-items-center text-ink-faint">
                        <FileText size={16} />
                      </div>
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-ink">{p.title}</p>
                    <div className="mt-0.5 flex flex-wrap items-center gap-x-3 gap-y-0.5 text-xs text-ink-faint">
                      <span className="rounded-full bg-signal-soft px-1.5 py-0.5 text-signal">
                        {p.category}
                      </span>
                      <span className="inline-flex items-center gap-1">
                        <MapPin size={11} />
                        {p.city}
                      </span>
                      <span>by {p.author?.fullName || "unknown"}</span>
                    </div>
                  </div>
                  <Link
                    to={`/posts/${p._id}`}
                    className="shrink-0 rounded-lg px-2 py-1 text-xs font-medium text-ink-soft transition hover:bg-panel hover:text-signal"
                  >
                    View
                  </Link>
                  <button
                    onClick={() => setEditingPost(p)}
                    title="Edit post"
                    className="shrink-0 rounded-lg p-1.5 text-ink-soft transition hover:bg-signal-soft hover:text-signal"
                  >
                    <Pencil size={15} />
                  </button>
                  <button
                    onClick={() => handleDelete(p._id, p.title)}
                    title="Delete post"
                    className="shrink-0 rounded-lg p-1.5 text-ink-soft transition hover:bg-danger-soft hover:text-danger"
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default PostManager;
