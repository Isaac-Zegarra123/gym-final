import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/authStore";

export default function Login() {
  const navigate = useNavigate();
  const { login, register } = useAuthStore();
  const [modo, setModo] = useState("login"); // "login" | "register"
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handle = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const submit = async () => {
    setError("");
    setLoading(true);
    try {
      if (modo === "login") {
        await login(form.email, form.password);
      } else {
        await register(form.name, form.email, form.password);
      }
      navigate("/");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <h1>
          <i style={{ color: "#facc15" }}></i> GymApp
        </h1>
        <p>
          {modo === "login"
            ? "Inicia sesión para continuar"
            : "Crea tu cuenta gratis"}
        </p>

        {modo === "register" && (
          <input
            className="login-input"
            name="name"
            placeholder="Tu nombre"
            value={form.name}
            onChange={handle}
          />
        )}
        <input
          className="login-input"
          name="email"
          type="email"
          placeholder="Email"
          value={form.email}
          onChange={handle}
        />
        <input
          className="login-input"
          name="password"
          type="password"
          placeholder="Contraseña"
          value={form.password}
          onChange={handle}
          onKeyDown={(e) => e.key === "Enter" && submit()}
        />

        {error && <p className="login-error">{error}</p>}

        <button className="btn-submit" onClick={submit} disabled={loading}>
          {loading
            ? "Cargando..."
            : modo === "login"
              ? "Iniciar sesión"
              : "Registrarse"}
        </button>

        <p className="login-switch">
          {modo === "login" ? "¿No tienes cuenta?" : "¿Ya tienes cuenta?"}{" "}
          <button
            className="btn-link"
            onClick={() => {
              setModo(modo === "login" ? "register" : "login");
              setError("");
            }}
          >
            {modo === "login" ? "Regístrate" : "Inicia sesión"}
          </button>
        </p>
      </div>
    </div>
  );
}
