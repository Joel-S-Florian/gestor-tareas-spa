import { useEffect, useState, useMemo } from 'react';
import { Plus, FolderKanban, Clock, CheckCircle2, AlertTriangle, Loader2 } from 'lucide-react';
import AppLayout from '../components/layout/AppLayout';
import ProjectCard from '../components/ProjectCard';
import ProyectoModal from '../components/ProyectoModal';
import { proyectoService } from '../services/proyectoService';
import { tareaService } from '../services/tareaService';
import { useAuth } from '../hooks/useAuth';
import './Dashboard.css';

export default function Dashboard() {
  const { usuario } = useAuth();
  const [proyectos, setProyectos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);
  const [modalAbierto, setModalAbierto] = useState(false);
  const [stats, setStats] = useState({ activas: 0, completadas: 0, vencidas: 0 });

  const cargarProyectos = async () => {
    setCargando(true);
    setError(null);
    try {
      const data = await proyectoService.listar();
      setProyectos(data);
      // compute task stats across projects (best effort)
      try {
        const all = await Promise.all(data.map((p) => tareaService.listarPorProyecto(p.id, { page: 1, pageSize: 100 }).catch(() => ({ items: [] }))));
        const items = all.flatMap((r) => r.items || []);
        const activas = items.filter((t) => t.estado !== 'Done').length;
        const completadas = items.filter((t) => t.estado === 'Done').length;
        const vencidas = items.filter((t) => t.fechaVencimiento && new Date(t.fechaVencimiento) < new Date() && t.estado !== 'Done').length;
        setStats({ activas, completadas, vencidas });
      } catch { /* ignore stats */ }
    } catch {
      setError('No se pudieron cargar los proyectos.');
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => { cargarProyectos(); }, []);

  const handleCreado = (nuevo) => {
    setProyectos((prev) => [nuevo, ...prev]);
    setModalAbierto(false);
  };

  const greeting = useMemo(() => {
    const nombre = usuario?.nombre?.split(' ')[0] || 'usuario';
    return `Hola, ${nombre}`;
  }, [usuario]);

  const fechaActual = useMemo(() => {
    return new Date().toLocaleDateString('es-DO', { weekday: 'long', day: 'numeric', month: 'long' });
  }, []);

  const totalTareas = stats.activas + stats.completadas;
  const distribution = totalTareas > 0 ? [
    { label: 'Activas', value: stats.activas, color: 'var(--info)', pct: (stats.activas / totalTareas) * 100 },
    { label: 'Completadas', value: stats.completadas, color: 'var(--success)', pct: (stats.completadas / totalTareas) * 100 },
    { label: 'Vencidas', value: stats.vencidas, color: 'var(--danger)', pct: totalTareas ? (stats.vencidas / totalTareas) * 100 : 0 },
  ] : [];

  // dynamic document title
  useEffect(() => { document.title = 'TabTask \u00B7 Dashboard'; }, []);

  return (
    <AppLayout>
      <div style={{ marginBottom: 20 }}>
        <h1 style={{ fontSize: 22, fontWeight: 600, margin: 0, color: 'var(--text-primary)' }}>{greeting}</h1>
        <p style={{ fontSize: 13, color: 'var(--text-secondary)', margin: '4px 0 0', textTransform: 'capitalize' }}>{fechaActual}</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 12, marginBottom: 20 }}>
        <StatCard icon={FolderKanban} label="Proyectos" value={proyectos.length} />
        <StatCard icon={Clock} label="Activas" value={stats.activas} />
        <StatCard icon={CheckCircle2} label="Completadas" value={stats.completadas} />
        <StatCard icon={AlertTriangle} label="Vencidas" value={stats.vencidas} tone="danger" />
      </div>

      {totalTareas > 0 && (
        <div style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)', borderRadius: 12, padding: 16, marginBottom: 20 }}>
          <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 10, color: 'var(--text-primary)' }}>Distribucion de tareas</div>
          <div style={{ display: 'flex', height: 8, borderRadius: 999, overflow: 'hidden', background: 'var(--bg-tertiary)' }}>
            {distribution.map((d) => (
              <div key={d.label} style={{ width: `${d.pct}%`, background: d.color, transition: 'width 0.3s' }} title={`${d.label}: ${d.value}`} />
            ))}
          </div>
          <div style={{ display: 'flex', gap: 16, marginTop: 8, fontSize: 12, color: 'var(--text-secondary)' }}>
            {distribution.map((d) => (
              <span key={d.label} style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                <span style={{ width: 8, height: 8, borderRadius: 999, background: d.color }} />{d.label}: {d.value}
              </span>
            ))}
          </div>
        </div>
      )}

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
        <div>
          <h2 style={{ fontSize: 18, fontWeight: 600, margin: 0, color: 'var(--text-primary)' }}>Tus proyectos</h2>
          <p style={{ fontSize: 13, color: 'var(--text-secondary)', margin: '2px 0 0' }}>Proyectos donde eres propietario o miembro</p>
        </div>
        <button
          onClick={() => setModalAbierto(true)}
          style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '8px 14px', borderRadius: 8, background: 'var(--accent)', color: '#fff', border: '1px solid var(--accent)', fontSize: 14, fontWeight: 500, cursor: 'pointer' }}
        >
          <Plus size={16} /> Nuevo proyecto
        </button>
      </div>

      {cargando && <p style={{ display: 'inline-flex', alignItems: 'center', gap: 8, color: 'var(--text-secondary)', fontSize: 14 }}><Loader2 size={16} className="spin" /> Cargando proyectos...</p>}
      {error && <p style={{ color: 'var(--danger)', fontSize: 14 }}>{error}</p>}

      {!cargando && !error && proyectos.length === 0 && (
        <div style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)', borderRadius: 12, padding: 32, textAlign: 'center' }}>
          <FolderKanban size={32} style={{ color: 'var(--text-muted)', marginBottom: 8 }} />
          <p style={{ color: 'var(--text-secondary)', fontSize: 14 }}>Todavia no tienes proyectos.</p>
          <button onClick={() => setModalAbierto(true)} style={{ marginTop: 12, padding: '8px 14px', borderRadius: 8, background: 'var(--accent)', color: '#fff', border: 'none', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 6 }}>
            <Plus size={16} /> Crea el primero
          </button>
        </div>
      )}

      <div className="dashboard__grid">
        {proyectos.map((p) => (
          <ProjectCard key={p.id} proyecto={p} />
        ))}
      </div>

      {modalAbierto && (
        <ProyectoModal onClose={() => setModalAbierto(false)} onGuardado={handleCreado} />
      )}
    </AppLayout>
  );
}

function StatCard({ icon: Icon, label, value, tone }) {
  return (
    <div style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)', borderRadius: 12, padding: 16, display: 'flex', alignItems: 'center', gap: 12 }}>
      <div style={{ width: 36, height: 36, borderRadius: 8, display: 'grid', placeItems: 'center', background: tone === 'danger' ? '#EF44441A' : 'var(--bg-tertiary)', color: tone === 'danger' ? 'var(--danger)' : 'var(--text-secondary)' }}>
        <Icon size={18} />
      </div>
      <div>
        <div style={{ fontSize: 20, fontWeight: 700, color: 'var(--text-primary)', lineHeight: 1 }}>{value}</div>
        <div style={{ fontSize: 12, color: 'var(--text-secondary)' }}>{label}</div>
      </div>
    </div>
  );
}
