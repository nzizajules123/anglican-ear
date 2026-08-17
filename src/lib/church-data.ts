import { addDoc, collection, deleteDoc, doc, onSnapshot, orderBy, query, serverTimestamp, updateDoc } from 'firebase/firestore'
import { db } from './firebase'
import { stripUndefined } from './firestoreUtils'

export type ChurchCollection = 'announcements' | 'events' | 'sermons' | 'ministries' | 'giving' | 'prayerRequests'

export type ChurchRecord = {
  id: string
  title: string
  description?: string
  date?: string
  status?: string
  amount?: number
  category?: string
  pastoralNotes?: string
  preacher?: string
  scripture?: string
  location?: string
  hymnNumber?: string
  leader?: string
  memberCount?: number
  createdAt?: unknown
}

export const collectionLabels: Record<ChurchCollection, string> = {
  announcements: 'Announcements',
  events: 'Events',
  sermons: 'Sermons',
  ministries: 'Ministries',
  giving: 'Giving',
  prayerRequests: 'Prayer requests',
}

// Contact form submissions
export type ContactSubmission = {
  id: string
  name: string
  email: string
  subject?: string
  message: string
  status?: 'new' | 'replied' | 'archived'
  category?: string
  createdAt?: unknown
}

export function subscribeToCollection(name: ChurchCollection, callback: (items: ChurchRecord[]) => void) {
  if (!db) {
    callback([])
    return () => undefined
  }
  return onSnapshot(
    query(collection(db, name), orderBy('createdAt', 'desc')),
    (snapshot) => {
      callback(snapshot.docs.map((item) => ({ id: item.id, ...item.data() } as ChurchRecord)))
    },
    (err) => {
      console.warn(`Firestore read error on ${name}:`, err)
      callback([])
    }
  )
}

export async function createRecord(name: ChurchCollection, values: Omit<ChurchRecord, 'id' | 'createdAt'>) {
  if (!db) throw new Error('Firebase is not configured.')
  return addDoc(collection(db, name), { ...stripUndefined(values), createdAt: serverTimestamp() })
}

export async function editRecord(name: ChurchCollection, id: string, values: Partial<Omit<ChurchRecord, 'id' | 'createdAt'>>) {
  if (!db) throw new Error('Firebase is not configured.')
  return updateDoc(doc(db, name, id), stripUndefined(values))
}

export async function removeRecord(name: ChurchCollection, id: string) {
  if (!db) throw new Error('Firebase is not configured.')
  return deleteDoc(doc(db, name, id))
}

export async function submitContactForm(values: Omit<ContactSubmission, 'id' | 'createdAt'>) {
  if (!db) throw new Error('Firebase is not configured.')
  return addDoc(collection(db, 'contactSubmissions'), { ...stripUndefined(values), createdAt: serverTimestamp() })
}

export function subscribeToContactSubmissions(callback: (items: ContactSubmission[]) => void) {
  if (!db) {
    callback([])
    return () => undefined
  }
  return onSnapshot(
    query(collection(db, 'contactSubmissions'), orderBy('createdAt', 'desc')),
    (snapshot) => {
      callback(snapshot.docs.map((item) => ({ id: item.id, ...item.data() } as ContactSubmission)))
    },
    (err) => {
      console.warn('Firestore read error on contactSubmissions:', err)
      callback([])
    }
  )
}

export async function removeContactSubmission(id: string) {
  if (!db) throw new Error('Firebase is not configured.')
  return deleteDoc(doc(db, 'contactSubmissions', id))
}