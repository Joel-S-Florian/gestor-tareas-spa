import { useState, useEffect } from 'react';
import { Trash2, Paperclip, MessageSquare, Upload, Download, X, Check, Calendar, Flag } from 'lucide-react';
import Modal from './Modal';
import { tareaService } from '../services/tareaService';
import { comentarioService } from '../services/comentarioService';
import { adjuntoService } from '../services/adjuntoService';
import { useAuth } from '../hooks/useAuth';

const ESTADOS = [
  { value: 'ToDo', label: 'Por hacer' },
  { value: 'InProgress', label: 'En progreso' },
  { value: 'Done', label: 'Hecho' }
];

// Mismos tipos que valida el servidor (AdjuntoService). La validación en el
// cliente da feedback inmediato; el servidor sigue siendo la barrera real.
const TIPOS_PERMITIDOS = new Set([
  'image/jpeg',
  'image/png',
  'image/gif',
  'image/webp',
  'application/pdf'
]);

export default function TaskModal({ tarea, proyectoId, miembros, puedeEditar, onClose, onGuardado, onEliminado }) {
  const esNueva = !tarea;
  const { usuario } = useAuth();

  const [titulo, setTitulo] = useState(tarea?.titulo || '');
  const [descripcion, setDescripcion] = useState(tarea?.descripcion || '');
  const [prioridad, setPrioridad] = useState(tarea?.prioridad || 'Media');
  const [fechaVencimiento, setFechaVencimiento] = useState(
    tarea?.fechaVencimiento ? tarea.fechaVencimiento.slice(0, 10) : ''
  );
  const [asignadoAId, setAsignadoAId] = useState(tarea?.asignadoAId || '');
  const [estado, setEstado] = useState(tarea?.estado || 'ToDo');

  const [enviando, setEnviando] = useState(false);
  const [error, setError] = useState(null);

  // Comentarios y adjuntos: la tarea que llega por props solo trae los conteos
  // (viene del listado del tablero), así que se pide el detalle completo al abrir.
  const [comentarios, setComentarios] = useState([]);
  const [adjuntos, setAdjuntos] = useState([]);
  const [cargandoDetalle, setCargandoDetalle] = useState(!esNueva);
  const [nuevoComentario, setNuevoComentario] = useState('');
  const [enviandoComentario, setEnviandoComentario] = useState(false);
  const [subiendoArchivo, setSubiendoArchivo] = useState(false);

  useEffect(() => {
    if (esNueva) return;
    let cancelado = false;
    tareaService.obtener(tarea.id).then((detalle) => {
      if (cancelado) return;
      setComentarios(detalle.comentarios || []);
      setAdjuntos(detalle.adjuntos || []);
      setCargandoDetalle(false);
    }).catch(() => setCargandoDetalle(false));
    return () => { cancelado = true; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tarea?.id]);

  const payloadBase = () => ({
    titulo,
    descripcion: descripcion || null,
    prioridad,
    fechaVencimiento: fechaVencimiento ? new Date(fechaVencimiento).toISOString() : null,
    asignadoAId: asignadoAId ? Number(asignadoAId) : null
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setEnviando(true);
    setError(null);
    try {
      if (esNueva) {
        const nueva = await tareaService.crear(proyectoId, payloadBase());
        onGuardado(nueva);
      } else {
        const actualizada = await tareaService.actualizar(tarea.id, payloadBase());
        if (estado !== tarea.estado) {
          const conEstado = await tareaService.cambiarEstado(tarea.id, estado);
          onGuardado(conEstado);
        } else {
          onGuardado(actualizada);
        }
      }
    } catch (err) {
      setError(err?.response?.data?.title || 'No se pudo guardar la tarea.');
    } finally {
      setEnviando(false);
    }
  };

  const handleEliminar = async () => {
    if (!confirm('¿Eliminar esta tarea? Esta acción no se puede deshacer.')) return;
    setEnviando(true);
    try {
      await tareaService.eliminar(tarea.id);
      onEliminado(tarea.id);
    } catch {
      setError('No se pudo eliminar la tarea.');
      setEnviando(false);
    }
  };

  const handleAgregarComentario = async (e) => {
    e.preventDefault();
    if (!nuevoComentario.trim()) return;
    setEnviandoComentario(true);
    try {
      const comentario = await comentarioService.agregar(tarea.id, nuevoComentario.trim());
      setComentarios((prev) => [...prev, comentario]);
      setNuevoComentario('');
    } catch {
      setError('No se pudo agregar el comentario.');
    } finally {
      setEnviandoComentario(false);
    }
  };

  const handleEliminarComentario = async (comentarioId) => {
    try {
      await comentarioService.eliminar(comentarioId);
      setComentarios((prev) => prev.filter((c) => c.id !== comentarioId));
    } catch {
      setError('No se pudo eliminar el comentario.');
    }
  };

  const handleSubirArchivo = async (e) => {
    const archivo = e.target.files?.[0];
    if (!archivo) return;

    if (archivo.size > 5 * 1024 * 1024) {
      setError('El archivo supera el tamaño máximo de 5 MB.');
      e.target.value = '';
      return;
    }

    if (!TIPOS_PERMITIDOS.has(archivo.type)) {
      setError('Tipo de archivo no permitido. Solo imágenes (jpg, png, gif, webp) o PDF.');
      e.target.value = '';
      return;
    }

    setSubiendoArchivo(true);
    setError(null);
    try {
      const adjunto = await adjuntoService.subir(tarea.id, archivo);
      setAdjuntos((prev) => [adjunto, ...prev]);
    } catch (err) {
      setError(err?.response?.data?.title || 'No se pudo subir el archivo.');
    } finally {
      setSubiendoArchivo(false);
      e.target.value = '';
    }
  };

  const handleEliminarAdjunto = async (adjuntoId) => {
    if (!confirm('¿Eliminar este adjunto?')) return;
    try {
      await adjuntoService.eliminar(adjuntoId);
      setAdjuntos((prev) => prev.filter((a) => a.id !== adjuntoId));
    } catch {
      setError('No se pudo eliminar el adjunto.');
    }
  };

  return (
    <Modal titulo={esNueva ? 'Nueva tarea' : 'Detalle de tarea'} onClose={onClose}>
      <form onSubmit={handleSubmit}>
        {error && <div className="form-error">{error}</div>}

        <div className="form-field">
          <label className="form-label" htmlFor="titulo">Título</label>
          <input
            id="titulo"
            className="form-input"
            value={titulo}
            onChange={(e) => setTitulo(e.target.value)}
            required
            maxLength={200}
            disabled={!puedeEditar}
          />
        </div>

        <div className="form-field">
          <label className="form-label" htmlFor="descripcion">Descripción</label>
          <textarea
            id="descripcion"
            className="form-textarea"
            value={descripcion}
            onChange={(e) => setDescripcion(e.target.value)}
            maxLength={2000}
            disabled={!puedeEditar}
          />
        </div>

        {!esNueva && (
          <div className="form-field">
            <label className="form-label" htmlFor="estado">Estado</label>
            <select
              id="estado"
              className="form-select"
              value={estado}
              onChange={(e) => setEstado(e.target.value)}
              disabled={!puedeEditar}
            >
              {ESTADOS.map((e) => (
                <option key={e.value} value={e.value}>{e.label}</option>
              ))}
            </select>
          </div>
        )}

        <div className="form-field">
          <label className="form-label" htmlFor="prioridad">Prioridad</label>
          <select
            id="prioridad"
            className="form-select"
            value={prioridad}
            onChange={(e) => setPrioridad(e.target.value)}
            disabled={!puedeEditar}
          >
            <option value="Baja">Baja</option>
            <option value="Media">Media</option>
            <option value="Alta">Alta</option>
          </select>
        </div>

        <div className="form-field">
          <label className="form-label" htmlFor="asignado">Asignado a</label>
          <select
            id="asignado"
            className="form-select"
            value={asignadoAId}
            onChange={(e) => setAsignadoAId(e.target.value)}
            disabled={!puedeEditar}
          >
            <option value="">Sin asignar</option>
            {miembros.map((m) => (
              <option key={m.usuarioId} value={m.usuarioId}>{m.nombre}</option>
            ))}
          </select>
        </div>

        <div className="form-field">
          <label className="form-label" htmlFor="fecha">Fecha de vencimiento</label>
          <input
            id="fecha"
            type="date"
            className="form-input"
            value={fechaVencimiento}
            onChange={(e) => setFechaVencimiento(e.target.value)}
            disabled={!puedeEditar}
          />
        </div>

        <div className="form-actions" style={{ justifyContent: !esNueva ? 'space-between' : 'flex-end' }}>
          {!esNueva && puedeEditar && (
            <button type="button" className="btn btn--danger" onClick={handleEliminar} disabled={enviando} style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
              <Trash2 size={14} /> Eliminar
            </button>
          )}
          <div style={{ display: 'flex', gap: 10 }}>
            <button type="button" className="btn btn--ghost" onClick={onClose}>
              {puedeEditar ? 'Cancelar' : 'Cerrar'}
            </button>
            {puedeEditar && (
              <button type="submit" className="btn btn--primary" disabled={enviando} style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                <Check size={14} /> {enviando ? 'Guardando...' : esNueva ? 'Crear tarea' : 'Guardar cambios'}
              </button>
            )}
          </div>
        </div>
      </form>

      {!esNueva && !cargandoDetalle && (
        <>
          <hr style={{ border: 'none', borderTop: '1px solid var(--color-border)', margin: '22px 0' }} />

          <section style={{ marginBottom: 22 }}>
            <h3 style={{ fontSize: 13, fontWeight: 700, color: 'var(--color-text-dim)', marginBottom: 10, display: 'flex', alignItems: 'center', gap: 6 }}>
              <Paperclip size={14} /> Adjuntos ({adjuntos.length})
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginBottom: 10 }}>
              {adjuntos.map((a) => (
                <div key={a.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: 13 }}>
                  <button
                    type="button"
                    onClick={() => adjuntoService.descargar(a.id, a.nombreArchivo)}
                    style={{ background: 'none', border: 'none', color: 'var(--color-accent)', cursor: 'pointer', padding: 0, textAlign: 'left', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', display: 'inline-flex', alignItems: 'center', gap: 6 }}
                  >
                    <Paperclip size={12} /> {a.nombreArchivo} <span style={{ color: 'var(--color-text-faint)' }}>({formatearTamano(a.tamanoBytes)})</span> <Download size={12} />
                  </button>
                  {puedeEditar && (
                    <button type="button" onClick={() => handleEliminarAdjunto(a.id)} style={{ background: 'none', border: 'none', color: 'var(--color-text-faint)', cursor: 'pointer', display: 'grid', placeItems: 'center' }}>
                      <X size={14} />
                    </button>
                  )}
                </div>
              ))}
              {adjuntos.length === 0 && <p style={{ fontSize: 12, color: 'var(--color-text-faint)', margin: 0 }}>Sin adjuntos</p>}
            </div>
            {puedeEditar && (
              <label className="btn btn--ghost" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, cursor: 'pointer' }}>
                <Upload size={14} /> {subiendoArchivo ? 'Subiendo...' : 'Adjuntar archivo (img/pdf · max 5 MB)'}
                <input type="file" accept="image/jpeg,image/png,image/gif,image/webp,application/pdf" onChange={handleSubirArchivo} disabled={subiendoArchivo} style={{ display: 'none' }} />
              </label>
            )}
          </section>

          <section>
            <h3 style={{ fontSize: 13, fontWeight: 700, color: 'var(--color-text-dim)', marginBottom: 10, display: 'flex', alignItems: 'center', gap: 6 }}>
              <MessageSquare size={14} /> Comentarios ({comentarios.length})
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 12, maxHeight: 200, overflowY: 'auto' }}>
              {comentarios.map((c) => (
                <div key={c.id} style={{ fontSize: 13 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                    <span style={{ fontWeight: 600 }}>{c.usuarioNombre}</span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <span style={{ fontSize: 11, color: 'var(--color-text-faint)' }}>
                        {new Date(c.fechaCreacion).toLocaleString('es-DO', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' })}
                      </span>
                      {c.usuarioId === usuario?.id && (
                        <button type="button" onClick={() => handleEliminarComentario(c.id)} style={{ background: 'none', border: 'none', color: 'var(--color-text-faint)', cursor: 'pointer', fontSize: 11 }}>
                          eliminar
                        </button>
                      )}
                    </span>
                  </div>
                  <p style={{ margin: '2px 0 0', color: 'var(--color-text-dim)' }}>{c.contenido}</p>
                </div>
              ))}
              {comentarios.length === 0 && <p style={{ fontSize: 12, color: 'var(--color-text-faint)', margin: 0 }}>Sin comentarios todavía</p>}
            </div>

            <form onSubmit={handleAgregarComentario} style={{ display: 'flex', gap: 8 }}>
              <input
                className="form-input"
                placeholder="Escribe un comentario…"
                value={nuevoComentario}
                onChange={(e) => setNuevoComentario(e.target.value)}
                maxLength={2000}
              />
              <button type="submit" className="btn btn--primary" disabled={enviandoComentario || !nuevoComentario.trim()}>
                Enviar
              </button>
            </form>
          </section>
        </>
      )}
    </Modal>
  );
}

function formatearTamano(bytes) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}
