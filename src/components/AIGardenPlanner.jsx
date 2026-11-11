import {useState} from 'react'
import {vnd} from '../data/mockData'
import BeforeAfter from './BeforeAfter'
const PL={sun:['Cà chua bi','Ớt chỉ thiên','Dưa leo','Húng quế'],part:['Cải xanh','Húng quế','Hoa hướng dương'],shade:['Xà lách hữu cơ','Cải xanh']}
const TIERS={Starter:['Tiết kiệm',250000],Optimal:['Tiêu chuẩn',450000],Premium:['Cao cấp',800000]}
const CATS=[['Cây giống',.6],['Giá thể / Đất bón',.2],['Chậu / Khay',.1],['Hệ thống tưới / Dụng cụ',.1]]
const ITEMS=[null,['Đất trồng hữu cơ (5kg)','Phân hữu cơ vi sinh'],['Chậu treo ban công','Khay ươm hạt'],['Giàn leo mini','Dầu Neem sinh học']]
export default function AIGardenPlanner({products,add}){
const [img,setImg]=useState(null),[L,setL]=useState(null),[area,setArea]=useState(3),[tier,setTier]=useState('Optimal')
const pick=e=>{const f=e.target.files[0];if(!f)return;const u=URL.createObjectURL(f);setImg(u);const im=new Image();im.onload=()=>{const cv=document.createElement('canvas');cv.width=cv.height=32;const x=cv.getContext('2d');x.drawImage(im,0,0,32,32);const d=x.getImageData(0,0,32,32).data;let s=0;for(let i=0;i<d.length;i+=4)s+=(d[i]+d[i+1]+d[i+2])/3;setL(s/1024)};im.src=u}
const k=L===null?null:L>150?'sun':L>90?'part':'shade',name={sun:'Nắng trực tiếp',part:'Bán râm',shade:'Bóng râm'}[k]
const by=n=>products.find(p=>p.name===n),budget=area*TIERS[tier][1]
const plan=k?CATS.map(([c,pc],i)=>{const al=budget*pc,names=i===0?PL[k]:ITEMS[i],ps=names.map(by).filter(Boolean)
const rows=ps.map(p=>({p,q:Math.min(20,Math.max(1,Math.round(al/ps.length/p.price)))}));return {c,pc,al,rows,act:rows.reduce((s,r)=>s+r.p.price*r.q,0)}}):[]
const all=plan.flatMap(x=>x.rows),total=plan.reduce((s,x)=>s+x.act,0)
const after=img&&<div className="relative w-full h-full"><img src={img} alt="Thiết kế đề xuất" className="w-full h-full object-cover" style={{filter:'saturate(1.3) brightness(1.05)'}}/>
<div className="absolute inset-x-0 bottom-0 p-3 flex gap-2 flex-wrap justify-center text-3xl bg-gradient-to-t from-emerald-950/90 to-transparent">{(plan[0]?.rows||[]).map(r=><span key={r.p.id}>{r.p.emoji.repeat(2)}</span>)}{k==='sun'&&<span>🪜</span>}<span>🪴</span></div></div>
return(<div className="grid lg:grid-cols-2 gap-4"><div className="card space-y-3"><h3 className="font-bold text-lg">Setup vườn thông minh</h3>
{img?<BeforeAfter before={<img src={img} alt="Hiện trạng" className="w-full h-full object-cover"/>} after={after}/>:<div className="bg-emerald-950 rounded-lg py-16 text-center text-5xl">🏡</div>}
<label className="btn cursor-pointer inline-block">Chụp / tải ảnh ban công, sân thượng<input type="file" accept="image/*" capture="environment" className="hidden" onChange={pick}/></label>
<label className="block text-sm">Diện tích ước tính (m²)<input type="number" min="1" max="50" className="inp mt-1" value={area} onChange={e=>setArea(Math.max(1,+e.target.value||1))}/></label>
<div className="flex gap-2">{Object.entries(TIERS).map(([t,[l]])=><button key={t} onClick={()=>setTier(t)} className={`flex-1 py-2 rounded-lg text-xs border ${tier===t?'bg-emerald-600 text-white border-emerald-600':'bg-slate-900 border-emerald-800'}`}>{l}<br/>{t}</button>)}</div>
<p className="text-xs text-slate-500">Ánh sáng được ước tính từ độ sáng của ảnh; ảnh "Sau" là bản mô phỏng bố trí, không phải ảnh AI render thật.</p></div>
<div className="space-y-3">{!k&&<div className="card text-sm">Tải ảnh không gian của bạn để nhận bản thiết kế và dự toán.</div>}
{k&&<><div className="card"><h4 className="font-bold">Ánh sáng: {name} • Ngân sách {TIERS[tier][0]}: <span className="text-lime-400">{vnd(budget)}</span></h4>
<table className="w-full text-sm mt-2"><thead><tr className="text-left text-slate-400"><th>Hạng mục</th><th>Tỉ lệ</th><th>Phân bổ</th><th>Thực tế</th></tr></thead><tbody>{plan.map(x=><tr key={x.c} className="border-t border-emerald-900/60"><td className="py-1">{x.c}</td><td>{x.pc*100}%</td><td>{vnd(Math.round(x.al))}</td><td className="text-lime-400">{vnd(x.act)}</td></tr>)}</tbody></table>
<p className="font-bold mt-2">Tổng thực tế: <span className="text-lime-400">{vnd(total)}</span></p></div>
<div className="card"><h4 className="font-bold mb-2">Trọn gói vườn</h4>{all.map(({p,q})=><div key={p.id} className="flex justify-between border-t border-emerald-900/60 py-1 text-sm"><span>{p.emoji} {p.name} x{q}</span><span>{vnd(p.price*q)}</span></div>)}
<button className="btn w-full mt-3" onClick={()=>all.forEach(({p,q})=>{for(let i=0;i<q;i++)add(p)})}>Thêm toàn bộ trọn gói vườn này vào giỏ hàng</button></div></>}</div></div>)}
