import { Router } from "express";
import Progreso from "../models/Progreso.js";
import { protect } from "../middleware/auth.js";

const router = Router();

// ─── GET /api/progreso ───────────────────────────────────────────
// Devuelve la sesión activa (hoy) del usuario + historial resumido
router.get("/", protect, async (req, res) => {
  try {
    // Sesión activa: la más reciente del usuario
    const sesionActiva = await Progreso.findOne({ user: req.user._id }).sort({
      fecha: -1,
    });

    // Historial: últimas 30 sesiones para la gráfica
    const historial = await Progreso.find({ user: req.user._id })
      .sort({ fecha: -1 })
      .limit(30)
      .select("nivel porcentaje fecha ejercicios");

    res.json({ sesionActiva, historial });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ─── POST /api/progreso ──────────────────────────────────────────
// Guarda o actualiza la sesión activa del día actual
router.post("/", protect, async (req, res) => {
  try {
    const { nivel, ejercicios, porcentaje } = req.body;

    // Busca si ya existe una sesión de hoy para este usuario y nivel
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);

    const sesionExistente = await Progreso.findOne({
      user: req.user._id,
      nivel,
      fecha: { $gte: hoy },
    });

    let sesion;
    if (sesionExistente) {
      // Actualiza la sesión de hoy
      sesionExistente.ejercicios = ejercicios;
      sesionExistente.porcentaje = porcentaje;
      sesion = await sesionExistente.save();
    } else {
      // Crea sesión nueva
      sesion = await Progreso.create({
        user: req.user._id,
        nivel,
        ejercicios,
        porcentaje,
      });
    }

    res.json(sesion);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ─── DELETE /api/progreso/sesion-hoy ────────────────────────────
// Resetea la sesión del día (útil para empezar de nuevo)
router.delete("/sesion-hoy", protect, async (req, res) => {
  try {
    const { nivel } = req.query;
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);

    await Progreso.deleteOne({
      user: req.user._id,
      nivel,
      fecha: { $gte: hoy },
    });

    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
