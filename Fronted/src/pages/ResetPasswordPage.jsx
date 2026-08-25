import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Lock, Eye, EyeOff, ArrowRight, MessageCircle } from "lucide-react";
import { useAuthStore } from "../store/useAuthStore.js";
import AuthLayout from "../components/AuthLayout.jsx";

function ResetPasswordPage() {
  const { token } = useParams();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const { resetPassword, isResettingPassword } = useAuthStore();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password.length < 6) return;
    if (password !== confirm) return;
    const ok = await resetPassword(token, password);
    if (ok) navigate("/");
  };

  const mismatch = confirm.length > 0 && password !== confirm;

  return (
    <AuthLayout>
      <div className="mb-8 flex flex-col items-center gap-2 text-center lg:hidden">
        <span className="animate-ring-pulse brand-gradient grid h-12 w-12 place-items-center rounded-2xl text-white">
          <MessageCircle size={22} strokeWidth={2.4} />
        </span>
      </div>

      <div className="mb-8 text-center lg:text-left">
        <h1 className="font-display text-2xl font-bold text-ink">
          Set a new password
        </h1>
        <p className="mt-1 text-sm text-ink-faint">
          Choose a new password for your account
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="mb-1 block text-xs font-medium text-ink-soft">
            New password
          </label>
          <div className="group relative">
            <Lock
              size={16}
              className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-ink-faint transition-colors group-focus-within:text-signal"
            />
            <input
              type={showPassword ? "text" : "password"}
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
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

        <div>
          <label className="mb-1 block text-xs font-medium text-ink-soft">
            Confirm password
          </label>
          <div className="group relative">
            <Lock
              size={16}
              className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-ink-faint transition-colors group-focus-within:text-signal"
            />
            <input
              type={showPassword ? "text" : "password"}
              required
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              placeholder="Type it again"
              className={`w-full rounded-lg border bg-panel py-2.5 pl-9 pr-3 text-sm outline-none transition-all focus:ring-4 ${
                mismatch
                  ? "border-danger focus:border-danger focus:ring-danger-soft"
                  : "border-line focus:border-signal focus:ring-signal-soft"
              }`}
            />
          </div>
          {mismatch && (
            <p className="mt-1 text-xs text-danger">Passwords don't match</p>
          )}
        </div>

        <button
          type="submit"
          disabled={isResettingPassword || mismatch || password.length < 6}
          className="brand-gradient group flex w-full items-center justify-center gap-2 rounded-lg py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:shadow-lg hover:brightness-105 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isResettingPassword ? (
            "Updating…"
          ) : (
            <>
              Update password
              <ArrowRight
                size={16}
                className="transition-transform group-hover:translate-x-0.5"
              />
            </>
          )}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-ink-faint lg:text-left">
        <Link to="/login" className="font-medium text-signal hover:underline">
          ← Back to login
        </Link>
      </p>
    </AuthLayout>
  );
}

export default ResetPasswordPage;
