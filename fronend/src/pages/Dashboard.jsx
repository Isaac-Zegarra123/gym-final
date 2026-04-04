import { useNavigate, Link } from "react-router-dom";
import { useAuthStore } from "../store/authStore";
import { useEffect, lazy, Suspense } from "react";
import { useWorkoutStore } from "../store/workoutStore";

const ProgressChart = lazy(() => import("../components/charts/ProgressChart"));
const PlanRutinas = lazy(() => import("../components/rutinas/PlanRutinas"));

export default function Dashboard() {
  const { user, logout } = useAuthStore();
  const cargarProgreso = useWorkoutStore((s) => s.cargarProgreso);
  const navigate = useNavigate();

  useEffect(() => {
    const id = setTimeout(() => {
      cargarProgreso();
    }, 600);

    return () => clearTimeout(id);
  }, [cargarProgreso]);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="app">
      <nav className="navbar">
        <div className="navbar-brand">GymApp</div>

        <div className="navbar-right">
          <span className="user-email">{user?.email}</span>

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
          <div className="hero-chart" style={{ minHeight: 300, width: "100%" }}>
            <h1>Bienvenido</h1>
            {user?.name && <h2>{user.name}</h2>}

            <h3>Tu progreso</h3>

            <Suspense fallback={<div style={{ height: 220 }} />}>
              <ProgressChart />
            </Suspense>
          </div>
        </div>

        <div style={{ minHeight: 200 }}>
          <Suspense fallback={<div>Cargando rutinas...</div>}>
            <PlanRutinas />
          </Suspense>
        </div>
      </main>
    </div>
  );
}
