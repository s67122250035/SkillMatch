import { APP_STATUS } from '../../data/helpers'

export default function StatusBadge({ status }) {
  const s = APP_STATUS[status] || { label: status, tone: 'gray' }
  return <span className={`badge badge-${s.tone}`}>{s.label}</span>
}

export function JobStatusBadge({ status }) {
  return status === 'open'
    ? <span className="badge badge-ok">เปิดรับสมัคร</span>
    : <span className="badge badge-gray">ปิดรับสมัคร</span>
}
