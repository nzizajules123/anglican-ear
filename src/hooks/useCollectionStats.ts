import { useEffect, useState } from 'react'
import { collection, onSnapshot } from 'firebase/firestore'
import { db } from '../lib/firebase'
import { anglicanSeedData } from '../lib/church-data'

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
    announcements: anglicanSeedData.announcements.length,
    events: anglicanSeedData.events.length,
    prayerRequests: anglicanSeedData.prayerRequests.length,
    sermons: anglicanSeedData.sermons.length,
    ministries: anglicanSeedData.ministries.length,
    giving: anglicanSeedData.giving.length,
    loading: false,
    error: null,
  })

  useEffect(() => {
    if (!db) return

    const firestore = db
    const unsubscribes: (() => void)[] = []

    unsubscribes.push(
      onSnapshot(collection(firestore, 'announcements'), (snapshot) => {
        setStats((prev) => ({ ...prev, announcements: snapshot.empty ? anglicanSeedData.announcements.length : snapshot.size }))
      }, (error) => setStats((prev) => ({ ...prev, error: error.message })))
    )

    unsubscribes.push(
      onSnapshot(collection(firestore, 'events'), (snapshot) => {
        setStats((prev) => ({ ...prev, events: snapshot.empty ? anglicanSeedData.events.length : snapshot.size }))
      }, (error) => setStats((prev) => ({ ...prev, error: error.message })))
    )

    unsubscribes.push(
      onSnapshot(collection(firestore, 'prayerRequests'), (snapshot) => {
        if (snapshot.empty) {
          setStats((prev) => ({ ...prev, prayerRequests: anglicanSeedData.prayerRequests.length }))
        } else {
          const open = snapshot.docs.filter((d) => (d.data().status || '').toString().toLowerCase() !== 'resolved').length
          setStats((prev) => ({ ...prev, prayerRequests: open }))
        }
      }, (error) => setStats((prev) => ({ ...prev, error: error.message })))
    )

    unsubscribes.push(
      onSnapshot(collection(firestore, 'sermons'), (snapshot) => {
        setStats((prev) => ({ ...prev, sermons: snapshot.empty ? anglicanSeedData.sermons.length : snapshot.size }))
      }, (error) => setStats((prev) => ({ ...prev, error: error.message })))
    )

    unsubscribes.push(
      onSnapshot(collection(firestore, 'ministries'), (snapshot) => {
        setStats((prev) => ({ ...prev, ministries: snapshot.empty ? anglicanSeedData.ministries.length : snapshot.size }))
      }, (error) => setStats((prev) => ({ ...prev, error: error.message })))
    )

    unsubscribes.push(
      onSnapshot(collection(firestore, 'giving'), (snapshot) => {
        setStats((prev) => ({ ...prev, giving: snapshot.empty ? anglicanSeedData.giving.length : snapshot.size }))
      }, (error) => setStats((prev) => ({ ...prev, error: error.message })))
    )

    return () => unsubscribes.forEach((unsub) => unsub())
  }, [])

  return stats
}