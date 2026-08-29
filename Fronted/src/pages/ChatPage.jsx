import { useEffect } from "react";
import Sidebar from "../components/Sidebar.jsx";
import ChatContainer from "../components/ChatContainer.jsx";
import NoChatSelected from "../components/NoChatSelected.jsx";
import { useChatStore } from "../store/useChatStore.js";

const MESSAGE_POLL_MS = 3000; // how "live" an open chat feels
const CONTACTS_POLL_MS = 8000; // sidebar unread badges + online status

function ChatPage() {
  const { selectedContact, refreshMessages, refreshContacts } = useChatStore();

  // Poll the open conversation for new messages / seen-status changes —
  // this is the app's real-time mechanism, and it works the same whether
  // the backend is a long-running server or a Vercel serverless function.
  useEffect(() => {
    if (!selectedContact) return;
    const id = setInterval(refreshMessages, MESSAGE_POLL_MS);
    return () => clearInterval(id);
  }, [selectedContact, refreshMessages]);

  useEffect(() => {
    const id = setInterval(refreshContacts, CONTACTS_POLL_MS);
    return () => clearInterval(id);
  }, [refreshContacts]);

  return (
    <div className="mx-auto flex h-[calc(100svh-74px)] max-w-6xl overflow-hidden">
      <div className={`${selectedContact ? "hidden sm:flex" : "flex"} h-full`}>
        <Sidebar />
      </div>
      <div className={`${selectedContact ? "flex" : "hidden sm:flex"} h-full flex-1`}>
        {selectedContact ? <ChatContainer /> : <NoChatSelected />}
      </div>
    </div>
  );
}

export default ChatPage;
