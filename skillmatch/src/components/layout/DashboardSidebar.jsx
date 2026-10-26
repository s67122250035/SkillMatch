import { NavLink, useSearchParams } from 'react-router-dom'

export default function DashboardSidebar({ items, base }) {
  const [params] = useSearchParams()
  const current = params.get('tab') || items[0].key
  return (
    <aside className="sidebar card" style={{ padding: '.75rem' }}>
      {items.map((it) => (
        <NavLink
          key={it.key}
          to={`${base}?tab=${it.key}`}
          className={() => (current === it.key ? 'active' : '')}
        >
          <span>{it.icon}</span> {it.label}
        </NavLink>
      ))}
    </aside>
  )
}
