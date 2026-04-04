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
    const idle = window.requestIdleCallback || ((cb) => setTimeout(cb, 200));
    idle(() => cargarProgreso());
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
          <div className="hero-chart" style={{ minHeight: 300 }}>
            <h1>Bienvenido{user ? `, ${user.name}` : ""}</h1>
            <h2>Tu progreso</h2>

            {/* ✅ SIN lazy */}
            <ProgressChart />
          </div>
        </div>

        <div style={{ minHeight: 200 }}>
          <PlanRutinas />
        </div>
      </main>
    </div>
  );
}
