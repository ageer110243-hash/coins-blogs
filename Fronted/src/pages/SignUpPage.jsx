import { useState } from "react";
import { Link } from "react-router-dom";
import {
  Mail,
  Lock,
  User,
  Eye,
  EyeOff,
  MessageCircle,
  ArrowRight,
} from "lucide-react";
import toast from "react-hot-toast";
import { useAuthStore } from "../store/useAuthStore.js";
import AuthLayout from "../components/AuthLayout.jsx";

function validate(formData) {
  if (!formData.fullName.trim()) return "Full name is required";
  if (!formData.email.trim()) return "Email is required";
  if (!/\S+@\S+\.\S+/.test(formData.email)) return "Email looks invalid";
  if (formData.password.length < 6)
    return "Password must be at least 6 characters";
  return null;
}

function SignUpPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
  });
  const { signup, isSigningUp } = useAuthStore();

  const handleSubmit = (e) => {
    e.preventDefault();
    const error = validate(formData);
    if (error) return toast.error(error);
    signup(formData);
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
          Create your account
        </h1>
        <p className="mt-1 text-sm text-ink-faint">
          Join ChatWithMe and start chatting
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="mb-1 block text-xs font-medium text-ink-soft">
            Full name
          </label>
          <div className="group relative">
            <User
              size={16}
              className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-ink-faint transition-colors group-focus-within:text-signal"
            />
            <input
              type="text"
              value={formData.fullName}
              onChange={(e) =>
                setFormData({ ...formData, fullName: e.target.value })
              }
              placeholder="Alamgeer Khan"
              className="w-full rounded-lg border border-line bg-panel py-2.5 pl-9 pr-3 text-sm outline-none transition-all focus:border-signal focus:ring-4 focus:ring-signal-soft"
            />
          </div>
        </div>

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
              value={formData.password}
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
              placeholder="At least 6 characters"
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
          disabled={isSigningUp}
          className="brand-gradient group flex w-full items-center justify-center gap-2 rounded-lg py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:shadow-lg hover:brightness-105 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isSigningUp ? (
            "Creating account…"
          ) : (
            <>
              Create account
              <ArrowRight
                size={16}
                className="transition-transform group-hover:translate-x-0.5"
              />
            </>
          )}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-ink-faint lg:text-left">
        Already have an account?{" "}
        <Link to="/login" className="font-medium text-signal hover:underline">
          Log in
        </Link>
      </p>
    </AuthLayout>
  );
}

export default SignUpPage;
