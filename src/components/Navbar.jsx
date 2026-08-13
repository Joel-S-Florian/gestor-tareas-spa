import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import './Navbar.css';

export default function Navbar() {
  const { usuario, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <header className="navbar">
      <Link to="/" className="navbar__brand">
        <span className="navbar__brand-mark">GT</span>
        Gestor de Tareas
      </Link>
      {usuario && (
        <div className="navbar__user">
          <Link to="/perfil" className="navbar__link">Mi Perfil</Link>
          <span className="navbar__user-name">{usuario.nombre}</span>
          <button className="navbar__logout" onClick={handleLogout}>
            Cerrar sesión
          </button>
        </div>
      )}
    </header>
  );
}
