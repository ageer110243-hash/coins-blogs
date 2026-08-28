import { Link } from "react-router-dom";
import { GraduationCap, Building2, MessageCircle, Search, PlusCircle } from "lucide-react";

const sections = [
  {
    icon: Search,
    title: "Discover what matters to you",
    body: "Explore university admissions, academy courses, and local businesses across Sindh — filter by city and category, or search by keyword to find exactly what you need.",
  },
  {
    icon: PlusCircle,
    title: "Create and share posts",
    body: "Anyone can create a post — a university admission announcement, an academy's courses, a business listing, or a general update. Fill in only the fields relevant to your post.",
  },
  {
    icon: GraduationCap,
    title: "For students",
    body: "Find universities and academies by city, compare programs, fees and deadlines, and see exactly how to apply — all on one detail page per institution.",
  },
  {
    icon: Building2,
    title: "For businesses",
    body: "Promote your business with a dedicated post — services, hours, and contact details — and get featured in the Home page's business carousel.",
  },
  {
    icon: MessageCircle,
    title: "Chat directly",
    body: "Once you've found a person or organization worth reaching out to, use the built-in Chat to connect directly — the same chat experience this platform started with.",
  },
];

function AboutPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 pb-16">
      <div className="pt-10 text-center">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-signal-soft px-3 py-1 text-xs font-medium text-signal">
          About Us
        </span>
        <h1 className="mt-4 font-display text-2xl font-bold text-ink sm:text-4xl">
          One platform for education, business and conversation
        </h1>
        <p className="mt-4 text-ink-soft">
          We built this platform to bring universities, academies, businesses and everyday
          posts together in one place — searchable by city and category — while keeping the
          direct, real-time chat experience people already know us for.
        </p>
      </div>

      <div className="mt-10 space-y-4">
        {sections.map(({ icon: Icon, title, body }) => (
          <div
            key={title}
            className="card-elevated flex gap-4 rounded-2xl border border-line bg-panel p-5"
          >
            <span className="brand-gradient grid h-11 w-11 shrink-0 place-items-center rounded-xl text-white">
              <Icon size={20} />
            </span>
            <div>
              <h2 className="font-display text-base font-semibold text-ink">{title}</h2>
              <p className="mt-1 text-sm text-ink-soft">{body}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
        <Link
          to="/explore"
          className="rounded-xl border border-line bg-panel px-4 py-2 text-sm font-medium text-ink-soft transition hover:bg-panel-soft"
        >
          Start exploring
        </Link>
        <Link
          to="/create-post"
          className="brand-gradient rounded-xl px-4 py-2 text-sm font-semibold text-white transition hover:opacity-90"
        >
          Create your first post
        </Link>
      </div>
    </div>
  );
}

export default AboutPage;
