import {useState} from 'react'
export default function BeforeAfter({before,after,h='h-64'}){
const [v,setV]=useState(50)
return(<div className={`relative ${h} overflow-hidden rounded-xl select-none bg-slate-800`}>
<div className="absolute inset-0">{after}</div>
<div className="absolute inset-0" style={{clipPath:`inset(0 ${100-v}% 0 0)`}}>{before}</div>
<div className="absolute top-0 bottom-0 w-0.5 bg-lime-400" style={{left:v+'%'}}/>
<input type="range" min="0" max="100" value={v} onChange={e=>setV(+e.target.value)} aria-label="Kéo để so sánh trước và sau" className="absolute inset-0 w-full h-full opacity-0 cursor-ew-resize"/>
<span className="absolute top-2 left-2 text-xs bg-slate-950/70 px-2 py-0.5 rounded">Trước</span><span className="absolute top-2 right-2 text-xs bg-slate-950/70 px-2 py-0.5 rounded">Sau</span></div>)}
