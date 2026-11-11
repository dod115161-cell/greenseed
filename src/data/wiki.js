// =====================================================================
// AGRI-WIKI: dữ liệu bệnh cây / sâu hại / thiếu dinh dưỡng
// Thêm bệnh mới = thêm 1 object vào WIKI_DISEASES, giao diện tự cập nhật.
// =====================================================================

// Danh sách "dấu hiệu" để người dùng tick trong Bác sĩ cây trồng
export const SIGNS = [
  { id: 'leaf_yellow_all',  label: 'Lá già vàng đều, cây còi cọc' },
  { id: 'leaf_yellow_vein', label: 'Lá vàng giữa các gân, gân còn xanh' },
  { id: 'spot_brown',       label: 'Đốm nâu / vết úa trên lá' },
  { id: 'white_powder',     label: 'Lớp phấn / bột trắng phủ trên lá' },
  { id: 'mold_under',       label: 'Mốc trắng xám mặt dưới lá (sau đêm ẩm)' },
  { id: 'leaf_curl',        label: 'Lá cuốn, xoăn, biến dạng' },
  { id: 'insects',          label: 'Thấy côn trùng nhỏ bám ngọn / mặt dưới lá' },
  { id: 'sticky',           label: 'Lá dính nhớt, có kiến bu' },
  { id: 'stippling',        label: 'Lá lấm tấm vàng / bạc, có tơ mịn' },
  { id: 'holes',            label: 'Lá bị khoét lỗ, thấy phân sâu' },
  { id: 'wilt_day',         label: 'Cây héo giữa trưa, tối hoặc sáng hồi lại' },
  { id: 'wilt_perm',        label: 'Gốc thâm, thối nhũn; cây con đổ rạp' },
  { id: 'drop',             label: 'Rụng hoa, rụng quả non' },
  { id: 'fruit_rot',        label: 'Đáy quả thâm đen, lõm xuống' },
  { id: 'scorch',           label: 'Mép lá khô cháy, lá bạc màu sau nắng gắt' },
]

export const DISEASE_GROUPS = ['Nấm', 'Vi khuẩn', 'Côn trùng & nhện', 'Dinh dưỡng', 'Môi trường']

// hosts: ['all'] = hại hầu hết cây; hoặc liệt kê TÊN hạt giống (trùng mockData)
// products: [[tên sản phẩm trong cửa hàng, lý do dùng]]
export const WIKI_DISEASES = [
  {
    id: 'dom-la', name: 'Bệnh đốm lá', sci: 'Cercospora / Septoria', group: 'Nấm', emoji: '🍂',
    signs: ['spot_brown', 'leaf_yellow_all'], hosts: ['all'],
    symptoms: 'Đốm tròn màu nâu, viền vàng trên lá già, lan dần lên lá non; lá khô và rụng.',
    cause: 'Độ ẩm cao, tưới lên lá, trồng quá dày, tàn dư bệnh còn trong đất.',
    organic: 'Ngắt bỏ lá bệnh đưa ra khỏi vườn; tưới vào gốc vào buổi sáng; phun dịch tỏi - ớt - gừng vào chiều mát.',
    chem: 'Khi bệnh lan rộng, hỏi cửa hàng vật tư chọn thuốc gốc đồng hoặc chế phẩm sinh học đúng cây; dùng theo nhãn và theo thời gian cách ly.',
    prevention: 'Trồng thưa, thoáng gió; không tưới lên lá; vệ sinh dụng cụ; luân canh.',
    products: [['Chế phẩm Trichoderma', 'Nấm đối kháng, hạn chế nấm bệnh trong đất'], ['Phân hữu cơ vi sinh', 'Phục hồi cây sau bệnh']],
  },
  {
    id: 'suong-mai', name: 'Bệnh sương mai', sci: 'Phytophthora / Peronospora', group: 'Nấm', emoji: '🌫️',
    signs: ['spot_brown', 'mold_under'], hosts: ['Cà chua bi', 'Dưa leo', 'Dưa hấu siêu ngọt', 'Xà lách hữu cơ', 'Cải xanh'],
    symptoms: 'Vết úa nâu loang nhanh trên lá, mặt dưới có lớp mốc trắng xám sau đêm ẩm.',
    cause: 'Đêm ẩm, ngày mát; lây chéo giữa cà chua và khoai tây.',
    organic: 'Cắt bỏ lá nhiễm, tăng thông thoáng, ngừng tưới buổi tối, phun chế phẩm sinh học vào chiều mát.',
    chem: 'Bệnh lây rất nhanh khi trời ẩm; nếu nặng, dùng thuốc đặc trị nấm theo hướng dẫn của cán bộ khuyến nông / cửa hàng vật tư.',
    prevention: 'Không trồng cà chua cạnh khoai tây; chọn giống chống chịu; làm giàn cho thoáng.',
    products: [['Chế phẩm Trichoderma', 'Giảm mầm bệnh nấm'], ['Phân hữu cơ vi sinh', 'Tăng sức đề kháng']],
  },
  {
    id: 'phan-trang', name: 'Bệnh phấn trắng', sci: 'Erysiphe / Podosphaera', group: 'Nấm', emoji: '❄️',
    signs: ['white_powder', 'leaf_yellow_all'], hosts: ['Dưa leo', 'Dưa hấu siêu ngọt', 'Cà chua bi', 'Ớt chỉ thiên', 'Hoa hướng dương'],
    symptoms: 'Lớp phấn trắng như bột mì phủ mặt lá, sau đó lá vàng, khô và cây chậm lớn.',
    cause: 'Trời khô nhưng ẩm không khí cao, thiếu ánh sáng, trồng dày.',
    organic: 'Ngắt lá nặng; phun dung dịch baking soda pha loãng hoặc dầu Neem vào chiều mát; tăng nắng và gió.',
    chem: 'Bệnh nặng thì dùng thuốc trừ nấm đăng ký cho đúng cây theo nhãn; không phun lúc nắng gắt.',
    prevention: 'Trồng đúng khoảng cách, tỉa lá thấp, tránh bón thừa đạm.',
    products: [['Dầu Neem sinh học', 'Phun ức chế nấm phấn trắng'], ['Chế phẩm Trichoderma', 'Phòng nấm bệnh']],
  },
  {
    id: 'rep', name: 'Rệp (rệp xáp)', sci: 'Aphis spp.', group: 'Côn trùng & nhện', emoji: '🐛',
    signs: ['insects', 'leaf_curl', 'sticky'], hosts: ['all'],
    symptoms: 'Rệp nhỏ bám ngọn và mặt dưới lá non, lá cuốn, có mật ngọt dính và kiến bu.',
    cause: 'Thời tiết khô nóng, bón thừa đạm, thiếu thiên địch (bọ rùa, ong ký sinh).',
    organic: 'Xịt nước mạnh rửa rệp; phun nước xà phòng loãng hoặc dầu Neem; trồng húng quế quanh vườn; dùng bẫy dính vàng.',
    chem: 'Mật độ cao: dùng thuốc sinh học theo nhãn, tuân thủ thời gian cách ly trước khi thu hoạch.',
    prevention: 'Kiểm tra ngọn mỗi tuần, không bón thừa đạm, giữ thiên địch.',
    products: [['Dầu Neem sinh học', 'Phun ngày 1 và ngày 7'], ['Bẫy dính côn trùng vàng', 'Bắt rệp có cánh, ruồi trắng']],
  },
  {
    id: 'nhen-do', name: 'Nhện đỏ', sci: 'Tetranychus urticae', group: 'Côn trùng & nhện', emoji: '🕷️',
    signs: ['stippling', 'scorch'], hosts: ['all'],
    symptoms: 'Lá lấm tấm chấm vàng/bạc, mặt dưới có tơ mịn, nặng thì lá khô bạc và rụng.',
    cause: 'Nắng nóng khô hạn kéo dài; nhện sinh sản rất nhanh khi trời khô.',
    organic: 'Phun nước rửa mặt dưới lá, tăng độ ẩm quanh cây, phun dầu Neem 5-7 ngày/lần.',
    chem: 'Cần thuốc đặc trị nhện (khác thuốc trừ sâu thường) - hỏi cửa hàng vật tư và dùng theo nhãn.',
    prevention: 'Tưới phun sương nhẹ vào sáng sớm trong mùa khô, kiểm tra mặt dưới lá.',
    products: [['Dầu Neem sinh học', 'Phun mặt dưới lá, lặp lại sau 5-7 ngày']],
  },
  {
    id: 'sau-an-la', name: 'Sâu ăn lá', sci: 'Sâu xanh, sâu tơ, sâu khoang', group: 'Côn trùng & nhện', emoji: '🐞',
    signs: ['holes'], hosts: ['all'],
    symptoms: 'Lá bị khoét thủng lỗ hoặc mất mép lá, có phân sâu đen nhỏ trên lá và gốc.',
    cause: 'Bướm đêm đẻ trứng trên lá; thường nặng khi trời ấm, ít mưa.',
    organic: 'Bắt sâu bằng tay vào sáng sớm / tối; phun dầu Neem hoặc chế phẩm vi sinh Bt; che lưới.',
    chem: 'Nếu sâu quá nhiều, hỏi cửa hàng vật tư thuốc sinh học phù hợp và tuân thủ thời gian cách ly.',
    prevention: 'Che lưới côn trùng, trồng xen húng quế, kiểm tra mặt dưới lá để thấy ổ trứng.',
    products: [['Dầu Neem sinh học', 'Xua đuổi và hạn chế sâu non']],
  },
  {
    id: 'thoi-re', name: 'Thối gốc, chết cây con', sci: 'Pythium / Rhizoctonia', group: 'Nấm', emoji: '🌱',
    signs: ['wilt_perm', 'leaf_yellow_all'], hosts: ['all'],
    symptoms: 'Cây con đổ rạp sát mặt đất, gốc thâm nhũn; cây lớn vàng lá, rễ nâu đen, mùi hôi.',
    cause: 'Úng nước, giá thể nén chặt, dùng đất cũ có mầm bệnh, gieo quá dày.',
    organic: 'Ngừng tưới, nhổ bỏ cây chết, xới thoáng đất; thay giá thể sạch; bón chế phẩm Trichoderma.',
    chem: 'Khó cứu khi rễ đã thối; chủ yếu phòng bệnh và thay giá thể.',
    prevention: 'Dùng đất sạch, chậu có lỗ thoát nước, tưới vừa đủ ẩm.',
    products: [['Đất sạch Tribat', 'Giá thể sạch bệnh, thoát nước tốt'], ['Chế phẩm Trichoderma', 'Xử lý nấm trong giá thể'], ['Khay ươm hạt', 'Gieo mầm thoáng, dễ kiểm soát ẩm']],
  },
  {
    id: 'heo-xanh', name: 'Héo xanh vi khuẩn', sci: 'Ralstonia solanacearum', group: 'Vi khuẩn', emoji: '🥀',
    signs: ['wilt_day'], hosts: ['Cà chua bi', 'Ớt chỉ thiên'],
    symptoms: 'Cây héo đột ngột giữa trưa dù đất đủ ẩm, lá còn xanh; cắt thân ngâm nước thấy dịch trắng đục chảy ra.',
    cause: 'Vi khuẩn sống trong đất, lây qua nước tưới và vết thương rễ; nặng khi nóng ẩm.',
    organic: 'Rất khó chữa: nhổ bỏ cây bệnh, tiêu hủy (không ủ phân), không dùng lại đất đó cho cà chua, ớt, khoai tây.',
    chem: 'Hầu như không có thuốc chữa dứt điểm; ưu tiên phòng bệnh.',
    prevention: 'Dùng đất sạch, luân canh với cây họ khác, tránh làm đứt rễ, khử trùng dụng cụ.',
    products: [['Đất sạch Tribat', 'Thay giá thể mới sạch bệnh'], ['Chậu nhựa 30cm', 'Trồng chậu với đất sạch để tránh mầm bệnh']],
  },
  {
    id: 'thieu-dam', name: 'Thiếu đạm (N)', sci: 'Nitrogen deficiency', group: 'Dinh dưỡng', emoji: '🟡',
    signs: ['leaf_yellow_all'], hosts: ['all'],
    symptoms: 'Lá già ở dưới vàng đều, cây phát triển chậm, thân nhỏ.',
    cause: 'Đất nghèo dinh dưỡng, tưới nhiều làm rửa trôi đạm, trồng lâu không bón.',
    organic: 'Bón phân hữu cơ hoai, phân trùn quế, nước ủ đậu / phân cá pha loãng.',
    chem: 'Có thể bổ sung phân NPK theo nhãn, không bón quá liều gây cháy rễ.',
    prevention: 'Bón lót đầy đủ và bón thúc đúng giai đoạn.',
    products: [['Phân hữu cơ vi sinh', 'Bổ sung dinh dưỡng và vi sinh có lợi']],
  },
  {
    id: 'thieu-mg-fe', name: 'Thiếu vi chất (Mg, Fe)', sci: 'Magnesium / Iron deficiency', group: 'Dinh dưỡng', emoji: '🟢',
    signs: ['leaf_yellow_vein'], hosts: ['all'],
    symptoms: 'Lá vàng giữa các gân nhưng gân còn xanh; lá già vàng trước (thiếu Mg) hoặc lá non vàng (thiếu Fe).',
    cause: 'pH đất lệch khỏi khoảng 6.0-7.0, đất nén chặt, nghèo mùn.',
    organic: 'Xới tơi đất, bón phân chuồng hoai, phủ gốc, rắc vỏ trứng nghiền, kiểm tra và chỉnh pH.',
    chem: 'Có thể phun phân vi lượng chelate Mg/Fe theo nhãn.',
    prevention: 'Giữ pH ổn định, bón phân hữu cơ định kỳ.',
    products: [['Phân hữu cơ vi sinh', 'Bổ sung vi lượng tự nhiên'], ['Đất trồng hữu cơ (5kg)', 'Thay lớp đất mặt']],
  },
  {
    id: 'thoi-dit-qua', name: 'Thối đít quả (thiếu Canxi)', sci: 'Blossom-end rot', group: 'Dinh dưỡng', emoji: '🍅',
    signs: ['fruit_rot', 'drop'], hosts: ['Cà chua bi', 'Ớt chỉ thiên', 'Dưa hấu siêu ngọt'],
    symptoms: 'Đáy quả xuất hiện vết thâm đen, lõm xuống, quả chín sớm hoặc rụng.',
    cause: 'Tưới thất thường (lúc khô lúc ướt) khiến cây không hút đủ Canxi.',
    organic: 'Tưới đều đặn, phủ gốc giữ ẩm, bổ sung canxi tự nhiên (vỏ trứng nghiền, bột vỏ sò).',
    chem: 'Có thể phun phân bón lá chứa canxi theo nhãn.',
    prevention: 'Duy trì độ ẩm đều, tránh bón thừa đạm.',
    products: [['Phân hữu cơ vi sinh', 'Cân bằng dinh dưỡng cho giai đoạn đậu quả'], ['Đất trồng hữu cơ (5kg)', 'Phủ gốc giữ ẩm đều']],
  },
  {
    id: 'chay-nang', name: 'Cháy nắng, sốc nhiệt', sci: 'Heat / sun scorch', group: 'Môi trường', emoji: '☀️',
    signs: ['scorch', 'drop', 'wilt_day'], hosts: ['all'],
    symptoms: 'Mép lá khô cháy, lá bạc màu, hoa quả non rụng sau đợt nắng nóng.',
    cause: 'Nắng gắt buổi trưa, gió nóng, thiếu nước hoặc trồng sát tường nóng.',
    organic: 'Che lưới 50-70% khoảng 10h-15h, tưới sáng sớm hoặc chiều mát, phủ gốc giữ ẩm.',
    chem: 'Không cần thuốc; điều chỉnh vị trí và cách tưới.',
    prevention: 'Chọn giống hợp mùa vụ; di chuyển chậu vào chỗ râm buổi trưa.',
    products: [['Chậu nhựa 30cm', 'Chậu di động, dễ dời vào chỗ mát']],
  },
]

// Chẩn đoán dựa trên dấu hiệu người dùng chọn.
// Điểm = 60% (khớp / số dấu hiệu đã chọn) + 40% (khớp / số dấu hiệu của bệnh) + 5 nếu đúng loại cây.
export function diagnose(selected, crop) {
  if (!selected.length) return []
  return WIKI_DISEASES.map(d => {
    const hit = d.signs.filter(s => selected.includes(s)).length
    if (!hit) return null
    const hostOk = crop && (d.hosts.includes('all') || d.hosts.includes(crop))
    const hostBonus = hostOk ? 5 : 0
    // Loại cây đã chọn mà bệnh này không hại cây đó -> bỏ
    if (crop && !hostOk) return null
    const score = Math.min(99, Math.round((hit / selected.length) * 60 + (hit / d.signs.length) * 40 + hostBonus))
    return { d, hit, score }
  }).filter(Boolean).sort((a, b) => b.score - a.score).slice(0, 4)
}
