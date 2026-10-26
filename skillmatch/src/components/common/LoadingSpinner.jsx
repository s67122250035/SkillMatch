export default function LoadingSpinner({ text = 'กำลังโหลดข้อมูล...' }) {
  return (
    <div className="state" role="status">
      <div className="spinner" />
      {text}
    </div>
  )
}

export function CardSkeletons({ count = 6 }) {
  return (
    <div className="grid grid-3">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="skeleton" style={{ height: 210 }} />
      ))}
    </div>
  )
}
