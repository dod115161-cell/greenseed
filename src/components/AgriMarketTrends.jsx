import { useState } from 'react'
import { vnd } from '../data/mockData'
import { MARKET_PRICES, AI_PREDICTIONS } from '../data/marketData'

export default function AgriMarketTrends({ user, addCart }) {
  const [activeTab, setActiveTab] = useState('prediction')
  const [message, setMessage] = useState('')

  const handleActionClick = (item) => {
    if (addCart) {
      addCart({
        id: item.recommendedProductId,
        name: item.recommendedName,
        price: item.price,
        emoji: item.emoji,
        qty: 1,
        stock: 99
      })
      setMessage(`🎉 Đã thêm hạt giống đón đầu "${item.recommendedName}" vào giỏ hàng thành công!`)
    }
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-8 text-slate-100">
      <div>
        <span className="text-lime-400 text-xs font-bold uppercase tracking-widest">Agri Price Forecasting & Market Trends</span>
        <h2 className="font-serif text-3xl font-bold text-white mt-1">AI Dự Đoán Giá Nông Sản & Xu Hướng Gieo Trồng</h2>
        <p className="text-xs text-slate-400 mt-1">Cập nhật biến động thị trường thời gian thực, phân tích dữ liệu lớn và gợi ý lịch gieo trồng tối ưu lợi nhuận cho nhà nông.</p>
      </div>

      {message && (
        <div className="p-3 bg-emerald-950/80 border border-lime-400/50 rounded-xl text-xs text-lime-300 flex justify-between items-center">
          <span>{message}</span>
          <button onClick={() => setMessage('')} className="text-slate-400 hover:text-white font-bold ml-2">✕</button>
        </div>
      )}

      {/* Tabs chuyển đổi */}
      <div className="flex bg-slate-900 p-1 rounded-xl border border-emerald-800 text-xs w-fit">
        <button 
          onClick={() => setActiveTab('prediction')} 
          className={`px-4 py-2 rounded-lg font-semibold transition cursor-pointer ${activeTab === 'prediction' ? 'bg-lime-400 text-slate-950' : 'text-slate-300 hover:text-white'}`}
        >
          🤖 AI Dự Báo & Gợi Ý Gieo Trồng
        </button>
        <button 
          onClick={() => setActiveTab('market')} 
          className={`px-4 py-2 rounded-lg font-semibold transition cursor-pointer ${activeTab === 'market' ? 'bg-lime-400 text-slate-950' : 'text-slate-300 hover:text-white'}`}
        >
          📈 Biểu Đồ Giá Thị Trường Trực Tuyến
        </button>
      </div>

      {/* --- TAB 1: AI DỰ BÁO & GỢI Ý GIEO TRỒNG --- */}
      {activeTab === 'prediction' && (
        <div className="space-y-6">
          <div className="bg-gradient-to-r from-emerald-950 to-slate-900 border border-emerald-800/60 p-6 rounded-2xl shadow-xl space-y-3">
            <div className="flex items-center gap-2 text-lime-400 text-sm font-bold">
              <span>💡</span> Trợ lý AI Khuyến Nghị Mùa Vụ
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              Hệ thống phân tích dựa trên chuỗi dữ liệu thời tiết nhiều năm, lượng tồn kho vùng chuyên canh và tín hiệu cung - cầu thị trường xuất khẩu. Hãy đón đầu xu hướng để tránh tình trạng "được mùa mất giá".
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {AI_PREDICTIONS.map(item => (
              <div key={item.id} className="bg-slate-900 border border-emerald-900/60 rounded-2xl p-5 space-y-4 shadow-xl flex flex-col justify-between">
                <div className="space-y-3">
                  <div className="flex justify-between items-start">
                    <span className="text-3xl bg-emerald-950 p-2 rounded-xl border border-emerald-800">{item.emoji}</span>
                    <span className="px-3 py-1 rounded-full text-[11px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                      🔥 {item.forecast}
                    </span>
                  </div>

                  <div>
                    <h3 className="text-lg font-bold text-white mt-1">{item.crop}</h3>
                    <p className="text-xs text-slate-400 mt-2"><b>Phân tích AI:</b> {item.reason}</p>
                  </div>

                  <div className="bg-slate-950/60 p-3 rounded-xl border border-emerald-900/40 text-xs space-y-1">
                    <span className="text-lime-400 font-bold block">🌱 Khuyến nghị gieo trồng:</span>
                    <p className="text-slate-300">{item.actionAdvice}</p>
                  </div>
                </div>

                <div className="pt-4 border-t border-emerald-900/40 space-y-3">
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-slate-400">Giống chuẩn F1:</span>
                    <b className="text-lime-400">{vnd(item.price)}</b>
                  </div>
                  <button
                    onClick={() => handleActionClick(item)}
                    className="w-full py-2.5 bg-lime-400 hover:bg-lime-300 text-slate-950 font-bold text-xs rounded-xl transition cursor-pointer shadow-lg flex items-center justify-center gap-2"
                  >
                    🛒 Nhận giống đón đầu thị trường
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* --- TAB 2: BIỂU ĐỒ GIÁ THỊ TRƯỜNG --- */}
      {activeTab === 'market' && (
        <div className="space-y-4">
          <div className="bg-slate-900 border border-emerald-900/60 rounded-2xl p-6 shadow-xl space-y-4">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              📊 Bảng Cập Nhật Giá Thu Mua Nông Sản Hàng Ngày
            </h3>
            <p className="text-xs text-slate-400">Dữ liệu được thu thập trực tiếp từ các chợ đầu mối và hợp tác xã trọng điểm trên toàn quốc.</p>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-950 text-slate-400 uppercase border-b border-emerald-900/60">
                  <tr>
                    <th className="p-3">Nông sản</th>
                    <th className="p-3">Danh mục</th>
                    <th className="p-3">Vùng trọng điểm</th>
                    <th className="p-3">Giá thu mua hiện tại</th>
                    <th className="p-3 text-right">Biến động 24h</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-emerald-900/40">
                  {MARKET_PRICES.map(row => (
                    <tr key={row.id} className="hover:bg-slate-950/40 transition">
                      <td className="p-3 font-bold text-white">{row.name}</td>
                      <td className="p-3 text-slate-300">{row.category}</td>
                      <td className="p-3 text-slate-400">{row.region}</td>
                      <td className="p-3 text-lime-400 font-bold">{vnd(row.price)} / {row.unit}</td>
                      <td className="p-3 text-right">
                        <span className={`px-2 py-1 rounded font-bold text-[11px] ${row.isUp ? 'bg-emerald-950 text-lime-400 border border-emerald-800' : 'bg-red-950 text-red-400 border border-red-800'}`}>
                          {row.change}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}