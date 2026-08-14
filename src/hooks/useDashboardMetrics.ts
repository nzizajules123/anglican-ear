import { useEffect, useState } from 'react'
import { collection, onSnapshot, query, where, Timestamp } from 'firebase/firestore'
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

    const unsubscribes: (() => void)[] = []
    const collections = ['announcements', 'events', 'sermons', 'prayerRequests', 'ministries']
    const metrics_temp: Partial<DashboardMetrics> = {
      itemsByType: {},
      itemsByStatus: {},
      recentActivity: [],
    }

    collections.forEach((collectionName) => {
      const unsubscribe = onSnapshot(
        collection(db, collectionName),
        (snapshot) => {
          let published = 0
          let draft = 0
          let archived = 0

          snapshot.forEach((doc) => {
            const data = doc.data()
            const status = data.status || 'published'
            if (status === 'published') published++
            else if (status === 'draft') draft++
            else if (status === 'archived') archived++
          })

          setMetrics((prev) => ({
            ...prev,
            itemsByType: {
              ...prev.itemsByType,
              [collectionName]: snapshot.size,
            },
            totalItems: Object.values(prev.itemsByType).reduce((a, b) => a + b, 0) + snapshot.size,
            publishedItems: published + Object.values(prev.itemsByStatus || {}).reduce((a, b) => a + b, 0),
          }))
        },
        (error) => {
          console.error(`Error fetching ${collectionName}:`, error)
        }
      )
      unsubscribes.push(unsubscribe)
    })

    setMetrics((prev) => ({ ...prev, loading: false }))

    return () => {
      unsubscribes.forEach((unsubscribe) => unsubscribe())
    }
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
      count: Math.floor(Math.random() * 10) + 1, // Placeholder - replace with real data
    })
  }
  return data
}
