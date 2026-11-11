import { useState, useMemo } from 'react'
import { vnd, COMPANION, CROPS } from '../data/mockData'
import { SIGNS, WIKI_DISEASES, DISEASE_GROUPS, diagnose } from '../data/wiki'

// ---------- Khối nhỏ dùng chung: danh sách sản phẩm điều trị + nút Thêm ----------
function TreatmentProducts({ list, products, add }) {
  const rows = list
    .map(([name, why]) => ({ p: products.find(x => x.name === name), why }))
    .filter(r => r.p)
  if (!rows.length) return null
  return (
    <div className="space-y-1">
      <h5 className="text-xs font-bold text-lime-400">🛒 Sản phẩm điều trị phù hợp</h5>
      {rows.map(({ p, why }) => (
        <div key={p.id} className="flex items-center justify-between gap-2 border-t border-emerald-900/60 py-1.5 text-sm">
          <span className="min-w-0">
            {p.emoji} <b>{p.name}</b> <b className="text-lime-400">{vnd(p.price)}</b>
            <span className="block text-xs text-slate-400">{why}</span>
          </span>
          <button className="btn2 shrink-0" onClick={() => add(p)}>Thêm</button>
        </div>
      ))}
      <button
        className="btn w-full mt-2"
        onClick={() => rows.forEach(r => add(r.p))}
      >
        Thêm cả bộ điều trị vào giỏ
      </button>
    </div>
  )
}

// ---------- Thẻ chi tiết 1 bệnh ----------
function DiseaseDetail({ d, products, add }) {
  return (
    <div className="space-y-2 text-sm">
      <p><b>Dấu hiệu:</b> {d.symptoms}</p>
      <p><b>Nguyên nhân:</b> {d.cause}</p>
      <p>🌿 <b>Xử lý hữu cơ / thủ công:</b> {d.organic}</p>
      <p>⚗️ <b>Khi bệnh nặng:</b> {d.chem}</p>
      <p>🛡️ <b>Phòng ngừa:</b> {d.prevention}</p>
      <TreatmentProducts list={d.products} products={products} add={add} />
    </div>
  )
}

// ---------- Tab 1: Bác sĩ cây trồng ----------
function PlantDoctor({ products, add }) {
  const seeds = products.filter(p => p.days > 0)
  const [selected, setSelected] = useState([])
  const [crop, setCrop] = useState('')
  const [photo, setPhoto] = useState(null)

  const toggle = id => setSelected(s => (s.includes(id) ? s.filter(x => x !== id) : [...s, id]))
  const results = useMemo(() => diagnose(selected, crop), [selected, crop])

  // Đọc ảnh người dùng chọn để xem lại bên cạnh kết quả (ảnh KHÔNG được gửi đi đâu)
  const pick = e => {
    const f = e.target.files[0]
    if (!f) return
    const r = new FileReader()
    r.onload = () => setPhoto(r.result)
    r.readAsDataURL(f)
  }

  return (
    <div className="grid lg:grid-cols-2 gap-4">
      <div className="card space-y-3">
        <h3 className="font-bold text-lg">Bác sĩ cây trồng</h3>
        <p className="text-sm text-slate-400">
          Chụp / tải ảnh lá để đối chiếu, rồi tick các dấu hiệu bạn nhìn thấy. Hệ thống sẽ xếp hạng các bệnh có khả năng cao nhất.
        </p>

        <div className="flex gap-3 items-center">
          <label className="cursor-pointer shrink-0">
            <div className="h-24 w-24 rounded-lg overflow-hidden bg-emerald-950 border border-emerald-800 grid place-items-center">
              {photo ? <img src={photo} alt="Ảnh lá của bạn" className="w-full h-full object-cover" /> : <span className="text-3xl">📷</span>}
            </div>
            <input type="file" accept="image/*" capture="environment" className="hidden" onChange={pick} />
          </label>
          <label className="text-xs flex-1">
            Loại cây (không bắt buộc)
            <select className="inp mt-1" value={crop} onChange={e => setCrop(e.target.value)}>
              <option value="">Chưa chọn</option>
              {seeds.map(p => <option key={p.id}>{p.name}</option>)}
            </select>
          </label>
        </div>

        <div className="space-y-1">
          {SIGNS.map(s => (
            <label key={s.id} className="flex items-start gap-2 text-sm cursor-pointer rounded-lg px-2 py-1 hover:bg-emerald-950/60">
              <input
                type="checkbox"
                className="mt-1 accent-lime-400"
                checked={selected.includes(s.id)}
                onChange={() => toggle(s.id)}
              />
              <span>{s.label}</span>
            </label>
          ))}
        </div>
        <button className="btn2" onClick={() => { setSelected([]); setPhoto(null) }}>Làm lại</button>
        <p className="text-xs text-slate-500">
          Kết quả dựa trên dấu hiệu bạn chọn (không phân tích ảnh). Chỉ mang tính tham khảo; với bệnh nặng hãy hỏi cán bộ khuyến nông.
        </p>
      </div>

      <div className="space-y-3">
        {!selected.length && <div className="card text-sm">Hãy tick ít nhất 1 dấu hiệu để xem chẩn đoán.</div>}
        {selected.length > 0 && !results.length && (
          <div className="card text-sm">Chưa tìm thấy bệnh khớp với loại cây và dấu hiệu này. Hãy thử bỏ chọn loại cây hoặc thêm dấu hiệu.</div>
        )}
        {results.map(({ d, score }, i) => (
          <div key={d.id} className={`card space-y-2 ${i === 0 ? 'border-lime-400/60' : ''}`}>
            <div className="flex justify-between items-start gap-2">
              <h4 className="font-bold text-lg">{d.emoji} {d.name}</h4>
              <span className="bg-emerald-800 px-2 py-1 rounded-full text-xs shrink-0">
                {i === 0 ? 'Khớp nhất' : 'Có thể'} • độ khớp dấu hiệu {score}%
              </span>
            </div>
            <span className="text-xs bg-emerald-800 px-2 py-0.5 rounded">{d.group}</span>
            <DiseaseDetail d={d} products={products} add={add} />
          </div>
        ))}
      </div>
    </div>
  )
}

// ---------- Tab 2: Thư viện bệnh cây ----------
function DiseaseLibrary({ products, add }) {
  const [q, setQ] = useState('')
  const [group, setGroup] = useState('Tất cả')
  const list = WIKI_DISEASES.filter(d =>
    (group === 'Tất cả' || d.group === group) &&
    (d.name + ' ' + d.sci + ' ' + d.symptoms).toLowerCase().includes(q.toLowerCase())
  )
  return (
    <div className="space-y-3">
      <div className="flex flex-wrap gap-2">
        <input className="inp max-w-xs" placeholder="Tìm bệnh, triệu chứng..." value={q} onChange={e => setQ(e.target.value)} />
        {['Tất cả', ...DISEASE_GROUPS].map(g => (
          <button
            key={g}
            onClick={() => setGroup(g)}
            className={`px-3 py-1.5 rounded-full text-xs border ${group === g ? 'bg-emerald-600 text-white border-emerald-600' : 'bg-slate-900 text-slate-300 border-emerald-800'}`}
          >
            {g}
          </button>
        ))}
      </div>
      {!list.length && <p className="text-sm text-slate-400">Không tìm thấy bài viết phù hợp.</p>}
      <div className="grid md:grid-cols-2 gap-3">
        {list.map(d => (
          <details key={d.id} className="card group">
            <summary className="cursor-pointer list-none flex items-center justify-between gap-2">
              <span className="font-bold">{d.emoji} {d.name}</span>
              <span className="text-xs bg-emerald-800 px-2 py-0.5 rounded shrink-0">{d.group}</span>
            </summary>
            <p className="text-xs italic text-slate-500 mt-1">{d.sci}</p>
            <div className="mt-3"><DiseaseDetail d={d} products={products} add={add} /></div>
          </details>
        ))}
      </div>
    </div>
  )
}

// ---------- Tab 3: Hồ sơ cây trồng ----------
function PlantProfiles({ products, add }) {
  const seeds = products.filter(p => p.days > 0)
  const [name, setName] = useState(seeds[0]?.name || '')
  const p = seeds.find(x => x.name === name)
  if (!p) return <p className="card text-sm">Chưa có dữ liệu hạt giống.</p>
  const comp = COMPANION[p.name]
  const diseases = WIKI_DISEASES.filter(d => d.hosts.includes(p.name))
  return (
    <div className="space-y-3">
      <select className="inp max-w-xs" value={name} onChange={e => setName(e.target.value)}>
        {seeds.map(s => <option key={s.id}>{s.name}</option>)}
      </select>
      <div className="grid md:grid-cols-2 gap-3">
        <div className="card space-y-1 text-sm">
          <h4 className="font-bold text-lg">{p.emoji} {p.name}</h4>
          <p className="text-xs text-slate-400">{p.cat} • độ khó: {p.diff}</p>
          <ul className="space-y-1 mt-2">
            <li>Tỉ lệ nảy mầm: <b>{p.germ}%</b></li>
            <li>Độ pH đất: <b>{p.ph}</b> • Nhiệt độ: <b>{p.temp}</b></li>
            <li>Ánh sáng: <b>{p.light}</b></li>
            <li>Thu hoạch sau: <b>{p.days} ngày</b> • Mùa vụ: <b>{p.season}</b></li>
          </ul>
          {CROPS[p.name] && <p className="pt-2"><b>Thu hoạch:</b> {CROPS[p.name].harvestTip}</p>}
          {CROPS[p.name] && <p><b>Luân canh:</b> {CROPS[p.name].rotation}</p>}
          <button className="btn mt-2" onClick={() => add(p)}>Thêm hạt giống vào giỏ</button>
        </div>
        <div className="space-y-3">
          {comp && (
            <div className="card text-sm space-y-1">
              <h4 className="font-bold">Trồng xen</h4>
              {comp.good.map(([a, b]) => <p key={a}>✅ <b>{a}</b>: {b}</p>)}
              {comp.bad.map(([a, b]) => <p key={a}>⚠️ <b>{a}</b>: {b}</p>)}
            </div>
          )}
          <div className="card text-sm space-y-1">
            <h4 className="font-bold">Bệnh thường gặp</h4>
            {!diseases.length && <p className="text-slate-400">Chưa có dữ liệu riêng cho cây này (xem thư viện bệnh chung).</p>}
            {diseases.map(d => <p key={d.id}>{d.emoji} <b>{d.name}</b>: {d.symptoms}</p>)}
          </div>
        </div>
      </div>
    </div>
  )
}

// ---------- Component chính (gắn vào tab 'wiki') ----------
const SUBS = [['doctor', '🩺 Bác sĩ cây trồng'], ['library', '📚 Thư viện bệnh cây'], ['profile', '🌱 Hồ sơ cây trồng']]

export default function AgriWiki({ products, add }) {
  const [sub, setSub] = useState('doctor')
  return (
    <div className="space-y-4">
      <div className="flex gap-2 flex-wrap">
        {SUBS.map(([k, l]) => (
          <button
            key={k}
            onClick={() => setSub(k)}
            className={`px-4 py-2 rounded-lg text-sm border ${sub === k ? 'bg-lime-400 text-slate-950 border-lime-400 font-semibold' : 'bg-slate-900 text-slate-300 border-emerald-800'}`}
          >
            {l}
          </button>
        ))}
      </div>
      {sub === 'doctor' && <PlantDoctor products={products} add={add} />}
      {sub === 'library' && <DiseaseLibrary products={products} add={add} />}
      {sub === 'profile' && <PlantProfiles products={products} add={add} />}
    </div>
  )
}
