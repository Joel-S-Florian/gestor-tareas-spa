import Avatar from './Avatar';
export default function AvatarGroup({ members=[] }) {
  return <div style={{display:'flex',alignItems:'center'}}>{members.slice(0,4).map((m,i)=><div key={i} style={{marginLeft:i? -8:0,border:'2px solid var(--bg-secondary)',borderRadius:'50%'}}><Avatar name={m.nombre||m} size={24} /></div>)}{members.length>4 && <span style={{marginLeft:6,fontSize:11,color:'var(--text-muted)'}}>+{members.length-4}</span>}</div>;
}
