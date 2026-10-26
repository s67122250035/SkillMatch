export default function AboutPage() {
  const steps = [
    ['1', 'กรอกทักษะของคุณ', 'เลือกทักษะที่คุณมีจากหมวดหมู่ต่าง ๆ ในโปรไฟล์'],
    ['2', 'ระบบคำนวณ Match %', 'เปรียบเทียบทักษะของคุณกับทักษะที่แต่ละตำแหน่งต้องการ'],
    ['3', 'สมัครและติดตามผล', 'ส่งใบสมัครและติดตามสถานะได้จากแดชบอร์ด'],
  ]
  return (
    <main className="page container" style={{ maxWidth: 860 }}>
      <h1 className="page-title">เกี่ยวกับ SkillMatch</h1>
      <p className="muted">
        บัณฑิตจบใหม่มักหางานที่ตรงกับทักษะได้ยาก เพราะเว็บหางานทั่วไปเน้นการค้นด้วยคำค้นหา SkillMatch จึงจับคู่จาก “ทักษะจริง”
        แล้วแสดงเปอร์เซ็นต์ความเหมาะสม เพื่อให้บัณฑิตประหยัดเวลาคัดกรอง และบริษัทได้ผู้สมัครที่ตรงคุณสมบัติมากขึ้น
      </p>
      <div className="grid grid-3" style={{ marginTop: '1.5rem' }}>
        {steps.map(([n, t, d]) => (
          <div key={n} className="card">
            <div className="avatar" style={{ background: 'var(--grad)', marginBottom: '.75rem' }}>{n}</div>
            <h3>{t}</h3><p className="muted">{d}</p>
          </div>
        ))}
      </div>
      <div className="card" style={{ marginTop: '1.5rem' }}>
        <h3>เทคโนโลยีที่ใช้</h3>
        <div className="tags">{['React 18', 'Vite', 'React Router', 'Firebase Realtime Database', 'Firebase Authentication', 'Firebase Hosting'].map((t) => <span key={t} className="tag">{t}</span>)}</div>
      </div>
    </main>
  )
}
