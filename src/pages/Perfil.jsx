import { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import { userService } from '../services/userService';
import { useAuth } from '../hooks/useAuth';
import { useApi } from '../hooks/useApi';
import { mensajeDeError } from '../utils/mensajeDeError';
import '../components/Modal.css';
import './Perfil.css';

export default function Perfil() {
  const { usuario, actualizarUsuario } = useAuth();
  const { datos, cargando, error } = useApi(userService.obtenerPerfil);

  const [nombre, setNombre] = useState('');
  const [email, setEmail] = useState('');
  const [guardando, setGuardando] = useState(false);
  const [guardado, setGuardado] = useState(false);
  const [errorGuardar, setErrorGuardar] = useState(null);

  useEffect(() => {
    if (datos) {
      setNombre(datos.nombre);
      setEmail(datos.email);
    }
  }, [datos]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setGuardando(true);
    setGuardado(false);
    setErrorGuardar(null);
    try {
      const actualizado = await userService.actualizarPerfil({ nombre: nombre.trim(), email: email.trim() });
      actualizarUsuario(actualizado);
      setGuardado(true);
    } catch (err) {
      setErrorGuardar(mensajeDeError(err, 'No se pudo guardar el perfil.'));
    } finally {
      setGuardando(false);
    }
  };

  return (
    <div>
      <Navbar />
      <main className="perfil">
        <div className="perfil__card">
          <div className="perfil__avatar">{iniciales(usuario?.nombre)}</div>
          <h1 className="perfil__title">Mi perfil</h1>
          <p className="perfil__subtitle">{usuario?.email}</p>

          {cargando && <p className="dashboard__estado">Cargando perfil…</p>}
          {error && <div className="auth__error">{error}</div>}

          {!cargando && !error && datos && (
            <form onSubmit={handleSubmit} className="perfil__form">
              {errorGuardar && <div className="auth__error">{errorGuardar}</div>}
              {guardado && <div className="perfil__ok">Cambios guardados.</div>}

              <div className="form-field">
                <label className="form-label" htmlFor="nombre">Nombre</label>
                <input
                  id="nombre"
                  className="form-input"
                  value={nombre}
                  onChange={(e) => setNombre(e.target.value)}
                  required
                  maxLength={150}
                />
              </div>

              <div className="form-field">
                <label className="form-label" htmlFor="email">Email</label>
                <input
                  id="email"
                  className="form-input"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  maxLength={200}
                />
              </div>

              <div className="perfil__acciones">
                <button type="submit" className="btn btn--primary" disabled={guardando}>
                  {guardando ? 'Guardando…' : 'Guardar cambios'}
                </button>
              </div>
            </form>
          )}
        </div>
      </main>
    </div>
  );
}

function iniciales(nombre) {
  if (!nombre) return '?';
  return nombre
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((p) => p.charAt(0).toUpperCase())
    .join('');
}