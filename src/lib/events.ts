import { addDoc, collection, deleteDoc, doc, onSnapshot, orderBy, query, serverTimestamp, updateDoc } from 'firebase/firestore'
import { db } from './firebase'
import type { MediaAsset } from './cloudinary'

export type ChurchEvent = {
  id: string
  title: string
  description?: string
  date?: string
  location?: string
  category?: string
  status?: string
  images?: MediaAsset[]
  createdBy?: string
  createdByName?: string
  createdAt?: unknown
}

/** Firestore rejects any field whose value is `undefined`. Strip them before writes. */
function stripUndefined(values: Record<string, unknown>): Record<string, unknown> {
  const result: Record<string, unknown> = {}
  for (const key of Object.keys(values)) {
    if (values[key] !== undefined) result[key] = values[key]
  }
  return result
}

export function subscribeToEvents(handler: (items: ChurchEvent[]) => void) {
  if (!db) {
    handler([])
    return () => {}
  }
  const q = query(collection(db, 'events'), orderBy('createdAt', 'desc'))
  return onSnapshot(
    q,
    (snapshot) => handler(snapshot.docs.map((d) => ({ id: d.id, ...(d.data() as Omit<ChurchEvent, 'id'>) }))),
    (error) => {
      console.error('Failed to load events:', error)
      handler([])
    }
  )
}

export async function createEvent(input: Omit<ChurchEvent, 'id' | 'createdAt'>) {
  if (!db) throw new Error('Firebase is not configured.')
  const data = {
    ...stripUndefined({ ...input }),
    createdAt: serverTimestamp(),
  }
  return addDoc(collection(db, 'events'), data)
}

export async function updateEvent(id: string, input: Partial<ChurchEvent>) {
  if (!db) throw new Error('Firebase is not configured.')
  const data = stripUndefined({ ...input })
  return updateDoc(doc(db, 'events', id), data)
}

export async function deleteEvent(id: string) {
  if (!db) throw new Error('Firebase is not configured.')
  return deleteDoc(doc(db, 'events', id))
}
