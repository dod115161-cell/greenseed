import { useState, useMemo } from 'react'
import { vnd } from '../data/mockData'
import { PROVINCES, sowMonths } from '../data/calendar'
import {
  PLANS, PAY_METHODS, CYCLE_DAYS, ONE_OFF_MARKUP,
  todayISO, addDays, viDate, subOrder, runRenewals,
} from '../data/services'

// Tỉnh khách đã chọn ở trang Thời tiết & Lịch gieo (để chọn hạt giống đúng mùa)
const savedProvince = () => {
  try { return PROVINCES.find(p => p.n === localStorage.getItem('gs_province')) || null } catch { return null }
}
const monthOf = iso => Number(iso.split('-')[1])

// Gợi ý hạt giống "mùa mới" cho tháng giao hàng tại vùng của khách
function seasonalSeeds(products, group, month, n) {
  return products
    .filter(p => p.days > 0 && sowMonths(p, group).includes(month))
    .sort((a, b) => b.germ - a.germ)
    .slice(0, n)
}

export default function SubscriptionBox({ products, subs, setSubs, orders, setOrders, addCart, user }) {
  const prov = savedProvince() || PROVINCES.find(p => p.n === 'TP. Hồ Chí Minh') || PROVINCES[0]
  const last = orders.find(o => o.address) || {}
  const [planId, setPlanId] = useState('std')
  const [form, setForm] = useState(null) // null = đang đóng form đăng ký
  const [msg, setMsg] = useState('')
  const plan = PLANS.find(p => p.id === planId)

  const firstDelivery = addDays(todayISO(), 2)
  const seedsFor = (p, iso) => seasonalSeeds(products, prov.g, monthOf(iso), p.seeds)
  const preview = useMemo(() => seedsFor(plan, firstDelivery), [plan, products]) // eslint-disable-line react-hooks/exhaustive-deps

  const openForm = () => setForm({
    name: last.customer || user?.user_metadata?.full_name || '',
    phone: last.phone || '', address: last.address || '', pay: PAY_METHODS[0],
  })

  // Mua lẻ 1 hộp (đột xuất) -> cho vào giỏ hàng như sản phẩm bình thường
  const buyOnce = p => {
    addCart({ id: 'box-' + p.id, name: `${p.icon} Hộp vật tư ${p.name} (mua 1 lần)`, price: Math.round(p.price * ONE_OFF_MARKUP / 1000) * 1000, emoji: p.icon })
    setMsg(`Đã thêm hộp ${p.name} vào giỏ hàng.`)
  }

  // Đăng ký định kỳ: trừ tiền kỳ đầu + tạo đơn giao đầu tiên
  const subscribe = () => {
    if (!form.name.trim() || !form.phone.trim() || !form.address.trim()) return alert('Vui lòng nhập đủ họ tên, số điện thoại và địa chỉ.')
    const today = todayISO()
    const sub = {
      id: 'GOI' + Date.now().toString().slice(-6), planId, ...form,
      status: 'Đang hoạt động', start: today, nextDate: addDays(today, CYCLE_DAYS),
      userEmail: user?.email || '', history: [],
    }
    const o = subOrder(sub, plan, 'kỳ đầu tiên')
    sub.history.unshift({ date: today, amount: plan.price, orderId: o.id, kind: 'Kỳ đầu tiên' })
    setOrders([o, ...orders])
    setSubs([sub, ...subs])
    setForm(null)
    setMsg(`🎉 Đăng ký gói ${plan.name} thành công! Đã trừ ${vnd(plan.price)} (${form.pay}). Đơn ${o.id} sẽ giao ngày ${viDate(firstDelivery)}.`)
  }

  const update = (id, patch) => setSubs(subs.map(s => s.id === id ? { ...s, ...patch } : s))

  const pause = s => update(s.id, { status: 'Tạm dừng' })
  const resume = s => update(s.id, { status: 'Đang hoạt động', nextDate: s.nextDate < todayISO() ? addDays(todayISO(), 1) : s.nextDate })
  const skip = s => update(s.id, { nextDate: addDays(s.nextDate, CYCLE_DAYS) })
  const cancel = s => { if (confirm('Hủy gói định kỳ? Bạn sẽ không bị trừ tiền ở các kỳ sau.')) update(s.id, { status: 'Đã hủy' }) }
  const changePlan = (s, id) => update(s.id, { planId: id })

  // Giao thêm 1 hộp đột xuất ngay (ngoài lịch 30 ngày)
  const extra = s => {
    const p = PLANS.find(x => x.id === s.planId)
    const o = subOrder(s, p, 'giao đột xuất')
    setOrders([o, ...orders])
    update(s.id, { history: [{ date: todayISO(), amount: p.price, orderId: o.id, kind: 'Giao đột xuất' }, ...(s.history || [])] })
    setMsg(`Đã tạo đơn đột xuất ${o.id} (${vnd(p.price)}).`)
  }

  // Nút demo: tua thời gian tới ngày giao kế tiếp để xem tự động trừ tiền hoạt động
  const simulate = s => {
    const { subs: [renewed], newOrders } = runRenewals([s], s.nextDate)
    if (!newOrders.length) return setMsg('Gói đang tạm dừng hoặc đã hủy nên không trừ tiền.')
    setSubs(subs.map(x => x.id === s.id ? renewed : x))
    setOrders([...newOrders, ...orders])
    setMsg(`⏩ Mô phỏng ngày ${viDate(s.nextDate)}: đã tự động trừ ${vnd(newOrders[0].total)} và tạo đơn ${newOrders[0].id}.`)
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-6 space-y-5">
      <div className="card">
        <h2 className="font-bold text-2xl">📦 Gói vật tư làm vườn định kỳ</h2>
        <p className="text-sm text-slate-400 mt-1">
          Mỗi {CYCLE_DAYS} ngày GreenSeed tự giao tận nhà: đất sạch, phân hữu cơ, hạt giống mùa mới và thuốc sinh học. Tự động trừ tiền, tạm dừng hoặc hủy bất cứ lúc nào.
        </p>
        <p className="text-xs text-slate-500 mt-1">Hạt giống được chọn theo lịch gieo của <b>{prov.n}</b> (đổi khu vực ở trang "Thời tiết & Lịch gieo").</p>
      </div>

      {msg && <div className="bg-emerald-800 p-3 rounded-lg text-sm">{msg}</div>}

      {/* ---- Bảng giá các gói ---- */}
      <div className="grid md:grid-cols-3 gap-4">
        {PLANS.map(p => (
          <div key={p.id} onClick={() => setPlanId(p.id)}
            className={`card cursor-pointer flex flex-col ${planId === p.id ? 'ring-2 ring-lime-400' : ''}`}>
            <div className="flex items-center justify-between">
              <span className="text-4xl">{p.icon}</span>
              <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-900 text-lime-400">{p.tag}</span>
            </div>
            <h3 className="font-bold text-lg mt-2">{p.name}</h3>
            <p className="text-2xl font-bold text-lime-400">{vnd(p.price)}<span className="text-sm text-slate-400 font-normal"> / {CYCLE_DAYS} ngày</span></p>
            <ul className="text-sm space-y-1 mt-2 flex-1">{p.items.map(i => <li key={i}>✓ {i}</li>)}</ul>
            <div className="flex gap-2 mt-3">
              <button className="btn flex-1" onClick={e => { e.stopPropagation(); setPlanId(p.id); openForm() }}>Đăng ký định kỳ</button>
              <button className="btn2" title="Mua lẻ 1 hộp, không định kỳ" onClick={e => { e.stopPropagation(); buyOnce(p) }}>Mua 1 lần</button>
            </div>
            <p className="text-xs text-slate-500 mt-1">Mua 1 lần: {vnd(Math.round(p.price * ONE_OFF_MARKUP / 1000) * 1000)} (định kỳ tiết kiệm 15%)</p>
          </div>
        ))}
      </div>

      {/* ---- Xem trước hạt giống trong hộp ---- */}
      <div className="card">
        <h3 className="font-bold">🌱 Hạt giống mùa mới trong hộp {plan.name} (giao tháng {monthOf(firstDelivery)})</h3>
        {!preview.length
          ? <p className="text-sm text-slate-400 mt-1">Tháng này chưa có giống đúng mùa, hộp sẽ thay bằng hạt giống "Quanh năm".</p>
          : <div className="flex flex-wrap gap-2 mt-2">{preview.map(p => <span key={p.id} className="px-3 py-1 rounded-full bg-slate-800 text-sm">{p.emoji} {p.name}</span>)}</div>}
      </div>

      {/* ---- Form đăng ký ---- */}
      {form && (
        <div className="fixed inset-0 bg-black/50 grid place-items-center p-4 z-30" onClick={() => setForm(null)}>
          <div className="card max-w-md w-full space-y-2" onClick={e => e.stopPropagation()}>
            <h3 className="font-bold">Đăng ký gói {plan.icon} {plan.name} - {vnd(plan.price)}/{CYCLE_DAYS} ngày</h3>
            <input className="inp" placeholder="Họ tên" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
            <input className="inp" placeholder="Số điện thoại" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} />
            <input className="inp" placeholder="Địa chỉ giao hàng" value={form.address} onChange={e => setForm({ ...form, address: e.target.value })} />
            <select className="inp" value={form.pay} onChange={e => setForm({ ...form, pay: e.target.value })}>
              {PAY_METHODS.map(m => <option key={m}>{m}</option>)}
            </select>
            <p className="text-xs text-slate-400">Kỳ đầu giao ngày {viDate(firstDelivery)}. Kỳ tiếp theo tự động trừ tiền ngày {viDate(addDays(todayISO(), CYCLE_DAYS))}.</p>
            <p className="text-xs text-amber-400">Bản demo: chỉ mô phỏng việc trừ tiền, không kết nối cổng thanh toán thật.</p>
            <div className="flex gap-2">
              <button className="btn" onClick={subscribe}>Xác nhận & thanh toán kỳ đầu</button>
              <button className="btn2" onClick={() => setForm(null)}>Hủy</button>
            </div>
          </div>
        </div>
      )}

      {/* ---- Gói của tôi ---- */}
      <div className="card space-y-3">
        <h3 className="font-bold text-lg">🗂️ Gói định kỳ của tôi</h3>
        {!subs.length && <p className="text-sm text-slate-400">Bạn chưa đăng ký gói nào.</p>}
        {subs.map(s => {
          const p = PLANS.find(x => x.id === s.planId) || PLANS[0]
          const active = s.status === 'Đang hoạt động'
          return (
            <div key={s.id} className="border-t border-emerald-900/60 pt-3 space-y-2 text-sm">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span><b>{s.id}</b> • {p.icon} {p.name} • {vnd(p.price)}/{CYCLE_DAYS} ngày</span>
                <span className={`px-2 py-0.5 rounded-full text-xs ${active ? 'bg-emerald-700' : s.status === 'Đã hủy' ? 'bg-red-900/60' : 'bg-amber-800'}`}>{s.status}</span>
              </div>
              {s.status !== 'Đã hủy' && (
                <p className="text-xs text-slate-400">
                  {active ? <>Kỳ tiếp theo: tự động trừ tiền & giao ngày <b className="text-lime-400">{viDate(s.nextDate)}</b> • </> : 'Đang tạm dừng, không trừ tiền • '}
                  {s.pay} • Giao tới: {s.address}
                </p>
              )}
              {s.status !== 'Đã hủy' && (
                <div className="flex flex-wrap gap-2">
                  <select className="inp w-auto" value={s.planId} onChange={e => changePlan(s, e.target.value)}>
                    {PLANS.map(x => <option key={x.id} value={x.id}>Đổi sang: {x.name}</option>)}
                  </select>
                  {active ? <>
                    <button className="btn2" onClick={() => skip(s)}>Bỏ qua kỳ tới</button>
                    <button className="btn2" onClick={() => pause(s)}>Tạm dừng</button>
                    <button className="btn2" onClick={() => extra(s)}>Giao đột xuất 1 hộp</button>
                    <button className="btn2" onClick={() => simulate(s)} title="Dùng để thử tính năng tự động gia hạn">⏩ Mô phỏng tới kỳ sau</button>
                  </> : <button className="btn2" onClick={() => resume(s)}>Tiếp tục gói</button>}
                  <button className="text-red-400 text-xs" onClick={() => cancel(s)}>Hủy gói</button>
                </div>
              )}
              {s.history?.length > 0 && (
                <details className="text-xs">
                  <summary className="cursor-pointer text-slate-400">Lịch sử thanh toán ({s.history.length})</summary>
                  <ul className="mt-1 space-y-0.5">
                    {s.history.map(h => <li key={h.orderId}>{viDate(h.date)} • {h.kind} • {vnd(h.amount)} • đơn {h.orderId}</li>)}
                  </ul>
                </details>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
