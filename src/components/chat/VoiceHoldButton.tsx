import { useEffect, useRef, useState } from 'react'
import { Mic, Loader2 } from 'lucide-react'

const ARM_MS = 4000

/**
 * Press and hold for 4 seconds to arm and start recording a voice note.
 * Release to send. Releasing before the 4 seconds are up cancels.
 */
export function VoiceHoldButton({ onRecorded, disabled }: { onRecorded: (blob: Blob, seconds: number) => void; disabled?: boolean }) {
  const [holdProgress, setHoldProgress] = useState(0)
  const [recording, setRecording] = useState(false)
  const [error, setError] = useState('')
  const timerRef = useRef<number | null>(null)
  const tickRef = useRef<number | null>(null)
  const recorderRef = useRef<MediaRecorder | null>(null)
  const chunksRef = useRef<BlobPart[]>([])
  const startedAtRef = useRef(0)

  const clearTimers = () => {
    if (timerRef.current) window.clearTimeout(timerRef.current)
    if (tickRef.current) window.clearInterval(tickRef.current)
    timerRef.current = null
    tickRef.current = null
  }

  useEffect(() => () => clearTimers(), [])

  const beginRecording = async () => {
    setError('')
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      const recorder = new MediaRecorder(stream)
      chunksRef.current = []
      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) chunksRef.current.push(event.data)
      }
      recorder.onstop = () => {
        stream.getTracks().forEach((track) => track.stop())
        const blob = new Blob(chunksRef.current, { type: recorder.mimeType || 'audio/webm' })
        const seconds = Math.round((Date.now() - startedAtRef.current) / 1000)
        if (blob.size > 0) onRecorded(blob, seconds)
      }
      startedAtRef.current = Date.now()
      recorder.start()
      recorderRef.current = recorder
      setRecording(true)
    } catch {
      setError('Microphone access was blocked.')
      setHoldProgress(0)
    }
  }

  const onPressStart = () => {
    if (disabled) return
    setHoldProgress(0)
    const startedAt = Date.now()
    tickRef.current = window.setInterval(() => {
      setHoldProgress(Math.min(100, ((Date.now() - startedAt) / ARM_MS) * 100))
    }, 80)
    timerRef.current = window.setTimeout(() => {
      void beginRecording()
    }, ARM_MS)
  }

  const onPressEnd = () => {
    clearTimers()
    setHoldProgress(0)
    if (recorderRef.current && recorderRef.current.state !== 'inactive') {
      recorderRef.current.stop()
      recorderRef.current = null
    }
    setRecording(false)
  }

  return (
    <div className="flex flex-col items-center">
      <button
        type="button"
        disabled={disabled}
        onMouseDown={onPressStart}
        onMouseUp={onPressEnd}
        onMouseLeave={onPressEnd}
        onTouchStart={onPressStart}
        onTouchEnd={onPressEnd}
        aria-label="Hold for 4 seconds to record a voice note"
        className={`relative flex h-11 w-11 items-center justify-center rounded-full text-white transition ${
          recording ? 'animate-pulse bg-red-600' : 'bg-brand-800 hover:bg-brand-700'
        } disabled:opacity-50`}
      >
        {recording ? <Loader2 size={18} className="animate-spin" /> : <Mic size={18} />}
        {holdProgress > 0 && !recording && (
          <span
            className="absolute inset-0 rounded-full border-2 border-amber-300"
            style={{ clipPath: `inset(${100 - holdProgress}% 0 0 0)` }}
            aria-hidden="true"
          />
        )}
      </button>
      <span className="mt-1 text-[10px] font-semibold text-stone-500">
        {recording ? 'Recording… release to send' : holdProgress > 0 ? 'Keep holding…' : 'Hold 4s'}
      </span>
      {error && <span className="text-[10px] font-semibold text-red-600">{error}</span>}
    </div>
  )
}
