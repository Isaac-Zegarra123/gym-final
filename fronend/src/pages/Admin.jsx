import { useEffect, useState } from "react";
import { useGymStore } from "../store/gymStore";
import { Link } from "react-router-dom";

export default function Admin() {
  const { trainings, loadTrainings, addTraining, deleteTraining } =
    useGymStore();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    loadTrainings();
  }, [loadTrainings]);

  const handleSubmit = async () => {
    if (!name.trim()) return;
    setLoading(true);
    setError("");
    try {
      await addTraining({ name, description });
      setName("");
      setDescription("");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app">
      <nav className="navbar">
        <div className="navbar-brand">
          <i
            className="fa-solid fa-shield-halved"
            style={{ color: "#3b82f6" }}
          ></i>{" "}
          Panel Admin
        </div>
        <Link to="/" className="btn-admin">
          ← Volver al Dashboard
        </Link>
      </nav>

      <div className="admin-page">
        <h1>Gestión de Entrenamientos</h1>

        <div className="admin-form">
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Nombre del entrenamiento"
          />
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Descripción"
            rows={3}
          />
          {error && (
            <p style={{ color: "#f87171", fontSize: "0.85rem" }}>{error}</p>
          )}
          <button onClick={handleSubmit} disabled={loading}>
            <i className="fa-solid fa-plus"></i>{" "}
            {loading ? "Guardando..." : "Guardar entrenamiento"}
          </button>
        </div>

        <ul className="training-list">
          {trainings.map((t) => (
            <li key={t._id} className="training-item">
              <div>
                <span>{t.name}</span>
                {t.description && (
                  <p
                    style={{
                      fontSize: "0.8rem",
                      color: "#64748b",
                      marginTop: 2,
                    }}
                  >
                    {t.description}
                  </p>
                )}
              </div>
              <button
                className="btn-delete"
                onClick={() => deleteTraining(t._id)}
              >
                <i className="fa-solid fa-trash"></i> Eliminar
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
