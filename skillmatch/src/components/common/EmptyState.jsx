export default function EmptyState({ emoji = '🔎', title = 'ไม่พบข้อมูล', text, action }) {
  return (
    <div className="state">
      <span className="emoji">{emoji}</span>
      <h3>{title}</h3>
      {text && <p>{text}</p>}
      {action}
    </div>
  )
}

export function ErrorState({ error, onRetry }) {
  return (
    <div className="state">
      <span className="emoji">⚠️</span>
      <h3>เกิดข้อผิดพลาดในการโหลดข้อมูล</h3>
      <p>{error?.message || 'กรุณาตรวจสอบการเชื่อมต่อและค่า Firebase ในไฟล์ .env'}</p>
      {onRetry && <button className="btn btn-primary" onClick={onRetry}>ลองใหม่อีกครั้ง</button>}
    </div>
  )
}
