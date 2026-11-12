import { useEffect, useState } from 'react';
import { History } from 'lucide-react';
import { extrasService } from '../services/extrasService';

const fecha = (iso) => new Date(iso).toLocaleString('es-DO', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' });

// Bitácora de un proyecto o de una tarea (si se pasa tareaId).
export default function ActividadLista({ proyectoId, tareaId, titulo = 'Actividad' }) {
  const [items, setItems] = useState(null);

  useEffect(() => {
    let vivo = true;
    const pedir = tareaId ? extrasService.actividadTarea(tareaId) : extrasService.actividadProyecto(proyectoId);
    pedir.then((d) => vivo && setItems(d)).catch(() => vivo && setItems([]));
    return () => { vivo = false; };
  }, [proyectoId, tareaId]);

  return (
    <section aria-label={titulo}>
      <h3 style={{ fontSize: 13, fontWeight: 700, color: 'var(--color-text-dim)', marginBottom: 10, display: 'flex', alignItems: 'center', gap: 6 }}>
        <History size={14} /> {titulo}
      </h3>
      {items === null && <p style={{ fontSize: 12, color: 'var(--color-text-faint)' }}>Cargando…</p>}
      {items?.length === 0 && <p style={{ fontSize: 12, color: 'var(--color-text-faint)', margin: 0 }}>Sin actividad todavía</p>}
      <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'flex', flexDirection: 'column', gap: 8, maxHeight: 280, overflowY: 'auto' }}>
        {items?.map((a) => (
          <li key={a.id} style={{ fontSize: 13 }}>
            <strong>{a.usuarioNombre}</strong> {a.mensaje}
            <span style={{ display: 'block', fontSize: 11, color: 'var(--color-text-faint)' }}>{fecha(a.fecha)}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}
