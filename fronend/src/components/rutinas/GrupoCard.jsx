import { useState, useEffect, useRef } from "react";
import { useWorkoutStore } from "../../store/workoutStore";

export default function GrupoCard({ grupo }) {
  const registrarEjercicio = useWorkoutStore((s) => s.registrarEjercicio);
  const historialSeries = useWorkoutStore(
    (s) => s.historialPorNivel[s.nivelActivo],
  );

  // Inicializar checks desde el historial guardado en MongoDB
  const [completados, setCompletados] = useState(() => {
    const guardados = historialSeries
      .filter((e) => e.grupo === grupo.grupo && e.completado)
      .map((e) => e.ejercicio);
    return new Set(guardados);
  });

  // Re-sincronizar cuando el historial cambia (ej: al cargar desde MongoDB)
  useEffect(() => {
    const guardados = historialSeries
      .filter((e) => e.grupo === grupo.grupo && e.completado)
      .map((e) => e.ejercicio);
    setCompletados(new Set(guardados));
  }, [historialSeries]);

  const [timerActivo, setTimerActivo] = useState(false);
  const [timerEjercicio, setTimerEjercicio] = useState("");
  const [segundosTotal, setSegundosTotal] = useState(60);
  const [segundosLeft, setSegundosLeft] = useState(60);

  const toggleCompletado = (ej) => {
    const estaCompleto = completados.has(ej.nombre);
    setCompletados((prev) => {
      const next = new Set(prev);
      if (estaCompleto) next.delete(ej.nombre);
      else next.add(ej.nombre);
      return next;
    });
    registrarEjercicio(grupo.grupo, ej.nombre, !estaCompleto);
  };

  const iniciarTimer = (ej) => {
    const total = parseInt(ej.descanso);
    setTimerEjercicio(ej.nombre);
    setSegundosTotal(total);
    setSegundosLeft(total);
    setTimerActivo(true);

    startTimeRef.current = Date.now();

    const tick = () => {
      const elapsed = Math.floor((Date.now() - startTimeRef.current) / 1000);
      const left = total - elapsed;

      if (left <= 0) {
        setTimerActivo(false);
        setTimerEjercicio("");
        return;
      }

      setSegundosLeft(left);
      requestAnimationFrame(tick);
    };

    requestAnimationFrame(tick);
  };

  const todosCompletados = grupo.ejercicios.every((e) =>
    completados.has(e.nombre),
  );
  const progreso = Math.round(
    (completados.size / grupo.ejercicios.length) * 100,
  );
  const porcentajeTimer = ((segundosLeft / segundosTotal) * 100).toFixed(1);

  return (
    <div className={`grupo-card${todosCompletados ? " grupo-completado" : ""}`}>
      <div className="grupo-header" style={{ borderLeftColor: grupo.color }}>
        <i
          className={grupo.icono}
          style={{
            color: grupo.color,
            fontSize: 18,
            width: 20,
            textAlign: "center",
          }}
        ></i>
        <span className="grupo-nombre">{grupo.grupo}</span>
        <span
          className="grupo-progreso"
          style={{ background: grupo.color + "20", color: grupo.color }}
        >
          {completados.size}/{grupo.ejercicios.length}
        </span>
      </div>

      <div className="barra-fondo">
        <div
          className="barra-fill"
          style={{ width: progreso + "%", background: grupo.color }}
        ></div>
      </div>

      {timerActivo && (
        <div className="timer-banner">
          <div className="timer-info">
            <span>
              <i
                className="fa-solid fa-stopwatch"
                style={{ color: "#22c55e" }}
              ></i>{" "}
              Descansando — {timerEjercicio}
            </span>
            <span
              className={`timer-segundos${segundosLeft <= 5 ? " timer-urgente" : ""}`}
            >
              {segundosLeft}s
            </span>
          </div>
          <div className="timer-barra-fondo">
            <div
              className={`timer-barra-fill${segundosLeft <= 5 ? " timer-urgente-fill" : ""}`}
              style={{ width: porcentajeTimer + "%" }}
            ></div>
          </div>
          <button className="btn-cancelar-timer" onClick={cancelarTimer}>
            <i className="fa-solid fa-xmark"></i> Cancelar
          </button>
        </div>
      )}

      <table className="tabla">
        <thead>
          <tr>
            <th></th>
            <th>Ejercicio</th>
            <th>Series</th>
            <th>Reps</th>
            <th>Descanso</th>
          </tr>
        </thead>
        <tbody>
          {grupo.ejercicios.map((ej) => (
            <tr
              key={ej.nombre}
              className={completados.has(ej.nombre) ? "fila-completada" : ""}
            >
              <td>
                <button
                  className={`btn-check${completados.has(ej.nombre) ? " checked" : ""}`}
                  onClick={() => toggleCompletado(ej)}
                  aria-label={`${completados.has(ej.nombre) ? "Desmarcar" : "Marcar"} ejercicio ${ej.nombre}`}
                  aria-pressed={completados.has(ej.nombre)}
                >
                  <i className="fa-solid fa-check" aria-hidden="true"></i>
                </button>
              </td>
              <td
                className={`td-nombre${completados.has(ej.nombre) ? " tachado" : ""}`}
              >
                {ej.nombre}
              </td>
              <td>
                <span className="badge-series">{ej.series}</span>
              </td>
              <td>
                <span className="badge-reps">{ej.reps}</span>
              </td>
              <td>
                <button
                  className={`btn-timer${timerEjercicio === ej.nombre && timerActivo ? " timer-en-curso" : ""}`}
                  onClick={() => iniciarTimer(ej)}
                  aria-label={`Iniciar descanso de ${ej.descanso} para ${ej.nombre}`}
                ></button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {todosCompletados && (
        <div className="badge-completado">
          <i className="fa-solid fa-trophy"></i> ¡Grupo completado!
        </div>
      )}
    </div>
  );
}
