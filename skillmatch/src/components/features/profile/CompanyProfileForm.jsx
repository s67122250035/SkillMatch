import { useState } from 'react'
import Button from '../../common/Button'
import InputField from '../../common/InputField'
import { updateProfileData } from '../../../services/firebaseService'
import { useToast } from '../../../hooks/useToast'
import { friendlyError, linesToArray } from '../../../data/helpers'

export default function CompanyProfileForm({ profile, onSaved }) {
  const toast = useToast()
  const [form, setForm] = useState({
    name: profile.name || '', description: profile.description || '', website: profile.website || '',
    tagline: profile.tagline || '', industry: profile.industry || '', size: profile.size || '', address: profile.address || '',
    logo_url: profile.logo_url || '', cover_url: profile.cover_url || '', perks: (profile.perks || []).join('\n'),
  })
  const [busy, setBusy] = useState(false)

  const save = async (e) => {
    e.preventDefault()
    if (!form.name.trim()) return toast('กรุณากรอกชื่อบริษัท', 'bad')
    setBusy(true)
    try {
      await updateProfileData('companies', profile.id, { ...form, perks: linesToArray(form.perks) })
      toast('บันทึกข้อมูลบริษัทแล้ว')
      onSaved?.()
    } catch (err) {
      toast(friendlyError(err), 'bad')
    } finally {
      setBusy(false)
    }
  }
  return (
    <form className="card" onSubmit={save}>
      <h3>ข้อมูลบริษัท</h3>
      <InputField label="ชื่อบริษัท" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
      <InputField label="อีเมล" value={profile.email} disabled />
      <InputField label="เว็บไซต์" type="url" value={form.website} onChange={(e) => setForm({ ...form, website: e.target.value })} placeholder="https://" />
      <InputField label="สโลแกน / คำอธิบายสั้น ๆ" value={form.tagline} onChange={(e) => setForm({ ...form, tagline: e.target.value })} />
      <div className="grid grid-2" style={{ gap: '0 1rem' }}>
        <InputField label="อุตสาหกรรม" value={form.industry} onChange={(e) => setForm({ ...form, industry: e.target.value })} placeholder="เช่น ซอฟต์แวร์และเทคโนโลยี" />
        <InputField label="ขนาดองค์กร" value={form.size} onChange={(e) => setForm({ ...form, size: e.target.value })} placeholder="เช่น 50-100 คน" />
      </div>
      <InputField label="ที่ตั้ง" value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} placeholder="เช่น สีลม กรุงเทพฯ" />
      <div className="grid grid-2" style={{ gap: '0 1rem' }}>
        <InputField label="ลิงก์โลโก้ (URL รูปภาพ)" type="url" value={form.logo_url} onChange={(e) => setForm({ ...form, logo_url: e.target.value })} hint="เว้นว่างได้ ระบบจะสร้างโลโก้ตัวอักษรให้" />
        <InputField label="ลิงก์รูปปกบริษัท (URL รูปภาพ)" type="url" value={form.cover_url} onChange={(e) => setForm({ ...form, cover_url: e.target.value })} hint="เว้นว่างได้ ระบบจะสร้างภาพปกให้" />
      </div>
      <InputField as="textarea" rows={4} label="สวัสดิการ / บรรยากาศที่ทำงาน (บรรทัดละ 1 ข้อ)" value={form.perks} onChange={(e) => setForm({ ...form, perks: e.target.value })} />
      <InputField as="textarea" rows={4} label="เกี่ยวกับบริษัท" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
      <Button type="submit" disabled={busy}>{busy ? 'กำลังบันทึก...' : 'บันทึก'}</Button>
    </form>
  )
}
