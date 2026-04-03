import { Router } from "express";
import Diet from "../models/Diet.js";
import { protect, adminOnly } from "../middleware/auth.js";

const router = Router();

// GET /api/diets
router.get("/", protect, async (req, res) => {
  try {
    const diets = await Diet.find().sort({ createdAt: -1 });
    res.json(diets);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/diets — solo admin
router.post("/", protect, adminOnly, async (req, res) => {
  try {
    const { name, description } = req.body;
    if (!name) return res.status(400).json({ error: "name es requerido" });
    const diet = await Diet.create({
      name,
      description,
      createdBy: req.user._id,
    });
    res.status(201).json(diet);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE /api/diets/:id — solo admin
router.delete("/:id", protect, adminOnly, async (req, res) => {
  try {
    await Diet.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
