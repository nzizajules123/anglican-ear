import { useEffect, useState } from 'react'
import { collection, onSnapshot, query, orderBy, limit, Timestamp } from 'firebase/firestore'
import { db } from '../lib/firebase'

export interface Activity {
  id: string
  type: 'announcement' | 'event' | 'sermon' | 'prayer_request' | 'ministry' | 'user_joined'
  title: string
  description?: string
  createdAt: Date
  createdBy?: string
  collectionName: string
  status?: string
}

export interface RecentActivityState {
  activities: Activity[]
  loading: boolean
  error: string | null
}

export function useRecentActivity(limitCount = 10): RecentActivityState {
  const [state, setState] = useState<RecentActivityState>({
    activities: [],
    loading: true,
    error: null,
  })

  useEffect(() => {
    if (!db) {
      setState((prev) => ({ ...prev, loading: false, error: 'Firebase not initialized' }))
      return
    }

    const firestore = db
    const activities: Map<string, Activity> = new Map()
    const unsubscribes: (() => void)[] = []

    // Helper function to add activities from a collection
    const setupCollectionListener = (
      collectionName: string,
      type: Activity['type']
    ) => {
      const unsubscribe = onSnapshot(
        query(
          collection(firestore, collectionName),
          orderBy('createdAt', 'desc'),
          limit(10)
        ),
        (snapshot) => {
          snapshot.forEach((doc) => {
            const data = doc.data()
            activities.set(`${collectionName}-${doc.id}`, {
              id: doc.id,
              type,
              title: data.title || data.name || 'Untitled',
              description: data.description,
              createdAt: data.createdAt instanceof Timestamp 
                ? data.createdAt.toDate() 
                : new Date(data.createdAt),
              createdBy: data.createdBy || data.author,
              collectionName,
              status: data.status,
            })
          })
          
          // Sort all activities by date and take top entries
          const sorted = Array.from(activities.values())
            .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
            .slice(0, limitCount)
          
          setState((prev) => ({ ...prev, activities: sorted }))
        },
        (error) => {
          console.error(`Error fetching ${collectionName}:`, error)
        }
      )
      return unsubscribe
    }

    // Setup listeners for all collections
    unsubscribes.push(setupCollectionListener('announcements', 'announcement'))
    unsubscribes.push(setupCollectionListener('events', 'event'))
    unsubscribes.push(setupCollectionListener('sermons', 'sermon'))
    unsubscribes.push(setupCollectionListener('prayerRequests', 'prayer_request'))
    unsubscribes.push(setupCollectionListener('ministries', 'ministry'))

    setState((prev) => ({ ...prev, loading: false }))

    return () => {
      unsubscribes.forEach((unsubscribe) => unsubscribe())
    }
  }, [limitCount])

  return state
}
