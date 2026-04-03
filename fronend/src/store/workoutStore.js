import { create } from "zustand";
import { api } from "../lib/api";

const grupoColores = {
  Pecho: "#3b82f6",
  Espalda: "#8b5cf6",
  Piernas: "#ec4899",
  "Hombros y brazos": "#14b8a6",
};

export const useWorkoutStore = create((set, get) => ({
  nivelActivo: "principiante",
  inicioSesion: null,
  historialSeries: [],
  historialPorNivel: {
    principiante: [],
    intermedio: [],
    avanzado: [],
  }, // estado en memoria de la sesión actual
  historial: [], // sesiones pasadas (de MongoDB)
  cargando: false,

  // ── Carga la sesión activa + historial desde MongoDB ──────────────
  cargarProgreso: async () => {
    const { historial } = get();

    // 🔥 evita llamadas innecesarias
    if (historial.length) return;
    set({ cargando: true });
    try {
      const { historial } = await api("/api/progreso");

      const porNivel = {
        principiante: [],
        intermedio: [],
        avanzado: [],
      };

      historial.forEach((sesion) => {
        if (sesion.nivel && porNivel[sesion.nivel] !== undefined) {
          porNivel[sesion.nivel] = sesion.ejercicios || [];
        }
      });

      // 🔥 definir nivel activo (última sesión)
      const ultimaSesion = historial?.[0];

      set({
        historial,
        historialPorNivel: porNivel,
        nivelActivo: ultimaSesion?.nivel || "principiante",
        historialSeries: porNivel[ultimaSesion?.nivel] || [],
        inicioSesion: ultimaSesion?.fecha
          ? new Date(ultimaSesion.fecha).getTime()
          : Date.now(),
      });
    } catch (err) {
      console.error("Error cargando progreso:", err);
    } finally {
      set({ cargando: false });
    }
  },

  // ── Inicia una nueva sesión (o restaura la del día) ───────────────
  iniciarSesion: (nivel, ejerciciosTotales) => {
    const { historialPorNivel } = get();

    // 🔥 Si ya existe ese nivel, usarlo
    if (historialPorNivel[nivel]?.length) {
      set({
        nivelActivo: nivel,
        historialSeries: historialPorNivel[nivel],
        inicioSesion: Date.now(),
      });
      return;
    }

    // 🔥 Si no existe, crear nuevo
    const nuevo = ejerciciosTotales.map((e) => ({
      grupo: e.grupo,
      ejercicio: e.nombre,
      completado: false,
      tiempo: null,
    }));

    set((state) => ({
      nivelActivo: nivel,
      historialSeries: nuevo,
      historialPorNivel: {
        ...state.historialPorNivel,
        [nivel]: nuevo,
      },
      inicioSesion: Date.now(),
    }));
  },

  // ── Marca/desmarca un ejercicio y guarda en MongoDB ───────────────
  registrarEjercicio: async (grupo, ejercicio, completado) => {
    const { nivelActivo, historialPorNivel, inicioSesion } = get();

    const actual = historialPorNivel[nivelActivo];

    const actualizado = actual.map((e) => {
      if (e.ejercicio === ejercicio && e.grupo === grupo) {
        return {
          ...e,
          completado,
          tiempo: completado
            ? Math.floor((Date.now() - (inicioSesion || Date.now())) / 1000)
            : null,
        };
      }
      return e;
    });

    set((state) => ({
      historialSeries: actualizado,
      historialPorNivel: {
        ...state.historialPorNivel,
        [nivelActivo]: actualizado,
      },
    }));

    // 🔥 guardar en backend
    const completados = actualizado.filter((e) => e.completado).length;
    const porcentaje = Math.round((completados / actualizado.length) * 100);

    try {
      await api("/api/progreso", {
        method: "POST",
        body: JSON.stringify({
          nivel: nivelActivo,
          ejercicios: actualizado,
          porcentaje,
        }),
      });
    } catch (err) {
      console.error(err);
    }
  },

  // ── Resetear sesión del día ───────────────────────────────────────
  resetearSesion: () => {
    const { nivelActivo } = get();

    set((state) => ({
      historialPorNivel: {
        ...state.historialPorNivel,
        [nivelActivo]: [],
      },
      historialSeries: [],
      inicioSesion: Date.now(),
    }));
  },

  // ── Getters calculados ────────────────────────────────────────────
  getProgresoGlobal: () => {
    const { historialPorNivel, nivelActivo } = get();
    const historialSeries = historialPorNivel[nivelActivo] || [];

    if (!historialSeries.length) return 0;

    const completados = historialSeries.filter((e) => e.completado).length;
    return Math.round((completados / historialSeries.length) * 100);
  },

  getEjerciciosCompletados: () => {
    const { historialPorNivel, nivelActivo } = get();
    const historialSeries = historialPorNivel[nivelActivo] || [];

    return historialSeries.filter((e) => e.completado).length;
  },

  getTotalEjercicios: () => {
    const { historialPorNivel, nivelActivo } = get();
    const historialSeries = historialPorNivel[nivelActivo] || [];

    return historialSeries.length;
  },

  getDatosGrafica: () => {
    const { historialPorNivel, nivelActivo } = get();
    const historialSeries = historialPorNivel[nivelActivo] || [];

    const total = historialSeries.length;

    if (!total)
      return {
        labels: ["Inicio"],
        data: [0],
        colores: ["rgba(34,197,94,0.5)"],
      };

    const hechos = historialSeries
      .filter((e) => e.completado && e.tiempo !== null)
      .sort((a, b) => a.tiempo - b.tiempo);

    const labels = [
      "Inicio",
      ...hechos.map((e) =>
        e.ejercicio.length > 14 ? e.ejercicio.slice(0, 14) + "…" : e.ejercicio,
      ),
    ];

    const data = [
      0,
      ...hechos.map((_, i) => Math.round(((i + 1) / total) * 100)),
    ];

    const colores = [
      "#94a3b8",
      ...hechos.map((e) => grupoColores[e.grupo] || "#22c55e"),
    ];

    return { labels, data, colores };
  },
}));
