import { NavLink } from 'react-router-dom'

export default function Navbar({ onNavigate }) {
  return (
    <nav className="nav" onClick={onNavigate}>
      <NavLink to="/" end>หน้าแรก</NavLink>
      <NavLink to="/jobs">ตำแหน่งงาน</NavLink>
      <NavLink to="/categories">หมวดหมู่</NavLink>
      <NavLink to="/companies">บริษัท</NavLink>
      <NavLink to="/about">เกี่ยวกับระบบ</NavLink>
    </nav>
  )
}
