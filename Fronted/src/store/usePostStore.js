import { create } from "zustand";
import toast from "react-hot-toast";
import { axiosInstance } from "../lib/axios.js";

export const usePostStore = create((set, get) => ({
  posts: [],
  categories: [],
  activeCategory: "All",
  isLoading: false,
  isCreating: false,
  isInquiring: false,

  getCategories: async () => {
    try {
      const res = await axiosInstance.get("/posts/categories");
      set({ categories: res.data });
    } catch {
      // non-critical — the filter bar just won't show categories yet
    }
  },

  getPosts: async () => {
    set({ isLoading: true });
    try {
      const { activeCategory } = get();
      const params = activeCategory !== "All" ? { category: activeCategory } : {};
      const res = await axiosInstance.get("/posts", { params });
      set({ posts: res.data });
    } catch (error) {
      toast.error(error?.response?.data?.message || "Couldn't load the feed");
    } finally {
      set({ isLoading: false });
    }
  },

  setCategory: (category) => {
    set({ activeCategory: category });
    get().getPosts();
  },

  createPost: async ({ title, description, image, category }) => {
    set({ isCreating: true });
    try {
      const res = await axiosInstance.post("/posts", { title, description, image, category });
      set((state) => ({ posts: [res.data, ...state.posts] }));
      toast.success("Posted!");
      return true;
    } catch (error) {
      toast.error(error?.response?.data?.message || "Couldn't create post");
      return false;
    } finally {
      set({ isCreating: false });
    }
  },

  deletePost: async (postId) => {
    try {
      await axiosInstance.delete(`/posts/${postId}`);
      set((state) => ({ posts: state.posts.filter((p) => p._id !== postId) }));
      toast.success("Post removed");
    } catch (error) {
      toast.error(error?.response?.data?.message || "Couldn't remove post");
    }
  },

  toggleLike: async (postId) => {
    // optimistic update
    set((state) => ({
      posts: state.posts.map((p) =>
        p._id === postId
          ? {
              ...p,
              likedByMe: !p.likedByMe,
              likesCount: p.likesCount + (p.likedByMe ? -1 : 1),
            }
          : p
      ),
    }));
    try {
      await axiosInstance.post(`/posts/${postId}/like`);
    } catch {
      get().getPosts(); // reconcile with the server if the optimistic update was wrong
    }
  },

  // Returns the seller's user object on success so the caller can select
  // them as a chat contact and navigate straight to the conversation.
  startInquiry: async (postId) => {
    set({ isInquiring: true });
    try {
      const res = await axiosInstance.post(`/posts/${postId}/inquire`);
      return res.data;
    } catch (error) {
      toast.error(error?.response?.data?.message || "Couldn't start the conversation");
      return null;
    } finally {
      set({ isInquiring: false });
    }
  },
}));
