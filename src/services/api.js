import axios from 'axios';

// Usar variable de entorno (compatible con Vite)
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:52411/api/v1';

const api = axios.create({
  baseURL: API_URL,
  timeout: 20000,
  headers: {
    'Content-Type': 'application/json',
  }
});

// --- Almacenamiento de tokens (MISMO esquema que AuthContext) ---
const TOKEN_KEY = 'gt_access_token';
const REFRESH_KEY = 'gt_refresh_token';

export const tokenStorage = {
  getAccessToken: () => localStorage.getItem(TOKEN_KEY),
  getRefreshToken: () => localStorage.getItem(REFRESH_KEY),
  setTokens: (accessToken, refreshToken) => {
    localStorage.setItem(TOKEN_KEY, accessToken);
    localStorage.setItem(REFRESH_KEY, refreshToken);
  },
  clear: () => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(REFRESH_KEY);
    localStorage.removeItem('gt_usuario');
  }
};

// --- Interceptor de request: inyecta JWT ---
api.interceptors.request.use((config) => {
  const token = tokenStorage.getAccessToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => Promise.reject(error));

// --- Interceptor de response: refresh automático con cola de promesas ---
let refreshingPromise = null;

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    const status = error.response?.status;

    // Evitar bucles en rutas de autenticación
    const esRutaAuth = originalRequest?.url?.includes('/auth/login') ||
      originalRequest?.url?.includes('/auth/register');

    if (status === 401 && !originalRequest._retry && !esRutaAuth) {
      originalRequest._retry = true;

      try {
        if (!refreshingPromise) {
          const refreshToken = tokenStorage.getRefreshToken();
          if (!refreshToken) throw new Error('Sin refresh token disponible');

          refreshingPromise = axios
            .post(`${API_URL}/auth/refresh`, { refreshToken })
            .then((res) => {
              const { accessToken, refreshToken: nuevoRefresh } = res.data;
              tokenStorage.setTokens(accessToken, nuevoRefresh);
              return accessToken;
            })
            .finally(() => {
              refreshingPromise = null;
            });
        }

        const nuevoAccessToken = await refreshingPromise;
        originalRequest.headers.Authorization = `Bearer ${nuevoAccessToken}`;
        return api(originalRequest);
      } catch (refreshError) {
        tokenStorage.clear();
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }

    // SIEMPRE rechazar errores para que los componentes puedan manejarlos
    return Promise.reject(error);
  }
);

export default api;