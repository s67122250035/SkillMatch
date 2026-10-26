import { categoryLabel, themeFor } from '../../../data/helpers'

export default function CategoryChips({ categories, counts, value, onChange, total }) {
  return (
    <div className="chips" role="tablist" aria-label="หมวดหมู่งาน">
      <button className={`chip ${value === '' ? 'on' : ''}`} onClick={() => onChange('')}>
        ✨ ทั้งหมด <span className="chip-n">{total}</span>
      </button>
      {categories.map((c) => {
        const t = themeFor(c.id)
        const on = value === c.id
        return (
          <button
            key={c.id}
            className={`chip ${on ? 'on' : ''}`}
            style={on ? { background: `linear-gradient(135deg, ${t.grad[0]}, ${t.grad[1]})`, borderColor: 'transparent' } : undefined}
            onClick={() => onChange(on ? '' : c.id)}
          >
            {t.icon} {categoryLabel(c)} <span className="chip-n">{counts[c.id] || 0}</span>
          </button>
        )
      })}
    </div>
  )
}
