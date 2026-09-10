import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import ProtectedRoute from './components/ProtectedRoute';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import ProjectBoard from './pages/ProjectBoard';
import Perfil from './pages/Perfil';
import NotFound from './pages/NotFound';

export default function App() {
  return (
    <BrowserRouter>
      <ThemeProvider>
        <AuthProvider>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          <Route element={<ProtectedRoute />}>
            <Route path="/" element={<Dashboard />} />
            <Route path="/proyectos/:id" element={<ProjectBoard />} />
            <Route path="/perfil" element={<Perfil />} />
          </Route>

          <Route path="*" element={<NotFound />} />
        </Routes>
        </AuthProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
}
