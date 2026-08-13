import api from './api';

export const userService = {
  async obtenerPerfil() {
    const { data } = await api.get('/auth/perfil');
    return data;
  },
  async actualizarPerfil(datos) {
    const { data } = await api.put('/auth/perfil', datos);
    return data;
  }
};