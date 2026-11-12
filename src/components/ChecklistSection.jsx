import { useState } from 'react';
import { ListChecks, X } from 'lucide-react';
import { extrasService } from '../services/extrasService';
import { reproducir } from '../services/sonido';

// Lista de pasos dentro de una tarea, con barra de progreso. Solo Owner/Editor la modifican.
export default function ChecklistSection({ tareaId, items, onCambio, puedeEditar, onError }) {
  const [texto, setTexto] = useState('');
  const hechos = items.filter((i) => i.hecho).length;
  const porcentaje = items.length ? Math.round((hechos / items.length) * 100) : 0;

  const agregar = async (e) => {
    e.preventDefault();
    if (!texto.trim()) return;
    try {
      const nuevo = await extrasService.agregarItem(tareaId, texto.trim());
      onCambio([...items, nuevo]);
      setTexto('');
    } catch (err) {
      onError(err?.response?.data?.title || 'No se pudo agregar el ítem.');
    }
  };

  const alternar = async (item) => {
    const antes = items;
    onCambio(items.map((i) => (i.id === item.id ? { ...i, hecho: !i.hecho } : i)));
    if (!item.hecho) reproducir('paso');
    try {
      await extrasService.actualizarItem(item.id, { hecho: !item.hecho });
    } catch {
      onCambio(antes);
      onError('No se pudo actualizar el ítem.');
    }
  };

  const quitar = async (item) => {
    try {
      await extrasService.eliminarItem(item.id);
      onCambio(items.filter((i) => i.id !== item.id));
    } catch {
      onError('No se pudo eliminar el ítem.');
    }
  };

  return (
    <section style={{ marginBottom: 22 }} aria-label="Lista de pasos">
      <h3 style={{ fontSize: 13, fontWeight: 700, color: 'var(--color-text-dim)', marginBottom: 10, display: 'flex', alignItems: 'center', gap: 6 }}>
        <ListChecks size={14} /> Lista de pasos ({hechos}/{items.length})
      </h3>
      {items.length > 0 && (
        <div role="progressbar" aria-valuenow={porcentaje} aria-valuemin={0} aria-valuemax={100} style={{ height: 6, background: 'var(--bg-tertiary)', borderRadius: 999, overflow: 'hidden', marginBottom: 10 }}>
          <div style={{ width: `${porcentaje}%`, height: '100%', background: 'var(--accent)', transition: 'width .2s ease' }} />
        </div>
      )}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginBottom: 10 }}>
        {items.map((i) => (
          <label key={i.id} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, textDecoration: i.hecho ? 'line-through' : 'none', opacity: i.hecho ? 0.6 : 1 }}>
            <input type="checkbox" checked={i.hecho} disabled={!puedeEditar} onChange={() => alternar(i)} />
            <span className="paso-texto" style={{ flex: 1 }}>{i.texto}</span>
            {puedeEditar && (
              <button type="button" aria-label={`Quitar ${i.texto}`} onClick={(e) => { e.preventDefault(); quitar(i); }} style={{ background: 'none', border: 'none', color: 'var(--color-text-faint)', cursor: 'pointer', display: 'grid', placeItems: 'center' }}>
                <X size={14} />
              </button>
            )}
          </label>
        ))}
        {items.length === 0 && <p style={{ fontSize: 12, color: 'var(--color-text-faint)', margin: 0 }}>Sin pasos todavía</p>}
      </div>
      {puedeEditar && (
        <form onSubmit={agregar} style={{ display: 'flex', gap: 8 }}>
          <input className="form-input" placeholder="Agregar un paso…" value={texto} onChange={(e) => setTexto(e.target.value)} maxLength={200} />
          <button type="submit" className="btn btn--ghost" disabled={!texto.trim()}>Agregar</button>
        </form>
      )}
    </section>
  );
}
