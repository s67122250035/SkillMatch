import { useState } from 'react'
import { isRealImage } from '../../data/helpers'

const hash = (s = '') => [...s].reduce((h, c) => (h * 31 + c.charCodeAt(0)) >>> 0, 7)

/** ภาพปกที่สร้างจากธีมหมวดหมู่ (ไม่ต้องใช้ไฟล์รูป) — ใช้เป็นตัวสำรองเมื่อไม่มีรูปจริง */
export function GeneratedCover({ grad, icon, seed, height = 120, radius = 0, children }) {
  const h = hash(seed)
  const variant = h % 3
  const id = `g${h}`
  return (
    <div className="cover" style={{ height, borderRadius: radius }}>
      <svg viewBox="0 0 400 160" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
        <defs>
          <linearGradient id={id} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor={grad[0]} />
            <stop offset="1" stopColor={grad[1]} />
          </linearGradient>
        </defs>
        <rect width="400" height="160" fill={`url(#${id})`} />
        {variant === 0 && [0, 1, 2, 3, 4].map((i) => (
          <circle key={i} cx={40 + ((h >> i) % 340)} cy={20 + ((h >> (i + 3)) % 120)} r={30 + i * 14} fill="#fff" opacity={0.07 + i * 0.012} />
        ))}
        {variant === 1 && [0, 1, 2].map((i) => (
          <path key={i} d={`M0 ${90 + i * 22} Q 100 ${50 + i * 22 + (h % 30)} 200 ${90 + i * 22} T 400 ${90 + i * 22} V160 H0Z`} fill="#fff" opacity={0.09} />
        ))}
        {variant === 2 && Array.from({ length: 40 }).map((_, i) => (
          <circle key={i} cx={20 + (i % 10) * 40} cy={20 + Math.floor(i / 10) * 40} r="3" fill="#fff" opacity="0.25" />
        ))}
      </svg>
      <span className="cover-icon">{icon}</span>
      {children}
    </div>
  )
}

/** แสดงรูปจริงถ้ามี และ fallback เป็นภาพที่สร้างให้อัตโนมัติเมื่อรูปโหลดไม่ได้ */
export default function CoverImage({ url, fallback }) {
  const [broken, setBroken] = useState(false)
  if (isRealImage(url) && !broken) {
    return (
      <div className="cover" style={{ height: fallback.props.height, borderRadius: fallback.props.radius }}>
        <img src={url} alt="" loading="lazy" onError={() => setBroken(true)} />
        {fallback.props.children}
      </div>
    )
  }
  return fallback
}
