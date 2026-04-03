import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";

import authRouter from "./routes/auth.js";
import trainingsRouter from "./routes/trainings.js";
import dietsRouter from "./routes/diets.js";
import progresoRouter from "./routes/progreso.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;

/*CORS SIMPLE (para producción)*/
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      process.env.FRONTEND_URL, // Vercel
    ],
    credentials: true,
  }),
);

app.use(express.json());

app.use("/api/auth", authRouter);
app.use("/api/trainings", trainingsRouter);
app.use("/api/diets", dietsRouter);
app.use("/api/progreso", progresoRouter);

app.get("/", (req, res) => {
  res.send("API Funcionando 💪");
});

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB conectado");

    app.listen(PORT, () => {
      console.log(`Servidor corriendo en puerto ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("Error MongoDB:", err);
    process.exit(1);
  });
