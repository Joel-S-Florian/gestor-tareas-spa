# Gestor de Tareas — SPA

Cliente web (React) del gestor de proyectos y tareas: tablero Kanban con arrastrar y soltar, roles por proyecto, comentarios, adjuntos y avisos de asignación. Consume la API de [gestor-tareas-api](https://github.com/Joel-S-Florian/gestor-tareas-api), donde están el backend, los usuarios de demostración y las decisiones de arquitectura.

**No está desplegada**: se ejecuta en local.

## Tecnologías

React 18 · Vite 5 · React Router 6 · Axios · Vitest + Testing Library.

## Ejecutarlo en local

Requiere Node.js 24 (con el que se probó; en Node 20 antiguo falla jsdom) y la API corriendo en `https://localhost:52411` (ver el README de la API).

```bash
npm install
npm run dev      # http://localhost:5173
npm test         # 11 pruebas
npm run build
```

Vite redirige `/api` a la API (`vite.config.js`), así el SPA y la API comparten origen y la cookie HttpOnly de la sesión viaja sin CORS. El archivo `.env.development` define:

| Variable | Valor | Uso |
|---|---|---|
| `VITE_API_URL` | `/api/v1` | Base de las llamadas (relativa, pasa por el proxy) |
| `VITE_DEMO` | `true` | Muestra en el login un **acceso rápido con 4 cuentas de distinto rol** y, dentro de la app, un selector "Cambiar de cuenta" (código en `src/dev`). Sin esta variable ese código no entra en la compilación (comprobado: las contraseñas demo no aparecen en `dist`). |

## Pantallas

| Ruta | Pantalla |
|---|---|
| `/login`, `/register` | Inicio de sesión y registro |
| `/` | Dashboard: mis proyectos (propios y compartidos), resumen y distribución de tareas |
| `/proyectos/:id` | Tablero Kanban, filtros, búsqueda, "solo vencidas", miembros y edición del proyecto |
| `/perfil` | Editar nombre y email |

## Cómo funciona la sesión

- El **access token** vive solo en memoria. El **refresh token** está en una cookie HttpOnly que el JavaScript no puede leer ([ADR 002 de la API](https://github.com/Joel-S-Florian/gestor-tareas-api/blob/main/docs/decisiones/002-sesion-con-cookie-httponly.md)).
- Al abrir o recargar la página, `AuthProvider` recupera la sesión pidiendo un access token con la cookie. Mientras lo hace, las rutas privadas muestran "Cargando…" en vez de mandar al login.
- Un interceptor de Axios renueva el token ante un 401 y reintenta la petición. Las peticiones simultáneas comparten **un solo** refresh, porque el refresh token rota en cada uso.
- Si no se puede renovar, se limpia la sesión y se avisa a la app para volver al login.
- Versiones anteriores guardaban los tokens en `localStorage`; al arrancar se borran.

## Tablero

- Arrastrar una tarjeta la mueve de columna y, dentro de la columna, a la posición donde se suelta (`PATCH /tareas/{id}/mover`). El cambio se ve al instante y se revierte si la API lo rechaza.
- Con filtros o búsqueda activos, la tarjeta se mueve al final de la columna de destino, porque la posición visible no equivale a la real.
- El Viewer no ve el botón de agregar ni puede arrastrar; el modal de tarea queda en solo lectura.
- La campana del encabezado muestra los avisos de asignación y se actualiza cada minuto.

## Pruebas

`npm test` ejecuta 11 pruebas con Vitest:

- Interceptor de sesión: renueva y reintenta, un solo refresh con peticiones simultáneas, sesión limpia si falla, no reintenta en `/auth/login`, nada en `localStorage`.
- `ProtectedRoute`: redirige sin sesión, espera mientras se restaura, muestra el contenido con sesión.
- Permisos del tablero (Viewer frente a Editor/Owner) y cálculo de la posición al soltar una tarjeta.

La integración continua (`.github/workflows/ci.yml`) ejecuta las pruebas y la compilación.

## Estructura

```
src/
  components/   Kanban, tarjetas, modales, ProtectedRoute, ErrorBoundary, layout (barra lateral, encabezado, avisos)
  pages/        Login, Register, Dashboard, ProjectBoard, Perfil, NotFound
  context/      AuthContext (sesión), ThemeContext (claro/oscuro)
  services/     api.js (Axios, interceptor, sesión en memoria) y un servicio por recurso
  styles/       tokens.css (variables de diseño), responsive.css (reglas móviles)
```

## Límites conocidos

- Muchos estilos están en línea (`style={{…}}`) en vez de en hojas de estilo; las reglas móviles los anulan con `!important`.
- Sin prueba de extremo a extremo con navegador; el flujo completo se comprobó a mano.
- El diseño móvil se comprobó solo midiendo que no hay desbordamiento horizontal a 375 px, no con una revisión visual completa; el modo oscuro tampoco se revisó a fondo.
- La posición al soltar se calcula con el puntero; en pantallas táctiles el arrastre nativo de HTML5 no funciona, y queda el selector de estado del modal.
