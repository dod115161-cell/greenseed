import {useState} from 'react'
/* Đọc ảnh và thu nhỏ để không làm đầy LocalStorage / giảm dung lượng gửi API */
export const toData=(file,max)=>new Promise(res=>{const r=new FileReader();r.onerror=()=>res(null);r.onload=()=>{const im=new Image();im.onerror=()=>res(null);im.onload=()=>{const k=Math.min(1,max/Math.max(im.width,im.height)),cv=document.createElement('canvas');cv.width=Math.round(im.width*k);cv.height=Math.round(im.height*k);cv.getContext('2d').drawImage(im,0,0,cv.width,cv.height);res({name:file.name,dataUrl:cv.toDataURL('image/jpeg',.7)})};im.src=r.result};r.readAsDataURL(file)})
export default function ImageDrop({value,onChange,max=5,size=640,text='Kéo thả ảnh vào đây hoặc bấm để chọn nhiều ảnh',cover=false}){
const [over,setOver]=useState(false),[busy,setBusy]=useState(false)
const add=async files=>{const fs=[...files].filter(f=>f.type.startsWith('image/')).slice(0,Math.max(0,max-value.length));if(!fs.length)return
setBusy(true);const r=(await Promise.all(fs.map(f=>toData(f,size)))).filter(Boolean);onChange([...value,...r]);setBusy(false)}
return(<div className="space-y-2"><label onDragOver={e=>{e.preventDefault();setOver(true)}} onDragLeave={()=>setOver(false)} onDrop={e=>{e.preventDefault();setOver(false);add(e.dataTransfer.files)}}
className={`block cursor-pointer rounded-xl border-2 border-dashed p-4 text-center text-sm ${over?'border-lime-400 bg-emerald-800/40':'border-emerald-800 bg-slate-800/40'}`}>
{busy?'Đang xử lý ảnh...':text}<span className="block text-xs text-slate-500 mt-1">Tối đa {max} ảnh ({value.length}/{max})</span>
<input type="file" accept="image/*" multiple className="hidden" onChange={e=>{add(e.target.files);e.target.value=''}}/></label>
{value.length>0&&<div className="flex gap-2 flex-wrap">{value.map((im,i)=><div key={i} className="relative w-20 h-20 rounded-lg overflow-hidden border border-emerald-800"><img src={im.dataUrl} alt={im.name} className="w-full h-full object-cover"/>
{cover&&i===0&&<span className="absolute bottom-0 inset-x-0 bg-lime-400 text-slate-950 text-[10px] text-center font-bold">Ảnh bìa</span>}
<button type="button" aria-label="Xóa ảnh" onClick={()=>onChange(value.filter((_,j)=>j!==i))} className="absolute top-0 right-0 bg-slate-950/80 w-5 h-5 text-xs">×</button></div>)}</div>}</div>)}
