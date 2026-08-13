import { useState } from 'react';
import Modal from './Modal';
import { proyectoService } from '../services/proyectoService';

export default function MembersModal({ proyecto, miembros, esOwner, onClose, onCambio }) {
  const getRolTexto = (rol) => {
    if (rol === undefined || rol === null) return 'Viewer';
    if (typeof rol === 'number') {
      const roles = ['Owner', 'Editor', 'Viewer'];
      return roles[rol] || 'Viewer';
    }
    return rol;
  };

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
    if (!confirm('¿Remover a este miembro del proyecto?')) return;
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
      {error && <div className="form-error">{error}</div>}

      <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: esOwner ? 20 : 0 }}>
        {miembros.map((m) => (
          <div
            key={m.usuarioId}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: 10,
              padding: '8px 0',
              borderBottom: '1px solid var(--color-border)'
            }}
          >
            <div style={{ minWidth: 0 }}>
              <div style={{ fontSize: 14, fontWeight: 600 }}>{m.nombre}</div>
              <div style={{ fontSize: 12, color: 'var(--color-text-dim)' }}>{m.email}</div>
            </div>

            {esOwner && m.usuarioId !== proyecto.propietarioId ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <select
                  className="form-select"
                  style={{ width: 'auto', padding: '5px 8px', fontSize: 12 }}
                  value={getRolTexto(m.rol)}
                  onChange={(e) => handleCambiarRol(m.usuarioId, e.target.value)}
                >
                  <option value="Owner">Owner</option>
                  <option value="Editor">Editor</option>
                  <option value="Viewer">Viewer</option>
                </select>
                <button
                  type="button"
                  className="btn btn--danger"
                  style={{ padding: '5px 10px', fontSize: 12 }}
                  onClick={() => handleRemover(m.usuarioId)}
                >
                  Quitar
                </button>
              </div>
            ) : (
              <span className={`badge badge--${getRolTexto(m.rol).toLowerCase()}`}>{getRolTexto(m.rol)}</span>
            )}
          </div>
        ))}
      </div>

      {esOwner && (
        <form onSubmit={handleInvitar}>
          <div className="form-field">
            <label className="form-label" htmlFor="email-invitar">Invitar por email</label>
            <input
              id="email-invitar"
              className="form-input"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="usuario@email.com"
              required
            />
          </div>
          <div className="form-field">
            <label className="form-label" htmlFor="rol-invitar">Rol</label>
            <select
              id="rol-invitar"
              className="form-select"
              value={rolNuevo}
              onChange={(e) => setRolNuevo(e.target.value)}
            >
              <option value="Viewer">Viewer (solo lectura)</option>
              <option value="Editor">Editor (puede modificar tareas)</option>
              <option value="Owner">Owner (control total)</option>
            </select>
          </div>
          <div className="form-actions">
            <button type="button" className="btn btn--ghost" onClick={onClose}>Cerrar</button>
            <button type="submit" className="btn btn--primary" disabled={enviando}>
              {enviando ? 'Invitando…' : 'Invitar'}
            </button>
          </div>
        </form>
      )}
    </Modal>
  );
}
