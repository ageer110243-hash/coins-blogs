import { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import {
  Users,
  MessageSquare,
  Activity,
  UserPlus,
  Search,
  Ban,
  CheckCircle2,
  Trash2,
  ShieldCheck,
  ImagePlus,
  Images,
  Eye,
  EyeOff,
  Loader,
  FileText,
  PlusCircle,
  ListChecks,
  MapPin,
} from "lucide-react";
import toast from "react-hot-toast";
import { useAdminStore } from "../store/useAdminStore.js";
import { useBannerStore } from "../store/useBannerStore.js";
import { usePostStore } from "../store/usePostStore.js";
import { formatLastSeen } from "../lib/utils.js";
import PostForm from "../components/PostForm.jsx";

function initials(name = "") {
  return name
    .split(" ")
    .map((p) => p[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

const STAT_ICONS = [Users, MessageSquare, Activity, UserPlus];

function StatCard({ icon: Icon, label, value, delay }) {
  return (
    <div
      className="card-elevated stagger-item rounded-2xl border border-line bg-panel p-5"
      style={{ animationDelay: `${delay}s` }}
    >
      <span className="brand-gradient grid h-10 w-10 place-items-center rounded-xl text-white">
        <Icon size={18} />
      </span>
      <p className="animate-count-up mt-4 font-display text-2xl font-bold text-ink">
        {value}
      </p>
      <p className="text-xs text-ink-faint">{label}</p>
    </div>
  );
}

// Lets an admin add/remove the promotional images shown in the Home page
// hero carousel (see HeroCarousel.jsx + useBannerStore.js). Kept as its
// own section here rather than a separate route since it's a small,
// occasional task.
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
    <div className="card-elevated animate-fade-in-up mt-6 rounded-2xl border border-line bg-panel">
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

// Lets an admin publish a post on behalf of the community (same form as
// the public "Create a Post" page) and browse/delete any post from one
// place, without needing to hunt it down on the Explore page first.
function PostManager() {
  const { adminPosts, isLoadingAdminPosts, isSavingPost, fetchAdminPosts, createPost, deletePost } =
    usePostStore();
  const [tab, setTab] = useState("create"); // "create" | "manage"
  const [query, setQuery] = useState("");

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
    <div className="card-elevated animate-fade-in-up mt-6 rounded-2xl border border-line bg-panel">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-line p-4">
        <div className="flex items-center gap-2">
          <FileText size={16} className="text-signal" />
          <h2 className="font-display text-sm font-semibold text-ink">Posts</h2>
        </div>

        <div className="flex gap-1 rounded-lg bg-panel-soft p-1">
          <button
            onClick={() => setTab("create")}
            className={`flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-semibold transition ${
              tab === "create" ? "bg-panel text-signal shadow-sm" : "text-ink-faint hover:text-ink"
            }`}
          >
            <PlusCircle size={13} />
            Create Post
          </button>
          <button
            onClick={() => setTab("manage")}
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

function AdminPage() {
  const { stats, users, weeklyActivity, isLoading, fetchDashboard, toggleSuspend, removeUser } =
    useAdminStore();
  const [query, setQuery] = useState("");

  useEffect(() => {
    fetchDashboard();
  }, [fetchDashboard]);

  const statCards = useMemo(
    () => [
      { label: "Total users", value: stats?.totalUsers ?? "—" },
      { label: "Messages sent", value: stats?.totalMessages ?? "—" },
      { label: "Online right now", value: stats?.onlineNow ?? "—" },
      { label: "New signups (7d)", value: stats?.newSignups7d ?? "—" },
    ],
    [stats]
  );

  const filtered = users.filter(
    (u) =>
      u.fullName.toLowerCase().includes(query.toLowerCase()) ||
      u.email.toLowerCase().includes(query.toLowerCase())
  );

  const maxActivity = Math.max(1, ...weeklyActivity.map((d) => d.value));

  if (isLoading && !stats) {
    return (
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-center px-4 py-24 text-center">
        <span className="animate-ring-pulse brand-gradient grid h-14 w-14 place-items-center rounded-2xl text-white">
          <ShieldCheck size={26} />
        </span>
        <p className="mt-4 text-sm text-ink-faint">Loading dashboard…</p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
      <div className="animate-fade-in-up mb-8 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl font-bold text-ink">
            Admin dashboard
          </h1>
          <p className="text-sm text-ink-faint">
            Live data from your SindhLink database.
          </p>
        </div>
        <span className="flex items-center gap-1.5 rounded-full bg-online-soft px-3 py-1.5 text-xs font-semibold text-online">
          <ShieldCheck size={14} />
          Connected to MongoDB
        </span>
      </div>

      {/* Stat cards */}
      <div className="mb-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
        {statCards.map((s, i) => (
          <StatCard key={s.label} {...s} icon={STAT_ICONS[i]} delay={i * 0.06} />
        ))}
      </div>

      <div className="mb-6 grid grid-cols-1 gap-4 lg:grid-cols-3">
        {/* Weekly activity chart */}
        <div className="card-elevated animate-fade-in-up rounded-2xl border border-line bg-panel p-5 lg:col-span-2">
          <h2 className="font-display text-sm font-semibold text-ink">
            Messages this week
          </h2>
          <div className="mt-6 flex h-40 items-end gap-3">
            {weeklyActivity.length === 0 ? (
              <p className="w-full self-center text-center text-sm text-ink-faint">
                No messages yet
              </p>
            ) : (
              weeklyActivity.map((d, i) => (
                <div
                  key={`${d.label}-${i}`}
                  className="flex flex-1 flex-col items-center gap-2"
                >
                  <div className="flex h-32 w-full items-end overflow-hidden rounded-lg bg-panel-soft">
                    <div
                      className="stagger-item w-full rounded-lg brand-gradient"
                      style={{
                        height: `${(d.value / maxActivity) * 100}%`,
                        animationDelay: `${0.1 + i * 0.06}s`,
                      }}
                      title={`${d.value} messages`}
                    />
                  </div>
                  <span className="text-[11px] font-medium text-ink-faint">
                    {d.label}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Status breakdown */}
        <div className="card-elevated animate-fade-in-up rounded-2xl border border-line bg-panel p-5">
          <h2 className="font-display text-sm font-semibold text-ink">
            Community status
          </h2>
          <div className="mt-4 space-y-3">
            {[
              {
                label: "Online now",
                count: users.filter((u) => u.online).length,
                color: "bg-online",
              },
              {
                label: "Offline",
                count: users.filter((u) => !u.online).length,
                color: "bg-ink-faint",
              },
              {
                label: "Suspended",
                count: users.filter((u) => u.status === "suspended").length,
                color: "bg-danger",
              },
            ].map((row) => (
              <div key={row.label} className="flex items-center gap-3">
                <span className={`h-2.5 w-2.5 rounded-full ${row.color}`} />
                <span className="flex-1 text-sm text-ink-soft">
                  {row.label}
                </span>
                <span className="text-sm font-semibold text-ink">
                  {row.count}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Users table */}
      <div className="card-elevated animate-fade-in-up rounded-2xl border border-line bg-panel">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-line p-4">
          <h2 className="font-display text-sm font-semibold text-ink">
            Users ({filtered.length})
          </h2>
          <div className="relative">
            <Search
              size={15}
              className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-ink-faint"
            />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search users"
              className="w-56 rounded-lg border border-line bg-panel-soft py-2 pl-9 pr-3 text-sm outline-none focus:border-signal"
            />
          </div>
        </div>

        <div className="thin-scroll overflow-x-auto">
          <table className="w-full min-w-[640px] text-left text-sm">
            <thead>
              <tr className="border-b border-line text-xs uppercase tracking-wide text-ink-faint">
                <th className="px-4 py-3 font-medium">User</th>
                <th className="px-4 py-3 font-medium">Role</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 font-medium">Messages</th>
                <th className="px-4 py-3 font-medium">Joined</th>
                <th className="px-4 py-3 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((u, i) => (
                <tr
                  key={u._id}
                  className="stagger-item border-b border-line last:border-0 hover:bg-panel-soft/60"
                  style={{ animationDelay: `${Math.min(i, 8) * 0.04}s` }}
                >
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <span className="brand-gradient grid h-9 w-9 shrink-0 place-items-center rounded-full text-xs font-semibold text-white">
                        {initials(u.fullName)}
                      </span>
                      <div className="min-w-0">
                        <p className="truncate font-medium text-ink">
                          {u.fullName}
                        </p>
                        <p className="truncate text-xs text-ink-faint">
                          {u.email}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`rounded-full px-2 py-0.5 text-xs font-semibold ${
                        u.role === "admin"
                          ? "bg-signal-soft text-signal"
                          : "bg-panel-soft text-ink-soft"
                      }`}
                    >
                      {u.role}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-semibold ${
                        u.status === "suspended"
                          ? "bg-danger-soft text-danger"
                          : "bg-online-soft text-online"
                      }`}
                    >
                      <span
                        className={`h-1.5 w-1.5 rounded-full ${
                          u.status === "suspended" ? "bg-danger" : "bg-online"
                        }`}
                      />
                      {u.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-ink-soft">{u.messagesSent}</td>
                  <td className="px-4 py-3 text-ink-faint">
                    {formatLastSeen(u.createdAt)}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex justify-end gap-1.5">
                      <button
                        onClick={() => toggleSuspend(u._id)}
                        title={u.status === "suspended" ? "Reactivate" : "Suspend"}
                        className="rounded-lg p-1.5 text-ink-soft transition hover:bg-panel-soft hover:text-signal"
                      >
                        {u.status === "suspended" ? (
                          <CheckCircle2 size={16} />
                        ) : (
                          <Ban size={16} />
                        )}
                      </button>
                      <button
                        onClick={() => removeUser(u._id)}
                        title="Remove user"
                        className="rounded-lg p-1.5 text-ink-soft transition hover:bg-danger-soft hover:text-danger"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td
                    colSpan={6}
                    className="px-4 py-10 text-center text-sm text-ink-faint"
                  >
                    {users.length === 0
                      ? "No users yet — sign up a couple of accounts to see them here."
                      : `No users match "${query}"`}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <PostManager />
      <BannerManager />
    </div>
  );
}

export default AdminPage;
