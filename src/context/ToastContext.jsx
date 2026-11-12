import { createContext, useCallback, useContext, useMemo, useRef, useState } from 'react';
import { CheckCircle2, AlertTriangle, Info, X } from 'lucide-react';
import { reproducir } from '../services/sonido';

const ToastContext = createContext({ avisar() {}, exito() {}, error() {} });
export const useToast = () => useContext(ToastContext);

const ICONOS = { exito: CheckCircle2, error: AlertTriangle, info: Info };

// Avisos flotantes: confirman lo que acaba de pasar sin interrumpir. Máximo 4 a la vez.
export function ToastProvider({ children }) {
  const [items, setItems] = useState([]);
  const siguiente = useRef(0);

  const quitar = useCallback((id) => {
    setItems((prev) => prev.map((t) => (t.id === id ? { ...t, saliendo: true } : t)));
    setTimeout(() => setItems((prev) => prev.filter((t) => t.id !== id)), 200);
  }, []);

  const avisar = useCallback((texto, tipo = 'info') => {
    const id = ++siguiente.current;
    setItems((prev) => [...prev.slice(-3), { id, texto, tipo }]);
    if (tipo === 'error') reproducir('error');
    setTimeout(() => quitar(id), tipo === 'error' ? 5000 : 3200);
  }, [quitar]);

  const valor = useMemo(() => ({
    avisar,
    exito: (t) => avisar(t, 'exito'),
    error: (t) => avisar(t, 'error'),
  }), [avisar]);

  return (
    <ToastContext.Provider value={valor}>
      {children}
      <div className="toaster" role="region" aria-label="Avisos" aria-live="polite">
        {items.map((t) => {
          const Icono = ICONOS[t.tipo] || Info;
          return (
            <div key={t.id} className={`toast toast--${t.tipo}${t.saliendo ? ' toast--saliendo' : ''}`} role={t.tipo === 'error' ? 'alert' : 'status'}>
              <Icono size={16} style={{ flexShrink: 0, color: t.tipo === 'exito' ? 'var(--success)' : t.tipo === 'error' ? 'var(--danger)' : 'var(--info)' }} />
              <span>{t.texto}</span>
              <button type="button" className="toast__cerrar" aria-label="Cerrar aviso" onClick={() => quitar(t.id)}><X size={14} /></button>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
}
