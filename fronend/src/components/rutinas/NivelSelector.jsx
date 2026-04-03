export default function NivelSelector({ niveles, nivelActivo, onChange }) {
  return (
    <>
      <div className="niveles" role="tablist" aria-label="Seleccionar nivel">
        {niveles.map((n) => {
          const isActive = nivelActivo === n.key;

          return (
            <button
              key={n.key}
              id={`tab-${n.key}`} // ✅ IMPORTANTE
              className="nivel-card"
              role="tab"
              aria-selected={isActive}
              aria-controls={`panel-${n.key}`}
              tabIndex={isActive ? 0 : -1} // ✅ navegación teclado
              style={
                isActive
                  ? { background: n.color, borderColor: n.color, color: "#fff" }
                  : { background: n.bg, borderColor: n.color, color: n.color }
              }
              onClick={() => onChange(n.key)}
            >
              {/* ❌ mejor quitar <i> si usas FontAwesome */}
              <span
                style={{
                  fontSize: 24,
                  color: isActive ? "#fff" : n.color,
                }}
              >
                💪
              </span>

              <span className="nivel-label">{n.label}</span>

              <span
                className="nivel-desc"
                style={
                  isActive
                    ? { color: "rgba(255,255,255,0.9)" }
                    : { color: "#64748b" } // ✅ mejor contraste
                }
              >
                {n.desc}
              </span>
            </button>
          );
        })}
      </div>

      {/* ✅ PANEL ACCESIBLE */}
      <div
        role="tabpanel"
        id={`panel-${nivelActivo}`}
        aria-labelledby={`tab-${nivelActivo}`}
      >
        {/* aquí renderizas el contenido del nivel */}
      </div>
    </>
  );
}
