import { create } from "zustand";
import toast from "react-hot-toast";
import { axiosInstance } from "../lib/axios.js";

export const useChatStore = create((set, get) => ({
  contacts: [],
  selectedContact: null,
  messages: [],
  isContactsLoading: false,
  isMessagesLoading: false,
  isSending: false,
  replyingTo: null,

  getContacts: async () => {
    set({ isContactsLoading: true });
    try {
      const res = await axiosInstance.get("/messages/users");
      set({ contacts: res.data });
    } catch (error) {
      toast.error(error?.response?.data?.message || "Couldn't load contacts");
    } finally {
      set({ isContactsLoading: false });
    }
  },

  // Silent refresh used by polling — no loading spinner, so it doesn't
  // flicker the sidebar every few seconds.
  refreshContacts: async () => {
    try {
      const res = await axiosInstance.get("/messages/users");
      set({ contacts: res.data });
    } catch {
      // stay quiet on background polling failures
    }
  },

  selectContact: async (contact) => {
    set({
      selectedContact: contact,
      isMessagesLoading: true,
      messages: [],
      replyingTo: null,
    });
    set((state) => ({
      contacts: state.contacts.map((c) =>
        c._id === contact._id ? { ...c, unread: 0 } : c
      ),
    }));
    try {
      const res = await axiosInstance.get(`/messages/${contact._id}`);
      set({ messages: res.data });
    } catch (error) {
      toast.error(error?.response?.data?.message || "Couldn't load messages");
    } finally {
      set({ isMessagesLoading: false });
    }
  },

  // Silent refresh of the open conversation — this is what makes chat feel
  // "live" without a websocket: ChatPage polls this every few seconds while
  // a contact is selected (see the useEffect in ChatPage.jsx).
  refreshMessages: async () => {
    const { selectedContact } = get();
    if (!selectedContact) return;
    try {
      const res = await axiosInstance.get(`/messages/${selectedContact._id}`);
      set((state) => {
        // avoid pointless re-renders when nothing actually changed
        if (
          state.messages.length === res.data.length &&
          state.messages.at(-1)?._id === res.data.at(-1)?._id &&
          state.messages.every((m, i) => m.seen === res.data[i]?.seen)
        ) {
          return {};
        }
        return { messages: res.data };
      });
    } catch {
      // stay quiet on background polling failures
    }
  },

  sendMessage: async ({ text, image }) => {
    const { selectedContact, messages, replyingTo } = get();
    if (!selectedContact || (!text?.trim() && !image)) return;

    set({ isSending: true });
    try {
      const res = await axiosInstance.post(
        `/messages/send/${selectedContact._id}`,
        { text: text?.trim(), image, replyTo: replyingTo?._id }
      );
      set({ messages: [...messages, res.data], replyingTo: null });
    } catch (error) {
      toast.error(error?.response?.data?.message || "Message failed to send");
    } finally {
      set({ isSending: false });
    }
  },

  setReplyingTo: (message) => set({ replyingTo: message }),
  clearReplyingTo: () => set({ replyingTo: null }),

  clearSelectedContact: () => set({ selectedContact: null, replyingTo: null }),
}));
