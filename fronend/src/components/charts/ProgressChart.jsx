import { useEffect, useRef, useMemo } from "react";
import {
  Chart,
  LineController,
  LineElement,
  PointElement,
  LinearScale,
  CategoryScale,
  Tooltip,
  Filler,
} from "chart.js";
import { useWorkoutStore } from "../../store/workoutStore";

// ✅ registrar solo lo necesario (tree-shaking)
Chart.register(
  LineController,
  LineElement,
  PointElement,
  LinearScale,
  CategoryScale,
  Tooltip,
  Filler,
);

const grupoColores = {
  Pecho: "#3b82f6",
  Espalda: "#8b5cf6",
  Piernas: "#ec4899",
  "Hombros y brazos": "#14b8a6",
};

const nivelColores = {
  principiante: "#22c55e",
  intermedio: "#f59e0b",
  avanzado: "#ef4444",
};

const nivelLabels = {
  principiante: "Principiante",
  intermedio: "Intermedio",
  avanzado: "Avanzado",
};

export default function ProgressChart() {
  const canvasRef = useRef(null);
  const chartRef = useRef(null);

  const historialPorNivel = useWorkoutStore((s) => s.historialPorNivel);
  const nivelActivo = useWorkoutStore((s) => s.nivelActivo);

  const historialSeries = historialPorNivel[nivelActivo] || [];
  const colorNivel = nivelColores[nivelActivo] || "#22c55e";

  // ✅ MEMO: evita cálculos en cada render
  const { labels, data, progreso, completados, total } = useMemo(() => {
    const total = historialSeries.length;

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

    const progreso = total ? Math.round((hechos.length / total) * 100) : 0;

    return {
      labels,
      data,
      progreso,
      completados: hechos.length,
      total,
    };
  }, [historialSeries]);

  useEffect(() => {
    if (!canvasRef.current) return;

    // 🚀 UPDATE SIN REFLOW PESADO
    if (chartRef.current) {
      chartRef.current.data.labels = labels;
      chartRef.current.data.datasets[0].data = data;
      chartRef.current.data.datasets[0].borderColor = colorNivel;
      chartRef.current.data.datasets[0].backgroundColor = colorNivel + "15";

      chartRef.current.update("none"); // 🔥 clave performance
      return;
    }

    // ✅ CREACIÓN INICIAL
    chartRef.current = new Chart(canvasRef.current, {
      type: "line",
      data: {
        labels,
        datasets: [
          {
            label: `Progreso ${nivelLabels[nivelActivo] || ""}`,
            data,
            borderColor: colorNivel,
            backgroundColor: colorNivel + "15",
            borderWidth: 2,
            pointRadius: 4,
            tension: 0.4,
            fill: true,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        animation: false, // 🔥 eliminar animaciones
        plugins: {
          legend: { display: false },
          tooltip: {
            callbacks: {
              label: (item) => ` ${item.raw}%`,
            },
          },
        },
        scales: {
          y: {
            min: 0,
            max: 100,
            ticks: {
              callback: (v) => v + "%",
            },
          },
          x: {
            grid: { display: false },
          },
        },
      },
    });

    return () => {
      chartRef.current?.destroy();
      chartRef.current = null;
    };
  }, [labels, data, colorNivel, nivelActivo]);

  return (
    <div className="chart-wrap">
      <div className="chart-stats">
        <div className="stat">
          <span className="stat-valor" style={{ color: colorNivel }}>
            {progreso}%
          </span>
          <span className="stat-label">Progreso</span>
        </div>

        <div className="stat">
          <span className="stat-valor" style={{ color: "#3b82f6" }}>
            {completados}/{total}
          </span>
          <span className="stat-label">Ejercicios</span>
        </div>

        <div className="stat-nivel" style={{ color: colorNivel }}>
          {nivelLabels[nivelActivo]}
        </div>
      </div>

      <div className="chart-leyenda">
        {Object.entries(grupoColores).map(([grupo, color]) => (
          <span key={grupo} className="leyenda-item">
            <span className="leyenda-dot" style={{ background: color }} />
            {grupo}
          </span>
        ))}
      </div>

      <canvas ref={canvasRef} style={{ flex: 1 }} />

      {!completados && (
        <div className="chart-vacio">
          <i className=""></i>
          Marca ejercicios para ver tu progreso
        </div>
      )}
    </div>
  );
}
