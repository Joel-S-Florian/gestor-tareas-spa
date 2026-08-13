# Gestor de Tareas — SPA (frontend)

Cliente web (SPA React) de la aplicación **Gestor de Proyectos y Tareas** (Capstone). Consume la API REST del
backend (`gestor-tareas-api`) con autenticación JWT + refresh tokens automático.

## Estado actual

- ✅ **Hito 3** — Login, registro, dashboard de proyectos y tablero Kanban con drag & drop.
- ✅ **Hito 4** — Detalle de tarea con comentarios y adjuntos, gestión de miembros (invitar/remover/cambiar rol),
  pantalla de perfil (editar nombre/email) y editar/eliminar proyecto.
- ✅ Página 404, ErrorBoundary global, manejo de carga/errores en todas las llamadas.
- ⬜ **Hito 5** — Despliegue en Vercel/Netlify (pendiente; requiere URL de API en producción).

## Tecnologías

- React 18 (funcional + Hooks) con Vite
- React Router v6 (rutas protegidas)
- Axios con interceptores (inyecta JWT y refresca el access token automáticamente)
- Context API para autenticación (`AuthContext`) + custom hooks (`useAuth`, `useApi`)
- CSS con variables de diseño (`styles/tokens.css`) — tema oscuro, responsivo
- Validación de archivos en cliente: máx. 5 MB, tipos imagen/PDF

## Pantallas

| Ruta | Pantalla |
|---|---|
| `/login` | Inicio de sesión (con botón "Autocompletar demo") |
| `/register` | Registro de cuenta |
| `/` | Dashboard: proyectos del usuario (propios y compartidos) + crear proyecto |
| `/proyectos/:id` | Tablero Kanban (3 columnas) + filtros + editar/eliminar proyecto + gestión de miembros |
| `/perfil` | Perfil del usuario (editar nombre/email) |
| * | 404 |

## Funcionalidades

- Sesión persistente en `localStorage` (sobrevive recargas).
- **Renovación automática** del access token vía interceptor (con cola para no duplicar refreshes) y redirección a `/login` si expira.
- Rutas protegidas con `ProtectedRoute`.
- Tablero Kanban: 3 columnas (Por hacer / En progreso / Hecho) con **drag & drop** y filtros por prioridad y asignado.
- CRUD de tareas (crear, editar, eliminar, cambiar estado) respetando roles (Viewer solo lectura).
- Comentarios y adjuntos en el detalle de tarea (subir/descargar/eliminar).
- Gestión de miembros: invitar por email, cambiar rol, remover (solo Owner).
- Confirmación en acciones críticas (eliminar tarea, proyecto, adjunto, remover miembro).
- Indicadores de carga y mensajes de error en lenguaje natural (nunca se muestra un stack trace).

## Cómo ejecutarlo localmente

1. Requiere Node.js 20+ y el backend corriendo (ver README del backend).
2. Abrir una terminal en `Frontend/gestor-tareas-spa`:
   ```
   npm install
   npm run dev
   ```
3. Abrir `http://localhost:5173` e iniciar sesión con un usuario semilla:
   - `joel@demo.com` / `Demo1234!`
   - `ana@demo.com` / `Demo1234!`

### Variables de entorno

| Archivo | Variable | Uso |
|---|---|---|
| `.env.development` | `VITE_API_URL` | URL local de la API (default `https://localhost:52411/api/v1`) |
| `.env.production` | `VITE_API_URL` | URL de la API desplegada (se configura como variable de entorno en el proveedor) |

> **Nota HTTPS local:** la API corre con un certificado de desarrollo de .NET. Si el navegador bloquea las llamadas,
> ejecuta `dotnet dev-certs https --trust` (una vez) o abre `https://localhost:52411/health` y acepta la advertencia.

## Estructura

```
src/
  components/   Navbar, ProjectCard, ProyectoModal, TaskCard, KanbanColumn, TaskModal, MembersModal, Modal, ProtectedRoute, ErrorBoundary
  pages/        Login, Register, Dashboard, ProjectBoard, Perfil, NotFound
  context/      AuthContext (autenticación global)
  hooks/        useAuth, useApi
  services/     api.js (Axios + interceptores), auth, proyecto, tarea, comentario, adjunto, user
  utils/        mensajeDeError (mensajes amigables de errores HTTP)
  styles/       tokens.css (variables de diseño)
```