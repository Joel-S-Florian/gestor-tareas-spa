export default function Button({ variant = 'primary', size = 'md', children, ...props }) {
  const base = {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    borderRadius: 8,
    fontWeight: 500,
    cursor: 'pointer',
    border: '1px solid transparent',
    transition: 'all 0.2s ease',
    fontFamily: 'inherit',
  };
  const sizes = {
    sm: { padding: '6px 10px', fontSize: 12 },
    md: { padding: '8px 14px', fontSize: 14 },
    lg: { padding: '10px 18px', fontSize: 14 },
  };
  const variants = {
    primary: { background: 'var(--accent)', color: '#fff', borderColor: 'var(--accent)' },
    secondary: { background: 'var(--bg-secondary)', color: 'var(--text-primary)', borderColor: 'var(--border)' },
    danger: { background: 'var(--danger)', color: '#fff', borderColor: 'var(--danger)' },
    ghost: { background: 'transparent', color: 'var(--text-secondary)', borderColor: 'transparent' },
  };
  return (
    <button style={{ ...base, ...sizes[size], ...variants[variant] }} {...props}>
      {children}
    </button>
  );
}
