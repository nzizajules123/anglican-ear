import { useEffect, useState } from 'react'
import { collection, onSnapshot, query, where } from 'firebase/firestore'
import { db } from '../lib/firebase'

const TRACKED = ['announcements', 'events', 'sermons', 'ministries'] as const

export type MyContributions = {
  counts: Record<string, number>
  total: number
  loading: boolean
}

/**
 * Counts only the records the signed-in user created, so a role that isn't
 * super admin or pastor analyses their own work instead of the whole parish.
 */
export function useMyContributions(uid?: string): MyContributions {
  const [counts, setCounts] = useState<Record<string, number>>({})
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!db || !uid) {
      setCounts({})
      setLoading(false)
      return
    }
    const firestore = db
    setLoading(true)
    const unsubscribes = TRACKED.map((name) =>
      onSnapshot(
        query(collection(firestore, name), where('createdBy', '==', uid)),
        (snapshot) => {
          setCounts((previous) => ({ ...previous, [name]: snapshot.size }))
          setLoading(false)
        },
        () => setLoading(false)
      )
    )
    return () => unsubscribes.forEach((stop) => stop())
  }, [uid])

  const total = Object.values(counts).reduce((sum, value) => sum + value, 0)
  return { counts, total, loading }
}
