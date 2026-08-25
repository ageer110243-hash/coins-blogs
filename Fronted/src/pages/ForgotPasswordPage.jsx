import { useState } from "react";
import { Link } from "react-router-dom";
import { Mail, ArrowRight, MessageCircle, CheckCircle2 } from "lucide-react";
import { useAuthStore } from "../store/useAuthStore.js";
import AuthLayout from "../components/AuthLayout.jsx";

function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [devLink, setDevLink] = useState(null);
  const { forgotPassword, isSendingResetLink } = useAuthStore();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await forgotPassword(email);
    if (result) {
      setSent(true);
      if (typeof result === "string") setDevLink(result);
    }
  };

  return (
    <AuthLayout>
      <div className="mb-8 flex flex-col items-center gap-2 text-center lg:hidden">
        <span className="animate-ring-pulse brand-gradient grid h-12 w-12 place-items-center rounded-2xl text-white">
          <MessageCircle size={22} strokeWidth={2.4} />
        </span>
      </div>

      {sent ? (
        <div className="text-center lg:text-left">
          <span className="brand-gradient mx-auto grid h-12 w-12 place-items-center rounded-2xl text-white lg:mx-0">
            <CheckCircle2 size={22} />
          </span>
          <h1 className="mt-4 font-display text-2xl font-bold text-ink">
            Check your email
          </h1>
          <p className="mt-1 text-sm text-ink-faint">
            If an account exists for <span className="font-medium text-ink">{email}</span>,
            a password reset link is on its way.
          </p>

          {devLink && (
            <div className="mt-5 rounded-lg border border-dashed border-signal/40 bg-signal-soft p-3 text-left text-xs text-ink-soft">
              <p className="mb-1 font-semibold text-signal">
                Dev mode — no SMTP configured
              </p>
              <p className="mb-2">Since email isn't set up yet, here's your reset link directly:</p>
              <Link
                to={devLink.replace(window.location.origin, "")}
                className="break-all font-medium text-signal underline"
              >
                {devLink}
              </Link>
            </div>
          )}

          <Link
            to="/login"
            className="mt-6 inline-block text-sm font-medium text-signal hover:underline"
          >
            ← Back to login
          </Link>
        </div>
      ) : (
        <>
          <div className="mb-8 text-center lg:text-left">
            <h1 className="font-display text-2xl font-bold text-ink">
              Forgot your password?
            </h1>
            <p className="mt-1 text-sm text-ink-faint">
              Enter your email and we'll send you a reset link
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
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full rounded-lg border border-line bg-panel py-2.5 pl-9 pr-3 text-sm outline-none transition-all focus:border-signal focus:ring-4 focus:ring-signal-soft"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isSendingResetLink}
              className="brand-gradient group flex w-full items-center justify-center gap-2 rounded-lg py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:shadow-lg hover:brightness-105 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isSendingResetLink ? (
                "Sending…"
              ) : (
                <>
                  Send reset link
                  <ArrowRight
                    size={16}
                    className="transition-transform group-hover:translate-x-0.5"
                  />
                </>
              )}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-ink-faint lg:text-left">
            Remembered it?{" "}
            <Link to="/login" className="font-medium text-signal hover:underline">
              Back to login
            </Link>
          </p>
        </>
      )}
    </AuthLayout>
  );
}

export default ForgotPasswordPage;
