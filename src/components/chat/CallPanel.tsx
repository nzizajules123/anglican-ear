import { useEffect, useRef, useState } from 'react'
import { Phone, PhoneOff, Video } from 'lucide-react'
import { answerCall, startCall, subscribeToRoomCalls, type CallHandle, type CallKind } from '../../lib/webrtc'

export function CallPanel({ roomId, displayName }: { roomId: string; displayName: string }) {
  const [call, setCall] = useState<CallHandle | null>(null)
  const [incoming, setIncoming] = useState<Array<{ id: string; kind: CallKind; callerName: string; status: string }>>([])
  const [error, setError] = useState('')
  const [kind, setKind] = useState<CallKind>('audio')
  const localRef = useRef<HTMLVideoElement>(null)
  const remoteRef = useRef<HTMLVideoElement>(null)

  useEffect(() => subscribeToRoomCalls(roomId, setIncoming), [roomId])

  const attachRemote = (stream: MediaStream) => {
    if (remoteRef.current) remoteRef.current.srcObject = stream
  }

  const begin = async (nextKind: CallKind) => {
    setError('')
    try {
      const handle = await startCall(roomId, nextKind, displayName, attachRemote)
      setKind(nextKind)
      setCall(handle)
      if (localRef.current) localRef.current.srcObject = handle.localStream
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not start the call.')
    }
  }

  const join = async (callId: string, nextKind: CallKind) => {
    setError('')
    try {
      const handle = await answerCall(callId, attachRemote)
      setKind(nextKind)
      setCall(handle)
      if (localRef.current) localRef.current.srcObject = handle.localStream
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not join the call.')
    }
  }

  const end = async () => {
    await call?.hangUp()
    setCall(null)
    if (remoteRef.current) remoteRef.current.srcObject = null
    if (localRef.current) localRef.current.srcObject = null
  }

  return (
    <div className="milk-card space-y-3 p-4">
      <div className="flex flex-wrap items-center gap-2">
        <p className="mr-auto text-xs font-bold uppercase tracking-wider text-stone-500">Choir calls</p>
        {!call ? (
          <>
            <button onClick={() => void begin('audio')} className="inline-flex items-center gap-1.5 rounded-xl bg-brand-800 px-3 py-1.5 text-xs font-bold text-white hover:bg-brand-700">
              <Phone size={13} /> Voice call
            </button>
            <button onClick={() => void begin('video')} className="inline-flex items-center gap-1.5 rounded-xl bg-brand-800 px-3 py-1.5 text-xs font-bold text-white hover:bg-brand-700">
              <Video size={13} /> Video call
            </button>
          </>
        ) : (
          <button onClick={() => void end()} className="inline-flex items-center gap-1.5 rounded-xl bg-red-600 px-3 py-1.5 text-xs font-bold text-white hover:bg-red-500">
            <PhoneOff size={13} /> End call
          </button>
        )}
      </div>

      {error && <p className="text-xs font-semibold text-red-600">{error}</p>}

      {!call && incoming.length > 0 && (
        <div className="space-y-2">
          {incoming.map((item) => (
            <div key={item.id} className="flex items-center justify-between rounded-xl bg-amber-50 px-3 py-2">
              <p className="text-xs font-semibold text-amber-900">
                {item.callerName} started a {item.kind} call
              </p>
              <button onClick={() => void join(item.id, item.kind)} className="rounded-lg bg-emerald-600 px-2.5 py-1 text-[11px] font-bold text-white hover:bg-emerald-500">
                Join
              </button>
            </div>
          ))}
        </div>
      )}

      {call && kind === 'audio' && <p className="text-xs font-semibold text-emerald-700">Voice call in progress…</p>}

      {/* Always mounted so the media refs exist; visually hidden for voice-only calls. */}
      <div className={call && kind === 'video' ? 'grid gap-2 sm:grid-cols-2' : 'hidden'}>
        <video ref={localRef} autoPlay playsInline muted className="w-full rounded-xl bg-stone-900" />
        <video ref={remoteRef} autoPlay playsInline className="w-full rounded-xl bg-stone-900" />
      </div>
    </div>
  )
}
