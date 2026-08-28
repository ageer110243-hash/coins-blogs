import { useEffect, useMemo, useState } from "react";
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
} from "lucide-react";
import { useAdminStore } from "../store/useAdminStore.js";
import { formatLastSeen } from "../lib/utils.js";

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
            Live data from your CoinsBlogs database.
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
    </div>
  );
}

export default AdminPage;
