import { addDoc, collection, deleteDoc, doc, limit, onSnapshot, orderBy, query, serverTimestamp, setDoc } from 'firebase/firestore'
import { db } from './firebase'
import type { MediaAsset } from './cloudinary'

export const CHOIR_ROOM_ID = 'choir-general'

export type ChatMessageKind = 'text' | 'image' | 'audio' | 'video' | 'voice'

export type ChatMessage = {
  id: string
  kind: ChatMessageKind
  text?: string
  media?: MediaAsset
  senderId: string
  senderName: string
  createdAt?: { seconds: number } | null
}

export function subscribeToMessages(roomId: string, handler: (messages: ChatMessage[]) => void, max = 200) {
  if (!db) {
    handler([])
    return () => {}
  }
  const q = query(collection(db, 'chatRooms', roomId, 'messages'), orderBy('createdAt', 'asc'), limit(max))
  return onSnapshot(
    q,
    (snapshot) => handler(snapshot.docs.map((d) => ({ id: d.id, ...(d.data() as Omit<ChatMessage, 'id'>) }))),
    (error) => {
      console.error('Failed to load chat messages:', error)
      handler([])
    }
  )
}

export async function sendMessage(roomId: string, message: Omit<ChatMessage, 'id' | 'createdAt'>) {
  if (!db) throw new Error('Firebase is not configured.')
  await setDoc(doc(db, 'chatRooms', roomId), { name: 'Choir room', updatedAt: serverTimestamp() }, { merge: true })
  return addDoc(collection(db, 'chatRooms', roomId, 'messages'), { ...message, createdAt: serverTimestamp() })
}

export async function deleteMessage(roomId: string, messageId: string) {
  if (!db) throw new Error('Firebase is not configured.')
  return deleteDoc(doc(db, 'chatRooms', roomId, 'messages', messageId))
}

export function markRoomRead(roomId: string, uid: string, lastMessageId?: string) {
  if (!uid || !lastMessageId) return
  try {
    window.localStorage.setItem(`chat-read:${roomId}:${uid}`, lastMessageId)
  } catch {
    /* storage unavailable */
  }
}

export function getRoomRead(roomId: string, uid: string): string | null {
  try {
    return window.localStorage.getItem(`chat-read:${roomId}:${uid}`)
  } catch {
    return null
  }
}
