import {useState} from 'react'
import {DISEASES,vnd} from '../data/mockData'
const SLOTS=['Lá cận cảnh','Thân / Gốc','Tổng thể cây']
const dayStr=n=>new Date(Date.now()+(n-1)*864e5).toLocaleDateString('vi-VN')
export default function AIDiseaseScanner({products,add}){
const [imgs,setImgs]=useState([null,null,null]),[env,setEnv]=useState({light:'Nắng nhiều',hum:'Ẩm cao'}),[res,setRes]=useState(null),[busy,setBusy]=useState(false),[json,setJson]=useState(false),[saved,setSaved]=useState(false)
const pick=i=>e=>{const f=e.target.files[0];if(!f)return;const r=new FileReader();r.onload=()=>{setImgs(a=>a.map((x,j)=>j===i?r.result:x));setRes(null);setSaved(false)};r.readAsDataURL(f)}
const ready=imgs.every(Boolean)
const scan=()=>{setBusy(true);setRes(null);setSaved(false);setTimeout(()=>{
const k=imgs.reduce((s,u)=>s+u.length,0),d=DISEASES[(k+(env.hum==='Ẩm cao'?1:0))%DISEASES.length],acc=d.conf[0]+k%(d.conf[1]-d.conf[0]+1)
setRes({disease_name:`${d.vi} (${d.sci})`,accuracy_rate:acc,disease_category:d.cat,symptoms_analysis:d.symptoms,root_cause:`${d.cause} Điều kiện ghi nhận: ${env.light}, ${env.hum}.`,
treatment_paths:{organic_method:d.organic,chemical_method:d.chem},prescribed_products:d.rx.map(([n,m])=>{const p=products.find(x=>x.name===n);return {sku:p?.sku||null,name:n,milestone:m}}),
custom_recovery_schedule:d.sch.map(([day,task])=>({day:'Day '+day,task}))});setBusy(false)},1500)}
const remind=()=>{try{const a=JSON.parse(localStorage.getItem('gs_reminders')||'[]');a.push({disease:res.disease_name,start:new Date().toISOString().slice(0,10),tasks:res.custom_recovery_schedule});localStorage.setItem('gs_reminders',JSON.stringify(a))}catch{}setSaved(true)}
const sel='inp'
return(<div className="grid lg:grid-cols-2 gap-4"><div className="card space-y-3"><h3 className="font-bold text-lg">Bác sĩ cây trồng AI</h3>
<p className="text-sm text-slate-400">Tải hoặc chụp đủ 3 ảnh để có kết quả chính xác hơn.</p>
<div className="grid grid-cols-3 gap-2">{SLOTS.map((n,i)=><label key={n} className="cursor-pointer text-center text-xs">
<div className="h-24 rounded-lg overflow-hidden bg-emerald-950 border border-emerald-800 grid place-items-center">{imgs[i]?<img src={imgs[i]} alt={n} className="w-full h-full object-cover"/>:<span className="text-3xl">📷</span>}</div>
<span className="block mt-1">{n}</span><input type="file" accept="image/*" capture="environment" className="hidden" onChange={pick(i)}/></label>)}</div>
<div className="grid grid-cols-2 gap-2"><label className="text-xs">Ánh sáng<select className={sel} value={env.light} onChange={e=>setEnv({...env,light:e.target.value})}><option>Nắng nhiều</option><option>Bán râm</option><option>Trong nhà</option></select></label>
<label className="text-xs">Độ ẩm môi trường<select className={sel} value={env.hum} onChange={e=>setEnv({...env,hum:e.target.value})}><option>Ẩm cao</option><option>Vừa phải</option><option>Khô</option></select></label></div>
<button className="btn w-full" disabled={!ready||busy} onClick={scan}>{busy?'Đang phân tích...':ready?'Quét và chẩn đoán':`Cần đủ 3 ảnh (${imgs.filter(Boolean).length}/3)`}</button>
<p className="text-xs text-slate-500">Kết quả là mô phỏng để demo giao diện, chưa phải chẩn đoán thật.</p></div>
<div className="space-y-3">{!res&&!busy&&<div className="card text-sm">Kết quả chẩn đoán sẽ hiện ở đây.</div>}{busy&&<div className="card">🔍 Đang phân tích 3 ảnh...</div>}
{res&&<><div className="card space-y-2"><div className="flex justify-between gap-2"><h4 className="font-bold text-lg">{res.disease_name}</h4><span className="bg-emerald-800 px-2 py-1 rounded-full text-sm shrink-0">{res.accuracy_rate}%</span></div>
<span className="text-xs bg-emerald-800 px-2 py-0.5 rounded">{res.disease_category}</span>
<p className="text-sm"><b>Dấu hiệu:</b> {res.symptoms_analysis}</p><p className="text-sm"><b>Nguyên nhân:</b> {res.root_cause}</p>
<p className="text-sm">🌿 <b>Hữu cơ:</b> {res.treatment_paths.organic_method}</p><p className="text-sm">⚗️ <b>Sinh học/Hóa học (ca nặng):</b> {res.treatment_paths.chemical_method}</p></div>
<div className="card"><h4 className="font-bold mb-2">Lịch phục hồi</h4><ol className="space-y-1 text-sm">{res.custom_recovery_schedule.map(s=><li key={s.day}><b className="text-lime-400">{s.day}</b> ({dayStr(+s.day.slice(4))}): {s.task}</li>)}</ol>
<button className="btn2 mt-3" onClick={remind}>{saved?'✓ Đã đặt nhắc lịch':'🔔 Đặt nhắc lịch phục hồi'}</button></div>
<div className="card"><h4 className="font-bold mb-2">Sản phẩm được kê</h4>{res.prescribed_products.map(r=>{const p=products.find(x=>x.name===r.name);return(<div key={r.name} className="flex items-center justify-between gap-2 border-t border-emerald-900/60 py-2 text-sm"><span>{p?.emoji} {r.name} <span className="text-xs text-slate-400">{r.sku} • {r.milestone}</span>{p&&<b className="text-lime-400"> {vnd(p.price)}</b>}</span>{p&&<button className="btn2 shrink-0" onClick={()=>add(p)}>Thêm</button>}</div>)})}</div>
<button className="btn2" onClick={()=>setJson(!json)}>{json?'Ẩn JSON':'Xem JSON kết quả'}</button>{json&&<pre className="card text-xs overflow-auto max-h-64">{JSON.stringify(res,null,2)}</pre>}</>}</div></div>)}
