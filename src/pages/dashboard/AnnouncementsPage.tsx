import { useState, type FormEvent } from 'react'
import { Trash2 } from 'lucide-react'
import { useAuth } from '../../features/auth/AuthProvider'
import { can } from '../../lib/permissions'
import { createAnnouncement, deleteAnnouncement, type AnnouncementAudience } from '../../lib/announcements'
import { useAnnouncementFeed } from '../../hooks/useAnnouncementFeed'
import { roleLabels, roles } from '../../types/roles'

export function AnnouncementsPage() {
  const { user, profile } = useAuth()
  const { announcements, markAllRead } = useAnnouncementFeed()
  const canPost = can(profile?.role, 'postAnnouncements')
  const [title, setTitle] = useState('')
  const [message, setMessage] = useState('')
  const [audience, setAudience] = useState<AnnouncementAudience>('all')
  const [error, setError] = useState('')
  const [saving, setSaving] = useState(false)

  const submit = async (event: FormEvent) => {
    event.preventDefault()
    setError('')
    setSaving(true)
    try {
      await createAnnouncement({
        title,
        message,
        audience,
        createdBy: user?.uid,
        createdByName: profile?.displayName,
      })
      setTitle(''); setMessage(''); setAudience('all')
      markAllRead()
    } catch (err) {
      const code = (err as { code?: string })?.code
      setError(code === 'permission-denied' ? 'Your role cannot post announcements.' : err instanceof Error ? err.message : 'Could not post.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <section className="space-y-6">
      <div>
        <p className="eyebrow">Parish notices</p>
        <h1 className="page-title">Announcements</h1>
        <p className="mt-2 text-stone-600">
          {canPost ? 'Post a notice — everyone in its audience sees it in their notification bar straight away.' : 'Notices shared with you by the parish office.'}
        </p>
      </div>

      {canPost && (
        <form onSubmit={submit} className="milk-card grid gap-3 p-5 md:grid-cols-2">
          <input required placeholder="Announcement title" value={title} onChange={(e) => setTitle(e.target.value)} className="field" />
          <select value={audience} onChange={(e) => setAudience(e.target.value as AnnouncementAudience)} className="field">
            <option value="all">Everyone</option>
            {roles.map((role) => (
              <option key={role} value={role}>{roleLabels[role]} only</option>
            ))}
          </select>
          <textarea required placeholder="What do you want the parish to know?" value={message} onChange={(e) => setMessage(e.target.value)} rows={3} className="field md:col-span-2" />
          {error && <p className="text-sm font-medium text-red-600 md:col-span-2">{error}</p>}
          <div className="md:col-span-2">
            <button className="button-primary" disabled={saving}>{saving ? 'Posting…' : 'Post announcement'}</button>
          </div>
        </form>
      )}

      <div className="space-y-3">
        {announcements.length === 0 && <p className="text-stone-600">No announcements yet.</p>}
        {announcements.map((item) => (
          <article key={item.id} className="milk-card flex items-start justify-between gap-4 p-5">
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="font-serif text-xl font-bold text-brand-900">{item.title}</h2>
                <span className="rounded-full bg-brand-50 px-2 py-0.5 text-[11px] font-bold text-brand-800">
                  {item.audience && item.audience !== 'all' ? `${roleLabels[item.audience]} only` : 'Everyone'}
                </span>
              </div>
              <p className="mt-2 text-stone-600">{item.message}</p>
              {item.createdByName && <p className="mt-2 text-xs text-stone-400">Posted by {item.createdByName}</p>}
            </div>
            {canPost && (
              <button onClick={() => void deleteAnnouncement(item.id)} aria-label="Delete announcement" className="text-red-600 hover:text-red-700">
                <Trash2 size={15} />
              </button>
            )}
          </article>
        ))}
      </div>
    </section>
  )
}
