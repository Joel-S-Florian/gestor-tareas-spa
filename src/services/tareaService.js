import api from './api';

export const tareaService = {
  async listarPorProyecto(proyectoId, filtros = {}) {
    const { data } = await api.get(`/proyectos/${proyectoId}/tareas`, { params: filtros });
    return data; // PagedResultDto: { items, page, pageSize, totalItems, totalPages }
  },

  async obtener(id) {
    const { data } = await api.get(`/tareas/${id}`);
    return data;
  },

  async crear(proyectoId, payload) {
    const { data } = await api.post(`/proyectos/${proyectoId}/tareas`, payload);
    return data;
  },

  async actualizar(id, payload) {
    const { data } = await api.put(`/tareas/${id}`, payload);
    return data;
  },

  async cambiarEstado(id, estado) {
    const { data } = await api.patch(`/tareas/${id}/estado`, { estado });
    return data;
  },

  async eliminar(id) {
    await api.delete(`/tareas/${id}`);
  }
};
