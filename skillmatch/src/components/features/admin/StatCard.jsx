export default function StatCard({ icon, label, value, color = '#6366f1' }) {
  return (
    <div className="card stat-card">
      <div className="stat-icon" style={{ background: `${color}22`, color }}>{icon}</div>
      <div><b>{value}</b><span className="muted small">{label}</span></div>
    </div>
  )
}
