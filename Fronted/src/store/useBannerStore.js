import { create } from "zustand";
import toast from "react-hot-toast";
import { axiosInstance } from "../lib/axios.js";

export const useBannerStore = create((set, get) => ({
  banners: [], // active-only, public — feeds the Home page hero carousel
  adminBanners: [], // every banner (active or not) — admin panel list
  isLoadingBanners: false,
  isLoadingAdminBanners: false,
  isSavingBanner: false,

  fetchBanners: async () => {
    set({ isLoadingBanners: true });
    try {
      const res = await axiosInstance.get("/banners");
      set({ banners: res.data });
    } catch {
      // a broken hero carousel shouldn't be loud — the section just hides
    } finally {
      set({ isLoadingBanners: false });
    }
  },

  fetchAdminBanners: async () => {
    set({ isLoadingAdminBanners: true });
    try {
      const res = await axiosInstance.get("/banners/admin");
      set({ adminBanners: res.data });
    } catch (error) {
      toast.error(error?.response?.data?.message || "Couldn't load banners");
    } finally {
      set({ isLoadingAdminBanners: false });
    }
  },

  createBanner: async (payload) => {
    set({ isSavingBanner: true });
    try {
      const res = await axiosInstance.post("/banners", payload);
      set({ adminBanners: [res.data, ...get().adminBanners] });
      toast.success("Banner added");
      return res.data;
    } catch (error) {
      toast.error(error?.response?.data?.message || "Couldn't add banner");
      return null;
    } finally {
      set({ isSavingBanner: false });
    }
  },

  toggleBannerActive: async (id, isActive) => {
    try {
      const res = await axiosInstance.put(`/banners/${id}`, { isActive });
      set({
        adminBanners: get().adminBanners.map((b) => (b._id === id ? res.data : b)),
      });
    } catch (error) {
      toast.error(error?.response?.data?.message || "Couldn't update banner");
    }
  },

  deleteBanner: async (id) => {
    try {
      await axiosInstance.delete(`/banners/${id}`);
      set({ adminBanners: get().adminBanners.filter((b) => b._id !== id) });
      toast.success("Banner deleted");
    } catch (error) {
      toast.error(error?.response?.data?.message || "Couldn't delete banner");
    }
  },
}));
