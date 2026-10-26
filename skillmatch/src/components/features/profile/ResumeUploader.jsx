import InputField from '../../common/InputField'

// โปรเจกต์นี้ไม่ใช้ Firebase Storage จึงรับเรซูเม่เป็นลิงก์ (Google Drive / PDF online)
export default function ResumeUploader({ value, onChange }) {
  return (
    <InputField
      label="ลิงก์เรซูเม่ (Google Drive / PDF)"
      type="url"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder="https://drive.google.com/..."
      hint="ตั้งค่าการแชร์เป็น 'ทุกคนที่มีลิงก์' เพื่อให้บริษัทเปิดดูได้"
    />
  )
}
