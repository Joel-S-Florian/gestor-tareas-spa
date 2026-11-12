import { useEffect, useState } from 'react';
import { Tag } from 'lucide-react';
import { extrasService } from '../services/extrasService';

const COLORES = ['#ef4444', '#f59e0b', '#10b981', '#3b82f6', '#8b5cf6', '#ec4899', '#64748b'];

// Etiquetas del proyecto: las marcadas en la tarea se activan/desactivan con un clic.
// Quien puede editar también crea etiquetas nuevas al vuelo.
export default function EtiquetasSection({ proyectoId, tareaId, seleccionadas, onCambio, puedeEditar, onError }) {
  const [todas, setTodas] = useState([]);
  const [nombre, setNombre] = useState('');
  const [color, setColor] = useState(COLORES[3]);
  const activas = new Set(seleccionadas.map((e) => e.id));

  useEffect(() => {
    extrasService.etiquetas(proyectoId).then(setTodas).catch(() => {});
  }, [proyectoId]);

  const guardar = async (ids) => {
    try {
      const nuevas = await extrasService.asignarEtiquetas(tareaId, ids);
      onCambio(nuevas);
    } catch (err) {
      onError(err?.response?.data?.title || 'No se pudieron guardar las etiquetas.');
    }
  };

  const alternar = (et) => {
    if (!puedeEditar) return;
    const ids = activas.has(et.id) ? [...activas].filter((id) => id !== et.id) : [...activas, et.id];
    guardar(ids);
  };

  const crear = async (e) => {
    e.preventDefault();
    if (!nombre.trim()) return;
    try {
      const nueva = await extrasService.crearEtiqueta(proyectoId, nombre.trim(), color);
      setTodas((prev) => [...prev, nueva].sort((a, b) => a.nombre.localeCompare(b.nombre)));
      setNombre('');
      await guardar([...activas, nueva.id]);
    } catch (err) {
      onError(err?.response?.data?.title || 'No se pudo crear la etiqueta.');
    }
  };

  return (
    <section style={{ marginBottom: 22 }} aria-label="Etiquetas">
      <h3 style={{ fontSize: 13, fontWeight: 700, color: 'var(--color-text-dim)', marginBottom: 10, display: 'flex', alignItems: 'center', gap: 6 }}>
        <Tag size={14} /> Etiquetas
      </h3>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 10 }}>
        {todas.map((et) => {
          const activa = activas.has(et.id);
          return (
            <button
              key={et.id}
              type="button"
              aria-pressed={activa}
              disabled={!puedeEditar}
              onClick={() => alternar(et)}
              style={{ padding: '3px 10px', borderRadius: 999, fontSize: 12, cursor: puedeEditar ? 'pointer' : 'default', border: `1px solid ${et.color}`, background: activa ? et.color : 'transparent', color: activa ? '#fff' : et.color }}
            >
              {et.nombre}
            </button>
          );
        })}
        {todas.length === 0 && <p style={{ fontSize: 12, color: 'var(--color-text-faint)', margin: 0 }}>Este proyecto aún no tiene etiquetas</p>}
      </div>
      {puedeEditar && (
        <form onSubmit={crear} style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
          <input className="form-input" style={{ flex: 1, minWidth: 120 }} placeholder="Nueva etiqueta…" value={nombre} onChange={(e) => setNombre(e.target.value)} maxLength={40} />
          <span role="radiogroup" aria-label="Color" style={{ display: 'inline-flex', gap: 4 }}>
            {COLORES.map((c) => (
              <button key={c} type="button" role="radio" aria-checked={color === c} aria-label={`Color ${c}`} onClick={() => setColor(c)} style={{ width: 18, height: 18, borderRadius: '50%', background: c, border: color === c ? '2px solid var(--text-primary)' : '2px solid transparent', cursor: 'pointer' }} />
            ))}
          </span>
          <button type="submit" className="btn btn--ghost" disabled={!nombre.trim()}>Crear</button>
        </form>
      )}
    </section>
  );
}
