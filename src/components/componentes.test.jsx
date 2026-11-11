import { render, screen, cleanup } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { describe, it, expect, afterEach } from 'vitest';

afterEach(cleanup);
import { AuthContext } from '../context/AuthContext';
import ProtectedRoute from './ProtectedRoute';
import KanbanColumn from './KanbanColumn';

function conSesion(valor) {
  return render(
    <AuthContext.Provider value={valor}>
      <MemoryRouter initialEntries={['/privada']}>
        <Routes>
          <Route path="/login" element={<p>pantalla login</p>} />
          <Route element={<ProtectedRoute />}>
            <Route path="/privada" element={<p>contenido privado</p>} />
          </Route>
        </Routes>
      </MemoryRouter>
    </AuthContext.Provider>
  );
}

describe('ProtectedRoute', () => {
  it('sin sesión manda al login', () => {
    conSesion({ estaAutenticado: false, iniciando: false });
    expect(screen.getByText('pantalla login')).toBeTruthy();
  });

  it('mientras restaura la sesión no redirige', () => {
    conSesion({ estaAutenticado: false, iniciando: true });
    expect(screen.getByRole('status')).toBeTruthy();
    expect(screen.queryByText('pantalla login')).toBeNull();
  });

  it('con sesión muestra el contenido', () => {
    conSesion({ estaAutenticado: true, iniciando: false });
    expect(screen.getByText('contenido privado')).toBeTruthy();
  });
});

describe('permisos en el tablero', () => {
  const tareas = [{ id: 1, titulo: 'Tarea uno', prioridad: 'Alta', estado: 'ToDo', totalComentarios: 0, totalAdjuntos: 0 }];
  const columna = (puedeEditar) =>
    render(<KanbanColumn titulo="Por hacer" estado="ToDo" tareas={tareas} colorDot="#000" puedeEditar={puedeEditar} onTaskClick={() => {}} onDrop={() => {}} />);

  it('el Viewer no ve el botón de agregar y las tareas no se arrastran', () => {
    const { container } = columna(false);
    expect(screen.queryByLabelText('Agregar tarea')).toBeNull();
    expect(container.querySelector('[draggable="true"]')).toBeNull();
  });

  it('Editor y Owner sí pueden agregar y arrastrar', () => {
    const { container } = columna(true);
    expect(screen.getByLabelText('Agregar tarea')).toBeTruthy();
    expect(container.querySelector('[draggable="true"]')).not.toBeNull();
  });
});
