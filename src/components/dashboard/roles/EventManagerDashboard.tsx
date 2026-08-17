import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../../features/auth/AuthProvider'
import {
  subscribeToCollection,
  createRecord,
  removeRecord,
  ChurchRecord,
} from '../../../lib/church-data'
import {
  Calendar,
  Clock,
  MapPin,
  Users,
  CheckSquare,
  Plus,
  Trash2,
  CheckCircle,
  Building,
  Sparkles,
} from 'lucide-react'

export function EventManagerDashboard() {
  const { profile } = useAuth()
  const [events, setEvents] = useState<ChurchRecord[]>([])
  const [feedback, setFeedback] = useState<string | null>(null)

  // Event creation form
  const [showForm, setShowForm] = useState(false)
  const [title, setTitle] = useState('')
  const [date, setDate] = useState('')
  const [location, setLocation] = useState('Main Sanctuary')
  const [category, setCategory] = useState('Liturgical Service')
  const [description, setDescription] = useState('')

  // Facility Checklist
  const [checklist, setChecklist] = useState([
    { task: 'Altar flowers & seasonal liturgical vestments checked', done: true, area: 'Main Nave' },
    { task: 'Sound system microphones & wireless lapels tested', done: true, area: 'Sanctuary' },
    { task: 'Memorial Hall heating & coffee hour refreshments setup', done: false, area: 'Parish Hall' },
    { task: 'Service bulletins printed & placed in narthex for ushers', done: true, area: 'Narthex' },
    { task: 'Choir vestry sheet music folders organized', done: false, area: 'Choir Vestry' },
  ])

  useEffect(() => {
    return subscribeToCollection('events', (items) => setEvents(items))
  }, [])

  const handleCreateEvent = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!title) return
    try {
      await createRecord('events', {
        title,
        date: date || 'Upcoming',
        location,
        category,
        description,
        status: 'Scheduled',
      })
      setShowForm(false)
      setTitle('')
      setDescription('')
      setDate('')
      setFeedback('Parish event added to liturgical calendar.')
      setTimeout(() => setFeedback(null), 3500)
    } catch {
      setFeedback('Failed to schedule event.')
    }
  }

  const handleDeleteEvent = async (id: string) => {
    try {
      await removeRecord('events', id)
      setFeedback('Event removed.')
      setTimeout(() => setFeedback(null), 3000)
    } catch {
      setFeedback('Could not remove event.')
    }
  }

  const toggleChecklist = (index: number) => {
    setChecklist((prev) =>
      prev.map((item, idx) => (idx === index ? { ...item, done: !item.done } : item))
    )
  }

  return (
    <section className="space-y-8">
      {/* Banner */}
      <div className="rounded-3xl border border-brand-500/20 bg-gradient-to-r from-brand-900 via-brand-800 to-brand-900 p-6 text-white shadow-xl md:p-8">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-purple-400/20 px-3 py-1 text-xs font-bold uppercase tracking-wider text-purple-300">
                <Calendar size={13} /> Parish Events & Facility Scheduling
              </span>
              <span className="inline-flex items-center gap-1 rounded-full bg-white/10 px-2.5 py-0.5 text-xs text-brand-100">
                Parish Coordinator
              </span>
            </div>
            <h1 className="mt-3 font-serif text-3xl font-bold tracking-tight text-white md:text-4xl">
              Parish Events & Facilities Management
            </h1>
            <p className="mt-2 max-w-2xl text-sm text-brand-100">
              Welcome, <span className="font-semibold text-white">{profile?.displayName || 'Event Manager'}</span>. Coordinating Sunday Eucharists, choral evensongs, weddings, hall rentals, and logistical readiness.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => setShowForm(!showForm)}
              className="flex items-center gap-2 rounded-xl bg-purple-500 px-4 py-2.5 text-sm font-bold text-white shadow-md transition hover:bg-purple-400 active:scale-95"
            >
              <Plus size={16} />
              + Schedule Event
            </button>
          </div>
        </div>
      </div>

      {feedback && (
        <div className="flex items-center gap-2 rounded-2xl bg-purple-50 p-4 text-sm font-semibold text-purple-900 border border-purple-200 shadow-sm animate-fade-in">
          <CheckCircle size={18} className="text-purple-600" />
          <span>{feedback}</span>
        </div>
      )}

      {/* Inline Event Creator Form */}
      {showForm && (
        <form onSubmit={handleCreateEvent} className="milk-card p-6 space-y-4 border-2 border-purple-300">
          <div className="flex items-center justify-between">
            <h2 className="font-serif text-2xl font-bold text-brand-900">Schedule Parish Event or Service</h2>
            <span className="text-xs font-semibold text-stone-500">Will appear on the church public calendar</span>
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-stone-700">Event Title *</label>
              <input
                required
                placeholder="e.g. Festival Choral Evensong & Reception"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="field mt-1"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-stone-700">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="field mt-1"
              >
                <option value="Liturgical Service">Liturgical Service</option>
                <option value="Sacramental & Rites">Sacramental (Baptism/Wedding)</option>
                <option value="Parish Fellowship">Parish Fellowship</option>
                <option value="Music Concert">Music Concert & Recital</option>
                <option value="Hall Booking">Parish Hall Rental</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-stone-700">Date</label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="field mt-1"
              />
            </div>
            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-stone-700">Facility / Location</label>
              <input
                placeholder="e.g. Main Nave, Memorial Parish Hall, Lady Chapel"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="field mt-1"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-stone-700">Logistics & Program Notes</label>
            <textarea
              rows={3}
              placeholder="Detail setup requirements, equipment needed, clergy officiating..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="field mt-1"
            />
          </div>

          <div className="flex gap-2">
            <button type="submit" className="button-primary bg-purple-700 hover:bg-purple-800">
              Add to Calendar
            </button>
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="rounded-xl bg-stone-200 px-4 py-2 text-sm font-semibold text-stone-800 hover:bg-stone-300"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      {/* Events Grid & Readiness Checklist */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Events List */}
        <div className="milk-card p-6 space-y-4 lg:col-span-2">
          <div className="flex items-center justify-between">
            <h2 className="font-serif text-2xl font-bold text-brand-900">Upcoming Scheduled Events</h2>
            <span className="rounded-full bg-brand-50 px-3 py-1 text-xs font-bold text-brand-800">
              {events.length} Events
            </span>
          </div>

          <div className="space-y-3">
            {events.map((evt) => (
              <article
                key={evt.id}
                className="flex items-start justify-between gap-4 rounded-2xl border border-stone-200/80 bg-white/80 p-5 shadow-xs transition hover:border-purple-300"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="rounded-full bg-purple-50 px-2.5 py-0.5 text-[11px] font-bold text-purple-800">
                      {evt.category || 'Parish Event'}
                    </span>
                    <span className="text-xs text-stone-400">• {evt.date || 'Upcoming'}</span>
                  </div>
                  <h3 className="mt-2 font-serif text-lg font-bold text-brand-900">{evt.title}</h3>
                  <p className="mt-1 text-xs text-stone-600">{evt.description}</p>
                  <p className="mt-3 flex items-center gap-1.5 text-xs font-semibold text-brand-700">
                    <MapPin size={13} /> {evt.location || 'Main Sanctuary'}
                  </p>
                </div>

                <button
                  onClick={() => handleDeleteEvent(evt.id)}
                  className="text-stone-400 hover:text-red-600"
                  title="Delete event"
                >
                  <Trash2 size={15} />
                </button>
              </article>
            ))}
          </div>
        </div>

        {/* Facility Readiness Checklist */}
        <div className="milk-card p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-serif text-xl font-bold text-brand-900">Sunday Readiness Checklist</h2>
            <Building size={18} className="text-brand-700" />
          </div>
          <p className="text-xs text-stone-600">Verification tasks before service commencement.</p>

          <div className="space-y-2.5">
            {checklist.map((item, idx) => (
              <div
                key={idx}
                onClick={() => toggleChecklist(idx)}
                className={`flex items-start gap-3 rounded-xl p-3 cursor-pointer border transition ${
                  item.done ? 'bg-emerald-50/70 border-emerald-200 text-emerald-950' : 'bg-white border-stone-200 text-stone-800'
                }`}
              >
                <input
                  type="checkbox"
                  checked={item.done}
                  onChange={() => {}}
                  className="mt-0.5 rounded text-emerald-600"
                />
                <div className="text-xs">
                  <p className={`font-semibold ${item.done ? 'line-through text-stone-500' : ''}`}>
                    {item.task}
                  </p>
                  <span className="text-[10px] text-stone-400 uppercase font-bold">{item.area}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
