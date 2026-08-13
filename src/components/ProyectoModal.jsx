import { useState } from 'react';
import Modal from './Modal';
import { proyectoService } from '../services/proyectoService';
import { mensajeDeError } from '../utils/mensajeDeError';

// Modal de crear/editar proyecto. Si `proyecto` no va (null) crea; si va, edita.
export default function ProyectoModal({ proyecto, onClose, onGuardado }) {
  const esEdicion = Boolean(proyecto);

  const [nombre, setNombre] = useState(proyecto?.nombre || '');
  const [descripcion, setDescripcion] = useState(proyecto?.descripcion || '');
  const [color, setColor] = useState(proyecto?.color || '#6366f1');
  const [enviando, setEnviando] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setEnviando(true);
    setError(null);
    try {
      const payload = { nombre: nombre.trim(), descripcion: descripcion.trim() || null, color };
      const guardado = esEdicion
        ? await proyectoService.actualizar(proyecto.id, payload)
        : await proyectoService.crear(payload);
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
        {error && <div className="form-error">{error}</div>}

        <div className="form-field">
          <label className="form-label" htmlFor="nombre">Nombre</label>
          <input
            id="nombre"
            className="form-input"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            required
            maxLength={150}
          />
        </div>

        <div className="form-field">
          <label className="form-label" htmlFor="descripcion">Descripción</label>
          <textarea
            id="descripcion"
            className="form-textarea"
            value={descripcion}
            onChange={(e) => setDescripcion(e.target.value)}
            maxLength={1000}
          />
        </div>

        <div className="form-field">
          <label className="form-label" htmlFor="color">Color</label>
          <input
            id="color"
            type="color"
            value={color}
            onChange={(e) => setColor(e.target.value)}
            style={{ width: 60, height: 36, padding: 2, background: 'transparent', border: '1px solid var(--color-border)', borderRadius: 6 }}
          />
        </div>

        <div className="form-actions">
          <button type="button" className="btn btn--ghost" onClick={onClose}>Cancelar</button>
          <button type="submit" className="btn btn--primary" disabled={enviando}>
            {enviando ? 'Guardando…' : esEdicion ? 'Guardar cambios' : 'Crear proyecto'}
          </button>
        </div>
      </form>
    </Modal>
  );
}