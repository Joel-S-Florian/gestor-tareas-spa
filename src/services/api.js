import axios from 'axios';

// Usar variable de entorno (compatible con Vite)
export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:52411/api/v1';

// withCredentials: el navegador envía la cookie HttpOnly del refresh token (solo a /auth/*).
const api = axios.create({
  baseURL: API_URL,
  timeout: 20000,
  withCredentials: true,
  headers: { 'Content-Type': 'application/json' }
});

// El access token vive solo en memoria: no hay nada que robar de localStorage.
// Al recargar la página se recupera pidiendo un access token nuevo con la cookie.
let accessToken = null;
export const sesion = {
  getAccessToken: () => accessToken,
  setAccessToken: (t) => { accessToken = t; },
  clear: () => { accessToken = null; }
};

export const EVENTO_SESION_EXPIRADA = 'gt:sesion-expirada';

// Pide un access token nuevo. Las llamadas simultáneas comparten una sola petición:
// el refresh token rota en cada uso, y repetirlo lo invalidaría.
let refrescando = null;
export function renovarSesion() {
  if (!refrescando) {
    refrescando = axios
      .post(`${API_URL}/auth/refresh`, null, { withCredentials: true })
      .then((res) => {
        sesion.setAccessToken(res.data.accessToken);
        return res.data;
      })
      .finally(() => { refrescando = null; });
  }
  return refrescando;
}

api.interceptors.request.use((config) => {
  if (accessToken) config.headers.Authorization = `Bearer ${accessToken}`;
  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const original = error.config;
    const esRutaAuth = original?.url?.includes('/auth/');

    if (error.response?.status === 401 && original && !original._retry && !esRutaAuth) {
      original._retry = true;
      try {
        const { accessToken: nuevo } = await renovarSesion();
        original.headers.Authorization = `Bearer ${nuevo}`;
        return api(original);
      } catch (refreshError) {
        sesion.clear();
        window.dispatchEvent(new Event(EVENTO_SESION_EXPIRADA));
        return Promise.reject(refreshError);
      }
    }

    // Siempre rechazar para que los componentes puedan manejar el error.
    return Promise.reject(error);
  }
);

export default api;
