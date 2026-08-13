import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div style={{ minHeight: '100%', display: 'grid', placeItems: 'center', padding: 24, textAlign: 'center' }}>
      <div>
        <p style={{ fontFamily: 'var(--font-mono)', fontSize: 13, color: 'var(--color-text-faint)', marginBottom: 8 }}>
          ERROR 404
        </p>
        <h1 style={{ fontSize: 22, marginBottom: 12 }}>Esta página no existe</h1>
        <Link to="/" style={{ color: 'var(--color-accent)', fontWeight: 600, textDecoration: 'none' }}>
          Volver al inicio
        </Link>
      </div>
    </div>
  );
}
