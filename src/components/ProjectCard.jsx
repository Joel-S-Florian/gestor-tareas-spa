import { Link } from 'react-router-dom';
import { FolderKanban, Users, CheckCircle2, Shield, Eye, Edit3 } from 'lucide-react';
import './ProjectCard.css';

export default function ProjectCard({ proyecto }) {
  const getRolTexto = (rol) => {
    if (rol === undefined || rol === null) return 'Viewer';
    if (typeof rol === 'number') {
      const roles = ['Owner', 'Editor', 'Viewer'];
      return roles[rol] || 'Viewer';
    }
    return rol;
  };

  const rol = getRolTexto(proyecto.miRol);
  const rolIcon = rol === 'Owner' ? Shield : rol === 'Editor' ? Edit3 : Eye;
  const RolIcon = rolIcon;
  const progress = proyecto.totalTareas > 0 ? Math.round(((proyecto.tareasCompletadas || 0) / proyecto.totalTareas) * 100) : 0;

  return (
    <Link to={`/proyectos/${proyecto.id}`} className="project-card" style={{ textDecoration: 'none' }}>
      <div className="project-card__color" style={{ background: proyecto.color || 'var(--accent)', height: 4, borderRadius: '12px 12px 0 0' }} />
      <div className="project-card__body" style={{ padding: 16 }}>
        <div className="project-card__header" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8 }}>
          <h3 className="project-card__title" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 15, fontWeight: 600, color: 'var(--text-primary)' }}>
            <FolderKanban size={16} style={{ color: 'var(--accent)' }} /> {proyecto.nombre}
          </h3>
          <span className={`badge badge--${rol.toLowerCase()}`} style={{ display: 'inline-flex', alignItems: 'center', gap: 4, fontSize: 11, padding: '2px 8px', borderRadius: 999, background: rol === 'Owner' ? 'var(--accent-dim)' : 'var(--bg-tertiary)', color: rol === 'Owner' ? 'var(--accent)' : 'var(--text-secondary)', border: '1px solid var(--border)', fontWeight: 600 }}>
            <RolIcon size={11} /> {rol === 'Owner' ? 'Propietario' : rol === 'Editor' ? 'Editor' : 'Lector'}
          </span>
        </div>
        {proyecto.descripcion && <p className="project-card__desc" style={{ fontSize: 13, color: 'var(--text-secondary)', margin: '8px 0' }}>{proyecto.descripcion}</p>}
        <div style={{ height: 4, background: 'var(--bg-tertiary)', borderRadius: 999, overflow: 'hidden', margin: '10px 0' }}>
          <div style={{ width: `${progress}%`, height: '100%', background: 'var(--accent)', transition: 'width 0.3s' }} />
        </div>
        <div className="project-card__meta" style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12, color: 'var(--text-muted)' }}>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}><CheckCircle2 size={12} /> {proyecto.totalTareas} tareas</span>
          <span>·</span>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}><Users size={12} /> {proyecto.totalMiembros} miembros</span>
        </div>
      </div>
    </Link>
  );
}
