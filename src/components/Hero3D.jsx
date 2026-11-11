import {useRef} from 'react'
import {Sparkles,Leaf,Play} from 'lucide-react'
import {WALL} from '../data/wallCards'
const STATS=[['500+','Giống cây chọn lọc'],['98.5%','Tỷ lệ nảy mầm'],['120.000+','Khách hàng tin dùng'],['24/7','Hỗ trợ kỹ thuật']]
export default function Hero3D({onExplore,onGuide}){
const sec=useRef(),wall=useRef()
const move=e=>{const w=wall.current,r=sec.current.getBoundingClientRect(),cx=r.width/2,cy=r.height/2
w.classList.remove('auto-float');w.style.transform=`rotateX(${20+((e.clientY-r.top-cy)/cy)*-18}deg) rotateY(${-10+((e.clientX-r.left-cx)/cx)*18}deg) rotateZ(2deg) scale(0.98)`}
const leave=()=>{wall.current.style.transform='';wall.current.classList.add('auto-float')}
return(<>
<section ref={sec} onMouseMove={move} onMouseLeave={leave} className="relative min-h-[90vh] flex items-center justify-center overflow-hidden bg-gradient-to-b from-slate-950 via-emerald-950 to-slate-950 py-12">
<div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(16,185,129,0.15)_0,transparent_70%)] pointer-events-none"/>
<div className="perspective-container absolute inset-0 flex items-center justify-center">
<div ref={wall} className="wall-3d auto-float grid grid-cols-4 md:grid-cols-5 gap-4 md:gap-6 p-10 w-[140vw] sm:w-[120vw] md:w-[110vw] max-w-none opacity-45 hover:opacity-85 transition-opacity duration-700 select-none">
{WALL.map((c,i)=><div key={i} className={`wall-card bg-slate-900/90 border border-emerald-800/60 rounded-2xl p-3 shadow-xl backdrop-blur-md ${c.hide}`}>
<img src={c.img} alt={c.alt} loading="lazy" className="w-full h-36 sm:h-44 object-cover rounded-xl mb-3"/><span className={c.cls}>{c.label}</span><h4 className="text-sm font-semibold text-white mt-1 truncate">{c.title}</h4></div>)}
</div></div>
<div className="relative z-20 text-center max-w-4xl mx-auto px-4 pointer-events-none">
<div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-900/90 border border-lime-500/40 text-lime-400 text-xs font-semibold mb-6 backdrop-blur-lg pointer-events-auto"><Sparkles size={14}/>Tỷ lệ nảy mầm đạt trên 98% • Chuẩn F1 thuần chủng</div>
<h1 className="font-serif text-4xl sm:text-6xl lg:text-7xl font-bold text-white leading-[1.15] drop-shadow-2xl">Ươm mầm tương lai<br/><span className="bg-clip-text text-transparent bg-gradient-to-r from-lime-400 via-emerald-300 to-teal-200">Sống xanh tinh tế</span></h1>
<p className="mt-6 text-base sm:text-lg text-slate-300 max-w-2xl mx-auto font-light">Khám phá bộ sưu tập hạt giống hoa, rau củ và cây ăn trái. Mang khu vườn xanh mát và an lành vào không gian sống của bạn.</p>
<div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4 pointer-events-auto">
<button onClick={onExplore} className="px-8 py-4 rounded-full bg-gradient-to-r from-lime-400 to-emerald-500 text-slate-950 font-bold text-sm hover:scale-105 transition flex items-center gap-2"><Leaf size={16}/>Khám phá hạt giống</button>
<button onClick={onGuide} className="px-8 py-4 rounded-full bg-slate-900/90 hover:bg-slate-800 text-white font-semibold text-sm border border-emerald-700/60 flex items-center gap-2"><Play size={16} className="text-lime-400"/>Xem lịch chăm sóc</button></div></div></section>
<section className="border-y border-emerald-900/50 bg-emerald-950 py-8"><div className="max-w-6xl mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">{STATS.map(([a,b],i)=><div key={b}><p className={`text-3xl lg:text-4xl font-bold font-serif ${i%2?'text-emerald-400':'text-lime-400'}`}>{a}</p><p className="text-xs text-slate-400 uppercase tracking-wider mt-1">{b}</p></div>)}</div></section></>)}
