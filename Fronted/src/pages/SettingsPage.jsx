import { useRef, useState } from "react";
import { Camera, Mail, User } from "lucide-react";
import { useAuthStore } from "../store/useAuthStore.js";

function initials(name = "") {
  return name
    .split(" ")
    .map((p) => p[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

function SettingsPage() {
  const { authUser, updateProfile, isUpdatingProfile } = useAuthStore();
  const [fullName, setFullName] = useState(authUser?.fullName || "");
  const [bio, setBio] = useState(authUser?.bio || "");
  const [preview, setPreview] = useState(authUser?.profilePic || "");
  const fileInputRef = useRef(null);

  const handlePicChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) return;
    const reader = new FileReader();
    reader.onload = () => {
      setPreview(reader.result);
      updateProfile({ profilePic: reader.result });
    };
    reader.readAsDataURL(file);
  };

  const handleSaveProfile = (e) => {
    e.preventDefault();
    if (!fullName.trim()) return;
    updateProfile({ fullName, bio });
  };

  return (
    <div className="mx-auto max-w-xl px-4 py-10">
      <h1 className="font-display text-2xl font-bold text-ink">Settings</h1>
      <p className="mt-1 text-sm text-ink-faint">
        Manage your profile details
      </p>

      <section className="card-elevated animate-fade-in-up mt-8 rounded-2xl border border-line bg-panel p-6">
        <h2 className="mb-4 text-sm font-semibold text-ink">Profile</h2>

        <div className="flex items-center gap-4">
          <div className="relative">
            {preview ? (
              <img
                src={preview}
                alt="Profile"
                className="h-20 w-20 rounded-full object-cover"
              />
            ) : (
              <span className="brand-gradient grid h-20 w-20 place-items-center rounded-full text-xl font-semibold text-white">
                {initials(authUser?.fullName)}
              </span>
            )}
            <button
              onClick={() => fileInputRef.current?.click()}
              disabled={isUpdatingProfile}
              className="brand-gradient absolute -bottom-1 -right-1 grid h-8 w-8 place-items-center rounded-full border-2 border-panel text-white"
            >
              <Camera size={14} />
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handlePicChange}
            />
          </div>
          <div>
            <p className="text-sm font-medium text-ink">{authUser?.fullName}</p>
            <p className="flex items-center gap-1 text-xs text-ink-faint">
              <Mail size={12} /> {authUser?.email}
            </p>
          </div>
        </div>

        <form onSubmit={handleSaveProfile} className="mt-6 space-y-4">
          <div>
            <label className="mb-1 block text-xs font-medium text-ink-soft">
              Full name
            </label>
            <div className="relative">
              <User
                size={16}
                className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-ink-faint"
              />
              <input
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full rounded-lg border border-line bg-panel-soft py-2.5 pl-9 pr-3 text-sm outline-none transition-all focus:border-signal focus:ring-4 focus:ring-signal-soft"
              />
            </div>
          </div>

          <div>
            <div className="mb-1 flex items-center justify-between">
              <label className="block text-xs font-medium text-ink-soft">Bio</label>
              <span className="text-[11px] text-ink-faint">{bio.length}/160</span>
            </div>
            <textarea
              value={bio}
              onChange={(e) => setBio(e.target.value.slice(0, 160))}
              placeholder="Tell people a little about yourself"
              rows={3}
              className="w-full resize-none rounded-lg border border-line bg-panel-soft px-3 py-2.5 text-sm outline-none transition-all focus:border-signal focus:ring-4 focus:ring-signal-soft"
            />
          </div>

          <button
            type="submit"
            disabled={isUpdatingProfile}
            className="brand-gradient w-full rounded-lg px-4 py-2.5 text-sm font-semibold text-white transition hover:shadow-lg disabled:opacity-60"
          >
            {isUpdatingProfile ? "Saving…" : "Save changes"}
          </button>
        </form>
      </section>
    </div>
  );
}

export default SettingsPage;
