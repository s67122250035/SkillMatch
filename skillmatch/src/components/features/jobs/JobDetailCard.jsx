import { Link } from 'react-router-dom'
import SkillTag from '../../common/SkillTag'
import CompanyAvatar from '../../common/CompanyAvatar'
import CoverImage, { GeneratedCover } from '../../common/CoverArt'
import { JobStatusBadge } from '../../common/StatusBadge'
import {
  JOB_TYPES, WORK_MODES, categoryLabel, deadlineInfo, formatDate, formatSalary, primaryCategoryId, themeFor,
} from '../../../data/helpers'

export default function JobDetailCard({ job, company, skillMap, categoryMap = {}, mySkillIds }) {
  const mine = new Set(mySkillIds || [])
  const catId = primaryCategoryId(job, skillMap)
  const theme = themeFor(catId)
  const mode = WORK_MODES[job.work_mode]
  const dl = deadlineInfo(job)
  const cover = (
    <GeneratedCover grad={theme.grad} icon={theme.icon} seed={job.id} height={190} radius="var(--radius) var(--radius) 0 0">
      <span className="cover-badges">
        <Link to={`/jobs?category=${catId}`} className="pill">{theme.icon} {categoryLabel(categoryMap[catId]) || theme.th}</Link>
      </span>
    </GeneratedCover>
  )
  return (
    <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
      <CoverImage url={job.image_url} fallback={cover} />
      <div style={{ padding: '1.25rem' }}>
        <div className="row" style={{ marginTop: '-2.8rem', position: 'relative' }}>
          <div className="logo-pop big"><CompanyAvatar company={company} size={68} radius={20} /></div>
        </div>
        <div className="row between" style={{ marginTop: '.75rem' }}>
          <div>
            <h1 className="page-title" style={{ marginBottom: '.2rem' }}>{job.title}</h1>
            <p className="muted">
              {company ? <Link to={`/companies/${company.id}`} className="link">{company.name}</Link> : 'ไม่ระบุบริษัท'}
              {company?.verified && ' ✔ ยืนยันแล้ว'}{company?.address && ` · ${company.address}`}
            </p>
          </div>
          <JobStatusBadge status={job.status} />
        </div>

        <div className="info-grid">
          <div><span>ประเภทงาน</span><b>{JOB_TYPES[job.type] || job.type}</b></div>
          <div><span>สถานที่</span><b>📍 {job.location}</b></div>
          {mode && <div><span>รูปแบบการทำงาน</span><b>{mode.icon} {mode.label}</b></div>}
          <div><span>เงินเดือน</span><b>💰 {formatSalary(job.salary_min, job.salary_max)}</b></div>
          {job.openings > 0 && <div><span>จำนวนที่รับ</span><b>👥 {job.openings} อัตรา</b></div>}
          <div><span>ประกาศเมื่อ</span><b>{formatDate(job.posted_at)}</b></div>
        </div>
        {dl && <div className={`alert ${dl.tone === 'warn' ? 'alert-warn' : ''}`} style={dl.tone === 'warn' ? undefined : { background: 'var(--chip)', color: 'var(--muted)' }}>🗓 {dl.text}</div>}

        <h3>รายละเอียดงาน</h3>
        <p style={{ whiteSpace: 'pre-line' }}>{job.description}</p>

        {job.responsibilities?.length > 0 && (
          <>
            <h3 style={{ marginTop: '1.25rem' }}>สิ่งที่คุณจะได้ทำ</h3>
            <ul className="check-list">{job.responsibilities.map((r) => <li key={r}>{r}</li>)}</ul>
          </>
        )}

        <h3 style={{ marginTop: '1.25rem' }}>ทักษะที่ต้องการ</h3>
        <div className="tags">
          {(job.required_skill_ids || []).map((id) => skillMap[id] && <SkillTag key={id} name={skillMap[id].name} hit={mine.has(id)} />)}
        </div>

        {(job.benefits?.length > 0 || company?.perks?.length > 0) && (
          <>
            <h3 style={{ marginTop: '1.25rem' }}>สวัสดิการและสิ่งที่ได้รับ</h3>
            <div className="perk-grid">
              {[...(job.benefits || []), ...(company?.perks || [])].map((b) => <div key={b} className="perk">🎁 {b}</div>)}
            </div>
          </>
        )}

        {company && (
          <div className="company-strip">
            <CompanyAvatar company={company} size={52} />
            <div style={{ flex: 1, minWidth: 0 }}>
              <b>{company.name}</b>
              <div className="muted small">{[company.industry, company.size].filter(Boolean).join(' · ')}</div>
              {company.description && <p className="muted small" style={{ margin: '.3rem 0 0' }}>{company.description}</p>}
            </div>
            <Link to={`/companies/${company.id}`} className="btn btn-ghost btn-sm">ดูโปรไฟล์บริษัท</Link>
          </div>
        )}
      </div>
    </div>
  )
}
