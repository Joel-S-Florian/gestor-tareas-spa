import './Modal.css';

export default function Modal({ titulo, onClose, children }) {
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal__header">
          <h2 className="modal__title">{titulo}</h2>
          <button className="modal__close" onClick={onClose} aria-label="Cerrar">✕</button>
        </div>
        <div className="modal__body">{children}</div>
      </div>
    </div>
  );
}
