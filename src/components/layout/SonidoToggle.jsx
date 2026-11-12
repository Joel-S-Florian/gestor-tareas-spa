import { useSyncExternalStore } from 'react';
import { Volume2, VolumeX } from 'lucide-react';
import { sonido } from '../../services/sonido';

export default function SonidoToggle() {
  const activo = useSyncExternalStore(sonido.suscribir, sonido.estaActivo);

  return (
    <button
      type="button"
      onClick={() => sonido.activar(!activo)}
      aria-pressed={activo}
      aria-label={activo ? 'Silenciar sonidos' : 'Activar sonidos'}
      title={activo ? 'Sonidos activados' : 'Sonidos apagados'}
      style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: 36, height: 36, borderRadius: 8, border: '1px solid var(--border)', background: 'var(--bg-secondary)', color: activo ? 'var(--accent)' : 'var(--text-secondary)', cursor: 'pointer' }}
    >
      {activo ? <Volume2 size={16} /> : <VolumeX size={16} />}
    </button>
  );
}
