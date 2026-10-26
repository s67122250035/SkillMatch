import { useCallback, useEffect, useState } from 'react'
import { getFavoriteIds, setFavorite } from '../services/firebaseService'

export function useFavorites(userId) {
  const [ids, setIds] = useState([])
  useEffect(() => {
    if (!userId) { setIds([]); return }
    getFavoriteIds(userId).then(setIds).catch(() => setIds([]))
  }, [userId])

  const toggle = useCallback(async (jobId) => {
    const on = !ids.includes(jobId)
    await setFavorite(userId, jobId, on)
    setIds((cur) => (on ? [...cur, jobId] : cur.filter((x) => x !== jobId)))
    return on
  }, [ids, userId])

  return { favoriteIds: ids, toggleFavorite: toggle }
}
