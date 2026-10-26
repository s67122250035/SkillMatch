import { NavLink } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'

const HOME = { graduate: '/graduate/dashboard', company: '/company/dashboard', admin: '/admin/dashboard' }

/** แถบเมนูด้านล่างสำหรับมือถือ (แสดงเฉพาะจอเล็ก) */
export default function BottomNav() {
  const { profile } = useAuth()
  const items = [
    { to: '/', icon: '🏠', label: 'หน้าแรก', end: true },
    { to: '/jobs', icon: '💼', label: 'ตำแหน่งงาน' },
    { to: '/categories', icon: '🧩', label: 'หมวดหมู่' },
    { to: '/companies', icon: '🏢', label: 'บริษัท' },
    { to: profile ? HOME[profile.role] : '/login', icon: profile ? '👤' : '🔑', label: profile ? 'บัญชี' : 'เข้าสู่ระบบ', match: profile ? '/dashboard' : '/login' },
  ]
  return (
    <nav className="bottom-nav" aria-label="เมนูหลัก">
      {items.map((it) => (
        <NavLink key={it.label} to={it.to} end={it.end}
          className={({ isActive }) => (isActive || (it.match && window.location.pathname.includes(it.match)) ? 'active' : '')}>
          <span className="bn-ico">{it.icon}</span>{it.label}
        </NavLink>
      ))}
    </nav>
  )
}
