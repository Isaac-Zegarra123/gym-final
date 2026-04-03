import { useState, useEffect, useMemo, useRef, memo } from "react";
import { useWorkoutStore } from "../../store/workoutStore";

function GrupoCard({ grupo }) {
  const { registrarEjercicio, historialSeries } = useWorkoutStore((s) => ({
    registrarEjercicio: s.registrarEjercicio,
    historialSeries: s.historialPorNivel?.[s.nivelActivo] || [],
  }));

  const [completados, setCompletados] = useState(() => {
    const guardados = historialSeries
      .filter((e) => e.grupo === grupo.grupo && e.completado)
      .map((e) => e.ejercicio);
    return new Set(guardados);
  });

  useEffect(() => {
    const guardados = historialSeries
      .filter((e) => e.grupo === grupo.grupo && e.completado)
      .map((e) => e.ejercicio);

    setCompletados(new Set(guardados));
  }, [historialSeries, grupo.grupo]);

  const [timerActivo, setTimerActivo] = useState(false);
  const [timerEjercicio, setTimerEjercicio] = useState("");
  const [segundosTotal, setSegundosTotal] = useState(60);
  const [segundosLeft, setSegundosLeft] = useState(60);

  const intervalRef = useRef(null);

  const iniciarTimer = (ej) => {
    const total = parseInt(ej.descanso);

    if (intervalRef.current) clearInterval(intervalRef.current);

    setTimerEjercicio(ej.nombre);
    setSegundosTotal(total);
    setSegundosLeft(total);
    setTimerActivo(true);

    const start = Date.now();

    intervalRef.current = setInterval(() => {
      const elapsed = Math.floor((Date.now() - start) / 1000);
      const left = total - elapsed;

      if (left <= 0) {
        clearInterval(intervalRef.current);
        setTimerActivo(false);
        setTimerEjercicio("");
        return;
      }

      setSegundosLeft(left);
    }, 1000);
  };

  const cancelarTimer = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    setTimerActivo(false);
    setTimerEjercicio("");
  };

  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

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

  const { todosCompletados, progreso } = useMemo(() => {
    const total = grupo.ejercicios.length;
    const completadosCount = completados.size;

    return {
      todosCompletados: completadosCount === total,
      progreso: Math.round((completadosCount / total) * 100),
    };
  }, [completados, grupo.ejercicios]);

  const porcentajeTimer = useMemo(
    () => ((segundosLeft / segundosTotal) * 100).toFixed(1),
    [segundosLeft, segundosTotal],
  );

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
        />
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
        />
      </div>

      {timerActivo && (
        <div className="timer-banner">
          <div className="timer-info">
            <span>Descansando — {timerEjercicio}</span>
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
            />
          </div>

          <button className="btn-cancelar-timer" onClick={cancelarTimer}>
            Cancelar
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
          {grupo.ejercicios.map((ej) => {
            const checked = completados.has(ej.nombre);

            return (
              <tr key={ej.nombre} className={checked ? "fila-completada" : ""}>
                <td>
                  <button
                    className={`btn-check${checked ? " checked" : ""}`}
                    onClick={() => toggleCompletado(ej)}
                    aria-label={`${checked ? "Desmarcar" : "Marcar"} ${ej.nombre}`}
                    aria-pressed={checked}
                  >
                    ✔
                  </button>
                </td>

                <td className={`td-nombre${checked ? " tachado" : ""}`}>
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
                    className={`btn-timer${
                      timerEjercicio === ej.nombre && timerActivo
                        ? " timer-en-curso"
                        : ""
                    }`}
                    onClick={() => iniciarTimer(ej)}
                    aria-label={`Descanso ${ej.descanso}`}
                  >
                    ⏱
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

      {todosCompletados && (
        <div className="badge-completado">🏆 ¡Grupo completado!</div>
      )}
    </div>
  );
}

export default memo(GrupoCard);
