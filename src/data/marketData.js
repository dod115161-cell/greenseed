// =====================================================================
// DỮ LIỆU THỊ TRƯỜNG & DỰ BÁO GIÁ AI (Agri Price Forecasting)
// =====================================================================

export const MARKET_PRICES = [
  { id: 'mp-1', name: 'Cà chua F1 Đalat', category: 'Rau củ', price: 28000, unit: 'kg', change: '+12.5%', isUp: true, region: 'Lâm Đồng' },
  { id: 'mp-2', name: 'Hạt giống Cà phê Robusta nhân xô', category: 'Công nghiệp', price: 68000, unit: 'kg', change: '+5.2%', isUp: true, region: 'Đắk Lắk' },
  { id: 'mp-3', name: 'Gấp sáp lúa mạch hữu cơ', category: 'Lương thực', price: 14500, unit: 'kg', change: '-2.1%', isUp: false, region: 'Đồng bằng sông Cửu Long' },
  { id: 'mp-4', name: 'Ớt hiểm giống cao sản', category: 'Gia vị', price: 45000, unit: 'kg', change: '+18.4%', isUp: true, region: 'Miền Tây' },
  { id: 'mp-5', name: 'Dưa lưới hoàng kim', category: 'Trái cây', price: 55000, unit: 'kg', change: '+8.0%', isUp: true, region: 'Bình Dương' }
]

export const AI_PREDICTIONS = [
  {
    id: 'ai-1',
    crop: 'Cà chua Trái Tim Var / Cà chua F1',
    emoji: '🍅',
    forecast: 'Dự kiến TĂng 20% trong 2 tháng tới',
    reason: 'Do thời tiết mưa lũ miền Trung kéo dài làm giảm 30% sản lượng vùng chuyên canh, trong khi nhu cầu tiêu thụ dịp cuối năm tăng mạnh.',
    actionAdvice: 'Nên tiến hành gieo trồng ngay từ đầu tháng này để kịp thu hoạch vào đỉnh điểm giá.',
    recommendedProductId: 'seed-tomato-1',
    recommendedName: 'Hạt Giống Cà Chua F1 Cao Sản',
    price: 150000
  },
  {
    id: 'ai-2',
    crop: 'Ớt hiểm hữu cơ xuất khẩu',
    emoji: '🌶️',
    forecast: 'Dự kiến ĐẠT ĐỈNH GIÁ trong 45 ngày tới',
    reason: 'Thị trường xuất khẩu sang Đông Nam Á đang thiếu hụt nguồn cung nghiêm trọng do diện tích canh tác chuyển đổi sang cây trồng khác.',
    actionAdvice: 'Tận dụng đất vườn trống, thời gian sinh trưởng ngắn (40-45 ngày) rất thích hợp đón đầu sóng thị trường này.',
    recommendedProductId: 'seed-chili-2',
    recommendedName: 'Hạt Giống Ớt Hiểm Đột Biến Kháng Bệnh',
    price: 120000
  },
  {
    id: 'ai-3',
    crop: 'Dưa lưới công nghệ cao',
    emoji: '🍈',
    forecast: 'Ổn định ở mức cao (Lợi nhuận tốt)',
    reason: 'Phân khúc nhà hàng, siêu thị cao cấp duy trì hợp đồng thu mua ổn định, ít biến động theo mùa vụ ngoài trời nhờ canh tác nhà màng.',
    actionAdvice: 'Phù hợp với các trang trại áp dụng mô hình Setup vườn AI thông minh.',
    recommendedProductId: 'seed-melon-3',
    recommendedName: 'Hạt Giống Dưa Lưới Nhật Bản F1',
    price: 250000
  }
]