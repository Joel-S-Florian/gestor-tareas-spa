import { useAuth } from '../hooks/useAuth';
import { CUENTAS_DEMO } from './cuentasDemo';

// Selector del menú lateral para saltar de una cuenta de demostración a otra sin pasar por el login.
export default function CambiarCuenta() {
  const { usuario, login, cargando } = useAuth();

  const cambiar = async (e) => {
    const cuenta = CUENTAS_DEMO.find((c) => c.email === e.target.value);
    if (!cuenta) return;
    await login(cuenta.email, cuenta.password);
    // Recarga completa: así ninguna pantalla conserva los datos de la cuenta anterior.
    window.location.assign('/');
  };

  return (
    <label style={{ display: 'block', fontSize: 11, color: 'var(--text-muted)' }}>
      Cambiar de cuenta (desarrollo)
      <select
        value={usuario?.email ?? ''}
        onChange={cambiar}
        disabled={cargando}
        aria-label="Cambiar de cuenta"
        style={{ width: '100%', marginTop: 4, padding: '6px 8px', borderRadius: 8, border: '1px solid var(--border)', background: 'var(--bg-primary)', color: 'var(--text-primary)', fontSize: 12 }}
      >
        {!CUENTAS_DEMO.some((c) => c.email === usuario?.email) && <option value="">{usuario?.email}</option>}
        {CUENTAS_DEMO.map((c) => <option key={c.email} value={c.email}>{c.nombre}</option>)}
      </select>
    </label>
  );
}
