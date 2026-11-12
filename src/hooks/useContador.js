import { useEffect, useState } from 'react';

// Número que sube hasta su valor (contadores del dashboard). Sin animación si el sistema pide reducir movimiento.
export function useContador(objetivo, ms = 600) {
  const [valor, setValor] = useState(0);

  useEffect(() => {
    const reducir = typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
    if (reducir || !objetivo) { setValor(objetivo || 0); return undefined; }
    let cuadro;
    const inicio = performance.now();
    const paso = (ahora) => {
      const p = Math.min((ahora - inicio) / ms, 1);
      setValor(Math.round(objetivo * (1 - Math.pow(1 - p, 3)))); // desacelera al final
      if (p < 1) cuadro = requestAnimationFrame(paso);
    };
    cuadro = requestAnimationFrame(paso);
    return () => cancelAnimationFrame(cuadro);
  }, [objetivo, ms]);

  return valor;
}
