import { create } from "zustand";
import toast from "react-hot-toast";
import { axiosInstance } from "../lib/axios.js";

export const usePostStore = create((set, get) => ({
  posts: [],
  total: 0,
  page: 1,
  totalPages: 1,
  isLoadingPosts: false,

  businesses: [], // small featured set for the Home page carousel
  isLoadingBusinesses: false,

  activePost: null,
  isLoadingPost: false,

  myPosts: [],
  isLoadingMyPosts: false,
  isSavingPost: false,

  adminPosts: [], // every post, any author — admin panel's post manager
  isLoadingAdminPosts: false,

  filters: { search: "", city: "All Cities", category: "All" },
  setFilters: (partial) => set({ filters: { ...get().filters, ...partial } }),

  fetchPosts: async (page = 1) => {
    set({ isLoadingPosts: true });
    try {
      const { search, city, category } = get().filters;
      const res = await axiosInstance.get("/posts", {
        params: { search, city, category, page, limit: 12 },
      });
      set({
        posts: res.data.posts,
        total: res.data.total,
        page: res.data.page,
        totalPages: res.data.totalPages,
      });
    } catch (error) {
      toast.error(error?.response?.data?.message || "Couldn't load posts");
    } finally {
      set({ isLoadingPosts: false });
    }
  },

  fetchFeaturedBusinesses: async () => {
    set({ isLoadingBusinesses: true });
    try {
      const res = await axiosInstance.get("/posts", {
        params: { category: "Business", limit: 8 },
      });
      set({ businesses: res.data.posts });
    } catch {
      // silent — the carousel just won't render if this fails, it's not
      // the main content of the Home page
    } finally {
      set({ isLoadingBusinesses: false });
    }
  },

  fetchPostById: async (id) => {
    set({ isLoadingPost: true, activePost: null });
    try {
      const res = await axiosInstance.get(`/posts/${id}`);
      set({ activePost: res.data });
    } catch (error) {
      toast.error(error?.response?.data?.message || "Couldn't load this post");
    } finally {
      set({ isLoadingPost: false });
    }
  },

  fetchMyPosts: async () => {
    set({ isLoadingMyPosts: true });
    try {
      const res = await axiosInstance.get("/posts/mine/list");
      set({ myPosts: res.data });
    } catch (error) {
      toast.error(error?.response?.data?.message || "Couldn't load your posts");
    } finally {
      set({ isLoadingMyPosts: false });
    }
  },

  createPost: async (data) => {
    set({ isSavingPost: true });
    try {
      const res = await axiosInstance.post("/posts", data);
      toast.success("Post published");
      return res.data;
    } catch (error) {
      toast.error(error?.response?.data?.message || "Couldn't publish post");
      return null;
    } finally {
      set({ isSavingPost: false });
    }
  },

  fetchAdminPosts: async () => {
    set({ isLoadingAdminPosts: true });
    try {
      const res = await axiosInstance.get("/posts/admin/list");
      set({ adminPosts: res.data });
    } catch (error) {
      toast.error(error?.response?.data?.message || "Couldn't load posts");
    } finally {
      set({ isLoadingAdminPosts: false });
    }
  },

  deletePost: async (id) => {
    try {
      await axiosInstance.delete(`/posts/${id}`);
      set({
        myPosts: get().myPosts.filter((p) => p._id !== id),
        adminPosts: get().adminPosts.filter((p) => p._id !== id),
      });
      toast.success("Post deleted");
    } catch (error) {
      toast.error(error?.response?.data?.message || "Couldn't delete post");
    }
  },
}));
