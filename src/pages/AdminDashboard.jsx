import {useState} from 'react'
import {vnd} from '../data/mockData'
import ProductManager from '../components/ProductManager'
export default function AdminDashboard({c}){
const {users,setUsers,orders,posts,setPosts,settings,setSettings}=c
const [p,setP]=useState(null)
const savePost=()=>{if(!p.title)return alert('Vui lòng nhập tiêu đề.');setPosts(p.id?posts.map(x=>x.id===p.id?p:x):[...posts,{...p,id:Date.now()}]);setP(null)}
const upd=(id,d)=>setUsers(users.map(u=>u.id===id?{...u,...d}:u))
return(<div className="max-w-6xl mx-auto px-4 py-6 space-y-6">
<div className="grid grid-cols-2 md:grid-cols-4 gap-3">{[['Doanh thu',vnd(orders.reduce((s,o)=>s+o.total,0))],['Người dùng',users.length],['Người bán',users.filter(u=>u.role==='Seller').length],['Đơn hàng',orders.length]].map(([a,b])=><div key={a} className="card"><p className="text-sm">{a}</p><p className="text-xl font-bold text-lime-400">{b}</p></div>)}</div>
<ProductManager c={c}/>
<section className="card"><h3 className="font-bold mb-3">Quản lý người dùng</h3>{users.map(u=><div key={u.id} className="flex flex-wrap items-center justify-between gap-2 border-t border-emerald-900/60 py-2 text-sm"><span><b>{u.name}</b> • {u.email}</span>
<span className="flex gap-2"><select className="inp w-auto" value={u.role} onChange={e=>upd(u.id,{role:e.target.value})}>{['Customer','Seller','Admin'].map(r=><option key={r}>{r}</option>)}</select>
<button className={u.active?'btn2':'btn'} onClick={()=>upd(u.id,{active:!u.active})}>{u.active?'Khóa':'Kích hoạt'}</button></span></div>)}</section>
<section className="card grid md:grid-cols-2 gap-2"><h3 className="font-bold md:col-span-2">Cài đặt hệ thống</h3>
{[['name','Tên trang web'],['logo','Logo URL'],['hotline','Hotline'],['address','Địa chỉ kho']].map(([k,l])=><label key={k} className="text-sm">{l}<input className="inp mt-1" value={settings[k]} onChange={e=>setSettings({...settings,[k]:e.target.value})}/></label>)}
<p className="text-xs md:col-span-2">Thay đổi được lưu tự động.</p></section></div>)}
