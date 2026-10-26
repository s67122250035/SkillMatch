import Button from '../../common/Button'
import { JOB_TYPES, WORK_MODES } from '../../../data/helpers'

export const EMPTY_FILTERS = { q: '', type: '', location: '', category: '', work_mode: '', sort: 'newest', openOnly: true }

export default function FilterPanel({ filters, onChange, locations, showMatchSort, open }) {
  const set = (patch) => onChange({ ...filters, ...patch })
  return (
    <aside className={`card filter-panel stack ${open ? 'open' : ''}`}>
      <h3 style={{ margin: 0 }}>ตัวกรอง</h3>
      <div className="field" style={{ marginBottom: 0 }}>
        <label htmlFor="flt-q">ค้นหา</label>
        <input id="flt-q" value={filters.q} onChange={(e) => set({ q: e.target.value })} placeholder="ชื่อตำแหน่ง / ทักษะ / บริษัท" />
      </div>
      <div className="field" style={{ marginBottom: 0 }}>
        <label htmlFor="flt-type">ประเภทงาน</label>
        <select id="flt-type" value={filters.type} onChange={(e) => set({ type: e.target.value })}>
          <option value="">ทั้งหมด</option>
          {Object.entries(JOB_TYPES).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
        </select>
      </div>
      <div className="field" style={{ marginBottom: 0 }}>
        <label htmlFor="flt-mode">รูปแบบการทำงาน</label>
        <select id="flt-mode" value={filters.work_mode} onChange={(e) => set({ work_mode: e.target.value })}>
          <option value="">ทั้งหมด</option>
          {Object.entries(WORK_MODES).map(([k, v]) => <option key={k} value={k}>{v.icon} {v.label}</option>)}
        </select>
      </div>
      <div className="field" style={{ marginBottom: 0 }}>
        <label htmlFor="flt-loc">สถานที่</label>
        <select id="flt-loc" value={filters.location} onChange={(e) => set({ location: e.target.value })}>
          <option value="">ทั้งหมด</option>
          {locations.map((l) => <option key={l}>{l}</option>)}
        </select>
      </div>
      <div className="field" style={{ marginBottom: 0 }}>
        <label htmlFor="flt-sort">เรียงตาม</label>
        <select id="flt-sort" value={filters.sort} onChange={(e) => set({ sort: e.target.value })}>
          <option value="newest">ล่าสุด</option>
          {showMatchSort && <option value="match">ตรงกับทักษะของฉันมากที่สุด</option>}
          <option value="salary">เงินเดือนสูงสุด</option>
        </select>
      </div>
      <label className="row" style={{ cursor: 'pointer' }}>
        <input type="checkbox" checked={filters.openOnly} onChange={(e) => set({ openOnly: e.target.checked })} />
        เฉพาะที่ยังเปิดรับสมัคร
      </label>
      <Button variant="ghost" block onClick={() => onChange(EMPTY_FILTERS)}>ล้างตัวกรอง</Button>
    </aside>
  )
}
