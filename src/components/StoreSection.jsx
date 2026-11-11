import { useState } from 'react'
import ComboSuggest from './ComboSuggest'
import { Eye, ShoppingCart, Star, X } from 'lucide-react'
import { vnd } from '../data/mockData'

const CATS = ['Tất cả', 'Rau củ', 'Hoa', 'Cây ăn trái', 'Hạt giống hữu cơ', 'Vật tư & dụng cụ']

const WHY = [
  ['Thuần chủng F1 & hữu cơ', 'Hạt giống được kiểm định không biến đổi gen, thích nghi tốt với khí hậu Việt Nam.'],
  ['Bảo quản chân không', 'Đóng gói khóa ẩm nhiều lớp giúp hạt giữ trạng thái ngủ tối ưu trước khi gieo.'],
  ['Đồng hành 1-1', 'Kỹ sư nông nghiệp tư vấn từ gieo mầm, bón phân đến thu hoạch qua Zalo/Hotline.']
]

const REV = [
  ['Hạt giống dâu tây nảy mầm sau 6 ngày, quả to và ngọt. Rất hài lòng với tư vấn tận tâm!', 'Chị Mai Phương', 'TP. Hồ Chí Minh'],
  ['Cà chua cherry sai quả trĩu cả ban công, bao bì có hướng dẫn gieo rất rõ ràng.', 'Anh Hoàng Nam', 'Hà Nội'],
  ['Cẩm tú cầu lên màu chuẩn đẹp như hình. GreenSeed đúng là chất lượng nhất.', 'Chị Thu Thảo', 'Đà Lạt']
]

const Pill = ({ on, ...p }) => (
  <button 
    {...p} 
    className={`text-xs font-semibold px-4 py-2 rounded-full border transition ${
      on 
        ? 'bg-emerald-600 text-white border-emerald-600' 
        : 'bg-slate-900 text-slate-300 border-emerald-800 hover:bg-emerald-900/60'
    }`} 
  />
)

export default function StoreSection({ products, q, add }) {
  const [openComboId, setOpenComboId] = useState(null)
  const [cat, setCat] = useState('Tất cả')
  const [diff, setDiff] = useState('')
  const [max, setMax] = useState(0)
  const [qv, setQv] = useState(null)

  const list = products.filter(p => 
    p.name.toLowerCase().includes(q.toLowerCase()) && 
    (cat === 'Tất cả' || p.cat === cat) && 
    (!diff || p.diff === diff) && 
    (!max || (p.days > 0 && p.days <= max))
  )

  const sel = 'bg-slate-900 text-slate-300 text-xs rounded-full border border-emerald-800 px-3 py-2'

  return (
    <div className="bg-slate-950 text-slate-100">
      <section id="products" className="max-w-6xl mx-auto px-4 py-16">
        <span className="text-lime-400 text-xs font-bold uppercase tracking-widest">Sản phẩm</span>
        <h2 className="font-serif text-3xl sm:text-4xl font-bold text-white mt-2 mb-6">Hạt giống bán chạy nhất</h2>
        
        <div className="flex flex-wrap gap-2 mb-8">
          {CATS.map(k => <Pill key={k} on={cat === k} onClick={() => setCat(k)}>{k}</Pill>)}
          <select className={sel} value={diff} onChange={e => setDiff(e.target.value)}>
            <option value="">Độ khó</option>
            <option>Dễ</option>
            <option>Trung bình</option>
            <option>Khó</option>
          </select>
          <select className={sel} value={max} onChange={e => setMax(+e.target.value)}>
            <option value={0}>Thời gian thu hoạch</option>
            <option value={45}>≤ 45 ngày</option>
            <option value={90}>≤ 90 ngày</option>
          </select>
        </div>

        {!list.length && <p className="text-slate-400">Không tìm thấy sản phẩm phù hợp. Hãy thử đổi bộ lọc.</p>}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {list.map(p => (
            <div key={p.id} className="bg-slate-900 border border-emerald-900/60 rounded-2xl p-4 flex flex-col justify-between hover:border-lime-400/50 transition group shadow-lg">
              <div>
                <div className="relative overflow-hidden rounded-xl mb-3 h-48">
                  {p.img ? (
                    <img src={p.img} alt={p.name} loading="lazy" className="w-full h-full object-cover group-hover:scale-105 transition duration-500" />
                  ) : (
                    <div className="h-full grid place-items-center text-7xl bg-emerald-950">{p.emoji}</div>
                  )}
                  {p.tag && (
                    <span className={`absolute top-2 left-2 ${p.tagColor} text-slate-950 text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase`}>
                      {p.tag}
                    </span>
                  )}
                  <button aria-label="Xem nhanh" onClick={() => setQv(p)} className="absolute bottom-2 right-2 bg-slate-950/80 hover:bg-lime-400 text-white hover:text-slate-950 w-8 h-8 rounded-full grid place-items-center border border-emerald-800">
                    <Eye size={14} />
                  </button>
                </div>

                {p.rating && (
                  <div className="flex items-center text-xs text-amber-400 mb-1">
                    <Star size={12} fill="currentColor" />
                    <span className="ml-1 text-slate-300 font-semibold">{p.rating}</span>
                    <span className="text-slate-500 ml-1">({p.reviews})</span>
                  </div>
                )}

                <h3 className="font-semibold text-white group-hover:text-lime-400 transition line-clamp-1">{p.name}</h3>
                <p className="text-xs text-slate-400 mt-1 line-clamp-2">
                  {p.desc || `${p.cat} • ${p.diff}${p.days ? ` • thu hoạch ${p.days} ngày` : ''}`}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-emerald-900/50 flex items-center justify-between">
                <span className="text-lime-400 font-bold">
                  {vnd(p.price)}
                  {p.oldPrice && <s className="text-xs text-slate-500 ml-2 font-normal">{vnd(p.oldPrice)}</s>}
                </span>
                <button 
                  disabled={!p.stock} 
                  onClick={() => add(p)} 
                  className="px-3.5 py-2 rounded-xl bg-emerald-950 hover:bg-lime-400 text-lime-400 hover:text-slate-950 disabled:opacity-40 border border-emerald-800 text-xs font-bold flex items-center gap-1.5"
                >
                  <ShoppingCart size={13} />{p.stock ? 'Thêm' : 'Hết hàng'}
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-gradient-to-b from-slate-950 via-emerald-950/60 to-slate-950 py-16">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="font-serif text-3xl font-bold text-white mb-8">Tại sao chọn GreenSeed?</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {WHY.map(([a, b]) => (
              <div key={a} className="bg-slate-900 border border-emerald-900/60 rounded-2xl p-6">
                <h3 className="font-semibold text-lime-400 mb-2">{a}</h3>
                <p className="text-sm text-slate-300">{b}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 border-t border-emerald-900/40">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="font-serif text-3xl font-bold text-white mb-8">Khu vườn xanh từ khách hàng</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {REV.map(([t, n, c]) => (
              <figure key={n} className="bg-slate-900 border border-emerald-900/60 rounded-2xl p-6">
                <blockquote className="text-sm text-slate-300 italic">“{t}”</blockquote>
                <figcaption className="mt-4 text-sm">
                  <b className="text-white">{n}</b>
                  <span className="text-slate-500"> • {c}</span>
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      {qv && (
        <div className="fixed inset-0 z-50 grid place-items-center p-4 bg-slate-950/80 backdrop-blur-md" onClick={() => setQv(null)}>
          <div className="relative bg-slate-900 border border-emerald-800 rounded-2xl p-6 max-w-2xl w-full grid md:grid-cols-2 gap-6 items-center" onClick={e => e.stopPropagation()}>
            <button aria-label="Đóng" className="absolute top-3 right-3 text-slate-400 hover:text-white" onClick={() => setQv(null)}>
              <X />
            </button>
            {qv.img ? (
              <img src={qv.img} alt={qv.name} className="w-full h-64 object-cover rounded-xl" />
            ) : (
              <div className="h-64 grid place-items-center text-8xl bg-emerald-950 rounded-xl">{qv.emoji}</div>
            )}
            <div>
              <span className="text-xs text-lime-400 uppercase font-bold">{qv.cat}</span>
              <h3 className="text-xl font-bold text-white mt-1">{qv.name}</h3>
              {qv.desc && <p className="text-slate-300 text-xs mt-3 whitespace-pre-line">{qv.desc}</p>}
              {qv.days > 0 && (
                <ul className="text-xs text-slate-300 mt-3 space-y-1">
                  {qv.origin && <li>Xuất xứ: <b>{qv.origin}</b></li>}
                  <li>Tỉ lệ nảy mầm: <b>{qv.germ}%</b> • pH đất: <b>{qv.ph}</b></li>
                  <li>Nhiệt độ: <b>{qv.temp}</b> • {qv.light}</li>
                  <li>Thu hoạch sau <b>{qv.days} ngày</b> • Mùa vụ: {qv.season}</li>
                </ul>
              )}
              <div className="mt-4 flex items-center justify-between">
                <span className="text-xl font-bold text-lime-400">
                  {vnd(qv.price)}
                  {qv.oldPrice && <s className="text-xs text-slate-500 ml-2 font-normal">{vnd(qv.oldPrice)}</s>}
                </span>
                <button className="px-5 py-2.5 rounded-xl bg-lime-400 hover:bg-lime-300 text-slate-950 font-bold text-xs" onClick={() => { add(qv); setQv(null) }}>
                  Thêm vào giỏ
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}