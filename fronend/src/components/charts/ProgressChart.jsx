import { useEffect, useRef, useMemo, useState } from "react";
import { useWorkoutStore } from "../../store/workoutStore";

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

  const [chartReady, setChartReady] = useState(false);

  const historialPorNivel = useWorkoutStore((s) => s.historialPorNivel);
  const nivelActivo = useWorkoutStore((s) => s.nivelActivo);

  const historialSeries = historialPorNivel[nivelActivo] || [];
  const colorNivel = nivelColores[nivelActivo] || "#22c55e";

  // ✅ MEMO
  const { labels, data, progreso, completados, total } = useMemo(() => {
    const total = historialSeries.length;

    const hechos = historialSeries
      .filter((e) => e.completado && e.tiempo !== null)
      .sort((a, b) => a.tiempo - b.tiempo);

    return {
      labels: [
        "Inicio",
        ...hechos.map((e) =>
          e.ejercicio.length > 14
            ? e.ejercicio.slice(0, 14) + "…"
            : e.ejercicio,
        ),
      ],
      data: [0, ...hechos.map((_, i) => Math.round(((i + 1) / total) * 100))],
      progreso: total ? Math.round((hechos.length / total) * 100) : 0,
      completados: hechos.length,
      total,
    };
  }, [historialSeries]);

  // 🚀 DIFERIR CARGA (clave para performance)
  useEffect(() => {
    const idle = window.requestIdleCallback || ((cb) => setTimeout(cb, 300));

    idle(() => setChartReady(true));
  }, []);

  // 🚀 CARGA DINÁMICA DE CHART.JS
  useEffect(() => {
    if (!chartReady || !canvasRef.current) return;

    let mounted = true;

    import("chart.js").then((mod) => {
      if (!mounted) return;

      const {
        Chart,
        LineController,
        LineElement,
        PointElement,
        LinearScale,
        CategoryScale,
        Tooltip,
        Filler,
      } = mod;

      Chart.register(
        LineController,
        LineElement,
        PointElement,
        LinearScale,
        CategoryScale,
        Tooltip,
        Filler,
      );

      chartRef.current = new Chart(canvasRef.current, {
        type: "line",
        data: {
          labels,
          datasets: [
            {
              data,
              borderColor: colorNivel,
              backgroundColor: colorNivel + "15",
              borderWidth: 2,
              pointRadius: 3,
              tension: 0.4,
              fill: true,
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          animation: false,
          plugins: { legend: { display: false } },
          scales: {
            y: {
              min: 0,
              max: 100,
              ticks: { callback: (v) => v + "%" },
            },
            x: { grid: { display: false } },
          },
        },
      });
    });

    return () => {
      mounted = false;
      chartRef.current?.destroy();
      chartRef.current = null;
    };
  }, [chartReady]);

  // 🚀 SOLO UPDATE (no recrear)
  useEffect(() => {
    if (!chartRef.current) return;

    chartRef.current.data.labels = labels;
    chartRef.current.data.datasets[0].data = data;
    chartRef.current.update("none");
  }, [labels, data]);

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

      {/* ✅ evita CLS */}
      <div style={{ height: 220 }}>
        <canvas ref={canvasRef} />
      </div>

      {!completados && (
        <div className="chart-vacio">Marca ejercicios para ver tu progreso</div>
      )}
    </div>
  );
}
