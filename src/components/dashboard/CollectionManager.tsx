import { useEffect, useState, type FormEvent } from 'react'
import { createRecord, removeRecord, subscribeToCollection, collectionLabels, type ChurchCollection, type ChurchRecord } from '../../lib/church-data'
import { db } from '../../lib/firebase'

const seed: ChurchRecord[] = [{ id: 'sample-1', title: 'Welcome to your workspace', description: 'Connect Firebase to save and manage real church data.', date: 'Today', status: 'Draft' }]

export function CollectionManager({ collection: collectionName, canManage = true, canCreate = canManage, canRead = true, includeAmount = false }: { collection: ChurchCollection; canManage?: boolean; canCreate?: boolean; canRead?: boolean; includeAmount?: boolean }) {
  const [items, setItems] = useState<ChurchRecord[]>([])
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [date, setDate] = useState('')
  const [amount, setAmount] = useState('')
  const [error, setError] = useState('')
  useEffect(() => canRead ? subscribeToCollection(collectionName, setItems) : undefined, [collectionName, canRead])
  const submit = async (event: FormEvent) => {
    event.preventDefault(); setError('')
    try { await createRecord(collectionName, { title, description, date: date || undefined, status: 'Published', amount: includeAmount ? Number(amount || 0) : undefined }); setTitle(''); setDescription(''); setDate(''); setAmount('') }
    catch { setError('This item could not be saved. Check Firebase configuration and your role permissions.') }
  }
  const visibleItems = canRead ? (db ? items : seed) : []
  return <section className="space-y-6"><div><p className="eyebrow">Church workspace</p><h1 className="page-title">{collectionLabels[collectionName]}</h1><p className="mt-2 text-stone-600">{canManage ? 'Create, organize, and keep this ministry area up to date.' : canCreate ? 'Share a request with your church care team.' : 'Stay connected with the latest information from your church.'}</p></div>
    {canCreate && <form onSubmit={submit} className="milk-card grid gap-3 p-5 md:grid-cols-2"><input required placeholder={`New ${collectionLabels[collectionName].toLowerCase().slice(0, -1)} title`} value={title} onChange={(e) => setTitle(e.target.value)} className="field" /><input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="field" /><textarea placeholder="Description or notes" value={description} onChange={(e) => setDescription(e.target.value)} className="field md:col-span-2" rows={3} />{includeAmount && <input type="number" min="0" step="0.01" placeholder="Amount" value={amount} onChange={(e) => setAmount(e.target.value)} className="field" />}<div className="md:col-span-2"><button className="button-primary">{canManage ? `Add ${collectionLabels[collectionName].slice(0, -1)}` : 'Send request'}</button></div></form>}
    {error && <p className="rounded-xl bg-red-50 p-3 text-sm text-red-700">{error}</p>}
    <div className="grid gap-4">{visibleItems.map((item) => <article key={item.id} className="milk-card flex items-start justify-between gap-4 p-5"><div><h2 className="font-serif text-xl font-bold text-brand-900">{item.title}</h2>{item.description && <p className="mt-2 text-sm text-stone-600">{item.description}</p>}<p className="mt-3 text-xs font-medium text-brand-700">{item.date || item.status || 'Active'}{typeof item.amount === 'number' ? ` · $${item.amount.toLocaleString()}` : ''}</p></div>{canManage && db && <button onClick={() => removeRecord(collectionName, item.id).catch(() => setError('Could not remove this item.'))} className="text-sm font-semibold text-red-700">Remove</button>}</article>)}</div>
  </section>
}
