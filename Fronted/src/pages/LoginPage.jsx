import { useState } from "react";
import { Link } from "react-router-dom";
import { Mail, Lock, Eye, EyeOff, MessageCircle, ArrowRight } from "lucide-react";
import { useAuthStore } from "../store/useAuthStore.js";
import AuthLayout from "../components/AuthLayout.jsx";

function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({ email: "", password: "" });
  const { login, isLoggingIn } = useAuthStore();

  const handleSubmit = (e) => {
    e.preventDefault();
    login(formData);
  };

  return (
    <AuthLayout>
      <div className="mb-8 flex flex-col items-center gap-2 text-center lg:hidden">
        <span className="animate-ring-pulse brand-gradient grid h-12 w-12 place-items-center rounded-2xl text-white">
          <MessageCircle size={22} strokeWidth={2.4} />
        </span>
      </div>

      <div className="mb-8 text-center lg:text-left">
        <h1 className="font-display text-2xl font-bold text-ink">
          Welcome back 👋
        </h1>
        <p className="mt-1 text-sm text-ink-faint">
          Log in to keep the conversation going
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="mb-1 block text-xs font-medium text-ink-soft">
            Email
          </label>
          <div className="group relative">
            <Mail
              size={16}
              className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-ink-faint transition-colors group-focus-within:text-signal"
            />
            <input
              type="email"
              required
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              placeholder="you@example.com"
              className="w-full rounded-lg border border-line bg-panel py-2.5 pl-9 pr-3 text-sm outline-none transition-all focus:border-signal focus:ring-4 focus:ring-signal-soft"
            />
          </div>
        </div>

        <div>
          <label className="mb-1 block text-xs font-medium text-ink-soft">
            Password
          </label>
          <div className="group relative">
            <Lock
              size={16}
              className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-ink-faint transition-colors group-focus-within:text-signal"
            />
            <input
              type={showPassword ? "text" : "password"}
              required
              value={formData.password}
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
              placeholder="••••••••"
              className="w-full rounded-lg border border-line bg-panel py-2.5 pl-9 pr-9 text-sm outline-none transition-all focus:border-signal focus:ring-4 focus:ring-signal-soft"
            />
            <button
              type="button"
              onClick={() => setShowPassword((s) => !s)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-ink-faint transition-colors hover:text-signal"
            >
              {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
        </div>

        <button
          type="submit"
          disabled={isLoggingIn}
          className="brand-gradient group flex w-full items-center justify-center gap-2 rounded-lg py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:shadow-lg hover:brightness-105 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isLoggingIn ? (
            "Logging in…"
          ) : (
            <>
              Log in
              <ArrowRight
                size={16}
                className="transition-transform group-hover:translate-x-0.5"
              />
            </>
          )}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-ink-faint lg:text-left">
        Don't have an account?{" "}
        <Link to="/signup" className="font-medium text-signal hover:underline">
          Create one
        </Link>
      </p>
    </AuthLayout>
  );
}

export default LoginPage;
