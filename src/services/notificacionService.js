import api from './api';

export const notificacionService = {
  async listar() {
    const { data } = await api.get('/notificaciones'); // { noLeidas, items }
    return data;
  },
  async marcarLeida(id) {
    await api.post(`/notificaciones/${id}/leida`);
  },
  async leerTodas() {
    await api.post('/notificaciones/leer-todas');
  }
};
