import { useState } from 'react'
import { colorFor, initials, isRealImage } from '../../data/helpers'

export default function CompanyAvatar({ company, size = 44, radius }) {
  const [broken, setBroken] = useState(false)
  const style = { width: size, height: size, borderRadius: radius ?? Math.round(size * 0.3), fontSize: size * 0.36 }
  if (company && isRealImage(company.logo_url) && !broken) {
    return <img className="avatar logo-img" style={style} src={company.logo_url} alt={company.name} onError={() => setBroken(true)} />
  }
  return <span className="avatar" style={{ ...style, background: colorFor(company?.id) }}>{initials(company?.name)}</span>
}
