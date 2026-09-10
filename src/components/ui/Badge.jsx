export default function Badge({ children, tone = 'default' }) {
  const tones = {
    default: { background: 'var(--bg-tertiary)', color: 'var(--text-secondary)', borderColor: 'var(--border)' },
    accent: { background: 'var(--accent-dim)', color: 'var(--accent)', borderColor: 'var(--accent)' },
    success: { background: '#10B9811A', color: 'var(--success)', borderColor: 'var(--success)' },
    warning: { background: '#F59E0B1A', color: 'var(--warning)', borderColor: 'var(--warning)' },
    danger: { background: '#EF44441A', color: 'var(--danger)', borderColor: 'var(--danger)' },
  };
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', padding: '2px 8px', borderRadius: 999, fontSize: 11, fontWeight: 600, border: '1px solid', ...tones[tone]
    }}>
      {children}
    </span>
  );
}
