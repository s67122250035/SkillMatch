import { useEffect, useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import CategoryChips from '../components/features/jobs/CategoryChips'
import CategoryBanner from '../components/features/jobs/CategoryBanner'
import FilterPanel, { EMPTY_FILTERS } from '../components/features/jobs/FilterPanel'
import JobList from '../components/features/jobs/JobList'
import Pagination from '../components/common/Pagination'
import { ErrorState } from '../components/common/EmptyState'
import { useFetchJobs } from '../hooks/useFetchJobs'
import { useAuth } from '../hooks/useAuth'
import { useFavorites } from '../hooks/useFavorites'
import { useToast } from '../hooks/useToast'
import { LOCATIONS, matchPercent, primaryCategoryId } from '../data/helpers'

const PER_PAGE = 9

export default function JobListingsPage() {
  const [params] = useSearchParams()
  const { jobs, categories, skills, companyMap, skillMap, categoryMap, loading, error, reload } = useFetchJobs()
  const { profile } = useAuth()
  const isGrad = profile?.role === 'graduate'
  const mySkills = isGrad ? profile.skill_ids || [] : []
  const { favoriteIds, toggleFavorite } = useFavorites(isGrad ? profile.id : null)
  const toast = useToast()

  const [filters, setFilters] = useState({ ...EMPTY_FILTERS, q: params.get('q') || '', category: params.get('category') || '' })
  const [page, setPage] = useState(1)
  const [layout, setLayout] = useState('grid')
  const [filtersOpen, setFiltersOpen] = useState(false)

  useEffect(() => {
    setFilters((f) => ({ ...f, q: params.get('q') || f.q, category: params.get('category') || f.category }))
  }, [params])
  useEffect(() => setPage(1), [filters])

  const locations = useMemo(() => [...new Set([...LOCATIONS, ...jobs.map((j) => j.location).filter(Boolean)])], [jobs])

  const result = useMemo(() => {
    const q = filters.q.trim().toLowerCase()
    const list = jobs.filter((j) => {
      if (filters.openOnly && j.status !== 'open') return false
      if (filters.type && j.type !== filters.type) return false
      if (filters.work_mode && j.work_mode !== filters.work_mode) return false
      if (filters.location && j.location !== filters.location) return false
      if (filters.category && !(j.required_skill_ids || []).some((s) => skillMap[s]?.category_id === filters.category)) return false
      if (q) {
        const hay = [j.title, j.description, companyMap[j.company_id]?.name, ...(j.required_skill_ids || []).map((s) => skillMap[s]?.name)]
          .filter(Boolean).join(' ').toLowerCase()
        if (!hay.includes(q)) return false
      }
      return true
    })
    const sorters = {
      newest: (a, b) => (b.posted_at || '').localeCompare(a.posted_at || ''),
      salary: (a, b) => (b.salary_max || 0) - (a.salary_max || 0),
      match: (a, b) => matchPercent(b.required_skill_ids, mySkills) - matchPercent(a.required_skill_ids, mySkills),
    }
    return list.sort(sorters[filters.sort] || sorters.newest)
  }, [jobs, filters, skillMap, companyMap, mySkills])

  const counts = useMemo(() => {
    const c = {}
    jobs.filter((j) => j.status === 'open').forEach((j) => {
      const cid = primaryCategoryId(j, skillMap)
      if (cid) c[cid] = (c[cid] || 0) + 1
    })
    return c
  }, [jobs, skillMap])
  const openTotal = jobs.filter((j) => j.status === 'open').length
  const activeCat = categoryMap[filters.category]

  const totalPages = Math.max(1, Math.ceil(result.length / PER_PAGE))
  const pageItems = result.slice((page - 1) * PER_PAGE, page * PER_PAGE)

  const onFav = async (id) => {
    if (!isGrad) return toast('เข้าสู่ระบบด้วยบัญชีบัณฑิตเพื่อบันทึกรายการโปรด', 'bad')
    try { toast((await toggleFavorite(id)) ? 'บันทึกเป็นรายการโปรดแล้ว' : 'เอาออกจากรายการโปรดแล้ว') }
    catch { toast('บันทึกไม่สำเร็จ', 'bad') }
  }

  return (
    <main className="page container">
      <h1 className="page-title">{filters.q ? `ผลการค้นหา “${filters.q}”` : 'ตำแหน่งงานและฝึกงานทั้งหมด'}</h1>
      <div className="row between" style={{ marginBottom: '1rem' }}>
        <p className="muted" style={{ margin: 0 }}>{loading ? 'กำลังโหลด...' : `พบ ${result.length} ตำแหน่ง`}</p>
        <button className="btn btn-ghost btn-sm filter-toggle" onClick={() => setFiltersOpen(!filtersOpen)}>⚙️ ตัวกรอง{filtersOpen ? ' ▲' : ' ▼'}</button>
        <div className="view-toggle" role="group" aria-label="รูปแบบการแสดงผล">
          <button className={layout === 'grid' ? 'on' : ''} onClick={() => setLayout('grid')}>▦ การ์ด</button>
          <button className={layout === 'list' ? 'on' : ''} onClick={() => setLayout('list')}>☰ รายการ</button>
        </div>
      </div>
      {!loading && (
        <CategoryChips categories={categories} counts={counts} total={openTotal} value={filters.category} onChange={(c) => setFilters({ ...filters, category: c })} />
      )}
      {activeCat && (
        <CategoryBanner category={activeCat} count={counts[activeCat.id] || 0} skills={skills.filter((s) => s.category_id === activeCat.id)} />
      )}
      {error ? <ErrorState error={error} onRetry={reload} /> : (
        <div className="layout-2">
          <FilterPanel open={filtersOpen} filters={filters} onChange={setFilters} locations={locations} showMatchSort={mySkills.length > 0} />
          <div>
            <JobList
              jobs={pageItems} loading={loading} layout={layout} companyMap={companyMap} skillMap={skillMap} categoryMap={categoryMap} mySkillIds={mySkills}
              favoriteIds={favoriteIds} onToggleFavorite={onFav}
              emptyAction={<button className="btn btn-primary" onClick={() => setFilters(EMPTY_FILTERS)}>ล้างตัวกรอง</button>}
            />
            <Pagination page={page} totalPages={totalPages} onChange={(n) => { setPage(n); window.scrollTo({ top: 0, behavior: 'smooth' }) }} />
          </div>
        </div>
      )}
    </main>
  )
}
