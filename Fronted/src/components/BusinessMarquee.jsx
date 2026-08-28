import { useEffect } from "react";
import { Store, Coffee, Code2, Palette, GraduationCap, Sparkles } from "lucide-react";
import { usePostStore } from "../store/usePostStore.js";

const PLACEHOLDER_CARDS = [
  { icon: Coffee, label: "Home-baked treats" },
  { icon: Code2, label: "Web dev services" },
  { icon: Palette, label: "Custom art & design" },
  { icon: GraduationCap, label: "Private tutoring" },
  { icon: Sparkles, label: "Handmade crafts" },
  { icon: Store, label: "Your business here" },
];

function PlaceholderCard({ icon: Icon, label }) {
  return (
    <div className="flex h-24 w-40 shrink-0 flex-col items-center justify-center gap-2 rounded-xl bg-white/10 backdrop-blur-sm">
      <Icon size={20} className="text-white/70" />
      <span className="px-2 text-center text-xs font-medium text-white/70">{label}</span>
    </div>
  );
}

function PostCard({ post }) {
  return (
    <div className="relative h-24 w-40 shrink-0 overflow-hidden rounded-xl bg-white/10">
      <img src={post.image} alt="" className="h-full w-full object-cover opacity-80" />
      <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent p-2">
        <p className="truncate text-xs font-semibold text-white">{post.title}</p>
      </div>
    </div>
  );
}

function BusinessMarquee() {
  const { posts, getPosts } = usePostStore();

  useEffect(() => {
    getPosts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const items = posts.length >= 4 ? posts.slice(0, 12) : PLACEHOLDER_CARDS;
  const isRealPosts = posts.length >= 4;
  // duplicate the track once so the loop is seamless
  const track = [...items, ...items];

  return (
    <div className="relative">
      <p className="relative mb-3 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-white/60">
        <Store size={13} />
        Businesses on ChatWithMe
      </p>
      <div className="relative overflow-hidden">
        <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-8 bg-gradient-to-r from-signal to-transparent" />
        <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-8 bg-gradient-to-l from-signal-dark to-transparent" />
        <div className="animate-marquee flex w-max gap-3">
          {track.map((item, i) =>
            isRealPosts ? (
              <PostCard key={`${item._id}-${i}`} post={item} />
            ) : (
              <PlaceholderCard key={i} icon={item.icon} label={item.label} />
            )
          )}
        </div>
      </div>
    </div>
  );
}

export default BusinessMarquee;
