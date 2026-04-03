import { niveles, rutinas } from "../../data/rutinas";
import { useWorkoutStore } from "../../store/workoutStore";
import NivelSelector from "./NivelSelector";
import GrupoCard from "./GrupoCard";
import { useEffect, useMemo } from "react";

export default function PlanRutinas() {
  const nivelActivo = useWorkoutStore((s) => s.nivelActivo);
  const iniciarSesion = useWorkoutStore((s) => s.iniciarSesion);

  const resetearSesion = useWorkoutStore((s) => s.resetearSesion);
  const cargando = useWorkoutStore((s) => s.cargando);

  const rutinaActiva = rutinas[nivelActivo];
  const ejerciciosTotales = rutinaActiva.flatMap((g) =>
    g.ejercicios.map((e) => ({ grupo: g.grupo, nombre: e.nombre })),
  );

  // Al cambiar de nivel: iniciar sesión para ese nivel
  const ejerciciosMemo = useMemo(() => ejerciciosTotales, [nivelActivo]);

  useEffect(() => {
    iniciarSesion(nivelActivo, ejerciciosMemo);
  }, [nivelActivo]);

  const cambiarNivel = (key) => {
    useWorkoutStore.setState({ nivelActivo: key });
  };

  return (
    <div>
      <div className="section-title-row">
        <div className="section-title">Plan de Entrenamiento</div>
        <button
          className="btn-reset"
          onClick={resetearSesion}
          title="Resetear sesión de hoy"
        >
          <i className="fa-solid fa-rotate-right"></i> Resetear día
        </button>
      </div>

      <NivelSelector
        niveles={niveles}
        nivelActivo={nivelActivo}
        onChange={cambiarNivel}
      />

      {cargando ? (
        <div className="loading-msg">
          <i className="fa-solid fa-spinner fa-spin"></i> Cargando tu
          progreso...
        </div>
      ) : (
        <div className="grupos-grid">
          {rutinaActiva.map((grupo) => (
            <GrupoCard key={grupo.grupo} grupo={grupo} />
          ))}
        </div>
      )}
    </div>
  );
}
