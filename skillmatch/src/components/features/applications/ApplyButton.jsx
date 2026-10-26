import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Button from '../../common/Button'
import Modal from '../../common/Modal'
import { useAuth } from '../../../hooks/useAuth'
import { useToast } from '../../../hooks/useToast'
import { applyToJob } from '../../../services/firebaseService'
import { friendlyError } from '../../../data/helpers'

export default function ApplyButton({ job, alreadyApplied, onApplied }) {
  const { profile } = useAuth()
  const toast = useToast()
  const navigate = useNavigate()
  const [confirm, setConfirm] = useState(false)
  const [busy, setBusy] = useState(false)

  if (job.status !== 'open') return <Button disabled block>ปิดรับสมัครแล้ว</Button>
  if (alreadyApplied) return <Button disabled block variant="ok">✓ สมัครแล้ว</Button>
  if (profile && profile.role !== 'graduate') return <p className="muted small">เฉพาะบัญชีบัณฑิตเท่านั้นที่สมัครงานได้</p>

  const click = () => {
    if (!profile) return navigate('/login', { state: { from: `/jobs/${job.id}` } })
    setConfirm(true)
  }
  const submit = async () => {
    setBusy(true)
    try {
      await applyToJob(profile.id, job.id)
      toast('ส่งใบสมัครเรียบร้อยแล้ว 🎉')
      setConfirm(false)
      onApplied?.()
    } catch (e) {
      toast(friendlyError(e), 'bad')
    } finally {
      setBusy(false)
    }
  }

  return (
    <>
      <Button block onClick={click}>สมัครตำแหน่งนี้</Button>
      {confirm && (
        <Modal title="ยืนยันการสมัคร" onClose={() => setConfirm(false)}>
          <p>ต้องการสมัคร <b>{job.title}</b> ใช่หรือไม่?</p>
          {!profile.resume_url && (
            <div className="alert alert-warn">คุณยังไม่ได้เพิ่มลิงก์เรซูเม่ในโปรไฟล์ บริษัทอาจเห็นข้อมูลของคุณไม่ครบ</div>
          )}
          <div className="row" style={{ justifyContent: 'flex-end' }}>
            <Button variant="ghost" onClick={() => setConfirm(false)}>ยกเลิก</Button>
            <Button onClick={submit} disabled={busy}>{busy ? 'กำลังส่ง...' : 'ยืนยันสมัคร'}</Button>
          </div>
        </Modal>
      )}
    </>
  )
}
