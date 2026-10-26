import { useCallback, useEffect, useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import DashboardSidebar from '../components/layout/DashboardSidebar'
import CompanyProfileForm from '../components/features/profile/CompanyProfileForm'
import ApplicantCard from '../components/features/applications/ApplicantCard'
import Button from '../components/common/Button'
import InputField from '../components/common/InputField'
import SkillTag from '../components/common/SkillTag'
import ConfirmModal from '../components/common/ConfirmModal'
import { JobStatusBadge } from '../components/common/StatusBadge'
import EmptyState, { ErrorState } from '../components/common/EmptyState'
import LoadingSpinner from '../components/common/LoadingSpinner'
import StatCard from '../components/features/admin/StatCard'
import { useAuth } from '../hooks/useAuth'
import { useFetchJobs } from '../hooks/useFetchJobs'
import { useToast } from '../hooks/useToast'
import {
  createJob, updateJob, deleteJob, getAllApplications, getAllUsers, setApplicationStatus,
} from '../services/firebaseService'
import { JOB_TYPES, LOCATIONS, WORK_MODES, formatDate, formatSalary, friendlyError, linesToArray } from '../data/helpers'

const ITEMS = [
  { key: 'overview', icon: '📊', label: 'ภาพรวม' },
  { key: 'jobs', icon: '🗂️', label: 'จัดการประกาศงาน' },
  { key: 'post', icon: '➕', label: 'ประกาศงานใหม่' },
  { key: 'applicants', icon: '🧑‍💼', label: 'ผู้สมัคร' },
  { key: 'profile', icon: '🏢', label: 'ข้อมูลบริษัท' },
]
const BLANK = { title: '', type: 'internship', work_mode: 'hybrid', openings: 1, deadline: '', image_url: '', location: 'Bangkok', salary_min: '', salary_max: '', description: '', responsibilities: '', benefits: '', required_skill_ids: [] }

function JobForm({ initial, categories, skills, companyId, onDone }) {
  const toast = useToast()
  const [form, setForm] = useState(initial ? { ...BLANK, ...initial, responsibilities: (initial.responsibilities || []).join('\n'), benefits: (initial.benefits || []).join('\n') } : BLANK)
  const [errors, setErrors] = useState({})
  const [busy, setBusy] = useState(false)
  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value })
  const toggle = (id) => setForm((f) => ({ ...f, required_skill_ids: f.required_skill_ids.includes(id) ? f.required_skill_ids.filter((x) => x !== id) : [...f.required_skill_ids, id] }))

  const submit = async (e) => {
    e.preventDefault()
    const er = {}
    const min = form.salary_min === '' ? null : Number(form.salary_min)
    const max = form.salary_max === '' ? null : Number(form.salary_max)
    if (!form.title.trim()) er.title = 'กรุณากรอกชื่อตำแหน่ง'
    if (form.description.trim().length < 10) er.description = 'อธิบายรายละเอียดงานอย่างน้อย 10 ตัวอักษร'
    if (!form.required_skill_ids.length) er.skills = 'เลือกทักษะที่ต้องการอย่างน้อย 1 ทักษะ'
    if ((min !== null && (isNaN(min) || min < 0)) || (max !== null && (isNaN(max) || max < 0))) er.salary = 'เงินเดือนต้องเป็นตัวเลขที่ไม่ติดลบ'
    else if (min !== null && max !== null && min > max) er.salary = 'เงินเดือนต่ำสุดต้องไม่มากกว่าสูงสุด'
    setErrors(er)
    if (Object.keys(er).length) return
    const payload = {
      company_id: companyId, title: form.title.trim(), type: form.type, location: form.location,
      description: form.description.trim(), required_skill_ids: form.required_skill_ids,
      salary_min: min ?? 0, salary_max: max ?? 0,
      work_mode: form.work_mode, openings: Math.max(1, Number(form.openings) || 1), deadline: form.deadline || '', image_url: form.image_url.trim(),
      responsibilities: linesToArray(form.responsibilities), benefits: linesToArray(form.benefits),
    }
    setBusy(true)
    try {
      if (initial?.id) await updateJob(initial.id, payload)
      else await createJob(payload)
      toast(initial?.id ? 'แก้ไขประกาศงานแล้ว' : 'ประกาศงานเรียบร้อยแล้ว 🎉')
      onDone()
    } catch (err) { toast(friendlyError(err), 'bad') } finally { setBusy(false) }
  }

  return (
    <form className="card" onSubmit={submit} noValidate>
      <h3>{initial?.id ? 'แก้ไขประกาศงาน' : 'ประกาศตำแหน่งงานใหม่'}</h3>
      <InputField label="ชื่อตำแหน่ง" value={form.title} onChange={set('title')} error={errors.title} placeholder="เช่น Frontend Developer Intern" />
      <div className="grid grid-2" style={{ gap: '0 1rem' }}>
        <InputField as="select" label="ประเภทงาน" value={form.type} onChange={set('type')}>
          {Object.entries(JOB_TYPES).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
        </InputField>
        <InputField as="select" label="สถานที่" value={form.location} onChange={set('location')}>
          {[...new Set([...LOCATIONS, form.location])].map((l) => <option key={l}>{l}</option>)}
        </InputField>
        <InputField as="select" label="รูปแบบการทำงาน" value={form.work_mode} onChange={set('work_mode')}>
          {Object.entries(WORK_MODES).map(([k, v]) => <option key={k} value={k}>{v.icon} {v.label}</option>)}
        </InputField>
        <InputField label="จำนวนที่รับ (อัตรา)" type="number" min="1" value={form.openings} onChange={set('openings')} />
        <InputField label="วันปิดรับสมัคร" type="date" value={form.deadline} onChange={set('deadline')} hint="เว้นว่างได้" />
        <InputField label="เงินเดือนต่ำสุด (บาท)" type="number" min="0" value={form.salary_min} onChange={set('salary_min')} />
        <InputField label="เงินเดือนสูงสุด (บาท)" type="number" min="0" value={form.salary_max} onChange={set('salary_max')} error={errors.salary} />
      </div>
      <InputField as="textarea" rows={5} label="รายละเอียดงาน" value={form.description} onChange={set('description')} error={errors.description} />
      <InputField as="textarea" rows={4} label="สิ่งที่ผู้สมัครจะได้ทำ (บรรทัดละ 1 ข้อ)" value={form.responsibilities} onChange={set('responsibilities')} />
      <InputField as="textarea" rows={3} label="สวัสดิการของตำแหน่งนี้ (บรรทัดละ 1 ข้อ)" value={form.benefits} onChange={set('benefits')} />
      <InputField label="ลิงก์รูปปกงาน (URL รูปภาพ — ไม่บังคับ)" type="url" value={form.image_url} onChange={set('image_url')} hint="เว้นว่างได้ ระบบจะสร้างภาพปกตามหมวดหมู่ให้อัตโนมัติ" />
      <div className="field">
        <label>ทักษะที่ต้องการ ({form.required_skill_ids.length})</label>
        {categories.map((c) => (
          <div key={c.id} style={{ marginBottom: '.6rem' }}>
            <div className="small muted" style={{ marginBottom: '.3rem' }}>{c.name}</div>
            <div className="tags">
              {skills.filter((s) => s.category_id === c.id).map((s) => (
                <SkillTag key={s.id} name={s.name} active={form.required_skill_ids.includes(s.id)} onClick={() => toggle(s.id)} />
              ))}
            </div>
          </div>
        ))}
        {errors.skills && <span className="err">{errors.skills}</span>}
      </div>
      <div className="row">
        <Button type="submit" disabled={busy}>{busy ? 'กำลังบันทึก...' : initial?.id ? 'บันทึกการแก้ไข' : 'ประกาศงาน'}</Button>
        {initial?.id && <Button type="button" variant="ghost" onClick={onDone}>ยกเลิก</Button>}
      </div>
    </form>
  )
}

export default function CompanyDashboardPage() {
  const [params] = useSearchParams()
  const navigate = useNavigate()
  const tab = params.get('tab') || 'overview'
  const { profile, refreshProfile } = useAuth()
  const catalog = useFetchJobs()
  const toast = useToast()
  const [apps, setApps] = useState([])
  const [users, setUsers] = useState({})
  const [appsLoading, setAppsLoading] = useState(true)
  const [appsError, setAppsError] = useState(null)
  const [editing, setEditing] = useState(null)
  const [toDelete, setToDelete] = useState(null)
  const [selectedJob, setSelectedJob] = useState('')

  const myJobs = catalog.jobs.filter((j) => j.company_id === profile.id).sort((a, b) => (b.posted_at || '').localeCompare(a.posted_at || ''))
  const myJobIds = new Set(myJobs.map((j) => j.id))
  const myApps = apps.filter((a) => myJobIds.has(a.job_id))

  const loadApps = useCallback(async () => {
    setAppsLoading(true); setAppsError(null)
    try {
      const [a, u] = await Promise.all([getAllApplications(), getAllUsers()])
      setApps(a); setUsers(Object.fromEntries(u.map((x) => [x.id, x])))
    } catch (e) { setAppsError(e) } finally { setAppsLoading(false) }
  }, [])
  useEffect(() => { loadApps() }, [loadApps])

  const done = () => { setEditing(null); catalog.reload(); navigate('/company/dashboard?tab=jobs') }
  const changeStatus = async (app, status) => {
    try { await setApplicationStatus(app.id, status); toast('อัปเดตสถานะแล้ว'); loadApps() }
    catch (e) { toast(friendlyError(e), 'bad') }
  }
  const toggleOpen = async (job) => {
    try { await updateJob(job.id, { status: job.status === 'open' ? 'closed' : 'open' }); catalog.reload() }
    catch (e) { toast(friendlyError(e), 'bad') }
  }
  const remove = async () => {
    try { await deleteJob(toDelete.id); toast('ลบประกาศงานแล้ว'); catalog.reload(); loadApps() }
    catch (e) { toast(friendlyError(e), 'bad') }
  }

  useEffect(() => { if (tab !== 'post') setEditing(null) }, [tab])

  const shownJob = selectedJob || myJobs[0]?.id || ''
  const shownApps = myApps.filter((a) => a.job_id === shownJob)

  return (
    <main className="page container">
      <h1 className="page-title">แดชบอร์ดบริษัท · {profile.name}</h1>
      {!profile.verified && <div className="alert alert-warn">บัญชีของคุณยังรอการตรวจสอบจากผู้ดูแลระบบ แต่สามารถประกาศงานได้ตามปกติ</div>}
      <div className="dash">
        <DashboardSidebar items={ITEMS} base="/company/dashboard" />
        <section>
          {catalog.error && <ErrorState error={catalog.error} onRetry={catalog.reload} />}
          {tab === 'overview' && (
            <div className="stack">
              <div className="grid grid-2">
                <StatCard icon="🗂️" label="ประกาศงานทั้งหมด" value={myJobs.length} />
                <StatCard icon="🟢" label="กำลังเปิดรับ" value={myJobs.filter((j) => j.status === 'open').length} color="#10b981" />
                <StatCard icon="📨" label="ใบสมัครทั้งหมด" value={myApps.length} color="#0ea5e9" />
                <StatCard icon="⏳" label="รอตรวจสอบ" value={myApps.filter((a) => a.status === 'pending').length} color="#f59e0b" />
              </div>
              <Link to="/company/dashboard?tab=post" className="btn btn-primary">➕ ประกาศงานใหม่</Link>
            </div>
          )}
          {tab === 'profile' && <CompanyProfileForm key={profile.id} profile={profile} onSaved={refreshProfile} />}
          {tab === 'post' && <JobForm key={editing?.id || 'new'} initial={editing} categories={catalog.categories} skills={catalog.skills} companyId={profile.id} onDone={done} />}
          {tab === 'jobs' && (
            <div className="stack">
              <div className="row between"><h2 style={{ margin: 0 }}>ประกาศงานของฉัน</h2><Link to="/company/dashboard?tab=post" className="btn btn-primary btn-sm" onClick={() => setEditing(null)}>➕ ประกาศใหม่</Link></div>
              {catalog.loading ? <LoadingSpinner /> : myJobs.length === 0 ? (
                <EmptyState emoji="📝" title="ยังไม่มีประกาศงาน" text="เริ่มประกาศตำแหน่งแรกของคุณ" />
              ) : myJobs.map((j) => (
                <div key={j.id} className="card row between">
                  <div>
                    <Link to={`/jobs/${j.id}`}><b>{j.title}</b></Link>
                    <div className="muted small">{JOB_TYPES[j.type]} · {j.location} · {formatSalary(j.salary_min, j.salary_max)} · {formatDate(j.posted_at)}</div>
                    <div className="muted small">ผู้สมัคร {myApps.filter((a) => a.job_id === j.id).length} คน</div>
                  </div>
                  <div className="row">
                    <JobStatusBadge status={j.status} />
                    <Button size="sm" variant="ghost" onClick={() => { setEditing(j); navigate('/company/dashboard?tab=post') }}>แก้ไข</Button>
                    <Button size="sm" variant="ghost" onClick={() => toggleOpen(j)}>{j.status === 'open' ? 'ปิดรับ' : 'เปิดรับ'}</Button>
                    <Button size="sm" variant="danger" onClick={() => setToDelete(j)}>ลบ</Button>
                  </div>
                </div>
              ))}
            </div>
          )}
          {tab === 'applicants' && (
            <div className="stack">
              <h2>ผู้สมัคร</h2>
              {myJobs.length === 0 ? <EmptyState emoji="🧑‍💼" title="ยังไม่มีประกาศงาน" text="ประกาศงานก่อนจึงจะมีผู้สมัคร" /> : (
                <>
                  <InputField as="select" label="เลือกตำแหน่งงาน" value={shownJob} onChange={(e) => setSelectedJob(e.target.value)}>
                    {myJobs.map((j) => <option key={j.id} value={j.id}>{j.title}</option>)}
                  </InputField>
                  {appsLoading ? <LoadingSpinner /> : appsError ? <ErrorState error={appsError} onRetry={loadApps} /> : shownApps.length === 0 ? (
                    <EmptyState emoji="📭" title="ยังไม่มีผู้สมัครตำแหน่งนี้" />
                  ) : shownApps.map((a) => (
                    <ApplicantCard key={a.id} application={a} applicant={users[a.user_id]} job={myJobs.find((j) => j.id === shownJob)} skillMap={catalog.skillMap} onChangeStatus={changeStatus} />
                  ))}
                </>
              )}
            </div>
          )}
        </section>
      </div>
      {toDelete && <ConfirmModal danger title="ลบประกาศงาน" message={`ลบ “${toDelete.title}” และใบสมัครที่เกี่ยวข้องทั้งหมด? การกระทำนี้ย้อนกลับไม่ได้`} confirmText="ลบ" onConfirm={remove} onClose={() => setToDelete(null)} />}
    </main>
  )
}
