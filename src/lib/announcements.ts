import { addDoc, collection, deleteDoc, doc, limit, onSnapshot, orderBy, query, serverTimestamp } from 'firebase/firestore'
import { db } from './firebase'
import type { Role } from '../types/roles'

export type AnnouncementAudience = 'all' | Role

export type Announcement = {
  id: string
  title: string
  message: string
  audience: AnnouncementAudience
  createdBy?: string
  createdByName?: string
  createdAt?: { seconds: number } | null
}

export function subscribeToAnnouncements(handler: (items: Announcement[]) => void, max = 50) {
  if (!db) {
    handler([])
    return () => {}
  }
  const q = query(collection(db, 'announcements'), orderBy('createdAt', 'desc'), limit(max))
  return onSnapshot(
    q,
    (snapshot) => {
      handler(snapshot.docs.map((d) => ({ id: d.id, ...(d.data() as Omit<Announcement, 'id'>) })))
    },
    (error) => {
      console.error('Failed to load announcements:', error)
      handler([])
    }
  )
}

export async function createAnnouncement(input: {
  title: string
  message: string
  audience: AnnouncementAudience
  createdBy?: string
  createdByName?: string
}) {
  if (!db) throw new Error('Firebase is not configured.')
  return addDoc(collection(db, 'announcements'), {
    ...input,
    // kept so existing list views that read `description` still render
    description: input.message,
    status: 'Published',
    createdAt: serverTimestamp(),
  })
}

export async function deleteAnnouncement(id: string) {
  if (!db) throw new Error('Firebase is not configured.')
  return deleteDoc(doc(db, 'announcements', id))
}

export function isForAudience(announcement: Announcement, role: Role | undefined): boolean {
  if (!announcement.audience || announcement.audience === 'all') return true
  return announcement.audience === role
}
