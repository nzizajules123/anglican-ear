import { useEffect, useState } from 'react'
import { collection, onSnapshot } from 'firebase/firestore'
import { db } from '../lib/firebase'

export interface CollectionStats {
  announcements: number
  events: number
  prayerRequests: number
  sermons: number
  ministries: number
  giving: number
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
    giving: 0,
    loading: true,
    error: null,
  })

  useEffect(() => {
    if (!db) {
      setStats((prev) => ({ ...prev, loading: false, error: 'Firebase not initialized' }))
      return
    }

    const firestore = db
    const unsubscribes: (() => void)[] = []

    unsubscribes.push(
      onSnapshot(collection(firestore, 'announcements'), (snapshot) => {
        setStats((prev) => ({ ...prev, announcements: snapshot.size, loading: false }))
      }, (error) => setStats((prev) => ({ ...prev, error: error.message, loading: false })))
    )

    unsubscribes.push(
      onSnapshot(collection(firestore, 'events'), (snapshot) => {
        setStats((prev) => ({ ...prev, events: snapshot.size, loading: false }))
      }, (error) => setStats((prev) => ({ ...prev, error: error.message, loading: false })))
    )

    unsubscribes.push(
      onSnapshot(collection(firestore, 'prayerRequests'), (snapshot) => {
        const open = snapshot.docs.filter((d) => (d.data().status || '').toString().toLowerCase() !== 'resolved').length
        setStats((prev) => ({ ...prev, prayerRequests: open, loading: false }))
      }, (error) => setStats((prev) => ({ ...prev, error: error.message, loading: false })))
    )

    unsubscribes.push(
      onSnapshot(collection(firestore, 'sermons'), (snapshot) => {
        setStats((prev) => ({ ...prev, sermons: snapshot.size, loading: false }))
      }, (error) => setStats((prev) => ({ ...prev, error: error.message, loading: false })))
    )

    unsubscribes.push(
      onSnapshot(collection(firestore, 'ministries'), (snapshot) => {
        setStats((prev) => ({ ...prev, ministries: snapshot.size, loading: false }))
      }, (error) => setStats((prev) => ({ ...prev, error: error.message, loading: false })))
    )

    unsubscribes.push(
      onSnapshot(collection(firestore, 'giving'), (snapshot) => {
        setStats((prev) => ({ ...prev, giving: snapshot.size, loading: false }))
      }, (error) => setStats((prev) => ({ ...prev, error: error.message, loading: false })))
    )

    return () => unsubscribes.forEach((unsub) => unsub())
  }, [])

  return stats
}