import { useEffect, useState } from 'react'
import { collection, onSnapshot } from 'firebase/firestore'
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

    unsubscribes.push(
      onSnapshot(collection(db, 'announcements'), (snapshot) => {
        setStats((prev) => ({ ...prev, announcements: snapshot.size }))
      }, (error) => setStats((prev) => ({ ...prev, error: error.message })))
    )

    // NOTE: the create form only ever saves a plain `date` string, not a Timestamp
    // `endDate` field — so a server-side where('endDate', '>=', now) filter would
    // always return 0. Counting the whole collection until events get real
    // start/end fields (see accompanying note).
    unsubscribes.push(
      onSnapshot(collection(db, 'events'), (snapshot) => {
        setStats((prev) => ({ ...prev, events: snapshot.size }))
      }, (error) => setStats((prev) => ({ ...prev, error: error.message })))
    )

    // Filtering client-side instead of where('status', '!=', 'resolved') because
    // Firestore inequality filters exclude docs where the field doesn't exist at
    // all — and the create form never sets `status` on prayer requests, so the
    // old query always returned 0.
    unsubscribes.push(
      onSnapshot(collection(db, 'prayerRequests'), (snapshot) => {
        const open = snapshot.docs.filter((d) => (d.data().status || '').toString().toLowerCase() !== 'resolved').length
        setStats((prev) => ({ ...prev, prayerRequests: open }))
      }, (error) => setStats((prev) => ({ ...prev, error: error.message })))
    )

    unsubscribes.push(
      onSnapshot(collection(db, 'sermons'), (snapshot) => {
        setStats((prev) => ({ ...prev, sermons: snapshot.size }))
      }, (error) => setStats((prev) => ({ ...prev, error: error.message })))
    )

    unsubscribes.push(
      onSnapshot(collection(db, 'ministries'), (snapshot) => {
        setStats((prev) => ({ ...prev, ministries: snapshot.size }))
      }, (error) => setStats((prev) => ({ ...prev, error: error.message })))
    )

    setStats((prev) => ({ ...prev, loading: false }))

    return () => unsubscribes.forEach((unsub) => unsub())
  }, [])

  return stats
}