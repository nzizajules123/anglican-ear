import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../../features/auth/AuthProvider'
import {
  Video,
  Radio,
  Tv,
  Film,
  Upload,
  CheckCircle,
  ExternalLink,
  Users,
  Play,
  Layers,
  Sparkles,
} from 'lucide-react'

export function MediaDashboard() {
  const { profile } = useAuth()
  const [feedback, setFeedback] = useState<string | null>(null)
  const [liveStreamUrl, setLiveStreamUrl] = useState('https://youtube.com/live/anglican-parish-epiphany')
  const [isLive, setIsLive] = useState(false)

  const avTeamRoster = [
    { role: 'Sound & Audio Engineer', name: 'Lucas Vance', service: '9:00 AM Holy Eucharist', status: 'Confirmed' },
    { role: 'Live Streaming Director', name: 'Samuel Adeyemi', service: '9:00 AM & 11:00 AM', status: 'Confirmed' },
    { role: 'ProPresenter & Slide Operator', name: 'Hannah Montgomery', service: '11:00 AM Family Service', status: 'Confirmed' },
    { role: 'Sanctuary Camera 1 (Pulpit)', name: 'Marcus Brody', service: '9:00 AM Holy Eucharist', status: 'Confirmed' },
  ]

  const mediaVault = [
    { title: 'Holy Eucharist Service - 11th Sunday after Trinity', duration: '1 hr 24 mins', views: 342, date: 'Aug 16, 2026' },
    { title: 'The Unfailing Anchor of Hope (Sermon Video)', duration: '32 mins', views: 512, date: 'Aug 16, 2026' },
    { title: 'Choral Evensong & Stanford in C Recital', duration: '54 mins', views: 680, date: 'Aug 09, 2026' },
  ]

  const slideDecks = [
    { title: 'Sunday Holy Communion Order of Service.pptx', size: '14.2 MB', slides: 48 },
    { title: 'Sunday Hymns & Liturgy Lyric Deck.key', size: '22.0 MB', slides: 62 },
    { title: 'Harvest Thanksgiving Video Bumper.mp4', size: '45.8 MB', slides: 1 },
  ]

  return (
    <section className="space-y-8">
      {/* Banner */}
      <div className="rounded-3xl border border-brand-500/20 bg-gradient-to-r from-brand-900 via-brand-800 to-brand-900 p-6 text-white shadow-xl md:p-8">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-red-500/20 px-3 py-1 text-xs font-bold uppercase tracking-wider text-red-300">
                <Radio size={13} className="animate-pulse" /> Media & AV Broadcast Desk
              </span>
              <span className="inline-flex items-center gap-1 rounded-full bg-white/10 px-2.5 py-0.5 text-xs text-brand-100">
                Audio, Video & Livestream
              </span>
            </div>
            <h1 className="mt-3 font-serif text-3xl font-bold tracking-tight text-white md:text-4xl">
              Digital Sanctuary & Broadcast Operations
            </h1>
            <p className="mt-2 max-w-2xl text-sm text-brand-100">
              Welcome, <span className="font-semibold text-white">{profile?.displayName || 'Media Director'}</span>. Broadcasting worship to homebound parishioners, recording sermon media, and orchestrating sanctuary sound.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => {
                setIsLive(!isLive)
                setFeedback(isLive ? 'Live stream broadcast ended.' : 'Live stream is now LIVE!')
                setTimeout(() => setFeedback(null), 3500)
              }}
              className={`flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-bold shadow-md transition active:scale-95 ${
                isLive ? 'bg-red-600 text-white hover:bg-red-700' : 'bg-emerald-600 text-white hover:bg-emerald-500'
              }`}
            >
              <Radio size={16} />
              {isLive ? 'End Livestream' : 'Go Live Now'}
            </button>
            <Link
              to="/dashboard/sermons"
              className="flex items-center gap-2 rounded-xl bg-white/10 px-4 py-2.5 text-sm font-bold text-white transition hover:bg-white/20 active:scale-95"
            >
              <Film size={16} />
              Sermons Archive
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

      {/* Livestream Operations Card */}
      <div className="milk-card p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-serif text-2xl font-bold text-brand-900">Broadcast Channel Configuration</h2>
            <p className="text-xs text-stone-600">Setup live video stream destinations for Sunday Holy Communion.</p>
          </div>
          <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold ${
            isLive ? 'bg-red-100 text-red-700' : 'bg-stone-100 text-stone-700'
          }`}>
            <span className={`h-2 w-2 rounded-full ${isLive ? 'bg-red-500 animate-ping' : 'bg-stone-400'}`} />
            {isLive ? 'BROADCASTING LIVE' : 'Standby Mode'}
          </span>
        </div>

        <div className="flex flex-wrap gap-3">
          <input
            type="url"
            value={liveStreamUrl}
            onChange={(e) => setLiveStreamUrl(e.target.value)}
            className="field flex-1 text-xs"
            placeholder="YouTube / Vimeo / Facebook live stream stream URL"
          />
          <button
            onClick={() => {
              setFeedback('Livestream URL updated!')
              setTimeout(() => setFeedback(null), 3000)
            }}
            className="button-primary text-xs py-2 px-4"
          >
            Save Stream Link
          </button>
        </div>
      </div>

      {/* Grid: AV Roster & Media Vault */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* AV Team Duty Roster */}
        <div className="milk-card p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-serif text-xl font-bold text-brand-900">Sunday AV Duty Roster</h2>
            <span className="text-xs font-bold text-brand-700">Team Active</span>
          </div>

          <div className="space-y-3">
            {avTeamRoster.map((av, idx) => (
              <div key={idx} className="flex items-center justify-between rounded-xl border border-stone-200/80 bg-white/80 p-3.5 text-xs">
                <div>
                  <p className="font-bold text-stone-900">{av.role}</p>
                  <p className="text-[11px] text-stone-500">Operator: <strong>{av.name}</strong> • {av.service}</p>
                </div>
                <span className="rounded-full bg-emerald-50 px-2.5 py-0.5 font-bold text-emerald-800">
                  {av.status}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Slide Decks & Presentation Assets */}
        <div className="milk-card p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-serif text-xl font-bold text-brand-900">Liturgical Presentation Assets</h2>
            <span className="text-xs font-bold text-stone-500">ProPresenter & Slides</span>
          </div>

          <div className="space-y-3">
            {slideDecks.map((deck, idx) => (
              <div key={idx} className="flex items-center justify-between rounded-xl border border-stone-200/80 bg-white/80 p-3.5 text-xs">
                <div className="flex items-center gap-2.5">
                  <Layers size={18} className="text-brand-700" />
                  <div>
                    <p className="font-bold text-stone-900">{deck.title}</p>
                    <p className="text-[11px] text-stone-500">{deck.size} • {deck.slides} slides</p>
                  </div>
                </div>
                <button
                  onClick={() => {
                    setFeedback(`Downloading ${deck.title}...`)
                    setTimeout(() => setFeedback(null), 2500)
                  }}
                  className="font-bold text-brand-700 hover:underline"
                >
                  Download
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
