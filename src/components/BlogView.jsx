import {useState} from 'react'
import {BLOG_CATS,vnd} from '../data/mockData'
import BeforeAfter from './BeforeAfter'
const SYMP=['Vàng lá','Rụng hoa','Cây héo','Sâu bệnh']
const nz=s=>String(s||'').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/đ/g,'d')
const Img=({s})=>s?<img src={s} alt="" loading="lazy" className="w-full h-full object-cover"/>:<div className="w-full h-full grid place-items-center text-4xl bg-emerald-950">🌱</div>
const Cover=({v})=>String(v||'').startsWith('http')?<img src={v} alt="" loading="lazy" className="h-36 w-full object-cover rounded-lg mb-2"/>:<div className="text-5xl text-center bg-emerald-800/40 rounded-lg py-6 mb-2">{v||'🌱'}</div>
function Gallery({imgs}){const [i,setI]=useState(0);return(<div className="relative h-56 rounded-xl overflow-hidden"><Img s={imgs[i]}/>
<button aria-label="Ảnh trước" onClick={()=>setI((i+imgs.length-1)%imgs.length)} className="absolute left-2 top-1/2 bg-slate-950/70 w-8 h-8 rounded-full">‹</button>
<button aria-label="Ảnh sau" onClick={()=>setI((i+1)%imgs.length)} className="absolute right-2 top-1/2 bg-slate-950/70 w-8 h-8 rounded-full">›</button>
<span className="absolute bottom-2 right-2 text-xs bg-slate-950/70 px-2 rounded">{i+1}/{imgs.length}</span></div>)}
function Body({body,products,add}){return(<div className="space-y-3">{String(body||'').split('\n').map((ln,i)=>{const l=ln.trim();if(!l)return null
const m=l.match(/^\[\[(\w+):(.*)\]\]$/)
if(!m)return l.startsWith('## ')?<h3 key={i} className="text-lg font-bold text-lime-400 mt-4">{l.slice(3)}</h3>:<p key={i} className="text-sm text-slate-300 leading-relaxed">{l}</p>
const t=m[1],v=m[2],a=v.split('|')
if(t==='gallery')return <Gallery key={i} imgs={a}/>
if(t==='ba')return <BeforeAfter key={i} before={<Img s={a[0]}/>} after={<Img s={a[1]}/>}/>
if(t==='video')return a[0].includes('youtube.com/embed')?<iframe key={i} src={a[0]} title="Video" className="w-full h-56 rounded-xl" allowFullScreen/>:<video key={i} src={a[0]} controls playsInline className="w-full rounded-xl"/>
if(t==='table'){const rows=v.split(';').map(r=>r.split(','));return(<div key={i} className="overflow-x-auto"><table className="w-full text-sm border border-emerald-900/60"><thead><tr>{rows[0].map((c,j)=><th key={j} className="text-left bg-emerald-800 px-3 py-2">{c}</th>)}</tr></thead><tbody>{rows.slice(1).map((r,j)=><tr key={j} className="border-t border-emerald-900/60">{r.map((c,k)=><td key={k} className="px-3 py-2">{c}</td>)}</tr>)}</tbody></table></div>)}
if(t==='info')return <div key={i} className="grid sm:grid-cols-3 gap-2">{a.map((x,j)=><div key={j} className="bg-emerald-800/50 border border-emerald-700 rounded-lg p-3 text-sm"><b className="text-lime-400">{j+1}.</b> {x}</div>)}</div>
if(t==='product'){const p=products.find(x=>x.id==v);return p?<div key={i} className="flex items-center justify-between gap-3 bg-slate-800/60 border border-lime-400/30 rounded-xl p-3"><span className="text-sm">{p.emoji} <b>{p.name}</b> • <span className="text-lime-400">{vnd(p.price)}</span></span><button className="btn" onClick={()=>add(p)}>Mua ngay</button></div>:null}
return null})}</div>)}
export function Article({b,products,add,onBack}){return(<article className="card space-y-3 max-w-3xl mx-auto"><button className="btn2" onClick={onBack}>← Quay lại</button><Cover v={b.cover}/>
<span className="text-xs bg-emerald-800 px-2 py-0.5 rounded">{b.cat}</span><h2 className="text-2xl font-bold">{b.title}</h2>
<div className="flex gap-1 flex-wrap">{(b.tags||[]).map(t=><span key={t} className="text-xs text-slate-400">#{t}</span>)}</div><Body body={b.body} products={products} add={add}/>
{(b.related||[]).length>0&&<div className="pt-3 border-t border-emerald-900/60"><p className="text-sm mb-2">Sản phẩm liên quan:</p><div className="flex gap-2 flex-wrap">{b.related.map(id=>products.find(p=>p.id===id)).filter(Boolean).map(p=><button key={p.id} className="btn2" onClick={()=>add(p)}>{p.emoji} {p.name} +</button>)}</div></div>}</article>)}
export default function BlogView({posts,products,add}){
const [q,setQ]=useState(''),[cat,setCat]=useState('Tất cả'),[open,setOpen]=useState(null)
const b=posts.find(x=>x.id===open)
if(b)return <Article b={b} products={products} add={add} onBack={()=>setOpen(null)}/>
const k=nz(q),list=posts.filter(x=>(cat==='Tất cả'||x.cat===cat)&&(!k||nz([x.title,x.body,x.cat,...(x.tags||[])].join(' ')).includes(k)))
const chip=(on)=>`px-3 py-1 rounded-full text-xs border ${on?'bg-emerald-600 text-white border-emerald-600':'bg-slate-900 text-slate-300 border-emerald-800'}`
return(<div className="space-y-4"><input className="inp" placeholder="Tìm theo từ khóa, tình trạng cây (vàng lá, rụng hoa...), loại cây hoặc chủ đề" value={q} onChange={e=>setQ(e.target.value)}/>
<div className="flex gap-2 flex-wrap">{SYMP.map(s=><button key={s} className={chip(q===s)} onClick={()=>setQ(q===s?'':s)}>🔎 {s}</button>)}</div>
<div className="flex gap-2 flex-wrap">{['Tất cả',...BLOG_CATS].map(c=><button key={c} className={chip(cat===c)} onClick={()=>setCat(c)}>{c}</button>)}</div>
{!list.length&&<p className="text-sm text-slate-400">Không tìm thấy bài viết phù hợp.</p>}
<div className="grid md:grid-cols-3 gap-4">{list.map(x=><article key={x.id} className="card flex flex-col"><Cover v={x.cover}/><span className="text-xs bg-emerald-800 px-2 py-0.5 rounded self-start">{x.cat}</span><h3 className="font-bold my-2">{x.title}</h3>
<p className="text-xs text-slate-400 mb-3">{(x.tags||[]).map(t=>'#'+t).join(' ')}</p><button className="btn mt-auto" onClick={()=>setOpen(x.id)}>Đọc bài</button></article>)}</div></div>)}
