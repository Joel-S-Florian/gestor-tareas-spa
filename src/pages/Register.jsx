import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { UserPlus, Loader2 } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import './Auth.css';

function TabTaskLogo({ size = 36 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 28 28" fill="none" aria-hidden>
      <rect width="28" height="28" rx="7" fill="#FF5733" />
      <g fill="white" opacity="0.95">
        <rect x="6" y="6" width="6.5" height="6.5" rx="1.8" />
        <rect x="15.5" y="6" width="6.5" height="6.5" rx="1.8" />
        <rect x="6" y="15.5" width="6.5" height="6.5" rx="1.8" />
        <rect x="15.5" y="15.5" width="6.5" height="6.5" rx="1.8" opacity="0.85" />
      </g>
    </svg>
  );
}

export default function Register() {
  const [nombre, setNombre] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { registrar, cargando, error } = useAuth();
  const navigate = useNavigate();

  useEffect(() => { document.title = 'TabTask \u00B7 Registro'; }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await registrar(nombre, email, password);
      navigate('/', { replace: true });
    } catch { /* via context */ }
  };

  return (
    <div className="auth" style={{ background: 'var(--bg-primary)', minHeight: '100vh', display: 'grid', placeItems: 'center', padding: 20 }}>
      <form className="auth__card" onSubmit={handleSubmit} style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)', borderRadius: 12, padding: 28, width: '100%', maxWidth: 400, boxShadow: 'var(--shadow-card)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, justifyContent: 'center', marginBottom: 12 }}>
          <TabTaskLogo />
          <span style={{ fontSize: 20, fontWeight: 700, color: 'var(--text-primary)' }}>TabTask</span>
        </div>
        <h1 className="auth__title" style={{ textAlign: 'center', fontSize: 20, fontWeight: 600, color: 'var(--text-primary)', margin: '0 0 4px' }}>Crea tu cuenta</h1>
        <p className="auth__subtitle" style={{ textAlign: 'center', fontSize: 13, color: 'var(--text-secondary)', margin: '0 0 20px' }}>Gestion de proyectos y tareas</p>

        {error && <div className="auth__error" style={{ background: '#EF44441A', border: '1px solid var(--danger)', color: 'var(--danger)', padding: '10px 12px', borderRadius: 8, fontSize: 13, marginBottom: 12 }}>{error}</div>}

        <div className="auth__field" style={{ marginBottom: 12 }}>
          <label className="auth__label" htmlFor="nombre" style={{ display: 'block', fontSize: 13, fontWeight: 500, color: 'var(--text-secondary)', marginBottom: 6 }}>Nombre</label>
          <input id="nombre" className="auth__input" type="text" value={nombre} onChange={(e) => setNombre(e.target.value)} placeholder="Tu nombre" required autoComplete="name" style={{ width: '100%', padding: '8px 12px', borderRadius: 8, border: '1px solid var(--border)', background: 'var(--bg-primary)', color: 'var(--text-primary)', fontSize: 14 }} />
        </div>

        <div className="auth__field" style={{ marginBottom: 12 }}>
          <label className="auth__label" htmlFor="email" style={{ display: 'block', fontSize: 13, fontWeight: 500, color: 'var(--text-secondary)', marginBottom: 6 }}>Email</label>
          <input id="email" className="auth__input" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="tu@email.com" required autoComplete="email" style={{ width: '100%', padding: '8px 12px', borderRadius: 8, border: '1px solid var(--border)', background: 'var(--bg-primary)', color: 'var(--text-primary)', fontSize: 14 }} />
        </div>

        <div className="auth__field" style={{ marginBottom: 16 }}>
          <label className="auth__label" htmlFor="password" style={{ display: 'block', fontSize: 13, fontWeight: 500, color: 'var(--text-secondary)', marginBottom: 6 }}>Contrasena</label>
          <input id="password" className="auth__input" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Minimo 8 caracteres" required minLength={8} autoComplete="new-password" style={{ width: '100%', padding: '8px 12px', borderRadius: 8, border: '1px solid var(--border)', background: 'var(--bg-primary)', color: 'var(--text-primary)', fontSize: 14 }} />
        </div>

        <button className="auth__submit" type="submit" disabled={cargando} style={{ width: '100%', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 6, padding: '10px 14px', borderRadius: 8, background: 'var(--accent)', color: '#fff', border: 'none', fontSize: 14, fontWeight: 600, cursor: 'pointer', opacity: cargando ? 0.7 : 1 }}>
          {cargando ? <><Loader2 size={16} /> Creando cuenta...</> : <><UserPlus size={16} /> Crear cuenta</>}
        </button>

        <p className="auth__footer" style={{ textAlign: 'center', fontSize: 13, color: 'var(--text-secondary)', marginTop: 14 }}>
          Ya tienes cuenta? <Link to="/login" style={{ color: 'var(--accent)' }}>Inicia sesion</Link>
        </p>
      </form>
    </div>
  );
}
