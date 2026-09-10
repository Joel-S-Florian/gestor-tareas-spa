export default function Avatar({ name, size=32 }) {
  const initials = name ? name.trim().split(/\s+/).slice(0,2).map(p=>p[0].toUpperCase()).join('') : '?';
  return <div style={{width:size,height:size,borderRadius:'50%',background:'var(--bg-tertiary)',border:'1px solid var(--border)',display:'grid',placeItems:'center',fontSize:size*0.4,fontWeight:700,color:'var(--text-secondary)'}}>{initials}</div>;
}
