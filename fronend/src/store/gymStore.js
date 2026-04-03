import { create } from "zustand";
import { api } from "../lib/api";

export const useGymStore = create((set) => ({
  trainings: [],
  diets: [],

  loadTrainings: async () => {
    const data = await api("/api/trainings");
    set({ trainings: data });
  },

  addTraining: async (training) => {
    const newT = await api("/api/trainings", {
      method: "POST",
      body: JSON.stringify(training),
    });
    set((s) => ({ trainings: [newT, ...s.trainings] }));
  },

  deleteTraining: async (id) => {
    await api(`/api/trainings/${id}`, { method: "DELETE" });
    set((s) => ({ trainings: s.trainings.filter((t) => t._id !== id) }));
  },
}));
