import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Button from '../components/common/Button'
import InputField from '../components/common/InputField'
import { useAuth } from '../hooks/useAuth'
import { useToast } from '../hooks/useToast'
import { friendlyError } from '../data/helpers'

export default function RegisterPage() {
  const { register } = useAuth()
  const toast = useToast()
  const navigate = useNavigate()
  const [role, setRole] = useState('graduate')
  const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '', education: '', description: '' })
  const [errors, setErrors] = useState({})
  const [busy, setBusy] = useState(false)
  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value })

  const validate = () => {
    const er = {}
    if (!form.name.trim()) er.name = 'กรุณากรอกชื่อ'
    if (!/^\S+@\S+\.\S+$/.test(form.email)) er.email = 'รูปแบบอีเมลไม่ถูกต้อง'
    if (form.password.length < 6) er.password = 'รหัสผ่านต้องมีอย่างน้อย 6 ตัวอักษร'
    if (form.confirm !== form.password) er.confirm = 'รหัสผ่านไม่ตรงกัน'
    setErrors(er)
    return !Object.keys(er).length
  }

  const submit = async (e) => {
    e.preventDefault()
    if (!validate()) return
    setBusy(true)
    try {
      const p = await register({
        role, name: form.name.trim(), email: form.email.trim(), password: form.password,
        extra: { education: form.education, description: form.description },
      })
      toast('สมัครสมาชิกสำเร็จ ยินดีต้อนรับ!')
      navigate(p?.role === 'company' ? '/company/dashboard' : '/graduate/dashboard?tab=profile', { replace: true })
    } catch (err) {
      setErrors({ form: friendlyError(err) })
    } finally {
      setBusy(false)
    }
  }

  return (
    <main className="auth-wrap">
      <form className="card auth-card" onSubmit={submit} noValidate>
        <h1 className="page-title">สร้างบัญชีใหม่</h1>
        <div className="role-switch" role="tablist">
          <button type="button" className={role === 'graduate' ? 'on' : ''} onClick={() => setRole('graduate')}>🎓 บัณฑิต / นักศึกษา</button>
          <button type="button" className={role === 'company' ? 'on' : ''} onClick={() => setRole('company')}>🏢 บริษัท</button>
        </div>
        {errors.form && <div className="alert alert-bad" role="alert">{errors.form}</div>}
        <InputField label={role === 'company' ? 'ชื่อบริษัท' : 'ชื่อ-นามสกุล'} value={form.name} onChange={set('name')} error={errors.name} />
        <InputField label="อีเมล" type="email" autoComplete="email" value={form.email} onChange={set('email')} error={errors.email} />
        {role === 'graduate'
          ? <InputField label="การศึกษา (ไม่บังคับ)" value={form.education} onChange={set('education')} placeholder="เช่น วท.บ. วิทยาการคอมพิวเตอร์" />
          : <InputField as="textarea" rows={3} label="เกี่ยวกับบริษัท (ไม่บังคับ)" value={form.description} onChange={set('description')} />}
        <div className="grid grid-2" style={{ gap: '0 1rem' }}>
          <InputField label="รหัสผ่าน" type="password" autoComplete="new-password" value={form.password} onChange={set('password')} error={errors.password} />
          <InputField label="ยืนยันรหัสผ่าน" type="password" autoComplete="new-password" value={form.confirm} onChange={set('confirm')} error={errors.confirm} />
        </div>
        <Button type="submit" block disabled={busy}>{busy ? 'กำลังสมัคร...' : 'สมัครสมาชิก'}</Button>
        <p className="muted small" style={{ textAlign: 'center', marginTop: '1rem' }}>
          มีบัญชีอยู่แล้ว? <Link to="/login" style={{ color: 'var(--brand)', fontWeight: 600 }}>เข้าสู่ระบบ</Link>
        </p>
      </form>
    </main>
  )
}
