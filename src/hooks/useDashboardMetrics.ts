import { useEffect, useState } from 'react'
import { collection, onSnapshot } from 'firebase/firestore'
import { db } from '../lib/firebase'

export interface DashboardMetrics {
  totalItems: number
  publishedItems: number
  draftItems: number
  archivedItems: number
  itemsByType: Record<string, number>
  itemsByStatus: Record<string, number>
  recentActivity: Array<{ date: string; count: number }>
  loading: boolean
  error: string | null
}

const TRACKED_COLLECTIONS = ['announcements', 'events', 'sermons', 'prayerRequests', 'ministries']

export function useDashboardMetrics(): DashboardMetrics {
  const [metrics, setMetrics] = useState<DashboardMetrics>({
    totalItems: 0,
    publishedItems: 0,
    draftItems: 0,
    archivedItems: 0,
    itemsByType: {},
    itemsByStatus: {},
    recentActivity: [],
    loading: true,
    error: null,
  })

  useEffect(() => {
    if (!db) {
      setMetrics((prev) => ({ ...prev, loading: false, error: 'Firebase not initialized' }))
      return
    }

    // Each collection's latest snapshot counts live here, keyed by collection name,
    // so one collection's update can never stomp on another's totals.
    const perCollection: Record<string, { total: number; published: number; draft: number; archived: number }> = {}

    const recompute = () => {
      const itemsByType: Record<string, number> = {}
      let totalItems = 0
      let publishedItems = 0
      let draftItems = 0
      let archivedItems = 0

      for (const name of TRACKED_COLLECTIONS) {
        const stats = perCollection[name]
        if (!stats) continue
        itemsByType[name] = stats.total
        totalItems += stats.total
        publishedItems += stats.published
        draftItems += stats.draft
        archivedItems += stats.archived
      }

      setMetrics((prev) => ({
        ...prev,
        itemsByType,
        totalItems,
        publishedItems,
        draftItems,
        archivedItems,
        itemsByStatus: { published: publishedItems, draft: draftItems, archived: archivedItems },
      }))
    }

    const unsubscribes = TRACKED_COLLECTIONS.map((name) =>
      onSnapshot(
        collection(db, name),
        (snapshot) => {
          let published = 0
          let draft = 0
          let archived = 0
          snapshot.forEach((docSnap) => {
            const status = (docSnap.data().status || 'published').toString().toLowerCase()
            if (status === 'draft') draft++
            else if (status === 'archived') archived++
            else published++
          })
          perCollection[name] = { total: snapshot.size, published, draft, archived }
          recompute()
        },
        (error) => {
          console.error(`Error fetching ${name}:`, error)
          setMetrics((prev) => ({ ...prev, error: error.message }))
        }
      )
    )

    setMetrics((prev) => ({ ...prev, loading: false }))

    return () => unsubscribes.forEach((unsub) => unsub())
  }, [])

  return metrics
}

export function getLastNDaysData(days: number = 7): Array<{ date: string; count: number }> {
  const data = []
  for (let i = days - 1; i >= 0; i--) {
    const date = new Date()
    date.setDate(date.getDate() - i)
    data.push({
      date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      count: Math.floor(Math.random() * 10) + 1, // Placeholder — wire to real per-day counts when you're ready
    })
  }
  return data
}