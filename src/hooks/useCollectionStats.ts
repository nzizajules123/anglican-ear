import { useEffect, useState } from 'react'
import { collection, onSnapshot, query, where } from 'firebase/firestore'
import { db } from '../lib/firebase'

export interface CollectionStats {
  announcements: number
  events: number
  prayerRequests: number
  sermons: number
  ministries: number
  loading: boolean
  error: string | null
}

export function useCollectionStats(): CollectionStats {
  const [stats, setStats] = useState<CollectionStats>({
    announcements: 0,
    events: 0,
    prayerRequests: 0,
    sermons: 0,
    ministries: 0,
    loading: true,
    error: null,
  })

  useEffect(() => {
    if (!db) {
      setStats((prev) => ({ ...prev, loading: false, error: 'Firebase not initialized' }))
      return
    }

    const unsubscribes: (() => void)[] = []

    // Get announcements count
    const unsubAnnouncements = onSnapshot(
      collection(db, 'announcements'),
      (snapshot) => {
        setStats((prev) => ({ ...prev, announcements: snapshot.size }))
      },
      (error) => {
        console.error('Error fetching announcements:', error)
        setStats((prev) => ({ ...prev, error: error.message }))
      }
    )
    unsubscribes.push(unsubAnnouncements)

    // Get events count
    const unsubEvents = onSnapshot(
      query(collection(db, 'events'), where('endDate', '>=', new Date())),
      (snapshot) => {
        setStats((prev) => ({ ...prev, events: snapshot.size }))
      },
      (error) => {
        console.error('Error fetching events:', error)
      }
    )
    unsubscribes.push(unsubEvents)

    // Get prayer requests count
    const unsubPrayerRequests = onSnapshot(
      query(collection(db, 'prayerRequests'), where('status', '!=', 'resolved')),
      (snapshot) => {
        setStats((prev) => ({ ...prev, prayerRequests: snapshot.size }))
      },
      (error) => {
        console.error('Error fetching prayer requests:', error)
      }
    )
    unsubscribes.push(unsubPrayerRequests)

    // Get sermons count
    const unsubSermons = onSnapshot(
      collection(db, 'sermons'),
      (snapshot) => {
        setStats((prev) => ({ ...prev, sermons: snapshot.size }))
      },
      (error) => {
        console.error('Error fetching sermons:', error)
      }
    )
    unsubscribes.push(unsubSermons)

    // Get ministries count
    const unsubMinistries = onSnapshot(
      collection(db, 'ministries'),
      (snapshot) => {
        setStats((prev) => ({ ...prev, ministries: snapshot.size }))
      },
      (error) => {
        console.error('Error fetching ministries:', error)
      }
    )
    unsubscribes.push(unsubMinistries)

    // All data loaded
    setStats((prev) => ({ ...prev, loading: false }))

    return () => {
      unsubscribes.forEach((unsubscribe) => unsubscribe())
    }
  }, [])

  return stats
}
