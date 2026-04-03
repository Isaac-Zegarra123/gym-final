import mongoose from "mongoose";

// Cada documento = una sesión de entrenamiento de un usuario
const progresoSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    nivel: {
      type: String,
      enum: ["principiante", "intermedio", "avanzado"],
      required: true,
    },
    fecha: {
      type: Date,
      default: Date.now,
    },
    // Porcentaje global completado 0-100
    porcentaje: {
      type: Number,
      default: 0,
    },
    // Detalle de cada ejercicio marcado
    ejercicios: [
      {
        grupo: String,
        ejercicio: String,
        completado: Boolean,
        tiempo: Number, // segundos desde inicio de sesión
      },
    ],
  },
  { timestamps: true },
);

export default mongoose.model("Progreso", progresoSchema);
