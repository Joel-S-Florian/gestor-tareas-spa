import api from './api';

export const proyectoService = {
  async listar() {
    const { data } = await api.get('/proyectos');
    return data;
  },

  async obtener(id) {
    const { data } = await api.get(`/proyectos/${id}`);
    return data;
  },

  async crear(payload) {
    const { data } = await api.post('/proyectos', payload);
    return data;
  },

  async actualizar(id, payload) {
    const { data } = await api.put(`/proyectos/${id}`, payload);
    return data;
  },

  async eliminar(id) {
    await api.delete(`/proyectos/${id}`);
  },

  async listarMiembros(id) {
    const { data } = await api.get(`/proyectos/${id}/miembros`);
    return data;
  },

  async invitarMiembro(id, email, rol) {
    const { data } = await api.post(`/proyectos/${id}/miembros`, { email, rol });
    return data;
  },

  async removerMiembro(id, userId) {
    await api.delete(`/proyectos/${id}/miembros/${userId}`);
  },

  async cambiarRolMiembro(id, userId, rol) {
    const { data } = await api.put(`/proyectos/${id}/miembros/${userId}/rol`, { rol });
    return data;
  }
};
