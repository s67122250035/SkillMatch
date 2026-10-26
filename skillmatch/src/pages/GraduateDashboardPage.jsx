import { useCallback, useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import DashboardSidebar from '../components/layout/DashboardSidebar'
import GraduateProfileForm from '../components/features/profile/GraduateProfileForm'
import ApplicationCard from '../components/features/applications/ApplicationCard'
import JobList from '../components/features/jobs/JobList'
import ConfirmModal from '../components/common/ConfirmModal'
import EmptyState, { ErrorState } from '../components/common/EmptyState'
import LoadingSpinner from '../components/common/LoadingSpinner'
import { Link } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import StatCard from '../components/features/admin/StatCard'
import SkillMatchBar from '../components/features/jobs/SkillMatchBar'
import { useFetchJobs } from '../hooks/useFetchJobs'
import { useFavorites } from '../hooks/useFavorites'
import { useToast } from '../hooks/useToast'
import { getAllApplications, withdrawApplication } from '../services/firebaseService'
import { matchPercent } from '../data/helpers'

const ITEMS = [
  { key: 'overview', icon: '🏠', label: 'ภาพรวม' },
  { key: 'profile', icon: '👤', label: 'โปรไฟล์และทักษะ' },
  { key: 'applications', icon: '📨', label: 'ใบสมัครของฉัน' },
  { key: 'favorites', icon: '♥', label: 'รายการโปรด' },
]

export default function GraduateDashboardPage() {
  const [params] = useSearchParams()
  const tab = params.get('tab') || 'overview'
  const { profile, refreshProfile } = useAuth()
  const catalog = useFetchJobs()
  const { favoriteIds, toggleFavorite } = useFavorites(profile.id)
  const toast = useToast()
  const [apps, setApps] = useState([])
  const [appsLoading, setAppsLoading] = useState(true)
  const [appsError, setAppsError] = useState(null)
  const [toWithdraw, setToWithdraw] = useState(null)

  const loadApps = useCallback(async () => {
    setAppsLoading(true); setAppsError(null)
    try {
      const all = await getAllApplications()
      setApps(all.filter((a) => a.user_id === profile.id).sort((a, b) => (b.applied_at || '').localeCompare(a.applied_at || '')))
    } catch (e) { setAppsError(e) } finally { setAppsLoading(false) }
  }, [profile.id])
  useEffect(() => { loadApps() }, [loadApps])

  const jobById = Object.fromEntries(catalog.jobs.map((j) => [j.id, j]))
  const favJobs = favoriteIds.map((id) => jobById[id]).filter(Boolean)

  const mySkills = profile.skill_ids || []
  const strength = [
    profile.name ? 20 : 0, profile.education ? 20 : 0, profile.resume_url ? 20 : 0,
    Math.min(40, mySkills.length * 10),
  ].reduce((a, b) => a + b, 0)
  const topMatches = mySkills.length
    ? catalog.jobs.filter((j) => j.status === 'open')
        .map((j) => ({ j, p: matchPercent(j.required_skill_ids, mySkills) }))
        .sort((a, b) => b.p - a.p).slice(0, 3)
    : []

  const withdraw = async () => {
    try { await withdrawApplication(toWithdraw.id); toast('ยกเลิกใบสมัครแล้ว'); loadApps() }
    catch { toast('ยกเลิกไม่สำเร็จ', 'bad') }
  }

  return (
    <main className="page container">
      <h1 className="page-title">สวัสดี, {profile.name} 👋</h1>
      <div className="dash">
        <DashboardSidebar items={ITEMS} base="/graduate/dashboard" />
        <section>
          {catalog.error && <ErrorState error={catalog.error} onRetry={catalog.reload} />}
          {tab === 'overview' && (
            <div className="stack">
              <div className="grid grid-2">
                <StatCard icon="📨" label="ใบสมัครทั้งหมด" value={apps.length} />
                <StatCard icon="✅" label="ผ่านการคัดเลือก" value={apps.filter((a) => a.status === 'accepted').length} color="#10b981" />
                <StatCard icon="⏳" label="รอตรวจสอบ" value={apps.filter((a) => a.status === 'pending').length} color="#f59e0b" />
                <StatCard icon="♥" label="รายการโปรด" value={favoriteIds.length} color="#ef4444" />
              </div>
              <div className="card">
                <SkillMatchBar percent={strength} label="ความสมบูรณ์ของโปรไฟล์" />
                {strength < 100 && <p className="muted small" style={{ margin: '.6rem 0 0' }}>เพิ่มการศึกษา เรซูเม่ และทักษะอย่างน้อย 4 อย่าง เพื่อให้ระบบจับคู่งานได้แม่นขึ้น <Link to="/graduate/dashboard?tab=profile" style={{ color: 'var(--brand)', fontWeight: 500 }}>แก้ไขโปรไฟล์</Link></p>}
              </div>
              <div className="card">
                <h3>งานที่ตรงกับคุณที่สุด</h3>
                {topMatches.length === 0 ? <p className="muted">เลือกทักษะในโปรไฟล์ แล้วระบบจะแนะนำงานที่เหมาะกับคุณที่นี่</p> : topMatches.map(({ j, p }) => (
                  <div key={j.id} style={{ marginBottom: '1rem' }}>
                    <Link to={`/jobs/${j.id}`}><b>{j.title}</b></Link> <span className="muted small">· {catalog.companyMap[j.company_id]?.name}</span>
                    <SkillMatchBar percent={p} label="Match" />
                  </div>
                ))}
              </div>
            </div>
          )}
          {tab === 'profile' && (catalog.loading ? <LoadingSpinner /> : (
            <GraduateProfileForm key={profile.id} profile={profile} categories={catalog.categories} skills={catalog.skills} onSaved={refreshProfile} />
          ))}
          {tab === 'applications' && (
            <div className="stack">
              <h2>ใบสมัครของฉัน</h2>
              {appsLoading ? <LoadingSpinner /> : appsError ? <ErrorState error={appsError} onRetry={loadApps} /> : apps.length === 0 ? (
                <EmptyState emoji="📭" title="ยังไม่มีใบสมัคร" text="เริ่มค้นหางานที่ตรงกับทักษะของคุณได้เลย" action={<Link to="/jobs" className="btn btn-primary">ดูตำแหน่งงาน</Link>} />
              ) : apps.map((a) => (
                <ApplicationCard key={a.id} application={a} job={jobById[a.job_id]} company={catalog.companyMap[jobById[a.job_id]?.company_id]} onWithdraw={setToWithdraw} />
              ))}
            </div>
          )}
          {tab === 'favorites' && (
            <div className="stack">
              <h2>รายการโปรด</h2>
              {favJobs.length === 0 && !catalog.loading ? (
                <EmptyState emoji="💔" title="ยังไม่มีรายการโปรด" text="กดหัวใจที่การ์ดงานเพื่อบันทึกไว้ดูภายหลัง" action={<Link to="/jobs" className="btn btn-primary">ดูตำแหน่งงาน</Link>} />
              ) : (
                <JobList jobs={favJobs} loading={catalog.loading} companyMap={catalog.companyMap} skillMap={catalog.skillMap}
                  mySkillIds={profile.skill_ids} favoriteIds={favoriteIds} onToggleFavorite={(id) => toggleFavorite(id).then(() => toast('เอาออกจากรายการโปรดแล้ว'))} />
              )}
            </div>
          )}
        </section>
      </div>
      {toWithdraw && <ConfirmModal danger title="ยกเลิกใบสมัคร" message="ต้องการยกเลิกใบสมัครนี้ใช่หรือไม่?" confirmText="ยกเลิกใบสมัคร" onConfirm={withdraw} onClose={() => setToWithdraw(null)} />}
    </main>
  )
}
