/*import {useState} from 'react'
import CareTimeline from '../components/CareTimeline'
import CompanionPlanting from '../components/CompanionPlanting'
import Hero3D from '../components/Hero3D'
import StoreSection from '../components/StoreSection'
import BlogView from '../components/BlogView'
import AIDiseaseScanner from '../components/AIDiseaseScanner'
import GeoSmartPlanter from '../components/GeoSmartPlanter'
import AIGardenPlanner from '../components/AIGardenPlanner'
import {vnd,BLOG_CATS} from '../data/mockData'
const Cover=({v})=>String(v||'').startsWith('http')?<img src={v} alt="" className="h-32 w-full object-cover rounded-lg mb-2"/>:<div className="text-5xl text-center bg-emerald-800/40 rounded-lg py-4 mb-2">{v||'🌱'}</div>
const TABS=[['shop','Cửa hàng'],['blog','Blog kỹ thuật'],['care','Lịch chăm sóc'],['mix','Trồng xen canh'],['scan','Quét bệnh AI'],['geo','Bản đồ thổ nhưỡng'],['garden','Setup vườn AI'],['cart','Giỏ hàng']]
export default function CustomerView({c}){
const {products,posts,cart,setCart,orders,setOrders,q,tab,setTab,setDrawer}=c
const [bc,setBc]=useState('Tất cả'),[f,setF]=useState({cat:'',diff:'',season:'',max:0}),[sel,setSel]=useState(null),[code,setCode]=useState(''),[modal,setModal]=useState(false),[info,setInfo]=useState({name:'',phone:'',addr:''}),[ok,setOk]=useState('')
const seeds=products.filter(p=>p.days>0)
const uniq=k=>[...new Set(products.map(p=>p[k]))]
const list=products.filter(p=>p.name.toLowerCase().includes(q.toLowerCase())&&(!f.cat||p.cat===f.cat)&&(!f.diff||p.diff===f.diff)&&(!f.season||p.season===f.season)&&(!f.max||p.days<=f.max))
const add=p=>{setDrawer(true);setCart(c=>c.find(i=>i.id===p.id)?c.map(i=>i.id===p.id?{...i,qty:i.qty+1}:i):[...c,{id:p.id,qty:1}])}
const items=cart.map(i=>({...i,p:products.find(p=>p.id===i.id)})).filter(i=>i.p)
const sub=items.reduce((s,i)=>s+i.p.price*i.qty,0),disc=code.toUpperCase()==='XANH10'?sub*.1:0,total=sub-disc
const order=()=>{if(!info.name||!info.phone||!info.addr)return alert('Vui lòng nhập đủ thông tin.')
const id='DH'+Date.now().toString().slice(-6);setOrders([{id,customer:info.name,items:items.map(i=>({name:i.p.name,qty:i.qty})),total,status:'Chờ xác nhận',date:new Date().toLocaleDateString('vi-VN')},...orders])
setCart([]);setModal(false);setOk(id)}
const Sel=({k,l,opts})=><select className="inp w-auto" value={f[k]} onChange={e=>setF({...f,[k]:e.target.value})}><option value="">{l}</option>{opts.map(o=><option key={o}>{o}</option>)}</select>
return(<>{tab==='shop'&&<Hero3D onExplore={()=>document.getElementById('products')?.scrollIntoView({behavior:'smooth'})} onGuide={()=>setTab('care')}/>}
<div className="max-w-6xl mx-auto px-4 py-6 space-y-5">
<div className="flex gap-2 flex-wrap">{TABS.map(([k,l])=><button key={k} onClick={()=>setTab(k)} className={`px-4 py-2 rounded-full text-sm ${tab===k?'bg-emerald-600 text-white':'bg-slate-900 text-slate-300 border border-emerald-800'}`}>{l}{k==='cart'&&cart.length?` (${cart.length})`:''}</button>)}</div>
{ok&&<div className="bg-emerald-800 p-3 rounded-lg text-sm">Đặt hàng thành công! Mã đơn: <b>{ok}</b></div>}
{tab==='blog'&&<BlogView posts={posts} products={products} add={add}/>}
{tab==='care'&&<CareTimeline products={seeds}/>}
{tab==='mix'&&<CompanionPlanting products={seeds}/>}
{tab==='scan'&&<AIDiseaseScanner products={products} add={add}/>}
{tab==='geo'&&<GeoSmartPlanter products={products} add={add}/>}
{tab==='garden'&&<AIGardenPlanner products={products} add={add}/>}
{tab==='cart'&&<div className="card space-y-3">{!items.length?<p>Giỏ hàng đang trống. Hãy chọn vài hạt giống ở Cửa hàng.</p>:<>
{items.map(i=><div key={i.id} className="flex items-center gap-3 border-b border-emerald-900/60 pb-2"><span className="text-3xl">{i.p.emoji}</span><div className="flex-1"><b>{i.p.name}</b><div className="text-sm text-lime-400">{vnd(i.p.price)}</div></div>
<input type="number" min="1" max={i.p.stock} value={i.qty} className="inp w-20" onChange={e=>setCart(cart.map(x=>x.id===i.id?{...x,qty:Math.max(1,+e.target.value||1)}:x))}/>
<button className="text-red-400 text-sm" onClick={()=>setCart(cart.filter(x=>x.id!==i.id))}>Xóa</button></div>)}
<input className="inp max-w-xs" placeholder="Mã giảm giá (thử XANH10)" value={code} onChange={e=>setCode(e.target.value)}/>
<p>Tạm tính: {vnd(sub)}{disc>0&&<> • Giảm: -{vnd(disc)}</>}</p><p className="text-xl font-bold text-lime-400">Tổng: {vnd(total)}</p>
<button className="btn" onClick={()=>setModal(true)}>Đặt hàng</button></>}</div>}
{sel&&<div className="fixed inset-0 bg-black/50 grid place-items-center p-4 z-30" onClick={()=>setSel(null)}><div className="card max-w-md w-full space-y-2" onClick={e=>e.stopPropagation()}>
<div className="text-6xl text-center">{sel.emoji}</div><h3 className="font-bold text-xl">{sel.name}</h3>
<ul className="text-sm space-y-1"><li>Tỉ lệ nảy mầm: <b>{sel.germ}%</b></li><li>Độ pH đất: <b>{sel.ph}</b></li><li>Nhiệt độ thích hợp: <b>{sel.temp}</b></li><li>Ánh sáng: <b>{sel.light}</b></li><li>Mùa vụ: <b>{sel.season}</b> • Thu hoạch: <b>{sel.days} ngày</b></li><li>Còn lại: {sel.stock}</li></ul>
<div className="flex gap-2"><button className="btn" onClick={()=>{add(sel);setSel(null)}}>Thêm vào giỏ</button><button className="btn2" onClick={()=>setSel(null)}>Đóng</button></div></div></div>}
{modal&&<div className="fixed inset-0 bg-black/50 grid place-items-center p-4 z-30"><div className="card max-w-md w-full space-y-2"><h3 className="font-bold">Thông tin giao hàng</h3>
<input className="inp" placeholder="Họ tên" value={info.name} onChange={e=>setInfo({...info,name:e.target.value})}/><input className="inp" placeholder="Số điện thoại" value={info.phone} onChange={e=>setInfo({...info,phone:e.target.value})}/><input className="inp" placeholder="Địa chỉ" value={info.addr} onChange={e=>setInfo({...info,addr:e.target.value})}/>
<p className="font-bold text-lime-400">Thanh toán khi nhận hàng: {vnd(total)}</p><div className="flex gap-2"><button className="btn" onClick={order}>Xác nhận đặt hàng</button><button className="btn2" onClick={()=>setModal(false)}>Hủy</button></div></div></div>}
</div>
{tab==='shop'&&<StoreSection products={products} q={q} add={add}/>}</>)}
*/

/*import { useState, useEffect } from 'react'
import CareTimeline from '../components/CareTimeline'
import CompanionPlanting from '../components/CompanionPlanting'
import Hero3D from '../components/Hero3D'
import StoreSection from '../components/StoreSection'
import BlogView from '../components/BlogView'
import AIDiseaseScanner from '../components/AIDiseaseScanner'
import GeoSmartPlanter from '../components/GeoSmartPlanter'
import AIGardenPlanner from '../components/AIGardenPlanner'
import {vnd, BLOG_CATS} from '../data/mockData'
import { supabase } from '../supabaseClient' // Kết nối Supabase để lưu và đọc địa chỉ/SĐT

const Cover=({v})=>String(v||'').startsWith('http')?<img src={v} alt="" className="h-32 w-full object-cover rounded-lg mb-2"/>:<div className="text-5xl text-center bg-emerald-800/40 rounded-lg py-4 mb-2">{v||'🌱'}</div>
const TABS=[['shop','Cửa hàng'],['blog','Blog kỹ thuật'],['care','Lịch chăm sóc'],['mix','Trồng xen canh'],['scan','Quét bệnh AI'],['geo','Bản đồ thổ nhưỡng'],['garden','Setup vườn AI'],['cart','Giỏ hàng']]

export default function CustomerView({c}){
const {products,posts,cart,setCart,orders,setOrders,q,tab,setTab,setDrawer}=c
const [bc,setBc]=useState('Tất cả'),[f,setF]=useState({cat:'',diff:'',season:'',max:0}),[sel,setSel]=useState(null),[code,setCode]=useState(''),[modal,setModal]=useState(false),[info,setInfo]=useState({name:'',phone:'',addr:''}),[ok,setOk]=useState('')

const seeds=products.filter(p=>p.days>0)
const uniq=k=>[...new Set(products.map(p=>p[k]))]
const list=products.filter(p=>p.name.toLowerCase().includes(q.toLowerCase())&&(!f.cat||p.cat===f.cat)&&(!f.diff||p.diff===f.diff)&&(!f.season||p.season===f.season)&&(!f.max||p.days<=f.max))
const add=p=>{setDrawer(true);setCart(c=>c.find(i=>i.id===p.id)?c.map(i=>i.id===p.id?{...i,qty:i.qty+1}:i):[...c,{id:p.id,qty:1}])}
const items=cart.map(i=>({...i,p:products.find(p=>p.id===i.id)})).filter(i=>i.p)
const sub=items.reduce((s,i)=>s+i.p.price*i.qty,0),disc=code.toUpperCase()==='XANH10'?sub*.1:0,total=sub-disc

// 1. Tự động lấy số điện thoại và địa chỉ cũ của khách khi họ đăng nhập Google
useEffect(() => {
  if (c.user) {
    fetchSavedAddress()
  }
}, [c.user])

const fetchSavedAddress = async () => {
  try {
    const { data, error } = await supabase
      .from('addresses')
      .select('*')
      .eq('user_id', c.user.id)
      .order('created_at', { ascending: false })
      .limit(1)

    if (!error && data && data.length > 0) {
      setInfo(prev => ({
        ...prev,
        name: data[0].recipient_name || prev.name,
        phone: data[0].phone || prev.phone,
        addr: data[0].address_line || prev.addr,
      }))
    }
  } catch (err) {
    console.error('Lỗi tải địa chỉ đã lưu:', err)
  }
}

// 2. Giữ nguyên hàm order của bạn và bổ sung thêm việc lưu SĐT/Địa chỉ vào bảng addresses để bên bán dễ quản lý
const order = async () => {
  if(!info.name || !info.phone || !info.addr) return alert('Vui lòng nhập đủ thông tin.')
  
  const id = 'DH' + Date.now().toString().slice(-6)
  
  // Lưu vào state đơn hàng hiện tại
  setOrders([{
    id, 
    customer: info.name, 
    phone: info.phone, // Lưu thêm SĐT để hiển thị cho người bán
    address: info.addr, // Lưu thêm Địa chỉ để hiển thị cho người bán
    items: items.map(i => ({name: i.p.name, qty: i.qty})), 
    total, 
    status: 'Chờ xác nhận', 
    date: new Date().toLocaleDateString('vi-VN')
  }, ...orders])

  // Nếu khách đăng nhập Google, lưu thông tin này vào bảng 'addresses' của Supabase để lần sau tự điền
  // Thay thế đoạn lưu địa chỉ cũ trong hàm order() của CustomerView.jsx
if (c.user) {
  try {
    // 1. Kiểm tra xem địa chỉ + SĐT này đã có trong CSDL chưa
    const { data: existing } = await supabase
      .from('addresses')
      .select('id')
      .eq('user_id', c.user.id)
      .eq('address_line', info.addr)
      .eq('phone', info.phone);

    // 2. Chỉ khi CHƯA CÓ thì mới tiến hành lưu mới vào sổ địa chỉ
    if (!existing || existing.length === 0) {
      await supabase.from('addresses').insert([{
        user_id: c.user.id,
        recipient_name: info.name,
        phone: info.phone,
        address_line: info.addr,
        city: 'Mặc định'
      }]);
    }
  } catch (err) {
    console.error('Lỗi kiểm tra/lưu địa chỉ:', err);
  }
}

  setCart([])
  setModal(false)
  setOk(id)
}

const Sel=({k,l,opts})=><select className="inp w-auto" value={f[k]} onChange={e=>setF({...f,[k]:e.target.value})}><option value="">{l}</option>{opts.map(o=><option key={o}>{o}</option>)}</select>

return(<>{tab==='shop'&&<Hero3D onExplore={()=>document.getElementById('products')?.scrollIntoView({behavior:'smooth'})} onGuide={()=>setTab('care')}/>}
<div className="max-w-6xl mx-auto px-4 py-6 space-y-5">
<div className="flex gap-2 flex-wrap">{TABS.map(([k,l])=><button key={k} onClick={()=>setTab(k)} className={`px-4 py-2 rounded-full text-sm ${tab===k?'bg-emerald-600 text-white':'bg-slate-900 text-slate-300 border border-emerald-800'}`}>{l}{k==='cart'&&cart.length?` (${cart.length})`:''}</button>)}</div>
{ok&&<div className="bg-emerald-800 p-3 rounded-lg text-sm">Đặt hàng thành công! Mã đơn: <b>{ok}</b></div>}
{tab==='blog'&&<BlogView posts={posts} products={products} add={add}/>}
{tab==='care'&&<CareTimeline products={seeds}/>}
{tab==='mix'&&<CompanionPlanting products={seeds}/>}
{tab==='scan'&&<AIDiseaseScanner products={products} add={add}/>}
{tab==='geo'&&<GeoSmartPlanter products={products} add={add}/>}
{tab==='garden'&&<AIGardenPlanner products={products} add={add}/>}
{tab==='cart'&&<div className="card space-y-3">{!items.length?<p>Giỏ hàng đang trống. Hãy chọn vài hạt giống ở Cửa hàng.</p>:<>
{items.map(i=><div key={i.id} className="flex items-center gap-3 border-b border-emerald-900/60 pb-2"><span className="text-3xl">{i.p.emoji}</span><div className="flex-1"><b>{i.p.name}</b><div className="text-sm text-lime-400">{vnd(i.p.price)}</div></div>
<input type="number" min="1" max={i.p.stock} value={i.qty} className="inp w-20" onChange={e=>setCart(cart.map(x=>x.id===i.id?{...x,qty:Math.max(1,+e.target.value||1)}:x))}/>
<button className="text-red-400 text-sm" onClick={()=>setCart(cart.filter(x=>x.id!==i.id))}>Xóa</button></div>)}
<input className="inp max-w-xs" placeholder="Mã giảm giá (thử XANH10)" value={code} onChange={e=>setCode(e.target.value)}/>
<p>Tạm tính: {vnd(sub)}{disc>0&&<> • Giảm: -{vnd(disc)}</>}</p><p className="text-xl font-bold text-lime-400">Tổng: {vnd(total)}</p>
<button className="btn" onClick={()=>setModal(true)}>Đặt hàng</button></>}</div>}
{sel&&<div className="fixed inset-0 bg-black/50 grid place-items-center p-4 z-30" onClick={()=>setSel(null)}><div className="card max-w-md w-full space-y-2" onClick={e=>e.stopPropagation()}>
<div className="text-6xl text-center">{sel.emoji}</div><h3 className="font-bold text-xl">{sel.name}</h3>
<ul className="text-sm space-y-1"><li>Tỉ lệ nảy mầm: <b>{sel.germ}%</b></li><li>Độ pH đất: <b>{sel.ph}</b></li><li>Nhiệt độ thích hợp: <b>{sel.temp}</b></li><li>Ánh sáng: <b>{sel.light}</b></li><li>Mùa vụ: <b>{sel.season}</b> • Thu hoạch: <b>{sel.days} ngày</b></li><li>Còn lại: {sel.stock}</li></ul>
<div className="flex gap-2"><button className="btn" onClick={()=>{add(sel);setSel(null)}}>Thêm vào giỏ</button><button className="btn2" onClick={()=>setSel(null)}>Đóng</button></div></div></div>}
{modal&&<div className="fixed inset-0 bg-black/50 grid place-items-center p-4 z-30"><div className="card max-w-md w-full space-y-2"><h3 className="font-bold">Thông tin giao hàng</h3>
<input className="inp" placeholder="Họ tên" value={info.name} onChange={e=>setInfo({...info,name:e.target.value})}/>
<input className="inp" placeholder="Số điện thoại" value={info.phone} onChange={e=>setInfo({...info,phone:e.target.value})}/>
<input className="inp" placeholder="Địa chỉ" value={info.addr} onChange={e=>setInfo({...info,addr:e.target.value})}/>
<p className="font-bold text-lime-400">Thanh toán khi nhận hàng: {vnd(total)}</p><div className="flex gap-2"><button className="btn" onClick={order}>Xác nhận đặt hàng</button><button className="btn2" onClick={()=>setModal(false)}>Hủy</button></div></div></div>}
</div>
{tab==='shop'&&<StoreSection products={products} q={q} add={add}/>}</>)}
*/
/*import { useState, useEffect } from 'react'
import CareTimeline from '../components/CareTimeline'
import CompanionPlanting from '../components/CompanionPlanting'
import Hero3D from '../components/Hero3D'
import StoreSection from '../components/StoreSection'
import BlogView from '../components/BlogView'
import AIDiseaseScanner from '../components/AIDiseaseScanner'
import GeoSmartPlanter from '../components/GeoSmartPlanter'
import AIGardenPlanner from '../components/AIGardenPlanner'
import { vnd, BLOG_CATS } from '../data/mockData'
import { supabase } from '../supabaseClient'

const Cover = ({v}) => String(v||'').startsWith('http') ? <img src={v} alt="" className="h-32 w-full object-cover rounded-lg mb-2"/> : <div className="text-5xl text-center bg-emerald-800/40 rounded-lg py-4 mb-2">{v||'🌱'}</div>
const TABS = [['shop','Cửa hàng'],['blog','Blog kỹ thuật'],['care','Lịch chăm sóc'],['mix','Trồng xen canh'],['scan','Quét bệnh AI'],['geo','Bản đồ thổ nhưỡng'],['garden','Setup vườn AI'],['cart','Giỏ hàng']]

export default function CustomerView({c}) {
  const {products, posts, cart, setCart, orders, setOrders, q, tab, setTab, setDrawer} = c
  const [bc, setBc] = useState('Tất cả')
  const [f, setF] = useState({cat:'', diff:'', season:'', max:0})
  const [sel, setSel] = useState(null)
  const [code, setCode] = useState('')
  const [modal, setModal] = useState(false)
  const [info, setInfo] = useState({name:'', phone:'', addr:''})
  const [ok, setOk] = useState('')

  const seeds = products.filter(p => p.days > 0)
  const list = products.filter(p => p.name.toLowerCase().includes(q.toLowerCase()) && (!f.cat || p.cat === f.cat) && (!f.diff || p.diff === f.diff) && (!f.season || p.season === f.season) && (!f.max || p.days <= f.max))
  
  const add = p => {
    setDrawer(true)
    setCart(c => c.find(i => i.id === p.id) ? c.map(i => i.id === p.id ? {...i, qty: i.qty + 1} : i) : [...c, {id: p.id, qty: 1}])
  }

  const items = cart.map(i => ({...i, p: products.find(p => p.id === i.id)})).filter(i => i.p)
  const sub = items.reduce((s, i) => s + i.p.price * i.qty, 0)
  const disc = code.toUpperCase() === 'XANH10' ? sub * .1 : 0
  const total = sub - disc

  // 1. Tự động lấy số điện thoại và địa chỉ cũ của khách khi họ đăng nhập
  useEffect(() => {
    if (c.user) {
      fetchSavedAddress()
    }
  }, [c.user])

  const fetchSavedAddress = async () => {
    try {
      const { data, error } = await supabase
        .from('addresses')
        .select('*')
        .eq('user_id', c.user.id)
        .order('created_at', { ascending: false })
        .limit(1)

      if (!error && data && data.length > 0) {
        setInfo(prev => ({
          ...prev,
          name: data[0].recipient_name || prev.name,
          phone: data[0].phone || prev.phone,
          addr: data[0].address_line || prev.addr,
        }))
      }
    } catch (err) {
      console.error('Lỗi tải địa chỉ đã lưu:', err)
    }
  }

  // 2. Hàm đặt hàng chuẩn xác đẩy lên Supabase
  const order = async () => {
    if (!info.name || !info.phone || !info.addr) return alert('Vui lòng nhập đủ thông tin.')
    
    const id = 'DH' + Date.now().toString().slice(-6)
    const newOrderData = {
      id, 
      customer: info.name, 
      phone: info.phone, 
      address: info.addr, 
      items: items.map(i => ({name: i.p.name, qty: i.qty})), 
      total: total,
      total_amount: total,
      status: 'Đang xử lý', 
      created_at: new Date().toISOString()
    };

    try {
      // Đẩy đơn hàng lên Supabase để đồng bộ với trang quản lý của người bán và tài khoản
      const { error: ordError } = await supabase
        .from('orders')
        .insert([
          {
            id: id,
            user_id: c.user ? c.user.id : null,
            customer: info.name,
            phone: info.phone,
            address: info.addr,
            shipping_address: info.addr,
            items: items.map(i => ({name: i.p.name, qty: i.qty})),
            total: total,
            total_amount: total,
            status: 'Đang xử lý'
          }
        ]);

      if (ordError) {
        console.error('Lỗi khi lưu đơn lên Supabase:', ordError.message);
      }

      setOrders([newOrderData, ...orders]);

      if (c.user) {
        const { data: existing } = await supabase
          .from('addresses')
          .select('id')
          .eq('user_id', c.user.id)
          .eq('address_line', info.addr)
          .eq('phone', info.phone);

        if (!existing || existing.length === 0) {
          await supabase.from('addresses').insert([{
            user_id: c.user.id,
            recipient_name: info.name,
            phone: info.phone,
            address_line: info.addr,
            city: 'Mặc định'
          }]);
        }
      }

      setCart([])
      setModal(false)
      setOk(id)

    } catch (err) {
      console.error('Lỗi đặt hàng:', err);
      alert('Có lỗi xảy ra khi đặt hàng.');
    }
  }

  const Sel = ({k, l, opts}) => (
    <select className="inp w-auto" value={f[k]} onChange={e => setF({...f, [k]: e.target.value})}>
      <option value="">{l}</option>
      {opts.map(o => <option key={o}>{o}</option>)}
    </select>
  )

  return (
    <>
      {tab === 'shop' && <Hero3D onExplore={() => document.getElementById('products')?.scrollIntoView({behavior: 'smooth'})} onGuide={() => setTab('care')}/>}
      <div className="max-w-6xl mx-auto px-4 py-6 space-y-5">
        <div className="flex gap-2 flex-wrap">
          {TABS.map(([k, l]) => (
            <button key={k} onClick={() => setTab(k)} className={`px-4 py-2 rounded-full text-sm ${tab === k ? 'bg-emerald-600 text-white' : 'bg-slate-900 text-slate-300 border border-emerald-800'}`}>
              {l}{k === 'cart' && cart.length ? ` (${cart.length})` : ''}
            </button>
          ))}
        </div>

        {ok && <div className="bg-emerald-800 p-3 rounded-lg text-sm">Đặt hàng thành công! Mã đơn: <b>{ok}</b></div>}
        
        {tab === 'blog' && <BlogView posts={posts} products={products} add={add}/>}
        {tab === 'care' && <CareTimeline products={seeds}/>}
        {tab === 'mix' && <CompanionPlanting products={seeds}/>}
        {tab === 'scan' && <AIDiseaseScanner products={products} add={add}/>}
        {tab === 'geo' && <GeoSmartPlanter products={products} add={add}/>}
        {tab === 'garden' && <AIGardenPlanner products={products} add={add}/>}
        
        {tab === 'cart' && (
          <div className="card space-y-3">
            {!items.length ? <p>Giỏ hàng đang trống. Hãy chọn vài hạt giống ở Cửa hàng.</p> : (
              <>
                {items.map(i => (
                  <div key={i.id} className="flex items-center gap-3 border-b border-emerald-900/60 pb-2">
                    <span className="text-3xl">{i.p.emoji}</span>
                    <div className="flex-1">
                      <b>{i.p.name}</b>
                      <div className="text-sm text-lime-400">{vnd(i.p.price)}</div>
                    </div>
                    <input type="number" min="1" max={i.p.stock} value={i.qty} className="inp w-20" onChange={e => setCart(cart.map(x => x.id === i.id ? {...x, qty: Math.max(1, +e.target.value || 1)} : x))}/>
                    <button className="text-red-400 text-sm" onClick={() => setCart(cart.filter(x => x.id !== i.id))}>Xóa</button>
                  </div>
                ))}
                <input className="inp max-w-xs" placeholder="Mã giảm giá (thử XANH10)" value={code} onChange={e => setCode(e.target.value)}/>
                <p>Tạm tính: {vnd(sub)}{disc > 0 && <> • Giảm: -{vnd(disc)}</>}</p>
                <p className="text-xl font-bold text-lime-400">Tổng: {vnd(total)}</p>
                <button className="btn" onClick={() => setModal(true)}>Đặt hàng</button>
              </>
            )}
          </div>
        )}

        {sel && (
          <div className="fixed inset-0 bg-black/50 grid place-items-center p-4 z-30" onClick={() => setSel(null)}>
            <div className="card max-w-md w-full space-y-2" onClick={e => e.stopPropagation()}>
              <div className="text-6xl text-center">{sel.emoji}</div>
              <h3 className="font-bold text-xl">{sel.name}</h3>
              <ul className="text-sm space-y-1">
                <li>Tỉ lệ nảy mầm: <b>{sel.germ}%</b></li>
                <li>Độ pH đất: <b>{sel.ph}</b></li>
                <li>Nhiệt độ thích hợp: <b>{sel.temp}</b></li>
                <li>Ánh sáng: <b>{sel.light}</b></li>
                <li>Mùa vụ: <b>{sel.season}</b> • Thu hoạch: <b>{sel.days} ngày</b></li>
                <li>Còn lại: {sel.stock}</li>
              </ul>
              <div className="flex gap-2">
                <button className="btn" onClick={() => { add(sel); setSel(null) }}>Thêm vào giỏ</button>
                <button className="btn2" onClick={() => setSel(null)}>Đóng</button>
              </div>
            </div>
          </div>
        )}

        {modal && (
          <div className="fixed inset-0 bg-black/50 grid place-items-center p-4 z-30">
            <div className="card max-w-md w-full space-y-2">
              <h3 className="font-bold">Thông tin giao hàng</h3>
              <input className="inp" placeholder="Họ tên" value={info.name} onChange={e => setInfo({...info, name: e.target.value})}/>
              <input className="inp" placeholder="Số điện thoại" value={info.phone} onChange={e => setInfo({...info, phone: e.target.value})}/>
              <input className="inp" placeholder="Địa chỉ" value={info.addr} onChange={e => setInfo({...info, addr: e.target.value})}/>
              <p className="font-bold text-lime-400">Thanh toán khi nhận hàng: {vnd(total)}</p>
              <div className="flex gap-2">
                <button className="btn" onClick={order}>Xác nhận đặt hàng</button>
                <button className="btn2" onClick={() => setModal(false)}>Hủy</button>
              </div>
            </div>
          </div>
        )}
      </div>
      {tab === 'shop' && <StoreSection products={products} q={q} add={add}/>}
    </>
  )
}
  */
 import { useState, useEffect } from 'react'
import CareTimeline from '../components/CareTimeline'
import CompanionPlanting from '../components/CompanionPlanting'
import Hero3D from '../components/Hero3D'
import StoreSection from '../components/StoreSection'
import BlogView from '../components/BlogView'
import AIDiseaseScanner from '../components/AIDiseaseScanner'
import GeoSmartPlanter from '../components/GeoSmartPlanter'
import AIGardenPlanner from '../components/AIGardenPlanner'
import { vnd, BLOG_CATS } from '../data/mockData'
import { supabase } from '../supabaseClient'

const Cover = ({v}) => String(v||'').startsWith('http') ? <img src={v} alt="" className="h-32 w-full object-cover rounded-lg mb-2"/> : <div className="text-5xl text-center bg-emerald-800/40 rounded-lg py-4 mb-2">{v||'🌱'}</div>
const TABS = [['shop','Cửa hàng'],['blog','Blog kỹ thuật'],['care','Lịch chăm sóc'],['mix','Trồng xen canh'],['scan','Quét bệnh AI'],['geo','Bản đồ thổ nhưỡng'],['garden','Setup vườn AI'],['cart','Giỏ hàng']]

export default function CustomerView({c}) {
  const {products, posts, cart, setCart, orders, setOrders, q, tab, setTab, setDrawer} = c
  const [bc, setBc] = useState('Tất cả')
  const [f, setF] = useState({cat:'', diff:'', season:'', max:0})
  const [sel, setSel] = useState(null)
  const [code, setCode] = useState('')
  const [modal, setModal] = useState(false)
  const [info, setInfo] = useState({name:'', phone:'', addr:''})
  const [ok, setOk] = useState('')

  const seeds = products.filter(p => p.days > 0)
  const uniq = k => [...new Set(products.map(p => p[k]))]
  const list = products.filter(p => p.name.toLowerCase().includes(q.toLowerCase()) && (!f.cat || p.cat === f.cat) && (!f.diff || p.diff === f.diff) && (!f.season || p.season === f.season) && (!f.max || p.days <= f.max))
  
  const add = p => {
    setDrawer(true)
    setCart(c => c.find(i => i.id === p.id) ? c.map(i => i.id === p.id ? {...i, qty: i.qty + 1} : i) : [...c, {id: p.id, qty: 1}])
  }

  const items = cart.map(i => ({...i, p: products.find(p => p.id === i.id)})).filter(i => i.p)
  const sub = items.reduce((s, i) => s + i.p.price * i.qty, 0)
  const disc = code.toUpperCase() === 'XANH10' ? sub * .1 : 0
  const total = sub - disc

  // 1. Tự động lấy số điện thoại và địa chỉ cũ của khách khi họ đăng nhập
  useEffect(() => {
    if (c.user) {
      fetchSavedAddress()
    }
  }, [c.user])

  const fetchSavedAddress = async () => {
    try {
      const { data, error } = await supabase
        .from('addresses')
        .select('*')
        .eq('user_id', c.user.id)
        .order('created_at', { ascending: false })
        .limit(1)

      if (!error && data && data.length > 0) {
        setInfo(prev => ({
          ...prev,
          name: data[0].recipient_name || prev.name,
          phone: data[0].phone || prev.phone,
          addr: data[0].address_line || prev.addr,
        }))
      }
    } catch (err) {
      console.error('Lỗi tải địa chỉ đã lưu:', err)
    }
  }

  // 2. Hàm đặt hàng chuẩn xác đẩy lên Supabase
  const order = async () => {
    if (!info.name || !info.phone || !info.addr) return alert('Vui lòng nhập đủ thông tin.')
    
    const id = 'DH' + Date.now().toString().slice(-6)
    const newOrderData = {
      id, 
      customer: info.name, 
      phone: info.phone, 
      address: info.addr, 
      items: items.map(i => ({name: i.p.name, qty: i.qty})), 
      total: total,
      total_amount: total,
      status: 'Chờ xác nhận', // giữ như greenseed(7): trạng thái đầu tiên trong STATUSES
      date: new Date().toLocaleDateString('vi-VN'), // giữ như greenseed(7): trang Người bán hiển thị ngày đặt
      created_at: new Date().toISOString()
    };

    try {
      // Đẩy đơn hàng lên Supabase để đồng bộ với trang quản lý của người bán và tài khoản
      const { error: ordError } = await supabase
        .from('orders')
        .insert([
          {
            id: id,
            user_id: c.user ? c.user.id : null,
            customer: info.name,
            phone: info.phone,
            address: info.addr,
            shipping_address: info.addr,
            items: items.map(i => ({name: i.p.name, qty: i.qty})),
            total: total,
            total_amount: total,
            status: 'Đang xử lý'
          }
        ]);

      if (ordError) {
        console.error('Lỗi khi lưu đơn lên Supabase:', ordError.message);
      }

      setOrders([newOrderData, ...orders]);

      if (c.user) {
        const { data: existing } = await supabase
          .from('addresses')
          .select('id')
          .eq('user_id', c.user.id)
          .eq('address_line', info.addr)
          .eq('phone', info.phone);

        if (!existing || existing.length === 0) {
          await supabase.from('addresses').insert([{
            user_id: c.user.id,
            recipient_name: info.name,
            phone: info.phone,
            address_line: info.addr,
            city: 'Mặc định'
          }]);
        }
      }

      setCart([])
      setModal(false)
      setOk(id)

    } catch (err) {
      console.error('Lỗi đặt hàng:', err);
      alert('Có lỗi xảy ra khi đặt hàng.');
    }
  }

  const Sel = ({k, l, opts}) => (
    <select className="inp w-auto" value={f[k]} onChange={e => setF({...f, [k]: e.target.value})}>
      <option value="">{l}</option>
      {opts.map(o => <option key={o}>{o}</option>)}
    </select>
  )

  return (
    <>
      {tab === 'shop' && <Hero3D onExplore={() => document.getElementById('products')?.scrollIntoView({behavior: 'smooth'})} onGuide={() => setTab('care')}/>}
      <div className="max-w-6xl mx-auto px-4 py-6 space-y-5">
        <div className="flex gap-2 flex-wrap">
          {TABS.map(([k, l]) => (
            <button key={k} onClick={() => setTab(k)} className={`px-4 py-2 rounded-full text-sm ${tab === k ? 'bg-emerald-600 text-white' : 'bg-slate-900 text-slate-300 border border-emerald-800'}`}>
              {l}{k === 'cart' && cart.length ? ` (${cart.length})` : ''}
            </button>
          ))}
        </div>

        {ok && <div className="bg-emerald-800 p-3 rounded-lg text-sm">Đặt hàng thành công! Mã đơn: <b>{ok}</b></div>}
        
        {tab === 'blog' && <BlogView posts={posts} products={products} add={add}/>}
        {tab === 'care' && <CareTimeline products={seeds}/>}
        {tab === 'mix' && <CompanionPlanting products={seeds}/>}
        {tab === 'scan' && <AIDiseaseScanner products={products} add={add}/>}
        {tab === 'geo' && <GeoSmartPlanter products={products} add={add}/>}
        {tab === 'garden' && <AIGardenPlanner products={products} add={add}/>}
        
        {tab === 'cart' && (
          <div className="card space-y-3">
            {!items.length ? <p>Giỏ hàng đang trống. Hãy chọn vài hạt giống ở Cửa hàng.</p> : (
              <>
                {items.map(i => (
                  <div key={i.id} className="flex items-center gap-3 border-b border-emerald-900/60 pb-2">
                    <span className="text-3xl">{i.p.emoji}</span>
                    <div className="flex-1">
                      <b>{i.p.name}</b>
                      <div className="text-sm text-lime-400">{vnd(i.p.price)}</div>
                    </div>
                    <input type="number" min="1" max={i.p.stock} value={i.qty} className="inp w-20" onChange={e => setCart(cart.map(x => x.id === i.id ? {...x, qty: Math.max(1, +e.target.value || 1)} : x))}/>
                    <button className="text-red-400 text-sm" onClick={() => setCart(cart.filter(x => x.id !== i.id))}>Xóa</button>
                  </div>
                ))}
                <input className="inp max-w-xs" placeholder="Mã giảm giá (thử XANH10)" value={code} onChange={e => setCode(e.target.value)}/>
                <p>Tạm tính: {vnd(sub)}{disc > 0 && <> • Giảm: -{vnd(disc)}</>}</p>
                <p className="text-xl font-bold text-lime-400">Tổng: {vnd(total)}</p>
                <button className="btn" onClick={() => setModal(true)}>Đặt hàng</button>
              </>
            )}
          </div>
        )}

        {sel && (
          <div className="fixed inset-0 bg-black/50 grid place-items-center p-4 z-30" onClick={() => setSel(null)}>
            <div className="card max-w-md w-full space-y-2" onClick={e => e.stopPropagation()}>
              <div className="text-6xl text-center">{sel.emoji}</div>
              <h3 className="font-bold text-xl">{sel.name}</h3>
              <ul className="text-sm space-y-1">
                <li>Tỉ lệ nảy mầm: <b>{sel.germ}%</b></li>
                <li>Độ pH đất: <b>{sel.ph}</b></li>
                <li>Nhiệt độ thích hợp: <b>{sel.temp}</b></li>
                <li>Ánh sáng: <b>{sel.light}</b></li>
                <li>Mùa vụ: <b>{sel.season}</b> • Thu hoạch: <b>{sel.days} ngày</b></li>
                <li>Còn lại: {sel.stock}</li>
              </ul>
              <div className="flex gap-2">
                <button className="btn" onClick={() => { add(sel); setSel(null) }}>Thêm vào giỏ</button>
                <button className="btn2" onClick={() => setSel(null)}>Đóng</button>
              </div>
            </div>
          </div>
        )}

        {modal && (
          <div className="fixed inset-0 bg-black/50 grid place-items-center p-4 z-30">
            <div className="card max-w-md w-full space-y-2">
              <h3 className="font-bold">Thông tin giao hàng</h3>
              <input className="inp" placeholder="Họ tên" value={info.name} onChange={e => setInfo({...info, name: e.target.value})}/>
              <input className="inp" placeholder="Số điện thoại" value={info.phone} onChange={e => setInfo({...info, phone: e.target.value})}/>
              <input className="inp" placeholder="Địa chỉ" value={info.addr} onChange={e => setInfo({...info, addr: e.target.value})}/>
              <p className="font-bold text-lime-400">Thanh toán khi nhận hàng: {vnd(total)}</p>
              <div className="flex gap-2">
                <button className="btn" onClick={order}>Xác nhận đặt hàng</button>
                <button className="btn2" onClick={() => setModal(false)}>Hủy</button>
              </div>
            </div>
          </div>
        )}
      </div>
      {tab === 'shop' && <StoreSection products={products} q={q} add={add}/>}
    </>
  )
}