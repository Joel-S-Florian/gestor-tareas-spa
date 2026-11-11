import axios from 'axios';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import api, { sesion, EVENTO_SESION_EXPIRADA } from './api';

// Servidor falso: /auth/refresh entrega el token 'nuevo'; el resto solo acepta 'Bearer nuevo'.
let llamadas;
let refreshFalla;

function respuesta(config, status, data = {}) {
  const res = { status, data, config, headers: {}, statusText: '' };
  return status < 400
    ? Promise.resolve(res)
    : Promise.reject(new axios.AxiosError('fallo', 'ERR', config, null, res));
}

function servidorFalso(config) {
  llamadas.push(`${config.method} ${config.url}`);
  if (config.url.endsWith('/auth/refresh'))
    return refreshFalla ? respuesta(config, 401) : respuesta(config, 200, { accessToken: 'nuevo' });
  if (config.url.endsWith('/auth/login')) return respuesta(config, 401);
  return config.headers.Authorization === 'Bearer nuevo' ? respuesta(config, 200, { ok: true }) : respuesta(config, 401);
}

beforeEach(() => {
  llamadas = [];
  refreshFalla = false;
  axios.defaults.adapter = servidorFalso;
  api.defaults.adapter = servidorFalso;
  sesion.setAccessToken('vencido');
});

describe('interceptor de sesión', () => {
  it('renueva el token y reintenta la petición', async () => {
    const r = await api.get('/proyectos');
    expect(r.data.ok).toBe(true);
    expect(llamadas).toEqual(['get /proyectos', 'post http://localhost:52411/api/v1/auth/refresh', 'get /proyectos']);
    expect(sesion.getAccessToken()).toBe('nuevo');
  });

  it('peticiones simultáneas con token vencido comparten un solo refresh', async () => {
    const [a, b, c] = await Promise.all([api.get('/a'), api.get('/b'), api.get('/c')]);
    expect([a.status, b.status, c.status]).toEqual([200, 200, 200]);
    expect(llamadas.filter((l) => l.includes('/auth/refresh'))).toHaveLength(1);
  });

  it('si el refresh falla limpia la sesión y avisa a la app', async () => {
    refreshFalla = true;
    const aviso = vi.fn();
    window.addEventListener(EVENTO_SESION_EXPIRADA, aviso);

    await expect(api.get('/proyectos')).rejects.toBeDefined();

    expect(sesion.getAccessToken()).toBeNull();
    expect(aviso).toHaveBeenCalledOnce();
    window.removeEventListener(EVENTO_SESION_EXPIRADA, aviso);
  });

  it('un 401 en /auth/login no intenta renovar (credenciales malas)', async () => {
    await expect(api.post('/auth/login', {})).rejects.toBeDefined();
    expect(llamadas).toEqual(['post /auth/login']);
  });

  it('no deja ningún token en localStorage', async () => {
    await api.get('/proyectos');
    expect(JSON.stringify({ ...localStorage })).not.toMatch(/nuevo|vencido/);
  });
});
