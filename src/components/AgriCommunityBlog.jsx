import { useState, useEffect } from 'react'
import { vnd } from '../data/mockData'
import { WIKI_ARTICLES, INITIAL_COMMUNITY_FEED, AI_DISEASE_DATABASE } from '../data/agriBlogData'

export default function AgriCommunityBlog({ user, addCart }) {
  const [activeTab, setActiveTab] = useState('wiki') // 'wiki' | 'feed' | 'doctor'
  const [selectedArticle, setSelectedArticle] = useState(null)
  const [message, setMessage] = useState('')

  // State Nhật ký cộng đồng & Điểm thưởng
  const [feed, setFeed] = useState(() => {
    try {
      const saved = localStorage.getItem('gs_community_feed')
      return saved ? JSON.parse(saved) : INITIAL_COMMUNITY_FEED
    } catch {
      return INITIAL_COMMUNITY_FEED
    }
  })
  
  const [userPoints, setUserPoints] = useState(() => {
    try {
      return Number(localStorage.getItem('gs_user_loyalty_points')) || 120
    } catch {
      return 120
    }
  })

  // State Form đăng bài nhật ký làm vườn
  const [newPost, setNewPost] = useState({ plantName: '', dayCount: '', status: '', image: '🌱' })

  // State AI Bác sĩ cây trồng
  const [aiImageText, setAiImageText] = useState('')
  const [aiResult, setAiResult] = useState(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)

  useEffect(() => {
    try { localStorage.setItem('gs_community_feed', JSON.stringify(feed)) } catch {}
  }, [feed])

  useEffect(() => {
    try { localStorage.setItem('gs_user_loyalty_points', userPoints.toString()) } catch {}
  }, [userPoints])

  // Xử lý đăng bài Nhật ký làm vườn nhận điểm
  const handlePostFeed = (e) => {
    e.preventDefault()
    if (!user) {
      setMessage('⚠️ Vui lòng đăng nhập để chia sẻ nhật ký làm vườn và nhận điểm thưởng!')
      return
    }
    if (!newPost.plantName || !newPost.status) {
      setMessage('⚠️ Vui lòng nhập tên cây và nhật ký chăm sóc!')
      return
    }

    const userName = user.email ? user.email.split('@')[0] : 'Nhà nông Green'
    const postObj = {
      id: 'feed-' + Date.now(),
      user: userName,
      avatar: '👨‍🌾',
      plantName: newPost.plantName,
      dayCount: Number(newPost.dayCount) || 1,
      status: newPost.status,
      image: newPost.image || '🌱',
      likes: 1,
      pointsEarned: 50,
      date: new Date().toLocaleDateString('vi-VN')
    }

    setFeed([postObj, ...feed])
    setUserPoints(prev => prev + 50)
    setMessage('🎉 Đăng nhật ký làm vườn thành công! Bạn nhận được +50 điểm thưởng Loyalty Points!')
    setNewPost({ plantName: '', dayCount: '', status: '', image: '🌱' })
  }

  // Xử lý AI chẩn đoán bệnh cây
  const handleDiagnose = (e) => {
    e.preventDefault()
    if (!aiImageText.trim()) {
      setMessage('⚠️ Vui lòng mô tả triệu chứng hoặc tải tên hình ảnh bệnh lá!')
      return
    }

    setIsAnalyzing(true)
    setAiResult(null)

    setTimeout(() => {
      const lower = aiImageText.toLowerCase()
      const found = AI_DISEASE_DATABASE.find(item => 
        item.keywords.some(k => lower.includes(k))
      ) || AI_DISEASE_DATABASE[0] // Mặc định trả về kết quả bệnh rầy phấn trắng nếu từ khóa lạ

      setAiResult(found)
      setIsAnalyzing(false)
    }, 1200)
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-8 text-slate-100">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <span className="text-lime-400 text-xs font-bold uppercase tracking-widest">Agri-Blog & Social Community</span>
          <h2 className="font-serif text-3xl font-bold text-white mt-1">Wiki Nông Nghiệp & Cộng Đồng Làm Vườn</h2>
          <p className="text-xs text-slate-400 mt-1">Chia sẻ trải nghiệm canh tác, tích điểm đổi quà và chẩn đoán bệnh cây trồng bằng AI.</p>
        </div>

        {/* Điểm thưởng Loyalty Points */}
        <div className="bg-slate-900 border border-emerald-800 px-4 py-2 rounded-xl text-right flex items-center gap-3">
          <span className="text-2xl">🪙</span>
          <div>
            <span className="text-[10px] text-slate-400 block uppercase font-bold">Điểm thưởng tích lũy</span>
            <b className="text-lime-400 text-lg">{userPoints} pts</b>
          </div>
        </div>
      </div>

      {message && (
        <div className="p-3 bg-emerald-950/80 border border-lime-400/50 rounded-xl text-xs text-lime-300 flex justify-between items-center">
          <span>{message}</span>
          <button onClick={() => setMessage('')} className="text-slate-400 hover:text-white font-bold ml-2">✕</button>
        </div>
      )}

      {/* Điều hướng Tab */}
      <div className="flex bg-slate-900 p-1 rounded-xl border border-emerald-800 text-xs w-fit">
        <button 
          onClick={() => { setActiveTab('wiki'); setSelectedArticle(null) }} 
          className={`px-4 py-2 rounded-lg font-semibold transition cursor-pointer ${activeTab === 'wiki' ? 'bg-lime-400 text-slate-950' : 'text-slate-300 hover:text-white'}`}
        >
          📚 Agri-Wiki (Kiến thức)
        </button>
        <button 
          onClick={() => setActiveTab('feed')} 
          className={`px-4 py-2 rounded-lg font-semibold transition cursor-pointer ${activeTab === 'feed' ? 'bg-lime-400 text-slate-950' : 'text-slate-300 hover:text-white'}`}
        >
          🌱 Feed Nhật Ký (+50 Pts)
        </button>
        <button 
          onClick={() => setActiveTab('doctor')} 
          className={`px-4 py-2 rounded-lg font-semibold transition cursor-pointer ${activeTab === 'doctor' ? 'bg-lime-400 text-slate-950' : 'text-slate-300 hover:text-white'}`}
        >
          🩺 Bác Sĩ Cây Trồng AI
        </button>
      </div>

      {/* --- TAB 1: AGRI-WIKI KIẾN THỨC CHUYÊN GIA --- */}
      {activeTab === 'wiki' && (
        selectedArticle ? (
          <div className="bg-slate-900 border border-emerald-900/60 p-6 rounded-2xl space-y-6 shadow-xl">
            <button 
              onClick={() => setSelectedArticle(null)}
              className="text-xs text-lime-400 font-bold hover:underline flex items-center gap-1 cursor-pointer"
            >
              ← Quay lại danh sách bài viết
            </button>

            <div>
              <span className="text-[10px] bg-emerald-950 text-emerald-400 border border-emerald-800 px-2.5 py-0.5 rounded font-bold uppercase">{selectedArticle.category}</span>
              <h3 className="text-2xl font-serif font-bold text-white mt-2">{selectedArticle.title}</h3>
              <p className="text-xs text-slate-400 mt-1">Đăng bởi {selectedArticle.author} • {selectedArticle.date} • {selectedArticle.readTime}</p>
            </div>

            <div className="space-y-4 text-xs leading-relaxed text-slate-300 border-t border-emerald-900/40 pt-4">
              {selectedArticle.content.map((block, idx) => (
                block.type === 'text' ? (
                  <p key={idx}>{block.value}</p>
                ) : (
                  <div key={idx} className="my-4 bg-slate-950 p-4 rounded-xl border border-lime-400/40 space-y-3">
                    <p className="text-amber-300 font-semibold">{block.note}</p>
                    <div className="flex justify-between items-center bg-slate-900 p-3 rounded-lg border border-emerald-900/60">
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">{block.emoji}</span>
                        <div>
                          <b className="text-white text-sm block">{block.productName}</b>
                          <span className="text-lime-400 font-bold">{vnd(block.price)}</span>
                        </div>
                      </div>
                      <button 
                        onClick={() => {
                          if (addCart) {
                            addCart({ id: block.productId, name: block.productName, price: block.price, emoji: block.emoji, qty: 1, stock: 99 })
                            setMessage(`🎉 Đã thêm "${block.productName}" vào giỏ hàng ngay trong bài viết!`)
                          }
                        }}
                        className="px-4 py-2 bg-lime-400 hover:bg-lime-300 text-slate-950 font-bold text-xs rounded-xl shadow transition cursor-pointer"
                      >
                        🛒 Mua ngay vật tư này
                      </button>
                    </div>
                  </div>
                )
              ))}
            </div>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-6">
            {WIKI_ARTICLES.map(art => (
              <div key={art.id} className="bg-slate-900 border border-emerald-900/60 p-5 rounded-2xl space-y-3 shadow-xl flex flex-col justify-between">
                <div className="space-y-2">
                  <div className="flex justify-between items-start">
                    <span className="text-3xl bg-emerald-950 p-2 rounded-xl border border-emerald-800">{art.image}</span>
                    <span className="text-[10px] text-slate-400">{art.readTime}</span>
                  </div>
                  <span className="text-[10px] bg-emerald-950 text-emerald-400 border border-emerald-800 px-2 py-0.5 rounded font-bold uppercase">{art.category}</span>
                  <h3 className="text-lg font-bold text-white hover:text-lime-400 transition cursor-pointer" onClick={() => setSelectedArticle(art)}>
                    {art.title}
                  </h3>
                  <p className="text-xs text-slate-400 line-clamp-2">{art.summary}</p>
                </div>

                <button 
                  onClick={() => setSelectedArticle(art)}
                  className="w-full py-2.5 bg-slate-950 hover:bg-emerald-900/50 text-lime-400 font-bold text-xs rounded-xl border border-emerald-800 transition cursor-pointer mt-4"
                >
                  📖 Đọc chi tiết & Mua vật tư
                </button>
              </div>
            ))}
          </div>
        )
      )}

      {/* --- TAB 2: FEED NHẬT KÝ LÀM VƯỜN CÁ NHÂN --- */}
      {activeTab === 'feed' && (
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Form đăng nhật ký */}
          <div className="bg-slate-900 border border-emerald-900/60 p-5 rounded-2xl space-y-4 shadow-xl h-fit">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              📸 Chia Sẻ Nhật Ký Làm Vườn
            </h3>
            <p className="text-xs text-slate-400">Đăng quá trình lớn lên của cây để nhận ngay +50 Loyalty Points!</p>

            <form onSubmit={handlePostFeed} className="space-y-3 text-xs">
              <div>
                <label className="text-slate-400 block mb-1">Tên giống cây / Cây trồng</label>
                <input 
                  type="text" 
                  className="inp w-full"
                  placeholder="VD: Cà chua Trái Tim Var..."
                  value={newPost.plantName}
                  onChange={e => setNewPost({...newPost, plantName: e.target.value})}
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-slate-400 block mb-1">Độ tuổi cây (Ngày)</label>
                  <input 
                    type="number" 
                    className="inp w-full"
                    placeholder="30"
                    value={newPost.dayCount}
                    onChange={e => setNewPost({...newPost, dayCount: e.target.value})}
                  />
                </div>
                <div>
                  <label className="text-slate-400 block mb-1">Emoji cây</label>
                  <input 
                    type="text" 
                    className="inp w-full"
                    placeholder="🍅, 🌹, 🌿..."
                    value={newPost.image}
                    onChange={e => setNewPost({...newPost, image: e.target.value})}
                  />
                </div>
              </div>

              <div>
                <label className="text-slate-400 block mb-1">Nhật ký chăm sóc / Trải nghiệm</label>
                <textarea 
                  className="inp w-full h-20"
                  placeholder="Cây ra mầm khỏe, lá xanh bóng nhờ bón phân..."
                  value={newPost.status}
                  onChange={e => setNewPost({...newPost, status: e.target.value})}
                />
              </div>

              <button type="submit" className="w-full py-3 bg-lime-400 hover:bg-lime-300 text-slate-950 font-bold rounded-xl transition cursor-pointer">
                🚀 Đăng Bài & Nhận +50 Điểm
              </button>
            </form>
          </div>

          {/* Bảng tin Feed cộng đồng */}
          <div className="lg:col-span-2 space-y-4">
            <h3 className="text-base font-bold text-white">🌐 Nhật Ký Cộng Đồng Làm Vườn GreenSeed</h3>
            {feed.map(item => (
              <div key={item.id} className="bg-slate-900 border border-emerald-900/60 p-5 rounded-2xl space-y-3 shadow-xl">
                <div className="flex justify-between items-center text-xs">
                  <div className="flex items-center gap-2">
                    <span className="text-xl bg-slate-950 p-1.5 rounded-full border border-emerald-800">{item.avatar}</span>
                    <div>
                      <b className="text-white block">{item.user}</b>
                      <span className="text-slate-400 text-[10px]">{item.date}</span>
                    </div>
                  </div>
                  <span className="bg-emerald-950 text-lime-400 px-2.5 py-1 rounded-full text-[11px] font-bold border border-emerald-800">
                    🌱 {item.plantName} ({item.dayCount} ngày tuổi)
                  </span>
                </div>

                <p className="text-xs text-slate-200 leading-relaxed bg-slate-950/40 p-3 rounded-xl border border-emerald-900/30">
                  "{item.status}"
                </p>

                <div className="flex justify-between items-center pt-2 text-xs text-slate-400">
                  <span className="text-2xl">{item.image}</span>
                  <button 
                    onClick={() => {
                      setFeed(feed.map(f => f.id === item.id ? { ...f, likes: f.likes + 1 } : f))
                    }}
                    className="flex items-center gap-1.5 px-3 py-1 bg-slate-950 hover:bg-emerald-900/40 rounded-lg border border-emerald-800 text-slate-300 transition cursor-pointer"
                  >
                    ❤️ {item.likes} Lượt thích
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* --- TAB 3: BÁC SĨ CÂY TRỒNG AI --- */}
      {activeTab === 'doctor' && (
        <div className="max-w-3xl mx-auto space-y-6">
          <div className="bg-slate-900 border border-emerald-900/60 p-6 rounded-2xl space-y-4 shadow-xl">
            <div className="flex items-center gap-3">
              <span className="text-3xl bg-emerald-950 p-2 rounded-xl border border-emerald-800">🩺</span>
              <div>
                <h3 className="text-lg font-bold text-white">Chẩn Đoán Bệnh Cây Trồng Bằng AI</h3>
                <p className="text-xs text-slate-400">Nhập mô tả vết bệnh trên lá/thân hoặc giả lập tải ảnh lên để AI nhận diện và đưa ra phác đồ điều trị.</p>
              </div>
            </div>

            <form onSubmit={handleDiagnose} className="space-y-3 text-xs">
              <div>
                <label className="text-slate-400 block mb-1">Mô tả triệu chứng bệnh hoặc tải ảnh lá bị bệnh</label>
                <input 
                  type="text" 
                  className="inp w-full"
                  placeholder="VD: Lá xuất hiện đốm trắng phấn, lá bị quăn rầy..."
                  value={aiImageText}
                  onChange={e => setAiImageText(e.target.value)}
                />
              </div>

              <div className="flex gap-2">
                <button 
                  type="submit" 
                  disabled={isAnalyzing}
                  className="flex-1 py-3 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white font-bold rounded-xl transition cursor-pointer"
                >
                  {isAnalyzing ? '⏳ AI đang quét phân tích...' : '🔍 Phân Tích & Chẩn Đoán AI'}
                </button>
              </div>
            </form>
          </div>

          {/* Kết quả chẩn đoán AI */}
          {aiResult && (
            <div className="bg-slate-900 border border-lime-400/50 p-6 rounded-2xl space-y-4 shadow-xl animate-fade-in">
              <div className="flex justify-between items-start border-b border-emerald-900/40 pb-3">
                <div>
                  <span className="text-[10px] bg-red-950 text-red-400 px-2 py-0.5 rounded border border-red-800 font-bold uppercase">{aiResult.severity}</span>
                  <h4 className="text-lg font-bold text-white mt-1">{aiResult.diseaseName}</h4>
                </div>
              </div>

              <div className="space-y-2 text-xs text-slate-300">
                <p><b>Triệu chứng nhận diện:</b> {aiResult.symptoms}</p>
                <p><b>Phác đồ điều trị khuyến nghị:</b> {aiResult.treatment}</p>
              </div>

              {/* Thuốc sinh học đề xuất */}
              <div className="bg-slate-950 p-4 rounded-xl border border-emerald-800 space-y-3 mt-4">
                <span className="text-xs font-bold text-lime-400 block">🌿 Đề xuất thuốc sinh học khắc phục:</span>
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{aiResult.recommendedProduct.emoji}</span>
                    <div>
                      <b className="text-white text-xs block">{aiResult.recommendedProduct.name}</b>
                      <span className="text-lime-400 font-bold text-xs">{vnd(aiResult.recommendedProduct.price)}</span>
                    </div>
                  </div>
                  <button 
                    onClick={() => {
                      if (addCart) {
                        addCart({ ...aiResult.recommendedProduct, qty: 1, stock: 99 })
                        setMessage(`🎉 Đã thêm thuốc điều trị "${aiResult.recommendedProduct.name}" vào giỏ hàng!`)
                      }
                    }}
                    className="px-4 py-2 bg-lime-400 hover:bg-lime-300 text-slate-950 font-bold text-xs rounded-xl shadow transition cursor-pointer"
                  >
                    🛒 Đặt thuốc ngay
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}