import { useMemo, useState } from 'react'
import CompanyCard from '../components/features/companies/CompanyCard'
import { ErrorState } from '../components/common/EmptyState'
import LoadingSpinner from '../components/common/LoadingSpinner'
import EmptyState from '../components/common/EmptyState'
import { useFetchJobs } from '../hooks/useFetchJobs'

export default function CompaniesPage() {
  const { companies, jobs, loading, error, reload } = useFetchJobs()
  const [q, setQ] = useState('')
  const list = useMemo(() => {
    const t = q.trim().toLowerCase()
    return companies
      .filter((c) => !c.suspended)
      .filter((c) => !t || [c.name, c.industry, c.address].filter(Boolean).join(' ').toLowerCase().includes(t))
  }, [companies, q])
  const openCount = (id) => jobs.filter((j) => j.company_id === id && j.status === 'open').length

  return (
    <main className="page container">
      <h1 className="page-title">บริษัทที่ร่วมโครงการ</h1>
      <p className="muted">ดูว่าที่ทำงานของคุณเป็นอย่างไร ก่อนตัดสินใจสมัคร</p>
      <input className="input" style={{ maxWidth: 420, marginBottom: '1.25rem' }} value={q} onChange={(e) => setQ(e.target.value)} placeholder="🔍 ค้นหาบริษัท / อุตสาหกรรม" aria-label="ค้นหาบริษัท" />
      {error ? <ErrorState error={error} onRetry={reload} /> : loading ? <LoadingSpinner /> : list.length === 0 ? (
        <EmptyState title="ไม่พบบริษัท" />
      ) : (
        <div className="grid grid-3">
          {list.map((c, i) => <CompanyCard key={c.id} company={c} index={i} openJobs={openCount(c.id)} />)}
        </div>
      )}
    </main>
  )
}
