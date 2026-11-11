import { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bell } from 'lucide-react';
import { notificacionService } from '../../services/notificacionService';

const CADA_MS = 60000;

// Campana con los avisos de asignación. Consulta cada minuto; sin tiempo real a propósito.
export default function Avisos() {
  const [datos, setDatos] = useState({ noLeidas: 0, items: [] });
  const [abierto, setAbierto] = useState(false);
  const navigate = useNavigate();

  const cargar = useCallback(async () => {
    try { setDatos(await notificacionService.listar()); } catch { /* sin avisos si falla */ }
  }, []);

  useEffect(() => {
    cargar();
    const t = setInterval(cargar, CADA_MS);
    return () => clearInterval(t);
  }, [cargar]);

  const abrir = async (n) => {
    if (!n.leida) await notificacionService.marcarLeida(n.id).catch(() => {});
    setAbierto(false);
    if (n.proyectoId) navigate(`/proyectos/${n.proyectoId}`);
    cargar();
  };

  const leerTodas = async () => {
    await notificacionService.leerTodas().catch(() => {});
    cargar();
  };

  return (
    <div style={{ position: 'relative' }}>
      <button
        onClick={() => { setAbierto((a) => !a); cargar(); }}
        aria-label={`Avisos (${datos.noLeidas} sin leer)`}
        aria-expanded={abierto}
        style={{ position: 'relative', width: 32, height: 32, borderRadius: 8, border: '1px solid var(--border)', background: 'var(--bg-primary)', color: 'var(--text-secondary)', display: 'grid', placeItems: 'center', cursor: 'pointer' }}
      >
        <Bell size={16} />
        {datos.noLeidas > 0 && (
          <span style={{ position: 'absolute', top: -6, right: -6, minWidth: 16, height: 16, padding: '0 4px', borderRadius: 999, background: 'var(--danger)', color: '#fff', fontSize: 10, display: 'grid', placeItems: 'center' }}>
            {datos.noLeidas}
          </span>
        )}
      </button>

      {abierto && (
        <div role="menu" style={{ position: 'absolute', right: 0, top: 40, width: 300, maxWidth: '90vw', maxHeight: 360, overflowY: 'auto', background: 'var(--bg-secondary)', border: '1px solid var(--border)', borderRadius: 10, boxShadow: '0 8px 24px rgba(0,0,0,.18)', zIndex: 20 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 12px', borderBottom: '1px solid var(--border)', fontSize: 13, fontWeight: 600, color: 'var(--text-primary)' }}>
            Avisos
            {datos.noLeidas > 0 && <button onClick={leerTodas} style={{ border: 'none', background: 'transparent', color: 'var(--accent)', fontSize: 12, cursor: 'pointer' }}>Marcar todo como leído</button>}
          </div>
          {datos.items.length === 0 && <p style={{ padding: 14, margin: 0, fontSize: 13, color: 'var(--text-muted)' }}>No tienes avisos.</p>}
          {datos.items.map((n) => (
            <button key={n.id} role="menuitem" onClick={() => abrir(n)} style={{ display: 'block', width: '100%', textAlign: 'left', padding: '10px 12px', border: 'none', borderBottom: '1px solid var(--border)', background: n.leida ? 'transparent' : 'var(--bg-tertiary)', color: 'var(--text-primary)', fontSize: 13, cursor: 'pointer' }}>
              {n.mensaje}
              <span style={{ display: 'block', fontSize: 11, color: 'var(--text-muted)', marginTop: 2 }}>{new Date(n.fecha).toLocaleString('es-DO')}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
