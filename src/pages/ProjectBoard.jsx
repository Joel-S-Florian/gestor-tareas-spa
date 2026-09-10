import { useEffect, useState, useCallback } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import KanbanColumn from '../components/KanbanColumn';
import TaskModal from '../components/TaskModal';
import MembersModal from '../components/MembersModal';
import ProyectoModal from '../components/ProyectoModal';
import { proyectoService } from '../services/proyectoService';
import { tareaService } from '../services/tareaService';
import './ProjectBoard.css';

const COLUMNAS = [
  { estado: 'ToDo', titulo: 'Por hacer', color: '#9096a5' },
  { estado: 'InProgress', titulo: 'En progreso', color: '#f59e0b' },
  { estado: 'Done', titulo: 'Hecho', color: '#22c55e' }
];

export default function ProjectBoard() {
  const { id } = useParams();
  const proyectoId = Number(id);
  const navigate = useNavigate();

  const [proyecto, setProyecto] = useState(null);
  const [miembros, setMiembros] = useState([]);
  const [tareas, setTareas] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);

  const [filtroPrioridad, setFiltroPrioridad] = useState('');
  const [filtroAsignado, setFiltroAsignado] = useState('');

  const [tareaSeleccionada, setTareaSeleccionada] = useState(null);
  const [modalNuevaAbierto, setModalNuevaAbierto] = useState(false);
  const [modalMiembrosAbierto, setModalMiembrosAbierto] = useState(false);
  const [modalEditarAbierto, setModalEditarAbierto] = useState(false);
  const [eliminando, setEliminando] = useState(false);

  const puedeEditar = proyecto?.miRol === 'Owner' || proyecto?.miRol === 'Editor';

  const cargarTodo = useCallback(async () => {
    setCargando(true);
    setError(null);
    try {
      const [p, m] = await Promise.all([
        proyectoService.obtener(proyectoId),
        proyectoService.listarMiembros(proyectoId)
      ]);
      setProyecto(p);
      setMiembros(m);
      await cargarTareas();
    } catch {
      setError('No se pudo cargar el proyecto.');
    } finally {
      setCargando(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [proyectoId]);

  const cargarTareas = useCallback(async () => {
    // Se piden hasta 100 por columna renderizada en el cliente; suficiente para un tablero típico de clase.
    const filtro = { page: 1, pageSize: 100 };
    if (filtroPrioridad) filtro.prioridad = filtroPrioridad;
    if (filtroAsignado) filtro.asignadoAId = filtroAsignado;

    try {
      const resultado = await tareaService.listarPorProyecto(proyectoId, filtro);
      setTareas(resultado.items);
    } catch {
      setError('No se pudieron cargar las tareas.');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [proyectoId, filtroPrioridad, filtroAsignado]);

  useEffect(() => {
    cargarTodo();
  }, [cargarTodo]);

  useEffect(() => {
    if (!cargando) cargarTareas();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filtroPrioridad, filtroAsignado]);

  const handleDragStart = (e, tarea) => {
    e.dataTransfer.setData('text/tarea-id', tarea.id);
  };

  const handleDrop = async (tareaId, nuevoEstado) => {
    const tarea = tareas.find((t) => t.id === tareaId);
    if (!tarea || tarea.estado === nuevoEstado) return;

    // Optimista: actualiza la UI antes de confirmar con la API.
    setTareas((prev) => prev.map((t) => (t.id === tareaId ? { ...t, estado: nuevoEstado } : t)));
    try {
      await tareaService.cambiarEstado(tareaId, nuevoEstado);
    } catch {
      setTareas((prev) => prev.map((t) => (t.id === tareaId ? { ...t, estado: tarea.estado } : t)));
      alert('No se pudo cambiar el estado de la tarea.');
    }
  };

  const handleTareaGuardada = (tareaActualizada) => {
    setTareas((prev) => {
      const existe = prev.some((t) => t.id === tareaActualizada.id);
      return existe
        ? prev.map((t) => (t.id === tareaActualizada.id ? tareaActualizada : t))
        : [...prev, tareaActualizada];
    });
    setTareaSeleccionada(null);
    setModalNuevaAbierto(false);
  };

  const handleTareaEliminada = (tareaId) => {
    setTareas((prev) => prev.filter((t) => t.id !== tareaId));
    setTareaSeleccionada(null);
  };

  const handleProyectoGuardado = (actualizado) => {
    setProyecto(actualizado);
    setModalEditarAbierto(false);
  };

  const handleEliminarProyecto = async () => {
    if (!confirm('¿Eliminar este proyecto? Esta acción no se puede deshacer.')) return;
    setEliminando(true);
    try {
      await proyectoService.eliminar(proyectoId);
      navigate('/');
    } catch (err) {
      setError(err?.response?.data?.title || 'No se pudo eliminar el proyecto.');
      setEliminando(false);
    }
  };

  if (cargando) {
    return (
      <div>
        <Navbar />
        <p className="board__estado">Cargando tablero…</p>
      </div>
    );
  }

  if (error || !proyecto) {
    return (
      <div>
        <Navbar />
        <p className="board__estado board__estado--error">{error || 'Proyecto no encontrado.'}</p>
      </div>
    );
  }

  return (
    <div>
      <Navbar />
      <main className="board">
        <div className="board__header">
          <div>
            <Link to="/" className="board__back">← Proyectos</Link>
            <h1 className="board__title">
              <span className="board__color-dot" style={{ background: proyecto.color }} />
              {proyecto.nombre}
            </h1>
          </div>
          <div className="board__acciones">
            {puedeEditar && (
              <>
                <button className="btn btn--primary" onClick={() => setModalNuevaAbierto(true)}>
                  + Nueva tarea
                </button>
                <button className="btn btn--ghost" onClick={() => setModalEditarAbierto(true)}>
                  Editar
                </button>
              </>
            )}
            {proyecto.miRol === 'Owner' && (
              <button className="btn btn--danger" onClick={handleEliminarProyecto} disabled={eliminando}>
                {eliminando ? 'Eliminando…' : 'Eliminar'}
              </button>
            )}
          </div>
        </div>

        <div className="board__filters">
          <button className="btn btn--ghost" onClick={() => setModalMiembrosAbierto(true)}>
            Miembros ({miembros.length})
          </button>
          <select className="form-select" value={filtroPrioridad} onChange={(e) => setFiltroPrioridad(e.target.value)}>
            <option value="">Toda prioridad</option>
            <option value="Baja">Baja</option>
            <option value="Media">Media</option>
            <option value="Alta">Alta</option>
          </select>
          <select className="form-select" value={filtroAsignado} onChange={(e) => setFiltroAsignado(e.target.value)}>
            <option value="">Todos los asignados</option>
            {miembros.map((m) => (
              <option key={m.usuarioId} value={m.usuarioId}>{m.nombre}</option>
            ))}
          </select>
          {!puedeEditar && <span className="board__solo-lectura">Solo lectura ({proyecto.miRol})</span>}
        </div>

        <div className="board__columns">
          {COLUMNAS.map((col) => (
            <KanbanColumn
              key={col.estado}
              titulo={col.titulo}
              estado={col.estado}
              colorDot={col.color}
              tareas={tareas.filter((t) => t.estado === col.estado)}
              onTaskClick={setTareaSeleccionada}
              onDrop={handleDrop}
              onDragStart={handleDragStart}
              puedeEditar={puedeEditar}
            />
          ))}
        </div>
      </main>

      {tareaSeleccionada && (
        <TaskModal
          tarea={tareaSeleccionada}
          proyectoId={proyectoId}
          miembros={miembros}
          puedeEditar={puedeEditar}
          onClose={() => setTareaSeleccionada(null)}
          onGuardado={handleTareaGuardada}
          onEliminado={handleTareaEliminada}
        />
      )}

      {modalNuevaAbierto && (
        <TaskModal
          tarea={null}
          proyectoId={proyectoId}
          miembros={miembros}
          puedeEditar={true}
          onClose={() => setModalNuevaAbierto(false)}
          onGuardado={handleTareaGuardada}
          onEliminado={() => { }}
        />
      )}

      {modalMiembrosAbierto && (
        <MembersModal
          proyecto={proyecto}
          miembros={miembros}
          esOwner={proyecto.miRol === 'Owner'}
          onClose={() => setModalMiembrosAbierto(false)}
          onCambio={setMiembros}
        />
      )}

      {modalEditarAbierto && (
        <ProyectoModal
          proyecto={proyecto}
          onClose={() => setModalEditarAbierto(false)}
          onGuardado={handleProyectoGuardado}
        />
      )}
    </div>
  );
}
