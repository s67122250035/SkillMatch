const tone = (p) => (p >= 70 ? '#10b981' : p >= 40 ? '#f59e0b' : '#f43f5e')

export default function SkillMatchBar({ percent, label = 'ทักษะตรงกับตำแหน่งนี้' }) {
  return (
    <div className="match" aria-label={`${label} ${percent}%`}>
      <div className="match-top">
        <span>{label}</span>
        <span style={{ color: tone(percent) }}>{percent}%</span>
      </div>
      <div className="match-bar"><span style={{ width: `${percent}%`, background: tone(percent) }} /></div>
    </div>
  )
}
