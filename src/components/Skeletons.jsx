// Marcadores de carga con la forma de lo que va a aparecer (evitan el salto de diseño).
export function SkeletonTablero() {
  return (
    <div className="board-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }} aria-busy="true" aria-label="Cargando tablero">
      {[3, 2, 2].map((n, c) => (
        <div key={c} style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)', borderRadius: 12, padding: 12 }}>
          <div className="skeleton" style={{ height: 14, width: '40%', marginBottom: 14 }} />
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {Array.from({ length: n }).map((_, i) => <div key={i} className="skeleton" style={{ height: 88 }} />)}
          </div>
        </div>
      ))}
    </div>
  );
}

export function SkeletonProyectos() {
  return (
    <div className="dashboard__grid" aria-busy="true" aria-label="Cargando proyectos">
      {[0, 1, 2].map((i) => <div key={i} className="skeleton" style={{ height: 130 }} />)}
    </div>
  );
}
