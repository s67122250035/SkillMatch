import EmptyState from '../../common/EmptyState'
import { CardSkeletons } from '../../common/LoadingSpinner'
import JobCard from './JobCard'

export default function JobList({ jobs, loading, companyMap, skillMap, categoryMap, mySkillIds, favoriteIds, onToggleFavorite, emptyAction, layout = 'grid' }) {
  if (loading) return <CardSkeletons />
  if (!jobs.length) {
    return <EmptyState title="ไม่พบตำแหน่งงานที่ตรงกับเงื่อนไข" text="ลองเปลี่ยนคำค้นหาหรือล้างตัวกรองดูนะ" action={emptyAction} />
  }
  return (
    <div className={layout === 'list' ? 'stack' : 'grid grid-3'}>
      {jobs.map((job) => (
        <JobCard
          key={job.id}
          job={job}
          layout={layout}
          company={companyMap[job.company_id]}
          skillMap={skillMap}
          categoryMap={categoryMap}
          mySkillIds={mySkillIds}
          isFavorite={favoriteIds?.includes(job.id)}
          onToggleFavorite={onToggleFavorite}
        />
      ))}
    </div>
  )
}
