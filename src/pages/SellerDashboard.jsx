/*import {vnd,STATUSES} from '../data/mockData'
import ProductManager from '../components/ProductManager'
export default function SellerDashboard({c}){
const {products,orders,setOrders}=c
const rev=orders.reduce((s,o)=>s+o.total,0),low=products.filter(p=>p.stock<=10)
return(<div className="max-w-6xl mx-auto px-4 py-6 space-y-6">
<div className="grid grid-cols-2 md:grid-cols-4 gap-3">{[['Doanh số',vnd(rev)],['Đơn hàng',orders.length],['Sản phẩm',products.length],['Sắp hết kho',low.length]].map(([a,b])=><div key={a} className="card"><p className="text-sm">{a}</p><p className="text-xl font-bold text-lime-400">{b}</p></div>)}</div>
{low.length>0&&<p className="bg-emerald-800 p-3 rounded-lg text-sm">Sắp hết hàng: {low.map(p=>`${p.name} (${p.stock})`).join(', ')}</p>}
<ProductManager c={c}/>
<section className="card"><h3 className="font-bold mb-3">Đơn hàng</h3>{!orders.length&&<p className="text-sm">Chưa có đơn hàng. Hãy đặt thử ở giao diện Khách hàng.</p>}
{orders.map(o=><div key={o.id} className="flex flex-wrap items-center justify-between gap-2 border-t border-emerald-900/60 py-2 text-sm"><span><b>{o.id}</b> • {o.customer} • {o.items.map(i=>`${i.name} x${i.qty}`).join(', ')}</span><span className="text-lime-400 font-bold">{vnd(o.total)}</span>
<select className="inp w-auto" value={o.status} onChange={e=>setOrders(orders.map(x=>x.id===o.id?{...x,status:e.target.value}:x))}>{STATUSES.map(s=><option key={s}>{s}</option>)}</select></div>)}</section></div>)}
*/

/*import {vnd, STATUSES} from '../data/mockData'
import ProductManager from '../components/ProductManager'

export default function SellerDashboard({c}){
const {products,orders,setOrders}=c
const rev=orders.reduce((s,o)=>s+o.total,0),low=products.filter(p=>p.stock<=10)

return(
<div className="max-w-6xl mx-auto px-4 py-6 space-y-6">
  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
    {[['Doanh số',vnd(rev)],['Đơn hàng',orders.length],['Sản phẩm',products.length],['Sắp hết kho',low.length]].map(([a,b])=>(
      <div key={a} className="card">
        <p className="text-sm">{a}</p>
        <p className="text-xl font-bold text-lime-400">{b}</p>
      </div>
    ))}
  </div>

  {low.length>0&&<p className="bg-emerald-800 p-3 rounded-lg text-sm">Sắp hết hàng: {low.map(p=>`${p.name} (${p.stock})`).join(', ')}</p>}
  
  <ProductManager c={c}/>
  
  <section className="card space-y-3">
    <h3 className="font-bold mb-3">Quản lý đơn hàng</h3>
    {!orders.length && <p className="text-sm">Chưa có đơn hàng. Hãy đặt thử ở giao diện Khách hàng.</p>}
    
    {orders.map(o=>(
      <div key={o.id} className="flex flex-col md:flex-row flex-wrap items-start md:items-center justify-between gap-3 border-t border-emerald-900/60 py-3 text-sm">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <b className="text-lime-400">#{o.id}</b>
            <span className="text-slate-300 font-semibold">- {o.customer}</span>
            <span className="text-xs text-slate-400">({o.date})</span>
          </div>
          <p className="text-slate-300">Sản phẩm: {o.items.map(i=>`${i.name} x${i.qty}`).join(', ')}</p>
          <p className="text-xs text-slate-400">Địa chỉ: {o.address || 'Không có'} | SĐT: {o.phone || 'Không có'}</p>
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto justify-between">
          <span className="text-lime-400 font-bold">{vnd(o.total)}</span>
          <select 
            className="inp w-auto text-xs" 
            value={o.status} 
            onChange={e=>setOrders(orders.map(x=>x.id===o.id?{...x,status:e.target.value}:x))}
          >
            // Đảm bảo danh sách trạng thái có cả 'Đã hủy' nếu khách hủy 
            {Array.from(new Set([...STATUSES, o.status])).map(s=>(
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>
      </div>
    ))}
  </section>
</div>
)}
*/

import { useState } from 'react'
import { vnd, STATUSES } from '../data/mockData'
import ProductManager from '../components/ProductManager'

export default function SellerDashboard({ c }) {
  const { products, orders, setOrders } = c
  const rev = orders.reduce((s, o) => s + o.total, 0)
  const low = products.filter(p => p.stock <= 10)

  // State quản lý danh sách đấu giá của Seller
  const [auctions, setAuctions] = useState(() => {
    try {
      const saved = localStorage.getItem('gs_auctions_data')
      return saved ? JSON.parse(saved) : []
    } catch {
      return []
    }
  })

  // State form tạo phiên đấu giá mới
  const [form, setForm] = useState({
    title: '',
    seller: 'Trang Trại Của Tôi',
    emoji: '🌿',
    startPrice: '',
    step: '',
    minutes: '15',
    desc: ''
  })

  const [message, setMessage] = useState('')

  // Xử lý tạo phiên đấu giá
  const handleCreateAuction = (e) => {
    e.preventDefault()
    if (!form.title || !form.startPrice) {
      setMessage('⚠️ Vui lòng điền đầy đủ tên mặt hàng và giá khởi điểm!')
      return
    }

    const newAuction = {
      id: 'auc-' + Date.now(),
      type: 'forward',
      title: form.title,
      seller: form.seller,
      emoji: form.emoji,
      currentPrice: Number(form.startPrice),
      startPrice: Number(form.startPrice),
      step: Number(form.step) || 50000,
      bidsCount: 0,
      highestBidder: '',
      endTime: Date.now() + Number(form.minutes) * 60 * 1000,
      status: 'active',
      desc: form.desc || 'Lô giống chất lượng cao kiểm định từ nhà vườn.'
    }

    const updated = [newAuction, ...auctions]
    setAuctions(updated)
    try {
      localStorage.setItem('gs_auctions_data', JSON.stringify(updated))
    } catch {}

    setMessage('✅ Đăng phiên đấu giá thành công! Mặt hàng đã xuất hiện trực tiếp trên Sàn đấu giá[cite: 3].')
    setForm({ title: '', seller: 'Trang Trại Của Tôi', emoji: '🌿', startPrice: '', step: '', minutes: '15', desc: '' })
  }

  // Hủy/Xóa phiên đấu giá
  const handleDeleteAuction = (id) => {
    const updated = auctions.filter(a => a.id !== id)
    setAuctions(updated)
    try {
      localStorage.setItem('gs_auctions_data', JSON.stringify(updated))
    } catch {}
    setMessage('🗑️ Đã xóa phiên đấu giá.')
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-6 space-y-6">
      {/* Thống kê nhanh */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[['Doanh số', vnd(rev)], ['Đơn hàng', orders.length], ['Sản phẩm', products.length], ['Sắp hết kho', low.length]].map(([a, b]) => (
          <div key={a} className="card">
            <p className="text-sm">{a}</p>
            <p className="text-xl font-bold text-lime-400">{b}</p>
          </div>
        ))}
      </div>

      {low.length > 0 && (
        <p className="bg-emerald-800 p-3 rounded-lg text-sm">
          Sắp hết hàng: {low.map(p => `${p.name} (${p.stock})`).join(', ')}
        </p>
      )}

      {message && (
        <div className="p-3 bg-emerald-950/80 border border-lime-400/50 rounded-xl text-xs text-lime-300 flex justify-between items-center">
          <span>{message}</span>
          <button onClick={() => setMessage('')} className="text-slate-400 hover:text-white font-bold ml-2">✕</button>
        </div>
      )}

      {/* --- KHU VỰC QUẢN LÝ & TẠO PHIÊN ĐẤU GIÁ MỚI --- */}
      <section className="card space-y-4">
        <h3 className="font-bold text-base text-white flex items-center gap-2">
          🏷️ Quản Lý & Phát Hành Lô Giống Đấu Giá
        </h3>
        <p className="text-xs text-slate-400">Tạo các phiên đấu giá độc quyền để khách hàng sưu tầm giống cây hiếm.</p>

        <form onSubmit={handleCreateAuction} className="space-y-3 bg-slate-950/60 p-4 rounded-xl border border-emerald-900/40">
          <div className="grid md:grid-cols-2 gap-3 text-xs">
            <div>
              <label className="text-slate-400 block mb-1">Tên lô giống / Hạt giống hiếm</label>
              <input 
                type="text" 
                className="inp w-full"
                placeholder="VD: Lô giống Cà chua Trái Tim Var..."
                value={form.title}
                onChange={e => setForm({...form, title: e.target.value})}
              />
            </div>
            <div>
              <label className="text-slate-400 block mb-1">Biểu tượng (Emoji)</label>
              <input 
                type="text" 
                className="inp w-full"
                placeholder="🍅, 🌹, 🌳..."
                value={form.emoji}
                onChange={e => setForm({...form, emoji: e.target.value})}
              />
            </div>
            <div>
              <label className="text-slate-400 block mb-1">Giá khởi điểm (VNĐ)</label>
              <input 
                type="number" 
                className="inp w-full"
                placeholder="500000"
                value={form.startPrice}
                onChange={e => setForm({...form, startPrice: e.target.value})}
              />
            </div>
            <div>
              <label className="text-slate-400 block mb-1">Bước giá tối thiểu (VNĐ)</label>
              <input 
                type="number" 
                className="inp w-full"
                placeholder="50000"
                value={form.step}
                onChange={e => setForm({...form, step: e.target.value})}
              />
            </div>
            <div>
              <label className="text-slate-400 block mb-1">Thời gian diễn ra phiên</label>
              <select 
                className="w-full bg-slate-950 text-slate-200 text-xs rounded-xl border border-emerald-800 p-2.5"
                value={form.minutes}
                onChange={e => setForm({...form, minutes: e.target.value})}
              >
                <option value="2">2 phút (Để test nhanh)</option>
                <option value="15">15 phút</option>
                <option value="60">1 giờ</option>
                <option value="1440">24 giờ (1 ngày)</option>
              </select>
            </div>
            <div>
              <label className="text-slate-400 block mb-1">Tên nhà vườn / Trang trại</label>
              <input 
                type="text" 
                className="inp w-full"
                value={form.seller}
                onChange={e => setForm({...form, seller: e.target.value})}
              />
            </div>
          </div>

          <div>
            <label className="text-slate-400 block mb-1 text-xs">Mô tả chi tiết</label>
            <textarea 
              className="inp w-full h-16 text-xs"
              placeholder="Đặc điểm sinh học, tỉ lệ nảy mầm..."
              value={form.desc}
              onChange={e => setForm({...form, desc: e.target.value})}
            />
          </div>

          <button type="submit" className="w-full py-2.5 bg-lime-400 hover:bg-lime-300 text-slate-950 font-bold text-xs rounded-xl transition cursor-pointer">
            🚀 Đăng Lô Giống Lên Sàn Đấu Giá
          </button>
        </form>

        {/* Danh sách phiên đấu giá do seller đăng */}
        <div className="space-y-2 pt-2">
          <h4 className="text-xs font-bold text-slate-300">📋 Danh sách phiên bạn đang mở ({auctions.length})</h4>
          {auctions.length === 0 ? (
            <p className="text-xs text-slate-400">Chưa có phiên đấu giá nào được tạo.</p>
          ) : (
            auctions.map(item => (
              <div key={item.id} className="flex items-center justify-between bg-slate-950/40 p-3 rounded-xl border border-emerald-900/40 text-xs">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{item.emoji}</span>
                  <div>
                    <b className="text-white text-sm">{item.title}</b>
                    <p className="text-slate-400">Khởi điểm: {vnd(item.startPrice)} | Hiện tại: <span className="text-lime-400 font-bold">{vnd(item.currentPrice)}</span></p>
                  </div>
                </div>
                <button 
                  onClick={() => handleDeleteAuction(item.id)}
                  className="px-3 py-1.5 bg-red-900/60 hover:bg-red-800 text-red-200 rounded-lg border border-red-700 font-semibold cursor-pointer"
                >
                  Hủy phiên
                </button>
              </div>
            ))
          )}
        </div>
      </section>

      {/* Quản lý sản phẩm gốc của cửa hàng */}
      <ProductManager c={c} />
      
      {/* Quản lý đơn hàng */}
      <section className="card space-y-3">
        <h3 className="font-bold mb-3">Quản lý đơn hàng</h3>
        {!orders.length && <p className="text-sm">Chưa có đơn hàng. Hãy đặt thử ở giao diện Khách hàng.</p>}
        
        {orders.map(o => (
          <div key={o.id} className="flex flex-col md:flex-row flex-wrap items-start md:items-center justify-between gap-3 border-t border-emerald-900/60 py-3 text-sm">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <b className="text-lime-400">#{o.id}</b>
                <span className="text-slate-300 font-semibold">{o.customer}</span>
                <span className="text-xs text-slate-400">({o.date})</span>
              </div>
              <p className="text-slate-300">Sản phẩm: {o.items.map(i => `${i.name} x${i.qty}`).join(', ')}</p>
              <p className="text-xs text-slate-400">Địa chỉ: {o.address || 'Không có'} | SĐT: {o.phone || 'Không có'}</p>
            </div>

            <div className="flex items-center gap-3 w-full md:w-auto justify-between">
              <span className="text-lime-400 font-bold">{vnd(o.total)}</span>
              <select 
                className="inp w-auto text-xs" 
                value={o.status} 
                onChange={e => setOrders(orders.map(x => x.id === o.id ? {...x, status: e.target.value} : x))}
              >
                {Array.from(new Set([...STATUSES, o.status])).map(s => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>
          </div>
        ))}
      </section>
    </div>
  )
}