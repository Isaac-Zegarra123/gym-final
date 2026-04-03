import express from "express";
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

const allowedOrigins = [
  "http://localhost:5173",
  "https://gym-final-liard.vercel.app",
];

app.use((req, res, next) => {
  const origin = req.headers.origin;

  if (allowedOrigins.includes(origin)) {
    res.setHeader("Access-Control-Allow-Origin", origin);
  }

  res.setHeader("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type,Authorization");
  res.setHeader("Access-Control-Allow-Credentials", "true");

  // responder preflight
  if (req.method === "OPTIONS") {
    return res.sendStatus(200);
  }

  next();
});

app.use(express.json());

app.use("/api/auth", authRouter);
app.use("/api/trainings", trainingsRouter);
app.use("/api/diets", dietsRouter);
app.use("/api/progreso", progresoRouter);

// Health check para Render
app.get("/", (req, res) => {
  res.json({ status: "ok", message: "GymApp API corriendo" });
});

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
