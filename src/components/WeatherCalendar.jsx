import { useState, useEffect, useMemo } from 'react'
import { vnd } from '../data/mockData'
import { PROVINCES, REGION_NAMES, sowMonths, scoreSeed, weatherText, matchProvince, weatherAlerts } from '../data/calendar'
import ComboSuggest from './ComboSuggest'

const MONTH = new Date().getMonth() + 1
const DAYS = ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7']

// Đọc / lưu tỉnh đã chọn lần trước (bọc try/catch phòng khi trình duyệt chặn localStorage)
const loadProvince = () => {
  try {
    const n = localStorage.getItem('gs_province')
    return PROVINCES.find(p => p.n === n) || PROVINCES[0]
  } catch { return PROVINCES[0] }
}

// Địa chỉ nhận hàng gần nhất trong các đơn đã đặt
const lastAddress = (orders = []) => orders.find(o => o.address)?.address || ''

// Lần đầu mở trang (chưa từng chọn tỉnh) -> thử đoán tỉnh từ địa chỉ nhận hàng
const hasSavedProvince = () => { try { return !!localStorage.getItem('gs_province') } catch { return false } }

export default function WeatherCalendar({ products, add, orders = [] }) {
  const seeds = useMemo(() => products.filter(p => p.days > 0), [products])
  const [prov, setProv] = useState(loadProvince)
  const [wx, setWx] = useState({ loading: true, error: '', data: null })
  const [gpsMsg, setGpsMsg] = useState('')
  const [openCombo, setOpenCombo] = useState(null)
  const [firstVisit] = useState(() => !hasSavedProvince())

  // ---------- 0. Tự nhận diện tỉnh từ địa chỉ nhận hàng (chỉ lần đầu) ----------
  useEffect(() => {
    if (!firstVisit) return
    const p = matchProvince(lastAddress(orders))
    if (p) { setProv(p); setGpsMsg('📦 Tự chọn theo địa chỉ nhận hàng của bạn: ' + p.n) }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const useShipAddress = () => {
    const addr = lastAddress(orders)
    if (!addr) return setGpsMsg('Bạn chưa có đơn hàng nào có địa chỉ nhận hàng. Hãy dùng GPS hoặc chọn thủ công.')
    const p = matchProvince(addr)
    if (!p) return setGpsMsg(`Chưa nhận ra tỉnh/thành trong địa chỉ "${addr}". Hãy chọn thủ công.`)
    setProv(p)
    setGpsMsg('📦 Theo địa chỉ nhận hàng: ' + p.n)
  }

  // ---------- 1. Gọi API thời tiết mỗi khi đổi tỉnh ----------
  useEffect(() => {
    try { localStorage.setItem('gs_province', prov.n) } catch {}
    const ctrl = new AbortController()
    setWx({ loading: true, error: '', data: null })
    const url =
      'https://api.open-meteo.com/v1/forecast' +
      `?latitude=${prov.lat}&longitude=${prov.lng}` +
      '&current=temperature_2m,relative_humidity_2m,precipitation,weather_code' +
      '&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_sum,wind_gusts_10m_max' +
      '&timezone=Asia%2FBangkok&forecast_days=7'
    fetch(url, { signal: ctrl.signal })
      .then(r => { if (!r.ok) throw new Error('HTTP ' + r.status); return r.json() })
      .then(data => setWx({ loading: false, error: '', data }))
      .catch(e => {
        if (e.name !== 'AbortError') setWx({ loading: false, error: 'Không tải được thời tiết (kiểm tra mạng). Lịch gieo vẫn hiển thị theo vùng.', data: null })
      })
    return () => ctrl.abort()
  }, [prov])

  // ---------- 2. GPS: chọn tỉnh gần nhất ----------
  const gps = () => {
    if (!navigator.geolocation) return setGpsMsg('Trình duyệt không hỗ trợ GPS.')
    navigator.geolocation.getCurrentPosition(
      pos => {
        const { latitude: a, longitude: b } = pos.coords
        const nearest = PROVINCES.reduce((x, y) =>
          Math.hypot(a - y.lat, b - y.lng) < Math.hypot(a - x.lat, b - x.lng) ? y : x)
        setProv(nearest)
        setGpsMsg('Khu vực gần bạn nhất: ' + nearest.n)
      },
      () => setGpsMsg('Không lấy được vị trí. Hãy chọn khu vực thủ công.')
    )
  }

  // ---------- 3. Tính toán từ dữ liệu thời tiết ----------
  const daily = wx.data?.daily
  const avgTemp = useMemo(() => {
    if (!daily) return null
    const t = daily.time.map((_, i) => (daily.temperature_2m_max[i] + daily.temperature_2m_min[i]) / 2)
    return t.reduce((s, x) => s + x, 0) / t.length
  }, [daily])

  const tips = []
  if (daily) {
    const maxT = Math.max(...daily.temperature_2m_max)
    const minT = Math.min(...daily.temperature_2m_min)
    const rain = daily.precipitation_sum.reduce((s, x) => s + x, 0)
    if (maxT >= 35) tips.push('🔥 Có ngày trên 35°C: gieo vào sáng sớm/chiều mát, che lưới 50% buổi trưa.')
    if (minT <= 13) tips.push('🥶 Đêm lạnh dưới 13°C: ủ ấm khay hạt, chọn giống chịu mát (xà lách, cải, dâu tây).')
    if (rain >= 80) tips.push('🌧️ Mưa nhiều trong 7 ngày: chọn chậu thoát nước tốt, hạn chế gieo trực tiếp ngoài đất trống.')
    if (rain < 5) tips.push('💧 Gần như không mưa: tưới đều, phủ gốc giữ ẩm.')
  }

  const ranked = useMemo(() =>
    seeds
      .map(p => ({ p, ...scoreSeed(p, prov.g, MONTH, avgTemp) }))
      .sort((a, b) => b.score - a.score),
    [seeds, prov, avgTemp])
  const good = ranked.filter(x => x.inWindow && x.score >= 60)
  const wait = ranked.filter(x => !x.inWindow || x.score < 60)

  const alerts = useMemo(() => weatherAlerts(daily), [daily])

  const label = s => (s >= 90 ? 'Rất phù hợp' : s >= 75 ? 'Phù hợp' : 'Có thể gieo')

  return (
    <div className="space-y-4">
      {/* ---- Chọn khu vực ---- */}
      <div className="card space-y-3">
        <h3 className="font-bold text-lg">Thời tiết & lịch gieo trồng theo vùng</h3>
        <div className="flex flex-wrap gap-2">
          <select className="inp max-w-xs" value={prov.n} onChange={e => setProv(PROVINCES.find(x => x.n === e.target.value))}>
            {PROVINCES.map(x => <option key={x.n}>{x.n}</option>)}
          </select>
          <button className="btn shrink-0" onClick={gps}>📍 Dùng GPS</button>
          <button className="btn2 shrink-0" onClick={useShipAddress}>📦 Theo địa chỉ nhận hàng</button>
        </div>
        {gpsMsg && <p className="text-sm">{gpsMsg}</p>}
        <p className="text-xs text-slate-400">{REGION_NAMES[prov.g]} • Tháng hiện tại: <b>tháng {MONTH}</b></p>
      </div>

      {/* ---- Thời tiết hiện tại + 7 ngày ---- */}
      <div className="card space-y-3">
        {wx.loading && <p className="text-sm">⏳ Đang tải thời tiết {prov.n}...</p>}
        {wx.error && <p className="text-sm text-amber-400">{wx.error}</p>}
        {wx.data && (
          <>
            {/* Cảnh báo thời tiết nguy hiểm cho khu vực */}
            {alerts.length > 0 ? (
              <div className="space-y-2">
                {alerts.map(a => (
                  <div key={a.title} className={`rounded-lg p-3 text-sm border ${a.level === 'danger' ? 'bg-red-950/60 border-red-700' : 'bg-amber-950/50 border-amber-700'}`}>
                    <p className="font-bold">{a.title} <span className="font-normal text-xs text-slate-300">• từ {a.day} • {prov.n}</span></p>
                    <p className="text-xs mt-1">👉 {a.advice}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs rounded-lg p-2 bg-emerald-950/60 border border-emerald-800">✅ 7 ngày tới tại {prov.n} không có rét đậm, mưa bão hay nắng nóng gay gắt.</p>
            )}
            <div className="flex items-center gap-4 flex-wrap">
              <span className="text-5xl">{weatherText(wx.data.current.weather_code)[1]}</span>
              <div>
                <p className="text-3xl font-bold text-lime-400">{Math.round(wx.data.current.temperature_2m)}°C</p>
                <p className="text-sm">{weatherText(wx.data.current.weather_code)[0]} • Độ ẩm {wx.data.current.relative_humidity_2m}%</p>
              </div>
              {avgTemp != null && <p className="text-xs text-slate-400 sm:ml-auto">Nhiệt độ TB 7 ngày tới: <b>{avgTemp.toFixed(1)}°C</b></p>}
            </div>
            <div className="grid grid-cols-4 sm:grid-cols-7 gap-2">
              {daily.time.map((t, i) => (
                <div key={t} className="bg-slate-800/60 rounded-lg p-2 text-center text-xs">
                  <p className="text-slate-400">{i === 0 ? 'Nay' : DAYS[new Date(t).getDay()]}</p>
                  <p className="text-xl">{weatherText(daily.weather_code[i])[1]}</p>
                  <p><b>{Math.round(daily.temperature_2m_max[i])}°</b> / {Math.round(daily.temperature_2m_min[i])}°</p>
                  <p className="text-sky-300">{daily.precipitation_sum[i]}mm</p>
                </div>
              ))}
            </div>
            {tips.length > 0 && <ul className="text-sm space-y-1">{tips.map(t => <li key={t}>{t}</li>)}</ul>}
          </>
        )}
      </div>

      {/* ---- Hạt giống nên gieo tháng này ---- */}
      <div className="card space-y-2">
        <h3 className="font-bold text-lg">🌱 Nên gieo tháng {MONTH} tại {prov.n}</h3>
        {!good.length && <p className="text-sm">Tháng này chưa có giống nào thật sự hợp tại {prov.n}. Xem lịch cả năm bên dưới để chọn tháng gieo.</p>}
        {good.map(({ p, score }) => (
          <div key={p.id} className="border-t border-emerald-900/60 py-2 space-y-2">
            <div className="flex items-center justify-between gap-2 text-sm">
              <span className="min-w-0">
                {p.emoji} <b>{p.name}</b> • {vnd(p.price)}
                <span className="block text-xs text-lime-400">{label(score)} ({score}/100) • cây ưa {p.temp} • thu hoạch sau {p.days} ngày</span>
              </span>
              <span className="flex gap-1 shrink-0">
                <button className="btn2" onClick={() => setOpenCombo(openCombo === p.id ? null : p.id)}>Combo</button>
                <button className="btn2" onClick={() => add(p)}>Thêm</button>
              </span>
            </div>
            {openCombo === p.id && <ComboSuggest key={p.id} seed={p} products={products} add={add} onDone={() => setOpenCombo(null)} />}
          </div>
        ))}
        {wait.length > 0 && (
          <details className="text-sm pt-2">
            <summary className="cursor-pointer text-slate-400">Chưa nên gieo tháng này ({wait.length})</summary>
            <ul className="mt-2 space-y-1">
              {wait.map(({ p, inWindow }) => (
                <li key={p.id} className="text-xs text-slate-300">
                  {p.emoji} {p.name} — {inWindow ? 'đang trong mùa nhưng nhiệt độ dự báo chưa hợp' : (sowMonths(p, prov.g).length ? 'nên gieo tháng ' + sowMonths(p, prov.g).join(', ') : 'không khuyến nghị tại vùng này')}
                </li>
              ))}
            </ul>
          </details>
        )}
      </div>

      {/* ---- Lịch cả năm ---- */}
      <div className="card">
        <h3 className="font-bold text-lg mb-2">📅 Lịch gieo trồng cả năm - {REGION_NAMES[prov.g]}</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-xs min-w-[640px]">
            <thead>
              <tr className="text-slate-400">
                <th className="text-left py-1 pr-2">Hạt giống</th>
                {Array.from({ length: 12 }, (_, i) => (
                  <th key={i} className={`px-1 ${i + 1 === MONTH ? 'text-lime-400' : ''}`}>T{i + 1}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {seeds.map(p => {
                const ms = sowMonths(p, prov.g)
                return (
                  <tr key={p.id} className="border-t border-emerald-900/60">
                    <td className="py-1 pr-2 whitespace-nowrap">{p.emoji} {p.name}</td>
                    {Array.from({ length: 12 }, (_, i) => (
                      <td key={i} className={`h-6 ${i + 1 === MONTH ? 'bg-lime-400/10' : ''}`}>
                        {ms.includes(i + 1) && <div className="h-4 rounded bg-emerald-500 mx-0.5" title={`Gieo được tháng ${i + 1}`} />}
                      </td>
                    ))}
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
        <p className="text-xs text-slate-500 mt-2">
          Ô xanh = khung tháng nên gieo. Số liệu tham khảo chung, thực tế còn phụ thuộc giống và vi khí hậu từng vườn. Thời tiết lấy từ Open-Meteo.
        </p>
      </div>
    </div>
  )
}
