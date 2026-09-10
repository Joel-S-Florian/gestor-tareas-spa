import Sidebar from './Sidebar';
import Header from './Header';

export default function AppLayout({ children }) {
  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--bg-primary)', transition: 'background-color 0.2s ease' }}>
      <Sidebar />
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
        <Header />
        <main style={{ flex: 1, padding: '24px 20px', minWidth: 0 }}>{children}</main>
      </div>
    </div>
  );
}
