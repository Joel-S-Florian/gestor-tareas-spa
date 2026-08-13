import { Link } from 'react-router-dom';
import './ProjectCard.css';

export default function ProjectCard({ proyecto }) {
  // El backend envía el rol como string ("Owner"); el fallback numérico
  // cubre respuestas antiguas/legacy por si se produce algún cache.
  const getRolTexto = (rol) => {
    if (rol === undefined || rol === null) return 'Viewer';
    if (typeof rol === 'number') {
      const roles = ['Owner', 'Editor', 'Viewer'];
      return roles[rol] || 'Viewer';
    }
    return rol;
  };

  return (
    <Link to={`/proyectos/${proyecto.id}`} className="project-card">
      <div className="project-card__color" style={{ background: proyecto.color }} />
      <div className="project-card__body">
        <div className="project-card__header">
          <h3 className="project-card__title">{proyecto.nombre}</h3>
          <span className={`badge badge--${getRolTexto(proyecto.miRol)?.toLowerCase()}`}>{getRolTexto(proyecto.miRol)}</span>
        </div>
        {proyecto.descripcion && <p className="project-card__desc">{proyecto.descripcion}</p>}  
        <div className="project-card__meta">
          <span>{proyecto.totalTareas} tareas</span>
          <span>&middot;</span>
          <span>{proyecto.totalMiembros} miembros</span>
        </div>
      </div>
    </Link>
  );
}
