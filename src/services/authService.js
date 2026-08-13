import api, { tokenStorage } from './api';

export const authService = {
  async login(email, password) {
    const { data } = await api.post('/auth/login', { email, password });
    tokenStorage.setTokens(data.accessToken, data.refreshToken);
    return data.usuario;
  },

  async register(nombre, email, password) {
    const { data } = await api.post('/auth/register', { nombre, email, password });
    tokenStorage.setTokens(data.accessToken, data.refreshToken);
    return data.usuario;
  },

  async logout() {
    const refreshToken = tokenStorage.getRefreshToken();
    try {
      if (refreshToken) await api.post('/auth/logout', { refreshToken });
    } finally {
      tokenStorage.clear();
    }
  },

  estaAutenticado() {
    return Boolean(tokenStorage.getAccessToken());
  }
};
