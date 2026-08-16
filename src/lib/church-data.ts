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

// Firestore's addDoc/updateDoc throw "invalid-argument" if ANY field is `undefined` —
// it won't just drop it. CollectionManager always sends optional fields (amount, date)
// as `undefined` when they're not used, so every write needs this cleanup first.
function stripUndefined<T extends Record<string, unknown>>(values: T): Partial<T> {
  const result: Partial<T> = {}
  for (const key of Object.keys(values) as (keyof T)[]) {
    if (values[key] !== undefined) result[key] = values[key]
  }
  return result
}

export function subscribeToCollection(name: ChurchCollection, callback: (items: ChurchRecord[]) => void) {
  if (!db) { callback([]); return () => undefined }
  return onSnapshot(query(collection(db, name), orderBy('createdAt', 'desc')), (snapshot) => callback(snapshot.docs.map((item) => ({ id: item.id, ...item.data() } as ChurchRecord))))
}

export async function createRecord(name: ChurchCollection, values: Omit<ChurchRecord, 'id' | 'createdAt'>) {
  if (!db) throw new Error('Firebase is not configured')
  return addDoc(collection(db, name), { ...stripUndefined(values), createdAt: serverTimestamp() })
}

export async function editRecord(name: ChurchCollection, id: string, values: Partial<Omit<ChurchRecord, 'id' | 'createdAt'>>) {
  if (!db) throw new Error('Firebase is not configured')
  return updateDoc(doc(db, name, id), stripUndefined(values))
}

export async function removeRecord(name: ChurchCollection, id: string) {
  if (!db) throw new Error('Firebase is not configured')
  return deleteDoc(doc(db, name, id))
}

// Contact form submissions have a different shape than ChurchRecord (name/email/message,
// not title/description), and are only ever created from the public site — so they get
// their own small set of helpers instead of being forced through the generic ones above.
export type ContactSubmission = {
  id: string
  name: string
  email: string
  subject?: string
  message: string
  createdAt?: unknown
}

export async function submitContactForm(values: Omit<ContactSubmission, 'id' | 'createdAt'>) {
  if (!db) throw new Error('Firebase is not configured')
  // subject is optional and ContactPage sends `undefined` when left blank — same
  // undefined-field problem as above, so it goes through stripUndefined too.
  return addDoc(collection(db, 'contactSubmissions'), { ...stripUndefined(values), createdAt: serverTimestamp() })
}

export function subscribeToContactSubmissions(callback: (items: ContactSubmission[]) => void) {
  if (!db) { callback([]); return () => undefined }
  return onSnapshot(query(collection(db, 'contactSubmissions'), orderBy('createdAt', 'desc')), (snapshot) =>
    callback(snapshot.docs.map((item) => ({ id: item.id, ...item.data() } as ContactSubmission)))
  )
}

export async function removeContactSubmission(id: string) {
  if (!db) throw new Error('Firebase is not configured')
  return deleteDoc(doc(db, 'contactSubmissions', id))
}