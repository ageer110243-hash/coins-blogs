import { useEffect, useMemo, useState } from "react";
import { Search, Users, UserPlus, Check, X, Clock, MessageCircle } from "lucide-react";
import { useChatStore } from "../store/useChatStore.js";
import { useRequestStore } from "../store/useRequestStore.js";
import { useProfileViewStore } from "../store/useProfileViewStore.js";
import SidebarSkeleton from "./skeletons/SidebarSkeleton.jsx";

const PEOPLE_POLL_MS = 8000; // catch incoming requests without needing sockets

function initials(name = "") {
  return name
    .split(" ")
    .map((p) => p[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

function Avatar({ person, active, onOpenProfile }) {
  return (
    <button
      type="button"
      onClick={(e) => {
        e.stopPropagation();
        onOpenProfile(person);
      }}
      title="View profile"
      className={`relative grid h-11 w-11 shrink-0 place-items-center rounded-full text-sm font-semibold text-white transition-colors hover:opacity-85 ${
        active ? "brand-gradient" : "bg-ink-faint"
      }`}
    >
      {person.profilePic ? (
        <img src={person.profilePic} alt="" className="h-full w-full rounded-full object-cover" />
      ) : (
        initials(person.fullName)
      )}
      {person.online && (
        <span className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-panel bg-online" />
      )}
    </button>
  );
}

function Sidebar() {
  const { contacts, getContacts, selectedContact, selectContact, isContactsLoading } =
    useChatStore();
  const {
    people,
    incomingRequests,
    isPeopleLoading,
    sendingToId,
    respondingToId,
    getPeople,
    getIncomingRequests,
    refreshPeople,
    refreshIncomingRequests,
    sendRequest,
    respondToRequest,
  } = useRequestStore();
  const openProfile = useProfileViewStore((s) => s.openProfile);

  const [tab, setTab] = useState("chats"); // "chats" | "people"
  const [query, setQuery] = useState("");
  const [onlineOnly, setOnlineOnly] = useState(false);

  useEffect(() => {
    getContacts();
  }, [getContacts]);

  // Poll for people + incoming requests so the "People" badge stays fresh
  // even while the user is sitting on the Chats tab (this app uses polling
  // everywhere instead of relying on sockets — see useChatStore).
  useEffect(() => {
    getPeople();
    getIncomingRequests();
    const id = setInterval(() => {
      refreshPeople();
      refreshIncomingRequests();
    }, PEOPLE_POLL_MS);
    return () => clearInterval(id);
  }, [getPeople, getIncomingRequests, refreshPeople, refreshIncomingRequests]);

  const filteredContacts = useMemo(() => {
    return contacts
      .filter((c) => c.fullName.toLowerCase().includes(query.toLowerCase()))
      .filter((c) => (onlineOnly ? c.online : true))
      .slice()
      .sort((a, b) => (b.unread || 0) - (a.unread || 0));
  }, [contacts, query, onlineOnly]);

  const filteredPeople = useMemo(() => {
    return people
      .filter((p) => p.fullName.toLowerCase().includes(query.toLowerCase()))
      .slice()
      .sort((a, b) => {
        const rank = { "pending-received": 0, none: 1, "pending-sent": 2, connected: 3 };
        return rank[a.connectionStatus] - rank[b.connectionStatus];
      });
  }, [people, query]);

  const onlineCount = contacts.filter((c) => c.online).length;

  function openChatWith(personId) {
    const contact = contacts.find((c) => c._id === personId);
    setTab("chats");
    if (contact) selectContact(contact);
  }

  return (
    <aside className="flex h-full w-full flex-col border-r border-line bg-panel sm:w-80">
      <div className="space-y-3 border-b border-line p-4">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setTab("chats")}
            className={`flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-sm font-semibold transition ${
              tab === "chats" ? "bg-signal-soft text-signal" : "text-ink-soft hover:bg-panel-soft"
            }`}
          >
            <Users size={16} />
            Chats
          </button>
          <button
            onClick={() => setTab("people")}
            className={`relative flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-sm font-semibold transition ${
              tab === "people" ? "bg-signal-soft text-signal" : "text-ink-soft hover:bg-panel-soft"
            }`}
          >
            <UserPlus size={16} />
            People
            {incomingRequests.length > 0 && (
              <span className="grid h-4 min-w-4 place-items-center rounded-full bg-signal px-1 text-[10px] font-semibold text-white">
                {incomingRequests.length}
              </span>
            )}
          </button>
        </div>

        <div className="relative">
          <Search
            size={15}
            className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-ink-faint"
          />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={tab === "chats" ? "Search chats" : "Search people"}
            className="w-full rounded-lg border border-line bg-panel-soft py-2 pl-9 pr-3 text-sm outline-none focus:border-signal"
          />
        </div>

        {tab === "chats" && (
          <label className="flex cursor-pointer items-center gap-2 text-xs text-ink-soft">
            <input
              type="checkbox"
              checked={onlineOnly}
              onChange={(e) => setOnlineOnly(e.target.checked)}
              className="h-3.5 w-3.5 accent-[var(--color-signal)]"
            />
            Online only
            <span className="text-ink-faint">
              ({onlineCount} of {contacts.length})
            </span>
          </label>
        )}
      </div>

      <div className="thin-scroll flex-1 overflow-y-auto">
        {tab === "chats" ? (
          isContactsLoading ? (
            <SidebarSkeleton />
          ) : filteredContacts.length === 0 ? (
            <p className="p-6 text-center text-sm text-ink-faint">
              {contacts.length === 0
                ? "No chats yet — send a request from People to start one"
                : `No contacts match "${query}"`}
            </p>
          ) : (
            <ul className="flex flex-col gap-0.5 p-2">
              {filteredContacts.map((contact, i) => {
                const active = selectedContact?._id === contact._id;
                return (
                  <li
                    key={contact._id}
                    className="stagger-item"
                    style={{ animationDelay: `${Math.min(i, 8) * 0.04}s` }}
                  >
                    <button
                      onClick={() => selectContact(contact)}
                      className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left transition-all duration-200 ${
                        active
                          ? "bg-signal-soft shadow-sm"
                          : "hover:translate-x-0.5 hover:bg-panel-soft"
                      }`}
                    >
                      <Avatar person={contact} active={active} onOpenProfile={openProfile} />
                      <span className="min-w-0 flex-1">
                        <span className="flex items-center justify-between gap-2">
                          <span className="truncate text-sm font-medium text-ink">
                            {contact.fullName}
                          </span>
                          {contact.unread > 0 && (
                            <span className="grid h-5 min-w-5 shrink-0 place-items-center rounded-full bg-signal px-1 text-[11px] font-semibold text-white">
                              {contact.unread}
                            </span>
                          )}
                        </span>
                        <span className="block truncate text-xs text-ink-faint">
                          {contact.online ? "Online" : "Offline"}
                        </span>
                      </span>
                    </button>
                  </li>
                );
              })}
            </ul>
          )
        ) : isPeopleLoading && people.length === 0 ? (
          <SidebarSkeleton />
        ) : filteredPeople.length === 0 ? (
          <p className="p-6 text-center text-sm text-ink-faint">
            No people match "{query}"
          </p>
        ) : (
          <ul className="flex flex-col gap-0.5 p-2">
            {filteredPeople.map((person) => (
              <li key={person._id} className="flex items-center gap-3 rounded-xl px-3 py-2.5">
                <Avatar person={person} onOpenProfile={openProfile} />
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-sm font-medium text-ink">
                    {person.fullName}
                  </span>
                  <span className="block truncate text-xs text-ink-faint">
                    {person.bio || "\u00A0"}
                  </span>
                </span>

                {person.connectionStatus === "none" && (
                  <button
                    onClick={() => sendRequest(person._id)}
                    disabled={sendingToId === person._id}
                    title="Send chat request"
                    className="flex shrink-0 items-center gap-1 rounded-lg bg-signal px-2.5 py-1.5 text-xs font-semibold text-white transition hover:opacity-90 disabled:opacity-50"
                  >
                    <UserPlus size={13} />
                    Add
                  </button>
                )}

                {person.connectionStatus === "pending-sent" && (
                  <span className="flex shrink-0 items-center gap-1 rounded-lg bg-panel-soft px-2.5 py-1.5 text-xs font-medium text-ink-faint">
                    <Clock size={13} />
                    Requested
                  </span>
                )}

                {person.connectionStatus === "pending-received" && (
                  <span className="flex shrink-0 items-center gap-1.5">
                    <button
                      onClick={() => respondToRequest(person.requestId, "accept", person._id)}
                      disabled={respondingToId === person.requestId}
                      title="Accept"
                      className="grid h-7 w-7 place-items-center rounded-lg bg-online text-white transition hover:opacity-90 disabled:opacity-50"
                    >
                      <Check size={14} />
                    </button>
                    <button
                      onClick={() => respondToRequest(person.requestId, "decline", person._id)}
                      disabled={respondingToId === person.requestId}
                      title="Decline"
                      className="grid h-7 w-7 place-items-center rounded-lg bg-danger-soft text-danger transition hover:opacity-90 disabled:opacity-50"
                    >
                      <X size={14} />
                    </button>
                  </span>
                )}

                {person.connectionStatus === "connected" && (
                  <button
                    onClick={() => openChatWith(person._id)}
                    title="Open chat"
                    className="grid h-7 w-7 shrink-0 place-items-center rounded-lg text-signal transition hover:bg-signal-soft"
                  >
                    <MessageCircle size={15} />
                  </button>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    </aside>
  );
}

export default Sidebar;
