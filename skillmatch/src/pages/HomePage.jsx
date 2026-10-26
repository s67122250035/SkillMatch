import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import JobList from '../components/features/jobs/JobList'
import { ErrorState } from '../components/common/EmptyState'
import { useFetchJobs } from '../hooks/useFetchJobs'
import { useAuth } from '../hooks/useAuth'
import { useFavorites } from '../hooks/useFavorites'
import { useToast } from '../hooks/useToast'
import CompanyCard from '../components/features/companies/CompanyCard'
import { categoryLabel, matchPercent, primaryCategoryId, themeFor } from '../data/helpers'

export default function HomePage() {
  const { jobs, categories, skills, companies, skillMap, companyMap, categoryMap, loading, error, reload } = useFetchJobs()
  const { profile } = useAuth()
  const isGrad = profile?.role === 'graduate'
  const { favoriteIds, toggleFavorite } = useFavorites(isGrad ? profile.id : null)
  const toast = useToast()
  const navigate = useNavigate()
  const [q, setQ] = useState('')

  const open = jobs.filter((j) => j.status === 'open')
  const mySkills = isGrad ? profile.skill_ids || [] : []
  const featured = [...open]
    .sort((a, b) =>
      mySkills.length
        ? matchPercent(b.required_skill_ids, mySkills) - matchPercent(a.required_skill_ids, mySkills)
        : (b.posted_at || '').localeCompare(a.posted_at || '')
    )
    .slice(0, 6)

  const submit = (e) => {
    e.preventDefault()
    navigate(`/search?q=${encodeURIComponent(q.trim())}`)
  }
  const onFav = async (id) => {
    if (!isGrad) return toast('เข้าสู่ระบบด้วยบัญชีบัณฑิตเพื่อบันทึกรายการโปรด', 'bad')
    try { toast((await toggleFavorite(id)) ? 'บันทึกเป็นรายการโปรดแล้ว' : 'เอาออกจากรายการโปรดแล้ว') }
    catch { toast('บันทึกไม่สำเร็จ', 'bad') }
  }

  return (
    <>
      <section className="hero">
        <div className="container">
          <span className="hero-pill">✨ จับคู่ด้วยทักษะจริง ไม่ใช่แค่คำค้นหา</span>
          <h1>หางานและฝึกงานที่ “ใช่” สำหรับทักษะของคุณ</h1>
          <p>บอกเราว่าคุณเก่งอะไร แล้วดูทันทีว่าตำแหน่งไหนเหมาะกับคุณกี่เปอร์เซ็นต์</p>
          <form className="search-bar" onSubmit={submit}>
            <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="ค้นหาตำแหน่ง ทักษะ หรือบริษัท เช่น React, Designer" aria-label="ค้นหา" />
            <button className="btn btn-primary" type="submit">🔍 ค้นหา</button>
          </form>
          <div className="stats">
            <div><b>{loading ? '–' : open.length}</b>ตำแหน่งที่เปิดรับ</div>
            <div><b>{loading ? '–' : companies.length}</b>บริษัทพันธมิตร</div>
            <div><b>{loading ? '–' : skills.length}</b>ทักษะในระบบ</div>
          </div>
        </div>
      </section>

      <div className="container">
        {error ? <ErrorState error={error} onRetry={reload} /> : (
          <>
            <section className="section">
              <div className="section-head"><h2>เลือกตามหมวดทักษะ</h2></div>
              <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))' }}>
                {categories.map((c) => {
                  const t = themeFor(c.id)
                  const count = open.filter((j) => primaryCategoryId(j, skillMap) === c.id).length
                  return (
                    <button key={c.id} className="cat-card" onClick={() => navigate(`/jobs?category=${c.id}`)}>
                      <div className="cat-icon" style={{ background: `linear-gradient(135deg, ${t.grad[0]}, ${t.grad[1]})`, color: '#fff' }}>{t.icon}</div>
                      <b>{categoryLabel(c)}</b>
                      <div className="muted small">{c.name}</div>
                      <div className="badge" style={{ marginTop: '.6rem' }}>{count} ตำแหน่ง</div>
                    </button>
                  )
                })}
              </div>
            </section>

            <section className="section">
              <div className="section-head">
                <div>
                  <h2>{mySkills.length ? 'แนะนำสำหรับคุณ' : 'ตำแหน่งงานแนะนำ'}</h2>
                  <span className="muted small">{mySkills.length ? 'เรียงตามความตรงกับทักษะในโปรไฟล์ของคุณ' : 'ตำแหน่งล่าสุดที่เปิดรับ'}</span>
                </div>
                <Link to="/jobs" className="btn btn-ghost">ดูทั้งหมด →</Link>
              </div>
              <JobList
                jobs={featured} loading={loading} categoryMap={categoryMap} companyMap={companyMap} skillMap={skillMap}
                mySkillIds={mySkills} favoriteIds={favoriteIds} onToggleFavorite={onFav}
              />
            </section>

            <section className="section">
              <div className="section-head">
                <div><h2>บริษัทที่กำลังเปิดรับ</h2><span className="muted small">ดูบรรยากาศที่ทำงานและสวัสดิการก่อนสมัคร</span></div>
                <Link to="/companies" className="btn btn-ghost">ดูทั้งหมด →</Link>
              </div>
              <div className="grid grid-3">
                {companies.filter((c) => !c.suspended).slice(0, 3).map((c, i) => (
                  <CompanyCard key={c.id} company={c} index={i} openJobs={open.filter((j) => j.company_id === c.id).length} />
                ))}
              </div>
            </section>

            {!profile && (
              <section className="section">
                <div className="card" style={{ background: 'var(--grad)', color: '#fff', textAlign: 'center', padding: '2.5rem 1.5rem' }}>
                  <h2>พร้อมให้ระบบจับคู่งานให้คุณหรือยัง?</h2>
                  <p style={{ opacity: .9 }}>สมัครฟรี กรอกทักษะ 2 นาที แล้วดู % ความเหมาะสมกับทุกตำแหน่ง</p>
                  <Link to="/register" className="btn" style={{ background: '#fff', color: 'var(--brand)' }}>เริ่มต้นใช้งาน</Link>
                </div>
              </section>
            )}
          </>
        )}
      </div>
    </>
  )
}
