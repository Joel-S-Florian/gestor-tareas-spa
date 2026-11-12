// Cuentas sembradas por la API en Development (ver README de la API).
// Solo se importa cuando VITE_DEMO=true; no entra en una compilación normal.
export const CUENTAS_DEMO = [
  { nombre: 'Diego Morales', email: 'demo@demo.com', password: 'demo123', roles: 'Owner en Rediseño · Editor en App Móvil · Viewer en Marketing' },
  { nombre: 'Ana Torres', email: 'ana@demo.com', password: 'ana123', roles: 'Editor en Rediseño · Owner en App Móvil · sin acceso a Marketing' },
  { nombre: 'Luis Vega', email: 'luis@demo.com', password: 'luis123', roles: 'Viewer en Rediseño · Owner en Marketing · sin acceso a App Móvil' },
  { nombre: 'Joel Ramírez', email: 'joel@demo.com', password: 'joel123', roles: 'Editor en Rediseño y App Móvil · Viewer en Marketing' },
];
