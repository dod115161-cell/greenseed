// =====================================================================
// DỮ LIỆU MẪU SÀN ĐẤU GIÁ (Agri Auction House)
// =====================================================================

export const getInitialAuctions = () => [
  {
    id: 'auc-1',
    type: 'forward',
    title: 'Lô Hạt Giống Cà Chua Trái Tim Var (Đột biến gen giới hạn)',
    seller: 'Trang Trại Công Nghệ Cao Đà Lạt',
    emoji: '🍅',
    currentPrice: 1250000,
    startPrice: 500000,
    step: 50000,
    bidsCount: 8,
    highestBidder: 'hydro262000', // Khớp với tài khoản hiện tại để dễ test
    endTime: Date.now() + 2 * 60 * 1000, // Đặt 2 phút để dễ test gia hạn 3 phút
    status: 'active',
    desc: 'Lô 10 hạt giống F1 đột biến gen đột phá, tỉ lệ var ổn định trên 90%, kháng bệnh cực tốt.'
  },
  {
    id: 'auc-2',
    type: 'forward',
    title: 'Bộ Sưu Tập 5 Giống Hoa Hồng Xanh Cổ Đại Sưu Tầm',
    seller: 'Vườn Hồng Sapa Heritage',
    emoji: '🌹',
    currentPrice: 2800000,
    startPrice: 1500000,
    step: 100000,
    bidsCount: 12,
    highestBidder: 'Trần Thị B',
    endTime: Date.now() + 15 * 60 * 1000,
    status: 'active',
    desc: 'Gồm 5 gốc chiết thuần chủng nhập khẩu trực tiếp từ Pháp, đã thuần khí hậu vùng cao.'
  }
]

export const getInitialReverseAuctions = () => [
  {
    id: 'rev-1',
    type: 'reverse',
    buyer: 'Hợp Tác Xã Rau Sạch Miền Đông',
    requirement: 'Cần cung cấp gấp 2 tấn hạt giống rau muống cao sản (Tỉ lệ nảy mầm > 95%)',
    targetBudget: 15000000,
    lowestBid: 13200000,
    bidsCount: 5,
    bestSupplier: 'Công Ty Nông Lộc Phát',
    endTime: Date.now() + 10 * 60 * 1000,
    status: 'active'
  }
]