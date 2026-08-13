import { useState, useCallback, useEffect } from 'react';
import { mensajeDeError } from '../utils/mensajeDeError';

// Hook genérico de llamadas a la API con estados de datos/carga/error.
// uso: const { datos, cargando, error, ejecutar } = useApi(servicio, ejecutarAlMontar);
// `servicio` debe ser una referencia estable (método de un servicio importado).
export function useApi(servicio, ejecutarAlMontar = true) {
  const [datos, setDatos] = useState(null);
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState(null);

  const ejecutar = useCallback(async (...args) => {
    setCargando(true);
    setError(null);
    try {
      const resultado = await servicio(...args);
      setDatos(resultado);
      return resultado;
    } catch (err) {
      setError(mensajeDeError(err));
      throw err;
    } finally {
      setCargando(false);
    }
  }, [servicio]);

  useEffect(() => {
    if (ejecutarAlMontar) {
      ejecutar().catch(() => {});
    }
  }, [ejecutar, ejecutarAlMontar]);

  return { datos, cargando, error, ejecutar };
}