import {useState} from 'react'
import {REGIONS,vnd} from '../data/mockData'
const m=new Date().getMonth()+1,SEASON=m>=2&&m<=4?'Xuân':m>=5&&m<=7?'Hè':m>=8&&m<=10?'Thu':'Đông'
const rng=s=>(String(s).match(/\d+/g)||[]).map(Number)
export default function GeoSmartPlanter({products,add}){
const [r,setR]=useState(REGIONS[0]),[msg,setMsg]=useState(''),[ly,setLy]=useState(0)
const gps=()=>navigator.geolocation?navigator.geolocation.getCurrentPosition(pos=>{const a=pos.coords.latitude,b=pos.coords.longitude;const n=REGIONS.reduce((x,y)=>Math.hypot(a-y.lat,b-y.lng)<Math.hypot(a-x.lat,b-x.lng)?y:x);setR(n);setMsg('Vùng gần bạn nhất: '+n.n)},()=>setMsg('Không lấy được vị trí. Hãy chọn vùng thủ công.')):setMsg('Trình duyệt không hỗ trợ GPS.')
const sc=products.filter(p=>p.days>0).map(p=>{const [a,b]=rng(p.temp),ov=Math.max(0,Math.min(b,r.t[1])-Math.max(a,r.t[0]))/(b-a);return {p,s:Math.round(Math.min(100,ov*85+((p.seasons||[p.season]).includes(SEASON)||p.season==='Quanh năm'?15:0)))}})
const fit=sc.filter(x=>x.s>=85).sort((a,b)=>b.s-a.s),avoid=sc.filter(x=>x.s<45).sort((a,b)=>a.s-b.s).slice(0,4)
const L=[['Tầng A: Đất mặt / Hữu cơ',r.A,'bg-amber-900','h-16'],['Tầng B: Tích tụ (sét/thịt)',r.B,'bg-orange-800','h-24'],['Tầng C: Đất mẹ / Mẫu chất',r.C,'bg-stone-700','h-28']]
const bb=`${r.lng-.15}%2C${r.lat-.1}%2C${r.lng+.15}%2C${r.lat+.1}`
return(<div className="grid lg:grid-cols-2 gap-4"><div className="space-y-4"><div className="card space-y-3"><h3 className="font-bold text-lg">Bản đồ thổ nhưỡng & cây trồng</h3>
<div className="flex gap-2"><select className="inp" value={r.n} onChange={e=>{setR(REGIONS.find(x=>x.n===e.target.value));setLy(0)}}>{REGIONS.map(x=><option key={x.n}>{x.n}</option>)}</select><button className="btn shrink-0" onClick={gps}>Dùng GPS</button></div>
{msg&&<p className="text-sm">{msg}</p>}
<iframe title="Bản đồ" className="w-full h-48 rounded-lg border border-emerald-800" src={`https://www.openstreetmap.org/export/embed.html?bbox=${bb}&layer=mapnik&marker=${r.lat}%2C${r.lng}`}/>
<table className="w-full text-sm"><tbody>{[['Khí hậu',r.climate],['Độ pH đất',r.ph],['Lượng mưa TB năm',r.rain+' mm'],['Nhiệt độ TB',r.t[0]+'-'+r.t[1]+'°C'],['Độ ẩm TB',r.h],['Địa hình',r.terrain],['Mùa vụ hiện tại',SEASON]].map(([a,b])=><tr key={a} className="border-t border-emerald-900/60"><td className="py-1 text-slate-400">{a}</td><td className="font-medium">{b}</td></tr>)}</tbody></table></div>
<div className="card"><h4 className="font-bold mb-2">Mặt cắt đất 3 tầng (bấm để xem chi tiết)</h4>
<div className="rounded-lg overflow-hidden border border-emerald-800">{L.map(([t,d,c,h],i)=><button key={t} onClick={()=>setLy(i)} className={`w-full ${h} ${c} text-left px-3 text-sm ${ly===i?'ring-2 ring-inset ring-lime-400':'opacity-80'}`}>{t}</button>)}</div>
<div className="mt-2 text-sm bg-slate-800/60 rounded-lg p-3"><b className="text-lime-400">{L[ly][0]}</b><p>{L[ly][1][0]}</p><p>{L[ly][1][1]}</p></div></div></div>
<div className="space-y-4"><div className="card space-y-2"><h3 className="font-bold text-lg">Cây giống thích ứng cao tại {r.n}</h3>{!fit.length&&<p className="text-sm">Chưa có giống đạt mức thích ứng 85% trở lên.</p>}
{fit.map(({p,s})=><div key={p.id} className="flex items-center justify-between border-t border-emerald-900/60 py-2 text-sm"><span>{p.emoji} <b>{p.name}</b> • {vnd(p.price)}<br/><span className="text-xs text-lime-400">Thích ứng {s}%</span></span><button className="btn2" onClick={()=>add(p)}>Thêm</button></div>)}
{fit.length>0&&<button className="btn w-full" onClick={()=>fit.forEach(x=>add(x.p))}>Thêm nhanh bộ giống phù hợp vào giỏ</button>}</div>
<div className="card space-y-2"><h3 className="font-bold text-lg text-red-400">Chống chỉ định / cần cải tạo đất</h3>{!avoid.length&&<p className="text-sm">Không có cây nào bị chống chỉ định.</p>}
{avoid.map(({p,s})=><div key={p.id} className="bg-red-950/40 border border-red-900 rounded-lg p-3 text-sm"><b>{p.emoji} {p.name}</b> <span className="text-xs">(thích ứng {s}%)</span><p className="text-xs mt-1">Cần cải tạo trước khi trồng: {r.C[1].toLowerCase()}; che lưới hoặc dùng giá thể riêng, chỉnh pH về 6.0-6.8.</p></div>)}</div></div></div>)}
