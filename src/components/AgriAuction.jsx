import { useState, useEffect } from 'react'
import { vnd } from '../data/mockData'
import { getInitialAuctions, getInitialReverseAuctions } from '../data/auctionData'

export default function AgriAuction({ user, addCart }) {
  const [tab, setTab] = useState('forward')
  
  const [auctions, setAuctions] = useState(() => {
    try {
      const saved = localStorage.getItem('gs_auctions_data')
      if (saved) {
        const parsed = JSON.parse(saved)
        if (parsed.some(item => item.endTime > Date.now())) return parsed
      }
    } catch {}
    return getInitialAuctions()
  })

  const [reverseAuctions, setReverseAuctions] = useState(() => {
    try {
      const saved = localStorage.getItem('gs_reverse_auctions')
      if (saved) {
        const parsed = JSON.parse(saved)
        if (parsed.some(item => item.endTime > Date.now())) return parsed
      }
    } catch {}
    return getInitialReverseAuctions()
  })
  
  const [bidInputs, setBidInputs] = useState({})
  const [revInputs, setRevInputs] = useState({})
  const [message, setMessage] = useState('')
  const [, setTick] = useState(0)

  useEffect(() => {
    try { localStorage.setItem('gs_auctions_data', JSON.stringify(auctions)) } catch {}
  }, [auctions])

  useEffect(() => {
    try { localStorage.setItem('gs_reverse_auctions', JSON.stringify(reverseAuctions)) } catch {}
  }, [reverseAuctions])

  useEffect(() => {
    const timer = setInterval(() => setTick(t => t + 1), 1000)
    return () => clearInterval(timer)
  }, [])

  const handleResetTest = () => {
    localStorage.removeItem('gs_auctions_data')
    localStorage.removeItem('gs_reverse_auctions')
    setAuctions(getInitialAuctions())
    setReverseAuctions(getInitialReverseAuctions())
    setMessage('🔄 Đã làm mới toàn bộ dữ liệu đấu giá thử nghiệm!')
  }

  const handlePlaceBid = (id) => {
    if (!user) {
      setMessage('⚠️ Vui lòng đăng nhập Google để tham gia ký quỹ đặt cọc và đấu giá!')
      return
    }

    const val = Number(bidInputs[id])
    const item = auctions.find(a => a.id === id)
    const now = Date.now()
    const remaining = item.endTime - now

    if (remaining <= 0) {
      setMessage('❌ Phiên đấu giá này đã kết thúc!')
      return
    }

    if (!val || val <= item.currentPrice) {
      setMessage(`❌ Giá trả phải cao hơn giá hiện tại (${vnd(item.currentPrice)})!`)
      return
    }

    const isPhutChot = remaining < 3 * 60 * 1000
    const newEndTime = isPhutChot ? item.endTime + (3 * 60 * 1000) : item.endTime
    const userName = user.email ? user.email.split('@')[0] : 'Bạn'

    setAuctions(prev => prev.map(a => {
      if (a.id === id) {
        return {
          ...a,
          currentPrice: val,
          bidsCount: a.bidsCount + 1,
          highestBidder: userName,
          endTime: newEndTime
        }
      }
      return a
    }))

    if (isPhutChot) {
      setMessage(`✅ Ra giá thành công ${vnd(val)}! ⏳ Do ra giá ở phút chót, phiên đấu giá ĐÃ ĐƯỢC GIA HẠN THÊM 3 PHÚT!`)
    } else {
      setMessage(`✅ Ra giá thành công ${vnd(val)}! Đã khóa cọc Escrow an toàn.`)
    }
    
    setBidInputs(prev => ({ ...prev, [id]: '' }))
  }

  const handlePlaceReverseBid = (id) => {
    if (!user) {
      setMessage('⚠️ Vui lòng đăng nhập tài khoản nhà cung cấp!')
      return
    }
    const val = Number(revInputs[id])
    const item = reverseAuctions.find(a => a.id === id)
    if ((item.endTime - Date.now()) <= 0) {
      setMessage('❌ Phiên đấu thầu đã kết thúc!')
      return
    }

    if (!val || val >= item.lowestBid) {
      setMessage(`❌ Giá bỏ thầu phải thấp hơn mức thấp nhất hiện tại (${vnd(item.lowestBid)})!`)
      return
    }

    const userName = user.email ? user.email.split('@')[0] : 'Nhà cung cấp'

    setReverseAuctions(prev => prev.map(a => {
      if (a.id === id) {
        return {
          ...a,
          lowestBid: val,
          bidsCount: a.bidsCount + 1,
          bestSupplier: userName
        }
      }
      return a
    }))
    setMessage(`✅ Đã bỏ thầu thành công mức ${vnd(val)} cho đơn hàng B2B!`)
    setRevInputs(prev => ({ ...prev, [id]: '' }))
  }

  const formatTime = (endTime) => {
    const ms = endTime - Date.now()
    if (!ms || ms <= 0) return 'Đã kết thúc phiên'
    const totalSec = Math.floor(ms / 1000)
    const m = Math.floor(totalSec / 60)
    const s = totalSec % 60
    const h = Math.floor(m / 60)
    return h > 0 ? `${h}h ${m % 60}m ${s}s` : `${m} phút ${s} giây`
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-6 text-slate-100">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="flex items-center gap-3">
            <span className="text-lime-400 text-xs font-bold uppercase tracking-widest">Agri Auction House</span>
            <button 
              onClick={handleResetTest} 
              className="text-[10px] bg-red-900/60 hover:bg-red-800 text-red-200 px-2 py-0.5 rounded border border-red-700 font-semibold cursor-pointer"
            >
              🔄 Reset dữ liệu Test
            </button>
          </div>
          <h2 className="font-serif text-3xl font-bold text-white mt-1">Sàn Đấu Giá Lô Giống & Nông Sản</h2>
          <p className="text-xs text-slate-400 mt-1">Cơ chế đặt cọc tự động Escrow, tự động gia hạn 3 phút nếu có người trả giá ở phút chót.</p>
        </div>
        
        <div className="flex bg-slate-900 p-1 rounded-xl border border-emerald-800 text-xs">
          <button 
            onClick={() => setTab('forward')} 
            className={`px-4 py-2 rounded-lg font-semibold transition ${tab === 'forward' ? 'bg-lime-400 text-slate-950' : 'text-slate-300 hover:text-white'}`}
          >
            🌿 Đấu giá Giống độc/hiếm
          </button>
          <button 
            onClick={() => setTab('reverse')} 
            className={`px-4 py-2 rounded-lg font-semibold transition ${tab === 'reverse' ? 'bg-lime-400 text-slate-950' : 'text-slate-300 hover:text-white'}`}
          >
            🤝 Đấu giá thu mua B2B
          </button>
        </div>
      </div>

      {message && (
        <div className="p-3 bg-emerald-950/80 border border-lime-400/50 rounded-xl text-xs text-lime-300 flex justify-between items-center">
          <span>{message}</span>
          <button onClick={() => setMessage('')} className="text-slate-400 hover:text-white font-bold ml-2">✕</button>
        </div>
      )}

      {tab === 'forward' && (
        <div className="grid md:grid-cols-2 gap-6">
          {auctions.map(item => {
            const isEnded = (item.endTime - Date.now()) <= 0
            const currentUserName = user?.email ? user.email.split('@')[0] : ''
            const isWinner = isEnded && item.highestBidder === currentUserName

            return (
              <div key={item.id} className="bg-slate-900 border border-emerald-900/60 rounded-2xl p-5 space-y-4 shadow-xl relative overflow-hidden">
                <div className="flex justify-between items-start">
                  <span className="text-3xl bg-emerald-950 p-2 rounded-xl border border-emerald-800">{item.emoji}</span>
                  <span className={`px-3 py-1 rounded-full text-xs font-bold ${isEnded ? 'bg-red-500/20 text-red-400 border border-red-500/30' : 'bg-amber-500/20 text-amber-400 border border-amber-500/30 animate-pulse'}`}>
                    ⏳ {formatTime(item.endTime)}
                  </span>
                </div>

                <div>
                  <span className="text-[10px] uppercase font-bold text-emerald-400 bg-emerald-950/80 px-2.5 py-0.5 rounded border border-emerald-800">{item.seller}</span>
                  <h3 className="text-lg font-bold text-white mt-1">{item.title}</h3>
                  <p className="text-xs text-slate-400 mt-1">{item.desc}</p>
                </div>

                <div className="bg-slate-950/60 p-3 rounded-xl border border-emerald-900/40 flex justify-between items-center text-xs">
                  <div>
                    <span className="text-slate-400 block">{isEnded ? 'Giá chốt thắng' : 'Giá hiện tại'}</span>
                    <b className="text-xl text-lime-400">{vnd(item.currentPrice)}</b>
                  </div>
                  <div className="text-right">
                    <span className="text-slate-400 block">Người dẫn đầu</span>
                    <b className="text-white">{item.highestBidder || 'Chưa có'}</b>
                  </div>
                </div>

                {isEnded ? (
                  <div className="pt-2">
                    {isWinner ? (
                      <button 
                        onClick={() => {
                          if (addCart) {
                            addCart({ 
                              id: item.id, 
                              name: item.title, 
                              price: item.currentPrice, 
                              emoji: item.emoji, 
                              qty: 1,
                              stock: 99 
                            })
                            setMessage(`🎉 Chúc mừng bạn đã thêm lô thắng thầu "${item.title}" vào giỏ hàng!`)
                          }
                        }}
                        className="w-full py-3 bg-lime-400 hover:bg-lime-300 text-slate-950 font-bold text-xs rounded-xl shadow-lg transition animate-bounce cursor-pointer"
                      >
                        🛒 Mua ngay lô giống (Thắng thầu - {vnd(item.currentPrice)})
                      </button>
                    ) : (
                      <div className="w-full py-3 bg-slate-800 text-slate-400 font-bold text-xs rounded-xl text-center border border-slate-700">
                        🔒 Đã được bán (Thuộc về: {item.highestBidder})
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="flex gap-2 pt-2">
                    <input 
                      type="number" 
                      placeholder={`Tối thiểu ${vnd(item.currentPrice + item.step)}`}
                      className="inp text-xs flex-1"
                      value={bidInputs[item.id] || ''}
                      onChange={e => setBidInputs({ ...bidInputs, [item.id]: e.target.value })}
                    />
                    <button 
                      onClick={() => handlePlaceBid(item.id)}
                      className="px-4 py-2 bg-lime-400 hover:bg-lime-300 text-slate-950 font-bold text-xs rounded-xl shrink-0 transition cursor-pointer"
                    >
                      Ra giá ngay
                    </button>
                  </div>
                )}
                <p className="text-[10px] text-slate-500 text-center">🛡️ Tích hợp khóa cọc tự động qua Ví Momo/ZaloPay/Card (Escrow)</p>
              </div>
            )
          })}
        </div>
      )}

      {tab === 'reverse' && (
        <div className="space-y-4">
          {reverseAuctions.map(item => {
            const isEnded = (item.endTime - Date.now()) <= 0
            const currentUserName = user?.email ? user.email.split('@')[0] : ''
            const isWinner = isEnded && item.bestSupplier === currentUserName

            return (
              <div key={item.id} className="bg-slate-900 border border-emerald-900/60 rounded-2xl p-5 space-y-4 shadow-xl">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-2">
                  <div>
                    <span className="text-[10px] font-bold text-sky-400 bg-sky-950/80 px-2.5 py-0.5 rounded border border-sky-800">Yêu cầu mua sỉ B2B</span>
                    <h3 className="text-lg font-bold text-white mt-1">{item.buyer}</h3>
                    <p className="text-sm text-slate-200 mt-1 font-medium">{item.requirement}</p>
                  </div>
                  <div className="bg-slate-950 px-4 py-2 rounded-xl border border-emerald-800 text-right">
                    <span className="text-xs text-slate-400 block">Ngân sách trần</span>
                    <span className="text-base font-bold text-slate-300">{vnd(item.targetBudget)}</span>
                  </div>
                </div>

                <div className="grid md:grid-cols-3 gap-4 bg-slate-950/60 p-3 rounded-xl border border-emerald-900/40 text-xs items-center">
                  <div>
                    <span className="text-slate-400 block">{isEnded ? 'Mức thầu trúng đơn' : 'Mức thầu thấp nhất'}</span>
                    <b className="text-lg text-lime-400">{vnd(item.lowestBid)}</b>
                  </div>
                  <div>
                    <span className="text-slate-400 block">Nhà cung cấp tốt nhất</span>
                    <b className="text-white">{item.bestSupplier || 'Chưa có'}</b>
                  </div>
                  <div className="text-right">
                    <span className="text-amber-400 font-bold">⏳ {formatTime(item.endTime)}</span>
                  </div>
                </div>

                {isEnded ? (
                  <div className="pt-2">
                    {isWinner ? (
                      <div className="w-full py-3 bg-emerald-600 text-white font-bold text-xs rounded-xl text-center shadow-lg">
                        🎉 Chúc mừng bạn đã trúng thầu cung cấp đơn hàng B2B này!
                      </div>
                    ) : (
                      <div className="w-full py-3 bg-slate-800 text-slate-400 font-bold text-xs rounded-xl text-center border border-slate-700">
                        🔒 Đã đóng thầu (Nhà cung cấp thắng: {item.bestSupplier})
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="flex gap-2 pt-2">
                    <input 
                      type="number" 
                      placeholder={`Nhập giá thầu thấp hơn ${vnd(item.lowestBid)}`}
                      className="inp text-xs flex-1"
                      value={revInputs[item.id] || ''}
                      onChange={e => setRevInputs({ ...revInputs, [item.id]: e.target.value })}
                    />
                    <button 
                      onClick={() => handlePlaceReverseBid(item.id)}
                      className="px-5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl shrink-0 transition cursor-pointer"
                    >
                      Bỏ thầu cung cấp
                    </button>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}   