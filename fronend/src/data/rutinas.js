export const niveles = [
  {
    key: "principiante",
    label: "Principiante",
    color: "#22c55e",
    bg: "#f0fdf4",
    desc: "Ideal para comenzar",
  },
  {
    key: "intermedio",
    label: "Intermedio",
    color: "#f59e0b",
    bg: "#fffbeb",
    desc: "Para quienes ya entrenan",
  },
  {
    key: "avanzado",
    label: "Avanzado",
    color: "#ef4444",
    bg: "#fff1f2",
    desc: "Alto rendimiento",
  },
];

export const rutinas = {
  principiante: [
    {
      grupo: "Pecho",
      color: "#3b82f6",
      ejercicios: [
        { nombre: "Flexiones", series: 3, reps: "10", descanso: "60s" },
        { nombre: "Press banca", series: 3, reps: "8", descanso: "90s" },
        {
          nombre: "Aperturas mancuernas",
          series: 3,
          reps: "12",
          descanso: "60s",
        },
      ],
    },
    {
      grupo: "Espalda",
      color: "#8b5cf6",
      ejercicios: [
        { nombre: "Jalón al pecho", series: 3, reps: "10", descanso: "90s" },
        {
          nombre: "Remo con mancuerna",
          series: 3,
          reps: "10",
          descanso: "60s",
        },
        { nombre: "Superman en suelo", series: 3, reps: "15", descanso: "45s" },
      ],
    },
    {
      grupo: "Piernas",
      color: "#ec4899",
      ejercicios: [
        { nombre: "Sentadilla", series: 3, reps: "12", descanso: "90s" },
        { nombre: "Zancadas", series: 3, reps: "10", descanso: "60s" },
        {
          nombre: "Peso muerto rumano",
          series: 3,
          reps: "10",
          descanso: "90s",
        },
      ],
    },
    {
      grupo: "Hombros y brazos",
      color: "#14b8a6",
      ejercicios: [
        { nombre: "Press militar", series: 3, reps: "10", descanso: "90s" },
        { nombre: "Curl bíceps", series: 3, reps: "12", descanso: "60s" },
        { nombre: "Extensión tríceps", series: 3, reps: "12", descanso: "60s" },
      ],
    },
  ],
  intermedio: [
    {
      grupo: "Pecho",
      color: "#3b82f6",
      ejercicios: [
        {
          nombre: "Press banca inclinado",
          series: 4,
          reps: "10",
          descanso: "90s",
        },
        {
          nombre: "Fondos en paralelas",
          series: 4,
          reps: "12",
          descanso: "60s",
        },
        { nombre: "Cruces en polea", series: 3, reps: "15", descanso: "60s" },
      ],
    },
    {
      grupo: "Espalda",
      color: "#8b5cf6",
      ejercicios: [
        { nombre: "Dominadas", series: 4, reps: "8", descanso: "90s" },
        { nombre: "Remo en barra", series: 4, reps: "10", descanso: "90s" },
        { nombre: "Peso muerto", series: 3, reps: "8", descanso: "120s" },
      ],
    },
    {
      grupo: "Piernas",
      color: "#ec4899",
      ejercicios: [
        {
          nombre: "Sentadilla con barra",
          series: 4,
          reps: "10",
          descanso: "120s",
        },
        { nombre: "Prensa de pierna", series: 4, reps: "12", descanso: "90s" },
        {
          nombre: "Extensión de cuádriceps",
          series: 3,
          reps: "15",
          descanso: "60s",
        },
      ],
    },
    {
      grupo: "Hombros y brazos",
      color: "#14b8a6",
      ejercicios: [
        { nombre: "Press Arnold", series: 4, reps: "10", descanso: "90s" },
        { nombre: "Curl martillo", series: 3, reps: "12", descanso: "60s" },
        { nombre: "Tríceps en polea", series: 3, reps: "15", descanso: "60s" },
      ],
    },
  ],
  avanzado: [
    {
      grupo: "Pecho",
      color: "#3b82f6",
      ejercicios: [
        {
          nombre: "Press banca con cadenas",
          series: 5,
          reps: "5",
          descanso: "120s",
        },
        {
          nombre: "Aperturas con mancuernas pesadas",
          series: 4,
          reps: "10",
          descanso: "90s",
        },
        { nombre: "Fondos lastre", series: 4, reps: "8", descanso: "90s" },
      ],
    },
    {
      grupo: "Espalda",
      color: "#8b5cf6",
      ejercicios: [
        {
          nombre: "Peso muerto convencional",
          series: 5,
          reps: "5",
          descanso: "180s",
        },
        {
          nombre: "Dominadas lastradas",
          series: 4,
          reps: "8",
          descanso: "120s",
        },
        { nombre: "Remo Pendlay", series: 4, reps: "8", descanso: "90s" },
      ],
    },
    {
      grupo: "Piernas",
      color: "#ec4899",
      ejercicios: [
        {
          nombre: "Sentadilla frontal",
          series: 5,
          reps: "5",
          descanso: "180s",
        },
        {
          nombre: "Zancadas con barra",
          series: 4,
          reps: "10",
          descanso: "90s",
        },
        { nombre: "Peso muerto sumo", series: 4, reps: "8", descanso: "120s" },
      ],
    },
    {
      grupo: "Hombros y brazos",
      color: "#14b8a6",
      ejercicios: [
        {
          nombre: "Press militar pesado",
          series: 5,
          reps: "5",
          descanso: "120s",
        },
        {
          nombre: "Curl bíceps en barra Z",
          series: 4,
          reps: "8",
          descanso: "90s",
        },
        { nombre: "Press francés", series: 4, reps: "10", descanso: "90s" },
      ],
    },
  ],
};
