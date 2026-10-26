import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import Button from '../components/common/Button'
import InputField from '../components/common/InputField'
import { useAuth } from '../hooks/useAuth'
import { friendlyError } from '../data/helpers'

const HOME = { graduate: '/graduate/dashboard', company: '/company/dashboard', admin: '/admin/dashboard' }

export default function LoginPage() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [form, setForm] = useState({ email: '', password: '' })
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)

  const submit = async (e) => {
    e.preventDefault()
    setError('')
    if (!/^\S+@\S+\.\S+$/.test(form.email)) return setError('รูปแบบอีเมลไม่ถูกต้อง')
    if (!form.password) return setError('กรุณากรอกรหัสผ่าน')
    setBusy(true)
    try {
      const p = await login(form.email.trim(), form.password)
      navigate(location.state?.from || HOME[p.role], { replace: true })
    } catch (err) {
      setError(friendlyError(err))
    } finally {
      setBusy(false)
    }
  }

  return (
    <main className="auth-wrap">
      <form className="card auth-card" onSubmit={submit} noValidate>
        <div className="logo" style={{ marginBottom: '1rem' }}><span className="logo-mark">🎯</span> SkillMatch</div>
        <h1 className="page-title">ยินดีต้อนรับกลับมา</h1>
        <p className="muted">เข้าสู่ระบบเพื่อดูงานที่ตรงกับทักษะของคุณ</p>
        {error && <div className="alert alert-bad" role="alert">{error}</div>}
        <InputField label="อีเมล" type="email" autoComplete="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
        <InputField label="รหัสผ่าน" type="password" autoComplete="current-password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
        <Button type="submit" block disabled={busy}>{busy ? 'กำลังเข้าสู่ระบบ...' : 'เข้าสู่ระบบ'}</Button>
        <p className="muted small" style={{ textAlign: 'center', marginTop: '1rem' }}>
          ยังไม่มีบัญชี? <Link to="/register" style={{ color: 'var(--brand)', fontWeight: 600 }}>สมัครสมาชิก</Link>
        </p>
      </form>
    </main>
  )
}
