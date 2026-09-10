import { Plus, Circle, Loader2, CheckCircle2 } from 'lucide-react';
import TaskCard from './TaskCard';
import './KanbanColumn.css';

const ICON_BY_STATE = { ToDo: Circle, InProgress: Loader2, Done: CheckCircle2 };

export default function KanbanColumn({ titulo, estado, tareas, colorDot, onTaskClick, onDrop, onDragStart, puedeEditar, onAddTask }) {
  const handleDragOver = (e) => { if (puedeEditar) e.preventDefault(); };
  const handleDrop = (e) => {
    e.preventDefault();
    const tareaId = e.dataTransfer.getData('text/tarea-id');
    if (tareaId) onDrop(Number(tareaId), estado);
  };
  const Icon = ICON_BY_STATE[estado] || Circle;

  return (
    <div className="kanban-col" onDragOver={handleDragOver} onDrop={handleDrop} style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)', borderRadius: 12, padding: 12, minHeight: 320 }}>
      <div className="kanban-col__header" style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
        <span style={{ width: 8, height: 8, borderRadius: 999, background: colorDot, display: 'inline-block' }} />
        <Icon size={14} style={{ color: colorDot }} />
        <h3 className="kanban-col__title" style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)', margin: 0, flex: 1 }}>{titulo}</h3>
        <span className="kanban-col__count" style={{ fontSize: 12, color: 'var(--text-muted)', background: 'var(--bg-tertiary)', padding: '2px 8px', borderRadius: 999, border: '1px solid var(--border)' }}>{tareas.length}</span>
        {puedeEditar && (
          <button onClick={onAddTask} aria-label="Agregar tarea" title="Agregar tarea" style={{ width: 24, height: 24, borderRadius: 6, border: '1px solid var(--border)', background: 'var(--bg-primary)', color: 'var(--text-secondary)', display: 'grid', placeItems: 'center', cursor: 'pointer' }}>
            <Plus size={14} />
          </button>
        )}
      </div>
      <div className="kanban-col__list" style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {tareas.map((t) => (
          <TaskCard key={t.id} tarea={t} onClick={onTaskClick} onDragStart={onDragStart} arrastrable={puedeEditar} />
        ))}
        {tareas.length === 0 && <p className="kanban-col__vacio" style={{ fontSize: 12, color: 'var(--text-muted)', textAlign: 'center', padding: '16px 0' }}>Sin tareas</p>}
      </div>
    </div>
  );
}
