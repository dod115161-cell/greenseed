import {useState} from 'react'
import ProductForm from './ProductForm'
import {vnd} from '../data/mockData'
export default function ProductManager({c}){
const {products,setProducts}=c,[m,setM]=useState(null)
const onSave=p=>setProducts(prev=>prev.some(x=>x.id===p.id)?prev.map(x=>x.id===p.id?p:x):[p,...prev])
return(<section className="card"><div className="flex justify-between items-center mb-3"><h3 className="font-bold">Quản lý sản phẩm</h3><button className="btn" onClick={()=>setM({init:null})}>+ Thêm sản phẩm</button></div>
<div className="overflow-x-auto"><table className="w-full text-sm"><tbody>{products.map(p=><tr key={p.id} className="border-t border-emerald-900/60"><td className="py-2 pr-2">{p.img?<img src={p.img} alt="" className="w-10 h-10 rounded object-cover"/>:<span className="text-2xl">{p.emoji}</span>}</td>
<td><b>{p.name}</b><br/><span className="text-xs text-slate-400">{p.sku||'Chưa có SKU'}{p.origin?` • ${p.origin}`:''}</span></td><td>{p.cat}</td>
<td className="text-lime-400">{vnd(p.price)}{p.oldPrice&&<s className="block text-xs text-slate-500">{vnd(p.oldPrice)}</s>}</td><td>Kho: {p.stock}</td>
<td>{p.diseases?.length>0&&<span className="text-xs bg-emerald-800 px-2 py-0.5 rounded-full">AI: {p.diseases.length} bệnh</span>}</td>
<td className="text-right whitespace-nowrap"><button className="btn2 mr-1" onClick={()=>setM({init:p})}>Sửa</button><button className="text-red-400" onClick={()=>confirm('Xóa sản phẩm này?')&&setProducts(products.filter(x=>x.id!==p.id))}>Xóa</button></td></tr>)}</tbody></table></div>
{m&&<ProductForm key={m.init?.id??'new'} init={m.init} products={products} onSave={onSave} onClose={()=>setM(null)}/>}</section>)}
