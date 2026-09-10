import { useState } from 'react';
import { Check, X } from 'lucide-react';
import Modal from './Modal';
import { proyectoService } from '../services/proyectoService';
import { mensajeDeError } from '../utils/mensajeDeError';

export default function ProyectoModal({ proyecto, onClose, onGuardado }) {
  const esEdicion = Boolean(proyecto);
  const [nombre, setNombre] = useState(proyecto?.nombre || '');
  const [descripcion, setDescripcion] = useState(proyecto?.descripcion || '');
  const [color, setColor] = useState(proyecto?.color || '#FF5733');
  const [enviando, setEnviando] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setEnviando(true);
    setError(null);
    try {
      const payload = { nombre: nombre.trim(), descripcion: descripcion.trim() || null, color };
      const guardado = esEdicion ? await proyectoService.actualizar(proyecto.id, payload) : await proyectoService.crear(payload);
      onGuardado(guardado);
    } catch (err) {
      setError(mensajeDeError(err, 'No se pudo guardar el proyecto.'));
    } finally {
      setEnviando(false);
    }
  };

  return (
    <Modal titulo={esEdicion ? 'Editar proyecto' : 'Nuevo proyecto'} onClose={onClose}>
      <form onSubmit={handleSubmit}>
        {error && <div style={{ background: '#EF44441A', border: '1px solid var(--danger)', color: 'var(--danger)', padding: '10px 12px', borderRadius: 8, fontSize: 13, marginBottom: 12 }}>{error}</div>}
        <div style={{ marginBottom: 12 }}>
          <label htmlFor="nombre" style={{ display: 'block', fontSize: 13, fontWeight: 500, color: 'var(--text-secondary)', marginBottom: 6 }}>Nombre</label>
          <input id="nombre" value={nombre} onChange={(e) => setNombre(e.target.value)} required maxLength={150} style={{ width: '100%', padding: '8px 12px', borderRadius: 8, border: '1px solid var(--border)', background: 'var(--bg-primary)', color: 'var(--text-primary)', fontSize: 14 }} />
        </div>
        <div style={{ marginBottom: 12 }}>
          <label htmlFor="descripcion" style={{ display: 'block', fontSize: 13, fontWeight: 500, color: 'var(--text-secondary)', marginBottom: 6 }}>Descripcion</label>
          <textarea id="descripcion" value={descripcion} onChange={(e) => setDescripcion(e.target.value)} maxLength={1000} rows={3} style={{ width: '100%', padding: '8px 12px', borderRadius: 8, border: '1px solid var(--border)', background: 'var(--bg-primary)', color: 'var(--text-primary)', fontSize: 14, resize: 'vertical' }} />
        </div>
        <div style={{ marginBottom: 16 }}>
          <label htmlFor="color" style={{ display: 'block', fontSize: 13, fontWeight: 500, color: 'var(--text-secondary)', marginBottom: 6 }}>Color</label>
          <input id="color" type="color" value={color} onChange={(e) => setColor(e.target.value)} style={{ width: 60, height: 36, padding: 2, background: 'transparent', border: '1px solid var(--border)', borderRadius: 8 }} />
        </div>
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10 }}>
          <button type="button" onClick={onClose} style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '8px 14px', borderRadius: 8, background: 'var(--bg-tertiary)', border: '1px solid var(--border)', color: 'var(--text-primary)', cursor: 'pointer', fontSize: 14 }}><X size={14} /> Cancelar</button>
          <button type="submit" disabled={enviando} style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '8px 14px', borderRadius: 8, background: 'var(--accent)', color: '#fff', border: 'none', cursor: 'pointer', fontSize: 14, opacity: enviando ? 0.6 : 1 }}><Check size={14} /> {enviando ? 'Guardando...' : esEdicion ? 'Guardar cambios' : 'Crear proyecto'}</button>
        </div>
      </form>
    </Modal>
  );
}
