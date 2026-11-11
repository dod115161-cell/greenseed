import { useState, useEffect } from 'react'
import { vnd } from '../data/mockData'
import { ROOTSTOCKS, SCIONS, POT_TYPES, HEIGHT_OPTIONS } from '../data/graftingData'

export default function CustomGrafting({ user, addCart }) {
  // Trạng thái cấu hình ghép cây
  const [selectedRoot, setSelectedRoot] = useState(ROOTSTOCKS[0])
  const [selectedScion, setSelectedScion] = useState(SCIONS[0])
  const [selectedHeight, setSelectedHeight] = useState(HEIGHT_OPTIONS[0])
  const [ageMonths, setAgeMonths] = useState(2) // 2 hoặc 6 tháng dưỡng
  const [selectedPot, setSelectedPot] = useState(POT_TYPES[0])
  
  // Danh sách đơn hàng ghép tùy chỉnh đã lưu (lưu vào localStorage để tương tác thật)
  const [customOrders, setCustomOrders] = useState(() => {
    try {
      const saved = localStorage.getItem('gs_custom_grafting_orders')
      return saved ? JSON.parse(saved) : []
    } catch {
      return []
    }
  })

  const [message, setMessage] = useState('')

  useEffect(() => {
    try {
      localStorage.setItem('gs_custom_grafting_orders', JSON.stringify(customOrders))
    } catch {}
  }, [customOrders])

  // Tính tổng chi phí và thời gian ước tính
  const calculatedPrice = selectedRoot.price + selectedScion.price + selectedHeight.extraPrice + selectedPot.price + (ageMonths === 6 ? 50000 : 0)
  const estimatedDays = selectedScion.days + (ageMonths === 6 ? 30 : 0)

  // Xử lý xác nhận tạo đơn & Đưa thẳng vào giỏ hàng thật
  const handleCreateCustomOrder = () => {
    if (!user) {
      setMessage('⚠️ Vui lòng đăng nhập tài khoản Google để lưu đơn hàng và tiến hành đặt giống theo yêu cầu!')
      return
    }

    const newOrder = {
      id: 'graft-' + Date.now(),
      name: `Cây ghép theo yêu cầu: ${selectedScion.name} trên ${selectedRoot.name}`,
      price: calculatedPrice,
      emoji: selectedScion.emoji,
      qty: 1,
      specs: {
        root: selectedRoot.name,
        scion: selectedScion.name,
        height: selectedHeight.name,
        age: `${ageMonths} tháng dưỡng`,
        pot: selectedPot.name
      },
      progressStep: 1, // Bước 1: Tiếp nhận & Chuẩn bị gốc ghép
      estimatedDays: estimatedDays,
      createdAt: new Date().toLocaleDateString('vi-VN')
    }

    // 1. Lưu vào danh sách đơn ghép của tôi
    setCustomOrders(prev => [newOrder, ...prev])

    // 2. Thêm thẳng vào giỏ hàng thật của ứng dụng (addCart)
    if (addCart) {
      addCart(newOrder)
    }

    setMessage('🎉 Đã tạo cấu hình thành công! Đơn hàng ghép cây đã được thêm vào giỏ hàng và kích hoạt nhật ký theo dõi tiến độ.')
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-8 text-slate-100">
      <div>
        <span className="text-lime-400 text-xs font-bold uppercase tracking-widest">Custom Grafting & Order-to-Breed</span>
        <h2 className="font-serif text-3xl font-bold text-white mt-1">Dịch Vụ Ghép Giống & Đặt Hàng Theo Yêu Cầu</h2>
        <p className="text-xs text-slate-400 mt-1">Dành cho khách B2B và nhà vườn muốn sở hữu dòng cây độc quyền với đặc tính sinh học riêng biệt.</p>
      </div>

      {message && (
        <div className="p-3 bg-emerald-950/80 border border-lime-400/50 rounded-xl text-xs text-lime-300 flex justify-between items-center">
          <span>{message}</span>
          <button onClick={() => setMessage('')} className="text-slate-400 hover:text-white font-bold ml-2">✕</button>
        </div>
      )}

      {/* --- BỘ CÔNG CỤ PHỐI GIỐNG ẢO (CONFIGURATOR) --- */}
      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6 bg-slate-900 border border-emerald-900/60 p-6 rounded-2xl shadow-xl">
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            🧬 Bộ Công Cụ Phối Giống Ảo (Virtual Plant Breeding Configurator)
          </h3>

          {/* 1. Chọn Gốc Ghép */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-lime-400 uppercase">1. Chọn Cây gốc / Gốc ghép (Sức sống khỏe, kháng bệnh)</label>
            <div className="grid sm:grid-cols-3 gap-3">
              {ROOTSTOCKS.map(rs => (
                <button
                  key={rs.id}
                  onClick={() => setSelectedRoot(rs)}
                  className={`p-3 rounded-xl border text-left text-xs transition flex flex-col justify-between ${selectedRoot.id === rs.id ? 'bg-emerald-900/60 border-lime-400 text-white' : 'bg-slate-950 border-slate-800 text-slate-300 hover:border-emerald-700'}`}
                >
                  <div>
                    <span className="text-2xl">{rs.emoji}</span>
                    <p className="font-medium mt-2">{rs.name}</p>
                  </div>
                  <span className="text-lime-400 font-bold mt-3">{vnd(rs.price)}</span>
                </button>
              ))}
            </div>
          </div>

          {/* 2. Chọn Ngọn Giống */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-lime-400 uppercase">2. Chọn Cây ngọn / Giống ghép (Trái ngọt, hoa đẹp, đột biến)</label>
            <div className="grid sm:grid-cols-3 gap-3">
              {SCIONS.map(sc => (
                <button
                  key={sc.id}
                  onClick={() => setSelectedScion(sc)}
                  className={`p-3 rounded-xl border text-left text-xs transition flex flex-col justify-between ${selectedScion.id === sc.id ? 'bg-emerald-900/60 border-lime-400 text-white' : 'bg-slate-950 border-slate-800 text-slate-300 hover:border-emerald-700'}`}
                >
                  <div>
                    <span className="text-2xl">{sc.emoji}</span>
                    <p className="font-medium mt-2">{sc.name}</p>
                  </div>
                  <div className="mt-3 flex justify-between items-center">
                    <span className="text-lime-400 font-bold">{vnd(sc.price)}</span>
                    <span className="text-[10px] text-slate-400">~{sc.days} ngày</span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* 3. Tiêu chuẩn: Chiều cao & Độ tuổi */}
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-xs font-semibold text-lime-400 uppercase">3. Chiều cao mong muốn</label>
              <select 
                className="w-full bg-slate-950 text-slate-200 text-xs rounded-xl border border-emerald-800 p-3"
                value={selectedHeight.id}
                onChange={e => setSelectedHeight(HEIGHT_OPTIONS.find(h => h.id === e.target.value))}
              >
                {HEIGHT_OPTIONS.map(h => (
                  <option key={h.id} value={h.id}>{h.name} {h.extraPrice > 0 ? `(+${vnd(h.extraPrice)})` : ''}</option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-semibold text-lime-400 uppercase">4. Độ tuổi bầu cây dưỡng</label>
              <div className="flex gap-2">
                {[2, 6].map(m => (
                  <button
                    key={m}
                    onClick={() => setAgeMonths(m)}
                    className={`flex-1 py-3 rounded-xl border text-xs font-bold transition ${ageMonths === m ? 'bg-emerald-600 text-white border-emerald-500' : 'bg-slate-950 text-slate-300 border-emerald-800'}`}
                  >
                    {m} tháng dưỡng
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* 5. Loại chậu đóng gói */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-lime-400 uppercase">5. Loại chậu đóng gói giao hàng</label>
            <div className="grid sm:grid-cols-3 gap-3">
              {POT_TYPES.map(p => (
                <button
                  key={p.id}
                  onClick={() => setSelectedPot(p)}
                  className={`p-2.5 rounded-xl border text-left text-xs transition flex justify-between items-center ${selectedPot.id === p.id ? 'bg-emerald-900/60 border-lime-400 text-white' : 'bg-slate-950 border-slate-800 text-slate-300'}`}
                >
                  <span>{p.name}</span>
                  <span className="text-lime-400 font-bold ml-2">{vnd(p.price)}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* --- BẢNG TỔNG KẾT & NÚT ĐẶT HÀNG THẬT --- */}
        <div className="bg-slate-900 border border-emerald-900/60 p-6 rounded-2xl shadow-xl flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            <h3 className="text-base font-bold text-white border-b border-emerald-900/60 pb-3">📋 Tóm Tắt Cấu Hình Đơn Ghép</h3>
            
            <ul className="text-xs space-y-2 text-slate-300">
              <li className="flex justify-between"><span>Gốc ghép:</span> <b className="text-white text-right">{selectedRoot.name}</b></li>
              <li className="flex justify-between"><span>Ngọn giống:</span> <b className="text-white text-right">{selectedScion.name}</b></li>
              <li className="flex justify-between"><span>Quy cách:</span> <b className="text-white">{selectedHeight.name}</b></li>
              <li className="flex justify-between"><span>Thời gian dưỡng:</span> <b className="text-white">{ageMonths} tháng</b></li>
              <li className="flex justify-between"><span>Loại chậu:</span> <b className="text-white">{selectedPot.name}</b></li>
            </ul>

            <div className="bg-slate-950 p-4 rounded-xl border border-emerald-900/40 space-y-2">
              <div className="flex justify-between text-xs text-slate-400">
                <span>Thời gian hoàn thiện:</span>
                <b className="text-amber-400 font-bold">~{estimatedDays} ngày</b>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-xs text-slate-300 font-semibold">Tổng chi phí:</span>
                <span className="text-2xl font-bold text-lime-400">{vnd(calculatedPrice)}</span>
              </div>
            </div>
          </div>

          <button
            onClick={handleCreateCustomOrder}
            className="w-full py-3.5 bg-lime-400 hover:bg-lime-300 text-slate-950 font-bold text-xs rounded-xl shadow-lg transition cursor-pointer flex items-center justify-center gap-2"
          >
            🛒 Xác Nhận & Đưa Vào Giỏ Hàng
          </button>
        </div>
      </div>

      {/* --- LUỒNG XỬ LÝ & THEO DÕI NHẬT KÝ TIẾN ĐỘ --- */}
      <div className="space-y-4 pt-6 border-t border-emerald-900/40">
        <h3 className="text-xl font-bold text-white">🌿 Nhật Ký & Tiến Độ Ghép Cây Theo Tuần</h3>
        <p className="text-xs text-slate-400">Theo dõi trực tiếp hình ảnh và video cập nhật từ kỹ sư nhà vườn cho các đơn hàng tùy chỉnh của bạn.</p>

        {!customOrders.length ? (
          <div className="bg-slate-900/60 border border-emerald-900/40 rounded-2xl p-8 text-center text-slate-400 text-xs">
            Bạn chưa có đơn đặt hàng ghép cây nào. Hãy cấu hình bên trên và bấm xác nhận để bắt đầu theo dõi tiến độ!
          </div>
        ) : (
          <div className="space-y-6">
            {customOrders.map(order => (
              <div key={order.id} className="bg-slate-900 border border-emerald-900/60 rounded-2xl p-6 space-y-4 shadow-xl">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-2 border-b border-emerald-900/40 pb-4">
                  <div>
                    <span className="text-[10px] bg-emerald-950 text-lime-400 px-2.5 py-0.5 rounded border border-emerald-800 font-bold">Đơn tùy chỉnh: {order.createdAt}</span>
                    <h4 className="text-base font-bold text-white mt-1">{order.name}</h4>
                  </div>
                  <div className="text-right">
                    <span className="text-xs text-slate-400 block">Trị giá đơn</span>
                    <span className="text-lg font-bold text-lime-400">{vnd(order.price)}</span>
                  </div>
                </div>

                {/* Thanh tiến trình các bước */}
                <div className="grid sm:grid-cols-4 gap-2 text-center text-xs">
                  <div className="p-3 bg-emerald-950 border border-lime-400/50 rounded-xl text-lime-300 font-semibold">
                    ✅ 1. Chọn giống & Ghép cành
                  </div>
                  <div className="p-3 bg-slate-950 border border-emerald-800 rounded-xl text-slate-300">
                    ⏳ 2. Liền sẹo & Nảy mầm (Tuần 2-3)
                  </div>
                  <div className="p-3 bg-slate-950 border border-emerald-800 rounded-xl text-slate-300">
                    🌱 3. Dưỡng mầm & Phân bón (Tuần 4+)
                  </div>
                  <div className="p-3 bg-slate-950 border border-emerald-800 rounded-xl text-slate-300">
                    📦 4. Đóng bầu giao hàng
                  </div>
                </div>

                {/* Nhật ký hình ảnh giả lập từ nhà vườn */}
                <div className="bg-slate-950/60 p-4 rounded-xl border border-emerald-900/40 space-y-3">
                  <span className="text-xs font-bold text-lime-400">📸 Nhật ký hình ảnh nhà vườn cập nhật:</span>
                  <div className="grid sm:grid-cols-3 gap-3 text-xs text-slate-300">
                    <div className="bg-slate-900 p-3 rounded-xl border border-emerald-900/50 space-y-2">
                      <div className="h-28 bg-emerald-950 rounded-lg grid place-items-center text-3xl">{order.emoji}</div>
                      <p className="font-semibold text-white">Tuần 1: Vừa thực hiện ghép nêm</p>
                      <p className="text-[11px] text-slate-400">Mối ghép được quấn băng keo tự hủy chuyên dụng, đưa vào nhà màng che nắng 70%.</p>
                    </div>
                    <div className="bg-slate-900 p-3 rounded-xl border border-emerald-900/50 space-y-2 opacity-60">
                      <div className="h-28 bg-slate-950 rounded-lg grid place-items-center text-2xl">🌱</div>
                      <p className="font-semibold text-white">Tuần 3: Ra mầm non (Dự kiến)</p>
                      <p className="text-[11px] text-slate-400">Mầm bắt đầu bung chồi đầu tiên, kiểm tra độ bám dính của mô sẹo.</p>
                    </div>
                    <div className="bg-slate-900 p-3 rounded-xl border border-emerald-900/50 space-y-2 opacity-60">
                      <div className="h-28 bg-slate-950 rounded-lg grid place-items-center text-2xl">📦</div>
                      <p className="font-semibold text-white">Tuần {Math.round(order.estimatedDays / 7)}: Sẵn sàng giao hàng</p>
                      <p className="text-[11px] text-slate-400">Cây khỏe mạnh, đóng chậu cố định sẵn sàng vận chuyển tận nơi.</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}