import { useEffect, useState, type FormEvent } from 'react'
import { CalendarDays, MapPin, Trash2 } from 'lucide-react'
import { MediaUploader } from '../common/MediaUploader'
import { cloudinary, type MediaAsset } from '../../lib/cloudinary'
import { createEvent, deleteEvent, subscribeToEvents, type ChurchEvent } from '../../lib/events'
import { useAuth } from '../../features/auth/AuthProvider'
import { db } from '../../lib/firebase'

export function EventManager({ canManage }: { canManage: boolean }) {
  const { user, profile } = useAuth()
  const [events, setEvents] = useState<ChurchEvent[]>([])
  const [loading, setLoading] = useState(true)
  const [title, setTitle] = useState('')
  const [date, setDate] = useState('')
  const [location, setLocation] = useState('')
  const [description, setDescription] = useState('')
  const [images, setImages] = useState<MediaAsset[]>([])
  const [error, setError] = useState('')
  const [saving, setSaving] = useState(false)

  useEffect(() =>
    subscribeToEvents((next) => {
      setEvents(next)
      setLoading(false)
    }), [])

  const submit = async (event: FormEvent) => {
    event.preventDefault()
    setError('')
    setSaving(true)
    try {
      // Only include fields that have real values — Firestore rejects `undefined`.
      const payload: Omit<ChurchEvent, 'id' | 'createdAt'> = {
        title: title.trim(),
        status: 'Scheduled',
        images,
      }
      if (description.trim()) payload.description = description.trim()
      if (date) payload.date = date
      if (location.trim()) payload.location = location.trim()
      if (user?.uid) payload.createdBy = user.uid
      if (profile?.displayName) payload.createdByName = profile.displayName

      await createEvent(payload)
      setTitle(''); setDate(''); setLocation(''); setDescription(''); setImages([])
    } catch (err) {
      const code = (err as { code?: string })?.code
      setError(
        code === 'permission-denied'
          ? 'Firestore rejected this write. Your role does not have permission to manage events.'
          : err instanceof Error ? err.message : 'Could not save this event.'
      )
    } finally {
      setSaving(false)
    }
  }

  const remove = async (id: string) => {
    try {
      await deleteEvent(id)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not delete this event.')
    }
  }

  return (
    <section className="space-y-6">
      <div>
        <p className="eyebrow">Church workspace</p>
        <h1 className="page-title">Events & Services</h1>
        <p className="mt-2 text-stone-600">
          {canManage ? 'Schedule parish events and upload pictures for the public events page.' : 'Upcoming parish events and services.'}
        </p>
      </div>

      {canManage && (
        <form onSubmit={submit} className="milk-card grid gap-3 p-5 md:grid-cols-2">
          <input required placeholder="Event title" value={title} onChange={(e) => setTitle(e.target.value)} className="field" />
          <input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="field" />
          <input placeholder="Location" value={location} onChange={(e) => setLocation(e.target.value)} className="field md:col-span-2" />
          <textarea placeholder="Description" value={description} onChange={(e) => setDescription(e.target.value)} rows={3} className="field md:col-span-2" />
          <div className="md:col-span-2">
            <MediaUploader folder="events" accept="image" value={images} onChange={setImages} label="Add event pictures" />
          </div>
          {error && <p className="text-sm font-medium text-red-600 md:col-span-2">{error}</p>}
          <div className="md:col-span-2">
            <button className="button-primary" disabled={saving}>{saving ? 'Saving…' : 'Add event'}</button>
          </div>
        </form>
      )}

      {loading ? (
        <p className="text-stone-500">Loading events…</p>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {events.map((event) => (
            <article key={event.id} className="milk-card overflow-hidden p-0">
              {event.images && event.images.length > 0 && (
                <div className="grid grid-cols-3 gap-0.5">
                  {event.images.slice(0, 3).map((asset) => (
                    <img key={asset.publicId} src={cloudinary.thumbUrl(asset, 320)} alt={event.title} className="h-28 w-full object-cover" loading="lazy" />
                  ))}
                </div>
              )}
              <div className="p-5">
                <h2 className="font-serif text-xl font-bold text-brand-900">{event.title}</h2>
                <div className="mt-1 flex flex-wrap gap-3 text-xs font-semibold text-stone-500">
                  {event.date && <span className="inline-flex items-center gap-1"><CalendarDays size={13} />{event.date}</span>}
                  {event.location && <span className="inline-flex items-center gap-1"><MapPin size={13} />{event.location}</span>}
                </div>
                <p className="mt-2 text-sm text-stone-600">{event.description}</p>
                {canManage && (
                  <button onClick={() => void remove(event.id)} className="mt-3 inline-flex items-center gap-1.5 text-xs font-bold text-red-600 hover:text-red-700">
                    <Trash2 size={13} /> Delete
                  </button>
                )}
              </div>
            </article>
          ))}
          {db && !events.length && <p className="text-stone-600">No events have been scheduled yet.</p>}
        </div>
      )}
    </section>
  )
}
