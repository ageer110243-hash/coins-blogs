import { create } from "zustand";

export const useProfileViewStore = create((set) => ({
  viewedPerson: null,
  openProfile: (person) => set({ viewedPerson: person }),
  closeProfile: () => set({ viewedPerson: null }),
}));
