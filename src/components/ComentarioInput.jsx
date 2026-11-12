import { useState } from 'react';

// @handle = parte del email antes de la arroba (la misma regla que aplica la API).
export const handleDe = (miembro) => miembro.email.split('@')[0];

// Devuelve el texto que se está escribiendo tras una "@" justo antes del cursor, o null.
export function mencionEnCurso(texto, cursor) {
  const m = /(^|\s)@([\w.-]*)$/.exec(texto.slice(0, cursor));
  return m ? m[2] : null;
}

// Campo de comentario con autocompletado de menciones al escribir "@".
export default function ComentarioInput({ value, onChange, miembros, ...resto }) {
  const [cursor, setCursor] = useState(0);
  const consulta = mencionEnCurso(value, cursor);
  const sugeridos = consulta === null ? [] : miembros
    .filter((m) => handleDe(m).toLowerCase().startsWith(consulta.toLowerCase()) || m.nombre.toLowerCase().startsWith(consulta.toLowerCase()))
    .slice(0, 5);

  const elegir = (m) => {
    const antes = value.slice(0, cursor).replace(/@[\w.-]*$/, `@${handleDe(m)} `);
    onChange(antes + value.slice(cursor));
  };

  return (
    <div style={{ position: 'relative', flex: 1 }}>
      <input
        {...resto}
        className="form-input"
        value={value}
        onChange={(e) => { setCursor(e.target.selectionStart ?? e.target.value.length); onChange(e.target.value); }}
        onKeyUp={(e) => setCursor(e.target.selectionStart ?? value.length)}
        onClick={(e) => setCursor(e.target.selectionStart ?? value.length)}
      />
      {sugeridos.length > 0 && (
        <ul role="listbox" aria-label="Mencionar a" style={{ position: 'absolute', bottom: '100%', left: 0, margin: 0, padding: 4, listStyle: 'none', background: 'var(--bg-secondary)', border: '1px solid var(--border)', borderRadius: 8, boxShadow: '0 8px 24px rgba(0,0,0,.18)', zIndex: 30, minWidth: 200 }}>
          {sugeridos.map((m) => (
            <li key={m.usuarioId} role="option" aria-selected="false">
              <button type="button" onMouseDown={(e) => { e.preventDefault(); elegir(m); }} style={{ display: 'block', width: '100%', textAlign: 'left', padding: '6px 8px', border: 'none', background: 'transparent', color: 'var(--text-primary)', fontSize: 13, cursor: 'pointer' }}>
                {m.nombre} <span style={{ color: 'var(--text-muted)' }}>@{handleDe(m)}</span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
