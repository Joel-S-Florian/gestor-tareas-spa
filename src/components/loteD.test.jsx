import { render, screen, cleanup, fireEvent, act } from '@testing-library/react';
import { describe, it, expect, afterEach, beforeEach, vi } from 'vitest';
import { sonido, reproducir } from '../services/sonido';
import { ToastProvider, useToast } from '../context/ToastContext';
import Modal from './Modal';

afterEach(() => { cleanup(); vi.useRealTimers(); sonido.activar(false); });

describe('sonidos', () => {
  let osciladores;

  beforeEach(() => {
    osciladores = 0;
    // AudioContext mínimo para contar las notas que se tocan.
    window.AudioContext = class {
      constructor() { this.currentTime = 0; this.destination = {}; this.state = 'running'; }
      createOscillator() { osciladores += 1; return { frequency: {}, connect: (n) => n, start() {}, stop() {} }; }
      createGain() { return { gain: { setValueAtTime() {}, exponentialRampToValueAtTime() {} }, connect: (n) => n }; }
    };
  });

  it('empiezan apagados: no suena nada hasta activarlos', () => {
    sonido.activar(false);
    osciladores = 0;
    reproducir('hecho');
    expect(osciladores).toBe(0);
  });

  it('al activarlos suenan (la confirmación y luego cada sonido) y la elección se recuerda', () => {
    sonido.activar(true);
    expect(localStorage.getItem('gt_sonido')).toBe('1');
    osciladores = 0;
    reproducir('hecho'); // dos notas
    expect(osciladores).toBe(2);
    sonido.activar(false);
    expect(localStorage.getItem('gt_sonido')).toBe('0');
  });

  it('un sonido desconocido o un audio que falla nunca rompen la app', () => {
    sonido.activar(true);
    expect(() => reproducir('no-existe')).not.toThrow();
    window.AudioContext = class { constructor() { throw new Error('sin audio'); } };
    expect(() => reproducir('mover')).not.toThrow();
  });

  it('avisa a quien esté suscrito cuando cambia el interruptor', () => {
    const oyente = vi.fn();
    const baja = sonido.suscribir(oyente);
    sonido.activar(true);
    expect(oyente).toHaveBeenCalled();
    baja();
  });
});

describe('avisos flotantes', () => {
  function Disparador() {
    const toast = useToast();
    return <button onClick={() => toast.exito('Tarea guardada')}>guardar</button>;
  }

  it('aparece, se anuncia a los lectores de pantalla y desaparece solo', () => {
    vi.useFakeTimers();
    render(<ToastProvider><Disparador /></ToastProvider>);
    fireEvent.click(screen.getByText('guardar'));
    expect(screen.getByRole('status').textContent).toContain('Tarea guardada');

    act(() => { vi.advanceTimersByTime(3500); });
    expect(screen.queryByText('Tarea guardada')).toBeNull();
  });
});

describe('ventanas', () => {
  it('Escape las cierra después de animar la salida', () => {
    vi.useFakeTimers();
    const alCerrar = vi.fn();
    render(<Modal titulo="Prueba" onClose={alCerrar}><p>contenido</p></Modal>);
    expect(screen.getByRole('dialog', { name: 'Prueba' })).toBeTruthy();

    fireEvent.keyDown(document, { key: 'Escape' });
    expect(alCerrar).not.toHaveBeenCalled();             // todavía animando
    expect(document.querySelector('.modal-overlay--saliendo')).not.toBeNull();
    act(() => { vi.advanceTimersByTime(200); });
    expect(alCerrar).toHaveBeenCalledOnce();
  });
});
