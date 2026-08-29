import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import {
  Loader,
  MapPin,
  Phone,
  Mail,
  Globe,
  CalendarDays,
  ArrowLeft,
  ImageOff,
  ListChecks,
  Trash2,
  MessageCircle,
  Check,
  Clock,
} from "lucide-react";
import { usePostStore } from "../store/usePostStore.js";
import { useAuthStore } from "../store/useAuthStore.js";
import { useRequestStore } from "../store/useRequestStore.js";
import { useChatStore } from "../store/useChatStore.js";

// The small "chat with the poster" option shown next to "Posted by ...".
// Reuses the app's existing connect-then-chat flow (ChatRequest model):
// - "none"            -> "Chat" button sends a request
// - "pending-sent"    -> shows "Requested" (disabled)
// - "pending-received"-> tells them to respond from Chats
// - "connected"       -> "Message" opens the conversation directly
function ChatWithAuthorButton({ author }) {
  const navigate = useNavigate();
  const { authUser } = useAuthStore();
  const { sendingToId, sendRequest } = useRequestStore();
  const selectContact = useChatStore((s) => s.selectContact);
  const [status, setStatus] = useState(author?.connectionStatus || "none");

  useEffect(() => {
    setStatus(author?.connectionStatus || "none");
  }, [author?._id, author?.connectionStatus]);

  if (!author?._id) return null;

  // Not logged in — send them to log in first instead of hiding the option.
  if (!authUser) {
    return (
      <Link
        to="/login"
        className="inline-flex items-center gap-1.5 rounded-lg border border-line px-3 py-1.5 text-sm font-medium text-ink-soft transition hover:border-signal/40 hover:bg-signal-soft hover:text-signal"
      >
        <MessageCircle size={14} />
        Login to chat
      </Link>
    );
  }

  // Viewing your own post — nothing to chat about.
  if (authUser._id === author._id) return null;

  if (status === "connected") {
    return (
      <button
        onClick={() => {
          selectContact(author);
          navigate("/chat");
        }}
        className="inline-flex items-center gap-1.5 rounded-lg border border-line px-3 py-1.5 text-sm font-medium text-ink-soft transition hover:border-signal/40 hover:bg-signal-soft hover:text-signal"
      >
        <MessageCircle size={14} />
        Message
      </button>
    );
  }

  if (status === "pending-sent") {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-lg border border-line px-3 py-1.5 text-sm font-medium text-ink-faint">
        <Clock size={14} />
        Requested
      </span>
    );
  }

  if (status === "pending-received") {
    return (
      <Link
        to="/chat"
        className="inline-flex items-center gap-1.5 rounded-lg border border-line px-3 py-1.5 text-sm font-medium text-ink-soft transition hover:border-signal/40 hover:bg-signal-soft hover:text-signal"
      >
        <Check size={14} />
        Respond to their request
      </Link>
    );
  }

  return (
    <button
      onClick={async () => {
        await sendRequest(author._id);
        setStatus("pending-sent");
      }}
      disabled={sendingToId === author._id}
      className="inline-flex items-center gap-1.5 rounded-lg border border-line px-3 py-1.5 text-sm font-medium text-ink-soft transition hover:border-signal/40 hover:bg-signal-soft hover:text-signal disabled:opacity-60"
    >
      <MessageCircle size={14} />
      {sendingToId === author._id ? "Sending..." : "Chat"}
    </button>
  );
}

function formatDate(value) {
  if (!value) return "";
  return new Date(value).toLocaleDateString(undefined, {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function Field({ label, value }) {
  if (!value) return null;
  return (
    <div>
      <dt className="text-xs font-medium uppercase tracking-wide text-ink-faint">{label}</dt>
      <dd className="mt-0.5 whitespace-pre-line text-sm text-ink">{value}</dd>
    </div>
  );
}

function PostDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { activePost: post, isLoadingPost, fetchPostById, deletePost } = usePostStore();
  const { authUser } = useAuthStore();

  useEffect(() => {
    fetchPostById(id);
  }, [id, fetchPostById]);

  if (isLoadingPost || !post) {
    return (
      <div className="grid h-[60vh] place-items-center">
        <Loader className="animate-spin text-signal" size={26} />
      </div>
    );
  }

  const isOwner = authUser && post.author?._id === authUser._id;
  const canManage = isOwner || authUser?.role === "admin";
  const contact = post.contact || {};

  const applySteps =
    (post.category === "University" || post.category === "Admission") && post.university?.howToApply
      ? post.university.howToApply
          .split(/\r?\n/)
          .map((s) => s.trim())
          .filter(Boolean)
      : [];

  const handleDelete = async () => {
    if (!window.confirm("Delete this post? This cannot be undone.")) return;
    await deletePost(post._id);
    navigate("/explore");
  };

  return (
    <div className="mx-auto max-w-4xl px-4 pb-16">
      <button
        onClick={() => navigate(-1)}
        className="mt-6 inline-flex items-center gap-1.5 text-sm font-medium text-ink-soft transition hover:text-ink"
      >
        <ArrowLeft size={15} />
        Back
      </button>

      <div className="card-elevated mt-4 overflow-hidden rounded-3xl border border-line bg-panel">
        <div className="aspect-[16/7] w-full overflow-hidden bg-panel-soft">
          {post.image ? (
            <img src={post.image} alt={post.title} className="h-full w-full object-cover" />
          ) : (
            <div className="grid h-full w-full place-items-center text-ink-faint">
              <ImageOff size={32} />
            </div>
          )}
        </div>

        <div className="p-6 sm:p-8">
          <div className="flex flex-wrap items-center gap-2 text-xs font-medium text-signal">
            <span className="rounded-full bg-signal-soft px-2.5 py-1">{post.category}</span>
            {post.city && (
              <span className="inline-flex items-center gap-1 rounded-full bg-panel-soft px-2.5 py-1 text-ink-soft">
                <MapPin size={12} />
                {post.city}
              </span>
            )}
            <span className="inline-flex items-center gap-1 rounded-full bg-panel-soft px-2.5 py-1 text-ink-soft">
              <CalendarDays size={12} />
              Posted {formatDate(post.createdAt)}
            </span>
          </div>

          <h1 className="mt-3 font-display text-2xl font-bold text-ink sm:text-3xl">{post.title}</h1>
          {post.organizationName && (
            <p className="mt-1 text-base font-medium text-ink-soft">{post.organizationName}</p>
          )}

          <p className="mt-4 whitespace-pre-line text-sm leading-relaxed text-ink-soft">
            {post.description}
          </p>

          {/* University / Admission details */}
          {(post.category === "University" || post.category === "Admission") && post.university && (
            <section className="mt-8 border-t border-line pt-6">
              <h2 className="font-display text-lg font-semibold text-ink">Admission Information</h2>
              <dl className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
                <Field label="Programs" value={post.university.programs} />
                <Field label="Eligibility" value={post.university.eligibility} />
                <Field
                  label="Admission Opens"
                  value={post.university.admissionStart ? formatDate(post.university.admissionStart) : ""}
                />
                <Field
                  label="Admission Deadline"
                  value={post.university.admissionDeadline ? formatDate(post.university.admissionDeadline) : ""}
                />
                <Field label="Fee" value={post.university.fee} />
                <Field label="Required Documents" value={post.university.requiredDocuments} />
              </dl>

              {applySteps.length > 0 && (
                <div className="mt-6">
                  <h3 className="inline-flex items-center gap-1.5 font-display text-sm font-semibold text-ink">
                    <ListChecks size={16} />
                    How to Apply
                  </h3>
                  <ol className="mt-3 space-y-2">
                    {applySteps.map((step, i) => (
                      <li key={i} className="flex gap-3 text-sm text-ink-soft">
                        <span className="grid h-5 w-5 shrink-0 place-items-center rounded-full bg-signal-soft text-xs font-semibold text-signal">
                          {i + 1}
                        </span>
                        {step}
                      </li>
                    ))}
                  </ol>
                </div>
              )}

              {post.university.applicationLink && (
                <a
                  href={post.university.applicationLink}
                  target="_blank"
                  rel="noreferrer"
                  className="brand-gradient mt-6 inline-flex items-center gap-1.5 rounded-xl px-4 py-2 text-sm font-semibold text-white transition hover:opacity-90"
                >
                  <Globe size={15} />
                  Apply Now
                </a>
              )}
            </section>
          )}

          {/* Academy details */}
          {post.category === "Academy" && post.academy && (
            <section className="mt-8 border-t border-line pt-6">
              <h2 className="font-display text-lg font-semibold text-ink">Course Information</h2>
              <dl className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
                <Field label="Courses" value={post.academy.courses} />
                <Field label="Course Duration" value={post.academy.courseDuration} />
                <Field label="Fee" value={post.academy.fee} />
                <Field label="Timings" value={post.academy.timings} />
                <Field label="Admission / Enrollment" value={post.academy.admissionInfo} />
              </dl>
            </section>
          )}

          {/* Business details */}
          {post.category === "Business" && post.business && (
            <section className="mt-8 border-t border-line pt-6">
              <h2 className="font-display text-lg font-semibold text-ink">Business Information</h2>
              <dl className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
                <Field label="Category" value={post.business.businessCategory} />
                <Field label="Services" value={post.business.services} />
                <Field label="Opening Hours" value={post.business.openingHours} />
              </dl>
            </section>
          )}

          {/* Contact — shown whenever any contact field exists */}
          {(contact.phone || contact.email || contact.address || contact.website) && (
            <section className="mt-8 border-t border-line pt-6">
              <h2 className="font-display text-lg font-semibold text-ink">Contact Information</h2>
              <dl className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
                {contact.phone && (
                  <div className="flex items-start gap-2">
                    <Phone size={15} className="mt-0.5 shrink-0 text-ink-faint" />
                    <div>
                      <dt className="text-xs font-medium uppercase tracking-wide text-ink-faint">Phone</dt>
                      <dd className="text-sm text-ink">{contact.phone}</dd>
                    </div>
                  </div>
                )}
                {contact.email && (
                  <div className="flex items-start gap-2">
                    <Mail size={15} className="mt-0.5 shrink-0 text-ink-faint" />
                    <div>
                      <dt className="text-xs font-medium uppercase tracking-wide text-ink-faint">Email</dt>
                      <dd className="text-sm text-ink">{contact.email}</dd>
                    </div>
                  </div>
                )}
                {contact.address && (
                  <div className="flex items-start gap-2">
                    <MapPin size={15} className="mt-0.5 shrink-0 text-ink-faint" />
                    <div>
                      <dt className="text-xs font-medium uppercase tracking-wide text-ink-faint">Address</dt>
                      <dd className="text-sm text-ink">{contact.address}</dd>
                    </div>
                  </div>
                )}
                {contact.website && (
                  <div className="flex items-start gap-2">
                    <Globe size={15} className="mt-0.5 shrink-0 text-ink-faint" />
                    <div>
                      <dt className="text-xs font-medium uppercase tracking-wide text-ink-faint">Website</dt>
                      <dd className="text-sm text-ink">{contact.website}</dd>
                    </div>
                  </div>
                )}
              </dl>
            </section>
          )}

          {/* Author + owner actions */}
          <div className="mt-8 flex flex-wrap items-center justify-between gap-3 border-t border-line pt-6">
            <div className="flex items-center gap-2 text-sm text-ink-faint">
              Posted by{" "}
              <span className="font-medium text-ink-soft">
                {post.author?.fullName || "a member"}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <ChatWithAuthorButton author={post.author} />

              {canManage && (
                <button
                  onClick={handleDelete}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-line px-3 py-1.5 text-sm font-medium text-ink-soft transition hover:border-danger/40 hover:bg-danger-soft hover:text-danger"
                >
                  <Trash2 size={14} />
                  Delete post
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="mt-4 text-center">
        <Link to="/explore" className="text-sm font-medium text-signal hover:underline">
          ← Back to Explore
        </Link>
      </div>
    </div>
  );
}

export default PostDetailPage;
