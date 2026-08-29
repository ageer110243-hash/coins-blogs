import { useEffect, useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import {
  MessageCircle,
  LogOut,
  LayoutDashboard,
  Settings,
  Home,
  Compass,
  PlusCircle,
  Info,
  Menu,
  X,
} from "lucide-react";
import { useAuthStore } from "../store/useAuthStore.js";

const NAV_ITEMS = [
  { to: "/", end: true, label: "Home", icon: Home },
  { to: "/explore", label: "Explore", icon: Compass },
  { to: "/chat", label: "Chat", icon: MessageCircle },
  { to: "/create-post", label: "Create Post", icon: PlusCircle },
  { to: "/about", label: "About", icon: Info },
];

const desktopLinkClass = ({ isActive }) =>
  `relative flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-sm font-medium transition after:absolute after:-bottom-[1px] after:left-2.5 after:right-2.5 after:h-0.5 after:origin-left after:scale-x-0 after:rounded-full after:bg-gold after:transition-transform after:duration-300 ${
    isActive
      ? "text-white after:scale-x-100"
      : "text-white/70 hover:bg-white/10 hover:text-white"
  }`;

const mobileLinkClass = ({ isActive }) =>
  `flex items-center gap-3 rounded-xl px-3.5 py-3 text-[15px] font-medium transition ${
    isActive
      ? "bg-white/15 text-white"
      : "text-white/75 hover:bg-white/10 hover:text-white"
  }`;

function Navbar() {
  const { authUser, logout } = useAuthStore();
  const [open, setOpen] = useState(false);
  const location = useLocation();

  // Close the mobile drawer on every route change.
  useEffect(() => {
    setOpen(false);
  }, [location.pathname]);

  // Lock page scroll while the mobile drawer is open.
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <header className="sticky top-0 z-40">
      <div className="ink-gradient relative">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-2 px-4">
          <Link to="/" className="group flex shrink-0 items-center gap-2">
            <span className="brand-gradient relative grid h-9 w-9 place-items-center rounded-lg text-white shadow-sm transition-transform duration-300 group-hover:scale-105 group-hover:rotate-3">
              <MessageCircle size={18} strokeWidth={2.4} />
            </span>
            <span className="font-display text-lg font-bold tracking-tight text-white">
              Sindh<span className="text-gold">Link</span>
            </span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden flex-1 items-center gap-0.5 overflow-x-auto md:flex md:justify-center">
            {NAV_ITEMS.map(({ to, end, label, icon: Icon }) => (
              <NavLink key={to} to={to} end={end} className={desktopLinkClass}>
                <Icon size={15} />
                <span>{label}</span>
              </NavLink>
            ))}
            {authUser?.role === "admin" && (
              <NavLink to="/admin" className={desktopLinkClass}>
                <LayoutDashboard size={15} />
                <span>Admin</span>
              </NavLink>
            )}
          </nav>

          {/* Desktop right side */}
          <div className="hidden shrink-0 items-center gap-1.5 md:flex md:gap-3">
            {authUser ? (
              <>
                <span className="mx-1 hidden h-5 w-px bg-white/15 lg:block" />
                <Link
                  to="/settings"
                  title="Settings"
                  className="grid h-9 w-9 place-items-center rounded-lg text-white/75 transition hover:bg-white/10 hover:text-white"
                >
                  <Settings size={16} />
                </Link>
                <span className="hidden items-center gap-2 text-sm text-white/85 lg:flex">
                  {authUser.profilePic ? (
                    <img
                      src={authUser.profilePic}
                      alt=""
                      className="h-7 w-7 rounded-full object-cover ring-2 ring-white/15"
                    />
                  ) : (
                    <span className="grid h-7 w-7 place-items-center rounded-full bg-gold text-xs font-semibold text-ink">
                      {(authUser.fullName || authUser.email || "?")[0]?.toUpperCase()}
                    </span>
                  )}
                  {authUser.fullName || authUser.email}
                </span>
                <button
                  onClick={logout}
                  className="btn-press flex items-center gap-1.5 rounded-lg border border-white/15 px-3 py-1.5 text-sm font-medium text-white/80 transition hover:border-accent/50 hover:bg-accent/20 hover:text-white"
                >
                  <LogOut size={15} />
                  <span>Log out</span>
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="rounded-lg px-3 py-1.5 text-sm font-medium text-white/80 transition hover:bg-white/10 hover:text-white"
                >
                  Login
                </Link>
                <Link
                  to="/signup"
                  className="btn-press rounded-lg bg-gold px-3.5 py-1.5 text-sm font-semibold text-ink transition hover:opacity-90 hover:shadow-md"
                >
                  Sign up
                </Link>
              </>
            )}
          </div>

          {/* Mobile trigger */}
          <button
            onClick={() => setOpen((v) => !v)}
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            className="grid h-10 w-10 shrink-0 place-items-center rounded-lg text-white transition hover:bg-white/10 md:hidden"
          >
            {open ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        <div className="pattern-trellis" style={{ "--pattern-color": "var(--color-gold)" }} />
      </div>

      {/* Mobile drawer */}
      {open && (
        <div className="ink-gradient animate-fade-in-up border-t border-white/10 md:hidden">
          <nav className="mx-auto flex max-w-6xl flex-col gap-1 px-4 py-4">
            {NAV_ITEMS.map(({ to, end, label, icon: Icon }) => (
              <NavLink key={to} to={to} end={end} className={mobileLinkClass}>
                <Icon size={17} />
                <span>{label}</span>
              </NavLink>
            ))}
            {authUser?.role === "admin" && (
              <NavLink to="/admin" className={mobileLinkClass}>
                <LayoutDashboard size={17} />
                <span>Admin</span>
              </NavLink>
            )}

            <div className="my-2 h-px bg-white/10" />

            {authUser ? (
              <>
                <div className="flex items-center gap-3 rounded-xl px-3.5 py-2.5">
                  {authUser.profilePic ? (
                    <img
                      src={authUser.profilePic}
                      alt=""
                      className="h-9 w-9 rounded-full object-cover ring-2 ring-white/15"
                    />
                  ) : (
                    <span className="grid h-9 w-9 place-items-center rounded-full bg-gold text-sm font-semibold text-ink">
                      {(authUser.fullName || authUser.email || "?")[0]?.toUpperCase()}
                    </span>
                  )}
                  <span className="truncate text-sm font-medium text-white/90">
                    {authUser.fullName || authUser.email}
                  </span>
                </div>
                <NavLink to="/settings" className={mobileLinkClass}>
                  <Settings size={17} />
                  <span>Settings</span>
                </NavLink>
                <button
                  onClick={logout}
                  className="btn-press flex items-center gap-3 rounded-xl px-3.5 py-3 text-left text-[15px] font-medium text-white/75 transition hover:bg-accent/20 hover:text-white"
                >
                  <LogOut size={17} />
                  <span>Log out</span>
                </button>
              </>
            ) : (
              <div className="flex items-center gap-2 px-1 pt-1">
                <Link
                  to="/login"
                  className="flex-1 rounded-xl border border-white/15 px-3 py-2.5 text-center text-sm font-medium text-white/85 transition hover:bg-white/10"
                >
                  Login
                </Link>
                <Link
                  to="/signup"
                  className="btn-press flex-1 rounded-xl bg-gold px-3 py-2.5 text-center text-sm font-semibold text-ink transition hover:opacity-90"
                >
                  Sign up
                </Link>
              </div>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}

export default Navbar;
