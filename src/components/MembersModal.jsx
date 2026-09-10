import { useState } from 'react';
import { X, UserPlus, Shield, Edit3, Eye, Trash2, Crown } from 'lucide-react';
import Modal from './Modal';
import { proyectoService } from '../services/proyectoService';
import { useAuth } from '../hooks/useAuth';

export default function MembersModal({ proyecto, miembros, esOwner, onClose, onCambio }) {
  const { usuario } = useAuth();
  const getRolTexto = (rol) => {
    if (rol === undefined || rol === null) return 'Viewer';
    if (typeof rol === 'number') return ['Owner', 'Editor', 'Viewer'][rol] || 'Viewer';
    return rol;
  };
  const rolLabel = (rol) => (rol === 'Owner' ? 'Propietario' : rol === 'Editor' ? 'Editor' : 'Lector');
  const RolIcon = (rol) => (rol === 'Owner' ? Crown : rol === 'Editor' ? Edit3 : Eye);

  const [email, setEmail] = useState('');
  const [rolNuevo, setRolNuevo] = useState('Viewer');
  const [enviando, setEnviando] = useState(false);
  const [error, setError] = useState(null);

  const handleInvitar = async (e) => {
    e.preventDefault();
    setEnviando(true);
    setError(null);
    try {
      const miembro = await proyectoService.invitarMiembro(proyecto.id, email, rolNuevo);
      onCambio([...miembros, miembro]);
      setEmail('');
    } catch (err) {
      setError(err?.response?.data?.title || 'No se pudo invitar al miembro.');
    } finally {
      setEnviando(false);
    }
  };

  const handleRemover = async (userId) => {
    if (!confirm('Remover a este miembro del proyecto?')) return;
    try {
      await proyectoService.removerMiembro(proyecto.id, userId);
      onCambio(miembros.filter((m) => m.usuarioId !== userId));
    } catch (err) {
      setError(err?.response?.data?.title || 'No se pudo remover al miembro.');
    }
  };

  const handleCambiarRol = async (userId, rol) => {
    try {
      const actualizado = await proyectoService.cambiarRolMiembro(proyecto.id, userId, rol);
      onCambio(miembros.map((m) => (m.usuarioId === userId ? actualizado : m)));
    } catch (err) {
      setError(err?.response?.data?.title || 'No se pudo cambiar el rol.');
    }
  };

  return (
    <Modal titulo="Miembros del proyecto" onClose={onClose}>
      {error && <div style={{ background: '#EF44441A', border: '1px solid var(--danger)', color: 'var(--danger)', padding: '10px 12px', borderRadius: 8, fontSize: 13, marginBottom: 12 }}>{error}</div>}

      <div style={{ display: 'flex', flexDirection: 'column', gap: 0, marginBottom: esOwner ? 20 : 0 }}>
        {miembros.map((m) => {
          const rol = getRolTexto(m.rol);
          const Icon = RolIcon(rol);
          const isMe = m.usuarioId === usuario?.id;
          return (
            <div key={m.usuarioId} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10, padding: '10px 0', borderBottom: '1px solid var(--border)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, minWidth: 0 }}>
                <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'var(--bg-tertiary)', border: '1px solid var(--border)', display: 'grid', placeItems: 'center', fontSize: 11, fontWeight: 700, color: 'var(--text-secondary)' }}>
                  {m.nombre.trim().charAt(0).toUpperCase()}
                </div>
                <div style={{ minWidth: 0 }}>
                  <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: 6 }}>
                    {m.nombre} {isMe && <span style={{ fontSize: 10, background: 'var(--accent-dim)', color: 'var(--accent)', border: '1px solid var(--accent)', padding: '1px 6px', borderRadius: 999 }}>tu</span>}
                  </div>
                  <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{m.email}</div>
                </div>
              </div>

              {esOwner && m.usuarioId !== proyecto.propietarioId ? (
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <select value={rol} onChange={(e) => handleCambiarRol(m.usuarioId, e.target.value)} style={{ padding: '5px 8px', fontSize: 12, borderRadius: 8, border: '1px solid var(--border)', background: 'var(--bg-primary)', color: 'var(--text-primary)' }}>
                    <option value="Owner">Propietario</option>
                    <option value="Editor">Editor</option>
                    <option value="Viewer">Lector</option>
                  </select>
                  <button type="button" onClick={() => handleRemover(m.usuarioId)} style={{ width: 28, height: 28, borderRadius: 8, border: '1px solid var(--border)', background: 'var(--bg-primary)', color: 'var(--danger)', display: 'grid', placeItems: 'center', cursor: 'pointer' }} title="Remover">
                    <X size={14} />
                  </button>
                </div>
              ) : (
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, fontSize: 11, padding: '3px 8px', borderRadius: 999, background: rol === 'Owner' ? 'var(--accent-dim)' : 'var(--bg-tertiary)', color: rol === 'Owner' ? 'var(--accent)' : 'var(--text-secondary)', border: '1px solid var(--border)', fontWeight: 600 }}>
                  <Icon size={11} /> {rolLabel(rol)}
                </span>
              )}
            </div>
          );
        })}
      </div>

      {esOwner && (
        <form onSubmit={handleInvitar} style={{ background: 'var(--bg-tertiary)', border: '1px solid var(--border)', borderRadius: 12, padding: 14 }}>
          <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 10, display: 'flex', alignItems: 'center', gap: 6 }}><UserPlus size={14} /> Invitar miembro</div>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="usuario@email.com" required style={{ flex: 1, minWidth: 180, padding: '8px 12px', borderRadius: 8, border: '1px solid var(--border)', background: 'var(--bg-secondary)', color: 'var(--text-primary)', fontSize: 13 }} />
            <select value={rolNuevo} onChange={(e) => setRolNuevo(e.target.value)} style={{ padding: '8px 10px', borderRadius: 8, border: '1px solid var(--border)', background: 'var(--bg-secondary)', color: 'var(--text-primary)', fontSize: 13 }}>
              <option value="Viewer">Lector</option>
              <option value="Editor">Editor</option>
              <option value="Owner">Propietario</option>
            </select>
            <button type="submit" disabled={enviando} style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '8px 14px', borderRadius: 8, background: 'var(--accent)', color: '#fff', border: 'none', fontSize: 13, fontWeight: 500, cursor: 'pointer', opacity: enviando ? 0.6 : 1 }}>
              <UserPlus size={14} /> {enviando ? 'Invitando...' : 'Invitar'}
            </button>
          </div>
        </form>
      )}
    </Modal>
  );
}
