import { useNavigate, Link } from "react-router-dom";
import { useAuthStore } from "../store/authStore";
import { useWorkoutStore } from "../store/workoutStore";
import { useEffect, lazy, Suspense } from "react";

// Lazy load de componentes pesados
const ProgressChart = lazy(() => import("../components/charts/ProgressChart"));
const PlanRutinas = lazy(() => import("../components/rutinas/PlanRutinas"));

export default function Dashboard() {
  const { user, logout } = useAuthStore();
  const cargarProgreso = useWorkoutStore((s) => s.cargarProgreso);
  const navigate = useNavigate();

  useEffect(() => {
    const run = () => cargarProgreso();
    if ("requestIdleCallback" in window) {
      requestIdleCallback(run);
    } else {
      setTimeout(run, 200);
    }
  }, [cargarProgreso]);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="app">
      <nav className="navbar">
        <div className="navbar-brand">
          <i style={{ color: "#facc15" }}></i> GymApp
        </div>
        <div className="navbar-right">
          <span
            className="user-email"
            style={{ fontSize: 12, color: "#94a3b8" }}
          >
            {user?.email}
          </span>
          {user?.role === "admin" && (
            <Link to="/admin" className="btn-admin">
              Admin
            </Link>
          )}
          <button className="btn-logout" onClick={handleLogout}>
            Salir
          </button>
        </div>
      </nav>

      <main className="container">
        <div className="hero">
          <div className="hero-chart" style={{ minHeight: 300 }}>
            <h1>Bienvenido{user ? `, ${user.name}` : ""}</h1>
            <h2>Tu progreso</h2>

            {/* Suspense con placeholder para LCP */}
            <Suspense
              fallback={<div style={{ height: 300 }}>Cargando gráfico...</div>}
            >
              <ProgressChart />
            </Suspense>
          </div>
        </div>

        {/* Suspense con placeholder para PlanRutinas */}
        <Suspense fallback={<div>Cargando rutinas...</div>}>
          <PlanRutinas />
        </Suspense>
      </main>
    </div>
  );
}
