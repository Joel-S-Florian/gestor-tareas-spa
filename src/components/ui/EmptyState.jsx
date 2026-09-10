import { Inbox } from 'lucide-react';
export default function EmptyState({ message='Sin datos' }) {
  return <div style={{textAlign:'center',padding:32,color:'var(--text-muted)'}}><Inbox size={28} style={{marginBottom:8}} /><p style={{fontSize:13}}>{message}</p></div>;
}
