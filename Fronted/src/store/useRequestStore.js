import { create } from "zustand";
import toast from "react-hot-toast";
import { axiosInstance } from "../lib/axios.js";
import { useChatStore } from "./useChatStore.js";

export const useRequestStore = create((set) => ({
  people: [], // everyone else, each with a connectionStatus
  incomingRequests: [], // pending requests sent TO me
  isPeopleLoading: false,
  isIncomingLoading: false,
  sendingToId: null, // userId currently being requested (disables its button)
  respondingToId: null, // requestId currently being accepted/declined

  getPeople: async () => {
    set({ isPeopleLoading: true });
    try {
      const res = await axiosInstance.get("/requests/people");
      set({ people: res.data });
    } catch (error) {
      toast.error(error?.response?.data?.message || "Couldn't load people");
    } finally {
      set({ isPeopleLoading: false });
    }
  },

  getIncomingRequests: async () => {
    set({ isIncomingLoading: true });
    try {
      const res = await axiosInstance.get("/requests/incoming");
      set({ incomingRequests: res.data });
    } catch (error) {
      toast.error(error?.response?.data?.message || "Couldn't load requests");
    } finally {
      set({ isIncomingLoading: false });
    }
  },

  sendRequest: async (userId) => {
    set({ sendingToId: userId });
    try {
      await axiosInstance.post(`/requests/send/${userId}`);
      set((state) => ({
        people: state.people.map((p) =>
          p._id === userId ? { ...p, connectionStatus: "pending-sent" } : p
        ),
      }));
      toast.success("Chat request sent");
    } catch (error) {
      toast.error(error?.response?.data?.message || "Couldn't send request");
    } finally {
      set({ sendingToId: null });
    }
  },

  respondToRequest: async (requestId, action, fromUserId) => {
    set({ respondingToId: requestId });
    try {
      await axiosInstance.put(`/requests/${requestId}/respond`, { action });
      set((state) => ({
        incomingRequests: state.incomingRequests.filter((r) => r._id !== requestId),
        people: state.people.map((p) =>
          p._id === fromUserId
            ? { ...p, connectionStatus: action === "accept" ? "connected" : "none" }
            : p
        ),
      }));
      if (action === "accept") {
        toast.success("Request accepted");
        useChatStore.getState().getContacts(); // pull them into the Chats list
      } else {
        toast.success("Request declined");
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || "Couldn't respond to request");
    } finally {
      set({ respondingToId: null });
    }
  },

  // Silent refreshes used by polling (see PeoplePage.jsx / Navbar.jsx) — no
  // loading spinner, so they don't flicker the UI every few seconds.
  refreshPeople: async () => {
    try {
      const res = await axiosInstance.get("/requests/people");
      set({ people: res.data });
    } catch {
      // stay quiet on background polling failures
    }
  },

  refreshIncomingRequests: async () => {
    try {
      const res = await axiosInstance.get("/requests/incoming");
      set({ incomingRequests: res.data });
    } catch {
      // stay quiet on background polling failures
    }
  },
}));
