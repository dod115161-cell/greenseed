// =====================================================================
// DỮ LIỆU WIKI, CỘNG ĐỒNG NHẬT KÝ & AI BÁC SĨ CÂY TRỒNG
// =====================================================================

export const WIKI_ARTICLES = [
  {
    id: 'wiki-1',
    title: 'Kỹ Thuật Canh Tác Cà Chua Trái Tim Var Đạt Năng Suất Gấp 3 Lần',
    category: 'Hướng dẫn trồng trọt',
    readTime: '5 phút đọc',
    author: 'Kỹ sư Nguyễn Văn Thắng',
    date: '02/11/2026',
    image: '🍅',
    summary: 'Quy trình chuẩn từ chọn đất, tỉa cành đến lịch bón phân sinh học giúp cây cho quả var chuẩn màu và mọng nước.',
    content: [
      {
        type: 'text',
        value: 'Cà chua Trái Tim Var là dòng giống đột biến cần chế độ dinh dưỡng cân đối. Trong giai đoạn cây con từ 10-20 ngày tuổi, bộ rễ cần phát triển mạnh để hấp thu vi chất.'
      },
      {
        type: 'product_buy',
        productId: 'seed-tomato-1',
        productName: 'Phân Bón Rễ Sinh Học Bio-Root (Phục hồi & Kích rễ)',
        price: 85000,
        emoji: '🧪',
        note: '💡 Đề xuất chuyên gia: Bón bổ sung 5ml/lít nước hàng tuần ở giai đoạn này.'
      },
      {
        type: 'text',
        value: 'Khi cây bắt đầu ra hoa và đậu quả non, việc bổ sung Canxi-Bo sinh học sẽ giúp ngăn ngừa tình trạng nứt quả và thối đít trái.'
      },
      {
        type: 'product_buy',
        productId: 'fertilizer-calcium-2',
        productName: 'Phân Bón Vi Lượng Canxi-Bo Chống Nứt Trái',
        price: 110000,
        emoji: '💊',
        note: '💡 Đề xuất chuyên gia: Phun trực tiếp lên lá vào buổi sáng sớm.'
      }
    ]
  },
  {
    id: 'wiki-2',
    title: 'Bí Quyết Trồng Dưa Lưới Trong Chậu Tại Nhà Cho Trái Ngọt Đậm',
    category: 'Mẹo làm vườn phố',
    readTime: '7 phút đọc',
    author: 'Vườn Phố Green',
    date: '05/11/2026',
    image: '🍈',
    summary: 'Hướng dẫn chi tiết cách thụ phấn nhân tạo và chọn loại chậu thoáng khí tối ưu bộ rễ.',
    content: [
      {
        type: 'text',
        value: 'Dưa lưới đòi hỏi thể tích bầu ươm tối thiểu 15-20 lít đất xốp. Sử dụng chậu thông minh sẽ tránh ngập vữa rễ.'
      },
      {
        type: 'product_buy',
        productId: 'pot-2',
        productName: 'Chậu Nhựa Dẻo Cao Cấp Malaysia (Thoát nước tốt)',
        price: 30000,
        emoji: '🪴',
        note: '💡 Loại chậu khuyên dùng cho dưa lưới ban công.'
      }
    ]
  }
]

export const INITIAL_COMMUNITY_FEED = [
  {
    id: 'feed-1',
    user: 'Lê Minh Hoàng',
    avatar: '👨‍🌾',
    plantName: 'Cà Chua Var Đột Biến - 45 Ngày Tuổi',
    dayCount: 45,
    status: 'Đã ra chùm quả đầu tiên! Nhờ bón Bio-Root đúng tuần 2 mà rễ khỏe bám đất tốt cực kỳ.',
    image: '🍅',
    likes: 24,
    pointsEarned: 50,
    date: '06/11/2026'
  },
  {
    id: 'feed-2',
    user: 'Trần Thanh Thảo',
    avatar: '👩‍🌾',
    plantName: 'Vườn Hoa Hồng Xanh Cổ Đại',
    dayCount: 60,
    status: 'Sau 2 tháng ghép cành theo chuẩn kỹ thuật GreenSeed, hoa đã nở lứa đầu tiên siêu đẹp!',
    image: '🌹',
    likes: 42,
    pointsEarned: 50,
    date: '07/11/2026'
  }
]

export const AI_DISEASE_DATABASE = [
  {
    keywords: ['rầy', 'trắng', 'phấn', 'lá vàng', 'đốm trắng'],
    diseaseName: 'Bệnh Rầy Phấn Trắng (Whitefly Infestation)',
    severity: 'Cảnh báo cấp độ 2 (Trung bình)',
    symptoms: 'Xuất hiện lớp phấn màu trắng đục dưới mặt lá, lá bị quăn queo và vàng úa.',
    treatment: 'Cắt tỉa bớt lá già ngợp sáng. Phun tinh dầu neem hoặc thuốc trừ sâu sinh học Bio-Neem 2 lần/tuần.',
    recommendedProduct: {
      id: 'med-neem-1',
      name: 'Thuốc Trừ Sâu Sinh Học Bio-Neem Oil (100% Thuần Chay)',
      price: 135000,
      emoji: '🌿'
    }
  },
  {
    keywords: ['thán thư', 'đốm nâu', 'cháy lá', 'thối quả', 'nấm'],
    diseaseName: 'Bệnh Thán Thư Nấm Chi Colletotrichum',
    severity: 'Cảnh báo cấp độ 3 (Nghiêm trọng)',
    symptoms: 'Vết bệnh tròn màu nâu đen lõm xuống trên bề mặt lá và vỏ trái.',
    treatment: 'Tránh tưới nước lên lá vào buổi tối. Sử dụng Chế phẩm nấm đối kháng Trichoderma phun đều gốc.',
    recommendedProduct: {
      id: 'med-tricho-2',
      name: 'Chế Phẩm Nấm Đối Kháng Trichoderma Đạt Chuẩn Organic',
      price: 95000,
      emoji: '🧪'
    }
  }
]