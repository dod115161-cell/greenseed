import { useState, useMemo } from 'react'
import { vnd } from '../data/mockData'
import { PROVINCES } from '../data/calendar'
import { SERVICES, SLOTS, SLOT_CAPACITY, servicePrice, todayISO, addDays, viDate } from '../data/services'

// Trang khách hàng: đặt lịch kỹ thuật viên đến tận nhà
export default function GardenCareBooking({ bookings, setBookings, orders = [], user }) {
  const last = orders.find(o => o.address) || {}
  const [svcIds, setSvcIds] = useState(['survey'])
  const [f, setF] = useState({
    name: last.customer || '', phone: last.phone || '', address: last.address || '',
    province: PROVINCES.find(p => p.n === 'TP. Hồ Chí Minh')?.n || PROVINCES[0].n,
    area: 10, date: addDays(todayISO(), 1), slot: SLOTS[0], note: '',
  })
  const [ok, setOk] = useState('')
  const set = (k, v) => setF(x => ({ ...x, [k]: v }))

  const chosen = SERVICES.filter(s => svcIds.includes(s.id))
  const total = chosen.reduce((s, x) => s + servicePrice(x, f.area), 0)
  const hours = chosen.reduce((s, x) => s + x.hours, 0)

  // Mỗi khung giờ chỉ nhận tối đa SLOT_CAPACITY lịch (bằng số kỹ thuật viên)
  const used = useMemo(() => {
    const m = {}
    bookings.filter(b => b.status !== 'Đã hủy').forEach(b => { const k = b.date + '|' + b.slot; m[k] = (m[k] || 0) + 1 })
    return m
  }, [bookings])
  const left = slot => SLOT_CAPACITY - (used[f.date + '|' + slot] || 0)

  const toggle = id => setSvcIds(ids => ids.includes(id) ? ids.filter(x => x !== id) : [...ids, id])

  const submit = () => {
    if (!chosen.length) return alert('Hãy chọn ít nhất 1 dịch vụ.')
    if (!f.name.trim() || !f.phone.trim() || !f.address.trim()) return alert('Vui lòng nhập đủ họ tên, số điện thoại và địa chỉ.')
    if (!/^0\d{9,10}$/.test(f.phone.replace(/\s/g, ''))) return alert('Số điện thoại chưa đúng (VD: 0901234567).')
    if (f.date <= todayISO()) return alert('Vui lòng chọn ngày từ ngày mai trở đi.')
    if (left(f.slot) <= 0) return alert('Khung giờ này đã kín lịch. Hãy chọn giờ hoặc ngày khác.')
    const id = 'DV' + Date.now().toString().slice(-6)
    setBookings([{
      id, ...f, area: Number(f.area) || 0,
      services: chosen.map(s => s.name), total, hours,
      status: 'Chờ xác nhận', tech: '', userEmail: user?.email || '',
      createdAt: new Date().toLocaleString('vi-VN'),
    }, ...bookings])
    setOk(id)
    set('note', '')
  }

  const cancel = id => {
    if (!confirm('Bạn chắc chắn muốn hủy lịch hẹn này?')) return
    setBookings(bookings.map(b => b.id === id ? { ...b, status: 'Đã hủy' } : b))
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-6 space-y-5">
      <div className="card">
        <h2 className="font-bold text-2xl">🧑‍🌾 Dịch vụ chăm sóc vườn tận nhà</h2>
        <p className="text-sm text-slate-400 mt-1">Bận rộn? Đặt lịch, kỹ thuật viên GreenSeed sẽ đến tận nơi khảo sát sân thượng, lắp tưới tự động, cải tạo đất hoặc tỉa cành, trị bệnh cho vườn.</p>
      </div>

      {ok && <div className="bg-emerald-800 p-3 rounded-lg text-sm">✅ Đặt lịch thành công! Mã lịch hẹn: <b>{ok}</b>. Chúng tôi sẽ gọi xác nhận trong vòng 2 giờ làm việc.</div>}

      <div className="grid lg:grid-cols-5 gap-4">
        {/* ---- Chọn dịch vụ ---- */}
        <div className="lg:col-span-3 space-y-3">
          <h3 className="font-bold">1. Chọn dịch vụ (chọn được nhiều)</h3>
          <div className="grid sm:grid-cols-2 gap-3">
            {SERVICES.map(s => {
              const on = svcIds.includes(s.id)
              return (
                <button key={s.id} onClick={() => toggle(s.id)}
                  className={`card text-left transition ${on ? 'ring-2 ring-lime-400' : 'opacity-80 hover:opacity-100'}`}>
                  <div className="flex items-start gap-3">
                    <span className="text-3xl">{s.icon}</span>
                    <div className="flex-1">
                      <p className="font-bold">{s.name} {on && <span className="text-lime-400">✓</span>}</p>
                      <p className="text-xs text-slate-400 mt-1">{s.desc}</p>
                      <p className="text-xs text-lime-400 mt-2">
                        {s.perM2 ? `${vnd(s.perM2)}/m² (tối thiểu ${vnd(s.min)})` : `Trọn gói ${vnd(s.base)}`} • ~{s.hours} giờ
                      </p>
                    </div>
                  </div>
                </button>
              )
            })}
          </div>

          <h3 className="font-bold pt-2">2. Thời gian</h3>
          <div className="card space-y-3">
            <label className="text-sm block">Ngày hẹn
              <input type="date" className="inp mt-1" min={addDays(todayISO(), 1)} value={f.date} onChange={e => set('date', e.target.value)} />
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {SLOTS.map(s => {
                const n = left(s)
                return (
                  <button key={s} disabled={n <= 0} onClick={() => set('slot', s)}
                    className={`rounded-lg p-2 text-xs border ${f.slot === s ? 'bg-lime-400 text-slate-950 border-lime-400 font-bold' : 'border-emerald-800 bg-slate-800/60'} disabled:opacity-30`}>
                    {s}<br /><span className="opacity-80">{n > 0 ? `còn ${n} KTV` : 'kín lịch'}</span>
                  </button>
                )
              })}
            </div>
          </div>
        </div>

        {/* ---- Thông tin + tóm tắt ---- */}
        <div className="lg:col-span-2 space-y-3">
          <h3 className="font-bold">3. Thông tin liên hệ</h3>
          <div className="card space-y-2">
            <input className="inp" placeholder="Họ tên" value={f.name} onChange={e => set('name', e.target.value)} />
            <input className="inp" placeholder="Số điện thoại" value={f.phone} onChange={e => set('phone', e.target.value)} />
            <select className="inp" value={f.province} onChange={e => set('province', e.target.value)}>
              {PROVINCES.map(p => <option key={p.n}>{p.n}</option>)}
            </select>
            <input className="inp" placeholder="Địa chỉ (số nhà, đường, phường...)" value={f.address} onChange={e => set('address', e.target.value)} />
            <label className="text-sm block">Diện tích vườn (m²)
              <input type="number" min="1" className="inp mt-1" value={f.area} onChange={e => set('area', Math.max(0, +e.target.value || 0))} />
            </label>
            <textarea className="inp" rows="2" placeholder="Ghi chú: tầng mấy, có thang máy không, tình trạng cây..." value={f.note} onChange={e => set('note', e.target.value)} />
          </div>

          <div className="card space-y-1 text-sm">
            <p className="font-bold">Tạm tính</p>
            {!chosen.length && <p className="text-slate-400">Chưa chọn dịch vụ.</p>}
            {chosen.map(s => <p key={s.id} className="flex justify-between gap-2"><span>{s.icon} {s.name}</span><span>{vnd(servicePrice(s, f.area))}</span></p>)}
            <p className="text-xs text-slate-400">Thời gian dự kiến: ~{hours} giờ • {viDate(f.date)} • {f.slot}</p>
            <p className="text-xl font-bold text-lime-400 pt-1">{vnd(total)}</p>
            <p className="text-xs text-slate-500">Thanh toán sau khi hoàn thành. Phí khảo sát được trừ lại nếu bạn dùng dịch vụ khác.</p>
            <button className="btn w-full mt-2" onClick={submit}>Đặt lịch kỹ thuật viên</button>
          </div>
        </div>
      </div>

      {/* ---- Lịch hẹn của tôi ---- */}
      <div className="card space-y-2">
        <h3 className="font-bold text-lg">📋 Lịch hẹn của tôi</h3>
        {!bookings.length && <p className="text-sm text-slate-400">Bạn chưa đặt lịch nào.</p>}
        {bookings.map(b => (
          <div key={b.id} className="border-t border-emerald-900/60 pt-2 text-sm flex flex-wrap items-center justify-between gap-2">
            <div className="min-w-0">
              <b>{b.id}</b> • {viDate(b.date)} • {b.slot}
              <p className="text-xs text-slate-400">{b.services.join(', ')} • {b.area} m² • {b.address}, {b.province}</p>
              {b.tech && <p className="text-xs text-lime-400">Kỹ thuật viên: {b.tech}</p>}
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <span className="text-lime-400 font-bold">{vnd(b.total)}</span>
              <span className={`px-2 py-0.5 rounded-full text-xs ${b.status === 'Đã hủy' ? 'bg-red-900/60' : b.status === 'Hoàn thành' ? 'bg-emerald-700' : 'bg-slate-700'}`}>{b.status}</span>
              {!['Đã hủy', 'Hoàn thành'].includes(b.status) && <button className="text-red-400 text-xs" onClick={() => cancel(b.id)}>Hủy</button>}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
