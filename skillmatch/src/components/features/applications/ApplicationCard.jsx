import { Link } from 'react-router-dom'
import Button from '../../common/Button'
import StatusBadge from '../../common/StatusBadge'
import CompanyAvatar from '../../common/CompanyAvatar'
import { formatDate } from '../../../data/helpers'

export default function ApplicationCard({ application, job, company, onWithdraw }) {
  return (
    <div className="card row between">
      <div className="row" style={{ flexWrap: 'nowrap' }}>
        <CompanyAvatar company={company} />
        <div>
          {job ? <Link to={`/jobs/${job.id}`}><b>{job.title}</b></Link> : <b>ตำแหน่งงานนี้ถูกลบแล้ว</b>}
          <div className="muted small">{company?.name} · สมัครเมื่อ {formatDate(application.applied_at)}</div>
        </div>
      </div>
      <div className="row">
        <StatusBadge status={application.status} />
        {application.status === 'pending' && onWithdraw && (
          <Button variant="danger" size="sm" onClick={() => onWithdraw(application)}>ยกเลิกใบสมัคร</Button>
        )}
      </div>
    </div>
  )
}
