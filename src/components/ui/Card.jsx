export default function Card({ children, style, ...props }) {
  return (
    <div
      style={{
        background: 'var(--bg-secondary)',
        border: '1px solid var(--border)',
        borderRadius: 12,
        boxShadow: 'var(--shadow-card)',
        transition: 'background-color 0.2s ease, border-color 0.2s ease',
        ...style,
      }}
      {...props}
    >
      {children}
    </div>
  );
}
