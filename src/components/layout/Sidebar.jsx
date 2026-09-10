import { NavLink, useNavigate } from 'react-router-dom';
import { LayoutDashboard, FolderKanban, User, LogOut } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';

function Logo() {
  return (
    <svg width="28" height="28" viewBox="0 0 28 28" fill="none" aria-hidden>
      <rect width="28" height="28" rx="7" fill="var(--accent)" />
      <g fill="white" opacity="0.95">
        <rect x="6" y="6" width="6.5" height="6.5" rx="1.8" />
        <rect x="15.5" y="6" width="6.5" height="6.5" rx="1.8" />
        <rect x="6" y="15.5" width="6.5" height="6.5" rx="1.8" />
        <rect x="15.5" y="15.5" width="6.5" height="6.5" rx="1.8" opacity="0.85" />
      </g>
    </svg>
  );
}

export default function Sidebar() {
  const { usuario, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const linkStyle = ({ isActive }) => ({
    display: 'flex',
    alignItems: 'center',
    gap: 10,
    padding: '9px 12px',
    borderRadius: 8,
    fontSize: 14,
    fontWeight: isActive ? 600 : 400,
    color: isActive ? 'var(--text-primary)' : 'var(--text-secondary)',
    background: isActive ? 'var(--bg-tertiary)' : 'transparent',
    textDecoration: 'none',
    transition: 'all 0.2s ease',
  });

  const initials = usuario?.nombre
    ? usuario.nombre.trim().split(/\s+/).slice(0, 2).map((p) => p[0].toUpperCase()).join('')
    : '?';

  return (
    <aside
      style={{
        width: 240,
        minHeight: '100vh',
        background: 'var(--bg-secondary)',
        borderRight: '1px solid var(--border)',
        display: 'flex',
        flexDirection: 'column',
        padding: '20px 14px',
        gap: 20,
        transition: 'background-color 0.2s ease, border-color 0.2s ease',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '4px 6px' }}>
        <Logo />
        <div>
          <div style={{ fontWeight: 700, fontSize: 16, color: 'var(--text-primary)', lineHeight: 1 }}>TabTask</div>
          <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>Gestion de proyectos y tareas</div>
        </div>
      </div>

      <nav style={{ display: 'flex', flexDirection: 'column', gap: 4, flex: 1 }}>
        <NavLink to="/" style={linkStyle}>
          <LayoutDashboard size={18} /> Dashboard
        </NavLink>
        <NavLink to="/perfil" style={linkStyle}>
          <User size={18} /> Mi perfil
        </NavLink>
        {/* Projects are listed inside Dashboard; use icon consistency */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '9px 12px', color: 'var(--text-muted)', fontSize: 13 }}>
          <FolderKanban size={16} /> Proyectos en Dashboard
        </div>
      </nav>

      {usuario && (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            padding: '12px 10px',
            borderRadius: 10,
            background: 'var(--bg-tertiary)',
            border: '1px solid var(--border)',
          }}
        >
          <div
            style={{
              width: 32,
              height: 32,
              borderRadius: '50%',
              background: 'var(--accent-dim)',
              border: '1px solid var(--accent)',
              color: 'var(--accent)',
              display: 'grid',
              placeItems: 'center',
              fontSize: 12,
              fontWeight: 700,
              flexShrink: 0,
            }}
          >
            {initials}
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{usuario.nombre}</div>
            <div style={{ fontSize: 11, color: 'var(--text-muted)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{usuario.email}</div>
          </div>
          <button
            onClick={handleLogout}
            title="Cerrar sesion"
            aria-label="Cerrar sesion"
            style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', padding: 4, display: 'grid', placeItems: 'center' }}
          >
            <LogOut size={16} />
          </button>
        </div>
      )}
    </aside>
  );
}
