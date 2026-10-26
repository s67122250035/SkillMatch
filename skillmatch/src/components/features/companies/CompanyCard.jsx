import { Link } from 'react-router-dom'
import CompanyAvatar from '../../common/CompanyAvatar'
import CoverImage, { GeneratedCover } from '../../common/CoverArt'
import { CATEGORY_THEME } from '../../../data/helpers'

const GRADS = Object.values(CATEGORY_THEME)

export default function CompanyCard({ company, openJobs, index = 0 }) {
  const theme = GRADS[index % GRADS.length]
  return (
    <Link to={`/companies/${company.id}`} className="card card-hover company-card">
      <CoverImage
        url={company.cover_url}
        fallback={<GeneratedCover grad={theme.grad} icon="" seed={company.id} height={96} />}
      />
      <div className="company-body">
        <div className="logo-pop"><CompanyAvatar company={company} size={56} radius={16} /></div>
        <h3 style={{ margin: '.5rem 0 .1rem' }}>{company.name}{company.verified && ' ✔'}</h3>
        <div className="muted small">{company.industry || 'บริษัทพันธมิตร'}{company.address && ` · ${company.address}`}</div>
        {company.tagline && <p className="small" style={{ margin: '.6rem 0 0' }}>{company.tagline}</p>}
        <div className="row between" style={{ marginTop: '.8rem' }}>
          <span className="badge badge-ok">{openJobs} ตำแหน่งที่เปิดรับ</span>
          {company.size && <span className="muted small">👥 {company.size}</span>}
        </div>
      </div>
    </Link>
  )
}
