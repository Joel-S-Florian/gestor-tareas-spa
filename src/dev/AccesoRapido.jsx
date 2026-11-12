import { CUENTAS_DEMO } from './cuentasDemo';

// Botones del login para entrar de un clic con cada cuenta de demostración.
export default function AccesoRapido({ onElegir, deshabilitado }) {
  return (
    <div style={{ marginBottom: 14, padding: 10, border: '1px dashed var(--border)', borderRadius: 10 }}>
      <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 8 }}>Acceso rápido (solo desarrollo)</div>
      <div style={{ display: 'grid', gap: 6 }}>
        {CUENTAS_DEMO.map((c) => (
          <button
            key={c.email}
            type="button"
            disabled={deshabilitado}
            onClick={() => onElegir(c)}
            aria-label={`Entrar como ${c.nombre}`}
            style={{ textAlign: 'left', padding: '7px 10px', borderRadius: 8, border: '1px solid var(--border)', background: 'var(--bg-primary)', color: 'var(--text-primary)', cursor: 'pointer' }}
          >
            <span style={{ display: 'block', fontSize: 13, fontWeight: 600 }}>{c.nombre} <span style={{ fontWeight: 400, color: 'var(--text-muted)' }}>· {c.email}</span></span>
            <span style={{ display: 'block', fontSize: 11, color: 'var(--text-secondary)' }}>{c.roles}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
