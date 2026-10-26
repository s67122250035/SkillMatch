import { Link } from 'react-router-dom'
import EmptyState from '../components/common/EmptyState'

export default function NotFoundPage() {
  return (
    <main className="page container">
      <EmptyState emoji="🧭" title="ไม่พบหน้าที่คุณต้องการ (404)" text="ลิงก์อาจไม่ถูกต้อง หรือหน้านี้ถูกย้ายไปแล้ว" action={<Link to="/" className="btn btn-primary">กลับหน้าแรก</Link>} />
    </main>
  )
}
