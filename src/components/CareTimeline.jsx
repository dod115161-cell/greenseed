import {useState,useEffect} from 'react'
import {CROPS} from '../data/mockData'
const iso=d=>d.toISOString().slice(0,10),fmt=d=>d.toLocaleDateString('vi-VN'),short=d=>d.toLocaleDateString('vi-VN',{day:'2-digit',month:'2-digit'})
const HASH=()=>typeof location==='undefined'?'':location.hash.slice(1)
const SCEN={'Ban công chung cư':'Gió tầng cao làm đất khô nhanh: kiểm tra ẩm đất mỗi sáng, dùng chậu có đĩa lót.','Sân thượng nắng gắt':'Che lưới 50-70% từ 10h-15h, tưới thêm chiều mát nếu đất khô, phủ gốc bằng rơm.','Trong nhà':'Đặt gần cửa sổ hoặc dùng đèn trồng cây 8-10 giờ/ngày, giảm nước vì đất lâu khô hơn.'}
const DANGER=[[3,'Ngợp nước','Đất úng làm thối rễ non: kiểm tra thoát nước, giảm tưới còn 1 lần/ngày.'],[15,'Sâu vẽ bùa','Sâu đục đường ngoằn ngoèo trên lá: ngắt lá bị hại, phun dầu Neem chiều mát.'],[45,'Rụng hoa','Nóng, thiếu nước hoặc thừa đạm gây rụng hoa: tưới đều, bổ sung Kali, tránh bón đạm.']]
const LV=[{n:1,t:'Mầm sơ sinh',r:'Ngày 1-7',q:'Thiết lập vùng an toàn',rw:'Bộ rễ tơ đầu tiên',qd:1},{n:2,t:'Tuổi dậy thì',r:'Ngày 8-30',q:'Nạp đạm & Ngắt đọt',rw:'Tán lá nhân đôi',qd:10},{n:3,t:'Trưởng thành',r:'Sau ngày 30',q:'Bón Kali & Đón nụ',rw:'Trái ngọt trĩu cành',qd:31}]
export default function CareTimeline({products}){
const hp=new URLSearchParams(HASH())
const [pid,setPid]=useState(()=>products.find(x=>x.id==hp.get('care'))?.id??products[0]?.id)
const [start,setStart]=useState(()=>/^\d{4}-\d{2}-\d{2}$/.test(hp.get('start')||'')?hp.get('start'):iso(new Date()))
const [sel,setSel]=useState(null),[sc,setSc]=useState(Object.keys(SCEN)[0]),[note,setNote]=useState('')
const [done,setDone]=useState(()=>{try{return JSON.parse(localStorage.getItem('gs_care'))||{}}catch{return {}}})
useEffect(()=>{localStorage.setItem('gs_care',JSON.stringify(done))},[done])
const p=products.find(x=>x.id==pid)
if(!p)return <p className="card">Chưa có hạt giống.</p>
const c=CROPS[p.name]||{harvestDays:p.days,fertilizingSchedule:[],rotation:'',harvestTip:''}
const h=c.harvestDays,e2=Math.min(20,Math.round(h*.45)),e3=Math.min(40,h-5)
const stageOf=n=>n<=7?0:n<=e2?1:n<=e3?2:3
const ST=[{t:'Gieo hạt & Nảy mầm',r:[1,7],i:'🌱',w:'Phun sương 2 lần/ngày (sáng sớm, chiều mát)',n:'Che nắng 80%, giữ ẩm đất, không bón phân.'},
{t:'Cây con & Phát triển lá',r:[8,e2],i:'🌿',w:'Tưới gốc 1 lần/ngày',n:'Tỉa bớt cây yếu, đưa ra nắng 100%.'},
{t:'Ra hoa, đơm quả / Phát triển mạnh',r:[e2+1,e3],i:'🌸',w:'Giữ ẩm đất, tưới gốc, tránh đọng nước lên hoa/lá',n:'Làm giàn/cắm cọc, bấm ngọn, làm cỏ gốc.'},
{t:'Thu hoạch',r:[e3+1,h],i:'🧺',w:'Giảm nước tưới 2-3 ngày trước thu hoạch',n:c.harvestTip}]
const at=n=>{const x=new Date(start);x.setDate(x.getDate()+n-1);return x}
const qk=l=>`${p.id}_${start}_Q${l}`
const tasks=n=>{const s=stageOf(n),L=[]
if(s===0)L.push(['🌫️','Tưới phun sương buổi sáng sớm'],['🌫️','Tưới phun sương buổi chiều mát'])
else if(s===1)L.push(['💧','Tưới gốc 1 lần'])
else if(s===2)L.push(['💧','Tưới gốc giữ ẩm đất, tránh đọng nước lên hoa/lá'])
else L.push(n<h-2?['💧','Tưới gốc, giảm dần lượng nước']:n<h?['💧','Giảm lượng nước tưới trước thu hoạch']:['💧','Tưới nhẹ trước khi thu'])
c.fertilizingSchedule.forEach(([d,t])=>d===n&&L.push(['🧪','Bón phân: '+t]))
if(n>=14&&n%7===0&&n<h)L.push(['🐛','Phun chế phẩm sinh học phòng sâu bệnh'])
if(n===1)L.push(['🌥️','Che nắng 80%, không bón phân'])
if(n===8)L.push(['✂️','Tỉa cây yếu, đưa ra nắng 100%'])
if(n===e2+1)L.push(['🪵','Làm giàn/cắm cọc, bấm ngọn, làm cỏ gốc'])
LV.forEach(l=>{if(n===Math.min(l.qd,h))L.push(['🎯',`Nhiệm vụ Lv.${l.n}: ${l.q}`,qk(l.n)])})
if(n===12)L.push(['🍚','Mẹo dân gian: tưới nước vo gạo pha loãng quanh gốc'])
if(n===e2+3)L.push(['🥚','Mẹo dân gian: rắc vỏ trứng nghiền quanh gốc'])
if(n===e3)L.push(['🍌','Mẹo dân gian: ngâm vỏ chuối 3 ngày, pha loãng tưới gốc (bổ sung Kali)'])
if(n===h)L.push(['🧺','Thu hoạch'])
return L.map(([i,t,k],j)=>({k:k||`${p.id}_${start}_${n}_${j}`,i,t}))}
const todayN=Math.round((new Date(iso(new Date()))-new Date(start))/864e5)+1
const base=Math.min(Math.max(todayN,1),h),day=sel??base,list=tasks(day),dg=DANGER.find(d=>d[0]===day)
const alerts=todayN>=1&&todayN<=h?tasks(todayN).filter(t=>(t.i==='🧪'||t.i==='🐛')&&!done[t.k]):[]
const xp=Object.keys(done).filter(k=>done[k]&&k.startsWith(`${p.id}_${start}_`)).length*10
const curLv=todayN<=7?1:todayN<=30?2:3
const pct=Math.min(100,Math.max(0,(todayN-1)/h*100))
const link=`${typeof location==='undefined'?'':location.origin+location.pathname}#care=${p.id}&start=${start}`
const ics=()=>{const st=new Date().toISOString().replace(/[-:]/g,'').slice(0,15)+'Z',ev=[]
for(let n=1;n<=h;n++)tasks(n).filter(t=>'🧪🐛🧺🎯'.includes(t.i)).forEach((t,j)=>{const d=iso(at(n)).replace(/-/g,'');ev.push('BEGIN:VEVENT',`UID:gs-${p.id}-${start}-${n}-${j}@greenseed`,`DTSTAMP:${st}`,`DTSTART;VALUE=DATE:${d}`,`SUMMARY:${p.name}: ${t.t}`,'BEGIN:VALARM','TRIGGER:-PT12H','ACTION:DISPLAY',`DESCRIPTION:${t.t}`,'END:VALARM','END:VEVENT')})
const txt=['BEGIN:VCALENDAR','VERSION:2.0','PRODID:-//GreenSeed//VI',...ev,'END:VCALENDAR'].join('\r\n')
const a=document.createElement('a');a.href=URL.createObjectURL(new Blob([txt],{type:'text/calendar;charset=utf-8'}));a.download=`greenseed-${p.name}.ics`;a.click();setNote('Đã tải file lịch .ics, mở file để thêm vào Google Calendar hoặc Apple Calendar.')}
const zalo=async()=>{const t=[0,1,2].flatMap(i=>base+i<=h?tasks(base+i).map(x=>`${fmt(at(base+i))}: ${x.t}`):[]).join('\n');try{await navigator.clipboard.writeText(`Nhắc lịch GreenSeed - ${p.name}\n${t}`);setNote('Đã sao chép nhắc lịch, dán vào Zalo để gửi cho chính bạn.')}catch{setNote('Không sao chép được. Hãy chép thủ công nội dung lịch.')}}
return(<div className="grid lg:grid-cols-2 gap-4">
<div className="card space-y-3"><div className="flex justify-between items-center"><h3 className="font-bold text-lg">Hành trình chăm sóc</h3><span className="bg-emerald-800 px-2 py-1 rounded-full text-xs">⭐ {xp} XP • Lv.{curLv}</span></div>
<select className="inp" value={pid} onChange={e=>{setPid(e.target.value);setSel(null)}}>{products.map(x=><option key={x.id} value={x.id}>{x.emoji} {x.name}</option>)}</select>
<label className="block text-sm">Ngày bắt đầu gieo<input type="date" className="inp mt-1" value={start} onChange={e=>{setStart(e.target.value);setSel(null)}}/></label>
<label className="block text-sm">Kịch bản trồng<select className="inp mt-1" value={sc} onChange={e=>setSc(e.target.value)}>{Object.keys(SCEN).map(k=><option key={k}>{k}</option>)}</select></label>
<p className="text-xs bg-slate-800/60 rounded-lg p-2">💡 {SCEN[sc]}</p>
<div className="h-3 bg-emerald-800 rounded-full overflow-hidden"><div className="h-full bg-lime-400" style={{width:pct+'%'}}/></div>
<p className="text-sm">Thu hoạch dự kiến: <b className="text-lime-400">{fmt(at(h))}</b> (ngày {h})</p>
<div className="grid grid-cols-3 gap-2">{LV.map(l=><div key={l.n} className={`rounded-lg p-2 text-xs border ${curLv===l.n?'border-lime-400':'border-emerald-900/60'} bg-slate-800/60`}><b>Lv.{l.n} {l.t}</b><br/>{l.r}<br/>{done[qk(l.n)]?'🔓':'🔒'} {l.rw}</div>)}</div>
<ol className="border-l-2 border-emerald-800 ml-2 space-y-4">{ST.map((s,i)=>{const cur=todayN>=s.r[0]&&todayN<=s.r[1];return(<li key={i} className={`pl-4 relative ${cur?'bg-emerald-800/50 rounded-r-lg py-1':''}`}><span className="absolute -left-[11px] top-1 text-base">{s.i}</span>
<b>Giai đoạn {i+1}: {s.t}</b><div className="text-xs text-lime-400">Ngày {s.r[0]}-{s.r[1]} • {short(at(s.r[0]))} - {short(at(s.r[1]))}</div>
<p className="text-sm">💧 {s.w}</p>{i>0&&i<3&&c.fertilizingSchedule.filter(f=>f[0]>=s.r[0]&&f[0]<=s.r[1]).map(f=><p key={f[0]} className="text-sm">🧪 Ngày {f[0]}: {f[1]}</p>)}<p className="text-sm">📝 {s.n}</p>
{DANGER.filter(d=>d[0]>=s.r[0]&&d[0]<=s.r[1]).map(d=><div key={d[0]} className={`mt-1 text-xs rounded-lg p-2 border ${Math.abs(todayN-d[0])<=1?'bg-red-950/60 border-red-500':'bg-red-950/30 border-red-900'}`}>⚠️ <b>Ngày {d[0]}: {d[1]}.</b> {d[2]}</div>)}</li>)})}</ol></div>
<div className="space-y-4">
{alerts.length>0&&<div className="bg-amber-900/40 border border-amber-700 text-amber-100 rounded-lg p-3 text-sm">🔔 <b>Nhắc việc hôm nay:</b> {alerts.map(a=>a.t).join('; ')}</div>}
{todayN<1&&<div className="bg-emerald-800 rounded-lg p-3 text-sm">Còn {1-todayN} ngày nữa đến ngày gieo.</div>}
<div className="card"><h3 className="font-bold mb-2">Công việc ngày {day} • {fmt(at(day))}{day===todayN&&' (Hôm nay)'}</h3>
{dg&&<div className="bg-red-950/50 border border-red-500 rounded-lg p-2 text-sm mb-2">⚠️ <b>{dg[1]}:</b> {dg[2]}</div>}
<ul className="space-y-2">{list.map(t=><li key={t.k} className={`flex items-center justify-between gap-2 p-2 rounded-lg ${done[t.k]?'bg-emerald-800/50 line-through':'bg-slate-800/60'}`}><span className="text-sm">{t.i} {t.t}</span>
<button className="btn2 shrink-0" onClick={()=>setDone({...done,[t.k]:!done[t.k]})}>{done[t.k]?'Hoàn tác':'Đã hoàn thành'}</button></li>)}</ul></div>
<div className="card"><h3 className="font-bold mb-2">Lịch theo ngày</h3><div className="grid grid-cols-7 gap-1 max-h-72 overflow-auto">{Array.from({length:h},(_,i)=>i+1).map(n=>{const T=tasks(n),ok=T.every(t=>done[t.k]);return(
<button key={n} onClick={()=>setSel(n)} className={`rounded-lg p-1 text-[10px] border ${n===day?'ring-2 ring-lime-400':''} ${n===todayN?'border-lime-400':'border-emerald-900/60'} ${ok?'bg-emerald-800':'bg-slate-900'}`}><b>{n}</b><br/>{short(at(n))}<br/>{[...new Set(T.map(t=>t.i))].slice(0,3).join('')}</button>)})}</div></div>
<div className="card flex gap-4 items-center flex-wrap"><div className="space-y-2"><h4 className="font-bold">Đồng bộ thông minh</h4><div className="flex gap-2 flex-wrap"><button className="btn" onClick={ics}>📅 Đồng bộ Calendar</button><button className="btn2" onClick={zalo}>💬 Sao chép nhắc lịch Zalo</button></div>{note&&<p className="text-xs">{note}</p>}</div>
<div className="text-center text-xs"><img src={`https://api.qrserver.com/v1/create-qr-code/?size=120x120&data=${encodeURIComponent(link)}`} alt="Mã QR mở lịch chăm sóc" width="120" height="120" className="rounded bg-white p-1"/>QR dán lên bầu cây</div></div></div>
<div className="card lg:col-span-2 grid md:grid-cols-2 gap-3"><div><h4 className="font-bold">🧺 Thu hoạch</h4><p className="text-sm">{c.harvestTip}</p></div><div><h4 className="font-bold">🔄 Sau thu hoạch (luân canh)</h4><p className="text-sm">{c.rotation}</p></div></div></div>)}
