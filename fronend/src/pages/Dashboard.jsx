import { useNavigate, Link } from "react-router-dom";
import { useAuthStore } from "../store/authStore";
import ProgressChart from "../components/charts/ProgressChart";
import PlanRutinas from "../components/rutinas/PlanRutinas";
import { useEffect } from "react";
import { useWorkoutStore } from "../store/workoutStore";

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
  }, []);

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
          <span className="user-email">
            <i style={{ fontSize: 12, color: "#94a3b8" }}></i> {user?.email}
          </span>
          {user?.role === "admin" && (
            <Link to="/admin" className="btn-admin">
              <i></i> Admin
            </Link>
          )}
          <button className="btn-logout" onClick={handleLogout}>
            <i></i> Salir
          </button>
        </div>
      </nav>

      <main className="container">
        <div className="hero">
          <div className="hero-chart">
            <h1>Bienvenido, {user?.name} </h1>
            <h2>Tu progreso</h2>
            <ProgressChart />
          </div>
        </div>
        <PlanRutinas />
      </main>
    </div>
  );
}
