import api from './api';

export const adjuntoService = {
  async subir(tareaId, archivo) {
    const formData = new FormData();
    formData.append('archivo', archivo);
    const { data } = await api.post(`/tareas/${tareaId}/adjuntos`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return data;
  },

  async descargar(adjuntoId, nombreArchivo) {
    const { data } = await api.get(`/adjuntos/${adjuntoId}`, { responseType: 'blob' });
    const url = window.URL.createObjectURL(data);
    const link = document.createElement('a');
    link.href = url;
    link.download = nombreArchivo;
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url);
  },

  async eliminar(adjuntoId) {
    await api.delete(`/adjuntos/${adjuntoId}`);
  }
};
