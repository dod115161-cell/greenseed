const API=import.meta.env?.VITE_API_URL
export const apiConfigured=!!API
/* Gửi JSON lên backend. Nếu chưa cấu hình VITE_API_URL thì chạy chế độ mô phỏng. */
export async function post(path,body){
if(!API){await new Promise(r=>setTimeout(r,700));return {ok:true,simulated:true}}
const r=await fetch(API.replace(/\/$/,'')+path,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(body)})
if(!r.ok)throw new Error('HTTP '+r.status)
return {ok:true,simulated:false,data:await r.json().catch(()=>null)}}
