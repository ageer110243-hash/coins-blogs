import { useEffect, useMemo } from "react";
import { Users, MessageSquare, Activity, UserPlus, ShieldCheck } from "lucide-react";
import { useAdminStore } from "../../store/useAdminStore.js";

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

function AdminDashboardPage() {
  const { stats, users, weeklyActivity, isLoading, fetchDashboard } = useAdminStore();

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

  const maxActivity = Math.max(1, ...weeklyActivity.map((d) => d.value));

  if (isLoading && !stats) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <span className="animate-ring-pulse brand-gradient grid h-14 w-14 place-items-center rounded-2xl text-white">
          <ShieldCheck size={26} />
        </span>
        <p className="mt-4 text-sm text-ink-faint">Loading dashboard…</p>
      </div>
    );
  }

  return (
    <div>
      <div className="animate-fade-in-up mb-6 flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-ink-faint">Live data from your SindhLink database.</p>
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

    </div>
  );
}

export default AdminDashboardPage;
