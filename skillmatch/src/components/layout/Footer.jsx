import { Link } from 'react-router-dom'

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container footer-grid">
        <div>
          <div className="logo" style={{ color: 'var(--text)', marginBottom: '.5rem' }}>
            <span className="logo-mark">🎯</span> SkillMatch
          </div>
          <p>แพลตฟอร์มจับคู่งานและฝึกงานสำหรับบัณฑิตจบใหม่ ด้วยการเปรียบเทียบทักษะจริง ไม่ใช่แค่คำค้นหา</p>
          <p className="small">โครงงานวิชาการพัฒนาเว็บแอปพลิเคชัน CSD3202 · มหาวิทยาลัยราชภัฏสวนสุนันทา</p>
        </div>
        <div>
          <h4>สำหรับบัณฑิต</h4>
          <Link to="/jobs">ค้นหางาน</Link>
          <Link to="/register">สมัครสมาชิก</Link>
          <Link to="/graduate/dashboard?tab=applications">ติดตามใบสมัคร</Link>
        </div>
        <div>
          <h4>สำหรับบริษัท</h4>
          <Link to="/register">ลงทะเบียนบริษัท</Link>
          <Link to="/company/dashboard?tab=post">ประกาศตำแหน่งงาน</Link>
          <Link to="/about">เกี่ยวกับระบบ</Link>
        </div>
      </div>
    </footer>
  )
}
