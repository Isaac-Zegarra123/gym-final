const BASE = import.meta.env.VITE_API_URL || "http://localhost:4000";

export const api = async (path, options = {}) => {
  const token = localStorage.getItem("token");

  const res = await fetch(`${BASE}${path}`, {
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    ...options,
  });

  let data;
  try {
    data = await res.json();
  } catch {
    throw new Error("Respuesta inválida del servidor");
  }

  if (!res.ok) {
    console.error("API ERROR:", data); // 🔥 IMPORTANTE
    throw new Error(data.error || data.message || "Error en la petición");
  }

  return data;
};
