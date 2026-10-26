export const JOB_TYPES = {
  internship: 'ฝึกงาน',
  full_time: 'งานประจำ',
  part_time: 'พาร์ทไทม์',
}
export const LOCATIONS = ['Bangkok', 'Nonthaburi', 'Chonburi', 'Pathum Thani', 'Chiang Mai', 'Remote']
export const APP_STATUS = {
  pending: { label: 'รอตรวจสอบ', tone: 'warn' },
  accepted: { label: 'ผ่านการคัดเลือก', tone: 'ok' },
  rejected: { label: 'ไม่ผ่าน', tone: 'bad' },
}

/** เปอร์เซ็นต์ทักษะที่ตรงกับตำแหน่งงาน */
export function matchPercent(requiredIds = [], userSkillIds = []) {
  if (!requiredIds.length) return 0
  const mine = new Set(userSkillIds)
  const hit = requiredIds.filter((id) => mine.has(id)).length
  return Math.round((hit / requiredIds.length) * 100)
}

export const formatSalary = (min, max) => {
  if (!min && !max) return 'ตามตกลง'
  const f = (n) => Number(n).toLocaleString('th-TH')
  return min && max ? `${f(min)} – ${f(max)} บาท` : `${f(min || max)} บาท`
}

export const formatDate = (iso) =>
  iso ? new Date(iso).toLocaleDateString('th-TH', { year: 'numeric', month: 'short', day: 'numeric' }) : '-'

export const initials = (name = '?') =>
  name.trim().split(/\s+/).slice(0, 2).map((s) => s[0]).join('').toUpperCase()

const PALETTE = ['#6366f1', '#0ea5e9', '#10b981', '#f59e0b', '#ec4899', '#8b5cf6', '#14b8a6']
export const colorFor = (key = '') =>
  PALETTE[[...key].reduce((s, c) => s + c.charCodeAt(0), 0) % PALETTE.length]

export const friendlyError = (err) => {
  const code = err?.code || ''
  if (code.includes('invalid-credential') || code.includes('wrong-password') || code.includes('user-not-found'))
    return 'อีเมลหรือรหัสผ่านไม่ถูกต้อง'
  if (code.includes('email-already-in-use')) return 'อีเมลนี้ถูกใช้สมัครแล้ว'
  if (code.includes('weak-password')) return 'รหัสผ่านต้องมีอย่างน้อย 6 ตัวอักษร'
  if (code.includes('invalid-email')) return 'รูปแบบอีเมลไม่ถูกต้อง'
  if (code.includes('PERMISSION_DENIED') || /permission/i.test(err?.message || ''))
    return 'ไม่มีสิทธิ์เข้าถึงข้อมูล (ตรวจสอบ Database Rules)'
  return err?.message || 'เกิดข้อผิดพลาด กรุณาลองใหม่'
}

/* ---------- ธีมของหมวดหมู่ / รูปแบบการทำงาน / รูปภาพ ---------- */
const DEFAULT_THEME = { icon: '✨', color: '#6366f1', grad: ['#6366f1', '#8b5cf6'], th: '' }
export const CATEGORY_THEME = {
  skill_cat_001: { icon: '💻', color: '#6366f1', grad: ['#6366f1', '#8b5cf6'], th: 'พัฒนาซอฟต์แวร์', blurb: 'เขียนโค้ด สร้างเว็บและแอป ดูแลระบบหลังบ้าน' },
  skill_cat_002: { icon: '🎨', color: '#ec4899', grad: ['#ec4899', '#f97316'], th: 'ออกแบบ', blurb: 'UI/UX กราฟิก และงานครีเอทีฟที่คนมองเห็น' },
  skill_cat_003: { icon: '📣', color: '#f59e0b', grad: ['#f59e0b', '#ef4444'], th: 'การตลาด', blurb: 'คอนเทนต์ โซเชียล โฆษณา และ SEO' },
  skill_cat_004: { icon: '📊', color: '#0ea5e9', grad: ['#0ea5e9', '#6366f1'], th: 'ข้อมูลและการวิเคราะห์', blurb: 'วิเคราะห์ข้อมูล Dashboard และ BI' },
  skill_cat_005: { icon: '🤝', color: '#10b981', grad: ['#10b981', '#0ea5e9'], th: 'ขายและบริการลูกค้า', blurb: 'งานขาย เจรจา และดูแลลูกค้า' },
}
export const themeFor = (categoryId) => CATEGORY_THEME[categoryId] || DEFAULT_THEME
export const categoryLabel = (cat) => (cat ? themeFor(cat.id).th || cat.name : '')

/** หมวดหลักของงาน = หมวดที่มีทักษะที่ต้องการมากที่สุด */
export function primaryCategoryId(job, skillMap) {
  const count = {}
  for (const sid of job.required_skill_ids || []) {
    const c = skillMap[sid]?.category_id
    if (c) count[c] = (count[c] || 0) + 1
  }
  return Object.entries(count).sort((a, b) => b[1] - a[1])[0]?.[0] || null
}

export const WORK_MODES = {
  onsite: { label: 'ทำงานที่ออฟฟิศ', icon: '🏢' },
  hybrid: { label: 'Hybrid', icon: '🔀' },
  remote: { label: 'Remote', icon: '🏠' },
}

/** ใช้รูปจริงเฉพาะ URL ที่ใช้ได้ (ข้าม URL ตัวอย่างอย่าง example.com) */
export const isRealImage = (url) => /^https?:\/\//i.test(url || '') && !/example\.(com|org|net)/i.test(url)

const daysFromNow = (iso) => Math.ceil((new Date(iso) - Date.now()) / 86400000)
export const isNewJob = (job) => job.posted_at && -daysFromNow(job.posted_at) <= 14
export const deadlineInfo = (job) => {
  if (!job.deadline) return null
  const d = daysFromNow(job.deadline)
  if (d < 0) return { text: 'หมดเขตรับสมัครแล้ว', tone: 'gray' }
  if (d <= 14) return { text: `ปิดรับสมัครในอีก ${d} วัน`, tone: 'warn' }
  return { text: `ปิดรับสมัคร ${formatDate(job.deadline)}`, tone: 'gray' }
}

export const linesToArray = (text) => text.split('\n').map((s) => s.trim()).filter(Boolean)
