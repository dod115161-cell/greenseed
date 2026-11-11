import { useState } from 'react'
import { createPortal } from 'react-dom'

// Hộp đăng nhập thêm: Email + mật khẩu, hoặc GitHub (bổ sung cho nút Google sẵn có)
export default function LoginModal({ supabase, onClose, onGoogleLogin }) {
  const [mode, setMode] = useState('login') // 'login' | 'signup' | 'reset'
  const [email, setEmail] = useState('')
  const [pass, setPass] = useState('')
  const [msg, setMsg] = useState({ type: '', text: '' })
  const [busy, setBusy] = useState(false)
  const back = window.location.origin + import.meta.env.BASE_URL // địa chỉ quay về sau khi xác nhận email / đăng nhập

  // Đổi thông báo lỗi tiếng Anh của Supabase sang tiếng Việt dễ hiểu
  const vi = m => {
    if (/Invalid login credentials/i.test(m)) return 'Email hoặc mật khẩu không đúng.'
    if (/Email not confirmed/i.test(m)) return 'Email chưa được xác nhận. Hãy mở hộp thư và bấm link xác nhận.'
    if (/already registered/i.test(m)) return 'Email này đã có tài khoản. Hãy chuyển sang "Đăng nhập".'
    if (/at least 6/i.test(m)) return 'Mật khẩu cần ít nhất 6 ký tự.'
    if (/rate limit/i.test(m)) return 'Gửi email quá nhiều lần. Vui lòng đợi ít phút rồi thử lại.'
    return m
  }

  const submit = async e => {
    e.preventDefault()
    if (!/^\S+@\S+\.\S+$/.test(email)) return setMsg({ type: 'err', text: 'Email chưa đúng định dạng.' })
    if (mode !== 'reset' && pass.length < 6) return setMsg({ type: 'err', text: 'Mật khẩu cần ít nhất 6 ký tự.' })
    setBusy(true); setMsg({ type: '', text: '' })
    try {
      if (mode === 'login') {
        const { error } = await supabase.auth.signInWithPassword({ email, password: pass })
        if (error) throw error
        onClose()
      } else if (mode === 'signup') {
        const { data, error } = await supabase.auth.signUp({ email, password: pass, options: { emailRedirectTo: back } })
        if (error) throw error
        if (data.session) onClose() // dự án tắt xác nhận email -> đăng nhập luôn
        else setMsg({ type: 'ok', text: `Đã gửi email xác nhận tới ${email}. Mở hộp thư (kể cả mục Spam), bấm link xác nhận rồi quay lại đăng nhập.` })
      } else {
        const { error } = await supabase.auth.resetPasswordForEmail(email, { redirectTo: back })
        if (error) throw error
        setMsg({ type: 'ok', text: `Đã gửi link đặt lại mật khẩu tới ${email}.` })
      }
    } catch (err) {
      setMsg({ type: 'err', text: vi(err.message || String(err)) })
    } finally { setBusy(false) }
  }

  const github = async () => {
    const { error } = await supabase.auth.signInWithOAuth({ provider: 'github', options: { redirectTo: back } })
    if (error) setMsg({ type: 'err', text: vi(error.message) })
  }

  const title = { login: 'Đăng nhập', signup: 'Tạo tài khoản mới', reset: 'Quên mật khẩu' }[mode]

  // createPortal: vẽ hộp ra thẳng <body>, để không bị kẹt trong thanh menu (header có hiệu ứng làm mờ)
  return createPortal(
    <div className="fixed inset-0 bg-black/60 grid place-items-center p-4 z-50" onClick={onClose}>
      <div className="card max-w-sm w-full space-y-3 text-slate-100" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-lg">{title}</h3>
          <button onClick={onClose} className="text-slate-400 hover:text-white text-xl leading-none" aria-label="Đóng">×</button>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <button onClick={onGoogleLogin} className="rounded-lg py-2 text-sm font-semibold bg-white text-gray-800 hover:bg-gray-100">Google</button>
          <button onClick={github} className="rounded-lg py-2 text-sm font-semibold bg-slate-800 border border-slate-600 hover:bg-slate-700">GitHub</button>
        </div>
        <p className="text-center text-xs text-slate-500">hoặc dùng email</p>

        <form onSubmit={submit} className="space-y-2">
          <input className="inp" type="email" placeholder="Email" autoComplete="email" value={email} onChange={e => setEmail(e.target.value)} />
          {mode !== 'reset' && (
            <input className="inp" type="password" placeholder="Mật khẩu (ít nhất 6 ký tự)" autoComplete={mode === 'signup' ? 'new-password' : 'current-password'} value={pass} onChange={e => setPass(e.target.value)} />
          )}
          {msg.text && <p className={`text-xs ${msg.type === 'ok' ? 'text-lime-400' : 'text-red-400'}`}>{msg.text}</p>}
          <button className="btn w-full" disabled={busy}>{busy ? 'Đang xử lý...' : mode === 'login' ? 'Đăng nhập' : mode === 'signup' ? 'Đăng ký' : 'Gửi link đặt lại'}</button>
        </form>

        <div className="text-xs text-slate-400 flex justify-between">
          {mode === 'login'
            ? <><button onClick={() => { setMode('signup'); setMsg({}) }} className="hover:text-lime-400">Chưa có tài khoản? Đăng ký</button><button onClick={() => { setMode('reset'); setMsg({}) }} className="hover:text-lime-400">Quên mật khẩu?</button></>
            : <button onClick={() => { setMode('login'); setMsg({}) }} className="hover:text-lime-400">← Quay lại đăng nhập</button>}
        </div>
      </div>
    </div>,
    document.body
  )
}
