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
    if ("requestIdleCallback" in window) {
      requestIdleCallback(() => cargarProgreso());
    } else {
      setTimeout(() => cargarProgreso(), 200);
    }
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
            <h1>Bienvenido{user ? `, ${user.name}` : ""}</h1>
            <h2>Tu progreso</h2>
            <ProgressChart /> {/* carga inmediata, interactivo */}
          </div>
        </div>

        <div style={{ minHeight: 200 }}>
          <PlanRutinas /> {/* carga inmediata, interactivo */}
        </div>
      </main>
    </div>
  );
}
