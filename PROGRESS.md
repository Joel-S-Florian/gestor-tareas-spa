# Progreso — SPA (frontend) — Gestor de Proyectos y Tareas (Capstone)

> El progreso del backend y del frontend se complementan; marca compartida con PROGRESS.md del backend.

## ✅ Hito 3 — SPA con login, dashboard y tablero Kanban (Semana 13–14)
- [x] Scaffolding Vite + React Router + Axios
- [x] AuthContext + interceptor de refresh automático (con cola para no duplicar refresh en paralelo)
- [x] Pantallas: Login, Registro, Dashboard, Tablero Kanban, Detalle/creación de tarea, 404
- [x] Drag & drop entre columnas (con fallback de select de estado en el modal)
- [x] Filtros por prioridad y asignado
- [x] Rutas protegidas
- [x] Permisos en UI: Viewer no ve botones de edición

## ✅ Hito 4 — Comentarios, adjuntos, miembros, perfil (Semana 14)
- [x] UI de comentarios y adjuntos en el detalle de tarea (subir con validación 5 MB / MIME, descargar, eliminar)
- [x] UI de gestión de miembros (invitar/remover/cambiar rol, solo Owner)
- [x] Pantalla de Perfil completa (GET/PUT `/auth/perfil`, editar nombre/email, actualiza AuthContext)
- [x] Editar y eliminar proyecto desde el tablero (Owner/Editor), con confirmación
- [x] Custom hook `useApi` + helper `mensajeDeError`
- [x] Robustez: try/catch en cargas de ProjectBoard, limpieza de usuario en refresh fallido
- [x] Integración con backend: enums como strings (JsonStringEnumConverter)
- [x] Limpieza: `.gitignore`, eliminado `src/package.json` huérfano
- [x] Verificado: `npm run build` OK + contrato API probado end-to-end (login, proyectos, tareas, PATCH estado, comentarios, adjuntos, perfil)
- [x] Validación de tipo MIME (imágenes/PDF) también en el cliente, además del límite de 5 MB

## ⬜ Hito 5 — Despliegue (Semana 14–15)
- [ ] Publicar el SPA en Vercel / Netlify / Azure Static Web Apps
- [ ] Configurar `VITE_API_URL` de producción como variable de entorno del proveedor
- [ ] CORS en el backend apuntando al dominio real del SPA
- [ ] Pruebas end-to-end en producción

---
**Cómo retomar:** dime "sigamos con el despliegue del SPA" y publicamos el frontend.