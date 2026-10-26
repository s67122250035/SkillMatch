import { categoryLabel, themeFor } from '../../../data/helpers'

export default function CategoryBanner({ category, count, skills }) {
  const t = themeFor(category.id)
  return (
    <div className="cat-banner" style={{ background: `linear-gradient(135deg, ${t.grad[0]}, ${t.grad[1]})` }}>
      <div className="cat-banner-icon">{t.icon}</div>
      <div>
        <h2 style={{ margin: 0 }}>{categoryLabel(category)} <span style={{ opacity: .7, fontWeight: 400, fontSize: '1rem' }}>· {category.name}</span></h2>
        <p style={{ margin: '.2rem 0 .6rem', opacity: .92 }}>{t.blurb || category.description} · {count} ตำแหน่งที่เปิดรับ</p>
        <div className="tags">{skills.map((s) => <span key={s.id} className="tag-glass">{s.name}</span>)}</div>
      </div>
    </div>
  )
}
