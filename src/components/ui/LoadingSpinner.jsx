import { Loader2 } from 'lucide-react';
export default function LoadingSpinner({ size=20 }) {
  return <Loader2 size={size} style={{animation:'spin 0.8s linear infinite',color:'var(--text-muted)'}} />;
}
