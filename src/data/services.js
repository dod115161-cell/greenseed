// =====================================================================
// DỮ LIỆU CHO 2 TÍNH NĂNG MỚI
// 1. Dịch vụ chăm sóc vườn tận nhà (GardenCareBooking)
// 2. Gói vật tư định kỳ 30 ngày (SubscriptionBox)
// =====================================================================

// ---------- Tiện ích ngày tháng (lưu dạng 'YYYY-MM-DD') ----------
export const todayISO = () => {
  const d = new Date()
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}
export const addDays = (iso, n) => {
  const [y, m, d] = iso.split('-').map(Number)
  const t = new Date(y, m - 1, d + n)
  return `${t.getFullYear()}-${String(t.getMonth() + 1).padStart(2, '0')}-${String(t.getDate()).padStart(2, '0')}`
}
export const viDate = iso => {
  if (!iso) return ''
  const [y, m, d] = iso.split('-')
  return `${d}/${m}/${y}`
}

// ---------- 1. DỊCH VỤ CHĂM SÓC VƯỜN ----------
// base = giá cố định, perM2 = giá thêm theo m², min = giá tối thiểu
export const SERVICES = [
  { id: 'survey',  icon: '📐', name: 'Khảo sát sân thượng / ban công', desc: 'Kỹ thuật viên đo đạc, kiểm tra nắng, gió, chống thấm và tư vấn bố trí vườn.', base: 150000, perM2: 0, min: 150000, hours: 1 },
  { id: 'irrigate',icon: '💧', name: 'Lắp hệ thống tưới tự động', desc: 'Tưới nhỏ giọt / phun sương, hẹn giờ tự động, đã gồm vật tư cơ bản.', base: 0, perM2: 80000, min: 1200000, hours: 3 },
  { id: 'soil',    icon: '🪱', name: 'Cải tạo đất', desc: 'Xới, trộn giá thể, bón lót phân hữu cơ, chỉnh pH về 6.0-6.8.', base: 0, perM2: 50000, min: 400000, hours: 2 },
  { id: 'prune',   icon: '✂️', name: 'Tỉa cành & trị bệnh', desc: 'Cắt tỉa, vệ sinh vườn, phun chế phẩm sinh học trị sâu bệnh.', base: 300000, perM2: 10000, min: 300000, hours: 2 },
]
export const servicePrice = (svc, m2) => Math.max(svc.min, svc.base + svc.perM2 * (Number(m2) || 0))

export const SLOTS = ['08:00 - 10:00', '10:00 - 12:00', '14:00 - 16:00', '16:00 - 18:00']
export const TECHS = ['KTV Minh Tuấn', 'KTV Thu Hà', 'KTV Quốc Bảo']
export const SLOT_CAPACITY = TECHS.length // mỗi khung giờ tối đa bằng số kỹ thuật viên
export const BOOKING_STATUSES = ['Chờ xác nhận', 'Đã xác nhận', 'Đã phân công KTV', 'Hoàn thành', 'Đã hủy']

// ---------- 2. GÓI VẬT TƯ ĐỊNH KỲ ----------
export const CYCLE_DAYS = 30
export const ONE_OFF_MARKUP = 1.15 // mua lẻ 1 lần đắt hơn 15% so với giá định kỳ

export const PLANS = [
  {
    id: 'basic', icon: '🌱', name: 'Mầm Xanh', tag: 'Cơ bản', price: 199000, seeds: 2,
    items: ['5 kg đất sạch trộn sẵn', '1 kg phân trùn quế', '2 gói hạt giống mùa mới', '1 chai chế phẩm sinh học 100 ml'],
  },
  {
    id: 'std', icon: '🪴', name: 'Vườn Nhà', tag: 'Phổ biến', price: 349000, seeds: 4,
    items: ['10 kg đất sạch trộn sẵn', '2 kg phân bón hữu cơ', '4 gói hạt giống mùa mới', 'Nấm Trichoderma + dầu Neem sinh học'],
  },
  {
    id: 'pro', icon: '🌳', name: 'Nông Trại Phố', tag: 'Cao cấp', price: 599000, seeds: 6,
    items: ['20 kg đất sạch + xơ dừa', '5 kg phân hữu cơ + phân dê', '6 gói hạt giống mùa mới + 1 cây giống', 'Bộ thuốc sinh học đầy đủ', '1 buổi tư vấn online với kỹ sư'],
  },
]
export const PAY_METHODS = ['Thẻ ngân hàng (tự động trừ)', 'Ví điện tử (tự động trừ)', 'Chuyển khoản mỗi kỳ']
export const SUB_STATUSES = ['Đang hoạt động', 'Tạm dừng', 'Đã hủy']

// Tạo 1 đơn hàng (cùng định dạng đơn của cửa hàng) cho 1 kỳ giao của gói
export const subOrder = (sub, plan, note) => ({
  id: 'DK' + Date.now().toString().slice(-6) + Math.floor(Math.random() * 10),
  customer: sub.name,
  phone: sub.phone,
  address: sub.address,
  items: [{ name: `${plan.icon} Gói ${plan.name}${note ? ' - ' + note : ''}`, qty: 1 }],
  total: plan.price,
  status: 'Chờ xác nhận',
  date: new Date().toLocaleDateString('vi-VN'),
  source: 'subscription',
  subId: sub.id,
})

/**
 * Tự động gia hạn: gói nào "Đang hoạt động" mà đã đến ngày giao (nextDate <= hôm nay)
 * thì mô phỏng trừ tiền + tạo đơn giao hàng, rồi lùi nextDate thêm 30 ngày.
 * Trả về { subs, newOrders } (không sửa trực tiếp dữ liệu cũ).
 */
export function runRenewals(subs, today = todayISO()) {
  const newOrders = []
  const next = subs.map(s => {
    if (s.status !== 'Đang hoạt động' || !s.nextDate || s.nextDate > today) return s
    const plan = PLANS.find(p => p.id === s.planId)
    if (!plan) return s
    let cur = { ...s, history: [...(s.history || [])] }
    // Nếu bỏ lỡ nhiều kỳ (lâu không mở web) thì chỉ tính 1 kỳ, rồi đặt kỳ sau tính từ hôm nay
    const o = subOrder(cur, plan, 'kỳ định kỳ')
    newOrders.push(o)
    cur.history.unshift({ date: today, amount: plan.price, orderId: o.id, kind: 'Tự động gia hạn' })
    cur.nextDate = addDays(today, CYCLE_DAYS)
    return cur
  })
  return { subs: next, newOrders }
}
