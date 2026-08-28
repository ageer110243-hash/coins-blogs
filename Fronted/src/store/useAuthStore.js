import { create } from "zustand";
import toast from "react-hot-toast";
import { axiosInstance } from "../lib/axios.js";

export const useAuthStore = create((set) => ({
  authUser: null,
  isSigningUp: false,
  isLoggingIn: false,
  isUpdatingProfile: false,
  isCheckingAuth: true,
  isGoogleLoggingIn: false,
  isSendingResetLink: false,
  isResettingPassword: false,

  checkAuth: async () => {
    try {
      const res = await axiosInstance.get("/auth/check");
      set({ authUser: res.data });
    } catch {
      set({ authUser: null });
    } finally {
      set({ isCheckingAuth: false });
    }
  },

  signup: async (data) => {
    set({ isSigningUp: true });
    try {
      const res = await axiosInstance.post("/auth/signup", data);
      set({ authUser: res.data });
      toast.success("Account created");
      return true;
    } catch (error) {
      toast.error(error?.response?.data?.message || "Signup failed");
      return false;
    } finally {
      set({ isSigningUp: false });
    }
  },

  login: async (data) => {
    set({ isLoggingIn: true });
    try {
      const res = await axiosInstance.post("/auth/login", data);
      set({ authUser: res.data });
      toast.success("Welcome back");
      return true;
    } catch (error) {
      toast.error(error?.response?.data?.message || "Login failed");
      return false;
    } finally {
      set({ isLoggingIn: false });
    }
  },

  logout: async () => {
    try {
      await axiosInstance.post("/auth/logout");
    } catch {
      // ignore network errors on logout, clear client state regardless
    }
    set({ authUser: null });
    toast.success("Logged out");
  },

  updateProfile: async (data) => {
    set({ isUpdatingProfile: true });
    try {
      const res = await axiosInstance.put("/auth/update-profile", data);
      set({ authUser: res.data });
      toast.success("Profile updated");
    } catch (error) {
      toast.error(error?.response?.data?.message || "Couldn't update profile");
    } finally {
      set({ isUpdatingProfile: false });
    }
  },

  googleLogin: async (idToken) => {
    set({ isGoogleLoggingIn: true });
    try {
      const res = await axiosInstance.post("/auth/google", { idToken });
      set({ authUser: res.data });
      toast.success("Welcome!");
      return true;
    } catch (error) {
      toast.error(error?.response?.data?.message || "Google sign-in failed");
      return false;
    } finally {
      set({ isGoogleLoggingIn: false });
    }
  },

  // Returns the dev-mode reset link (string) if SMTP isn't configured on
  // the backend, `true` if a real email was sent, or `false` on failure.
  forgotPassword: async (email) => {
    set({ isSendingResetLink: true });
    try {
      const res = await axiosInstance.post("/auth/forgot-password", { email });
      return res.data.resetLink || true;
    } catch (error) {
      toast.error(error?.response?.data?.message || "Something went wrong");
      return false;
    } finally {
      set({ isSendingResetLink: false });
    }
  },

  resetPassword: async (token, password) => {
    set({ isResettingPassword: true });
    try {
      const res = await axiosInstance.post(`/auth/reset-password/${token}`, { password });
      set({ authUser: res.data });
      toast.success("Password updated — you're logged in");
      return true;
    } catch (error) {
      toast.error(error?.response?.data?.message || "Couldn't reset password");
      return false;
    } finally {
      set({ isResettingPassword: false });
    }
  },
}));
