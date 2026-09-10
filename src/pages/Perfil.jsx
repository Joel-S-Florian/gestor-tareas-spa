import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogOut, Pencil, Save, Loader2, Calendar, Mail, Hash, FolderKanban } from 'lucide-react';
import AppLayout from '../components/layout/AppLayout';
import { userService } from '../services/userService';
import { proyectoService } from '../services/proyectoService';
import { useAuth } from '../hooks/useAuth';
import { useApi } from '../hooks/useApi';
import { mensajeDeError } from '../utils/mensajeDeError';

export default function Perfil() {
  const { usuario, actualizarUsuario, logout } = useAuth();
  const navigate = useNavigate();
  const { datos, cargando, error } = useApi(userService.obtenerPerfil);

  const [nombre, setNombre] = useState('');
  const [email, setEmail] = useState('');
  const [guardando, setGuardando] = useState(false);
  const [guardado, setGuardado] = useState(false);
  const [errorGuardar, setErrorGuardar] = useState(null);
  const [editando, setEditando] = useState(false);
  const [numProyectos, setNumProyectos] = useState(null);

  useEffect(() => {
    if (datos) {
      setNombre(datos.nombre);
      setEmail(datos.email);
    }
  }, [datos]);

  useEffect(() => {
    document.title = 'TabTask \u00B7 Perfil';
    proyectoService.listar().then((p) => setNumProyectos(p.length)).catch(() => setNumProyectos(0));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setGuardando(true);
    setGuardado(false);
    setErrorGuardar(null);
    try {
      const actualizado = await userService.actualizarPerfil({ nombre: nombre.trim(), email: email.trim() });
      actualizarUsuario(actualizado);
      setGuardado(true);
      setEditando(false);
    } catch (err) {
      setErrorGuardar(mensajeDeError(err, 'No se pudo guardar el perfil.'));
    } finally {
      setGuardando(false);
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const fechaRegistro = datos?.fechaCreacion ? new Date(datos.fechaCreacion).toLocaleDateString('es-DO', { day: 'numeric', month: 'long', year: 'numeric' }) : null;

  return (
    <AppLayout>
      <div style={{ maxWidth: 520, margin: '0 auto' }}>
        <div style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)', borderRadius: 12, padding: 32, boxShadow: 'var(--shadow-card)', textAlign: 'center' }}>
          <div style={{ width: 72, height: 72, margin: '0 auto 16px', borderRadius: '50%', background: 'var(--accent-dim)', border: '1px solid var(--accent)', color: 'var(--accent)', display: 'grid', placeItems: 'center', fontSize: 22, fontWeight: 700 }}>
            {iniciales(usuario?.nombre)}
          </div>
          <h1 style={{ fontSize: 20, fontWeight: 600, margin: '0 0 4px', color: 'var(--text-primary)' }}>Mi perfil</h1>
          <p style={{ fontSize: 13, color: 'var(--text-secondary)', margin: '0 0 20px', display: 'inline-flex', alignItems: 'center', gap: 6 }}><Mail size={14} />{usuario?.email}</p>

          {cargando && <p style={{ display: 'inline-flex', alignItems: 'center', gap: 8, color: 'var(--text-secondary)', fontSize: 14 }}><Loader2 size={16} /> Cargando perfil...</p>}
          {error && <div style={{ background: '#EF44441A', border: '1px solid var(--danger)', color: 'var(--danger)', padding: '10px 12px', borderRadius: 8, fontSize: 13 }}>{error}</div>}

          {!cargando && !error && datos && (
            <>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, textAlign: 'left', marginBottom: 20 }}>
                <InfoItem icon={Hash} label="Usuario ID" value={String(datos.id)} mono />
                <InfoItem icon={FolderKanban} label="Proyectos" value={numProyectos !== null ? String(numProyectos) : '...'} />
                {fechaRegistro && <InfoItem icon={Calendar} label="Miembro desde" value={fechaRegistro} />}
                <InfoItem icon={Mail} label="Email" value={datos.email} />
              </div>

              {!editando ? (
                <div style={{ display: 'flex', gap: 10, justifyContent: 'center' }}>
                  <button onClick={() => setEditando(true)} style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '8px 14px', borderRadius: 8, background: 'var(--accent)', color: '#fff', border: 'none', cursor: 'pointer', fontSize: 14, fontWeight: 500 }}>
                    <Pencil size={14} /> Editar perfil
                  </button>
                  <button onClick={handleLogout} style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '8px 14px', borderRadius: 8, background: 'var(--bg-tertiary)', color: 'var(--text-primary)', border: '1px solid var(--border)', cursor: 'pointer', fontSize: 14 }}>
                    <LogOut size={14} /> Cerrar sesion
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} style={{ textAlign: 'left', marginTop: 8 }}>
                  {errorGuardar && <div style={{ background: '#EF44441A', border: '1px solid var(--danger)', color: 'var(--danger)', padding: '10px 12px', borderRadius: 8, fontSize: 13, marginBottom: 12 }}>{errorGuardar}</div>}
                  {guardado && <div style={{ background: '#10B9811A', border: '1px solid var(--success)', color: 'var(--success)', padding: '10px 12px', borderRadius: 8, fontSize: 13, marginBottom: 12 }}>Cambios guardados.</div>}

                  <div style={{ marginBottom: 12 }}>
                    <label htmlFor="nombre" style={{ display: 'block', fontSize: 13, fontWeight: 500, color: 'var(--text-secondary)', marginBottom: 6 }}>Nombre</label>
                    <input id="nombre" value={nombre} onChange={(e) => setNombre(e.target.value)} required maxLength={150}
                      style={{ width: '100%', padding: '8px 12px', borderRadius: 8, border: '1px solid var(--border)', background: 'var(--bg-primary)', color: 'var(--text-primary)', fontSize: 14 }} />
                  </div>
                  <div style={{ marginBottom: 16 }}>
                    <label htmlFor="email" style={{ display: 'block', fontSize: 13, fontWeight: 500, color: 'var(--text-secondary)', marginBottom: 6 }}>Email</label>
                    <input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required maxLength={200}
                      style={{ width: '100%', padding: '8px 12px', borderRadius: 8, border: '1px solid var(--border)', background: 'var(--bg-primary)', color: 'var(--text-primary)', fontSize: 14 }} />
                  </div>
                  <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
                    <button type="button" onClick={() => setEditando(false)} style={{ padding: '8px 14px', borderRadius: 8, background: 'var(--bg-tertiary)', border: '1px solid var(--border)', color: 'var(--text-primary)', cursor: 'pointer', fontSize: 14 }}>Cancelar</button>
                    <button type="submit" disabled={guardando} style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '8px 14px', borderRadius: 8, background: 'var(--accent)', color: '#fff', border: 'none', cursor: 'pointer', fontSize: 14, opacity: guardando ? 0.7 : 1 }}>
                      {guardando ? <Loader2 size={14} /> : <Save size={14} />} {guardando ? 'Guardando...' : 'Guardar'}
                    </button>
                  </div>
                </form>
              )}
              {!editando && guardado && <div style={{ marginTop: 12, fontSize: 13, color: 'var(--success)' }}>Cambios guardados.</div>}
            </>
          )}
        </div>
      </div>
    </AppLayout>
  );
}

function InfoItem({ icon: Icon, label, value, mono }) {
  return (
    <div style={{ background: 'var(--bg-tertiary)', border: '1px solid var(--border)', borderRadius: 8, padding: '10px 12px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11, color: 'var(--text-muted)', marginBottom: 4 }}>
        <Icon size={12} /> {label}
      </div>
      <div style={{ fontSize: 13, fontWeight: 500, color: 'var(--text-primary)', fontFamily: mono ? 'var(--font-mono)' : undefined, wordBreak: 'break-all' }}>{value}</div>
    </div>
  );
}

function iniciales(nombre) {
  if (!nombre) return '?';
  return nombre.trim().split(/\s+/).slice(0, 2).map((p) => p.charAt(0).toUpperCase()).join('');
}
