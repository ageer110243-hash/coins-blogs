import { Link, NavLink } from "react-router-dom";
import { MessageCircle, LogOut, LayoutDashboard, Settings } from "lucide-react";
import { useAuthStore } from "../store/useAuthStore.js";

function Navbar() {
  const { authUser, logout } = useAuthStore();

  return (
    <header className="sticky top-0 z-30 border-b border-line bg-panel/80 backdrop-blur-md">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4">
        <Link to="/" className="group flex items-center gap-2">
          <span className="brand-gradient relative grid h-8 w-8 place-items-center rounded-lg text-white shadow-sm transition-transform duration-300 group-hover:scale-105 group-hover:rotate-3">
            <MessageCircle size={17} strokeWidth={2.4} />
          </span>
          <span className="font-display text-lg font-bold tracking-tight text-ink">
            Chat<span className="brand-gradient-text">WithMe</span>
          </span>
        </Link>

        {authUser && (
          <nav className="flex items-center gap-1.5 sm:gap-3">
            <NavLink
              to="/"
              end
              className={({ isActive }) =>
                `hidden items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium transition sm:flex ${
                  isActive
                    ? "bg-signal-soft text-signal"
                    : "text-ink-soft hover:bg-panel-soft hover:text-ink"
                }`
              }
            >
              <MessageCircle size={15} />
              Chats
            </NavLink>
            {authUser.role === "admin" && (
              <NavLink
                to="/admin"
                className={({ isActive }) =>
                  `flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium transition ${
                    isActive
                      ? "bg-signal-soft text-signal"
                      : "text-ink-soft hover:bg-panel-soft hover:text-ink"
                  }`
                }
              >
                <LayoutDashboard size={15} />
                <span className="hidden sm:inline">Admin</span>
              </NavLink>
            )}

            <span className="mx-1 hidden h-5 w-px bg-line md:block" />

            <Link
              to="/settings"
              title="Settings"
              className="grid h-9 w-9 place-items-center rounded-lg text-ink-soft transition hover:bg-panel-soft hover:text-ink"
            >
              <Settings size={16} />
            </Link>

            <span className="hidden items-center gap-2 text-sm text-ink-soft md:flex">
              {authUser.profilePic ? (
                <img
                  src={authUser.profilePic}
                  alt=""
                  className="h-7 w-7 rounded-full object-cover"
                />
              ) : (
                <span className="grid h-7 w-7 place-items-center rounded-full bg-signal-soft text-xs font-semibold text-signal">
                  {(authUser.fullName || authUser.email || "?")[0]?.toUpperCase()}
                </span>
              )}
              {authUser.fullName || authUser.email}
            </span>

            <button
              onClick={logout}
              className="flex items-center gap-1.5 rounded-lg border border-line px-3 py-1.5 text-sm font-medium text-ink-soft transition hover:border-danger/40 hover:bg-danger-soft hover:text-danger"
            >
              <LogOut size={15} />
              <span className="hidden sm:inline">Log out</span>
            </button>
          </nav>
        )}
      </div>
    </header>
  );
}

export default Navbar;
