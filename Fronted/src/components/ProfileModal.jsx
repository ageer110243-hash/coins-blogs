import { X, Circle } from "lucide-react";
import { useProfileViewStore } from "../store/useProfileViewStore.js";

function initials(name = "") {
  return name
    .split(" ")
    .map((p) => p[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

function ProfileModal() {
  const { viewedPerson, closeProfile } = useProfileViewStore();
  if (!viewedPerson) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-ink/40 p-4 backdrop-blur-sm"
      onClick={closeProfile}
    >
      <div
        className="animate-pop-in w-full max-w-sm rounded-2xl bg-panel p-6 shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-4 flex justify-end">
          <button
            onClick={closeProfile}
            className="grid h-8 w-8 place-items-center rounded-lg text-ink-faint transition hover:bg-panel-soft hover:text-ink"
          >
            <X size={16} />
          </button>
        </div>

        <div className="flex flex-col items-center text-center">
          <span className="brand-gradient grid h-24 w-24 place-items-center rounded-full text-2xl font-semibold text-white">
            {viewedPerson.profilePic ? (
              <img
                src={viewedPerson.profilePic}
                alt=""
                className="h-full w-full rounded-full object-cover"
              />
            ) : (
              initials(viewedPerson.fullName)
            )}
          </span>

          <h2 className="mt-4 font-display text-xl font-bold text-ink">
            {viewedPerson.fullName}
          </h2>

          {typeof viewedPerson.online === "boolean" && (
            <span
              className={`mt-1 flex items-center gap-1.5 text-xs font-medium ${
                viewedPerson.online ? "text-online" : "text-ink-faint"
              }`}
            >
              <Circle size={7} fill="currentColor" strokeWidth={0} />
              {viewedPerson.online ? "Online" : "Offline"}
            </span>
          )}

          <p className="mt-4 text-sm leading-relaxed text-ink-soft">
            {viewedPerson.bio || (
              <span className="text-ink-faint italic">No bio yet</span>
            )}
          </p>
        </div>
      </div>
    </div>
  );
}

export default ProfileModal;
