import { Link } from "react-router-dom";
import { MapPin, Calendar, ArrowRight, ImageOff } from "lucide-react";

function formatDate(value) {
  if (!value) return "";
  return new Date(value).toLocaleDateString(undefined, {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function PostCard({ post }) {
  return (
    <Link
      to={`/posts/${post._id}`}
      className="card-elevated group flex flex-col overflow-hidden rounded-2xl border border-line bg-panel transition hover:-translate-y-0.5 hover:shadow-lg"
    >
      <div className="aspect-[16/10] w-full overflow-hidden bg-panel-soft">
        {post.image ? (
          <img
            src={post.image}
            alt={post.title}
            className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="grid h-full w-full place-items-center text-ink-faint">
            <ImageOff size={26} />
          </div>
        )}
      </div>

      <div className="flex flex-1 flex-col gap-2 p-4">
        <div className="flex items-center gap-2 text-xs font-medium text-signal">
          <span className="rounded-full bg-signal-soft px-2 py-0.5">{post.category}</span>
          {post.city && (
            <span className="inline-flex items-center gap-1 text-ink-faint">
              <MapPin size={12} />
              {post.city}
            </span>
          )}
        </div>

        <h3 className="line-clamp-2 font-display text-base font-semibold text-ink">
          {post.title}
        </h3>

        {post.organizationName && (
          <p className="text-sm font-medium text-ink-soft">{post.organizationName}</p>
        )}

        <p className="line-clamp-2 text-sm text-ink-faint">{post.description}</p>

        <div className="mt-auto flex items-center justify-between pt-2">
          <span className="inline-flex items-center gap-1 text-xs text-ink-faint">
            <Calendar size={12} />
            {formatDate(post.createdAt)}
          </span>
          <span className="inline-flex items-center gap-1 text-sm font-medium text-signal">
            View details
            <ArrowRight size={14} className="transition group-hover:translate-x-0.5" />
          </span>
        </div>
      </div>
    </Link>
  );
}

export default PostCard;
