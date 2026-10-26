import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import JobDetailCard from '../components/features/jobs/JobDetailCard'
import SkillMatchBar from '../components/features/jobs/SkillMatchBar'
import JobCard from '../components/features/jobs/JobCard'
import ApplyButton from '../components/features/applications/ApplyButton'
import Button from '../components/common/Button'
import SkillTag from '../components/common/SkillTag'
import EmptyState, { ErrorState } from '../components/common/EmptyState'
import LoadingSpinner from '../components/common/LoadingSpinner'
import { useFetchJobs } from '../hooks/useFetchJobs'
import { useAuth } from '../hooks/useAuth'
import { useFavorites } from '../hooks/useFavorites'
import { useToast } from '../hooks/useToast'
import { getAllApplications } from '../services/firebaseService'
import { matchPercent } from '../data/helpers'

export default function JobDetailPage() {
  const { jobId } = useParams()
  const { jobs, companyMap, skillMap, categoryMap, loading, error, reload } = useFetchJobs()
  const { profile } = useAuth()
  const isGrad = profile?.role === 'graduate'
  const mySkills = isGrad ? profile.skill_ids || [] : []
  const { favoriteIds, toggleFavorite } = useFavorites(isGrad ? profile.id : null)
  const toast = useToast()
  const [applied, setApplied] = useState(false)

  useEffect(() => {
    if (!isGrad) { setApplied(false); return }
    getAllApplications()
      .then((apps) => setApplied(apps.some((a) => a.user_id === profile.id && a.job_id === jobId)))
      .catch(() => {})
  }, [isGrad, profile, jobId])

  if (loading) return <main className="page container"><LoadingSpinner /></main>
  if (error) return <main className="page container"><ErrorState error={error} onRetry={reload} /></main>
  const job = jobs.find((j) => j.id === jobId)
  if (!job) {
    return (
      <main className="page container">
        <EmptyState emoji="🧭" title="ไม่พบตำแหน่งงานนี้" text="ตำแหน่งงานอาจถูกลบหรือปิดไปแล้ว" action={<Link to="/jobs" className="btn btn-primary">กลับไปหน้ารายการงาน</Link>} />
      </main>
    )
  }

  const company = companyMap[job.company_id]
  const percent = matchPercent(job.required_skill_ids, mySkills)
  const missing = (job.required_skill_ids || []).filter((id) => !mySkills.includes(id))
  const isFav = favoriteIds.includes(job.id)
  const related = jobs
    .filter((j) => j.id !== job.id && j.status === 'open' && (j.required_skill_ids || []).some((s) => (job.required_skill_ids || []).includes(s)))
    .slice(0, 3)

  const onFav = async () => {
    try { toast((await toggleFavorite(job.id)) ? 'บันทึกเป็นรายการโปรดแล้ว' : 'เอาออกจากรายการโปรดแล้ว') }
    catch { toast('บันทึกไม่สำเร็จ', 'bad') }
  }

  return (
    <main className="page container">
      <div className="breadcrumb"><Link to="/">หน้าแรก</Link> / <Link to="/jobs">ตำแหน่งงาน</Link> / {job.title}</div>
      <div className="detail-grid">
        <JobDetailCard job={job} company={company} skillMap={skillMap} categoryMap={categoryMap} mySkillIds={mySkills} />
        <div className="stack" style={{ position: 'sticky', top: 88 }}>
          <div className="card stack">
            {isGrad ? (
              mySkills.length ? (
                <>
                  <SkillMatchBar percent={percent} />
                  {missing.length > 0 ? (
                    <div>
                      <div className="small muted" style={{ marginBottom: '.4rem' }}>ทักษะที่คุณยังขาด</div>
                      <div className="tags">{missing.map((id) => skillMap[id] && <SkillTag key={id} name={skillMap[id].name} />)}</div>
                    </div>
                  ) : <p className="badge badge-ok">🎉 คุณมีทักษะครบทุกข้อ</p>}
                </>
              ) : (
                <div className="alert alert-warn" style={{ margin: 0 }}>
                  เพิ่มทักษะในโปรไฟล์เพื่อดู % ความเหมาะสม <Link to="/graduate/dashboard?tab=profile" style={{ textDecoration: 'underline' }}>ไปที่โปรไฟล์</Link>
                </div>
              )
            ) : (
              <p className="muted small" style={{ margin: 0 }}>🔒 เข้าสู่ระบบด้วยบัญชีบัณฑิตเพื่อดู % ความเหมาะสมกับทักษะของคุณ</p>
            )}
            <ApplyButton job={job} alreadyApplied={applied} onApplied={() => setApplied(true)} />
            <Button variant="ghost" block onClick={() => { navigator.clipboard?.writeText(window.location.href); toast('คัดลอกลิงก์แล้ว') }}>🔗 คัดลอกลิงก์ตำแหน่งนี้</Button>
            {isGrad && <Button variant="ghost" block onClick={onFav}>{isFav ? '♥ บันทึกแล้ว' : '♡ บันทึกเป็นรายการโปรด'}</Button>}
          </div>
        </div>
      </div>

      {related.length > 0 && (
        <section className="section">
          <div className="section-head"><h2>ตำแหน่งที่เกี่ยวข้อง</h2></div>
          <div className="grid grid-3">
            {related.map((j) => <JobCard key={j.id} job={j} company={companyMap[j.company_id]} skillMap={skillMap} categoryMap={categoryMap} mySkillIds={mySkills} />)}
          </div>
        </section>
      )}
    </main>
  )
}
