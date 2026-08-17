import { useEffect, useState } from 'react'
import { CalendarDays, MapPin, X, ChevronLeft, ChevronRight } from 'lucide-react'
import { subscribeToEvents, type ChurchEvent } from '../../lib/events'
import { cloudinary } from '../../lib/cloudinary'
import { db } from '../../lib/firebase'

export function PublicEventsPage() {
  const [events, setEvents] = useState<ChurchEvent[]>([])
  const [selected, setSelected] = useState<ChurchEvent | null>(null)
  const [activeImage, setActiveImage] = useState(0)

  useEffect(() => subscribeToEvents(setEvents), [])

  useEffect(() => {
    if (!selected) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setSelected(null)
      if (e.key === 'ArrowRight') setActiveImage((i) => Math.min(i + 1, (selected.images?.length ?? 1) - 1))
      if (e.key === 'ArrowLeft') setActiveImage((i) => Math.max(i - 1, 0))
    }
    window.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      window.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [selected])

  function openEvent(event: ChurchEvent) {
    setSelected(event)
    setActiveImage(0)
  }

  return (
    <section className="mx-auto max-w-6xl px-6 py-16">
      <p className="eyebrow">Parish life</p>
      <h1 className="page-title">Events</h1>
      <p className="mt-5 max-w-2xl text-lg text-stone-600">
        Upcoming worship services, gatherings, and community events — with pictures from our parish.
      </p>

      <div className="mt-10 grid gap-8 md:grid-cols-2">
        {events.map((event) => {
          const cover = event.images?.[0]
          const extraCount = (event.images?.length ?? 0) - 1
          return (
            <article
              key={event.id}
              onClick={() => openEvent(event)}
              className="milk-card group cursor-pointer overflow-hidden p-0 transition-shadow hover:shadow-lg"
            >
              {cover ? (
                <div className="relative h-56 w-full overflow-hidden bg-stone-100">
                  <img
                    src={cloudinary.thumbUrl(cover, 800)}
                    alt={event.title}
                    className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                    loading="lazy"
                  />
                  {extraCount > 0 && (
                    <span className="absolute bottom-3 right-3 rounded-full bg-black/60 px-2.5 py-1 text-xs font-semibold text-white backdrop-blur-sm">
                      +{extraCount} more
                    </span>
                  )}
                </div>
              ) : (
                <div className="flex h-56 w-full items-center justify-center bg-stone-100 text-stone-400">
                  <CalendarDays size={40} />
                </div>
              )}
              <div className="p-6">
                <h2 className="font-serif text-2xl font-bold text-brand-900">{event.title}</h2>
                <div className="mt-1 flex flex-wrap gap-3 text-xs font-semibold text-stone-500">
                  {event.date && (
                    <span className="inline-flex items-center gap-1">
                      <CalendarDays size={13} />
                      {event.date}
                    </span>
                  )}
                  {event.location && (
                    <span className="inline-flex items-center gap-1">
                      <MapPin size={13} />
                      {event.location}
                    </span>
                  )}
                </div>
                {event.description && <p className="mt-2 line-clamp-2 text-stone-600">{event.description}</p>}
              </div>
            </article>
          )
        })}
        {db && !events.length && <p className="text-stone-600">Nothing has been shared here yet. Please check back soon.</p>}
      </div>

      {selected && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm"
          onClick={() => setSelected(null)}
        >
          <div
            className="relative max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-2xl bg-white shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setSelected(null)}
              className="absolute right-4 top-4 z-10 rounded-full bg-black/50 p-2 text-white transition hover:bg-black/70"
              aria-label="Close"
            >
              <X size={20} />
            </button>

            {selected.images && selected.images.length > 0 && (
              <div className="relative h-72 w-full bg-stone-100 sm:h-96">
                <img
                  src={cloudinary.thumbUrl(selected.images[activeImage], 1000)}
                  alt={selected.title}
                  className="h-full w-full object-cover"
                />
                {selected.images.length > 1 && (
                  <>
                    <button
                      onClick={() => setActiveImage((i) => Math.max(i - 1, 0))}
                      disabled={activeImage === 0}
                      className="absolute left-3 top-1/2 -translate-y-1/2 rounded-full bg-black/50 p-2 text-white transition hover:bg-black/70 disabled:opacity-30"
                      aria-label="Previous image"
                    >
                      <ChevronLeft size={20} />
                    </button>
                    <button
                      onClick={() => setActiveImage((i) => Math.min(i + 1, selected.images!.length - 1))}
                      disabled={activeImage === selected.images.length - 1}
                      className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full bg-black/50 p-2 text-white transition hover:bg-black/70 disabled:opacity-30"
                      aria-label="Next image"
                    >
                      <ChevronRight size={20} />
                    </button>
                    <div className="absolute bottom-3 left-1/2 flex -translate-x-1/2 gap-1.5">
                      {selected.images.map((_, i) => (
                        <button
                          key={i}
                          onClick={() => setActiveImage(i)}
                          className={`h-1.5 rounded-full transition-all ${
                            i === activeImage ? 'w-5 bg-white' : 'w-1.5 bg-white/50'
                          }`}
                          aria-label={`Go to image ${i + 1}`}
                        />
                      ))}
                    </div>
                  </>
                )}
              </div>
            )}

            <div className="p-8">
              <h2 className="font-serif text-3xl font-bold text-brand-900">{selected.title}</h2>
              <div className="mt-2 flex flex-wrap gap-4 text-sm font-semibold text-stone-500">
                {selected.date && (
                  <span className="inline-flex items-center gap-1.5">
                    <CalendarDays size={15} />
                    {selected.date}
                  </span>
                )}
                {selected.location && (
                  <span className="inline-flex items-center gap-1.5">
                    <MapPin size={15} />
                    {selected.location}
                  </span>
                )}
              </div>
              {selected.description && (
                <p className="mt-4 whitespace-pre-line text-stone-700">{selected.description}</p>
              )}
            </div>
          </div>
        </div>
      )}
    </section>
  )
}