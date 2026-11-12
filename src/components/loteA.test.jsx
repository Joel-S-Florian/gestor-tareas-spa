import { render, screen, cleanup, fireEvent } from '@testing-library/react';
import { describe, it, expect, afterEach, vi } from 'vitest';

vi.mock('../services/extrasService', () => ({
  extrasService: {
    actualizarItem: vi.fn().mockResolvedValue({}),
    agregarItem: vi.fn().mockResolvedValue({ id: 9, texto: 'nuevo', hecho: false }),
    eliminarItem: vi.fn().mockResolvedValue()
  }
}));

import ChecklistSection from './ChecklistSection';
import ComentarioInput, { mencionEnCurso } from './ComentarioInput';
import { extrasService } from '../services/extrasService';

afterEach(cleanup);

describe('menciones', () => {
  it('detecta la mención que se está escribiendo junto al cursor', () => {
    expect(mencionEnCurso('hola @an', 8)).toBe('an');
    expect(mencionEnCurso('hola @', 6)).toBe('');
    expect(mencionEnCurso('hola @ana ya', 12)).toBeNull();      // la mención ya terminó
    expect(mencionEnCurso('escribe a juan@ana', 18)).toBeNull();  // un email no es una mención
  });

  it('sugiere miembros y al elegir uno inserta su @handle', () => {
    const miembros = [{ usuarioId: 1, nombre: 'Ana Torres', email: 'ana@demo.com' }, { usuarioId: 2, nombre: 'Luis Vega', email: 'luis@demo.com' }];
    let valor = '';
    const { rerender } = render(<ComentarioInput value="" onChange={(v) => { valor = v; }} miembros={miembros} />);
    const input = screen.getByRole('textbox');
    fireEvent.change(input, { target: { value: 'hola @a' } });   // el padre recibe el texto nuevo...
    rerender(<ComentarioInput value={valor} onChange={(v) => { valor = v; }} miembros={miembros} />);
    input.setSelectionRange(7, 7);
    fireEvent.keyUp(input);                                       // ...y el cursor queda tras la "a"

    const opcion = screen.getByText(/Ana Torres/);
    fireEvent.mouseDown(opcion);
    expect(valor).toBe('hola @ana ');
    expect(screen.queryByText(/Luis Vega/)).toBeNull();
  });
});

describe('lista de pasos', () => {
  const items = [{ id: 1, texto: 'uno', hecho: true }, { id: 2, texto: 'dos', hecho: false }];

  it('muestra el progreso y marca un paso como hecho', () => {
    let actual = items;
    render(<ChecklistSection tareaId={5} items={items} onCambio={(n) => { actual = n; }} puedeEditar onError={() => {}} />);
    expect(screen.getByText(/Lista de pasos \(1\/2\)/)).toBeTruthy();
    expect(screen.getByRole('progressbar').getAttribute('aria-valuenow')).toBe('50');

    fireEvent.click(screen.getAllByRole('checkbox')[1]);
    expect(actual.find((i) => i.id === 2).hecho).toBe(true);
    expect(extrasService.actualizarItem).toHaveBeenCalledWith(2, { hecho: true });
  });

  it('el Viewer ve la lista pero no puede modificarla', () => {
    render(<ChecklistSection tareaId={5} items={items} onCambio={() => {}} puedeEditar={false} onError={() => {}} />);
    expect(screen.getAllByRole('checkbox').every((c) => c.disabled)).toBe(true);
    expect(screen.queryByPlaceholderText(/Agregar un paso/)).toBeNull();
  });
});
