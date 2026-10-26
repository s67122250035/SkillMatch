import { Link } from 'react-router-dom'
import SkillTag from '../../common/SkillTag'
import CompanyAvatar from '../../common/CompanyAvatar'
import CoverImage, { GeneratedCover } from '../../common/CoverArt'
import SkillMatchBar from './SkillMatchBar'
import {
  JOB_TYPES, WORK_MODES, categoryLabel, formatSalary, isNewJob, matchPercent, primaryCategoryId, themeFor, deadlineInfo,
} from '../../../data/helpers'

export default function JobCard({ job, company, skillMap, categoryMap = {}, mySkillIds, isFavorite, onToggleFavorite, layout = 'grid' }) {
  const mine = new Set(mySkillIds || [])
  const showMatch = mySkillIds && mySkillIds.length > 0
  const catId = primaryCategoryId(job, skillMap)
  const theme = themeFor(catId)
  const mode = WORK_MODES[job.work_mode]
  const dl = deadlineInfo(job)
  const closed = job.status !== 'open'

  const cover = (
    <GeneratedCover grad={theme.grad} icon={theme.icon} seed={job.id} height={layout === 'list' ? '100%' : 118}>
      <span className="cover-badges">
        <span className="pill">{theme.icon} {categoryLabel(categoryMap[catId]) || theme.th}</span>
        {isNewJob(job) && <span className="pill pill-new">ใหม่</span>}
      </span>
    </GeneratedCover>
  )

  return (
    <article className={`card card-hover job-card ${layout === 'list' ? 'list' : ''} ${closed ? 'is-closed' : ''}`}>
      <Link to={`/jobs/${job.id}`} className="job-cover-link" tabIndex={-1} aria-hidden="true">
        <CoverImage url={job.image_url} fallback={cover} />
      </Link>
      {onToggleFavorite && (
        <button
          className={`fav-btn fav-float ${isFavorite ? 'on' : ''}`}
          onClick={() => onToggleFavorite(job.id)}
          aria-label={isFavorite ? 'เอาออกจากรายการโปรด' : 'บันทึกเป็นรายการโปรด'}
          title="รายการโปรด"
        >{isFavorite ? '♥' : '♡'}</button>
      )}
      <div className="job-body">
        <div className="row" style={{ flexWrap: 'nowrap', alignItems: 'flex-start' }}>
          <Link to={company ? `/companies/${company.id}` : '#'} className="logo-pop"><CompanyAvatar company={company} size={42} /></Link>
          <div style={{ minWidth: 0 }}>
            <h3><Link to={`/jobs/${job.id}`}>{job.title}</Link></h3>
            <span className="muted small">{company?.name || 'ไม่ระบุบริษัท'}{company?.verified && ' ✔'}</span>
          </div>
        </div>

        <div className="job-meta">
          <span>📍 {job.location}</span>
          {mode && <span>{mode.icon} {mode.label}</span>}
          <span>💰 {formatSalary(job.salary_min, job.salary_max)}</span>
        </div>

        <div className="tags">
          {(job.required_skill_ids || []).slice(0, 4).map((id) =>
            skillMap[id] && <SkillTag key={id} name={skillMap[id].name} hit={mine.has(id)} />
          )}
          {(job.required_skill_ids || []).length > 4 && <span className="tag">+{job.required_skill_ids.length - 4}</span>}
        </div>

        {showMatch && <SkillMatchBar percent={matchPercent(job.required_skill_ids, mySkillIds)} label="ตรงกับทักษะของคุณ" />}

        <div className="foot">
          <div className="row" style={{ gap: '.4rem' }}>
            <span className="badge">{JOB_TYPES[job.type] || job.type}</span>
            {closed ? <span className="badge badge-gray">ปิดรับสมัคร</span>
              : dl?.tone === 'warn' ? <span className="badge badge-warn">⏰ {dl.text}</span> : null}
          </div>
          <Link to={`/jobs/${job.id}`} className="btn btn-ghost btn-sm">ดูรายละเอียด</Link>
        </div>
      </div>
    </article>
  )
}
