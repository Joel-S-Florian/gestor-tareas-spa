import TaskCard from './TaskCard';
import './KanbanColumn.css';

export default function KanbanColumn({ titulo, estado, tareas, colorDot, onTaskClick, onDrop, onDragStart, puedeEditar }) {
  const handleDragOver = (e) => {
    if (puedeEditar) e.preventDefault();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const tareaId = e.dataTransfer.getData('text/tarea-id');
    if (tareaId) onDrop(Number(tareaId), estado);
  };

  return (
    <div className="kanban-col" onDragOver={handleDragOver} onDrop={handleDrop}>
      <div className="kanban-col__header">
        <span className={`kanban-col__dot`} style={{ background: colorDot }} />
        <h3 className="kanban-col__title">{titulo}</h3>
        <span className="kanban-col__count">{tareas.length}</span>
      </div>

      <div className="kanban-col__list">
        {tareas.map((t) => (
          <TaskCard
            key={t.id}
            tarea={t}
            onClick={onTaskClick}
            onDragStart={onDragStart}
            arrastrable={puedeEditar}
          />
        ))}
        {tareas.length === 0 && <p className="kanban-col__vacio">Sin tareas</p>}
      </div>
    </div>
  );
}
