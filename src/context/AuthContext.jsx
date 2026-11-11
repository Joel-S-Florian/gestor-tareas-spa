import { createContext, useState, useCallback, useEffect } from 'react';
import { authService } from '../services/authService';
import { EVENTO_SESION_EXPIRADA } from '../services/api';
import { mensajeDeError } from '../utils/mensajeDeError';

export const AuthContext = createContext(null);

// La sesión no se guarda en el navegador: al abrir la app se pide a la API,
// con la cookie HttpOnly, un access token y el usuario (restaurar()).
export function AuthProvider({ children }) {
  const [usuario, setUsuario] = useState(null);
  const [iniciando, setIniciando] = useState(true);
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Versiones anteriores guardaban los tokens aquí: se borran para no dejarlos expuestos.
    ['gt_access_token', 'gt_refresh_token', 'gt_usuario'].forEach((k) => localStorage.removeItem(k));

    let vivo = true;
    authService.restaurar().then((u) => {
      if (vivo) { setUsuario(u); setIniciando(false); }
    });
    return () => { vivo = false; };
  }, []);

  // El interceptor avisa cuando no pudo renovar la sesión.
  useEffect(() => {
    const alExpirar = () => setUsuario(null);
    window.addEventListener(EVENTO_SESION_EXPIRADA, alExpirar);
    return () => window.removeEventListener(EVENTO_SESION_EXPIRADA, alExpirar);
  }, []);

  // Actualiza nombre/email tras editar el perfil (mantiene en sync el Navbar).
  const actualizarUsuario = useCallback((u) => setUsuario((actual) => ({ ...actual, ...u })), []);

  const entrar = useCallback(async (accion) => {
    setCargando(true);
    setError(null);
    try {
      const u = await accion();
      setUsuario(u);
      return u;
    } catch (err) {
      setError(mensajeDeError(err));
      throw err;
    } finally {
      setCargando(false);
    }
  }, []);

  const login = useCallback((email, password) => entrar(() => authService.login(email, password)), [entrar]);
  const registrar = useCallback((nombre, email, password) => entrar(() => authService.register(nombre, email, password)), [entrar]);

  const logout = useCallback(async () => {
    try { await authService.logout(); } finally { setUsuario(null); }
  }, []);

  const value = {
    usuario,
    estaAutenticado: Boolean(usuario),
    iniciando,
    cargando,
    error,
    login,
    registrar,
    logout,
    actualizarUsuario
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
