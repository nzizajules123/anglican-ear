import { useEffect, useState } from 'react'
import { CalendarDays, MapPin } from 'lucide-react'
import { subscribeToEvents, type ChurchEvent } from '../../lib/events'
import { cloudinary } from '../../lib/cloudinary'
import { db } from '../../lib/firebase'

export function PublicEventsPage() {
  const [events, setEvents] = useState<ChurchEvent[]>([])

  useEffect(() => subscribeToEvents(setEvents), [])

  return (
    <section className="mx-auto max-w-6xl px-6 py-16">
      <p className="eyebrow">Parish life</p>
      <h1 className="page-title">Events</h1>
      <p className="mt-5 max-w-2xl text-lg text-stone-600">
        Upcoming worship services, gatherings, and community events — with pictures from our parish.
      </p>

      <div className="mt-10 grid gap-6 md:grid-cols-2">
        {events.map((event) => (
          <article key={event.id} className="milk-card overflow-hidden p-0">
            {event.images && event.images.length > 0 && (
              <div className="grid grid-cols-3 gap-0.5">
                {event.images.slice(0, 3).map((asset) => (
                  <img key={asset.publicId} src={cloudinary.thumbUrl(asset, 400)} alt={event.title} className="h-32 w-full object-cover" loading="lazy" />
                ))}
              </div>
            )}
            <div className="p-6">
              <h2 className="font-serif text-2xl font-bold text-brand-900">{event.title}</h2>
              <div className="mt-1 flex flex-wrap gap-3 text-xs font-semibold text-stone-500">
                {event.date && <span className="inline-flex items-center gap-1"><CalendarDays size={13} />{event.date}</span>}
                {event.location && <span className="inline-flex items-center gap-1"><MapPin size={13} />{event.location}</span>}
              </div>
              <p className="mt-2 text-stone-600">{event.description}</p>
            </div>
          </article>
        ))}
        {db && !events.length && <p className="text-stone-600">Nothing has been shared here yet. Please check back soon.</p>}
      </div>
    </section>
  )
}
