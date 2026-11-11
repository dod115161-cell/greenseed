import { useState } from 'react'
import { vnd } from '../data/mockData'
import { buildCombo } from '../data/combos'

/**
 * Khung gợi ý combo cho 1 hạt giống.
 *
 * Dùng ở 2 nơi:
 *  - Cửa sổ xem nhanh sản phẩm (StoreSection): includeSeed = true
 *  - Giỏ hàng (CartDrawer): includeSeed = false + truyền cart,
 *    chỉ hiện những món CÒN THIẾU so với giỏ hiện tại.
 *
 * Nhớ truyền key={seed.id} khi dùng để state tick chọn được reset khi đổi cây.
 */
export default function ComboSuggest({ seed, products, add, cart, includeSeed = true, onDone }) {
  const all = buildCombo(seed, products, includeSeed)
  const inCart = new Set((cart || []).map(i => i.id))
  const rows = includeSeed ? all : all.filter(r => !inCart.has(r.p.id))

  // off = danh sách id sản phẩm đang BỎ tick (mục "gợi ý thêm" mặc định bỏ tick)
  const [off, setOff] = useState(() => all.filter(r => r.optional).map(r => r.p.id))
  const toggle = id => setOff(o => (o.includes(id) ? o.filter(x => x !== id) : [...o, id]))

  const picked = rows.filter(r => !off.includes(r.p.id))
  const total = picked.reduce((s, r) => s + r.p.price, 0)

  if (!rows.length) {
    return (
      <div className="rounded-xl border border-lime-400/40 bg-emerald-950/60 p-3 text-xs text-lime-300">
        ✓ {seed.name}: combo đã đủ vật tư trong giỏ hàng.
      </div>
    )
  }

  const addPicked = () => {
    picked.forEach(r => add(r.p))
    onDone && onDone()
  }

  return (
    <div className="rounded-xl border border-lime-400/40 bg-emerald-950/60 p-3 space-y-2">
      <div>
        <h4 className="font-bold text-sm text-lime-400">
          🎁 {includeSeed ? 'Combo trọn gói' : 'Hoàn thiện combo'} cho {seed.name}
        </h4>
        <p className="text-[11px] text-slate-400">
          Gợi ý tự động: đủ đất, chậu, phân bón và thuốc sinh học để trồng được ngay.
        </p>
      </div>

      <ul className="space-y-1">
        {rows.map(r => (
          <li key={r.p.id} className="flex items-center gap-2 text-xs">
            <input
              type="checkbox"
              checked={!off.includes(r.p.id)}
              onChange={() => toggle(r.p.id)}
              aria-label={`Chọn ${r.p.name}`}
              className="accent-lime-400"
            />
            <span className="text-lg">{r.p.emoji}</span>
            <span className="flex-1 min-w-0">
              <b className="text-slate-100">{r.p.name}</b>
              <span className="block text-[10px] text-slate-400">
                {r.label}{r.optional ? ' • gợi ý thêm' : ''}
              </span>
            </span>
            <span className="text-lime-400 font-semibold shrink-0">{vnd(r.p.price)}</span>
          </li>
        ))}
      </ul>

      <div className="flex items-center justify-between pt-2 border-t border-emerald-900/60">
        <span className="text-xs text-slate-300">
          {picked.length} món • <b className="text-lime-400">{vnd(total)}</b>
        </span>
        <button className="btn" disabled={!picked.length} onClick={addPicked}>
          Thêm {picked.length === rows.length ? 'cả combo' : 'món đã chọn'} vào giỏ
        </button>
      </div>
      <p className="text-[10px] text-slate-500">Mẹo: nhập mã XANH10 ở giỏ hàng để giảm 10%.</p>
    </div>
  )
}
