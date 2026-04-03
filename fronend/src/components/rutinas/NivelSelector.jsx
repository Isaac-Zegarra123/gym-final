export default function NivelSelector({ niveles, nivelActivo, onChange }) {
  return (
    <div className="niveles" role="tablist" aria-label="Seleccionar nivel">
      {niveles.map((n) => (
        <button
          key={n.key}
          className="nivel-card"
          role="tab"
          aria-selected={nivelActivo === n.key}
          aria-controls={`panel-${n.key}`}
          style={
            nivelActivo === n.key
              ? { background: n.color, borderColor: n.color, color: "#fff" }
              : { background: n.bg, borderColor: n.color, color: n.color }
          }
          onClick={() => onChange(n.key)}
        >
          <i
            className={n.icono}
            style={{
              fontSize: 24,
              color: nivelActivo === n.key ? "#fff" : n.color,
            }}
          ></i>
          <span className="nivel-label">{n.label}</span>
          <span
            className="nivel-desc"
            style={
              nivelActivo === n.key
                ? { color: "rgba(255,255,255,0.8)" }
                : { color: "#94a3b8" }
            }
          >
            {n.desc}
          </span>
        </button>
      ))}
    </div>
  );
}
