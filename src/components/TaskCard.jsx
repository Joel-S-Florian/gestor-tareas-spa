import { useState } from 'react';
import { Flag, MessageSquare, Paperclip, Calendar, ListChecks } from 'lucide-react';
import './TaskCard.css';

const PRIORIDAD_LABEL = { Baja: 'Baja', Media: 'Media', Alta: 'Alta' };
const PRIORIDAD_COLOR = { Baja: 'var(--info)', Media: 'var(--warning)', Alta: 'var(--danger)' };

export default function TaskCard({ tarea, onClick, onDragStart, arrastrable, destacada, indice = 0 }) {
  const [arrastrando, setArrastrando] = useState(false);
  const vencida = tarea.fechaVencimiento && new Date(tarea.fechaVencimiento) < new Date() && tarea.estado !== 'Done';

  return (
    <div
      className={`task-card anim-fade-up${arrastrando ? ' task-card--arrastrando' : ''}${destacada ? ' task-card--recien' : ''}`}
      data-id={tarea.id}
      draggable={arrastrable}
      onDragStart={(e) => { setArrastrando(true); onDragStart?.(e, tarea); }}
      onDragEnd={() => setArrastrando(false)}
      onClick={() => onClick(tarea)}
      role="button"
      tabIndex={0}
      style={{ cursor: 'pointer', '--i': indice }}
    >
      <div className="task-card__top" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <span
          className={`task-card__prioridad task-card__prioridad--${tarea.prioridad.toLowerCase()}`}
          style={{ display: 'inline-flex', alignItems: 'center', gap: 4, color: PRIORIDAD_COLOR[tarea.prioridad] }}
        >
          <Flag size={12} /> {PRIORIDAD_LABEL[tarea.prioridad]}
        </span>
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8, fontSize: 12, color: 'var(--text-muted)' }}>
          {tarea.totalComentarios > 0 && (
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }} title="Comentarios"><MessageSquare size={12} /> {tarea.totalComentarios}</span>
          )}
          {tarea.totalAdjuntos > 0 && (
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }} title="Adjuntos"><Paperclip size={12} /> {tarea.totalAdjuntos}</span>
          )}
        </span>
      </div>
      {tarea.etiquetas?.length > 0 && (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4, marginTop: 8 }}>
          {tarea.etiquetas.map((e) => (
            <span key={e.id} style={{ fontSize: 10, padding: '1px 7px', borderRadius: 999, background: e.color, color: '#fff' }}>{e.nombre}</span>
          ))}
        </div>
      )}
      <p className="task-card__titulo" style={{ margin: '8px 0' }}>{tarea.titulo}</p>
      {tarea.descripcion && <p style={{ fontSize: 12, color: 'var(--text-secondary)', margin: '0 0 8px', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{tarea.descripcion}</p>}
      {tarea.totalChecklist > 0 && (
        <div title="Lista de pasos" style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11, color: 'var(--text-muted)', margin: '0 0 8px' }}>
          <ListChecks size={12} /> {tarea.checklistHechos}/{tarea.totalChecklist}
          <span style={{ flex: 1, height: 4, background: 'var(--bg-tertiary)', borderRadius: 999, overflow: 'hidden' }}>
            <span style={{ display: 'block', height: '100%', width: `${(tarea.checklistHechos / tarea.totalChecklist) * 100}%`, background: 'var(--accent)' }} />
          </span>
        </div>
      )}
      <div className="task-card__bottom" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        {tarea.asignadoANombre ? (
          <span className="task-card__asignado" title={tarea.asignadoANombre} style={{ width: 24, height: 24, borderRadius: '50%', background: 'var(--bg-tertiary)', border: '1px solid var(--border)', display: 'grid', placeItems: 'center', fontSize: 11, fontWeight: 600 }}>
            {inicial(tarea.asignadoANombre)}
          </span>
        ) : (
          <span className="task-card__sin-asignar" style={{ fontSize: 12, color: 'var(--text-muted)' }}>Sin asignar</span>
        )}
        {tarea.fechaVencimiento && (
          <span className={`task-card__fecha ${vencida ? 'task-card__fecha--vencida' : ''}`} style={{ display: 'inline-flex', alignItems: 'center', gap: 4, fontSize: 11, color: vencida ? 'var(--danger)' : 'var(--text-muted)' }}>
            <Calendar size={12} /> {formatearFecha(tarea.fechaVencimiento)}
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
