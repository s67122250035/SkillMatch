import { useState } from 'react'
import Button from '../../common/Button'
import InputField from '../../common/InputField'
import SkillTag from '../../common/SkillTag'
import ResumeUploader from './ResumeUploader'
import { updateProfileData } from '../../../services/firebaseService'
import { useToast } from '../../../hooks/useToast'
import { friendlyError } from '../../../data/helpers'

export default function GraduateProfileForm({ profile, categories, skills, onSaved }) {
  const toast = useToast()
  const [form, setForm] = useState({
    name: profile.name || '',
    education: profile.education || '',
    resume_url: profile.resume_url || '',
    skill_ids: profile.skill_ids || [],
  })
  const [busy, setBusy] = useState(false)
  const toggle = (id) =>
    setForm((f) => ({ ...f, skill_ids: f.skill_ids.includes(id) ? f.skill_ids.filter((x) => x !== id) : [...f.skill_ids, id] }))

  const save = async (e) => {
    e.preventDefault()
    if (!form.name.trim()) return toast('กรุณากรอกชื่อ', 'bad')
    setBusy(true)
    try {
      await updateProfileData('users', profile.id, form)
      toast('บันทึกโปรไฟล์แล้ว')
      onSaved?.()
    } catch (err) {
      toast(friendlyError(err), 'bad')
    } finally {
      setBusy(false)
    }
  }

  return (
    <form className="card" onSubmit={save}>
      <h3>ข้อมูลส่วนตัว</h3>
      <div className="grid grid-2">
        <InputField label="ชื่อ-นามสกุล" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
        <InputField label="อีเมล" value={profile.email} disabled />
      </div>
      <InputField label="การศึกษา" value={form.education} onChange={(e) => setForm({ ...form, education: e.target.value })} placeholder="เช่น วท.บ. วิทยาการคอมพิวเตอร์ มรภ.สวนสุนันทา" />
      <ResumeUploader value={form.resume_url} onChange={(v) => setForm({ ...form, resume_url: v })} />

      <h3 style={{ marginTop: '1rem' }}>ทักษะของฉัน <span className="badge">{form.skill_ids.length} ทักษะ</span></h3>
      <p className="muted small">เลือกทักษะที่คุณมี ระบบจะนำไปคำนวณ % ความเหมาะสมกับตำแหน่งงานทุกตำแหน่ง</p>
      {categories.map((c) => (
        <div key={c.id} style={{ marginBottom: '1rem' }}>
          <div className="small muted" style={{ marginBottom: '.4rem', fontWeight: 500 }}>{c.name}</div>
          <div className="tags">
            {skills.filter((s) => s.category_id === c.id).map((s) => (
              <SkillTag key={s.id} name={s.name} active={form.skill_ids.includes(s.id)} onClick={() => toggle(s.id)} />
            ))}
          </div>
        </div>
      ))}
      <Button type="submit" disabled={busy}>{busy ? 'กำลังบันทึก...' : 'บันทึกโปรไฟล์'}</Button>
    </form>
  )
}
