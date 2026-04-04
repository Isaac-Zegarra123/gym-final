import { useEffect, useRef, useMemo, useState } from "react";
import { useWorkoutStore } from "../../store/workoutStore";

const nivelColores = {
  principiante: "#22c55e",
  intermedio: "#f59e0b",
  avanzado: "#ef4444",
};

export default function ProgressChart() {
  const canvasRef = useRef(null);
  const chartRef = useRef(null);
  const containerRef = useRef(null);

  const [visible, setVisible] = useState(false);

  const historialPorNivel = useWorkoutStore((s) => s.historialPorNivel);
  const nivelActivo = useWorkoutStore((s) => s.nivelActivo);

  const historialSeries = historialPorNivel[nivelActivo] || [];
  const colorNivel = nivelColores[nivelActivo] || "#22c55e";

  const chartData = useMemo(() => {
    const total = historialSeries.length;

    const hechos = historialSeries
      .filter((e) => e.completado && e.tiempo !== null)
      .sort((a, b) => a.tiempo - b.tiempo);

    return {
      labels: ["Inicio", ...hechos.map((e) => e.ejercicio)],
      data: [0, ...hechos.map((_, i) => Math.round(((i + 1) / total) * 100))],
      progreso: total ? Math.round((hechos.length / total) * 100) : 0,
      completados: hechos.length,
      total,
    };
  }, [historialSeries]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 },
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!visible || !canvasRef.current || chartRef.current) return;

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
      } = mod;

      Chart.register(
        LineController,
        LineElement,
        PointElement,
        LinearScale,
        CategoryScale,
      );

      chartRef.current = new Chart(canvasRef.current, {
        type: "line",
        data: {
          labels: chartData.labels,
          datasets: [
            {
              data: chartData.data,
              borderColor: colorNivel,
              borderWidth: 2,
              pointRadius: 2,
              tension: 0.4,
            },
          ],
        },
        options: {
          responsive: true,
          animation: false,
          plugins: { legend: { display: false } },
        },
      });
    });

    return () => {
      mounted = false;
      chartRef.current?.destroy();
    };
  }, [visible]);

  return (
    <div ref={containerRef} className="chart-wrap">
      <div className="chart-stats">
        <span style={{ color: colorNivel }}>{chartData.progreso}%</span>
        <span>
          {chartData.completados}/{chartData.total}
        </span>
      </div>

      <div style={{ height: 220 }}>{visible && <canvas ref={canvasRef} />}</div>
    </div>
  );
}
