import { MessageCircle, ShieldCheck, Zap, Users } from "lucide-react";

const FEATURES = [
  { icon: Zap, text: "Real-time messaging that feels instant" },
  { icon: Users, text: "See who's online, right from your sidebar" },
  { icon: ShieldCheck, text: "Private conversations, built on your own backend" },
];

function AuthLayout({ children }) {
  return (
    <div className="grid min-h-[calc(100svh-74px)] grid-cols-1 lg:grid-cols-2">
      {/* Left — animated brand hero, hidden on small screens */}
      <div className="brand-gradient relative hidden overflow-hidden lg:flex lg:flex-col lg:justify-between lg:p-12">
        <div
          className="animate-blob absolute -left-24 -top-24 h-80 w-80 rounded-full bg-white/10 blur-3xl"
          aria-hidden="true"
        />
        <div
          className="animate-blob-slow absolute -bottom-32 -right-16 h-96 w-96 rounded-full bg-white/10 blur-3xl"
          aria-hidden="true"
        />
        <div
          className="absolute inset-0 opacity-[0.08]"
          style={{
            backgroundImage:
              "radial-gradient(circle, white 1px, transparent 1px)",
            backgroundSize: "22px 22px",
          }}
          aria-hidden="true"
        />

        <div className="relative animate-fade-in-up">
          <span className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-white/15 text-white backdrop-blur-sm">
            <MessageCircle size={22} strokeWidth={2.4} />
          </span>
          <h1 className="mt-6 font-display text-4xl font-bold leading-tight text-white">
            Sindh<span className="text-gold">Link</span>
          </h1>
          <p className="mt-3 max-w-sm text-[15px] leading-relaxed text-white/80">
            Universities, academies and businesses across Sindh — with a live
            chat to talk to the people behind every listing.
          </p>
        </div>

        <div className="relative flex flex-col gap-4">
          {FEATURES.map(({ icon: Icon, text }, i) => (
            <div
              key={text}
              className="stagger-item flex items-center gap-3 rounded-xl bg-white/10 p-3 pr-4 backdrop-blur-sm"
              style={{ animationDelay: `${0.15 + i * 0.1}s` }}
            >
              <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-white/15 text-white">
                <Icon size={16} />
              </span>
              <p className="text-sm font-medium text-white/90">{text}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Right — the form itself */}
      <div className="relative flex items-center justify-center px-4 py-10 sm:px-8">
        <div
          className="absolute inset-0 -z-10 opacity-40 lg:hidden"
          style={{
            backgroundImage:
              "radial-gradient(circle at 20% 10%, var(--color-signal-soft), transparent 45%)",
          }}
          aria-hidden="true"
        />
        <div className="w-full max-w-sm animate-fade-in-up">{children}</div>
      </div>
    </div>
  );
}

export default AuthLayout;
