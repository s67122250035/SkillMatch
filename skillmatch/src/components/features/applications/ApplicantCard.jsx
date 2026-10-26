import Button from '../../common/Button'
import SkillTag from '../../common/SkillTag'
import StatusBadge from '../../common/StatusBadge'
import SkillMatchBar from '../jobs/SkillMatchBar'
import { colorFor, formatDate, initials, matchPercent } from '../../../data/helpers'

export default function ApplicantCard({ application, applicant, job, skillMap, onChangeStatus }) {
  const skills = applicant?.skill_ids || []
  const required = new Set(job?.required_skill_ids || [])
  return (
    <div className="card stack">
      <div className="row between">
        <div className="row" style={{ flexWrap: 'nowrap' }}>
          <span className="avatar" style={{ background: colorFor(application.user_id) }}>{initials(applicant?.name)}</span>
          <div>
            <b>{applicant?.name || 'ไม่พบข้อมูลผู้สมัคร'}</b>
            <div className="muted small">{applicant?.education || '-'}</div>
          </div>
        </div>
        <StatusBadge status={application.status} />
      </div>
      <SkillMatchBar percent={matchPercent(job?.required_skill_ids, skills)} label="ทักษะตรงกับตำแหน่ง" />
      <div className="tags">
        {skills.map((id) => skillMap[id] && <SkillTag key={id} name={skillMap[id].name} hit={required.has(id)} />)}
        {!skills.length && <span className="muted small">ยังไม่ได้ระบุทักษะ</span>}
      </div>
      <div className="row between">
        <span className="muted small">สมัครเมื่อ {formatDate(application.applied_at)}</span>
        <div className="row">
          {applicant?.resume_url && <a className="btn btn-ghost btn-sm" href={applicant.resume_url} target="_blank" rel="noreferrer">ดูเรซูเม่ ↗</a>}
          {application.status !== 'accepted' && <Button variant="ok" size="sm" onClick={() => onChangeStatus(application, 'accepted')}>ผ่าน</Button>}
          {application.status !== 'rejected' && <Button variant="danger" size="sm" onClick={() => onChangeStatus(application, 'rejected')}>ไม่ผ่าน</Button>}
        </div>
      </div>
    </div>
  )
}
