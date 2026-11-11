// =====================================================================
// COMBO SMART MATCHING - luật ghép combo cho từng loại hạt giống
// Không cần AI: mỗi hạt giống = 1 "công thức" gồm các vị trí (slot).
// Muốn đổi combo chỉ cần sửa file này, không đụng vào giao diện.
// =====================================================================

// Combo chuẩn áp dụng cho MỌI hạt giống: Đất + Chậu + Phân bón + Thuốc sâu sinh học
// "name" phải TRÙNG TÊN với sản phẩm trong mockData.js
export const COMBO_SLOTS = [
  { key: 'soil', label: 'Đất trồng',      name: 'Đất sạch Tribat' },
  { key: 'pot',  label: 'Chậu 30cm',      name: 'Chậu nhựa 30cm' },
  { key: 'fert', label: 'Phân bón vi sinh', name: 'Phân hữu cơ vi sinh' },
  { key: 'pest', label: 'Phòng trừ sâu sinh học', name: 'Dầu Neem sinh học' },
]

// Ngoại lệ: cây nào cần đồ khác combo chuẩn thì khai báo ở đây
// Ví dụ sen đá không hợp chậu 30cm nên đổi sang chậu treo nhỏ
export const SLOT_OVERRIDE = {
  'Sen đá đa sắc mix': { pot: 'Chậu treo ban công' },
}

// Gợi ý THÊM (mặc định không tick): cây leo cần giàn, cây dễ nấm bệnh cần Trichoderma
export const EXTRA_BY_SEED = {
  'Cà chua bi':        [['Giàn leo mini', 'Giàn leo / cắm cọc']],
  'Dưa leo':           [['Giàn leo mini', 'Giàn leo']],
  'Dưa hấu siêu ngọt': [['Giàn leo mini', 'Giàn leo']],
  'Dâu tây New Zealand': [['Chế phẩm Trichoderma', 'Phòng nấm bệnh']],
  'Ớt chỉ thiên':      [['Chế phẩm Trichoderma', 'Phòng nấm bệnh']],
}

/**
 * Ghép combo cho 1 hạt giống.
 * @param seed         sản phẩm hạt giống đang chọn
 * @param products     toàn bộ danh sách sản phẩm (để tìm đất, chậu, phân...)
 * @param includeSeed  true: có cả hạt giống trong combo; false: chỉ phần vật tư
 * @returns mảng { key, label, p, optional }
 */
export function buildCombo(seed, products, includeSeed = true) {
  const byName = n => products.find(p => p.name === n)
  const override = SLOT_OVERRIDE[seed.name] || {}
  const rows = []

  if (includeSeed) rows.push({ key: 'seed', label: 'Hạt giống', p: seed })

  for (const s of COMBO_SLOTS) {
    const p = byName(override[s.key] || s.name)
    if (p && p.stock > 0) rows.push({ key: s.key, label: s.label, p })
  }

  for (const [name, label] of EXTRA_BY_SEED[seed.name] || []) {
    const p = byName(name)
    if (p && p.stock > 0) rows.push({ key: 'extra-' + p.id, label, p, optional: true })
  }
  return rows
}
