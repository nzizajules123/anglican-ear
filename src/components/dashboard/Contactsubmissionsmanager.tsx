import { useEffect, useState } from 'react'
import { subscribeToContactSubmissions, removeContactSubmission, type ContactSubmission } from '../../lib/church-data'
import { db } from '../../lib/firebase'

export function ContactSubmissionsManager({ canManage = true }: { canManage?: boolean }) {
  const [items, setItems] = useState<ContactSubmission[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    setLoading(true)
    const unsubscribe = subscribeToContactSubmissions((next) => {
      setItems(next)
      setLoading(false)
    })
    return unsubscribe
  }, [])

  return <section className="space-y-6">
    <div>
      <p className="eyebrow">Church workspace</p>
      <h1 className="page-title">Contact messages</h1>
      <p className="mt-2 text-stone-600">Messages sent through the public contact form.</p>
    </div>

    {!db && <p className="rounded-xl bg-amber-50 p-4 text-sm text-amber-900">Connect Firebase to view real submissions.</p>}
    {error && <p className="rounded-xl bg-red-50 p-3 text-sm text-red-700">{error}</p>}

    {loading ? (
      <div className="grid gap-4">
        {[...Array(3)].map((_, i) => <div key={i} className="h-24 animate-pulse rounded-[1.6rem] bg-stone-200" />)}
      </div>
    ) : db && items.length === 0 ? (
      <p className="text-stone-600">No messages yet.</p>
    ) : (
      <div className="grid gap-4">
        {items.map((item) => (
          <article key={item.id} className="milk-card flex items-start justify-between gap-4 p-5">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-brand-700">{item.subject || 'General inquiry'}</p>
              <h2 className="mt-1 font-serif text-xl font-bold text-brand-900">{item.name}</h2>
              <p className="text-sm text-stone-500">{item.email}</p>
              <p className="mt-3 text-sm text-stone-600">{item.message}</p>
            </div>
            {canManage && db && (
              <button
                onClick={() => removeContactSubmission(item.id).catch(() => setError('Could not remove this message.'))}
                className="text-sm font-semibold text-red-700"
              >
                Remove
              </button>
            )}
          </article>
        ))}
      </div>
    )}
  </section>
}