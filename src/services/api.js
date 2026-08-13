import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;

const api = axios.create({
  baseURL: API_URL,
  timeout: 20000
});

// --- Almacenamiento de tokens ---
// Se centraliza aquí para que AuthContext y el interceptor lean/escriban del mismo lugar.
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
  }
};

// --- Interceptor de request: inyecta el JWT ---
api.interceptors.request.use((config) => {
  const token = tokenStorage.getAccessToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// --- Interceptor de response: renueva el token en un 401 y reintenta ---
// Se encolan las peticiones que llegan mientras el refresh está en curso,
// para no disparar varios refresh en paralelo.
let refreshingPromise = null;

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    const status = error.response?.status;
    const esRutaAuth = originalRequest?.url?.includes('/auth/');

    if (status === 401 && !originalRequest._retry && !esRutaAuth) {
      originalRequest._retry = true;

      try {
        if (!refreshingPromise) {
          const refreshToken = tokenStorage.getRefreshToken();
          if (!refreshToken) throw new Error('Sin refresh token');

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
        localStorage.removeItem('gt_usuario');
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default api;
