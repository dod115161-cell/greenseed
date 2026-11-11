import {useState} from 'react'
import {BLOG_CATS,CROPS} from '../data/mockData'
const E={title:'',cat:BLOG_CATS[0],cover:'🌱',body:'',related:[]}
export default function BlogManager({c}){
const {posts,setPosts,products}=c
const [f,setF]=useState(null),[seed,setSeed]=useState(''),[busy,setBusy]=useState(false)
const seeds=products.filter(p=>p.days>0)
const gen=()=>{const p=seeds.find(x=>x.name===seed);if(!p)return alert('Hãy chọn một hạt giống để gợi ý nội dung.')
setBusy(true);setTimeout(()=>{const k=CROPS[p.name]||{}
setF({...f,title:`Cách trồng ${p.name} từ hạt cho người mới bắt đầu`,cover:p.emoji,related:[p.id],body:`## ${p.name}: hướng dẫn trồng từ A-Z\n\n**Dàn ý**\n1. Chọn hạt và ủ hạt\n2. Làm đất và gieo\n3. Tưới nước và bón phân\n4. Phòng sâu bệnh\n5. Thu hoạch\n\n**Mở bài:** ${p.name} là cây ${p.diff.toLowerCase()} trồng, hợp mùa ${p.season.toLowerCase()}, thu hoạch sau khoảng ${p.days} ngày.\n\n**Gieo hạt:** hạt nảy mầm sau khoảng ${k.germinationDays||7} ngày (tỉ lệ ${p.germ}%). Đất pH ${p.ph}, nhiệt độ ${p.temp}, ${String(p.light).toLowerCase()}.\n\n**Chăm sóc:** ${k.wateringFrequency||''}. ${k.harvestTip||''}`});setBusy(false)},1000)}
const save=()=>{if(!f.title||!f.body)return alert('Vui lòng nhập tiêu đề và nội dung.');const tags=(f.tagsText??(f.tags||[]).join(',')).split(',').map(x=>x.trim()).filter(Boolean),{tagsText,...g}=f,d={...g,tags};setPosts(f.id?posts.map(x=>x.id===f.id?d:x):[{...d,id:Date.now()},...posts]);setF(null)}
const ins=t=>setF({...f,body:(f.body?f.body+'\n':'')+t})
const SN=[['Sản phẩm','[[product:1]]'],['Gallery','[[gallery:URL1|URL2|URL3]]'],['Trước/Sau','[[ba:URL_TRUOC|URL_SAU]]'],['Video','[[video:URL_VIDEO]]'],['Bảng','[[table:Cột A,Cột B;Giá trị 1,Giá trị 2]]'],['Infographic','[[info:Ý 1|Ý 2|Ý 3]]']]
const set=k=>e=>setF({...f,[k]:e.target.value}),tog=id=>setF({...f,related:f.related.includes(id)?f.related.filter(x=>x!==id):[...f.related,id]})
return(<div className="max-w-6xl mx-auto px-4 py-6 space-y-4"><div className="flex justify-between"><h2 className="font-bold text-xl">Quản lý Blog</h2><button className="btn" onClick={()=>setF(E)}>Viết bài mới</button></div>
{f&&<div className="card space-y-2"><div className="grid md:grid-cols-3 gap-2"><input className="inp md:col-span-2" placeholder="Tiêu đề" value={f.title} onChange={set('title')}/>
<select className="inp" value={f.cat} onChange={set('cat')}>{BLOG_CATS.map(x=><option key={x}>{x}</option>)}</select></div>
<input className="inp" placeholder="Ảnh cover (dán URL ảnh hoặc nhập emoji)" value={f.cover} onChange={set('cover')}/>
<div className="flex gap-2 items-center flex-wrap"><select className="inp w-auto" value={seed} onChange={e=>setSeed(e.target.value)}><option value="">Chọn hạt giống</option>{seeds.map(p=><option key={p.id}>{p.name}</option>)}</select><button className="btn2" onClick={gen} disabled={busy}>{busy?'Đang gợi ý...':'✨ Gợi ý nội dung bằng AI'}</button><span className="text-xs">Nội dung mẫu mô phỏng, hãy chỉnh sửa trước khi đăng.</span></div>
<input className="inp" placeholder="Thẻ tìm kiếm (cách nhau bằng dấu phẩy, ví dụ: vàng lá, cà chua)" value={f.tagsText??(f.tags||[]).join(', ')} onChange={set('tagsText')}/>
<div className="flex gap-1 flex-wrap items-center text-xs">Chèn khối: {SN.map(([a,b])=><button key={a} className="btn2" onClick={()=>ins(b)}>{a}</button>)}</div>
<textarea rows="9" className="inp font-mono" placeholder="Nội dung (Markdown)" value={f.body} onChange={set('body')}/>
<div><p className="text-sm mb-1">Sản phẩm liên quan:</p><div className="flex gap-1 flex-wrap">{products.map(p=><button key={p.id} onClick={()=>tog(p.id)} className={`px-2 py-1 rounded-full text-xs border ${f.related.includes(p.id)?'bg-emerald-600 text-white':'bg-slate-900 border-emerald-800'}`}>{p.emoji} {p.name}</button>)}</div></div>
<div className="flex gap-2"><button className="btn" onClick={save}>Đăng bài</button><button className="btn2" onClick={()=>setF(null)}>Hủy</button></div></div>}
<div className="card">{posts.map(b=><div key={b.id} className="flex justify-between items-center border-t first:border-0 border-emerald-900/60 py-2 text-sm"><span>{String(b.cover).startsWith('http')?'🖼️':b.cover} <b>{b.title}</b> <span className="bg-emerald-800 px-2 rounded text-xs">{b.cat}</span></span>
<span><button className="btn2 mr-1" onClick={()=>setF(b)}>Sửa</button><button className="text-red-400" onClick={()=>confirm('Xóa bài viết này?')&&setPosts(posts.filter(x=>x.id!==b.id))}>Xóa</button></span></div>)}</div></div>)}
