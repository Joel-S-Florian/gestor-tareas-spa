import api, { sesion, renovarSesion } from './api';

export const authService = {
  async login(email, password) {
    const { data } = await api.post('/auth/login', { email, password });
    sesion.setAccessToken(data.accessToken);
    return data.usuario;
  },

  async register(nombre, email, password) {
    const { data } = await api.post('/auth/register', { nombre, email, password });
    sesion.setAccessToken(data.accessToken);
    return data.usuario;
  },

  // Recupera la sesión al abrir la app, con la cookie. Devuelve el usuario o null.
  async restaurar() {
    try {
      const data = await renovarSesion();
      return data.usuario;
    } catch {
      return null;
    }
  },

  async logout() {
    try {
      await api.post('/auth/logout');
    } finally {
      sesion.clear();
    }
  }
};
