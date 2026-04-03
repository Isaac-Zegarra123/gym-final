import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { connectDB } from "./lib/db.js";
import authRouter from "./routes/auth.js";
import trainingsRouter from "./routes/trainings.js";
import dietsRouter from "./routes/diets.js";
import progresoRouter from "./routes/progreso.js";

dotenv.config();
connectDB();

const app = express();
const PORT = process.env.PORT || 4000;

app.use(
  cors({
    origin: [
      process.env.FRONTEND_URL || "http://localhost:5173",
      "http://localhost:5173",
    ],
    methods: ["GET", "POST", "DELETE", "PUT"],
    credentials: true,
  }),
);

app.use(express.json());

app.use("/api/auth", authRouter);
app.use("/api/trainings", trainingsRouter);
app.use("/api/diets", dietsRouter);
app.use("/api/progreso", progresoRouter);

// Health check para Render
app.get("/", (req, res) => {
  res.json({ status: "ok", message: "GymApp API corriendo 💪" });
});

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
