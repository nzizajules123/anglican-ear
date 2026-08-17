import { useEffect, useMemo, useRef, useState, type FormEvent } from 'react'
import { Paperclip, Send, Trash2 } from 'lucide-react'
import { useAuth } from '../../features/auth/AuthProvider'
import { cloudinary, isAllowedType, uploadToCloudinary, type MediaAsset } from '../../lib/cloudinary'
import { CHOIR_ROOM_ID, deleteMessage, markRoomRead, sendMessage, subscribeToMessages, type ChatMessage, type ChatMessageKind } from '../../lib/chat'
import { VoiceHoldButton } from './VoiceHoldButton'
import { CallPanel } from './CallPanel'

function kindForAsset(asset: MediaAsset, fallback: ChatMessageKind = 'image'): ChatMessageKind {
  if (asset.resourceType === 'image') return 'image'
  if (asset.resourceType === 'video') return 'video'
  return fallback
}

function timeLabel(seconds?: number) {
  if (!seconds) return ''
  return new Date(seconds * 1000).toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' })
}

export function ChoirChat({ roomId = CHOIR_ROOM_ID }: { roomId?: string }) {
  const { user, profile } = useAuth()
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [text, setText] = useState('')
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)
  const fileRef = useRef<HTMLInputElement>(null)
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => subscribeToMessages(roomId, setMessages), [roomId])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
    if (user && messages.length) markRoomRead(roomId, user.uid, messages[messages.length - 1].id)
  }, [messages, roomId, user])

  const author = useMemo(
    () => ({ senderId: user?.uid || 'anonymous', senderName: profile?.displayName || 'Choir member' }),
    [user, profile]
  )

  const push = async (payload: Omit<ChatMessage, 'id' | 'createdAt' | 'senderId' | 'senderName'>) => {
    setError('')
    try {
      await sendMessage(roomId, { ...payload, ...author })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Message could not be sent.')
    }
  }

  const submitText = async (event: FormEvent) => {
    event.preventDefault()
    const trimmed = text.trim()
    if (!trimmed) return
    setText('')
    await push({ kind: 'text', text: trimmed })
  }

  const attach = async (files: FileList | null) => {
    if (!files?.length) return
    setBusy(true)
    setError('')
    try {
      for (const file of Array.from(files)) {
        if (!isAllowedType(file, 'media')) throw new Error(`"${file.name}" is not an allowed file type.`)
        const asset = await uploadToCloudinary(file, { folder: `choir/${roomId}` })
        await push({ kind: kindForAsset(asset, file.type.startsWith('audio/') ? 'audio' : 'image'), media: asset })
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Upload failed.')
    } finally {
      setBusy(false)
      if (fileRef.current) fileRef.current.value = ''
    }
  }

  const sendVoiceNote = async (blob: Blob, seconds: number) => {
    setBusy(true)
    setError('')
    try {
      const asset = await uploadToCloudinary(blob, { folder: `choir/${roomId}/voice-notes`, fileName: `voice-note-${Date.now()}.webm` })
      await push({ kind: 'voice', media: asset, text: `${seconds}s voice note` })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Voice note could not be sent.')
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="space-y-4">
      <CallPanel roomId={roomId} displayName={author.senderName} />

      <div className="milk-card flex h-[60vh] flex-col p-0">
        <div className="flex-1 space-y-3 overflow-y-auto p-4">
          {messages.length === 0 && <p className="text-sm text-stone-500">No messages yet. Say hello to the choir.</p>}
          {messages.map((message) => {
            const mine = message.senderId === author.senderId
            return (
              <div key={message.id} className={`flex ${mine ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[80%] rounded-2xl px-3.5 py-2.5 ${mine ? 'bg-brand-800 text-white' : 'bg-stone-100 text-stone-900'}`}>
                  {!mine && <p className="text-[11px] font-bold text-brand-700">{message.senderName}</p>}

                  {message.kind === 'text' && <p className="whitespace-pre-wrap text-sm">{message.text}</p>}

                  {message.kind === 'image' && message.media && (
                    <a href={message.media.url} target="_blank" rel="noreferrer">
                      <img src={cloudinary.thumbUrl(message.media, 480)} alt="Shared" className="mt-1 max-h-60 rounded-xl object-cover" loading="lazy" />
                    </a>
                  )}

                  {(message.kind === 'audio' || message.kind === 'voice') && message.media && (
                    <audio controls src={message.media.url} className="mt-1 w-56" />
                  )}

                  {message.kind === 'video' && message.media && (
                    <video controls src={message.media.url} className="mt-1 max-h-60 w-64 rounded-xl bg-black" />
                  )}

                  <div className={`mt-1 flex items-center gap-2 text-[10px] ${mine ? 'text-white/70' : 'text-stone-500'}`}>
                    <span>{timeLabel(message.createdAt?.seconds)}</span>
                    {mine && (
                      <button onClick={() => void deleteMessage(roomId, message.id)} aria-label="Delete message" className="hover:text-red-300">
                        <Trash2 size={11} />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            )
          })}
          <div ref={bottomRef} />
        </div>

        {error && <p className="px-4 pb-1 text-xs font-semibold text-red-600">{error}</p>}

        <form onSubmit={submitText} className="flex items-end gap-2 border-t border-stone-100 p-3">
          <button
            type="button"
            onClick={() => fileRef.current?.click()}
            disabled={busy}
            aria-label="Attach image, audio or video"
            className="flex h-11 w-11 items-center justify-center rounded-full border border-stone-200 text-stone-600 hover:bg-stone-50 disabled:opacity-50"
          >
            <Paperclip size={18} />
          </button>
          <input ref={fileRef} type="file" hidden multiple accept="image/*,video/*,audio/*" onChange={(event) => void attach(event.target.files)} />

          <input
            value={text}
            onChange={(event) => setText(event.target.value)}
            placeholder={busy ? 'Uploading…' : 'Message the choir'}
            className="field h-11 flex-1"
          />

          <VoiceHoldButton onRecorded={(blob, seconds) => void sendVoiceNote(blob, seconds)} disabled={busy} />

          <button type="submit" aria-label="Send message" className="flex h-11 w-11 items-center justify-center rounded-full bg-brand-800 text-white hover:bg-brand-700">
            <Send size={18} />
          </button>
        </form>
      </div>
    </div>
  )
}
