import {X,Plus,Minus} from 'lucide-react'
import {vnd} from '../data/mockData'
import ComboSuggest from './ComboSuggest'
export default function CartDrawer({open,onClose,cart,setCart,products,onCheckout}){
if(!open)return null
const items=cart.map(i=>({...i,p:products.find(p=>p.id===i.id)})).filter(i=>i.p)
const total=items.reduce((s,i)=>s+i.p.price*i.qty,0)
const addOne=p=>setCart(cs=>cs.find(i=>i.id===p.id)?cs.map(i=>i.id===p.id?{...i,qty:i.qty+1}:i):[...cs,{id:p.id,qty:1}])
const seedsInCart=items.filter(i=>i.p.days>0).slice(0,2)
const chg=(id,d)=>setCart(cart.map(i=>i.id===id?{...i,qty:i.qty+d}:i).filter(i=>i.qty>0))
return(<div className="fixed inset-0 z-50"><div className="absolute inset-0 bg-slate-950/70 backdrop-blur-sm" onClick={onClose}/>
<aside className="absolute right-0 top-0 h-full w-full max-w-md bg-slate-900 border-l border-emerald-900 p-5 flex flex-col text-slate-100">
<div className="flex justify-between items-center border-b border-emerald-900 pb-3"><h3 className="font-serif text-xl font-bold">Giỏ hàng của bạn</h3><button aria-label="Đóng giỏ hàng" onClick={onClose} className="text-slate-400 hover:text-white"><X/></button></div>
<div className="flex-1 overflow-y-auto py-4 space-y-3">{!items.length&&<p className="text-xs text-slate-400 text-center py-8">Giỏ hàng đang trống.</p>}
{items.map(({p,qty})=><div key={p.id} className="flex items-center gap-3 bg-slate-800/60 p-3 rounded-xl border border-emerald-900">
{p.img?<img src={p.img} alt={p.name} className="w-12 h-12 rounded-lg object-cover"/>:<span className="w-12 h-12 grid place-items-center text-2xl bg-emerald-950 rounded-lg">{p.emoji}</span>}
<div className="flex-1 min-w-0"><h4 className="text-xs font-semibold truncate">{p.name}</h4><p className="text-xs text-lime-400 mt-0.5">{vnd(p.price)}</p></div>
<div className="flex items-center gap-2"><button aria-label="Giảm" onClick={()=>chg(p.id,-1)} className="w-6 h-6 grid place-items-center bg-slate-900 rounded"><Minus size={12}/></button><span className="text-xs font-bold">{qty}</span><button aria-label="Tăng" onClick={()=>chg(p.id,1)} className="w-6 h-6 grid place-items-center bg-slate-900 rounded"><Plus size={12}/></button></div></div>)}</div>
{seedsInCart.length>0&&<div className="max-h-56 overflow-y-auto space-y-2 pb-3">{seedsInCart.map(({p})=><ComboSuggest key={p.id} seed={p} products={products} add={addOne} cart={cart} includeSeed={false}/>)}</div>}
<div className="border-t border-emerald-900 pt-4"><div className="flex justify-between font-bold mb-3"><span>Tổng cộng</span><span className="text-lime-400">{vnd(total)}</span></div>
<button disabled={!items.length} onClick={onCheckout} className="w-full py-3 rounded-xl bg-lime-400 hover:bg-lime-300 disabled:opacity-40 text-slate-950 font-bold text-sm">Tiến hành đặt hàng</button></div></aside></div>)}
