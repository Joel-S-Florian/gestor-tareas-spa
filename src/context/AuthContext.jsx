import { createContext, useState, useCallback } from 'react';
import { authService } from '../services/authService';
import { tokenStorage } from '../services/api';
import { mensajeDeError } from '../utils/mensajeDeError';

export const AuthContext = createContext(null);

// No hay endpoint "quién soy", así que el usuario se guarda en localStorage
// junto a los tokens para sobrevivir recargas de página.
const USER_KEY = 'gt_usuario';

function leerUsuarioGuardado() {
  try {
    const raw = localStorage.getItem(USER_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function AuthProvider({ children }) {
  const [usuario, setUsuario] = useState(leerUsuarioGuardado);
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState(null);

  const guardarUsuario = (u) => {
    setUsuario(u);
    localStorage.setItem(USER_KEY, JSON.stringify(u));
  };

  // Actualiza nombre/email tras editar el perfil (mantiene en sync localStorage y Navbar).
  const actualizarUsuario = useCallback((u) => {
    guardarUsuario({ ...usuario, ...u });
  }, [usuario]);

  const login = useCallback(async (email, password) => {
    setCargando(true);
    setError(null);
    try {
      const u = await authService.login(email, password);
      guardarUsuario(u);
      return u;
    } catch (err) {
      setError(mensajeDeError(err));
      throw err;
    } finally {
      setCargando(false);
    }
  }, []);

  const registrar = useCallback(async (nombre, email, password) => {
    setCargando(true);
    setError(null);
    try {
      const u = await authService.register(nombre, email, password);
      guardarUsuario(u);
      return u;
    } catch (err) {
      setError(mensajeDeError(err));
      throw err;
    } finally {
      setCargando(false);
    }
  }, []);

  const logout = useCallback(async () => {
    await authService.logout();
    setUsuario(null);
    localStorage.removeItem(USER_KEY);
  }, []);

  const value = {
    usuario,
    estaAutenticado: Boolean(usuario) && Boolean(tokenStorage.getAccessToken()),
    cargando,
    error,
    login,
    registrar,
    logout,
    actualizarUsuario
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
