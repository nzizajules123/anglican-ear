import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../../features/auth/AuthProvider'
import {
  subscribeToCollection,
  subscribeToContactSubmissions,
  createRecord,
  editRecord,
  ChurchRecord,
  ContactSubmission,
} from '../../../lib/church-data'
import {
  HeartHandshake,
  BookOpen,
  Mail,
  Calendar,
  Sparkles,
  CheckCircle2,
  Clock,
  Plus,
  Cross,
  UserCheck,
  Send,
  MessageSquare,
  Flame,
} from 'lucide-react'

export function PastorDashboard() {
  const { profile } = useAuth()
  const [prayers, setPrayers] = useState<ChurchRecord[]>([])
  const [sermons, setSermons] = useState<ChurchRecord[]>([])
  const [inquiries, setInquiries] = useState<ContactSubmission[]>([])
  const [loading, setLoading] = useState(true)

  // Sermon create modal / inline form state
  const [showSermonForm, setShowSermonForm] = useState(false)
  const [sermonTitle, setSermonTitle] = useState('')
  const [sermonScripture, setSermonScripture] = useState('')
  const [sermonPreacher, setSermonPreacher] = useState(profile?.displayName || 'The Vicar')
  const [sermonDescription, setSermonDescription] = useState('')
  const [sermonDate, setSermonDate] = useState(new Date().toISOString().split('T')[0])

  // Pastoral note editing
  const [editingPrayerId, setEditingPrayerId] = useState<string | null>(null)
  const [pastoralNoteText, setPastoralNoteText] = useState('')
  const [messageFeedback, setMessageFeedback] = useState<string | null>(null)

  useEffect(() => {
    setLoading(true)
    const unsubPrayers = subscribeToCollection('prayerRequests', (items) => setPrayers(items))
    const unsubSermons = subscribeToCollection('sermons', (items) => setSermons(items))
    const unsubInquiries = subscribeToContactSubmissions((items) => setInquiries(items))

    setLoading(false)
    return () => {
      unsubPrayers()
      unsubSermons()
      unsubInquiries()
    }
  }, [])

  const handleUpdatePrayerStatus = async (id: string, newStatus: string) => {
    try {
      await editRecord('prayerRequests', id, { status: newStatus })
      setMessageFeedback(`Updated status to "${newStatus}"`)
      setTimeout(() => setMessageFeedback(null), 3500)
    } catch {
      setMessageFeedback('Could not update prayer status.')
    }
  }

  const handleSavePastoralNote = async (id: string) => {
    try {
      await editRecord('prayerRequests', id, { pastoralNotes: pastoralNoteText })
      setEditingPrayerId(null)
      setPastoralNoteText('')
      setMessageFeedback('Pastoral care note saved successfully.')
      setTimeout(() => setMessageFeedback(null), 3500)
    } catch {
      setMessageFeedback('Could not save note.')
    }
  }

  const handleCreateSermon = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!sermonTitle) return
    try {
      await createRecord('sermons', {
        title: sermonTitle,
        description: sermonDescription,
        scripture: sermonScripture,
        preacher: sermonPreacher,
        date: sermonDate,
        status: 'Published',
        category: 'Sunday Sermon',
      })
      setShowSermonForm(false)
      setSermonTitle('')
      setSermonScripture('')
      setSermonDescription('')
      setMessageFeedback('Sermon published to parish library.')
      setTimeout(() => setMessageFeedback(null), 3500)
    } catch {
      setMessageFeedback('Failed to publish sermon.')
    }
  }

  const openPrayersCount = prayers.filter((p) => (p.status || '').toLowerCase() !== 'answered & praise').length

  return (
    <section className="space-y-8">
      {/* Liturgical Pastoral Header Banner */}
      <div className="rounded-3xl border border-brand-500/20 bg-gradient-to-r from-brand-900 via-brand-800 to-brand-900 p-6 text-white shadow-xl md:p-8">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-400/20 px-3 py-1 text-xs font-bold uppercase tracking-wider text-amber-300">
                <Flame size={13} /> Pastoral Care & Rector's Study
              </span>
              <span className="inline-flex items-center gap-1 rounded-full bg-white/10 px-2.5 py-0.5 text-xs text-brand-100">
                Anglican Liturgy & Ministry
              </span>
            </div>
            <h1 className="mt-3 font-serif text-3xl font-bold tracking-tight text-white md:text-4xl">
              Pastoral & Liturgical Leadership
            </h1>
            <p className="mt-2 max-w-2xl text-sm text-brand-100">
              Grace and peace, <span className="font-semibold text-white">{profile?.displayName || 'Father'}</span>. Tending the spiritual flock, interceding in prayer, and preparing the pulpit.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => setShowSermonForm(!showSermonForm)}
              className="flex items-center gap-2 rounded-xl bg-amber-400 px-4 py-2.5 text-sm font-bold text-stone-900 shadow-md transition hover:bg-amber-300 active:scale-95"
            >
              <Plus size={16} />
              {showSermonForm ? 'Close Form' : 'Publish Sermon'}
            </button>
            <Link
              to="/dashboard/prayer-requests"
              className="flex items-center gap-2 rounded-xl bg-white/10 px-4 py-2.5 text-sm font-bold text-white transition hover:bg-white/20 active:scale-95"
            >
              <HeartHandshake size={16} />
              Prayer Requests Desk
            </Link>
          </div>
        </div>

        {/* Lectionary & Collect of the Week Box */}
        <div className="mt-6 rounded-2xl border border-white/15 bg-white/10 p-4 text-xs backdrop-blur-md">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <span className="font-bold uppercase tracking-wider text-amber-200">
              ✝ Anglican Collect & Lectionary of the Week
            </span>
            <span className="text-brand-100">Season of Pentecost (Trinity) • Liturgical Color: Green</span>
          </div>
          <p className="mt-2 italic text-stone-100">
            "Almighty and everlasting God, who art always more ready to hear than we to pray, and art wont to give more than either we desire or deserve: Pour down upon us the abundance of thy mercy; through Jesus Christ our Lord. Amen."
          </p>
        </div>
      </div>

      {messageFeedback && (
        <div className="flex items-center gap-2 rounded-2xl bg-emerald-50 p-4 text-sm font-semibold text-emerald-900 border border-emerald-200 shadow-sm animate-fade-in">
          <CheckCircle2 size={18} className="text-emerald-600" />
          <span>{messageFeedback}</span>
        </div>
      )}

      {/* Inline Sermon Creator Form */}
      {showSermonForm && (
        <form onSubmit={handleCreateSermon} className="milk-card p-6 space-y-4 border-2 border-amber-300">
          <div className="flex items-center justify-between">
            <h2 className="font-serif text-2xl font-bold text-brand-900">Publish Sunday Sermon & Study Guide</h2>
            <span className="text-xs font-semibold text-stone-500">Parishioners will be able to read and reflect</span>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-xs font-bold text-stone-700">Sermon Title *</label>
              <input
                required
                placeholder="e.g. Walking by Faith, Not by Sight"
                value={sermonTitle}
                onChange={(e) => setSermonTitle(e.target.value)}
                className="field mt-1"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-stone-700">Scripture Reference</label>
              <input
                placeholder="e.g. 2 Corinthians 5:7, Romans 8:28"
                value={sermonScripture}
                onChange={(e) => setSermonScripture(e.target.value)}
                className="field mt-1"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-stone-700">Preacher / Clergy</label>
              <input
                placeholder="Preacher name"
                value={sermonPreacher}
                onChange={(e) => setSermonPreacher(e.target.value)}
                className="field mt-1"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-stone-700">Date Delivered</label>
              <input
                type="date"
                value={sermonDate}
                onChange={(e) => setSermonDate(e.target.value)}
                className="field mt-1"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-stone-700">Sermon Summary, Main Points & Study Notes</label>
            <textarea
              rows={4}
              placeholder="Outline key theological insights, reflection questions, and practical applications..."
              value={sermonDescription}
              onChange={(e) => setSermonDescription(e.target.value)}
              className="field mt-1"
            />
          </div>

          <div className="flex gap-2">
            <button type="submit" className="button-primary">
              Publish Sermon to Congregation
            </button>
            <button
              type="button"
              onClick={() => setShowSermonForm(false)}
              className="rounded-xl bg-stone-200 px-4 py-2 text-sm font-semibold text-stone-800 hover:bg-stone-300"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      {/* Quick Summary Cards */}
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="milk-card p-5">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-rose-100 text-rose-800">
              <HeartHandshake size={22} />
            </div>
            <div>
              <p className="text-xs font-semibold text-stone-500">Active Pastoral Prayers</p>
              <p className="font-serif text-3xl font-bold text-brand-900">{openPrayersCount}</p>
            </div>
          </div>
        </div>

        <div className="milk-card p-5">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-amber-100 text-amber-800">
              <BookOpen size={22} />
            </div>
            <div>
              <p className="text-xs font-semibold text-stone-500">Published Sermons</p>
              <p className="font-serif text-3xl font-bold text-brand-900">{sermons.length}</p>
            </div>
          </div>
        </div>

        <div className="milk-card p-5">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-blue-100 text-blue-800">
              <Mail size={22} />
            </div>
            <div>
              <p className="text-xs font-semibold text-stone-500">Pastoral Inquiries</p>
              <p className="font-serif text-3xl font-bold text-brand-900">{inquiries.length}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Pastoral Care & Prayer Requests Queue */}
      <div className="milk-card p-6 space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <HeartHandshake size={20} className="text-rose-600" />
              <h2 className="font-serif text-2xl font-bold text-brand-900">
                Pastoral Care & Intercession Queue
              </h2>
            </div>
            <p className="mt-1 text-xs text-stone-600">
              Confidential prayer requests submitted by parishioners and families in need of pastoral care.
            </p>
          </div>

          <Link
            to="/dashboard/prayer-requests"
            className="text-xs font-bold text-brand-700 hover:underline"
          >
            Manage all prayers →
          </Link>
        </div>

        <div className="space-y-4">
          {prayers.map((prayer) => (
            <article
              key={prayer.id}
              className="rounded-2xl border border-stone-200/80 bg-white/80 p-5 shadow-xs transition hover:border-brand-300"
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="rounded-full bg-rose-50 px-2.5 py-0.5 text-[11px] font-bold text-rose-800">
                      {prayer.category || 'General Intercession'}
                    </span>
                    <span className="text-xs text-stone-400">• {prayer.date || 'Recent'}</span>
                  </div>
                  <h3 className="mt-2 font-serif text-lg font-bold text-brand-900">{prayer.title}</h3>
                  <p className="mt-1 text-xs leading-relaxed text-stone-700">{prayer.description}</p>
                </div>

                <div className="flex items-center gap-2">
                  <select
                    value={prayer.status || 'In Pastoral Prayer'}
                    onChange={(e) => handleUpdatePrayerStatus(prayer.id, e.target.value)}
                    className="rounded-xl border border-stone-200 bg-stone-50 px-3 py-1.5 text-xs font-semibold text-stone-800 focus:ring-2 focus:ring-brand-500"
                  >
                    <option value="In Pastoral Prayer">In Pastoral Prayer</option>
                    <option value="Prayed & Followed Up">Prayed & Followed Up</option>
                    <option value="Answered & Praise">Answered & Praise</option>
                  </select>
                </div>
              </div>

              {/* Pastoral Care Notes */}
              <div className="mt-4 rounded-xl bg-brand-50/60 p-3 text-xs border border-brand-100">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-brand-900 flex items-center gap-1.5">
                    <MessageSquare size={13} /> Confidential Pastoral Care Notes:
                  </span>
                  <button
                    onClick={() => {
                      if (editingPrayerId === prayer.id) {
                        setEditingPrayerId(null)
                      } else {
                        setEditingPrayerId(prayer.id)
                        setPastoralNoteText(prayer.pastoralNotes || '')
                      }
                    }}
                    className="text-[11px] font-bold text-brand-700 hover:underline"
                  >
                    {editingPrayerId === prayer.id ? 'Cancel' : prayer.pastoralNotes ? 'Edit note' : '+ Add pastoral note'}
                  </button>
                </div>

                {editingPrayerId === prayer.id ? (
                  <div className="mt-2 space-y-2">
                    <textarea
                      rows={2}
                      value={pastoralNoteText}
                      onChange={(e) => setPastoralNoteText(e.target.value)}
                      placeholder="Add confidential notes (e.g. Hospital visited, home communion administered, counseling scheduled)..."
                      className="field text-xs bg-white"
                    />
                    <button
                      onClick={() => handleSavePastoralNote(prayer.id)}
                      className="rounded-lg bg-brand-700 px-3 py-1.5 text-xs font-bold text-white hover:bg-brand-800"
                    >
                      Save Note
                    </button>
                  </div>
                ) : (
                  <p className="mt-1 text-stone-700 italic">
                    {prayer.pastoralNotes || 'No pastoral care notes recorded yet.'}
                  </p>
                )}
              </div>
            </article>
          ))}
        </div>
      </div>

      {/* Sermons Vault & Pastoral Inquiries Desk */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Sermon Library */}
        <div className="milk-card p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-serif text-xl font-bold text-brand-900">Pulpit & Sermons Series</h2>
              <p className="text-xs text-stone-600">Past sermons and upcoming teaching themes.</p>
            </div>
            <Link to="/dashboard/sermons" className="text-xs font-bold text-brand-700 hover:underline">
              View all →
            </Link>
          </div>

          <div className="space-y-3">
            {sermons.map((sermon) => (
              <div key={sermon.id} className="rounded-xl border border-stone-200/80 bg-white/70 p-4">
                <div className="flex items-center justify-between">
                  <span className="rounded-md bg-amber-50 px-2 py-0.5 text-[10px] font-bold text-amber-800">
                    {sermon.scripture || 'Scripture Reading'}
                  </span>
                  <span className="text-[11px] text-stone-400">{sermon.date}</span>
                </div>
                <h3 className="mt-2 font-serif text-base font-bold text-brand-900">{sermon.title}</h3>
                <p className="mt-1 text-xs text-stone-600 line-clamp-2">{sermon.description}</p>
                <p className="mt-2 text-[11px] font-semibold text-brand-800">Preacher: {sermon.preacher || 'The Vicar'}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Pastoral Inquiries & Visitor Messages */}
        <div className="milk-card p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-serif text-xl font-bold text-brand-900">Pastoral Inquiries</h2>
              <p className="text-xs text-stone-600">Sacramental counseling, baptism, and wedding requests.</p>
            </div>
            <Link to="/dashboard/contact-submissions" className="text-xs font-bold text-brand-700 hover:underline">
              Office desk →
            </Link>
          </div>

          <div className="space-y-3">
            {inquiries.map((inq) => (
              <div key={inq.id} className="rounded-xl border border-stone-200/80 bg-white/70 p-4">
                <div className="flex items-center justify-between">
                  <span className="rounded-md bg-blue-50 px-2 py-0.5 text-[10px] font-bold text-blue-800">
                    {inq.subject || 'General Inquiry'}
                  </span>
                  <span className="text-[10px] font-bold uppercase text-stone-400">{inq.status || 'New'}</span>
                </div>
                <h3 className="mt-2 text-xs font-bold text-stone-900">{inq.name} ({inq.email})</h3>
                <p className="mt-1 text-xs text-stone-600 line-clamp-3">{inq.message}</p>
                <a
                  href={`mailto:${inq.email}?subject=Re: ${encodeURIComponent(inq.subject || 'Pastoral Care - Anglican Church')}`}
                  className="mt-3 inline-flex items-center gap-1 text-xs font-bold text-brand-700 hover:text-brand-900"
                >
                  <Send size={12} /> Reply via Email
                </a>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
