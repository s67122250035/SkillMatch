import { useCallback, useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import DashboardSidebar from '../components/layout/DashboardSidebar'
import StatCard from '../components/features/admin/StatCard'
import AdminUserTable from '../components/features/admin/AdminUserTable'
import AdminJobTable from '../components/features/admin/AdminJobTable'
import ConfirmModal from '../components/common/ConfirmModal'
import { ErrorState } from '../components/common/EmptyState'
import LoadingSpinner from '../components/common/LoadingSpinner'
import { useAuth } from '../hooks/useAuth'
import { useFetchJobs } from '../hooks/useFetchJobs'
import { useToast } from '../hooks/useToast'
import { deleteJob, getAllApplications, getAllUsers, setSuspended, updateJob } from '../services/firebaseService'
import { APP_STATUS, categoryLabel, friendlyError, primaryCategoryId, themeFor } from '../data/helpers'

const ITEMS = [
  { key: 'overview', icon: '📊', label: 'ภาพรวมระบบ' },
  { key: 'users', icon: '👥', label: 'ผู้ใช้และบริษัท' },
  { key: 'jobs', icon: '🗂️', label: 'ประกาศงานทั้งระบบ' },
]

export default function AdminDashboardPage() {
  const [params] = useSearchParams()
  const tab = params.get('tab') || 'overview'
  const { profile } = useAuth()
  const catalog = useFetchJobs()
  const toast = useToast()
  const [users, setUsers] = useState([])
  const [apps, setApps] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [toDelete, setToDelete] = useState(null)

  const load = useCallback(async () => {
    setLoading(true); setError(null)
    try { const [u, a] = await Promise.all([getAllUsers(), getAllApplications()]); setUsers(u); setApps(a) }
    catch (e) { setError(e) } finally { setLoading(false) }
  }, [])
  useEffect(() => { load() }, [load])

  const toggleSuspend = async (kind, row) => {
    try {
      await setSuspended(kind === 'company' ? 'companies' : 'users', row.id, !row.suspended)
      toast(row.suspended ? 'ปลดระงับแล้ว' : 'ระงับบัญชีแล้ว')
      kind === 'company' ? catalog.reload() : load()
    } catch (e) { toast(friendlyError(e), 'bad') }
  }
  const toggleJob = async (job) => {
    try { await updateJob(job.id, { status: job.status === 'open' ? 'closed' : 'open' }); catalog.reload() }
    catch (e) { toast(friendlyError(e), 'bad') }
  }
  const removeJob = async () => {
    try { await deleteJob(toDelete.id); toast('ลบประกาศงานแล้ว'); catalog.reload(); load() }
    catch (e) { toast(friendlyError(e), 'bad') }
  }

  const byStatus = (s) => apps.filter((a) => a.status === s).length
  const busy = loading || catalog.loading

  return (
    <main className="page container">
      <h1 className="page-title">แผงควบคุมผู้ดูแลระบบ · {profile.name}</h1>
      <div className="dash">
        <DashboardSidebar items={ITEMS} base="/admin/dashboard" />
        <section>
          {(error || catalog.error) && <ErrorState error={error || catalog.error} onRetry={() => { load(); catalog.reload() }} />}
          {busy && !error ? <LoadingSpinner /> : (
            <>
              {tab === 'overview' && (
                <div className="stack">
                  <div className="grid grid-2">
                    <StatCard icon="🎓" label="บัณฑิตในระบบ" value={users.length} />
                    <StatCard icon="🏢" label="บริษัท" value={catalog.companies.length} color="#0ea5e9" />
                    <StatCard icon="🗂️" label="ประกาศงาน" value={catalog.jobs.length} color="#10b981" />
                    <StatCard icon="📨" label="ใบสมัคร" value={apps.length} color="#f59e0b" />
                  </div>
                  <div className="card">
                    <h3>ประกาศงานแยกตามหมวดหมู่</h3>
                    {catalog.categories.map((c) => {
                      const n = catalog.jobs.filter((j) => primaryCategoryId(j, catalog.skillMap) === c.id).length
                      const pct = catalog.jobs.length ? Math.round((n / catalog.jobs.length) * 100) : 0
                      const t = themeFor(c.id)
                      return (
                        <div key={c.id} className="match" style={{ marginBottom: '.8rem' }}>
                          <div className="match-top"><span>{t.icon} {categoryLabel(c)}</span><span>{n} ({pct}%)</span></div>
                          <div className="match-bar"><span style={{ width: `${pct}%`, background: `linear-gradient(90deg, ${t.grad[0]}, ${t.grad[1]})` }} /></div>
                        </div>
                      )
                    })}
                  </div>
                  <div className="card">
                    <h3>สถานะใบสมัคร</h3>
                    {Object.entries(APP_STATUS).map(([k, v]) => {
                      const n = byStatus(k), pct = apps.length ? Math.round((n / apps.length) * 100) : 0
                      return (
                        <div key={k} className="match" style={{ marginBottom: '.8rem' }}>
                          <div className="match-top"><span>{v.label}</span><span>{n} ({pct}%)</span></div>
                          <div className="match-bar"><span style={{ width: `${pct}%`, background: 'var(--brand)' }} /></div>
                        </div>
                      )
                    })}
                  </div>
                </div>
              )}
              {tab === 'users' && (
                <div className="stack">
                  <div className="card"><h3>บัณฑิต ({users.length})</h3><AdminUserTable rows={users} kind="user" onToggle={toggleSuspend} /></div>
                  <div className="card"><h3>บริษัท ({catalog.companies.length})</h3><AdminUserTable rows={catalog.companies} kind="company" onToggle={toggleSuspend} /></div>
                </div>
              )}
              {tab === 'jobs' && (
                <div className="card">
                  <h3>ประกาศงานทั้งหมด ({catalog.jobs.length})</h3>
                  <AdminJobTable jobs={catalog.jobs} companyMap={catalog.companyMap} onToggleStatus={toggleJob} onDelete={setToDelete} />
                </div>
              )}
            </>
          )}
        </section>
      </div>
      {toDelete && <ConfirmModal danger title="ลบประกาศงาน" message={`ลบ “${toDelete.title}” และใบสมัครที่เกี่ยวข้อง?`} confirmText="ลบ" onConfirm={removeJob} onClose={() => setToDelete(null)} />}
    </main>
  )
}
