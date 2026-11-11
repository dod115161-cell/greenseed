// =====================================================================
// LỊCH GIEO TRỒNG THEO VÙNG
// - PROVINCES: danh sách địa điểm (muốn thêm tỉnh khác thì thêm 1 dòng)
// - SOW: tháng nên gieo của từng hạt giống ở từng vùng
// Số liệu mang tính tham khảo chung, thực tế còn phụ thuộc giống và vi khí hậu.
// =====================================================================

// Nhóm vùng: B = Miền Bắc, T = Miền Trung, N = Miền Nam, TN = Tây Nguyên / cao nguyên
export const REGION_NAMES = { B: 'Miền Bắc', T: 'Miền Trung', N: 'Miền Nam', TN: 'Tây Nguyên & cao nguyên' }

export const PROVINCES = [
  { n: 'Hà Nội',          g: 'B',  lat: 21.03, lng: 105.85 },
  { n: 'Hải Phòng',       g: 'B',  lat: 20.86, lng: 106.68 },
  { n: 'Hạ Long',         g: 'B',  lat: 20.95, lng: 107.08 },
  { n: 'Nam Định',        g: 'B',  lat: 20.42, lng: 106.17 },
  { n: 'Thái Nguyên',     g: 'B',  lat: 21.59, lng: 105.84 },
  { n: 'Sa Pa',           g: 'B',  lat: 22.34, lng: 103.84 },
  { n: 'Thanh Hóa',       g: 'T',  lat: 19.81, lng: 105.78 },
  { n: 'Vinh',            g: 'T',  lat: 18.68, lng: 105.68 },
  { n: 'Huế',             g: 'T',  lat: 16.46, lng: 107.59 },
  { n: 'Đà Nẵng',         g: 'T',  lat: 16.05, lng: 108.2 },
  { n: 'Quy Nhơn',        g: 'T',  lat: 13.78, lng: 109.22 },
  { n: 'Nha Trang',       g: 'T',  lat: 12.24, lng: 109.19 },
  { n: 'Đà Lạt',          g: 'TN', lat: 11.94, lng: 108.44 },
  { n: 'Buôn Ma Thuột',   g: 'TN', lat: 12.67, lng: 108.04 },
  { n: 'Pleiku',          g: 'TN', lat: 13.98, lng: 108.0 },
  { n: 'TP. Hồ Chí Minh', g: 'N',  lat: 10.78, lng: 106.7 },
  { n: 'Biên Hòa',        g: 'N',  lat: 10.95, lng: 106.82 },
  { n: 'Vũng Tàu',        g: 'N',  lat: 10.35, lng: 107.08 },
  { n: 'Cần Thơ',         g: 'N',  lat: 10.03, lng: 105.78 },
  { n: 'Long Xuyên',      g: 'N',  lat: 10.37, lng: 105.43 },
  { n: 'Cà Mau',          g: 'N',  lat: 9.18,  lng: 105.15 },
  { n: 'Phú Quốc',        g: 'N',  lat: 10.23, lng: 103.96 },
]

// R(9,2) = [9,10,11,12,1,2]  (tự quay vòng qua tháng 12)
const R = (a, b) => {
  const out = []
  for (let m = a; ; m = (m % 12) + 1) { out.push(m); if (m === b) break }
  return out
}
const ALL = R(1, 12)

// Khóa = TÊN hạt giống (trùng mockData). Mảng rỗng = không khuyến nghị ở vùng đó.
export const SOW = {
  'Cà chua bi':          { B: R(9, 2),  T: R(10, 1), N: R(11, 2), TN: R(9, 1) },
  'Húng quế':            { B: R(3, 9),  T: R(2, 9),  N: ALL,      TN: R(2, 10) },
  'Cải xanh':            { B: R(9, 3),  T: R(9, 2),  N: R(10, 4), TN: R(8, 3) },
  'Dưa leo':             { B: [2, 3, 4, 8, 9], T: [1, 2, 3, 8, 9], N: [11, 12, 1, 2, 3, 5, 6], TN: [2, 3, 4, 9, 10] },
  'Ớt chỉ thiên':        { B: R(2, 4),  T: [1, 2, 3, 8, 9], N: [11, 12, 1, 5, 6], TN: R(2, 4) },
  'Hoa hướng dương':     { B: [2, 3, 4, 8, 9, 10], T: [1, 2, 3, 9, 10], N: R(11, 2), TN: R(10, 2) },
  'Đu đủ lùn':           { B: R(3, 5),  T: R(2, 4),  N: ALL,      TN: R(3, 5) },
  'Xà lách hữu cơ':      { B: R(10, 2), T: R(10, 1), N: R(11, 2), TN: R(9, 3) },
  'Dưa hấu siêu ngọt':   { B: R(1, 3),  T: R(12, 2), N: R(11, 2), TN: R(12, 2) },
  'Dâu tây New Zealand': { B: R(9, 11), T: R(10, 11), N: [],      TN: R(9, 11) },
  'Cẩm tú cầu Nhật':     { B: [2, 3, 9, 10], T: [2, 3], N: [],    TN: [2, 3, 4, 9, 10] },
  'Cà rốt baby Mỹ':      { B: R(9, 12), T: R(9, 11), N: R(11, 2), TN: R(8, 11) },
  'Sen đá đa sắc mix':   { B: ALL,      T: ALL,      N: ALL,      TN: ALL },
}

// Hạt giống mới do người bán thêm (chưa có trong SOW) -> dùng trường "season" làm dự phòng
const SEASON_MONTHS = { 'Xuân': [2, 3, 4], 'Hè': [5, 6, 7], 'Thu': [8, 9, 10], 'Đông': [11, 12, 1], 'Quanh năm': ALL }

export const sowMonths = (product, group) =>
  SOW[product.name]?.[group] ?? SEASON_MONTHS[product.season] ?? []

// "20-30°C" -> [20, 30]
export const parseRange = s => (String(s).match(/\d+/g) || []).map(Number)

// Mức hợp nhiệt độ 0..1 (1 = nằm trong khoảng cây ưa, giảm dần khi lệch tối đa 8°C)
export function tempFit(product, temp) {
  const [a, b] = parseRange(product.temp)
  if (temp == null || b == null) return 0.5
  if (temp >= a && temp <= b) return 1
  const d = temp < a ? a - temp : temp - b
  return Math.max(0, 1 - d / 8)
}

/**
 * Chấm điểm hạt giống cho 1 vùng + 1 tháng + nhiệt độ trung bình dự báo.
 * 60 điểm nếu tháng này nằm trong lịch gieo, tối đa 40 điểm theo nhiệt độ.
 */
export function scoreSeed(product, group, month, temp) {
  const inWindow = sowMonths(product, group).includes(month)
  const score = Math.round((inWindow ? 60 : 0) + tempFit(product, temp) * 40)
  return { inWindow, score }
}

// Mã thời tiết WMO của Open-Meteo -> chữ + biểu tượng
export function weatherText(code) {
  if (code === 0) return ['Trời quang', '☀️']
  if (code <= 2) return ['Ít mây', '🌤️']
  if (code === 3) return ['Nhiều mây', '☁️']
  if (code === 45 || code === 48) return ['Sương mù', '🌫️']
  if (code >= 51 && code <= 57) return ['Mưa phùn', '🌦️']
  if (code >= 61 && code <= 67) return ['Mưa', '🌧️']
  if (code >= 80 && code <= 82) return ['Mưa rào', '🌧️']
  if (code >= 95) return ['Dông', '⛈️']
  return ['Nhiều mây', '☁️']
}

// =====================================================================
// BỔ SUNG: thêm tỉnh + nhận diện tỉnh từ địa chỉ nhận hàng + cảnh báo thời tiết
// (chỉ thêm mới, không sửa dữ liệu phía trên)
// =====================================================================
PROVINCES.push(
  { n: 'Kon Tum',   g: 'TN', lat: 14.35, lng: 108.0 },
  { n: 'Lạng Sơn',  g: 'B',  lat: 21.85, lng: 106.76 },
)

// Bỏ dấu tiếng Việt, chữ thường, chỉ giữ chữ/số: "TP. Hồ Chí Minh" -> "tp ho chi minh"
export const norm = s => String(s || '')
  .normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/đ/gi, 'd')
  .toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim()

// Tên gọi khác / tên tỉnh chứa thành phố đó
const ALIASES = {
  'TP. Hồ Chí Minh': ['ho chi minh', 'hcm', 'tphcm', 'sai gon', 'saigon', 'thu duc'],
  'Hà Nội': ['hanoi', 'hn'],
  'Hạ Long': ['quang ninh'],
  'Sa Pa': ['sapa', 'lao cai'],
  'Vinh': ['nghe an'],
  'Huế': ['thua thien hue'],
  'Quy Nhơn': ['binh dinh'],
  'Nha Trang': ['khanh hoa'],
  'Đà Lạt': ['lam dong', 'dalat'],
  'Buôn Ma Thuột': ['dak lak', 'dac lac', 'bmt'],
  'Pleiku': ['gia lai'],
  'Biên Hòa': ['dong nai'],
  'Vũng Tàu': ['ba ria'],
  'Long Xuyên': ['an giang'],
  'Phú Quốc': ['kien giang'],
  'Kon Tum': ['kontum'],
}

/** Tìm tỉnh trong danh sách PROVINCES từ 1 chuỗi địa chỉ. Không thấy -> null */
export function matchProvince(address) {
  const a = ' ' + norm(address) + ' '
  if (a.trim() === '') return null
  // Tỉnh/thành thường viết ở CUỐI địa chỉ ("12 Nguyễn Huệ, Q.1, TP.HCM")
  // -> ưu tiên từ khóa xuất hiện muộn nhất, để tên đường "Nguyễn Huệ" không bị nhận thành Huế
  let best = null, bestEnd = -1
  for (const p of PROVINCES) {
    for (const k of [norm(p.n), ...(ALIASES[p.n] || [])]) {
      const i = a.lastIndexOf(' ' + k + ' ')
      if (i >= 0 && i + k.length > bestEnd) { best = p; bestEnd = i + k.length }
    }
  }
  return best
}

/**
 * Cảnh báo thời tiết nguy hiểm từ dự báo 7 ngày của Open-Meteo.
 * Ngưỡng tham khảo theo cách gọi của khí tượng Việt Nam:
 *  - Rét đậm: nhiệt độ TB ngày <= 15°C, rét hại: <= 13°C
 *  - Nắng nóng: cao nhất >= 35°C, gay gắt: >= 37°C
 *  - Mưa lớn: >= 50 mm/ngày, rất lớn: >= 100 mm/ngày
 *  - Gió giật mạnh (bão / áp thấp, dông): >= 62 km/h (~ cấp 8)
 * Trả về mảng { level: 'danger' | 'warn', day, title, advice }
 */
export function weatherAlerts(daily) {
  if (!daily) return []
  const out = []
  const dayName = t => new Date(t).toLocaleDateString('vi-VN', { weekday: 'long', day: '2-digit', month: '2-digit' })
  const first = (cond) => daily.time.findIndex((_, i) => cond(i))
  const mean = i => (daily.temperature_2m_max[i] + daily.temperature_2m_min[i]) / 2
  const gust = i => daily.wind_gusts_10m_max?.[i] ?? 0
  const rain = i => daily.precipitation_sum[i] ?? 0

  let i = first(k => mean(k) <= 13)
  if (i >= 0) out.push({ level: 'danger', day: dayName(daily.time[i]), title: '🥶 Sắp có đợt rét hại tại khu vực của bạn', advice: 'Che phủ nilon/lưới cho cây non, đưa chậu vào nơi kín gió, ngừng gieo hạt ngoài trời, tưới vào buổi trưa ấm.' })
  else if ((i = first(k => mean(k) <= 15)) >= 0) out.push({ level: 'warn', day: dayName(daily.time[i]), title: '❄️ Sắp có đợt rét đậm tại khu vực của bạn', advice: 'Che chắn cho cây, phủ rơm/trấu giữ ấm gốc, hạn chế bón phân đạm, ủ ấm khay hạt.' })

  if ((i = first(k => gust(k) >= 62 || rain(k) >= 100)) >= 0) out.push({ level: 'danger', day: dayName(daily.time[i]), title: '🌀 Cảnh báo mưa bão / gió giật mạnh', advice: `Gió giật tới ${Math.round(gust(i))} km/h, mưa ${rain(i)} mm. Hạ thấp hoặc buộc chặt giàn, chuyển chậu treo xuống đất, khơi thông thoát nước sân thượng.` })
  else if ((i = first(k => rain(k) >= 50)) >= 0) out.push({ level: 'warn', day: dayName(daily.time[i]), title: '🌧️ Sắp có mưa lớn', advice: `Dự báo ${rain(i)} mm. Kê cao chậu, kiểm tra lỗ thoát nước, tạm ngưng bón phân để tránh rửa trôi.` })
  else if ((i = first(k => daily.weather_code[k] >= 95)) >= 0) out.push({ level: 'warn', day: dayName(daily.time[i]), title: '⛈️ Có dông, có thể kèm lốc và mưa đá', advice: 'Buộc cố định cây cao, che lưới cho rau lá non.' })

  if ((i = first(k => daily.temperature_2m_max[k] >= 37)) >= 0) out.push({ level: 'danger', day: dayName(daily.time[i]), title: '🔥 Nắng nóng gay gắt', advice: 'Che lưới 50-70% từ 10h-15h, tưới sáng sớm và chiều mát, phủ gốc giữ ẩm.' })
  else if ((i = first(k => daily.temperature_2m_max[k] >= 35)) >= 0) out.push({ level: 'warn', day: dayName(daily.time[i]), title: '☀️ Nắng nóng', advice: 'Tăng lượng tưới, che bớt nắng trưa cho cây con và rau ăn lá.' })

  return out
}
