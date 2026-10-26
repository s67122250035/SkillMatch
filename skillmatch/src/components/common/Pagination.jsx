export default function Pagination({ page, totalPages, onChange }) {
  if (totalPages <= 1) return null
  return (
    <nav className="pagination" aria-label="เปลี่ยนหน้า">
      <button disabled={page === 1} onClick={() => onChange(page - 1)}>‹</button>
      {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => (
        <button key={n} className={n === page ? 'on' : ''} onClick={() => onChange(n)}>{n}</button>
      ))}
      <button disabled={page === totalPages} onClick={() => onChange(page + 1)}>›</button>
    </nav>
  )
}
