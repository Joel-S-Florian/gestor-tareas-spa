import { useEffect, useState, useCallback } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Plus, Search, Filter, ArrowLeft, Pencil, Trash2, Users, Loader2, Eye } from 'lucide-react';
import AppLayout from '../components/layout/AppLayout';
import KanbanColumn from '../components/KanbanColumn';
import TaskModal from '../components/TaskModal';
import MembersModal from '../components/MembersModal';
import ProyectoModal from '../components/ProyectoModal';
import { proyectoService } from '../services/proyectoService';
import { tareaService } from '../services/tareaService';

const COLUMNAS = [
  { estado: 'ToDo', titulo: 'Por hacer', color: '#64748B' },
  { estado: 'InProgress', titulo: 'En progreso', color: '#F59E0B' },
  { estado: 'Done', titulo: 'Hecho', color: '#10B981' },
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
  const [busqueda, setBusqueda] = useState('');

  const [tareaSeleccionada, setTareaSeleccionada] = useState(null);
  const [modalNuevaAbierto, setModalNuevaAbierto] = useState(false);
  const [modalMiembrosAbierto, setModalMiembrosAbierto] = useState(false);
  const [modalEditarAbierto, setModalEditarAbierto] = useState(false);
  const [eliminando, setEliminando] = useState(false);

  const puedeEditar = proyecto?.miRol === 'Owner' || proyecto?.miRol === 'Editor';

  useEffect(() => { document.title = proyecto ? `TabTask \u00B7 ${proyecto.nombre}` : 'TabTask \u00B7 Proyecto'; }, [proyecto]);

  const cargarTodo = useCallback(async () => {
    setCargando(true);
    setError(null);
    try {
      const [p, m] = await Promise.all([
        proyectoService.obtener(proyectoId),
        proyectoService.listarMiembros(proyectoId),
      ]);
      setProyecto(p);
      setMiembros(m);
      await cargarTareas();
    } catch {
      setError('No se pudo cargar el proyecto.');
    } finally {
      setCargando(false);
    }
  }, [proyectoId]);

  const cargarTareas = useCallback(async () => {
    const filtro = { page: 1, pageSize: 100 };
    if (filtroPrioridad) filtro.prioridad = filtroPrioridad;
    if (filtroAsignado) filtro.asignadoAId = filtroAsignado;
    try {
      const resultado = await tareaService.listarPorProyecto(proyectoId, filtro);
      setTareas(resultado.items);
    } catch {
      setError('No se pudieron cargar las tareas.');
    }
  }, [proyectoId, filtroPrioridad, filtroAsignado]);

  useEffect(() => { cargarTodo(); }, [cargarTodo]);
  useEffect(() => { if (!cargando) cargarTareas(); }, [filtroPrioridad, filtroAsignado]);

  const handleDragStart = (e, tarea) => {
    e.dataTransfer.setData('text/tarea-id', String(tarea.id));
  };

  const handleDrop = async (tareaId, nuevoEstado) => {
    const tarea = tareas.find((t) => t.id === tareaId);
    if (!tarea || tarea.estado === nuevoEstado) return;
    setTareas((prev) => prev.map((t) => (t.id === tareaId ? { ...t, estado: nuevoEstado } : t)));
    try {
      await tareaService.cambiarEstado(tareaId, nuevoEstado);
    } catch {
      setTareas((prev) => prev.map((t) => (t.id === tareaId ? { ...t, estado: tarea.estado } : t)));
    }
  };

  const handleTareaGuardada = (tareaActualizada) => {
    setTareas((prev) => {
      const existe = prev.some((t) => t.id === tareaActualizada.id);
      return existe ? prev.map((t) => (t.id === tareaActualizada.id ? tareaActualizada : t)) : [...prev, tareaActualizada];
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
    if (!confirm('Eliminar este proyecto? Esta accion no se puede deshacer.')) return;
    setEliminando(true);
    try {
      await proyectoService.eliminar(proyectoId);
      navigate('/');
    } catch (err) {
      setError(err?.response?.data?.title || 'No se pudo eliminar el proyecto.');
      setEliminando(false);
    }
  };

  const tareasFiltradasPorBusqueda = (lista) => {
    if (!busqueda.trim()) return lista;
    const q = busqueda.toLowerCase();
    return lista.filter((t) => t.titulo.toLowerCase().includes(q) || (t.descripcion || '').toLowerCase().includes(q));
  };

  if (cargando) {
    return (
      <AppLayout>
        <p style={{ display: 'inline-flex', alignItems: 'center', gap: 8, color: 'var(--text-secondary)', fontSize: 14 }}><Loader2 size={16} /> Cargando tablero...</p>
      </AppLayout>
    );
  }

  if (error || !proyecto) {
    return (
      <AppLayout>
        <p style={{ color: 'var(--danger)', fontSize: 14 }}>{error || 'Proyecto no encontrado.'}</p>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 16, marginBottom: 16 }}>
        <div>
          <Link to="/" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 13, color: 'var(--text-secondary)', textDecoration: 'none', marginBottom: 6 }}>
            <ArrowLeft size={14} /> Proyectos
          </Link>
          <h1 style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 22, fontWeight: 600, margin: 0, color: 'var(--text-primary)' }}>
            <span style={{ width: 12, height: 12, borderRadius: 999, background: proyecto.color || 'var(--accent)', display: 'inline-block' }} />
            {proyecto.nombre}
          </h1>
          {proyecto.descripcion && <p style={{ fontSize: 13, color: 'var(--text-secondary)', margin: '4px 0 0' }}>{proyecto.descripcion}</p>}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
          {puedeEditar && (
            <>
              <button onClick={() => setModalNuevaAbierto(true)} style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '8px 14px', borderRadius: 8, background: 'var(--accent)', color: '#fff', border: '1px solid var(--accent)', fontSize: 14, fontWeight: 500, cursor: 'pointer' }}>
                <Plus size={16} /> Nueva tarea
              </button>
              <button onClick={() => setModalEditarAbierto(true)} style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '8px 14px', borderRadius: 8, background: 'var(--bg-secondary)', color: 'var(--text-primary)', border: '1px solid var(--border)', fontSize: 14, cursor: 'pointer' }}>
                <Pencil size={14} /> Editar
              </button>
            </>
          )}
          {proyecto.miRol === 'Owner' && (
            <button onClick={handleEliminarProyecto} disabled={eliminando} style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '8px 14px', borderRadius: 8, background: 'var(--danger)', color: '#fff', border: '1px solid var(--danger)', fontSize: 14, cursor: 'pointer', opacity: eliminando ? 0.6 : 1 }}>
              <Trash2 size={14} /> {eliminando ? 'Eliminando...' : 'Eliminar'}
            </button>
          )}
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap', marginBottom: 16, padding: 12, background: 'var(--bg-secondary)', border: '1px solid var(--border)', borderRadius: 12 }}>
        <button onClick={() => setModalMiembrosAbierto(true)} style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '6px 12px', borderRadius: 8, background: 'var(--bg-tertiary)', border: '1px solid var(--border)', color: 'var(--text-primary)', fontSize: 13, cursor: 'pointer' }}>
          <Users size={14} /> Miembros ({miembros.length})
        </button>

        <div style={{ display: 'flex', alignItems: 'center', gap: 8, flex: 1, minWidth: 180, maxWidth: 320, background: 'var(--bg-primary)', border: '1px solid var(--border)', borderRadius: 8, padding: '6px 10px' }}>
          <Search size={14} style={{ color: 'var(--text-muted)' }} />
          <input value={busqueda} onChange={(e) => setBusqueda(e.target.value)} placeholder="Buscar tareas..." style={{ flex: 1, border: 'none', outline: 'none', background: 'transparent', color: 'var(--text-primary)', fontSize: 13 }} />
        </div>

        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 13, color: 'var(--text-secondary)' }}><Filter size={14} /> Filtros:</span>
        <select value={filtroPrioridad} onChange={(e) => setFiltroPrioridad(e.target.value)} style={{ padding: '6px 10px', borderRadius: 8, border: '1px solid var(--border)', background: 'var(--bg-primary)', color: 'var(--text-primary)', fontSize: 13 }}>
          <option value="">Toda prioridad</option>
          <option value="Baja">Baja</option>
          <option value="Media">Media</option>
          <option value="Alta">Alta</option>
        </select>
        <select value={filtroAsignado} onChange={(e) => setFiltroAsignado(e.target.value)} style={{ padding: '6px 10px', borderRadius: 8, border: '1px solid var(--border)', background: 'var(--bg-primary)', color: 'var(--text-primary)', fontSize: 13 }}>
          <option value="">Todos los asignados</option>
          {miembros.map((m) => (
            <option key={m.usuarioId} value={m.usuarioId}>{m.nombre}</option>
          ))}
        </select>
        {!puedeEditar && <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, fontSize: 12, color: 'var(--text-muted)' }}><Eye size={12} /> Solo lectura ({proyecto.miRol})</span>}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16, alignItems: 'start' }}>
        {COLUMNAS.map((col) => (
          <KanbanColumn
            key={col.estado}
            titulo={col.titulo}
            estado={col.estado}
            colorDot={col.color}
            tareas={tareasFiltradasPorBusqueda(tareas.filter((t) => t.estado === col.estado))}
            onTaskClick={setTareaSeleccionada}
            onDrop={handleDrop}
            onDragStart={handleDragStart}
            puedeEditar={puedeEditar}
            onAddTask={() => setModalNuevaAbierto(true)}
          />
        ))}
      </div>

      {tareaSeleccionada && (
        <TaskModal tarea={tareaSeleccionada} proyectoId={proyectoId} miembros={miembros} puedeEditar={puedeEditar} onClose={() => setTareaSeleccionada(null)} onGuardado={handleTareaGuardada} onEliminado={handleTareaEliminada} />
      )}
      {modalNuevaAbierto && (
        <TaskModal tarea={null} proyectoId={proyectoId} miembros={miembros} puedeEditar={true} onClose={() => setModalNuevaAbierto(false)} onGuardado={handleTareaGuardada} onEliminado={() => {}} />
      )}
      {modalMiembrosAbierto && (
        <MembersModal proyecto={proyecto} miembros={miembros} esOwner={proyecto.miRol === 'Owner'} onClose={() => setModalMiembrosAbierto(false)} onCambio={setMiembros} />
      )}
      {modalEditarAbierto && (
        <ProyectoModal proyecto={proyecto} onClose={() => setModalEditarAbierto(false)} onGuardado={handleProyectoGuardado} />
      )}
    </AppLayout>
  );
}
