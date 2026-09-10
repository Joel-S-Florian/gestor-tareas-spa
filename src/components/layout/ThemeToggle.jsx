import { Sun, Moon } from 'lucide-react';
import { useTheme } from '../../hooks/useTheme';

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={isDark ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'}
      title={isDark ? 'Modo claro' : 'Modo oscuro'}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: 36,
        height: 36,
        borderRadius: 8,
        border: '1px solid var(--border)',
        background: 'var(--bg-secondary)',
        color: 'var(--text-secondary)',
        cursor: 'pointer',
        transition: 'all 0.2s ease',
      }}
    >
      {isDark ? <Sun size={16} /> : <Moon size={16} />}
    </button>
  );
}
