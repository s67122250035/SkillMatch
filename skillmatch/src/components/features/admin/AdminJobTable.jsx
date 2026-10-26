import { Link } from 'react-router-dom'
import Button from '../../common/Button'
import { JobStatusBadge } from '../../common/StatusBadge'
import { formatDate } from '../../../data/helpers'

export default function AdminJobTable({ jobs, companyMap, onToggleStatus, onDelete }) {
  return (
    <div className="table-wrap">
      <table>
        <thead><tr><th>ตำแหน่ง</th><th>บริษัท</th><th>ประกาศเมื่อ</th><th>สถานะ</th><th /></tr></thead>
        <tbody>
          {jobs.map((j) => (
            <tr key={j.id}>
              <td><Link to={`/jobs/${j.id}`}><b>{j.title}</b></Link></td>
              <td className="muted">{companyMap[j.company_id]?.name || '-'}</td>
              <td>{formatDate(j.posted_at)}</td>
              <td><JobStatusBadge status={j.status} /></td>
              <td style={{ textAlign: 'right' }}>
                <div className="row" style={{ justifyContent: 'flex-end' }}>
                  <Button size="sm" variant="ghost" onClick={() => onToggleStatus(j)}>{j.status === 'open' ? 'ปิดรับ' : 'เปิดรับ'}</Button>
                  <Button size="sm" variant="danger" onClick={() => onDelete(j)}>ลบ</Button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
