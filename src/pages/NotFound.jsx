import { Link } from 'react-router-dom';
import { SearchX } from 'lucide-react';

export default function NotFound() {
  return (
    <div style={{ minHeight: '100%', display: 'grid', placeItems: 'center', padding: 24, textAlign: 'center' }}>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
        <SearchX size={36} style={{ color: 'var(--text-muted)' }} />
        <p style={{ fontFamily: 'var(--font-mono)', fontSize: 13, color: 'var(--text-muted)', margin: 0 }}>
          ERROR 404 — TabTask
        </p>
        <h1 style={{ fontSize: 22, margin: 0, color: 'var(--text-primary)' }}>Esta pagina no existe</h1>
        <Link to="/" style={{ color: 'var(--accent)', fontWeight: 600, textDecoration: 'none', marginTop: 8 }}>
          Volver al inicio
        </Link>
      </div>
    </div>
  );
}
