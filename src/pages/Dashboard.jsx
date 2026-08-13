import { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import ProjectCard from '../components/ProjectCard';
import ProyectoModal from '../components/ProyectoModal';
import { proyectoService } from '../services/proyectoService';
import './Dashboard.css';

export default function Dashboard() {
  const [proyectos, setProyectos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);
  const [modalAbierto, setModalAbierto] = useState(false);

  const cargarProyectos = async () => {
    setCargando(true);
    setError(null);
    try {
      const data = await proyectoService.listar();
      setProyectos(data);
    } catch {
      setError('No se pudieron cargar los proyectos.');
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    cargarProyectos();
  }, []);

  const handleCreado = (nuevo) => {
    setProyectos((prev) => [nuevo, ...prev]);
    setModalAbierto(false);
  };

  return (
    <div>
      <Navbar />
      <main className="dashboard">
        <div className="dashboard__header">
          <div>
            <h1 className="dashboard__title">Tus proyectos</h1>
            <p className="dashboard__subtitle">Proyectos donde eres propietario o miembro</p>
          </div>
          <button className="btn btn--primary" onClick={() => setModalAbierto(true)}>
            + Nuevo proyecto
          </button>
        </div>

        {cargando && <p className="dashboard__estado">Cargando proyectos…</p>}
        {error && <p className="dashboard__estado dashboard__estado--error">{error}</p>}

        {!cargando && !error && proyectos.length === 0 && (
          <div className="dashboard__vacio">
            <p>Todavía no tienes proyectos.</p>
            <button className="btn btn--primary" onClick={() => setModalAbierto(true)}>
              Crea el primero
            </button>
          </div>
        )}

        <div className="dashboard__grid">
          {proyectos.map((p) => (
            <ProjectCard key={p.id} proyecto={p} />
          ))}
        </div>
      </main>

      {modalAbierto && (
        <ProyectoModal onClose={() => setModalAbierto(false)} onGuardado={handleCreado} />
      )}
    </div>
  );
}
