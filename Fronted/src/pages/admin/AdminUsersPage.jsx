import { useEffect, useState } from "react";
import { Search, Ban, CheckCircle2, Trash2 } from "lucide-react";
import { useAdminStore } from "../../store/useAdminStore.js";
import { formatLastSeen } from "../../lib/utils.js";

function initials(name = "") {
  return name
    .split(" ")
    .map((p) => p[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

function AdminUsersPage() {
  const { users, fetchDashboard, toggleSuspend, removeUser } = useAdminStore();
  const [query, setQuery] = useState("");

  useEffect(() => {
    fetchDashboard();
  }, [fetchDashboard]);

  const filtered = users.filter(
    (u) =>
      u.fullName.toLowerCase().includes(query.toLowerCase()) ||
      u.email.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div>
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

export default AdminUsersPage;
