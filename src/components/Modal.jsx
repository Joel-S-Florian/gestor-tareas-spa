import { useCallback, useEffect, useState } from 'react';
import './Modal.css';

const MS_SALIDA = 140;

export default function Modal({ titulo, onClose, ancho, children }) {
  const [saliendo, setSaliendo] = useState(false);

  // Se anima la salida antes de avisar al padre; Escape también cierra.
  const cerrar = useCallback(() => {
    if (saliendo) return;
    setSaliendo(true);
    setTimeout(onClose, MS_SALIDA);
  }, [onClose, saliendo]);

  useEffect(() => {
    const alTeclear = (e) => { if (e.key === 'Escape') cerrar(); };
    document.addEventListener('keydown', alTeclear);
    return () => document.removeEventListener('keydown', alTeclear);
  }, [cerrar]);

  return (
    <div className={`modal-overlay${saliendo ? ' modal-overlay--saliendo' : ''}`} onClick={cerrar}>
      <div className={`modal${ancho ? ` modal--${ancho}` : ''}`} role="dialog" aria-modal="true" aria-label={titulo} onClick={(e) => e.stopPropagation()}>
        <div className="modal__header">
          <h2 className="modal__title">{titulo}</h2>
          <button className="modal__close" onClick={cerrar} aria-label="Cerrar">✕</button>
        </div>
        <div className="modal__body">{children}</div>
      </div>
    </div>
  );
}
