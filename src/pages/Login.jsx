import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import './Auth.css';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login, cargando, error } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const destino = location.state?.from?.pathname || '/';

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await login(email, password);
      navigate(destino, { replace: true });
    } catch {
      // el error ya queda expuesto vía el contexto
    }
  };

  const handleAutofill = () => {
    setEmail('joel@demo.com');
    setPassword('Demo1234!');
  };

  return (
    <div className="auth">
      <form className="auth__card" onSubmit={handleSubmit}>
        <div className="auth__mark">GT</div>
        <h1 className="auth__title">Inicia sesión</h1>
        <p className="auth__subtitle">Entra a tus proyectos y tareas</p>

        {error && <div className="auth__error">{error}</div>}

        <div className="auth__field">
          <label className="auth__label" htmlFor="email">Email</label>
          <input
            id="email"
            className="auth__input"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="joel@demo.com"
            required
            autoComplete="email"
          />
        </div>

        <div className="auth__field">
          <label className="auth__label" htmlFor="password">Contraseña</label>
          <input
            id="password"
            className="auth__input"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            required
            autoComplete="current-password"
          />
        </div>
        
        <button type="button" onClick={handleAutofill} className="auth__autofill" style={{marginBottom: '10px', fontSize: '12px', background: 'transparent', border: 'none', color: 'var(--brand-color)', cursor: 'pointer', textDecoration: 'underline'}}>
          Autocompletar demo
        </button>

        <button className="auth__submit" type="submit" disabled={cargando}>
          {cargando ? 'Entrando…' : 'Entrar'}
        </button>

        <p className="auth__footer">
          ¿No tienes cuenta? <Link to="/register">Regístrate</Link>
        </p>
      </form>
    </div>
  );
}
