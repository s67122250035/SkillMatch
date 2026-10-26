import { Link, useParams } from 'react-router-dom'
import CompanyAvatar from '../components/common/CompanyAvatar'
import CoverImage, { GeneratedCover } from '../components/common/CoverArt'
import JobCard from '../components/features/jobs/JobCard'
import EmptyState, { ErrorState } from '../components/common/EmptyState'
import LoadingSpinner from '../components/common/LoadingSpinner'
import { useFetchJobs } from '../hooks/useFetchJobs'
import { useAuth } from '../hooks/useAuth'
import { CATEGORY_THEME, primaryCategoryId, themeFor } from '../data/helpers'

export default function CompanyPage() {
  const { companyId } = useParams()
  const { companies, jobs, skillMap, categoryMap, companyMap, loading, error, reload } = useFetchJobs()
  const { profile } = useAuth()
  const mySkills = profile?.role === 'graduate' ? profile.skill_ids || [] : []

  if (loading) return <main className="page container"><LoadingSpinner /></main>
  if (error) return <main className="page container"><ErrorState error={error} onRetry={reload} /></main>
  const company = companyMap[companyId]
  if (!company) {
    return <main className="page container"><EmptyState emoji="🏢" title="ไม่พบบริษัทนี้" action={<Link to="/companies" className="btn btn-primary">ดูบริษัททั้งหมด</Link>} /></main>
  }

  const myJobs = jobs.filter((j) => j.company_id === company.id)
  const open = myJobs.filter((j) => j.status === 'open')
  const idx = companies.findIndex((c) => c.id === company.id)
  const theme = Object.values(CATEGORY_THEME)[idx % 5]
  const catCount = {}
  myJobs.forEach((j) => { const c = primaryCategoryId(j, skillMap); if (c) catCount[c] = (catCount[c] || 0) + 1 })

  return (
    <main className="page container">
      <div className="breadcrumb"><Link to="/">หน้าแรก</Link> / <Link to="/companies">บริษัท</Link> / {company.name}</div>
      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        <CoverImage url={company.cover_url} fallback={<GeneratedCover grad={theme.grad} icon="" seed={company.id} height={200} />} />
        <div style={{ padding: '0 1.5rem 1.5rem' }}>
          <div className="row between" style={{ alignItems: 'flex-end', marginTop: '-2.6rem' }}>
            <div className="logo-pop big"><CompanyAvatar company={company} size={84} radius={24} /></div>
            {company.website && <a href={company.website} target="_blank" rel="noreferrer" className="btn btn-ghost">เว็บไซต์บริษัท ↗</a>}
          </div>
          <h1 className="page-title" style={{ marginTop: '.75rem' }}>{company.name}{company.verified && ' ✔'}</h1>
          {company.tagline && <p style={{ fontSize: '1.05rem' }}>{company.tagline}</p>}
          <div className="info-grid">
            {company.industry && <div><span>อุตสาหกรรม</span><b>{company.industry}</b></div>}
            {company.size && <div><span>ขนาดองค์กร</span><b>👥 {company.size}</b></div>}
            {company.address && <div><span>ที่ตั้ง</span><b>📍 {company.address}</b></div>}
            <div><span>ตำแหน่งที่เปิดรับ</span><b>{open.length} ตำแหน่ง</b></div>
          </div>
        </div>
      </div>

      <div className="detail-grid" style={{ marginTop: '1.5rem' }}>
        <div className="stack">
          {company.description && <div className="card"><h3>เกี่ยวกับบริษัท</h3><p className="muted" style={{ margin: 0 }}>{company.description}</p></div>}
          {company.perks?.length > 0 && (
            <div className="card"><h3>บรรยากาศและสวัสดิการ</h3>
              <div className="perk-grid">{company.perks.map((p) => <div key={p} className="perk">🎁 {p}</div>)}</div>
            </div>
          )}
        </div>
        <div className="card">
          <h3>สายงานที่รับ</h3>
          {Object.keys(catCount).length === 0 ? <p className="muted small">ยังไม่มีข้อมูล</p> : Object.entries(catCount).map(([cid, n]) => {
            const t = themeFor(cid)
            return <div key={cid} className="row between" style={{ marginBottom: '.5rem' }}><span>{t.icon} {t.th}</span><span className="badge">{n}</span></div>
          })}
        </div>
      </div>

      <section className="section">
        <div className="section-head"><h2>ตำแหน่งที่เปิดรับ ({open.length})</h2></div>
        {open.length === 0 ? <EmptyState emoji="📭" title="ตอนนี้ยังไม่มีตำแหน่งที่เปิดรับ" /> : (
          <div className="grid grid-3">
            {open.map((j) => <JobCard key={j.id} job={j} company={company} skillMap={skillMap} categoryMap={categoryMap} mySkillIds={mySkills} />)}
          </div>
        )}
      </section>
    </main>
  )
}
