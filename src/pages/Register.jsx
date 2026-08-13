import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import './Auth.css';

export default function Register() {
  const [nombre, setNombre] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { registrar, cargando, error } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await registrar(nombre, email, password);
      navigate('/', { replace: true });
    } catch {
      // el error ya queda expuesto vía el contexto
    }
  };

  return (
    <div className="auth">
      <form className="auth__card" onSubmit={handleSubmit}>
        <div className="auth__mark">GT</div>
        <h1 className="auth__title">Crea tu cuenta</h1>
        <p className="auth__subtitle">Empieza a organizar tus proyectos</p>

        {error && <div className="auth__error">{error}</div>}

        <div className="auth__field">
          <label className="auth__label" htmlFor="nombre">Nombre</label>
          <input
            id="nombre"
            className="auth__input"
            type="text"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            placeholder="Tu nombre"
            required
            autoComplete="name"
          />
        </div>

        <div className="auth__field">
          <label className="auth__label" htmlFor="email">Email</label>
          <input
            id="email"
            className="auth__input"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="tu@email.com"
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
            placeholder="Mínimo 8 caracteres"
            required
            minLength={8}
            autoComplete="new-password"
          />
        </div>

        <button className="auth__submit" type="submit" disabled={cargando}>
          {cargando ? 'Creando cuenta…' : 'Crear cuenta'}
        </button>

        <p className="auth__footer">
          ¿Ya tienes cuenta? <Link to="/login">Inicia sesión</Link>
        </p>
      </form>
    </div>
  );
}
