import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../../features/auth/AuthProvider'
import {
  Flame,
  Calendar,
  Users,
  MessageCircle,
  BookOpen,
  Sparkles,
  CheckCircle,
  Plus,
  Compass,
  Smile,
} from 'lucide-react'

export function YouthLeaderDashboard() {
  const { profile } = useAuth()
  const [feedback, setFeedback] = useState<string | null>(null)

  const youthEvents = [
    { title: 'AYF Monthly Worship & Bible Discovery', date: 'Saturday, 4:00 PM', location: 'Youth Chapel', focus: 'Colossians 2:6-7 Rooted & Built Up' },
    { title: 'Anglican Diocesan Youth Camp & Retreat', date: 'Sept 18–20', location: 'Camp Grace Valley', focus: 'Leadership, Fellowship & Outdoor Sports' },
    { title: 'Youth Praise Band Jam & Sound Practice', date: 'Friday, 5:30 PM', location: 'Parish Hall', focus: 'Contemporary Worship & Chords' },
    { title: 'Community Outreach & Food Drive', date: 'Sunday, 1:00 PM', location: 'Local Shelter Center', focus: 'Serving our city together' },
  ]

  const studySeries = [
    { week: 'Week 1', topic: 'Identity in Christ in a Digital World', scripture: 'Ephesians 2:10' },
    { week: 'Week 2', topic: 'Guarding the Heart: Mental Health & Faith', scripture: 'Philippians 4:6-7' },
    { week: 'Week 3', topic: 'Bold Witness in School & University', scripture: '1 Peter 3:15' },
    { week: 'Week 4', topic: 'Anglican Heritage & Liturgy for Today', scripture: '2 Timothy 3:16-17' },
  ]

  const [youthStats, setYouthStats] = useState({
    activeMembers: 64,
    lastTurnout: 48,
    smallGroups: 5,
    upcomingCampSignups: 32,
  })

  return (
    <section className="space-y-8">
      {/* Banner */}
      <div className="rounded-3xl border border-brand-500/20 bg-gradient-to-r from-brand-900 via-brand-800 to-brand-900 p-6 text-white shadow-xl md:p-8">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-orange-400/20 px-3 py-1 text-xs font-bold uppercase tracking-wider text-orange-300">
                <Flame size={13} /> Anglican Youth Fellowship (AYF)
              </span>
              <span className="inline-flex items-center gap-1 rounded-full bg-white/10 px-2.5 py-0.5 text-xs text-brand-100">
                Youth Ministry Leadership
              </span>
            </div>
            <h1 className="mt-3 font-serif text-3xl font-bold tracking-tight text-white md:text-4xl">
              Youth Ministry & Discipleship Hub
            </h1>
            <p className="mt-2 max-w-2xl text-sm text-brand-100">
              Welcome, <span className="font-semibold text-white">{profile?.displayName || 'Youth Leader'}</span>. Inspiring the next generation to encounter Christ, grow in faith, and serve with passion.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <Link
              to="/dashboard/events"
              className="flex items-center gap-2 rounded-xl bg-orange-500 px-4 py-2.5 text-sm font-bold text-white shadow-md transition hover:bg-orange-400 active:scale-95"
            >
              <Plus size={16} />
              + Add Youth Event
            </Link>
            <Link
              to="/dashboard/announcements"
              className="flex items-center gap-2 rounded-xl bg-white/10 px-4 py-2.5 text-sm font-bold text-white transition hover:bg-white/20 active:scale-95"
            >
              <MessageCircle size={16} />
              Youth Announcement
            </Link>
          </div>
        </div>
      </div>

      {feedback && (
        <div className="flex items-center gap-2 rounded-2xl bg-orange-50 p-4 text-sm font-semibold text-orange-900 border border-orange-200 shadow-sm animate-fade-in">
          <Sparkles size={18} className="text-orange-600" />
          <span>{feedback}</span>
        </div>
      )}

      {/* Metrics */}
      <div className="grid gap-4 sm:grid-cols-4">
        <div className="milk-card p-5">
          <p className="text-xs font-semibold text-stone-500">Registered AYF Members</p>
          <p className="mt-1 font-serif text-3xl font-bold text-brand-900">{youthStats.activeMembers}</p>
          <p className="mt-1 text-[11px] text-brand-700">Teens & young adults</p>
        </div>
        <div className="milk-card p-5">
          <p className="text-xs font-semibold text-stone-500">Last Meeting Turnout</p>
          <p className="mt-1 font-serif text-3xl font-bold text-orange-600">{youthStats.lastTurnout}</p>
          <p className="mt-1 text-[11px] text-orange-700">75% active attendance</p>
        </div>
        <div className="milk-card p-5">
          <p className="text-xs font-semibold text-stone-500">Active Small Groups</p>
          <p className="mt-1 font-serif text-3xl font-bold text-blue-700">{youthStats.smallGroups}</p>
          <p className="mt-1 text-[11px] text-blue-700">Peer mentorship circles</p>
        </div>
        <div className="milk-card p-5">
          <p className="text-xs font-semibold text-stone-500">Youth Camp Signups</p>
          <p className="mt-1 font-serif text-3xl font-bold text-emerald-700">{youthStats.upcomingCampSignups}</p>
          <p className="mt-1 text-[11px] text-emerald-700">Confirmed retreat spots</p>
        </div>
      </div>

      {/* Events & Study Series Grid */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Youth Calendar */}
        <div className="milk-card p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-serif text-xl font-bold text-brand-900">Upcoming Youth Events</h2>
            <Link to="/dashboard/events" className="text-xs font-bold text-orange-700 hover:underline">
              Events calendar →
            </Link>
          </div>

          <div className="space-y-3">
            {youthEvents.map((evt, idx) => (
              <div key={idx} className="rounded-xl border border-stone-200/80 bg-white/80 p-4">
                <div className="flex items-center justify-between">
                  <span className="rounded-md bg-orange-50 px-2 py-0.5 text-[10px] font-bold text-orange-800">
                    {evt.location}
                  </span>
                  <span className="text-[11px] font-semibold text-stone-500">{evt.date}</span>
                </div>
                <h3 className="mt-2 font-serif text-base font-bold text-brand-900">{evt.title}</h3>
                <p className="mt-1 text-xs text-stone-600">{evt.focus}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Bible Study Series */}
        <div className="milk-card p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-serif text-xl font-bold text-brand-900">Current Study Series</h2>
            <span className="rounded-full bg-orange-50 px-2.5 py-0.5 text-xs font-bold text-orange-800">
              Discipleship
            </span>
          </div>

          <div className="space-y-3">
            {studySeries.map((s, idx) => (
              <div key={idx} className="flex items-start justify-between rounded-xl border border-stone-200/80 bg-white/80 p-4 text-xs">
                <div>
                  <span className="font-bold text-orange-700">{s.week}</span>
                  <h3 className="mt-1 font-serif text-sm font-bold text-stone-900">{s.topic}</h3>
                  <p className="mt-1 text-stone-500">Key Scripture: <strong>{s.scripture}</strong></p>
                </div>
                <button
                  onClick={() => {
                    setFeedback(`Discussion guide for ${s.topic} copied!`)
                    setTimeout(() => setFeedback(null), 3000)
                  }}
                  className="rounded-lg bg-stone-100 px-2.5 py-1 font-semibold text-stone-800 hover:bg-stone-200"
                >
                  Guide
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
