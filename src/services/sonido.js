// Sonidos de interfaz generados con Web Audio (sin archivos). Apagados por defecto: se activan
// con el interruptor del encabezado y la elección se recuerda en este navegador.
const CLAVE = 'gt_sonido';

// Cada sonido es una lista de notas: [frecuencia Hz, inicio s, duración s, onda, volumen].
// Volúmenes bajos a propósito: son pistas, no música.
const SONIDOS = {
  mover: [[320, 0, 0.07, 'triangle', 0.05]],
  hecho: [[523, 0, 0.12, 'sine', 0.07], [784, 0.09, 0.2, 'sine', 0.07]],
  paso: [[660, 0, 0.08, 'triangle', 0.05]],
  aviso: [[880, 0, 0.1, 'sine', 0.06], [1175, 0.1, 0.18, 'sine', 0.06]],
  error: [[170, 0, 0.16, 'sawtooth', 0.04]],
  activar: [[440, 0, 0.08, 'sine', 0.06], [660, 0.08, 0.12, 'sine', 0.06]],
};

let activo = false;
try { activo = localStorage.getItem(CLAVE) === '1'; } catch { /* sin almacenamiento: queda apagado */ }

const oyentes = new Set();
let contexto = null;

function obtenerContexto() {
  if (!contexto) {
    const Ctx = typeof window !== 'undefined' && (window.AudioContext || window.webkitAudioContext);
    if (!Ctx) return null;
    contexto = new Ctx();
  }
  if (contexto.state === 'suspended') contexto.resume?.();
  return contexto;
}

export function reproducir(nombre) {
  if (!activo || !SONIDOS[nombre]) return;
  try {
    const ctx = obtenerContexto();
    if (!ctx) return;
    const t0 = ctx.currentTime;
    for (const [frecuencia, inicio, duracion, onda, volumen] of SONIDOS[nombre]) {
      const osc = ctx.createOscillator();
      const ganancia = ctx.createGain();
      osc.type = onda;
      osc.frequency.value = frecuencia;
      ganancia.gain.setValueAtTime(0.0001, t0 + inicio);
      ganancia.gain.exponentialRampToValueAtTime(volumen, t0 + inicio + 0.01);
      ganancia.gain.exponentialRampToValueAtTime(0.0001, t0 + inicio + duracion);
      osc.connect(ganancia).connect(ctx.destination);
      osc.start(t0 + inicio);
      osc.stop(t0 + inicio + duracion + 0.02);
    }
  } catch { /* el audio nunca debe romper la app */ }
}

export const sonido = {
  estaActivo: () => activo,
  suscribir(fn) { oyentes.add(fn); return () => oyentes.delete(fn); },
  activar(valor) {
    activo = Boolean(valor);
    try { localStorage.setItem(CLAVE, activo ? '1' : '0'); } catch { /* se queda solo en memoria */ }
    oyentes.forEach((fn) => fn());
    if (activo) reproducir('activar'); // la confirmación también sirve para desbloquear el audio del navegador
  },
};
