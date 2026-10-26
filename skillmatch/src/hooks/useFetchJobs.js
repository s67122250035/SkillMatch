import { useCallback, useEffect, useMemo, useState } from 'react'
import { fetchCatalog } from '../services/firebaseService'

/** โหลด jobs/companies/skills/categories จาก Firebase พร้อมสถานะ loading / error */
export function useFetchJobs() {
  const [data, setData] = useState({ categories: [], skills: [], companies: [], jobs: [] })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const load = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      setData(await fetchCatalog())
    } catch (e) {
      setError(e)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { load() }, [load])

  const maps = useMemo(() => {
    const byId = (list) => Object.fromEntries(list.map((x) => [x.id, x]))
    return { skillMap: byId(data.skills), companyMap: byId(data.companies), categoryMap: byId(data.categories) }
  }, [data])

  return { ...data, ...maps, loading, error, reload: load }
}
