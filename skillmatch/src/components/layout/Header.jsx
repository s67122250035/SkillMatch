import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Navbar from './Navbar'
import Button from '../common/Button'
import { useAuth } from '../../hooks/useAuth'
import { colorFor, initials } from '../../data/helpers'

const HOME = { graduate: '/graduate/dashboard', company: '/company/dashboard', admin: '/admin/dashboard' }

export default function Header() {
  const { profile, logout } = useAuth()
  const [open, setOpen] = useState(false)
  const navigate = useNavigate()
  const close = () => setOpen(false)
  const [dark, setDark] = useState(() => {
    try { return localStorage.getItem('theme') === 'dark' } catch { return false }
  })
  useEffect(() => {
    document.documentElement.dataset.theme = dark ? 'dark' : 'light'
    try { localStorage.setItem('theme', dark ? 'dark' : 'light') } catch { /* ignore */ }
  }, [dark])

  return (
    <header className={`header ${open ? 'open' : ''}`}>
      <div className="container header-inner">
        <Link to="/" className="logo" onClick={close}>
          <span className="logo-mark">🎯</span> SkillMatch
        </Link>
        <Navbar onNavigate={close} />
        <div className="header-actions">
          <button className="btn btn-ghost btn-sm theme-desktop" onClick={() => setDark(!dark)} aria-label="สลับโหมดมืด/สว่าง" title="โหมดมืด/สว่าง">{dark ? '☀️' : '🌙'}</button>
          {profile ? (
            <>
              <Link to={HOME[profile.role]} className="row" onClick={close} style={{ gap: '.5rem' }}>
                <span className="avatar" style={{ background: colorFor(profile.id), width: 36, height: 36, borderRadius: 12 }}>
                  {initials(profile.name)}
                </span>
                <span style={{ fontWeight: 500 }}>{profile.name}</span>
              </Link>
              <Button variant="ghost" size="sm" onClick={async () => { await logout(); close(); navigate('/') }}>
                ออกจากระบบ
              </Button>
            </>
          ) : (
            <>
              <Link to="/login" onClick={close}><Button variant="ghost">เข้าสู่ระบบ</Button></Link>
              <Link to="/register" onClick={close}><Button>สมัครสมาชิก</Button></Link>
            </>
          )}
        </div>
        <button className="btn btn-ghost btn-sm theme-mobile" onClick={() => setDark(!dark)} aria-label="สลับโหมดมืด/สว่าง">{dark ? '☀️' : '🌙'}</button>
        <button className="btn btn-ghost menu-btn" onClick={() => setOpen(!open)} aria-label="เมนู">☰</button>
      </div>
    </header>
  )
}
