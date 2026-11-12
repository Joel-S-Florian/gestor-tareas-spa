// Estado vacío con una ilustración sencilla (SVG en línea, toma el color de acento).
const DIBUJOS = {
  tareas: (
    <svg width="56" height="56" viewBox="0 0 56 56" fill="none" aria-hidden>
      <rect x="9" y="12" width="38" height="32" rx="6" stroke="currentColor" strokeWidth="2.5" opacity=".35" />
      <rect x="15" y="19" width="14" height="4" rx="2" fill="currentColor" opacity=".55" />
      <rect x="15" y="27" width="26" height="4" rx="2" fill="currentColor" opacity=".3" />
      <circle cx="42" cy="40" r="9" fill="currentColor" />
      <path d="M38 40l3 3 5-6" stroke="#fff" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  avisos: (
    <svg width="56" height="56" viewBox="0 0 56 56" fill="none" aria-hidden>
      <path d="M16 38V26a12 12 0 0 1 24 0v12l3 4H13l3-4z" stroke="currentColor" strokeWidth="2.5" strokeLinejoin="round" opacity=".5" />
      <path d="M24 46a4 4 0 0 0 8 0" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
      <circle cx="42" cy="14" r="5" fill="currentColor" />
    </svg>
  ),
  proyectos: (
    <svg width="56" height="56" viewBox="0 0 56 56" fill="none" aria-hidden>
      <rect x="8" y="14" width="12" height="28" rx="3" fill="currentColor" opacity=".3" />
      <rect x="22" y="14" width="12" height="20" rx="3" fill="currentColor" opacity=".55" />
      <rect x="36" y="14" width="12" height="34" rx="3" fill="currentColor" />
    </svg>
  ),
};

export default function EmptyState({ dibujo = 'tareas', titulo, texto, children }) {
  return (
    <div className="vacio">
      {DIBUJOS[dibujo]}
      <p className="vacio__titulo">{titulo}</p>
      {texto && <p className="vacio__texto">{texto}</p>}
      {children}
    </div>
  );
}
