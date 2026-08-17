import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../../features/auth/AuthProvider'
import {
  subscribeToCollection,
  subscribeToContactSubmissions,
  createRecord,
  removeRecord,
  removeContactSubmission,
  ChurchRecord,
  ContactSubmission,
} from '../../../lib/church-data'
import { useUserManagement } from '../../../hooks/useUserManagement'
import { useRoleManagement } from '../../../hooks/useRoleManagement'
import { useExport } from '../../../hooks/useExport'
import { roleLabels, roles, Role } from '../../../types/roles'
import {
  FileText,
  Mail,
  Users,
  Calendar,
  Bell,
  Copy,
  Check,
  Plus,
  Trash2,
  Download,
  Search,
  CheckCircle,
  ExternalLink,
  ClipboardList,
} from 'lucide-react'

export function SecretaryDashboard() {
  const { profile } = useAuth()
  const [announcements, setAnnouncements] = useState<ChurchRecord[]>([])
  const [events, setEvents] = useState<ChurchRecord[]>([])
  const [inquiries, setInquiries] = useState<ContactSubmission[]>([])
  const [searchDirectory, setSearchDirectory] = useState('')
  const { users } = useUserManagement(undefined, searchDirectory)
  const { updateUserRole } = useRoleManagement()
  const { exportToCSV } = useExport()

  // New announcement form state
  const [showAnnForm, setShowAnnForm] = useState(false)
  const [annTitle, setAnnTitle] = useState('')
  const [annCategory, setAnnCategory] = useState('Parish Notice')
  const [annDate, setAnnDate] = useState('This Sunday')
  const [annDescription, setAnnDescription] = useState('')

  // Copied bulletin state
  const [copiedBulletin, setCopiedBulletin] = useState(false)
  const [messageNotice, setMessageNotice] = useState<string | null>(null)

  useEffect(() => {
    const unsubAnn = subscribeToCollection('announcements', (items) => setAnnouncements(items))
    const unsubEvt = subscribeToCollection('events', (items) => setEvents(items))
    const unsubInq = subscribeToContactSubmissions((items) => setInquiries(items))

    return () => {
      unsubAnn()
      unsubEvt()
      unsubInq()
    }
  }, [])

  const handleCreateAnnouncement = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!annTitle) return
    try {
      await createRecord('announcements', {
        title: annTitle,
        category: annCategory,
        date: annDate,
        description: annDescription,
        status: 'Published',
      })
      setShowAnnForm(false)
      setAnnTitle('')
      setAnnDescription('')
      setMessageNotice('Announcement added to parish notices.')
      setTimeout(() => setMessageNotice(null), 3500)
    } catch {
      setMessageNotice('Failed to create announcement.')
    }
  }

  const handleDeleteAnnouncement = async (id: string) => {
    try {
      await removeRecord('announcements', id)
      setMessageNotice('Announcement removed.')
      setTimeout(() => setMessageNotice(null), 3500)
    } catch {
      setMessageNotice('Could not remove announcement.')
    }
  }

  const handleDeleteInquiry = async (id: string) => {
    try {
      await removeContactSubmission(id)
      setMessageNotice('Inquiry archived/removed.')
      setTimeout(() => setMessageNotice(null), 3500)
    } catch {
      setMessageNotice('Could not remove inquiry.')
    }
  }

  const generateWeeklyBulletinText = () => {
    const header = `ANGLICAN CHURCH OF THE EPIPHANY\nPARISH WEEKLY BULLETIN & NOTICES\nDate: ${new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}\n========================================\n\n`
    const nots = announcements
      .map(
        (a, i) =>
          `[${i + 1}] ${a.title.toUpperCase()}\nDate/Time: ${a.date || 'TBA'}\nCategory: ${a.category || 'General'}\n${a.description || ''}\n`
      )
      .join('\n----------------------------------------\n\n')

    const evts = `\n\nUPCOMING PARISH SERVICES & EVENTS:\n` +
      events.slice(0, 5).map((e) => `• ${e.title} (${e.date || 'Scheduled'} @ ${e.location || 'Sanctuary'})`).join('\n')

    const fullText = header + nots + evts
    navigator.clipboard.writeText(fullText)
    setCopiedBulletin(true)
    setMessageNotice('Weekly Sunday bulletin copied to clipboard!')
    setTimeout(() => setCopiedBulletin(false), 4000)
  }

  const pendingRoleUsers = users.filter((u) => u.requestedRole && u.requestedRole !== u.role)

  return (
    <section className="space-y-8">
      {/* Header Banner */}
      <div className="rounded-3xl border border-brand-500/20 bg-gradient-to-r from-brand-900 via-brand-800 to-brand-900 p-6 text-white shadow-xl md:p-8">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-400/20 px-3 py-1 text-xs font-bold uppercase tracking-wider text-blue-300">
                <ClipboardList size={13} /> Parish Secretary & Administration
              </span>
              <span className="inline-flex items-center gap-1 rounded-full bg-white/10 px-2.5 py-0.5 text-xs text-brand-100">
                Parish Operations Desk
              </span>
            </div>
            <h1 className="mt-3 font-serif text-3xl font-bold tracking-tight text-white md:text-4xl">
              Parish Administration & Office Desk
            </h1>
            <p className="mt-2 max-w-2xl text-sm text-brand-100">
              Welcome, <span className="font-semibold text-white">{profile?.displayName || 'Parish Secretary'}</span>. Managing visitor inquiries, church announcements, Sunday bulletins, and parish records.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={generateWeeklyBulletinText}
              className="flex items-center gap-2 rounded-xl bg-blue-500 px-4 py-2.5 text-sm font-bold text-white shadow-md transition hover:bg-blue-400 active:scale-95"
            >
              {copiedBulletin ? <Check size={16} /> : <Copy size={16} />}
              {copiedBulletin ? 'Bulletin Copied!' : 'Copy Sunday Bulletin'}
            </button>
            <button
              onClick={() => setShowAnnForm(!showAnnForm)}
              className="flex items-center gap-2 rounded-xl bg-white/10 px-4 py-2.5 text-sm font-bold text-white transition hover:bg-white/20 active:scale-95"
            >
              <Plus size={16} />
              + Add Notice
            </button>
          </div>
        </div>
      </div>

      {messageNotice && (
        <div className="flex items-center gap-2 rounded-2xl bg-blue-50 p-4 text-sm font-semibold text-blue-900 border border-blue-200 shadow-sm animate-fade-in">
          <CheckCircle size={18} className="text-blue-600" />
          <span>{messageNotice}</span>
        </div>
      )}

      {/* Inline Announcement Creator */}
      {showAnnForm && (
        <form onSubmit={handleCreateAnnouncement} className="milk-card p-6 space-y-4 border-2 border-blue-300">
          <div className="flex items-center justify-between">
            <h2 className="font-serif text-2xl font-bold text-brand-900">Create Parish Notice / Announcement</h2>
            <span className="text-xs font-semibold text-stone-500">Will be featured on website and Sunday bulletin</span>
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-stone-700">Notice Title *</label>
              <input
                required
                placeholder="e.g. Parish Harvest Committee Meeting"
                value={annTitle}
                onChange={(e) => setAnnTitle(e.target.value)}
                className="field mt-1"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-stone-700">Category</label>
              <select
                value={annCategory}
                onChange={(e) => setAnnCategory(e.target.value)}
                className="field mt-1"
              >
                <option value="Parish Notice">Parish Notice</option>
                <option value="Liturgical & Worship">Liturgical & Worship</option>
                <option value="Music Ministry">Music Ministry</option>
                <option value="Youth & Fellowship">Youth & Fellowship</option>
                <option value="Community Welfare">Community Welfare</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-stone-700">Date / Timing</label>
              <input
                placeholder="e.g. This Sunday after Second Service"
                value={annDate}
                onChange={(e) => setAnnDate(e.target.value)}
                className="field mt-1"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-stone-700">Details & Instructions</label>
            <textarea
              rows={3}
              placeholder="Provide complete details for parishioners..."
              value={annDescription}
              onChange={(e) => setAnnDescription(e.target.value)}
              className="field mt-1"
            />
          </div>

          <div className="flex gap-2">
            <button type="submit" className="button-primary">
              Publish Notice
            </button>
            <button
              type="button"
              onClick={() => setShowAnnForm(false)}
              className="rounded-xl bg-stone-200 px-4 py-2 text-sm font-semibold text-stone-800 hover:bg-stone-300"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      {/* Office Triage Metrics */}
      <div className="grid gap-4 sm:grid-cols-4">
        <div className="milk-card p-5">
          <p className="text-xs font-semibold text-stone-500">Incoming Contact Inquiries</p>
          <p className="mt-1 font-serif text-3xl font-bold text-brand-900">{inquiries.length}</p>
          <p className="mt-1 text-[11px] text-blue-700">Visitor messages & hall requests</p>
        </div>
        <div className="milk-card p-5">
          <p className="text-xs font-semibold text-stone-500">Parish Announcements</p>
          <p className="mt-1 font-serif text-3xl font-bold text-brand-900">{announcements.length}</p>
          <p className="mt-1 text-[11px] text-emerald-700">Active Sunday notices</p>
        </div>
        <div className="milk-card p-5">
          <p className="text-xs font-semibold text-stone-500">Upcoming Parish Calendar</p>
          <p className="mt-1 font-serif text-3xl font-bold text-brand-900">{events.length}</p>
          <p className="mt-1 text-[11px] text-purple-700">Services & bookings</p>
        </div>
        <div className="milk-card p-5">
          <p className="text-xs font-semibold text-stone-500">Role Elevation Requests</p>
          <p className="mt-1 font-serif text-3xl font-bold text-amber-700">{pendingRoleUsers.length}</p>
          <p className="mt-1 text-[11px] text-stone-600">Pending review</p>
        </div>
      </div>

      {/* Contact Form Submissions & Inquiries Inbox */}
      <div className="milk-card p-6 space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <Mail size={20} className="text-blue-600" />
              <h2 className="font-serif text-2xl font-bold text-brand-900">
                Parish Office Inbox & Visitor Messages
              </h2>
            </div>
            <p className="mt-1 text-xs text-stone-600">
              Messages received through the church portal contact form.
            </p>
          </div>
          <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-bold text-blue-800">
            {inquiries.length} Messages
          </span>
        </div>

        <div className="space-y-4">
          {inquiries.map((item) => (
            <article
              key={item.id}
              className="rounded-2xl border border-stone-200/80 bg-white/80 p-5 shadow-xs transition hover:border-blue-300"
            >
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="rounded-full bg-blue-50 px-2.5 py-0.5 text-[11px] font-bold text-blue-800">
                      {item.category || item.subject || 'General Inquiry'}
                    </span>
                    <span className="text-xs text-stone-400">• New Submission</span>
                  </div>
                  <h3 className="mt-2 text-sm font-bold text-stone-900">
                    From: {item.name} <span className="font-normal text-stone-500">({item.email})</span>
                  </h3>
                  <p className="mt-2 text-xs leading-relaxed text-stone-700 bg-stone-50 p-3 rounded-xl border border-stone-100">
                    "{item.message}"
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <a
                    href={`mailto:${item.email}?subject=Re: ${encodeURIComponent(item.subject || 'Anglican Church Office Response')}`}
                    className="flex items-center gap-1 rounded-xl bg-blue-600 px-3 py-1.5 text-xs font-bold text-white hover:bg-blue-700"
                  >
                    <Mail size={12} /> Reply Email
                  </a>
                  <button
                    onClick={() => handleDeleteInquiry(item.id)}
                    className="rounded-xl border border-stone-200 bg-stone-100 p-2 text-stone-600 hover:bg-red-50 hover:text-red-700"
                    title="Remove inquiry"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>

      {/* Announcements Manager & Directory Lookup Grid */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Active Notices */}
        <div className="milk-card p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-serif text-xl font-bold text-brand-900">Active Parish Notices</h2>
            <button
              onClick={() => setShowAnnForm(true)}
              className="text-xs font-bold text-blue-700 hover:underline"
            >
              + Add Notice
            </button>
          </div>

          <div className="space-y-3">
            {announcements.map((ann) => (
              <div key={ann.id} className="rounded-xl border border-stone-200/80 bg-white/70 p-4">
                <div className="flex items-center justify-between">
                  <span className="rounded-md bg-brand-50 px-2 py-0.5 text-[10px] font-bold text-brand-800">
                    {ann.category || 'Parish Notice'}
                  </span>
                  <button
                    onClick={() => handleDeleteAnnouncement(ann.id)}
                    className="text-stone-400 hover:text-red-600"
                    title="Delete notice"
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
                <h3 className="mt-2 font-serif text-base font-bold text-brand-900">{ann.title}</h3>
                <p className="mt-1 text-xs text-stone-600">{ann.description}</p>
                <p className="mt-2 text-[11px] font-semibold text-brand-700">Date: {ann.date || 'TBA'}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Parish Directory Lookup */}
        <div className="milk-card p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-serif text-xl font-bold text-brand-900">Parishioner Directory</h2>
              <p className="text-xs text-stone-600">Quick contact lookup for parish communications.</p>
            </div>
            <button
              onClick={() => {
                const data = users.map((u) => ({
                  Name: u.displayName,
                  Email: u.email,
                  Phone: u.phoneNumber || '',
                  Role: roleLabels[u.role],
                }))
                exportToCSV(data, 'parish-contact-list')
              }}
              className="flex items-center gap-1 text-xs font-bold text-brand-700 hover:underline"
            >
              <Download size={13} /> CSV Export
            </button>
          </div>

          <div className="relative">
            <Search size={14} className="absolute left-3 top-3 text-stone-400" />
            <input
              type="text"
              placeholder="Search parishioner name or phone..."
              value={searchDirectory}
              onChange={(e) => setSearchDirectory(e.target.value)}
              className="field pl-8 text-xs"
            />
          </div>

          <div className="space-y-2 max-h-80 overflow-y-auto pr-1">
            {users.map((u) => (
              <div key={u.uid} className="flex items-center justify-between rounded-xl bg-white/70 p-3 border border-stone-200/60 text-xs">
                <div>
                  <p className="font-bold text-stone-900">{u.displayName}</p>
                  <p className="text-[11px] text-stone-500">{u.email} • {u.phoneNumber || 'No phone'}</p>
                </div>
                <span className="rounded-full bg-stone-100 px-2 py-0.5 text-[10px] font-semibold text-stone-700">
                  {roleLabels[u.role]}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
