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
  return addDoc(collection(db, 'events'), { ...input, createdAt: serverTimestamp() })
}

export async function updateEvent(id: string, input: Partial<ChurchEvent>) {
  if (!db) throw new Error('Firebase is not configured.')
  return updateDoc(doc(db, 'events', id), input)
}

export async function deleteEvent(id: string) {
  if (!db) throw new Error('Firebase is not configured.')
  return deleteDoc(doc(db, 'events', id))
}
