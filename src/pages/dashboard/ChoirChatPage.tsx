import { useAuth } from '../../features/auth/AuthProvider'
import { canUseChoirChat } from '../../lib/permissions'
import { ChoirChat } from '../../components/chat/ChoirChat'

export function ChoirChatPage() {
  const { profile } = useAuth()

  if (!canUseChoirChat(profile)) {
    return (
      <section>
        <p className="eyebrow">Choir</p>
        <h1 className="page-title">Choir room</h1>
        <div className="mt-6 rounded-xl bg-amber-50 p-6 text-sm text-amber-900">
          The choir room is only open to approved choir members and the choir leadership.
        </div>
      </section>
    )
  }

  return (
    <section className="space-y-6">
      <div>
        <p className="eyebrow">Choir</p>
        <h1 className="page-title">Choir room</h1>
        <p className="mt-2 text-stone-600">
          Chat, share pictures, audio and video, hold the microphone for 4 seconds to record a voice note, or start a voice or video call.
        </p>
      </div>
      <ChoirChat />
    </section>
  )
}
