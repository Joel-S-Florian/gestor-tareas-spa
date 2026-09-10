import { useLocation, Link } from 'react-router-dom';
import { ChevronDown } from 'lucide-react';
import ThemeToggle from './ThemeToggle';
import { useAuth } from '../../hooks/useAuth';

function breadcrumbFor(pathname) {
  if (pathname === '/') return [{ label: 'Dashboard' }];
  if (pathname.startsWith('/proyectos/')) return [{ label: 'Dashboard', to: '/' }, { label: 'Proyecto' }];
  if (pathname.startsWith('/perfil')) return [{ label: 'Mi perfil' }];
  return [{ label: 'TabTask' }];
}

export default function Header() {
  const location = useLocation();
  const { usuario } = useAuth();
  const crumbs = breadcrumbFor(location.pathname);

  return (
    <header
      style={{
        height: 56,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 20px',
        background: 'var(--bg-secondary)',
        borderBottom: '1px solid var(--border)',
        gap: 16,
        transition: 'background-color 0.2s ease, border-color 0.2s ease',
      }}
    >
      <nav aria-label="Breadcrumb" style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, color: 'var(--text-secondary)' }}>
        {crumbs.map((c, i) => (
          <span key={i} style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
            {i > 0 && <span style={{ color: 'var(--text-muted)' }}>/</span>}
            {c.to ? <Link to={c.to} style={{ color: 'var(--text-secondary)', textDecoration: 'none' }}>{c.label}</Link> : <span style={{ color: 'var(--text-primary)', fontWeight: 500 }}>{c.label}</span>}
          </span>
        ))}
      </nav>

      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <ThemeToggle />
        {usuario && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: 'var(--text-secondary)' }}>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
              {usuario.nombre} <ChevronDown size={14} style={{ color: 'var(--text-muted)' }} />
            </span>
          </div>
        )}
      </div>
    </header>
  );
}
