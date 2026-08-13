import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

// Guarda las rutas privadas: sin sesión válida redirige al login.
// El layout se renderiza via <Outlet /> (rutas anidadas en App.jsx).
export default function ProtectedRoute() {
  const { estaAutenticado } = useAuth();

  if (!estaAutenticado) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}
