import './TaskCard.css';

const PRIORIDAD_LABEL = { Baja: 'Baja', Media: 'Media', Alta: 'Alta' };

export default function TaskCard({ tarea, onClick, onDragStart, arrastrable }) {
  const vencida = tarea.fechaVencimiento && new Date(tarea.fechaVencimiento) < new Date() && tarea.estado !== 'Done';

  return (
    <div
      className="task-card"
      draggable={arrastrable}
      onDragStart={(e) => onDragStart?.(e, tarea)}
      onClick={() => onClick(tarea)}
      role="button"
      tabIndex={0}
    >
      <div className="task-card__top">
        <span className={`task-card__prioridad task-card__prioridad--${tarea.prioridad.toLowerCase()}`}>
          {PRIORIDAD_LABEL[tarea.prioridad]}
        </span>
        {tarea.totalComentarios > 0 && (
          <span className="task-card__meta-icon" title="Comentarios">💬 {tarea.totalComentarios}</span>
        )}
      </div>
      <p className="task-card__titulo">{tarea.titulo}</p>
      <div className="task-card__bottom">
        {tarea.asignadoANombre ? (
          <span className="task-card__asignado" title={tarea.asignadoANombre}>
            {inicial(tarea.asignadoANombre)}
          </span>
        ) : (
          <span className="task-card__sin-asignar">Sin asignar</span>
        )}
        {tarea.fechaVencimiento && (
          <span className={`task-card__fecha ${vencida ? 'task-card__fecha--vencida' : ''}`}>
            {formatearFecha(tarea.fechaVencimiento)}
          </span>
        )}
      </div>
    </div>
  );
}

function inicial(nombre) {
  return nombre.trim().charAt(0).toUpperCase();
}

function formatearFecha(iso) {
  const fecha = new Date(iso);
  return fecha.toLocaleDateString('es-DO', { day: '2-digit', month: 'short' });
}
