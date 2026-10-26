import { Link } from 'react-router-dom'
import { ErrorState } from '../components/common/EmptyState'
import LoadingSpinner from '../components/common/LoadingSpinner'
import { useFetchJobs } from '../hooks/useFetchJobs'
import { categoryLabel, primaryCategoryId, themeFor } from '../data/helpers'

export default function CategoriesPage() {
  const { categories, skills, jobs, skillMap, loading, error, reload } = useFetchJobs()
  if (loading) return <main className="page container"><LoadingSpinner /></main>
  if (error) return <main className="page container"><ErrorState error={error} onRetry={reload} /></main>
  const open = jobs.filter((j) => j.status === 'open')

  return (
    <main className="page container">
      <h1 className="page-title">หมวดหมู่สายงาน</h1>
      <p className="muted">เลือกสายงานที่ตรงกับทักษะของคุณ แล้วดูตำแหน่งงานและฝึกงานในสายนั้นทั้งหมด</p>
      <div className="grid grid-2" style={{ marginTop: '1.5rem' }}>
        {categories.map((c) => {
          const t = themeFor(c.id)
          const n = open.filter((j) => primaryCategoryId(j, skillMap) === c.id).length
          const list = skills.filter((s) => s.category_id === c.id)
          return (
            <Link key={c.id} to={`/jobs?category=${c.id}`} className="card card-hover cat-big">
              <div className="cat-big-head" style={{ background: `linear-gradient(135deg, ${t.grad[0]}, ${t.grad[1]})` }}>
                <span style={{ fontSize: '2.6rem' }}>{t.icon}</span>
                <div><h3 style={{ margin: 0 }}>{categoryLabel(c)}</h3><span style={{ opacity: .85 }}>{c.name}</span></div>
                <span className="pill" style={{ marginLeft: 'auto' }}>{n} ตำแหน่ง</span>
              </div>
              <div style={{ padding: '1rem 1.25rem 1.25rem' }}>
                <p className="muted">{t.blurb || c.description}</p>
                <div className="tags">{list.map((s) => <span key={s.id} className="tag">{s.name}</span>)}</div>
              </div>
            </Link>
          )
        })}
      </div>
    </main>
  )
}
