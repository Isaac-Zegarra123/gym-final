import { create } from "zustand";
import { api } from "../lib/api";

export const useAuthStore = create((set) => ({
  user: null,
  loading: true,

  // Verifica si hay token guardado al iniciar la app
  init: async () => {
    const token = localStorage.getItem("token");
    if (!token) return set({ loading: false });
    try {
      const user = await api("/api/auth/me");
      set({ user, loading: false });
    } catch {
      localStorage.removeItem("token");
      set({ user: null, loading: false });
    }
  },

  login: async (email, password) => {
    const data = await api("/api/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });

    localStorage.setItem("token", data.token);
    set({ user: data.user });

    import("../store/workoutStore").then(({ useWorkoutStore }) => {
      useWorkoutStore.getState().cargarProgreso();
    });
  },

  register: async (name, email, password) => {
    const data = await api("/api/auth/register", {
      method: "POST",
      body: JSON.stringify({ name, email, password }),
    });
    localStorage.setItem("token", data.token);
    set({ user: data.user });
  },

  logout: () => {
    localStorage.removeItem("token");
    set({ user: null });
  },
}));
