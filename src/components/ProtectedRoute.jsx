import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

// Guarda las rutas privadas: sin sesión válida redirige al login.
// Mientras se restaura la sesión (cookie) no se decide nada, para no mandar al login por error.
export default function ProtectedRoute() {
  const { estaAutenticado, iniciando } = useAuth();

  if (iniciando) return <p role="status" style={{ padding: 24 }}>Cargando…</p>;
  if (!estaAutenticado) return <Navigate to="/login" replace />;

  return <Outlet />;
}
