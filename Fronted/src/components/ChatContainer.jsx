import { useEffect, useRef } from "react";
import { ArrowLeft, Check, CheckCheck, Reply, Download } from "lucide-react";
import { useChatStore } from "../store/useChatStore.js";
import { useAuthStore } from "../store/useAuthStore.js";
import { useProfileViewStore } from "../store/useProfileViewStore.js";
import { formatMessageTime, getDownloadUrl } from "../lib/utils.js";
import MessageInput from "./MessageInput.jsx";
import MessageSkeleton from "./skeletons/MessageSkeleton.jsx";

function initials(name = "") {
  return name
    .split(" ")
    .map((p) => p[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

function StatusTicks({ seen }) {
  return seen ? (
    <CheckCheck size={13} className="text-white" strokeWidth={2.5} />
  ) : (
    <Check size={13} className="text-white/70" strokeWidth={2.5} />
  );
}

function ReplyPreview({ replyTo, mine, isReplyFromMe }) {
  if (!replyTo) return null;
  return (
    <div
      className={`mb-1.5 rounded-lg border-l-2 px-2 py-1 text-xs ${
        mine
          ? "border-white/50 bg-white/10 text-white/80"
          : "border-signal bg-panel text-ink-soft"
      }`}
    >
      <p className="font-medium">{isReplyFromMe ? "You" : "Them"}</p>
      <p className="truncate">
        {replyTo.image && !replyTo.text ? "Photo" : replyTo.text}
      </p>
    </div>
  );
}

function ChatContainer() {
  const {
    selectedContact,
    messages,
    isMessagesLoading,
    clearSelectedContact,
    setReplyingTo,
  } = useChatStore();
  const { authUser } = useAuthStore();
  const openProfile = useProfileViewStore((s) => s.openProfile);
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <section className="flex h-full flex-1 flex-col bg-paper">
      <div className="flex items-center gap-3 border-b border-line bg-panel px-4 py-3 sm:px-6">
        <button
          onClick={clearSelectedContact}
          className="rounded-lg p-1.5 text-ink-soft hover:bg-panel-soft sm:hidden"
        >
          <ArrowLeft size={18} />
        </button>
        <button
          onClick={() => openProfile(selectedContact)}
          className="relative shrink-0 transition hover:opacity-85"
          title="View profile"
        >
          <span className="brand-gradient grid h-10 w-10 place-items-center rounded-full text-sm font-semibold text-white">
            {selectedContact.profilePic ? (
              <img
                src={selectedContact.profilePic}
                alt=""
                className="h-full w-full rounded-full object-cover"
              />
            ) : (
              initials(selectedContact.fullName)
            )}
          </span>
          {selectedContact.online && (
            <span className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-panel bg-online" />
          )}
        </button>
        <button
          onClick={() => openProfile(selectedContact)}
          className="min-w-0 text-left"
        >
          <p className="truncate text-sm font-semibold text-ink hover:underline">
            {selectedContact.fullName}
          </p>
          <p className="text-xs text-ink-faint">
            {selectedContact.online ? "Online" : "Offline"}
          </p>
        </button>
      </div>

      {isMessagesLoading ? (
        <MessageSkeleton />
      ) : (
        <div className="thin-scroll flex-1 overflow-y-auto px-4 py-4 sm:px-6">
          {messages.length === 0 ? (
            <p className="mt-10 text-center text-sm text-ink-faint">
              No messages yet — say hi to {selectedContact.fullName.split(" ")[0]}.
            </p>
          ) : (
            <div className="flex flex-col gap-2.5">
              {messages.map((m) => {
                const mine = m.senderId === authUser?._id;
                return (
                  <div
                    key={m._id}
                    className={`group animate-pop-in flex items-center gap-1.5 ${
                      mine ? "justify-end" : "justify-start"
                    }`}
                  >
                    {mine && (
                      <button
                        onClick={() => setReplyingTo(m)}
                        title="Reply"
                        className="shrink-0 rounded-full p-1.5 text-ink-faint opacity-0 transition hover:bg-panel-soft hover:text-signal group-hover:opacity-100"
                      >
                        <Reply size={14} />
                      </button>
                    )}
                    <div
                      className={`max-w-[75%] px-4 py-2 text-sm leading-relaxed shadow-sm sm:max-w-[60%] ${
                        mine
                          ? "brand-gradient rounded-t-2xl rounded-bl-2xl text-white"
                          : "rounded-t-2xl rounded-br-2xl bg-bubble-them text-ink"
                      }`}
                    >
                      <ReplyPreview
                        replyTo={m.replyTo}
                        mine={mine}
                        isReplyFromMe={m.replyTo?.senderId === authUser?._id}
                      />
                      {m.image && (
                        <div className="group/img relative mb-1.5">
                          <img
                            src={m.image}
                            alt="attachment"
                            className="max-h-64 rounded-lg object-cover"
                          />
                          <a
                            href={getDownloadUrl(m.image)}
                            download
                            title="Download image"
                            className="absolute right-1.5 top-1.5 grid h-7 w-7 place-items-center rounded-full bg-black/50 text-white opacity-0 backdrop-blur-sm transition-opacity group-hover/img:opacity-100"
                          >
                            <Download size={14} />
                          </a>
                        </div>
                      )}
                      {m.text && <p>{m.text}</p>}
                      <span
                        className={`mt-1 flex items-center justify-end gap-1 text-[10px] ${
                          mine ? "text-white/70" : "text-ink-faint"
                        }`}
                      >
                        {formatMessageTime(m.createdAt)}
                        {mine && <StatusTicks seen={m.seen} />}
                      </span>
                    </div>
                    {!mine && (
                      <button
                        onClick={() => setReplyingTo(m)}
                        title="Reply"
                        className="shrink-0 rounded-full p-1.5 text-ink-faint opacity-0 transition hover:bg-panel-soft hover:text-signal group-hover:opacity-100"
                      >
                        <Reply size={14} />
                      </button>
                    )}
                  </div>
                );
              })}
              <div ref={bottomRef} />
            </div>
          )}
        </div>
      )}

      <MessageInput />
    </section>
  );
}

export default ChatContainer;
