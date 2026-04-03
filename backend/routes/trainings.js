import { Router } from "express";
import Training from "../models/Training.js";
import { protect, adminOnly } from "../middleware/auth.js";

const router = Router();

// GET /api/trainings — cualquier usuario autenticado
router.get("/", protect, async (req, res) => {
  try {
    const trainings = await Training.find().sort({ createdAt: -1 });
    res.json(trainings);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/trainings — solo admin
router.post("/", protect, adminOnly, async (req, res) => {
  try {
    const { name, description } = req.body;
    if (!name) return res.status(400).json({ error: "name es requerido" });
    const training = await Training.create({
      name,
      description,
      createdBy: req.user._id,
    });
    res.status(201).json(training);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE /api/trainings/:id — solo admin
router.delete("/:id", protect, adminOnly, async (req, res) => {
  try {
    await Training.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
