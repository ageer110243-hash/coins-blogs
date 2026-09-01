import { useEffect, useState } from "react";
import { Link, NavLink, Outlet, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  FileText,
  Images,
  LogOut,
  ArrowLeft,
  Menu,
  MessageCircle,
} from "lucide-react";
import { useAuthStore } from "../store/useAuthStore.js";

const NAV_ITEMS = [
  { to: "/admin", end: true, label: "Dashboard", icon: LayoutDashboard },
  { to: "/admin/users", label: "Users", icon: Users },
  { to: "/admin/posts", label: "Posts", icon: FileText },
  { to: "/admin/banners", label: "Banners", icon: Images },
];

const PAGE_TITLES = {
  "/admin": "Dashboard",
  "/admin/users": "Users",
  "/admin/posts": "Posts",
  "/admin/banners": "Banners",
};

function initials(name = "") {
  return name
    .split(" ")
    .map((p) => p[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

function SidebarContent({ authUser, onLogout, onNavigate }) {
  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center gap-2 px-5 py-5">
        <span className="brand-gradient grid h-9 w-9 place-items-center rounded-lg text-white shadow-sm">
          <MessageCircle size={18} strokeWidth={2.4} />
        </span>
        <div className="min-w-0">
          <p className="font-display text-base font-bold leading-none text-white">
            Sindh<span className="text-gold">Link</span>
          </p>
          <p className="mt-1 text-[11px] font-medium uppercase tracking-wide text-white/50">
            Admin panel
          </p>
        </div>
      </div>

      <div className="pattern-trellis mx-5 mb-2" style={{ "--pattern-color": "var(--color-gold)" }} />

      <nav className="flex-1 space-y-1 px-3 py-2">
        {NAV_ITEMS.map(({ to, end, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            onClick={onNavigate}
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-medium transition ${
                isActive
                  ? "bg-white/15 text-white"
                  : "text-white/65 hover:bg-white/10 hover:text-white"
              }`
            }
          >
            <Icon size={17} />
            {label}
          </NavLink>
        ))}
      </nav>

      <div className="space-y-1 border-t border-white/10 px-3 py-4">
        <Link
          to="/"
          className="flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-medium text-white/65 transition hover:bg-white/10 hover:text-white"
        >
          <ArrowLeft size={17} />
          Back to site
        </Link>

        <div className="flex items-center gap-3 px-3.5 py-2.5">
          {authUser?.profilePic ? (
            <img
              src={authUser.profilePic}
              alt=""
              className="h-8 w-8 rounded-full object-cover ring-2 ring-white/15"
            />
          ) : (
            <span className="grid h-8 w-8 place-items-center rounded-full bg-gold text-xs font-semibold text-ink">
              {initials(authUser?.fullName)}
            </span>
          )}
          <div className="min-w-0 flex-1">
            <p className="truncate text-xs font-semibold text-white">
              {authUser?.fullName}
            </p>
            <p className="truncate text-[11px] text-white/50">{authUser?.email}</p>
          </div>
        </div>

        <button
          onClick={onLogout}
          className="btn-press flex w-full items-center gap-3 rounded-xl px-3.5 py-2.5 text-left text-sm font-medium text-white/65 transition hover:bg-accent/20 hover:text-white"
        >
          <LogOut size={17} />
          Log out
        </button>
      </div>
    </div>
  );
}

function AdminLayout() {
  const { authUser, logout } = useAuthStore();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  const pageTitle = PAGE_TITLES[location.pathname] || "Admin";

  return (
    <div className="flex min-h-svh bg-paper">
      {/* Desktop sidebar */}
      <aside className="ink-gradient sticky top-0 hidden h-svh w-64 shrink-0 lg:block">
        <SidebarContent authUser={authUser} onLogout={logout} />
      </aside>

      {/* Mobile off-canvas sidebar */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="absolute inset-0 bg-ink/60 backdrop-blur-sm"
            onClick={() => setMobileOpen(false)}
          />
          <aside className="ink-gradient animate-fade-in-up relative h-full w-72 max-w-[80vw]">
            <SidebarContent
              authUser={authUser}
              onLogout={logout}
              onNavigate={() => setMobileOpen(false)}
            />
          </aside>
        </div>
      )}

      {/* Main content */}
      <div className="min-w-0 flex-1">
        <header className="sticky top-0 z-20 flex items-center gap-3 border-b border-line bg-panel/90 px-4 py-3.5 backdrop-blur-md sm:px-6">
          <button
            onClick={() => setMobileOpen(true)}
            className="grid h-9 w-9 place-items-center rounded-lg text-ink-soft transition hover:bg-panel-soft lg:hidden"
          >
            <Menu size={19} />
          </button>
          <h1 className="font-display text-lg font-bold text-ink">{pageTitle}</h1>
        </header>

        <main className="px-4 py-6 sm:px-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default AdminLayout;
