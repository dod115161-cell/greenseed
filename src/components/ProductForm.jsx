import {useState,useRef} from 'react'
import ImageDrop from './ImageDrop'
import {post,apiConfigured} from '../api'
const CATS=['Rau củ','Hoa','Cây ăn trái','Hạt giống hữu cơ','Vật tư & dụng cụ'],ORIG=['Việt Nam','Nhật Bản','Hà Lan','Hàn Quốc','Mỹ','Thái Lan','Hữu cơ','Khác'],SEAS=['Xuân','Hè','Thu','Đông','Quanh năm']
const uid=()=>Math.random().toString(36).slice(2,10)
export const blank=()=>({sku:'',name:'',cat:'Rau củ',diff:'Dễ',regular:'',sale:'',stock:50,desc:'',origin:'Việt Nam',originOther:'',germ:90,days:60,seasons:['Xuân'],ph:'6.0-7.0',temp:'20-30°C',light:'Nắng đầy đủ',images:[],diseases:[]})
export const fromP=p=>({...blank(),sku:p.sku||'',name:p.name||'',cat:p.cat||'Rau củ',diff:p.diff||'Dễ',regular:p.oldPrice||p.price||'',sale:p.oldPrice?p.price:'',stock:p.stock??0,desc:p.description||p.desc||'',
origin:ORIG.includes(p.origin)?p.origin:p.origin?'Khác':'Việt Nam',originOther:ORIG.includes(p.origin)||!p.origin?'':p.origin,germ:Number.isFinite(+p.germ)?+p.germ:90,days:p.days??60,seasons:p.seasons||[p.season||'Xuân'],ph:p.ph||'6.0-7.0',temp:p.temp||'20-30°C',light:p.light||'Nắng đầy đủ',
images:p.img?[{name:'Ảnh bìa',dataUrl:p.img},...(p.gallery||[])]:[],diseases:(p.diseases||[]).map(d=>({...d,images:[]}))})
const origin=f=>f.origin==='Khác'?f.originOther.trim():f.origin
const imgs=a=>a.map(i=>({name:i.name,data_url:i.dataUrl}))
export const makePayload=f=>({sku:f.sku.trim(),name:f.name.trim(),category:f.cat,difficulty:f.diff,price:{regular:+f.regular,sale:f.sale===''?null:+f.sale,currency:'VND'},stock:+f.stock,description:f.desc,origin:origin(f),
specs:{germination_rate:+f.germ,harvest_days:+f.days,seasons:f.seasons,ph:f.ph,temperature:f.temp,light:f.light},images:imgs(f.images),
ai_training:{diseases:f.diseases.map(d=>({disease_name:d.name.trim(),symptoms:d.symptoms.trim(),sample_images:imgs(d.images)}))}})
export const makeAiPayload=f=>({sku:f.sku.trim(),product_name:f.name.trim(),submitted_at:new Date().toISOString(),diseases:makePayload(f).ai_training.diseases})
export const makeProduct=(f,init,id)=>{const reg=+f.regular,sale=f.sale===''?0:+f.sale;return {...(init||{}),id,sku:f.sku.trim(),name:f.name.trim(),cat:f.cat,diff:f.diff,season:f.seasons[0]||'Quanh năm',seasons:f.seasons,days:+f.days,price:sale||reg,oldPrice:sale?reg:undefined,stock:+f.stock,germ:+f.germ,ph:f.ph,temp:f.temp,light:f.light,origin:origin(f),emoji:init?.emoji||'🌱',
description:f.desc,desc:f.desc.replace(/[*_#>`]/g,'').replace(/^- /gm,'').trim().slice(0,160),img:f.images[0]?.dataUrl,gallery:f.images.slice(1),diseases:f.diseases.map(d=>({id:d.id,name:d.name,symptoms:d.symptoms,imageCount:d.images.length||d.imageCount||0}))}}
const show=o=>JSON.stringify(o,(k,v)=>k==='data_url'?`<ảnh ${Math.round(v.length*.75/1024)} KB>`:v,2)
const Fld=({l,e,children})=><label className="block text-sm">{l}{children}{e&&<span className="text-xs text-red-400">{e}</span>}</label>
export default function ProductForm({init,products,onSave,onClose,initTab='info'}){
const [f,setF]=useState(()=>init?fromP(init):blank()),[tab,setTab]=useState(initTab),[err,setErr]=useState({}),[msg,setMsg]=useState(null),[busy,setBusy]=useState(''),[pv,setPv]=useState(false),idRef=useRef(init?.id),ta=useRef()
const set=k=>e=>setF({...f,[k]:e.target.value}),num=k=>e=>setF({...f,[k]:e.target.value===''?'':+e.target.value})
const wrap=(a,b=a)=>{const t=ta.current,s=t.selectionStart,e=t.selectionEnd;setF({...f,desc:f.desc.slice(0,s)+a+f.desc.slice(s,e)+b+f.desc.slice(e)})}
const list=()=>{const t=ta.current,s=f.desc.lastIndexOf('\n',t.selectionStart-1)+1;setF({...f,desc:f.desc.slice(0,s)+'- '+f.desc.slice(s)})}
const setD=(id,p)=>setF({...f,diseases:f.diseases.map(d=>d.id===id?{...d,...p}:d)})
const validate=()=>{const e={};if(!f.name.trim())e.name='Vui lòng nhập tên sản phẩm.'
if(!f.sku.trim())e.sku='Vui lòng nhập mã SKU.';else if(products.some(x=>x.sku===f.sku.trim()&&x.id!==idRef.current))e.sku='SKU này đã tồn tại.'
if(!(+f.regular>0))e.regular='Giá gốc phải lớn hơn 0.'
if(f.sale!==''&&!(+f.sale>0&&+f.sale<+f.regular))e.sale='Giá khuyến mãi phải nhỏ hơn giá gốc.'
if(f.origin==='Khác'&&!f.originOther.trim())e.origin='Vui lòng nhập xuất xứ.'
if(!(+f.germ>=0&&+f.germ<=100))e.germ='Tỉ lệ từ 0 đến 100.'
if(!f.seasons.length)e.seasons='Chọn ít nhất 1 mùa vụ.'
setErr(e);if(Object.keys(e).length){setTab('info');setMsg({ok:false,text:'Vui lòng kiểm tra lại các trường báo đỏ.'})}return !Object.keys(e).length}
const save=async()=>{if(!validate())return;setBusy('save');if(!idRef.current)idRef.current=Date.now()
const body=makePayload(f);let m
try{const r=await post('/products',body);m={ok:true,text:r.simulated?'Đã lưu sản phẩm. Chế độ mô phỏng: chưa gửi lên máy chủ vì chưa cấu hình VITE_API_URL.':'Đã lưu sản phẩm và gửi lên máy chủ thành công.'}}catch(x){m={ok:false,text:'Đã lưu trên trình duyệt nhưng gửi API thất bại: '+x.message}}
onSave(makeProduct(f,init,idRef.current));setMsg(m);setBusy('')}
const sync=async()=>{if(!f.name.trim()||!f.sku.trim()){setTab('info');return setMsg({ok:false,text:'Cần nhập tên sản phẩm và SKU ở tab Thông tin trước.'})}
if(!f.diseases.length||f.diseases.some(d=>!d.name.trim()||!d.symptoms.trim()))return setMsg({ok:false,text:'Mỗi bệnh cần có tên và dấu hiệu nhận biết.'})
setBusy('ai');try{const r=await post('/ai-training',makeAiPayload(f));setMsg({ok:true,text:r.simulated?'Đã chuẩn bị dữ liệu AI (chế độ mô phỏng, chưa gửi máy chủ).':'Đã đồng bộ dữ liệu AI lên máy chủ.'})}catch(x){setMsg({ok:false,text:'Đồng bộ thất bại: '+x.message})}setBusy('')}
const tb='btn2 px-2 py-0.5'
return(<div className="fixed inset-0 z-50 bg-black/70 grid place-items-center p-3" role="dialog" aria-modal="true" aria-label="Form sản phẩm"><div className="bg-slate-900 border border-emerald-800 rounded-2xl w-full max-w-3xl max-h-[92vh] flex flex-col">
<div className="flex justify-between items-center p-4 border-b border-emerald-900"><h3 className="font-bold text-lg">{init?'Sửa sản phẩm':'Thêm sản phẩm mới'}</h3><button aria-label="Đóng" onClick={onClose} className="text-slate-400 hover:text-white text-xl">×</button></div>
<div className="flex gap-2 px-4 pt-3">{[['info','Thông tin sản phẩm'],['ai',`Dữ liệu AI Chẩn đoán (${f.diseases.length})`]].map(([k,l])=><button key={k} onClick={()=>setTab(k)} className={`px-4 py-2 rounded-full text-sm ${tab===k?'bg-emerald-600 text-white':'bg-slate-800 text-slate-300'}`}>{l}</button>)}</div>
<div className="p-4 overflow-y-auto space-y-4">
{msg&&<div className={`rounded-lg p-3 text-sm border ${msg.ok?'bg-emerald-800/50 border-emerald-600':'bg-red-950/50 border-red-700'}`}>{msg.text}</div>}
{tab==='info'&&<>
<section className="space-y-2"><h4 className="font-semibold text-lime-400">Hình ảnh sản phẩm</h4><ImageDrop value={f.images} onChange={a=>setF({...f,images:a})} cover max={5}/></section>
<section className="grid sm:grid-cols-3 gap-3"><div className="sm:col-span-2"><Fld l="Tên sản phẩm *" e={err.name}><input className="inp mt-1" value={f.name} onChange={set('name')} placeholder="Ví dụ: Hạt giống cà chua bi F1"/></Fld></div>
<Fld l="Mã SKU *" e={err.sku}><div className="flex gap-1 mt-1"><input className="inp" value={f.sku} onChange={set('sku')} placeholder="GS-014"/><button type="button" className="btn2 shrink-0" onClick={()=>setF({...f,sku:'GS-'+String(Date.now()).slice(-5)})}>Tạo mã</button></div></Fld>
<Fld l="Giá bán gốc (đ) *" e={err.regular}><input type="number" min="0" className="inp mt-1" value={f.regular} onChange={num('regular')}/></Fld>
<Fld l="Giá khuyến mãi (đ, nếu có)" e={err.sale}><input type="number" min="0" className="inp mt-1" value={f.sale} onChange={num('sale')}/></Fld>
<Fld l="Tồn kho"><input type="number" min="0" className="inp mt-1" value={f.stock} onChange={num('stock')}/></Fld>
<Fld l="Danh mục"><select className="inp mt-1" value={f.cat} onChange={set('cat')}>{CATS.map(x=><option key={x}>{x}</option>)}</select></Fld>
<Fld l="Độ khó gieo trồng"><select className="inp mt-1" value={f.diff} onChange={set('diff')}>{['Dễ','Trung bình','Khó'].map(x=><option key={x}>{x}</option>)}</select></Fld>
<Fld l="Nguồn gốc / Xuất xứ" e={err.origin}><select className="inp mt-1" value={f.origin} onChange={set('origin')}>{ORIG.map(x=><option key={x}>{x}</option>)}</select></Fld>
{f.origin==='Khác'&&<div className="sm:col-span-3"><input className="inp" placeholder="Nhập xuất xứ khác" value={f.originOther} onChange={set('originOther')}/></div>}</section>
<section className="space-y-1"><h4 className="font-semibold text-lime-400">Mô tả sản phẩm</h4><div className="flex gap-1 flex-wrap"><button type="button" className={tb} onClick={()=>wrap('**')}><b>B</b></button><button type="button" className={tb} onClick={()=>wrap('*')}><i>I</i></button><button type="button" className={tb} onClick={list}>• Danh sách</button><button type="button" className={tb} onClick={()=>wrap('## ','')}>Tiêu đề</button></div>
<textarea ref={ta} rows="5" className="inp" value={f.desc} onChange={set('desc')} placeholder="Đặc điểm, cách gieo trồng, lưu ý bảo quản..."/></section>
<section className="space-y-2"><h4 className="font-semibold text-lime-400">Thông số kỹ thuật hạt giống</h4><div className="grid sm:grid-cols-3 gap-3">
<Fld l="Tỉ lệ nảy mầm (%)" e={err.germ}><input type="number" min="0" max="100" className="inp mt-1" value={f.germ} onChange={num('germ')}/></Fld>
<Fld l="Thời gian thu hoạch (ngày)"><input type="number" min="0" className="inp mt-1" value={f.days} onChange={num('days')}/></Fld>
<Fld l="Độ pH đất"><input className="inp mt-1" value={f.ph} onChange={set('ph')}/></Fld>
<Fld l="Nhiệt độ thích hợp"><input className="inp mt-1" value={f.temp} onChange={set('temp')}/></Fld><Fld l="Ánh sáng"><input className="inp mt-1" value={f.light} onChange={set('light')}/></Fld></div>
<div><p className="text-sm mb-1">Mùa vụ thích hợp</p><div className="flex gap-2 flex-wrap">{SEAS.map(s=><button type="button" key={s} onClick={()=>setF({...f,seasons:f.seasons.includes(s)?f.seasons.filter(x=>x!==s):[...f.seasons,s]})} className={`px-3 py-1 rounded-full text-xs border ${f.seasons.includes(s)?'bg-emerald-600 border-emerald-600':'bg-slate-800 border-emerald-800'}`}>{s}</button>)}</div>{err.seasons&&<span className="text-xs text-red-400">{err.seasons}</span>}</div></section></>}
{tab==='ai'&&<section className="space-y-3"><p className="text-sm text-slate-300">Nhập các bệnh thường gặp ở giống cây này kèm ảnh mẫu để đưa vào tập huấn luyện AI. Nên có từ 10 ảnh trở lên cho mỗi bệnh.</p>
{!f.diseases.length&&<div className="bg-slate-800/60 rounded-lg p-4 text-sm text-center">Chưa có dấu hiệu bệnh nào.</div>}
{f.diseases.map((d,i)=><div key={d.id} className="card space-y-2 bg-slate-800/50"><div className="flex justify-between items-center"><b className="text-sm">Bệnh {i+1}</b><button type="button" className="text-red-400 text-sm" onClick={()=>setF({...f,diseases:f.diseases.filter(x=>x.id!==d.id)})}>Xóa</button></div>
<input className="inp" placeholder="Tên bệnh thường gặp (ví dụ: Sương mai)" value={d.name} onChange={e=>setD(d.id,{name:e.target.value})}/>
<textarea rows="3" className="inp" placeholder="Dấu hiệu nhận biết: triệu chứng trên lá, thân, củ..." value={d.symptoms} onChange={e=>setD(d.id,{symptoms:e.target.value})}/>
{d.imageCount>0&&!d.images.length&&<p className="text-xs text-slate-400">Trước đó đã gửi {d.imageCount} ảnh mẫu (ảnh không lưu trên trình duyệt).</p>}
<ImageDrop value={d.images} onChange={a=>setD(d.id,{images:a})} max={10} size={512} text="Tải ảnh mẫu lá/cây bị bệnh (kéo thả hoặc chọn nhiều ảnh)"/></div>)}
<button type="button" className="btn2" onClick={()=>setF({...f,diseases:[...f.diseases,{id:uid(),name:'',symptoms:'',images:[]}]})}>+ Thêm dấu hiệu bệnh</button></section>}
<div><button type="button" className="text-xs text-lime-400 underline" onClick={()=>setPv(!pv)}>{pv?'Ẩn':'Xem'} JSON sẽ gửi đi</button>{pv&&<pre className="mt-2 text-xs bg-slate-950 rounded-lg p-3 overflow-auto max-h-60">{show(tab==='ai'?makeAiPayload(f):makePayload(f))}</pre>}</div></div>
<div className="flex gap-2 flex-wrap justify-end p-4 border-t border-emerald-900"><span className="text-xs text-slate-500 mr-auto self-center">{apiConfigured?'Đã cấu hình API':'Chế độ mô phỏng (chưa có API)'}</span>
<button type="button" className="btn2" onClick={onClose}>Đóng</button><button type="button" className="btn2" disabled={!!busy} onClick={sync}>{busy==='ai'?'Đang đồng bộ...':'Đồng bộ dữ liệu AI'}</button><button type="button" className="btn" disabled={!!busy} onClick={save}>{busy==='save'?'Đang lưu...':'Lưu sản phẩm'}</button></div></div></div>)}
