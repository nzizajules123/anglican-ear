import { addDoc, collection, deleteDoc, doc, onSnapshot, orderBy, query, serverTimestamp, updateDoc } from 'firebase/firestore'
import { db } from './firebase'

export type ChurchCollection = 'announcements' | 'events' | 'sermons' | 'ministries' | 'giving' | 'prayerRequests'

export type ChurchRecord = {
  id: string
  title: string
  description?: string
  date?: string
  status?: string
  amount?: number
  createdAt?: unknown
}

export const collectionLabels: Record<ChurchCollection, string> = {
  announcements: 'Announcements', events: 'Events', sermons: 'Sermons', ministries: 'Ministries', giving: 'Giving', prayerRequests: 'Prayer requests',
}

export function subscribeToCollection(name: ChurchCollection, callback: (items: ChurchRecord[]) => void) {
  if (!db) { callback([]); return () => undefined }
  return onSnapshot(query(collection(db, name), orderBy('createdAt', 'desc')), (snapshot) => callback(snapshot.docs.map((item) => ({ id: item.id, ...item.data() } as ChurchRecord))))
}

export async function createRecord(name: ChurchCollection, values: Omit<ChurchRecord, 'id' | 'createdAt'>) {
  if (!db) throw new Error('Firebase is not configured')
  return addDoc(collection(db, name), { ...values, createdAt: serverTimestamp() })
}

export async function editRecord(name: ChurchCollection, id: string, values: Partial<Omit<ChurchRecord, 'id' | 'createdAt'>>) {
  if (!db) throw new Error('Firebase is not configured')
  return updateDoc(doc(db, name, id), values)
}

export async function removeRecord(name: ChurchCollection, id: string) {
  if (!db) throw new Error('Firebase is not configured')
  return deleteDoc(doc(db, name, id))
}
