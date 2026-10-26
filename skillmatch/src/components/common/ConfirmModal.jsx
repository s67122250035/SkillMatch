import Button from './Button'
import Modal from './Modal'

export default function ConfirmModal({ title = 'ยืนยันการทำรายการ', message, confirmText = 'ยืนยัน', danger, onConfirm, onClose }) {
  return (
    <Modal title={title} onClose={onClose}>
      <p>{message}</p>
      <div className="row" style={{ justifyContent: 'flex-end' }}>
        <Button variant="ghost" onClick={onClose}>ยกเลิก</Button>
        <Button variant={danger ? 'danger' : 'primary'} onClick={() => { onConfirm(); onClose() }}>{confirmText}</Button>
      </div>
    </Modal>
  )
}
