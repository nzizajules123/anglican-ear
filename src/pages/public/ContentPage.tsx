import { useEffect, useState } from 'react'
import { subscribeToCollection, type ChurchCollection, type ChurchRecord } from '../../lib/church-data'
import { db } from '../../lib/firebase'

export function ContentPage({ title, description, collection }: { title: string; description: string; collection?: ChurchCollection }) {
  const [items, setItems] = useState<ChurchRecord[]>([])
  useEffect(() => collection ? subscribeToCollection(collection, setItems) : undefined, [collection])
  return <section className="mx-auto max-w-6xl px-6 py-16"><p className="eyebrow">Grace Community</p><h1 className="page-title">{title}</h1><p className="mt-5 max-w-2xl text-lg text-stone-600">{description}</p>{collection && <div className="mt-10 grid gap-4 md:grid-cols-2">{items.map((item) => <article key={item.id} className="milk-card p-6"><p className="text-xs font-bold uppercase tracking-wider text-brand-700">{item.date || 'Church community'}</p><h2 className="mt-2 font-serif text-2xl font-bold text-brand-900">{item.title}</h2><p className="mt-2 text-stone-600">{item.description}</p></article>)}{db && !items.length && <p className="text-stone-600">Nothing has been shared here yet. Please check back soon.</p>}</div>}</section>
}
