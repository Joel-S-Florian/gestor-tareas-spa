export function mensajeDeError(err, fallback = 'Ocurrió un error. Intenta de nuevo.') {
  return err?.response?.data?.title || err?.response?.data?.detail || fallback;
}