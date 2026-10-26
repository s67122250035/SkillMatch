import Button from '../../common/Button'
import { formatDate } from '../../../data/helpers'

export default function AdminUserTable({ rows, kind, onToggle }) {
  return (
    <div className="table-wrap">
      <table>
        <thead><tr><th>ชื่อ</th><th>อีเมล</th><th>สร้างเมื่อ</th><th>สถานะ</th><th /></tr></thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r.id}>
              <td><b>{r.name}</b></td>
              <td className="muted">{r.email}</td>
              <td>{formatDate(r.created_at)}</td>
              <td>{r.suspended ? <span className="badge badge-bad">ถูกระงับ</span> : <span className="badge badge-ok">ปกติ</span>}</td>
              <td style={{ textAlign: 'right' }}>
                <Button size="sm" variant={r.suspended ? 'ok' : 'danger'} onClick={() => onToggle(kind, r)}>
                  {r.suspended ? 'ปลดระงับ' : 'ระงับบัญชี'}
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
