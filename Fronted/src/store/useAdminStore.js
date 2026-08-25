import { create } from "zustand";
import toast from "react-hot-toast";
import { axiosInstance } from "../lib/axios.js";

export const useAdminStore = create((set, get) => ({
  stats: null,
  users: [],
  weeklyActivity: [],
  isLoading: false,

  fetchDashboard: async () => {
    set({ isLoading: true });
    try {
      const [statsRes, usersRes, activityRes] = await Promise.all([
        axiosInstance.get("/admin/stats"),
        axiosInstance.get("/admin/users"),
        axiosInstance.get("/admin/weekly-activity"),
      ]);
      set({
        stats: statsRes.data,
        users: usersRes.data,
        weeklyActivity: activityRes.data,
      });
    } catch (error) {
      toast.error(
        error?.response?.data?.message || "Couldn't load admin dashboard"
      );
    } finally {
      set({ isLoading: false });
    }
  },

  toggleSuspend: async (userId) => {
    try {
      const res = await axiosInstance.patch(`/admin/users/${userId}/suspend`);
      set({
        users: get().users.map((u) =>
          u._id === userId ? { ...u, status: res.data.status } : u
        ),
      });
    } catch (error) {
      toast.error(error?.response?.data?.message || "Couldn't update user");
    }
  },

  removeUser: async (userId) => {
    try {
      await axiosInstance.delete(`/admin/users/${userId}`);
      set({ users: get().users.filter((u) => u._id !== userId) });
      toast.success("User deleted");
    } catch (error) {
      toast.error(error?.response?.data?.message || "Couldn't delete user");
    }
  },
}));
