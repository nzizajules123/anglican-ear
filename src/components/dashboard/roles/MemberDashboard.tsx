import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../../features/auth/AuthProvider'
import {
  subscribeToCollection,
  createRecord,
  ChurchRecord,
} from '../../../lib/church-data'
import {
  Heart,
  Calendar,
  BookOpen,
  Send,
  CheckCircle,
  Users,
  Sparkles,
  DollarSign,
  Sun,
  Shield,
  Volume2,
} from 'lucide-react'

export function MemberDashboard() {
  const { profile } = useAuth()
  const [announcements, setAnnouncements] = useState<ChurchRecord[]>([])
  const [events, setEvents] = useState<ChurchRecord[]>([])
  const [sermons, setSermons] = useState<ChurchRecord[]>([])
  const [prayers, setPrayers] = useState<ChurchRecord[]>([])
  const [ministries, setMinistries] = useState<ChurchRecord[]>([])

  // Member prayer submission form
  const [prayerTitle, setPrayerTitle] = useState('')
  const [prayerDescription, setPrayerDescription] = useState('')
  const [prayerCategory, setPrayerCategory] = useState('Healing & Comfort')
  const [feedback, setFeedback] = useState<string | null>(null)
  const [rsvpEvents, setRsvpEvents] = useState<Record<string, boolean>>({})

  useEffect(() => {
    const unsubAnn = subscribeToCollection('announcements', (items) => setAnnouncements(items))
    const unsubEvt = subscribeToCollection('events', (items) => setEvents(items))
    const unsubSerm = subscribeToCollection('sermons', (items) => setSermons(items))
    const unsubPrayers = subscribeToCollection('prayerRequests', (items) => setPrayers(items))
    const unsubMin = subscribeToCollection('ministries', (items) => setMinistries(items))

    return () => {
      unsubAnn()
      unsubEvt()
      unsubSerm()
      unsubPrayers()
      unsubMin()
    }
  }, [])

  const handleSubmitPrayer = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!prayerTitle) return
    try {
      await createRecord('prayerRequests', {
        title: prayerTitle,
        description: prayerDescription,
        category: prayerCategory,
        date: 'Today',
        status: 'In Pastoral Prayer',
      })
      setPrayerTitle('')
      setPrayerDescription('')
      setFeedback('Your prayer request has been received by the Vicar & pastoral care team. God bless you!')
      setTimeout(() => setFeedback(null), 4500)
    } catch {
      setFeedback('Could not submit prayer request.')
    }
  }

  const toggleRsvp = (eventId: string, title: string) => {
    const nextState = !rsvpEvents[eventId]
    setRsvpEvents({ ...rsvpEvents, [eventId]: nextState })
    setFeedback(nextState ? `You are registered for "${title}"!` : `RSVP cancelled for "${title}".`)
    setTimeout(() => setFeedback(null), 3000)
  }

  return (
    <section className="space-y-8">
      {/* Welcome Banner */}
      <div className="rounded-3xl border border-brand-500/20 bg-gradient-to-r from-brand-900 via-brand-800 to-brand-900 p-6 text-white shadow-xl md:p-8">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-brand-500/30 px-3 py-1 text-xs font-bold uppercase tracking-wider text-brand-100">
                <Sun size={13} className="text-amber-300" /> Parish Member Sanctuary
              </span>
              <span className="inline-flex items-center gap-1 rounded-full bg-white/10 px-2.5 py-0.5 text-xs text-brand-100">
                Anglican Church Community
              </span>
            </div>
            <h1 className="mt-3 font-serif text-3xl font-bold tracking-tight text-white md:text-4xl">
              Welcome Home, {profile?.displayName?.split(' ')[0] || 'Parishioner'}
            </h1>
            <p className="mt-2 max-w-2xl text-sm text-brand-100">
              "The Lord is my light and my salvation; whom shall I fear? The Lord is the stronghold of my life." — <span className="font-semibold text-amber-200">Psalm 27:1</span>
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <Link
              to="/dashboard/giving"
              className="flex items-center gap-2 rounded-xl bg-amber-400 px-4 py-2.5 text-sm font-bold text-stone-900 shadow-md transition hover:bg-amber-300 active:scale-95"
            >
              <DollarSign size={16} />
              Give Tithe & Offering
            </Link>
          </div>
        </div>
      </div>

      {feedback && (
        <div className="flex items-center gap-2 rounded-2xl bg-emerald-50 p-4 text-sm font-semibold text-emerald-900 border border-emerald-200 shadow-sm animate-fade-in">
          <CheckCircle size={18} className="text-emerald-600" />
          <span>{feedback}</span>
        </div>
      )}

      {/* Quick Service & Liturgy Information */}
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="milk-card p-5">
          <p className="text-xs font-bold uppercase tracking-wider text-brand-700">Sunday Worship</p>
          <h3 className="mt-1 font-serif text-xl font-bold text-brand-900">Holy Eucharist Services</h3>
          <p className="mt-2 text-xs text-stone-600">
            • <strong>9:00 AM:</strong> Traditional Holy Communion<br />
            • <strong>11:00 AM:</strong> Sung Eucharist & Family Worship
          </p>
        </div>

        <div className="milk-card p-5">
          <p className="text-xs font-bold uppercase tracking-wider text-amber-700">Midweek Intercession</p>
          <h3 className="mt-1 font-serif text-xl font-bold text-brand-900">Wednesday Healing Service</h3>
          <p className="mt-2 text-xs text-stone-600">
            • <strong>12:00 PM:</strong> Holy Communion & Prayer at St. Michael Chapel
          </p>
        </div>

        <div className="milk-card p-5">
          <p className="text-xs font-bold uppercase tracking-wider text-purple-700">Pastoral Care</p>
          <h3 className="mt-1 font-serif text-xl font-bold text-brand-900">Need Clergy Support?</h3>
          <p className="mt-2 text-xs text-stone-600">
            Homebound visitation, baptism, and marriage counseling available upon request.
          </p>
        </div>
      </div>

      {/* Grid: Prayer Request & Parish Events */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Submit Prayer Request */}
        <div className="milk-card p-6 space-y-4">
          <div className="flex items-center gap-2">
            <Heart size={20} className="text-rose-600" />
            <div>
              <h2 className="font-serif text-xl font-bold text-brand-900">Submit a Prayer Request</h2>
              <p className="text-xs text-stone-600">Shared with the pastoral team and remembered in parish intercessions.</p>
            </div>
          </div>

          <form onSubmit={handleSubmitPrayer} className="space-y-3">
            <div>
              <label className="block text-xs font-bold text-stone-700">Prayer Intention Title *</label>
              <input
                required
                placeholder="e.g. Prayer for my family, healing, thanksgiving..."
                value={prayerTitle}
                onChange={(e) => setPrayerTitle(e.target.value)}
                className="field mt-1 text-xs"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-stone-700">Category</label>
              <select
                value={prayerCategory}
                onChange={(e) => setPrayerCategory(e.target.value)}
                className="field mt-1 text-xs"
              >
                <option value="Healing & Comfort">Healing & Comfort</option>
                <option value="Family & Marriage">Family & Marriage</option>
                <option value="Thanksgiving & Praise">Thanksgiving & Praise</option>
                <option value="Guidance & Exams">Guidance & Exams</option>
                <option value="Bereavement">Bereavement & Peace</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-stone-700">Details (Optional)</label>
              <textarea
                rows={3}
                placeholder="Share more details about how we can intercede for you..."
                value={prayerDescription}
                onChange={(e) => setPrayerDescription(e.target.value)}
                className="field mt-1 text-xs"
              />
            </div>
            <button type="submit" className="button-primary w-full flex items-center justify-center gap-2">
              <Send size={14} /> Submit to Pastoral Prayer Care
            </button>
          </form>
        </div>

        {/* Upcoming Parish Events & RSVP */}
        <div className="milk-card p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Calendar size={20} className="text-brand-700" />
              <div>
                <h2 className="font-serif text-xl font-bold text-brand-900">Upcoming Parish Events</h2>
                <p className="text-xs text-stone-600">Gatherings, recitals, and fellowship services.</p>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            {events.slice(0, 4).map((evt) => (
              <div key={evt.id} className="flex items-center justify-between rounded-2xl border border-stone-200/80 bg-white/80 p-3.5 text-xs">
                <div>
                  <span className="rounded bg-brand-50 px-2 py-0.5 text-[10px] font-bold text-brand-800">
                    {evt.date || 'Upcoming'}
                  </span>
                  <h3 className="mt-1 font-serif text-sm font-bold text-stone-900">{evt.title}</h3>
                  <p className="text-stone-500 text-[11px]">{evt.location || 'Parish Sanctuary'}</p>
                </div>
                <button
                  onClick={() => toggleRsvp(evt.id, evt.title)}
                  className={`rounded-xl px-3 py-1.5 font-bold transition ${
                    rsvpEvents[evt.id]
                      ? 'bg-emerald-600 text-white'
                      : 'bg-stone-100 text-stone-800 hover:bg-brand-100 hover:text-brand-900'
                  }`}
                >
                  {rsvpEvents[evt.id] ? '✓ Attending' : 'RSVP'}
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Latest Sermons & Study Notes */}
      <div className="milk-card p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <BookOpen size={20} className="text-brand-700" />
            <div>
              <h2 className="font-serif text-2xl font-bold text-brand-900">Latest Sunday Sermons & Study Notes</h2>
              <p className="text-xs text-stone-600">Reflect on God's word delivered from our pulpit.</p>
            </div>
          </div>
          <Link to="/sermons" className="text-xs font-bold text-brand-700 hover:underline">
            All sermons →
          </Link>
        </div>

        <div className="grid gap-4 sm:grid-cols-3">
          {sermons.slice(0, 3).map((s) => (
            <div key={s.id} className="rounded-2xl border border-stone-200/80 bg-white/80 p-5 flex flex-col justify-between">
              <div>
                <span className="rounded-md bg-amber-50 px-2 py-0.5 text-[10px] font-bold text-amber-800">
                  {s.scripture || 'Scripture'}
                </span>
                <h3 className="mt-2 font-serif text-base font-bold text-brand-900">{s.title}</h3>
                <p className="mt-1 text-xs text-stone-600 line-clamp-3">{s.description}</p>
              </div>
              <p className="mt-4 pt-2 border-t border-stone-100 text-[11px] font-semibold text-brand-800">
                Preacher: {s.preacher || 'The Vicar'}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Parish Ministries & Guilds */}
      <div className="milk-card p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-serif text-2xl font-bold text-brand-900">Serve in a Parish Ministry</h2>
            <p className="text-xs text-stone-600">Find your place to serve in the body of Christ.</p>
          </div>
          <Link to="/dashboard/ministries" className="text-xs font-bold text-brand-700 hover:underline">
            View ministries →
          </Link>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {ministries.map((min) => (
            <div key={min.id} className="rounded-2xl border border-stone-200/80 bg-white/80 p-5 flex flex-col justify-between">
              <div>
                <span className="rounded-full bg-brand-50 px-2.5 py-0.5 text-[10px] font-bold text-brand-800">
                  {min.memberCount ? `${min.memberCount} Members` : 'Active Group'}
                </span>
                <h3 className="mt-2 font-serif text-base font-bold text-brand-900">{min.title}</h3>
                <p className="mt-1 text-xs text-stone-600">{min.description}</p>
              </div>
              <button
                onClick={() => {
                  setFeedback(`Thank you for your interest in ${min.title}! Ministry leader notified.`)
                  setTimeout(() => setFeedback(null), 3500)
                }}
                className="mt-4 rounded-xl bg-stone-100 py-2 text-xs font-bold text-stone-800 hover:bg-brand-700 hover:text-white transition"
              >
                Join this Ministry
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
