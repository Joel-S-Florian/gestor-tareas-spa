import api from './api';

export const comentarioService = {
  async agregar(tareaId, contenido) {
    const { data } = await api.post(`/tareas/${tareaId}/comentarios`, { contenido });
    return data;
  },

  async eliminar(comentarioId) {
    await api.delete(`/comentarios/${comentarioId}`);
  }
};
