import api from './api';

export const extrasService = {
  async actividadProyecto(proyectoId) {
    const { data } = await api.get(`/proyectos/${proyectoId}/actividad`);
    return data;
  },
  async actividadTarea(tareaId) {
    const { data } = await api.get(`/tareas/${tareaId}/actividad`);
    return data;
  },

  async agregarItem(tareaId, texto) {
    const { data } = await api.post(`/tareas/${tareaId}/checklist`, { texto });
    return data;
  },
  async actualizarItem(itemId, cambios) {
    const { data } = await api.patch(`/checklist/${itemId}`, cambios);
    return data;
  },
  async eliminarItem(itemId) {
    await api.delete(`/checklist/${itemId}`);
  },

  async etiquetas(proyectoId) {
    const { data } = await api.get(`/proyectos/${proyectoId}/etiquetas`);
    return data;
  },
  async crearEtiqueta(proyectoId, nombre, color) {
    const { data } = await api.post(`/proyectos/${proyectoId}/etiquetas`, { nombre, color });
    return data;
  },
  async eliminarEtiqueta(etiquetaId) {
    await api.delete(`/etiquetas/${etiquetaId}`);
  },
  async asignarEtiquetas(tareaId, etiquetaIds) {
    const { data } = await api.put(`/tareas/${tareaId}/etiquetas`, { etiquetaIds });
    return data;
  }
};
