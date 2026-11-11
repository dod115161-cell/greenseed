import { useState } from 'react'
import { vnd } from '../data/mockData'
import { PLANS, TECHS, BOOKING_STATUSES, SUB_STATUSES, CYCLE_DAYS, viDate } from '../data/services'

// Trang Người bán / Quản trị: quản lý lịch hẹn dịch vụ + gói định kỳ (MRR)
export default function ServiceAdmin({ bookings, setBookings, subs, setSubs }) {
  const [tab, setTab] = useState('book')
  const planOf = s => PLANS.find(p => p.id === s.planId) || PLANS[0]

  const activeSubs = subs.filter(s => s.status === 'Đang hoạt động')
  // MRR (Monthly Recurring Revenue) = doanh thu định kỳ hằng tháng từ các gói đang hoạt động
  const mrr = activeSubs.reduce((s, x) => s + planOf(x).price * (30 / CYCLE_DAYS), 0)
  const collected = subs.reduce((s, x) => s + (x.history || []).reduce((a, h) => a + h.amount, 0), 0)
  const pending = bookings.filter(b => b.status === 'Chờ xác nhận').length
  const bookRev = bookings.filter(b => b.status === 'Hoàn thành').reduce((s, b) => s + b.total, 0)

  const setB = (id, patch) => setBookings(bookings.map(b => b.id === id ? { ...b, ...patch } : b))
  const setS = (id, patch) => setSubs(subs.map(s => s.id === id ? { ...s, ...patch } : s))

  return (
    <div className="max-w-6xl mx-auto px-4 py-6 space-y-5">
      <h2 className="font-bold text-2xl">Dịch vụ tận nhà & Gói định kỳ</h2>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[['MRR (doanh thu định kỳ/tháng)', vnd(mrr)], ['Gói đang hoạt động', activeSubs.length], ['Lịch hẹn chờ xác nhận', pending], ['Doanh thu dịch vụ đã xong', vnd(bookRev)]].map(([a, b]) => (
          <div key={a} className="card"><p className="text-sm">{a}</p><p className="text-xl font-bold text-lime-400">{b}</p></div>
        ))}
      </div>
      <p className="text-xs text-slate-500">Tổng tiền đã thu từ gói định kỳ: {vnd(collected)}. Mỗi kỳ giao của gói cũng tự tạo 1 đơn trong mục "Đơn hàng" của Bảng điều khiển.</p>

      <div className="flex gap-2">
        {[['book', `Lịch hẹn dịch vụ (${bookings.length})`], ['subs', `Gói định kỳ (${subs.length})`]].map(([k, l]) => (
          <button key={k} onClick={() => setTab(k)} className={`px-4 py-2 rounded-full text-sm ${tab === k ? 'bg-emerald-600 text-white' : 'bg-slate-900 text-slate-300 border border-emerald-800'}`}>{l}</button>
        ))}
      </div>

      {tab === 'book' && (
        <section className="card">
          {!bookings.length && <p className="text-sm">Chưa có lịch hẹn. Hãy đặt thử ở giao diện Khách hàng → "Dịch vụ chăm sóc vườn".</p>}
          {bookings.map(b => (
            <div key={b.id} className="border-t border-emerald-900/60 py-2 text-sm flex flex-wrap items-center justify-between gap-2">
              <div className="min-w-0">
                <b>{b.id}</b> • {viDate(b.date)} {b.slot} • {b.name} • {b.phone}
                <p className="text-xs text-slate-400">{b.services.join(', ')} • {b.area} m² • {b.address}, {b.province}</p>
                {b.note && <p className="text-xs text-slate-500">Ghi chú: {b.note}</p>}
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-lime-400 font-bold">{vnd(b.total)}</span>
                <select className="inp w-auto" value={b.tech} onChange={e => setB(b.id, { tech: e.target.value, status: e.target.value && ['Chờ xác nhận', 'Đã xác nhận'].includes(b.status) ? 'Đã phân công KTV' : b.status })}>
                  <option value="">Chọn kỹ thuật viên</option>
                  {TECHS.map(t => <option key={t}>{t}</option>)}
                </select>
                <select className="inp w-auto" value={b.status} onChange={e => setB(b.id, { status: e.target.value })}>
                  {BOOKING_STATUSES.map(s => <option key={s}>{s}</option>)}
                </select>
              </div>
            </div>
          ))}
        </section>
      )}

      {tab === 'subs' && (
        <section className="card">
          {!subs.length && <p className="text-sm">Chưa có khách đăng ký gói định kỳ.</p>}
          {subs.map(s => {
            const p = planOf(s)
            return (
              <div key={s.id} className="border-t border-emerald-900/60 py-2 text-sm flex flex-wrap items-center justify-between gap-2">
                <div className="min-w-0">
                  <b>{s.id}</b> • {p.icon} {p.name} • {s.name} • {s.phone}
                  <p className="text-xs text-slate-400">Bắt đầu {viDate(s.start)} • Kỳ tới {s.status === 'Đang hoạt động' ? viDate(s.nextDate) : '-'} • {s.pay} • {(s.history || []).length} lần thanh toán</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-lime-400 font-bold">{vnd(p.price)}/kỳ</span>
                  <select className="inp w-auto" value={s.status} onChange={e => setS(s.id, { status: e.target.value })}>
                    {SUB_STATUSES.map(x => <option key={x}>{x}</option>)}
                  </select>
                </div>
              </div>
            )
          })}
        </section>
      )}
    </div>
  )
}
