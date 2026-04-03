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

const allowedOrigins = ["http://localhost:5173", process.env.FRONTEND_URL];

app.use(
  cors({
    origin: function (origin, callback) {
      // permitir requests sin origin (Postman, curl, etc.)
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      } else {
        return callback(new Error("CORS not allowed: " + origin));
      }
    },
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    credentials: true,
  }),
);

app.options("*", cors());

app.use(express.json());

app.use("/api/auth", authRouter);
app.use("/api/trainings", trainingsRouter);
app.use("/api/diets", dietsRouter);
app.use("/api/progreso", progresoRouter);

app.get("/", (req, res) => {
  res.json({ status: "ok", message: "GymApp API corriendo" });
});

app.listen(PORT, () => {
  console.log(`Servidor corriendo en puerto ${PORT}`);
});
