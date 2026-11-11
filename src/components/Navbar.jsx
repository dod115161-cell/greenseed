import {Search,ShoppingCart} from 'lucide-react'
export const Logo=({s})=>(<div className="flex items-center gap-2">
{s.logo?<img src={s.logo} className="h-9" alt="logo"/>:<svg viewBox="0 0 24 24" className="h-8 w-8" fill="none" stroke="#E3F0AF" strokeWidth="2" strokeLinecap="round"><path d="M12 22V10M12 10C12 5 8 3 4 4c0 4 3 6 8 6zM12 13c0-4 3-6 8-6 0 4-3 7-8 6z"/></svg>}
<span className="font-bold text-lg">{s.name}</span></div>)
export default function Navbar({settings,q,setQ,cartCount,role,setRole,goShop,goCart,menu,onMenu, user, onGoogleLogin, onLogout}){
const roles=[['Customer','Khách hàng'],['Seller','Người bán'],['Admin','Quản trị']]
return(<header className="glass-dark text-white sticky top-0 z-40">
<div className="max-w-6xl mx-auto px-4 py-3 flex flex-wrap items-center gap-3 justify-between">
<button onClick={goShop}><Logo s={settings}/></button>
{role==='Customer'&&<div className="relative flex-1 min-w-[180px] max-w-md"><Search className="absolute left-3 top-2.5 h-4 w-4 text-lime-400"/>
<input value={q} onChange={e=>{setQ(e.target.value);goShop()}} placeholder="Tìm hạt giống..." className="w-full rounded-full py-2 pl-9 pr-3 bg-slate-900 border border-emerald-800 text-slate-100 text-sm placeholder:text-slate-500"/></div>}
<div className="flex items-center gap-2">


<div className="flex items-center gap-3 ml-4">
  {user ? (
    <div className="flex items-center gap-2 text-sm text-gray-200">
      <span className="hidden md:inline">{user.email}</span>
      <button 
        onClick={onLogout}
        className="px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white rounded-md text-xs font-medium transition"
      >
        Đăng xuất
      </button>
    </div>
  ) : (
    <button 
      onClick={onGoogleLogin}
      className="flex items-center gap-2 px-3 py-1.5 bg-white hover:bg-gray-100 text-gray-800 rounded-md text-xs font-semibold shadow transition"
    >
      <svg width="14" height="14" viewBox="0 0 24 24">
        <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.17z"/>
        <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.13 0-5.78-2.11-6.73-4.96H1.18v3.15C3.18 21.34 7.22 24 12 24z"/>
        <path fill="#FBBC05" d="M5.27 14.24c-.25-.72-.38-1.49-.38-2.24s.13-1.52.38-2.24V6.61H1.18C.43 8.13 0 9.84 0 12s.43 3.87 1.18 5.39l4.09-3.15z"/>
        <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.22 0 3.18 2.66 1.18 6.61l4.09 3.15c.95-2.85 3.6-4.96 6.73-4.96z"/>
      </svg>
      Đăng nhập Google
    </button>
  )}
</div>

{role==='Customer'&&<button onClick={goCart} className="relative p-2"><ShoppingCart/>{cartCount>0&&<span className="absolute -top-1 -right-1 bg-lime-400 text-slate-950 text-xs rounded-full h-5 w-5 grid place-items-center">{cartCount}</span>}</button>}
<div className="flex bg-slate-950/60 rounded-full p-1 text-xs">{roles.map(([k,l])=><button key={k} onClick={()=>setRole(k)} className={`px-3 py-1 rounded-full ${role===k?'bg-lime-400 text-slate-950 font-medium':''}`}>{l}</button>)}</div>
</div></div>
<nav className="bg-slate-950/40 text-sm"><div className="max-w-6xl mx-auto px-4 py-1 flex gap-1 overflow-x-auto">{menu.map(([k,l])=><button key={k} onClick={()=>onMenu(k)} className="px-3 py-1 rounded hover:bg-emerald-900/60 whitespace-nowrap">{l}</button>)}</div></nav></header>)}
